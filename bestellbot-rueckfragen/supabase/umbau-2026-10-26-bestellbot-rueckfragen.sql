-- Umbau 26.10.2026: Bestell-Bot mit Rückfragen.
-- Daniel wickelt eine neue Bestellung komplett in Telegram ab: Zuordnung per Knopf, Linie als Zahl,
-- danach füllt die Edge Function bestellbot die Enagic-Formulare aus und schickt alles per Mail an die
-- Sponsor-Adresse. Nie direkt an Enagic, Daniel leitet weiter.
-- Baut auf umbau-2026-10-24-bestellung-ergaenzungen.sql auf. Im SQL-Editor ausführen. Darf mehrfach laufen.

-- ---------- 1. Kurze Bestellnummer, damit zwei gleichzeitige Bestellungen eindeutig sind ----------
create sequence if not exists uk_bestellung_nummer start 1001;
alter table uk_bestellungen add column if not exists nummer bigint;
update uk_bestellungen set nummer = nextval('uk_bestellung_nummer') where nummer is null;
alter table uk_bestellungen alter column nummer set default nextval('uk_bestellung_nummer');
create unique index if not exists uk_bestellungen_nummer on uk_bestellungen (nummer);
-- Wann die Mail mit den Unterlagen an die Sponsor-Adresse ging (Schutz gegen doppeltes Senden)
alter table uk_bestellungen add column if not exists mail_sponsor timestamptz;

-- ---------- 2. Gesprächszustand (nicht im Speicher der Function) ----------
-- Je Bestellung ein Eintrag: an welchem Schritt sie steht und was Daniel schon geantwortet hat.
-- schritt: sponsor | andere_name | andere_id | andere_mail | linie | arbeitet | fertig | ohne_k8 | wartet_id
create table if not exists uk_bestellbot (
  bestellung_id uuid primary key references uk_bestellungen(id) on delete cascade,
  schritt       text not null default 'sponsor',
  werte         jsonb not null default '{}',   -- sponsor, andere {name, id, email}, linie
  frage_msg     bigint,                        -- Telegram-Nachricht mit der letzten Frage (für Antworten per "Antworten")
  fehler        text,
  aktualisiert  timestamptz not null default now()
);
-- Je Chat: welche Bestellung gerade auf eine getippte Antwort wartet
create table if not exists uk_bestellbot_chat (
  chat_id       text primary key,
  bestellung_id uuid references uk_bestellungen(id) on delete set null,
  aktualisiert  timestamptz not null default now()
);
-- Telegram schickt ein Update erneut, wenn die Antwort zu lange dauert. So wird jedes nur einmal verarbeitet.
create table if not exists uk_bestellbot_updates (
  update_id bigint primary key,
  erhalten  timestamptz not null default now()
);
alter table uk_bestellbot         enable row level security;
alter table uk_bestellbot_chat    enable row level security;
alter table uk_bestellbot_updates enable row level security;
-- Keine Policies: nur die Edge Function (service_role) und die Trigger (security definer) greifen zu.

-- Bestehende offene Bestellungen bekommen einen Eintrag, damit der Bot sie kennt
insert into uk_bestellbot (bestellung_id, schritt, werte)
select id, case when daten->>'k8' = 'nein' then 'ohne_k8' when sponsor is not null and linie is not null then 'fertig' else 'sponsor' end,
       case when sponsor is not null then jsonb_build_object('sponsor', sponsor) else '{}'::jsonb end
from uk_bestellungen where status in ('Neu', 'Vertrag fertig', 'An Enagic geschickt')
on conflict (bestellung_id) do nothing;

-- ---------- 3. Einstellungen ----------
-- Mail-Empfänger für die fertigen Unterlagen, je Sponsor. Leer bei andere = wie Daniel.
-- Später auf direktes Senden an Enagic umstellen: hier die Adressen ändern, nicht im Code.
insert into uk_einstellungen (name, wert) values
  ('mail_enagic_daniel', 'XXX'),                              -- Daniels Hotmail-Adresse, trägt das Hauptsystem ein
  ('mail_enagic_gmbh', 'ursprungskraft.gmbh@gmail.com'),
  ('mail_enagic_jasmin', ''),                                 -- Jasmin hat noch keine Enagic-ID und keine Adresse
  ('mail_enagic_andere', ''),                                 -- leer = an Daniels Adresse, Daniel leitet weiter
  ('mail_enagic_ziel', 'goc.eu@enagic.com'),                  -- steht nur im Text, es wird nie direkt dorthin geschickt
  ('bestellbot_testmail', '')                                 -- gesetzt = ALLE Bot-Mails gehen nur an diese Adresse (Test)
on conflict (name) do nothing;

-- Geheimnis für den Telegram-Webhook (secret_token). Wird einmal erzeugt und liegt im Tresor.
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'tg_webhook_bestellbot') then
    perform vault.create_secret(encode(gen_random_bytes(24), 'hex'), 'tg_webhook_bestellbot', 'secret_token für den Webhook des Bestell-Bots');
  end if;
end $$;

-- Die Edge Function liest Bot-Schlüssel und Webhook-Geheimnis hierüber, niemand muss sie abtippen.
create or replace function uk_bestellbot_geheim() returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'token',  (select decrypted_secret from vault.decrypted_secrets where name = 'tg_token_bestellung'),
    'secret', (select decrypted_secret from vault.decrypted_secrets where name = 'tg_webhook_bestellbot'));
$$;
revoke all on function uk_bestellbot_geheim() from public, anon, authenticated;
grant execute on function uk_bestellbot_geheim() to service_role;

-- ---------- 4. Meldung bei neuer Bestellung ----------
-- Daniel bekommt die Meldung über den Bestell-Bot mit Knöpfen (sobald bestellbot_daniel = 'ja').
-- Jasmin bekommt sie wie bisher zur Info, ohne Knöpfe. Die Rückfragen gehen nur an Daniel.
create or replace function uk_bestellung_melden() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  d jsonb := new.daten;
  v_kopf text;
  v_daniel text;
  v_jasmin text;
  v_markup jsonb;
  v_schritt text;
  v_jasmin_id text;
  v_bestell text;
  v_token text;
  v_chat text;
  v_an boolean;
  v_zusatz text;
  v_text text;
  p record;
begin
  v_zusatz := concat_ws(', ',
    case when d->>'k8' is distinct from 'nein' then 'LeveLuk K8' end,
    case when d->>'zusatz_emguarde' = 'on' then 'emGuarde Go' end,
    case when d->>'zusatz_anespa' = 'on' then 'ANESPA DX' end);
  v_kopf := '🛒 Neue Bestellung #' || new.nummer || E'\n'
    || 'Eingang ' || to_char(new.erstellt at time zone 'Europe/Zurich', 'DD.MM.YYYY, HH24:MI') || ' Uhr' || E'\n\n'
    || coalesce(d->>'vorname', '') || ' ' || coalesce(d->>'nachname', '') || coalesce(' (' || nullif(d->>'firma', '') || ')', '') || E'\n'
    || coalesce(d->>'plz', '') || ' ' || coalesce(d->>'ort', '') || ', ' || coalesce(d->>'land', '') || E'\n'
    || 'Produkte: ' || coalesce(nullif(v_zusatz, ''), 'LeveLuk K8') || case when d->>'k8' = 'nein' then ' (OHNE K8)' else '' end || E'\n'
    || 'Zahlung: ' || case when d->>'zahlung' = 'raten' then 'Raten, ' || coalesce(d->>'raten_anzahl', '') || ' Monate' else 'Überweisung' end || E'\n'
    || 'Als: ' || coalesce(d->>'als', 'Verbraucher') || E'\n'
    || 'Link: ' || coalesce(nullif(new.von, ''), 'ohne von');

  select coalesce((wert::jsonb)->>'id', '') into v_jasmin_id from uk_einstellungen where name = 'sponsor_jasmin';
  v_markup := null;
  if d->>'k8' = 'nein' then
    v_schritt := 'ohne_k8';
    v_daniel := v_kopf || E'\n\nOhne K8 bestellt, bitte persönlich klären.';
  elsif new.sponsor = 'jasmin' and coalesce(v_jasmin_id, '') = '' then
    v_schritt := 'wartet_id';
    v_daniel := v_kopf || E'\n\nLäuft über Jasmin (kam über ihren Link). Für Jasmin ist noch keine Sponsor-ID hinterlegt, deshalb mache ich noch keinen Vertrag. Du kannst die Bestellung auch anders zuordnen:';
    v_markup := jsonb_build_object('inline_keyboard', jsonb_build_array(
      jsonb_build_array(jsonb_build_object('text', 'Daniel', 'callback_data', 's|' || new.id || '|daniel'),
                        jsonb_build_object('text', 'Ursprungskraft GmbH', 'callback_data', 's|' || new.id || '|gmbh')),
      jsonb_build_array(jsonb_build_object('text', 'Jemand anderes', 'callback_data', 's|' || new.id || '|andere'))));
  elsif new.sponsor = 'jasmin' then
    v_schritt := 'linie';
    v_daniel := v_kopf || E'\n\nLäuft über Jasmin (kam über ihren Link).\nWelche Linie? Bitte die Zahl schicken.';
  else
    v_schritt := 'sponsor';
    v_daniel := v_kopf || E'\n\nÜber wen läuft der Verkauf?';
    v_markup := jsonb_build_object('inline_keyboard', jsonb_build_array(
      jsonb_build_array(jsonb_build_object('text', 'Daniel', 'callback_data', 's|' || new.id || '|daniel'),
                        jsonb_build_object('text', 'Ursprungskraft GmbH', 'callback_data', 's|' || new.id || '|gmbh')),
      jsonb_build_array(jsonb_build_object('text', 'Jasmin', 'callback_data', 's|' || new.id || '|jasmin'),
                        jsonb_build_object('text', 'Jemand anderes', 'callback_data', 's|' || new.id || '|andere'))));
  end if;
  v_jasmin := v_kopf || E'\n\nZur Info. Daniel bekommt die Rückfragen im Bestell-Bot.';

  insert into uk_bestellbot (bestellung_id, schritt, werte)
  values (new.id, v_schritt, case when new.sponsor is not null then jsonb_build_object('sponsor', new.sponsor) else '{}'::jsonb end)
  on conflict (bestellung_id) do nothing;

  select decrypted_secret into v_bestell from vault.decrypted_secrets where name = 'tg_token_bestellung';
  for p in select * from (values ('jasmin', 'tg_token_jasmin', 'tg_chat_jasmin'), ('daniel', 'tg_token_daniel', 'tg_chat_daniel')) x(an, t, c) loop
    select decrypted_secret into v_token from vault.decrypted_secrets where name = p.t;
    select wert into v_chat from uk_einstellungen where name = p.c;
    select coalesce((select wert = 'ja' from uk_einstellungen where name = 'bestellbot_' || p.an), false) into v_an;
    if v_an and v_bestell is not null then v_token := v_bestell; end if;
    if v_token is null or v_chat is null then continue; end if;
    if p.an = 'daniel' and v_an and v_bestell is not null then
      v_text := v_daniel;
      -- Wartet die Bestellung direkt auf eine getippte Zahl, merkt sich der Chat, für welche Bestellung
      if v_schritt = 'linie' then
        insert into uk_bestellbot_chat (chat_id, bestellung_id, aktualisiert) values (v_chat, new.id, now())
        on conflict (chat_id) do update set bestellung_id = excluded.bestellung_id, aktualisiert = now();
      end if;
    elsif p.an = 'daniel' then
      -- Daniel hat den Bestell-Bot noch nicht eingeschaltet: Meldung wie bisher über seinen Assistenten
      v_text := v_kopf || E'\n\nBitte im Dashboard unter Bestellungen zuordnen. Im Bestell-Bot geht das direkt, sobald er eingeschaltet ist.';
    else
      v_text := v_jasmin;
    end if;
    perform net.http_post(url := 'https://api.telegram.org/bot' || v_token || '/sendMessage',
      body := jsonb_build_object('chat_id', v_chat, 'text', v_text, 'disable_web_page_preview', true)
              || case when p.an = 'daniel' and v_an and v_markup is not null then jsonb_build_object('reply_markup', v_markup) else '{}'::jsonb end,
      headers := '{"Content-Type": "application/json"}'::jsonb);
  end loop;
  return new;
end $$;
-- Trigger gibt es schon (umbau-2026-10-19g), hier nur sicherstellen
drop trigger if exists uk_bestellung_melden on uk_bestellungen;
create trigger uk_bestellung_melden after insert on uk_bestellungen for each row execute function uk_bestellung_melden();

-- ---------- 5. Webhook beim Bestell-Bot setzen ----------
-- Als eigene Funktion, damit man sie nach dem Deploy der Edge Function einfach aufruft:
--   select uk_bestellbot_webhook_setzen();
-- Danach prüfen: select status_code, content::text from net._http_response order by id desc limit 1;
create or replace function uk_bestellbot_webhook_setzen() returns bigint
language plpgsql security definer set search_path = public as $$
declare g jsonb := uk_bestellbot_geheim();
begin
  if g->>'token' is null then raise exception 'tg_token_bestellung fehlt im Tresor'; end if;
  return net.http_post(url := 'https://api.telegram.org/bot' || (g->>'token') || '/setWebhook',
    body := jsonb_build_object(
      'url', 'https://ngcbmpuqcqbelfoelwby.supabase.co/functions/v1/bestellbot',
      'secret_token', g->>'secret',
      'allowed_updates', jsonb_build_array('message', 'callback_query'),
      'drop_pending_updates', true),
    headers := '{"Content-Type": "application/json"}'::jsonb);
end $$;
revoke all on function uk_bestellbot_webhook_setzen() from public, anon, authenticated;

-- Alte verarbeitete Updates aufräumen (älter als 7 Tage), damit die Tabelle klein bleibt
delete from uk_bestellbot_updates where erhalten < now() - interval '7 days';

select (select count(*) from uk_bestellbot) as bot_eintraege,
       (select max(nummer) from uk_bestellungen) as letzte_nummer,
       (select count(*) from vault.secrets where name = 'tg_webhook_bestellbot') as webhook_geheimnis;

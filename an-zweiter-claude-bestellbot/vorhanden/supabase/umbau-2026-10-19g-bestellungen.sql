-- Umbau 19.10.2026 (g): Bestellstrecke LeveLuk K8.
-- Kunde bestellt über die versteckte Seite /bestellen/. Daniel bekommt sofort Telegram und entscheidet
-- im Dashboard: wem das Gerät zugeordnet wird (Daniel, Ursprungskraft GmbH, Jasmin) und in welche Linie.
-- Erst danach werden die Enagic-Formulare ausgefüllt (im Dashboard, im Browser).
-- Im SQL-Editor ausführen. Darf mehrfach laufen.

create table if not exists uk_bestellungen (
  id          uuid primary key default gen_random_uuid(),
  mandant_id  uuid not null default coalesce(uk_mein_mandant(), 'cece475c-736d-457a-ade1-e16b1dc2938e'::uuid) references uk_mandanten(id),
  erstellt    timestamptz not null default now(),
  status      text not null default 'Neu' check (status in ('Neu', 'Vertrag fertig', 'An Enagic geschickt', 'Storniert')),
  von         text,            -- Kürzel aus dem Link (?von=...)
  daten       jsonb not null,  -- alles, was der Kunde eingegeben hat
  dateien     jsonb not null default '{}',  -- Pfade im Speicher: unterschrift, ausweis_vorne, ausweis_hinten
  sponsor     text,            -- daniel | gmbh | jasmin, entscheidet Daniel
  linie       text,            -- "Neukunde in [ ] A", entscheidet Daniel
  angaben     jsonb not null default '{}',  -- Preise, Raten, Anzahlung, von Daniel geprüft
  pdfs        jsonb not null default '[]',  -- fertige Formulare im Speicher
  kunde_id    uuid references uk_kunden(id) on delete set null,
  notiz       text
);
alter table uk_bestellungen enable row level security;
drop policy if exists "mein Mandant" on uk_bestellungen;
create policy "mein Mandant" on uk_bestellungen for all to authenticated
  using (mandant_id = uk_mein_mandant()) with check (mandant_id = uk_mein_mandant());
grant select, insert, update, delete on uk_bestellungen to authenticated;

-- Speicher für Unterschriften, Ausweise und fertige Verträge. Nicht öffentlich.
-- Die Bestellseite (ohne Anmeldung) darf nur in den Ordner eingang/ hochladen, nichts lesen.
insert into storage.buckets (id, name, public) values ('bestellungen', 'bestellungen', false) on conflict (id) do nothing;
drop policy if exists "bestellung hochladen" on storage.objects;
drop policy if exists "bestellungen lesen" on storage.objects;
drop policy if exists "bestellungen schreiben" on storage.objects;
drop policy if exists "bestellungen loeschen" on storage.objects;
create policy "bestellung hochladen" on storage.objects for insert to anon
  with check (bucket_id = 'bestellungen' and (storage.foldername(name))[1] = 'eingang');
create policy "bestellungen lesen" on storage.objects for select to authenticated using (bucket_id = 'bestellungen');
create policy "bestellungen schreiben" on storage.objects for insert to authenticated with check (bucket_id = 'bestellungen');
create policy "bestellungen loeschen" on storage.objects for delete to authenticated using (bucket_id = 'bestellungen');

-- Bestellung anlegen (von der Seite ohne Anmeldung). Legt auch den Kunden an.
create or replace function uk_bestellung(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  d jsonb := p->'daten';
  v_id uuid;
  v_kunde uuid;
  v_partner uuid;
begin
  if uk_txt(d->>'nachname', 80) is null or uk_txt(d->>'vorname', 80) is null or coalesce(d->>'email', '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     or uk_txt(d->>'strasse', 120) is null or uk_txt(d->>'plz', 12) is null or uk_txt(d->>'ort', 80) is null or uk_txt(d->>'geburtsdatum', 12) is null then
    raise exception 'Angaben unvollständig';
  end if;
  if coalesce(p->'dateien'->>'unterschrift', '') !~ '^eingang/' then raise exception 'Unterschrift fehlt'; end if;
  select id into v_partner from uk_partner where kurz = lower(p->>'von') and aktiv;
  insert into uk_kunden (vorname, nachname, email, telefon, strasse, plz, ort, land, status, partner_id, kaufdatum, produkte, notiz)
  values (uk_txt(d->>'vorname', 80), uk_txt(d->>'nachname', 80), uk_txt(d->>'email', 160), coalesce(uk_txt(d->>'handy', 40), uk_txt(d->>'telefon', 40)),
          uk_txt(d->>'strasse', 120), uk_txt(d->>'plz', 12), uk_txt(d->>'ort', 80), coalesce(uk_txt(d->>'land_kurz', 10), 'CH'),
          'Bestellt', v_partner, (now() at time zone 'Europe/Zurich')::date, array['K8'], 'Bestellung über die Bestellseite')
  returning id into v_kunde;
  insert into uk_bestellungen (von, daten, dateien, kunde_id)
  values (lower(uk_txt(p->>'von', 30)), d, coalesce(p->'dateien', '{}'::jsonb), v_kunde)
  returning id into v_id;
  return v_id;
end $$;
revoke all on function uk_bestellung(jsonb) from public;
grant execute on function uk_bestellung(jsonb) to anon, authenticated;

-- Sofort Telegram an Daniel und Jasmin, über denselben Weg wie der Tagesplan (Schlüssel im Tresor).
create or replace function uk_bestellung_melden() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  d jsonb := new.daten;
  v_text text;
  p record;
  v_token text;
  v_chat text;
begin
  v_text := '🛒 Neue Bestellung LeveLuk K8' || E'\n'
    || coalesce(d->>'vorname', '') || ' ' || coalesce(d->>'nachname', '') || ', ' || coalesce(d->>'plz', '') || ' ' || coalesce(d->>'ort', '') || ', ' || coalesce(d->>'land', '') || E'\n'
    || 'Als ' || coalesce(d->>'als', 'Verbraucher') || ' · ' || case when d->>'zahlung' = 'raten' then 'Ratenzahlung' else 'Überweisung' end
    || coalesce(E'\nÜber den Link von: ' || new.von, '')
    || E'\n\nBitte im Dashboard unter Bestellungen festlegen:\n1. Wem wird das Gerät zugeordnet? (Daniel, Ursprungskraft GmbH oder Jasmin)\n2. Neukunde in welcher Linie?\nDanach wird der Vertrag fertig gemacht.';
  for p in select * from (values ('tg_token_jasmin', 'tg_chat_jasmin'), ('tg_token_daniel', 'tg_chat_daniel')) x(t, c) loop
    select decrypted_secret into v_token from vault.decrypted_secrets where name = p.t;
    select wert into v_chat from uk_einstellungen where name = p.c;
    if v_token is not null and v_chat is not null then
      perform net.http_post(url := 'https://api.telegram.org/bot' || v_token || '/sendMessage',
        body := jsonb_build_object('chat_id', v_chat, 'text', v_text, 'disable_web_page_preview', true),
        headers := '{"Content-Type": "application/json"}'::jsonb);
    end if;
  end loop;
  return new;
end $$;
drop trigger if exists uk_bestellung_melden on uk_bestellungen;
create trigger uk_bestellung_melden after insert on uk_bestellungen for each row execute function uk_bestellung_melden();

-- Sponsoren für das Formular (Jasmins ID folgt)
insert into uk_einstellungen (name, wert) values
  ('sponsor_daniel', '{"name": "Daniel Zürcher", "id": "21000078463", "email": "info@ursprungskraft.net"}'),
  ('sponsor_gmbh', '{"name": "Ursprungskraft GmbH", "id": "21000127564", "email": "ursprungskraft.gmbh@gmail.com"}'),
  ('sponsor_jasmin', '{"name": "Jasmin Groth", "id": "", "email": "info@jasmin-groth.de"}')
on conflict (name) do nothing;
-- Lesbar für das Dashboard (nur die Sponsor-Zeilen, nie die Chat-Kennungen)
create or replace function uk_sponsoren() returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(replace(name, 'sponsor_', ''), wert::jsonb), '{}'::jsonb) from uk_einstellungen where name like 'sponsor_%';
$$;
revoke all on function uk_sponsoren() from public, anon;
grant execute on function uk_sponsoren() to authenticated;

select count(*) as bestellungen from uk_bestellungen;

-- 11.11.2026: Baukasten für Partnerseiten (Paket "Eigene Seite": Landingpage in drei Fassungen plus personalisiertes E-Book).
--
-- So funktioniert es:
--   Es gibt drei feste Seiten (website/p/neutral.html, sport.html, gesundheit.html). Netlify leitet /p/<adresse>/<fassung>
--   per _redirects darauf um. Die Seite holt beim Aufruf die Angaben des Partners über uk_seite_oeffentlich().
--   Keine Datei und kein Upload je Partner, also kein Netlify-Guthaben je Partner.
--   Der Partner richtet seine Seiten im Partnerportal ein (Ansicht "Meine Seiten"), angemeldet wie bisher mit dem
--   Sitzungsschlüssel aus uk_partner_sitzungen. Bewusst NICHT über Supabase Auth (Begründung oben in
--   umbau-2026-11-11-backoffice-sportler.sql: ein Auth-Zugang wäre "authenticated" und käme an alle Leads).
--   Leads laufen unverändert über die Edge Function partner-lead mit von = kurz des Partners (uk_partner.kurz).
--   Die Adresse der Seite darf sich ändern, kurz nie. So bleibt jeder Lead für immer beim Partner, über den er kam.
--
-- Bezahlen: nur die Schnittstelle. uk_partner_seiten_paket.gebucht_bis (Datum) entscheidet, ob die Seiten laufen.
--   Stripe setzt das später über uk_seiten_paket_setzen() (nur mit dem Dienstschlüssel oder im SQL-Editor).
--
-- Die Basis-Adresse der Seiten (später eine neutrale Domain) steht an EINER Stelle: uk_einstellungen, name = 'seiten_basis'.
--   Portal und E-Book lesen sie von dort. Die Seiten selbst brauchen sie nicht (sie laufen unter jeder Domain).
--
-- Darf mehrfach laufen. Voraussetzung: umbau-2026-10-31b-partnerportal.sql und umbau-2026-11-06-partner-leads.sql.

-- ---------------------------------------------------------------------------------------------------------------
-- 0. Einstellung: Basis-Adresse. Später nur hier die neutrale Domain eintragen, zum Beispiel:
--    update uk_einstellungen set wert = 'https://[FEHLT: neutrale Domain]' where name = 'seiten_basis';
-- ---------------------------------------------------------------------------------------------------------------
insert into uk_einstellungen (name, wert)
select 'seiten_basis', 'https://mein.ursprungskraft.net'
where not exists (select 1 from uk_einstellungen where name = 'seiten_basis');

-- ---------------------------------------------------------------------------------------------------------------
-- 1. Tabellen
-- ---------------------------------------------------------------------------------------------------------------

-- Die Angaben des Partners für seine Seiten. Eine Zeile je Partner, gilt für alle Fassungen.
create table if not exists uk_partner_seiten (
  partner_id     uuid primary key references uk_partner(id) on delete cascade,
  adresse        text not null,                       -- Teil der Adresse: /p/<adresse>/<fassung>
  vorname        text not null,
  nachname       text not null,
  rolle          text,                                -- zum Beispiel "Personal Trainer", "Heilpraktikerin"
  satz           text,                                -- eine Zeile über sich
  insta          text,                                -- Instagram-Name ohne @
  foto           text,                                -- öffentliche Adresse im Speicher (Bucket partner-seiten)
  lead_telefon   text,                                -- nur für Leads an ihn, nicht auf der Seite
  lead_email     text,                                -- nur für Leads an ihn, nicht auf der Seite
  kontakt_zeigen boolean not null default false,      -- true: Telefon und E-Mail stehen auf der Seite und im E-Book
  fassungen      text[] not null default '{}',        -- neutral, sport, gesundheit
  beispiel       boolean not null default false,      -- erscheint im Portal als Beispiel (Daniel, Jasmin)
  erstellt       timestamptz not null default now(),
  geaendert      timestamptz not null default now()
);
create unique index if not exists uk_partner_seiten_adresse on uk_partner_seiten (adresse);
alter table uk_partner_seiten drop constraint if exists uk_partner_seiten_fassungen_check;
alter table uk_partner_seiten add constraint uk_partner_seiten_fassungen_check
  check (fassungen <@ array['neutral', 'sport', 'gesundheit']::text[]);
alter table uk_partner_seiten drop constraint if exists uk_partner_seiten_adresse_check;
alter table uk_partner_seiten add constraint uk_partner_seiten_adresse_check
  check (adresse ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(adresse) between 3 and 40);

-- Frühere Adressen. Wer einen alten Link öffnet, landet trotzdem beim richtigen Partner.
create table if not exists uk_partner_seiten_alt (
  adresse    text primary key,
  partner_id uuid not null references uk_partner(id) on delete cascade,
  bis        timestamptz not null default now()
);

-- Schnittstelle Bezahlen. gebucht_bis >= heute: Seiten laufen. Leer oder vorbei: Seiten zeigen "nicht verfügbar",
-- im Portal steht wieder die Vorschau mit "Paket buchen".
create table if not exists uk_partner_seiten_paket (
  partner_id          uuid primary key references uk_partner(id) on delete cascade,
  gebucht_bis         date,
  fassungen           text[],          -- null = alle drei Fassungen erlaubt, sonst nur diese
  einrichtung_bezahlt timestamptz,     -- einmalige Einrichtung bezahlt am
  zahlung_ref         text,            -- zum Beispiel Kennung des Stripe-Abos (Hosting monatlich, einmal je Partner)
  notiz               text,
  geaendert           timestamptz not null default now()
);
alter table uk_partner_seiten_paket drop constraint if exists uk_partner_seiten_paket_fassungen_check;
alter table uk_partner_seiten_paket add constraint uk_partner_seiten_paket_fassungen_check
  check (fassungen is null or fassungen <@ array['neutral', 'sport', 'gesundheit']::text[]);

-- Kein direkter Zugriff von der Seite. Alles läuft über die Funktionen unten.
alter table uk_partner_seiten enable row level security;
alter table uk_partner_seiten_alt enable row level security;
alter table uk_partner_seiten_paket enable row level security;

-- ---------------------------------------------------------------------------------------------------------------
-- 2. Hilfen (nicht von außen aufrufbar)
-- ---------------------------------------------------------------------------------------------------------------

-- Adresse aus Vor- und Nachname: kleine Buchstaben, Ziffern, Bindestrich
create or replace function uk_seiten_adresse_bauen(p_text text) returns text
language sql immutable set search_path = public as $$
  select btrim(left(regexp_replace(regexp_replace(
    translate(replace(replace(replace(replace(lower(coalesce(p_text, '')), 'ä', 'ae'), 'ö', 'oe'), 'ü', 'ue'), 'ß', 'ss'),
              'éèêàáâçñ _.', 'eeeaaacn---'),
    '[^a-z0-9-]', '', 'g'), '-{2,}', '-', 'g'), 40), '-')
$$;

-- Diese Wörter sind Teil der Adressen oder Ordner und dürfen keine Partneradresse sein
create or replace function uk_seiten_adresse_reserviert(p_adresse text) returns boolean
language sql immutable as $$
  select p_adresse = any (array['neutral', 'sport', 'gesundheit', 'e-book', 'ebook', 'vorschau', 'bilder', 'beispiel',
    'seiten', 'index', 'admin', 'impressum', 'datenschutz', 'test', 'partner', 'portal'])
$$;

-- Ist die Adresse frei für diesen Partner? Auch frühere Adressen anderer Partner zählen als vergeben.
create or replace function uk_seiten_adresse_frei(p_adresse text, p_partner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (select 1 from uk_partner_seiten where adresse = p_adresse and partner_id <> p_partner)
     and not exists (select 1 from uk_partner_seiten_alt where adresse = p_adresse and partner_id <> p_partner)
$$;

-- Prüfen: 'ok', 'form' (Zeichen oder Länge), 'reserviert' oder 'vergeben'
create or replace function uk_seiten_adresse_status(p_adresse text, p_partner uuid) returns text
language sql stable security definer set search_path = public as $$
  select case
    when p_adresse is null or p_adresse !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(p_adresse) not between 3 and 40 then 'form'
    when uk_seiten_adresse_reserviert(p_adresse) then 'reserviert'
    when not uk_seiten_adresse_frei(p_adresse, p_partner) then 'vergeben'
    else 'ok' end
$$;

-- Vorschlag vorname-nachname, bei Bedarf mit Zahl dahinter
create or replace function uk_seiten_vorschlag(p_partner uuid) returns text
language plpgsql stable security definer set search_path = public as $$
declare v_basis text; v text; n int := 1;
begin
  select uk_seiten_adresse_bauen(vorname || '-' || nachname) into v_basis from uk_partner where id = p_partner;
  if v_basis is null or length(v_basis) < 3 then v_basis := 'seite'; end if;
  v_basis := rtrim(left(v_basis, 36), '-');
  v := v_basis;
  while uk_seiten_adresse_status(v, p_partner) <> 'ok' loop n := n + 1; v := v_basis || '-' || n; end loop;
  return v;
end $$;

-- Paket gebucht? Stichtag ist der Kalendertag in Berlin.
create or replace function uk_seiten_gebucht(p_partner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select gebucht_bis >= (now() at time zone 'Europe/Berlin')::date
                   from uk_partner_seiten_paket where partner_id = p_partner), false)
$$;

-- Welche Fassungen das Paket erlaubt
create or replace function uk_seiten_erlaubt(p_partner uuid) returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce((select fassungen from uk_partner_seiten_paket where partner_id = p_partner),
                  array['neutral', 'sport', 'gesundheit']::text[])
$$;

create or replace function uk_seiten_basis() returns text
language sql stable security definer set search_path = public as $$
  select rtrim(coalesce((select nullif(btrim(wert), '') from uk_einstellungen where name = 'seiten_basis'),
                        'https://mein.ursprungskraft.net'), '/')
$$;

revoke all on function uk_seiten_adresse_bauen(text), uk_seiten_adresse_reserviert(text), uk_seiten_adresse_frei(text, uuid),
  uk_seiten_adresse_status(text, uuid), uk_seiten_vorschlag(uuid), uk_seiten_gebucht(uuid), uk_seiten_erlaubt(uuid),
  uk_seiten_basis() from public, anon, authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- 3. Öffentlich: was die Seite beim Aufruf bekommt
-- Nur Vorname, Nachname, Foto, Rolle, Satz, Instagram. Telefon und E-Mail nur, wenn der Partner es ausdrücklich
-- freigegeben hat (kontakt_zeigen). Nie die Telefonnummer oder E-Mail aus uk_partner.
-- "von" ist das Kürzel für das Lead-Formular (partner-lead), "fassung" die Fassung, die gezeigt werden soll:
-- Hat der Partner die angefragte Fassung nicht (mehr), kommt seine erste Fassung, und die Seite leitet dorthin um.
-- Alte Adresse: "adresse" ist die aktuelle, die Seite schreibt sie in die Adresszeile.
-- Antwort null: gibt es nicht, nicht freigegeben oder nicht gebucht.
-- ---------------------------------------------------------------------------------------------------------------
create or replace function uk_seite_oeffentlich(p_adresse text, p_fassung text default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_adresse text := lower(btrim(coalesce(p_adresse, '')));
  v_partner uuid;
  s uk_partner_seiten;
  v_kurz text;
  v_fassungen text[];
begin
  if v_adresse !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(v_adresse) > 40 then return null; end if;
  select partner_id into v_partner from uk_partner_seiten where adresse = v_adresse;
  if v_partner is null then select partner_id into v_partner from uk_partner_seiten_alt where adresse = v_adresse; end if;
  if v_partner is null then return null; end if;

  select * into s from uk_partner_seiten where partner_id = v_partner;
  select kurz into v_kurz from uk_partner where id = v_partner and status = 'freigegeben';
  if s.partner_id is null or v_kurz is null or not uk_seiten_gebucht(v_partner) then return null; end if;

  -- Reihenfolge immer neutral, sport, gesundheit
  select coalesce(array_agg(f order by array_position(array['neutral', 'sport', 'gesundheit'], f)), '{}') into v_fassungen
    from unnest(s.fassungen) f where f = any (uk_seiten_erlaubt(v_partner));
  if cardinality(v_fassungen) = 0 then return null; end if;

  return jsonb_build_object(
    'von', v_kurz,
    'adresse', s.adresse,
    'fassung', case when p_fassung = any (v_fassungen) then p_fassung else v_fassungen[1] end,
    'fassungen', to_jsonb(v_fassungen),
    'vorname', s.vorname,
    'nachname', s.nachname,
    'rolle', s.rolle,
    'satz', s.satz,
    'insta', s.insta,
    'foto', s.foto,
    'telefon', case when s.kontakt_zeigen then s.lead_telefon end,
    'email', case when s.kontakt_zeigen then s.lead_email end,
    'basis', uk_seiten_basis());
end $$;
revoke all on function uk_seite_oeffentlich(text, text) from public;
grant execute on function uk_seite_oeffentlich(text, text) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------------------------------------------
-- 4. Partnerportal (mit Sitzungsschlüssel)
-- ---------------------------------------------------------------------------------------------------------------

-- Alles für die Ansicht "Meine Seiten": gebucht ja oder nein, eigene Angaben, Vorschlag für die Adresse,
-- Beispiele (Daniel, Jasmin) und wie viele Leads je Fassung kamen.
create or replace function uk_partner_seiten_daten(p_sitzung text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v uuid := uk_partner_von_sitzung(p_sitzung); p uk_partner; s uk_partner_seiten; k uk_partner_seiten_paket;
begin
  if v is null then return null; end if;
  select * into p from uk_partner where id = v;
  select * into s from uk_partner_seiten where partner_id = v;
  select * into k from uk_partner_seiten_paket where partner_id = v;
  return jsonb_build_object(
    'basis', uk_seiten_basis(),
    'gebucht', uk_seiten_gebucht(v),
    'gebucht_bis', k.gebucht_bis,
    'erlaubt', to_jsonb(uk_seiten_erlaubt(v)),
    'vorschlag', coalesce(s.adresse, uk_seiten_vorschlag(v)),
    'vorgabe', jsonb_build_object('vorname', p.vorname, 'nachname', p.nachname, 'email', p.email, 'telefon', p.telefon),
    'seite', case when s.partner_id is null then null else jsonb_build_object(
      'adresse', s.adresse, 'vorname', s.vorname, 'nachname', s.nachname, 'rolle', s.rolle, 'satz', s.satz,
      'insta', s.insta, 'foto', s.foto, 'lead_telefon', s.lead_telefon, 'lead_email', s.lead_email,
      'kontakt_zeigen', s.kontakt_zeigen, 'fassungen', to_jsonb(s.fassungen), 'geaendert', s.geaendert) end,
    'beispiele', coalesce((select jsonb_agg(jsonb_build_object('adresse', b.adresse, 'fassung', b.fassungen[1],
        'fassungen', to_jsonb(b.fassungen), 'vorname', b.vorname, 'nachname', b.nachname, 'rolle', b.rolle) order by b.erstellt)
      from uk_partner_seiten b where b.beispiel and cardinality(b.fassungen) > 0 and uk_seiten_gebucht(b.partner_id)), '[]'::jsonb),
    -- Nur Zahlen, keine Namen. Wer die Leads sieht und anruft, bleibt wie bisher geregelt.
    'anmeldungen', (select jsonb_build_object(
        'gesamt', count(*),
        'neutral', count(*) filter (where l.antworten->>'fassung' = 'neutral'),
        'sport', count(*) filter (where l.antworten->>'fassung' = 'sport'),
        'gesundheit', count(*) filter (where l.antworten->>'fassung' = 'gesundheit'),
        'woche', count(*) filter (where l.erstellt > now() - interval '7 days'))
      from uk_partner_leads l where (l.partner_id = v or l.herkunft = p.kurz) and l.antworten ? 'fassung'));
end $$;

-- Adresse live im Formular prüfen: 'ok', 'form', 'reserviert', 'vergeben'
create or replace function uk_partner_seiten_adresse(p_sitzung text, p_adresse text) returns text
language plpgsql stable security definer set search_path = public as $$
declare v uuid := uk_partner_von_sitzung(p_sitzung);
begin
  if v is null then return null; end if;
  return uk_seiten_adresse_status(lower(btrim(coalesce(p_adresse, ''))), v);
end $$;

-- Formular speichern. Antwort {"ok": true, "adresse": ...} oder {"fehler": "..."}.
-- Fehler: nicht_gebucht, name, adresse_form, adresse_reserviert, adresse_vergeben, fassungen, telefon, email, insta
-- Das Foto kommt getrennt über die Edge Function partner-foto.
create or replace function uk_partner_seiten_speichern(p_sitzung text, p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v uuid := uk_partner_von_sitzung(p_sitzung);
  v_alt text;
  v_adresse text := lower(btrim(coalesce(p->>'adresse', '')));
  v_status text;
  v_vor text := uk_txt(p->>'vorname', 60);
  v_nach text := uk_txt(p->>'nachname', 60);
  v_tel text := uk_txt(p->>'lead_telefon', 40);
  v_email text := lower(uk_txt(p->>'lead_email', 160));
  v_insta text := nullif(regexp_replace(coalesce(p->>'insta', ''), '^\s*(https?://)?(www\.)?(instagram\.com/)?@?|[/?].*$|\s', '', 'g'), '');
  v_fassungen text[];
begin
  if v is null then return '{"fehler": "sitzung"}'; end if;
  if not uk_seiten_gebucht(v) then return '{"fehler": "nicht_gebucht"}'; end if;
  if v_vor is null or v_nach is null then return '{"fehler": "name"}'; end if;
  v_status := uk_seiten_adresse_status(v_adresse, v);
  if v_status <> 'ok' then return jsonb_build_object('fehler', 'adresse_' || v_status); end if;
  select coalesce(array_agg(distinct f), '{}') into v_fassungen
    from jsonb_array_elements_text(coalesce(p->'fassungen', '[]'::jsonb)) f
   where f = any (uk_seiten_erlaubt(v));
  if cardinality(v_fassungen) = 0 then return '{"fehler": "fassungen"}'; end if;
  if length(regexp_replace(coalesce(v_tel, ''), '\D', '', 'g')) < 6 then return '{"fehler": "telefon"}'; end if;
  if v_email is null or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return '{"fehler": "email"}'; end if;
  if v_insta is not null and v_insta !~ '^[A-Za-z0-9._]{1,30}$' then return '{"fehler": "insta"}'; end if;

  select adresse into v_alt from uk_partner_seiten where partner_id = v;
  -- Adresse geändert: die alte bleibt als Weiterleitung beim Partner
  if v_alt is not null and v_alt <> v_adresse then
    insert into uk_partner_seiten_alt (adresse, partner_id) values (v_alt, v)
    on conflict (adresse) do update set partner_id = excluded.partner_id, bis = now();
  end if;
  delete from uk_partner_seiten_alt where adresse = v_adresse and partner_id = v;

  insert into uk_partner_seiten (partner_id, adresse, vorname, nachname, rolle, satz, insta, lead_telefon, lead_email, kontakt_zeigen, fassungen)
  values (v, v_adresse, v_vor, v_nach, uk_txt(p->>'rolle', 60), uk_txt(p->>'satz', 160), v_insta, v_tel, v_email,
          coalesce((p->>'kontakt_zeigen')::boolean, false), v_fassungen)
  on conflict (partner_id) do update set adresse = excluded.adresse, vorname = excluded.vorname, nachname = excluded.nachname,
    rolle = excluded.rolle, satz = excluded.satz, insta = excluded.insta, lead_telefon = excluded.lead_telefon,
    lead_email = excluded.lead_email, kontakt_zeigen = excluded.kontakt_zeigen, fassungen = excluded.fassungen, geaendert = now();
  return jsonb_build_object('ok', true, 'adresse', v_adresse);
end $$;

revoke all on function uk_partner_seiten_daten(text), uk_partner_seiten_adresse(text, text), uk_partner_seiten_speichern(text, jsonb) from public;
grant execute on function uk_partner_seiten_daten(text), uk_partner_seiten_adresse(text, text), uk_partner_seiten_speichern(text, jsonb)
  to anon, authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- 5. Foto (nur für die Edge Function partner-foto, mit Dienstschlüssel)
-- ---------------------------------------------------------------------------------------------------------------

-- Zu welchem Partner gehört die Sitzung, und darf er ein Foto hochladen (gebucht, Seite angelegt)?
create or replace function uk_partner_seiten_foto_ziel(p_sitzung text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v uuid := uk_partner_von_sitzung(p_sitzung); v_alt text;
begin
  if v is null or not uk_seiten_gebucht(v) then return null; end if;
  select foto into v_alt from uk_partner_seiten where partner_id = v;
  if not found then return null; end if;
  return jsonb_build_object('partner_id', v, 'foto_alt', v_alt);
end $$;

create or replace function uk_partner_seiten_foto_setzen(p_partner uuid, p_foto text) returns void
language sql security definer set search_path = public as $$
  update uk_partner_seiten set foto = p_foto, geaendert = now() where partner_id = p_partner
$$;

revoke all on function uk_partner_seiten_foto_ziel(text), uk_partner_seiten_foto_setzen(uuid, text) from public, anon, authenticated;
grant execute on function uk_partner_seiten_foto_ziel(text), uk_partner_seiten_foto_setzen(uuid, text) to service_role;

-- Speicher für die Fotos: öffentlich lesbar, schreiben nur mit Dienstschlüssel (Edge Function)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('partner-seiten', 'partner-seiten', true, 2097152, array['image/jpeg'])
on conflict (id) do nothing;

-- Speicher für die E-Book-Vorlagen und Schriften: nicht öffentlich, nur die Edge Function partner-ebook liest
insert into storage.buckets (id, name, public)
values ('partner-ebooks', 'partner-ebooks', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------------------------------------------
-- 6. Paket setzen (Schnittstelle für die Bezahlung, nur Dienstschlüssel oder SQL-Editor)
-- Beispiele im SQL-Editor:
--   select uk_seiten_paket_setzen('anna-beispiel', current_date + 31);                  -- gebucht, alle Fassungen
--   select uk_seiten_paket_setzen('anna-beispiel', current_date + 31, '{sport}');       -- nur Sport
--   select uk_seiten_paket_setzen('anna-beispiel', null);                               -- abbestellt
-- ---------------------------------------------------------------------------------------------------------------
create or replace function uk_seiten_paket_setzen(p_kurz text, p_bis date, p_fassungen text[] default null, p_ref text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  select id into v from uk_partner where kurz = lower(btrim(p_kurz));
  if v is null then raise exception 'Partner % gibt es nicht', p_kurz; end if;
  insert into uk_partner_seiten_paket (partner_id, gebucht_bis, fassungen, zahlung_ref)
  values (v, p_bis, p_fassungen, p_ref)
  on conflict (partner_id) do update set gebucht_bis = excluded.gebucht_bis, fassungen = excluded.fassungen,
    zahlung_ref = coalesce(excluded.zahlung_ref, uk_partner_seiten_paket.zahlung_ref), geaendert = now();
  return jsonb_build_object('kurz', lower(btrim(p_kurz)), 'gebucht_bis', p_bis, 'fassungen', p_fassungen);
end $$;
revoke all on function uk_seiten_paket_setzen(text, date, text[], text) from public, anon, authenticated;
grant execute on function uk_seiten_paket_setzen(text, date, text[], text) to service_role;

-- ---------------------------------------------------------------------------------------------------------------
-- 7. Beispiele für das Portal: je eine Seite von Daniel und von Jasmin (falls es die Partner mit diesem Kürzel gibt).
-- Rolle, Satz und Foto tragen die beiden danach selbst im Portal unter "Meine Seiten" ein.
-- ---------------------------------------------------------------------------------------------------------------
insert into uk_partner_seiten_paket (partner_id, gebucht_bis, notiz)
select p.id, date '2099-12-31', 'Beispiel im Portal'
from uk_partner p where p.kurz in ('daniel', 'jasmin')
on conflict (partner_id) do nothing;

insert into uk_partner_seiten (partner_id, adresse, vorname, nachname, lead_email, lead_telefon, fassungen, beispiel)
select p.id, x.adresse, p.vorname, p.nachname, p.email, p.telefon, x.fassungen, true
from (values ('daniel', 'daniel-zuercher', array['neutral', 'sport']),
             ('jasmin', 'jasmin-groth', array['gesundheit', 'neutral'])) x(kurz, adresse, fassungen)
join uk_partner p on p.kurz = x.kurz
where not exists (select 1 from uk_partner_seiten s where s.partner_id = p.id)
  and uk_seiten_adresse_status(x.adresse, p.id) = 'ok';

-- Stand ansehen
select p.kurz, s.adresse, s.fassungen, s.beispiel, k.gebucht_bis, uk_seiten_basis() as basis
from uk_partner_seiten s join uk_partner p on p.id = s.partner_id left join uk_partner_seiten_paket k on k.partner_id = s.partner_id;

-- Ursprungskraft: Datenbank für das Dashboard (Daniel und Jasmin)
-- Angelegt am 08.10.2026. Eingespielt im Supabase-Projekt Ursprungskraft (Region Zürich).
-- Alle Tabellen tragen das Kürzel uk_. Zugriff nur für angemeldete Nutzer (Daniel, Jasmin).

-- Empfehler: Vertriebspartner, Influencer, Kunden mit eigenem Link (ursprungskraft.net/<kurz>)
create table if not exists uk_partner (
  id            uuid primary key default gen_random_uuid(),
  kurz          text not null unique check (kurz ~ '^[a-z0-9-]{2,30}$'),
  vorname       text not null,
  nachname      text,
  art           text not null default 'Vertriebspartner'
                check (art in ('Vertriebspartner','Influencer','Kunde')),
  telefon       text,
  email         text,
  ort           text,
  seit          date default current_date,
  aktiv         boolean not null default true,
  notiz         text
);

create table if not exists uk_kunden (
  id            uuid primary key default gen_random_uuid(),
  vorname       text not null,
  nachname      text,
  telefon       text,
  email         text,
  strasse       text,
  plz           text,
  ort           text,
  land          text default 'CH',
  status        text not null default 'Interessent'
                check (status in ('Interessent','Testet','Kunde','Kein Interesse')),
  geraet        text,          -- z. B. LeveLuk K8
  kaufdatum     date,
  filter_zuletzt date,         -- letzter Filterwechsel, sonst gilt das Kaufdatum
  partner_id    uuid references uk_partner(id) on delete set null,  -- über wen gekommen
  token         text unique default encode(gen_random_bytes(9), 'hex'),  -- persönlicher Fragebogen-Link
  newsletter    text check (newsletter in ('angefragt','bestaetigt','abgemeldet')),  -- Double-Opt-In
  empfohlen_von text,          -- freie Angabe, falls kein Partner mit Link
  vermerke      text[] not null default '{}',  -- Haushalt und Interessen, z. B. {kinder,tiere,kaffee}
  gesundheit_einwilligung boolean not null default false,  -- Kunde hat selbst eingewilligt
  gesundheit    text check (gesundheit is null or gesundheit = '' or gesundheit_einwilligung),  -- nur mit Einwilligung
  notiz         text,
  erstellt      timestamptz not null default now()
);

create table if not exists uk_maschinen (
  id            uuid primary key default gen_random_uuid(),
  nummer        int not null unique,      -- 1 bis 13
  modell        text,
  seriennummer  text,
  status        text not null default 'Verfügbar'
                check (status in ('Verfügbar','Beim Kunden','Wartung')),
  kunde_id      uuid references uk_kunden(id) on delete set null,
  seit          date,
  rueckgabe_bis date,
  kaufinteresse text check (kaufinteresse in ('Ja','Nein','Offen')),
  notiz         text
);

-- Jede Ausleihe einzeln, damit man sieht, welche Maschine wann wo war
create table if not exists uk_maschinen_verlauf (
  id            uuid primary key default gen_random_uuid(),
  maschine_id   uuid not null references uk_maschinen(id) on delete cascade,
  kunde_id      uuid references uk_kunden(id) on delete set null,
  kunde_name    text,          -- bleibt lesbar, auch wenn der Kunde gelöscht wird
  von           date not null,
  bis           date,
  kaufinteresse text,
  notiz         text
);

create table if not exists uk_aufgaben (
  id            uuid primary key default gen_random_uuid(),
  titel         text not null,
  notiz         text,
  faellig       date,
  uhrzeit       time,          -- bei Terminen, damit der Bot sie in der richtigen Reihenfolge schickt
  wer           text check (wer in ('Daniel','Jasmin')),
  prio          text check (prio in ('rot','orange')),  -- rot = absolut wichtig, orange = wichtig, leer = normal
  position      int,           -- Reihenfolge innerhalb einer Spalte
  kunde_id      uuid references uk_kunden(id) on delete set null,
  erledigt      boolean not null default false,
  erledigt_am   timestamptz,
  erstellt      timestamptz not null default now()
);

-- Fragebogen: ein Eintrag je Durchgang (1 = Übergabe Testgerät, 2 = nach 2 Wochen, 3 = nach 4 Wochen)
create table if not exists uk_fragebogen (
  id            uuid primary key default gen_random_uuid(),
  kunde_id      uuid not null references uk_kunden(id) on delete cascade,
  durchgang     int not null,
  antworten     jsonb not null,
  einwilligung  text not null,          -- Wortlaut und Zeitpunkt der Einwilligung (Art. 9 DSGVO)
  stimme        boolean default false,  -- Aussagen zu Geschmack und Alltag als Kundenstimme erlaubt
  erstellt      timestamptz not null default now(),
  unique (kunde_id, durchgang)
);
-- Kunden schreiben nur über eine Funktion mit ihrem Token, nie direkt in die Tabelle (folgt beim Anbinden).

alter table uk_partner           enable row level security;
alter table uk_fragebogen        enable row level security;
alter table uk_kunden            enable row level security;
alter table uk_maschinen         enable row level security;
alter table uk_maschinen_verlauf enable row level security;
alter table uk_aufgaben          enable row level security;

-- Nur angemeldete Nutzer. Konten legt Jasmin in Supabase unter Authentication an.
create policy "angemeldet" on uk_fragebogen        for all to authenticated using (true) with check (true);
create policy "angemeldet" on uk_partner           for all to authenticated using (true) with check (true);
create policy "angemeldet" on uk_kunden            for all to authenticated using (true) with check (true);
create policy "angemeldet" on uk_maschinen         for all to authenticated using (true) with check (true);
create policy "angemeldet" on uk_maschinen_verlauf for all to authenticated using (true) with check (true);
create policy "angemeldet" on uk_aufgaben          for all to authenticated using (true) with check (true);

-- Die 13 Testmaschinen als leere Plätze anlegen
insert into uk_maschinen (nummer)
select n from generate_series(1,13) n
on conflict (nummer) do nothing;

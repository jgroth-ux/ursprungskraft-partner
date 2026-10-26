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

-- Spätere Änderungen (aus den Umbau-Dateien):
alter table uk_maschinen add column if not exists bei_art text;
alter table uk_maschinen add column if not exists bei_name text;
alter table uk_maschinen add column if not exists filter_wechsel date[] not null default '{}';
alter table uk_maschinen add constraint uk_maschinen_mandant_nummer_key unique (mandant_id, nummer);
alter table uk_maschinen add constraint uk_maschinen_status_check check (status in ('Verfügbar', 'Beim Kunden', 'Wartung'));
alter table uk_maschinen alter column status set default 'Verfügbar';
alter table uk_maschinen drop constraint if exists uk_maschinen_mandant_nummer_key;
alter table uk_maschinen drop constraint if exists uk_maschinen_nummer_key;
alter table uk_maschinen drop constraint if exists uk_maschinen_status_check;
insert into uk_maschinen_verlauf (maschine_id, kunde_id, kunde_name, von, bis, notiz, mandant_id)
select id, null, 'Jasmin', '2026-10-12', null, 'Hamburg', mandant_id from uk_maschinen
-- Außerdem hat jede Tabelle eine Spalte mandant_id uuid (wird automatisch gesetzt, nicht anfassen).

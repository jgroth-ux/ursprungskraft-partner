-- Datenbank-Entwurf zum Dashboard-Umbau (21.10.2026)
-- Nur ein Entwurf. Nichts davon ist eingespielt. Darf mehrfach laufen.
-- Reihenfolge: zuerst Teil 1 einspielen, danach die neuen Dateien hochladen. Ohne die neuen
-- Spalten lehnt Supabase das Speichern eines Testgeräts ab (unbekannte Spalte name, liste, besitzer).

-- ---------- Teil 1: Testmaschinen in zwei Listen (Aufgabe 5) ----------

-- Anzeigename des Geräts. Leer: das Dashboard zeigt weiter "Daniel 01" usw. aus der Nummer.
alter table uk_maschinen add column if not exists name text;
-- Wem das Gerät gehört, von Hand eingetippt. Leer heißt Daniel.
alter table uk_maschinen add column if not exists besitzer text;
-- In welcher Liste die Kachel steht: daniel = "Daniels Geräte", partner = "Von Partnern"
alter table uk_maschinen add column if not exists liste text not null default 'daniel';
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'uk_maschinen_liste_check' and conrelid = 'uk_maschinen'::regclass) then
    alter table uk_maschinen add constraint uk_maschinen_liste_check check (liste in ('daniel', 'partner'));
  end if;
end $$;

-- Die feste Nummer ist keine Pflicht mehr (neue Geräte bekommen keine) und muss nicht eindeutig sein
alter table uk_maschinen alter column nummer drop not null;
alter table uk_maschinen drop constraint if exists uk_maschinen_nummer_key;
alter table uk_maschinen drop constraint if exists uk_maschinen_mandant_nummer_key;
-- Falls die Eindeutigkeit als eigener Index angelegt wurde (Name bitte mit Abfrage A prüfen):
drop index if exists uk_maschinen_nummer_key;
drop index if exists uk_maschinen_mandant_nummer_key;

-- Wahlweise, erst nach Rückfrage bei Jasmin: bisherige Namen fest eintragen.
-- Nötig ist es nicht, das Dashboard zeigt ohne Namen ohnehin "Daniel 01" usw.
-- update uk_maschinen set name = 'Daniel ' || lpad(nummer::text, 2, '0') where name is null and nummer is not null;

-- Löschen eines Geräts: der Verlauf geht über "on delete cascade" mit (steht schon so in der Tabelle).


-- ---------- Teil 2: nur lesend prüfen, nichts ändern ----------

-- A) Welche Indizes und Regeln hängen an uk_maschinen? (Eindeutigkeit auf nummer muss weg sein)
select indexname, indexdef from pg_indexes where tablename = 'uk_maschinen';
select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'uk_maschinen'::regclass;

-- B) Glocke (Aufgabe 4): warum kommen gesehene Meldungen wieder?
-- Das Dashboard schreibt "neu" jetzt nur noch beim Sehen (false). Wenn es trotzdem wiederkommt, liegt es
-- an der Datenbank oder an Daniels Assistent. Bitte prüfen:
-- B1) Gibt es einen Trigger auf uk_aufgaben, der neu beim Ändern wieder auf true setzt?
select tgname, pg_get_triggerdef(t.oid) from pg_trigger t where tgrelid = 'uk_aufgaben'::regclass and not tgisinternal;
-- B2) Darf Jasmin ändern? Fehlt eine update-Regel, liefert das Speichern keine Zeile zurück.
--     Das Dashboard zeigt dann jetzt eine Meldung, vorher scheiterte es still.
select policyname, cmd, roles, qual, with_check from pg_policies where tablename = 'uk_aufgaben';
-- B3) Standardwert der Spalte neu (sollte false sein, nur der Assistent setzt true)
select column_default, is_nullable from information_schema.columns where table_name = 'uk_aufgaben' and column_name = 'neu';
-- B4) Schreibt der Assistent (Telegram) bestehende Aufgaben neu, z. B. per upsert mit neu = true?
--     Das steht nicht in der Datenbank, sondern im Code des Assistenten. Bitte dort nachsehen.

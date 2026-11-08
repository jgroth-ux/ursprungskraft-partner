-- 08.11.2026: Neues Partnerportal, Teil 1 von 3. Freischalten und Sperren je Bereich, 14 Tage Testzeit.
-- Noch nicht entschieden ist, welche Bereiche kostenlos sind. Deshalb:
--   bereiche = null       noch nicht entschieden, alles frei (Stand für alle bisherigen Partner)
--   bereiche = '{...}'    nur diese Bereiche frei, die anderen zeigen im Portal eine Vorschau mit "Freischalten"
--   test_bis  = Datum     bis einschließlich dieses Tages ist alles frei (setzt der partnerbot bei der Freigabe: heute + 14)
-- Bereiche: kunden, termine, seite (Wasser-Check-Seite), flyer, assistent, wissen.
-- Start, Bestell-Link, Neuigkeiten, Konto und "Mehr für dein Geschäft" sind immer frei.
-- Beispiel Daniel oder Jasmin im SQL-Editor:
--   update uk_partner set bereiche = '{kunden,termine}' where kurz = 'anna-beispiel';
--   update uk_partner set test_bis = current_date + 14 where kurz = 'anna-beispiel';
-- Darf mehrfach laufen. Reihenfolge: zuerst diese Datei, dann 08c-kunden, dann 08c-neuigkeiten, dann die Edge Function partnerbot.

alter table uk_partner add column if not exists bereiche text[];
alter table uk_partner add column if not exists test_bis date;
alter table uk_partner drop constraint if exists uk_partner_bereiche_check;
alter table uk_partner add constraint uk_partner_bereiche_check
  check (bereiche is null or bereiche <@ array['kunden', 'termine', 'seite', 'flyer', 'assistent', 'wissen']::text[]);

-- Was der angemeldete Partner sieht, neu mit "zugang". Alle bisherigen Felder bleiben gleich.
create or replace function uk_partner_daten(p_sitzung text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('vorname', p.vorname, 'nachname', p.nachname, 'kurz', p.kurz, 'enagic_id', p.enagic_id,
    'email', p.email, 'abwicklung', p.abwicklung, 'kalender', p.kalender, 'seite', p.seite,
    'tg_code', p.tg_code, 'tg_verbunden', p.tg_chat is not null,
    'assistent_bot', (select nullif(btrim(wert), '') from uk_einstellungen where name = 'assistent_bot_name'),
    'bestellungen', (select count(*) from uk_bestellungen b where b.von = p.kurz),
    'zugang', jsonb_build_object('bereiche', to_jsonb(p.bereiche), 'test_bis', p.test_bis))
  from uk_partner p where p.id = uk_partner_von_sitzung(p_sitzung)
$$;
revoke all on function uk_partner_daten(text) from public;
grant execute on function uk_partner_daten(text) to anon, authenticated;

select 'ok' as stand;

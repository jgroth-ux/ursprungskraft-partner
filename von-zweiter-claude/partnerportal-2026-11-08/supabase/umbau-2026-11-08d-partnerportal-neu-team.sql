-- 08.11.2026: Neues Partnerportal, Backoffice. Team-Markierung am Partnerkonto.
-- Nur Partnerkonten mit team = true sehen im Portal den Schalter "Partner | Backoffice".
-- Der Schalter öffnet selbst keine Daten: Das Backoffice liest und schreibt ausschließlich über die Supabase-Anmeldung
-- des Dashboards (daten.js, Row Level Security über uk_nutzer). Die Partner-Sitzung bekommt dadurch keinerlei Zugriff.
-- Reihenfolge: nach umbau-2026-11-08c-partnerportal-neu-zugang.sql (diese Datei ersetzt uk_partner_daten noch einmal,
-- mit allen Feldern von dort plus "team"). Darf mehrfach laufen.

alter table uk_partner add column if not exists team boolean not null default false;

-- Daniel und Jasmin: Partnerkonten, deren E-Mail auch einen Dashboard-Zugang hat (uk_nutzer), werden Team.
-- Bitte danach prüfen: select kurz, vorname, email, team from uk_partner where team;
update uk_partner p set team = true
 where not p.team and exists (select 1 from uk_nutzer n where lower(n.email) = lower(p.email));

-- Was der angemeldete Partner sieht: alle Felder wie bisher, dazu "team"
create or replace function uk_partner_daten(p_sitzung text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('vorname', p.vorname, 'nachname', p.nachname, 'kurz', p.kurz, 'enagic_id', p.enagic_id,
    'email', p.email, 'abwicklung', p.abwicklung, 'kalender', p.kalender, 'seite', p.seite,
    'tg_code', p.tg_code, 'tg_verbunden', p.tg_chat is not null,
    'assistent_bot', (select nullif(btrim(wert), '') from uk_einstellungen where name = 'assistent_bot_name'),
    'bestellungen', (select count(*) from uk_bestellungen b where b.von = p.kurz),
    'zugang', jsonb_build_object('bereiche', to_jsonb(p.bereiche), 'test_bis', p.test_bis),
    'team', p.team)
  from uk_partner p where p.id = uk_partner_von_sitzung(p_sitzung)
$$;
revoke all on function uk_partner_daten(text) from public;
grant execute on function uk_partner_daten(text) to anon, authenticated;

select kurz, vorname, email, team from uk_partner where team;

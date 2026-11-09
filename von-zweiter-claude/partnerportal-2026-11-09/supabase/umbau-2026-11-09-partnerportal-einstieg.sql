-- 09.11.2026: Partnerportal, Einführung nur ein einziges Mal je Konto (Jasmin, Korrektur 2).
-- Zwei Merker am Partnerkonto:
--   einstieg_gesehen   die Einführung ist einmal von selbst aufgegangen (danach nie wieder, egal auf welchem Gerät)
--   einstieg_fertig    der Partner hat den Haken "Einrichtung abgeschlossen" gesetzt (der Hinweis auf der Startseite verschwindet)
-- Neue Datei, ändert keine bestehende Funktion. uk_partner_daten bleibt, wie es ist.
-- Das Portal läuft auch ohne diese Datei: Dann merkt es sich beides ersatzweise je Gerät.
-- Darf mehrfach laufen.
--
-- Wer schon lange dabei ist, sieht die neue Einführung nach dem Einspielen einmal. Soll das nicht sein, diese Zeile dazu ausführen:
--   update uk_partner set einstieg_gesehen = now(), einstieg_fertig = now() where einstieg_gesehen is null;

alter table uk_partner add column if not exists einstieg_gesehen timestamptz;
alter table uk_partner add column if not exists einstieg_fertig timestamptz;

create or replace function uk_partner_einstieg(p_sitzung text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('gesehen', p.einstieg_gesehen is not null, 'fertig', p.einstieg_fertig is not null)
  from uk_partner p where p.id = uk_partner_von_sitzung(p_sitzung)
$$;

create or replace function uk_partner_einstieg_setzen(p_sitzung text, p_was text) returns boolean
language plpgsql security definer set search_path = public as $$
declare v uuid := uk_partner_von_sitzung(p_sitzung);
begin
  if v is null or p_was not in ('gesehen', 'fertig') then return false; end if;
  update uk_partner set
    einstieg_gesehen = coalesce(einstieg_gesehen, now()),
    einstieg_fertig = case when p_was = 'fertig' then coalesce(einstieg_fertig, now()) else einstieg_fertig end
  where id = v;
  return true;
end $$;

revoke all on function uk_partner_einstieg(text) from public;
revoke all on function uk_partner_einstieg_setzen(text, text) from public;
grant execute on function uk_partner_einstieg(text) to anon, authenticated;
grant execute on function uk_partner_einstieg_setzen(text, text) to anon, authenticated;

select 'ok' as stand;

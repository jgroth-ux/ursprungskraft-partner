-- 08.11.2026: Neues Partnerportal, Teil 3 von 3. Neuigkeiten von Daniel und Jasmin.
-- Eingang über den Partner-Bot: Daniel oder Jasmin schreiben ihm eine Textnachricht, der Bot fragt mit Knopf
-- "Als Neuigkeit an alle Partner?" und veröffentlicht erst nach dem Knopf (Edge Function partnerbot).
-- Sichtbar im Portal für alle freigegebenen Partner. Zustellung per Telegram nur an Partner, die ihren Assistenten
-- verbunden haben (uk_assistent_senden). Darf mehrfach laufen.

create table if not exists uk_neuigkeiten (
  id               uuid primary key default gen_random_uuid(),
  text             text not null check (length(text) between 1 and 4000),
  von              text not null,                  -- Daniel oder Jasmin
  status           text not null default 'entwurf' check (status in ('entwurf', 'veroeffentlicht', 'verworfen')),
  erstellt         timestamptz not null default now(),
  veroeffentlicht  timestamptz,
  zugestellt       int                             -- an so viele Partner per Telegram geschickt
);
create index if not exists uk_neuigkeiten_neueste on uk_neuigkeiten (veroeffentlicht desc) where status = 'veroeffentlicht';
alter table uk_neuigkeiten enable row level security;
-- Keine Richtlinien: gelesen wird nur über die Funktionen, geschrieben nur von der Edge Function (Dienstschlüssel).

-- Für das Portal: die letzten 30 veröffentlichten Neuigkeiten
create or replace function uk_partner_neuigkeiten(p_sitzung text) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', n.id, 'text', n.text, 'von', n.von, 'erstellt', n.veroeffentlicht)
           order by n.veroeffentlicht desc), '[]')
  from (select * from uk_neuigkeiten where status = 'veroeffentlicht' order by veroeffentlicht desc limit 30) n
  where uk_partner_von_sitzung(p_sitzung) is not null
$$;
revoke all on function uk_partner_neuigkeiten(text) from public;
grant execute on function uk_partner_neuigkeiten(text) to anon, authenticated;

-- Für die Edge Function partnerbot: veröffentlichen und an alle verbundenen Partner schicken.
-- Klappt nur einmal je Neuigkeit (Status wechselt von entwurf auf veroeffentlicht). Antwort: Zahl der Partner, oder null.
create or replace function uk_neuigkeit_veroeffentlichen(p_id uuid) returns int
language plpgsql security definer set search_path = public as $$
declare n uk_neuigkeiten; r record; v_zahl int := 0;
begin
  update uk_neuigkeiten set status = 'veroeffentlicht', veroeffentlicht = now()
   where id = p_id and status = 'entwurf' returning * into n;
  if n.id is null then return null; end if;
  for r in select id from uk_partner where tg_chat is not null and status = 'freigegeben' loop
    perform uk_assistent_senden(r.id, 'Neuigkeit von ' || n.von || E'\n\n' || n.text);
    v_zahl := v_zahl + 1;
  end loop;
  update uk_neuigkeiten set zugestellt = v_zahl where id = n.id;
  return v_zahl;
end $$;
revoke all on function uk_neuigkeit_veroeffentlichen(uuid) from public, anon, authenticated;
grant execute on function uk_neuigkeit_veroeffentlichen(uuid) to service_role;

select 'ok' as stand;

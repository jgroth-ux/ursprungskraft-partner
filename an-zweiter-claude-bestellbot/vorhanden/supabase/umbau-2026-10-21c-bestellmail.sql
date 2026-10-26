-- Umbau 21.10.2026 (c): Bestätigungsmail an den Kunden nach jeder Bestellung.
-- Verschickt wird von der Edge Function mail-senden über das IONOS-Postfach info@ursprungskraft.net.
-- Die Funktion bekommt nur die Bestell-ID und baut die Mail selbst. mail_bestaetigung verhindert doppelte Mails.
-- Im SQL-Editor ausführen. Darf mehrfach laufen.

alter table uk_bestellungen add column if not exists mail_bestaetigung timestamptz;

create or replace function uk_bestellung_mail() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(url := 'https://ngcbmpuqcqbelfoelwby.supabase.co/functions/v1/mail-senden',
    body := jsonb_build_object('art', 'bestellung', 'id', new.id),
    headers := '{"Content-Type": "application/json"}'::jsonb);
  return new;
end $$;
drop trigger if exists uk_bestellung_mail on uk_bestellungen;
create trigger uk_bestellung_mail after insert on uk_bestellungen for each row execute function uk_bestellung_mail();

select tgname from pg_trigger where tgrelid = 'uk_bestellungen'::regclass and not tgisinternal;

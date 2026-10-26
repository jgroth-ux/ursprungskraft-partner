-- Umbau 24.10.2026 (a): Bestellseite mit Produktkacheln (aus der Übergabe des zweiten Claude).
-- Telegram-Meldung nennt jetzt Bestellungen ohne K8 und die gewünschten Ergänzungen emGuarde Go / ANESPA DX.
-- Sonst unverändert gegenüber umbau-2026-10-20-bestellbot.sql. Darf mehrfach laufen.

create or replace function uk_bestellung_melden() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  d jsonb := new.daten;
  v_text text;
  p record;
  v_token text;
  v_bestell text;
  v_chat text;
  v_an boolean;
begin
  v_text := '🛒 Neue Bestellung LeveLuk K8' || E'\n'
    || coalesce(d->>'vorname', '') || ' ' || coalesce(d->>'nachname', '') || ', ' || coalesce(d->>'plz', '') || ' ' || coalesce(d->>'ort', '') || ', ' || coalesce(d->>'land', '') || E'\n'
    || case when d->>'zahlung' = 'raten' then 'Ratenzahlung, ' || coalesce(d->>'raten_anzahl', '') || ' Monate' else 'Überweisung' end
    || case when d->>'k8' = 'nein' then E'\nOHNE K8, nur Ergänzungen' else '' end
    || case when d->>'zusatz_emguarde' = 'on' or d->>'zusatz_anespa' = 'on'
         then E'\nDazu gewünscht: ' || concat_ws(', ',
           case when d->>'zusatz_emguarde' = 'on' then 'emGuarde Go' end,
           case when d->>'zusatz_anespa' = 'on' then 'ANESPA DX' end)
           || E'\n(Ergänzungen nicht im Enagic-Formular, Preis und Bestellung persönlich klären)'
         else '' end
    || case when new.sponsor = 'jasmin'
         then E'\n\nLäuft über Jasmin (Bestellung über ihren Link).\nJasmin legt im Dashboard unter Bestellungen nur noch die Linie fest.'
         else E'\n\nDaniel, bitte im Dashboard unter Bestellungen festlegen:\n1. Über wen läuft der Verkauf? (Daniel, Ursprungskraft GmbH, Jasmin oder ein anderer Partner)\n2. Neukunde in welcher Linie?\nDanach wird der Vertrag fertig gemacht.' end;
  select decrypted_secret into v_bestell from vault.decrypted_secrets where name = 'tg_token_bestellung';
  for p in select * from (values ('jasmin', 'tg_token_jasmin', 'tg_chat_jasmin'), ('daniel', 'tg_token_daniel', 'tg_chat_daniel')) x(an, t, c) loop
    select decrypted_secret into v_token from vault.decrypted_secrets where name = p.t;
    select wert into v_chat from uk_einstellungen where name = p.c;
    select coalesce((select wert = 'ja' from uk_einstellungen where name = 'bestellbot_' || p.an), false) into v_an;
    if v_an and v_bestell is not null then v_token := v_bestell; end if;
    if v_token is not null and v_chat is not null then
      perform net.http_post(url := 'https://api.telegram.org/bot' || v_token || '/sendMessage',
        body := jsonb_build_object('chat_id', v_chat, 'text', v_text, 'disable_web_page_preview', true),
        headers := '{"Content-Type": "application/json"}'::jsonb);
    end if;
  end loop;
  return new;
end $$;

select 'ok' as stand;

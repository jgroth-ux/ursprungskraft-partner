-- umbau-2026-10-27: Lieferland und emGuarde (Auftrag an-zweiter-claude-bestellseite-emguarde, Stand 26.10.2026)
-- Ändert nur die Bestellmeldung uk_bestellung_melden(). Alles andere aus 26b bleibt (Linienknöpfe, Sponsorwahl, Zustand).
-- Neu in der Meldung:
--   "Lieferung nach: Name, Straße, LAND-PLZ Ort", nur wenn eine abweichende Lieferadresse angegeben ist
--   Produkte in der Reihenfolge K8, ANESPA DX, emGuarde Go (mit Anzahl Sets, wenn mehr als 1)
--   Zahlung je Formular: "Zahlung K8: ..." und "Zahlung emGuarde: ..."
--   Hinweis bei mehr als 5 emGuarde
--   Nur emGuarde bestellt: normaler Ablauf mit Sponsor und Linie. "Persönlich klären" nur ohne K8, ANESPA und emGuarde.
-- Neue Felder der Bestellseite landen ohne Änderung an uk_bestellung() in daten (jsonb).
-- Darf mehrfach laufen.

create or replace function uk_bestellung_melden() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  d jsonb := new.daten;
  v_kopf text;
  v_daniel text;
  v_jasmin text;
  v_markup jsonb;
  v_schritt text;
  v_jasmin_id text;
  v_bestell text;
  v_token text;
  v_chat text;
  v_an boolean;
  v_zusatz text;
  v_text text;
  p record;
  v_linien int;
  v_linie_knoepfe jsonb;
  v_eg int;
  v_k8form boolean;
begin
  v_eg := greatest(1, coalesce(nullif(regexp_replace(coalesce(d->>'anzahl_emguarde', ''), '\D', '', 'g'), '')::int, 1));
  v_k8form := d->>'k8' is distinct from 'nein' or coalesce(d->>'zusatz_anespa', '') = 'on';
  -- Linien-Knöpfe 1 bis n, drei pro Reihe. n steht in der Einstellung bestellbot_linien (26.10.2026: 6)
  select coalesce(nullif(wert, '')::int, 6) into v_linien from uk_einstellungen where name = 'bestellbot_linien';
  select jsonb_build_object('inline_keyboard', jsonb_agg(reihe order by r)) into v_linie_knoepfe from (
    select (i - 1) / 3 as r, jsonb_agg(jsonb_build_object('text', i::text || ' A', 'callback_data', 'l|' || new.id || '|' || i) order by i) as reihe
    from generate_series(1, coalesce(v_linien, 6)) i group by 1) x;
  v_zusatz := concat_ws(', ',
    case when d->>'k8' is distinct from 'nein' then 'LeveLuk K8' end,
    case when d->>'zusatz_anespa' = 'on' then 'ANESPA DX' end,
    case when d->>'zusatz_emguarde' = 'on' then 'emGuarde Go' || case when v_eg > 1 then ' (' || v_eg || ' Sets)' else '' end end);
  v_kopf := '🛒 Neue Bestellung #' || new.nummer || E'\n'
    || 'Eingang ' || to_char(new.erstellt at time zone 'Europe/Zurich', 'DD.MM.YYYY, HH24:MI') || ' Uhr' || E'\n\n'
    || coalesce(d->>'vorname', '') || ' ' || coalesce(d->>'nachname', '') || coalesce(' (' || nullif(d->>'firma', '') || ')', '') || E'\n'
    || coalesce(d->>'plz', '') || ' ' || coalesce(d->>'ort', '') || ', ' || coalesce(d->>'land', '') || E'\n'
    -- Lieferadresse nur, wenn abweichend: "Name, Straße, LAND-PLZ Ort" (26.10.2026)
    || case when d->>'liefer_anders' = 'on' then 'Lieferung nach: ' || concat_ws(', ', nullif(d->>'liefer_name', ''),
         coalesce(nullif(d->>'liefer_strasse', '') || ', ' || case when coalesce(d->>'liefer_land_kurz', 'XX') <> 'XX' then (d->>'liefer_land_kurz') || '-' else '' end
                  || coalesce(d->>'liefer_plz', '') || ' ' || coalesce(d->>'liefer_ort', ''), nullif(d->>'liefer_adresse', ''))) || E'\n' else '' end
    || 'Produkte: ' || coalesce(nullif(v_zusatz, ''), 'kein Gerät') || case when d->>'k8' = 'nein' and v_k8form then ' (ohne K8)' else '' end || E'\n'
    -- Bezahlung je Formular: K8-Formular (K8 und/oder ANESPA) und emGuarde-Formular
    || case when v_k8form then 'Zahlung ' || case when d->>'k8' = 'nein' then 'ANESPA' else 'K8' end || ': '
         || case when d->>'zahlung' = 'raten' then 'Raten, ' || coalesce(d->>'raten_anzahl', '') || ' Monate' else 'Überweisung' end || E'\n' else '' end
    || case when d->>'zusatz_emguarde' = 'on' then 'Zahlung emGuarde: '
         || case when d->>'zahlung_emguarde' = 'raten' then 'Raten, 10 Monate' else 'Überweisung' end || E'\n' else '' end
    || case when d->>'zusatz_emguarde' = 'on' and v_eg > 5 then E'Achtung, mehr als 5 emGuarde je Vertriebspartner gehen nicht.\n' else '' end
    || 'Als: ' || coalesce(d->>'als', 'Verbraucher') || E'\n'
    || 'Link: ' || coalesce(nullif(new.von, ''), 'ohne von');

  select coalesce((wert::jsonb)->>'id', '') into v_jasmin_id from uk_einstellungen where name = 'sponsor_jasmin';
  v_markup := null;
  -- Enagic-Formulare gibt es für K8, ANESPA DX und emGuarde Go. Nur ohne alle drei persönlich klären (26.10.2026).
  if not v_k8form and d->>'zusatz_emguarde' is distinct from 'on' then
    v_schritt := 'ohne_k8';
    v_daniel := v_kopf || E'\n\nWeder K8 noch ANESPA noch emGuarde bestellt, bitte persönlich klären.';
  elsif new.sponsor = 'jasmin' and coalesce(v_jasmin_id, '') = '' then
    v_schritt := 'wartet_id';
    v_daniel := v_kopf || E'\n\nLäuft über Jasmin (kam über ihren Link). Für Jasmin ist noch keine Sponsor-ID hinterlegt, deshalb mache ich noch keinen Vertrag. Du kannst die Bestellung auch anders zuordnen:';
    v_markup := jsonb_build_object('inline_keyboard', jsonb_build_array(
      jsonb_build_array(jsonb_build_object('text', 'Daniel', 'callback_data', 's|' || new.id || '|daniel'),
                        jsonb_build_object('text', 'Ursprungskraft GmbH', 'callback_data', 's|' || new.id || '|gmbh')),
      jsonb_build_array(jsonb_build_object('text', 'Jemand anderes', 'callback_data', 's|' || new.id || '|andere'))));
  elsif new.sponsor = 'jasmin' then
    v_schritt := 'linie';
    v_daniel := v_kopf || E'\n\nLäuft über Jasmin (kam über ihren Link).\nWelche Linie?';
    v_markup := v_linie_knoepfe;
  else
    v_schritt := 'sponsor';
    v_daniel := v_kopf || E'\n\nÜber wen läuft der Verkauf?';
    v_markup := jsonb_build_object('inline_keyboard', jsonb_build_array(
      jsonb_build_array(jsonb_build_object('text', 'Daniel', 'callback_data', 's|' || new.id || '|daniel'),
                        jsonb_build_object('text', 'Ursprungskraft GmbH', 'callback_data', 's|' || new.id || '|gmbh')),
      jsonb_build_array(jsonb_build_object('text', 'Jasmin', 'callback_data', 's|' || new.id || '|jasmin'),
                        jsonb_build_object('text', 'Jemand anderes', 'callback_data', 's|' || new.id || '|andere'))));
  end if;
  v_jasmin := v_kopf || E'\n\nZur Info. Daniel bekommt die Rückfragen im Bestell-Bot.';

  insert into uk_bestellbot (bestellung_id, schritt, werte)
  values (new.id, v_schritt, case when new.sponsor is not null then jsonb_build_object('sponsor', new.sponsor) else '{}'::jsonb end)
  on conflict (bestellung_id) do nothing;

  select decrypted_secret into v_bestell from vault.decrypted_secrets where name = 'tg_token_bestellung';
  for p in select * from (values ('jasmin', 'tg_token_jasmin', 'tg_chat_jasmin'), ('daniel', 'tg_token_daniel', 'tg_chat_daniel')) x(an, t, c) loop
    select decrypted_secret into v_token from vault.decrypted_secrets where name = p.t;
    select wert into v_chat from uk_einstellungen where name = p.c;
    select coalesce((select wert = 'ja' from uk_einstellungen where name = 'bestellbot_' || p.an), false) into v_an;
    if v_an and v_bestell is not null then v_token := v_bestell; end if;
    if v_token is null or v_chat is null then continue; end if;
    if p.an = 'daniel' and v_an and v_bestell is not null then
      v_text := v_daniel;
      -- Wartet die Bestellung direkt auf die Linie, merkt sich der Chat, für welche Bestellung
      if v_schritt = 'linie' then
        insert into uk_bestellbot_chat (chat_id, bestellung_id, aktualisiert) values (v_chat, new.id, now())
        on conflict (chat_id) do update set bestellung_id = excluded.bestellung_id, aktualisiert = now();
      end if;
    elsif p.an = 'daniel' then
      -- Daniel hat den Bestell-Bot noch nicht eingeschaltet: Meldung wie bisher über seinen Assistenten
      v_text := v_kopf || E'\n\nBitte im Dashboard unter Bestellungen zuordnen. Im Bestell-Bot geht das direkt, sobald er eingeschaltet ist.';
    else
      v_text := v_jasmin;
    end if;
    perform net.http_post(url := 'https://api.telegram.org/bot' || v_token || '/sendMessage',
      body := jsonb_build_object('chat_id', v_chat, 'text', v_text, 'disable_web_page_preview', true)
              || case when p.an = 'daniel' and v_an and v_markup is not null then jsonb_build_object('reply_markup', v_markup) else '{}'::jsonb end,
      headers := '{"Content-Type": "application/json"}'::jsonb);
  end loop;
  return new;
end $$;
-- Trigger gibt es schon (umbau-2026-10-19g), hier nur sicherstellen
drop trigger if exists uk_bestellung_melden on uk_bestellungen;
create trigger uk_bestellung_melden after insert on uk_bestellungen for each row execute function uk_bestellung_melden();

select 'ok' as stand;

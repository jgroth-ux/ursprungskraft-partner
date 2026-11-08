-- 08.11.2026: Neues Partnerportal, Teil 2 von 3. Kundendatenbank mit Stand, Stufe und Bestellstand.
-- Jasmin: Interessenten der Seite automatisch, Käufer über den Link automatisch (Gerät, Kaufdatum), Bestellstand
-- sichtbar (bestellt, an den Hersteller raus, Gerät da), dazu von Hand eintragen mit Notizen und Stufe heiß, warm, kalt.
-- Stand im Portal: neu, kontaktiert, termin, gekauft, betreuung. Eigene Spalte partner_stand, damit uk_kunden.status
-- (Dashboard, Assistent, Kalender) unverändert weiterläuft. "Kein Interesse" bleibt uk_kunden.status = 'Kein Interesse',
-- im Portal heißt das "ablegen".
-- Herausgegeben werden nur Name, Ort, Gerät, Datum und Stand. Keine Bankdaten, Ausweise, Unterschriften oder Zahlungsdetails.
-- Alte Funktionen (uk_partner_kontakte, uk_partner_kontakt_speichern) bleiben bestehen. Darf mehrfach laufen.

alter table uk_kunden add column if not exists partner_stand text;
alter table uk_kunden drop constraint if exists uk_kunden_partner_stand_check;
alter table uk_kunden add constraint uk_kunden_partner_stand_check
  check (partner_stand is null or partner_stand in ('neu', 'kontaktiert', 'termin', 'gekauft', 'betreuung'));
alter table uk_kunden add column if not exists partner_stufe text;
alter table uk_kunden drop constraint if exists uk_kunden_partner_stufe_check;
alter table uk_kunden add constraint uk_kunden_partner_stufe_check
  check (partner_stufe is null or partner_stufe in ('heiss', 'warm', 'kalt'));

-- Welche Geräte in einer Bestellung stecken (gleiche Regeln wie uk_bestellung_melden)
create or replace function uk_bestellung_geraete(d jsonb) returns text
language sql immutable as $$
  select nullif(concat_ws(', ',
    case when d->>'k8' is distinct from 'nein' then 'LeveLuk K8' end,
    case when d->>'zusatz_anespa' = 'on' then 'ANESPA DX' end,
    case when d->>'zusatz_emguarde' = 'on' then 'emGuarde GO' end), '')
$$;

-- Bestellstand für den angemeldeten Partner: alle Bestellungen über seinen Link (uk_bestellungen.von = kurz).
-- stand: bestellt (Neu, Vertrag fertig), verschickt (An Enagic geschickt), da (Kunde steht auf Geliefert oder hat geliefert_am).
-- Stornierte Bestellungen erscheinen nicht. geliefert_am wird über to_jsonb gelesen, damit die Funktion auch ohne die Spalte läuft.
create or replace function uk_partner_bestellstand(p_sitzung text) returns jsonb
language sql stable security definer set search_path = public as $$
  with p as (select id, kurz from uk_partner where id = uk_partner_von_sitzung(p_sitzung))
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', b.id, 'nummer', b.nummer, 'erstellt', b.erstellt, 'kunde_id', b.kunde_id,
      'name', btrim(coalesce(b.daten->>'vorname', '') || ' ' || coalesce(b.daten->>'nachname', '')),
      'ort', b.daten->>'ort', 'geraete', uk_bestellung_geraete(b.daten),
      'stand', case when k.status = 'Geliefert' or (to_jsonb(k)->>'geliefert_am') is not null then 'da'
                    when b.status = 'An Enagic geschickt' then 'verschickt' else 'bestellt' end,
      'da_am', to_jsonb(k)->>'geliefert_am')
    order by b.erstellt), '[]')
  from uk_bestellungen b join p on b.von = p.kurz
  left join uk_kunden k on k.id = b.kunde_id
  where b.status <> 'Storniert'
$$;

-- Alle Kunden des Partners in einer Liste: Kontakte (Anfragen, Käufer, selbst eingetragen) und Leads seiner Seite,
-- die noch kein Kontakt sind (E-Book, nur umschauen). Leads haben art = 'lead' und ihre Lead-ID.
create or replace function uk_partner_kunden(p_sitzung text) returns jsonb
language sql stable security definer set search_path = public as $$
  with p as (select id, kurz from uk_partner where id = uk_partner_von_sitzung(p_sitzung)),
  k as (
    select k.*,
      exists (select 1 from uk_bestellungen b where b.kunde_id = k.id and b.von = (select kurz from p) and b.status <> 'Storniert') as gekauft,
      (select l from uk_partner_leads l where l.kunde_id = k.id order by l.erstellt desc limit 1) as lead
    from uk_kunden k
    where k.partner_id = (select id from p)
       or k.id in (select b.kunde_id from uk_bestellungen b where b.von = (select kurz from p) and b.kunde_id is not null)),
  kontakte as (
    select jsonb_build_object(
      'id', k.id, 'art', 'kontakt', 'vorname', k.vorname, 'nachname', k.nachname, 'telefon', k.telefon, 'email', k.email,
      'ort', k.ort, 'erreichbar', k.erreichbar, 'erstellt', k.erstellt,
      'quelle', case when k.gekauft then 'Bestellung'
                     when k.notiz like 'Selbst eingetragen%' then 'Selbst eingetragen'
                     when (k.lead).quelle = 'formular' then 'Interessentenformular'
                     else 'Anfrage' end,
      'stand', coalesce(k.partner_stand,
                 case when k.gekauft or k.status in ('Kunde', 'Bestellt', 'Geliefert') then 'gekauft'
                      when exists (select 1 from uk_partner_termine t where t.kunde_id = k.id and t.beginn > now()) then 'termin'
                      when k.letzter_kontakt is not null or k.status = 'Testet' then 'kontaktiert' else 'neu' end),
      'stufe', coalesce(k.partner_stufe, (k.lead).stufe),
      'abgelegt', k.status = 'Kein Interesse',
      'letzter_kontakt', k.letzter_kontakt, 'naechster_kontakt', k.naechster_kontakt, 'verblieben', k.verblieben,
      'geraet', k.geraet, 'kaufdatum', k.kaufdatum, 'antworten', (k.lead).antworten,
      'notizen', (select coalesce(jsonb_agg(jsonb_build_object('text', n.text, 'erstellt', n.erstellt) order by n.erstellt desc), '[]')
                    from uk_kontakt_notizen n where n.kunde_id = k.id and n.partner_id = (select id from p))) as x, k.erstellt
    from k),
  leads as (
    select jsonb_build_object(
      'id', l.id, 'art', 'lead', 'vorname', l.vorname, 'nachname', l.nachname, 'telefon', l.telefon, 'email', l.email,
      'ort', l.ort, 'erreichbar', l.erreichbar, 'erstellt', l.erstellt,
      'quelle', case l.quelle when 'ebook' then 'E-Book' when 'umschauen' then 'Schaut sich um' else 'Interessentenformular' end,
      'stand', case l.status when 'kontaktiert' then 'kontaktiert' when 'termin' then 'termin' when 'gekauft' then 'gekauft' else 'neu' end,
      'stufe', l.stufe, 'abgelegt', l.status = 'kein_interesse', 'antworten', l.antworten, 'notizen', '[]'::jsonb) as x, l.erstellt
    from uk_partner_leads l
    where l.kunde_id is null and (l.partner_id = (select id from p) or l.herkunft = (select kurz from p)))
  select coalesce(jsonb_agg(x order by erstellt desc), '[]')
  from (select x, erstellt from kontakte union all select x, erstellt from leads) alle
  where exists (select 1 from p)
$$;

-- Kunde anlegen, ändern oder einen Lead übernehmen. Antwort: die Kunden-ID, oder null wenn nicht erlaubt.
-- p: {id? | lead_id?, vorname, nachname, telefon, email, ort, erreichbar, stand, stufe, abgelegt, naechster_kontakt, verblieben, notiz}
-- Nur Felder, die mitkommen, werden geändert.
create or replace function uk_partner_kunde_speichern(p_sitzung text, p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_partner uuid := uk_partner_von_sitzung(p_sitzung);
  v_kurz text;
  v_id uuid := nullif(p->>'id', '')::uuid;
  v_lead uk_partner_leads;
  v_notiz text := uk_txt(p->>'notiz', 2000);
  v_stand text := nullif(p->>'stand', '');
  v_stufe text := nullif(p->>'stufe', '');
begin
  if v_partner is null then return null; end if;
  select kurz into v_kurz from uk_partner where id = v_partner;
  if v_stand is not null and v_stand not in ('neu', 'kontaktiert', 'termin', 'gekauft', 'betreuung') then v_stand := null; end if;
  if v_stufe is not null and v_stufe not in ('heiss', 'warm', 'kalt') then v_stufe := null; end if;

  -- Lead aus der Partnerseite übernehmen: wird ein eigener Kontakt des Partners
  if nullif(p->>'lead_id', '') is not null then
    select * into v_lead from uk_partner_leads where id = (p->>'lead_id')::uuid and (partner_id = v_partner or herkunft = v_kurz);
    if v_lead.id is null then return null; end if;
    if v_lead.kunde_id is not null then v_id := v_lead.kunde_id;
    else
      insert into uk_kunden (vorname, nachname, telefon, email, ort, status, partner_id, erreichbar, partner_stand, partner_stufe, notiz)
      values (v_lead.vorname, v_lead.nachname, v_lead.telefon, v_lead.email, v_lead.ort, 'Interessent', v_partner, v_lead.erreichbar,
              'neu', v_lead.stufe, 'Selbst eingetragen im Partnerportal (aus der Partnerseite: ' || v_lead.quelle || ')')
      returning id into v_id;
      update uk_partner_leads set kunde_id = v_id where id = v_lead.id;
    end if;
  elsif v_id is null then
    if uk_txt(p->>'vorname', 80) is null then return null; end if;
    insert into uk_kunden (vorname, nachname, telefon, email, ort, status, partner_id, erreichbar, partner_stand, partner_stufe, notiz)
    values (uk_txt(p->>'vorname', 80), uk_txt(p->>'nachname', 80), uk_txt(p->>'telefon', 40), uk_txt(p->>'email', 160),
            uk_txt(p->>'ort', 80), 'Interessent', v_partner, uk_txt(p->>'erreichbar', 300), coalesce(v_stand, 'neu'), v_stufe,
            'Selbst eingetragen im Partnerportal')
    returning id into v_id;
  elsif not uk_partner_darf(v_partner, v_id) then
    return null;
  end if;

  update uk_kunden set
    vorname = coalesce(uk_txt(p->>'vorname', 80), vorname),
    nachname = case when p ? 'nachname' then uk_txt(p->>'nachname', 80) else nachname end,
    telefon = case when p ? 'telefon' then uk_txt(p->>'telefon', 40) else telefon end,
    email = case when p ? 'email' then uk_txt(p->>'email', 160) else email end,
    ort = case when p ? 'ort' then uk_txt(p->>'ort', 80) else ort end,
    erreichbar = case when p ? 'erreichbar' then uk_txt(p->>'erreichbar', 300) else erreichbar end,
    partner_stand = case when p ? 'stand' and v_stand is not null then v_stand else partner_stand end,
    partner_stufe = case when p ? 'stufe' then v_stufe else partner_stufe end,
    status = case when p ? 'abgelegt' and (p->>'abgelegt')::boolean then 'Kein Interesse'
                  when p ? 'abgelegt' and status = 'Kein Interesse' then 'Interessent' else status end,
    naechster_kontakt = case when p ? 'naechster_kontakt' then nullif(p->>'naechster_kontakt', '')::date
                             when p ? 'abgelegt' and (p->>'abgelegt')::boolean then null else naechster_kontakt end,
    verblieben = case when p ? 'verblieben' then uk_txt(p->>'verblieben', 500) else verblieben end
   where id = v_id;
  if v_notiz is not null then
    insert into uk_kontakt_notizen (kunde_id, partner_id, text) values (v_id, v_partner, v_notiz);
    update uk_kunden set letzter_kontakt = now() where id = v_id;
  end if;
  return v_id;
end $$;

revoke all on function uk_partner_bestellstand(text), uk_partner_kunden(text), uk_partner_kunde_speichern(text, jsonb) from public;
grant execute on function uk_partner_bestellstand(text), uk_partner_kunden(text), uk_partner_kunde_speichern(text, jsonb) to anon, authenticated;

select 'ok' as stand;

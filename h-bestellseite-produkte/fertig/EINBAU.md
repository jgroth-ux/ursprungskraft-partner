<!--
  BESTELLSEITE MIT PRODUKTKACHELN, Stand 23.10.2026
  FERTIG: index.html und bestellen.js der echten Bestellseite mit drei Produktkacheln (K8, emGuarde Go, ANESPA DX).
  FEHLT:  Schweizer Preise für emGuarde und ANESPA DX, Fotos dieser beiden (Genehmigung Enagic), Telegram-Zeile (SQL unten).
-->

# Einbau: Bestellseite mit Produktkacheln

Für den Claude mit Zugriff auf Server und Datenbank. Grundlage war `von-hauptsystem/website/bestellen/`
aus dem Repository VIP-Group-Business (Stand 23.10.2026).

## 1. Dateien ersetzen

- `website/bestellen/index.html` ersetzen durch `fertig/website/bestellen/index.html`
- `website/bestellen/bestellen.js` ersetzen durch `fertig/website/bestellen/bestellen.js`
- **Wichtig:** In `bestellen.js` steht der Supabase-Schlüssel als `XXX`. Vor dem Hochladen den echten
  öffentlichen Schlüssel wieder eintragen (Zeile mit `supabase.createClient`).

Die Ordner `bilder/`, `dashboard/`, `vendor/` in `fertig/website/` sind nur zum Testen dabei, dort ändert sich nichts.

## 2. Was sich geändert hat

- Der Block „Dein Gerät“ ist jetzt „Dein Gerät und passende Ergänzungen“ mit drei Kacheln:
  LeveLuk K8 (fest in der Bestellung), emGuarde Go, ANESPA DX. Klick auf eine Kachel öffnet ein Fenster
  mit Infos. emGuarde und ANESPA DX haben einen Haken „Mitbestellen“.
- Die Haken heißen `zusatz_emguarde` und `zusatz_anespa`. Sie stehen im Formular, landen also ohne
  weitere Änderung in `daten` (jsonb) in `uk_bestellungen`, Wert `"on"` wenn gewählt.
- Die Preise in den Kacheln wechseln mit dem Land. Für die Schweiz steht bei den Ergänzungen
  „Preis nennen wir dir persönlich“.
- Ist eine Ergänzung gewählt, steht unter dem Preis im Block „Bezahlung“, dass Preis und Bezahlung
  dafür persönlich geklärt werden.
- Produktdaten und Preise stehen oben im Abschnitt `PRODUKTE` in `bestellen.js` (Preise ohne MwSt.
  laut Enagic-Shop, Stand 23.10.2026).
- Die abweichende Lieferadresse gab es schon (`liefer_anders`, `liefer_name`, `liefer_adresse`),
  daran ist nichts geändert.

## 3. Telegram-Nachricht ergänzen (Datenbank)

In der Funktion `uk_bestellung_melden()` eine Zeile anhängen, wenn Ergänzungen gewählt sind, sinngemäß:

```sql
-- im Aufbau des Nachrichtentexts:
|| case when (new.daten->>'zusatz_emguarde') = 'on' or (new.daten->>'zusatz_anespa') = 'on'
     then E'\nDazu gewünscht: ' || concat_ws(', ',
       case when (new.daten->>'zusatz_emguarde') = 'on' then 'emGuarde Go' end,
       case when (new.daten->>'zusatz_anespa') = 'on' then 'ANESPA DX' end)
     else '' end
```

Gern auch im Dashboard unter Bestellungen anzeigen.

## 4. Nicht automatisch an Enagic

emGuarde und ANESPA DX gehen nicht in das K8-Bestellformular. Daniel klärt Preis, Zahlung und
Bestellung mit dem Kunden selbst. Die Bestätigungsmail an den Kunden (`mail-senden`) kann einen Satz bekommen:
„Zu deinen gewünschten Ergänzungen melden wir uns persönlich bei dir.“

## 5. Noch offen

- Schweizer Preise für emGuarde und ANESPA DX
- Fotos von emGuarde und ANESPA DX (schriftliche Genehmigung von Enagic, Ziffer 3.3 und 3.4). Feld `bild` in `PRODUKTE`.
- emGuarde laut Shop nur bei Vorauszahlung, obwohl „10 Zahlungen“ angezeigt wird: mit Daniel klären.

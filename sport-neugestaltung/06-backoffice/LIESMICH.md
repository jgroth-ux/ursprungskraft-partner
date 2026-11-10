# Backoffice für Sportpartner (Vorschau)

Stand 10.11.2026. Eine Seite, auf der Kevin, Johny und spätere Sportpartner sich anmelden und sehen,
wer sich über ihre Landingpage eingetragen hat. Optik wie Landingpage, Grund Anthrazit, Akzent je Sportler.

**Das ist eine Vorschau mit ausgedachten Beispieldaten.** Es gibt noch keine echte Anmeldung und keine Verbindung
zur Datenbank. Ansehen: `index.html` öffnen und unten „Kevin Wolter“ oder „Johny Yusupov“ wählen,
oder direkt `index.html?wer=kevin`.

## Was die Seite zeigt

- Anmeldungen gesamt, neue der letzten 7 Tage, ein Balken je Tag
- wie viele das Gerät kennenlernen wollen, wie viele nur das E-Book, wie viele gekauft haben
- Liste mit Datum, Vorname und Anfangsbuchstabe, Ort, Wunsch und Stand, Filter Alle, Gerät, E-Book, Gekauft
- keine Telefonnummer, keine E-Mail (Datenschutz, siehe unten)

## Für den Echtbetrieb fehlt noch

1. Wo die Anmeldungen heute landen: Funktion `partner-lead` und Tabellen (`supabase/schema.sql`,
   `supabase/funktionen.sql`) liegen nicht in diesem Paket.
2. Je Sportler ein Zugang (Supabase Auth, wie beim Dashboard) mit Rolle „Sportpartner“ und Verweis auf `uk_partner.kurz`.
3. Eine Abfrage, die per Row Level Security nur die eigenen Anmeldungen liefert, und nur die Felder
   Datum, Vorname, Anfangsbuchstabe Nachname, Ort, Land, Wunsch, Stand.
4. Der Stand („Team hat sich gemeldet“, „In Beratung“, „Gerät gekauft“) kommt aus dem Status, den das Team im Dashboard pflegt.
5. Datenschutzerklärung und Einwilligung ergänzen (siehe ERGEBNIS bzw. Chat vom 10.11.).
6. Eigene Adresse, zum Beispiel `…/backoffice/`.

In `backoffice.js` muss dafür nur das Objekt `QUELLE` ersetzt werden, die Darstellung bleibt.

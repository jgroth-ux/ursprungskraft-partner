# Ergebnis: Lieferland und emGuarde

Stand 27.10.2026. Gebaut nach `an-zweiter-claude-bestellseite-emguarde/AUFTRAG.md`, auf den Live-Dateien aus `vorhanden/`.

## Gebaut

**Bestellseite**
1. Land einmal wählen: Nach der Wahl verschwindet der Flaggenblock. Unter der Adresse steht „Land: … Land ändern“. Die doppelte Länderauswahl im Adressteil ist weg, `land_kurz` ist ein verstecktes Feld und wird weiter gesetzt.
2. Haken „Abweichende Lieferadresse“ mit leeren Einzelfeldern Name, Straße, PLZ, Ort, Land (gleiche Liste, frei wählbar, auch anderes Land als die Bestellerin). Pflicht nur mit Haken.
3. „Preis und Bezahlung klären wir persönlich“ ist überall raus. Stattdessen Preis in den Kacheln und „Preis und Raten siehst du unten bei der Bezahlung“.
4. Bezahlung je Formular: Teil „LeveLuk K8 und ANESPA DX“ (Überweisung oder 3/6/10/16/24 Raten wie bisher) und Teil „emGuarde Go“ (Überweisung oder 10 Raten, Gebühr 100 €, Zahltag 1. oder 15.). Nur was bestellt ist, wird gezeigt. IBAN und BIC einmal, sobald irgendwo Raten. Ausweis sobald irgendwo Raten oder Distributor.
5. emGuarde mit Anzahl Sets und dem Hinweis „Höchstens 5 emGuarde je Bestellung.“ (keine Sperre).
6. Preise netto, MwSt und Versand nach Lieferland, Gesamtbetrag je Formular sichtbar. Kein Hinweis, dass Preise je Land verschieden sind.
7. **Fehler behoben, der auch live ist:** Das Unterschriftsfeld wurde beim Laden vermessen, als es wegen der Länderwahl noch ausgeblendet war (Größe 0). Jetzt wird es neu vermessen, sobald es sichtbar wird.

**Bot und Trigger**
1. Preise, MwSt, Versand nach Lieferland (ersetzt `versandVon()`, AT jetzt EU-Satz).
2. Lieferadresse ins K8-Formular: `Shipping1` „Straße, LAND-PLZ Ort“, `Shipping2` Name. Ältere Bestellungen mit Freitext `liefer_adresse` gehen weiter.
3. „Lieferung nach: …“ in der Bestellmeldung und in der Fertig-Nachricht, nur wenn abweichend.
4. emGuarde-Bestellformular mit derselben Sponsorwahl, Linie und Unterschrift. Alle Kästchen selbst angekreuzt (nach `flatten`), bei mehr als einem Set steht „N Sets“ neben dem Preis.
5. emGuarde-Ratenantrag bei `zahlung_emguarde = 'raten'`: Gesamtbetrag, Monatsrate (Gesamt minus Anzahlung durch 10), Gebühr 100, Zahltag, SlimPay, IBAN, BIC, Unterschrift. Die Auswahlknöpfe im PDF heißen alle „Choice1“ und lassen sich nicht wählen, die Punkte setzt der Bot selbst. Feldnamen und Lagen habe ich mit pdf-lib gegengeprüft.
6. Ein Gerät, ein Formularsatz, **eine** Mail. Anhangsliste aus den wirklich erstellten Formularen. Betreff und Enagic-Text nennen alle Produkte auf Englisch.
7. Nur emGuarde: normaler Ablauf mit Formular. „Persönlich klären“ nur ohne K8, ANESPA und emGuarde.
8. Mehr als 5 emGuarde: Hinweis in Meldung und Fertig-Nachricht, kein Abbruch.
9. „Im Formular …“ je Formular eine Zeile.
10. Distributorenvertrag und Nicht-EU-Zusatz kommen einmal vor das erste Bestellformular (bei nur emGuarde vor das emGuarde-Formular).
11. Beträge des emGuarde-Formulars werden in `angaben.emguarde` gespeichert, die des K8-Formulars wie bisher direkt in `angaben`.

## Getestet (hier, ohne euer System)

- Bestellseite im Browser (Chromium) mit abgefangener Datenbank: die vier Fälle aus dem Auftrag plus „Land ändern“. Beträge und gespeicherte Felder stimmen, keine Seitenfehler. Am Handy angesehen.
- Bot mit Deno: Typprüfung ohne Fehler. Die vier Fälle mit den echten Formularen durchgespielt, alle Prüfungen bestanden. PDFs angesehen: Kreuze, Beträge, Lieferzeile, Unterschriften und Daten sitzen.
- SQL in einer Postgres-Testdatenbank nach 26 und 26b eingespielt, zweimal hintereinander ohne Fehler. Meldungen für alle vier Fälle und „kein Gerät“ geprüft.
- Nicht getestet: echtes Telegram, Mailversand, Supabase-Speicher. Dafür der Testablauf in EINBAU.md.

## Offen, bitte mit Daniel klären

- **Anzahlung emGuarde-Raten:** Im Auftrag steht keine. Der Bot lässt das Feld leer und rechnet die Monatsrate ohne Anzahlung (Gesamt durch 10). Gibt es eine feste Anzahlung?
- **Start- und Enddatum der Raten:** Der K8-Ratenantrag hat sie im Live-Bot nicht berechnet (leer, außer jemand trägt sie im Dashboard ein). Für emGuarde deshalb genauso leer. Wenn sie gefüllt werden sollen: Regel nennen (laut Formular „starten einen Monat nach Registrierung“).
- **K8-Ratentabelle** gilt nur für 5.486 € und 4.657 €. Für K8 mit ANESPA, Lieferung nach AT und andere Summen fehlen Anzahlung und Monatsrate.
- **Nicht-EU-Zusatz:** Er hängt weiter am Land der Bestellerin. Muss er auch dazu, wenn jemand aus der EU in die Schweiz liefern lässt (Fall b)?
- **Anzahl emGuarde:** Ich zähle Sets (je 2 Geräte), wie Preis und Formular. „Höchstens 5“ gilt hier also für 5 Sets. Falls 5 Geräte gemeint sind, ist das die Hälfte.
- **„Anderes Land“ als Lieferland:** kein Versandsatz bekannt, Feld bleibt leer.
- **Dashboard:** „Vertrag erstellen“ im Dashboard kennt emGuarde und die neue Rechnung noch nicht. Nicht Teil des Auftrags.

<!--
  BESTELLSEITE MIT PRODUKTKACHELN, Stand 23.10.2026
  FERTIG: index.html und bestellen.js der echten Bestellseite mit drei wählbaren Produktkacheln (K8, ANESPA DX, emGuarde Go), heller Kopf.
  FEHLT:  Schweizer Preise für emGuarde und ANESPA DX, Genehmigung Enagic für Bilder mit Enagic-Logo, Telegram-Zeile (SQL unten).
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

- Der Block „Dein Gerät“ ist jetzt „Was möchtest du bestellen?“ mit drei Kacheln:
  LeveLuk K8, ANESPA DX, emGuarde Go. Klick auf ein Bild öffnet ein Fenster mit Infos.
  Jede Kachel hat unten „Auswählen“. Der K8 ist vorausgewählt, lässt sich aber abwählen
  (zum Beispiel wenn jemand nur emGuarde bestellt). Mindestens ein Produkt muss gewählt sein.
- **Neu, wichtig fürs Dashboard:** In `daten` steht jetzt `k8` mit `"ja"` oder `"nein"`.
  Bei `"nein"` kein K8-Formular für Enagic ausfüllen. Ältere Bestellungen ohne das Feld sind K8-Bestellungen.
  Ohne K8 zeigt der Block „Bezahlung“ keinen K8-Preis, sondern: Preis und Bezahlung klären wir persönlich.
- **Land zuerst:** Oben steht „Wo wohnst du?“ mit Flaggen. Erst nach der Wahl erscheint der Rest der Seite.
  Reihenfolge: bei `?von=daniel` Schweiz, Deutschland, Österreich, sonst Deutschland, Schweiz, Österreich,
  dazu „Anderes Land“ mit Auswahlliste. Die Wahl setzt das vorhandene Feld `land_kurz`, es kommt kein neues Feld dazu.
  Für Österreich und andere Länder gibt es noch keine Preise (Fragen D22 bis D24), dort steht „Preis persönlich“.
  Bewusst steht nirgends, dass die Preise je Land verschieden sind (Jasmin, 23.10.2026).
- **Preise netto:** Kacheln zeigen den Preis ohne MwSt. mit „zzgl. MwSt.“ (K8 Deutschland 4.612 €). Im Block „Bezahlung“
  steht „4.612 € zzgl. 874 € MwSt.“ und klein der Gesamtbetrag 5.486 €. „Versand aus Düsseldorf“ ist überall raus.
  Rechtlich offen (Frage D25).
- **emGuarde hervorgehoben:** Reihenfolge jetzt K8, emGuarde Go (Mitte, Band „Unsere Empfehlung“), ANESPA DX.
  Text des Bands im Feld `empfehlung` in `PRODUKTE`.
- **Newsletter:** freiwilliger Haken `newsletter` (Wert `"on"`), landet in `daten`. Bitte so einbauen:
  1. Nach der Bestellung nur bei `newsletter = "on"` eine eigene Mail mit Bestätigungslink schicken (Double-Opt-in).
  2. Erst nach dem Klick in die Newsletter-Liste aufnehmen. Zeitpunkt von Anmeldung und Bestätigung speichern.
  3. Ohne Haken keine Werbemails, nur die Bestellmails.
  Newsletter-Programm ist noch offen (Frage D27).
- **Haken unten neu:** nur noch ein Pflicht-Haken (AGB, Link auf `website/agb-enagic.pdf`, Datei fehlt noch, Frage D28)
  und der Newsletter-Haken (nicht vorausgewählt, so verlangt es das Recht). Den Haken „Weitergabe an Enagic“ gibt es nicht mehr,
  die Weitergabe steht als Hinweis unter dem Bestellknopf. Sie ist für den Vertrag nötig und braucht keine eigene Einwilligung (Anwalt bestätigt das mit D25/D27).
- **WhatsApp-Kanal:** Kasten „Dein Begleiter für ein gesünderes Leben“ mit vier Vorteilen und Knopf „Jetzt kostenlos folgen“ auf der Danke-Seite. In `bestellen.js` bei `KANAL` den echten Link
  statt `XXX` eintragen (Frage D30). Gern auch in die Bestätigungsmail (`mail-senden`). Vorschau: `bestellen/#danke`.
- **Impressum und Datenschutz:** neue Seiten `website/impressum/`, `website/datenschutz/` mit `website/recht/recht.css`.
  Entwürfe mit gelben Lücken (Fragen D26, D29). Mit hochladen, Fußzeile der Bestellseite verlinkt darauf.
- **Schriften selbst gehostet:** `website/schriften/` (Inter, Jost). Es wird nichts mehr von Google geladen. Mit hochladen.
  Gilt am besten auch für den Fragebogen und das Dashboard.
- Text „Wie möchtest du kaufen?“ erklärt jetzt Kunde und Vertriebspartner (Distributor). Die Werte bleiben `Verbraucher` und `Distributor`.
- Kopf der Seite jetzt hell (statt dunkelgrün), Logo `logo-oliv.png`. Auswahlfelder (Kaufart, Bezahlung,
  Haken) sind eigene Kreise und Kästchen: leer = weiß, gewählt = Oliv.
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
|| case when (new.daten->>'k8') = 'nein' then E'\nOHNE K8, nur Ergänzungen' else '' end
|| case when (new.daten->>'zusatz_emguarde') = 'on' or (new.daten->>'zusatz_anespa') = 'on'
     then E'\nDazu gewünscht: ' || concat_ws(', ',
       case when (new.daten->>'zusatz_emguarde') = 'on' then 'emGuarde Go' end,
       case when (new.daten->>'zusatz_anespa') = 'on' then 'ANESPA DX' end)
     else '' end
```

Gern auch im Dashboard unter Bestellungen anzeigen.

## 4. Nicht automatisch an Enagic

emGuarde und ANESPA DX gehen nicht in das K8-Bestellformular. Bei `k8 = "nein"` gibt es gar kein K8-Formular. Daniel klärt Preis, Zahlung und
Bestellung mit dem Kunden selbst. Die Bestätigungsmail an den Kunden (`mail-senden`) kann einen Satz bekommen:
„Zu deinen gewünschten Ergänzungen melden wir uns persönlich bei dir.“

## 5. Noch offen

- Schweizer Preise für emGuarde und ANESPA DX
- Die Produktbilder (bilder/k8.jpg, anespa.jpg, emguarde.jpg) sind KI-Bilder, zeigen aber das Enagic-Logo. Genehmigung klären (Frage D7). Ordner `bilder/` mit hochladen.
- emGuarde laut Shop nur bei Vorauszahlung, obwohl „10 Zahlungen“ angezeigt wird: mit Daniel klären.

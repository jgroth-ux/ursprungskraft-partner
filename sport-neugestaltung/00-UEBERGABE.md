# Übergabe: Sportseiten, E-Books und Backoffice (Kevin Wolter, Johny Yusupov)

Stand: 10.11.2026. Von Claude für Jasmin. Alles ist fertig gestaltet, geprüft und zum Einspielen bereit.
Die technische Anbindung des Backoffice (Datenbank, Leads aus dem Telegram-Bot) macht der andere Claude.

## Was in diesem Paket ist

| Ordner oder Datei | Was es ist | Was damit passiert |
|---|---|---|
| `01-landingpage/` | **Die beiden Landingpages** in Anthrazit, fertig gebaut: `partner/kevin/index.html`, `partner/johny/index.html`, dazu Vorlage, Gestaltung, Bilder, Schriften, Videos und die E-Book-PDFs zum Herunterladen | kommt eins zu eins auf den Server (siehe unten) |
| `02-ebook/` | **Die beiden E-Books**: `ebook-kevin.pdf`, `ebook-johny.pdf` (je 14 Seiten A4), dazu alle Quellen zum Neubauen in `quellen-html/` | PDFs liegen zusätzlich schon in `01-landingpage/partner/ebook/` |
| `06-backoffice/` | **Das Backoffice** für Partner: Anmeldung, Zahlen, Verlauf, Liste der Anmeldungen. Grundlage für alle Gruppen (Sportler, später Heilpraktiker, Osteopathen) | geht an den anderen Claude zur Anbindung |
| `vorschau/` | Drei Einzeldateien **nur zum Ansehen und Weitergeben** (Doppelklick genügt): beide Landingpages und das Backoffice mit Beispieldaten | nicht auf den Server |
| `ERGEBNIS.md` | Prüfbericht: alle Änderungen, alle Tests mit Beleg, offene Fragen | lesen |
| `_pruefung/` | Bildschirmfotos (Computer, Tablet, Handy) und alle E-Book-Seiten im Überblick | zum Nachschauen |
| `03-marke/`, `04-neuer-stil/`, `05-quellen/`, `AUFTRAG.md` | das ursprüngliche Material (CI, Stilvorlage Schaltzentrale, Wissensbasis, Auftrag) | unverändert |
| `PHASE-1-…`, `PHASE-2-…` | Zwischenstände vom Anfang, überholt | nur zur Nachvollziehbarkeit |

## Landingpages online stellen

1. Auf dem Server liegt heute die alte Fassung unter `…/partner/kevin/` und `…/partner/johny/`.
2. Aus `01-landingpage/` ersetzen bzw. ergänzen:
   - `partner/empfehlung.css` (neu), `partner/empfehlung.js` (unverändert, darf trotzdem mit)
   - `partner/_vorlage/` (Vorlage, `partner.json`, `bauen.py`)
   - `partner/kevin/index.html`, `partner/johny/index.html`
   - `partner/ebook/ebook-kevin.pdf`, `partner/ebook/ebook-johny.pdf`
   - `bilder/partner/ebook-kevin.jpg`, `bilder/partner/ebook-johny.jpg` (neue Cover-Vorschau)
   - Alle übrigen Bilder, Videos, Untertitel und Schriften sind unverändert.
3. In `partner/empfehlung.js` die echten Werte statt `XXX` eintragen (wie bisher, die Logik ist unverändert).
4. Danach im Browser prüfen: Seite lädt, Rechner zeigt bei 90 kg 3,6 Liter, ein Testeintrag kommt im Telegram-Bot an, das E-Book öffnet sich nach dem Formular.

Ändert sich später ein Text: in `partner/_vorlage/seite.html` oder `partner.json` ändern und `python3 partner/_vorlage/bauen.py` laufen lassen.
Nie nur `kevin/index.html` von Hand ändern.

## E-Books neu bauen (zum Beispiel nach neuen Fotos)

Im Ordner `02-ebook/quellen-html/` (Anleitung auch in `LIESMICH.md` dort):

    python3 bauen.py
    node pdf-erzeugen.js "$PWD/ebook-kevin.html" "$PWD/../ebook-kevin.pdf"
    node pdf-erzeugen.js "$PWD/ebook-johny.html" "$PWD/../ebook-johny.pdf"

Danach die PDFs nach `01-landingpage/partner/ebook/` kopieren und die Cover-Vorschau `bilder/partner/ebook-*.jpg` neu erzeugen
(Seite 1 des PDFs als Bild, 744 × 1053 px).

## Backoffice: was der andere Claude braucht

Alles steht in `06-backoffice/SCHNITTSTELLE.md`. Kurz:
- Die Oberfläche ist fertig. Für den Echtbetrieb wird nur die Datenquelle getauscht (`quelle-vorschau.js` gegen `quelle-supabase.js`).
- Die Datenbank muss für den angemeldeten Partner **nur seine eigenen** Anmeldungen liefern, mit Datum, Vorname, Anfangsbuchstabe, Ort, Land, Wunsch und Stand. **Nie** Telefon, E-Mail oder Nachname.
- Eigene Adresse, zum Beispiel `…/backoffice/`, nicht über die Landingpage verlinkt.
- Prüfliste vor dem Start steht am Ende der Datei.

Neuer Sportler im Backoffice: ein Eintrag in `06-backoffice/konfig-sport.js`. Neue Gruppe: `konfig-vorlage.js` kopieren und füllen
(Anleitung in `06-backoffice/LIESMICH.md`).

## Was vor dem Start noch offen ist

1. **Datenschutz:** In Datenschutzerklärung und Einwilligung im Formular ergänzen, dass der Sportler im Backoffice Vorname,
   Anfangsbuchstabe, Ort und Stand sieht (keine Kontaktdaten). Am besten von jemandem prüfen lassen, der sich mit Datenschutz auskennt.
2. **Fotos:** Lieblingsfotos von Kevin und Johny (ab etwa 2000 px Höhe) und neue Bilder für die neun Platzhalter mit dem Model.
   Dateinamen und Größen stehen in `ERGEBNIS.md` unter „Offene Fragen“.
3. **Inhaltsfragen zum E-Book** aus `02-ebook/offene-fragen.md` sind weiterhin offen (unverändert übernommen).
4. **Hinweis zu Kevins Text:** In `partner.json` steht „mit über 800.000 Followern“. Das zählt Instagram-Follower und YouTube-Abonnenten zusammen. Nicht geändert.

## Nicht geprüft

- Absenden der Formulare an Supabase und Telegram (Schlüssel im Paket `XXX`)
- echte Handys sowie Safari und Firefox (geprüft in Chromium bei 1440, 768, 375 und 320 px)
- PDF-Erzeugung mit Chrome auf dem Mac (erzeugt mit Playwright und Chromium)
- Backoffice im Echtbetrieb (Datenbank und Schlüssel liegen nicht im Paket)

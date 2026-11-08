# Partnerportal neu und Backoffice: Ergebnis (08.11.2026)

Das Partnerportal ist komplett neu gestaltet und neu gebaut. Jasmin wollte ein fertiges Ergebnis zum Korrigieren
statt erst eines Entwurfs der Startansicht. Deshalb ist Schritt 2 (Konzept vorlegen und anhalten) übersprungen und
alles fertig gebaut. Getestet ist alles lokal im Vorschau-Modus mit Probedaten. Nichts ist veröffentlicht.

## So siehst du es dir an

Ordner `website/` neben den Bestand legen (die Pfade `../schriften/`, `../vendor/`, `../bilder/` bleiben wie bisher)
und `partner/?vorschau` öffnen. Ohne `?vorschau` spricht das Portal mit der echten Datenbank.

| Adresse | Was du siehst |
|---|---|
| `partner/?vorschau` | angemeldet, mit Terminen, Kunden, Bestellungen und Neuigkeiten |
| `partner/?vorschau=leer` | angemeldet, ohne Termine und Kunden: der Kalender bleibt unsichtbar |
| `partner/?vorschau=gesperrt` | Testzeit abgelaufen, nur Kunden und Termine frei: gesperrte Bereiche zeigen "Freischalten" |
| `partner/?vorschau=anmelden` | Anmelden und Registrieren |
| `partner/?vorschau=normal` | gewöhnliches Partnerkonto: kein Schalter, `#bo` führt zurück zum Start |
| `partner/?vorschau#bo` | Backoffice als Jasmin (Beispieldaten aus `daten.js`, Demo-Modus) |
| `partner/?vorschau&als=daniel#bo` | Backoffice als Daniel |
| `partner/?vorschau&bo-anmelden#bo` | Backoffice mit der ersten Anmeldung |

Für das Backoffice braucht die Vorschau den Ordner `../dashboard/` (daten.js, Formulare, Wohnungsbilder) und
`../fragebogen/fragen.js` wie auf dem Server.

Alle Namen in den Probedaten sind erfunden. Im Vorschau-Modus wird nichts gespeichert und nichts verschickt.

## Was gebaut ist

**Aufbau wie eine App.** Am Computer ein dunkles Menü links, am Handy eine Daumenleiste unten mit Start, Kunden,
Termine, Werkzeuge und Mehr. Alle Tippflächen mindestens 55 px hoch, keine Tabelle scrollt quer.

**Look Oliv und Gold** aus dem Partner-Symbol abgeleitet (Farbwerte unten). Gold nur als Linie, Marke und Schrift
auf Dunkel, nie als Fläche hinter Text. Jost nur in Überschriften, Fließtext Inter, beide selbst gehostet.
Größen gerechnet: Schriftleiter 16 × 1,272 (13, 16, 20, 26, 33, 42, 53, 68), Abstände Fibonacci
(8, 13, 21, 34, 55, 89, 144), alles als CSS-Variablen in `portal.css`.

**Bereiche**

| Bereich | Inhalt |
|---|---|
| Start | Begrüßung mit Datum, ein Satz zum Tag, **nächste Termine** heute und die nächsten 14 Tage mit Uhrzeit, Adresse, Knopf **Route** (Google Maps) und **Anrufen**. Fällige Rückrufe stehen bei "Heute". Monatsansicht rechts (Computer) bzw. Wochenleiste oben (Handy, Tablet), beides nur, wenn es Termine gibt. Neuigkeiten von Daniel und Jasmin. Werkzeuge als drei Bildkacheln in der richtigen Reihenfolge. Keine Rangliste, keine Verkaufszahlen. |
| Kunden | Kundendatenbank: Stand-Leiste mit Zahlen (Alle, Neu, Kontaktiert, Termin, Gekauft, In Betreuung) als Filter, Suche, Filter Heute melden, Heiß, Warm, Kalt, Kein Interesse. Liste links, Karteikarte rechts (am Handy eigene Seite). Karteikarte: Anrufen, WhatsApp, E-Mail, Termin mit einem Tipp, Stand und Stufe mit einem Tipp, **Bestellstand als Schrittleiste** (Bestellt, An den Hersteller raus, Gerät da), nächster Schritt mit Wieder melden am, Verblieben und neuer Notiz, Termine mit dieser Person, Notizen als Verlauf, Angaben, Angaben ändern, ablegen bei kein Interesse. Interessenten der Seite (auch E-Book und nur umschauen) und Käufer über den Link kommen automatisch. |
| Termine | Monatsansicht (Punkte für Termine und Rückrufe), Tag antippen zeigt den Tag, Liste der nächsten Wochen, Termin eintragen im Fenster, Termin löschen, vergangene 30 Tage aufklappbar. Kalender-Abo (iPhone, Google, Link kopieren) direkt unter der Monatsansicht. Ohne Termine: kein Kalender, nur "Ersten Termin eintragen". |
| Werkzeuge | In Jasmins Reihenfolge: 1 Wasser-Check-Seite (Link, kopieren, ansehen, per WhatsApp teilen, Seite einrichten), 2 Flyer, 3 Bestell-Link mit Erklärung "Schick diesen Link deinen Kunden. Wer darüber bestellt, wird dir zugeordnet.", QR-Code, Zahl der Bestellungen, "Wer kümmert sich um die Bestellung?", 4 Telegram-Assistent. |
| Flyer | Vier Schritte: 1 Motiv als **große Bildkacheln**, 2 Text, 3 Formate und Farben, 4 Vorschau. **Jede Vorschau öffnet per Tipp groß**, mit Blättern zwischen den Formaten und Speichern je Format. Logik in `flyer.js` unverändert. |
| Wissen | Unterlagen mit Titelbild, Ansehen und Weitergeben. Produktwissen als Karten je Gerät. Einwände mit Antworten (Entwurf). |
| Neuigkeiten | Alle Meldungen von Daniel und Jasmin. Ungelesene als Zahl im Menü und Punkt an "Mehr". |
| Mehr für dein Geschäft | Vier große Bildkacheln mit Nutzen, drei Punkten, "Was kostet es? [Preis folgt]" und "Interesse melden". |
| App aufs Handy | Selbst gebaute Grafik: iPhone und Android mit echten Bildschirmfotos des Portals, daneben das App-Symbol und die Anleitung für beide. |
| Konto | Name, E-Mail, Enagic-ID, Kürzel, Testzeit, Passwort (Mail), Abmelden. |

**Freischalten und Sperren.** Jeder Bereich (Kunden, Termine, Wasser-Check-Seite, Flyer, Assistent, Wissen) lässt sich
je Partner freischalten. Die Anmeldung liefert `zugang = {bereiche, test_bis}`. In der Testzeit ist alles frei, die
Tage stehen im Menü. Ein gesperrter Bereich zeigt Foto, Nutzen, "Preis: [Preis folgt]" und "Freischalten" (Mail an
info@ursprungskraft.net), keine Fehlermeldung. Solange `bereiche` leer ist (noch nicht entschieden), ist alles frei.
Start, Bestell-Link, Neuigkeiten, Konto und "Mehr für dein Geschäft" sind immer frei.

**App-Symbol** aus dem Partner-Symbol in `partner/symbol/`: 192, 512, maskierbar 512 (Kreis in der sicheren Zone),
Apple 180, Favicon 32 und 48, dazu das freigestellte Symbol für Menü und Kopfleiste. Das Portal nutzt nicht mehr die
Symbole aus `../dashboard/`.

## Farbtokens (aus dem Partner-Symbol)

| Token | Wert | Wofür | Kontrast |
|---|---|---|---|
| `--nacht` | #1E2513 | Menü, Daumenleiste, Großansicht | Creme darauf 13,1 : 1 |
| `--oliv-tief` | #2A3319 | dunkle Kästen (Neuigkeiten, gesperrt) | Creme darauf 11,0 : 1 |
| `--oliv` | #3F4B25 | Knöpfe, Links | Weiß darauf 9,4 : 1 |
| `--oliv-hell` | #9CA47B | Symbole und Nebentext auf Dunkel | 5,0 : 1 auf Oliv-tief |
| `--gold` | #CDAE6B | Gold auf Dunkel (Ring des Symbols) | 7,4 : 1 auf Nacht |
| `--gold-tief` | #7A6130 | Gold auf Hell: Kicker, Linien, Nummern | 5,1 : 1 auf Creme |
| `--creme` | #F4EEDF | Seitengrund | |
| `--creme-hell` | #FAF6EC | Karten | |
| `--tinte` | #1F2414 | Fließtext | 13,7 : 1 auf Creme |
| `--grau` | #5C5E4B | Nebentext | 5,8 : 1 auf Creme |
| `--rot` | #9A3B2E | Fehler, [FEHLT], heiß | 6,0 : 1 auf Creme |

Alle Textpaare erfüllen WCAG AA (mindestens 4,5 : 1).

## Funktionen alt und neu

Nummern wie in `SCHRITT-1-BESTAND.md`. Alle 58 Funktionen (A bis G) sind da, die 6 Abläufe im Hintergrund (H) laufen unverändert weiter.

| Nr | Alt | Neu |
|---|---|---|
| A1 bis A6 | Anmelden, Fehlertexte, Passwort vergessen, Registrieren mit Hinweis, Fehlertexte, `#registrieren` | Anmeldeseite mit Foto links, Reiter Anmelden und Neu registrieren, gleiche Funktionen, gleiche Texte |
| A7 | Freigabe per partnerbot | unverändert, neu zusätzlich 14 Tage Testzeit bei Freigabe |
| A8 | Sitzung im Browser | unverändert (`uk-partnerportal`) |
| A9 | Abmelden ganz unten | Menü unten links, am Handy unter Mehr, Konto |
| A10 | "Hallo Vorname" | Start: "Guten Morgen", "Hallo" oder "Guten Abend" mit Vorname |
| B1, B2 | Telegram-Fenster `#tg=`, Flyer in den Chat | unverändert, springt direkt in "Flyer" |
| C1 | App-Hinweis | eigener Bereich "App aufs Handy" mit Handy-Grafik, Tipp-Kachel auf Start, verschwindet als App |
| C2 bis C7 | Bestell-Link, kopieren, ansehen, QR speichern, Enagic-ID, Zahl der Bestellungen | Werkzeuge, Schritt 3, mit Erklärung |
| C8, C9 | Wasser-Check-Seite und Baukasten | Werkzeuge, Schritt 1, dazu Per WhatsApp teilen |
| C10 | Assistent verbinden | Werkzeuge, Schritt 4 |
| C11 | Kalender-Abo | unter der Monatsansicht in Termine, nur wenn es Termine gibt |
| C12 | Wer kümmert sich um die Bestellung? | Werkzeuge, Schritt 3 |
| C13 | Material (Platzhalter) | Bereich Wissen mit echten Unterlagen |
| C14 | Mehr für dein Geschäft (drei Textkacheln) | eigener Bereich mit vier großen Bildkacheln |
| D1 bis D14 | Meine Kontakte | Kunden: alle alten Funktionen, dazu Stand, Stufe, Bestellstand, Leads der Seite, Angaben ändern (auch Name), Schnellknöpfe |
| D3 | Status Interessent, Testet, Kunde, Kein Interesse | Stand neu, kontaktiert, Termin, gekauft, in Betreuung; Kein Interesse heißt "ablegen" |
| E1 bis E4 | Termine | Termine mit Monatsansicht, Fenster zum Eintragen, Löschen, Abo |
| F1 bis F11 | Flyer | alle da; Motive groß, Vorschau groß, Reihenfolge Motiv, Text, Formate |
| G1 bis G3 | Manifest, Apple, noindex | eigenes Manifest mit eigenen Symbolen, dunkle Statusleiste, noindex |
| H1 bis H6 | Hintergrund | unverändert; alte Funktionen bleiben bestehen |

## SQL und Edge Function: Reihenfolge zum Einspielen

0. Bereits vorhanden und unverändert: alle älteren SQL-Dateien.
1. `supabase/umbau-2026-11-08c-partnerportal-neu-zugang.sql` (Spalten `bereiche`, `test_bis`, neue `uk_partner_daten`)
2. `supabase/umbau-2026-11-08c-partnerportal-neu-kunden.sql` (Spalten `partner_stand`, `partner_stufe` an `uk_kunden`,
   `uk_partner_bestellstand`, `uk_partner_kunden`, `uk_partner_kunde_speichern`)
3. `supabase/umbau-2026-11-08c-partnerportal-neu-neuigkeiten.sql
supabase/umbau-2026-11-08d-partnerportal-neu-team.sql` (Tabelle `uk_neuigkeiten`,
   `uk_partner_neuigkeiten`, `uk_neuigkeit_veroeffentlichen`)
4. `supabase/umbau-2026-11-08d-partnerportal-neu-team.sql` (Spalte `team`, setzt Partnerkonten mit Dashboard-Zugang
   automatisch auf Team, neue `uk_partner_daten` mit allen Feldern plus `team`). Muss **nach** Nummer 1 laufen.
5. Edge Function `supabase/functions/partnerbot/index.ts` veröffentlichen (Verify JWT bleibt aus)
6. Website `partner/` hochladen. Der Platzhalter `sb_publishable_XXX` in `partner.js` muss wieder ersetzt werden.
   `../dashboard/` bleibt unverändert online, das Backoffice nutzt daraus `daten.js`, `formulare/` und `wohnung/`.

Alle vier SQL-Dateien dürfen mehrfach laufen und ändern keine alte Datei. Sie sind lokal gegen ein nachgebautes
Grundschema (Postgres 16) geprüft: Partner sehen nur ihre eigenen Kunden, stornierte Bestellungen erscheinen nicht,
Bankdaten aus `uk_bestellungen.daten` werden nicht herausgegeben, eine Neuigkeit lässt sich nur einmal
veröffentlichen, die Funktion zum Veröffentlichen ist für `anon` gesperrt.
Fehlen die neuen Funktionen noch, läuft das Portal mit den alten weiter (Kontaktliste über `uk_partner_kontakte`).

**partnerbot, was neu ist:** Schreiben Daniel oder Jasmin dem Bot einen Text (ab 8 Zeichen, kein Befehl), fragt er
"Als Neuigkeit an alle Partner?" mit "Ja, an alle Partner" und "Nein". Erst nach "Ja" steht die Neuigkeit im Portal
und geht per Telegram an alle Partner mit verbundenem Assistenten. Danach verschwinden die Knöpfe.
Bei der Freigabe setzt er `test_bis` auf heute plus 14 Tage, als eigenen Schritt: fehlt die Spalte noch, bleibt die
Freigabe trotzdem gültig. `partner-assistent`, `partner-kalender` und `partner-lead` sind unverändert.

## Geprüft nach "Fertig heißt"

| Punkt | Ergebnis |
|---|---|
| Jede Funktion aus Schritt 1 da und erreichbar | ja, Tabelle oben |
| Flyer-Vorschau öffnet groß, Motive als Bildkacheln | ja, Klicktest "Großansicht offen" und "Blättern" |
| Kalender ohne Termine unsichtbar, mit Terminen Monatsansicht und Abo | ja, Klicktests mit `?vorschau=leer` und `?vorschau` |
| Kundendatenbank mit Interessenten, Käufern mit Bestellstand, eigenen Kontakten | ja |
| Bestell-Link mit Erklärung, Reihenfolge Seite, Flyer, Bestell-Link | ja |
| App-Symbol in allen Größen, Handy-Demo eingebaut | ja |
| Kein zentrierter Textblock | ja. Einzige Mittelachse: die Wochentage über den Spalten der Monatsansicht und die Zahlen darin (Raster, kein Textblock) |
| Keine Gedankenstriche | Suche nach U+2013 und U+2014 in allen HTML, CSS, JS, SQL, TS und MD: 0 Treffer |
| Bildschirmfotos 375, 768, 1440 px | `bildschirmfotos/partner-*` (Start in 375, 768 und 1440, dazu alle Bereiche) |
| Keine Fehler in der Konsole | 0 Fehler und 0 Warnungen in allen Bereichen und drei Breiten, kein waagrechter Überlauf |
| Klicktests | 21 von 21 bestanden: Anmelden, Registrieren, Stand, Notiz, Stufe, Filter, Suche, neuer Kunde, Termin anlegen, Tag wählen, Flyer groß, Blättern, gesperrt, leer, gelesen, Abmelden |

## Offen und zum Prüfen

1. **Detox-Programm** (`unterlagen/detox-programm.pdf`) empfiehlt pH 2,5 und pH 11,5 **zum Trinken**. Das
   widerspricht der Regel. Im Portal steht es mit dem Hinweis "noch nicht weitergeben", ohne Weitergeben-Knopf.
2. **Wegweiser** (`unterlagen/wasser-wegweiser.pdf`) hat eine Seite "Vorteile für die Gesundheit" mit
   Heilaussagen. Gleich behandelt wie das Detox-Programm.
3. **Zinzino-Start** ist nicht aufgenommen (kein Enagic-Produkt). Eine Zeile in `wissen.js`, falls doch gewünscht.
4. **K8:** Preis, Raten, Garantie, Maße fehlen. **ANESPA DX:** fast alles fehlt. Steht als [FEHLT: ...] rot im Portal.
   Die K8-Angaben (8 Platten, 5 Wasserarten, Reinigung) stammen aus Wasser-Guide und Reinigungsanleitung.
5. **Einwände** sind Entwürfe und so markiert. Daniel und Jasmin bitte prüfen.
6. **Preise** für "Mehr für dein Geschäft" und gesperrte Bereiche: überall [Preis folgt].
7. **Freischalten** läuft über eine Mail an info@ursprungskraft.net. Ein Bezahlweg ist nicht gebaut.
8. **Welche Bereiche kostenlos sind**, ist noch offen. Bis dahin `bereiche` leer lassen, dann ist alles frei.
   Testzeit für bestehende Partner bei Bedarf von Hand setzen (Beispiel in der SQL-Datei).
9. **"Gerät da"** liest `uk_kunden.status = 'Geliefert'` oder `geliefert_am`. Steht eine Bestellung nicht bei einem
   Kunden (`kunde_id` leer), zeigt das Portal sie trotzdem als Käufer, nur ohne Notizen, bis Daniel sie zuordnet.
10. **Stand "Testet"** gibt es nicht mehr. Alte Kontakte mit "Testet" erscheinen als "Kontaktiert".
11. **Bilder:** Für Produktwissen sind die emGuarde-Bilder und das K8-Glas aus dem Repo genommen, sonst nur Flyer-Motive.
12. **`editor.html` und `editor.js`** sind unverändert, weil `flyer.js` unverändert ist.

## Dateien

```
website/partner/index.html             neu
website/partner/portal.css             neu (Gestaltung, vorher im HTML)
website/partner/partner.js             neu
website/partner/wissen.js              neu (Unterlagen, Produktwissen, Einwände)
website/partner/vorschau.js            neu (Probedaten, nur mit ?vorschau aktiv, auch Beispiel-Bestellungen fürs Backoffice)
website/partner/backoffice.js          neu (Dashboard-Logik aus dashboard/app.js, Hülle und Übersicht neu)
website/partner/backoffice.css         neu (Dashboard-Bausteine im Portal-Look)
website/partner/manifest.webmanifest   geändert (eigene Symbole, maskierbar)
website/partner/symbol/                neu (App-Symbole)
website/partner/bilder/                neu (Produktbilder, Handy-Demo)
website/partner/unterlagen/            neu (4 PDFs mit Titelbild)
website/partner/flyer.js               unverändert, nicht enthalten
supabase/umbau-2026-11-08c-partnerportal-neu-zugang.sql
supabase/umbau-2026-11-08c-partnerportal-neu-kunden.sql
supabase/umbau-2026-11-08c-partnerportal-neu-neuigkeiten.sql
supabase/umbau-2026-11-08d-partnerportal-neu-team.sql
supabase/functions/partnerbot/index.ts geändert
bildschirmfotos/                       partner-..., team-..., backoffice-... (44 Bilder)
SCHRITT-1-BESTAND.md
ERGEBNIS.md
```

---

# Nachtrag Backoffice (08.11.2026)

Jasmin wollte das Ergebnis komplett sehen, deshalb ist auch das Backoffice gleich fertig gebaut, ohne Zwischenentwurf.
Das alte Dashboard unter `/dashboard/` ist nicht angefasst.

## Aufbau

- **Schalter "Partner | Backoffice"** oben im Menü (Computer) und in der Kopfleiste (Handy), als goldene Schiene, die
  zur gewählten Seite gleitet. Er erscheint nur, wenn `uk_partner_daten` `team = true` liefert.
- **Zwei Anmeldungen bleiben getrennt.** Die Partner-Sitzung öffnet nur den Schalter. Beim ersten Wechsel meldet man
  sich einmal mit dem Dashboard-Zugang an (Supabase wie in `daten.js`). Die Sitzung bleibt auf dem Gerät gespeichert,
  danach wechselt der Schalter ohne Anmeldung. `daten.js` wird erst beim Wechsel geladen, ein normales Partnerkonto lädt
  es nie. Wer als normaler Partner `#bo` eintippt, landet auf Start. Alle Daten kommen weiter nur über die
  Supabase-Anmeldung und Row Level Security.
- **Merken:** Das Portal öffnet dort, wo man zuletzt war (Partner oder Backoffice, im Backoffice der letzte Reiter).
  Daniel hat damit in der Portal-App direkt sein Backoffice.
- **Abmelden:** "Backoffice abmelden" beendet nur die Dashboard-Sitzung. Abmelden aus dem Portal beendet beide.
- **Links aus Einladungs- und Passwort-Mails** (Supabase), die auf `/partner/` zeigen, öffnen eine eigene Seite zum
  Passwort setzen, ohne Partneranmeldung.

**Menü Backoffice (Computer), gruppiert:**
Übersicht · Tagesgeschäft: Aufgaben, Kalender, Bestellungen · Menschen: Kunden, Partner ·
Geräte und Ablage: Testmaschinen, Unterlagen · Zahlen: Auswertung, Meine Zahlen · Privat: Wohnung.
**Leiste unten (Handy):** Übersicht, Aufgaben, Kalender, Bestellungen, Mehr (Rest, Zur Partneransicht, Abmelden).

**Übersicht (neu):** Begrüßung, vier Kennzahlen mit Sprung in den Reiter (Bestellungen warten auf Zuordnung,
Aufgaben für dich heute fällig, Termine heute, Testgeräte zurückholen), Termine heute mit "Route für den Tag",
deine fälligen Aufgaben, Bestellungen zum Zuordnen, Neu von Daniel (nur Jasmin).

**Wohnung:** sehen Daniel und Jasmin (Jasmins Antwort am 08.11.2026), also alle mit Backoffice-Zugang, sonst niemand.
Im heutigen Dashboard war der Reiter ebenfalls für beide sichtbar. Ist das anders gewünscht, reicht in `backoffice.js`
bei `wohnung` die Rolle auf `['admin']` zu setzen.

## Dashboard-Funktionen alt und neu

Grundlage: `dashboard/app.js` und `daten.js` ganz gelesen. Die Logik ist in `backoffice.js` fast wörtlich übernommen,
damit nichts wegfällt. Geändert: Pfade zu `../dashboard/formulare/` und `../dashboard/wohnung/`, Beschriftungen für
Tabellen am Handy, die Anmeldemaske (jetzt im Portal-Look), ein abgesicherter Summen-Rechner (im alten Dashboard warf er
nach dem Schließen einer Bestellung einen Fehler in der Konsole) und " bis " statt eines Gedankenstrichs bei Uhrzeiten.

| Bereich | Funktionen im Dashboard | Im Backoffice |
|---|---|---|
| Anmeldung | Anmelden, Passwort vergessen, Passwort setzen aus Einladungs- und Reset-Link, abgelaufener Link, Abmelden, Rolle admin/team aus `uk_nutzer`, Vorschau mit `?demo` und `&als=daniel` | alles da, Anmeldung im Portal-Look; Vorschau über `?vorschau` (setzt den Demo-Modus von daten.js) |
| Glocke | Neu von Daniels Assistent, Zahl, Liste, einzeln oder alle als gesehen, nur Jasmin | da, oben rechts; zusätzlich Zahl am Menüpunkt Aufgaben und Block auf der Übersicht |
| Aufgaben | Board mit Spalten Eingang, Heute, Morgen, Diese Woche, Nächste Woche, Dieser Monat, Dieses Quartal, Später, Ohne Datum, Erledigt; Filter Person und Priorität; "n neu von Daniel"; Karten ziehen; Haken erledigt; automatische Karten Testgerät abholen und Filterwechsel; Neue Aufgabe je Spalte; Dialog mit Art, Termin von bis, ganztägig, Kunde, Ort, Notiz, Löschen | alles da |
| Kalender | Monat wie bei Apple mit Farben je Art, mehrtägige Termine, Handy mit Punkten und Tagesliste, Liste 7, 14, 31 Tage, Route für den Tag, Hinfahren, Termin per Klick auf einen Tag | alles da |
| Kunden | Suche, Status, Filter Produkt, Land, Partner, Zeitraum, Vermerk, Filterwechsel fällig, zurücksetzen; Tabelle; Dialog mit allen Feldern, Produkte, Vermerke, Gesundheit nur mit Einwilligung, Testmaschinen, Fragebogen-Link und Antworten, offene Aufgaben, Route, Löschen | alles da; am Handy Karten statt Tabelle |
| Testmaschinen | zwei Listen, Kacheln, Ziehen zwischen Listen, Gerät anlegen, Ausgeben an Namen mit Kundenanlage, eigene Nutzung, Zurück bis, Kaufinteresse, Filterwechsel-Liste, Verlauf, Löschen | alles da |
| Bestellungen | Liste, Link zur Bestellseite, Dialog mit Daten und Dateien, Zahlungsbeleg hochladen, Zuordnung und Linie, Beträge mit Summe, Unterschrift des Sponsors, **Vertrag erstellen** (Distributorenvertrag, Nicht-EU, Bestellformular, Ratenzahlungsantrag mit pdf-lib), Mail an Enagic mit Text, Kopieren, Öffnen, als geschickt markieren | alles da; in der Vorschau getestet: Vertrag mit Bestellformular und Ratenzahlungsantrag erstellt |
| Partner | Zahlen, Filter Art, Tabelle mit Link kopieren, Dialog mit Zahlen, verkauften Geräten, Kunden, Linkvorschlag | alles da; am Handy Karten |
| Auswertung | Kennzahlen, Käufe je Monat, Gerät, Empfehlung, Fragebogen-Durchschnitte und Veränderung, Nutzung, Link für neue Tester | alles da |
| Unterlagen | Fragebogen-Link (öffnen, WhatsApp, kopieren), Bereiche, Zugänge mit verdecktem Passwort und Auge, Links, Dateien hochladen und hineinziehen, Vorschaubilder, Öffnen, Teil-Link kopieren, Herunterladen, Bearbeiten, Löschen | alles da |
| Wohnung | Räume mit Bildern, Einkaufslisten, Haken gekauft, Dazu-Feld, Summen je Währung, gespart, offen von Daniel, Schnäppchen, Dialog mit Preisen und Quittung | alles da |
| Meine Zahlen | Daniel alle Verkäufe, Jasmin über ihren Link | alles da |

## Bewegung (für Portal und Backoffice)

Kurz, edel, mit Sinn, keine Leuchtflecken, kein Mausschein, keine Wellen. Bei `prefers-reduced-motion` ist alles aus.
- Bereiche bauen sich auf: die obersten Blöcke kommen nacheinander leicht von unten (55 ms Abstand).
- Begrüßung: Wort für Wort aus einer unsichtbaren Kante, darunter wächst eine goldene Linie.
- Zahlen zählen hoch (Kundenstand, Kennzahlen im Backoffice).
- Lebendiger Kalender: Tage erscheinen als Welle, Punkte springen auf, "heute" atmet einmal.
- Bestellstand: die Linie füllt sich bis zum aktuellen Schritt.
- Bildkacheln: Foto rückt beim Zeigen leicht heran, Kachel hebt sich.
- Schalter Partner | Backoffice: die goldene Schiene gleitet, die Ansicht blendet weich über (View Transitions).
- Glocke schwingt einmal, wenn es Neues gibt. Dialoge und Fenster gleiten herein.

## Geprüft (Backoffice)

| Punkt | Ergebnis |
|---|---|
| Jede Dashboard-Funktion da, auch Vertrag erstellen | ja, Tabelle oben; "Vertrag erstellen" in der Vorschau mit Bestellformular und Ratenzahlungsantrag durchgelaufen |
| Schalter nur bei Team-Konten, normales Konto kommt nicht über die Adresse hinein | ja: `?vorschau=normal` ohne Schalter, `#bo` landet auf Start, daten.js wird gar nicht geladen; SQL `team` lokal geprüft |
| Team sieht nichts, was nur admin sieht | Glocke und "Neu von Daniel" nur für Jasmin; Wohnung für beide wie gewünscht |
| Als Jasmin und als Daniel, Handy und Computer | `bildschirmfotos/backoffice-jasmin-*`, `backoffice-daniel-*` |
| Klicktests | 25 von 25 im Backoffice, 21 von 21 im Partnerportal, keine Fehler oder Warnungen in der Konsole |
| Gedankenstriche | 0 Treffer (U+2013, U+2014) in allen neuen und geänderten Dateien |
| Kontrast | alle neuen Marken und Etiketten mindestens 5 : 1 |

## Offen beim Backoffice

1. `../fragebogen/fragen.js` lag mir nicht vor. Das Backoffice lädt sie wie das Dashboard vom Server. Getestet habe ich
   Auswertung und Fragebogen-Antworten mit einer Ersatzdatei, die nicht mitgeliefert wird.
2. pdf-lib (für Vertrag erstellen) und pdf.js (Vorschaubilder) kommen wie im Dashboard von cdnjs. In meiner Testumgebung
   war cdnjs gesperrt, getestet habe ich mit derselben pdf-lib 1.17.1 aus dem npm-Paket.
3. Die Beispieldaten von `daten.js` haben keine Bestellungen. Damit "Vertrag erstellen" in der Vorschau vorführbar ist,
   ergänzt `vorschau.js` zwei erfundene Bestellungen und einen Dateispeicher im Browser, nur mit `?vorschau`.
4. Passwort-Mails aus dem Backoffice führen zurück auf `/partner/`, aus dem alten Dashboard weiter auf `/dashboard/`.
5. Sobald Jasmin das Backoffice abgenommen hat, kann das alte Dashboard abgeschaltet werden (nicht von mir gemacht).

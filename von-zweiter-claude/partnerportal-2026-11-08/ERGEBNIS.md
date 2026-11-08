# Partnerportal neu: Ergebnis (08.11.2026)

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

1. `supabase/umbau-2026-11-08c-partnerportal-neu-zugang.sql` (Spalten `bereiche`, `test_bis`, neue `uk_partner_daten`)
2. `supabase/umbau-2026-11-08c-partnerportal-neu-kunden.sql` (Spalten `partner_stand`, `partner_stufe` an `uk_kunden`,
   `uk_partner_bestellstand`, `uk_partner_kunden`, `uk_partner_kunde_speichern`)
3. `supabase/umbau-2026-11-08c-partnerportal-neu-neuigkeiten.sql` (Tabelle `uk_neuigkeiten`,
   `uk_partner_neuigkeiten`, `uk_neuigkeit_veroeffentlichen`)
4. Edge Function `supabase/functions/partnerbot/index.ts` veröffentlichen (Verify JWT bleibt aus)
5. Website `partner/` hochladen. Der Platzhalter `sb_publishable_XXX` in `partner.js` muss wieder ersetzt werden.

Alle drei SQL-Dateien dürfen mehrfach laufen und ändern keine alte Datei. Sie sind lokal gegen ein nachgebautes
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
| Bildschirmfotos 375, 768, 1440 px | `bildschirmfotos/` (21 Bilder, Start in allen drei Breiten, dazu alle Bereiche) |
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
website/partner/vorschau.js            neu (Probedaten, nur mit ?vorschau aktiv)
website/partner/manifest.webmanifest   geändert (eigene Symbole, maskierbar)
website/partner/symbol/                neu (App-Symbole)
website/partner/bilder/                neu (Produktbilder, Handy-Demo)
website/partner/unterlagen/            neu (4 PDFs mit Titelbild)
website/partner/flyer.js               unverändert, nicht enthalten
supabase/umbau-2026-11-08c-partnerportal-neu-zugang.sql
supabase/umbau-2026-11-08c-partnerportal-neu-kunden.sql
supabase/umbau-2026-11-08c-partnerportal-neu-neuigkeiten.sql
supabase/functions/partnerbot/index.ts geändert
bildschirmfotos/
SCHRITT-1-BESTAND.md
ERGEBNIS.md
```

# Ergebnis: Partnerportal in Richtung B "Schaltzentrale"

Stand: 10.11.2026. Jasmin hat sich nach drei Entwürfen für Richtung B entschieden, für Computer und Handy.
Nichts wurde veröffentlicht. Kein Netlify, kein Supabase, keine echten Daten berührt. Geprüft wurde lokal mit den Probedaten der Vorschau.

## So schaust du es dir an

Den Ordner `website/` auf einen Webserver legen (lokal reicht) und öffnen:

| Was | Adresse |
|---|---|
| Partneransicht | `partner/?vorschau=normal` |
| Bereiche nicht freigeschaltet | `partner/?vorschau=gesperrt` |
| Neues Konto ohne Daten | `partner/?vorschau=leer` |
| Erste Anmeldung mit Einführung | `partner/?vorschau=normal&einstieg` |
| Hinweis "Deine Einrichtung" | `partner/?vorschau=normal&einrichtung` |
| Team mit Backoffice | `partner/?vorschau#bo` |

## Was jetzt anders ist

| Bereich | Stand | Nachweis |
|---|---|---|
| Leiste unten statt Seitenmenü. Am Computer neun Symbole, die unter der Maus wachsen, mit Namen beim Überfahren. Am Handy eine schwebende Leiste mit fünf Zielen. | BESTANDEN | `bildschirmfotos/1440-normal_start.jpg`, `390-normal_start.jpg`, Prüfzeilen "Computer: Leiste" und "Handy: schwebende Leiste" |
| Startseite als Felder in verschiedenen Größen: nächster Termin als helles Feld, die nächsten Tage, Heute anrufen mit Anruf-Knopf, neue Anfragen, Landingpage, Flyer, Neuigkeit, Bestell-Link. | BESTANDEN | wie oben, Prüfzeilen "Start" |
| Freischaltung: Was nicht frei ist, trägt auf der Startseite ein Schloss und führt zur Verkaufsansicht. | BESTANDEN | `bildschirmfotos/1440-gesperrt_start.jpg`, `390-gesperrt_start.jpg`, Prüfzeilen "Start gesperrt" |
| Alle übrigen Partner-Seiten im dunklen Stil mit runden Ecken: Kunden, Karteikarte, Kalender, Tools, Landingpage, Flyer, Wissen, Mehr, Konto, Einführung, Anmelden. | BESTANDEN | `bildschirmfotos/1440-*.jpg`, `390-*.jpg` |
| Backoffice: Farben, Ecken und Leiste unten. | BESTANDEN | `bildschirmfotos/1440-_bo_uebersicht.jpg`, `1440-_bo_aufgaben.jpg`, `390-_bo_uebersicht.jpg` |
| Backoffice-Übersicht als Felder-Raster wie im Entwurf | NICHT BESTANDEN (nicht gebaut) | Der Aufbau ist dort noch der alte, nur umgefärbt. Dafür müsste ich in `backoffice.js` eingreifen, das bisher fast unverändert vom Dashboard übernommen ist. Bitte Bescheid geben. |
| "Ein Feld wächst beim Klick zur großen Ansicht" wie im Entwurf | NICHT BESTANDEN (anders gelöst) | Im Portal führen die Felder direkt auf die jeweilige Seite. Das Aufklappen an Ort und Stelle gibt es nur im Entwurf. |

## Prüfungen

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Alle Partnerfunktionen, Computer 1440 und Handy 375 | BESTANDEN | `pruefung/ergebnis-funktionen.txt`: 179 Zeilen OK, keine nicht bestandene |
| Backoffice | BESTANDEN | `pruefung/ergebnis-backoffice.txt`: 25 Zeilen OK. Die PDF-Formulare kamen für die Prüfung aus dem Paket vom Backoffice-Nachtrag, die Fotos der Wohnung fehlen im Paket |
| Texte: kein "Werkzeug", kein "Wasser-Check-Seite", kein "in deinen Kunden", kein Gedankenstrich, keine verbotenen Wörter | BESTANDEN | `pruefung/ergebnis-texte.txt`: 33 Ansichten, überall 0 |
| Bewegung: keine einmalige Bewegung über 600 Millisekunden | BESTANDEN | `pruefung/ergebnis-bewegung.txt` |
| "Bewegung reduzieren" schaltet alles ab | BESTANDEN | ebenda: 0 laufende Animationen |
| Kontrast für Text | BESTANDEN | 17 Farbpaare gerechnet, alle ab 5,2 zu 1. Der Platzhalter in Feldern lag bei 4,4 und wurde aufgehellt |
| Kein Überlauf nach rechts auf 14 Ansichten | BESTANDEN | Prüfzeile "Alle 14 Ansichten" |
| Fehler in der Browser-Konsole | BESTANDEN, mit Hinweis | Keine Fehler. Es gibt eine Warnung des Browsers, dass die vorab geladenen Schriften auf manchen Seiten erst spät benutzt werden. Sie hat keine sichtbare Folge |
| Echte Handys (iPhone, Android), Installation als App | NICHT BESTANDEN (nicht geprüft) | Keine echten Geräte zur Verfügung |
| Echte Datenbank, automatische Backoffice-Anmeldung, Flyer über Telegram | NICHT BESTANDEN (nicht geprüft) | Alles lief mit Probedaten |
| Ladezeit gemessen, Durchgang mit Vorleseprogramm | NICHT BESTANDEN (nicht geprüft) | |
| Neue Bewegungs-Videos für Richtung B | NICHT BESTANDEN (nicht aufgenommen) | Die Videos im Ordner vom 09.11. zeigen noch den alten Stil. Das Video zum Entwurf B liegt in `entwuerfe-2026-11-09/videos/` |

## Wo B über eure CI hinausgeht

Du hast B in Kenntnis davon gewählt, hier noch einmal zum Nachlesen:

1. Dunkler Grund als Hauptfläche statt Beige.
2. Runde Ecken: Felder 22 Pixel, Knöpfe als Pille. Die CI sagt 4 Pixel, höchstens 8.
3. Weicher dunkler Verlauf unter Schrift, die auf Fotos steht. Die CI sagt keine Verläufe.

Farben und Schriften bleiben die der CI: Oliv tief, Khaki hell, gebrochenes Weiß, Jost und Inter.

## Offen

1. **Backoffice-Übersicht als Felder.** Siehe oben.
2. **Neue SQL-Datei für die Einführung.** `supabase/umbau-2026-11-09-partnerportal-einstieg.sql` muss einmal im SQL-Editor laufen, damit "nur ein einziges Mal" auf allen Geräten gilt. Unverändert seit gestern, nur in einer lokalen Test-Datenbank geprüft.
3. **Video zur Installation, neue Fotoserie, Preise.** Unverändert offen wie gestern: Platzhalter für das Video, zwei vorläufige Fotos, überall "[Preis folgt]".
4. **Sportler-Landingpage.** Die Übergabe für den anderen Claude liegt in `von-zweiter-claude/uebergabe/STIL-SCHALTZENTRALE-fuer-andere-projekte.md`. Die Seite von Johnny und Kevin selbst kenne ich nicht.

## Geänderte Dateien gegenüber dem Stand vom 09.11.

Im Ordner `website/partner/`: `portal.css` (Farben umgestellt, Block "Richtung B" angehängt), `partner.js` (Startseite neu, Leiste), `backoffice.css` (Farben für dunklen Grund), `index.html` und `manifest.webmanifest` (Versionsnummern, dunkle Farbe der Statusleiste).
Unverändert: `flyer.js`, `backoffice.js`, `wissen.js`, `vorschau.js`, das alte Dashboard, `daten.js`.

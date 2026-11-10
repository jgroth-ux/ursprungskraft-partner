# Ergebnis: Neugestaltung Sportseite und E-Book (Kevin Wolter, Johny Yusupov)

Stand: 10.11.2026, Übergabestand. Freigabe der Richtung und des Prototyps durch Jasmin am selben Tag,
danach drei Runden Nachbesserung (unten). Die Abschnitte sind in zeitlicher Reihenfolge, der letzte gilt.

## Kurz: was sich am Aussehen geändert hat

- **Landingpage:** dunkler Grund (Anthrazit) statt Hellblau. Felder in verschiedenen Größen statt gleicher Kacheln, je Bildschirm ein heller Blickpunkt.
  - **Hero:** helles Textfeld neben einem hohen Bildfeld mit dem Sportler.
  - **Zahlen:** in drei unterschiedlich großen Feldern.
  - **Zitat:** als reine Typografie.
  - **„Warum Sportler umsteigen“:** asymmetrisch (ein großes, zwei quer liegende, drei kleine Felder).
  - **Rechner:** als helles Feld mit sehr großer Literzahl.
  - **Videos:** in zwei unterschiedlich großen Feldern.
  - **Meal Prep:** drei Bilder, das mittlere versetzt.
  - **Wasserarten:** als große Zahlenleiter.
  - **Formular:** als helles Feld, der Text links bleibt beim Scrollen stehen.
  - **Leiste unten (aus der Schaltzentrale):** deckend, ohne Glas.
- **Akzentfarbe je Sportler:** Kevin Kupfer `#CF6844`, Johny Sportblau `#4261CC`. Sonst sind beide Seiten gleich, ein gemeinsames System.
- **E-Book:** helles Papier, Schrift in Anthrazit, große Kapitelnummern im Akzent, Haarlinien statt vieler Kästen.
  - **Cover:** Sportlerfoto mit Rahmen auf Anthrazit.
  - **Vorwort und Schlussseite:** Foto ebenfalls gerahmt.
  - **Kapitel 2:** Das bisherige Cover-Foto (`wasser.jpg`) steht jetzt beim „dritten Weg“.
- **Schriften:** Jost und Inter wie bisher. Alle Größen kommen aus der Leiter 1,272: Web ab 16 px, E-Book ab 10 pt.

## Nachbesserung nach Jasmins Durchsicht (10.11.2026)

- **Keine doppelten Linien mehr:**
  - Unter der Linie des Kapitelkopfs steht keine zweite Linie mehr.
  - Betroffen waren Kapitel 2 (drei Karten), Kapitel 7 (erster Video-Block) und Eddies Rechnung (Zahlenleiste).
  - Eine automatische Prüfung aller 14 Seiten beider E-Books findet keine zwei Linien mehr, die ohne Inhalt dazwischen untereinander stehen.
- **Kapitel 7:**
  - Das Bild ist jetzt so hoch wie der Text daneben, unten bündig mit dem Link „Hier siehst du das Video“.
  - Die Bildspalte ist so gewählt (70 mm), dass „Spa“ nicht mehr allein in der letzten Zeile steht. Eddie: 6 Zeilen, Ronaldo: 3 Zeilen.
  - Am Text wurde nichts geändert.
- **Cover:**
  - Feine Kontur (0,75 pt) in der Akzentfarbe um das Foto, mit etwas Abstand.
  - Kevin: Kupferrot. Johny: Blau.

## Zweite Nachbesserung (10.11.2026)

- **Kein Schwarz mehr im E-Book:**
  - Alle dunklen Flächen (Cover, Kästen, Band auf Seite 3, Schlussseite) sind jetzt Anthrazit `#383E42` (RAL 7016) statt `#171A1C`.
  - Fließtext, Überschriften, Linien und die Zahlen auf der pH-Skala sind ebenfalls Anthrazit, Nebentext `#5C6367` (5,4 : 1).
  - Automatische Prüfung: Kein Text, keine Linie und keine Fläche ist dunkler als Anthrazit. Einzige Ausnahme ist das Violett bei pH 14 auf der Skala.
- **Farben dazu angepasst:**
  - Hellere Akzenttöne für kleine Schrift auf Dunkel: Kevin `#EC9A79`, Johny `#9EAEF2`, beide mindestens 4,8 : 1.
  - Neuer Farbwert `akzent_linie` für Kontur und Trägerfelder: Kevin `#CF6844`, Johny `#8DA0EE`.
  - Kevins Knopf hat jetzt weiße Schrift auf Kupfer, dafür größer (16 pt fett).
- **Landingpage:** zu diesem Zeitpunkt noch `#171A1C`, in der dritten Runde ebenfalls auf Anthrazit umgestellt.
- **Kapitel 7:** Beide Video-Bilder sind jetzt gleich groß, im Querformat 3 : 2. Damit ist der Eddie-Text länger als sein Bild.
- **Cover:** Entscheidung Jasmin: Cover A mit dem Foto des Sportlers bleibt. Die ausprobierte Variante B ohne Sportlerfoto ist wieder entfernt, aus `bauen.py`, `ebook.css` und den Dateien.

## Dritte Runde (10.11.2026)

- **Landingpage in Anthrazit** wie E-Book und Backoffice:
  - Grund `#2F3438`, Felder `#383E42`, Schrift auf Hell `#383E42`, Nebentext `#C4C6C3` bzw. `#5C6367`.
  - Kevins Knöpfe und das Akzentfeld: weiße Schrift auf `#B4512F` (5,1 : 1).
  - Kleine Akzentschrift auf Dunkel: Kevin `#EC9A79`, Johny `#9EAEF2`.
  - Nur `empfehlung.css` geändert, dazu die Versionsnummer in `seite.html`. Beide Seiten neu gebaut.
  - Text unverändert (geprüft), Rechner 90 kg = 3,6 Liter (geprüft), kein waagrechtes Scrollen bei 1440, 768, 375 und 320 px (geprüft).
- **Backoffice für Partner** (`06-backoffice/`): Grundlage für alle Gruppen, Inhalt je Gruppe in `konfig-*.js`.
  - **Funktionen:** Anmeldung, Passwort vergessen, Einladung, Passwort ändern, Abmelden. Kennzahlen, Verlauf über 7 Tage oder 12 Wochen, Liste mit Filtern, Hinweis, solange noch niemand da ist.
  - **Datenschutz:** Der Partner sieht nur Vorname, Anfangsbuchstabe, Ort, Wunsch und Stand.
  - **Vorschau mit Beispieldaten** in Chromium geprüft: Abläufe, Filter, Fehlermeldungen, kein Überlauf bei 1440, 768, 375 und 320 px, keine JS-Fehler.
  - **Echtbetrieb:** `quelle-supabase.js` ist vorbereitet, aber nicht prüfbar ohne Schema und Schlüssel. Beschreibung für den anderen Claude: `06-backoffice/SCHNITTSTELLE.md`. Anleitung: `06-backoffice/LIESMICH.md`.

## Geänderte Dateien

| Datei | Änderung | Grund |
|---|---|---|
| `01-landingpage/partner/empfehlung.css` | neu geschrieben | neues Aussehen, Akzent je Sportler über `body[data-kurz]`, Standardfarbe für spätere Sportler |
| `01-landingpage/partner/_vorlage/seite.html` | `<span class="betont">` in der Hero-Überschrift (Text gleich); neue Leiste `<nav class="dock">` mit drei Sprungmarken (`#rechner`, `#video`, `#ebook`), darin der bisherige `.handyknopf` (gleiche Klasse, gleicher Link `#interesse`); Versionsnummern `?v=20261110b` an CSS und `?v=20261110a` an JS | Akzent, Leiste, Cache |
| `01-landingpage/partner/kevin/index.html`, `johny/index.html` | neu gebaut mit `bauen.py` | |
| `01-landingpage/partner/ebook/ebook-kevin.pdf`, `ebook-johny.pdf` | neue PDFs (Download auf der Seite) | |
| `01-landingpage/bilder/partner/ebook-kevin.jpg`, `ebook-johny.jpg` | neu aus Seite 1 der PDFs erzeugt (744 × 1053 px) | Cover-Vorschau auf der Seite |
| `02-ebook/quellen-html/ebook.css` | neu geschrieben | neues Satzbild |
| `02-ebook/quellen-html/vorlage.html` | Cover zeigt Sportlerfoto (`{{foto}}`, `{{foto_pos_titel}}`); `<body>` bekommt die Akzentfarben; Inline-Größen und Abstände entfernt und ins CSS verlegt; Seitenklassen `s01` bis `s14`; zwei Zwischentitel mit Klasse `zwischentitel`; Fußnote pH 2,5 mit Klasse `fussnote`; Kapitel 2 „Der dritte Weg“ mit Bild `wasser.jpg` | Gestaltung, kein Text geändert |
| `02-ebook/quellen-html/bauen.py` | je Sportler fünf Farbwerte `akzent`, `akzent_auf`, `akzent_hell`, `akzent_dunkel`, `akzent_linie`; Bildausschnitt Kevin-Cover `foto_pos_titel` von 25 % auf 30 %; Zahlen auf der pH-Skala in Anthrazit statt `#16303F` | Farbe je Sportler, Bildausschnitt, kein Schwarz |
| `02-ebook/quellen-html/ebook-kevin.html`, `ebook-johny.html` | neu gebaut | |
| `02-ebook/ebook-kevin.pdf`, `ebook-johny.pdf` | neu erzeugt (je rund 1,5 MB, vorher rund 2 MB) | |
| `06-backoffice/` | neu: Backoffice für Partner (siehe dritte Runde) | |
| `empfehlung.js`, `partner.json`, beide `bauen.py`-Abläufe, Schriften, Videos, Untertitel | **unverändert** (außer den Farbwerten in `02-ebook/.../bauen.py`) | |

**Technische Hinweise**
- **Leiste unten:** Sie nutzt die vorhandene JS-Logik des Handy-Knopfs. Sie erscheint nach dem ersten Bildschirm und verschwindet, solange ein Formular im Bild ist. Das Stylesheet braucht dafür `:has()` (Chrome und Edge ab 105, Safari ab 15.4, Firefox ab 121). In älteren Browsern bleibt die Leiste unsichtbar, die Seite funktioniert trotzdem.
- **Neuer Sportler:**
  - Landingpage: eine Zeile `body[data-kurz="name"]{--ak:…;--ak-knopf:…;--ak-auf:#FFFFFF;--ak-d:…;--ak-h:…}` in `empfehlung.css`, sonst gilt Kupfer. Kontraste mindestens 4,5 : 1 (Knopf mit weißer Schrift, `--ak-d` auf `#383E42`).
  - E-Book: die fünf Farbwerte im Eintrag in `bauen.py`.
  - Backoffice: ein Eintrag unter `partner` in `06-backoffice/konfig-sport.js`.

## Abnahmetests

| Nr. | Prüfung | Ergebnis | Beleg |
|---|---|---|---|
| 1 | Beide Landingpages über `bauen.py`, keine `{{` | BESTANDEN | `python3 partner/_vorlage/bauen.py`: „gebaut“ für beide, `grep -c "{{"` ergibt 0 in beiden Dateien. Die Platzhalter in `seite.html` sind dieselben neun wie vorher. |
| 2 | Rechner 90 kg | BESTANDEN | Im Browser (Playwright) eingegeben: `#liter` = „3,6“, `#jahr` = „Das sind rund 1.310 Liter im Jahr. In 1,5-Liter-Flaschen wären das 146 Sechserträger zum Schleppen.“ Gegenprobe 75 kg ergibt 3,0. |
| 3 | Anker, IDs, Feldnamen | BESTANDEN | Alle 14 IDs der alten `seite.html` vorhanden. Alle Feldnamen und Werte, alle Klassen, `data-zahl`, `autocomplete` und alle `href`/`src` gleich (geändert sind nur `?v=` an CSS und JS). Anker `#rechner`, `#video`, `#interesse`, `#ebook` im Browser gefunden. |
| 4 | Kein waagrechtes Scrollen, nichts abgeschnitten | BESTANDEN | Beide Seiten bei 1440, 768, 375 und 320 px gemessen: `scrollWidth` gleich der Fensterbreite. Kein Element ragt aus dem Fenster, kein Element schneidet Text ab (automatische Prüfung aller Elemente). Bei 320 px war vorher die Leiste und eine Zahl zu breit, korrigiert. |
| 5 | PDFs 14 Seiten A4 hoch | BESTANDEN | `pypdf`: beide 14 Seiten, alle 595 × 842 pt. |
| 6 | PDF-Links und Video-Verknüpfungen | BESTANDEN | Je PDF 6 Links, identisch mit dem alten Stand: Seite 11 viermal `…/partner/<name>/#video`, Seite 13 und 14 `…/partner/<name>/`. Landingpage: drei Videos mit denselben Dateien, Untertitel `de` bei Sportvideo und Eddie Hall wie vorher (Ronaldo hatte schon vorher keine Untertitel). E-Book-Download nach dem Formular verlinkt `../ebook/ebook-<name>.pdf` (mit `?demo` getestet). |
| 7 | Suche nach „Fans“, „–“, „—“, „Prozent“ | BESTANDEN | Im sichtbaren Text beider Landingpages und beider E-Books: 0 Treffer für alle vier. Ebenso 0 für „Zahl%“ ohne Leerzeichen und 0 ausgeschriebene Links im E-Book. „K8“: je 1 Treffer, Landingpage Ablauf („Du lernst den K8 kennen“) und E-Book Kapitel 3, beides wie vorher. Pitch- und Schlussseite enthalten kein „K8“. |
| 8 | Keine Inhaltsänderung | BESTANDEN | Sichtbarer Text der gebauten Landingpages alt gegen neu: identisch (Kevin und Johny). Sichtbarer Text der gebauten E-Book-HTML alt gegen neu: identisch. PDF-Zeichenbestand alt gegen neu: gleich bis auf „AUSSEN“ (alte Versalien) gegen „außen“. |
| 9 | Bilder, Videos, Untertitel, Datenschutz, Formulare | BESTANDEN | Alle Bild- und Videopfade unverändert. Datenschutz-Haken mit Link `../../datenschutz/`, Impressum und Datenschutz im Fuß. Formularprüfung im Browser: Pflichtfragen-Meldung erscheint, „Ich will mich erst mal nur umschauen“ zeigt den Hinweis und ändert den Knopf auf „E-Book holen“. Keine JS-Fehler. |
| 10 | Abschnittsübergänge angesehen | BESTANDEN | Ganzseitige Bildschirmfotos beider Seiten in vier Breiten durchgesehen (`_pruefung/phase-3/`). Übergänge nur über Flächenwechsel (dunkel, helles Feld mit 28 px Rundung), keine Wellen oder Schrägen. |
| 11 | Keine verbotenen Effekte | BESTANDEN | Suche in CSS, JS und HTML nach `backdrop`, `blur`, `gradient`, `glow`, `mousemove`, `parallax`, `perspective`, `translateZ`: 0 Treffer. Keine Glas-Effekte, kein Maus-Licht, kein Scroll-Maus-Symbol. Bewegung: Einblenden, einmaliges Hochzählen wie bisher, ruhige Hover. Bei „Bewegung reduzieren“ ist alles sofort sichtbar (geprüft). |
| 12 | E-Books: Typografie, Umbrüche, kein Überlauf | BESTANDEN | Automatische Messung je Seite: Inhalt endet überall mindestens 5,7 mm vor der Fußzeile; Linienprüfung: keine doppelten Linien; nichts ragt rechts heraus (Seite 1 hat keine Fußzeile). Blocksatz im Fließtext, `hyphens:manual`, Trennung nur an den Fugen aus `TRENNFUGEN` (unverändert). Alle 14 Seiten beider Fassungen angesehen. |
| 13 | Desktop und Handy als zusammenhängendes Design | BESTANDEN (Sichtprüfung) | Bildschirmfotos 1440, 768, 375, 320 px in `_pruefung/phase-3/`. Das ist meine Einschätzung, das letzte Wort hat Jasmin. |

**NICHT PRÜFBAR**
- **Echtes Absenden der Formulare** an Supabase und Telegram: Schlüssel und Adresse sind im Paket `XXX`. Die Logik in `empfehlung.js` ist unverändert.
- **Laden von** `../../vendor/supabase.js` **und** `../../dashboard/daten.js`: Die Dateien liegen nicht im Paket. In der Vorschau gibt es dafür 404, wie vorher.
- **Echte Handys und Safari/Firefox:** Geprüft habe ich nur in Chromium (Playwright).
- **PDF-Erzeugung mit Chrome auf Jasmins Mac:** nicht ausgeführt. Erzeugt wurde mit `pdf-erzeugen.js` (Playwright/Chromium).

## Offene Fragen

1. **Fotos:** Kevin und Johny werden nach Lieblingsfotos gefragt.
   - Zum Tauschen reicht es, die Datei unter demselben Namen abzulegen (`bilder/partner/kevin.webp` usw. für die Seite, `02-ebook/quellen-html/bilder/kevin.jpg` usw. für das E-Book) und neu zu bauen.
   - Empfehlung: mindestens 2000 px Höhe. Kevins heutiges Foto (736 px) ist am großen Bildschirm und im A4-Cover sichtbar weich.
2. **Vorteils- und Meal-Prep-Bilder:** Die neun Bilder mit demselben Model sollen neu gemacht werden. Sie sind bis dahin Platzhalter und auf der Seite etwas entsättigt.
   - Neue Bilder unter denselben Dateinamen ablegen: `schneller-fit.jpg`, `hydration.jpg`, `genug-trinken.jpg`, `supplements.jpg`, `besser-schlafen.jpg`, `schluss-mit-kisten.jpg`, `mealprep-gemuese.jpg`, `mealprep-fleisch.jpg`, `mealprep-reis.jpg`.
   - Am besten im Querformat 16 : 9, ab 1600 px Breite.
3. **Kevins Text in `partner.json`:** „mit über 800.000 Followern“ zählt Instagram-Follower und YouTube-Abonnenten zusammen. Nicht geändert, nur als Hinweis.
4. **Inhaltsfragen aus `02-ebook/offene-fragen.md`:** weiterhin offen, unverändert.

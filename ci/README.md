# Ursprungskraft: Corporate Design

Kopie des Design Systems „Ursprungskraft“ (claude.ai, https://claude.ai/artifact/PhpVhYuvH9tvWas4yzgW1x), Stand 13.11.2026.
Maßgeblich ist das Design System. Diese Kopie ist für Claude-Sitzungen ohne Zugriff darauf. Ersetzt `wissenspaket/03-gestaltung-ci.md` (08.10.2026).
Weitere Abschnitte: `gestaltungsregeln.md`, `ebooks-und-dokumente.md`. Farben, Schriften, Abstände und Rundungen als Werte: `tokens.json`. Logos: `logos/`.

Corporate Design von Ursprungskraft, dem Vertrieb von Enagic-Wassergeräten mit Daniel Zürcher und Jasmin Groth. Es gilt für alles: Partnerportal, Team-Bereich, Landingpages und Reflink-Seiten, Bestellseite, Flyer, Social Media, WhatsApp, Präsentationen, eBooks, Broschüren und Kundenunterlagen. Stand 13.11.2026, von Jasmin festgelegt. Ersetzt die Fassung vom 08.10.2026.

## Markenkern

„Kangen“ bedeutet sinngemäß Rückkehr zum Ursprung. Ursprungskraft steht für das, was dahinter liegt: gutes Wasser, ehrliche Beratung, persönliche Betreuung. Die Marke wirkt seriös, ruhig und klar, nie wie ein Wellness-Prospekt und nie wie Network-Marketing.

Drei Prinzipien:

1. **Klar statt voll.** Viel Fläche, wenige Elemente, eine Aussage pro Abschnitt.
2. **Zwei ruhige Grundfarben, eine laute.** Creme und Weiß geben Raum, Dunkelgrün trägt Schrift und Blickpunkte. Gletscherblau ist das eine Signal und kommt sparsam vor. Laut wirkt eine Farbe nur, wenn sie selten ist.
3. **Natur im Bild, Ordnung in der Form.** Wasser, Holz, Stein, Pflanzen und echte Menschen erzählen. Raster, Zahlenleiter und Fluchtlinien halten alles ruhig.

## Tonalität und Sprache

Klar, direkt, verständlich, ehrlich, nahbar. Ruhig, aber bestimmt. Spricht wie jemand, der weiß, wovon er spricht, ohne sich beweisen zu müssen.

- Kunden und Partner werden geduzt.
- Kurze bis mittlere Sätze. Fachbegriffe nur mit Erklärung.
- Direkt zur Sache: Zahlen, Daten, Fakten. Keine weichen Einleitungen, kein Lob-Vorgeplänkel.
- Nur deutsche Wörter auf dem Bildschirm, kein Fachchinesisch.
- Strikt verboten: Gendern (auch Sternchen und Doppelpunkt), Gedankenstriche, KI-Floskeln („In der heutigen Zeit …“, „Es ist wichtig zu verstehen …“), Übertreibungen und leere Werbesprache.
- Keine Heil- oder Gesundheitsversprechen, keine Krankheitsbezüge. Erzählt wird über Geschmack, Alltag, Vielseitigkeit, Technik und Beratung.
- Kein Network-Marketing-Vokabular (Network, Downline, passives Einkommen, Geschäftsmöglichkeit).
- Das Wort „Verkostung“ wird nicht verwendet.
- Prozent mit Leerzeichen: „20 %“.

Beispiel gut: „Ein Gerät, fünf Wasserarten. Für Küche, Pflege und Haushalt.“
Beispiel nicht: „Bring deinen Körper zurück ins Gleichgewicht!“

## Farben

Es gibt zwei Fassungen. **Hell ist die Hauptfassung** und gilt für Druck, Landingpages, Social Media und Dokumente. **Dunkel** gibt es für Bildschirme (Portal, Team-Bereich) und für dunkle Flächen wie Hero und Rückseite. Jede Farbe steht als Token in `tokens.json`, in beiden Fassungen.

| Rolle | Token | Hell | Dunkel |
|---|---|---|---|
| Seitengrund | `ground` | Creme `#F5F1E8` | `#1F2418` |
| Felder und Karten | `surface` | Weiß `#FFFFFF` | `#2F3524` |
| Blätter, Dialoge, Druckfläche | `surface-soft` | `#FBF9F4` | `#262C1D` |
| Ruhige Hinterlegung | `sand` | `#ECE6D8` | `#3A422C` |
| Haarlinien | `line` | `#DCD6C8` | `#3C4135` |
| Schrift und Symbole | `ink` | Dunkelgrün `#2C3A24` | `#FBF9F4` |
| Leise Schrift | `muted` | `#5A6650` | `#B9B7A6` |
| Links, Kicker, gewählte Umschalter | `olive` | `#3F5230` | `#CFC4A0` |
| Schrift auf `olive` | `on-olive` | `#FFFFFF` | `#1F2418` |
| Logo-Grün, Druck | `brand` | `#4F5A35` | `#4F5A35` |
| Blickpunkt je Seite | `olive-deep` | `#2F3524` | `#FBF9F4` |
| Schrift auf dem Blickpunkt | `on-olive-deep` | `#FBF9F4` | `#2A2C22` |
| Akzent auf dunklen Flächen | `khaki-light` | `#CFC4A0` | `#CFC4A0` |
| Linien, Deko | `khaki` | `#A8996A` | `#A8996A` |
| **Laute Farbe** | `laut` | **Gletscherblau `#7FC4D8`** | Khaki `#CFC4A0` |
| Laut, beim Darüberfahren | `laut-hover` | `#69B5CB` | `#DBD0AF` |
| Schrift auf `laut` | `on-laut` | `#2C3A24` | `#1F2418` |
| Warnung | `rot` | `#A3402F` | `#E79A86` |
| Warnung, Fläche | `rot-zart` | `#F6E2DC` | `#4C3027` |

### Die laute Farbe

Gletscherblau ist aus den Grundfarben abgeleitet: die Gegenfarbe zum warmen Creme, Richtung klares Wasser. Jasmin hat sie am 13.11.2026 aus 16 Vorschlägen gewählt, weil sie den stärksten Kontrast zum Grün gibt.

- Setze `laut` **nur** für: den einen Hauptknopf einer Ansicht (zum Beispiel „Termin eintragen“, „Jetzt bestellen“, „Route starten“), das gewählte Symbol in Navigation und Leisten, Anruf-Knöpfe, die Markierung „heute“ und auf Flyern höchstens ein Element (Knopf, Datum oder kurze Linie).
- Schrift auf `laut` immer in `on-laut` (Dunkelgrün), nie Weiß.
- Nie für Flächen, Fließtext, Überschriften, Hintergründe oder Schmuck. Pro Ansicht höchstens drei Stellen.
- In der dunklen Fassung übernimmt Khaki diese Rolle.

### Verteilung

Faustregel je Seite: rund 60 % Creme und Weiß, 30 % Grün (Schrift, Blickpunkt, Logo), 10 % Sand und Khaki, und Gletscherblau nur als Punkt darüber, unter 5 %.

### Regeln

- Seitengrund ist `ground`, Felder und Karten `surface`. Weiß ist erlaubt, aber nur als Feld auf Creme, nie als Seitengrund.
- Pro Seite ein dunkler Blickpunkt in `olive-deep` mit Schrift `on-olive-deep` (in Dunkel umgekehrt hell).
- Schrift immer `ink` oder `muted`. `khaki` nie als Schrift auf hellem Grund.
- `rot` nur für Warnungen und Fälliges, nie als Schmuck.
- Keine Verläufe, keine Glas- oder Glanzeffekte, keine Leuchtflecken, keine Schatten auf Flächen. Ausnahmen: Schrift auf Fotos bekommt einen ruhigen dunklen Schleier, Geräte-Abbildungen dürfen einen weichen Schatten haben.
- Verboten: Pink, Neonfarben, Blau-Lila-Verläufe und jedes zweite Blau neben Gletscherblau.
- Kontrast: jede Schrift mindestens 4,5 zu 1 auf ihrem Grund, große Schrift ab 24 px mindestens 3 zu 1. Gemessen, nicht geschätzt. Alle Paare in der Tabelle halten das in beiden Fassungen.

### Druck

Näherungswerte für den Druck. Vor dem ersten Druck mit der Druckerei abstimmen und einen Andruck prüfen.

| Farbe | Hex | RGB | CMYK (Näherung) |
|---|---|---|---|
| Creme | `#F5F1E8` | 245 241 232 | 0 2 5 4 |
| Dunkelgrün | `#2C3A24` | 44 58 36 | 24 0 38 77 |
| Olive (Logo) | `#4F5A35` | 79 90 53 | 12 0 41 65 |
| Olive tief | `#2F3524` | 47 53 36 | 11 0 32 79 |
| Khaki hell | `#CFC4A0` | 207 196 160 | 0 5 23 19 |
| Sand | `#ECE6D8` | 236 230 216 | 0 3 8 7 |
| Gletscherblau | `#7FC4D8` | 127 196 216 | 41 9 0 15 |

Im Druck ersetzt `surface-soft` das reine Weiß als Fläche.

## Typografie

- **Jost** 500 für Überschriften, Kennzahlen und den Schriftzug. Nie fett, nie kursiv.
- **Inter** 400 für Text, 600 für Hervorhebungen, Beschriftungen und Knöpfe.
- Beide sind Google Fonts, frei nutzbar, auch in Google Docs und Canva (sonst die Dateien aus `fonts/` hochladen).

**Schriftleiter.** Größen werden gerechnet, nicht geschätzt: Faktor 1,272 ab 16 px. Am Bildschirm: 13, 16, 20, 26, 33, 42, 53, 68. Im Druck ab 10 pt: 10, 13, 16, 21, 26, 34, 42.

| Stil | Schrift | Größe / Zeile | Wofür |
|---|---|---|---|
| `display` | Jost 500 | 53 / 56 | Hero, Cover. Einmal pro Seite. |
| `h1` | Jost 500 | 42 / 48 | Seitentitel |
| `h2` | Jost 500 | 33 / 40 | Abschnitte |
| `h3` | Jost 500 | 26 / 32 | Unterabschnitte, große Karten |
| `h4` | Jost 500 | 20 / 26 | Kartentitel, Feldüberschriften |
| `lead` | Inter 400 | 20 / 30 | Vorspann unter dem Seitentitel |
| `body` | Inter 400 | 16 / 26 | Text |
| `label` | Inter 600 | 13 / 18 | Beschriftungen, Knöpfe klein |
| `eyebrow` | Inter 600 | 13 / 18, +0,14 em, Versalien | Kicker über Überschriften, in `olive` |
| `small` | Inter 400 | 13 / 20 | Quellen, Fußzeilen, Hinweise, in `muted` |
| `zahl` | Jost 500 | 68 / 68 | Kennzahlen, Uhrzeit im Blickpunkt |

Regeln:
- Zwei Ebenen nebeneinander liegen mindestens eine Stufe auseinander, besser zwei.
- Linksbündig, kein Blocksatz. Zeilen höchstens 70 Zeichen.
- Je größer die Schrift, desto enger Zeilenabstand und Laufweite; kleine Versalzeilen laufen weiter.
- Kein Wort allein in der letzten Zeile. Umbrüche in Überschriften von Hand setzen.
- Keine Großbuchstaben in Fließtext, nur im `eyebrow`.

## Abstände

Abstände kommen aus der Fibonacci-Folge: **8, 13, 21, 34, 55, 89, 144**. Tokens `abstand-8` bis `abstand-144`.

- Innerhalb einer Gruppe höchstens halb so viel Abstand wie zur nächsten Gruppe.
- Typische Werte am Bildschirm: Beschriftung zu Feld 8, Felder untereinander 13, Innenabstand einer Karte 21 bis 24, Karten zueinander 13 bis 34, Abschnitte 55 bis 89.

## Rundungen

- `radius-rund` (999 px): Knöpfe, Umschalter, Marken, Leisten.
- `radius-karte` (22 px): große Karten, Blickpunkte, Blätter und Dialoge am Bildschirm.
- `radius-feld` (14 px): Eingabefelder, kleine Karten, Bilder am Bildschirm.
- `radius-druck` (4 px): alles im Druck und in PDFs (Bilder, Boxen, Tabellenköpfe).
- `radius-none` (0): randabfallende Flächen und Bildstreifen.

## Layout und Ausrichtung

- Nichts hängt frei in der Fläche. Jedes Element teilt eine Kante mit einem anderen, alle Textblöcke beginnen auf derselben linken Kante.
- Inhalt nutzt die volle Breite und läuft von der Linie des Logos bis zur rechten Kante, alles in einer Flucht.
- Abschnitte trennen sich durch Flächenwechsel (`ground`, `surface`, `olive-deep`) oder eine Haarlinie in `line`, nie durch Schatten.
- Was mittig wirken soll, sitzt leicht über der Mitte (optische Mitte bei rund 45 %).
- Wichtiges sitzt auf einer goldenen Linie oder einer Drittellinie. Die genauen Regeln stehen im Abschnitt „Gestaltungsregeln“.
- Text liegt nie über einem Gesicht.

## Logo

Das Logo ist der Lebensbaum mit Wurzeln, allein oder mit dem Schriftzug „URSPRUNGSKRAFT“ darunter. Die Dateien liegen unter Assets, Gruppe „Logos“.

- `logo-schrift-oliv.png` auf hellem Grund, `logo-schrift-hell.png` auf `olive-deep` oder dunklen Fotos. Erste Wahl überall, wo Platz ist.
- `logo-baum-oliv.png` und `logo-baum-hell.png` ohne Schriftzug: Profilbilder, kleine Flächen, Wasserzeichen, wenn der Name daneben schon steht.
- `app-symbol.png` nur als App-Symbol des Partnerportals, nicht als Logo der Marke.
- Schutzraum rundum mindestens ein Viertel der Logobreite. Mindestgröße mit Schriftzug 120 px oder 30 mm breit, Baum allein 32 px oder 10 mm.
- Nicht: verzerren, drehen, umfärben (auch nicht in Gletscherblau), mit Rahmen oder Schatten versehen, auf unruhige Bildstellen setzen.

## Bildsprache

Natürliches Licht, ruhige Flächen, echte Materialien: Wasser im Glas, Stein, Holz, Leinen, Pflanzen, Küche im Alltag, echte Menschen. Farbstimmung warm und leicht zurückgenommen. Keine Labor-, Medizin- oder Heilsbilder. Blau kommt im Bild über echtes Wasser vor, nicht über eingefärbte Flächen.

## Symbole

Liniensymbole mit 1,5 px Strichstärke, runde Enden, im Raster 24 × 24, Farbe `ink` oder `olive`, gewählt `on-laut` auf `laut`. Keine gefüllten, bunten oder Emoji-Symbole.

## Bewegung

Kurz und mit Sinn: kleine Übergänge 160 bis 240 ms, Bausteine 280 bis 450 ms, nie über 600 ms. Bei „Bewegung reduzieren“ aus. Nach dem Speichern springt und lädt nichts neu, nur die geänderte Stelle wechselt.

## Anwendungen

- **Partnerportal und Team-Bereich:** Umschalter Hell, Dunkel, Wie mein Gerät; ohne Wahl gilt das Gerät. Startseite aus Feldern in `surface` auf `ground`, ein Blickpunkt in `olive-deep`, Hauptknopf in `laut`.
- **Landingpages und Reflink-Seiten:** Hero in `olive-deep` mit Titel `display` in `on-olive-deep`, Inhalte auf `ground`, eine Sektion pro Thema, ein Hauptknopf in `laut`. Unten links „Empfohlen von“ mit rundem Foto des Partners.
- **Bestellseite:** ruhig in Hell, Schritte nummeriert, nur der Knopf zum Abschicken in `laut`.
- **Flyer:** Foto groß, Schrift `ink` auf hellem Grund oder `on-olive-deep` auf dunklem, ein Element in `laut`. Logo mit Schriftzug unten.
- **Social Media und WhatsApp:** Grund `ground` oder `olive-deep`, eine Aussage pro Grafik, Schriftleiter und Abstände wie oben.
- **eBooks, Broschüren, Dokumente:** siehe Abschnitt „eBooks und Dokumente“.

## Rechtliches

Alle Unterlagen sind Informationen zu Gerät und Anwendung, keine medizinischen Ratgeber. Keine Heilversprechen, keine Krankheitsbezüge. eBooks haben vorne den Hinweis „Kein medizinischer Ratgeber“ und hinten den rechtlichen Hinweis mit Markenvermerk. Zahlen und Studien immer mit Quelle in `small`.

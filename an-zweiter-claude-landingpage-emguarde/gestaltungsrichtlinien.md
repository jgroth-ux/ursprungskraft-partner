# Gestaltungsrichtlinien

Angelegt am 13.08.2026, nachdem bei den ersten Foto-Pins Text über Jasmins Gesicht lag und ein einzelnes Wort allein am Zeilenende stand.
Am 13.08.2026 um das Zahlensystem erweitert (Abschnitt 1). Das ist der Teil, der vorher gefehlt hat.

Gilt für alles Gestaltete: Pins, Grafiken, PDFs, Landingpages, Präsentationen. Die Farben und Schriften stehen in `context/brand-guidelines.md`, hier stehen die **Regeln, wie angeordnet wird**.

---

## 1. Proportionen: das Zahlensystem

Der Kern in einem Satz: **Größen werden nicht geschätzt, sie werden gerechnet.** Jede Größe leitet sich aus der vorigen ab, immer mit demselben Faktor. Deshalb wirkt ein Layout ruhig, auch wenn niemand sagen kann warum.

Der Faktor ist **1,618**, der goldene Schnitt. Für Zwischenstufen die Wurzel daraus, **1,272**. Zweimal 1,272 ergibt wieder 1,618, deshalb passt beides in dieselbe Leiter.

### Die Schriftleiter

Für Pins im Format 1000 × 1500. Basis ist 30.

| Stufe | Größe | Wofür |
|---|---|---|
| 1 | 30 px | Kicker oben, Fußzeile, Quellenangabe |
| 2 | 38 px | Zusatz klein, Bildunterschrift |
| 3 | 49 px | Zusatz, zweite Zeile unter der Hook |
| 4 | 62 px | lange Hook (ab 70 Zeichen) |
| 5 | 79 px | mittlere Hook |
| 6 | 100 px | kurze Hook (unter 45 Zeichen) |
| 7 | 127 px | ein einzelnes Wort oder eine Zahl |
| 8 | 162 px | Übergröße, nur ein Wort |

**Die wichtigste Regel daraus: zwei Ebenen nebeneinander müssen mindestens eine ganze Stufe auseinander liegen, besser zwei.**
62 neben 70 sieht aus wie ein Versehen. 62 neben 100 sieht nach Absicht aus. Genau daran erkennt das Auge, ob jemand entschieden hat oder nicht.

**Andere Formate:** Leiter mit der Breite mitskalieren. Für Text in PDFs beginnt sie unten bei 10 pt: 10, 13, 16, 21, 26, 34, 42.

### Die Abstandsleiter

Für Ränder, Lücken und Zwischenräume gilt die Fibonacci-Folge, weil sie sich dem goldenen Schnitt annähert (144 geteilt durch 89 ergibt 1,618):

**8 · 13 · 21 · 34 · 55 · 89 · 144 · 233**

Feste Werte für den Pin:

| Wo | Wert |
|---|---|
| Außenrand links und rechts | 89 |
| Außenrand oben und unten | 144 |
| Überschrift zu ihrem Zusatz | 34 |
| Zwischen zwei Blöcken | 89 |
| Fußzeile zum Bildrand | 55 |

**Die Regel dahinter:** Der Abstand innerhalb einer Gruppe muss mindestens **halb so groß** sein wie der Abstand zur nächsten Gruppe. Sonst ordnet das Auge falsch zu und der Zusatz sieht aus, als gehöre er zur Fußzeile.

### Die goldenen Linien im Pin 1000 × 1500

- **Waagerecht bei 927 von oben** (1500 geteilt durch 1,618). Das ist die stärkste Linie im Bild.
- Gegenlinie bei 573 von oben.
- **Senkrecht bei 618 und bei 382** von links.

Ein Textblock, der unten sitzt, beginnt auf 927. Bei Jasmins Fotos liegt der Kopf im oberen Drittel, deshalb ist 927 genau die Zeile unter dem Gesicht. Die Regel aus Abschnitt 4 und der goldene Schnitt fallen hier zusammen, das ist kein Zufall.

### Zeilenabstand hängt an der Schriftgröße

Je größer die Schrift, desto enger der Zeilenabstand. Große Buchstaben bringen ihren Abstand durch die eigene Höhe schon mit.

| Schriftgröße | Zeilenabstand |
|---|---|
| ab 100 px | 1,0 bis 1,05 |
| 62 bis 100 px | 1,1 |
| 38 bis 62 px | 1,3 |
| unter 38 px | 1,4 bis 1,5 |

### Laufweite

Große Schrift läuft enger, kleine Versalschrift läuft weiter. Nie umgekehrt.

- ab 62 px: minus 0,02 em
- kleine Großbuchstaben (Kicker): plus 0,16 em

### Optische Mitte

Die optische Mitte liegt **über** der gerechneten, bei rund 45 Prozent der Höhe. Was mittig wirken soll, wird leicht nach oben gesetzt. Exakt mittig sieht immer etwas zu tief aus.

### Ausrichtung: jedes Element hat einen Bezugspunkt

**Das ist die Regel, an der ein Layout am schnellsten scheitert.** Größen können alle stimmen, und es sieht trotzdem zusammengewürfelt aus, weil die Dinge frei in der Fläche hängen.

**Nichts steht für sich. Jedes Element teilt eine Kante mit einem anderen.**

- Alle Textblöcke beginnen auf **derselben linken Kante**. Auch Schreibschrift. Der Anstrich verführt dazu, sie optisch auszugleichen und ein paar Pixel nach links zu ziehen. Das sieht nicht ausgeglichen aus, es sieht verrutscht aus.
- Steht eine Grafik neben Text, **enden beide auf derselben Linie**. Bei den Human-Design-Pins endet der Textblock exakt auf der Unterkante des Bodygraph. Das ist der Unterschied zwischen "da liegt was" und "das gehört zusammen".
- Was sich nicht auf ein anderes Element beziehen kann, bezieht sich auf eine **goldene Linie** oder den Außenrand.

**Voraussetzung dafür: Grafiken brauchen eine viewBox ohne Leerraum.** Hat eine SVG unten oder seitlich Luft, richtet man am unsichtbaren Rahmen aus statt an der sichtbaren Zeichnung, und die Flucht stimmt nur auf dem Papier. Bei jeder eingebundenen Grafik einmal die Bounding Box messen und die viewBox darauf setzen.

**Der Kasten ist nicht die Schrift.** Ergänzt am 14.08.2026, nachdem Jasmin bei den Human-Design-Pins einen Versatz gesehen hat, den das Skript für unmöglich hielt. Text und Grafik lagen auf demselben Wert, `bottom: 233px`, und trotzdem stand der Text sichtbar höher.

Der Grund: Unter der letzten Textzeile sitzt immer noch der halbe Zeilendurchschuss. Bei 38 px und Zeilenabstand 1,4 sind das 13 px Luft zwischen der Grundlinie und der Unterkante des Kastens. Eine Grafik hat diese Luft nicht, ihre Kante ist die Zeichnung selbst. Wer beide auf denselben Wert setzt, bekommt garantiert einen sichtbaren Versatz.

- **Der Abstandswert gilt für das Sichtbare, nicht für den Kasten.** Soll die Schrift 233 vom Rand sitzen, muss ihr Kasten auf 220.
- **Bezug ist die Grundlinie, nicht die unterste Pixelzeile.** Sonst sitzt jedes Layout anders hoch, je nachdem ob das letzte Wort ein p oder g enthält. Unterlängen dürfen überstehen, wie ein Komma am Zeilenrand.
- **Nachmessen statt rechnen.** Die Luft hängt an Schrift, Größe und Zeilenabstand. Im fertigen Bild die unterste Pixelzeile der Schrift gegen die der Grafik halten. Der Wert gehört als benannte Konstante ins Skript, nicht als Zahl mitten ins Layout.

**Test:** Für jedes Element im Layout die Frage beantworten, woran es ausgerichtet ist. Gibt es auf eine Antwort keine Antwort, hängt es in der Luft.

### Prüfung in dreißig Sekunden

1. Lassen sich alle Schriftgrößen in der Leiter oben wiederfinden? Wenn eine Größe dazwischenliegt, ist sie geraten.
2. Liegen mindestens zwei Stufen zwischen der größten und der zweitgrößten Schrift?
3. Sind alle Abstände aus der Fibonacci-Folge?
4. Ist der Abstand zwischen zwei Blöcken größer als innerhalb eines Blocks?
5. Sitzt das Wichtigste auf einer goldenen Linie oder einer Drittel-Linie, nicht in der Mitte?
6. **Woran ist jedes einzelne Element ausgerichtet?** Für jedes muss es eine Antwort geben.
7. **Hat eine Zeile ein Loch?** Kurze Zeile mit viel Leerraum daneben heißt: Umbruch von Hand setzen.

---

## 2. Typografie: die drei Fehler, die sofort auffallen

**Schusterjunge und Hurenkind.** Ein einzelnes Wort allein in der letzten Zeile ist der klassische Anfängerfehler. Genauso eine einzelne Zeile, die vom Absatz getrennt umbricht.

**Regel:** Kein Wort unter vier Buchstaben darf am Zeilenende allein stehen. Kurze Wörter wie "an", "in", "zu", "du", "es", "am" werden mit einem geschützten Leerzeichen an das folgende Wort gebunden. Bei Überschriften gilt zusätzlich: die letzten zwei Wörter bleiben immer zusammen.

Falsch: *Ich habe mir eine Mitarbeiterin gebaut. An*
*einem Nachmittag.*
Richtig: *Ich habe mir eine Mitarbeiterin gebaut.*
*An einem Nachmittag.*

**Umbrüche an der Sinngrenze.** Wo eine Zeile bricht, entsteht eine Pause. Sie gehört zwischen Sinneinheiten, nicht mitten hinein.

**In schmalen Spalten wird jeder Umbruch von Hand gesetzt.** Der automatische Umbruch füllt jede Zeile bis zum Anschlag und lässt die nächste kurz. So entstehen Löcher: eine Zeile mit zwei Wörtern und danebem eine halbe Spalte Leerraum. Bei einem Fließtext fällt das nicht auf, bei drei Zeilen auf einem Pin sofort.

**Die Zeilen sollen ungefähr gleich lang sein.** Lieber den Satz um ein Wort kürzen, als eine unausgewogene Aufteilung stehen lassen. Der Text ist nicht heilig, das Layout schon.

**Sicherheitsnetz beim Bauen:** Wenn die Umbrüche fest im Text stehen, den automatischen Umbruch abschalten (`white-space: nowrap`). Eine zu lange Zeile läuft dann sichtbar heraus und fällt sofort auf, statt sich still ein viertes Mal umzubrechen.

**Zeilenlänge.** Fließtext liest sich am besten bei 45 bis 75 Zeichen je Zeile. Überschriften dürfen kürzer, aber nie über die halbe Bildbreite hinaus flattern.

---

## 3. Wo Dinge stehen: goldener Schnitt und Drittelregel

**Der goldene Schnitt** teilt eine Strecke im Verhältnis 1 zu 1,618. Was auf dieser Linie liegt, wirkt für das Auge richtig gesetzt, ohne dass jemand sagen könnte warum. Die Zahlen dazu stehen in Abschnitt 1.

Praktisch reicht oft die **Drittelregel**, die gröbere Schwester: Fläche gedanklich in drei Spalten und drei Zeilen teilen. Wichtiges kommt auf die Linien oder ihre Kreuzungspunkte.

**Mitte ist die schwächste Position.** Sie wirkt statisch und unentschieden, außer man will ausdrücklich Symmetrie.

---

## 4. Gesichter: die harte Regel

**Über einem Gesicht steht nie Text.** Auch kein halbdurchsichtiger Schleier über den Augen.

Der Blick des Betrachters springt in Millisekunden zuerst auf Augen. Wer sie verdeckt, nimmt dem Bild genau das, wofür man ein Foto mit Mensch überhaupt nimmt.

**Wohin der Text stattdessen gehört**, je nach Foto:
- Person sitzt oder steht mittig → Text in die untere Hälfte, etwa auf Bauchhöhe oder darunter
- Person steht seitlich → Text auf die freie Seite
- Person im unteren Bildteil → Text nach oben
- Kein freier Bereich vorhanden → anderes Foto nehmen, nicht den Text kleiner machen

**Prüfung vor dem Abspeichern:** Bild kurz zukneifen. Sind Augen und Mund frei, passt es.

---

## 5. Lesbarkeit auf Fotos

Text auf Bild braucht Kontrast, sonst ist er Dekoration.

- **Verlauf statt Fläche.** Ein weicher Verlauf von der Textseite her verdunkelt nur dort, wo er gebraucht wird. Eine gleichmäßige Abdunklung über das ganze Bild macht das Foto tot.
- **Nie unter 60 Prozent Deckkraft** im Bereich des Textes, sonst flimmert es.
- **Schatten sparsam.** Ein weicher, weiter Schatten hilft. Ein harter Schlagschatten sieht nach neunziger Jahren aus.

---

## 6. Drei Kleinigkeiten, die sofort billig aussehen lassen

Festgehalten am 13.08.2026 bei den Human-Design-Pins.

**Text läuft nie in eine Grafik hinein**, auch nicht in eine mit zehn Prozent Deckkraft. Solange irgendwo Platz frei ist, gibt es keinen Grund dafür. Grafik und Textblock bekommen getrennte Zonen, die sich nicht überschneiden.

**Schreibschrift muss an derselben Kante beginnen wie alles andere.** Bei Brittany verführt der Anstrich dazu, das Wort optisch auszugleichen und ein paar Pixel nach links zu schieben. Das sieht nicht ausgeglichen aus, es sieht verrutscht aus. Gleiche Kante wie Überschrift und Fließtext.

**Die Fußzeile ist eine Fußzeile.** Adresse und Quellenangabe stehen im normalen Schnitt, nicht fett, und mit reduzierter Deckkraft. Fett gesetzt konkurriert sie mit der Aussage.

---

## 7. Die Gestaltgesetze, die im Alltag wirklich zählen

Aus der Gestaltpsychologie, seit hundert Jahren unverändert gültig:

- **Nähe.** Was zusammengehört, steht dicht beieinander. Abstände sind Aussagen. Der Abstand zwischen Überschrift und ihrem Text muss kleiner sein als der zum nächsten Block, sonst ordnet das Auge falsch zu.
- **Ähnlichkeit.** Gleiches sieht gleich aus. Zwei Dinge in unterschiedlicher Farbe werden als unterschiedlich gelesen, auch wenn sie es nicht sind.
- **Geschlossenheit.** Das Auge ergänzt Angefangenes selbst. Deshalb wirken angeschnittene Bilder lebendiger als vollständig gezeigte.
- **Figur und Grund.** Es braucht eine klare Entscheidung, was vorn ist. Alles gleich laut heißt nichts ist laut.
- **Gemeinsame Richtung.** Elemente, die in dieselbe Richtung zeigen, werden als Gruppe gelesen.

---

## 8. Weißraum

Weißraum ist kein ungenutzter Platz, sondern das, was das Wichtige wichtig macht.

- Außenrand nie unter fünf Prozent der Bildbreite. Bei 1000 Pixel gilt der Wert aus Abschnitt 1: 89.
- Lieber weniger Inhalt größer als viel Inhalt klein.
- Wenn eine Fläche voll aussieht, wird nicht verkleinert, sondern weggelassen.

---

## 9. Was Jasmin nie will

Aus `context/brand-guidelines.md`, hier als Gestaltungsregel:

Keine verspielten Illustrationen, kein Glitzer, keine Emojis als Gestaltungsmittel, kein Rosa und Lila, kein Kitsch. Keine Stock-Klischees. Bildsprache professionell, natürlich, nahbar.

Maximal drei Farben je Layout, maximal drei Hierarchieebenen je Seite.

**Brittany Signature** nur als Akzent: ein Wort je Layout, nie eine ganze Zeile. Sonst kippt es ins Verspielte.

---

## 10. Besonderheit Pinterest

- **Format 1000 × 1500**, also 2:3. Alles andere wird beschnitten oder klein angezeigt.
- **Im Feed ist ein Pin daumengroß.** Prüfung: Bild auf Daumennagelgröße verkleinern. Ist die Überschrift dann noch lesbar, ist sie groß genug. Wenn nicht, weniger Wörter.
- **Text gehört ins Bild**, nicht nur in die Beschreibung. Pinterest wird gescannt, nicht gelesen.
- **Wiedererkennbarkeit vor Abwechslung.** Gleiche Schrift, gleiche Farben, gleiche Anordnung. Ein Profil, das wie ein Profil aussieht, wird eher abonniert.

**Nicht nur Farbkacheln.** Festgehalten am 17.08.2026, nachdem eine ganze Woche aus reinen Textpins bestand. Jasmins Urteil: Bilder ziehen anders, und ein Profil ohne Gesicht bleibt austauschbar. Deshalb gehört in jede Serie auch etwas Gegenständliches:

- **Bei allem Persönlichen ihre eigenen Fotos.** Fünfzehn Stück in Webgröße liegen in `reference/fotos/`, welches Bild was zeigt steht in `reference/fotos/README.md`. Generator: `.claude/scripts/pins-foto.py`. Die Regeln aus Abschnitt 4 und 5 gelten dabei weiter, Text nie über das Gesicht.
- **Bei Gesundheit die Produktbilder**, freigestellt in `projects/zinzino/reference/produktbilder/`.
- Textkacheln bleiben richtig, sie sind nur nicht die ganze Serie.

**Eine Woche deckt alle Themen ab, nicht nur eines.** Jasmin hat mehrere Standbeine, und Pinterest soll sie alle bedienen: Femcode, Gesundheit, Human Design und die eigene Website. Bei drei bis vier Pins am Tag heißt das, jeden Tag aus verschiedenen Töpfen zu ziehen. Vier Tage hintereinander dasselbe Thema ist auch dann falsch, wenn genug Material dafür da wäre.

---

## 11. Verbrannte Formulierungen

Stehen hier, weil sie Gestaltung und Text gleichzeitig betreffen.

- **"Geld und Vorsorge"** klingt nach Strukturvertrieb. Nie verwenden.

## Zeilenumbrüche werden von Hand gesetzt

Festgehalten am 18.08.2026, nachdem Jasmin bei vier Pins dasselbe angemerkt hat: "Da ist wieder was in die nächste Zeile gerutscht, das darf nicht passieren."

**Die automatische Bindung reicht nicht.** Die Funktion `binde()` in den Pin-Generatoren hängt kurze Wörter (bis drei Buchstaben) und die letzten beiden Wörter mit einem geschützten Leerzeichen zusammen. Sie verhindert damit einzelne Schusterjungen, sie kann aber keine gleichmäßigen Zeilen erzeugen. Alles dazwischen bricht so um, wie der Browser es für richtig hält, und das Ergebnis sieht unruhig aus.

**Deshalb bekommt jeder Hook seine Zeilen von Hand**, über `<br>` im Text. Beide Generatoren können das seit dem 18.08.2026, `pins-foto.py` hat es an diesem Tag dazubekommen.

**Wie viele Zeichen eine Zeile trägt**, bei 822 px Textbreite:

| Schriftgröße | Zeichen je Zeile |
|---|---|
| 100 px | 14 |
| 79 px | 18 |
| 62 px | 23 |

Bei Playfair (Gesundheitsbereich) läuft die Schrift breiter, dort sind bei rund 19 Zeichen Schluss.

**Die Generatoren warnen selbst**, wenn eine Zeile zu lang ist. Erscheint beim Bauen eine Warnung, wird der Umbruch korrigiert, nicht ignoriert.

**Und ein Wort mit Bindestrich nie über zwei Zeilen ziehen.** "Live-Webinar" als "Live-" am Zeilenende und "Webinar." allein darunter sieht billig aus.

## Fluchtlinien halten, über alle Formate hinweg

Festgehalten am 22.08.2026, nachdem Jasmin in der Pinterest-Übersicht einen Ausreißer entdeckt hat.

**Die Regel:** Gleichartige Elemente sitzen in einer Serie immer auf derselben Höhe. Kopfzeile oben, Fußzeile unten, bei jedem Pin gleich. Das gilt genauso für die Website: Abschnittsanfänge und Fußzeilen dürfen zwischen Seiten nicht springen.

**Warum das mehr ist als Pedanterie:** Auf Pinterest liegen die Pins nebeneinander in einem Raster. Ein einzelner Ausreißer fällt dort sofort auf, weil das Auge die Kante der Nachbarn als Linie liest. In der Einzelansicht sieht derselbe Pin völlig in Ordnung aus. **Serien werden deshalb nebeneinander geprüft, nicht einzeln.**

**Wie geprüft wird:** an den echten Werten, nicht nach Augenmaß. Alle Pins sind 1000 x 1500, die Kopfzeile steht in den aktuellen Skripten überall auf `top: 144px`. Weicht ein Pin ab, stammt er aus einer älteren Erzeugung und wird neu gebaut, nicht nachgerückt.

## Schriftgröße wird gemessen, nicht aus der Zeichenzahl geraten

Festgehalten am 04.09.2026, nachdem auf zwei Pins der Text rechts aus dem Bild lief
und auf fünf weiteren Zeilen wie "brauchst" und "an und bringst" allein standen.

Zwei Fehler steckten in `.claude/scripts/pins.py`, beide seit Anfang an:

1. **Die Größe kam aus der Zeichenzahl.** Das Skript zählte Buchstaben und wählte
   danach 62, 79 oder 100 Pixel. Ein Satz mit breiten Wörtern ist bei gleicher
   Zeichenzahl aber deutlich breiter als einer mit schmalen. Bei "automatisieren"
   und "angestellt" reichten die 822 Pixel Textspalte dann nicht.
2. **`binde()` hat Wörter zusammengeklebt.** Jedes Wort mit höchstens drei
   Buchstaben und die letzten zwei Wörter bekamen ein geschütztes Leerzeichen.
   Aus "an und bringst" wurde ein unteilbarer Klotz, davor blieb eine halbleere
   Zeile stehen.

**So läuft es jetzt:** Chrome baut die Seite zweimal. Im ersten Durchgang misst ein
kleines Skript die echten Zeilenkästen in der echten Schrift und probiert die
Schriftleiter von 100 abwärts durch, bis keine Zeile breiter als 822 Pixel ist und
der Block nicht in die Fußzeile läuft. Im zweiten Durchgang wird mit dieser Größe
das Bild gemacht. Den Umbruch selbst macht `text-wrap: balance`, damit die Zeilen
ungefähr gleich lang werden.

Das Skript druckt bei jedem Pin die gewählte Größe und die breiteste Zeile mit.
**Damit ist die Kontrolle eine Zahl und kein Hinsehen.** Steht dort "ZU BREIT", ist
der Hook zu lang und muss gekürzt werden, nicht das Layout geändert.

### Der Textblock hängt nicht mehr an einer festen Höhe

Nachgezogen am selben Tag, weil die gemessene Schriftgröße einen zweiten Fehler
sichtbar gemacht hat. Der Block hing mit `top: 573px` an der goldenen Gegenlinie und
konnte nur nach unten wachsen. Bei zwei bis drei Zeilen sah das gut aus. Bei fünf und
sechs Zeilen klebte der Text an der Fußzeile, während oben ein Loch blieb. Jasmins
Urteil: "Die stehen ja schon unten fast bei der Webseite."

**Jetzt steht der Block in einem festen Feld von 233 bis 1267** und sitzt darin mittig.
233 ist eine Fibonacci-Zahl, oben und unten derselbe Abstand. Damit ist der Rand nach
oben und unten immer gleich, unabhängig von der Zeilenzahl.

Damit ist die Regel "nie mittig" aus Abschnitt 1 für diesen Block aufgehoben, und zwar
bewusst. Sie galt für die Anordnung auf der Fläche, nicht für einen Textblock, dessen
Höhe sich mit dem Inhalt ändert. Eine feste Marke von oben funktioniert nur, solange
alle Texte gleich lang sind. Das war nie der Fall.

Gilt für alle Pin-Skripte. `pins-hd.py`, `pins-klarheit.py` und `pins-zinzino.py`
tragen den alten Stand noch und müssen nachgezogen werden, bevor dort neu gebaut wird.

# Übergabe: der Stil "Schaltzentrale" für andere Projekte

Von: zweiter Claude (Partnerportal). Für: den Claude, der die Landingpage für die Sportler Johnny und Kevin überarbeitet.
Stand: 10.11.2026. Auftrag von Jasmin, in ihren Worten: Die Landingpage soll vom kompletten Design her noch einmal angepasst werden,
"dass die wirklich so richtig nonplusultra ist". Sie soll zu unserem Stil passen, aber nicht in unseren Farben:
"für die Sportler macht das mit diesen Grüntönen so gar keinen Sinn. Aber ich mag den Stil."

## Worum es geht

Jasmin hat sich beim Partnerportal für den Entwurf B "Schaltzentrale" entschieden. Dieser Stil ist die Vorlage.
Zum Ansehen: `von-zweiter-claude/entwuerfe-2026-11-09/entwurf-b-schaltzentrale.html` (eine Datei, Doppelklick genügt)
und das Video `von-zweiter-claude/entwuerfe-2026-11-09/videos/b-schaltzentrale-1440.mp4`.

Übernommen wird die Formensprache. Nicht übernommen werden die Farben von Ursprungskraft (Oliv, Beige, Khaki).

## Was Jasmin daran mag (das muss bleiben)

1. Die Leiste unten, "so ein bisschen Apple-mäßig": schwebt mittig am unteren Rand, runde Symbolfelder, die unter der Maus wachsen. Am Handy eine schwebende Leiste in Pillenform.
2. Dunkler Grund mit wenigen hellen Flächen als Blickpunkt. Nicht alles gleich laut.
3. Felder in verschiedenen Größen statt gleicher Kacheln. Ein großes Feld führt, die anderen ordnen sich unter.
4. Sehr große Zahlen und Überschriften in Jost, daneben ruhiger Text in Inter.
5. Echte Fotos als ganze Felder, keine Symbolbildchen und keine nachgebauten Bildschirme.
6. Bewegung mit Sinn: Felder bauen sich gestaffelt auf, Zahlen zählen hoch, ein Feld wächst beim Klick zur großen Ansicht.

Was sie ausdrücklich nicht will: dass es "nach Claude, nach KI" aussieht. Also keine Leuchtflecken, keine Glas-Pillen überall,
keine drei gleichen Kästen nebeneinander, keine kleinen Großbuchstaben-Zeilen über jeder Überschrift, kein Menü links mit Liste rechts.

## Die Formensprache in Werten

| Baustein | Wert |
|---|---|
| Grund | sehr dunkel, fast schwarz mit einem Hauch Farbe (im Portal #1F2418) |
| Feld | eine Stufe heller als der Grund (im Portal #2F3524), ohne Rand, ohne Schatten |
| Blickpunkt | ein einziges helles Feld je Bildschirm (im Portal #FBF9F4) mit dunkler Schrift |
| Akzent | eine einzige Akzentfarbe, sparsam (im Portal Khaki hell #CFC4A0): aktives Symbol, kleine Zeilen, ein Feld |
| Ecken | Felder 22 Pixel, Knöpfe als Pille, kleine Symbolfelder 16 Pixel |
| Abstand zwischen Feldern | 12 Pixel |
| Überschriften | Jost 500, große Zahlen bis 200 Pixel, Laufweite eng (minus 0,05 em) |
| Text | Inter 400 und 600, 15 bis 18 Pixel |
| Raster am Computer | 12 Spalten, 6 Zeilen, ein Bildschirm ohne Scrollen, wo es der Inhalt erlaubt |
| Raster am Handy | eine Spalte, Felder untereinander, Leiste schwebt unten |
| Bewegung | Aufbau gestaffelt 70 ms je Feld, Dauer bis 900 ms mit weichem Auslauf cubic-bezier(.16, 1, .3, 1), bei "Bewegung reduzieren" alles aus |

## Farben für die Sportler

Die Farben gehören zu Johnny und Kevin, nicht zu Ursprungskraft. Bitte Jasmin fragen oder aus dem vorhandenen Auftritt der beiden ableiten
(Trikot, Verein, Sportart, Logo). Regeln, damit der Stil trotzdem wiedererkennbar bleibt:

- Ein dunkler Grund, ein Feldton, ein helles Blickpunkt-Feld, genau eine Akzentfarbe. Mehr Farben nicht.
- Kein Grün, kein Beige, kein Khaki.
- Kontrast für Text mindestens 4,5 zu 1.
- Nichts erfinden: keine Erfolge, Zahlen oder Zitate, die nicht belegt sind. Fehlendes als [FEHLT: ...] markieren.

## Was auch dort gilt (Regeln von Jasmin)

- Du-Ansprache, klare Sätze, keine Gedankenstriche in sichtbaren Texten, Prozent mit Leerzeichen ("20 %").
- Erst der Nutzen, dann die Beschreibung.
- Kein Framework, kein Build-Schritt, Schriften selbst gehostet (Jost und Inter liegen in `website/schriften/`).
- Am Handy eine eigene, vollwertige Ansicht, nicht nur die verkleinerte Computerseite.
- Nichts veröffentlichen ohne Jasmins Freigabe. Lokal arbeiten, als ZIP zurückgeben, mit Bildschirmfotos von Computer und Handy.
- Vor dem großen Umbau zwei oder drei Richtungen als anklickbare Entwürfe zeigen und Jasmin wählen lassen. Das hat beim Portal viel Guthaben gespart.

## Was ich nicht weiß

- Ich kenne die Landingpage von Johnny und Kevin nicht. Sie liegt nicht in meinem Arbeitsordner. Wo sie liegt und was sie können muss, weiß Jasmin.
- Der Entwurf B wurde nur im Browser der Prüfumgebung geprüft (1440 und 390 Pixel breit), nicht auf echten Handys.
- B geht an drei Stellen über die Ursprungskraft-CI hinaus (runde Ecken, dunkler Grund, weicher Verlauf unter Schrift auf Fotos). Jasmin hat sich in Kenntnis davon für B entschieden.

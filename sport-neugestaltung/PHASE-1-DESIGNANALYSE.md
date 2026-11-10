> **Analyse vom Anfang, teilweise überholt** (zum Beispiel Graphit statt Anthrazit). Der aktuelle Stand steht in `ERGEBNIS.md` und `00-UEBERGABE.md`.

# Phase 1: Designanalyse und Designvorschlag

Stand: 10.11.2026. Grundlage: `AUFTRAG.md`, `03-marke/ursprungskraft-ci.md`, `02-ebook/quellen-html/LIESMICH.md`,
`seite.html`, `partner.json`, `bauen.py` (beide), `vorlage.html`, `ebook.css`, `empfehlung.css/.js`, alle Bilder,
die heutigen Seiten und PDFs (gerendert) sowie der Stil-Entwurf „Schaltzentrale“ (`04-neuer-stil/`).
Noch nichts umgebaut. Vergleichsbilder liegen in `_pruefung/phase-1/`.

## 1. Was heute schwach ist

**Landingpage**
- Hellblau überall: Header, Hero, Abschnitte und Footer haben fast denselben Ton. Es gibt keinen Rhythmus, nichts führt den Blick.
- Der Hero ist ein Standard-Zweispalter (Text links, Foto rechts). Die Headline ist mittelgroß, der Sportler wirkt wie ein Beiwerk.
- Sechs gleiche Karten (Bild, Nummer, Titel, Text) und danach drei weitere gleiche Karten: genau das austauschbare Kachelmuster.
- Kleine Großbuchstaben-Zeilen über jeder Überschrift, Knöpfe mit 4 px Ecken, sehr ähnliche Abstände in jedem Abschnitt.
- Der Rechner ist ein weißes Kästchen mit Standardfeld. Das stärkste Erlebnis der Seite (3,6 Liter) ist optisch klein.
- Videos und Formular sind sauber, aber ohne gestalterische Gewichtung.

**E-Book**
- Jede Seite beginnt mit demselben hellblauen Kopfband. 14 Seiten, eine einzige Seitenform.
- Viele hellblaue Kästen, Karten und Rahmen nebeneinander, kleine Schrift (Fließtext um 9,5 bis 10,5 pt in Kästen).
- Das Cover zeigt ein austauschbares Wasserhahn-Foto. Der Sportler, der das Buch empfiehlt, steht nur klein unten.
- Kapitelnummern weiß auf Hellblau: kaum sichtbar.

## 2. Potenzial und Grenzen der Fotos

- **Kevin** (`kevin.webp`, 736 × 736 px): starke Pose, warmes Licht, Hintergrund Studio und Gym unruhig. Ein enger, hoher Ausschnitt (Kopf bis Hüfte) beruhigt das. **Auflösung ist knapp**: als großes Bildfeld am Computer leicht weich, im A4-Cover rund 90 dpi.
- **Johny** (`johny.webp`, 1125 × 1107 px): sehr gutes Porträt, direkter Blick, Geste zum Kopf (Fokus), dunkler warmer Grund. Funktioniert randabfallend. Gelbes Shirt und Blau als Akzent ergänzen sich.
- **Die sechs Vorteilsbilder und drei Meal-Prep-Bilder** zeigen immer dasselbe Model in hellem, glattem Licht. Sie wirken generiert und beißen sich mit einem dunklen, hochwertigen Auftritt. Ich ersetze nichts, setze sie aber kleiner, einheitlich zugeschnitten und farblich leicht zurückgenommen ein, damit die echten Sportlerfotos führen.
- Eddie Hall und Ronaldo: Video-Screenshots in niedriger Auflösung. Sie bleiben Video-Poster, nicht großflächig.

**Bitte prüfen:** Gibt es von Kevin und Johny größere Originale (ab etwa 2000 px Höhe)? Damit wird Hero und Cover deutlich schärfer. Ohne sie baue ich mit den vorhandenen Dateien und wähle die Bildgrößen so, dass nichts sichtbar pixelt.

## 3. Technische Grenzen und was wiederverwendbar ist

- Inter und Jost sind selbst gehostet, beide variabel von 400 bis 700. Keine neue Schrift nötig.
- `bauen.py` ersetzt nur Platzhalter. Das Design hängt komplett an `seite.html` und `empfehlung.css`. Akzentfarbe je Sportler setze ich über das schon vorhandene `data-kurz` am `body`, mit einer Standardfarbe für spätere Sportler. `partner.json` bleibt unverändert.
- `empfehlung.js` (Rechner, Formulare, Zähler, Einblenden, Handy-Knopf) bleibt unverändert. Alle IDs und Klassen-Haken bleiben dran, ich ergänze nur Klassen.
- Das E-Book wird weiter über `vorlage.html`, `ebook.css`, `bauen.py` und `pdf-erzeugen.js` gebaut. Für das Sportler-Cover gibt es in `bauen.py` schon den Wert `foto_pos_titel`, er wird heute nicht genutzt.
- Die Cover-Vorschau auf der Landingpage (`ebook-kevin.jpg`, `ebook-johny.jpg`) erzeuge ich aus dem neuen PDF neu.

## 4. Der Designvorschlag: „Graphit Editorial“

**Kurz:** Ein dunkler, ruhiger Auftritt wie ein Sportmagazin, gebaut aus der Formensprache der „Schaltzentrale“
(Felder in verschiedenen Größen, ein heller Blickpunkt je Bildschirm, sehr große Jost-Zahlen), aber in Graphit
statt Oliv und mit genau einer Akzentfarbe je Sportler.

- **Farbwelt:** Graphit `#171A1C` als Grund, eine Stufe heller `#23272A` für Felder, warmes Off-White `#F3F1EB` als heller Blickpunkt und für die ruhigen Leseabschnitte, Steingrau `#B6B8B5` für Nebentext. Akzent nur je Sportler: Kevin Kupfer `#CF6844`, Johny Sportblau `#4261CC`. Nachgerechnete Kontraste: Kupfer auf Graphit 4,76 : 1 (reicht), weiße Schrift auf Kupfer nur 3,67 : 1, darum bekommen Kevins Knöpfe Graphit-Schrift (4,76 : 1). Sportblau auf Graphit nur 3,18 : 1, weiße Schrift auf Blau 5,51 : 1: Johnys Knöpfe also mit weißer Schrift, kleine Akzentschrift auf Dunkel in einer helleren Stufe `#8DA0EE` (6,99 : 1). Kein Grün, kein Beige, keine Verläufe.
- **Typografie:** Jost 500 bis 600, groß und eng gesetzt (Laufweite bis minus 0,04 em), für Headlines und Zahlen bis etwa 140 px. Inter 400 für ruhigen Fließtext in 16 bis 20 px. Alle Größen aus der Leiter 1,272 (16 · 20,4 · 25,9 · 32,9 · 41,9 · 53,3 · 67,8 · 86,2 · 109,7 · 139,5). Die kleinen Eyebrow-Zeilen bleiben als Text erhalten, werden aber leiser gesetzt (normale Schreibweise statt gesperrter Versalien).
- **Bildsprache:** Das Sportlerfoto ist im Hero ein großes, hohes Bildfeld, nicht ein Kästchen neben dem Text. Die übrigen Fotos treten zurück (einheitlicher Zuschnitt, leicht entsättigt). Keine neuen Fotos, keine Effekte auf Bildern.
- **Seitenrhythmus:** Dunkler Hero mit Bildfeld und Zahlenfeldern, großes Zitat als reine Typografie, heller Leseabschnitt für „Warum Sportler umsteigen“ (asymmetrisch statt sechs gleicher Karten), dunkles Sportvideo, der Rechner als das helle Blickpunkt-Feld mit riesiger Literzahl, Videos als zwei unterschiedlich große Felder, heller Meal-Prep-Teil, die fünf pH-Werte als große Zahlenleiter, Formular als helles Feld auf Dunkel, E-Book hell. Felder mit 20 px Rundung, Knöpfe als Pille, 12 px Abstand zwischen Feldern.
- **Bewegung:** Felder bauen sich gestaffelt auf (70 ms), Zahlen zählen wie bisher einmal hoch, ruhige Hover. Unten eine schwebende Leiste wie in der Schaltzentrale, aber **deckend Graphit, ohne Glas und ohne Unschärfe**: Sprungmarken zu Rechner, Video, Gerät und E-Book. Bei „Bewegung reduzieren“ ist alles statisch.
- **E-Book:** Cover randabfallend mit dem Sportlerfoto in Graphit, Titel „Das unterschätzte Supplement“ groß in Off-White, Name des Sportlers deutlich, Akzent nur als feine Linie. Innen helles Papier `#F3F1EB` mit Graphit-Schrift, ein fester Satzspiegel, große Kapitelnummern im Akzent, Haarlinien statt Kästen. Dunkle Seiten nur gezielt (Vorwort, Kapitel 7 und Schluss) als Rhythmus. Blocksatz und Trennregeln bleiben.

## 5. Wo sich Vorgaben widersprechen (mein Umgang damit)

- **Schaltzentrale-Leiste vs. Verbot „transparente Glaspillen“:** Ich übernehme die Leiste, aber deckend und ohne Glas. Hier brauche ich dein Ja.
- **„Zahlen zählen hoch“ vs. „keine übermäßig animierten Zahlen“:** Es bleibt beim heutigen, einmaligen Hochzählen der drei Kennzahlen. Nichts Zusätzliches.
- **Weicher Verlauf unter Text auf Fotos (Entwurf B):** Lasse ich weg. Text steht auf ruhigen Flächen, nicht auf dem Foto.
- **Partner-Text:** Bei Kevin steht in `partner.json` „mit über 800.000 Followern“. Das sind Instagram-Follower und YouTube-Abonnenten zusammen. Ich ändere nichts, weise nur darauf hin.
- Redaktionelle Suche in den Quellen (Fans, –, —, Prozent): heute null Treffer im sichtbaren Text.

## 6. Nächster Schritt nach deiner Freigabe

Phase 2: Landingpage vom Hero bis einschließlich Rechner, E-Book-Cover und eine Kapitelseite, jeweils für Kevin und Johny,
mit Bildschirmfotos (1440, 768, 375, 320 px) und PDF-Vorschau, auch klein.

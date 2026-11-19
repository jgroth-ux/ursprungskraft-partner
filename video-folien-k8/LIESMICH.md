# Video-Folien LeveLuk K8: technische Übersicht

Folien zum Einblenden in Daniels K8-Video (Ursprungskraft). Für den Cutter siehe `UEBERGABE.md`.

## Inhalt

| Pfad | Was |
|---|---|
| `png/` | 9 fertige Folien, 1920 x 1080 (`folie-01-hexagonal.png` bis `folie-09-antioxidantien.png`) |
| `png-einblendungen/` | 5 Leisten für den Glastest, 1920 x 1080, transparenter Hintergrund |
| `folien-k8.pdf` | alle 9 Folien, eine pro Seite |
| `einblendungen-k8.pdf` | die 5 Leisten zur Ansicht auf einem Küchenfoto |
| `folien.html` | Quelle aller 9 Folien (Texte hier ändern) |
| `einblendungen.html` | Quelle der 5 Leisten (eine `<section>` pro Leiste) |
| `render.js` | erzeugt `png/` und `folien-k8.pdf` aus `folien.html` |
| `render-einblendungen.js` | erzeugt `png-einblendungen/` aus `einblendungen.html` |
| `bilder/` | Fotos und Strukturbilder, Quellen in `bilder/QUELLEN.md` |
| `schriften/` | Jost 500 und Inter 400/500/600 als woff2, lokal eingebunden (kein Internet nötig) |
| `vorschau-*.jpg` | Vorschau der Leisten auf einem Küchenfoto |

## Neu rendern

Voraussetzung: Node.js und Playwright mit Chromium (`npm i playwright` und `npx playwright install chromium`).

```bash
node render.js                 # alle Folien als PNG und die PDF
node render.js 04              # nur Folie 4
node render-einblendungen.js   # alle Leisten
```

## Gestaltung

- Hintergrund `#FAF7F0` (Creme), Felder `#F3EDE3` und `#EADFCC` (Sand)
- Schrift `#2F3524` (Dunkel-Olive), Nebentext `#5F6650`
- Überschriften Jost 500, Text Inter
- pH-Farben 4 bis 10 aus der Original-Farbtabelle des Tropfentests gemessen
- Keine Gedankenstriche, Komma als Dezimalzeichen, Inhalte so, wie Daniel sie im Video sagt

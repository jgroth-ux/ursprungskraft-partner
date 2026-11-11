# Bild-Prompts für die Partnerseiten

Stand 11.11.2026. Wo ein Foto fehlt, zeigt die Seite ein ruhiges Feld mit kurzer Beschreibung (lokal gut zu sehen).
Für alle Prompts gilt: realistische Größenverhältnisse, keine Logos, keine Schrift im Bild, **kein Wassergerät im Bild**,
natürliches Licht, warme und leicht zurückgenommene Farben, echte Materialien (Holz, Stein, Leinen), keine Labor- oder
Medizinbilder, keine Leuchteffekte. Ablage als JPEG, lange Kante wie angegeben, Qualität etwa 78.

## Neu zu erstellen

### 1. `website/p/bilder/sport-hero.jpg` (Sport, großes Bild oben rechts)

Hochformat 4 : 5, 1200 x 1500 px. Unten links liegt die Karte "Empfohlen von" darüber, dort also ruhiger Bildteil.
Wichtig: Kein bekanntes Gesicht, die Person soll nicht wie ein Promi wirken (der Partner steht daneben).

> Realistic photo, portrait format 4:5. A fit woman in her early thirties in a simple dark grey training top sits on a
> wooden bench in a bright, minimal home gym or small studio after a workout and drinks from a clear glass of water.
> Slight sweat on her forehead, relaxed expression, eyes half closed. Natural daylight from a large window on the left,
> warm muted tones, olive and beige surroundings, a rolled linen towel and a kettlebell on the floor, plants in the
> background. Realistic body proportions, realistic glass size. No logos, no text, no brand names, no water filter or
> water machine visible, no plastic bottles. Lower left third of the image calm and slightly darker. Shot on 50 mm, f/2.8.

Zweite Fassung zur Auswahl (Mann, draußen):

> Realistic photo, portrait format 4:5. A man in his late thirties in a plain olive running shirt stands on a quiet
> stone terrace after a morning run and drinks a glass of water, morning light from behind, warm muted colours, trees
> softly out of focus. Realistic proportions. No logos, no text, no water machine, no plastic bottle. Calm lower left area.

## Schon auf dem Server (von den Sportseiten Kevin und Johny), bitte prüfen

Die Sportseite nutzt diese Dateien unter `/bilder/partner/` mit. Sie liegen nicht im Paket, darum zeigt die lokale
Vorschau dort Platzhalter. **Prüfen:** Ist auf einem davon Kevin oder Johny zu sehen? Dann bitte ersetzen
(Sportseite ohne Promi), Prompts dafür unten.

| Datei | Wo | Ersatz-Prompt falls nötig |
|---|---|---|
| `schneller-fit.jpg` | Karte 01 "Nach dem Training" (groß, 16 : 10 bis hoch) | A |
| `hydration.jpg` | Karte 02 "Regeneration ist dein halbes Training" (schmal hoch) | B |
| `supplements.jpg` | Karte 04 "Shake, Kreatin und Co." (16 : 9) | C |
| `besser-schlafen.jpg` | Karte 05 "Regeneration passiert nachts" (16 : 9) | B |
| `mealprep-gemuese.jpg`, `mealprep-fleisch.jpg`, `mealprep-reis.jpg` | Meal Prep, drei Karten (4 : 3) | D |
| `sportler-wasser.mp4` mit `.jpg` und `.de.vtt` | Video "In knapp zwei Minuten erklärt" | kein Prompt, Video prüfen |

**A** Training, 1600 x 1000 px:
> Realistic photo, landscape 16:10. A woman in her twenties trains with dumbbells in a calm, bright gym with wooden floor
> and large windows, focused expression, natural light, warm muted olive and beige tones. Realistic proportions.
> No logos on clothes or equipment, no text, no water machine, no mirrors with reflections of cameras.

**B** Regeneration, 1200 x 1600 px:
> Realistic photo, portrait 3:4. A man in his thirties stretches on a linen yoga mat in a quiet living room in the
> evening, soft warm lamp light, a glass of water on the wooden floor next to the mat, plants, calm atmosphere.
> No logos, no text, no water machine.

**C** Shake und Supplements, 1600 x 1000 px:
> Realistic photo, landscape 16:10. Kitchen counter made of light wood, a plain unbranded shaker bottle, a small bowl
> of oats, a scoop with white powder and a glass of water, morning daylight, warm muted tones, hands of a person
> filling the shaker with water from a glass jug. No labels, no logos, no text, no water machine.

**D** Meal Prep, je 1400 x 1050 px:
> Realistic photo, landscape 4:3. (1) Fresh vegetables and apples soaking in a large glass bowl of water on a wooden
> counter. (2) Raw chicken breast and fish fillet on a stone board next to a bowl of water, lemon, herbs.
> (3) Rice and chickpeas soaking in two glass bowls of water. Daylight, warm muted tones, linen cloth, no logos,
> no text, no packaging with brand names, no water machine.

## Aus dem vorhandenen Fundus übernommen

Diese Bilder lagen im Projekt (Broschüre und Landingpage) und sind für die Seiten verkleinert in `website/p/bilder/`:
`kueche`, `pflege` (aus ph-6), `putzen` (aus ph-2-5), `glas-holz`, `kisten`, `plastik`, `glas-fenster` (aus hero),
`glas-hahn` (aus video-1), `tiere-pflanzen`. Bitte prüfen, ob sie für Partnerseiten freigegeben sind.

## Foto der Partner

Laden die Partner selbst im Portal hoch (Ausschnitt 4 : 5, wird auf 900 x 1125 px verkleinert). Der Hinweis im
Formular: "Am besten ein helles Porträt, Gesicht gut zu sehen." Ohne Foto zeigt die Seite die Initialen auf Khaki.

## E-Book-Titelseiten

Kommen mit den E-Books aus dem Paket E-Books. Die Seite zeigt bis dahin eine gestaltete Titelseite aus Fläche und
Schrift (kein Bild nötig), mit dem Namen des Partners.

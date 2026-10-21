# Ergebnis Dashboard-Umbau

Geänderte Dateien liegen unter `website/dashboard/` (gleiche Struktur wie im Paket).
Getestet mit `?demo` in Chromium (Playwright), Handy 375 px und Rechner 1280 px.

## 1. Beim Reiterwechsel nach oben springen: fertig

- `app.js`: neue Funktion `reiterWechseln(r)`. Setzt den Reiter, merkt ihn, zeichnet neu und springt mit `window.scrollTo(0, 0)` nach oben.
  Die Menüknöpfe (in `start()`) und das Antippen einer Zeile in der Glocke nutzen sie.
- `zeichnen()` selbst springt nicht, damit man nach dem Speichern im Dialog an derselben Stelle bleibt.
- Getestet: 375 px, ganz nach unten gescrollt, anderen Reiter angetippt (Kunden, Partner, Testmaschinen, Aufgaben): danach immer `scrollY = 0`.

## 2. Kopf am Handy schlank: fertig

- `index.html`: Kopf neu gegliedert. `.kopf-leiste` mit Marke und `.symbole` (Name, Glocke, Tür zum Abmelden). Abmelden ist nur noch ein Symbol
  (Inline-SVG, `stroke="currentColor"`, Strichstärke 1.6 wie die Glocke) mit `aria-label="Abmelden"` und `title="Abmelden"`. Der alte Block `.wer` ist weg.
- `style.css`: bis 820 px eine schmale Leiste (kleiner Baum 28 px, "URSPRUNGSKRAFT", rechts Name klein, Glocke, Tür). Darunter das Menü als eine Zeile,
  seitlich wischbar, ohne sichtbaren Rollbalken. Der Name fällt unter 360 px weg. Am Rechner bleibt die Seitenleiste.
  Alte Regeln `.wer` und `.glocke` (Größe, Rand) gehen in der gemeinsamen Klasse `.symbol` auf.
- `app.js`: `symbolePlatzieren()` hängt die Symbole am Handy in die Leiste und am Rechner oben rechts über den Inhalt (`.obenleiste`), auch beim Drehen
  oder Ändern der Fenstergröße. `aktivZeigen()` holt den aktiven Reiter in der wischbaren Zeile in die Mitte, beim Öffnen und bei jedem `zeichnen()`.
- Getestet: 375 px (Kopf nach Aufgabe 3 ohne Umschalter 97 px hoch, vorher rund ein Drittel des Bildschirms), Reiter Wohnung beim Öffnen sichtbar gescrollt, keine waagrechte
  Rollleiste der Seite. 1280 px: Seitenleiste wie bisher, Name, Glocke und Tür oben rechts.

## 3. Umschalter "Daniel / Meine Zahlen" auflösen: fertig

- `index.html`: Umschalter `#umschalter` entfernt. Neuer letzter Reiter `<button data-reiter="meine">Meine Zahlen</button>`.
- `style.css`: Regeln `.umschalter` entfernt (`.umschalter-klein` im Kalender bleibt).
- `app.js`: Variable `ansicht` und ihr Speicher `uk-ansicht` entfernt. `zeichnen()` kennt `meine: zeigeMeine` wie jeden anderen Reiter.
  Neu `meinKuerzel()`: admin heißt Jasmin, Kürzel `jasmin`, sonst Daniel, Kürzel `daniel`. `zeigeMeine()` sucht den Partner darüber.
  Gibt es ihn nicht: "Hier stehen bald deine Zahlen. Dafür braucht es dich im Reiter Partner mit dem Link ursprungskraft.net/daniel."
  Untertitel jetzt "Nur für dich sichtbar." Der Provisions-Satz hieß "sobald du mir deine Zahlen nennst", das passt nicht für Daniel.
  Jetzt: "Folgt, sobald die Zahlen je verkauftem Gerät feststehen."
- `daten.js`: Vorschau als Daniel mit `?demo&als=daniel` (Rolle team). Ohne Zusatz wie bisher als Jasmin (admin). Nur zum Testen.
- Getestet: 375 px und 1280 px, als Jasmin (8 Kontakte aus Hamburg) und als Daniel (Leertext, weil es in den Beispieldaten keinen Partner `daniel` gibt).

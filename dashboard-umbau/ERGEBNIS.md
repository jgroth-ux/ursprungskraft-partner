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
- Getestet: 375 px (Kopf ohne Umschalter 88 px hoch statt vorher rund ein Drittel), Reiter Wohnung beim Öffnen sichtbar gescrollt, keine waagrechte
  Rollleiste der Seite. 1280 px: Seitenleiste wie bisher, Name, Glocke und Tür oben rechts.

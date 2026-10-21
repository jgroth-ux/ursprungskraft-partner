# Ergebnis Dashboard-Umbau

Geänderte Dateien liegen unter `website/dashboard/` (gleiche Struktur wie im Paket).
Getestet mit `?demo` in Chromium (Playwright), Handy 375 px und Rechner 1280 px.

## 1. Beim Reiterwechsel nach oben springen: fertig

- `app.js`: neue Funktion `reiterWechseln(r)`. Setzt den Reiter, merkt ihn, zeichnet neu und springt mit `window.scrollTo(0, 0)` nach oben.
  Die Menüknöpfe (in `start()`) und das Antippen einer Zeile in der Glocke nutzen sie.
- `zeichnen()` selbst springt nicht, damit man nach dem Speichern im Dialog an derselben Stelle bleibt.
- Getestet: 375 px, ganz nach unten gescrollt, anderen Reiter angetippt (Kunden, Partner, Testmaschinen, Aufgaben): danach immer `scrollY = 0`.

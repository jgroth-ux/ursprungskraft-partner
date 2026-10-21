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
  `zeigeMeine()`: Jasmin (admin) sieht die Kunden über ihren Partner-Link `jasmin` (gibt es ihn nicht, freundlicher Leertext).
  Daniel ist der Vertriebler und kein Partner: er sieht alle Verkäufe, direkt und über seine Partner, dazu "Käufe direkt / über Partner"
  und bei jedem Kontakt, über welchen Partner er kam (Jasmin, 21.10.2026). Dafür `zahlenVon()` aufgeteilt in `zahlenAus(kunden)`.
  Untertitel jetzt "Nur für dich sichtbar." Der Provisions-Satz hieß "sobald du mir deine Zahlen nennst", das passt nicht für Daniel.
  Jetzt: "Folgt, sobald die Zahlen je verkauftem Gerät feststehen."
- `daten.js`: Vorschau als Daniel mit `?demo&als=daniel` (Rolle team). Ohne Zusatz wie bisher als Jasmin (admin). Nur zum Testen.
- Getestet: 375 px und 1280 px, als Jasmin (8 Kontakte aus Hamburg) und als Daniel (alle 14 Kontakte, 3 Käufe, alle über Partner).

## 4. Glocke: fertig (im Code), Datenbank bitte gegenprüfen

- Platz: Die Glocke steckt jetzt in `.symbole` (siehe Aufgabe 2), am Handy rechts in der Leiste neben der Tür, am Rechner oben rechts.
  Auf jeder Seite, nicht mehr im Inhalt. Weiterhin nur für admin (Jasmin) sichtbar.
- Gefundene Ursache, warum Meldungen wiederkommen: `aufgabeBearbeiten()` (`app.js`) speichert die ganze Aufgabe mit `{ ...a, ...w }`,
  also auch `neu` aus dem Stand beim Laden der Seite. War die Seite schon offen, bevor Jasmin die Meldung gesehen hat (zweites Gerät, Tab im
  Hintergrund, oder Daniel bearbeitet die Aufgabe, was bei Aufgaben aus seinem Assistenten naheliegt), schreibt jedes Speichern im Dialog
  `neu = true` zurück. Mit dem alten Code nachgestellt: Meldung gesehen, Aufgabe mit älterem Stand gespeichert, nach Neuladen wieder da.
- Geändert in `app.js`:
  - `aufgabeBearbeiten()`: `neu` wird beim Speichern nicht mehr mitgeschickt. Die Datenbank behält, was drinsteht.
  - Neue Funktion `gesehen(a)`: setzt `neu = false` für genau diese Aufgabe und prüft die Antwort der Datenbank. Kommt `neu` trotzdem als true
    zurück oder lehnt die Datenbank ab (zum Beispiel Row Level Security, dann findet `.single()` keine Zeile), erscheint eine Meldung,
    statt dass es still scheitert. Genutzt von: Zeile in der Glocke, "alle als gesehen" und Antippen einer neuen Karte im Board.
  - Antippen einer neuen Karte im Board aktualisiert jetzt auch die Zahl an der Glocke sofort.
  - Öffnen einer neuen Karte im Kalender (`kalOeffnen()`) gilt ebenfalls als gesehen. Getestet: Glocke 2, Termin im Kalender geöffnet, neu laden: 1.
- `style.css`: Knopf "alle als gesehen" als schlichter Textlink (war ein ungestalteter Standardknopf).
- Getestet (375 px, Vorschau): drei neue Aufgaben angelegt, Glocke auf Kunden, Testmaschinen, Meine Zahlen in der Leiste sichtbar.
  Zeile antippen, neu laden: eine weniger. Aufgabe mit altem Stand gespeichert, neu laden: bleibt gesehen (alter Code: kam zurück).
  "alle als gesehen", neu laden: 0, keine Zahl an der Glocke. Als Daniel (`?demo&als=daniel`): keine Glocke.
- Nicht prüfbar ohne Datenbank: ob ein Trigger oder Daniels Assistent `neu` beim Ändern wieder auf true setzt, und ob die Regeln
  (Row Level Security) Jasmin das Ändern erlauben. Prüfabfragen dafür stehen in `datenbank-entwurf.sql` (nur lesend).

## 5. Testmaschinen als Kacheln, zwei Listen: fertig (braucht vorher `datenbank-entwurf.sql`, Teil 1)

- `app.js`:
  - Neu `maschineName(m)`: `name`, sonst wie bisher `geraetName(nummer)`. Genutzt in Kacheln, Dialog, Abhol-Karten (Board und Kalender)
    und im Verlauf beim Kunden. Neu `LISTEN` und `listeVon(m)` (fehlt `liste`, gilt "daniel").
  - `zeigeMaschinen()`: Knopf "+ Gerät hinzufügen", darüber die Statuszeile über beide Listen. Dann "Daniels Geräte", feine Trennlinie,
    "Von Partnern". Partner-Kacheln zeigen "Gehört …". Sortiert nach Nummer, dann Name. Beide Listen mit gleich breiten Kacheln, weiterhin
    etwa drei Zeilen (mindestens 4 Spalten am Rechner). Ziehen mit der Maus zwischen den Listen wie bei den Aufgaben-Karten
    (`ondragstart`, `ondrop`). Wird ein Gerät ohne Besitzer zu den Partnern gezogen, öffnet sich gleich das Gerät, damit man den Besitzer eintippt.
  - `maschineBearbeiten()`: neue Felder Name, Liste (Auswahl "Daniels Geräte" / "Von Partnern") und Besitzer (immer sichtbar,
    bei Partnern Pflicht). Der Besitzer wird nie gelöscht, auch nicht beim Verschieben zu Daniels Geräten (Jasmin, 21.10.2026). Löschen mit Rückfrage "Gerät X wirklich löschen? Der Verlauf geht mit verloren." Neue Geräte werden zuerst gespeichert,
    damit der Verlauf ihre id hat. Vorschlag für neue Geräte: nächster freier Name "Daniel NN".
  - `dialog()`: fünfter, freiwilliger Wert `frage` für eine eigene Rückfrage beim Löschen. Ohne ihn wie bisher "Wirklich löschen?".
- `style.css`: `.maschinen-liste`, `.trenner`, `.maschine .besitzer`, Ziehen (`.ziel`, `.zieht`). Lange Namen werden mit … gekürzt.
- `daten.js`: Beispieldaten mit `name`, `liste`, `besitzer`, dazu drei Partner-Geräte (Bern, Stuttgart, Wien), eins davon beim Kunden.
  Speicher-Schlüssel auf `uk-dashboard-v12`, damit die Vorschau die neuen Beispieldaten lädt.
- `datenbank-entwurf.sql`: Spalten `name`, `besitzer`, `liste` (mit check daniel/partner), `nummer` ohne Pflicht und ohne Eindeutigkeit.
  Darf mehrfach laufen. Dazu nur lesende Prüfabfragen.
- Getestet (375 px): Gerät hinzufügen (Vorschlag Daniel 14), umbenennen, zu Partnern wechseln (ohne Besitzer kommt "Bitte eintippen,
  wem das Gerät gehört."), Besitzer erscheint auf der Kachel, an einen Kunden ausgeben (Statuszeile zählt mit), löschen mit Rückfrage
  (kein Verlauf bleibt übrig), bestehendes Gerät ohne Namen umbenannt, alles nach Neuladen noch da.
  1280 px: K8 Bern zu Daniels Geräten gezogen (Besitzer bleibt), umbenannt und zurückgezogen (Besitzer noch da).

## Sonstiges

- `index.html`: Versionsnummern von `style.css`, `daten.js`, `app.js` auf `?v=20261021d`, damit kein Handy die alte Fassung aus dem Zwischenspeicher nimmt.
- Rundgang durch alle Reiter auf 375 und 1280 px, als Jasmin und als Daniel: keine waagrechte Rollleiste, keine neuen Fehler.
  Einziger Fehler: `DURCHGAENGE is not defined` im Reiter Auswertung und beim Kunden. Kommt aus `../fragebogen/fragen.js`, das nicht im Paket
  liegt. Tritt mit den alten Dateien genauso auf, hat mit dem Umbau nichts zu tun.
- Bestellungen, Unterlagen, Wohnung: nur geprüft, dass sie laden und nichts kaputtgeht.
- Das Paket lag nicht in `dashboard-umbau-paket/`, sondern direkt im Hauptordner des Repos (`00-LIESMICH.md`, `website/`, `schema-maschinen.sql`).
  Ich habe damit gearbeitet und dort nichts geändert.

## Reihenfolge beim Einspielen

1. `datenbank-entwurf.sql` Teil 1 einspielen (sonst scheitert das Speichern von Testgeräten).
2. Teil 2 (Prüfabfragen) laufen lassen, vor allem B1 bis B3 zur Glocke.
3. Die vier Dateien aus `website/dashboard/` hochladen.

## Offene Fragen an Jasmin

Mit Jasmin geklärt (21.10.2026): Daniel sieht alle seine Verkäufe, Testgeräte nur umbenennen und hinzufügen, Besitzer wird nie gelöscht,
Öffnen im Kalender zählt als gesehen.

Noch offen, aber nicht von Jasmin zu beantworten: Falls Meldungen in der Glocke nach dem Einspielen trotzdem wiederkommen, bitte die
Prüfabfragen B1 bis B4 in `datenbank-entwurf.sql` ansehen (Trigger, Regeln, Daniels Assistent).

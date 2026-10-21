# Auftrag: Dashboard-Umbau Ursprungskraft

Du arbeitest für Jasmin Groth. Das hier ist **ihr internes Dashboard** mit Daniel Zürcher
(Marke Ursprungskraft). Es hat **nichts mit dem Partner-Setup** zu tun, das du in diesem Projekt
schon gebaut hast. Lege alles in einen eigenen Ordner, mische nichts.

Ein zweiter Claude (mit Zugang zu Datenbank und Server) prüft dein Ergebnis danach und spielt es ein.
Du baust also nur die Dateien, **du änderst keine Datenbank**.

## Was im Paket ist

- `website/dashboard/` : `index.html`, `app.js` (die ganze Oberfläche), `daten.js` (Datenzugriff),
  `style.css`, Logos. Reines HTML/CSS/JS, kein Framework, kein Build-Schritt.
- `website/vendor/supabase.js` : nur damit die Seite lädt.
- `website/bilder/` : Logo-Baum oliv und hell.
- `schema-maschinen.sql` : wie die Tabelle der Testmaschinen heute aussieht.

## So testest du

Im Ordner `website/` einen einfachen Server starten (`python3 -m http.server 8790`) und
`http://localhost:8790/dashboard/?demo` öffnen. Mit `?demo` läuft alles mit Beispieldaten im Browser,
ohne echte Datenbank. Rolle "admin" ist Jasmin, sonst Daniel (siehe `daten.js`, Abschnitt Vorschau).
**Immer am Handy-Format testen (375 px breit)**, das ist der wichtigste Fall.
Die Reiter Bestellungen, Unterlagen und Wohnung brauchen teils echte Daten oder Dateien, die nicht
im Paket sind. Dort nur prüfen, dass nichts kaputtgeht.

## Die Aufgaben

### 1. Beim Reiterwechsel nach oben springen
Heute bleibt die Seite am Handy auf derselben Höhe, wenn man unten scrollt und dann einen anderen
Reiter antippt. Jeder Reiterwechsel springt ganz nach oben.

### 2. Kopf am Handy schlank
Heute nimmt der Kopf am Handy ein Drittel des Bildschirms (Logo, Umschalter, Menü, Name, Abmelden).
Neu am Handy:
- Eine schmale Leiste: links kleiner Baum plus "URSPRUNGSKRAFT", rechts die **Glocke** und ein
  **Tür-Symbol zum Abmelden** (nur Symbol, kein Wort, aber `aria-label="Abmelden"` und `title`).
  Der Name der angemeldeten Person darf klein neben die Symbole oder entfällt am Handy.
- Darunter das Menü als **eine Zeile, seitlich wischbar**, der aktive Reiter sichtbar markiert und
  beim Öffnen in den sichtbaren Bereich gescrollt.
- Am Rechner (breit) darf die Seitenleiste bleiben, aber Abmelden ebenfalls als Symbol oben rechts.
- Symbole als schlichtes Inline-SVG mit `stroke="currentColor"`, gleiche Strichstärke wie die
  vorhandene Glocke (1.6).

### 3. Umschalter "Daniel / Meine Zahlen" auflösen
- Den Umschalter oben entfernen. Alle Reiter sind **ein gemeinsames Dashboard**, das beide sehen.
- **"Meine Zahlen" wird ein normaler Menüpunkt** (letzter Reiter). Er zeigt immer die Zahlen der
  Person, die angemeldet ist: Jasmin ihre, Daniel seine. Heute sucht die Funktion fest den Partner
  mit Kürzel `jasmin`. Neu: über die angemeldete Person (Jasmin = admin, sonst Daniel; Partner-Kürzel
  `jasmin` bzw. `daniel`). Gibt es den Partner nicht, freundlicher Leertext.
- Den Satz "Nur für dich sichtbar. Daniel sieht diese Ansicht nicht." passend umschreiben
  ("Nur für dich sichtbar.").

### 4. Glocke
- Die Glocke sitzt **immer oben in der Leiste** (am Handy rechts neben der Tür), auf jeder Seite,
  nicht im Inhalt.
- Sie meldet neue Aufgaben (Feld `neu` in `uk_aufgaben`), wie heute.
- Was gelesen ist, bleibt gelesen: Eine Zeile antippen setzt `neu = false` für genau diese Aufgabe,
  "alle als gesehen" setzt es für alle angezeigten. Prüfe, dass das wirklich gespeichert wird und nach
  Neuladen nicht wiederkommt. Jasmin sagt, die Meldungen kämen wieder.
- Heute sieht nur Jasmin (admin) die Glocke. Das bleibt so.

### 5. Testmaschinen als Kacheln, zwei Listen
Heute: feste Geräte mit Nummer 1 bis 13, Klick öffnet Bearbeiten (Status, bei wem, seit ...).
Neu:
- **Zwei Listen** auf der Seite: oben **"Daniels Geräte"**, dann eine feine Trennlinie, darunter
  **"Von Partnern"**. Bei Partner-Geräten steht auf der Kachel, **wem sie gehören** (Name, von Hand
  eingetippt).
- **Kachel antippen** öffnet wie heute das Bearbeiten, dazu neu: **Name** des Geräts ändern,
  **Liste wechseln** (Auswahlfeld "Daniels Geräte" / "Von Partnern" plus Feld "Besitzer"),
  **Löschen** mit Rückfrage ("Gerät X wirklich löschen? Der Verlauf geht mit verloren.").
- Am Rechner zusätzlich **Ziehen mit der Maus** zwischen den Listen (wie die Aufgaben-Karten, siehe
  `ondragstart` in `app.js`). Am Handy reicht das Auswahlfeld.
- Knopf **"+ Gerät hinzufügen"** über den Listen.
- Die feste Nummer fällt als Pflicht weg (es werden 20 und mehr Geräte). Zum Anzeigen ein Name;
  bestehende Geräte zeigen bis dahin ihren bisherigen Namen aus `geraetName(nummer)`.
- Statusanzeige oben ("x verfügbar, y beim Kunden ...") zählt über beide Listen.

**Datenbank:** Nicht ändern. Schreib stattdessen in `datenbank-entwurf.sql`, was nötig ist, zum
Beispiel neue Spalten `name text`, `besitzer text` (leer = Daniel), `liste text` mit check, und
`nummer` nicht mehr Pflicht bzw. Eindeutigkeit lockern. Darf mehrfach laufen (`if not exists`).
Im Vorschau-Modus (`daten.js`, Funktion `beispiel()`) die neuen Felder in den Beispieldaten ergänzen
und ein paar Partner-Geräte mit Besitzer anlegen, damit man beide Listen sieht.

## Feste Regeln

- Stil des bestehenden Codes beibehalten: deutsche Namen, kurze Kommentare, gleiche Muster
  (`dialog(...)`, `Daten.speichern`, `zeichnen()`).
- Nichts entfernen, was heute funktioniert, außer was oben ausdrücklich steht.
- Texte: immer **du**, kurze Sätze, **keine Gedankenstriche** (– oder —), Prozent als "20 %".
- Nur deutsche Wörter auf dem Bildschirm.
- Gestaltung ruhig, keine Leuchteffekte, keine Verläufe, Farben nur aus den vorhandenen CSS-Variablen.
- Keine externen Bibliotheken dazu.

## Abgabe

Alles in den Ordner `dashboard-umbau/`:
- die geänderten Dateien in derselben Ordnerstruktur (`website/dashboard/...`)
- `datenbank-entwurf.sql`
- `ERGEBNIS.md`: je Aufgabe eine Zeile fertig/nicht fertig, was du geändert hast (Datei, Funktion),
  was du getestet hast, und offene Fragen an Jasmin.

Nach jeder fertigen Aufgabe committen und pushen, damit nichts verloren geht.

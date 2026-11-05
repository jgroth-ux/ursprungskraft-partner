# Auftrag: emGuarde-Landingpage als Muster (06.11.2026)

## Ziel

Baue **eine** Verkaufsseite für den emGuarde auf höchstem Niveau. Sie ist das Muster für spätere
Seiten zu den anderen Geräten und wird an Vertriebspartner verkauft.

Maßstab von Jasmin: Niemand darf sehen, dass die Seite mit Claude oder Lovable gebaut ist.
Jasmin ist Mediengestalterin und misst nach. Gefragt ist die Qualität einer teuren Markenseite,
nicht eine ordentliche Vorlage.

**Nur diese eine Seite bauen.** Andere Geräte, Shop, Baukasten und Bezahlung kommen erst nach der
Abnahme des Musters.

## Ablauf

1. **Vorlage analysieren:** https://emguarde-stefan.lovable.app/ komplett ansehen, Desktop und
   Handy. Stefan ist die Upline von Daniel und verkauft diese Seite für 180 € an seine Partner.
   Schreib auf: Abschnitte, Reihenfolge, Argumente, was überzeugt, woran man KI und Lovable
   erkennt, welche Informationen fehlen.
2. **Enagic-Seiten lesen:**
   - https://www.enagiceu.com/de/product-emguarde (zeigt den GO)
   - https://www.enagiceu.com/shop/de/machines/emguarde-go.html
   - https://www.enagiceu.com/shop/de/machines/emguarde.html (Home Station)
3. **Konzept vorlegen und anhalten:** Reihenfolge der Abschnitte, Hauptüberschrift, Bildidee,
   Gestaltungsrichtung auf höchstens einer Seite. Erst nach Jasmins Antwort bauen.
4. **Bauen**, lokal im Vorschau-Modus.
5. **Prüfen** nach der Liste unter "Fertig heißt".
6. **Zurückgeben** nach der Liste unter "Rückgabe".

## Stefans Seite ist Analyse, keine Kopiervorlage

Aufbau und Argumente dürfen als Anregung dienen. Keine Texte, Bilder, Grafiken oder Gestaltung
von dort übernehmen. Jede Zeile wird neu geschrieben.

## Technik

- Reine statische Seite: HTML, CSS, wenig JavaScript. Kein Build-Schritt, kein Framework, kein
  Lovable, keine Vorlage, kein Tailwind-Standardbild.
- Schriften selbst gehostet aus `schriften/`, keine Google Fonts, keine fremden Skripte oder
  Tracker.
- Alles Partnerbezogene steht in **einer** Datei `partner.js`: Name, Foto, Telefon, WhatsApp,
  E-Mail, Kürzel. Tausch dort ändert die ganze Seite.
- Kaufknopf führt zu `/bestellen/?von=<kuerzel>`. Das Formular besteht schon und wird nicht
  angefasst.
- Rechtliches: Links auf Impressum und Datenschutz vorsehen, Inhalt nicht erfinden.
- Bilder als AVIF oder WebP in passenden Größen. Seite ohne Bilder höchstens 150 KB.
- Nichts deployen. Kein Netlify, kein Git-Push: jeder Upload kostet Jasmin Guthaben.

## Gestaltung

Vor dem ersten Entwurf `gestaltungsrichtlinien.md` ganz lesen, Abschnitt 1 besonders.

- Marke: Ursprungskraft. CI-Entwurf: #F5F1E8, #4F5A35, #2F3524, #A8996A, Jost 500 und Inter.
  Logos in `logo/`. Weiche Abweichung nur als Vorschlag im Konzept.
- Größen gerechnet: Schriftleiter Faktor 1,272, Abstände nach Fibonacci, als benannte
  CSS-Variablen. Keine Zwischengrößen.
- Text linksbündig auf einer Kante, keine zentrierten Textblöcke, keine zwei Textspalten
  nebeneinander.
- Zierschrift nur in Überschriften, nie im Fließtext.
- Höchstens drei Farben je Abschnitt, höchstens drei Hierarchieebenen.

**Verboten, weil es nach KI aussieht:** Leuchtflecken, Lichtschein, Verläufe, Glas-Pillen,
Schein der Maus folgend, Wellen als Übergang, Maus-Symbol zum Scrollen, drei gleiche Karten
nebeneinander, Icon plus Überschrift plus Zweizeiler als Raster, Emojis, runde Kästen überall,
hochzählende Zahlen, Einblenden von jedem einzelnen Element, Glitzer, Stock-Klischees.

**Stattdessen:** Ruhe, große echte Fotos, satte Flächen, klare Kanten, Foto darf über eine Kante
ragen, starke Typografie, jeder Abschnitt mit eigener Komposition. Bewegung dezent und selten.
Jede Kante zwischen zwei Abschnitten vor der Abgabe ansehen.

Besondere Elemente wie Vergleichsgrafik oder Raumskizze gern, wenn sie wirklich etwas erklären.
"For the places you go every day" von Enagic auf Deutsch neu denken: Büro, Hotel, Auto,
Zuhause.

## Texte

- Sprache Deutsch, Anrede "du", klar und direkt, nicht gendern.
- Ohne Vorwissen verständlich: erst das Ergebnis für die Leserin, dann das Gerät. Kein
  Fachwort ohne Erklärung.
- Jeder Abschnitt braucht Problem, Lösung und einen Grund für jetzt. Beschreiben statt verkaufen
  ist der häufigste Fehler.
- Keine Gedankenstriche im Fließtext. Prozent immer als "20 %".
- Nicht verwenden: Network, Downline, passives Einkommen, Geschäftsmöglichkeit, Abo.
- Keine Zeilen gegen Zweifel, die niemand hatte.

## Harte Grenzen

- **Keine Heil- und Gesundheitsversprechen**, auch nicht angedeutet (Enagic-Vertrag 3.7, EU
  Health-Claims-Verordnung, Heilmittelwerbegesetz). Auch nichts über Krankheiten, Schlaf,
  Müdigkeit, Kopfschmerzen oder Elektrosmog-Schäden. Was Enagic selbst behauptet, ist kein
  Freibrief: Technik und Herstellerangaben als solche kennzeichnen.
- **Nichts erfinden:** keine Zahlen, Studien, Kundenstimmen, Siegel, Tests. Fehlt etwas, kommt ein
  sichtbarer Platzhalter `[FEHLT: ...]` und ein Eintrag in die Rückgabe.
- Keine Mengen-Knappheit und keine erfundenen Fristen.
- Keine Steuerberatung: "absetzbar" nur als "für Gewerbetreibende, frag deine Steuerberatung".

## Gesicherte Fakten

Alles in `fakten.md`. Offene Punkte stehen dort markiert und werden nicht geraten.

## Bilder

- `bilder/enagic-go/`: Bilder von der Enagic-Seite, `bilder/enagic-home/`: Home Station.
- `bilder/eigene/emguarde.jpg`: eigenes Produktbild, Stil beiger Raum mit Pflanzenschatten.
- Enagic-Bilder sind Platzhalter. Reicht das Material nicht, liefere eine Bildliste mit fertigen
  Prompts und Motivbeschreibung. Jasmin erzeugt die Bilder selbst über ChatGPT. Eingesetzt
  werden dann nur Bilder, die nicht generisch wirken. Keine Personen mit KI-Gesichtern ohne
  Rücksprache.

## Fertig heißt

Pro Punkt eine Zeile mit bestanden oder nicht bestanden und dem Beleg:

1. Gerendert geprüft bei 390, 768 und 1440 Pixel Breite, Screenshot je Breite beiliegend.
2. Kein waagerechtes Scrollen, kein Text über einem Gesicht, kein abgeschnittener Text.
3. Lighthouse Mobil: Performance mindestens 90, Accessibility mindestens 95.
4. Kontrast WCAG AA überall, Tastaturbedienung geht, `prefers-reduced-motion` berücksichtigt.
5. Suche nach verbotenen Wörtern und Gedankenstrichen ergibt null Treffer, Ausgabe beiliegend.
6. Jede Zahl auf der Seite steht in `fakten.md` oder ist als `[FEHLT]` markiert.
7. Keine Anfrage an fremde Server beim Laden, Netzwerkliste beiliegend.
8. Partnerwechsel: `partner.js` mit einem zweiten Beispiel getauscht, Seite und Kauflink stimmen.
9. Liste der KI-Merkmale aus "Gestaltung" Punkt für Punkt durchgegangen.
10. Werte aus dem Zahlensystem stehen als Variablen im CSS, keine anderen Größen im Code.

## Rückgabe

Ein Ordner `landingpage-emguarde/` als ZIP mit:
- der Seite samt Bildern und Schriften
- `analyse-stefan.md`: was wir besser machen
- `ergebnis.md`: Fertig-Check, Fragen, alle `[FEHLT]`-Stellen, Bildliste
- `muster-anleitung.md`: was je Gerät getauscht wird, damit die nächsten Seiten schnell gehen

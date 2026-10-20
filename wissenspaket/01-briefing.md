# Briefing: Partner-Setup vorbauen

Du arbeitest für Jasmin Groth. Ein zweiter Claude (mit Zugang zu Server, Datenbank und Bots)
baut deine Ergebnisse danach ein. Du baust also **Entwürfe und fertige Einzelteile**, kein
Live-System. Arbeite die Aufgaben A bis F nacheinander ab, so weit du kommst. Lieber vier
Aufgaben sauber fertig als sechs halb.

## Worum es geht

Daniel Zürcher (Schweiz) und Jasmin (Hamburg) verkaufen Wasserionisierer (Enagic LeveLuk K8).
Sie haben schon ein eigenes System: Landingpage, Wasser-Check, Fragebogen, Bestellseite,
Dashboard, Telegram-Assistenten. Läuft unter der Marke **Ursprungskraft**.

Jetzt sollen **weitere Vertriebspartner** ein fertiges Paket bei uns bestellen können:

- eigene Landingpage, monatliche Gebühr, solange sie zahlen
- Marketingpaket: Broschüren, Flyer usw., personalisiert mit Name, Kontakt, QR-Code
- Bestellformular für ihre Kunden, das die Enagic-Verträge automatisch ausfüllt
- eigener Telegram-Bot, der sie über Anfragen und Bestellungen benachrichtigt
- Anleitung, wie alles eingerichtet wird

Die Partner laufen **nicht** unter Ursprungskraft, sondern unter einer **neutralen Marke**
auf einer eigenen Domain (noch nicht gekauft). Platzhalter überall: `{{MARKE}}` und
`{{DOMAIN}}`. Grund: baut ein Partner Mist, fällt es nicht auf Ursprungskraft zurück.
Partner-Seiten sind **nicht bei Google auffindbar** (`<meta name="robots" content="noindex,nofollow">`),
der Partner gibt den Link selbst weiter.

## Feste Regeln für alles

**Technik**
- Reines HTML, CSS und JavaScript, **ohne Framework, ohne Build-Schritt**. Eine Seite = eine
  `index.html` in einem eigenen Ordner, gern mit einer `.css` und einer `.js` daneben.
- Keine externen Skripte außer: Google Fonts (Jost und Inter) und, falls nötig, Bibliotheken von
  cdnjs.cloudflare.com mit fester Versionsnummer.
- Wo später die Datenbank oder Stripe angeschlossen wird, **nicht selbst erfinden**, sondern eine
  klar benannte Funktion mit Kommentar anlegen, die vorerst Beispieldaten liefert. Muster:
  ```js
  // ANSCHLUSS: speichert die Partnerdaten in der Datenbank (Tabelle partner)
  async function partnerSpeichern(daten) { console.log('Demo', daten); return { ok: true }; }
  ```
- Alle Texte, die der Partner selbst eintragen wird, als Platzhalter: `{{VORNAME}}`,
  `{{NACHNAME}}`, `{{TELEFON}}`, `{{WHATSAPP}}`, `{{EMAIL}}`, `{{ORT}}`, `{{FOTO}}`, `{{KUERZEL}}`.
- Muss am Handy (375 px breit) einwandfrei aussehen. Die meisten Kunden kommen übers Handy.

**Gestaltung**
- Ruhig, hochwertig, große Fotos, klare Kanten. **Kein KI-Look:** keine Leuchtflecken, keine
  Glas-Pillen, keine Verläufe in Lila oder Blau, kein Mausschein, keine Wellen.
- Schriften: Überschriften **Jost** (500), Fließtext **Inter** (400), 16 px / 26 px.
- **Farbpakete**, zwischen denen der Partner wählt. Alles nur über CSS-Variablen, damit ein
  Wechsel eine einzige Zeile ist:
  1. **Oliv-Khaki** (das Original):
     `--ground:#F5F1E8; --surface:#FBF9F4; --sand:#EAE3D3; --line:#D9CFBA; --khaki-light:#CFC4A0; --khaki:#A8996A; --olive:#4F5A35; --ink:#2A2C22; --muted:#5F6152`
  2. **Blau** (Wasser, klar): selbst ableiten, gleiche Variablennamen
  3. **Sand neutral** (hell, fast ohne Farbe): selbst ableiten
  4. optional ein viertes, wenn es sich deutlich unterscheidet
- Auf jeder Seite oben ein kleiner Umschalter für die Farbpakete (nur in der Vorschau), damit
  Jasmin vergleichen kann.

**Sprache** (wichtig, Jasmin ist da streng)
- Immer **du**. Kurze Sätze, warm, klar, keine Werbefloskeln.
- **Keine Gedankenstriche** (– oder —) im Text. Stattdessen Punkt, Komma oder Doppelpunkt.
- Prozent immer als Zeichen: „20 %“.
- **Keine Heilversprechen**, keine Krankheiten, keine medizinischen Aussagen. Das Wasser
  „heilt“ nichts. Erlaubt: Geschmack, Alltag, Kochen, Haushalt, Plastikflaschen sparen,
  Wasser bewusster trinken.
- Keine Enagic-Logos und nicht „Kangen“ als Überschrift oder Marke verwenden (geschützt).
  „Wasserionisierer“ oder „das Gerät“ ist in Ordnung.
- Wo du Fakten oder Preise nicht sicher weißt: **nichts erfinden**, sondern `{{PREIS_FEHLT}}`
  oder eine Frage an Jasmin in die Datei schreiben.

## Die Aufgaben

### A. Vorlage Partner-Landingpage (Ordner `a-landingpage/`)
Eine Seite, die jeder Partner mit seinen Daten bekommt. Ablauf von oben nach unten:
1. Großes Foto, eine starke Überschrift, ein Satz, ein Knopf „Gerät zu Hause testen“
2. Was sich im Alltag ändert (Trinken, Kochen, Haushalt), drei kurze Abschnitte mit Foto
3. So läuft es: Kontakt, persönliche Vorführung, Testgerät für eine Weile bei dir zu Hause
4. Der Partner stellt sich vor: Foto, Name, Ort, zwei, drei Sätze in Ich-Form (Platzhalter)
5. Häufige Fragen (6 bis 8, ohne Gesundheitsthemen)
6. Kontaktformular: Vorname, Nachname, E-Mail, Telefon, Wunsch (Testgerät oder Beratung),
   Nachricht, Haken für Datenschutz. Absenden über Anschluss-Funktion `anfrageSenden(daten)`
7. Fuß: Impressum und Datenschutz des Partners (Platzhalter-Links)

Bilder: Platzhalter-Kästen mit Beschreibung, welches Foto dort hingehört. Liefere
zusätzlich eine Liste mit Bild-Prompts für ChatGPT (ein Prompt je Bild, fotorealistisch,
helles natürliches Licht, keine Gesichter in Nahaufnahme).

### B. Partner-Portal (Ordner `b-portal/`)
Mehrere Seiten, alle mit Beispieldaten, Anschluss über benannte Funktionen:
1. **Startseite des Portals** (öffentlich, noindex): Was ein Partner bekommt, Pakete und
   Preise als Platzhalter, Knopf „Jetzt registrieren“.
2. **Registrieren**: E-Mail, Passwort, Name. Haken: Nutzungsbedingungen gelesen (Link zu C).
3. **Meine Daten**: Formular für alles, was in Landingpage und Druckmaterial kommt
   (Name, Foto hochladen, Telefon, WhatsApp, E-Mail, Ort, Kürzel für den Link,
   kurzer Text über sich, Impressum-Angaben, Farbpaket mit Vorschau, Enagic-ID, Sponsor).
   Live-Vorschau daneben, wie die Landingpage aussieht.
4. **Paket zusammenstellen**: Dokumente anklicken (Broschüre, Wegweiser, Flyer, Detox-Blatt,
   Visitenkarten), Stückzahl wählen, **Mindestmenge 100 je Dokument**, freiwillig mehr.
   Summe live. Preise als Platzhalter-Tabelle oben in der JS-Datei.
5. **Bezahlen**: nur der Knopf und eine Übersicht, Anschluss `bezahlenStarten(bestellung)`
   (wird später Stripe, monatliche Gebühr plus einmaliges Paket).
6. **Mein Bereich** nach dem Login: Status (Landingpage aktiv bis, nächste Abbuchung),
   eigener Link zum Kopieren, Nachbestellen, Anleitung, Kündigen.

### C. Vertragsentwurf (Datei `c-nutzungsbedingungen.md`)
Nutzungs- und Lizenzbedingungen für Partner. Deutlich als **Entwurf, vor Gebrauch vom Anwalt
prüfen lassen** kennzeichnen. Inhalt:
- Was der Partner bekommt (Landingpage, Hosting, Material) und dass er es **nur nutzt, nicht besitzt**
- **Verbot, Seiten, Texte, Gestaltung oder Material nachzubauen, zu kopieren oder weiterzugeben**,
  auch nach Vertragsende; Vertragsstrafe als Platzhalter `{{BETRAG}}`
- Monatliche Hostinggebühr, Abbuchung, was bei Zahlungsausfall passiert (Seite wird abgeschaltet)
- Laufzeit, Kündigung, was nach Kündigung mit Seite und Daten passiert
- Pflichten des Partners: eigenes Impressum, keine Heilversprechen, Enagic-Richtlinien einhalten
- Haftung: Partner haftet für seine Aussagen und Kunden
- Datenschutz: Partner ist für seine Kunden verantwortlich, wir verarbeiten im Auftrag
  (Hinweis, dass dafür ein eigener Auftragsverarbeitungsvertrag nötig ist)
- Gilt für Partner in Deutschland und der Schweiz: offene Punkte als Fragen an den Anwalt auflisten
Anbieter: `{{ANBIETER}}` (noch offen, ob Jasmin oder eine Firma).

### D. Druckpreise recherchieren (Datei `d-druckpreise.md`)
Online-Druckereien mit **Versand direkt an den Partner**, getrennt nach **Deutschland** und
**Schweiz** (Schweizer Partner sollen in der Schweiz drucken lassen, wegen Zoll und Laufzeit).
Je Land drei bis fünf Anbieter. Preise für:
- Broschüre A5, 28 Seiten, Klammerheftung, 4-farbig, mattes Papier
- Flyer DIN lang, beidseitig
- Einzelblatt A4 (Detox-Plan), beidseitig
- Visitenkarten
jeweils für 100, 200 und 500 Stück. Dazu: Lieferzeit, Versandkosten, ob personalisierte
Kleinauflagen (jeder Partner eigene Daten) gehen, ob es eine Schnittstelle oder Sammelbestellung
gibt. Als Tabelle, mit Link und Datum der Abfrage. **Nur echte, nachgesehene Preise**, sonst
„nicht gefunden“.

### E. Anleitung für Partner (Datei `e-anleitung-partner.md`)
Schritt für Schritt, für Leute ohne Technikwissen:
1. Registrieren und Daten eintragen
2. Eigenen Link finden und weitergeben (WhatsApp, Instagram-Bio, QR-Code)
3. **Telegram-Bot einrichten**: Telegram installieren, den Bot über den Link öffnen, auf
   „Starten“ tippen (ohne das kommen keine Nachrichten). Was für Nachrichten kommen
   (neue Anfrage, neuer Fragebogen, neue Bestellung)
4. Wenn ein Kunde bestellen will: Bestell-Link schicken, was danach passiert
5. Druckmaterial nachbestellen
6. Häufige Probleme
Bildschirmwörter auf Deutsch (Telegram auf Deutsch: „Starten“).

### F. Fahrplan-Feinschliff (Datei `f-offene-fragen.md`)
Alles, was dir beim Bauen auffällt und Jasmin entscheiden muss, als kurze Fragen mit je
zwei, drei Antwortmöglichkeiten. Keine eigenen Entscheidungen treffen, wo es um Geld,
Recht oder Marke geht.

## Abgabe

Alles in **einem Ordner** `partner-setup-entwurf/` mit den Unterordnern und Dateien oben,
am Ende als ZIP. Oben in jeder Datei ein Kommentar: was fertig ist, was fehlt.
Dazu eine `LIESMICH.md` mit: welche Aufgaben fertig, welche Anschluss-Funktionen es gibt
(Liste mit Name und was sie tun soll), welche Platzhalter vorkommen.

Jasmin legt den Ordner danach in ihren Eingang, der andere Claude baut ihn ein.

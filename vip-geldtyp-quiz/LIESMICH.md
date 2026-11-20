# Geldtyp-Test VIP Group

Lead-Funnel für Tobias Rethaber: Instagram (Story, Beitrag, ManyChat) → Geldtyp-Test → Auswertung als PDF gegen E-Mail → kostenloser Videokurs.

Stand: Entwurf, voll klickbar. Es fehlen die echten Links und der Anschluss an das Mail-Tool (Abschnitt 4).
Woher welcher Inhalt stammt: siehe `QUELLEN.md`.

## 1. Grundlage

Der Test baut auf Tobias' eigenem Material auf:

- **Die vier Geldtypen** aus der Konzeptplanung Modul 1 (Folie „Die vier Geldtypen und ihre Motive“). Dort steht „Mach den Geldtyp-Test“ sogar als Pflichtaufgabe.
- **Das Fundament in sechs Bereichen**: jeder Bereich ist ein Thema aus dem Videokurs (Video 1: Struktur, Zahlen, Reserve. Video 2: Inflationsschutz, Investment-Kompass. Video 3: Strategie).
- **Die zwei Kennzahlen** aus Modul 1 und das 3-Konten-Modell, gerechnet mit dem eigenen Einkommen.

Jede Schwäche zeigt auf ein Video. Der Test empfiehlt das Video, das der Person am meisten bringt.

## 2. Ablauf für den Nutzer

| Schritt | Was passiert |
|---|---|
| Start | „Welcher Geldtyp bist Du?“, 16 Fragen, etwa 3 Minuten, 0 € |
| Teil 1 | 7 Fragen zum Umgang mit Geld: Geldtyp und Mischung |
| Teil 2 | 6 Fragen zum Fundament: Punktzahl 0 bis 100 |
| Teil 3 | 3 Fragen zu Einkommen, Berufsjahren, was noch da ist (überspringbar) |
| Geldtyp | Typ, Zitat und Mischung sofort sichtbar, ohne E-Mail |
| Formular | Vorname, E-Mail, Handy optional, Einwilligung |
| Im Hintergrund | PDF wird erstellt (unter 1 Sekunde) und mit allen Daten an das Mail-Tool geschickt |
| Auswertung | Profil, Fundament, Zahlen, Videokurs mit Empfehlung, PDF speichern, Story-Bild |

## 3. Instagram und ManyChat

**Stichwort:** `GELDTYP` (steht auch auf dem Story-Bild, änderbar in `EINSTELLUNGEN.stichwort`).

**ManyChat-Automation**
1. Auslöser: Kommentar „GELDTYP“ unter Beitrag oder Reel, und DM „GELDTYP“ (für die Story).
2. Öffentliche Antwort auf den Kommentar, mehrere Varianten: „Schau in Deine Nachrichten.“ / „Ist unterwegs. Bin gespannt, welcher Typ Du bist.“
3. DM:
   > Hey {{first_name}}, hier ist Dein Geldtyp-Test.
   > 16 Fragen, 3 Minuten. Danach weißt Du, was Dich beim Thema Geld antreibt, wo Dein Fundament Lücken hat und welches Video aus Tobias' kostenlosem Videokurs Dir am meisten bringt.
   > [Knopf: Test starten]
4. Link mit Herkunft: `https://DOMAIN/geldtyp/?utm_source=instagram&utm_medium=manychat&utm_campaign=geldtyp&utm_content=reel-01`
   Optional `&vorname={{first_name}}` und, wenn ManyChat die E-Mail schon hat, `&email={{email}}`. Dann ist das Formular vorausgefüllt.
5. Erinnerung nach 24 Stunden, nur ohne Klick: „Kurze Erinnerung: Dein Geldtyp-Test wartet noch. Dauert 3 Minuten.“

**Story-Text für Tobias (Beispiel)**
> Es gibt vier Geldtypen. Jeder hat eine Stärke. Und jeder hat eine Falle, die ihn jedes Jahr Geld kostet.
> Welcher bist Du? Schreib mir **GELDTYP** und Du bekommst den Test.

**Reel-Ideen**
- „Rechne mal aus, was Du in Deinem Leben schon verdient hast. Und dann, wie viel davon noch da ist.“
- „Vier Geldtypen. Nur einer baut automatisch Vermögen auf. Kommentiere GELDTYP.“
- Je Typ ein eigenes Reel („Der Geldgenießer: Du gibst aus und regelst es danach“), immer mit GELDTYP am Ende.

**Teilen:** Am Ende kann jeder sein Ergebnis als Story-Bild (1080 × 1920) speichern, mit „Welcher Geldtyp bist Du? Kommentiere GELDTYP“. So bringen Teilnehmer neue Leute mit.

## 4. Mail und Funnel: was die Seite macht und was das Mail-Tool machen muss

**Die Seite macht:** Beim Absenden des Formulars erstellt sie das PDF und schickt alles an eine Webhook-Adresse (`EINSTELLUNGEN.webhook`).

**Das Mail-Tool bzw. Make/Zapier macht danach:**
1. Kontakt anlegen mit Vorname, E-Mail, Handy und Tags (z. B. `geldtyp_geniesser`, `fundament_25`, `video_1`).
2. Sofort-Mail mit dem PDF im Anhang und dem Link zum Videokurs.
3. Mail-Strecke starten (Vorschlag unten).

Erst wenn dieser Schritt eingerichtet ist, bekommt die Person die Mail und ist im Funnel. Ohne Webhook zeigt die Seite die Auswertung nur an.

**Was am Webhook ankommt** (multipart/form-data, wie ein Formular mit Dateianhang):
- Einzelfelder: `vorname, email, handy, geldtyp, geldtyp_name, zweittyp, mischung, fundament, fundament_stufe, bereiche, empfohlenes_video, einkommen_monat, lebenseinkommen, antworten, quelle, einwilligung, zeit, seite`
- `daten`: alles zusammen als JSON
- `auswertung`: das PDF als Datei (etwa 220 KB, 3 bis 4 Seiten)

**Vor dem Livegang ausfüllen** (`quiz.js`, ganz oben):

| Einstellung | Was rein muss |
|---|---|
| `videokursLink` | Seite, auf der der kostenlose Videokurs startet |
| `datenschutzLink`, `impressumLink` | VIP-Seiten |
| `webhook` | Adresse aus Make, Zapier oder dem Mail-Tool |
| `instagram` | Tobias' Instagram-Name für das Story-Bild |

An den Videokurs-Link hängt der Test `geldtyp`, `fundament`, `video`, `vorname`, `email` und die UTM-Werte an. Im PDF ist der Knopf „Videokurs kostenlos starten“ klickbar.

**Messung:** Mit Meta-Pixel oder Google Tag Manager feuern `TestGestartet`, `TestAbgeschlossen`, `Lead`, `VideokursGeklickt`, `PdfGespeichert`, `StoryErstellt`.

## 5. Vorschlag Mail-Strecke

| Tag | Inhalt |
|---|---|
| 0 | Deine Auswertung als PDF im Anhang, Link Videokurs, Video {{empfohlenes_video}} zuerst |
| 1 | Die Falle Deines Geldtyps, ausführlicher |
| 3 | Deine zwei Zahlen: Lebenseinkommen und was davon noch da ist. Erinnerung Video 1 |
| 5 | Was die anderen drei Typen von Dir lernen können |
| 7 | Erinnerung Videokurs: Video 2 und 3 |

## 6. Technik

- Reines HTML, CSS und JavaScript, kein Build-Schritt. Läuft auf jedem Webspace, Netlify, Vercel oder als Unterseite der VIP-Seite.
- Schriften und die Bibliothek für das PDF (jsPDF 2.5.1) liegen im Ordner. Keine Abrufe bei Google oder anderen fremden Servern.
- Antworten werden nur im Browser zwischengespeichert. Daten gehen erst beim Absenden raus.
- `?neu=1` an der Adresse setzt den Test zurück.
- Texte, Fragen und Punkte stehen in `inhalte.js`.

**Dateien:** `index.html`, `inhalte.js` (Texte), `quiz.js` (Ablauf), `pdf.js` (PDF), `quiz.css`, `bilder/`, `schriften/` (Web und `pdf/`), `vendor/`.

## 7. Offene Fragen

1. **Wo soll der Test liegen?** Unterseite der VIP-Seite, eigene kurze Domain oder Netlify?
2. **Welches Mail-Tool bzw. CRM** nutzt die VIP Group? Davon hängt ab, wie die Mail mit PDF rausgeht.
3. **Einwilligungstext** vom Datenschutz der VIP Group freigeben lassen.
4. **Fragen und Typtexte** von Tobias gegenlesen lassen (siehe `QUELLEN.md`, Teil B).
5. **„VIP Academy“** wie auf den Begleitunterlagen, oder ein anderer Name?

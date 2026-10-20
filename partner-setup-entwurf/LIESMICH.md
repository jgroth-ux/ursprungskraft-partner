<!--
  LIESMICH Partner-Setup-Entwurf, Stand 20.10.2026
  FERTIG: Übersicht über alle Aufgaben, Anschluss-Funktionen, Platzhalter, Hinweise zum Einbau.
  FEHLT:  nichts. Bei Änderungen an den Dateien hier mitpflegen.
-->

# Partner-Setup: Entwurf

Entwürfe und fertige Einzelteile für das Partner-Setup. Kein Live-System. Alles reines HTML, CSS und
JavaScript, ohne Framework und ohne Build-Schritt. Zum Ansehen einfach die `index.html` im Browser
öffnen, das Portal lässt sich mit Beispieldaten von vorne bis hinten durchklicken.

## Stand der Aufgaben

| Aufgabe | Ordner / Datei | Stand |
|---|---|---|
| A. Vorlage Partner-Landingpage | `a-landingpage/` | **fertig.** Fehlen: echte Fotos (Prompts in `bild-prompts.md`), Testbedingungen, Marke, Domain |
| B. Partner-Portal | `b-portal/` | **fertig** (Start, Registrieren, Anmelden, Meine Daten mit Live-Vorschau, Paket, Bezahlen, Mein Bereich). Fehlen: alle Preise, echte Anschlüsse |
| C. Vertragsentwurf | `c-nutzungsbedingungen.md` | **Entwurf fertig.** Muss vom Anwalt geprüft werden, AVV fehlt, 15 Fragen an den Anwalt im Anhang |
| D. Druckpreise | `d-druckpreise.md` | **teilweise.** Anbieter DE und CH mit Preisen aus der Websuche. Kein Preis im Konfigurator nachgeprüft (Druckerei-Seiten waren aus meiner Umgebung gesperrt). 200 und 500 Stück nicht gefunden |
| E. Anleitung für Partner | `e-anleitung-partner.md` | **fertig.** Fehlen: Bot-Name, Bestell-Link, Support-Kontakt, Bildschirmfotos |
| F. Offene Fragen | `f-offene-fragen.md` | **fertig.** 44 Fragen mit Antwortmöglichkeiten, die Start-Fragen sind markiert |

## Aufbau

```
partner-setup-entwurf/
├── gemeinsam/
│   ├── farbpakete.css     vier Farbpakete als CSS-Variablen, plus Stil der Vorschau-Leiste
│   └── vorschau.js        Umschalter oben (nur Vorschau), ?farbe=blau in der Adresse geht auch
├── a-landingpage/
│   ├── index.html         die Vorlage mit {{PLATZHALTERN}}
│   ├── landing.css
│   ├── landing.js         Formular, Platzhalter im Browser füllen, Vorschau per postMessage
│   └── bild-prompts.md
├── b-portal/
│   ├── index.html         Startseite des Portals (öffentlich, noindex)
│   ├── start.css
│   ├── portal.css         gemeinsame Gestaltung aller Portalseiten
│   ├── portal.js          Helfer: Geld, Datum, Meldung. WAEHRUNG steht hier
│   ├── anschluss.js       ALLE Anschluss-Funktionen des Portals an einer Stelle
│   ├── registrieren/  anmelden/  meine-daten/  paket/  bezahlen/  mein-bereich/
├── c-nutzungsbedingungen.md
├── d-druckpreise.md
├── e-anleitung-partner.md
└── f-offene-fragen.md
```

## Farbpakete

Alle Seiten nutzen nur die Variablen aus `gemeinsam/farbpakete.css`. Wechsel = eine Zeile am
`<html>`: `data-farbe="oliv"`, `"blau"`, `"sand"` oder `"lehm"`. Die Vorschau-Leiste oben erscheint nur
mit `data-vorschau="an"`. Für den Livebetrieb `data-vorschau="aus"` setzen oder `vorschau.js` nicht
einbinden. Zusätzlich zu den Variablen aus dem Briefing gibt es `--olive-deep` (dunkle Flächen) und
`--olive-hover` (Knopf beim Drüberfahren). Kontraste sind geprüft (Text auf Grund ab 12:1, Sekundärtext
ab 5:1, Knopftext ab 6:1).

## Anschluss-Funktionen

Jede Funktion liefert vorerst Beispieldaten. Beim Einbau nur den Inhalt ersetzen, Name, Eingabe und
Rückgabe bleiben gleich. Im Demo-Betrieb reicht das Portal die Daten über `localStorage` von Seite zu
Seite weiter (Schlüssel `portal-demo`), das fällt live weg.

| Funktion | Datei | Was sie tun soll |
|---|---|---|
| `anfrageSenden(daten)` | `a-landingpage/landing.js` | Anfrage vom Kontaktformular speichern (Tabelle `anfragen`, mit `partner_kuerzel`) und Telegram-Nachricht „Neue Anfrage“ an den Partner auslösen |
| `registrieren(daten)` | `b-portal/anschluss.js` | Konto im Login-Dienst anlegen, leeren Datensatz in `partner`, Bestätigungsmail, Version der Nutzungsbedingungen speichern |
| `anmelden(email, passwort)` | `b-portal/anschluss.js` | Partner anmelden |
| `passwortVergessen(email)` | `b-portal/anschluss.js` | Mail zum Zurücksetzen schicken |
| `abmelden()` | `b-portal/anschluss.js` | Sitzung beenden |
| `partnerLaden()` | `b-portal/anschluss.js` | Daten des angemeldeten Partners aus `partner` laden |
| `partnerSpeichern(daten)` | `b-portal/anschluss.js` | Partnerdaten in `partner` speichern, die Landingpage zeigt sie danach sofort |
| `fotoHochladen(datei)` | `b-portal/anschluss.js` | Foto in den Speicher laden, auf 1600 px verkleinern, öffentliche Adresse zurückgeben |
| `kuerzelPruefen(kuerzel)` | `b-portal/anschluss.js` | Prüfen, ob das Kürzel frei ist (Spalte `kuerzel` eindeutig) |
| `bestellungSpeichern(bestellung)` | `b-portal/anschluss.js` | Paketauswahl als Entwurf in `bestellungen` speichern |
| `bestellungLaden()` | `b-portal/anschluss.js` | Letzten Bestellentwurf laden |
| `bezahlenStarten(bestellung)` | `b-portal/anschluss.js` | Stripe Checkout starten: Abo (monatlich) plus Einmalbetrag. Webhook schaltet danach Seite frei und gibt den Druckauftrag weiter. Rücksprung auf `mein-bereich/index.html?bezahlt=1` |
| `statusLaden()` | `b-portal/anschluss.js` | Für „Mein Bereich“: aktiv bis, nächste Abbuchung, Betrag, Link, Bestell-Link, Telegram verbunden, letzte Bestellung, gekündigt |
| `aboKuendigen(grund)` | `b-portal/anschluss.js` | Stripe-Abo zum Ende der Laufzeit kündigen, Enddatum zurückgeben |

Außerdem `platzhalterFuellen(daten)` in `a-landingpage/landing.js`: füllt die Platzhalter im Browser.
Das nutzt die Live-Vorschau in „Meine Daten“ (per `postMessage` an das eingebettete
`a-landingpage/index.html`, Pfad in `VORLAGE_PFAD` in `meine-daten.js`). Live sollte der Server die
Platzhalter beim Ausliefern ersetzen.

## Platzhalter

**Partnerdaten** (kommen aus dem Portal, Tabelle `partner`):
`{{VORNAME}}`, `{{NACHNAME}}`, `{{TELEFON}}`, `{{WHATSAPP}}` (nur Ziffern mit Ländervorwahl, für
wa.me), `{{EMAIL}}`, `{{ORT}}`, `{{FOTO}}` (Bildadresse), `{{KUERZEL}}`, `{{UEBER_MICH}}` (neu, der
Text über sich), `{{IMPRESSUM_URL}}`, `{{DATENSCHUTZ_URL}}` (neu, Seiten des Partners).

**Marke und Betrieb** (einmal festlegen):
`{{MARKE}}`, `{{DOMAIN}}`, `{{ANBIETER}}`, `{{ANBIETER_ANSCHRIFT}}`, `{{ANBIETER_EMAIL}}`,
`{{BOTNAME}}`, `{{BESTELL_LINK}}`, `{{SUPPORT_KONTAKT}}`, `{{PORTAL_IMPRESSUM_URL}}`,
`{{PORTAL_DATENSCHUTZ_URL}}`.

**Geld** (Jasmin):
`{{PREIS_STARTERPAKET}}`, `{{PREIS_LANDINGPAGE_MONAT}}`, `{{PREIS_NACHDRUCK}}`,
`{{PREIS_EIGENE_DOMAIN}}`, `{{PREISHINWEIS_MWST}}`, `{{ZAHLWEISE}}`, `{{ABBUCHUNGSTAG}}`,
`{{PREIS_FEHLT}}` (erscheint automatisch, solange in `paket.js` ein Preis `null` ist). Die Tabelle
`PREISE` steht oben in `b-portal/paket/paket.js`.

**Vertrag** (Jasmin und Anwalt, nur in `c-nutzungsbedingungen.md`):
`{{BETRAG}}` (Vertragsstrafe), `{{KUENDIGUNGSFRIST}}`, `{{KUENDIGUNGSFRIST_ANBIETER}}`,
`{{MINDESTLAUFZEIT}}`, `{{FRIST_ZAHLUNGSAUSFALL}}`, `{{FRIST_WIEDERFREISCHALTUNG}}`,
`{{FRIST_FRISTLOS}}`, `{{FRIST_PREISAENDERUNG}}`, `{{FRIST_AENDERUNG}}`, `{{FRIST_EXPORT}}`,
`{{FRIST_LOESCHUNG_PROFIL}}`, `{{SPERRFRIST_KUERZEL}}`, `{{HAFTUNGSGRENZE}}`, `{{GERICHTSSTAND}}`,
`{{LISTE_UNTERAUFTRAGNEHMER}}`, `{{DATUM_FASSUNG}}`, `{{VERSION}}`.
`{{KUENDIGUNGSFRIST}}` steht auch auf der Portal-Startseite, in „Bezahlen“ und „Mein Bereich“.

**Fehlende Inhalte:**
`{{TESTBEDINGUNGEN_FEHLT}}` (Landingpage: Dauer und Bedingungen des Tests), `{{FORMAT_FEHLT}}`
(Format des Wegweisers in `paket.js`), `{{DATUM_FEHLT}}` (erscheint, wenn `statusLaden()` kein Datum
liefert).

**Nur in Vorlagen für Anfragen** (`d-druckpreise.md`): `{{ANZAHL_PARTNER}}`, `{{LAND}}`.

## Hinweise zum Einbau

- **Ordner-Links:** Alle Links im Portal zeigen auf `…/index.html`, damit es auch als Datei auf dem
  Rechner klickbar ist. Auf dem Server kann das so bleiben.
- **Links zu C und E:** Registrieren und Mein Bereich verlinken im Entwurf auf die `.md`-Dateien.
  Live auf eine echte Seite umstellen.
- **QR-Code** in „Mein Bereich“ kommt von `qrcodejs 1.0.0` über cdnjs. Fehlt die Bibliothek,
  verschwindet der Kasten.
- **noindex** steht auf jeder Seite (`<meta name="robots" content="noindex,nofollow">`).
- **Schriften** kommen von Google Fonts. Vor dem Livegang selbst hosten (Frage 25 in F).
- **Gestaltung:** bewusst ohne Schatten, Verläufe, Glas und Leuchteffekte. Die `hochwertig.css` aus
  dem Vorbild hat solche Effekte, die habe ich nach Briefing nicht übernommen.
- **Geprüft:** alle Seiten bei 375 px und 1280 px ohne seitliches Scrollen und ohne Skriptfehler, der
  Portal-Ablauf von Registrieren bis Mein Bereich automatisch durchgeklickt.

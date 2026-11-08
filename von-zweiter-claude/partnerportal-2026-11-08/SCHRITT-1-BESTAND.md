# Partnerportal: Bestand und Liste aller Funktionen (Schritt 1, 08.11.2026)

Gelesen, ganz: `partner.js`, `flyer.js`, `index.html`, `manifest.webmanifest`, alle 10 SQL-Dateien,
alle 4 Edge Functions, `jasmins-kritik.md`, `gestaltungsrichtlinien.md`, `fakten-emguarde.md`.
`editor.js` nur auf die Teile, die `flyer.js` nutzen (wird nicht umgebaut).

Diese Liste ist die Prüfliste für "Fertig heißt": Jede Zeile mit Nummer muss im neuen Portal wieder da sein.

---

## A. Zugang

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| A1 | Anmelden mit E-Mail und Passwort | Reiter "Anmelden" | `uk_partner_anmelden` |
| A2 | Fehlermeldungen beim Anmelden: falsch, wartet auf Freigabe, abgelehnt, 15 Minuten gesperrt nach 5 Fehlversuchen | Text unter dem Formular | Antwort `fehler` |
| A3 | "Passwort vergessen?" | nur ein Mail-Link an info@ursprungskraft.net | keine |
| A4 | Neu registrieren: Vorname, Nachname, Enagic-ID (21000 + 6 Ziffern), E-Mail (dieselbe wie bei Enagic, mit Hinweis im Kasten), Telefon, Ort, Passwort zweimal (mind. 8 Zeichen) | Reiter "Neu registrieren", Danke-Kasten danach | `uk_partner_registrieren` |
| A5 | Fehlermeldungen beim Registrieren: Name, E-Mail, ID, Passwort, E-Mail vergeben, ID vergeben, Passwörter ungleich | Text unter dem Formular | Antwort als Text |
| A6 | Direktsprung auf Registrieren über `#registrieren` in der Adresse | beim Laden | keine |
| A7 | Freigabe neuer Partner durch Daniel oder Jasmin per Knopf, Knöpfe verschwinden bei beiden, Bestätigungsmail und Freischaltmail | nicht im Portal, im `partnerbot` | `partnerbot`, `tg_nachrichten` |
| A8 | Sitzung bleibt 180 Tage im Browser, wird beim Laden geprüft, ungültig heißt zurück zur Anmeldung | `localStorage` `uk-partnerportal` | `uk_partner_daten`, `uk_partner_von_sitzung` |
| A9 | Abmelden | Knopf ganz unten in der Übersicht | `uk_partner_abmelden` |
| A10 | Begrüßung "Hallo Vorname" im Kopf | Kopfzeile | `uk_partner_daten` |

## B. Aus Telegram geöffnet (Flyer im Telegram-Fenster)

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| B1 | `/flyer` im Assistenten öffnet das Portal als Telegram-Fenster mit `#tg=<Sitzung>` (2 Stunden gültig), Portal springt direkt in "Flyer erstellen" | `TG` in `partner.js` | `uk_partner_flyer_sitzung` |
| B2 | Im Telegram-Fenster gehen die fertigen Flyer per Knopf als Datei in den eigenen Chat statt in den Download-Ordner, mit eigenem Knopftext und Hinweis | POST an `partner-assistent?flyer=<format>` mit `x-sitzung` | `uk_partner_chat_von_sitzung` |

## C. Übersicht (heute ein Kasten unter dem anderen)

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| C1 | Hinweis "Portal als App aufs Handy" mit Anleitung iPhone (Safari, Teilen, Zum Home-Bildschirm) und Android (Chrome, drei Punkte, App installieren). Verschwindet, wenn das Portal schon als App läuft | `display-mode: standalone` | keine |
| C2 | Persönlicher Bestell-Link `mein.ursprungskraft.net/bestellen/?von=<kurz>` anzeigen | Kasten "Dein persönlicher Bestelllink" | `kurz` |
| C3 | Bestell-Link kopieren (mit "Kopiert" und Ersatztext, wenn Kopieren nicht geht) | Knopf | keine |
| C4 | Bestellseite ansehen (neuer Tab) | Knopf | keine |
| C5 | QR-Code zum Bestell-Link anzeigen und als SVG speichern | `vendor/qrcode.js` | keine |
| C6 | Enagic-ID des Partners anzeigen (im Erklärtext) | Text | `enagic_id` |
| C7 | Zahl der Bestellungen über den Link ("Bisher kamen n Bestellungen") | Text | `bestellungen` in `uk_partner_daten` |
| C8 | Persönliche Wasser-Check-Seite `mein.ursprungskraft.net/wasser/?von=<kurz>` anzeigen und ansehen | Kasten | `kurz` |
| C9 | Baukasten der Wasser-Check-Seite: ein Satz von dir, WhatsApp, Telefon, E-Mail, Termin-Link (nur https), speichern mit Rückmeldung | Formular | `uk_partner_seite_setzen`, öffentlich `uk_partner_seite` |
| C10 | Telegram-Assistent verbinden oder öffnen (`t.me/<bot>?start=<tg_code>`), Anzeige "verbunden", Hinweis "wird eingerichtet", wenn noch kein Bot-Name hinterlegt ist | Kasten, nur mit `tg_code` | `tg_code`, `tg_verbunden`, `assistent_bot` |
| C11 | Kalender-Abo: "Mit iPhone verbinden" (webcal), "Mit Google Kalender verbinden", Link kopieren, Hinweis "nicht weitergeben" | Kasten, heute immer sichtbar | `kalender`, Edge Function `partner-kalender` |
| C12 | "Wer kümmert sich um die Bestellung?": Daniel organisiert alles oder ich wickle selbst ab (Unterlagen an die eigene E-Mail), speichert sofort | zwei Wahlfelder | `uk_partner_abwicklung_setzen` |
| C13 | "Material für deine Kunden" | heute nur Platzhalter "bald" | keine |
| C14 | "Mehr für dein Geschäft": Eigene Landingpage, Broschüren, Eigener Assistent, je "Preis folgt" | drei Textkacheln | keine |

## D. Meine Kontakte

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| D1 | Liste aller Kontakte des Partners: über seine Seite angefragt (`partner_id`), über seinen Link bestellt, selbst eingetragen. Neueste zuerst | Karten | `uk_partner_kontakte` |
| D2 | Herkunft je Kontakt: Anfrage, Bestellung, Selbst eingetragen | Marke | `quelle` |
| D3 | Status je Kontakt: Interessent, Testet, Kunde, Kein Interesse | Marke, änderbar | `uk_kunden.status` |
| D4 | Suche über Name, Ort, Telefon, E-Mail (live) | Suchfeld | im Browser |
| D5 | Filter mit Zahl: Alle, Heute melden, je Status | Knopfleiste | im Browser |
| D6 | "Heute melden": fällig, wenn "Wieder melden am" heute oder früher, rot markiert | Marke und rotes Datum | `naechster_kontakt` |
| D7 | Angaben je Kontakt: Telefon (antippbar), E-Mail (antippbar), Ort, am besten erreichbar, erster Kontakt, zuletzt gesprochen, wieder melden am, so seid ihr verblieben, Gerät mit Kaufdatum | Angabenraster | `uk_partner_kontakte` |
| D8 | Kontakt öffnen und schließen | Knopf | keine |
| D9 | Kontakt bearbeiten: Status, wieder melden am, so seid ihr verblieben | Formular im offenen Kontakt | `uk_partner_kontakt_speichern` |
| D10 | Neue Notiz zum Gespräch, wird mit Datum gespeichert und setzt "zuletzt gesprochen" auf heute | Textfeld | `uk_partner_kontakt_speichern`, `uk_kontakt_notizen` |
| D11 | Bisherige Notizen mit Datum, neueste zuerst | Liste im offenen Kontakt | `notizen` |
| D12 | Kontakt selbst eintragen: Vorname (Pflicht), Nachname, Telefon, E-Mail, Ort, am besten erreichbar, Status, wieder melden am, verblieben, erste Notiz. Abbrechen möglich | Formular oben | `uk_partner_kontakt_speichern` |
| D13 | "Termin mit Vorname eintragen" aus dem Kontakt heraus, springt zu Termine mit dem Kontakt vorgewählt | Knopf | keine |
| D14 | Rückmeldungen "Gespeichert", "Kontakt eingetragen", Fehlertext | Kasten | keine |

## E. Termine

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| E1 | Termin eintragen: Art (Rückruf, Termin vor Ort, Anruf, Zoom, Sonstiges), mit wem (aus den eigenen Kontakten oder niemand bestimmtes), Datum, Uhrzeit, Dauer (15 Min. bis 2 Std.), Ort oder Zoom-Link, Notiz | Formular | `uk_partner_termin_speichern` |
| E2 | Liste der kommenden Termine mit Art, Name, Wochentag, Datum, Uhrzeit, Ort, Notiz | Karten | `uk_partner_termine_liste` (ab vor 30 Tagen) |
| E3 | Termin löschen mit Rückfrage | Knopf | `uk_partner_termin_loeschen` |
| E4 | Jeder Termin erscheint im Kalender-Abo mit Erinnerung 30 Min. vorher, dazu die "Wieder melden am"-Tage als ganztägige Einträge | Edge Function | `partner-kalender`, `uk_partner_kalender_daten` |

## F. Flyer erstellen (Logik in `flyer.js` bleibt)

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| F1 | Formate wählen, mehrere gleichzeitig: Story 1080 × 1920, Beitrag 1080 × 1350, Quer 1920 × 1080, A4 2480 × 3508 | Knöpfe mit Formsymbol | `Flyer.FORMATE` |
| F2 | 9 freigegebene Überschriften mit Unterzeile zur Auswahl, oder eigene schreiben. Auswahl folgt dem getippten Text | Auswahlliste | `Flyer.UEBERSCHRIFTEN` |
| F3 | Felder: kleine Zeile, Überschrift, Unterzeile, Datum, Uhrzeit, Ort, Adresse, Name (vorbelegt), Telefon, E-Mail | Formular | im Browser |
| F4 | 17 Motive, ausgeblendete Motive aus Jasmins Editor fehlen | Bildknöpfe klein | `uk_flyer_vorlagen_liste`, `Flyer.sichtbar` |
| F5 | Eigenes Foto hochladen (bleibt nur im Browser, geteiltes Layout) | Knopf "+" | `Flyer.eigenesFoto` |
| F6 | 4 Farbpaletten: Wasserblau, Türkis, Hellbeige, Nachtblau | runde Farbknöpfe | `Flyer.FARBEN` |
| F7 | Live-Vorschau je gewähltem Format (heute klein, 40 % Maßstab) | Canvas | `Flyer.zeichnen` |
| F8 | Vorlagen aus Jasmins Flyer-Editor werden beim Zeichnen genommen, sonst die Automatik | in `flyer.js` | `uk_flyer_vorlagen` |
| F9 | Herunterladen als JPG in voller Größe, ein Bild je Format, Dateiname mit Format und Datum | Knopf | im Browser |
| F10 | Entwurf bleibt im Browser gespeichert (`uk-partner-flyer`), alter Entwurf "Gesundes Wasser" wird ersetzt | `localStorage` | keine |
| F11 | Im Telegram-Fenster: in den Chat schicken statt herunterladen (siehe B2) | Knopf | `partner-assistent` |

## G. App und Rahmen

| Nr | Funktion heute | Wie es heute läuft | Datenbank / Dienst |
|---|---|---|---|
| G1 | Installierbar als App (Manifest, `start_url` und `scope` `/partner/`, Name "Ursprungskraft Partner", Kurzname "Partner") | `manifest.webmanifest` | keine |
| G2 | Apple-Einstellungen für die App (Titel "Partner", Vollbild) | Meta-Tags | keine |
| G3 | Seite wird von Suchmaschinen nicht aufgenommen | `noindex, nofollow` | keine |

## H. Läuft im Hintergrund und muss weiter funktionieren (nicht im Portal sichtbar)

| Nr | Was | Wo |
|---|---|---|
| H1 | Assistent meldet neue Anfragen über die Seite sofort mit Knöpfen (Angerufen, Termin eintragen, in 2 Tagen, in 1 Woche, kein Interesse) | Trigger `uk_assistent_neue_anfrage`, `partner-assistent` |
| H2 | Assistent meldet Bestellungen über den Link | Trigger `uk_assistent_neue_bestellung` |
| H3 | Assistent: `/termin`, `/heute`, `/flyer`, `/hilfe`, Notiz nach "Angerufen" | `partner-assistent` |
| H4 | Morgens 7:30 Tagesübersicht an verbundene Partner | `uk_assistent_morgen` (cron) |
| H5 | Bestellung über Partner-Link läuft automatisch über dessen Enagic-ID, Unterlagen je nach Abwicklung an Daniel oder Partner, Meldung im Partner-Bot | `uk_bestellung_melden` |
| H6 | Leads von Partnerseiten (Kevin, Johny): heiß, warm, kalt. Heiß und warm kommen über `uk_anfrage` in `uk_kunden` und auf die Anrufliste, Meldung in die Telegram-Gruppe "Leads" | `partner-lead`, `uk_partner_lead_speichern` |

---

## Was mir beim Lesen aufgefallen ist (wichtig für Schritt 2)

1. **Kalte Leads sieht der Partner heute nicht.** E-Book und "nur umschauen" stehen nur in `uk_partner_leads`.
   Dafür gibt es keine Lesefunktion mit Sitzung, die Tabelle ist nur fürs Dashboard offen. Für "Interessenten
   seiner Seite automatisch" braucht es eine neue Funktion (z. B. `uk_partner_leads_liste`).
2. **Heiß und warm landen nur dann beim Partner, wenn er `aktiv` ist** (`uk_anfrage` sucht `kurz ... and aktiv`).
   Freigegebene Partner sind aktiv, das passt. Selbst registrierte Partner vor der Freigabe nicht, das ist gewollt.
3. **Zwei Statuslisten passen nicht zusammen.** Kontakte haben Interessent, Testet, Kunde, Kein Interesse.
   Leads haben neu, kontaktiert, termin, gekauft, kein_interesse. Jasmin will: neu, kontaktiert, Termin,
   gekauft, in Betreuung, dazu Stufe heiß, warm, kalt auch für selbst eingetragene Kontakte. Das braucht neue
   Spalten (Stufe, Stand) an `uk_kunden` oder eine Übersetzung. Vorschlag kommt in Schritt 2.
   Achtung: Der Assistent setzt heute `status = 'Kein Interesse'` direkt, und Kalender und Tagesübersicht
   filtern auf genau diesen Wert. Alte Werte dürfen also nicht einfach verschwinden.
4. **Bestellstand gibt es noch nicht.** `uk_partner_kontakte` liefert nur Gerät und Kaufdatum aus `uk_kunden`.
   Für bestellt, an den Hersteller raus, Gerät da braucht es die neue Funktion aus dem Auftrag. Welche Spalte in
   `uk_bestellungen` den Stand trägt (der Auftrag nennt `verschickt`), steht in keiner der mitgelieferten Dateien.
   **Frage an Jasmin:** Spaltennamen und Werte des Bestellstands in `uk_bestellungen`, oder die SQL-Datei dazu.
5. **Name eines Kontakts lässt sich nach dem Anlegen nicht mehr ändern**, Kontakte lassen sich nicht löschen,
   Termine nicht bearbeiten. Kein Verlust, aber auffällig. Ich baue nichts dazu, ohne zu fragen.
6. **Kalender-Kasten ist heute immer sichtbar** (`kalender` hat jeder). Neu: nur mit Terminen, dann oben.
7. **App-Symbol und Favicon kommen heute aus `../dashboard/`**, also Daniels und Jasmins Symbol. Neu: eigene
   Symbole aus dem Partner-Symbol unter `partner/`.
8. **Freischalten und Testzeitraum:** `uk_partner_daten` liefert noch nichts dazu. Braucht neue Spalten am
   Partner und eine neue Fassung von `uk_partner_daten`.
9. **Neuigkeiten:** Der `partnerbot` antwortet auf Text heute nur mit einer Begrüßung. Er braucht den Knopf
   "Als Neuigkeit an alle Partner?", eine neue Tabelle und die Zustellung über `uk_assistent_senden`.
10. **Unterlagen:** In `unterlagen-pdf/` liegen fünf PDFs. Der Auftrag nennt drei (Guide, Detox, Wegweiser).
    `Reinigung-Anleitung.pdf` und `Zinzino-Start-Daniel.pdf` sind auch dabei.
    **Frage an Jasmin:** Kommen Reinigung und Zinzino mit ins Portal? Zinzino ist kein Enagic-Produkt.
11. **Das Wort "Kangen"** steht in zwei Dateinamen der PDFs und im Dateinamen des Kalender-Abos
    (`kangen-termine.ics`). Bereiche des Portals heißen nie so. Die PDF-Namen lasse ich, der Kalender-Dateiname
    ist nur technisch und bleibt (Edge Function wird sonst ohne Grund geändert).

## Offene Fragen an Jasmin vor Schritt 2

1. Bestellstand: wo steht er in `uk_bestellungen` (Spalte und Werte)?
2. Unterlagen: Reinigung und Zinzino mit ins Portal oder nicht?
3. Status der Kundendatenbank: Sollen "Testet" und "Kein Interesse" bleiben, zusätzlich zu neu, kontaktiert,
   Termin, gekauft, in Betreuung? Mein Vorschlag: Stand = neu, kontaktiert, Termin, testet, gekauft,
   in Betreuung, kein Interesse.

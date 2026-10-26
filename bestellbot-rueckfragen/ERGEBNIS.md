# Ergebnis: Bestell-Bot mit Rückfragen

Stand 26.10.2026. Gebaut nach `an-zweiter-claude-bestellbot/AUFTRAG.md`. Eingespielt und echt getestet wird im Hauptsystem, Anleitung in `EINBAU.md`.

## Gebaut

- **Meldung bei neuer Bestellung** (Trigger `uk_bestellung_melden`): Bestellnummer `#1001` ff., Eingangszeit (Zürich), Name, Firma, PLZ Ort, Land, Produkte (K8, emGuarde Go, ANESPA DX, „OHNE K8“ kenntlich), Zahlungsart, Kaufart, Link `von`. Der Satz „bitte im Dashboard festlegen“ ist ersetzt.
- **Knöpfe** Daniel · Ursprungskraft GmbH · Jasmin · Jemand anderes an Daniel. Jasmin bekommt die Meldung weiter zur Info, ohne Knöpfe.
  - `von = jasmin`: Jasmin ist gesetzt, direkt die Frage nach der Linie. Hat Jasmin keine Sponsor-ID: „Für Jasmin ist noch keine Sponsor-ID hinterlegt“, nichts wird geschickt, die anderen drei Knöpfe zum Umzuordnen.
  - Jemand anderes: Name, Sponsor-ID (nur Ziffern), E-Mail nacheinander, mit Prüfung und Rückfrage bei Tippfehlern.
  - Ohne K8: „Ohne K8 bestellt, bitte persönlich klären.“ Kein Formular, Ergänzungen gehen nie an Enagic.
- **Linie** als getippte Zahl, keine Knöpfe. Ins Formular wie bisher als `Line`.
- **PDFs auf dem Server** (Edge Function `bestellbot`, pdf-lib in Deno), 1:1 aus `vertragErstellen`: Distributorenvertrag Seite 2, Non-EU-Zusatz, Bestellformular, Ratenzahlungsantrag. Gleiche Felder, Koordinaten und Vorbelegung (Preis 4.600, MwSt 874 bei DE, Versand je Land, Anzahlung aus der Bestellung). Formulare aus `bestellungen/formulare/`, Unterschriften aus `bestellungen/`.
- **Mail** über IONOS (info@ursprungskraft.net) an die Sponsor-Adresse aus `uk_einstellungen` (`mail_enagic_<sponsor>`), mit allen PDFs, Ausweisfotos und Zahlungsbeleg. Betreff und Text genau für Enagic, Daniel leitet nur weiter. Blindkopie an info@, außer im Testbetrieb. **Nie direkt an Enagic.**
- **Abschluss im Bot**: „Fertig. Die Mail für Enagic liegt im Postfach von …“ plus Empfänger, Betreff, Beträge, Anhänge und Hinweise (keine Sponsor-Unterschrift, keine Sponsor-ID).
- **Speichern** wie heute: `sponsor`, `linie`, `angaben`, `pdfs`, `status = 'Vertrag fertig'`, dazu `mail_sponsor`.
- **Sicherheit und Zuverlässigkeit**
  - Webhook mit `secret_token`. Geheimnis und Bot-Schlüssel kommen aus dem Tresor, kein Secret abzutippen. Webhook setzen per SQL `select uk_bestellbot_webhook_setzen();`.
  - Nur `tg_chat_daniel` und `tg_chat_jasmin` dürfen bedienen.
  - Gesprächszustand in Tabellen, nicht im Speicher.
  - Doppelte Knopfdrücke, doppelt getippte Zahl und von Telegram wiederholte Updates lösen nichts doppelt aus (bedingter Schrittwechsel, `update_id` nur einmal, `mail_sponsor`).
  - Zwei Bestellungen gleichzeitig: Antwort per „Antworten“ auf die richtige Frage, sonst die zuletzt gefragte. Wartet nur eine, ist sie gemeint. Erinnerung an weitere offene. `/offen` listet alles Offene.
  - Fehler (z. B. Formular fehlt, keine Adresse) werden im Chat genannt, die Bestellung wartet wieder auf die Linie.
- **Testbetrieb**: `bestellbot_testmail` gesetzt = alle Bot-Mails nur dorthin, Betreff mit `[TEST]`.

## Getestet (hier, ohne euer System)

- Typprüfung der Edge Function mit Deno 2.5: ohne Fehler.
- Ablauf-Test `test/ablauf-test.ts` mit den echten vier Formularen: 18 von 18 Prüfungen bestanden (Fälle siehe EINBAU.md). Die erzeugten PDFs habe ich angesehen, Felder, Häkchen, Unterschriften und Datum sitzen wie im Dashboard.
- SQL in einer echten Postgres-Datenbank (PGlite, mit Platzhaltern für Tresor und `net.http_post`): läuft zweimal hintereinander ohne Fehler. Meldungen für normale Bestellung, Jasmin-Link mit und ohne ID, ohne K8 und für ausgeschalteten Bestell-Bot geprüft, Webhook-Aufruf geprüft.
- **Nicht getestet**: echtes Telegram, echter Mailversand über IONOS, Supabase-Speicher und das Zusammenspiel im Projekt. Dafür ist der Testablauf in EINBAU.md Schritt 7.

## Offen

- **Daniels Hotmail-Adresse** in `mail_enagic_daniel` eintragen (steht `XXX`).
- **Formulare** in den Bucket legen (`bestellungen/formulare/`).
- **Daniel** muss im Bestell-Bot einmal Start drücken, dann `bestellbot_daniel = 'ja'`.
- **Jasmin**: Sponsor-ID in `sponsor_jasmin` und Adresse in `mail_enagic_jasmin`, sobald sie eine Enagic-ID hat. Bis dahin meldet der Bot das und schickt nichts.
- **Dashboard** (nicht Teil dieses Auftrags, kleine Anpassung empfohlen):
  - `SPONSOR_NAMEN` kennt `andere` nicht, in der Liste stünde „für undefined“. Vorschlag: `andere` ergänzen und `angaben.sponsor_name` anzeigen.
  - Wer im Dashboard „Vertrag erstellen“ nutzt, nachdem der Bot fertig ist, erstellt die PDFs noch einmal (keine Mail). Das ist harmlos, der Status zeigt „Vertrag fertig“.
- **Beträge**: Der Bot nimmt die Vorbelegung des Dashboards (Preis 4.600). Weicht ein Preis ab, sieht Daniel das in der Fertig-Nachricht und im PDF und muss es im Dashboard korrigieren und neu erstellen. Eine Korrektur direkt im Bot gibt es noch nicht.
- **Garantie-Erweiterung, Raten von/bis**: Der Bot lässt sie leer, so wie das Dashboard ohne Eingabe.
- Kleinigkeit in `mail-senden` (Kundenmail): Dort steht noch „Das Gerät kommt direkt aus Düsseldorf zu dir.“ Jasmin hat Düsseldorf auf der Bestellseite streichen lassen, die Danke-Seite sagt jetzt „Enagic schickt dir die Bestellung direkt nach Hause.“

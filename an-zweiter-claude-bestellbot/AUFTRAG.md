# Auftrag: Bestell-Bot mit Rückfragen (Stand 26.10.2026)

Vom Hauptsystem an den zweiten Claude. Alle Schlüssel sind entfernt oder `XXX`. Keine Kundendaten.
Supabase-Projekt `ngcbmpuqcqbelfoelwby`. Eingespielt und getestet wird im Hauptsystem, nicht bei dir.

## Ziel

Daniel soll eine neue Bestellung komplett im Telegram-Bot abwickeln, ohne Dashboard.
Bot: `@Ursprungskraft_Bestellungen_Bot`. Sein Schlüssel liegt im Supabase-Tresor als `tg_token_bestellung`.

## Ablauf

1. **Bestellung kommt rein** (Trigger `uk_bestellung_melden` auf `uk_bestellungen`, siehe
   `vorhanden/supabase/umbau-2026-10-24-bestellung-ergaenzungen.sql`). Die Nachricht muss die Bestellung
   eindeutig machen, auch wenn zwei gleichzeitig kommen: kurze Bestellnummer, Eingangszeit, Name, PLZ Ort, Land,
   Produkte (K8 / emGuarde Go / ANESPA DX, ohne K8 kenntlich), Zahlungsart, Link `von`.
   Den Satz "bitte im Dashboard festlegen" ersetzen.
2. **Inline-Knöpfe:** Daniel · Ursprungskraft GmbH · Jasmin · Jemand anderes.
   - Kam die Bestellung über `von = jasmin`, ist Jasmin schon gesetzt, dann direkt Schritt 3.
   - **Jemand anderes:** Bot fragt nacheinander Name, Sponsor-ID, E-Mail dieser Person (Freitext).
3. **Linie:** Bot fragt "Welche Linie? Bitte die Zahl schicken." Daniel tippt eine Zahl. Keine Knöpfe,
   weil noch unklar ist, wie viele Linien es gibt. Ins Formular kommt sie wie bisher (`Line`, "Neukunde in [ Zahl ] A").
4. **PDFs auf dem Server ausfüllen.** Heute passiert das im Browser in `vorhanden/dashboard/app.js`,
   Funktion `vertragErstellen` (ab Zeile ~1095), Mailtext in `mailText` (~1056), Beträge in `bAngaben` und im
   Dialog (~990). Bitte das als Edge Function nachbauen (pdf-lib läuft in Deno, z. B. `npm:pdf-lib`).
   Formulare liegen in `vorhanden/dashboard/formulare/` (bestellformular, ratenzahlungsantrag,
   distributorenvertrag, non-eu). Im Hauptsystem werden sie in den Speicher gelegt; nimm an, sie liegen im
   Bucket `bestellungen` unter `formulare/<datei>.pdf`, und schreib das in die Einbau-Anleitung.
   - Beträge: die Vorbelegung aus dem Dashboard übernehmen (Preis, MwSt bei DE, Versand je Land). Daniel prüft sie in der Mail.
   - Kunden-Unterschrift und Ausweisfotos: Bucket `bestellungen`, Pfade in `uk_bestellungen.dateien`.
   - Sponsor-Unterschrift: gespeichert unter `sponsor/<daniel|gmbh|jasmin>.png` im selben Bucket. Fehlt sie,
     PDF ohne Unterschrift und im Bot darauf hinweisen. Bei "Jemand anderes" ohne Unterschrift.
   - Bestellung ohne K8 (`daten.k8 = 'nein'`): kein Enagic-Formular. Bot sagt: "Ohne K8 bestellt, bitte persönlich klären." Ergänzungen (emGuarde, ANESPA) gehen nie an Enagic.
   - Sponsor-Daten: `uk_einstellungen` (`sponsor_daniel`, `sponsor_gmbh`, `sponsor_jasmin`), Funktion `uk_sponsoren()`.
   - Ergebnis in `uk_bestellungen` speichern wie heute: `sponsor`, `linie`, `angaben`, `pdfs`, `status = 'Vertrag fertig'`.
5. **Mail mit allen PDFs und Ausweisfotos verschicken**, Absender info@ursprungskraft.net über IONOS
   (wie `vorhanden/supabase/functions/mail-senden/index.ts`, Geheimnis `IONOS_PASSWORT`).
   Inhalt: Empfänger, Betreff und Text für Enagic stehen fertig drin, damit Daniel nur noch weiterleitet
   (an goc.eu@enagic.com, Betreff "NEW Sale Leveluk K8 from <Land>", Text wie `mailText`).
   **An wen die Mail geht:**
   - Ursprungskraft GmbH: ursprungskraft.gmbh@gmail.com
   - Daniel: Daniels Hotmail-Adresse (als Einstellung `mail_enagic_daniel` in `uk_einstellungen`, Wert trägt das Hauptsystem ein)
   - Jemand anderes: ebenfalls an Daniels Hotmail-Adresse, Daniel leitet weiter
   - Jasmin: hat noch keine Enagic-ID und keine Adresse. Bot meldet "Für Jasmin ist noch keine Sponsor-ID hinterlegt" und schickt nichts.
   Alle Empfänger als Einstellungen anlegen, nicht fest im Code, damit später auf direktes Senden an Enagic umgestellt werden kann.
6. **Abschluss im Bot:** "Fertig. Die Mail für Enagic liegt im Postfach von <Empfänger>. Bitte prüfen und an Enagic weiterleiten."

## Regeln

- **Nie automatisch an Enagic senden.** Immer erst an die Sponsor-Adresse, Daniel leitet weiter.
- Nur Chats, die in `uk_einstellungen` (`tg_chat_daniel`, `tg_chat_jasmin`) stehen, dürfen den Bot bedienen.
  Telegram-Webhook mit `secret_token` absichern.
- Gesprächszustand (welche Bestellung wartet auf welche Antwort) in einer Tabelle speichern, nicht im Speicher der Function.
- Doppelte Knopfdrücke dürfen nicht doppelt senden.
- Bot-Texte kurz, freundlich, du-Form, keine Gedankenstriche.
- Jasmin bekommt die Bestellmeldung weiterhin auch (wie heute), die Rückfragen gehen an Daniel.

## Was ich zurück brauche

Ein Ordner mit:
- `supabase/functions/bestellbot/index.ts` (Webhook, Ablauf, PDFs, Mail)
- `supabase/umbau-<datum>-bestellbot-rueckfragen.sql` (Tabellen, Einstellungen, geänderter Trigger, darf mehrfach laufen)
- `EINBAU.md`: Schritt für Schritt fürs Hauptsystem, inklusive Webhook setzen (am besten per SQL mit `net.http_post` und dem Tresor-Schlüssel, damit niemand den Schlüssel abtippen muss), welche Secrets nötig sind, und ein Testablauf mit einer Testbestellung, die nur an Jasmin geht und nichts verschickt außer an eine Testadresse.
- `ERGEBNIS.md`: was gebaut ist, was offen ist.

Keine echten Schlüssel einsetzen, `XXX` lassen.

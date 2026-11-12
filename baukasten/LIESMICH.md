# Baukasten Partnerseiten (Paket "Eigene Seite")

Stand 11.11.2026. Für Jasmin und den Claude mit Zugang zu Datenbank und Server.
Nichts davon ist hochgeladen oder eingespielt. Alle Schlüssel stehen als `XXX` drin.

## Worum es geht

Jeder Partner bekommt eigene Empfehlungsseiten mit E-Book, ohne dass jemand von Hand baut oder hochlädt.

- **Drei feste Seiten** für alle Partner: `website/p/neutral.html`, `sport.html`, `gesundheit.html`.
- Die Adresse sagt, wer es ist: `/p/max-muster/sport`. Netlify leitet per `_redirects` auf die feste Seite um
  (eine Zeile je Fassung). Die Seite holt Name, Foto, Rolle, Satz und Instagram über die öffentliche Funktion
  `uk_seite_oeffentlich()`. Telefon und E-Mail des Partners nur, wenn er es im Formular ausdrücklich freigibt.
- **Kein Upload je Partner.** Ein neuer Partner ist nur eine Zeile in der Datenbank.
- **Leads** gehen wie bei Kevin und Johny an die Edge Function `partner-lead`, mit `von` = Kürzel des Partners
  (`uk_partner.kurz`). Die Adresse der Seite darf sich ändern, das Kürzel nie. So bleibt jeder Lead für immer beim
  Partner, über den er kam. Zusätzlich gespeichert: `antworten.fassung` und `antworten.seite`.
- **E-Book:** eine Vorlage je Fassung. Die Edge Function `partner-ebook` fügt beim Abruf nach der Titelseite die Seite
  "Empfohlen von" ein (Foto, Name, Rolle, Satz, Kontakt mit Freigabe, Link zur Seite).
- **Portal:** neue Ansicht "Meine Seiten". Nicht gebucht: lebendige Vorschau mit den Seiten von Daniel und Jasmin,
  Klick öffnet die Info-Seite. Gebucht: einmal das Formular, danach je Fassung "Link kopieren", "Vorschau" und E-Book.
- **Anmeldung** im Portal wie bisher mit Sitzungsschlüssel (`uk_partner_konten`, `uk_partner_sitzungen`),
  nicht über Supabase Auth (Grund oben in `umbau-2026-11-11-backoffice-sportler.sql`).
- **Bezahlen:** nur die Schnittstelle (`uk_partner_seiten_paket.gebucht_bis`). Stripe baut ihr.
- **Basis-Adresse** (später die neutrale Domain) steht an **einer** Stelle: `uk_einstellungen`, Name `seiten_basis`.
  Portal und E-Book lesen sie dort. Die Seiten selbst laufen unter jeder Domain. Domain wechseln heißt also:
  Domain in Netlify dazunehmen, einen Wert in der Datenbank ändern, **kein** Upload.

## Wer kümmert sich um die Anfragen (Jasmin, 11.11.2026)

Daniel und Jasmin legen **je Partner** fest, wer sich bei den Interessenten meldet. Der Partner kann das nicht ändern.

| Einstellung | Wofür | Was passiert |
|---|---|---|
| **Daniel und Jasmin melden sich** (`team`, Standard) | Partner wie Kevin und Johny | Meldung in die Telegram-Gruppe "Leads" wie heute. Die Seite sagt "Wir melden uns bei dir". Der Partner sieht im Portal nur, wie viele Anfragen kamen. |
| **Partner kümmert sich selbst** (`partner`) | Partner, die ihre Leads selbst bearbeiten | Keine Meldung in die Gruppe "Leads". Die Seite sagt "Anna meldet sich bei dir". Der Partner sieht unter "Meine Seiten" jede Anfrage mit Telefon, E-Mail und Knöpfen zum Anrufen, WhatsApp und Mail. |

In beiden Fällen bleibt jede Anfrage für immer beim Partner, über dessen Seite sie kam.

**Anfragen-Bot für Partner, die sich selbst kümmern:** ein eigener Telegram-Bot nur für Anfragen, getrennt vom
Assistenten. Im Portal unter "Meine Seiten" steht der Knopf "Telegram verbinden". Ein Klick öffnet Telegram, der Partner
tippt auf "Starten", fertig. Ab dann kommt jede neue Anfrage sofort als Nachricht, mit Telefon, E-Mail und einem Knopf
"WhatsApp schreiben". Trennen geht im Portal oder im Bot mit /stop. Schreibt der Partner dem Bot etwas, antwortet er,
dass hier nur Anfragen ankommen und der Assistent für alles andere da ist.

**Einstellen:** im Dashboard, Reiter Partner, Partner anklicken, Feld "Anfragen über seine Seiten"
(Ergänzung in `dashboard-ergaenzung/app.js.diff`). Bis das eingespielt ist, im SQL-Editor:

```sql
update uk_partner set leads_bei = 'partner' where kurz = 'anna-beispiel';
```

Gespeichert in der neuen Spalte `uk_partner.leads_bei`. Heiße und warme Anfragen kommen in beiden Fällen wie bisher über
`uk_anfrage` in die Kundenliste, mit dem Kürzel des Partners (dadurch auch in seine Kundenübersicht im Portal).

## Farbwelten: Hell, Dunkel und Akzente (Jasmin, 12.11.2026)

Jede Seite gibt es in zwei Grundtönen und sieben Akzenten:

- **Dunkel:** Anthrazit wie bei Kevin und Johny.
- **Hell:** Creme und Beige, helle Felder mit feiner Kante.
- **Akzente:** Kupfer, Oliv, Salbei, Khaki, Petrol, Blau, Beere. Jeder Akzent ist auf Hell und auf Dunkel gut lesbar
  (Schrift mindestens 4,5 : 1, geprüft).

Der Partner wählt im Portal beim Einrichten unter der Vorschau, **für jede Seite einzeln**: Grundton anklicken, Akzent
anklicken, die Vorschau ändert sich sofort. Wählt er nichts, gilt der Vorschlag: Sport Dunkel und Kupfer, Neutral Hell
und Oliv, Gesundheit Hell und Salbei.

**Eine Stelle für alle Farben:** `website/p/farben.js`. Die Seiten, das Portal und später der Flyer-Editor lesen daraus
(`UKFarben.MODI`, `UKFarben.AKZENTE`, `UKFarben.anwenden(element, modus, akzent)`). Neuer Akzent: dort ergänzen und in
der SQL in `uk_seiten_akzente()`. Gespeichert wird die Wahl in `uk_partner_seiten.aussehen`.

Ausprobieren: `http://localhost:8791/vorschau/farbwelten.html` (alle Kombinationen, Handy und Rechner nebeneinander).

## Was wo liegt

```
baukasten/
  LIESMICH.md              diese Datei
  offene-fragen.md         was ich nicht entscheiden konnte
  bild-prompts.md          Prompts für fehlende Fotos, Liste der übernommenen Fotos
  ueberschriften.md        alle Überschriften und Knöpfe zum Abhaken (Jasmin)
  website/
    _redirects-ergaenzung.txt   5 Zeilen für website/_redirects
    p/                     NEU, kommt so nach website/p/
      neutral.html sport.html gesundheit.html   die drei Seiten
      seiten.css seiten.js                      Gestaltung und Ablauf für alle drei
      farben.js                                  Grundtöne und Akzente, eine Stelle für alle Editoren
      vorschau-daten.js                          Beispieldaten, nur lokal oder mit ?demo geladen
      bilder/                                    Fotos (verkleinert), sport-hero.jpg fehlt noch
      vorschau/ebook-*.pdf                       Beispiel-E-Books, nur für die lokale Vorschau
    partner/               Partnerportal
      seiten.js seiten.css NEU: Ansicht "Meine Seiten"
      partner.js           geändert, alle Stellen mit "BAUKASTEN 11.11.2026" markiert
      index.html           geändert: seiten.css und seiten.js eingebunden
      partner.js.diff index.html.diff   dieselben Änderungen als Diff (gegen den Stand im Paket, partner.js?v=20261111d)
  dashboard-ergaenzung/
    app.js.diff            Feld "Anfragen über seine Seiten" im Partner-Dialog des Dashboards (gegen dashboard/app.js im Projekt)
  supabase/
    umbau-2026-11-11-baukasten.sql   darf mehrfach laufen
    functions/partner-anfragenbot/   NEU: Webhook des Anfragen-Bots (verbinden, trennen)
    functions/partner-lead/          geändert: bei "Partner kümmert sich selbst" keine Gruppenmeldung, sondern Nachricht
                                     über den Anfragen-Bot an den Partner; Zeile "Seite: sport"
                                     (index.ts komplett, index.ts.diff zeigt die drei Stellen)
    functions/partner-ebook/         index.ts und empfohlen.js (gemeinsamer Code mit der lokalen Probe)
    functions/partner-foto/          index.ts
    ebook-schriften/                 Jost und Inter als TTF, vorbereitet für pdf-lib
  vorschau/                nur für die lokale Vorschau, nicht hochladen
    server.py              Mini-Server mit den Weiterleitungen aus _redirects
    start.html portal.html Startseite der Vorschau, Nachbau des Portal-Rahmens
    farbwelten.html        alle Grundtöne und Akzente zum Durchklicken
    portal-stand-2026-11-11.css   unveränderte Kopie von partner/portal.css
    schriften/             Jost und Inter (liegen auf dem Server schon unter /schriften/)
  werkzeuge/ebook-probe.mjs   baut die Beispiel-E-Books mit demselben Code wie die Edge Function
```

## Ansehen (lokal, ohne Datenbank)

Im Ordner `baukasten`:

```bash
python3 vorschau/server.py
```

Dann `http://localhost:8791/` öffnen. Dort sind alle Seiten, die drei Zustände im Portal und die Beispiel-E-Books
verlinkt. Am Handy-Format ansehen (375 px). In der Portal-Vorschau kannst du das Formular wirklich ausfüllen,
ein Foto zuschneiden und speichern. "Vorschau" zeigt danach deine Seite mit diesen Angaben (bleibt im Browser).

## Einspielen, in dieser Reihenfolge

1. **Datenbank:** `supabase/umbau-2026-11-11-baukasten.sql` im SQL-Editor ausführen. Legt die Tabellen
   `uk_partner_seiten`, `uk_partner_seiten_alt`, `uk_partner_seiten_paket`, die Funktionen, die Einstellung
   `seiten_basis` und die Speicher-Buckets `partner-seiten` (öffentlich, Fotos) und `partner-ebooks` (privat) an.
   Am Ende zeigt sie die Seiten von Daniel und Jasmin, falls es Partner mit Kürzel `daniel` und `jasmin` gibt.
2. **Speicher:** Die drei Dateien aus `supabase/ebook-schriften/` nach `partner-ebooks/schriften/` hochladen.
   Sobald die E-Books aus dem Paket E-Books da sind: als `partner-ebooks/vorlagen/ebook-neutral.pdf`,
   `ebook-sport.pdf`, `ebook-gesundheit.pdf`. Bis dahin nimmt die Funktion eine schlichte Platzhalter-Vorlage.
3. **Anfragen-Bot anlegen** (einmal):
   - Bei Telegram mit @BotFather einen neuen Bot anlegen, zum Beispiel "Ursprungskraft Anfragen". Den Namen, der auf
     `bot` endet, notieren, den Schlüssel (Token) kopieren.
   - Schlüssel in den Tresor: `select vault.create_secret('<TOKEN>', 'tg_token_anfragen', 'Anfragen-Bot für Partner');`
   - Namen eintragen: `update uk_einstellungen set wert = '<name_bot>' where name = 'anfragenbot_name';`
     Solange der Name fehlt, steht im Portal "wird gerade eingerichtet" statt des Knopfs.
   - Nach dem Deploy (Schritt 4) den Webhook setzen. Das Geheimnis steht im Tresor unter `tg_webhook_anfragenbot`:
     ```bash
     curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://XXX.supabase.co/functions/v1/partner-anfragenbot&secret_token=<GEHEIMNIS>"
     ```
4. **Edge Functions:**
   ```bash
   supabase functions deploy partner-lead
   ```
   ```bash
   supabase functions deploy partner-anfragenbot --no-verify-jwt
   ```
   ```bash
   supabase functions deploy partner-foto
   ```
   ```bash
   supabase functions deploy partner-ebook --no-verify-jwt
   ```
   `partner-ebook` ohne "Verify JWT", weil der E-Book-Link ohne Schlüssel im Browser aufgeht. Sie gibt nur heraus,
   was die Seite ohnehin zeigt. `partner-foto` und `partner-lead` mit "Verify JWT" wie bisher.
   `partner-lead` erst nach der SQL deployen (sie ruft die neuen Funktionen `uk_partner_lead_zustaendig` und
   `uk_anfragenbot_ziel`). `partner-anfragenbot` ohne "Verify JWT", weil Telegram keinen Schlüssel schickt, sie prüft
   stattdessen das Webhook-Geheimnis.
5. **Schlüssel eintragen:** `XXX` in `website/p/seiten.js` (Supabase-Adresse und öffentlicher Schlüssel, derselbe wie in
   `dashboard/daten.js`) und in `website/_redirects-ergaenzung.txt` (Projektkennung). `partner.js` hat sie schon.
6. **Website:** `website/p/` in die Website legen (ohne `vorschau/`, die PDFs dort sind nur für die lokale Vorschau),
   die fünf Zeilen aus `_redirects-ergaenzung.txt` in `website/_redirects` vor eine allgemeine Regel wie `/*`.
   Im Partnerportal `seiten.js` und `seiten.css` dazulegen, `partner.js` und `index.html` ersetzen. Hat sich
   `partner.js` seit dem Paket geändert, die Diffs nehmen oder die markierten Stellen von Hand übertragen.
7. **Dashboard:** die zwei Zeilen aus `dashboard-ergaenzung/app.js.diff` in `website/dashboard/app.js` übernehmen.
   Das Dashboard speichert die Spalte `leads_bei` dann von selbst mit.
8. **Ein Upload** für alles. Danach braucht kein Partner mehr einen Upload.
9. **Paket freischalten** (bis Stripe kommt), im SQL-Editor:
   ```sql
   select uk_seiten_paket_setzen('anna-beispiel', current_date + 31);
   ```
   Nur bestimmte Fassungen: `select uk_seiten_paket_setzen('anna-beispiel', current_date + 31, '{sport}');`
10. **Später neutrale Domain:** in Netlify als weitere Domain eintragen, dann
   `update uk_einstellungen set wert = 'https://neue-domain.de' where name = 'seiten_basis';`

## Prüfen, bevor es online geht

- [ ] `select uk_seite_oeffentlich('daniel-zuercher', 'neutral');` liefert Name und Fassung, aber **kein** Telefon und
      keine E-Mail, solange "zeigen" nicht angehakt ist.
- [ ] Mit dem öffentlichen Schlüssel lässt sich `uk_partner_seiten` nicht direkt lesen (REST-Abfrage auf die Tabelle
      liefert nichts oder einen Fehler). Nur die Funktionen geben etwas heraus.
- [ ] `/p/daniel-zuercher/neutral` zeigt Daniels Seite, `/p/daniel-zuercher/gesundheit` leitet auf seine erste Fassung um,
      `/p/gibt-es-nicht/sport` zeigt "Diese Seite gibt es gerade nicht".
- [ ] Testanfrage über eine Partnerseite: Zeile in `uk_partner_leads` mit `herkunft` = Kürzel des Partners,
      `antworten->>'fassung'` gesetzt, Meldung in der Gruppe "Leads".
- [ ] Anfragen-Bot: Im Portal "Telegram verbinden", in Telegram "Starten", Begrüßung kommt, im Portal steht
      "Verbunden". Testanfrage kommt als Nachricht mit WhatsApp-Knopf. /stop trennt.
- [ ] Partner auf "kümmert sich selbst" stellen, Testanfrage: keine Meldung in der Gruppe "Leads", die Anfrage steht
      bei ihm unter "Meine Seiten" mit Kontakt. Bei "Daniel und Jasmin" umgekehrt, und er sieht dort keine Kontakte.
- [ ] Im Portal: Formular speichern, Foto hochladen (landet in `partner-seiten/<partner_id>/`, das alte wird gelöscht),
      Adresse ändern (alter Link leitet weiter), Zahlen je Fassung stimmen.
- [ ] `/p/<adresse>/sport/e-book` öffnet das PDF, Seite 2 ist "Empfohlen von" mit Foto und Link.
- [ ] Alle drei Seiten am Handy (375 px) ohne seitliches Scrollen, Formulare abschicken.
- [ ] Im Portal für eine Seite Hell und einen Akzent wählen, speichern: die echte Seite zeigt es, die anderen Seiten
      behalten ihren Vorschlag.
- [ ] Jasmin hat `ueberschriften.md` abgehakt und `offene-fragen.md` beantwortet.
- [ ] Datenschutzerklärung passt für Partnerseiten (siehe offene Frage 11).

## Was ich getestet habe

- SQL in einer lokalen Postgres 16 mit nachgebauten Supabase-Teilen (Rollen, Tresor, Speicher), zusammen mit
  `10-31b-partnerportal` und `11-06-partner-leads`: läuft fehlerfrei und zweimal hintereinander. Geprüft: Vorschlag der
  Adresse ("Änne Sophie Groß-Weiß" wird `aenne-sophie-gross-weiss`), Sperre ohne Paket, Prüfung der Adresse (vergeben,
  reserviert, Form), Speichern mit Instagram-Link, Umleitung auf vorhandene Fassung, Umbenennen mit Weiterleitung der
  alten Adresse, Telefon nur mit Freigabe, Zählung der Leads je Fassung, Rechte (anon kommt nicht an die Tabelle und
  nicht an die Foto-Funktionen).
- Seiten und Portal mit Playwright (Chromium) bei 1440 und 375 px: kein seitliches Scrollen, keine Fehler im Browser.
  Abläufe: Foto wählen und zuschneiden, Formular speichern, Live-Vorschau beim Tippen, Lead-Formular mit Prüfungen,
  E-Book-Formular, drei Rechner, unbekannte Adresse, Umleitung auf vorhandene Fassung.
- Farbwelten: SQL (Speichern, ungültige Werte werden verworfen, je Fassung an die Seite), Editor im Portal
  (Umschalten, Vorschau, Speichern, echte Seite zeigt die Wahl), alle sieben Akzente auf Hell und Dunkel als Bild geprüft.
- Das geänderte `partner.js` mit nachgebauten Portal-Daten: `#seiten`, `#seiten/info`, Tools und Mehr-Menü laufen.
- "Wer kümmert sich": SQL (Spalte, Prüfung auf erlaubte Werte, `uk_partner_lead_zustaendig`, Kontakte nur bei `partner`),
  Seiten ("Max meldet sich" und "Wir melden uns"), Portal mit Anfrageliste und mit Hinweis.
- E-Book: `empfohlen.js` mit pdf-lib unter Node, Ergebnis als Bild geprüft (Seite 2 der Beispiel-PDFs).
- **Nicht getestet:** die drei Edge Functions unter Deno und Supabase, die Dashboard-Ergänzung im echten Dashboard (kein Zugang), die Weiterleitung an die
  Edge Function über Netlify, das echte Hochladen in den Speicher.

## Bewusst nicht gebaut

- Stripe (Schnittstelle steht, siehe Schritt 9).

## Hinweise für das Einspielen

- `uk_partner_lead_speichern` setzt `partner_id` nur, wenn der Partner `aktiv = true` hat. Sonst hängt der Lead
  trotzdem über `herkunft` (Kürzel) am Partner und wird überall gefunden. Bei der Freigabe trotzdem `aktiv` prüfen.
- Gefunden, nicht geändert: In `uk_partner_registrieren` (10-31b) ist `translate(..., 'äöüßéèàç ', 'aousseeac-')`
  um ein Zeichen verschoben. Folge: "é" wird "s", ein Leerzeichen "c" ("Anna Lena" ergibt "annaclena"). Die neuen Seiten
  bauen ihre Adresse selbst und richtig ("ä" wird "ae").
- Gestaltung (zweite Fassung, Jasmin 11.11.2026): `website/p/seiten.css` ist Kevins `partner/empfehlung.css`
  (Anthrazit, große Felder, Pillen-Knöpfe, Effekte) plus Ergänzungen am Ende. Akzent je Fassung: Sport Kupfer wie Kevin,
  Neutral Oliv, Gesundheit Salbeigrün. Ändert ihr `empfehlung.css`, den oberen Teil von `seiten.css` mitziehen.
- Das E-Book-Formular auf den Seiten hat einen Einwilligungs-Haken (bei Kevin fehlt er).
- `partner-ebook` baut die PDF bei jedem Abruf neu (Sekundenbruchteile, der Browser hält sie eine Stunde).

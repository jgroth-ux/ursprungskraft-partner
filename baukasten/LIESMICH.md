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

**Einstellen:** im Dashboard, Reiter Partner, Partner anklicken, Feld "Anfragen über seine Seiten"
(Ergänzung in `dashboard-ergaenzung/app.js.diff`). Bis das eingespielt ist, im SQL-Editor:

```sql
update uk_partner set leads_bei = 'partner' where kurz = 'anna-beispiel';
```

Gespeichert in der neuen Spalte `uk_partner.leads_bei`. Heiße und warme Anfragen kommen in beiden Fällen wie bisher über
`uk_anfrage` in die Kundenliste, mit dem Kürzel des Partners (dadurch auch in seine Kundenübersicht im Portal).

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
    functions/partner-lead/          geändert: keine Gruppenmeldung bei "Partner kümmert sich selbst", Zeile "Seite: sport"
                                     (index.ts komplett, index.ts.diff zeigt die drei Stellen)
    functions/partner-ebook/         index.ts und empfohlen.js (gemeinsamer Code mit der lokalen Probe)
    functions/partner-foto/          index.ts
    ebook-schriften/                 Jost und Inter als TTF, vorbereitet für pdf-lib
  vorschau/                nur für die lokale Vorschau, nicht hochladen
    server.py              Mini-Server mit den Weiterleitungen aus _redirects
    start.html portal.html Startseite der Vorschau, Nachbau des Portal-Rahmens
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
3. **Edge Functions:**
   ```bash
   supabase functions deploy partner-lead
   ```
   ```bash
   supabase functions deploy partner-foto
   ```
   ```bash
   supabase functions deploy partner-ebook --no-verify-jwt
   ```
   `partner-ebook` ohne "Verify JWT", weil der E-Book-Link ohne Schlüssel im Browser aufgeht. Sie gibt nur heraus,
   was die Seite ohnehin zeigt. `partner-foto` und `partner-lead` mit "Verify JWT" wie bisher.
   `partner-lead` erst nach der SQL deployen (sie ruft die neue Funktion `uk_partner_lead_zustaendig`).
4. **Schlüssel eintragen:** `XXX` in `website/p/seiten.js` (Supabase-Adresse und öffentlicher Schlüssel, derselbe wie in
   `dashboard/daten.js`) und in `website/_redirects-ergaenzung.txt` (Projektkennung). `partner.js` hat sie schon.
5. **Website:** `website/p/` in die Website legen (ohne `vorschau/`, die PDFs dort sind nur für die lokale Vorschau),
   die fünf Zeilen aus `_redirects-ergaenzung.txt` in `website/_redirects` vor eine allgemeine Regel wie `/*`.
   Im Partnerportal `seiten.js` und `seiten.css` dazulegen, `partner.js` und `index.html` ersetzen. Hat sich
   `partner.js` seit dem Paket geändert, die Diffs nehmen oder die markierten Stellen von Hand übertragen.
6. **Dashboard:** die zwei Zeilen aus `dashboard-ergaenzung/app.js.diff` in `website/dashboard/app.js` übernehmen.
   Das Dashboard speichert die Spalte `leads_bei` dann von selbst mit.
7. **Ein Upload** für alles. Danach braucht kein Partner mehr einen Upload.
8. **Paket freischalten** (bis Stripe kommt), im SQL-Editor:
   ```sql
   select uk_seiten_paket_setzen('anna-beispiel', current_date + 31);
   ```
   Nur bestimmte Fassungen: `select uk_seiten_paket_setzen('anna-beispiel', current_date + 31, '{sport}');`
9. **Später neutrale Domain:** in Netlify als weitere Domain eintragen, dann
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
- [ ] Partner auf "kümmert sich selbst" stellen, Testanfrage: keine Meldung in der Gruppe "Leads", die Anfrage steht
      bei ihm unter "Meine Seiten" mit Kontakt. Bei "Daniel und Jasmin" umgekehrt, und er sieht dort keine Kontakte.
- [ ] Im Portal: Formular speichern, Foto hochladen (landet in `partner-seiten/<partner_id>/`, das alte wird gelöscht),
      Adresse ändern (alter Link leitet weiter), Zahlen je Fassung stimmen.
- [ ] `/p/<adresse>/sport/e-book` öffnet das PDF, Seite 2 ist "Empfohlen von" mit Foto und Link.
- [ ] Alle drei Seiten am Handy (375 px) ohne seitliches Scrollen, Formulare abschicken.
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
- Das geänderte `partner.js` mit nachgebauten Portal-Daten: `#seiten`, `#seiten/info`, Tools und Mehr-Menü laufen.
- "Wer kümmert sich": SQL (Spalte, Prüfung auf erlaubte Werte, `uk_partner_lead_zustaendig`, Kontakte nur bei `partner`),
  Seiten ("Max meldet sich" und "Wir melden uns"), Portal mit Anfrageliste und mit Hinweis.
- E-Book: `empfohlen.js` mit pdf-lib unter Node, Ergebnis als Bild geprüft (Seite 2 der Beispiel-PDFs).
- **Nicht getestet:** die drei Edge Functions unter Deno und Supabase, die Dashboard-Ergänzung im echten Dashboard (kein Zugang), die Weiterleitung an die
  Edge Function über Netlify, das echte Hochladen in den Speicher.

## Bewusst nicht gebaut

- Stripe (Schnittstelle steht, siehe Schritt 8).
- Nachricht aufs Handy an Partner, die sich selbst kümmern (offene Frage 10). Sie sehen ihre Anfragen im Portal.

## Hinweise für das Einspielen

- `uk_partner_lead_speichern` setzt `partner_id` nur, wenn der Partner `aktiv = true` hat. Sonst hängt der Lead
  trotzdem über `herkunft` (Kürzel) am Partner und wird überall gefunden. Bei der Freigabe trotzdem `aktiv` prüfen.
- Gefunden, nicht geändert: In `uk_partner_registrieren` (10-31b) ist `translate(..., 'äöüßéèàç ', 'aousseeac-')`
  um ein Zeichen verschoben. Folge: "é" wird "s", ein Leerzeichen "c" ("Anna Lena" ergibt "annaclena"). Die neuen Seiten
  bauen ihre Adresse selbst und richtig ("ä" wird "ae").
- Gestaltung: Die Ecken folgen der CI (Knöpfe 4 px, Karten 8 px), runder als bei Kevin geht an einer Stelle in
  `website/p/seiten.css` (`--r`, `--r-klein`). Die Sportseite ist dunkel in Olive tief statt Anthrazit.
- Das E-Book-Formular auf den Seiten hat einen Einwilligungs-Haken (bei Kevin fehlt er).
- `partner-ebook` baut die PDF bei jedem Abruf neu (Sekundenbruchteile, der Browser hält sie eine Stunde).

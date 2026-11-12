# Übergabe an den Claude, der einspielt

Stand 12.11.2026. Antwort auf den Auftrag `AUFTRAG.md` aus dem Paket `an-zweiter-claude-baukasten-2026-11-11.zip`
(Baukasten Partnerseiten, Paket "Eigene Seite").

**Stand:** Alles ist lokal gebaut und mit Beispieldaten getestet. **Nichts ist hochgeladen, nichts deployt, keine
echten Schlüssel** (überall `XXX`). Jasmin hat aus diesem Chat noch nichts an dich weitergegeben. Das hier ist alles.

**Bitte zuerst lesen:**
1. diese Datei (was gebaut ist und was Jasmin unterwegs entschieden hat),
2. `LIESMICH.md` (Einspielen Schritt für Schritt, Prüfliste, was getestet ist),
3. `offene-fragen.md` (12 Fragen an Jasmin, jede mit Vorgabe, keine hält das Einspielen auf).

**Hinweis zu Jasmin:** Sie fand die technischen Fragen schwer verständlich. Bitte die offenen Fragen einzeln, in ganz
einfachen Worten und mit Bild oder Vorschau durchgehen, nicht als Liste schicken.

---

## Was gebaut ist

| Teil | Wo | Kurz |
|---|---|---|
| Datenbank | `supabase/umbau-2026-11-11-baukasten.sql` | Darf mehrfach laufen. Tabellen, Funktionen, Speicher-Buckets, Einstellung `seiten_basis` = `https://wasseristmehr.com`, Beispielseiten Daniel und Jasmin, Eintrag für die Startseite |
| Drei Partnerseiten | `website/p/neutral.html`, `sport.html`, `gesundheit.html` | Eine Datei für alle Partner, Angaben kommen beim Aufruf aus der Datenbank. Gestaltung wie Kevins und Johnys Seiten |
| Startseite | `website/p/start.html` | `wasseristmehr.com` allein: neutral, ohne Person, "Wasser ist mehr" |
| Gestaltung | `website/p/seiten.css`, `farben.js` | Hell und Dunkel, 7 Akzente, 3 Anordnungen (Felder, Magazin, Bühne). `farben.js` ist die eine Stelle für alle Farben, auch für einen späteren Flyer-Editor |
| Ablauf der Seiten | `website/p/seiten.js` | Adresse lesen, Angaben holen, Formulare an `partner-lead`, Rechner, Effekte |
| Weiterleitungen | `website/_redirects-ergaenzung.txt` | Alle Zeilen ganz oben in `website/_redirects` |
| Partnerportal | `website/partner/seiten.js`, `seiten.css`, Änderungen in `partner.js` und `index.html` (+ `.diff`) | Ansicht "Meine Seiten": gesperrt mit Beispielen, Info-Seite, Formular mit Foto-Zuschnitt und Live-Vorschau, Look-Editor, Übersicht mit Links, E-Book-Wahl, Anfragen, Anfragen-Bot, E-Book-Bibliothek |
| Dashboard | `dashboard-ergaenzung/app.js.diff` | Auswahl "Anfragen über seine Seiten: Team oder Partner selbst" |
| Edge Functions | `supabase/functions/partner-ebook`, `partner-foto`, `partner-lead` (geändert, + `.diff`), `partner-anfragenbot` (neu) | E-Book als PDF beim Abruf, Foto-Upload, Leads, Telegram-Bot für Partner |
| E-Books | `ebooks/` (Inhalt, Vorlage), `werkzeuge/ebooks-bauen.mjs`, `ausgabe/vorlagen/` | 9 Bücher, je 3 zu Neutral, Sport, Gesundheit, in jedem Look baubar. Im Paket nur die 9 Standard-Looks, alle 126 baut `node ebooks-bauen.mjs --alle` |
| Schriften für E-Books | `supabase/ebook-schriften/` | Bereinigt, damit pdf-lib sie sauber einbettet |
| Vorschau | `vorschau/server.py` | `python3 vorschau/server.py`, dann `http://localhost:8791/`. Alles anklickbar, ohne Datenbank |
| Texte | `ueberschriften.md`, `bild-prompts.md` | Überschriften zum Abhaken, Prompts für fehlende Fotos |
| Bilder zum Ansehen | `startseite-wasseristmehr.jpg`, `drei-seiten-komplett.jpg`, `drei-aufbauten.png`, `farbwelten-beispiele.png`, `ebooks-beispiel.png`, `ebooks-neues-cover.jpg` | Für Gespräche mit Jasmin |

---

## Was Jasmin unterwegs entschieden hat (in dieser Reihenfolge)

1. **Wer meldet sich bei Interessenten?** Legen Daniel und Jasmin je Partner fest (`uk_partner.leads_bei`):
   `team` (wie bei Kevin und Johny, Meldung in die Gruppe "Leads") oder `partner` (er macht es selbst, sieht seine
   Anfragen im Portal mit Kontakt). Einstellbar im Dashboard.
2. **Eigener Anfragen-Bot** für Partner, die sich selbst kümmern: mit einem Klick im Portal verbinden. Bewusst getrennt
   vom Assistenten-Bot.
3. **Die allgemeine Ursprungskraft-Landingpage** von Daniel und Jasmin bleibt, wie sie ist. Nicht anfassen.
4. **Aussehen wie Kevin und Johny** (die erste Fassung war ihr zu "lahm"). Darum ist `seiten.css` Kevins
   `empfehlung.css` mit Ergänzungen.
5. **Hell und Dunkel mit Akzentfarben** als kleiner Editor im Portal (Creme, Beige, Oliv). Dazu zwei weitere
   Anordnungen (Magazin, Bühne). Wählbar je Seite.
6. **E-Books passend zur Seite:** je Thema 3 Bücher, im Look der Seite des Partners. Lead-Magnet mit Brücke zum Gerät.
   Das Thema "21 Tage besser trinken" hat sie verworfen, ersetzt durch "Was steckt in deinem Wasser?".
7. **E-Book-Cover neutral**, innen kleines rundes Foto, "Empfohlen von" und "Warum ich dir das empfehle". Den Text
   schreibt der Partner oder nimmt eine Vorlage.
8. **Kein Cookie-Banner** nötig. **Kein E-Mail-Postfach** kaufen.
9. **Domain wasseristmehr.com** (gesichert bei IONOS).
10. **Kurze Links:** `wasseristmehr.com/kevin`, "nicht Sport oder irgendwas". Hat ein Partner mehrere Seiten, wählt er
    im Portal die Hauptseite. Die anderen: `/kevin/sport`. Die alte Form `/p/kevin/sport` geht weiterhin.
11. **Startseite** `wasseristmehr.com`: neutral, ohne Person, mit "Wasser ist mehr" und "Wasser, das unterschätzte
    Supplement". Anfragen an das Team.
12. **Nichts bei Google.** Alle Seiten und E-Books haben die Sperre (`noindex`), weil alles nur gezielt weitergegeben
    wird. Überlegung für später: nur die Startseite öffentlich, dann vorher Impressum und Datenschutz prüfen lassen.
13. **Stripe** bauen Daniel und Jasmin selbst. Hier gibt es nur `uk_seiten_paket_setzen()` und "gebucht bis".

---

## Einspielen

Genau nach `LIESMICH.md`, Abschnitt "Einspielen, in dieser Reihenfolge". Kurz:
0. Domain wasseristmehr.com mit Netlify verbinden (DNS bei IONOS lassen).
1. SQL ausführen. 2. Schriften und E-Book-Vorlagen in den Speicher. 3. Anfragen-Bot bei Telegram anlegen.
4. Edge Functions deployen (zwei davon mit `--no-verify-jwt`). 5. `XXX` durch echte Werte ersetzen.
6. Website-Dateien und `_redirects`. 7. Dashboard-Ergänzung. 8. Ein Upload. 9. Paket für einen Testpartner freischalten.
Danach die Prüfliste in `LIESMICH.md` abarbeiten.

## Bitte zuerst prüfen (lokal nicht testbar)

- **Netlify-Regeln mit Domain vorne** (`https://wasseristmehr.com/:adresse  /p/neutral.html  200`). So vorgesehen,
  aber nicht ausprobiert. Klappt es nicht: kleine Netlify Edge Function für den Host wasseristmehr.com.
- **Edge Functions** unter Deno und Supabase. Geprüft ist nur die Syntax, `fuellen.js` (E-Book) lief unter Node.
- **Proxy auf `partner-ebook`** über Netlify, **Upload in den Speicher**, **Dashboard-Ergänzung** im echten Dashboard.
- **Fotos vom Server:** Die Seiten nutzen Bilder aus `/bilder/partner/` (wie Kevins Seiten). Prüfen, dass sie dort liegen.
- Hat sich `partner.js` seit dem Auftrag geändert, die Diffs nehmen statt die Datei zu ersetzen.

## Gefunden, nicht geändert

- `uk_partner_registrieren` (10-31b): `translate` ist um ein Zeichen verschoben ("Anna Lena" ergibt "annaclena").
  Die neuen Seiten bauen ihre Adresse selbst richtig. Details in `LIESMICH.md`, "Hinweise für das Einspielen".

## Nächster Schritt danach (noch nicht gebaut, wartet auf Jasmin)

E-Mail-Teil: E-Book per Mail mit Bestätigungsklick (Double-Opt-In), danach eine kurze Mailstrecke im Look der Seite
des Partners. Wartet auf die Wahl des E-Mail-Dienstes (offene Frage 10).

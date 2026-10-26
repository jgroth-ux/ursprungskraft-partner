# Einbau: Bestell-Bot mit Rückfragen

Stand 26.10.2026. Für das Hauptsystem (Supabase-Projekt `ngcbmpuqcqbelfoelwby`).
Grundlage: `an-zweiter-claude-bestellbot/AUFTRAG.md` und die Dateien in `vorhanden/`.
Baut auf `umbau-2026-10-24-bestellung-ergaenzungen.sql` auf. Keine echten Schlüssel im Paket, `XXX` bleibt `XXX`.

## Was im Ordner ist

| Datei | Was |
|---|---|
| `supabase/umbau-2026-10-26-bestellbot-rueckfragen.sql` | Bestellnummer, Tabellen für den Gesprächszustand, Einstellungen, Webhook-Geheimnis, neuer Trigger `uk_bestellung_melden`, Funktion zum Webhook setzen. Darf mehrfach laufen. |
| `supabase/functions/bestellbot/index.ts` | Edge Function: Telegram-Webhook, Ablauf, PDFs ausfüllen, Mail. |
| `test/ablauf-test.ts` | Optional: Test des Ablaufs ohne Datenbank, mit den echten Formularen (siehe unten). |

## Schritt 1: SQL ausführen

Im SQL-Editor `supabase/umbau-2026-10-26-bestellbot-rueckfragen.sql` komplett ausführen.
Am Ende kommt eine Zeile wie `bot_eintraege 3 · letzte_nummer 1012 · webhook_geheimnis 1`.

Was passiert:
- `uk_bestellungen.nummer`: kurze Bestellnummer ab 1001, alte Bestellungen bekommen auch eine. Neue Spalte `mail_sponsor` (wann die Unterlagen-Mail raus ist).
- Neue Tabellen `uk_bestellbot` (Schritt je Bestellung), `uk_bestellbot_chat` (welche Bestellung im Chat auf eine Antwort wartet), `uk_bestellbot_updates` (jedes Telegram-Update nur einmal). RLS an, keine Policies: nur Trigger und Edge Function kommen ran.
- Einstellungen in `uk_einstellungen`: `mail_enagic_daniel` (`XXX`), `mail_enagic_gmbh`, `mail_enagic_jasmin` (leer), `mail_enagic_andere` (leer = wie Daniel), `mail_enagic_ziel` (nur für den Text), `bestellbot_testmail` (leer).
- Im Tresor: `tg_webhook_bestellbot` (zufälliges Geheimnis für den Webhook, wird nur einmal erzeugt).
- `uk_bestellbot_geheim()`: liefert Bot-Schlüssel und Webhook-Geheimnis, nur für `service_role`.
- `uk_bestellung_melden()` neu: Nachricht mit Nummer, Eingangszeit, Name, PLZ Ort, Land, Produkten, Zahlung, Link. Daniel bekommt sie über den Bestell-Bot mit Knöpfen, Jasmin zur Info. Der Satz „bitte im Dashboard festlegen“ ist raus (bleibt nur, solange `bestellbot_daniel = 'nein'`).

## Schritt 2: Daniels Mail-Adresse eintragen

```sql
update uk_einstellungen set wert = 'DANIELS-HOTMAIL-ADRESSE' where name = 'mail_enagic_daniel';
```
Solange dort `XXX` steht, schickt der Bot für Daniel und „Jemand anderes“ nichts und sagt das im Chat.

## Schritt 3: Formulare in den Speicher legen

Die vier PDFs aus `vorhanden/dashboard/formulare/` in den Bucket `bestellungen` hochladen, Ordner `formulare/`:
`formulare/bestellformular.pdf`, `formulare/ratenzahlungsantrag.pdf`, `formulare/distributorenvertrag.pdf`, `formulare/non-eu.pdf`
(Supabase, Storage, Bucket `bestellungen`, Ordner `formulare` anlegen, Dateien hineinziehen.)

Sponsor-Unterschriften liegen schon dort, wo das Dashboard sie speichert: `sponsor/daniel.png`, `sponsor/gmbh.png`, `sponsor/jasmin.png`.
Fehlt eine, macht der Bot das PDF ohne Sponsor-Unterschrift und sagt es im Chat.

## Schritt 4: Edge Function deployen

```bash
supabase functions deploy bestellbot --no-verify-jwt --project-ref ngcbmpuqcqbelfoelwby
```
`--no-verify-jwt` ist nötig, weil Telegram kein JWT schickt. Abgesichert ist der Aufruf über das `secret_token` des Webhooks.
Wer über `config.toml` deployt:
```toml
[functions.bestellbot]
verify_jwt = false
```

**Secrets (Edge Functions, Secrets):**
- `IONOS_PASSWORT`: gibt es schon für `mail-senden`, gilt für alle Functions. Nichts zu tun.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: setzt Supabase selbst.
- Bot-Schlüssel und Webhook-Geheimnis: **keine** Secrets nötig, die Function liest sie über `uk_bestellbot_geheim()` aus dem Tresor.

## Schritt 5: Webhook setzen (per SQL, niemand tippt den Schlüssel ab)

Vorher prüfen: Holt irgendein anderes Programm die Nachrichten des Bestell-Bots mit `getUpdates` ab? Dann funktioniert das nach dem Webhook nicht mehr.

```sql
select uk_bestellbot_webhook_setzen();
-- ein paar Sekunden warten, dann:
select status_code, content::text from net._http_response order by id desc limit 1;
```
Erwartet: `200` und `{"ok":true,"result":true,"description":"Webhook was set"}`.

Kontrolle, ob Telegram den Webhook erreicht:
```sql
select net.http_get('https://api.telegram.org/bot' || (uk_bestellbot_geheim()->>'token') || '/getWebhookInfo');
select content::text from net._http_response order by id desc limit 1;
```
`url` muss `.../functions/v1/bestellbot` sein, `last_error_message` leer.

## Schritt 6: Für Daniel einschalten

1. Daniel öffnet `@Ursprungskraft_Bestellungen_Bot` und tippt auf **Start**. Ohne das darf der Bot ihm nicht schreiben.
   Der Bot antwortet mit „Hallo! Hier kommen neue Bestellungen an.“
2. Prüfen, dass `tg_chat_daniel` Daniels Chat-ID ist (bei Telegram ist das je Person dieselbe Zahl für alle Bots).
3. Einschalten:
```sql
update uk_einstellungen set wert = 'ja' where name = 'bestellbot_daniel';
```
Nur die Chats in `tg_chat_daniel` und `tg_chat_jasmin` dürfen den Bot bedienen. Alle anderen bekommen „Dieser Bot ist nur für Daniel und Jasmin.“

## Schritt 7: Testablauf (nur Jasmin, Mail nur an eine Testadresse)

Ziel: eine Bestellung, deren Rückfragen bei Jasmin landen und deren Mails nur an eine Testadresse gehen. Daniel und Enagic merken nichts.

```sql
-- 1. Testbetrieb an: ALLE Mails des Bots gehen nur an diese Adresse, ohne Kopie an info@
update uk_einstellungen set wert = 'TESTADRESSE@example.com' where name = 'bestellbot_testmail';

-- 2. Rückfragen vorübergehend an Jasmin: Daniels Chat-ID merken und durch Jasmins ersetzen
create table if not exists uk_test_merken as select name, wert from uk_einstellungen where name = 'tg_chat_daniel';
update uk_einstellungen set wert = (select wert from uk_einstellungen where name = 'tg_chat_jasmin') where name = 'tg_chat_daniel';
update uk_einstellungen set wert = 'ja' where name = 'bestellbot_daniel';
```
3. Im Bucket `bestellungen` irgendeine PNG-Unterschrift als `eingang/test/unterschrift.png` hochladen.
4. Testbestellung anlegen. **E-Mail = Testadresse**, weil der vorhandene Trigger `uk_bestellung_mail` dem Kunden automatisch eine Bestätigung schickt:
```sql
insert into uk_bestellungen (von, daten, dateien, notiz) values (null,
  '{"vorname":"Test","nachname":"Bestellbot","geburtsdatum":"1980-01-01","strasse":"Teststraße 1","plz":"10115","ort":"Berlin",
    "land":"Deutschland","land_kurz":"DE","handy":"+49 170 0000000","email":"TESTADRESSE@example.com","als":"Verbraucher",
    "zahlung":"ueberweisung","k8":"ja","nicht_eu":false}',
  '{"unterschrift":"eingang/test/unterschrift.png"}', 'TEST Bestellbot');
```
5. Jasmin bekommt zwei Nachrichten: die Info und die mit den Knöpfen. In der mit Knöpfen auf **Daniel** tippen.
6. Bot fragt „Welche Linie? Bitte die Zahl schicken.“ → `1` schicken.
7. Erwartet: „Fertig. Die Mail für Enagic liegt im Postfach von TESTADRESSE@example.com (Testadresse). ...“ mit Beträgen und Anhängen.
   In der Testadresse: Betreff `[TEST] NEW Sale Leveluk K8 from Germany`, Text für Enagic, PDF im Anhang.
8. Auch prüfen: noch einmal `1` schicken → keine zweite Mail. Ein alter Knopf → „ist schon erledigt“.
9. Optional „Jemand anderes“: zweite Testbestellung wie in 4, dann Knopf **Jemand anderes**, Name, ID (nur Ziffern), Mail, Linie.

Aufräumen:
```sql
delete from uk_bestellungen where notiz = 'TEST Bestellbot';   -- löscht den Bot-Zustand mit
update uk_einstellungen set wert = (select wert from uk_test_merken) where name = 'tg_chat_daniel';
drop table uk_test_merken;
update uk_einstellungen set wert = '' where name = 'bestellbot_testmail';
```
Im Bucket den Ordner `<id der Testbestellung>/` und `eingang/test/` löschen.
Erst danach `bestellbot_daniel = 'ja'` lassen, wenn Daniel Start gedrückt hat (Schritt 6).

## So läuft es danach

1. Bestellung kommt rein → Daniel: Nachricht mit Nummer und Knöpfen Daniel · Ursprungskraft GmbH · Jasmin · Jemand anderes. Jasmin: dieselbe Nachricht zur Info.
   - Über Jasmins Link: Jasmin ist gesetzt, Daniel wird direkt nach der Linie gefragt. Hat Jasmin noch keine Sponsor-ID, sagt der Bot das und bietet die anderen drei an.
   - Ohne K8: nur „Ohne K8 bestellt, bitte persönlich klären.“
2. Jemand anderes: Name, Sponsor-ID, E-Mail nacheinander.
3. Linie als Zahl. Kommen zwei Bestellungen gleichzeitig: Daniel kann in Telegram auf die Frage der richtigen Bestellung **antworten** (wischen), sonst gilt die zuletzt gefragte. Wartet nur eine, ist die gemeint. Nach jedem Abschluss erinnert der Bot an weitere offene mit Knopf „Jetzt weitermachen“. `/offen` zeigt alle offenen.
4. Formulare werden ausgefüllt wie im Dashboard (gleiche Felder, Koordinaten, Beträge: Preis 4.600, MwSt 874 bei DE, Versand je Land), abgelegt unter `<bestellung-id>/...pdf`.
5. Mail an die Sponsor-Adresse aus den Einstellungen, mit allen PDFs und Ausweisfotos (und Zahlungsbeleg, falls hochgeladen). Betreff `NEW Sale Leveluk K8 from <Land>`, Text genau der für Enagic, damit Daniel nur weiterleitet an goc.eu@enagic.com.
6. In `uk_bestellungen`: `sponsor`, `linie`, `angaben`, `pdfs`, `status = 'Vertrag fertig'`, `mail_sponsor`. Bei „Jemand anderes“ ist `sponsor = 'andere'`, Name, ID und Mail stehen in `angaben.sponsor_name/_id/_email`.

## Später: direkt an Enagic senden

Nur die Einstellungen ändern, nicht den Code. Achtung: Dann fehlt die Prüfung durch Daniel.

## Optional: Ablauf-Test ohne Datenbank

`test/ablauf-test.ts` spielt fünf Fälle durch (Daniel mit Testadresse und Doppelklick, CH Raten Distributor mit Ausweis, Jemand anderes mit Falscheingaben, Jasmin ohne ID plus zwei Bestellungen gleichzeitig plus ohne K8, fehlende Adresse). Nichts wird verschickt.
```bash
cd test && BESTELLBOT_TEST=1 deno run -A ablauf-test.ts
```
Er erwartet die Formulare unter `../../an-zweiter-claude-bestellbot/vorhanden/dashboard/formulare/` (Pfad oben in der Datei anpassen) und schreibt Beispiel-PDFs `t1.pdf`, `t2a.pdf`, `t2b.pdf`.

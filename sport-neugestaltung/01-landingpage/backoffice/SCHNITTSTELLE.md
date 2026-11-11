# Schnittstelle Backoffice: was die Datenquelle liefern muss

Für den Claude, der das Backoffice an Supabase und die Leads (Telegram-Bot, Funktion `partner-lead`) anbindet.
Die Oberfläche ist fertig und spricht nur mit `window.BO_QUELLE`. Die Vorschau nutzt `quelle-vorschau.js`,
der Echtbetrieb `quelle-supabase.js`. Diese Datei ist vorbereitet, aber **nicht getestet**, weil Schema, Funktionen
und Schlüssel nicht in meinem Paket lagen. Alles hier ist ein Vorschlag, die Namen dürfen sich ändern,
solange `quelle-supabase.js` passend angepasst wird.

## Funktionen von `BO_QUELLE`

| Funktion | Rückgabe | Hinweis |
|---|---|---|
| `vorschau` | `true` oder `false` | bei `true` zeigt die Seite den Vorschau-Hinweis und die Partnerwahl |
| `linkArt()` | `'einladung'`, `'zuruecksetzen'` oder `null` | aus dem Link der Mail (`#type=invite` bzw. `#type=recovery`) |
| `sitzung()` | `{ kurz }` oder `null` | ist schon jemand angemeldet? `kurz` = Schlüssel in `konfig-*.js` unter `partner` |
| `anmelden(email, passwort)` | `{ kurz }` | wirft einen Fehler mit verständlicher deutscher Meldung |
| `abmelden()` | nichts | |
| `passwortVergessen(email)` | nichts | schickt den Link, Weiterleitung auf die Backoffice-Adresse |
| `passwortSetzen(passwort)` | nichts | nach Einladung, nach „vergessen“ und bei „Passwort ändern“ |
| `anmeldungen()` | Liste (siehe unten) | **nur die des angemeldeten Partners** |

## Eine Anmeldung

```json
{ "datum": "2026-11-10", "vorname": "Sarah", "initial": "S", "ort": "Stuttgart", "land": "DE", "wunsch": "ebook", "stand": "ebook" }
```

- `datum`: Tag des Eintrags, Format `YYYY-MM-DD`
- `vorname`, `initial` (erster Buchstabe des Nachnamens), `ort`, `land` (`DE`, `AT`, `CH`, …)
- `wunsch`: bei Sportlern `geraet` (Formular „Lern das Gerät persönlich kennen“ mit Budget jetzt oder bald) oder `ebook` (E-Book-Formular und „Ich will mich erst mal nur umschauen“)
- `stand`: bei Sportlern `neu`, `kontakt`, `beratung`, `gekauft`, `kein`, `ebook`. Woher er kommt, legt ihr fest. Naheliegend ist der Status, den das Team im Dashboard pflegt, zum Beispiel:
  Interessent ohne Anruf → `neu`, Interessent angerufen → `kontakt`, Testet → `beratung`, Geliefert → `gekauft`, Kein Interesse → `kein`, Quelle E-Book oder umschauen → `ebook`.

**Nie zurückgeben:** Nachname, Telefon, E-Mail, Erreichbarkeit, Notizen, Antworten zum Budget.
Das ist die Abmachung mit Jasmin (Datenschutz): Der Partner sieht nur, was oben steht.

## Vorschlag für Supabase

- **Zugang:** Supabase Auth wie beim Dashboard (E-Mail und Passwort, Einladung per Mail). Weiterleitung nach Einladung und Passwort-Link auf die Backoffice-Adresse (zum Beispiel `…/backoffice/`) in den Auth-Einstellungen erlauben.
- **Verknüpfung Zugang und Partner:** zum Beispiel eine Spalte `auth_user_id` in `uk_partner` oder eine eigene Zuordnungstabelle. Eine Rolle wie `sportpartner`, damit diese Zugänge **keinen** Zugriff auf die Tabellen des Dashboards bekommen.
- **`bo_profil()`**: `security definer`, gibt `kurz` des Partners zum angemeldeten Zugang zurück.
- **`bo_anmeldungen()`**: `security definer`, liest nur Zeilen mit `partner_id` des angemeldeten Partners und gibt **nur** die Felder oben zurück. Die Tabellen selbst bleiben für diese Rolle per Row Level Security gesperrt.
- Die Leads der Landingpage kommen heute über `partner-lead` in den Telegram-Bot. Für das Backoffice müssen sie zusätzlich (oder ohnehin) mit Partner, Datum, Wunsch und Stand in der Datenbank landen.

## Auf dem Server

- Der Ordner liegt in `01-landingpage/backoffice/` und wird mit den Landingpages ausgeliefert, also unter `…/backoffice/` (neben `…/partner/`). Nicht über die Landingpage verlinken.
- Schriften und Fotos kommen aus `../schriften/` und `../bilder/partner/`, also aus denselben Ordnern wie die Landingpages. Liegt das Backoffice woanders, diese Pfade anpassen.
- In `index.html` statt `quelle-vorschau.js`: `<script src="…/vendor/supabase.js"></script>` und `quelle-supabase.js`.
- `noindex, nofollow` ist gesetzt.

## Vor dem Start prüfen

1. Mit einem Zugang von Kevin werden nur Kevins Anmeldungen geladen, nie Johnys (und umgekehrt).
2. Ein Sportler-Zugang kann `uk_kunden`, `uk_partner` usw. nicht direkt lesen (Abfrage im Browser liefert nichts oder einen Fehler).
3. Die Antwort von `bo_anmeldungen()` enthält keine Telefonnummer und keine E-Mail.
4. Einladung, Passwort vergessen, Passwort ändern und Abmelden funktionieren.
5. Datenschutzerklärung und Einwilligung im Formular der Landingpage sind ergänzt (der Partner sieht Vorname, Anfangsbuchstabe, Ort und Stand).

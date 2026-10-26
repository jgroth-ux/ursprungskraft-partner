# Einbau: Lieferland und emGuarde (Bestellseite und Bestell-Bot)

Stand 27.10.2026. Grundlage: `an-zweiter-claude-bestellseite-emguarde/AUFTRAG.md` und die Live-Dateien in `vorhanden/`.
Alles baut auf dem auf, was live läuft. Sponsorwahl, Linienknöpfe „1 A“ bis „6 A“, Kreuze für K8 und ANESPA und die Mail an die Sponsor-Adresse sind unverändert.
Es geht nie etwas automatisch an Enagic.

## Was im Ordner ist

| Datei | Was |
|---|---|
| `website/bestellen/index.html`, `bestellen.js` | Bestellseite (Land einmal wählen, abweichende Lieferadresse mit Einzelfeldern, Bezahlung je Formular, emGuarde mit Anzahl) |
| `supabase/functions/bestellbot/index.ts` | Bot: Preise, MwSt und Versand nach Lieferland, emGuarde-Formular und emGuarde-Ratenantrag, eine Mail mit allem |
| `supabase/umbau-2026-10-27-lieferland-emguarde.sql` | Neue Fassung von `uk_bestellung_melden()` (Lieferzeile, Zahlung je Formular, Hinweis über 5 emGuarde, nur emGuarde normal) |

## Schritt 1: Formulare

Die beiden neuen Formulare müssen im Bucket `bestellungen` liegen (machst du laut Auftrag schon):
`formulare/emguarde-bestellformular.pdf`, `formulare/emguarde-ratenzahlungsantrag.pdf`.

## Schritt 2: SQL

`supabase/umbau-2026-10-27-lieferland-emguarde.sql` im SQL-Editor ausführen. Am Ende `stand ok`.
Es ändert nur `uk_bestellung_melden()`. Neue Felder brauchen keine Spalten, sie landen in `daten`.

## Schritt 3: Bot deployen

```bash
supabase functions deploy bestellbot --no-verify-jwt --project-ref ngcbmpuqcqbelfoelwby
```
Keine neuen Secrets. Webhook bleibt, wie er ist.

## Schritt 4: Bestellseite

`website/bestellen/index.html` und `bestellen.js` ersetzen. Der öffentliche Schlüssel und der WhatsApp-Link sind aus der Live-Fassung übernommen, nichts zu ändern.
Die Seite lädt `bestellen.js?v=20261026a`, damit Browser die neue Fassung holen.

## Neue Felder in `daten`

| Feld | Wann | Inhalt |
|---|---|---|
| `liefer_anders` | Haken „Abweichende Lieferadresse“ | `on` |
| `liefer_name`, `liefer_strasse`, `liefer_plz`, `liefer_ort`, `liefer_land_kurz` | nur mit Haken, dann Pflicht | Einzelfelder, Land frei wählbar |
| `liefer_land_anders` | Lieferland „anderes Land“ | Freitext |
| `liefer_land`, `liefer_adresse` | nur mit Haken | Landname und fertige Zeile „Straße, LAND-PLZ Ort“ (fürs Dashboard, das `liefer_adresse` schon anzeigt) |
| `zahlung`, `raten_anzahl`, `zahltag`, ... | nur wenn K8 oder ANESPA bestellt | wie bisher, für das K8-Formular |
| `zahlung_emguarde` | nur wenn emGuarde bestellt | `ueberweisung` oder `raten` |
| `zahltag_emguarde` | nur bei emGuarde-Raten | `1` oder `15` |
| `anzahl_emguarde` | nur wenn emGuarde bestellt | Anzahl Sets, Standard `1` |
| `iban`, `bic` | sobald irgendwo Raten | gemeinsam für beide Ratenanträge |

Ausgeblendete Felder werden vor dem Speichern entfernt, es steht also nur drin, was zur Auswahl gehört.

## Rechnung (Seite und Bot gleich)

- Netto überall gleich: K8 4.600 €, ANESPA DX 2.800 €, emGuarde Go 2.420 € je Set.
- MwSt nach **Lieferland**: DE 19 %, AT 20 %, sonst keine. MwSt nur auf den Preis, nicht auf den Versand (so wie heute 874 € beim K8).
- Versand je Gerät nach **Lieferland**:

  | Gerät | DE | EU (auch AT) | CH, LI, NO, GB |
  |---|---|---|---|
  | K8 | 12 € | 44 € | 57 € |
  | ANESPA DX | 8 € | 34 € | 47 € |
  | emGuarde Go (je Set) | 6 € | 22 € | 30 € |

- „Anderes Land“ als Lieferland: Versand bleibt leer, der Bot meldet „Versand fehlt, bitte eintragen“.
- Raten nur, wenn die **Bestellerin** nicht in GB oder LI wohnt.
- Die K8-Ratentabelle (Anzahlung und Monatsrate) gilt nur für die Gesamtbeträge 5.486 € und 4.657 €. Bei anderen Summen (zum Beispiel K8 mit ANESPA) zeigt die Seite die Laufzeit ohne Beträge, und im Bot steht „Anzahlung fehlt“.

## Schritt 5: Testablauf mit vier Testbestellungen

Vorbereitung wie beim letzten Test: Testmail an, Rückfragen an Jasmin, Test-Unterschrift im Speicher.
```sql
update uk_einstellungen set wert = 'TESTADRESSE@example.com' where name = 'bestellbot_testmail';
create table if not exists uk_test_merken as select name, wert from uk_einstellungen where name = 'tg_chat_daniel';
update uk_einstellungen set wert = (select wert from uk_einstellungen where name = 'tg_chat_jasmin') where name = 'tg_chat_daniel';
```
Im Bucket `bestellungen` eine PNG als `eingang/test/unterschrift.png` und ein Bild als `eingang/test/ausweis.jpg` ablegen.

Die vier Bestellungen (E-Mail = Testadresse, weil `uk_bestellung_mail` dem Kunden eine Bestätigung schickt):
```sql
insert into uk_bestellungen (daten, dateien, notiz) values
-- (a) K8 in DE, ohne abweichende Adresse, Überweisung
('{"vorname":"Test","nachname":"Fall-A","geburtsdatum":"1980-01-01","strasse":"Teststraße 1","plz":"10115","ort":"Berlin","land":"Deutschland","land_kurz":"DE",
  "handy":"+49 170 0000000","email":"TESTADRESSE@example.com","als":"Verbraucher","k8":"ja","nicht_eu":false,"zahlung":"ueberweisung"}',
 '{"unterschrift":"eingang/test/unterschrift.png"}', 'TEST Lieferland'),
-- (b) K8 aus DE, Lieferung in die Schweiz, 10 Raten
('{"vorname":"Test","nachname":"Fall-B","geburtsdatum":"1980-01-01","strasse":"Teststraße 1","plz":"10115","ort":"Berlin","land":"Deutschland","land_kurz":"DE",
  "handy":"+49 170 0000000","email":"TESTADRESSE@example.com","als":"Verbraucher","k8":"ja","nicht_eu":false,
  "zahlung":"raten","raten_anzahl":"10","zahltag":"1","schon_finanziert":"Nein","anzahlung":"716","monatsrate":"398","iban":"DE00 0000 0000 0000 0000 00",
  "liefer_anders":"on","liefer_name":"Test Empfänger","liefer_strasse":"Testweg 2","liefer_plz":"8000","liefer_ort":"Zürich","liefer_land_kurz":"CH",
  "liefer_land":"Schweiz","liefer_adresse":"Testweg 2, CH-8000 Zürich"}',
 '{"unterschrift":"eingang/test/unterschrift.png","ausweis_vorne":"eingang/test/ausweis.jpg","ausweis_hinten":"eingang/test/ausweis.jpg"}', 'TEST Lieferland'),
-- (c) K8 + ANESPA + emGuarde in AT, beide mit Raten
('{"vorname":"Test","nachname":"Fall-C","geburtsdatum":"1980-01-01","strasse":"Teststraße 1","plz":"1010","ort":"Wien","land":"Österreich","land_kurz":"AT",
  "handy":"+43 660 0000000","email":"TESTADRESSE@example.com","als":"Verbraucher","k8":"ja","nicht_eu":false,"zusatz_anespa":"on","zusatz_emguarde":"on","anzahl_emguarde":"1",
  "zahlung":"raten","raten_anzahl":"16","zahltag":"15","schon_finanziert":"Nein","zahlung_emguarde":"raten","zahltag_emguarde":"15","iban":"AT00 0000 0000 0000 0000"}',
 '{"unterschrift":"eingang/test/unterschrift.png","ausweis_vorne":"eingang/test/ausweis.jpg","ausweis_hinten":"eingang/test/ausweis.jpg"}', 'TEST Lieferland'),
-- (d) nur emGuarde, Überweisung (DE)
('{"vorname":"Test","nachname":"Fall-D","geburtsdatum":"1980-01-01","strasse":"Teststraße 1","plz":"10115","ort":"Berlin","land":"Deutschland","land_kurz":"DE",
  "handy":"+49 170 0000000","email":"TESTADRESSE@example.com","als":"Verbraucher","k8":"nein","nicht_eu":false,"zusatz_emguarde":"on","anzahl_emguarde":"1","zahlung_emguarde":"ueberweisung"}',
 '{"unterschrift":"eingang/test/unterschrift.png"}', 'TEST Lieferland');
```
Bei jeder Bestellung in Telegram **Daniel** und dann **2 A** drücken.

### Erwartet

| Fall | Meldung | Formulare in der Mail | Beträge |
|---|---|---|---|
| (a) K8, DE | „Zahlung K8: Überweisung“ | Bestellformular LeveLuk K8 | 4.600 € + 874 € MwSt + 12 € Versand = **5.486 €** |
| (b) K8 aus DE nach CH | „Lieferung nach: Test Empfänger, Testweg 2, CH-8000 Zürich“, „Zahlung K8: Raten, 10 Monate“ | Bestellformular LeveLuk K8, Ratenzahlungsantrag LeveLuk K8, ID Front, ID Back | 4.600 € + 57 € Versand, keine MwSt = **4.657 €**, Anzahlung 716 €. Im K8-Formular: `Shipping1` „Testweg 2, CH-8000 Zürich“, `Shipping2` „Test Empfänger“ |
| (c) K8 + ANESPA + emGuarde, AT, Raten | „Produkte: LeveLuk K8, ANESPA DX, emGuarde Go“, „Zahlung K8: Raten, 16 Monate“, „Zahlung emGuarde: Raten, 10 Monate“ | Bestellformular LeveLuk K8 und Anespa DX, Ratenzahlungsantrag LeveLuk K8 und Anespa DX, Bestellformular emGuarde Go, Ratenzahlungsantrag emGuarde Go, ID Front, ID Back | K8-Formular: 7.400 € + 1.480 € MwSt + 78 € Versand = **8.958 €**, Anzahlung fehlt (keine Tabelle). emGuarde: 2.420 € + 484 € MwSt + 22 € Versand = **2.926 €**, Ratengebühr 100 €, monatlich 292,60 € |
| (d) nur emGuarde, DE | „Zahlung emGuarde: Überweisung“, normaler Ablauf mit Sponsor und Linie | Bestellformular emGuarde Go | 2.420 € + 459,80 € MwSt + 6 € Versand = **2.885,80 €** |

Betreff (c): `[TEST] NEW Sale Leveluk K8, Anespa DX and emGuarde Go from Austria`, (d): `[TEST] NEW Sale emGuarde Go from Germany`.
Im Bot je Formular eine Zeile „Im Formular …: Preis …, MwSt …, Versand …, gesamt …“.
Optional: (c) mit `"anzahl_emguarde":"6"` → Hinweis „Achtung, mehr als 5 emGuarde je Vertriebspartner gehen nicht.“ in Meldung und Fertig-Nachricht, kein Abbruch.

Aufräumen:
```sql
delete from uk_bestellungen where notiz = 'TEST Lieferland';
update uk_einstellungen set wert = (select wert from uk_test_merken) where name = 'tg_chat_daniel';
drop table uk_test_merken;
update uk_einstellungen set wert = '' where name = 'bestellbot_testmail';
```
Im Bucket die Ordner der Testbestellungen und `eingang/test/` löschen.

## Bestellseite von Hand prüfen

1. Seite öffnen: nur „Wo wohnst du?“. Land wählen → Flaggen verschwinden, Produkte erscheinen. Unter der Adresse „Land: … Land ändern“.
2. „Abweichende Lieferadresse“ anhaken → leere Felder Name, Straße, PLZ, Ort, Land. Lieferland Schweiz → Versand und MwSt ändern sich sofort.
3. K8 und emGuarde wählen → zwei Bezahlteile mit eigener Wahl. Nur emGuarde → nur der emGuarde-Teil.
4. Irgendwo Raten → IBAN und Ausweis erscheinen.
5. Unterschrift zeichnen geht (das Feld wurde vorher beim Laden mit Größe 0 vermessen, ist behoben).

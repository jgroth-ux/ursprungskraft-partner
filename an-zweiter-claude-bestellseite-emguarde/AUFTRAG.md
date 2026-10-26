# Auftrag: Bestellseite und Bestell-Bot, Lieferland und emGuarde (Stand 26.10.2026)

Vom Hauptsystem an den zweiten Claude. Alle Schlüssel und privaten Adressen sind `XXX`. Keine Kundendaten.
Supabase-Projekt `ngcbmpuqcqbelfoelwby`. Eingespielt und getestet wird im Hauptsystem, nicht bei dir.

Der Bestell-Bot läuft seit heute live und ist getestet. Bitte nur ändern, was hier steht, und alles,
was schon funktioniert, unverändert lassen (Sponsorwahl, Linienknöpfe "1 A" bis "6 A", Kreuze für K8
und ANESPA, Mail an die Sponsor-Adresse, nie automatisch an Enagic).

## Was in `vorhanden/` liegt

- `website/bestellen/index.html`, `bestellen.js`: die Bestellseite, wie sie live ist
- `supabase/functions/bestellbot/index.ts`: der Bot, wie er live ist
- `supabase/umbau-2026-10-24-bestellung-ergaenzungen.sql`, `umbau-2026-10-26-bestellbot-rueckfragen.sql`,
  `umbau-2026-10-26b-bestellbot-linien-anespa.sql`: Tabellen, Einstellungen, Trigger `uk_bestellung_melden()`
  (die Fassung in `26b` ist die aktuelle)
- `formulare/`: alle Enagic-Formulare. Im Hauptsystem liegen sie im Bucket `bestellungen` unter
  `formulare/<datei>.pdf`. Die beiden emGuarde-Formulare sind neu und werden vom Hauptsystem hochgeladen.

## 1. Bestellseite

1. **Land einmal wählen.** Nach der Wahl verschwindet der Flaggenblock ("Wo wohnst du?") ganz. Unter der
   Adresse steht ein kleiner Link **"Land ändern"**, der die Flaggen wieder zeigt. Die zweite Länderauswahl
   im Adressteil (`#land-sonst` dort, wo sie doppelt ist) fällt weg. `land_kurz` muss weiter gesetzt werden.
2. **Abweichende Lieferadresse.** Der Haken heißt genau **"Abweichende Lieferadresse"** (statt "Die Bestellung
   soll an eine andere Adresse geliefert werden"). Darunter getrennte Felder statt des Freitexts:
   `liefer_name`, `liefer_strasse`, `liefer_plz`, `liefer_ort`, `liefer_land_kurz` (Länderauswahl, gleiche
   Länderliste wie oben). Pflichtfelder nur, wenn der Haken gesetzt ist.
3. **Der Satz "Preis und Bezahlung klären wir persönlich" fällt überall weg** (Zeilen ~27, 29, 41/42, 77, 85,
   92, 116, 168 in `bestellen.js`). Preis und Bezahlung werden nicht persönlich geklärt. Stattdessen Preis
   nennen (siehe Preise unten) bzw. "Preis und Raten siehst du unten bei der Bezahlung".
4. **Bezahlung je Gerät.** K8 (mit ANESPA) und emGuarde haben jeder ein eigenes Enagic-Formular und einen
   eigenen Ratenantrag. Die Kundin wählt pro Formular selbst:
   - K8-Formular (K8 und/oder ANESPA): Überweisung oder Raten wie heute (`zahlung`, `raten_anzahl` 3/6/10/16/24, `zahltag`).
   - emGuarde: eigene Wahl `zahlung_emguarde` = `ueberweisung` | `raten`. Raten nur **10 Monate**, Gebühr **100 €**,
     dazu `zahltag_emguarde` (1. oder 15.).
   - Bestellt sie nur eins von beiden, nur die passende Wahl zeigen.
   - Raten weiterhin nur in EU, Schweiz, Norwegen (bestehende Regel in `bestellen.js` ~160). Maßgeblich ist
     das Land der Bestellerin, nicht das Lieferland.
   - Ausweisfotos werden gebraucht, sobald irgendwo Raten gewählt sind.
5. **Hinweis emGuarde:** "Höchstens 5 emGuarde je Bestellung." Nur als Hinweis, keine Sperre.
6. Texte: du-Form, kurz, **keine Gedankenstriche**, keine englischen Wörter.

## 2. Preise, MwSt, Versand (für Seite und Bot gleich)

- Preise netto, in jedem Land gleich: K8 4.600 €, ANESPA DX 2.800 €, emGuarde Go 2.420 € (Set mit 2 Geräten).
- MwSt hängt am **Lieferland**: DE 19 %, AT 20 %, Schweiz und alle anderen ohne.
- Versand **pro Gerät**, hängt am **Lieferland** (Fußnote der Enagic-Formulare):

  | Gerät | DE | EU (auch AT) | GB, NO, CH |
  |---|---|---|---|
  | K8 | 12 € | 44 € | 57 € |
  | ANESPA DX | 8 € | 34 € | 47 € |
  | emGuarde Go | 6 € | 22 € | 30 € |

  Liechtenstein wie CH. Ohne abweichende Lieferadresse ist das Lieferland das Land der Bestellerin.
- Beispiel: Bestellerin in DE, Lieferung in die Schweiz, nur K8: 4.600 + 57 Versand, keine MwSt = 4.657 €.
- Im Bot ersetzt das die heutige `versandVon()` (AT war dort `null`, jetzt EU-Satz).

## 3. Bot (`index.ts`) und Trigger

1. **Lieferadresse ins K8-Formular** (`bestellformular.pdf`): `Shipping1` = "Straße, LAND-PLZ Ort"
   (z. B. "Untere Schützenalp 1028B, CH-3457 Wasen im Emmental"), `Shipping2` = Name des Empfängers.
2. **Bestellmeldung und Zusammenfassung im Bot:** Zeile "Lieferung nach: Name, Straße, LAND-PLZ Ort",
   nur wenn abweichend. Im Trigger `uk_bestellung_melden()` ebenfalls.
3. **emGuarde-Bestellformular** (`emguarde-bestellformular.pdf`, 2 Seiten, Aufbau wie das K8-Formular)
   genauso ausfüllen wie das K8-Formular, mit derselben Sponsorwahl, Linie und Unterschrift:

   | Feld | Inhalt |
   |---|---|
   | `undefined` / `undefined_2` | Verbraucher / Distributor (Haken wie beim K8) |
   | `Text1` Name, `Text2` Geburtsdatum, `Text3` Straße, `Text4` PLZ, `Ort`, `Text5` Land | Bestellerin |
   | `Text6` (y 630) | Lieferadresse "Straße, LAND-PLZ Ort" |
   | `Text7` (y 610) | Lieferung an Name |
   | `Telefonnummer`, `Handynummer`, `Text8` E-Mail, `Text9` USt-ID | wie K8 |
   | `emGuarde` (Checkbox [44,505]) | Kreuz. Wie beim K8 nach `flatten()` selbst zeichnen, sonst verdeckt |
   | `Text10` Preis, `Text11` MwSt, `Text12` Versand, `Text13` Gesamt | Beträge nach Abschnitt 2 |
   | `60` (Checkbox) | Ratengebühr 100 €, nur bei Raten |
   | `Anzahlung` | nur bei Raten |
   | `undefined_3` [154,364] | Überweisung |
   | `undefined_4` / `undefined_5` / `Amex` | Visa / MC / Amex (heute nicht genutzt, leer lassen) |
   | `Text15` [367,235] | Datum Käufer |
   | `Signature21` [138,237] | Unterschrift Käufer (Bild aus `dateien`) |
   | `Text16` Name, `Text17` ID, `Text18` Linie, `Text19` E-Mail, `Text20` [455,113] Datum | Sponsor |
   | `Signature22` [156,114] | Unterschrift Sponsor (`sponsor/<daniel|gmbh|jasmin>.png`) |
   | `Text14` / `Text21` | Vermittler Name / ID, leer lassen wie beim K8 |

4. **emGuarde-Ratenantrag** (`emguarde-ratenzahlungsantrag.pdf`, 1 Seite, 612x792), nur wenn
   `zahlung_emguarde = 'raten'`:

   | Feld | Inhalt |
   |---|---|
   | `Group21` /0 Ja, /1 Nein | "finanziert bereits": Nein |
   | `Text1` Name, `Text2` Adresse, `Text4` Land, `Text3` Telefon, `Text5` Handy, `Text6` E-Mail | Antragstellerin |
   | `Text7` bis `Text12` | abweichender Zahler, leer |
   | `Group20` Choice1 | 10 Raten |
   | `Gesamtbetrag`, `Monatliche Zahlung`, `Gebühr` | Gesamt, Gesamt minus Anzahlung durch 10, 100 € |
   | `Group18` /0 1., /1 15. | Zahltag |
   | `Startdatum`, `Enddatum` | wie beim K8-Ratenantrag berechnen |
   | `Group17` /2 Kreditkarte, /1 Überweisung (Dauerauftrag), /0 SlimPay | wie beim K8-Ratenantrag gewählt (heute SlimPay/Lastschrift) |
   | `BIC`, `IBAN` | aus der Bestellung |
   | `Text13` Datum, `Signature15` [31,92] | Antragstellerin |
   | `Text14`, `Signature16` | abweichender Zahler, leer |

   Feldnamen bitte selbst mit pdf-lib gegenprüfen, die Liste oben stammt aus einer Auslesung.
5. **Ein Gerät, ein Formularsatz.** K8 und ANESPA bleiben auf einem K8-Formular (wie heute). emGuarde bekommt
   seinen eigenen Satz. Alles kommt in **eine** Mail an die Sponsor-Adresse, mit klarer Anhangsliste
   (z. B. "Bestellformular LeveLuk K8, Ratenzahlungsantrag K8, Bestellformular emGuarde Go, Ratenzahlungsantrag
   emGuarde Go, ID Front, ID Back"). Betreff und Enagic-Text nennen alle Produkte auf Englisch.
6. **Nur emGuarde bestellt:** auch dann Formulare erstellen. "Bitte persönlich klären" nur, wenn weder K8
   noch ANESPA noch emGuarde bestellt ist.
7. **Hinweis im Bot**, wenn mehr als 5 emGuarde in einer Bestellung: "Achtung, mehr als 5 emGuarde je
   Vertriebspartner gehen nicht." Kein Abbruch.
8. Das Tokurei-Programm ist kein Hindernis (Daniel ist aktiver Vertriebspartner). Nichts dazu einbauen.
9. Die Zeile "Im Formular: Preis …, Versand …, gesamt …" im Bot je Formular ausgeben.

## Regeln

- **Nie automatisch an Enagic senden.** Immer an die Sponsor-Adresse, Daniel leitet weiter.
- Bestehendes nicht überschreiben, sondern ergänzen. Was live läuft, muss weiter laufen.
- SQL darf mehrfach laufen (`if not exists`, `on conflict`, `create or replace`).
- Keine echten Schlüssel, keine Adressen einsetzen, `XXX` lassen.

## Was ich zurück brauche

Ein Ordner mit:
- `website/bestellen/index.html` und `bestellen.js`
- `supabase/functions/bestellbot/index.ts`
- `supabase/umbau-<datum>-lieferland-emguarde.sql` (Trigger und was sonst nötig ist)
- `EINBAU.md`: Schritt für Schritt fürs Hauptsystem, inklusive Testablauf mit vier Testbestellungen:
  (a) K8 in DE ohne abweichende Adresse, (b) K8 aus DE mit Lieferung in die Schweiz, (c) K8 + ANESPA + emGuarde
  in AT, beide mit Raten, (d) nur emGuarde mit Überweisung. Zu jedem Fall die erwarteten Beträge.
- `ERGEBNIS.md`: was gebaut ist, was offen ist.

<!--
  PRODUKTAUSWAHL FÜR DIE BESTELLSEITE, Stand 23.10.2026
  FERTIG: Baustein mit drei Kacheln und Detailfenster, Einbau-Anleitung.
  FEHLT:  Preise emGuarde und ANESPA DX, Fotos, Abgleich der Texte mit enagiceu.com.
-->
# Einbau: Produktauswahl und Lieferadresse auf der Bestellseite

Für den Claude mit Zugriff auf den Server. Stand 23.10.2026.

## Was es ist

Drei Kacheln oben auf `mein.ursprungskraft.net/bestellen/`: **LeveLuk K8** (zuerst, fest in der Bestellung),
**emGuarde**, **ANESPA DX** (Duschkopf). Klick auf eine Kachel öffnet ein Fenster mit Details. emGuarde und
ANESPA DX kann der Kunde per Haken „Mitbestellen“ dazunehmen.

Dateien: `produkte.js`, `produkte.css`. `index.html` ist nur die Vorschau.

## Einbau in drei Schritten

1. `produkte.css` und `produkte.js` nach `website/bestellen/` kopieren.
2. In `website/bestellen/index.html`:
   - im `<head>`: `<link rel="stylesheet" href="produkte.css">`
   - an der Stelle, wo das Gerät heute oben steht: `<div id="produktauswahl" data-land="DE"></div>`
     (die bisherige Gerätedarstellung ersetzen oder darunter lassen, wie es besser passt)
   - vor `bestellen.js`: `<script src="produkte.js"></script>`
3. In `bestellen.js`:
   - Wenn der Kunde das Land wählt: `zusatzprodukteLand('CH')` bzw. `zusatzprodukteLand('DE')` aufrufen.
   - Beim Absenden: `zusatzprodukteAuswahl()` liefert z. B. `[{ id: 'emguarde', name: 'emGuarde' }]`.
     In die Bestellung speichern (z. B. Spalte `zusatzprodukte` als JSON) und in die Telegram-Nachricht
     „Neue Bestellung“ aufnehmen: „Zusätzlich gewünscht: emGuarde, ANESPA DX“.

Der Referral-Link (`?von=daniel`, `?von=jasmin`, später Partner) bleibt unverändert, die Kacheln wissen nichts davon.

## Wichtig

- **Zusatzprodukte nicht automatisch an Enagic schicken.** Für emGuarde und ANESPA DX gibt es eigene
  Enagic-Bestellformulare oder Preise, die hier noch nicht hinterlegt sind. Die Auswahl ist eine Info an
  Daniel bzw. den Partner, der mit dem Kunden spricht (feste Regel: vorher immer bei Daniel nachfragen).
- **Preise fehlen** für emGuarde und ANESPA DX (stehen als „Preis auf Anfrage“). Eintragen ganz oben in
  `produkte.js`, Abschnitt PRODUKTE, Feld `preis`.
- **Texte prüfen:** Die Produktdaten stammen aus Händler- und Herstellerangaben, die Enagic-Seiten selbst
  waren von dort aus nicht erreichbar. Vor dem Livegang mit enagiceu.com abgleichen:
  - https://www.enagiceu.com/de_DE/product-emguarde
  - https://www.enagiceu.com/de_DE/products/anespadx-mineral-ion-water-spa
- **Fotos:** Feld `bild` in `produkte.js` (z. B. `'../bilder/emguarde.jpg'`). Leer = ruhiger Platzhalter mit Produktname.
- **emGuarde-Texte bewusst vorsichtig:** Wirkung nur als Beschreibung von Enagic, dazu Enagics eigener Hinweis,
  dass es nicht zur Behandlung oder Vorbeugung von Krankheiten bestimmt ist. Keine Aussagen wie „schützt vor
  Strahlung“ ergänzen (Abmahnrisiko).

---

# Abweichende Lieferadresse

Dateien: `lieferadresse.js`, `lieferadresse.css`.

1. Beide Dateien nach `website/bestellen/` kopieren, im `<head>` `<link rel="stylesheet" href="lieferadresse.css">`,
   vor `bestellen.js` `<script src="lieferadresse.js"></script>`.
2. Im Formular direkt unter der Anschrift des Kunden: `<div id="lieferadresse"></div>`.
   Die Felder liegen innerhalb des Formulars, `FormData` nimmt sie also automatisch mit
   (`liefer_abweichend`, `liefer_name`, `liefer_zusatz`, `liefer_strasse`, `liefer_plz`, `liefer_ort`,
   `liefer_land`, `liefer_telefon`).
3. In `bestellen.js` beim Absenden zuerst `lieferadressePruefen()` aufrufen (false = abbrechen), dann
   `lieferadresseDaten()` speichern: `null` heißt Lieferung an die Kundenadresse.
4. In die Telegram-Nachricht „Neue Bestellung“: „Lieferadresse abweichend: …“ (nur wenn nicht null).
5. **Enagic-Formulare:** prüfen, ob das Bestellformular ein eigenes Feld für die Lieferadresse hat
   (Shipping Address). Wenn ja, dort eintragen, sonst als Hinweis in die Mail an Enagic
   („Bitte liefern an: …“). Vertrag und Rechnung bleiben auf den Namen des Kunden.
6. **Offen (Daniel fragen):** Darf die Lieferadresse in einem anderen Land liegen als die Kundenadresse
   (z. B. Kunde in der Schweiz, Lieferung nach Deutschland)? Preise und MwSt hängen am Land. Bis das geklärt
   ist, bietet das Feld Deutschland, Schweiz und Österreich an. Beim Wechsel der Kundenadresse am besten
   `document.querySelector('[name=liefer_land]').value` auf dasselbe Land vorbelegen.

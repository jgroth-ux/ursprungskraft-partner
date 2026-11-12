# Übergabe: Bestellformular für Kevin Wolter und Johny Yusupov

Stand 12.11.2026. Nichts hochgeladen, nichts deployt, keine Datenbank geändert. Schlüssel stehen weiter als `XXX` drin.

## Was drin ist

```
wasseristmehr/bestellen/vorlage.html     eine Vorlage für alle Sportler   -> $UK/wasseristmehr/bestellen/
wasseristmehr/bestellen/bestellen.css    nur der Zusatz zu empfehlung.css  -> $UK/wasseristmehr/bestellen/
wasseristmehr/bestellen/bestellen.js     Ablauf wie bestellen/bestellen.js -> $UK/wasseristmehr/bestellen/
diffs/wasseristmehr-hochladen.sh.diff    neue Zeilen im Upload-Skript
diffs/partner-kevin-index.html.diff      Knopf "Gerät bestellen" auf der Sportseite
diffs/partner-johny-index.html.diff      dasselbe für Johny
supabase/pruefen-partner-kevin-johny.sql nur lesen: ordnet uk_bestellung Kevin und Johny richtig zu?
screenshots/                             je Sportler Handy und Computer, dazu Danke-Seite und der neue Knopf
```

Der Ordner `wasseristmehr/` ist `$QUELLE` aus dem Skript, also `$UK/wasseristmehr`.

## So läuft es

- Das Skript baut beim Aufruf von `seite kevin kevin-wolter` jetzt auch `kevin-wolter/bestellen/index.html` aus der Vorlage.
  Es setzt Kürzel (`kevin`) und Adresse (`kevin-wolter`) aus dem Aufruf ein, **Name, Rolle und Vorname aus der Sportseite**
  (Kopfleiste `<span class="marke">` und `data-vorname`). Neue Sportler bekommen ihre Bestellseite also automatisch.
- `bestellen.css`, `bestellen.js` gehen nach `/seiten/`, `k8-glas.jpg` nach `/bilder/`, `agb-enagic.pdf` nach `/`.
- Das Skript bricht ab, wenn in `seiten/bestellen.js` noch `XXX` steht, ein Platzhalter `{{...}}` offen ist oder eine Bestellseite fehlt.
- Ausprobiert mit einem Nachbau der Ordner und `--nur-bauen`: läuft durch. Mit `XXX` bricht es wie gewünscht ab.
  Der Diff ergibt das getestete Skript exakt.

**Vor dem ersten Lauf auf Jasmins Seite:**
1. In `bestellen.js` Zeile 8 den echten öffentlichen Schlüssel eintragen (derselbe wie in `empfehlung.js`).
2. `$WEB/agb-enagic.pdf` und `$WEB/bilder/k8-glas.jpg` müssen da sein, sonst stoppt `cp` das Skript.
3. `vendor/supabase.js` kopiert das Skript schon für das Backoffice, die Bestellseite nutzt dieselbe Datei.

## Die Seite

- Adresse `/kevin-wolter/bestellen/` und `/johny-yusupov/bestellen/`. Alle Links absolut (`/seiten/...`, `/impressum.html`,
  `/datenschutz/`, `/agb-enagic.pdf`), damit es egal ist, ob Netlify mit oder ohne Schrägstrich am Ende ausliefert.
- Look: lädt `empfehlung.css` der Sportseite (Anthrazit, Jost und Inter, Akzent je Sportler über `data-kurz`), dazu `bestellen.css`.
  Kopfleiste mit Name und Rolle wie auf der Sportseite, Name führt zurück. Fuß mit Impressum und Datenschutz. Kein Ursprungskraft,
  kein Logo, auch nicht in Kommentaren oder im Quelltext. `noindex, nofollow`.
- Nur der K8. Kein emGuarde, kein ANESPA, keine Auswahl. Filter oder Zubehör hatte die bisherige Seite beim K8 nicht, also auch hier nicht.
- Ablauf wie in `bestellen.js`: erst Land (Deutschland, Schweiz, Österreich, anderes Land), dann Kunde oder Vertriebspartner
  (mit Haken "abgesprochen"), Angaben mit allen Pflichtfeldern, abweichende Lieferadresse, Firma mit USt-IdNr., Überweisung oder Raten
  (Laufzeit, Abbuchungstag, schon finanziert, wer zahlt, IBAN oder Dauerauftrag außerhalb des Euro-Raums), Ausweis bei Raten oder
  Vertriebspartner, Unterschrift, AGB, Newsletter-Haken. Gleiche Fehlermeldungen, gleiche Prüfungen, gleiche Felder in `daten`.
- Preise, MwSt, Versand, Gesamtbetrag und Raten nur aus `rpc('uk_preise')`. Auch die **Laufzeiten** kommen jetzt aus der
  Ratentabelle (`raten_k8`), auf der alten Seite standen 3, 6, 10, 16, 24 fest im HTML. Ohne geladene Preise keine Bestellung.
- Neu: kurz vor dem Knopf "Verbindlich bestellen" eine kleine Übersicht (Gerät, Lieferland, Preis, Zahlung, Gesamtbetrag).
  Rechnet mit denselben Zahlen. Der Gesamtbetrag gehört in Deutschland direkt vor den Bestellknopf.
- Absenden genau wie bisher: Upload nach `bestellungen/eingang/<id>/` (Unterschrift, bei Bedarf Ausweis vorne und hinten),
  dann `rpc('uk_bestellung', { p: { von, daten, dateien } })` mit `von = 'kevin'` bzw. `'johny'` aus `data-kurz`. `daten.k8 = 'ja'`.
  Getestet mit nachgestellter Datenbank: drei Uploads, Aufruf mit `von: "johny"`, Anzahlung und Monatsrate aus der Tabelle, danach Danke-Seite.
- `?demo` an der Adresse: nichts hochladen, nichts speichern, die Daten stehen in der Browser-Konsole. `#danke` zeigt die Danke-Seite.
- Danke-Seite: drei Schritte wie bisher und ein Knopf zurück zum Sportler.

## Sportseiten (nur als Diff)

Im Abschnitt "Lern das Gerät persönlich kennen" links unter dem E-Book-Satz, sonst nichts geändert:

```html
<p class="klein">Du hast dich schon entschieden? Dann bestell deinen K8 direkt hier.</p>
<a class="knopf rahmen" href="/kevin-wolter/bestellen/">Gerät bestellen</a>
```

Achtung: Oben in den Sportseiten steht "Gebaut aus partner/_vorlage/seite.html mit bauen.py. Hier nichts von Hand ändern."
Die Zeilen gehören also eigentlich in `_vorlage/seite.html` (die hatte ich nicht). Dort braucht der Link die Adresse der Seite
(`kevin-wolter`), die steht bisher nur im Upload-Skript. Der Link ist absolut, im Vorschau-Ordner von mein.ursprungskraft.net führt er ins Leere.

## Prüfung uk_bestellung mit von = 'kevin'

Die Zeile `select id into v_partner from uk_partner where kurz = lower(p->>'von') and aktiv` passt, **wenn** es in `uk_partner`
eine Zeile mit `kurz = 'kevin'` (klein geschrieben) und `aktiv = true` gibt. Prüfen mit `supabase/pruefen-partner-kevin-johny.sql`.
Was mir dabei aufgefallen ist:

1. Gibt es die Zeile nicht, kommt **kein Fehler**. Die Bestellung landet trotzdem, nur ohne Partner beim Kunden. In Telegram steht `Link: kevin`.
2. Der Partner wird **nur bei neuen Kunden** eingetragen. Kennt die Datenbank den Käufer schon (gleiche E-Mail, Telefon oder Name),
   bleibt sein bisheriger Partner stehen, auch wenn dort keiner ist. Vorschlag für den Update-Zweig von `uk_bestellung`:
   `partner_id = coalesce(partner_id, v_partner),`. Nicht eingespielt.
3. `uk_bestellungen.von` bekommt `kevin` bzw. `johny` immer, unabhängig davon.

Die SQL-Datei im Paket ist vom 20.10. Falls `uk_bestellung` danach noch einmal geändert wurde, bitte gegen die aktuelle Fassung prüfen.

## Screenshots

Die Preise darauf sind **Beispielzahlen aus dem Test** (die Datenbank war nachgestellt), nicht die echten aus `uk_preise`.
Computer 1440 px breit, Handy iPhone 13. `-start` ist der erste Bildschirm, `-ganz` die ganze Seite ausgefüllt
(Computer mit Raten, Handy mit Überweisung). Das Datum im Geburtsdatum zeigt der Testbrowser amerikanisch, am deutschen Handy steht es deutsch.

## Offene Fragen an Jasmin

1. **Bestätigungsmail:** Wer bestellt, bekommt automatisch eine Mail von "Daniel Zürcher · Ursprungskraft", unterschrieben mit
   "Daniel und Jasmin, Ursprungskraft GmbH", mit Link auf mein.ursprungskraft.net. Das gilt auch für Käufer von Kevins und Johnys Seite.
   Soll das so bleiben, oder sollen sie eine andere Mail bekommen?

2. **Über wen läuft der Verkauf?** Der Bestell-Bot fragt Daniel wie immer "Daniel, Ursprungskraft GmbH, Jasmin oder jemand anderes".
   Kevin und Johny stehen da nicht. Soll eine Bestellung von ihrer Seite automatisch über jemand Bestimmten laufen, so wie bei Jasmins Link?

3. **WhatsApp-Kanal:** Auf der bisherigen Danke-Seite gibt es einen Knopf zur WhatsApp-Community. Den habe ich weggelassen,
   weil die Community zu Ursprungskraft gehört. Soll er trotzdem rein?

4. **Newsletter-Haken:** "Schick mir Tipps und Neuigkeiten per E-Mail" ist drin, wie auf der alten Seite. Die Tipps kämen von Ursprungskraft.
   Soll der Haken bleiben?

5. **Preis für den Ersatzfilter:** In den Fragen stand "Ein Ersatzfilter kostet bei Enagic 114 € zzgl. MwSt." Das habe ich rausgenommen,
   weil sonst eine Zahl außerhalb von `uk_preise` stünde. Soll der Filterpreis in `uk_preise`, damit er wieder angezeigt werden kann?

6. **Stehen Kevin und Johny in der Partnerliste?** Damit ihre Käufer bei ihnen landen, müssen sie dort als "kevin" und "johny" stehen und aktiv sein.
   Die Prüfabfrage ist dabei.

# Backoffice für Partner

Stand: 10.11.2026. Eine Seite, auf der sich Partner anmelden und sehen, wer sich über ihre Landingpage eingetragen hat.
Gebaut als **Grundlage für alle Gruppen**. Heute für die Sportler (Kevin, Johny, weitere), später für Heilpraktiker,
Osteopathen und andere. Aufbau, Gestaltung und Ablauf bleiben gleich, nur die Inhaltsdatei wird getauscht.

## Dateien

| Datei | Was drin ist | Ändern, wenn … |
|---|---|---|
| `index.html` | Aufbau der Seite, keine gruppenspezifischen Texte | nie für Inhalte |
| `backoffice.css` | Gestaltung (Anthrazit, Felder, Leiste unten, Handy) | sich das Aussehen für alle ändern soll |
| `backoffice.js` | Ablauf: Anmeldung, Passwort, Zahlen, Verlauf, Liste | sich das Verhalten für alle ändern soll |
| `konfig-sport.js` | **Inhalt der Gruppe Sportler**: Texte, Wunsch- und Stand-Bezeichnungen, Kennzahlen, Filter, Partner mit Foto, Link und Farben | ein Sportler dazukommt oder ein Text sich ändert |
| `konfig-vorlage.js` | leere Vorlage für eine neue Gruppe, Lücken als `[FEHLT: …]` | eine neue Gruppe entsteht |
| `quelle-vorschau.js` | Datenquelle für die Vorschau mit ausgedachten Beispieldaten | nie im Echtbetrieb |
| `quelle-supabase.js` | Datenquelle für den Echtbetrieb (Supabase), Schlüssel als `XXX` | wird vom anderen Claude angebunden |
| `SCHNITTSTELLE.md` | genaue Beschreibung, was die Datenquelle liefern muss | |

## Ansehen

`index.html` im Browser öffnen (die Ordnerstruktur des Pakets muss erhalten bleiben). Unten auf der Anmeldeseite
„Kevin Wolter“ oder „Johny Yusupov“ wählen. Weitere Vorschau-Adressen:

- `index.html?wer=kevin` oder `?wer=johny`: direkt die Übersicht
- `index.html?ansicht=einladung`: so sieht es aus, wenn jemand den Einladungslink öffnet
- `index.html?ansicht=passwort`: so sieht es nach dem Link „Passwort vergessen“ aus

Eine Einzeldatei zum Weitergeben liegt im Paket unter `vorschau/backoffice-vorschau.html`.

## Was der Partner sieht

- Anmeldungen gesamt und neue der letzten 7 Tage
- Verlauf als Balken, umschaltbar: 7 Tage oder 12 Wochen. Der aktuelle Tag bzw. die aktuelle Woche steht in der Akzentfarbe. Beim Darüberfahren erscheint der genaue Wert.
- drei Kennzahlen (bei Sportlern: wollen das Gerät kennenlernen, haben das E-Book geholt, Geräte gekauft)
- Foto und Link zur eigenen Landingpage
- Liste mit Datum, Vorname und Anfangsbuchstabe, Ort, Wunsch und Stand, mit Filtern
- Konto: Passwort ändern, Abmelden. Auf der Anmeldeseite: Passwort vergessen. Über den Einladungslink: erstes Passwort festlegen.
- **Keine Telefonnummer und keine E-Mail der Interessenten.** Das ist Absicht (Datenschutz). Die Partner kontaktieren niemanden selbst, das macht das Team.

## Neuen Sportler dazunehmen

1. In `konfig-sport.js` unter `partner` einen Eintrag ergänzen. Der Wert `kurz` muss derselbe sein wie in `partner.json` der Landingpage.
2. Farben: `akzent` für Linien, `knopf` für Knöpfe und das Akzentfeld (weiße Schrift darauf, Kontrast mindestens 4,5 : 1), `aufDunkel` für kleine Schrift auf Anthrazit (mindestens 4,5 : 1 auf `#383E42`), `aufHell` für kleine Schrift auf hellem Grund.
3. Im Echtbetrieb zusätzlich einen Zugang anlegen und ihn mit dem Partner verknüpfen (siehe `SCHNITTSTELLE.md`).

## Neue Gruppe (zum Beispiel Heilpraktiker)

1. `konfig-vorlage.js` kopieren als `konfig-heilpraktiker.js`, alle `[FEHLT: …]` füllen.
2. Den Ordner `06-backoffice` für die Gruppe kopieren und in `index.html` die Zeile mit `konfig-sport.js` auf die neue Datei ändern.
3. Wunsch, Stand, Kennzahlen und Filter an das anpassen, was auf der Landingpage dieser Gruppe abgefragt wird.
   Die Darstellung passt sich von selbst an.
4. Für eine ruhigere Optik reichen andere Farben in `standardFarben` und bei den Partnern. Die Vorlage hat dafür nur einen neutralen Platzhalter.

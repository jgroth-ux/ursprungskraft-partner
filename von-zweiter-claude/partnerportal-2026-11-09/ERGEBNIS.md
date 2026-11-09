# Ergebnis Korrektur 2: Partnerportal neu gestaltet

Stand: 09.11.2026. Grundlage: KORREKTUR-2.md und die Master-Vorgabe (sie hat Vorrang).
Nichts wurde veröffentlicht. Kein Netlify, kein Supabase, keine neue SQL, keine echten Daten berührt.
Alles wurde lokal mit den Probedaten der Vorschau geprüft.

## So schaust du es dir an

Den Ordner `website/` auf einen Webserver legen (lokal reicht) und diese Adressen öffnen:

| Was | Adresse |
|---|---|
| Partneransicht mit Probedaten | `partner/?vorschau=normal` |
| Erste Anmeldung mit Einstieg | `partner/?vorschau=normal&einstieg` |
| Bereiche nicht freigeschaltet | `partner/?vorschau=gesperrt#tools/seite` |
| Neues Konto ohne Daten | `partner/?vorschau=leer` |
| Anmeldeseite | `partner/?vorschau=anmelden` |
| Team mit Backoffice | `partner/?vorschau#bo` |

## Die sieben Punkte aus KORREKTUR-2.md

| Nr. | Punkt | Ergebnis | Nachweis |
|---|---|---|---|
| 1 | Kalender wie gewohnt: Monat, jeder Tag ein Feld, Einträge mit Uhrzeit und Name, farbig nach Art. Klick auf Eintrag öffnet ihn, Klick auf leeren Tag legt Termin an. Am Handy Wochenleiste und Tag. Kalender-Abo bleibt. | BESTANDEN | `bildschirmfotos/1440-normal_termine.jpg`, `1440-normal_termine_a.jpg` (geöffneter Termin), `375-normal_termine.jpg`, Video `bewegung/02-kalender-*.webm`, Prüfzeilen "Kalender" in `pruefung/ergebnis-funktionen.txt` |
| 2 | "App aufs Handy" aus dem Menü. Einstieg beim ersten Anmelden in genau vier Schritten, überspringbar, nicht wiederholt, im Konto wieder aufrufbar, iPhone und Android getrennt mit markierten Tippstellen, Videobereich. | BESTANDEN, mit zwei Einschränkungen (siehe "Offen") | `bildschirmfotos/1440-normal_einstieg_0.jpg` bis `_3.jpg`, `1440-normal_einstieg_2_a.jpg` (Android), `375-normal_einstieg_2.jpg` (iPhone), `375-normal_einstieg_2_android.jpg`, Video `bewegung/03-einstieg-*.webm`, Prüfzeilen "Einstieg" |
| 3 | Alle Texte neu. "in deiner Kundenübersicht" statt "in deinen Kunden". Keine schiefen Bilder. Die vier abgenommenen Überschriften wörtlich. | BESTANDEN | `pruefung/ergebnis-texte.txt` (32 Ansichten durchsucht, 0 Treffer), Prüfzeile "Mehr: vier Angebote mit abgenommenen Überschriften" |
| 4 | Bilder aus einem Guss. Flyer-Foto: Handy hochkant mit echtem Flyer aus dem Editor, kein leerer Bildschirm. Neue Fotos brauchen nur neue Dateien. | BESTANDEN, mit einer Einschränkung (siehe "Offen") | `bildschirmfotos/1440-normal_tools.jpg`, `1440-normal_start.jpg`, Prüfzeile "Start: Flyer liegt auf dem Handy im Foto" |
| 5 | Landingpage: klar, was der Besucher sieht und was ich eintrage, mit echter Vorschau. Eigene Verkaufsansicht ohne Freischaltung. | BESTANDEN | `bildschirmfotos/1440-normal_tools_seite.jpg`, `375-normal_tools_seite.jpg`, `1440-gesperrt_tools_seite.jpg`, `375-gesperrt_tools_seite.jpg`, Prüfzeilen "Landingpage" |
| 6 | Flyer-Editor: klarer Ablauf mit großer Vorschau. 1 Motiv und Farben, 2 Text, 3 Formate und Speichern. flyer.js unverändert. | BESTANDEN | `bildschirmfotos/1440-normal_flyer.jpg`, `375-normal_flyer.jpg`, Video `bewegung/04-flyer-und-landingpage-*.webm`, Prüfzeilen "Flyer". flyer.js ist Byte für Byte die Datei aus dem Paket. |
| 7 | Unterlagen: ruhiges, einheitliches Raster. | BESTANDEN | `bildschirmfotos/1440-normal_wissen.jpg`, `375-normal_wissen.jpg`, Prüfzeile "Wissen: Unterlagen im einheitlichen Raster" (alle Titelbilder gleich breit und gleich hoch) |

## Was neu ist, in Kürze

**Ein Look nach der CI.** Grund Beige, Flächen in gebrochenem Weiß, Haarlinien statt Schatten, keine Verläufe, Ecken 4 Pixel. Jost für Überschriften, Inter für Text. Große helle Kapitelzahlen als wiederkehrendes Element. Olive tief gibt es nur als sparsame Bühne: ein dunkler Blickpunkt je Seite.

**Start.** Begrüßung nach Tageszeit, drei Zahlen zum Tag (Termine heute, Rückrufe, neue Anfragen), darunter dein nächster Termin als dunkler Blickpunkt mit Route und Anruf. Dann Tagesplan, Neuigkeiten, Tools.

**Kalender.** Am Computer der Monat, jeder Tag ein Feld. Am Handy eine Wochenleiste zum Wischen und der gewählte Tag als Liste. Fünf Farben nach Art. Der Umschalter zur Liste bleibt.

**Einstieg.** Vier Schritte: Willkommen, das Wichtigste, Portal aufs Handy, fertig. Die Anleitung für iPhone und Android steckt in Schritt 3 und ist im Konto jederzeit wieder da. Die alte Adresse `#app` führt dorthin.

**Landingpage.** Eigene Ansicht unter Tools. Links trägst du ein, wie man dich erreicht. Rechts siehst du im Handy, was dein Besucher sieht. Die Vorschau läuft beim Tippen mit. Mit "Ganze Seite" lädt die echte Landingpage ins Handy.

**Verkaufsansichten.** Jeder nicht freigeschaltete Bereich zeigt, was er bringt, was er kostet ([Preis folgt]) und wie man ihn in drei Schritten freischaltet.

**Bewegung.** Seiten bauen sich gestaffelt auf, der Monat gleitet in Blätterrichtung, Einträge erscheinen nacheinander, Blätter kommen am Handy von unten, der Einstieg gleitet seitlich. Alles zwischen 180 und 600 Millisekunden. Wer am Gerät "Bewegung reduzieren" eingestellt hat, sieht keine Bewegung.

## Abnahmetabelle

Eine Zeile je Prüfung. Was nicht geprüft werden konnte, steht als NICHT BESTANDEN da.

### Gestaltung

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Farben nur aus der CI, als Variablen | BESTANDEN | `website/partner/portal.css`, Abschnitt `:root` |
| Kein reines Weiß auf Portalflächen | BESTANDEN | Flächen nutzen `--c-surface` (#FBF9F4). Reines Weiß nur in den Handybildern der Anleitung, die fremde Bildschirme zeigen, und hinter dem QR-Code |
| Haarlinien statt Schatten, keine Verläufe | BESTANDEN | In portal.css gibt es keine `box-shadow` mit Unschärfe und kein `gradient` |
| Radius 4 Pixel, höchstens 8 | BESTANDEN | `--radius`, `--radius-gross`. Ausnahme: runde Punkte, Kontaktknöpfe in der Vorschau (so zeigt sie die echte Landingpage) und die Handyrahmen |
| Jost 500 für Überschriften, Inter für Text, selbst gehostet | BESTANDEN | portal.css, `../schriften/` |
| Ein Hauptknopf je Ansicht | BESTANDEN | Bildschirmfotos aller Seiten |
| Kontrast AA für Text | BESTANDEN | 25 Farbpaare gerechnet, alle Textpaare ab 4,8 : 1. Drei Stellen wurden nachgebessert (Platzhalter, Tage des Nachbarmonats, Motivnamen) |
| Kapitelzahlen in Khaki hell | BESTANDEN als Schmuck | Kontrast 1,55 : 1, darum für Vorleseprogramme ausgeblendet. Sie tragen keine Information |
| Fotos aus einer Serie, gleiche Dateinamen | BESTANDEN | `website/partner/bilder/portal-*.jpg` |
| Kein KI-Look (Leuchtflecken, Glas, Mausschein, Wellen) | BESTANDEN | Bildschirmfotos |

### Funktionen Partner (Computer 1440 und Handy 375)

Alle Zeilen stehen einzeln in `pruefung/ergebnis-funktionen.txt`. Das Prüfskript ist `pruefung/klick-k2.js`.

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Anmelden, Registrieren, Fehlermeldungen | BESTANDEN | Zeilen "Anmeldeseite", "Registrieren", "Anmelden" |
| Start: Zahlen, nächster Termin, Zahl führt zu gefilterten Kunden | BESTANDEN | Zeilen "Start" |
| Kunden: Liste, Filter, Suche, Karte ohne Neuladen, Scrollposition | BESTANDEN | Zeilen "Kunden" |
| Karteikarte: Stand, Stufe, nächster Schritt, Notiz, Angaben ändern, ablegen, Termin, Bestellstand | BESTANDEN | Zeilen "Karte" |
| Kunde eintragen | BESTANDEN | Zeile "Kunden: Kunde eintragen" |
| Kalender Computer: Monat, Eintrag öffnen, leerer Tag, blättern, Heute | BESTANDEN | Zeilen "Kalender" |
| Kalender Handy: Woche, Tag, blättern, Termin am Tag | BESTANDEN | Zeilen "Kalender am Handy" |
| Termine: Liste, löschen, Kalender-Abo, Adresse `#termine/neu` | BESTANDEN | Zeilen "Termine" |
| Tools: Reihenfolge, Bestell-Link, QR, Abwicklung, Assistent | BESTANDEN | Zeilen "Tools" |
| Landingpage: Vorschau läuft mit, Prüfung des Termin-Links, Speichern | BESTANDEN | Zeilen "Landingpage" |
| Flyer: Motiv, Farbe, Text, Formate, Großansicht, Blättern, Speichern | BESTANDEN | Zeilen "Flyer" |
| Wissen: Unterlagen, Produktwissen, Einwände | BESTANDEN | Zeilen "Wissen" |
| Neuigkeiten mit Zähler, Mehr, Konto, Abmelden | BESTANDEN | Zeilen "Neuigkeiten", "Mehr", "Abmelden" |
| Einstieg: vier Schritte, beide Systeme, überspringen, nicht wiederholen, wieder öffnen | BESTANDEN | Zeilen "Einstieg" |
| Alte Adressen `#werkzeuge` und `#app` | BESTANDEN | Zeilen "Alte Adresse" |
| Kein Überlauf nach rechts auf 14 Ansichten | BESTANDEN | Zeile "Alle 14 Ansichten" |
| Keine Fehler in der Browser-Konsole | BESTANDEN | letzte Zeilen der Datei |
| Flyer aus Telegram in den Chat schicken (`#tg=`) | NICHT BESTANDEN (nicht prüfbar) | Braucht den echten Assistenten. Der Code dafür ist unverändert übernommen |

### Funktionen Backoffice

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Schalter nur für Team, normales Konto kommt nicht hinein, daten.js wird dann nicht geladen | BESTANDEN | `pruefung/ergebnis-backoffice.txt` |
| Übersicht, Aufgaben, Kalender, Bestellungen, Kunden, Partner, Maschinen, Unterlagen, Auswertung, Meine Zahlen, Wohnung | BESTANDEN | ebenda, 25 Zeilen |
| Vertrag aus Bestellung erstellen | BESTANDEN, mit Hinweis | Die PDF-Formulare liegen nicht im Paket von Korrektur 2. Für die Prüfung kamen sie aus dem Paket vom Backoffice-Nachtrag |
| Eine Abmeldung für Partner und Backoffice | BESTANDEN | Zeile "Abmelden im Backoffice meldet überall ab" |
| Automatische Backoffice-Anmeldung für Team (team-zugang) | NICHT BESTANDEN (nicht prüfbar) | Braucht die echte Supabase-Funktion. Der Code ist unverändert |
| Bilder der Wohnung | NICHT BESTANDEN (nicht prüfbar) | Die Fotos liegen nicht im Paket |

### Texte

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Kein "Werkzeug" | BESTANDEN | `pruefung/ergebnis-texte.txt`: 0 |
| Kein "Wasser-Check-Seite" | BESTANDEN | 0 |
| Kein "in deinen Kunden" | BESTANDEN | 0 |
| Kein Gedankenstrich in sichtbaren Texten | BESTANDEN | 0 |
| Kein Network, Downline, passives Einkommen, Verkostung | BESTANDEN | 0 |
| Prozent mit Leerzeichen | BESTANDEN | 0 Treffer ohne Leerzeichen |
| Preise nicht erfunden | BESTANDEN | Überall "[Preis folgt]" |
| Abgenommene Überschriften wörtlich | BESTANDEN | Prüfzeile "Mehr" |

### Bewegung

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Echte Aufnahmen, kein Nachbau | BESTANDEN | acht Videos in `bewegung/` (Computer 1440, Handy 390) |
| Keine einmalige Bewegung über 600 Millisekunden | BESTANDEN | `pruefung/ergebnis-bewegung.txt`: längste 600 ms (Foto beim Überfahren) |
| "Bewegung reduzieren" schaltet alles ab | BESTANDEN | ebenda: 0 laufende Animationen auf 13 Ansichten |
| Dauerschleifen nur mit Sinn | BESTANDEN | Zwei: die Nachrichten des Assistenten und die pulsierende Tippstelle der Anleitung |
| Inhalte bleiben nie unsichtbar, falls eine Animation stockt | BESTANDEN | Die Einblendklasse wird nach dem Auftritt entfernt (partner.js, `Bewegung.rein`) |
| Flüssigkeit auf echten, älteren Handys | NICHT BESTANDEN (nicht geprüft) | Nur im Browser der Prüfumgebung gemessen |

### Geräte und Breiten

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| 1440 Computer | BESTANDEN | `bildschirmfotos/1440-*.jpg` |
| 375 Handy | BESTANDEN | `bildschirmfotos/375-*.jpg` |
| 360 und 390 Handy | BESTANDEN | `bildschirmfotos/360-*.jpg`, `390-*.jpg` |
| 768 Tablet | BESTANDEN | `bildschirmfotos/768-*.jpg`. Das Tablet im Hochformat bekommt die Handy-Ansicht |
| Echtes iPhone in Safari, echtes Android in Chrome | NICHT BESTANDEN (nicht geprüft) | Es standen keine echten Geräte zur Verfügung |
| Installation als App auf echtem Gerät | NICHT BESTANDEN (nicht geprüft) | wie oben |

### Technik und Regeln

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Nichts veröffentlicht | BESTANDEN | Nur Dateien in diesem Ordner |
| Keine neue SQL | BESTANDEN | Kein SQL in dieser Lieferung |
| Datenbank nur über `uk_partner_*` | BESTANDEN | partner.js, keine Tabellenzugriffe |
| Öffentlicher Schlüssel bleibt Platzhalter | BESTANDEN | `sb_publishable_XXX` in partner.js |
| Altes Dashboard, daten.js, flyer.js, backoffice.js unverändert | BESTANDEN | Dateien gleichen dem Paket |
| Kein Framework, kein Build-Schritt | BESTANDEN | Reines HTML, CSS, JavaScript |
| Mit echter Datenbank geprüft | NICHT BESTANDEN (nicht geprüft) | Alles lief mit den Probedaten der Vorschau |
| Ladezeit gemessen (Lighthouse) | NICHT BESTANDEN (nicht geprüft) | Keine Messung. portal.css hat 84 KB, partner.js 139 KB, beides unkomprimiert |
| Bedienung nur mit Tastatur, Vorleseprogramm | NICHT BESTANDEN (nicht vollständig geprüft) | Fokusrahmen, Beschriftungen und echte Dialoge sind eingebaut. Ein Durchgang mit Vorleseprogramm fehlt |

## Offen und ehrlich

1. **Stand des Einstiegs je Gerät.** Ob jemand den Einstieg gesehen hat, merkt sich das Portal je Partner auf dem jeweiligen Gerät. Auf einem zweiten Gerät erscheint er also einmal neu. Für "einmal für alle Geräte" braucht es eine kleine neue SQL-Datei. Die habe ich wegen der Regel "keine neue SQL ohne zwingenden Grund" nicht gebaut. Sag Bescheid, wenn du sie möchtest.
2. **Video zur Installation fehlt.** Der Bereich steht in Schritt 3 mit einem Platzhalter. Sobald die Dateien da sind: in `partner.js` bei `EINSTIEG_VIDEO` die Pfade eintragen, zum Beispiel `video/app-iphone.mp4` und `video/app-android.mp4`.
3. **Zwei Fotos vorläufig.** Das Flyer-Foto ist jetzt das Handy hochkant (vorher das Foto des Assistenten). Für den Assistenten habe ich einen Ausschnitt des Anmelde-Fotos genommen, damit kein leerer Bildschirm zu sehen ist. Dasselbe Motiv steht damit an zwei Stellen. Mit der neuen Serie reicht es, die Dateien in `partner/bilder/` unter gleichem Namen zu ersetzen.
4. **Neues Flyer-Foto.** Der Flyer wird per Code auf den Handybildschirm gelegt. Die Lage steht in `partner.js` bei `FLYER_SCHIRM` in Prozent. Zeigt das neue Foto das Handy an anderer Stelle, müssen diese vier Zahlen angepasst werden. Zeigt es kein Handy von vorn, `FLYER_SCHIRM = null` setzen.
5. **Vorschau "Ganze Seite".** Die echte Landingpage lädt im Handy. Ob dort dein Kontaktbereich mit deinen gespeicherten Angaben erscheint, konnte ich ohne echte Datenbank nicht sehen.
6. **Preise.** Überall steht "[Preis folgt]".
7. **Produktwissen.** Die roten Marken "[FEHLT: ...]" stehen weiter dort, wo Fakten fehlen. Ich habe nichts erfunden.

## Geänderte Dateien

Im Ordner `website/partner/`:

- `portal.css` neu geschrieben
- `partner.js` Ansichten neu, Logik übernommen
- `index.html` Versionsnummern und Farbe der Statusleiste
- `manifest.webmanifest` Beschreibung ohne "Werkzeuge", helle Farbe
- `bilder/portal-flyer.jpg` und `bilder/portal-assistent.jpg` neu zugeordnet

Alles andere in `website/` ist unverändert aus dem Paket.

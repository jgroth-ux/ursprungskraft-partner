# Phase 2: Prototyp

Stand: 10.11.2026. Gezeigt werden: Landingpage vom Anfang bis einschließlich Rechner, E-Book-Cover und eine
Kapitelseite (Seite 3), jeweils für Kevin und Johny. Bilder in `_pruefung/phase-2/`.
Alles unterhalb des Rechners und die übrigen E-Book-Seiten haben schon die neuen Farben und Schriften,
sind aber noch nicht fertig gestaltet. Das folgt nach der Freigabe in Phase 3.

## Was sich geändert hat

| Datei | Änderung | Grund |
|---|---|---|
| `01-landingpage/partner/empfehlung.css` | neu geschrieben | neues Aussehen: dunkler Grund, Felder, Akzent je Sportler über `body[data-kurz]` |
| `01-landingpage/partner/_vorlage/seite.html` | `<span class="betont">` um „Trinkst du auch gut?“ (Text unverändert); Leiste unten `<nav class="dock">` mit drei Sprungmarken, darin der bisherige `.handyknopf` (gleiche Klasse, gleicher Link); Versionsnummer der CSS- und JS-Einbindung | Akzent in der Überschrift, Leiste aus der Schaltzentrale, Cache |
| `01-landingpage/partner/kevin/index.html`, `johny/index.html` | neu gebaut mit `bauen.py` | |
| `01-landingpage/partner/empfehlung.js` | **nicht geändert** | Die Leiste erscheint und verschwindet über die bestehende Logik des Handy-Knopfs (`.handyknopf.zeigen`). |
| `02-ebook/quellen-html/ebook.css` | neu geschrieben | helles Papier, Graphit, Akzent je Sportler |
| `02-ebook/quellen-html/vorlage.html` | Cover zeigt das Sportlerfoto statt `wasser.jpg` (nutzt den vorhandenen Wert `foto_pos_titel`); `<body>` bekommt die Akzentfarben | Sportler-Cover |
| `02-ebook/quellen-html/bauen.py` | je Sportler vier Farbwerte (`akzent`, `akzent_auf`, `akzent_hell`, `akzent_dunkel`) | weitere Sportler bekommen ihre Farbe an derselben Stelle |
| `02-ebook/ebook-kevin.pdf`, `ebook-johny.pdf` | neu erzeugt, je 14 Seiten A4 | Vorschau |

## Geprüft

- Beide Seiten über `bauen.py` gebaut, keine übrigen `{{`.
- Rechner: 90 kg ergibt 3,6 Liter, „rund 1.310 Liter … 146 Sechserträger“. 75 kg ergibt 3,0 Liter, 1.100 Liter, 122 Sechserträger.
- Kein waagrechtes Scrollen bei 1440, 768, 375 und 320 px (gemessen über die Seitenbreite).
- E-Book: beide PDFs 14 Seiten A4 hochkant. Seite 3 endet 9 mm über der Fußzeile.

## Offen für Phase 3

- `wasser.jpg` (bisheriges Cover-Foto) wird nicht mehr auf dem Cover gezeigt. Vorschlag: im E-Book an anderer Stelle einsetzen, zum Beispiel bei „Der dritte Weg“ in Kapitel 2.
- Die Cover-Vorschaubilder auf der Landingpage (`bilder/partner/ebook-*.jpg`) werden aus den fertigen PDFs neu erzeugt.
- Die Sportlerfotos sind Platzhalter, bis Kevin und Johny ihre Lieblingsfotos schicken.

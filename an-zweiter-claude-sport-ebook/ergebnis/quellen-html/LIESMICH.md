# HTML-Quellen E-Book

- `vorlage.html`: der gemeinsame Inhalt beider Fassungen. Text hier ändern.
- `bauen.py`: Vorwort, Foto, Rolle und Link je Sportler. Baut `ebook-kevin.html` und `ebook-johny.html`.
- `ebook.css`: Gestaltung (A4 hochkant). `schriften/` und `bilder/` liegen daneben.

Neu bauen:

    python3 bauen.py

PDF erzeugen: die HTML-Datei in Chrome öffnen, Drucken, „Als PDF speichern“, Ränder „Keine“,
Hintergrundgrafiken an. Oder per Playwright `page.pdf({preferCSSPageSize:true, printBackground:true})`.
Am Bildschirm zeigt die HTML-Datei die Doppelseiten nebeneinander.

Weitere Sportler: in `bauen.py` einen Eintrag in `SPORTLER` ergänzen und ein Foto in `bilder/` legen.

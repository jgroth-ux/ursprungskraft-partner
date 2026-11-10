# HTML-Quellen E-Book

- `vorlage.html`: der gemeinsame Inhalt beider Fassungen. Text hier ändern.
- `bauen.py`: je Sportler Vorwort, Foto, Rolle und Link. Baut `ebook-kevin.html` und `ebook-johny.html`.
  Enthält auch den Feinsatz (Trennregeln, siehe unten) und die pH-Farben.
- `ebook.css`: Gestaltung, A4 hochkant. `schriften/` und `bilder/` liegen daneben.
- `pdf-erzeugen.js`: macht aus der HTML-Datei das PDF (Playwright mit Chromium).

## Neu bauen

    python3 bauen.py
    node pdf-erzeugen.js "$PWD/ebook-kevin.html" "$PWD/../ebook-kevin.pdf"
    node pdf-erzeugen.js "$PWD/ebook-johny.html" "$PWD/../ebook-johny.pdf"

Auf Jasmins Rechner fehlt Playwright. Dort stattdessen mit Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=ZIEL.pdf "file://$PWD/ebook-kevin.html"`. Ergibt ebenfalls 14 Seiten A4 mit allen Links.

Am Bildschirm zeigt die HTML-Datei die Doppelseiten nebeneinander, im PDF steht jede Seite für sich.

## Satzregeln (von Jasmin festgelegt, bitte beibehalten)

- Freier Fließtext im Blocksatz. In Kästen, Aufzählungen, schmalen Spalten und Zitaten linksbündig.
- Keine automatische Silbentrennung. Getrennt wird nur an den Wortfugen der Liste `TRENNFUGEN` in `bauen.py`
  (zum Beispiel Plastik-flasche). Kurze Wörter wie trinken, Küche, Geschmack, Training werden nie getrennt.
  Überschriften werden gar nicht getrennt.
- Zahlen bleiben beim folgenden Wort (146 Sechserträger), Bindestrich-Wörter bleiben zusammen (Kangen-Gerät),
  „und“, „oder“, „pH“ stehen nicht allein am Zeilenende.
- Keine Gedankenstriche, Prozent als „20 %“, keine Warnhinweise, keine ausgeschriebenen Links im Text.

## Bilder

Die Screenshots `bilder/ronaldo-georgina.jpg` und `bilder/eddie-hall.jpg` sind seit 03.11.2026 drin (Poster aus website/bilder/partner/).
Andere Datei unter demselben Namen ablegen und neu bauen, dann erscheint sie automatisch und ist auf `…/partner/<name>/#video` verlinkt.

Weitere Sportler: in `bauen.py` einen Eintrag in `SPORTLER` ergänzen und ein Foto in `bilder/` legen.

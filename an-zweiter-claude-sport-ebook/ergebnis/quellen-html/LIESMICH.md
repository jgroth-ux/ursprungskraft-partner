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

Fehlen noch: `bilder/ronaldo-georgina.jpg` und `bilder/eddie-hall.jpg` (Screenshots aus den Videos für Kapitel 7).
Einfach ablegen und neu bauen, dann erscheinen sie automatisch und sind auf `…/partner/<name>/#video` verlinkt.

Weitere Sportler: in `bauen.py` einen Eintrag in `SPORTLER` ergänzen und ein Foto in `bilder/` legen.

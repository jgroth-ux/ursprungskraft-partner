# Auftrag: Sportseite und E-Book für Kevin und Johny neu gestalten

Von Jasmin Groth. Du arbeitest ohne Zugriff auf ihren Rechner, ihre Konten oder ihre Server.
Alles, was du brauchst, liegt in diesem Paket. Fehlt etwas, fragst du nach, statt zu raten.

## Worum es geht

Für das Kangenwasser-Projekt **Ursprungskraft** (Daniel Zürcher, Schweiz, Enagic-Vertrieb) gibt es
zwei Sportler als Empfehlungspartner:

- **Kevin Wolter**, Bodybuilder, Instagram @wolterkevin, 216.000 Follower auf Instagram,
  617.000 Abonnenten auf YouTube
- **Johny Yusupov**, MMA-Fighter, Instagram @johny_yusupov, 83.100 Follower auf Instagram,
  33.900 Abonnenten auf YouTube

Jeder hat eine eigene **Landingpage** (online unter `mein.ursprungskraft.net/partner/kevin/` und
`…/partner/johny/`) und ein eigenes **E-Book** „Das unterschätzte Supplement“ (14 Seiten, A4 hochkant,
PDF), das man auf der Landingpage herunterlädt. Beide Seiten und beide E-Books sind gleich, bis auf
Name, Foto, Rolle, Vorwort, Zahlen und Link.

**Inhaltlich steht alles. Die Gestaltung gefällt Jasmin nicht.** Du baust beides gestalterisch
komplett neu, angelehnt an einen neuen Stil, den Jasmin dir zeigt (siehe `04-neuer-stil/`).
Texte, Zahlen, Rechner, Formulare und Abläufe bleiben.

## Was im Paket ist

| Ordner | Inhalt |
|---|---|
| `01-landingpage/partner/_vorlage/` | `seite.html` (die Vorlage mit Platzhaltern `{{…}}`), `partner.json` (Daten je Sportler), `bauen.py` (baut daraus `kevin/index.html` und `johny/index.html`) |
| `01-landingpage/partner/kevin/`, `johny/` | die heute gebauten Seiten, zum Ansehen |
| `01-landingpage/partner/empfehlung.css`, `.js` | heutige Gestaltung und Logik (Rechner, Zähler, Formulare, Absenden) |
| `01-landingpage/bilder/partner/` | alle Fotos, Videos (`.mp4`) und Untertitel (`.vtt`) der Seite |
| `01-landingpage/schriften/` | Inter und Jost, selbst gehostet |
| `01-landingpage/partner/ebook/` | die PDFs, die heute zum Download hinterlegt sind |
| `02-ebook/quellen-html/` | E-Book als HTML: `vorlage.html` (Inhalt), `bauen.py` (je Sportler, Trennregeln), `ebook.css`, Bilder, Schriften, `pdf-erzeugen.js`, `LIESMICH.md` |
| `02-ebook/ebook-*.pdf`, `offene-fragen.md` | letzter PDF-Stand und die noch offenen Inhaltsfragen |
| `03-marke/ursprungskraft-ci.md` | Farben, Schriften, Abstände, Tonalität von Ursprungskraft |
| `04-neuer-stil/` | **hier legt Jasmin die Beispiele für den neuen Stil hinein** (Screenshots, Links, Datei). Ist der Ordner leer, frag sie zuerst danach |
| `05-quellen/kangenwasser-wissensbasis.md` | Fachwissen zum Gerät, falls du einen Begriff prüfen musst |

Schlüssel und Serveradressen sind durch `XXX` ersetzt (in `empfehlung.js`). Das Absenden der Formulare
funktioniert in deiner Vorschau deshalb nicht. Das ist gewollt. Lass die Logik und die Feldnamen genau
so, wie sie sind, Jasmin setzt die echten Werte auf ihrer Seite wieder ein.
Die Seite lädt außerdem `../../vendor/supabase.js`, `../../dashboard/daten.js`, `../../impressum.html`
und `../../datenschutz/`. Die liegen nicht im Paket. Pfade nicht ändern.

## So gehst du vor

1. **Lies erst alles**: dieses Dokument, `03-marke/ursprungskraft-ci.md`, `02-ebook/quellen-html/LIESMICH.md`,
   dann `seite.html` und `vorlage.html`. Schau dir die Beispiele in `04-neuer-stil/` an.
2. **Beschreib Jasmin in wenigen Sätzen, was du am neuen Stil siehst** und was du daraus übernehmen
   willst (Flächen, Schrift, Bildeinsatz, Raster, Bewegung). Warte auf ihr Ja.
3. **Ein Beispiel zuerst, nicht alles.** Bau zuerst den Kopfbereich der Landingpage (bis einschließlich
   Rechner) und die Titelseite plus eine Kapitelseite des E-Books. Zeig das. Erst nach ihrem Ja baust
   du den Rest.
4. **Dann komplett**: Landingpage über `seite.html` + Stylesheet, E-Book über `vorlage.html` + `ebook.css`.
   Immer über die Vorlagen und `bauen.py`, nie nur die fertige `kevin/index.html` umschreiben, sonst
   laufen die zwei Fassungen auseinander. Danach beide Fassungen neu bauen und beide PDFs erzeugen.
5. **Prüfen, bevor du zeigst** (Liste unten), und Jasmin pro Punkt eine Zeile mit bestanden oder nicht
   bestanden geben.

## Was bleiben muss

- **Alle Texte wörtlich**, auch die Wirkungsaussagen und das Eddie-Hall-Zitat. Keine Warnhinweise,
  keine Moral- oder Rechtssätze dazuschreiben. Willst du einen Satz ändern, schlag ihn vor, ändere ihn nicht.
- **Alle Abschnitte und Anker**: `#rechner`, `#video`, `#interesse`, `#ebook`. Das E-Book verlinkt
  auf `…/partner/<name>/#video` und auf die Seite selbst.
- **Alle IDs und Feldnamen aus `seite.html`**, auch die, an denen `empfehlung.js` hängt (zum Beispiel `kg`, `liter`, `jahr`,
  `anfrage`, `senden`, `fehler`, `buchform`, `umschauen`, `kontaktfelder`, `data-zahl`). Brauchst du neue
  Klassen, gern, aber die alten Haken bleiben dran. Wenn du am JS etwas änderst, sag genau was.
- **Die Platzhalter `{{…}}`** in `seite.html` und die Struktur von `partner.json`. Weitere Sportler
  kommen später dazu, das System muss für jeden funktionieren.
- **Die Videos mit deutschen Untertiteln**, die Datenschutz-Einwilligung, Impressum und Datenschutz unten.
- **E-Book: 14 Seiten A4 hochkant**, gleiche Reihenfolge. Die Satzregeln aus `LIESMICH.md` gelten
  weiter: Blocksatz im freien Fließtext, keine automatische Silbentrennung, nur an den Fugen aus
  `TRENNFUGEN`, Zahlen bleiben beim folgenden Wort.

## Regeln für Gestaltung und Text

- **Darf nicht nach KI aussehen.** Keine Leuchtflecken, kein Lichtschein, der der Maus folgt, keine
  Glas-Pillen, keine Wellen als Übergang, keine Verläufe mit harter Kante, kein Maus-Symbol zum Scrollen.
  Hochwertig heißt hier: Ruhe, satte Flächen, große echte Fotos, klare Kanten. Ein Foto darf über eine
  Kante ragen. Bewegung nur dezent (Einblenden beim Scrollen, Hover).
- **Partner-Material ist neutral**: kein Ursprungskraft-Logo auf Seite und E-Book. Die Farbwelt aus
  der CI ist die Basis. Weicht der neue Stil davon ab, sag es Jasmin, bevor du die Farben änderst.
- **Zierschriften nur groß**, für Überschriften. Fließtext bleibt in einer gut lesbaren Schrift.
  Immer auf Handybreite prüfen (375 px).
- **Größen und Abstände rechnen, nicht schätzen**: Schriftgrößen in der Leiter 1,272, Abstände aus
  dem Raster der CI.
- **Keine Gedankenstriche** (– oder —) in sichtbarem Text. Prozent als „20 %“. Kein Gendern.
- **Sie haben Follower, nie Fans.** Das Wort „Fans“ kommt nirgends vor.
- **Keine ausgeschriebenen Links** im E-Book, nur verlinkte Knöpfe und Linktexte.
- Auf Pitch- und Schlussseite des E-Books wird das Gerät **nicht beim Namen** genannt (kein „K8“).
- Messi und Haaland kommen nicht vor.
- Keine Zahl erfinden. Steht eine Zahl nicht im Paket, fragst du.

## Fertig heißt

Gib Jasmin zu jedem Punkt eine Zeile mit bestanden oder nicht bestanden und dem Beleg:

1. Beide Landingpages neu gebaut über `bauen.py`, ohne übrige `{{`.
2. Rechner rechnet bei 90 kg wieder 3,6 Liter und „rund 1.310 Liter … 146 Sechserträger“.
3. Alle Anker vorhanden (`#rechner`, `#video`, `#interesse`, `#ebook`), alle IDs der alten `seite.html` auch in der neuen.
4. Seite auf 375 px Breite ohne waagrechtes Scrollen, Text nirgends abgeschnitten.
5. Beide E-Books mit genau 14 Seiten A4, alle Knöpfe und Video-Links klickbar.
6. Suche nach „Fans“, „–“, „—“, „Prozent“ ergibt null Treffer im sichtbaren Text.
7. Kein Text gegenüber dem alten Stand verändert, außer was Jasmin freigegeben hat (Liste der Änderungen).
8. Jede Kante zwischen zwei Abschnitten angesehen, keine KI-Effekte aus der Liste oben.

## Was du zurückgibst

Ein ZIP mit genau dieser Ordnerstruktur, damit Jasmin es eins zu eins einspielen kann:

- `01-landingpage/partner/_vorlage/seite.html`, `partner.json`, `bauen.py`
- `01-landingpage/partner/kevin/index.html`, `johny/index.html`
- das neue Stylesheet (gern weiter `empfehlung.css`) und `empfehlung.js`, falls geändert
- neue oder geänderte Bilder und Schriften, mit Dateinamen
- `02-ebook/quellen-html/` komplett, dazu `ebook-kevin.pdf` und `ebook-johny.pdf`
- `ERGEBNIS.md`: was du geändert hast, je Datei eine Zeile, die Fertig-Liste mit Belegen, und
  offene Fragen

## Wie du mit Jasmin redest

Kurz, klar, auf Deutsch, ohne Fachchinesisch. Ein Schritt nach dem anderen, keine langen Listen mit
Optionen. Mach einen Vorschlag und warte, statt mehrere Fassungen auf Verdacht zu bauen. Wenn sie
etwas kritisiert, änderst du genau das Element, das sie meint.

# Ursprungskraft: Corporate Design (CI)

Kompaktfassung des Design Systems zum Übernehmen in andere Projekte.
(Von Jasmin am 08.10.2026 gegeben, noch nicht abgesegnet. Aus dem gelesenen Inhalt übernommen,
weil die Originaldatei im Download-Ordner nicht mehr lag.)

## Farbwerte

| Token | Hex | Einsatz |
|---|---|---|
| ground | #F5F1E8 | Seitenhintergrund (Leinen-Beige). Standardfläche für Web, Social und eBook-Seiten. |
| surface | #FBF9F4 | Helle Karten, Formulare und Textboxen auf ground. Auch Schrift auf olive und olive-deep. |
| sand | #EAE3D3 | Ruhige Hinterlegung für Abschnitte, Infoboxen und Tabellenköpfe. Text darauf in ink oder muted. |
| line | #D9CFBA | Haarlinien (1px), Trenner, Rahmen von Karten und Eingabefeldern. Ersetzt Schatten. |
| khaki-light | #CFC4A0 | Helle Akzentfläche, Markierungen, Zitat-Hintergründe. Text darauf in ink. |
| khaki | #A8996A | Akzentfarbe für Flächen, Linien, Zahlen und Icons in Grafiken. Nie als Textfarbe auf ground (Kontrast zu gering). |
| olive | #4F5A35 | Markenfarbe: Buttons, Links, Überschriften-Akzente, Kapitelnummern. Text auf ground erfüllt AA (6.5:1). |
| olive-deep | #2F3524 | Dunkle Flächen: Hero, Footer, eBook-Cover, Kapitel-Trennseiten. Schrift darauf in surface oder khaki-light. |
| ink | #2A2C22 | Fließtext und Überschriften auf ground, surface und sand (12.5:1). |
| muted | #5F6152 | Sekundärtext: Unterzeilen, Bildunterschriften, Quellen, Metadaten (5.6:1 auf ground). |

## Schriften

- Überschriften: **Jost** 500 (Google Fonts)
- Fließtext: **Inter** 400, Hervorhebung 600 (Google Fonts)

| Stil | Schrift | Größe / Zeilenhöhe | Gewicht | Einsatz |
|---|---|---|---|---|
| display | Jost | 56px / 60px | 500 | Hero-Titel, eBook-Cover. Höchstens einmal pro Seite. |
| h1 | Jost | 40px / 46px | 500 | Seitentitel, Kapiteltitel im eBook. |
| h2 | Jost | 28px / 34px | 500 | Abschnittstitel. |
| h3 | Jost | 20px / 28px | 500 | Unterabschnitte, Kartentitel. |
| eyebrow | Inter | 12px / 16px | 600 | Kleine Großbuchstaben-Zeile über Überschriften, in olive. Immer in Versalien setzen. |
| body | Inter | 16px / 26px | 400 | Fließtext Web. Im eBook 11 pt mit 16 pt Zeilenabstand. |
| small | Inter | 13px / 20px | 400 | Bildunterschriften, Quellen, Fußzeilen, rechtliche Hinweise. Farbe muted. |

## Abstände und Radien

- **space-2** (8px): Abstand zwischen Eyebrow und Überschrift, Icon und Text.
- **space-4** (16px): Innenabstand kleiner Elemente, Abstand zwischen Absätzen.
- **space-8** (32px): Innenabstand von Karten und Infoboxen, Abstand zwischen Blöcken.
- **space-16** (64px): Abstand zwischen Sektionen einer Landingpage, Seitenrand im eBook (ca. 20 mm).
- **radius-none** (0): Nur für randabfallende Flächen (Cover-Hintergründe, Bildstreifen bis an den Seitenrand).
- **radius-sm** (4px): Standard: Bilder, Infoboxen, Tabellenköpfe, Tags, Buttons, Eingabefelder. Minimale Rundung, nie spitze Ecken.
- **radius-md** (8px): Größere Karten und Panels im Web. Nie größer.

---

## Brand Book
Corporate Design von Ursprungskraft, dem Kangenwasser-Vertrieb von Daniel. Ruhig, erdig, gerade. Olive und Khaki tragen die Marke, Beige-Töne geben Raum und Kontrast. Das System gilt für Landingpages, Social Media, WhatsApp-Kanal, Präsentationen, eBooks und Kundenunterlagen.

### Markenkern

„Kangen“ bedeutet sinngemäß Rückkehr zum Ursprung. Ursprungskraft steht für das, was dahinter liegt: gutes Wasser, ehrliche Beratung, persönliche Betreuung. Die Gestaltung wirkt wie ein Material aus der Natur, nicht wie ein Wellness-Prospekt.

Drei Prinzipien:
1. **Klar statt laut.** Viel Fläche, wenige Elemente, eine Aussage pro Abschnitt.
2. **Gerade statt verspielt.** Klare Linien, Haarlinien, minimal gerundete Ecken (`radius-sm` als Standard, höchstens `radius-md`). Keine spitzen Ecken bei Bildern und Boxen.
3. **Erdig statt steril.** Beige statt Weiß, Olive statt Blau. Wasser wird über Bilder erzählt, nicht über Blautöne.

### Tonalität

- Klar, ruhig, direkt, freundlich. Kunden werden geduzt.
- Kein Gendern, keine Gedankenstriche, keine Floskeln.
- Keine Heil- oder Gesundheitsversprechen. Erzählt wird über Geschmack, Alltag, Vielseitigkeit, Technik und Beratung.
- Kein Network-Marketing-Vokabular (Network, Downline, passives Einkommen, Geschäftsmöglichkeit).

Beispiel gut: „Ein Gerät, fünf Wasserarten. Für Küche, Pflege und Haushalt.“
Beispiel nicht: „Bring deinen Körper zurück ins Gleichgewicht!“

### Farben

Verteilung als Faustregel: 60 % Beige-Flächen (`ground`, `surface`, `sand`), 30 % Olive (`olive`, `olive-deep`), 10 % Khaki (`khaki`, `khaki-light`).

- **Hintergrund:** immer `ground` oder `surface`, nie reines Weiß.
- **Markenfarbe:** `olive` für Buttons, Links, Kapitelnummern, Eyebrows.
- **Dunkle Flächen:** `olive-deep` für Hero, Footer, eBook-Cover. Schrift darauf `surface`, Akzente `khaki-light`.
- **Akzent:** `khaki` für Linien, Zahlen in Grafiken, Icons, Flächen. Nie als Textfarbe auf Beige.
- **Text:** `ink` für Fließtext und Überschriften, `muted` für alles Sekundäre.
- **Linien:** `line` als 1px-Haarlinie. Keine Schatten, keine Verläufe.
- Verboten: Pink, Neonfarben, Blau-Lila-Verläufe, Glanz- und Glaseffekte.

### Typografie

- **Jost** (geometrisch, gerade) für Überschriften, Gewicht 500. Nie fett, nie kursiv.
- **Inter** für Fließtext, Gewicht 400, Hervorhebungen 600.
- Eyebrow-Zeile (`eyebrow`) in Versalien mit weiter Laufweite über Überschriften, Farbe `olive`.
- Linksbündig, kein Blocksatz. Zeilenlänge im Web max. 70 Zeichen.
- Beide Schriften sind Google Fonts und kostenlos nutzbar, auch in Google Docs. In Canva die Verfügbarkeit prüfen, sonst die Schriftdateien hochladen.

### Layout

- Raster: Abstände nur aus `space-2`, `space-4`, `space-8`, `space-16`.
- Sektionen trennen sich durch Flächenwechsel (`ground` → `sand` → `olive-deep`) oder eine Haarlinie, nicht durch Schatten.
- Bilder im Raster mit minimaler Rundung (`radius-sm`) und hauchdünnem Rahmen (1px `line`). Freigestellte Bilder (z. B. das Gerät) stehen auf einem `surface`-Panel mit Rahmen.
- Große, helle Kapitelnummern in Jost (`khaki-light`) als wiederkehrendes Gestaltungselement.
- Grafiken (Diagramme, Skalen) werden in den Markenfarben nachgebaut. Ausnahme: Die pH-Skala zeigt die realen Indikatorfarben (rot über grün bis violett).

### Rechtliches

Alle Unterlagen sind Informationen zu Gerät und Anwendung, keine medizinischen Ratgeber. Keine Heilversprechen, keine Krankheitsbezüge. Jedes eBook enthält vorne einen kurzen Hinweis „Kein medizinischer Ratgeber“ und hinten den rechtlichen Hinweis mit Markenvermerk.

### Bildsprache

Natürliches Licht, ruhige Flächen, echte Materialien: Wasser im Glas, Stein, Holz, Leinen, Pflanzen, Küche im Alltag, echte Menschen. Farbstimmung leicht zurückgenommen und warm. Keine Labor- oder Medizinbilder.

### Logo

Noch kein Logo vorhanden. Bis dahin gilt die Wortmarke: „URSPRUNGSKRAFT“ in Jost 500, Versalien, Laufweite ca. 0.12em, Farbe `olive` auf hellem Grund oder `surface` auf `olive-deep`. Optional darunter in `eyebrow`: „KANGENWASSER · BERATUNG“.

### Icons

Linien-Icons mit 1.5px Strichstärke, gerade Enden, Farbe `olive` oder `khaki` (z. B. Lucide). Keine gefüllten, bunten oder Emoji-Icons.

### Anwendungen

- **Landingpage:** Hero in `olive-deep` mit Titel `display` in `surface`, Inhalte auf `ground`, eine Sektion pro Thema, Button in `olive` mit `radius-sm`.
- **Social Media / WhatsApp:** Hintergrund `ground` oder `olive-deep`, eine Aussage pro Grafik, Farbband-Motiv am Rand.
- **eBooks und Dokumente:** siehe Abschnitt „eBooks und Dokumente“.

---

## eBooks und Dokumente

Vorlage für eBooks, Guides, Checklisten, Kundenunterlagen und PDFs von Ursprungskraft.

### Format

- A4 hochformatig, Seitenrand `space-16` (ca. 20 mm), unten 25 mm für die Fußzeile.
- Fließtext Inter 11 pt, Zeilenabstand 16 pt, Farbe `ink`, Hintergrund `ground`.
- Überschriften Jost 500: Kapitel 28 pt, Abschnitt 18 pt, Unterabschnitt 13 pt.

### Seitentypen

1. **Cover:** Hintergrund `ground`. Oben Logo bzw. Wortmarke in `olive`, darunter ein großes Bild mit `radius-sm` und Haarlinienrahmen, darunter Eyebrow, Titel in Jost 500 (44 bis 48 pt, `ink`) und Untertitel in Inter Light (`muted`). Unten eine Haarlinie mit dem Hinweis „Kein medizinischer Ratgeber“.
2. **Hinweis und Inhalt:** oben Box „Kein medizinischer Ratgeber“, darunter das Inhaltsverzeichnis.
3. **Inhaltsverzeichnis:** `ground`, Kapitelnummern zweistellig in Jost (`olive`), Haarlinien `line` zwischen den Einträgen.
4. **Kapitel-Startseite:** große Kapitelnummer (Jost, 96 pt, `khaki`), Eyebrow „KAPITEL 01“ in `olive`, Kapiteltitel, kurzer Einleitungssatz in `muted`.
5. **Inhaltsseite:** einspaltig, Eyebrow über Abschnittstiteln, Bilder im Satzspiegel mit `radius-sm` und 1px-Rahmen `line`.
6. **Rückseite:** `olive-deep`, Einladung zur Wasserverkostung, Kontakt, rechtlicher Hinweis in `small`.

### Bausteine

- **Infobox:** Fläche `sand`, `radius-sm`, Innenabstand `space-8`, Titel in `olive`. Für Tipps und Merksätze.
- **Hinweisbox:** Fläche `surface`, Rahmen 1px `line`, `radius-sm`. Für Sicherheits- und Rechtshinweise (z. B. pH 7,0 für Babynahrung).
- **Zitat:** Jost 18 pt, Farbe `olive`, links eine 2px-Linie in `khaki`.
- **Tabelle:** Kopfzeile `sand` mit Text in `ink` (Inter 600), Zeilen getrennt durch `line`, keine vertikalen Linien.
- **Zahlen und Kennwerte:** Jost 500 groß in `olive`, Beschriftung darunter in `small`, `muted`.
- **Checkliste:** Kästchen 1px `olive` mit `radius-sm`.

### Fußzeile

Links „Ursprungskraft“ in `eyebrow` (`muted`), rechts Seitenzahl in Inter 9 pt. Darüber eine Haarlinie `line`.

### Pflichtangaben

- Rechtlicher Hinweis auf der Rückseite: Informationen dienen der Orientierung, kein Ersatz für ärztliche Beratung, keine Heilversprechen.
- Bei Studien und Zahlen immer Quelle in `small` angeben.

### Hinweis zur Wortwahl (Jasmin, 08.10.2026)

Das Wort "Verkostung" wird bei Ursprungskraft nicht verwendet, auch nicht auf der Rückseite
(oben unter Seitentypen noch so formuliert, beim Umsetzen ersetzen).

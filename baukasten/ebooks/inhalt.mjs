// Inhalt der 9 E-Books (Entwurf, 12.11.2026). EINE Stelle für alle Texte. Daraus baut werkzeuge/ebooks-bauen.mjs
// jedes E-Book in jedem Look (Hell, Dunkel, sieben Akzente). Name, Foto, Kontakt, Link und QR-Code des Partners
// kommen beim Abruf dazu (supabase/functions/partner-ebook).
// Regeln: du, kurze Sätze, keine Gedankenstriche, keine Heilversprechen, keine Krankheiten, nichts erfinden.
// pH 11,5 und pH 2,5 nie als Trinkwasser. Nicht "Kangen" als Marke, sondern "das Gerät" oder "Wasserionisierer".
// Jede Seite muss auf eine A4-Seite passen. Das Werkzeug meldet, wenn eine Seite überläuft.
//
// kurz = zwei Sätze für die Landingpage und das Portal.
// Bausteine einer Inhaltsseite: { p }, { liste: [] }, { check: [] }, { box: { titel, text } },
// { hinweis: { titel, text } }, { tabelle: { kopf: [], zeilen: [[]] } }, { bild: { src, alt } }, { arten: true },
// { weiter } (kleiner Kasten am Kapitelende, verlinkt auf die Seite des Partners), { quelle }.

const B = (n) => `/p/bilder/${n}.jpg`;   // Fotos der Landingpages
const E = (n) => `/ebooks/bilder/${n}.jpg`; // Fotos nur für die E-Books

const WEITER = {
  geraet: 'Du willst das Gerät in echt sehen? Auf der letzten Seite steht, wie du es persönlich kennenlernst.',
  probieren: 'Probieren geht über Lesen. Wie du das Wasser selbst kennenlernst, steht auf der letzten Seite.',
  fragen: 'Noch Fragen? Melde dich einfach. Wie, steht auf der letzten Seite.',
};

export const THEMEN = { neutral: 'Neutral', sport: 'Sport', gesundheit: 'Gesundheit' };

export const BUECHER = [
  // ============================================================== NEUTRAL
  {
    id: 'fuenf-wasserarten', thema: 'neutral', standard: true,
    titel: 'Ein Gerät, fünf Wasserarten', untertitel: 'Was dein Wasser im Alltag alles kann',
    kurz: 'Was das Gerät macht, wofür du welche der fünf Wasserarten nimmst und wie ein Tag damit aussieht. Mit Checkliste: Passt das Gerät zu dir?',
    eyebrow: 'E-Book', cover: B('glas-hahn'),
    weiterTitel: 'Lern das Gerät persönlich kennen',
    weiterText: 'Lesen ist das eine. Das Wasser selbst probieren, die fünf Wasserarten sehen und alle Fragen stellen, das ist das andere.',
    seiten: [
      { kapitel: '01', titel: 'Was das Gerät macht', intro: 'Ein Wasserionisierer hängt an deinem Wasserhahn und macht aus Leitungswasser fünf verschiedene Wasserarten.',
        bloecke: [
          { bild: { src: B('glas-hahn'), alt: 'Ein Glas wird am Wasserhahn gefüllt' } },
          { p: 'Das Gerät steht neben deiner Spüle. Du drückst eine Taste, und aus dem Auslauf kommt genau das Wasser, das du gerade brauchst: zum Trinken, zum Kochen, für die Haut oder zum Putzen.' },
          { p: 'Zuerst läuft das Leitungswasser durch einen Filter. Danach teilt das Gerät es mit Strom auf, das nennt man Elektrolyse. So entstehen Wasserarten mit unterschiedlichen pH-Werten, von sauer bis basisch.' },
          { box: { titel: 'Kurz gesagt', text: 'Ein Gerät, fünf Wasserarten, direkt aus deinem Hahn. Keine Kisten, keine Flaschen, kein Schleppen.' } },
        ] },
      { kapitel: '02', titel: 'Die fünf Wasserarten', intro: 'Der pH-Wert sagt dir, wofür du welches Wasser nimmst. Zwei davon sind nur für den Haushalt, nicht zum Trinken.',
        bloecke: [
          { arten: true },
          { hinweis: { titel: 'Wichtig', text: 'pH 11,5 und pH 2,5 sind nicht zum Trinken. Das Gerät zeigt dir bei jeder Wasserart an, welche gerade läuft.' } },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '03', titel: 'Ein Tag mit dem Gerät', intro: 'So sieht das im Alltag aus. Von morgens bis abends, alles aus demselben Hahn.',
        bloecke: [
          { tabelle: { kopf: ['Wann', 'Was', 'Welches Wasser'], zeilen: [
            ['Morgens', 'Kaffee oder Tee', 'pH 8,5 bis 9,5'],
            ['Morgens', 'Gesicht erfrischen nach dem Duschen', 'pH 6,0'],
            ['Mittags', 'Obst und Gemüse waschen', 'pH 11,5'],
            ['Mittags', 'Nudeln kochen', 'pH 6,0'],
            ['Nachmittags', 'Wasserflasche für unterwegs füllen', 'pH 8,5 bis 9,5'],
            ['Abends', 'Schneidebrett und Spüle abwischen', 'pH 2,5'],
            ['Abends', 'Tabletten mit Wasser einnehmen', 'pH 7,0'],
          ] } },
          { bild: { src: E('gemuese-schale'), alt: 'Gemüse in einer Schale mit Wasser, daneben Kaffee und ein Glas Wasser' } },
        ] },
      { kapitel: '04', titel: 'Häufige Fragen', intro: 'Was die meisten wissen wollen, bevor sie sich ein Gerät genauer anschauen.',
        bloecke: [
          { box: { titel: 'Wie viel Platz braucht das Gerät?', text: 'Es steht neben der Spüle und wird an den Wasserhahn angeschlossen. Wie das bei dir aussieht, schaut ihr euch gemeinsam an.' } },
          { box: { titel: 'Was kostet so ein Gerät?', text: 'Die Geräte liegen im vierstelligen Bereich. Was genau zu dir passt und was es kostet, klärt ihr im Gespräch.' } },
          { box: { titel: 'Muss ich etwas kaufen, wenn ich mich melde?', text: 'Nein. Du lernst das Gerät kennen, stellst deine Fragen und entscheidest in Ruhe.' } },
          { box: { titel: 'Wie oft muss der Filter gewechselt werden?', text: '[FEHLT: Angabe zum Filterwechsel, bitte von Daniel ergänzen]' } },
          { weiter: WEITER.fragen },
        ] },
      { kapitel: '05', titel: 'Passt das Gerät zu dir?', intro: 'Hak ab, was auf dich zutrifft. Je mehr Haken, desto eher lohnt sich ein Blick auf das Gerät.',
        bloecke: [
          { check: [
            'Ich kaufe regelmäßig Wasser in Flaschen.',
            'Ich trage Kisten oder Sechserträger nach Hause.',
            'Ich trinke weniger, als ich mir vornehme.',
            'Mir schmeckt mein Leitungswasser nicht so richtig.',
            'Ich koche gern und viel frisch.',
            'Ich will weniger Plastik im Haushalt.',
            'In meinem Haushalt leben mehrere Menschen, die viel trinken.',
            'Ich möchte für Küche, Pflege und Putzen weniger verschiedene Mittel.',
          ] },
          { p: 'Drei Haken oder mehr? Dann lohnt sich ein Gespräch. Du siehst das Gerät, probierst das Wasser und entscheidest danach.' },
          { weiter: WEITER.probieren },
        ] },
    ],
  },
  {
    id: 'wasser-kueche', thema: 'neutral',
    titel: 'Wasser in der Küche', untertitel: 'Kochen, waschen, sauber machen: mit fünf Wasserarten',
    kurz: 'Kaffee, Tee, Kochen, Obst und Gemüse waschen und sauber machen: welches Wasser du wofür nimmst. Mit Spickzettel für den Kühlschrank.',
    eyebrow: 'E-Book', cover: B('kueche'),
    weiterTitel: 'Sieh dir das Gerät in deiner Küche vor',
    weiterText: 'Wie das Gerät an deinem Wasserhahn aussieht und wie es sich anfühlt, damit zu kochen, siehst du am besten persönlich.',
    seiten: [
      { kapitel: '01', titel: 'Kaffee und Tee', intro: 'Was du jeden Tag mehrmals machst, fängt beim Wasser an.',
        bloecke: [
          { bild: { src: E('gemuese-schale'), alt: 'Kaffee, Gemüse und ein Glas Wasser auf der Arbeitsplatte' } },
          { p: 'Für Kaffee und Tee nimmst du das Trinkwasser mit pH 8,5 bis 9,5. Es kommt frisch aus dem Hahn, du musst keine Flasche mehr öffnen und keinen Wasserkocher mit Wasser aus der Kiste füllen.' },
          { p: 'Probier es aus: Mach zwei Tassen Tee nebeneinander, eine mit deinem bisherigen Wasser und eine mit dem Wasser aus dem Gerät. Schmeck selbst, ob du einen Unterschied merkst.' },
          { box: { titel: 'Tipp', text: 'Stell dir morgens eine Karaffe mit Trinkwasser auf den Tisch. Was du siehst, trinkst du eher.' } },
        ] },
      { kapitel: '02', titel: 'Kochen', intro: 'Für jede Zutat das passende Wasser. Klingt aufwendig, ist aber nur ein Tastendruck.',
        bloecke: [
          { tabelle: { kopf: ['Zutat', 'So gehst du vor'], zeilen: [
            ['Reis, Hafer, Hülsenfrüchte', '30 Minuten in pH 11,5 einweichen, mit pH 9,5 abspülen, mit pH 9,5 kochen.'],
            ['Nudeln', 'In pH 6,0 kochen.'],
            ['Eier', 'In pH 6,0 kochen.'],
            ['Gemüse', 'Mit pH 9,5 kochen oder dünsten.'],
            ['Suppen und Brühe', 'Mit pH 9,5 ansetzen.'],
          ] } },
          { hinweis: { titel: 'Gut zu wissen', text: 'pH 11,5 nimmst du nur zum Einweichen und Waschen. Abgespült und gekocht wird immer mit Trinkwasser.' } },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '03', titel: 'Obst und Gemüse waschen', intro: 'Auf Schalen bleibt einiges hängen. Mit Wasser allein bekommst du das oft schlecht ab.',
        bloecke: [
          { bild: { src: B('kueche'), alt: 'Frisches Gemüse in einer Schüssel auf der Arbeitsplatte' } },
          { liste: [
            'Leg Obst und Gemüse 45 Minuten in Wasser mit pH 11,5.',
            'Spül danach alles gründlich mit Trinkwasser pH 9,5 ab.',
            'Bei Salat reicht kürzeres Einlegen, danach ebenfalls abspülen.',
          ] },
          { p: 'Das hilft, Rückstände von der Schale zu lösen. Danach ist alles bereit zum Essen, Schneiden oder Kochen.' },
        ] },
      { kapitel: '04', titel: 'Sauber bleiben', intro: 'Zwei Wasserarten helfen auch beim Putzen in der Küche. Beide sind nicht zum Trinken.',
        bloecke: [
          { bild: { src: B('putzen'), alt: 'Eine Hand wischt eine Holzarbeitsplatte ab' } },
          { box: { titel: 'pH 2,5', text: 'Für Schneidebretter, Spüle und Arbeitsflächen. Damit nimmst du auch Gerüche von Fisch und Brettern.' } },
          { box: { titel: 'pH 11,5', text: 'Löst Fett und Flecken, zum Beispiel am Herd oder an Töpfen.' } },
          { weiter: WEITER.probieren },
        ] },
      { kapitel: '05', titel: 'Dein Küchen-Spickzettel', intro: 'Zum Ausdrucken und an den Kühlschrank hängen.',
        bloecke: [
          { arten: true },
          { check: [
            'Karaffe mit Trinkwasser auf den Tisch stellen',
            'Obst und Gemüse für morgen einweichen',
            'Reis oder Hafer für die Woche einweichen',
            'Bretter nach Fisch mit pH 2,5 abwischen',
          ] },
        ] },
    ],
  },
  {
    id: 'flasche-filter-geraet', thema: 'neutral',
    titel: 'Flasche, Filter oder Gerät?', untertitel: 'Der ehrliche Vergleich für dein Trinkwasser',
    kurz: 'Leitungswasser, Flasche, Tischfilter, Osmose und Gerät im ehrlichen Vergleich. Mit Rechnung zum Selbstausfüllen und Checkliste.',
    eyebrow: 'E-Book', cover: B('kisten'),
    weiterTitel: 'Mach den Vergleich selbst',
    weiterText: 'Am besten vergleichst du nicht auf dem Papier, sondern im Glas. Probier das Wasser aus dem Gerät und entscheide dann.',
    seiten: [
      { kapitel: '01', titel: 'Leitungswasser', intro: 'Der Anfang von allem: das Wasser, das aus deinem Hahn kommt.',
        bloecke: [
          { p: 'In Deutschland regelt die Trinkwasserverordnung, wie Leitungswasser beschaffen sein muss. Dein Wasserversorger prüft es regelmäßig. Wie dein Wasser genau zusammengesetzt ist, kannst du bei ihm nachlesen oder erfragen.' },
          { p: 'Für die Leitungen im Haus ist der Eigentümer zuständig. Was bei dir aus dem Hahn kommt, hängt also auch davon ab, wie alt und wie gepflegt die Leitungen im Haus sind.' },
          { p: 'Manche merken am Geschmack oder Geruch, zum Beispiel nach Chlor, dass sie ihr Leitungswasser nicht gern pur trinken. Dann greifen viele zur Flasche.' },
          { bild: { src: E('chlor'), alt: 'Ein Mann riecht skeptisch an einem Glas Leitungswasser' } },
          { quelle: 'Quelle: Trinkwasserverordnung (TrinkwV), Umweltbundesamt' },
        ] },
      { kapitel: '02', titel: 'Wasser in Flaschen', intro: 'Bequem im Laden, aufwendig zu Hause.',
        bloecke: [
          { bild: { src: B('kisten'), alt: 'Eine Frau trägt zwei Wasserkisten die Treppe hoch' } },
          { liste: [
            'Kisten kaufen, ins Auto laden, nach Hause tragen.',
            'Lagern, im Keller oder in der Wohnung.',
            'Leergut sammeln und zurückbringen.',
            'Plastikflaschen oder schwere Glasflaschen, je nach Wahl.',
          ] },
          { tabelle: { kopf: ['Rechne selbst', 'Dein Wert'], zeilen: [
            ['Personen im Haushalt', '______'],
            ['Liter je Person am Tag', '______'],
            ['Liter im Jahr (Personen × Liter × 365)', '______'],
            ['Sechserträger zu 9 Litern im Jahr', '______'],
            ['Dein Preis je Sechserträger', '______ €'],
            ['Kosten im Jahr', '______ €'],
          ] } },
        ] },
      { kapitel: '03', titel: 'Filter und Osmose', intro: 'Viele filtern ihr Wasser schon. Was können Filter, und was nicht?',
        bloecke: [
          { box: { titel: 'Tischfilter (Kanne)', text: 'Günstig und einfach. Die Kartusche muss regelmäßig gewechselt werden. Du bekommst gefiltertes Wasser, aber nur eine Sorte.' } },
          { box: { titel: 'Osmoseanlage', text: 'Filtert sehr gründlich, dabei gehen auch die Mineralien aus dem Wasser. Braucht Platz unter der Spüle und erzeugt Abwasser.' } },
          { box: { titel: 'Wasserionisierer', text: 'Filtert das Wasser und teilt es danach in fünf Wasserarten auf. Für Trinken, Kochen, Pflege und Putzen aus einem Gerät.' } },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '04', titel: 'Alles auf einen Blick', intro: 'Kein Testsieger, sondern eine ehrliche Übersicht. Du entscheidest, was dir wichtig ist.',
        bloecke: [
          { tabelle: { kopf: ['', 'Flasche', 'Tischfilter', 'Osmose', 'Gerät'], zeilen: [
            ['Schleppen', 'ja', 'nein', 'nein', 'nein'],
            ['Leergut', 'ja', 'nein', 'nein', 'nein'],
            ['Filtert dein Leitungswasser', 'nein', 'ja', 'ja', 'ja'],
            ['Mineralien bleiben', 'je nach Sorte', 'ja', 'größtenteils nein', 'ja'],
            ['Verschiedene Wasserarten', 'nein', 'nein', 'nein', 'fünf'],
            ['Für Küche und Haushalt', 'nein', 'nein', 'nein', 'ja'],
            ['Anschaffung', 'keine', 'gering', 'mittel', 'vierstellig'],
          ] } },
          { p: 'Wer nur ab und zu Wasser trinkt, kommt mit der Flasche gut zurecht. Wer viel trinkt, gern kocht und Kisten satt hat, sollte sich das Gerät anschauen.' },
        ] },
      { kapitel: '05', titel: 'Was ist dir wichtig?', intro: 'Hak ab, was für dich zählt. Dann weißt du, welche Lösung zu dir passt.',
        bloecke: [
          { check: [
            'Ich will nicht mehr schleppen.',
            'Ich will weniger Plastik und Leergut.',
            'Mir ist der Geschmack meines Wassers wichtig.',
            'Ich will mein Wasser auch zum Kochen nutzen.',
            'Ich will eine Lösung für viele Jahre.',
            'Ich will für Pflege und Putzen weniger extra kaufen.',
          ] },
          { p: 'Viele Haken bei den letzten Punkten? Dann passt ein Wasserionisierer besonders gut. Am besten probierst du das Wasser einmal selbst.' },
          { weiter: WEITER.probieren },
        ] },
    ],
  },

  // ============================================================== SPORT
  {
    id: 'unterschaetztes-supplement', thema: 'sport', standard: true,
    titel: 'Das unterschätzte Supplement', untertitel: 'Wasser für Training, Regeneration und Alltag',
    kurz: 'Warum Wasser dein meistgenutztes Supplement ist, wie du rund ums Training trinkst und was die fünf Wasserarten für Sportler können.',
    eyebrow: 'E-Book für alle, die trainieren', cover: B('glas-hahn'),
    weiterTitel: 'Hol dir dein Supplement aus dem Hahn',
    weiterText: 'Du achtest auf jedes Gramm Eiweiß. Dann schau dir auch an, was du jeden Tag literweise trinkst. Am besten persönlich.',
    seiten: [
      { kapitel: '01', titel: 'Dein meistgenutztes Supplement', intro: 'Eiweiß, Kreatin, Vitamine: Darauf achtest du genau. Und Wasser?',
        bloecke: [
          { p: 'Kein Supplement nimmst du so oft zu dir wie Wasser. Mehrere Liter am Tag, jeden Tag, an Trainingstagen noch mehr. Trotzdem ist es oft das, worüber du am wenigsten nachdenkst.' },
          { p: 'Du rührst deinen Shake damit an, du kochst damit, du füllst deine Flasche fürs Gym damit. Genau deshalb lohnt sich ein genauer Blick: Wo kommt dein Wasser her, wie schmeckt es, und trinkst du genug davon?' },
          { bild: { src: B('glas-hahn'), alt: 'Ein Glas wird am Wasserhahn gefüllt' } },
          { box: { titel: 'Die Frage zum Mitnehmen', text: 'Wenn du dein Essen planst, plan dein Wasser mit.' } },
        ] },
      { kapitel: '02', titel: 'Vor, während, nach dem Training', intro: 'Ein paar einfache Gewohnheiten, die du sofort umsetzen kannst.',
        bloecke: [
          { box: { titel: 'Vorher', text: 'Komm nicht durstig ins Training. Trink über den Tag verteilt, nicht alles kurz vorher.' } },
          { box: { titel: 'Während', text: 'Nimm deine eigene Flasche mit und trink in den Pausen kleine Schlucke.' } },
          { box: { titel: 'Danach', text: 'Füll auf, was du ausgeschwitzt hast. Ein einfacher Trick: Wieg dich vor und nach einer langen Einheit. Was du abgenommen hast, ist vor allem Wasser.' } },
          { p: 'Die Deutsche Gesellschaft für Ernährung empfiehlt Erwachsenen rund 1,5 Liter Getränke am Tag, bei Hitze und beim Sport mehr.' },
          { quelle: 'Quelle: Deutsche Gesellschaft für Ernährung (DGE)' },
        ] },
      { kapitel: '03', titel: 'Shake, Kreatin und Co.', intro: 'Was du anrührst, rührst du mit Wasser an.',
        bloecke: [
          { p: 'Proteinshake, Kreatin, Elektrolyte, Pre-Workout: Fast alles, was du nimmst, mischst du mit Wasser. Viele nehmen dafür das Trinkwasser aus dem Gerät mit pH 8,5 bis 9,5, frisch aus dem Hahn, so viel sie brauchen.' },
          { liste: [
            'Shaker morgens direkt am Gerät füllen.',
            'Trinkflasche fürs Gym gleich mit.',
            'Keine Flaschen mehr im Kofferraum, keine Kisten im Flur.',
          ] },
          { bild: { src: B('kisten'), alt: 'Eine Frau trägt Wasserkisten nach Hause' } },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '04', titel: 'Fünf Wasserarten für Sportler', intro: 'Vom Shake bis zur Sporttasche: Das Gerät kann mehr als Trinkwasser.',
        bloecke: [
          { arten: true },
          { box: { titel: 'Für die Sporttasche', text: 'Mit pH 2,5 nimmst du Gerüche aus Sportwäsche, Handschuhen und Schuhen. Nicht zum Trinken.' } },
        ] },
      { kapitel: '05', titel: 'Dein Trinktag', intro: 'Hak ab, was du heute schon geschafft hast.',
        bloecke: [
          { check: [
            'Ein Glas Wasser gleich nach dem Aufstehen',
            'Trinkflasche für den Tag gefüllt',
            'Shake mit frischem Wasser angerührt',
            'Vor dem Training getrunken',
            'In den Pausen kleine Schlucke',
            'Nach dem Training aufgefüllt',
            'Zum Abendessen ein Glas Wasser',
          ] },
          { p: 'Wie viel genau du brauchst, hängt von dir, vom Wetter und vom Training ab. Wichtig ist, dass du regelmäßig trinkst, und dass dir dein Wasser schmeckt.' },
          { weiter: WEITER.probieren },
        ] },
    ],
  },
  {
    id: 'meal-prep', thema: 'sport',
    titel: 'Meal Prep mit den fünf Wasserarten', untertitel: 'Einweichen, waschen, kochen: Schritt für Schritt',
    kurz: 'Einweichen, waschen, kochen: Meal Prep Schritt für Schritt mit den fünf Wasserarten. Mit Ablauf für deinen Meal-Prep-Sonntag.',
    eyebrow: 'E-Book für alle, die trainieren', cover: E('gemuese-schale'),
    weiterTitel: 'Dein Meal Prep, eine Stufe weiter',
    weiterText: 'Wie das mit dem Gerät in deiner Küche läuft, zeigt man dir am besten direkt. Mit allen Wasserarten zum Ausprobieren.',
    seiten: [
      { kapitel: '01', titel: 'Warum Wasser beim Meal Prep zählt', intro: 'Beim Vorkochen für die Woche benutzt du viel Wasser. Zum Einweichen, Waschen und Kochen.',
        bloecke: [
          { bild: { src: E('gemuese-schale'), alt: 'Gemüse in einer Schale mit Wasser' } },
          { p: 'Wer vorkocht, kocht in Mengen. Reis für fünf Tage, Gemüse für die ganze Woche, Hafer für jedes Frühstück. Dabei läuft viel Wasser durch die Küche.' },
          { p: 'Mit einem Wasserionisierer nimmst du für jeden Schritt die passende Wasserart. Alles kommt aus demselben Hahn.' },
        ] },
      { kapitel: '02', titel: 'Obst und Gemüse', intro: 'Der erste Schritt: alles gründlich waschen.',
        bloecke: [
          { tabelle: { kopf: ['Schritt', 'Wasser', 'Dauer'], zeilen: [
            ['Einlegen', 'pH 11,5', '45 Minuten'],
            ['Abspülen', 'pH 9,5', 'gründlich'],
            ['Schneiden und portionieren', '', ''],
          ] } },
          { p: 'Das hilft, Rückstände von der Schale zu lösen. Danach ist alles bereit für die Boxen.' },
          { hinweis: { titel: 'Wichtig', text: 'pH 11,5 ist nur zum Einweichen. Immer mit Trinkwasser abspülen.' } },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '03', titel: 'Reis, Hafer, Hülsenfrüchte', intro: 'Die Grundlage vieler Boxen.',
        bloecke: [
          { liste: [
            '30 Minuten in pH 11,5 einweichen.',
            'Mit pH 9,5 abspülen.',
            'Mit pH 9,5 kochen.',
          ] },
          { box: { titel: 'Tipp für die Woche', text: 'Weich am Sonntagmorgen alles auf einmal ein. Während du Gemüse schneidest, ist der Reis bereit für den Topf.' } },
          { bild: { src: B('kueche'), alt: 'Eine Küche mit Gemüse und einem Kochtopf' } },
        ] },
      { kapitel: '04', titel: 'Fleisch, Fisch, Eier, Pasta', intro: 'Auch für Eiweißquellen gibt es das passende Wasser.',
        bloecke: [
          { box: { titel: 'Fleisch', text: '45 Minuten in pH 11,5 eingelegt wird Fleisch zarter. Danach mit Trinkwasser abspülen.' } },
          { box: { titel: 'Fisch und Bretter', text: 'Mit pH 2,5 nimmst du Gerüche von Fisch und Schneidebrettern. Nicht zum Trinken.' } },
          { box: { titel: 'Eier und Pasta', text: 'Kochst du mit pH 6,0.' } },
          { weiter: WEITER.probieren },
        ] },
      { kapitel: '05', titel: 'Dein Meal-Prep-Sonntag', intro: 'Die Reihenfolge, die Zeit spart. Zum Abhaken.',
        bloecke: [
          { check: [
            'Reis, Hafer, Hülsenfrüchte in pH 11,5 einweichen',
            'Obst und Gemüse in pH 11,5 einlegen',
            'Fleisch in pH 11,5 einlegen',
            'Alles mit pH 9,5 abspülen',
            'Reis und Gemüse mit pH 9,5 kochen',
            'Eier und Pasta mit pH 6,0 kochen',
            'Bretter und Spüle mit pH 2,5 abwischen',
            'Boxen füllen, Trinkflaschen gleich mit',
          ] },
        ] },
    ],
  },
  {
    id: 'trinkplan-training', thema: 'sport',
    titel: 'Dein Trinkplan für Trainingstage', untertitel: 'Zum Ausfüllen, Aufhängen und Abhaken',
    kurz: 'Dein Trinkplan für Trainingstage zum Ausfüllen, der Trick mit der Waage und Gewohnheiten, die dir das Trinken leicht machen.',
    eyebrow: 'E-Book für alle, die trainieren', cover: B('glas-holz'),
    weiterTitel: 'Mach dir das Trinken leicht',
    weiterText: 'Ein Plan hilft. Noch leichter wird es, wenn das Wasser frisch aus dem Hahn kommt und dir schmeckt. Lern das Gerät kennen.',
    seiten: [
      { kapitel: '01', titel: 'Warum ein Plan hilft', intro: 'Wer nach Gefühl trinkt, trinkt oft zu unregelmäßig.',
        bloecke: [
          { p: 'Im Alltag vergisst man das Trinken schnell. Im Büro, unterwegs, beim Training. Ein einfacher Plan sorgt dafür, dass du über den Tag verteilt trinkst und nicht alles am Abend nachholst.' },
          { p: 'Wie viel du brauchst, hängt von dir ab: von deinem Körper, dem Wetter und deinem Training. Die Deutsche Gesellschaft für Ernährung empfiehlt Erwachsenen rund 1,5 Liter Getränke am Tag, beim Sport mehr.' },
          { quelle: 'Quelle: Deutsche Gesellschaft für Ernährung (DGE)' },
          { bild: { src: B('glas-holz'), alt: 'Ein Glas Wasser auf einem Holztisch im Sonnenlicht' } },
        ] },
      { kapitel: '02', titel: 'Dein Trinkplan', intro: 'Trag ein, was zu deinem Tag passt. Druck die Seite aus oder mach ein Foto davon.',
        bloecke: [
          { tabelle: { kopf: ['Uhrzeit', 'Anlass', 'Menge', 'Erledigt'], zeilen: [
            ['______', 'Nach dem Aufstehen', '______', '☐'],
            ['______', 'Zum Frühstück', '______', '☐'],
            ['______', 'Vormittags', '______', '☐'],
            ['______', 'Zum Mittagessen', '______', '☐'],
            ['______', 'Vor dem Training', '______', '☐'],
            ['______', 'Während des Trainings', '______', '☐'],
            ['______', 'Nach dem Training', '______', '☐'],
            ['______', 'Zum Abendessen', '______', '☐'],
          ] } },
        ] },
      { kapitel: '03', titel: 'Vorher und nachher wiegen', intro: 'Ein einfacher Trick, um zu sehen, wie viel du beim Training verlierst.',
        bloecke: [
          { liste: [
            'Wieg dich vor einer langen Einheit, ohne Schuhe.',
            'Wieg dich danach noch einmal, abgetrocknet.',
            'Was du abgenommen hast, ist vor allem Wasser.',
            'Füll das über die nächsten Stunden wieder auf.',
          ] },
          { tabelle: { kopf: ['Datum', 'Vorher', 'Nachher', 'Unterschied'], zeilen: [
            ['______', '______ kg', '______ kg', '______ kg'],
            ['______', '______ kg', '______ kg', '______ kg'],
            ['______', '______ kg', '______ kg', '______ kg'],
          ] } },
          { weiter: WEITER.fragen },
        ] },
      { kapitel: '04', titel: 'Mit dem Gerät wird es leicht', intro: 'Der beste Plan hilft nichts, wenn das Wasser nicht da ist oder dir nicht schmeckt.',
        bloecke: [
          { p: 'Mit einem Wasserionisierer hast du frisches Trinkwasser direkt am Hahn. Du füllst morgens deine Flaschen, rührst deinen Shake an und kochst für den Tag. Keine Kisten, kein Schleppen, kein leerer Vorrat.' },
          { arten: true },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '05', titel: 'Deine Trink-Gewohnheiten', intro: 'Kleine Dinge, die viel ausmachen. Hak ab, was du übernehmen willst.',
        bloecke: [
          { check: [
            'Abends die Trinkflasche für morgen bereitstellen',
            'Wasser immer in Sichtweite haben',
            'Zu jeder Mahlzeit ein Glas Wasser',
            'Erinnerung im Handy für den Nachmittag',
            'Nach dem Training sofort auffüllen',
            'Shake mit frischem Wasser anrühren',
          ] },
          { weiter: WEITER.probieren },
        ] },
    ],
  },

  // ============================================================== GESUNDHEIT
  {
    id: 'wasser-alltag', thema: 'gesundheit', standard: true,
    titel: 'Wasser im Alltag', untertitel: 'Worauf es beim Trinken wirklich ankommt',
    kurz: 'Wie viel, was und woher: worauf es beim Trinken wirklich ankommt, mit Gewohnheiten für jeden Tag. Ohne Fachchinesisch und ohne Heilversprechen.',
    eyebrow: 'E-Book', cover: B('glas-fenster'),
    weiterTitel: 'Gutes Wasser, jeden Tag',
    weiterText: 'Wie viel, was und woher: Das wichtigste ist, dass du Wasser hast, das dir schmeckt und das immer da ist. Lern das Gerät persönlich kennen.',
    seiten: [
      { kapitel: '01', titel: 'Wie viel?', intro: 'Die häufigste Frage zuerst.',
        bloecke: [
          { p: 'Die Deutsche Gesellschaft für Ernährung empfiehlt Erwachsenen rund 1,5 Liter Getränke am Tag, am besten Wasser und ungesüßten Tee. Bei Hitze und Bewegung darf es mehr sein.' },
          { p: 'Wichtiger als die genaue Zahl ist, dass du regelmäßig trinkst, über den Tag verteilt. Viele merken erst, wie wenig sie trinken, wenn sie einmal mitzählen.' },
          { box: { titel: 'Probier es aus', text: 'Zähl einen Tag lang deine Gläser. Ein Glas sind etwa 0,25 Liter. Sechs Gläser sind rund 1,5 Liter.' } },
          { quelle: 'Quelle: Deutsche Gesellschaft für Ernährung (DGE)' },
          { bild: { src: B('glas-fenster'), alt: 'Ein Glas Wasser am Fenster' } },
        ] },
      { kapitel: '02', titel: 'Was?', intro: 'Wasser ist das einfachste Getränk. Wenn es dir schmeckt.',
        bloecke: [
          { p: 'Am meisten trinkst du von dem, was dir schmeckt. Wer sein Wasser nicht mag, greift eher zu Saft, Limo oder trinkt einfach zu wenig.' },
          { p: 'Darum lohnt sich die Frage: Wie schmeckt dir dein Wasser eigentlich? Weich und frisch, oder merkst du Chlor, Kalk oder den Geschmack der Flasche?' },
          { bild: { src: E('chlor'), alt: 'Ein Mann riecht an einem Glas Leitungswasser' } },
          { weiter: WEITER.probieren },
        ] },
      { kapitel: '03', titel: 'Woher?', intro: 'Leitung, Flasche oder Gerät: Was kommt bei dir ins Glas?',
        bloecke: [
          { box: { titel: 'Aus der Leitung', text: 'Wird von deinem Wasserversorger geprüft. Was bei dir aus dem Hahn kommt, hängt aber auch von den Leitungen im Haus ab.' } },
          { box: { titel: 'Aus der Flasche', text: 'Bequem gekauft, aber schwer getragen. Dazu Leergut, Lagerplatz und oft Plastik.' } },
          { box: { titel: 'Aus dem Gerät', text: 'Ein Wasserionisierer filtert dein Leitungswasser und macht daraus Trinkwasser und vier weitere Wasserarten für Küche, Pflege und Haushalt. Frisch, wann immer du es brauchst.' } },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '04', titel: 'Gute Gewohnheiten', intro: 'Keine Regeln, nur Ideen, die den Alltag leichter machen.',
        bloecke: [
          { liste: [
            'Ein Glas gleich nach dem Aufstehen, bevor der Kaffee kommt.',
            'Eine Karaffe sichtbar auf den Tisch stellen.',
            'Zu jeder Mahlzeit ein Glas Wasser.',
            'Eine eigene Flasche für unterwegs.',
            'Tee und Suppe zählen mit.',
          ] },
          { bild: { src: B('glas-holz'), alt: 'Ein Glas Wasser auf einem Holztisch' } },
        ] },
      { kapitel: '05', titel: 'Mein Wasser-Alltag', intro: 'Hak ab, was heute schon geklappt hat.',
        bloecke: [
          { check: [
            'Ich habe ein Glas nach dem Aufstehen getrunken.',
            'Ich habe zu jeder Mahlzeit Wasser getrunken.',
            'Ich hatte unterwegs eine Flasche dabei.',
            'Mein Wasser hat mir geschmeckt.',
            'Ich musste heute nichts schleppen.',
          ] },
          { p: 'Wenn die letzten beiden Punkte schwer sind, lohnt sich ein Blick auf ein Gerät am Wasserhahn.' },
          { weiter: WEITER.probieren },
        ] },
    ],
  },
  {
    id: 'familie', thema: 'gesundheit',
    titel: 'Gutes Wasser für die ganze Familie', untertitel: 'Für Groß und Klein, Küche und Haushalt',
    kurz: 'Wasser für Groß und Klein: Babynahrung, Tabletten, Kinder fürs Wasser gewinnen und die Wasserarten für den ganzen Haushalt.',
    eyebrow: 'E-Book', cover: B('tiere-pflanzen'),
    weiterTitel: 'Ein Gerät für die ganze Familie',
    weiterText: 'Wie das Gerät in euren Alltag passt und welche Wasserart ihr wofür nehmt, besprichst du am besten persönlich.',
    seiten: [
      { kapitel: '01', titel: 'Jeder trinkt anders', intro: 'In einer Familie trinkt jeder anders, und jeder braucht Wasser.',
        bloecke: [
          { p: 'Die Großen trinken Kaffee, die Kleinen wollen Saft, und am Ende trinken alle weniger Wasser, als sie sollten. Gleichzeitig wird jeden Tag gekocht, gewaschen und geputzt.' },
          { p: 'Ein Wasserionisierer am Hahn macht das Wasser für alle zugänglich: Trinkwasser für die Familie, neutrales Wasser für die Kleinsten, und die anderen Wasserarten für Küche und Haushalt.' },
          { bild: { src: B('tiere-pflanzen'), alt: 'Ein Hund trinkt aus seinem Napf in einer hellen Küche' } },
        ] },
      { kapitel: '02', titel: 'Babynahrung und Tabletten', intro: 'Dafür gibt es eine eigene Stufe: neutral, pH 7,0.',
        bloecke: [
          { p: 'Für Babynahrung und zum Einnehmen von Medikamenten nimmst du das neutrale Wasser mit pH 7,0. Es ist gefiltert, aber nicht basisch.' },
          { hinweis: { titel: 'Wichtig', text: 'Wie Wasser für Babynahrung vorbereitet werden soll, zum Beispiel ob es abgekocht wird, besprichst du am besten mit deiner Hebamme oder in der Kinderarztpraxis.' } },
          { box: { titel: 'Merksatz', text: 'Für die Kleinsten und für Tabletten immer pH 7,0.' } },
          { weiter: WEITER.fragen },
        ] },
      { kapitel: '03', titel: 'Kinder fürs Wasser gewinnen', intro: 'Was Kindern hilft, mehr Wasser zu trinken.',
        bloecke: [
          { liste: [
            'Eine eigene Flasche, die sie selbst aussuchen.',
            'Wasser immer in Reichweite, nicht im Schrank.',
            'Ein paar Stücke Obst oder Gurke im Krug.',
            'Vorbild sein: Was die Großen trinken, trinken die Kleinen nach.',
            'Selbst einschenken lassen, am Gerät mit einem Knopfdruck.',
          ] },
          { bild: { src: B('glas-hahn'), alt: 'Ein Glas wird am Wasserhahn gefüllt' } },
          { weiter: WEITER.probieren },
        ] },
      { kapitel: '04', titel: 'Küche und Haushalt für alle', intro: 'Die anderen Wasserarten nutzt die ganze Familie, oft ohne es zu merken.',
        bloecke: [
          { arten: true },
          { box: { titel: 'Für Tiere und Pflanzen', text: 'Auch Napf und Gießkanne bekommen frisches Wasser aus dem Hahn.' } },
        ] },
      { kapitel: '05', titel: 'Familien-Check', intro: 'Hak ab, was bei euch zutrifft.',
        bloecke: [
          { check: [
            'Wir kaufen regelmäßig Wasser in Kisten.',
            'Die Kinder trinken lieber Saft als Wasser.',
            'Wir kochen fast jeden Tag frisch.',
            'Wir brauchen Wasser für Babynahrung oder Tabletten.',
            'Wir wollen weniger Plastik im Haushalt.',
            'Wir haben Haustiere oder viele Pflanzen.',
          ] },
          { p: 'Je mehr Haken, desto mehr nutzt ihr ein Gerät jeden Tag. Lernt es am besten gemeinsam kennen.' },
          { weiter: WEITER.geraet },
        ] },
    ],
  },
  {
    id: 'was-steckt-im-wasser', thema: 'gesundheit',
    titel: 'Was steckt in deinem Wasser?', untertitel: 'Leitung, Flasche, Filter und Gerät im ehrlichen Vergleich',
    kurz: 'Woher dein Leitungswasser kommt, was du selbst prüfen kannst und wie Flasche, Filter und Gerät im Vergleich abschneiden.',
    eyebrow: 'E-Book', cover: B('glas-holz'),
    weiterTitel: 'Schau dir dein Wasser gemeinsam an',
    weiterText: 'Was bei dir aus dem Hahn kommt und welches Wasser zu dir passt, klärt ihr am besten in einem persönlichen Gespräch.',
    seiten: [
      { kapitel: '01', titel: 'Woher dein Leitungswasser kommt', intro: 'Bevor du vergleichst: Lern dein Wasser kennen.',
        bloecke: [
          { p: 'Dein Leitungswasser kommt von einem Wasserversorger, meist den Stadtwerken. In Deutschland regelt die Trinkwasserverordnung, wie es beschaffen sein muss, und es wird regelmäßig geprüft.' },
          { p: 'Die meisten Versorger veröffentlichen eine Trinkwasseranalyse. Darin steht zum Beispiel, wie hart dein Wasser ist. Such im Internet nach dem Namen deines Versorgers und dem Wort Trinkwasseranalyse.' },
          { box: { titel: 'Gut zu wissen', text: 'Die Prüfung endet am Hausanschluss. Für die Leitungen im Haus ist der Eigentümer zuständig.' } },
          { quelle: 'Quelle: Trinkwasserverordnung (TrinkwV), Umweltbundesamt' },
        ] },
      { kapitel: '02', titel: 'Was du selbst prüfen kannst', intro: 'Ein paar Dinge merkst du ohne Labor.',
        bloecke: [
          { check: [
            'Riecht mein Wasser nach Chlor?',
            'Schmeckt es mir pur?',
            'Bildet sich Kalk im Wasserkocher oder an der Armatur?',
            'Wie alt ist das Haus, wie alt sind die Leitungen?',
            'Kenne ich die Trinkwasseranalyse meines Versorgers?',
          ] },
          { bild: { src: E('chlor'), alt: 'Ein Mann riecht an einem Glas Leitungswasser' } },
          { weiter: WEITER.fragen },
        ] },
      { kapitel: '03', titel: 'Flasche, Filter oder Gerät', intro: 'Was die gängigen Lösungen können.',
        bloecke: [
          { tabelle: { kopf: ['', 'Flasche', 'Tischfilter', 'Osmose', 'Gerät'], zeilen: [
            ['Filtert dein Leitungswasser', 'nein', 'ja', 'ja', 'ja'],
            ['Mineralien bleiben', 'je nach Sorte', 'ja', 'größtenteils nein', 'ja'],
            ['Schleppen und Leergut', 'ja', 'nein', 'nein', 'nein'],
            ['Verschiedene Wasserarten', 'nein', 'nein', 'nein', 'fünf'],
            ['Für Küche und Haushalt', 'nein', 'nein', 'nein', 'ja'],
          ] } },
          { p: 'Jede Lösung hat ihren Platz. Ein Wasserionisierer ist die einzige, die neben dem Filtern verschiedene Wasserarten für den ganzen Haushalt macht.' },
        ] },
      { kapitel: '04', titel: 'Was das Gerät anders macht', intro: 'Filtern und aufteilen, in einem Schritt.',
        bloecke: [
          { p: 'Zuerst läuft dein Leitungswasser durch einen Filter. Danach teilt das Gerät es mit Strom in Wasserarten mit unterschiedlichen pH-Werten auf. Du wählst per Tastendruck, was du brauchst.' },
          { arten: true },
          { weiter: WEITER.geraet },
        ] },
      { kapitel: '05', titel: 'Dein Wasser-Check', intro: 'Was du dir für dein Wasser wünschst. Hak ab.',
        bloecke: [
          { check: [
            'Wasser, das mir pur schmeckt',
            'Gefiltert, direkt aus meinem Hahn',
            'Kein Schleppen, kein Leergut',
            'Ein neutrales Wasser für Babynahrung und Tabletten',
            'Wasser für Küche, Pflege und Haushalt aus einem Gerät',
          ] },
          { p: 'Du hast viele Haken gesetzt? Dann lohnt sich ein Gespräch, in dem ihr dein Wasser und deinen Alltag gemeinsam anschaut.' },
          { weiter: WEITER.probieren },
        ] },
    ],
  },
];

// Die fünf Wasserarten, wie auf den Landingpages
export const ARTEN = [
  ['8,5 bis 9,5', 'Trinkwasser', 'Zum Trinken, für Kaffee, Tee, Shakes und zum Kochen.'],
  ['7,0', 'Neutral', 'Für Babynahrung und zum Einnehmen von Medikamenten.'],
  ['6,0', 'Pflege', 'Für Haut und Haare, nach dem Duschen und nach der Rasur.'],
  ['11,5', 'Nicht zum Trinken', 'Obst und Gemüse waschen und einweichen, Fett und Flecken lösen.'],
  ['2,5', 'Nicht zum Trinken', 'Zum Reinigen: Flächen, Bretter und Gerüche aus Wäsche und Taschen.'],
];

// Rechtlicher Hinweis hinten (CI: kein medizinischer Ratgeber, Markenvermerk)
export const RECHTLICHES = 'Dieses E-Book informiert über das Gerät und seine Anwendung im Alltag. Es ist kein medizinischer Ratgeber, ersetzt keine ärztliche Beratung und gibt keine Heilversprechen. Genannte Marken gehören ihren Inhabern. Herausgegeben von [FEHLT: neutrale Marke und Anschrift wie im Impressum]. Stand: November 2026.';

// Fragebogen Ursprungskraft: alle Fragen und Einstellungen an einer Stelle.
// Angelegt am 08.10.2026. Für die neutrale Partner-Fassung (White Label) wird nur MARKE getauscht.
// Keine Fragen zu Krankheiten, Beschwerden oder Medikamenten (Regel für Ursprungskraft).

// Einstellung je Partner (White Label, 09.10.2026): Marke und Person kommen nur von hier.
// Ursprungskraft ist Daniels Firma, andere Partner bekommen ihre eigene Marke und ihren Namen.
const MARKE = {
  name: 'Ursprungskraft',
  zeile: 'URSPRUNGSKRAFT',
  mail: 'info@ursprungskraft.net',
  person: 'Daniel',
  er: 'er', // er oder sie, für Sätze wie „damit er dich begleiten kann“
};

// Vorläufig: Übergabe Testgerät, nach 2 und nach 4 Wochen. Endgültig, wenn Daniel die Testdauer nennt.
const DURCHGAENGE = [
  { nr: 1, tage: 0, titel: 'Dein Start', kurz: 'Start' },
  { nr: 2, tage: 14, titel: 'Zwei Wochen später', kurz: 'nach 2 Wochen' },
  { nr: 3, tage: 28, titel: 'Vier Wochen später', kurz: 'nach 4 Wochen' },
];

const BEREICHE = {
  trinken: 'Dein Trinken',
  genuss: 'Genuss',
  befinden: 'So geht es dir gerade',
  alltag: 'Dein Alltag',
  nutzung: 'Dein Gerät im Alltag',
};

const MENGEN = ['unter 1 Liter', '1 bis 1,5 Liter', '1,5 bis 2 Liter', '2 bis 2,5 Liter', 'mehr als 2,5 Liter'];

const FRAGEN = [
  { id: 'menge', bereich: 'trinken', typ: 'auswahl', text: 'Wie viel trinkst du an einem normalen Tag?', hilfe: 'Gemeint ist alles, was du trinkst, nicht nur Wasser.', optionen: MENGEN },
  { id: 'quelle', bereich: 'trinken', typ: 'auswahl', text: 'Woher kommt dein Trinkwasser meistens?',
    optionen: ['Aus der Leitung', 'Aus Flaschen', 'Aus einer Filterkanne', 'Aus einem anderen Wasserfilter', 'Aus einem Wasserspender', 'Aus einer Quelle oder einem Brunnen', 'Gemischt'] },
  { id: 'liter', bereich: 'trinken', typ: 'zahl', text: 'Wie viele Liter Wasser in Flaschen kaufst du pro Woche?', hilfe: 'Eine Schätzung reicht. Ein Sechserpack mit 1,5-Liter-Flaschen sind 9 Liter. Kaufst du keins, bleib einfach bei 0.', max: 200 },
  { id: 'kaffee', bereich: 'trinken', typ: 'zahl', text: 'Wie viele Tassen Kaffee oder Tee trinkst du am Tag?', max: 20 },
  { id: 'softdrinks', bereich: 'trinken', typ: 'zahl', text: 'Wie viele Gläser Softdrinks oder Saft trinkst du am Tag?', max: 20 },
  { id: 'gern', bereich: 'trinken', typ: 'skala', text: 'Wie gern trinkst du Wasser?', links: 'gar nicht gern', rechts: 'sehr gern' },
  { id: 'g_wasser', bereich: 'genuss', typ: 'skala', text: 'Wie schmeckt dir dein Wasser?', links: 'sehr schlecht', rechts: 'sehr gut' },
  { id: 'g_kaffee', bereich: 'genuss', typ: 'skala', text: 'Wie schmecken dir Kaffee und Tee?', links: 'sehr schlecht', rechts: 'sehr gut', auslassen: 'Trinke ich nicht' },
  { id: 'energie', bereich: 'befinden', typ: 'skala', text: 'Wie ist deine Energie am Morgen?', links: 'sehr schlecht', rechts: 'sehr gut' },
  { id: 'schlaf', bereich: 'befinden', typ: 'skala', text: 'Wie ist deine Schlafqualität?', links: 'sehr schlecht', rechts: 'sehr gut' },
  { id: 'konzentration', bereich: 'befinden', typ: 'skala', text: 'Wie ist deine Konzentration am Nachmittag?', links: 'sehr schlecht', rechts: 'sehr gut' },
  { id: 'erholung', bereich: 'befinden', typ: 'skala', text: 'Wie gut erholst du dich nach Bewegung oder Sport?', links: 'sehr schlecht', rechts: 'sehr gut', auslassen: 'Mache ich gerade nicht' },
  { id: 'stress', bereich: 'befinden', typ: 'skala', text: 'Wie belastbar fühlst du dich bei Stress?', links: 'sehr wenig', rechts: 'sehr gut' },
  { id: 'wohl', bereich: 'befinden', typ: 'skala', text: 'Wie ist dein allgemeines Wohlbefinden?', links: 'sehr schlecht', rechts: 'sehr gut' },
  { id: 'bewegung', bereich: 'alltag', typ: 'zahl', text: 'An wie vielen Tagen pro Woche bewegst du dich mindestens 30 Minuten?', hilfe: 'Spazierengehen zählt auch.', max: 7 },
  { id: 'arten', bereich: 'nutzung', typ: 'mehrfach', ab: 2, text: 'Welche Wasserarten nutzt du?', hilfe: 'Mehrere Antworten sind möglich.',
    optionen: [['ph95', 'pH 8,5 bis 9,5 zum Trinken'], ['ph7', 'pH 7, neutral'], ['ph6', 'pH 6, Schönheitswasser'], ['ph25', 'pH 2,5, stark sauer'], ['ph115', 'pH 11,5, stark basisch']] },
  { id: 'wofuer', bereich: 'nutzung', typ: 'mehrfach', ab: 2, text: 'Wofür nutzt du dein Wasser?', hilfe: 'Mehrere Antworten sind möglich.',
    optionen: [['trinken', 'Trinken'], ['kochen', 'Kochen'], ['kaffee', 'Kaffee und Tee'], ['pflege', 'Haut und Haare'], ['putzen', 'Putzen'], ['pflanzen', 'Pflanzen'], ['tiere', 'Haustiere']] },
  { id: 'veraendert', bereich: 'offen', typ: 'text', ab: 2, frei: true, text: 'Was hat sich für dich verändert?', hilfe: 'Auch Kleinigkeiten zählen.',
    beispiel: 'Zum Beispiel: Ich trinke mehr, ohne daran zu denken. Mein Tee schmeckt weicher. Ich kaufe keine Wasserkisten mehr.' },
  { id: 'fehlt', bereich: 'offen', typ: 'text', ab: 2, frei: true, text: 'Was fehlt dir noch?', hilfe: 'Eine Frage, ein Wunsch, etwas, das noch nicht klappt.',
    beispiel: 'Zum Beispiel: Ich weiß noch nicht genau, welches Wasser ich zum Kochen nehme. Oder: Ich hätte gern eine kurze Anleitung zum Reinigen.' },
  { id: 'brief', bereich: 'offen', typ: 'brief', nur: 1, text: 'Ein Brief an dich selbst' },
];

// Zahlen, bei denen weniger das erwünschte Ergebnis ist (für die Auswertung)
const WENIGER_IST_GUT = ['liter', 'softdrinks'];

const EINWILLIGUNG = 'Ich bin einverstanden, dass ' + MARKE.name + ' meine Angaben speichert, auch die zu meinem Befinden, um mich während der Testphase und danach zu begleiten. Meine Angaben werden nicht an Dritte weitergegeben. Ich kann die Einwilligung jederzeit widerrufen und die Löschung verlangen.';
// Kundenstimme: Erlaubnis gleich beim ersten Fragebogen, nur Vorname (Jasmin, 09.10.2026)
const STIMME = 'Was ich ' + MARKE.name + ' an Rückmeldungen gebe, jetzt und später, darf mit meinem Vornamen als Kundenstimme gezeigt werden. Aussagen zu meiner Gesundheit werden nicht veröffentlicht.';

function fragenFuer(durchgang) {
  return FRAGEN.filter((f) => (f.nur ? f.nur === durchgang : true) && (f.ab ? durchgang >= f.ab : true));
}

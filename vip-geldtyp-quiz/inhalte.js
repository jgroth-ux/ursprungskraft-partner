/* ==========================================================================
   VIP GROUP · Geldtyp-Test · INHALTE
   Alle Texte, Fragen und Punkte an einer Stelle. Wer Texte ändern will,
   ändert nur diese Datei. Grundlage: "Die vier Geldtypen und ihre Motive"
   (Konzeptplanung Modul 1) und die Inhalte des Videokurses Teil 1 bis 3.
   ========================================================================== */

/* ---------- Die vier Geldtypen ------------------------------------------- */
const TYPEN = {
  versorger: {
    name: 'Der Geldversorger',
    kurz: 'Geldversorger',
    motiv: 'Geborgenheit',
    zitat: 'Es soll für alle reichen und so bleiben.',
    satz: 'Du sorgst für andere und änderst ungern etwas, das funktioniert.',
    staerke: 'Du bist verlässlich. Rechnungen sind bezahlt, für Notfälle ist vorgesorgt, Deine Familie kann sich auf Dich verlassen. Von dieser Disziplin können die anderen drei Typen viel lernen.',
    falle: 'Sicherheit fühlt sich für Dich nach Konto, Sparbuch und Versicherung an. Genau dort liegen in Deutschland über 60 % des Geldvermögens, ohne Sachwert und ohne Inflationsschutz. Nichts zu ändern fühlt sich sicher an. Es kostet trotzdem jedes Jahr.',
    kosten: 'Kaufkraft. Der Betrag auf dem Konto bleibt gleich, aber Du kannst Dir jedes Jahr weniger dafür kaufen.',
    hebel: 'Sicherheit neu definieren. Nicht der Nennwert auf dem Konto zählt, sondern was Dein Geld in zehn Jahren noch wert ist. Prüf Deine bestehenden Verträge, bevor Du weiter einzahlst.',
    video: 2,
    pfad: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    icon: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'
  },
  vermehrer: {
    name: 'Der Geldvermehrer',
    kurz: 'Geldvermehrer',
    motiv: 'Wachstum',
    zitat: 'Aus Geld soll mehr werden.',
    satz: 'Du siehst die Gelegenheit und greifst zu.',
    staerke: 'Du hast keine Angst vor Geld und denkst in Möglichkeiten. Während andere noch zögern, hast Du schon gehandelt. Ohne diese Haltung entsteht kein Vermögen.',
    falle: 'Bei Dir steht die Rendite vorne. Steuern, Inflation, Enteignungsschutz und Transparenz kommen später oder gar nicht. Wer schnell zugreift, prüft weniger. Und am Ende heißt es: „Man hat mir das anders verkauft.“',
    kosten: 'Lehrgeld. Ein einziges Investment, das nicht hält, frisst die Gewinne aus mehreren guten.',
    hebel: 'Ein fester Filter vor jeder Entscheidung: die 7 Grundregeln für ein Investment. Erst wenn alle sieben erfüllt sind, fließt Geld. Dazu eine Aufteilung, in der keine Anlage von der anderen abhängt.',
    video: 2,
    pfad: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
    icon: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'
  },
  planer: {
    name: 'Der Geldplaner',
    kurz: 'Geldplaner',
    motiv: 'Ordnung',
    zitat: 'Ich will wissen, was wo steht und warum.',
    satz: 'Du rechnest nach und dann noch einmal.',
    staerke: 'Du kennst Deine Zahlen besser als die meisten. Du triffst keine Entscheidung aus dem Bauch und lässt Dir nichts verkaufen, was Du nicht verstanden hast.',
    falle: 'Analyse ersetzt keine Umsetzung. Viele Planer warten auf den perfekten Zeitpunkt oder die letzte fehlende Information. In der Zeit liegt das Geld auf dem Tagesgeldkonto und verliert an Kaufkraft.',
    kosten: 'Zeit. Jedes Jahr, in dem der Plan nur auf dem Papier steht, fehlt am Ende im Vermögen.',
    hebel: 'Eine Strategie mit festen Prozenten, die Du einmal gründlich prüfst und dann laufen lässt. Struktur statt Dauerrecherche.',
    video: 3,
    pfad: 'm3 17 2 2 4-4m-6-8 2 2 4-4M13 6h8M13 12h8M13 18h8',
    icon: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>'
  },
  geniesser: {
    name: 'Der Geldgenießer',
    kurz: 'Geldgenießer',
    motiv: 'Lebensfreude',
    zitat: 'Wozu habe ich es denn?',
    satz: 'Du gibst aus und regelst es danach.',
    staerke: 'Du lebst jetzt und nicht irgendwann. Du bist großzügig, auch zu anderen, und Geld macht Dir keine Angst. Wer genießen kann, hält einen Plan auch lange durch, solange der Plan Genuss zulässt.',
    falle: 'Ein Topf für alles. Erst zahlen Miete, Abos, Restaurant und Urlaub, Du selbst kommst zuletzt. Was am Monatsende übrig bleibt, soll Vermögen werden. Es reicht dafür nie.',
    kosten: 'Freiheit später. Was heute ohne System ausgegeben wird, fehlt in zwanzig Jahren doppelt.',
    hebel: 'Die Reihenfolge drehen: Bezahl Dich zuerst. Im 3-Konten-Modell bekommt Genuss ein eigenes Konto, 10 % ohne schlechtes Gewissen. Und 20 % arbeiten für Dich, bevor der erste Euro ausgegeben ist.',
    video: 1,
    pfad: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
    icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'
  }
};
const TYP_REIHE = ['versorger', 'vermehrer', 'planer', 'geniesser'];

/* ---------- Die sechs Bereiche des Fundaments ---------------------------- */
const BEREICHE = {
  struktur: {
    name: 'Struktur', frage: 'Bezahlst Du Dich zuerst?', video: 1,
    niedrig: 'Du sparst, was übrig bleibt. Bei den meisten bleibt nichts. Die Reihenfolge entscheidet, nicht die Höhe des Einkommens.',
    mittel: 'Du sparst, aber nicht automatisch. Ohne feste Reihenfolge gewinnt am Monatsende fast immer der Konsum.',
    hoch: 'Du bezahlst Dich zuerst. Das ist die Grundlage für alles Weitere.'
  },
  zahlen: {
    name: 'Zahlen', frage: 'Kennst Du Deine Zahlen?', video: 1,
    niedrig: 'Was Du nicht kennst, kannst Du nicht steuern. Ohne Überblick weißt Du nicht, wie viel Du investieren kannst.',
    mittel: 'Du hast ein Gefühl für Deine Ausgaben. Ein Gefühl reicht aber nicht, um Vermögen zu planen.',
    hoch: 'Du kennst Deine Zahlen. Damit weißt Du, was Du jeden Monat investieren kannst.'
  },
  reserve: {
    name: 'Reserve', frage: 'Bist Du handlungsfähig?', video: 1,
    niedrig: 'Ohne Reserve wird jede unerwartete Rechnung zum Problem und jede Chance zu teuer.',
    mittel: 'Ein Polster ist da, aber es ist schnell aufgebraucht. Danach fängst Du wieder bei null an.',
    hoch: 'Deine Reserve macht Dich handlungsfähig, ohne dass Du an Dein Vermögen gehen musst.'
  },
  schutz: {
    name: 'Inflationsschutz', frage: 'Wo liegt Dein Geld?', video: 2,
    niedrig: 'Geld auf Konten und in Versicherungen behält seinen Nennwert, nicht seine Kaufkraft. Genau so verlieren 95 % der Anleger.',
    mittel: 'Ein Teil steckt in Werten mit Substanz. Der Rest verliert jedes Jahr leise an Kaufkraft.',
    hoch: 'Dein Vermögen steckt in Werten mit Substanz und ist gegen Inflation aufgestellt.'
  },
  kompass: {
    name: 'Investment-Kompass', frage: 'Wonach entscheidest Du?', video: 2,
    niedrig: 'Ohne feste Kriterien entscheiden Rendite, Bauchgefühl oder der Verkäufer. Das ist der teuerste Weg.',
    mittel: 'Du prüfst, aber nicht nach einem festen Raster. Damit bleibt jede Entscheidung eine Einzelfallfrage.',
    hoch: 'Du prüfst nach Kriterien. Damit bist Du schwer zu verführen.'
  },
  strategie: {
    name: 'Strategie', frage: 'Hast Du einen Plan?', video: 3,
    niedrig: 'Vermögen, das zufällig gewachsen ist, ist anfällig. Bricht ein Teil weg, wackelt alles.',
    mittel: 'Du hast eine Idee im Kopf. Was nicht aufgeschrieben ist, wird im Ernstfall nicht umgesetzt.',
    hoch: 'Du hast eine feste Aufteilung. Prüf, ob die Teile unabhängig voneinander tragen.'
  }
};
const BEREICH_REIHE = ['struktur', 'zahlen', 'reserve', 'schutz', 'kompass', 'strategie'];

/* ---------- Die drei Teile des Tests ------------------------------------- */
const TEILE = {
  1: 'Dein Umgang mit Geld',
  2: 'Dein Fundament',
  3: 'Deine Zahlen'
};

/* ---------- Fragen ------------------------------------------------------- *
   t: Punkte für die Geldtypen (v = versorger, m = vermehrer, p = planer, g = geniesser)
   b: Bereich und Wert 0 bis 100 (nur Teil 2)
   k: Kennzahl (nur Teil 3)
   wenn: Frage nur zeigen, wenn die Bedingung erfüllt ist
   ------------------------------------------------------------------------- */
const FRAGEN = [
  /* ---- Teil 1: Geldtyp ---- */
  {
    id: 'f1', teil: 1,
    frage: 'Du bekommst unerwartet 5.000 €. Was passiert damit als Erstes?',
    antworten: [
      { text: 'Kommt aufs Konto als Polster. Man weiß nie, was kommt.', t: { v: 3 } },
      { text: 'Ich suche eine Anlage, die mehr daraus macht.', t: { m: 3 } },
      { text: 'Ich überlege genau, welcher Teil wohin geht, und schreibe es auf.', t: { p: 3 } },
      { text: 'Ein Teil geht direkt in etwas Schönes. Urlaub, gutes Essen, ein lang gehegter Wunsch.', t: { g: 3 } }
    ]
  },
  {
    id: 'f2', teil: 1,
    frage: 'Ein Bekannter erzählt Dir begeistert von einer Geldanlage mit 12 % im Jahr. Deine erste Reaktion?',
    antworten: [
      { text: 'Klingt nach Risiko. Da lasse ich lieber die Finger davon.', t: { v: 3 } },
      { text: 'Spannend. Wie steige ich ein?', t: { m: 3 } },
      { text: 'Zeig mir die Unterlagen, die Zahlen und wer dahintersteht.', t: { p: 3 } },
      { text: 'Schön für ihn. Mich reizt so etwas eher nicht.', t: { g: 2, v: 1 } }
    ]
  },
  {
    id: 'f3', teil: 1,
    frage: 'Welches Gefühl hast Du meistens, wenn Du auf Dein Konto schaust?',
    antworten: [
      { text: 'Beruhigung, wenn genug da ist. Unruhe, wenn es weniger wird.', t: { v: 3 } },
      { text: 'Ungeduld. Geld, das nur herumliegt, arbeitet nicht.', t: { m: 3 } },
      { text: 'Kontrolle. Ich weiß meistens auf den Euro, was da sein müsste.', t: { p: 3 } },
      { text: 'Ehrlich gesagt schaue ich lieber nicht so genau hin.', t: { g: 3 } }
    ]
  },
  {
    id: 'f4', teil: 1,
    frage: 'Welcher Satz könnte von Dir sein?',
    antworten: [
      { text: '„Hauptsache, die Familie ist abgesichert.“', t: { v: 3 } },
      { text: '„Geld muss arbeiten, nicht schlafen.“', t: { m: 3 } },
      { text: '„Erst rechnen, dann entscheiden.“', t: { p: 3 } },
      { text: '„Das letzte Hemd hat keine Taschen.“', t: { g: 3 } }
    ]
  },
  {
    id: 'f5', teil: 1,
    frage: 'Welche Entscheidung fällt Dir am schwersten?',
    antworten: [
      { text: 'Einen bestehenden Vertrag zu kündigen oder etwas Gewohntes zu ändern.', t: { v: 3 } },
      { text: 'Eine Chance auszulassen.', t: { m: 3 } },
      { text: 'Mich festzulegen, solange mir noch Informationen fehlen.', t: { p: 3 } },
      { text: 'Mir etwas zu verkneifen, worauf ich gerade Lust habe.', t: { g: 3 } }
    ]
  },
  {
    id: 'f6', teil: 1,
    frage: 'Du brauchst ein neues Auto. Wie gehst Du vor?',
    antworten: [
      { text: 'Lieber gebraucht und bezahlt als neu und finanziert.', t: { v: 3 } },
      { text: 'Ich schaue, wie ich es über Leasing oder die Firma clever löse.', t: { m: 2, p: 1 } },
      { text: 'Vergleichstabelle mit allen Kosten über fünf Jahre.', t: { p: 3 } },
      { text: 'Wenn es sich richtig anfühlt, wird es gekauft. Den Rest regle ich danach.', t: { g: 3 } }
    ]
  },
  {
    id: 'f7', teil: 1,
    frage: 'Was wünschst Du Dir für Dein Geld in zehn Jahren am meisten?',
    antworten: [
      { text: 'Keine Sorgen mehr. Meine Familie ist versorgt.', t: { v: 3 } },
      { text: 'Dass mein Geld mehr verdient als ich.', t: { m: 3 } },
      { text: 'Einen klaren Plan, der aufgegangen ist.', t: { p: 3 } },
      { text: 'Zeit und Freiheit für die Dinge, die ich liebe.', t: { g: 3 } }
    ]
  },

  /* ---- Teil 2: Fundament ---- */
  {
    id: 'f8', teil: 2, bereich: 'struktur',
    frage: 'Dein Einkommen ist auf dem Konto. Was passiert zuerst?',
    antworten: [
      { text: 'Ein fester Betrag geht automatisch auf ein Spar- oder Investmentkonto. Vom Rest lebe ich.', b: 100, t: { p: 1 } },
      { text: 'Ich spare, was am Monatsende übrig bleibt.', b: 35 },
      { text: 'Ich habe kein festes System. Mal so, mal so.', b: 15, t: { g: 1 } },
      { text: 'Meistens bleibt am Ende nichts übrig.', b: 0, t: { g: 1 } }
    ]
  },
  {
    id: 'f9', teil: 2, bereich: 'zahlen',
    frage: 'Wie genau kennst Du Deine monatlichen Fixkosten?',
    antworten: [
      { text: 'Auf den Euro. Ich führe ein Haushaltsbuch.', b: 100, t: { p: 1 } },
      { text: 'Ungefähr, auf 200 € genau.', b: 50 },
      { text: 'Grob. Ich müsste nachschauen.', b: 20 },
      { text: 'Keine Ahnung, ehrlich gesagt.', b: 0, t: { g: 1 } }
    ]
  },
  {
    id: 'f10', teil: 2, bereich: 'reserve',
    frage: 'Morgen kommt eine unerwartete Rechnung über 3.000 €. Was passiert?',
    antworten: [
      { text: 'Zahle ich aus meiner Reserve, ohne lange nachzudenken.', b: 100, t: { v: 1 } },
      { text: 'Geht, tut aber weh. Danach ist das Polster leer.', b: 50 },
      { text: 'Ich müsste eine Anlage auflösen oder umschichten.', b: 25, t: { m: 1 } },
      { text: 'Ich bräuchte Dispo, Kredit oder Ratenzahlung.', b: 0 }
    ]
  },
  {
    id: 'f11', teil: 2, bereich: 'schutz',
    frage: 'Wo liegt der größte Teil Deines Ersparten?',
    antworten: [
      { text: 'Auf Giro-, Tagesgeld- oder Sparkonto.', b: 15, t: { v: 1 } },
      { text: 'In Lebens- oder Rentenversicherung, Bausparvertrag.', b: 20, t: { v: 1 } },
      { text: 'Verteilt über mehrere Anlageklassen, auch Aktien und Fonds.', b: 65 },
      { text: 'In Sachwerten wie Immobilien, Edelmetallen und Beteiligungen.', b: 100 },
      { text: 'Ich habe noch nichts angespart.', b: 0 }
    ]
  },
  {
    id: 'f12', teil: 2, bereich: 'kompass',
    frage: 'Bevor Du Geld anlegst: Wonach entscheidest Du?',
    antworten: [
      { text: 'Vor allem nach der Rendite.', b: 15, t: { m: 1 } },
      { text: 'Nach dem, was mir die Bank oder ein Berater empfiehlt.', b: 20, t: { v: 1 } },
      { text: 'Nach festen Kriterien: Steuern, Inflationsschutz, Sicherheit, Transparenz.', b: 100, t: { p: 1 } },
      { text: 'Nach Bauchgefühl oder Tipps aus meinem Umfeld.', b: 5 }
    ]
  },
  {
    id: 'f13', teil: 2, bereich: 'strategie',
    frage: 'Hast Du aufgeschrieben, wie Dein Vermögen aufgeteilt sein soll?',
    antworten: [
      { text: 'Ja, mit festen Prozenten pro Anlageklasse.', b: 100, t: { p: 1 } },
      { text: 'Grob im Kopf, aber nicht aufgeschrieben.', b: 45 },
      { text: 'Nein, das ist eher zufällig gewachsen.', b: 15 },
      { text: 'Nein, ich fange gerade erst an.', b: 10 }
    ]
  },

  /* ---- Teil 3: Zahlen ---- */
  {
    id: 'f14', teil: 3, kennzahl: 'einkommen',
    frage: 'Wie hoch ist ungefähr Dein monatliches Nettoeinkommen?',
    hinweis: 'Damit rechnen wir Dein 3-Konten-Modell und Dein Lebenseinkommen aus. Die Angabe bleibt bei Dir.',
    antworten: [
      { text: 'Unter 2.000 €', k: 1700 },
      { text: '2.000 bis 3.000 €', k: 2500 },
      { text: '3.000 bis 4.500 €', k: 3700 },
      { text: '4.500 bis 7.000 €', k: 5700 },
      { text: 'Über 7.000 €', k: 8500 },
      { text: 'Möchte ich nicht angeben', k: null }
    ]
  },
  {
    id: 'f15', teil: 3, kennzahl: 'jahre',
    wenn: (a) => a.einkommen !== null,
    frage: 'Seit wie vielen Jahren verdienst Du Dein eigenes Geld?',
    antworten: [
      { text: 'Weniger als 5 Jahre', k: 3 },
      { text: '5 bis 10 Jahre', k: 8 },
      { text: '10 bis 20 Jahre', k: 15 },
      { text: '20 bis 30 Jahre', k: 25 },
      { text: 'Mehr als 30 Jahre', k: 35 }
    ]
  },
  {
    id: 'f16', teil: 3, kennzahl: 'behalten',
    wenn: (a) => a.einkommen !== null,
    frage: 'Schätz ehrlich: Wie viel Prozent von allem, was Du je verdient hast, ist heute noch da?',
    hinweis: 'Es geht nur um Dich. Niemand prüft das nach.',
    antworten: [
      { text: '50 % oder mehr', k: 50 },
      { text: 'Etwa 20 %', k: 20 },
      { text: 'Etwa 10 %', k: 10 },
      { text: 'Unter 10 %', k: 5 }
    ]
  }
];

/* ---------- Der Videokurs ------------------------------------------------ *
   Wortlaut aus den Begleitunterlagen, Seite 01 "Das nimmst Du aus Video X mit"
   ------------------------------------------------------------------------- */
const VIDEOS = [
  {
    nr: 1, titel: 'Formel zum Wohlstand und Money Management',
    punkte: [
      { t: 'Formel zum Wohlstand', d: 'Warum sie nichts mit der Höhe Deines Einkommens zu tun hat.' },
      { t: 'Reiches Denken', d: 'Die fünf Lebensbereiche, in denen Du Profi werden musst.' },
      { t: 'Perfektes Money Management', d: 'Das Drei-Konten-Modell, gerechnet an 2.000 €.' }
    ]
  },
  {
    nr: 2, titel: 'Warum 95 % der Anleger verlieren',
    punkte: [
      { t: 'Die Krisen der letzten Jahre', d: 'Von 1929 bis Corona und das Muster dahinter.' },
      { t: 'Warum 95 % der Anleger verlieren', d: 'Wo das Vermögen der Deutschen wirklich liegt.' },
      { t: 'Die 7 Grundregeln für ein Investment', d: 'Der Filter, den jedes Investment passieren muss.' }
    ]
  },
  {
    nr: 3, titel: 'Die geheime Elite-Strategie',
    punkte: [
      { t: 'Die geheime Elite-Strategie', d: 'Die Drei-Speichen-Regel aus dem Babylonischen Talmud.' },
      { t: 'Steuerfreie Investments', d: 'Welche Gewinne nach welcher Frist steuerfrei sind.' },
      { t: 'Schutz für Dein Lebenswerk', d: 'Was Eigentum von einer Forderung unterscheidet.' }
    ]
  }
];

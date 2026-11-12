// Farbwelten für alle Editoren (12.11.2026): Partnerseiten heute, Flyer-Editor und weitere später.
// EINE Stelle für alle Farben. Zwei Grundtöne (Dunkel wie Kevin und Johny, Hell in Creme und Beige) und mehrere
// Akzente. Jede Kombination ist erlaubt, jeder Akzent ist auf Hell und Dunkel geprüft (Schrift mindestens 4,5 : 1).
// Benutzen: UKFarben.anwenden(element, 'hell', 'oliv') setzt die CSS-Variablen auf dem Element.
// Für Auswahlknöpfe: UKFarben.MODI und UKFarben.AKZENTE (Name, Farbe für das Musterfeld).
// Neuer Akzent: unten in AKZENTE ergänzen (Werte vorher prüfen) und in der SQL (uk_seiten_akzente) eintragen.
(function () {
  'use strict';
  // Grundtöne. text = Schrift auf dem Seitengrund, papier = helle Blickpunkt-Felder (Hero-Text, Formular, Rechner).
  const MODI = {
    dunkel: {
      name: 'Dunkel', muster: '#2F3438',
      werte: {
        grund: '#2F3438', feld: '#383E42', papier: '#F3F1EB', 'papier-2': '#E8E6E0',
        text: '#F3F1EB', 'text-2': '#C4C6C3', tinte: '#383E42', leise: '#5C6367',
        'linie-d': 'rgba(243,241,235,.14)', 'linie-h': '#D3D0C8', 'feld-rand': 'none',
        dock: '#42484D', 'dock-feld': '#50575C', 'dock-hover': '#5A6166',
      },
    },
    hell: {
      name: 'Hell', muster: '#F5F1E8',
      werte: {
        grund: '#F5F1E8', feld: '#EBE4D3', papier: '#FFFDF8', 'papier-2': '#F1ECE1',
        text: '#2A2C22', 'text-2': '#5F6152', tinte: '#2A2C22', leise: '#5F6152',
        'linie-d': 'rgba(42,44,34,.14)', 'linie-h': '#DCD2BD', 'feld-rand': 'inset 0 0 0 1px #E3DACA',
        dock: '#2F3524', 'dock-feld': '#3D4333', 'dock-hover': '#4A5240',
      },
    },
  };
  // Akzente. ak = Linien und Auswahl, knopf = Knöpfe und Akzentfeld (weiße Schrift), klein-dunkel = kleine Schrift auf
  // dunklem Grund, klein-hell = kleine Schrift auf hellem Grund. Geprüft am 12.11.2026 (Kontrast in Klammern, kleinster Wert).
  const AKZENTE = {
    kupfer: { name: 'Kupfer', ak: '#CF6844', knopf: '#B4512F', kleinDunkel: '#EC9A79', kleinHell: '#9C4628' }, // 4,9 wie Kevin
    oliv: { name: 'Oliv', ak: '#A3AD72', knopf: '#4F5A35', kleinDunkel: '#C9D19A', kleinHell: '#4F5A35' }, // 5,8
    salbei: { name: 'Salbei', ak: '#7FA890', knopf: '#4C7660', kleinDunkel: '#A7CBB6', kleinHell: '#3E6651' }, // 5,1
    khaki: { name: 'Khaki', ak: '#B5A46E', knopf: '#76662F', kleinDunkel: '#D6C99A', kleinHell: '#695A26' }, // 5,4
    petrol: { name: 'Petrol', ak: '#4C9C9E', knopf: '#2F6E70', kleinDunkel: '#8FCDCD', kleinHell: '#2A6466' }, // 5,3
    blau: { name: 'Blau', ak: '#4261CC', knopf: '#4261CC', kleinDunkel: '#9EAEF2', kleinHell: '#3A57BD' }, // 5,1 wie Johny
    beere: { name: 'Beere', ak: '#C0637B', knopf: '#9B4058', kleinDunkel: '#EBA6B7', kleinHell: '#8E3A50' }, // 5,5
  };
  // Was eine Fassung zeigt, solange der Partner nichts gewählt hat
  const STANDARD = {
    sport: { modus: 'dunkel', akzent: 'kupfer' },
    neutral: { modus: 'hell', akzent: 'oliv' },
    gesundheit: { modus: 'hell', akzent: 'salbei' },
  };

  // Gültige Wahl oder der Standard der Fassung
  function pruefen(wahl, fassung) {
    const s = STANDARD[fassung] || STANDARD.neutral;
    return {
      modus: MODI[wahl?.modus] ? wahl.modus : s.modus,
      akzent: AKZENTE[wahl?.akzent] ? wahl.akzent : s.akzent,
    };
  }
  // Setzt die Variablen, die seiten.css (und später der Flyer) nutzt
  function anwenden(el, modus, akzent) {
    const m = MODI[modus] || MODI.dunkel, a = AKZENTE[akzent] || AKZENTE.kupfer;
    for (const [k, v] of Object.entries(m.werte)) el.style.setProperty('--' + k, v);
    el.style.setProperty('--ak', a.ak);
    el.style.setProperty('--ak-knopf', a.knopf);
    el.style.setProperty('--ak-auf', '#FFFFFF');
    // Kleine Akzentschrift auf dem Seitengrund: auf Hell die dunkle Fassung
    el.style.setProperty('--ak-d', modus === 'hell' ? a.kleinHell : a.kleinDunkel);
    el.style.setProperty('--ak-h', a.kleinHell);
    if (el.dataset) { el.dataset.modus = modus; el.dataset.akzent = akzent; }
  }

  window.UKFarben = { MODI, AKZENTE, STANDARD, pruefen, anwenden };
})();

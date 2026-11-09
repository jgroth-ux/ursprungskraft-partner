// Die fünf Wasserarten der Landingpage: Kacheln und Detailfenster.
// Quelle: Wissensbasis Abschnitt 4 und die grünen Punkte aus broschuere-inhalt.md.
// Öffentliche Seite: nur Anwendungen aus Haushalt, Küche und Pflege, keine Gesundheitsaussagen.

const WASSERARTEN = [
  {
    ph: '2,5', art: 'Stark sauer', trinkbar: false,
    kurz: ['Arbeitsflächen und Schneidebretter', 'Bad und Küche reinigen'],
    text: 'Das stärkste Reinigungswasser des Geräts. Es wird frisch hergestellt und ersetzt im Haushalt viele Reiniger aus der Flasche.',
    gruppen: [
      ['Küche', ['Arbeitsflächen, Spüle und Schneidebretter abwischen', 'Kühlschrank auswischen', 'Angebrannte Töpfe über Nacht einweichen', 'Lebensmittel vor dem Einfrieren besprühen']],
      ['Bad und Wohnung', ['Waschbecken und Toilette einsprühen, kurz einwirken lassen, abwischen', 'Glas, Spiegel und Fenster nachwischen, vorher mit pH 11,5 vorreinigen', 'Böden und Fliesen reinigen', 'Mit einem Mikrofasertuch abstauben']],
      ['Alltag', ['Zahnbürste besprühen', 'Gerüche aus Sportwäsche und Schuhen nehmen', 'Brille reinigen', 'Silberbesteck einlegen und polieren']],
    ],
    hinweis: 'Nicht zum Trinken. Für stark saures Wasser braucht das Gerät den Elektrolyseverstärker. Die volle Wirkung zum Reinigen hält etwa drei bis fünf Tage.',
  },
  {
    ph: '6,0', art: 'Schönheitswasser', trinkbar: false,
    kurz: ['Gesichtswasser', 'Haarspülung', 'Fellpflege'],
    text: 'Leicht sauer und damit nah am natürlichen pH-Wert der Haut. Viele nutzen es als Gesichtswasser und statt Spülung.',
    gruppen: [
      ['Haut und Haare', ['Als Gesichtswasser nach der Reinigung', 'Nach dem Haarewaschen statt Spülung, für bessere Kämmbarkeit', 'Nach der Rasur', 'Als Zusatz im Vollbad, zwei bis vier Liter']],
      ['Küche', ['Eier kochen: sie lassen sich leichter schälen', 'Pasta kochen']],
      ['Tiere und Pflanzen', ['Zur Fellpflege', 'Orchideen und Tomaten gießen, sie mögen leicht saures Wasser']],
    ],
    hinweis: 'Nicht zum Trinken. Am besten frisch verwenden, in einer Sprühflasche hält es einige Tage.',
  },
  {
    ph: '7,0', art: 'Neutral', trinkbar: true,
    kurz: ['Babynahrung', 'Einnahme von Medikamenten'],
    text: 'Gefiltertes Wasser ohne Ionisierung. Frei von Chlor, Rost und Trübungen, mit neutralem pH-Wert.',
    gruppen: [
      ['Wofür', ['Babynahrung zubereiten', 'Medikamente einnehmen', 'Immer dann, wenn du einfach gefiltertes Wasser willst']],
    ],
    hinweis: 'Für Babynahrung immer diese Einstellung nehmen, nicht das basische Trinkwasser.',
  },
  {
    ph: '8,5 – 9,5', art: 'Kangenwasser', trinkbar: true,
    kurz: ['Trinken', 'Kochen, Kaffee und Tee', 'Pflanzen gießen'],
    text: 'Das Wasser für jeden Tag. Gefiltert, ohne Chlorgeruch, mit einem Geschmack, den viele als weich beschreiben.',
    gruppen: [
      ['Trinken', ['Über den Tag verteilt, frisch gezapft', 'Viele beginnen mit pH 8,5 und gehen dann auf 9,0 und 9,5']],
      ['Küche', ['Kaffee und Tee aufbrühen', 'Kochen, Suppen und Eintöpfe', 'Reis und Hülsenfrüchte nach dem Einweichen abspülen']],
      ['Haus und Garten', ['Pflanzen gießen', 'Trinkwasser für Haustiere', 'Im Duftdiffuser mit ätherischen Ölen']],
    ],
    hinweis: 'Am besten frisch trinken. Das Wasser verändert sich nach ein, zwei Tagen.',
  },
  {
    ph: '11,5', art: 'Stark basisch', trinkbar: false,
    kurz: ['Obst und Gemüse waschen', 'Fett und Flecken lösen'],
    text: 'Löst Fett und Öl. Damit wird es zum Helfer in der Küche und bei der Wäsche.',
    gruppen: [
      ['Küche', ['Obst und Gemüse einlegen, danach mit pH 9,5 abspülen', 'Fettige Töpfe und Pfannen einweichen', 'Dunstabzugsgitter einsprühen oder einlegen', 'Backofen und Grill einweichen, mit pH 2,5 nachwischen']],
      ['Wäsche und Flecken', ['Flecken einsprühen oder über Nacht einlegen', 'Teppichflecken einwirken lassen und auswaschen', 'Als Zusatz in der Waschmaschine']],
      ['Rund ums Haus', ['Fenster vorreinigen', 'Felgen und Autopolster', 'Flecken von Ölfarbe lösen']],
    ],
    hinweis: 'Nicht zum Trinken. Kühl gelagert lässt es sich zum Entfetten bis zu einer Woche nutzen.',
  },
];

const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function kartenZeichnen() {
  const ort = document.getElementById('karten');
  ort.innerHTML = WASSERARTEN.map((w, i) => `
    <button class="karte" data-i="${i}" aria-haspopup="dialog">
      <span class="ph">${esc(w.ph)}</span>
      <span class="art">${esc(w.art)}</span>
      <ul>${w.kurz.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
      <span class="fuss"><span class="marker ${w.trinkbar ? 'ja' : 'nein'}">${w.trinkbar ? 'trinkbar' : 'nicht zum Trinken'}</span><span class="mehr">Mehr erfahren</span></span>
    </button>`).join('');
  const dlg = document.getElementById('dlg');
  ort.querySelectorAll('.karte').forEach((b) => {
    b.onclick = () => {
      const w = WASSERARTEN[b.dataset.i];
      document.getElementById('dlg-inhalt').innerHTML = `
        <button class="zu" aria-label="Schließen">×</button>
        <div class="eyebrow">pH ${esc(w.ph)}</div><div class="ph">${esc(w.art)}</div>
        <p class="muted" style="margin-top:12px">${esc(w.text)}</p>
        ${w.gruppen.map(([t, l]) => `<h4>${esc(t)}</h4><ul>${l.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}
        <div class="hinweis">${esc(w.hinweis)}</div>
        <p style="margin:24px 0 0"><a class="knopf" href="#kontakt" data-anliegen="test" id="dlg-test">Selbst ausprobieren</a></p>`;
      document.querySelector('#dlg .zu').onclick = () => dlg.close();
      document.getElementById('dlg-test').onclick = () => {
        dlg.close();
        const r = document.querySelector('input[name=anliegen][value=test]');
        if (r) r.checked = true;
      };
      dlg.showModal();
    };
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

function reiterVerbinden() {
  document.querySelectorAll('.reiter button').forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll('.reiter button').forEach((x) => x.setAttribute('aria-selected', x === b));
      document.getElementById('r-videos').hidden = b.dataset.reiter !== 'videos';
      document.getElementById('r-stimmen').hidden = b.dataset.reiter !== 'stimmen';
    };
  });
}

kartenZeichnen();
reiterVerbinden();

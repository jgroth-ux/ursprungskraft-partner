/* ==========================================================================
   Paket zusammenstellen (Aufgabe B4), Stand 21.10.2026
   FERTIG: Land wählen (Deutschland, Schweiz, Österreich oder anderes Land, je eigene Preise und Währung), "Nur online" ohne Druck,
           Dokumente anklicken, Stückzahl 100, 200 oder 500 (Jasmin 21.10.2026), Summe live,
           Nachbestellung über ?art=nachbestellung.
   FEHLT:  ALLE PREISE. Sie stehen unten als null und erscheinen als {{PREIS_FEHLT}}.
           Der Druckpreis enthält einen kleinen Aufschlag für Jasmins Arbeit (Prüfung von Papier
           und Druckdaten), Höhe offen: AUFSCHLAG_PROZENT.
   ANSCHLUSS: partnerLaden(), bestellungSpeichern() in ../anschluss.js
   ========================================================================== */

/* ---------- PREISE: hier eintragen ----------
   Je Land eine eigene Tabelle. Dokumente: Preis für die GANZE Menge (100, 200 oder 500 Stück),
   so wie die Druckerei ihn nennt, OHNE Aufschlag. Der Aufschlag wird unten draufgerechnet.
   null = Preis fehlt noch. */
var STUFEN = [100, 200, 500];

var PREISE = {
  DE: {
    waehrung: 'EUR',
    aufschlag_prozent: null,   // Jasmins Aufschlag auf den Druck, zum Beispiel 10
    einrichtung: null,         // einmalig: Seite und Bot einrichten
    landingpage_monat: null,   // monatlich: Hosting, Seite, Bot
    versand: null,             // je Druckbestellung
    dokumente: {
      broschuere:    { 100: null, 200: null, 500: null },
      wegweiser:     { 100: null, 200: null, 500: null },
      flyer:         { 100: null, 200: null, 500: null },
      detox:         { 100: null, 200: null, 500: null },
      visitenkarten: { 100: null, 200: null, 500: null }
    }
  },
  CH: {
    waehrung: 'CHF',
    aufschlag_prozent: null,
    einrichtung: null,
    landingpage_monat: null,
    versand: null,
    dokumente: {
      broschuere:    { 100: null, 200: null, 500: null },
      wegweiser:     { 100: null, 200: null, 500: null },
      flyer:         { 100: null, 200: null, 500: null },
      detox:         { 100: null, 200: null, 500: null },
      visitenkarten: { 100: null, 200: null, 500: null }
    }
  },
  AT: {   // Druck vermutlich in Deutschland mit Versand nach Österreich (offen, siehe g-entscheidungen.md)
    waehrung: 'EUR',
    aufschlag_prozent: null,
    einrichtung: null,
    landingpage_monat: null,
    versand: null,
    dokumente: {
      broschuere:    { 100: null, 200: null, 500: null },
      wegweiser:     { 100: null, 200: null, 500: null },
      flyer:         { 100: null, 200: null, 500: null },
      detox:         { 100: null, 200: null, 500: null },
      visitenkarten: { 100: null, 200: null, 500: null }
    }
  },
  ANDERE: {   // jedes andere Land: Preise in EUR, Versand je Land offen
    waehrung: 'EUR',
    aufschlag_prozent: null,
    einrichtung: null,
    landingpage_monat: null,
    versand: null,
    dokumente: {
      broschuere:    { 100: null, 200: null, 500: null },
      wegweiser:     { 100: null, 200: null, 500: null },
      flyer:         { 100: null, 200: null, 500: null },
      detox:         { 100: null, 200: null, 500: null },
      visitenkarten: { 100: null, 200: null, 500: null }
    }
  }
};

var DOKUMENTE = [
  { id: 'broschuere',    name: 'Broschüre zum Gerät', format: 'A5, 28 Seiten, geheftet, matt' },
  { id: 'wegweiser',     name: 'Wegweiser',           format: '{{FORMAT_FEHLT}}' },
  { id: 'flyer',         name: 'Flyer',               format: 'DIN lang, beidseitig' },
  { id: 'detox',         name: 'Detox-Blatt',         format: 'A4, beidseitig' },
  { id: 'visitenkarten', name: 'Visitenkarten',       format: '85 × 55 mm, beidseitig' }
];
/* ---------- Ende PREISE ---------- */

// Nur Vorschau: rechnet mit 1,00 je Stück, damit man sieht, dass die Summe live läuft. KEIN Preisvorschlag.
var TESTPREIS = 1.00;
var mitTestpreis = false;

var nachbestellung = new URLSearchParams(location.search).get('art') === 'nachbestellung';
var land = 'DE';
var nurOnline = false;
var auswahl = {}; // id -> Stück

function tabelle() { return PREISE[land]; }
function wert(w) { return mitTestpreis ? (w === null ? 0 : w) : w; }
function mitAufschlag(betrag) {
  if (betrag === null) return null;
  var a = tabelle().aufschlag_prozent;
  return Math.round(betrag * (1 + (a || 0) / 100) * 100) / 100;
}
function dokPreis(id, menge) {
  if (mitTestpreis) return TESTPREIS * menge;
  return mitAufschlag(tabelle().dokumente[id][menge]);
}
function g(b) { return geld(b, tabelle().waehrung); }

function zeilenBauen() {
  var liste = document.getElementById('dokumente');
  liste.innerHTML = '';
  DOKUMENTE.forEach(function (dok) {
    var li = document.createElement('li');
    li.className = 'dok';
    var stufen = STUFEN.map(function (n, i) {
      return '<label><input type="radio" name="menge-' + dok.id + '" value="' + n + '"' + (i === 0 ? ' checked' : '') + ' disabled> ' + n + '</label>';
    }).join('');
    li.innerHTML =
      '<label class="dok-wahl"><input type="checkbox" data-id="' + dok.id + '">' +
      '<span><b>' + dok.name + '</b><span class="small">' + dok.format + '</span></span></label>' +
      '<div class="stufen" role="radiogroup" aria-label="Stückzahl ' + dok.name + '">' + stufen + '</div>' +
      '<div class="dok-preis small" data-preis></div>';
    liste.appendChild(li);

    var haken = li.querySelector('input[type=checkbox]');
    var radios = li.querySelectorAll('input[type=radio]');
    function menge() { return parseInt(li.querySelector('input[type=radio]:checked').value, 10); }
    haken.addEventListener('change', function () {
      li.classList.toggle('an', haken.checked);
      radios.forEach(function (r) { r.disabled = !haken.checked; });
      if (haken.checked) auswahl[dok.id] = menge(); else delete auswahl[dok.id];
      rechnen();
    });
    radios.forEach(function (r) {
      r.addEventListener('change', function () { auswahl[dok.id] = menge(); rechnen(); });
    });
  });
}

function posten() {
  if (nurOnline) return [];
  return DOKUMENTE.filter(function (d) { return auswahl[d.id]; }).map(function (d) {
    var n = auswahl[d.id];
    return { dokument: d.id, name: d.name, stueck: n, summe: dokPreis(d.id, n) };
  });
}

function rechnen() {
  var ps = posten();
  document.querySelectorAll('.dok').forEach(function (li, i) {
    var d = DOKUMENTE[i], n = auswahl[d.id];
    var el = li.querySelector('[data-preis]');
    el.textContent = n ? g(dokPreis(d.id, n)) + ' für ' + n + ' Stück' : '';
  });

  var fehlt = false, summe = 0, stueck = 0;
  var zeilen = ps.map(function (p) {
    stueck += p.stueck;
    if (p.summe === null) fehlt = true; else summe += p.summe;
    return '<tr><td>' + p.name + '<br><span class="small">' + p.stueck + ' Stück</span></td><td class="zahl">' + g(p.summe) + '</td></tr>';
  });
  if (!nachbestellung) {
    var e = wert(tabelle().einrichtung);
    if (e === null) fehlt = true; else summe += e;
    zeilen.unshift('<tr><td>Einrichtung</td><td class="zahl">' + g(e) + '</td></tr>');
  }
  var v = wert(tabelle().versand);
  if (ps.length) {
    if (v === null) fehlt = true; else summe += v;
    zeilen.push('<tr><td>Versand nach ' + LAND_NAME[land] + '</td><td class="zahl">' + g(v) + '</td></tr>');
  }
  document.getElementById('summe-zeilen').innerHTML = zeilen.join('') || '<tr><td colspan="2" class="small">Noch nichts ausgewählt.</td></tr>';
  document.getElementById('summe').textContent = fehlt ? '{{PREIS_FEHLT}}' : g(summe);
  document.getElementById('stueck').textContent = stueck ? stueck + ' Stück gesamt' : (nurOnline ? 'Nur online, ohne Druckmaterial' : '');
  var m = wert(tabelle().landingpage_monat);
  document.getElementById('monat').textContent = nachbestellung ? '' : 'Danach monatlich ' + g(m) + ' für Seite, Hosting und Telegram-Bot.';
  document.getElementById('weiter').disabled = nachbestellung ? !ps.length : !(ps.length || nurOnline);
  return { posten: ps, summe: fehlt ? null : Math.round(summe * 100) / 100 };
}

var LAND_TEXT = {
  DE: 'Gedruckt in Deutschland und direkt zu dir geschickt. Preise in EUR.',
  CH: 'Gedruckt in der Schweiz und direkt zu dir geschickt. Preise in CHF.',
  AT: 'Direkt zu dir nach Österreich geschickt. Preise in EUR.',
  ANDERE: 'Direkt zu dir geschickt. Preise in EUR, Versand je nach Land.'
};
var LAND_NAME = { DE: 'Deutschland', CH: 'Schweiz', AT: 'Österreich', ANDERE: 'dein Land' };
function landSetzen(neu) {
  land = PREISE[neu] ? neu : 'DE';
  document.getElementById('druckort').textContent = LAND_TEXT[land];
  document.getElementById('land-name').hidden = land !== 'ANDERE';
  rechnen();
}

(async function start() {
  if (nachbestellung) {
    document.getElementById('titel').textContent = 'Material nachbestellen';
    document.getElementById('schritte').hidden = true;
    document.getElementById('art-wahl').hidden = true;
  }
  var p = await partnerLaden();
  zeilenBauen();
  var startLand = PREISE[p.land] ? p.land : 'DE';
  if (p.land_name) document.querySelector('#land-name input').value = p.land_name;
  document.querySelector('input[name="land"][value="' + startLand + '"]').checked = true;
  document.querySelectorAll('input[name="land"]').forEach(function (r) {
    r.addEventListener('change', function () { landSetzen(r.value); });
  });
  document.querySelectorAll('input[name="art"]').forEach(function (r) {
    r.addEventListener('change', function () {
      nurOnline = r.value === 'online' && r.checked;
      document.getElementById('dokumente').hidden = nurOnline;
      rechnen();
    });
  });

  // Vorschlag zum Start: alle Dokumente mit 100 Stück angehakt. Der Partner kann abwählen.
  if (!nachbestellung) document.querySelectorAll('.dok input[type=checkbox]').forEach(function (h) { h.click(); });
  landSetzen(startLand);

  if (document.documentElement.getAttribute('data-vorschau') === 'an') {
    var t = document.getElementById('testpreis');
    t.hidden = false;
    t.querySelector('input').addEventListener('change', function (e) { mitTestpreis = e.target.checked; rechnen(); });
  }
})();

document.getElementById('weiter').addEventListener('click', async function () {
  var r = rechnen();
  var t = tabelle();
  var b = {
    art: nachbestellung ? 'nachbestellung' : (nurOnline ? 'nur-online' : 'start'),
    land: land,
    land_name: land === 'ANDERE' ? document.querySelector('#land-name input').value.trim() : '',
    waehrung: t.waehrung,
    posten: r.posten,
    einrichtung: nachbestellung ? 0 : wert(t.einrichtung),
    versand: r.posten.length ? wert(t.versand) : 0,
    einmalig_summe: r.summe,
    monatlich: nachbestellung ? null : wert(t.landingpage_monat),
    aufschlag_prozent: t.aufschlag_prozent,
    testpreise: mitTestpreis
  };
  var s = await bestellungSpeichern(b);
  if (s.ok) location.href = '../bezahlen/index.html';
});

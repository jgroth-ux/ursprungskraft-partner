/* ==========================================================================
   Paket zusammenstellen (Aufgabe B4), Stand 20.10.2026
   FERTIG: Dokumente anklicken, Stückzahl wählen (Mindestmenge 100, mehr freiwillig),
           Summe live, Staffelpreise möglich, Nachbestellung über ?art=nachbestellung.
   FEHLT:  ALLE PREISE. Sie stehen unten als null und erscheinen als {{PREIS_FEHLT}}.
           Jasmin trägt sie ein (siehe d-druckpreise.md und f-offene-fragen.md).
   ANSCHLUSS: bestellungSpeichern() in ../anschluss.js
   ========================================================================== */

/* ---------- PREISE: hier eintragen ----------
   staffel: Preis JE STÜCK ab der genannten Menge, in WAEHRUNG (portal.js).
   Beispiel: { 100: 1.20, 200: 0.95, 500: 0.70 } heißt: ab 100 Stück 1,20 je Stück, ab 200 0,95 ...
   null = Preis fehlt noch. */
var MINDESTMENGE = 100;
var SCHRITT = 50;

var PREISE = {
  einrichtung: null,          // einmalig im Starterpaket: Seite einrichten, Bot einrichten
  landingpage_monat: null,    // monatliche Gebühr für die Landingpage
  versand: { DE: null, CH: null }, // je Bestellung, falls nicht im Stückpreis enthalten
  dokumente: [
    { id: 'broschuere',    name: 'Broschüre zum Gerät', format: 'A5, 28 Seiten, geheftet, matt',   staffel: { 100: null, 200: null, 500: null } },
    { id: 'wegweiser',     name: 'Wegweiser',           format: '{{FORMAT_FEHLT}}',                staffel: { 100: null, 200: null, 500: null } },
    { id: 'flyer',         name: 'Flyer',               format: 'DIN lang, beidseitig',            staffel: { 100: null, 200: null, 500: null } },
    { id: 'detox',         name: 'Detox-Blatt',         format: 'A4, beidseitig',                  staffel: { 100: null, 200: null, 500: null } },
    { id: 'visitenkarten', name: 'Visitenkarten',       format: '85 × 55 mm, beidseitig',          staffel: { 100: null, 200: null, 500: null } }
  ]
};
/* ---------- Ende PREISE ---------- */

// Nur Vorschau: rechnet mit 1,00 je Stück, damit man sieht, dass die Summe live läuft.
// Das ist KEIN Preisvorschlag.
var TESTPREIS = 1.00;
var mitTestpreis = false;

var nachbestellung = new URLSearchParams(location.search).get('art') === 'nachbestellung';
var auswahl = {}; // id -> Stück
var land = 'DE';

function preisJeStueck(dok, menge) {
  if (mitTestpreis) return TESTPREIS;
  var stufen = Object.keys(dok.staffel).map(Number).sort(function (a, b) { return a - b; });
  var preis = null;
  stufen.forEach(function (s) { if (menge >= s) preis = dok.staffel[s]; });
  return preis;
}
function wert(w) { return mitTestpreis ? (w === null ? 0 : w) : w; }

function zeilenBauen() {
  var liste = document.getElementById('dokumente');
  liste.innerHTML = '';
  PREISE.dokumente.forEach(function (dok) {
    var li = document.createElement('li');
    li.className = 'dok';
    li.innerHTML =
      '<label class="dok-wahl"><input type="checkbox" data-id="' + dok.id + '">' +
      '<span><b>' + dok.name + '</b><span class="small">' + dok.format + '</span></span></label>' +
      '<div class="menge" aria-label="Stückzahl ' + dok.name + '">' +
        '<button type="button" class="zweit" data-minus aria-label="weniger">−</button>' +
        '<input type="number" inputmode="numeric" min="' + MINDESTMENGE + '" step="' + SCHRITT + '" value="' + MINDESTMENGE + '" disabled>' +
        '<button type="button" class="zweit" data-plus aria-label="mehr">+</button>' +
      '</div>' +
      '<div class="dok-preis small" data-preis></div>';
    liste.appendChild(li);

    var haken = li.querySelector('input[type=checkbox]');
    var zahl = li.querySelector('input[type=number]');
    function setzen(n) {
      n = Math.max(MINDESTMENGE, Math.round((parseInt(n, 10) || MINDESTMENGE) / SCHRITT) * SCHRITT);
      zahl.value = n;
      if (haken.checked) auswahl[dok.id] = n;
      rechnen();
    }
    haken.addEventListener('change', function () {
      li.classList.toggle('an', haken.checked);
      zahl.disabled = !haken.checked;
      if (haken.checked) auswahl[dok.id] = parseInt(zahl.value, 10); else delete auswahl[dok.id];
      rechnen();
    });
    li.querySelector('[data-minus]').addEventListener('click', function () { if (!haken.checked) { haken.click(); return; } setzen(+zahl.value - SCHRITT); });
    li.querySelector('[data-plus]').addEventListener('click', function () { if (!haken.checked) { haken.click(); return; } setzen(+zahl.value + SCHRITT); });
    zahl.addEventListener('change', function () { setzen(zahl.value); });
  });
}

function posten() {
  return PREISE.dokumente.filter(function (d) { return auswahl[d.id]; }).map(function (d) {
    var p = preisJeStueck(d, auswahl[d.id]);
    return { dokument: d.id, name: d.name, stueck: auswahl[d.id], preis_je_stueck: p, summe: p === null ? null : Math.round(p * auswahl[d.id] * 100) / 100 };
  });
}

function rechnen() {
  var ps = posten();
  document.querySelectorAll('.dok').forEach(function (li, i) {
    var d = PREISE.dokumente[i], n = auswahl[d.id];
    var el = li.querySelector('[data-preis]');
    if (!n) { el.textContent = ''; return; }
    var p = preisJeStueck(d, n);
    el.textContent = p === null ? '{{PREIS_FEHLT}}' : geld(p) + ' je Stück · ' + geld(p * n);
  });

  var fehlt = false, summe = 0, stueck = 0;
  var zeilen = ps.map(function (p) {
    stueck += p.stueck;
    if (p.summe === null) fehlt = true; else summe += p.summe;
    return '<tr><td>' + p.name + '<br><span class="small">' + p.stueck + ' Stück</span></td><td class="zahl">' + geld(p.summe) + '</td></tr>';
  });
  if (!nachbestellung) {
    var e = wert(PREISE.einrichtung);
    if (e === null) fehlt = true; else summe += e;
    zeilen.unshift('<tr><td>Einrichtung</td><td class="zahl">' + geld(e) + '</td></tr>');
  }
  var v = wert(PREISE.versand[land]);
  if (ps.length) {
    if (v === null) fehlt = true; else summe += v;
    zeilen.push('<tr><td>Versand nach ' + (land === 'CH' ? 'Schweiz' : 'Deutschland') + '</td><td class="zahl">' + geld(v) + '</td></tr>');
  }
  document.getElementById('summe-zeilen').innerHTML = zeilen.join('') || '<tr><td colspan="2" class="small">Noch nichts ausgewählt.</td></tr>';
  document.getElementById('summe').textContent = fehlt ? '{{PREIS_FEHLT}}' : geld(summe);
  document.getElementById('stueck').textContent = stueck ? stueck + ' Stück gesamt' : '';
  var m = wert(PREISE.landingpage_monat);
  document.getElementById('monat').textContent = nachbestellung ? '' : 'Danach monatlich ' + geld(m) + ' für deine Landingpage.';
  document.getElementById('weiter').disabled = !ps.length;
  return { posten: ps, summe: fehlt ? null : Math.round(summe * 100) / 100 };
}

(async function start() {
  if (nachbestellung) {
    document.getElementById('titel').textContent = 'Material nachbestellen';
    document.getElementById('schritte').hidden = true;
  }
  var p = await partnerLaden();
  land = p.land === 'CH' ? 'CH' : 'DE';
  document.getElementById('druckort').textContent = land === 'CH' ? 'Gedruckt in der Schweiz und direkt zu dir geschickt.' : 'Gedruckt in Deutschland und direkt zu dir geschickt.';
  zeilenBauen();

  // Vorschlag zum Start: alles mit Mindestmenge angehakt. Der Partner kann abwählen.
  if (!nachbestellung) document.querySelectorAll('.dok input[type=checkbox]').forEach(function (h) { h.click(); });
  rechnen();

  if (document.documentElement.getAttribute('data-vorschau') === 'an') {
    var t = document.getElementById('testpreis');
    t.hidden = false;
    t.querySelector('input').addEventListener('change', function (e) { mitTestpreis = e.target.checked; rechnen(); });
  }
})();

document.getElementById('weiter').addEventListener('click', async function () {
  var r = rechnen();
  var b = {
    art: nachbestellung ? 'nachbestellung' : 'start',
    land: land,
    posten: r.posten,
    einrichtung: nachbestellung ? 0 : PREISE.einrichtung,
    versand: PREISE.versand[land],
    einmalig_summe: r.summe,
    monatlich: nachbestellung ? null : PREISE.landingpage_monat,
    waehrung: WAEHRUNG,
    testpreise: mitTestpreis
  };
  var s = await bestellungSpeichern(b);
  if (s.ok) location.href = '../bezahlen/index.html';
});

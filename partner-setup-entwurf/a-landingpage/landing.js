/* ==========================================================================
   Partner-Landingpage, Stand 20.10.2026
   FERTIG: Formular mit Prüfung, Wunsch aus dem Knopf vorwählen, Danke-Hinweis,
           Platzhalter im Browser füllen (für Vorschau im Portal und ?demo=1),
           Partnerfoto aus {{FOTO}} anzeigen.
   FEHLT:  echter Versand der Anfrage (ANSCHLUSS anfrageSenden), Benachrichtigung per Telegram.
   ========================================================================== */

// ANSCHLUSS: speichert die Anfrage in der Datenbank (Tabelle anfragen, mit partner_kuerzel)
// und löst die Telegram-Nachricht "Neue Anfrage" an den Partner aus.
// Erwartet: { wunsch, vorname, nachname, email, telefon, nachricht, datenschutz, partner_kuerzel, seite, zeitpunkt }
// Gibt zurück: { ok: true } oder { ok: false, fehler: 'Text für den Kunden' }
async function anfrageSenden(daten) {
  console.log('Demo anfrageSenden', daten);
  return { ok: true };
}

// Beispieldaten nur für die Vorschau (?demo=1 oder Knopf in der Vorschau-Leiste)
var BEISPIEL_PARTNER = {
  MARKE: 'Marke folgt',
  DOMAIN: 'beispiel-domain.de',
  VORNAME: 'Max',
  NACHNAME: 'Mustermann',
  ORT: 'Hamburg',
  TELEFON: '+49 170 0000000',
  WHATSAPP: '491700000000',
  EMAIL: 'max@beispiel.de',
  KUERZEL: 'max',
  FOTO: '../bilder/beispiel-partner.jpg',
  UEBER_MICH: 'Ich trinke seit drei Jahren Kangenwasser aus meinem eigenen Gerät. Am meisten mag ich, dass die Wasserkisten aus dem Keller verschwunden sind. Ich wohne in Hamburg und komme gern bei dir vorbei, um dir alles in Ruhe zu zeigen.',
  IMPRESSUM_URL: '#impressum',
  DATENSCHUTZ_URL: '#datenschutz'
};

/* ---------- Platzhalter füllen ----------
   Der Server ersetzt {{...}} beim Ausliefern. Diese Funktion macht dasselbe im Browser,
   damit das Portal eine Live-Vorschau zeigen kann. Sie merkt sich die Originaltexte,
   so kann sie beliebig oft neu füllen. Leere Werte lassen den Platzhalter stehen. */
var originale = null;
function originaleMerken() {
  originale = [];
  var lauf = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  var knoten;
  while ((knoten = lauf.nextNode())) {
    if (knoten.nodeValue.indexOf('{{') > -1) originale.push({ knoten: knoten, text: knoten.nodeValue });
  }
  document.querySelectorAll('*').forEach(function (el) {
    Array.prototype.forEach.call(el.attributes, function (a) {
      if (a.value.indexOf('{{') > -1) originale.push({ el: el, attr: a.name, text: a.value });
    });
  });
}
function ersetzen(text, daten) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, function (ganz, name) {
    var w = daten[name];
    return (w === undefined || w === null || w === '') ? ganz : String(w);
  });
}
function platzhalterFuellen(daten) {
  if (!originale) originaleMerken();
  originale.forEach(function (o) {
    var neu = ersetzen(o.text, daten);
    if (o.knoten) o.knoten.nodeValue = neu; else o.el.setAttribute(o.attr, neu);
  });
  fotoZeigen();
}
window.platzhalterFuellen = platzhalterFuellen;

function fotoZeigen() {
  document.querySelectorAll('[data-foto]').forEach(function (el) {
    var url = el.getAttribute('data-foto');
    var echt = url && url.indexOf('{{') === -1;
    el.style.backgroundImage = echt ? 'url("' + url.replace(/"/g, '%22') + '")' : '';
    el.classList.toggle('hat-foto', !!echt);
  });
}

// Vorschau im Portal: das Portal schickt { typ: 'partnerdaten', daten: {...}, farbe: 'blau' }
window.addEventListener('message', function (e) {
  if (!e.data || e.data.typ !== 'partnerdaten') return;
  platzhalterFuellen(e.data.daten || {});
  if (e.data.farbe) document.documentElement.setAttribute('data-farbe', e.data.farbe);
});

/* ---------- Formular ---------- */
var form = document.getElementById('anfrage');
var fehler = document.getElementById('fehler');

document.querySelectorAll('[data-wunsch]').forEach(function (a) {
  a.addEventListener('click', function () {
    var r = form.querySelector('input[name="wunsch"][value="' + a.dataset.wunsch + '"]');
    if (r) r.checked = true;
  });
});

function kuerzelAusSeite() {
  // Live: der Server setzt data-kuerzel="{{KUERZEL}}" am <html>. Sonst aus der Adresse /kuerzel/ lesen.
  var k = document.documentElement.getAttribute('data-kuerzel') || '';
  if (k && k.indexOf('{{') === -1) return k;
  var teile = location.pathname.split('/').filter(Boolean);
  return teile.length ? teile[0] : '';
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  fehler.textContent = '';
  form.querySelectorAll('.feld').forEach(function (f) { f.classList.remove('falsch'); });

  var d = Object.fromEntries(new FormData(form).entries());
  var fehlt = [];
  ['vorname', 'nachname', 'email'].forEach(function (n) {
    if (!(d[n] || '').trim()) { fehlt.push(n); form.elements[n].closest('.feld').classList.add('falsch'); }
  });
  if (fehlt.length) { fehler.textContent = 'Bitte füll Vorname, Nachname und E-Mail aus.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) {
    form.elements.email.closest('.feld').classList.add('falsch');
    fehler.textContent = 'Die E-Mail-Adresse sieht nicht vollständig aus.';
    return;
  }
  if (!d.datenschutz) { fehler.textContent = 'Bitte setz den Haken beim Datenschutz.'; return; }

  var knopf = form.querySelector('button[type="submit"]');
  knopf.disabled = true;
  knopf.textContent = 'Wird gesendet …';
  var antwort = await anfrageSenden({
    wunsch: d.wunsch,
    vorname: d.vorname.trim(),
    nachname: d.nachname.trim(),
    email: d.email.trim(),
    telefon: (d.telefon || '').trim(),
    nachricht: (d.nachricht || '').trim(),
    datenschutz: true,
    partner_kuerzel: kuerzelAusSeite(),
    seite: location.href,
    zeitpunkt: new Date().toISOString()
  });
  if (antwort && antwort.ok) {
    form.querySelectorAll('fieldset, .reihe, .feld, .haken, button[type="submit"]').forEach(function (el) { el.hidden = true; });
    document.getElementById('danke').hidden = false;
  } else {
    knopf.disabled = false;
    knopf.textContent = 'Anfrage senden';
    fehler.textContent = (antwort && antwort.fehler) || 'Das hat leider nicht geklappt. Versuch es bitte noch einmal oder schreib per WhatsApp.';
  }
});

/* ---------- Vorschau: Beispieldaten ---------- */
originaleMerken();
fotoZeigen();
(function () {
  if (document.documentElement.getAttribute('data-vorschau') !== 'an') return;
  var an = new URLSearchParams(location.search).get('demo') === '1';
  function knopfAnhaengen() {
    var innen = document.querySelector('.vorschau-leiste .vl-innen');
    if (!innen) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.style.marginLeft = 'auto';
    function zeigen() {
      b.textContent = an ? 'Platzhalter zeigen' : 'Beispieldaten zeigen';
      platzhalterFuellen(an ? BEISPIEL_PARTNER : {});
    }
    b.addEventListener('click', function () { an = !an; zeigen(); });
    innen.appendChild(b);
    zeigen();
  }
  if (window.self !== window.top) return; // im Portal-Rahmen keine Leiste nötig
  knopfAnhaengen();
})();

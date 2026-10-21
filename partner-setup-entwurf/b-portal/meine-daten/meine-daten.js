/* ==========================================================================
   Meine Daten, Stand 20.10.2026
   FERTIG: Laden, Prüfen, Speichern, Foto hochladen, Kürzel prüfen, Live-Vorschau per postMessage.
   FEHLT:  nichts auf dieser Seite. Anschluss-Funktionen liegen in ../anschluss.js.
   ========================================================================== */

// Beim Einbau anpassen, falls die Vorlage woanders liegt
var VORLAGE_PFAD = '../../a-landingpage/index.html';

var form = document.getElementById('form');
var fehler = document.getElementById('fehler');
var iframe = document.getElementById('vorschau');
var fotoUrl = '';

function nurZiffern(nr) {
  var z = String(nr || '').replace(/[^\d+]/g, '');
  if (z.indexOf('00') === 0) z = '+' + z.slice(2);
  return z.replace(/\+/g, '');
}

function kuerzelSauber(text) {
  return String(text || '').toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
}

function datenAusForm() {
  var d = Object.fromEntries(new FormData(form).entries());
  Object.keys(d).forEach(function (k) { if (typeof d[k] === 'string') d[k] = d[k].trim(); });
  d.foto = fotoUrl;
  return d;
}

/* ---------- Vorschau ---------- */
function vorschauSchicken() {
  var d = datenAusForm();
  var leer = function (w, ph) { return w ? w : ph; };
  if (iframe.contentDocument) { try { iframe.contentDocument.documentElement.setAttribute('data-test', d.testgeraet || 'ja'); } catch (e) {} }
  iframe.contentWindow && iframe.contentWindow.postMessage({
    typ: 'partnerdaten',
    farbe: d.farbe,
    daten: {
      MARKE: 'Marke folgt',
      VORNAME: leer(d.vorname, 'Vorname'),
      NACHNAME: leer(d.nachname, 'Nachname'),
      ORT: leer(d.ort, 'Ort'),
      TELEFON: leer(d.telefon, 'Telefon'),
      WHATSAPP: nurZiffern(d.whatsapp || d.telefon),
      EMAIL: leer(d.email, 'E-Mail'),
      KUERZEL: d.kuerzel,
      FOTO: d.foto,
      UEBER_MICH: leer(d.ueber_mich, 'Hier stehen deine Sätze über dich.'),
      TESTGERAET: d.testgeraet || 'ja',
      IMPRESSUM_URL: '#', DATENSCHUTZ_URL: '#'
    }
  }, '*');
}
var vorschauZeit;
function vorschauBald() { clearTimeout(vorschauZeit); vorschauZeit = setTimeout(vorschauSchicken, 150); }
iframe.addEventListener('load', vorschauSchicken);
form.addEventListener('input', vorschauBald);
form.addEventListener('change', vorschauBald);

document.getElementById('vorschau-auf').addEventListener('click', function () {
  document.getElementById('vorschau-spalte').classList.add('offen'); vorschauSchicken();
});
document.getElementById('vorschau-zu').addEventListener('click', function () {
  document.getElementById('vorschau-spalte').classList.remove('offen');
});

/* ---------- Zeichen zählen ---------- */
var ueber = form.elements.ueber_mich;
function zaehlen() { document.getElementById('zeichen').textContent = ueber.value.length; }
ueber.addEventListener('input', zaehlen);

/* ---------- Foto ---------- */
document.getElementById('foto-datei').addEventListener('change', async function (e) {
  var datei = e.target.files[0];
  if (!datei) return;
  if (datei.size > 10 * 1024 * 1024) { meldung('Das Foto ist größer als 10 MB. Bitte nimm ein kleineres.'); return; }
  var r = await fotoHochladen(datei);
  if (!r.ok) { meldung('Das Foto konnte nicht hochgeladen werden.'); return; }
  fotoUrl = r.url;
  fotoZeigen();
  vorschauSchicken();
});
function fotoZeigen() {
  var v = document.getElementById('foto-vorschau');
  v.style.backgroundImage = fotoUrl ? 'url("' + fotoUrl + '")' : '';
  v.classList.toggle('hat-foto', !!fotoUrl);
}

/* ---------- Kürzel ---------- */
var kuerzelFeld = form.elements.kuerzel, kuerzelInfo = document.getElementById('kuerzel-info');
var kuerzelStandard = kuerzelInfo.textContent, kuerzelFrei = true;
kuerzelFeld.addEventListener('input', function () {
  var s = kuerzelSauber(kuerzelFeld.value);
  if (s !== kuerzelFeld.value && !/-$/.test(kuerzelFeld.value)) kuerzelFeld.value = s;
});
kuerzelFeld.addEventListener('blur', async function () {
  kuerzelFeld.value = kuerzelSauber(kuerzelFeld.value);
  if (!kuerzelFeld.value) { kuerzelInfo.textContent = kuerzelStandard; return; }
  var r = await kuerzelPruefen(kuerzelFeld.value);
  kuerzelFrei = r.frei;
  kuerzelInfo.textContent = r.frei ? 'Frei. Dein Link: {{DOMAIN}}/' + kuerzelFeld.value : 'Dieses Kürzel ist schon vergeben. Probier zum Beispiel Vorname und Ort.';
  kuerzelInfo.className = 'zusatz ' + (r.frei ? 'ok' : 'fehler');
  feldFalsch(kuerzelFeld, !r.frei);
});
form.elements.vorname.addEventListener('blur', function () {
  if (!kuerzelFeld.value && form.elements.vorname.value) kuerzelFeld.value = kuerzelSauber(form.elements.vorname.value);
});

/* ---------- Laden ---------- */
(async function () {
  var p = await partnerLaden();
  Object.keys(p).forEach(function (k) {
    var el = form.elements[k];
    if (!el || k === 'farbe' || k === 'testgeraet') return;
    el.value = p[k] || '';
  });
  var test = form.querySelector('input[name="testgeraet"][value="' + (p.testgeraet || 'ja') + '"]');
  if (test) test.checked = true;
  var farbe = form.querySelector('input[name="farbe"][value="' + (p.farbe || 'oliv') + '"]');
  if (farbe) farbe.checked = true;
  fotoUrl = p.foto || '';
  fotoZeigen();
  zaehlen();
  vorschauSchicken();
})();

/* ---------- Prüfen und Speichern ---------- */
function pruefen(d) {
  var fehlt = [];
  form.querySelectorAll('[required]').forEach(function (el) {
    var leer = !el.value.trim();
    feldFalsch(el, leer);
    if (leer) fehlt.push(el);
  });
  ['email', 'impressum_email'].forEach(function (n) {
    if (d[n] && !EMAIL_MUSTER.test(d[n])) { feldFalsch(form.elements[n], true); fehlt.push(form.elements[n]); }
  });
  if (!kuerzelFrei) fehlt.push(kuerzelFeld);
  if (fehlt.length) {
    fehler.textContent = 'Bitte prüf die rot markierten Felder.';
    fehlt[0].focus();
    return false;
  }
  return true;
}

async function speichern(weiter) {
  fehler.textContent = '';
  var d = datenAusForm();
  d.whatsapp = nurZiffern(d.whatsapp || d.telefon);
  // "Nur speichern" geht auch halb ausgefüllt, "weiter" braucht alles
  if (weiter && !pruefen(d)) return;
  if (weiter && !fotoUrl) { fehler.textContent = 'Bitte lad noch ein Foto von dir hoch.'; return; }
  var r = await partnerSpeichern(d);
  if (!r.ok) { fehler.textContent = r.fehler || 'Speichern hat nicht geklappt.'; return; }
  if (weiter) location.href = '../paket/index.html';
  else meldung('Gespeichert.');
}
form.addEventListener('submit', function (e) { e.preventDefault(); speichern(true); });
document.getElementById('nur-speichern').addEventListener('click', function () { speichern(false); });
document.getElementById('abmelden').addEventListener('click', function () { abmelden(); });

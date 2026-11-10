// Landingpage Ursprungskraft: Empfehlungslink, Auswahl aus dem Hero, Anfrageformular.
// Empfehlungslink: ursprungskraft.net/?von=<kurz> (später auch ursprungskraft.net/<kurz>).
// Der Empfehler wird 30 Tage gemerkt, damit eine spätere Anfrage ihm gutgeschrieben wird.

const $ = (s) => document.querySelector(s);
const MERKEN_TAGE = 30;
// Neutrale Seite unter /wasser/ (für Influencer): kein Firmen- oder Personenname
const NEUTRAL = location.pathname.includes('/wasser');
const BERATER = NEUTRAL ? 'dein Berater' : 'Daniel';

function empfehlerKurz() {
  const aus = new URLSearchParams(location.search).get('von');
  try {
    if (aus) { localStorage.setItem('uk-von', JSON.stringify({ kurz: aus.toLowerCase(), bis: Date.now() + MERKEN_TAGE * 864e5 })); return aus.toLowerCase(); }
    const g = JSON.parse(localStorage.getItem('uk-von') || 'null');
    if (g && g.bis > Date.now()) return g.kurz;
  } catch (e) { /* ohne Speicher eben ohne Empfehler */ }
  return null;
}

let empfehler = null, empfehlerKurzWert = null;
async function start() {
  const kurz = empfehlerKurz();
  if (kurz) {
    try { empfehler = await Daten.empfehler(kurz); } catch (e) { empfehler = null; }
    if (empfehler) {
      empfehlerKurzWert = kurz;
      const box = $('#empfohlen');
      box.innerHTML = `Dir empfohlen von <b>${[empfehler.vorname, empfehler.nachname].filter(Boolean).join(' ').replace(/^Beispiel /, '')}</b>`;
      box.hidden = false;
      const fest = $('#empfohlen-fest');
      if (fest) { fest.innerHTML = box.innerHTML; fest.hidden = false; }
      if (NEUTRAL) partnerKontakt(kurz);
    }
  }
  document.querySelectorAll('[data-anliegen]').forEach((a) => a.addEventListener('click', () => {
    const r = document.querySelector(`input[name=anliegen][value=${a.dataset.anliegen}]`);
    if (r) r.checked = true;
  }));
  const ds = (e) => { e.preventDefault(); alert('Die Datenschutzerklärung folgt, bevor die Seite online geht.'); };
  $('#ds').onclick = ds; $('#ds2').onclick = ds;
  $('#interessen').innerHTML = Daten.VERMERKE.map((v) => `<label><input type="checkbox" name="vermerke" value="${v.id}"> <span>${v.frage || v.name}</span></label>`).join('');
  $('#anfrage').onsubmit = senden;
}

// Baukasten aus dem Partnerportal: was der Partner hinterlegt hat (WhatsApp, Telefon, E-Mail, Termin-Link), sonst nichts
async function partnerKontakt(kurz) {
  let s = null;
  try { s = await Daten.partnerSeite(kurz); } catch (e) { s = null; }
  const box = $('#partner-kontakt');
  if (!s || !box) return;
  const e = (x) => String(x || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ziffern = (x) => String(x || '').replace(/[^\d+]/g, '').replace(/^00/, '+');
  const wege = [
    s.whatsapp && `<a href="https://wa.me/${e(ziffern(s.whatsapp).replace('+', ''))}" target="_blank" rel="noopener">WhatsApp schreiben</a>`,
    s.telefon && `<a href="tel:${e(ziffern(s.telefon))}">Anrufen</a>`,
    s.email && `<a href="mailto:${e(s.email)}">E-Mail schreiben</a>`,
    s.termin && `<a href="${e(s.termin)}" target="_blank" rel="noopener">Termin buchen</a>`,
  ].filter(Boolean);
  if (!s.text && !wege.length) return;
  box.innerHTML = `${s.text ? `<p>${e(s.text)}</p>` : ''}${wege.length ? `<div class="wege">${wege.join('')}</div>` : ''}`;
  box.hidden = false;
}

async function senden(e) {
  e.preventDefault();
  const f = e.target, w = Object.fromEntries(new FormData(f).entries());
  const fehler = $('#fehler');
  if (!w.vorname.trim() || !w.nachname.trim()) return (fehler.textContent = 'Bitte trag deinen Vor- und Nachnamen ein.');
  if (!w.strasse.trim() || !w.plz.trim() || !w.ort.trim()) return (fehler.textContent = `Bitte trag deine Anschrift ein, damit ${BERATER} zu dir kommen kann.`);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.email.trim())) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
  if (!w.ok) return (fehler.textContent = 'Bitte bestätige noch, dass wir deine Angaben speichern dürfen.');
  fehler.textContent = '';
  const land = /deutschland|^de$/i.test(w.land) ? 'DE' : /österreich|oesterreich|^at$/i.test(w.land) ? 'AT' : /schweiz|^ch$/i.test(w.land) ? 'CH' : 'anderes';
  try {
    await Daten.anfrage({
      vorname: w.vorname.trim(), nachname: w.nachname.trim(), email: w.email.trim(), telefon: w.telefon.trim(), erreichbar: (w.erreichbar || '').trim(), strasse: w.strasse.trim(), plz: w.plz.trim(), ort: w.ort.trim(), land,
      vermerke: new FormData(f).getAll('vermerke'), anliegen: w.anliegen, nachricht: w.nachricht.trim(), von: empfehlerKurzWert,
    });
    f.innerHTML = `<div class="eyebrow">Danke, ${w.vorname.trim().replace(/[<>&"]/g, '')}</div><h3>Deine Anfrage ist angekommen</h3>
      <p class="muted" style="margin:0">${NEUTRAL ? 'Wir melden uns' : 'Daniel meldet sich'} bei dir. Bis dahin kannst du dir in Ruhe die fünf Wasserarten ansehen.</p>`;
  } catch (err) {
    fehler.textContent = 'Das hat gerade nicht geklappt. Bitte versuch es noch einmal' + (NEUTRAL ? '.' : ' oder schreib an info@ursprungskraft.net.');
  }
}

start();

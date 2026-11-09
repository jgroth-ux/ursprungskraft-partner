// Sichtbare Texte aller Ansichten durchsuchen (Korrektur 2, "Fertig heißt")
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const U = 'http://localhost:8766/partner/';
  const seiten = ['?vorschau=anmelden#start', '?vorschau=anmelden#registrieren', '?vorschau=normal#start', '?vorschau=normal#kunden', '?vorschau=normal#kunden/k2', '?vorschau=normal#kunden/k4', '?vorschau=normal#kunden/neu', '?vorschau=normal#termine', '?vorschau=normal#termine/neu',
    '?vorschau=normal#tools', '?vorschau=normal#tools/seite', '?vorschau=normal#flyer', '?vorschau=normal#wissen', '?vorschau=normal#wissen/produkte', '?vorschau=normal#wissen/einwaende', '?vorschau=normal#neuigkeiten', '?vorschau=normal#mehr',
    '?vorschau=normal#konto', '?vorschau=normal#menue', '?vorschau=normal&einstieg=0#start', '?vorschau=normal&einstieg=1#start', '?vorschau=normal&einstieg=2#start', '?vorschau=normal&einstieg=3#start',
    '?vorschau=gesperrt#tools', '?vorschau=gesperrt#tools/seite', '?vorschau=gesperrt#flyer', '?vorschau=gesperrt#wissen', '?vorschau=leer#start', '?vorschau=leer#termine', '?vorschau=leer#kunden'];
  const lesen = () => p.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); const d = document.querySelector('dialog[open]');
    return document.body.innerText + ' ' + (d ? d.innerText : '') + ' ' + [...document.querySelectorAll('[placeholder],[title],[aria-label],img[alt]')].map((e) => e.getAttribute('placeholder') || e.getAttribute('title') || e.getAttribute('aria-label') || e.getAttribute('alt')).join(' ') + ' ' + document.title; });
  let alles = '';
  for (const s of seiten) { await p.goto(U + s); await p.waitForTimeout(1300); alles += '\n' + await lesen(); }
  // Geöffneter Termin und Android-Anleitung
  await p.goto(U + '?vorschau=normal#termine'); await p.waitForTimeout(1200); await p.click('.kal-chip >> nth=0'); await p.waitForTimeout(400); alles += '\n' + await lesen();
  await p.goto(U + '?vorschau=normal&einstieg=2#start'); await p.waitForTimeout(1200); await p.click('[data-system=android]'); await p.waitForTimeout(400); alles += '\n' + await lesen();
  let bo = '';
  for (const s of ['?vorschau#bo/uebersicht', '?vorschau#bo/menue']) { await p.goto(U + s); await p.waitForTimeout(1500); bo += '\n' + await lesen(); }
  const zahl = (t, re) => (t.match(re) || []).length;
  const zeig = (t, re) => [...t.matchAll(re)].slice(0, 5).map((m) => t.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, ' ')).join(' | ');
  console.log('Partneransichten geprüft:', seiten.length + 2, ', Zeichen:', alles.length);
  for (const [n, re] of [['"Werkzeug"', /Werkzeug/gi], ['"Wasser-Check-Seite"', /Wasser-Check-Seite/gi], ['"in deinen Kunden"', /in deinen Kunden/gi], ['Gedankenstriche (U+2013, U+2014)', /[–—]/g],
    ['Network, Downline, passives Einkommen', /network|downline|passives Einkommen/gi], ['"Verkostung"', /Verkostung/gi], ['"Kundendatenbank"', /Kundendatenbank/gi], ['Prozent ohne Leerzeichen (z. B. 20%)', /\d%/g]])
    console.log(n + ':', zahl(alles, re), zahl(alles, re) ? ' -> ' + zeig(alles, re) : '');
  console.log('"Kangen" in Partneransichten:', zahl(alles, /Kangen/gi), zahl(alles, /Kangen/gi) ? ' -> ' + zeig(alles, /Kangen/gi) : '');
  console.log('Backoffice (2 Ansichten): Werkzeug', zahl(bo, /Werkzeug/gi), ', Gedankenstriche', zahl(bo, /[–—]/g), zahl(bo, /[–—]/g) ? ' -> ' + zeig(bo, /[–—]/g) : '');
  await b.close();
})();

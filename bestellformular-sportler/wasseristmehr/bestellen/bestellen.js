// Bestellseite der Sportler auf wasseristmehr.com (12.11.2026). Eine Vorlage für alle Sportler, das Kürzel steht in <body data-kurz>.
// Nur der LeveLuk K8. Ablauf, Pflichtfelder, Unterschrift, Ausweis und Raten wie auf der bisherigen Bestellseite (bestellen/bestellen.js).
// Preise, MwSt, Versand und Raten kommen nur aus uk_preise, hier steht keine eigene Zahl.
// Die Bestellung geht wie dort in den Speicher "bestellungen" und an uk_bestellung, mit von = Kürzel des Sportlers.
// Mit ?demo wird nichts hochgeladen und nichts gespeichert, die Seite zeigt nach dem Absenden nur die Danke-Ansicht.
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const sb = supabase.createClient('https://ngcbmpuqcqbelfoelwby.supabase.co', 'sb_publishable_XXX', { auth: { persistSession: false } });
const von = (document.body.dataset.kurz || '').toLowerCase().replace(/[^a-z0-9-]/g, '') || null;
const DEMO = new URLSearchParams(location.search).has('demo');
const NICHT_EU = ['CH', 'LI', 'NO', 'GB'];
const LAENDER = { CH: 'Schweiz', DE: 'Deutschland', AT: 'Österreich', LI: 'Liechtenstein', IT: 'Italien', FR: 'Frankreich', NL: 'Niederlande', BE: 'Belgien', LU: 'Luxemburg', ES: 'Spanien', NO: 'Norwegen', GB: 'Vereinigtes Königreich' };
const form = $('#bestellung');
const werte = () => Object.fromEntries(new FormData(form).entries());

// ---------- Preise, MwSt, Versand, Raten (nur aus uk_preise) ----------
const PREIS = {}, MWST = {}, VERSAND = {}, EU = [], NONEU = [], RATEN_K8 = [];
let preiseDa = false;
const zone = (l) => (l === 'DE' ? 'DE' : EU.includes(l) ? 'EU' : NONEU.includes(l) ? 'NONEU' : null);
const lieferland = (w) => (w.liefer_anders && w.liefer_land_kurz) || w.land_kurz;
// Ein Gerät, ein K8. Versand je Zone, unbekanntes Land: Versand null (dann ohne Gesamtbetrag, wie bisher).
function rechnen(l) {
  const netto = PREIS.k8, z = zone(l), v = z && VERSAND.k8 ? VERSAND.k8[z] : null;
  const versand = v == null ? null : Number(v);
  const mwst = MWST[l] ? Math.round(netto * MWST[l] * 100) / 100 : 0;
  return { netto, versand, mwst, gesamt: netto + (versand || 0) + mwst };
}
async function preiseLaden() {
  const { data, error } = await sb.rpc('uk_preise');
  if (error || !data || !data.preis || data.preis.k8 == null) {
    $('#fehler').textContent = 'Die Preise konnten gerade nicht geladen werden. Bitte lade die Seite neu.';
    return;
  }
  Object.assign(PREIS, data.preis); Object.assign(MWST, data.mwst || {}); Object.assign(VERSAND, data.versand || {});
  EU.push(...(data.eu || [])); NONEU.push(...(data.nicht_eu || [])); RATEN_K8.push(...(data.raten_k8 || []));
  // Laufzeiten aus der Ratentabelle, damit es keine zweite Liste gibt
  const monate = [...new Set(RATEN_K8.flatMap((t) => Object.keys(t.raten || {})))].map(Number).filter((n) => n > 0).sort((a, b) => a - b);
  $('#raten-anzahl').innerHTML = monate.map((n) => `<option value="${n}">${n} Monate</option>`).join('');
  preiseDa = true;
  anpassen();
}
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const eur = (n) => Number(n).toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
const zollText = 'Geliefert wird ohne MwSt. Bei der Lieferung kommen Verzollung und Einfuhrsteuer dazu.';
function preisZeile(x, l) {
  const teile = [x.versand != null ? `${eur(x.versand)} Versand` : 'Versand', x.mwst ? `${eur(x.mwst)} MwSt.` : ''].filter(Boolean).join(' und ');
  const zoll = NICHT_EU.includes(l) ? `<span class="warn">${zollText}</span>` : '';
  // Netto groß, zzgl. MwSt. Der Gesamtbetrag muss vor dem verbindlichen Bestellen sichtbar sein.
  return `Preis bei Überweisung: <b>${eur(x.netto)}</b> zzgl. ${teile}${x.versand != null ? `<span class="warn">Gesamtbetrag ${eur(x.gesamt)}</span>` : ''}${zoll}`;
}
function rateK8(w) {
  const x = rechnen(lieferland(w));
  return RATEN_K8.find((r) => Math.abs(r.gesamt - x.gesamt) < 0.01) || null;
}
function preiseZeigen(w) {
  const l = lieferland(w), sel = $('#raten-anzahl'), ok = preiseDa && !!l;
  const x = ok ? rechnen(l) : null, tab = ok ? rateK8(w) : null;
  $('#start-preis').innerHTML = ok ? `<b>${eur(x.netto)}</b><small>${MWST[l] ? 'zzgl. MwSt. und Versand' : 'zzgl. Versand'}</small>` : '';
  $('#preis-info').innerHTML = ok ? preisZeile(x, l) : '';
  [...sel.options].forEach((o) => { const r = tab && tab.raten[o.value]; o.textContent = r ? `${o.value} Monate: Anzahlung ${eur(r[0])}, dann ${eur(r[1])} im Monat` : `${o.value} Monate`; });
  // Kurz vor dem Knopf noch einmal alles auf einen Blick
  if (!ok) { $('#zusammenfassung').innerHTML = ''; return; }
  const r = w.zahlung === 'raten' && tab ? tab.raten[w.raten_anzahl] : null;
  const zahlung = w.zahlung === 'raten' ? `Ratenzahlung über Enagic, ${w.raten_anzahl} Monate${r ? `<small>Anzahlung ${eur(r[0])}, dann ${eur(r[1])} im Monat</small>` : ''}` : w.zahlung === 'ueberweisung' ? 'Überweisung' : '';
  const ziel = l === 'XX' ? (w.liefer_anders ? w.liefer_land_anders : w.land_anders) || 'anderes Land' : LAENDER[l];
  const zeilen = [
    ['Gerät', 'LeveLuk K8'],
    ['Lieferung nach', esc(ziel)],
    ['Preis', `${eur(x.netto)} zzgl. ${[x.versand != null ? `${eur(x.versand)} Versand` : 'Versand', x.mwst ? `${eur(x.mwst)} MwSt.` : ''].filter(Boolean).join(' und ')}${NICHT_EU.includes(l) ? `<small>${zollText}</small>` : ''}`],
    zahlung && ['Zahlung', zahlung],
    x.versand != null && ['Gesamtbetrag', eur(x.gesamt), 'summe'],
  ].filter(Boolean);
  $('#zusammenfassung').innerHTML = zeilen.map(([k, v, c]) => `<tr${c ? ` class="${c}"` : ''}><th>${k}</th><td>${v}</td></tr>`).join('');
}

// ---------- Land zuerst ----------
// Drei Länder mit Flagge, der Rest unter "Anderes Land". Die Wahl setzt das versteckte Feld land_kurz.
// Danach verschwinden die Flaggen, im Startfeld und unter der Adresse steht "Land ändern".
const FLAGGE = {
  DE: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="7" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/></svg>',
  CH: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#D52B1E"/><path d="M13 5h4v3.5h3.5v4H17V16h-4v-3.5H9.5v-4H13z" fill="#fff"/></svg>',
  AT: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#C8102E"/><rect y="6.67" width="30" height="6.67" fill="#fff"/></svg>',
  XX: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#E8E6E0"/><circle cx="15" cy="10" r="6.5" fill="none" stroke="#5C6367" stroke-width="1.2"/><path d="M8.5 10h13M15 3.5c-2.5 2-2.5 11 0 13M15 3.5c2.5 2 2.5 11 0 13" fill="none" stroke="#5C6367" stroke-width="1.2"/></svg>'
};
const VORN = ['DE', 'CH', 'AT'];
$('#laender').innerHTML = [...VORN, 'XX'].map((l) => `<button type="button" class="land-knopf" data-land="${l}" aria-pressed="false">${FLAGGE[l]}${l === 'XX' ? 'Anderes Land' : LAENDER[l]}</button>`).join('');
$('#land-sonst').innerHTML = '<option value="">bitte wählen</option>' + [...Object.keys(LAENDER).filter((l) => !VORN.includes(l)).map((l) => `<option value="${l}">${LAENDER[l]}</option>`), '<option value="XX">anderes Land</option>'].join('');
function landZeigen() {
  const l = form.land_kurz.value, sonst = !!l && !VORN.includes(l), offen = sonst || $('#land-sonst-feld').dataset.offen === '1';
  $$('.land-knopf').forEach((k) => k.setAttribute('aria-pressed', String(k.dataset.land === l || (k.dataset.land === 'XX' && offen))));
  $('#land-sonst-feld').hidden = !offen;
  if (sonst) $('#land-sonst').value = l;
  document.body.classList.toggle('land-ok', !!l);
  $$('.land-name').forEach((el) => { el.textContent = l === 'XX' ? 'anderes Land' : LAENDER[l] || ''; });
}
// Land gewählt: Flaggen weg, die Seite springt zum ersten Schritt der Bestellung
function landGewaehlt() { document.body.classList.remove('land-aendern'); anpassen(); if (form.land_kurz.value) form.scrollIntoView({ block: 'start' }); }
$$('.land-aendern').forEach((b) => { b.onclick = () => { document.body.classList.add('land-aendern'); $('#start').scrollIntoView({ block: 'start' }); }; });
$$('.land-knopf').forEach((k) => { k.onclick = () => {
  const sonst = k.dataset.land === 'XX';
  $('#land-sonst-feld').dataset.offen = sonst ? '1' : '';
  if (sonst) { anpassen(); $('#land-sonst').focus(); return; }
  form.land_kurz.value = k.dataset.land;
  landGewaehlt();
}; });
$('#land-sonst').onchange = (e) => { form.land_kurz.value = e.target.value; landGewaehlt(); };
$('#zahler-land').innerHTML = '<option value="">bitte wählen</option>' + Object.keys(LAENDER).map((l) => `<option value="${l}">${LAENDER[l]}</option>`).join('');

// ---------- Felder ein- und ausblenden ----------
// Raten nur innerhalb der EU sowie Schweiz und Norwegen (Enagic, Zusatz Nicht-EU). Maßgeblich ist das Land der Bestellerin.
const ratenMoeglich = (w) => !['GB', 'LI'].includes(w.land_kurz) && $('#raten-anzahl').options.length > 0;
// Bankeinzug nur im Euro-Raum. Maßgeblich ist das Land dessen, der die Raten zahlt.
const OHNE_LASTSCHRIFT = ['CH', 'LI', 'NO', 'GB', 'XX'];
const zahlerLand = (w) => (w.zahler === 'anderer' ? w.zahler_land_kurz : w.land_kurz);
// Solange das Land des Zahlers fehlt, weder IBAN noch Dauerauftrag zeigen
const mitLastschrift = (w) => !!zahlerLand(w) && !OHNE_LASTSCHRIFT.includes(zahlerLand(w));
const ZAHLER_PFLICHT = [['zahler_name', 'den Namen dessen, der die Raten zahlt'], ['zahler_strasse', 'seine Straße'], ['zahler_plz', 'seine PLZ'], ['zahler_ort', 'seinen Ort'], ['zahler_land_kurz', 'sein Land'], ['zahler_tel', 'seine Telefonnummer'], ['zahler_email', 'seine E-Mail-Adresse']];
const mitRaten = (w) => w.zahlung === 'raten';
function anpassen() {
  landZeigen();
  const w = werte();
  $('#land-anders').hidden = w.land_kurz !== 'XX';
  $('#ustid').hidden = !w.firma;
  $$('[data-liefer]').forEach((el) => { el.hidden = !w.liefer_anders; });
  $('#liefer-land-anders').hidden = !(w.liefer_anders && w.liefer_land_kurz === 'XX');
  const raten = ratenMoeglich(w);
  $('#raten-wahl').hidden = !raten;
  if (!raten && w.zahlung === 'raten') form.zahlung.value = 'ueberweisung';
  const v = werte();
  $('#raten').hidden = !mitRaten(v);
  $('#bank').hidden = !mitRaten(v);
  $('#zahler-felder').hidden = v.zahler !== 'anderer';
  $('#iban-felder').hidden = !mitLastschrift(v);
  $('#dauerauftrag').hidden = mitLastschrift(v) || !zahlerLand(v);
  $('#ausweis-block').hidden = !(v.als === 'Distributor' || mitRaten(v));
  $('#distributor-hinweis').hidden = v.als !== 'Distributor';
  preiseZeigen(v);
}
form.addEventListener('change', anpassen);
form.addEventListener('input', (e) => { if (['firma', 'land_anders', 'liefer_land_anders'].includes(e.target.name)) anpassen(); });
anpassen();
preiseLaden();
$$('.ausweis input').forEach((f) => {
  f.onchange = () => { const l = f.closest('label'); l.classList.toggle('da', !!f.files[0]); l.firstChild.textContent = f.files[0] ? '✓ ' + f.files[0].name : (f.name === 'ausweis_vorne' ? 'Vorderseite hochladen' : 'Rückseite hochladen'); };
});
$('#ort-datum').textContent = 'Datum: ' + new Date().toLocaleDateString('de-DE');

// ---------- Unterschrift ----------
const pad = $('#pad'), ctx = pad.getContext('2d');
let gezeichnet = false, zeichnet = false, letzter = null;
function padGroesse() {
  const r = pad.getBoundingClientRect(), f = window.devicePixelRatio || 1;
  pad.width = r.width * f; pad.height = r.height * f;
  ctx.setTransform(f, 0, 0, f, 0, 0); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1F2A44';
  gezeichnet = false;
}
padGroesse();
window.addEventListener('resize', () => { if (!gezeichnet) padGroesse(); });
// Das Feld ist beim Laden noch ausgeblendet (erst Land wählen) und hätte dann die Größe 0. Sobald es sichtbar wird, neu vermessen.
if (window.ResizeObserver) new ResizeObserver(() => { if (!gezeichnet && pad.width !== Math.round(pad.getBoundingClientRect().width * (window.devicePixelRatio || 1))) padGroesse(); }).observe(pad);
const punkt = (e) => { const r = pad.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
pad.addEventListener('pointerdown', (e) => { zeichnet = true; letzter = punkt(e); pad.setPointerCapture(e.pointerId); });
pad.addEventListener('pointermove', (e) => {
  if (!zeichnet) return;
  const p = punkt(e); ctx.beginPath(); ctx.moveTo(letzter.x, letzter.y); ctx.lineTo(p.x, p.y); ctx.stroke(); letzter = p; gezeichnet = true;
});
['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => pad.addEventListener(t, () => { zeichnet = false; }));
$('#pad-leeren').onclick = () => { ctx.clearRect(0, 0, pad.width, pad.height); gezeichnet = false; };
// Nur den beschriebenen Bereich als PNG, ohne leeren Rand
function unterschriftBlob() {
  const { width: w, height: h } = pad, d = ctx.getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  const rand = 8, c = document.createElement('canvas');
  c.width = Math.max(1, x1 - x0 + rand * 2); c.height = Math.max(1, y1 - y0 + rand * 2);
  c.getContext('2d').drawImage(pad, x0 - rand, y0 - rand, c.width, c.height, 0, 0, c.width, c.height);
  return new Promise((ok) => c.toBlob(ok, 'image/png'));
}

// ---------- Absenden ----------
const RATEN_FELDER = ['raten_anzahl', 'zahltag', 'schon_finanziert', 'beruf', 'arbeitgeber', 'beschaeftigt_seit', 'arbeitgeber_tel', 'arbeitgeber_adresse'];
form.onsubmit = async (e) => {
  e.preventDefault();
  const fehler = $('#fehler'), knopf = $('#senden');
  const w = werte();
  // Ohne geladene Preise keine Bestellung: sonst könnte etwas anderes im Vertrag landen, als hier stand
  if (!preiseDa) return (fehler.textContent = 'Die Preise konnten gerade nicht geladen werden. Bitte lade die Seite neu.');
  const pflicht = [['vorname', 'deinen Vornamen'], ['nachname', 'deinen Nachnamen'], ['geburtsdatum', 'dein Geburtsdatum'], ['strasse', 'deine Straße'], ['plz', 'deine PLZ'], ['ort', 'deinen Ort'], ['land_kurz', 'dein Land'], ['handy', 'deine Handynummer'], ['email', 'deine E-Mail-Adresse'],
    ...(w.liefer_anders ? [['liefer_name', 'den Namen an der Lieferadresse'], ['liefer_strasse', 'die Straße der Lieferadresse'], ['liefer_plz', 'die PLZ der Lieferadresse'], ['liefer_ort', 'den Ort der Lieferadresse'], ['liefer_land_kurz', 'das Land der Lieferadresse']] : []),
    ['zahlung', 'die Zahlungsart']];
  const fehlt = pflicht.find(([k]) => !String(w[k] || '').trim());
  if (fehlt) return (fehler.textContent = 'Bitte gib noch ' + fehlt[1] + ' an.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.email.trim())) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
  if (mitRaten(w) && w.zahler === 'anderer') { const z = ZAHLER_PFLICHT.find(([k]) => !String(w[k] || '').trim()); if (z) return (fehler.textContent = 'Bitte gib noch ' + z[1] + ' an.'); }
  if (mitRaten(w) && mitLastschrift(w) && !String(w.iban || '').trim()) return (fehler.textContent = 'Für die Ratenzahlung braucht Enagic die IBAN.');
  if (w.als === 'Distributor' && !w.abgesprochen) return (fehler.textContent = 'Du hast „Vertriebspartner werden“ gewählt. Bitte setz noch den Haken, dass ihr darüber gesprochen habt, oder wähl „Als Kunde bestellen“.');
  const ausweisNoetig = w.als === 'Distributor' || mitRaten(w);
  const vorne = form.ausweis_vorne.files[0], hinten = form.ausweis_hinten.files[0];
  if (ausweisNoetig && (!vorne || !hinten)) return (fehler.textContent = 'Bitte lade Vorder- und Rückseite deines Ausweises hoch.');
  if ([vorne, hinten].some((f) => f && f.size > 10 * 1024 * 1024)) return (fehler.textContent = 'Ein Ausweisfoto ist größer als 10 MB. Bitte ein kleineres Foto nehmen.');
  if (!gezeichnet) return (fehler.textContent = 'Bitte unterschreib noch im Feld oben.');
  if (!w.agb) return (fehler.textContent = 'Bitte bestätige noch, dass du die AGB gelesen hast.');
  fehler.textContent = ''; knopf.disabled = true; knopf.textContent = 'Wird gesendet ...';
  try {
    const ordner = 'eingang/' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2));
    const hoch = async (name, datei, typ) => {
      if (DEMO) return ordner + '/' + name;
      const { error } = await sb.storage.from('bestellungen').upload(ordner + '/' + name, datei, { contentType: typ || datei.type, upsert: false });
      if (error) throw error; return ordner + '/' + name;
    };
    const dateien = { unterschrift: await hoch('unterschrift.png', await unterschriftBlob(), 'image/png') };
    const endung = (f) => (f.name.match(/\.[a-z0-9]+$/i) || ['.jpg'])[0].toLowerCase();
    if (ausweisNoetig) { dateien.ausweis_vorne = await hoch('ausweis-vorne' + endung(vorne), vorne); dateien.ausweis_hinten = await hoch('ausweis-hinten' + endung(hinten), hinten); }
    const tab = mitRaten(w) ? rateK8(w) : null, rate = tab && tab.raten[w.raten_anzahl];
    if (rate) { w.anzahlung = String(rate[0]); w.monatsrate = String(rate[1]); }
    // Nur speichern, was zur Auswahl gehört (ausgeblendete Felder bleiben sonst im Formular stehen)
    if (!mitRaten(w)) RATEN_FELDER.forEach((k) => delete w[k]);
    if (!mitRaten(w)) { ['iban', 'bic', 'zahler'].forEach((k) => delete w[k]); }
    else if (!mitLastschrift(w)) { delete w.iban; delete w.bic; w.dauerauftrag = 'ja'; }
    if (w.zahler !== 'anderer') ['zahler_name', 'zahler_strasse', 'zahler_plz', 'zahler_ort', 'zahler_land_kurz', 'zahler_tel', 'zahler_email'].forEach((k) => delete w[k]);
    if (!w.liefer_anders) ['liefer_name', 'liefer_strasse', 'liefer_plz', 'liefer_ort', 'liefer_land_kurz', 'liefer_land_anders'].forEach((k) => delete w[k]);
    if (w.als !== 'Distributor') delete w.abgesprochen;
    const daten = { ...w, land: w.land_kurz === 'XX' ? (w.land_anders || '').trim() : LAENDER[w.land_kurz], nicht_eu: NICHT_EU.includes(w.land_kurz), datum: new Date().toISOString().slice(0, 10) };
    if (w.zahler === 'anderer') daten.zahler_land = LAENDER[w.zahler_land_kurz];
    if (w.liefer_anders) {
      daten.liefer_land = w.liefer_land_kurz === 'XX' ? (w.liefer_land_anders || '').trim() : LAENDER[w.liefer_land_kurz];
      // Eine Zeile wie im Enagic-Formular, z. B. "Musterweg 1, DE-10115 Berlin" (auch fürs Dashboard)
      daten.liefer_adresse = `${w.liefer_strasse.trim()}, ${w.liefer_land_kurz !== 'XX' ? w.liefer_land_kurz + '-' : ''}${w.liefer_plz.trim()} ${w.liefer_ort.trim()}`;
    }
    daten.k8 = 'ja'; // Hier gibt es nur den K8. Dashboard und Bot füllen damit das K8-Formular für Enagic aus.
    delete daten.ausweis_vorne; delete daten.ausweis_hinten;
    Object.keys(daten).forEach((k) => { if (typeof daten[k] === 'string') daten[k] = daten[k].trim(); });
    if (DEMO) console.log('Vorschau, nichts gespeichert:', { von, daten, dateien });
    else {
      const { error } = await sb.rpc('uk_bestellung', { p: { von, daten, dateien } });
      if (error) throw error;
    }
    dankeZeigen(w.vorname.trim());
  } catch (err) {
    fehler.textContent = 'Das hat gerade nicht geklappt. Bitte versuch es noch einmal. (' + (err.message || err) + ')';
    knopf.disabled = false; knopf.textContent = 'Verbindlich bestellen';
  }
};
function dankeZeigen(name) {
  form.hidden = true; $('#start').hidden = true; $('.mehr').hidden = true;
  $('#danke-name').textContent = name; $('#danke').hidden = false; window.scrollTo(0, 0);
}

// Vorschau der Danke-Ansicht ohne Absenden: bestellen/#danke
if (location.hash === '#danke') dankeZeigen('Max');

// Kopfleiste bekommt beim Scrollen eine feine Linie, wie auf der Sportseite
const kopf = $('header');
addEventListener('scroll', () => kopf.classList.toggle('gescrollt', scrollY > 10), { passive: true });

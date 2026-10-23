// Bestellseite LeveLuk K8 (19.10.2026, Produktkacheln 23.10.2026).
// Speichert die Angaben, die Unterschrift und bei Bedarf den Ausweis in Supabase.
// Die Enagic-Formulare werden erst im Dashboard ausgefüllt, nachdem Daniel Sponsor und Linie festgelegt hat.
const $ = (s) => document.querySelector(s);
const sb = supabase.createClient('https://ngcbmpuqcqbelfoelwby.supabase.co', 'XXX', { auth: { persistSession: false } });
const NICHT_EU = ['CH', 'LI', 'NO', 'GB'];
const LAENDER = { CH: 'Schweiz', DE: 'Deutschland', AT: 'Österreich', LI: 'Liechtenstein', IT: 'Italien', FR: 'Frankreich', NL: 'Niederlande', BE: 'Belgien', LU: 'Luxemburg', ES: 'Spanien', NO: 'Norwegen', GB: 'Vereinigtes Königreich' };
const von = (new URLSearchParams(location.search).get('von') || '').toLowerCase().replace(/[^a-z0-9-]/g, '') || null;
const form = $('#bestellung');

// Wer den Link geschickt hat, wird nur intern gespeichert (Jasmins Link = automatisch über Jasmin), nicht angezeigt

// ---------- Preise (Stand 19.10.2026, von Daniel) ----------
// Raten: Anzahlung und Monatsrate je Laufzeit. Andere Länder: Preis nennt der Berater.
const PREISE = {
  CH: { voll: '4.657 €', zusatz: 'Die Maschine wird netto in die Schweiz geliefert. Nach der Lieferung kommen Verzollung und Mehrwertsteuer dazu, etwa 400 CHF.',
    raten: { 3: [646, 1328], 6: [676, 664], 10: [716, 398], 16: [776, 249], 24: [856, 166] } },
  DE: { voll: '5.486 €', klein: '4.612 € netto + 874 € MwSt.',
    raten: { 3: [1532, 1328], 6: [1562, 664], 10: [1602, 398.4], 16: [1662, 249], 24: [1742, 166] } },
};
const eur = (n) => Number(n).toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
function preiseZeigen(w) {
  const p = PREISE[w.land_kurz], box = $('#preis-info'), sel = $('#raten-anzahl');
  if (!w.land_kurz) { box.innerHTML = 'Wähl oben dein Land, dann siehst du hier den Preis.'; }
  else if (!p) { box.innerHTML = 'Den genauen Preis für dein Land nennen wir dir persönlich, bevor die Bestellung an Enagic geht.'; }
  else box.innerHTML = `Gesamtpreis bei Überweisung: <b>${p.voll}</b>${p.klein ? ` <span class="hilfe">(${p.klein})</span>` : ''}${p.zusatz ? `<span class="warn">${p.zusatz}</span>` : ''}`;
  [...sel.options].forEach((o) => { const r = p && p.raten[o.value]; o.textContent = r ? `${o.value} Monate: Anzahlung ${eur(r[0])}, dann ${eur(r[1])} im Monat` : `${o.value} Monate`; });
}


// ---------- Produkte (23.10.2026): K8 fest, emGuarde und ANESPA DX zum Mitbestellen ----------
// Preise laut Enagic-Shop ohne MwSt. (Stand 23.10.2026). Schweiz: noch offen, darum "persönlich".
// Die Haken heißen zusatz_emguarde und zusatz_anespa und landen so automatisch in daten (uk_bestellungen).
// Zusatzprodukte gehen NICHT automatisch an Enagic, Daniel klärt Preis und Zahlung vorher mit dem Kunden.
const PRODUKTE = [
  { id: 'k8', fest: true, name: 'LeveLuk K8', bild: '../bilder/k8.jpg',
    kurz: 'Der Wasserionisierer für deine Küche. Fünf Wasserarten aus deinem Leitungswasser.',
    preis: { DE: '5.486 € inkl. MwSt.', CH: '4.657 € geliefert, zzgl. Zoll und MwSt.' },
    text: 'Der K8 steht neben deiner Spüle und wird an den Wasserhahn angeschlossen. Er filtert dein Leitungswasser und teilt es per Elektrolyse in basisches und saures Wasser. So bekommst du per Knopfdruck Trinkwasser, Wasser zum Kochen und Wasser für Pflege und Haushalt.',
    punkte: ['8 platinbeschichtete Titanplatten', '5 Wasserarten von pH 2,5 bis pH 11,5', 'Filterwechsel etwa einmal im Jahr', 'Versand direkt aus Düsseldorf', 'Ratenzahlung möglich'] },
  { id: 'emguarde', name: 'emGuarde Go', bild: '',
    kurz: 'Set mit 2 kleinen Geräten von Enagic für Zuhause, Arbeit und unterwegs.',
    preis: { DE: '2.420 € zzgl. MwSt.' },
    text: 'Enagic beschreibt emGuarde als Gerät, das den Umgang mit elektromagnetischen Feldern im Alltag unterstützen soll, zum Beispiel von WLAN, Handy und Elektrogeräten. Nach Angaben von Enagic ist es nicht dazu bestimmt, Krankheiten zu diagnostizieren, zu behandeln, zu heilen oder zu verhindern.',
    punkte: ['Set mit 2 Geräten und 2 USB-C-Ladekabeln', 'Reichweite je Gerät etwa 3 m Durchmesser', 'Akku 5.000 mAh, bis zu 72 Stunden pro Ladung', 'Eine Taste, keine Einrichtung, keine Wartung', '2 Jahre Garantie'] },
  { id: 'anespa', name: 'ANESPA DX', bild: '',
    kurz: 'Filtersystem von Enagic für Dusche und Badewanne, mit Massage-Duschkopf.',
    preis: { DE: '2.800 € zzgl. MwSt.' },
    text: 'ANESPA DX wird an deine Dusche oder Wanne angeschlossen. Aktivkohle und eine Keramikkartusche filtern das Leitungswasser, laut Enagic entfernt es nahezu das ganze Restchlor. Die Kartusche enthält Mineralsteine aus Japan.',
    punkte: ['Durchfluss 2,6 Liter pro Minute', 'Massage-Duschkopf mit verstellbaren Einstellungen', 'Keramikkartusche etwa alle 3 Jahre (200 € zzgl. MwSt.)', 'Externer Chlorfilter (65 € zzgl. MwSt.)', '3 Jahre Garantie, Zahlung auch in Raten'] },
];
function preisVon(p) { return p.preis[form.land_kurz.value] || (form.land_kurz.value ? 'Preis nennen wir dir persönlich' : 'Preis je nach Land'); }
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const bildVon = (p) => p.bild ? `<img class="pk-bild" src="${p.bild}" alt="${esc(p.name)}">` : `<div class="pk-bild" aria-hidden="true">${esc(p.name)}</div>`;
function produkteZeigen() {
  const gewaehlt = (id) => form.elements['zusatz_' + id] && form.elements['zusatz_' + id].checked;
  $('#produkte').innerHTML = PRODUKTE.map((p) => `<article class="pk${p.fest ? ' haupt' : ''}">
    <button type="button" class="pk-info" data-produkt="${p.id}">${bildVon(p)}<span class="pk-name">${esc(p.name)}</span><span class="pk-kurz">${esc(p.kurz)}</span><span class="pk-preis">${esc(preisVon(p))}</span><span class="pk-mehr">Mehr erfahren</span></button>
    ${p.fest ? '<div class="pk-fuss fest">In deiner Bestellung</div>' : `<label class="pk-fuss"><input type="checkbox" name="zusatz_${p.id}"${gewaehlt(p.id) ? ' checked' : ''}> Mitbestellen</label>`}
  </article>`).join('');
  document.querySelectorAll('[data-produkt]').forEach((b) => { b.onclick = () => produktZeigen(b.dataset.produkt); });
}
function produktZeigen(id) {
  const p = PRODUKTE.find((x) => x.id === id), dlg = $('#pk-dlg'), feld = form.elements['zusatz_' + id];
  $('#pk-dlg-innen').innerHTML = `<button type="button" class="pk-zu" aria-label="Schließen">×</button>${bildVon(p)}<h3>${esc(p.name)}</h3><p><b>${esc(preisVon(p))}</b></p><p>${esc(p.text)}</p><ul>${p.punkte.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <button type="button" class="knopf" id="pk-aktion">${p.fest ? 'Weiter zur Bestellung' : (feld.checked ? 'Wieder entfernen' : 'Mitbestellen')}</button>
    ${p.fest ? '' : '<p class="hilfe" style="margin:10px 0 0">Preis und Bezahlung für Ergänzungen klären wir persönlich mit dir, bevor etwas an Enagic geht.</p>'}`;
  $('.pk-zu').onclick = () => dlg.close();
  $('#pk-aktion').onclick = () => { if (!p.fest) { feld.checked = !feld.checked; anpassen(); } dlg.close(); };
  dlg.showModal();
}
produkteZeigen();

// ---------- Felder ein- und ausblenden ----------
function anpassen() {
  const w = Object.fromEntries(new FormData(form).entries());
  $('#land-anders').hidden = w.land_kurz !== 'XX';
  $('#ustid').hidden = !w.firma;
  document.querySelectorAll('[data-liefer]').forEach((el) => { el.hidden = !w.liefer_anders; });
  $('#raten').hidden = w.zahlung !== 'raten';
  // Raten nur innerhalb der EU sowie Schweiz und Norwegen (Enagic, Zusatz Nicht-EU)
  const ratenMoeglich = !['GB', 'LI'].includes(w.land_kurz);
  $('#raten-wahl').hidden = !ratenMoeglich;
  if (!ratenMoeglich && w.zahlung === 'raten') form.zahlung.value = 'ueberweisung';
  $('#ausweis-block').hidden = !(w.als === 'Distributor' || w.zahlung === 'raten');
  preiseZeigen(w);
  document.querySelectorAll('.pk-preis').forEach((el, i) => { el.textContent = preisVon(PRODUKTE[i]); });
  const zusatz = PRODUKTE.filter((p) => w['zusatz_' + p.id]).map((p) => p.name);
  if (zusatz.length) $('#preis-info').insertAdjacentHTML('beforeend', `<span class="warn">Dazu gewünscht: ${zusatz.join(', ')}. Preis und Bezahlung dafür klären wir persönlich mit dir, bevor etwas an Enagic geht.</span>`);
}
form.addEventListener('change', anpassen);
form.addEventListener('input', (e) => { if (e.target.name === 'firma') anpassen(); });
anpassen();
document.querySelectorAll('.ausweis input').forEach((f) => {
  f.onchange = () => { const l = f.closest('label'); l.classList.toggle('da', !!f.files[0]); l.firstChild.textContent = f.files[0] ? '✓ ' + f.files[0].name : (f.name === 'ausweis_vorne' ? 'Vorderseite hochladen' : 'Rückseite hochladen'); };
});
$('#ort-datum').textContent = 'Datum: ' + new Date().toLocaleDateString('de-CH');

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
form.onsubmit = async (e) => {
  e.preventDefault();
  const fehler = $('#fehler'), knopf = $('#senden');
  const w = Object.fromEntries(new FormData(form).entries());
  const pflicht = [['als', 'ob du als Verbraucher oder Distributor bestellst'], ['vorname', 'deinen Vornamen'], ['nachname', 'deinen Nachnamen'], ['geburtsdatum', 'dein Geburtsdatum'], ['strasse', 'deine Straße'], ['plz', 'deine PLZ'], ['ort', 'deinen Ort'], ['land_kurz', 'dein Land'], ['handy', 'deine Handynummer'], ['email', 'deine E-Mail-Adresse'], ['zahlung', 'wie du bezahlen möchtest']];
  const fehlt = pflicht.find(([k]) => !String(w[k] || '').trim());
  if (fehlt) return (fehler.textContent = 'Bitte gib noch ' + fehlt[1] + ' an.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.email.trim())) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
  if (w.zahlung === 'raten' && !String(w.iban || '').trim()) return (fehler.textContent = 'Für die Ratenzahlung braucht Enagic deine IBAN.');
  const ausweisNoetig = w.als === 'Distributor' || w.zahlung === 'raten';
  const vorne = form.ausweis_vorne.files[0], hinten = form.ausweis_hinten.files[0];
  if (ausweisNoetig && (!vorne || !hinten)) return (fehler.textContent = 'Bitte lade Vorder- und Rückseite deines Ausweises hoch.');
  if ([vorne, hinten].some((f) => f && f.size > 10 * 1024 * 1024)) return (fehler.textContent = 'Ein Ausweisfoto ist größer als 10 MB. Bitte ein kleineres Foto nehmen.');
  if (!gezeichnet) return (fehler.textContent = 'Bitte unterschreib noch im Feld oben.');
  if (!w.agb || !w.weitergabe) return (fehler.textContent = 'Bitte bestätige noch die beiden Haken.');
  fehler.textContent = ''; knopf.disabled = true; knopf.textContent = 'Wird gesendet ...';
  try {
    const ordner = 'eingang/' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2));
    const hoch = async (name, datei, typ) => {
      const { error } = await sb.storage.from('bestellungen').upload(ordner + '/' + name, datei, { contentType: typ || datei.type, upsert: false });
      if (error) throw error; return ordner + '/' + name;
    };
    const dateien = { unterschrift: await hoch('unterschrift.png', await unterschriftBlob(), 'image/png') };
    const endung = (f) => (f.name.match(/\.[a-z0-9]+$/i) || ['.jpg'])[0].toLowerCase();
    if (ausweisNoetig) { dateien.ausweis_vorne = await hoch('ausweis-vorne' + endung(vorne), vorne); dateien.ausweis_hinten = await hoch('ausweis-hinten' + endung(hinten), hinten); }
    const rate = PREISE[w.land_kurz] && w.zahlung === 'raten' ? PREISE[w.land_kurz].raten[w.raten_anzahl] : null;
    if (rate) { w.anzahlung = String(rate[0]); w.monatsrate = String(rate[1]); }
    const daten = { ...w, land: w.land_kurz === 'XX' ? (w.land_anders || '').trim() : LAENDER[w.land_kurz], nicht_eu: NICHT_EU.includes(w.land_kurz), datum: new Date().toISOString().slice(0, 10) };
    delete daten.ausweis_vorne; delete daten.ausweis_hinten;
    Object.keys(daten).forEach((k) => { if (typeof daten[k] === 'string') daten[k] = daten[k].trim(); });
    const { error } = await sb.rpc('uk_bestellung', { p: { von, daten, dateien } });
    if (error) throw error;
    form.hidden = true; $('#danke-name').textContent = w.vorname.trim(); $('#danke').hidden = false; window.scrollTo(0, 0);
  } catch (err) {
    fehler.textContent = 'Das hat gerade nicht geklappt. Bitte versuch es noch einmal. (' + (err.message || err) + ')';
    knopf.disabled = false; knopf.textContent = 'Verbindlich bestellen';
  }
};

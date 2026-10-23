// Bestellseite (19.10.2026, Produktkacheln 23.10.2026, K8 abwählbar 23.10.2026).
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
  const p = w.geraet_k8 ? PREISE[w.land_kurz] : null, box = $('#preis-info'), sel = $('#raten-anzahl');
  if (!w.geraet_k8) { box.innerHTML = 'Preis und Bezahlung für deine Auswahl klären wir persönlich mit dir, bevor die Bestellung an Enagic geht.'; }
  else if (!w.land_kurz) { box.innerHTML = ''; }
  else if (!p) { box.innerHTML = 'Den Preis nennen wir dir persönlich, bevor die Bestellung an Enagic geht.'; }
  else box.innerHTML = `Gesamtpreis bei Überweisung: <b>${p.voll}</b>${p.klein ? ` <span class="hilfe">(${p.klein})</span>` : ''}${p.zusatz ? `<span class="warn">${p.zusatz}</span>` : ''}`;
  [...sel.options].forEach((o) => { const r = p && p.raten[o.value]; o.textContent = r ? `${o.value} Monate: Anzahlung ${eur(r[0])}, dann ${eur(r[1])} im Monat` : `${o.value} Monate`; });
}


// ---------- Produkte (23.10.2026): alle drei wählbar, K8 ist vorausgewählt ----------
// Der K8-Haken heißt geraet_k8. Beim Absenden steht in daten.k8 "ja" oder "nein".
// Bei "nein" darf das Dashboard KEIN K8-Formular für Enagic ausfüllen.
// Daten aus den Enagic-Produktseiten (Stand 23.10.2026), in eigenen Worten, ohne Wirkungsaussagen.
// Preise der Ergänzungen laut Enagic-Shop ohne MwSt. Schweiz noch offen (fragen-an-daniel.md, D1 und D2).
// Die Haken heißen zusatz_emguarde und zusatz_anespa und landen so automatisch in daten (uk_bestellungen).
// Zusatzprodukte gehen NICHT automatisch an Enagic, Daniel klärt Preis und Zahlung vorher mit dem Kunden.
const ICON = {
  tippen: '<path d="M9 11V5a2 2 0 0 1 4 0v6"/><path d="M13 9a2 2 0 0 1 4 0v4"/><path d="M17 11a2 2 0 0 1 4 0v3a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.5L4 14a2 2 0 0 1 3.4-2L9 14"/>',
  kreis: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  glocke: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  welt: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
  strom: '<path d="M12 3v9"/><path d="M6.4 6.4a8 8 0 1 0 11.2 0"/>',
  tropfen: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/>',
  akku: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2"/><path d="M7 10v4M11 10v4"/>',
  uhr: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  koffer: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
  dusche: '<path d="M4 20V8a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4"/><path d="M10 10h6"/><path d="M11 14v1M14 14v1M17 14v1M12 18v1M15 18v1"/>',
  stein: '<ellipse cx="12" cy="15" rx="8" ry="4"/><path d="M7 12c1-3 3-5 5-5s4 2 5 5"/>',
  schild: '<path d="M4 12h16"/><path d="M12 4v16"/><circle cx="12" cy="12" r="9"/>'
};
const PRODUKTE = [
  { id: 'k8', feld: 'geraet_k8', start: true, name: 'LeveLuk K8', marke: 'Wasserionisierer', bild: '../bilder/k8.jpg',
    kurz: 'Fünf Wasserarten aus deinem Leitungswasser, direkt an der Spüle.',
    preis: { DE: ['5.486 €', 'inkl. MwSt., Versand aus Düsseldorf'], CH: ['4.657 €', 'geliefert, zzgl. Verzollung und MwSt. (ca. 400 CHF)'] },
    text: 'Der K8 steht neben deiner Spüle und wird an den Wasserhahn angeschlossen. Er filtert dein Leitungswasser und teilt es danach per Elektrolyse in basisches und saures Wasser. So bekommst du per Knopfdruck Trinkwasser, Wasser zum Kochen und Wasser für Pflege und Haushalt.',
    highlights: [['tippen', 'Touchscreen mit Sprachansage in mehreren Sprachen'], ['kreis', 'Reinigt sich nach jeder Nutzung automatisch'], ['glocke', 'Filteranzeige meldet, wann ein Wechsel fällig ist'], ['welt', 'Netzteil für jede Stromversorgung weltweit'], ['strom', 'Schaltet sich zwischen den Nutzungen selbst ab'], ['tropfen', '5 Wasserarten von pH 2,5 bis pH 11,5']],
    skala: true,
    daten: [['Elektrodenplatten', '8, platinbeschichtetes Titan'], ['Plattengröße', '135 × 75 mm'], ['pH-Bereich', '2,5 bis 11,5'], ['Wasserarten', '5'], ['Durchfluss Trinkwasser', '4,5 bis 7,6 l/min'], ['Leistung', '230 W'], ['Gewicht', '5 kg'], ['Maße (B × H × T)', '279 × 349 × 147 mm'], ['Bedienung', 'vollautomatisch, Touchscreen']],
    fragen: [
      ['Wie wird der K8 angeschlossen?', 'Er kommt neben die Spüle und wird mit einem Umschaltventil an deinen Wasserhahn angeschlossen. Dazu brauchst du eine Steckdose in der Nähe. Beim Anschließen helfen wir dir.'],
      ['Ist das dasselbe wie Umkehrosmose?', 'Nein. Umkehrosmose entfernt fast alles aus dem Wasser, auch die Mineralien. Der K8 filtert und lässt die Mineralien aus deinem Leitungswasser weitgehend drin. Danach teilt die Elektrolyse das Wasser auf.'],
      ['Welches Wasser kann ich trinken?', 'Zum Trinken und Kochen sind pH 7 und pH 8,5 bis 9,5 gedacht. Die anderen Wasserarten sind für Haushalt und Pflege. Für Babynahrung nimmst du pH 7.'],
      ['Wie oft wird der Filter gewechselt?', 'Je nach Verbrauch etwa einmal im Jahr. Das Gerät zeigt dir an, wann es so weit ist. Ein Ersatzfilter kostet bei Enagic 114 € zzgl. MwSt.'],
      ['Kann ich in Raten zahlen?', 'Ja. Enagic bietet 3, 6, 10, 16 oder 24 Monate an. Die Raten siehst du weiter unten bei der Bezahlung.']] },
  { id: 'anespa', name: 'ANESPA DX', marke: 'Mineral-Ionen-Wasserbad', bild: '../bilder/anespa.jpg',
    kurz: 'Filtersystem für Dusche und Badewanne, mit Massage-Duschkopf.',
    preis: { DE: ['2.800 €', 'zzgl. MwSt., laut Enagic-Shop'] },
    text: 'ANESPA DX wird an deine Dusche oder Badewanne angeschlossen. Aktivkohle und eine Keramikkartusche filtern das Leitungswasser, laut Enagic entfernt es nahezu das gesamte Restchlor. In der Kartusche stecken Tuffstein aus der heißen Quelle Futamata in Hokkaido und Maifan-Stein.',
    highlights: [['dusche', 'Massage-Duschkopf mit verstellbaren Einstellungen'], ['schild', 'Zweistufige Filterung: Aktivkohle und Keramik'], ['stein', 'Mineralsteine aus Japan in der Kartusche'], ['kreis', 'Einfacher Kartuschenwechsel dank neuer Basis']],
    daten: [['Erzeugt', 'Mineral-Ionen-Wasser'], ['pH-Wert', 'wie Leitungswasser'], ['Durchfluss', '2,6 l/min'], ['Gewicht', '4,2 kg'], ['Maße (B × Durchmesser)', '130 × 346 mm'], ['Keramikkartusche', 'etwa alle 3 Jahre, 200 € zzgl. MwSt.'], ['Externer Chlorfilter', '65 € zzgl. MwSt.'], ['Garantie', '3 Jahre']],
    fragen: [['Passt das an meine Dusche?', 'ANESPA DX wird zwischen Armatur und Duschschlauch gesetzt. Ob es bei dir passt, schauen wir gemeinsam an.'], ['Kann ich in Raten zahlen?', 'Laut Enagic ja, in 3, 6, 10 oder 16 Raten. Preis und Bezahlung klären wir persönlich mit dir.']] },
  { id: 'emguarde', name: 'emGuarde Go', marke: 'Set mit 2 Geräten', bild: '../bilder/emguarde.jpg',
    kurz: 'Zwei kleine Geräte von Enagic für Zuhause, Arbeit und unterwegs.',
    preis: { DE: ['2.420 €', 'zzgl. MwSt., laut Enagic-Shop'] },
    text: 'emGuarde Go ist ein Set aus zwei handlichen Geräten. Enagic beschreibt es als Unterstützung im Umgang mit elektromagnetischen Feldern im Alltag, zum Beispiel von WLAN, Handy und Elektrogeräten. Du stellst die Geräte dorthin, wo du viel Zeit verbringst, oder nimmst eins mit.',
    highlights: [['koffer', 'Kompakt und leicht, passt in jede Tasche'], ['akku', 'Akku mit 5.000 mAh, laden über USB-C'], ['uhr', 'Bis zu 72 Stunden pro Ladung'], ['strom', 'Eine Taste, keine Einrichtung, keine Wartung']],
    daten: [['Lieferumfang', '2 Geräte, 2 USB-C-Ladekabel'], ['Akku', '5.000 mAh Lithium, wiederaufladbar'], ['Laufzeit', 'bis zu 72 Stunden'], ['Reichweite', 'je Gerät etwa 3 m Durchmesser'], ['Bedienung', 'eine Taste'], ['Farbe', 'mattschwarz'], ['Garantie', '2 Jahre']],
    fragen: [['Wo stelle ich die Geräte hin?', 'Dort, wo du viel Zeit verbringst: am Arbeitsplatz, im Wohnzimmer oder neben dem Bett. Beide zusammen in einem Raum oder getrennt in zwei Räumen.'], ['Wie wird es bezahlt?', 'Preis und Bezahlung klären wir persönlich mit dir, bevor etwas an Enagic geht.']],
    hinweis: 'Nach Angaben von Enagic ist emGuarde nicht dazu bestimmt, Krankheiten zu diagnostizieren, zu behandeln, zu heilen oder zu verhindern.' }
];
const SKALA = [['2,5', 'Reinigen', '#C8463A'], ['6', 'Pflege', '#D9A73B'], ['7', 'Neutral, Babynahrung', '#7DB15A'], ['8,5 bis 9,5', 'Trinken, Kochen', '#3E9A8C'], ['11,5', 'Obst, Fett, Flecken', '#5B5FA8']];
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function preisVon(p) {
  const l = form.land_kurz.value, x = p.preis[l];
  if (x) return `${esc(x[0])}<small>${esc(x[1])}</small>`;
  return l ? 'Preis persönlich<small>nennen wir dir vor der Bestellung</small>' : '';
}
const feldName = (p) => p.feld || 'zusatz_' + p.id;
const mitK8 = () => form.elements.geraet_k8.checked;
const rahmen = (p) => `<div class="pk-rahmen">${p.bild ? `<img src="${p.bild}" alt="${esc(p.name)}" loading="lazy">` : `<div class="ohne">${esc(p.name)}</div>`}<span class="pk-marke">${esc(p.marke)}</span></div>`;
const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n] || ''}</svg>`;
function produkteZeigen() {
  $('#produkte').innerHTML = PRODUKTE.map((p) => `<article class="pk">
    <button type="button" class="pk-info" data-produkt="${p.id}">${rahmen(p)}<span class="pk-name">${esc(p.name)}</span><span class="pk-kurz">${esc(p.kurz)}</span><span class="pk-preis">${preisVon(p)}</span><span class="pk-mehr">Mehr erfahren</span></button>
    <label class="pk-fuss"><input type="checkbox" name="${feldName(p)}"${p.start ? ' checked' : ''}><span class="aus">Auswählen</span><span class="an">Ausgewählt</span></label>
  </article>`).join('');
  document.querySelectorAll('[data-produkt]').forEach((b) => { b.onclick = () => produktZeigen(b.dataset.produkt); });
}
function produktZeigen(id) {
  const p = PRODUKTE.find((x) => x.id === id), dlg = $('#pk-dlg'), feld = form.elements[feldName(p)];
  $('#pk-dlg-innen').innerHTML = `<button type="button" class="pk-zu" aria-label="Schließen">×</button>
    <div class="pk-dlg-kopf">${rahmen(p)}<div class="pk-dlg-titel"><div class="pk-eyebrow">${esc(p.marke)}</div><h3>${esc(p.name)}</h3><div class="pk-preis">${preisVon(p)}</div><p>${esc(p.text)}</p></div></div>
    <div class="pk-dlg-inhalt">
      <div class="pk-abschnitt"><h4>Das Wichtigste</h4><div class="pk-highlights">${p.highlights.map(([i, t]) => `<div class="pk-hl">${icon(i)}<span>${esc(t)}</span></div>`).join('')}</div></div>
      ${p.skala ? `<div class="pk-abschnitt"><h4>Fünf Wasserarten</h4><div class="pk-skala">${SKALA.map(([w, t, f]) => `<div style="--f:${f}"><b>pH ${w}</b>${esc(t)}</div>`).join('')}</div></div>` : ''}
      <div class="pk-abschnitt"><h4>Technische Daten</h4><table class="pk-daten">${p.daten.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table></div>
      <div class="pk-abschnitt pk-fragen"><h4>Häufige Fragen</h4>${p.fragen.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
      ${p.hinweis ? `<p class="pk-hinweis">${esc(p.hinweis)}</p>` : ''}
    </div>
    <div class="pk-aktion"><small>${p.id === 'k8' ? 'Preis und Raten siehst du unten bei der Bezahlung.' : 'Preis und Bezahlung dafür klären wir persönlich mit dir, bevor etwas an Enagic geht.'}</small><button type="button" class="knopf" id="pk-aktion">${feld.checked ? 'Wieder abwählen' : 'Auswählen'}</button></div>`;
  $('.pk-zu').onclick = () => dlg.close();
  $('#pk-aktion').onclick = () => { feld.checked = !feld.checked; anpassen(); dlg.close(); };
  dlg.showModal();
  dlg.scrollTop = 0;
}
produkteZeigen();

// ---------- Land zuerst (23.10.2026) ----------
// Drei Länder mit Flagge, der Rest unter „Anderes Land“. Bei Daniels Link (?von=daniel) steht die Schweiz vorn,
// sonst Deutschland. Die Wahl setzt das Feld land_kurz unten bei den Angaben (und umgekehrt).
const FLAGGE = {
  CH: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#D52B1E"/><path d="M13 5h4v3.5h3.5v4H17V16h-4v-3.5H9.5v-4H13z" fill="#fff"/></svg>',
  DE: '<svg viewBox="0 0 30 20"><rect width="30" height="7" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCE00"/></svg>',
  AT: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#C8102E"/><rect y="6.67" width="30" height="6.67" fill="#fff"/></svg>',
  XX: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#EAE3D3"/><circle cx="15" cy="10" r="6.5" fill="none" stroke="#4F5A35" stroke-width="1.2"/><path d="M8.5 10h13M15 3.5c-2.5 2-2.5 11 0 13M15 3.5c2.5 2 2.5 11 0 13" fill="none" stroke="#4F5A35" stroke-width="1.2"/></svg>'
};
const VORN = von === 'daniel' ? ['CH', 'DE', 'AT'] : ['DE', 'CH', 'AT'];
$('#laender').innerHTML = [...VORN, 'XX'].map((l) => `<button type="button" class="land-knopf" data-land="${l}" aria-pressed="false">${FLAGGE[l]}${l === 'XX' ? 'Anderes Land' : LAENDER[l]}</button>`).join('');
$('#land-sonst').innerHTML = '<option value="">bitte wählen</option>' + [...form.land_kurz.options].filter((o) => o.value && !VORN.includes(o.value)).map((o) => `<option value="${o.value}">${o.textContent}</option>`).join('');
function landZeigen() {
  const l = form.land_kurz.value, sonst = !!l && !VORN.includes(l), offen = sonst || $('#land-sonst-feld').dataset.offen === '1';
  document.querySelectorAll('.land-knopf').forEach((k) => k.setAttribute('aria-pressed', String(k.dataset.land === l || (k.dataset.land === 'XX' && offen))));
  $('#land-sonst-feld').hidden = !offen;
  if (sonst) $('#land-sonst').value = l;
  form.classList.toggle('land-ok', !!l);
}
document.querySelectorAll('.land-knopf').forEach((k) => { k.onclick = () => {
  const sonst = k.dataset.land === 'XX';
  $('#land-sonst-feld').dataset.offen = sonst ? '1' : '';
  form.land_kurz.value = sonst ? $('#land-sonst').value : k.dataset.land;
  anpassen();
  if (sonst) $('#land-sonst').focus();
}; });
$('#land-sonst').onchange = (e) => { e.stopPropagation(); form.land_kurz.value = e.target.value; anpassen(); };

// ---------- Felder ein- und ausblenden ----------
function anpassen() {
  landZeigen();
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
  document.querySelectorAll('#produkte .pk-preis').forEach((el, i) => { el.innerHTML = preisVon(PRODUKTE[i]); });
  const zusatz = PRODUKTE.filter((p) => p.id !== 'k8' && w[feldName(p)]).map((p) => p.name);
  if (zusatz.length && w.geraet_k8) $('#preis-info').insertAdjacentHTML('beforeend', `<span class="warn">Dazu gewünscht: ${zusatz.join(', ')}. Preis und Bezahlung dafür klären wir persönlich mit dir, bevor etwas an Enagic geht.</span>`);
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
  if (!PRODUKTE.some((p) => w[feldName(p)])) return (fehler.textContent = 'Bitte wähl oben mindestens ein Produkt aus.');
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
    const rate = w.geraet_k8 && PREISE[w.land_kurz] && w.zahlung === 'raten' ? PREISE[w.land_kurz].raten[w.raten_anzahl] : null;
    if (rate) { w.anzahlung = String(rate[0]); w.monatsrate = String(rate[1]); }
    const daten = { ...w, land: w.land_kurz === 'XX' ? (w.land_anders || '').trim() : LAENDER[w.land_kurz], nicht_eu: NICHT_EU.includes(w.land_kurz), datum: new Date().toISOString().slice(0, 10) };
    daten.k8 = w.geraet_k8 ? 'ja' : 'nein'; delete daten.geraet_k8;
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

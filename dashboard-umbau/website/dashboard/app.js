// Dashboard Ursprungskraft: Übersicht, Aufgaben, Kunden, Testmaschinen.

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const datum = (d) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');
const tageBis = (d) => Math.round((new Date(d + 'T12:00:00') - new Date(Daten.heute() + 'T12:00:00')) / 86400000);
// Testmaschinen hießen fest Daniel 01 bis Daniel 13. Jetzt hat jedes Gerät einen Namen,
// ältere ohne Namen zeigen weiter den alten aus der Nummer.
const geraetName = (nr) => 'Daniel ' + String(nr ?? '?').padStart(2, '0');
const maschineName = (m) => (m && m.name) || geraetName(m && m.nummer);
// Zwei Listen: Daniels Geräte und Geräte von Partnern (besitzer = wem es gehört, leer heißt Daniel)
const LISTEN = [['daniel', 'Daniels Geräte'], ['partner', 'Von Partnern']];
const listeVon = (m) => (m.liste === 'partner' ? 'partner' : 'daniel');
const name = (k) => (k ? [k.vorname, k.nachname].filter(Boolean).join(' ') : '');
// Wer ein Testgerät hat: frei eingetippt (bei_name), sonst der verknüpfte Kunde
// Testgeräte gehen nur an Interessenten. Steht Jasmin oder Daniel drin, ist es eigene Nutzung:
// dann kein Kunde und keine Abhol-Aufgabe.
const TEAM = ['jasmin', 'daniel', 'jasmin groth', 'daniel zürcher'];

const STATUS_KUNDE = ['Interessent', 'Testet', 'Kaufabsicht', 'Bestellt', 'Geliefert', 'Kein Interesse'];
// Gekauft heißt bestellt oder schon geliefert. kaufdatum ist "Bestellt am".
const gekauft = (k) => k.status === 'Bestellt' || k.status === 'Geliefert';
const statusKlasse = (s) => (s === 'Geliefert' || s === 'Bestellt' ? 'gut' : s === 'Testet' || s === 'Kaufabsicht' ? 'warn' : '');
const STATUS_MASCHINE = ['Verfügbar', 'Beim Kunden', 'Wartung'];
const ARTEN = ['Vertriebspartner', 'Influencer', 'Kunde'];
const LINK_BASIS = 'ursprungskraft.net/';
// Testgeräte gibt es nur als LeveLuk K8 (11.10.2026)
const GERAETE = ['', 'LeveLuk K8'];
// Was ein Kunde hat, mehrere gleichzeitig möglich
const PRODUKTE = [['K8', 'Enagic (LeveLuk K8)'], ['iLifeSomm', 'iLifeSomm'], ['Zinzino', 'Zinzino']];
const produktName = (id) => (PRODUKTE.find((p) => p[0] === id) || [id, id])[1];
// Ältere Einträge haben nur das Feld Gerät, dann zählt das als K8
const produkteVon = (k) => (k && k.produkte && k.produkte.length ? k.produkte : k && k.geraet ? ['K8'] : []);
const produkteHtml = (k) => produkteVon(k).map((p) => `<span class="marker">${esc(produktName(p))}</span>`).join(' ');

let reiter = 'aufgaben';
let filterWer = 'Alle';
let sucheKunde = '';
let filterStatus = 'Alle';
let filterArt = 'Alle';
let kf = { produkt: 'Alle', land: 'Alle', partner: 'Alle', zeitraum: 'Alle', vermerk: 'Alle', filter: false };

// Vermerke zu Haushalt und Interessen als kleine Marker
const vermerkName = (v) => (Daten.VERMERKE.find((x) => x.id === v) || { name: v }).name;
// Route: öffnet Google Maps (Daniel hat kein iPhone) mit der Kundenadresse als Ziel
const LAENDER = { CH: 'Schweiz', DE: 'Deutschland', AT: 'Österreich', AE: 'Vereinigte Arabische Emirate' };
function routeHtml(k) {
  if (!k || !(k.strasse || k.ort)) return '<span class="marker warn">Adresse fehlt</span>';
  const ziel = [k.strasse, [k.plz, k.ort].filter(Boolean).join(' '), LAENDER[k.land]].filter(Boolean).join(', ');
  return `<a class="knopf klein-knopf" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ziel)}&travelmode=driving" target="_blank" rel="noopener" onclick="event.stopPropagation()">Route</a>${k.strasse ? '' : ' <span class="marker warn">Straße fehlt</span>'}`;
}
const zeit = (a) => (a.uhrzeit ? a.uhrzeit.slice(0, 5) + ' Uhr' : '');
// Termine außer Haus. Leere Art heißt Aufgabe am Schreibtisch.
const TERMIN_ARTEN = ['Vorstellen', 'Beratung', 'Testgerät bringen', 'Testgerät abholen', 'Filterwechsel', 'Lieferung', 'Geschäftstermin', 'Event', 'Privat'];
// Farbe je Art im Kalender (Klassen in style.css)
const ART_KLASSE = { 'Vorstellen': 'a-vorstellen', 'Beratung': 'a-beratung', 'Testgerät bringen': 'a-testgeraet', 'Testgerät abholen': 'a-testgeraet', 'Filterwechsel': 'a-filter', 'Lieferung': 'a-lieferung', 'Geschäftstermin': 'a-geschaeft', 'Event': 'a-event', 'Privat': 'a-privat' };
// Adresse für Route und Kalender: vom Kunden, sonst der frei eingetragene Ort
function adresseVon(k, ort) {
  if (k && (k.strasse || k.ort)) return [k.strasse, [k.plz, k.ort].filter(Boolean).join(' '), LAENDER[k.land]].filter(Boolean).join(', ');
  return (ort || '').trim();
}
const kartenLink = (ziel) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ziel)}&travelmode=driving`;
const vermerkeHtml = (k) => ((k && k.vermerke) || []).map((v) => `<span class="marker">${esc(vermerkName(v))}</span>`).join(' ');

// Nächster Filterwechsel: etwa einmal im Jahr ab letztem Wechsel, sonst ab Kauf
function naechsterFilter(k) {
  const basis = k.filter_zuletzt || k.geliefert_am || k.kaufdatum;
  if (!basis || k.status !== 'Geliefert') return null;
  const d = new Date(basis + 'T12:00:00');
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

function fristMarker(d, vorlauf = 7) {
  if (!d) return '';
  const t = tageBis(d);
  if (t < 0) return `<span class="marker rot">seit ${-t} ${-t === 1 ? 'Tag' : 'Tagen'} fällig</span>`;
  if (t === 0) return '<span class="marker warn">heute</span>';
  if (t <= vorlauf) return `<span class="marker warn">in ${t} ${t === 1 ? 'Tag' : 'Tagen'}</span>`;
  return `<span class="marker">${datum(d)}</span>`;
}

async function alles() {
  const [partner, kunden, maschinen, verlauf, aufgaben, fragebogen, wohnung, unterlagen, bestellungen] = await Promise.all(
    ['uk_partner', 'uk_kunden', 'uk_maschinen', 'uk_maschinen_verlauf', 'uk_aufgaben', 'uk_fragebogen', 'uk_wohnung', 'uk_unterlagen', 'uk_bestellungen'].map((t) => Daten.alle(t).catch(() => [])));
  const kundeVon = (idk) => kunden.find((k) => k.id === idk);
  const partnerVon = (idp) => partner.find((p) => p.id === idp);
  return { partner, kunden, maschinen, verlauf, aufgaben, fragebogen, wohnung, unterlagen, bestellungen: bestellungen || [], kundeVon, partnerVon };
}

// ---------- Aufgaben (Board wie Trello) ----------
// Die Spalte ergibt sich bei jedem Laden aus dem Datum. Dadurch wandern Karten von allein
// weiter: was für nächste Woche geplant war, steht ab Montag in "Diese Woche".
const PRIO = { rot: 'Absolut wichtig', orange: 'Wichtig', '': 'Normal' };
const PERSONEN = { Daniel: { kurz: 'D', farbe: '#5E6343' }, Jasmin: { kurz: 'J', farbe: '#A68B4B' } };

function iso(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
function spaltenBereiche() {
  const h = new Date(Daten.heute() + 'T12:00:00');
  const plus = (n) => { const d = new Date(h); d.setDate(d.getDate() + n); return d; };
  const bisSonntag = (7 - h.getDay()) % 7;
  const sonntag = plus(bisSonntag), sonntag2 = plus(bisSonntag + 7);
  const monatsende = new Date(h.getFullYear(), h.getMonth() + 1, 0, 12);
  const quartalsende = new Date(h.getFullYear(), Math.floor(h.getMonth() / 3) * 3 + 3, 0, 12);
  const tagNach = (d) => { const x = new Date(d); x.setDate(x.getDate() + 1); return x; };
  const max = (a, b) => (a > b ? a : b);
  return [
    { key: 'heute', titel: 'Heute', von: null, bis: iso(h), start: iso(h) },
    { key: 'morgen', titel: 'Morgen', von: iso(plus(1)), bis: iso(plus(1)), start: iso(plus(1)) },
    { key: 'woche', titel: 'Diese Woche', von: iso(plus(2)), bis: iso(sonntag), start: iso(plus(2)) },
    { key: 'naechste', titel: 'Nächste Woche', von: iso(max(tagNach(sonntag), plus(2))), bis: iso(sonntag2), start: iso(max(tagNach(sonntag), plus(2))) },
    { key: 'monat', titel: 'Dieser Monat', von: iso(tagNach(sonntag2)), bis: iso(monatsende), start: iso(tagNach(sonntag2)) },
    { key: 'quartal', titel: 'Dieses Quartal', von: iso(tagNach(max(monatsende, sonntag2))), bis: iso(quartalsende), start: iso(tagNach(max(monatsende, sonntag2))) },
    { key: 'spaeter', titel: 'Später', von: iso(tagNach(max(quartalsende, sonntag2))), bis: '9999-12-31', start: iso(tagNach(max(quartalsende, sonntag2))) },
  ].filter((b) => b.von === null || b.von <= b.bis); // leere Zeiträume ausblenden (z. B. Monat endet diese Woche)
}
function spalteVon(a, bereiche) {
  if (a.erledigt) return 'erledigt';
  // Eingang: noch nicht zugeordnet, meist von Daniels Assistent
  if (a.eingang) return 'eingang';
  if (!a.faellig) return 'ohne';
  return (bereiche.find((b) => a.faellig <= b.bis) || bereiche[bereiche.length - 1]).key;
}
// wer: Daniel, Jasmin oder Beide (eine Karte, an der beide arbeiten)
const avatar = (wer) => (wer === 'Beide' ? ['Daniel', 'Jasmin'] : [wer]).map((w) => { const p = PERSONEN[w]; return p ? `<span class="avatar" style="background:${p.farbe}" title="${esc(w)}">${p.kurz}</span>` : ''; }).join('');

let filterPrio = 'Alle';
let nurNeu = false;
async function zeigeAufgaben(d) {
  const bereiche = spaltenBereiche();
  const spalten = [{ key: 'eingang', titel: 'Eingang' }, ...bereiche, { key: 'ohne', titel: 'Ohne Datum' }, { key: 'erledigt', titel: 'Erledigt' }];
  // "Neu" sieht nur Jasmin: Karten von Daniels Assistent, die sie noch nicht geöffnet hat
  const zeigtNeu = ich.rolle === 'admin';
  const neuListe = zeigtNeu ? d.aufgaben.filter((a) => a.neu && !a.erledigt) : [];
  if (!neuListe.length) nurNeu = false;
  const rang = { rot: 0, orange: 1 };
  // Im Eingang wird nichts weggefiltert, damit dort nichts untergeht
  const liste = d.aufgaben
    .filter((a) => a.eingang || filterWer === 'Alle' || a.wer === filterWer || a.wer === 'Beide')
    .filter((a) => a.eingang || filterPrio === 'Alle' || (a.prio || '') === filterPrio)
    .filter((a) => !nurNeu || (a.neu && !a.erledigt));
  // Automatische Karten: Testgeräte zurückholen und Filterwechsel. Sie stehen nicht in der
  // Datenbank, sondern entstehen bei jedem Laden aus Testgeräten und Kunden.
  const zeigeAuto = filterPrio === 'Alle' && (filterWer === 'Alle' || filterWer === 'Daniel');
  const auto = !zeigeAuto ? [] : [
    // Bei eigener Nutzung ist das Gerät nur verplant, da muss niemand etwas abholen
    ...d.maschinen.filter((m) => m.status === 'Beim Kunden' && m.rueckgabe_bis && m.bei_art !== 'Eigene Nutzung').map((m) => ({ auto: 'maschine', id: m.id, faellig: m.rueckgabe_bis,
      titel: `${maschineName(m)} bei ${m.bei_name || name(d.kundeVon(m.kunde_id)) || 'Kunde'} abholen` })),
    ...d.kunden.map((k) => ({ k, f: naechsterFilter(k) })).filter((x) => x.f && tageBis(x.f) <= 60).map((x) => ({ auto: 'filter', id: x.k.id, faellig: x.f,
      titel: `Filterwechsel bei ${name(x.k)}` })),
  ];
  const autoIn = (key) => nurNeu || key === 'erledigt' || key === 'ohne' || key === 'eingang' ? [] : auto.filter((a) => spalteVon(a, bereiche) === key);
  const inSpalte = (key) => liste.filter((a) => spalteVon(a, bereiche) === key)
    .sort((x, y) => key === 'erledigt' ? String(y.erledigt_am).localeCompare(String(x.erledigt_am))
      : (rang[x.prio] ?? 2) - (rang[y.prio] ?? 2) || String(x.faellig).localeCompare(String(y.faellig)))
    .slice(0, key === 'erledigt' ? 20 : 999);
  $('#inhalt').innerHTML = `
    <h1>Aufgaben</h1><p class="unter">Kacheln mit der Maus in eine andere Spalte ziehen, dann bekommen sie das passende Datum. Klick öffnet die Aufgabe. Die Spalten rücken mit dem Datum von allein weiter.</p>
    <div class="leiste">
      <select id="wer" style="width:auto">${['Alle', 'Daniel', 'Jasmin'].map((w) => `<option value="${w}" ${w === filterWer ? 'selected' : ''}>${w === 'Alle' ? 'Alle Personen' : w}</option>`).join('')}</select>
      <select id="prio" style="width:auto">${['Alle', 'rot', 'orange', ''].map((x) => `<option value="${x}" ${x === filterPrio ? 'selected' : ''}>${x === 'Alle' ? 'Alle Prioritäten' : PRIO[x]}</option>`).join('')}</select>
      ${neuListe.length ? `<button class="knopf ${nurNeu ? '' : 'leise'} neu-knopf" id="nur-neu">${nurNeu ? 'Alle Aufgaben zeigen' : `${neuListe.length} neu von Daniel`}</button>` : ''}
      <span style="flex:1"></span>
      <button class="knopf" id="neu">Neue Aufgabe</button>
    </div>
    <div class="board">${spalten.map((sp) => { const a = inSpalte(sp.key), au = autoIn(sp.key); return `
      <div class="spalte ${sp.key === 'eingang' ? 'eingang' : ''}" data-spalte="${sp.key}"><h2>${sp.titel} <span>${a.length + au.length}</span></h2>
        <div class="karten">${au.map((x) => `
          <div class="karte auto termin" data-auto="${x.auto}" data-auto-id="${x.id}" title="Automatisch aus ${x.auto === 'maschine' ? 'den Testgeräten' : 'den Kunden'}">
            <div class="haupt"><span class="label termin">${x.auto === 'maschine' ? 'Testgerät abholen' : 'Filterwechsel'}</span>
              <div class="titel">${esc(x.titel)}</div>
              <div class="fuss">${avatar('Daniel')}<span>${datum(x.faellig)}</span></div></div>
          </div>`).join('')}${a.map((x) => `
          <div class="karte prio-${x.prio || 'normal'} ${x.art ? 'termin' : ''} ${x.erledigt ? 'fertig' : ''} ${zeigtNeu && x.neu ? 'ist-neu' : ''}" draggable="true" data-id="${x.id}">
            <input type="checkbox" ${x.erledigt ? 'checked' : ''} aria-label="erledigt">
            <div class="haupt">
              ${zeigtNeu && x.neu ? '<span class="label neu">Neu</span> ' : ''}${x.art ? `<span class="label termin">${esc(x.art)}</span> ` : ''}${x.prio ? `<span class="label ${x.prio}">${PRIO[x.prio]}</span>` : ''}
              <div class="titel">${esc(x.titel)}</div>
              <div class="fuss">${avatar(x.wer)}<span>${[x.kunde_id && name(d.kundeVon(x.kunde_id)), x.faellig && datum(x.faellig), zeit(x)].filter(Boolean).map(esc).join(' · ')}</span>${x.notiz ? '<span title="hat eine Notiz">✎</span>' : ''}</div>
              ${x.art && !x.kunde_id && x.ort ? `<div class="klein">${esc(x.ort)}</div>` : ''}
              ${x.kunde_id && !x.erledigt ? `<div class="vermerke">${vermerkeHtml(d.kundeVon(x.kunde_id))} ${routeHtml(d.kundeVon(x.kunde_id))}</div>` : ''}
            </div>
          </div>`).join('')}</div>
        <button class="plus" data-neu="${sp.key}">+ Aufgabe</button>
      </div>`; }).join('')}</div>`;
  $('#wer').onchange = (e) => { filterWer = e.target.value; zeichnen(); };
  $('#prio').onchange = (e) => { filterPrio = e.target.value; zeichnen(); };
  if ($('#nur-neu')) $('#nur-neu').onclick = () => { nurNeu = !nurNeu; zeichnen(); };
  const startVon = (key) => key === 'ohne' || key === 'eingang' ? null : (bereiche.find((b) => b.key === key) || {}).start;
  const vorlage = (key) => ({ wer: filterWer === 'Alle' ? 'Jasmin' : filterWer, prio: '', faellig: startVon(key === 'erledigt' ? 'heute' : key), eingang: key === 'eingang' });
  $('#neu').onclick = () => aufgabeBearbeiten(vorlage('heute'), d);
  document.querySelectorAll('[data-neu]').forEach((b) => { b.onclick = () => aufgabeBearbeiten(vorlage(b.dataset.neu), d); });
  document.querySelectorAll('.karte.auto').forEach((el) => {
    el.onclick = () => (el.dataset.auto === 'maschine'
      ? maschineBearbeiten(d.maschinen.find((m) => m.id === el.dataset.autoId), d)
      : kundeBearbeiten(d.kundeVon(el.dataset.autoId), d));
  });
  document.querySelectorAll('.karte:not(.auto)').forEach((el) => {
    const a = d.aufgaben.find((x) => x.id === el.dataset.id);
    el.querySelector('input').onclick = async (e) => {
      e.stopPropagation();
      await Daten.speichern('uk_aufgaben', { id: a.id, erledigt: e.target.checked, erledigt_am: e.target.checked ? new Date().toISOString() : null });
      zeichnen();
    };
    el.onclick = async () => {
      // Jasmin öffnet eine neue Karte: ab jetzt gilt sie als gesehen
      if (a.neu && ich.rolle === 'admin') { try { await gesehen(a); el.classList.remove('ist-neu'); glocke(d); } catch (err) { alert(fehlerText(err)); } }
      aufgabeBearbeiten(a, d);
    };
    el.ondragstart = (e) => { e.dataTransfer.setData('text/plain', a.id); el.classList.add('zieht'); };
    el.ondragend = () => el.classList.remove('zieht');
  });
  document.querySelectorAll('.spalte').forEach((sp) => {
    sp.ondragover = (e) => { e.preventDefault(); sp.classList.add('ziel'); };
    sp.ondragleave = (e) => { if (!sp.contains(e.relatedTarget)) sp.classList.remove('ziel'); };
    sp.ondrop = async (e) => {
      e.preventDefault(); sp.classList.remove('ziel');
      const a = d.aufgaben.find((x) => x.id === e.dataTransfer.getData('text/plain'));
      const key = sp.dataset.spalte;
      if (!a || spalteVon(a, bereiche) === key) return;
      if (key === 'erledigt') await Daten.speichern('uk_aufgaben', { id: a.id, erledigt: true, erledigt_am: new Date().toISOString(), eingang: false });
      else await Daten.speichern('uk_aufgaben', { id: a.id, erledigt: false, erledigt_am: null, faellig: startVon(key), eingang: key === 'eingang' });
      zeichnen();
    };
  });
}

function aufgabeBearbeiten(a, d) {
  dialog(`<h2>${a.art ? (a.id ? 'Termin' : 'Neuer Termin') : (a.id ? 'Aufgabe' : 'Neue Aufgabe')}</h2>
    <div class="formular">
      <label class="breit">${a.art ? 'Worum geht es?' : 'Was ist zu tun?'}<input name="titel" required value="${esc(a.titel)}"></label>
      <label>Art<select name="art"><option value="">Aufgabe (kein Termin)</option>${TERMIN_ARTEN.map((t) => `<option ${t === a.art ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label>Wer<select name="wer">${a.wer ? '' : '<option value="">noch offen</option>'}${['Jasmin', 'Daniel', 'Beide'].map((w) => `<option ${w === a.wer ? 'selected' : ''}>${w}</option>`).join('')}</select></label>
      <label>Priorität<select name="prio">${['', 'orange', 'rot'].map((x) => `<option value="${x}" ${x === (a.prio || '') ? 'selected' : ''}>${PRIO[x]}</option>`).join('')}</select></label>
      <label>${a.art ? 'Von' : 'Fällig am'}<input type="date" name="faellig" value="${esc(a.faellig)}"></label>
      <label class="nur-zeit">Uhrzeit (bei Terminen)<input type="time" name="uhrzeit" value="${esc(a.uhrzeit)}"></label>
      <label class="nur-termin">Bis<input type="date" name="bis_datum" value="${esc(a.bis_datum)}"></label>
      <label class="nur-termin nur-zeit">Uhrzeit bis<input type="time" name="bis_uhrzeit" value="${esc(a.bis_uhrzeit)}"></label>
      <label class="nur-termin haken"><input type="checkbox" name="ganztags" ${a.ganztags ? 'checked' : ''}> ganztägig</label>
      <label>Kunde<select name="kunde_id"><option value="">kein Kunde</option>${d.kunden.map((k) => `<option value="${k.id}" ${k.id === a.kunde_id ? 'selected' : ''}>${esc(name(k))}</option>`).join('')}</select></label>
      <label class="breit">Ort, falls kein Kunde mit Adresse<input name="ort" value="${esc(a.ort)}" placeholder="z. B. Bahnhofstrasse 1, 8001 Zürich"></label>
      <label class="breit">Notiz<textarea name="notiz">${esc(a.notiz)}</textarea></label>
      ${a.eingang ? '<p class="leer breit">Steht im Eingang. Mit einem Datum wandert die Aufgabe in die passende Spalte, ohne Datum bleibt sie hier.</p>' : ''}
    </div>`, a.id, async (w) => {
    // Ein Datum heißt zugeordnet, dann raus aus dem Eingang
    const eingang = !!a.eingang && !w.faellig;
    const ganztags = !!w.ganztags && !!w.art;
    // Bis vor Von ergibt keinen Sinn, dann gilt der Termin nur für den einen Tag
    const bis = w.art && w.bis_datum && w.faellig && w.bis_datum > w.faellig ? w.bis_datum : null;
    // "neu" nie aus dem geladenen Stand zurückschreiben: war die Seite schon länger offen (oder Daniel
    // speichert), käme eine längst gesehene Meldung sonst wieder (Jasmin, 21.10.2026)
    const { neu, ...bisher } = a;
    await Daten.speichern('uk_aufgaben', { ...bisher, ...w, wer: w.wer || null, art: w.art || null, ort: w.ort || null, faellig: w.faellig || null, uhrzeit: ganztags ? null : (w.uhrzeit || null), bis_datum: bis, bis_uhrzeit: ganztags || !w.art ? null : (w.bis_uhrzeit || null), ganztags, kunde_id: w.kunde_id || null, prio: w.prio || '', erledigt: !!a.erledigt, eingang });
  }, async () => Daten.loeschen('uk_aufgaben', a.id));
  // Felder für Termine nur zeigen, wenn eine Art gewählt ist; bei ganztägig keine Uhrzeiten
  const form = document.querySelector('#dialog-form .formular');
  const passen = () => {
    const termin = !!form.querySelector('[name=art]').value, ganz = form.querySelector('[name=ganztags]').checked;
    form.querySelectorAll('.nur-termin').forEach((el) => { el.hidden = !termin; });
    form.querySelectorAll('.nur-zeit').forEach((el) => { el.hidden = (termin && ganz) || (el.classList.contains('nur-termin') && !termin); });
  };
  if (form && form.querySelector('[name=art]')) { form.querySelector('[name=art]').onchange = passen; form.querySelector('[name=ganztags]').onchange = passen; passen(); }
}

// ---------- Kalender: Monat wie bei Apple, dazu die Liste mit Routen ----------
// Termine sind Aufgaben mit Art. Dazu kommen automatisch Abholen und Filterwechsel.
// Monat: ganzer Monat Mo bis So, auch leere Tage. Klick auf einen Tag legt dort einen Termin an.
// Liste: Tag für Tag mit "Route für den Tag", Start ist dort, wo Daniel gerade ist.
let kalenderTage = 14;
let kalAnsicht = 'monat';
let kalMonat = null;      // 'JJJJ-MM'
let kalTagGewaehlt = null; // am Handy: welcher Tag unter dem Raster aufgeklappt ist
const isoTag = (x) => iso(x);
const plusTage = (t, n) => { const x = new Date(t + 'T12:00:00'); x.setDate(x.getDate() + n); return isoTag(x); };
function kalEintraege(d) {
  return [
    ...d.aufgaben.filter((a) => a.art && a.faellig).map((a) => ({ id: a.id, tag: a.faellig, bis: a.bis_datum || a.faellig, uhr: a.uhrzeit, uhrBis: a.bis_uhrzeit, ganz: a.ganztags, art: a.art, k: d.kundeVon(a.kunde_id), ort: a.ort, titel: a.titel, wer: a.wer, erledigt: a.erledigt })),
    ...d.maschinen.filter((m) => m.status === 'Beim Kunden' && m.rueckgabe_bis && m.bei_art !== 'Eigene Nutzung').map((m) => ({ auto: 'maschine', autoId: m.id, tag: m.rueckgabe_bis, bis: m.rueckgabe_bis, art: 'Testgerät abholen', k: d.kundeVon(m.kunde_id), titel: `${maschineName(m)} abholen`, wer: 'Daniel' })),
    ...d.kunden.map((k) => ({ k, f: naechsterFilter(k) })).filter((x) => x.f).map((x) => ({ auto: 'filter', autoId: x.k.id, tag: x.f, bis: x.f, art: 'Filterwechsel', k: x.k, titel: 'Filterwechsel', wer: 'Daniel' })),
  ].map((e) => ({ ...e, adresse: adresseVon(e.k, e.ort) }));
}
const kalTitel = (e) => (e.k ? name(e.k) + (e.titel && !e.auto ? ' · ' + e.titel : '') : e.titel);
function kalOeffnen(el, d) {
  if (el.dataset.id) return aufgabeBearbeiten(d.aufgaben.find((a) => a.id === el.dataset.id), d);
  return el.dataset.auto === 'maschine' ? maschineBearbeiten(d.maschinen.find((m) => m.id === el.dataset.autoId), d) : kundeBearbeiten(d.kundeVon(el.dataset.autoId), d);
}
const kalDaten = (e) => (e.id ? `data-id="${e.id}"` : `data-auto="${e.auto}" data-auto-id="${e.autoId}"`);
async function zeigeKalender(d) {
  const heute = Daten.heute();
  if (!kalMonat) kalMonat = heute.slice(0, 7);
  const alle = kalEintraege(d);
  $('#inhalt').innerHTML = `
    <h1>Kalender</h1><p class="unter">Alle Termine auf einen Blick. Klick auf einen Tag trägt dort einen Termin ein, Klick auf einen Termin öffnet ihn. Abholen und Filterwechsel kommen automatisch dazu, ebenso Termine von Daniels Assistenten.</p>
    <div class="leiste">
      <div class="umschalter-klein">${[['monat', 'Monat'], ['liste', 'Liste']].map(([v, t]) => `<button data-kal-ansicht="${v}" class="${kalAnsicht === v ? 'aktiv' : ''}">${t}</button>`).join('')}</div>
      ${kalAnsicht === 'monat' ? `<button class="knopf leise" id="kal-zurueck" aria-label="Monat zurück">‹</button><h2 class="kal-monat">${new Date(kalMonat + '-15T12:00:00').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</h2><button class="knopf leise" id="kal-vor" aria-label="Monat vor">›</button><button class="knopf leise" id="kal-heute">Heute</button>`
        : `<select id="kal-tage" style="width:auto">${[[7, 'Nächste 7 Tage'], [14, 'Nächste 14 Tage'], [31, 'Nächste 31 Tage']].map(([v, t]) => `<option value="${v}" ${v === kalenderTage ? 'selected' : ''}>${t}</option>`).join('')}</select>`}
      <span style="flex:1"></span><button class="knopf" id="neu-termin">Neuer Termin</button>
    </div>
    <div id="kal-inhalt"></div>`;
  if (kalAnsicht === 'monat') kalMonatZeigen(d, alle, heute); else kalListeZeigen(d, alle, heute);
  document.querySelectorAll('[data-kal-ansicht]').forEach((b) => { b.onclick = () => { kalAnsicht = b.dataset.kalAnsicht; zeichnen(); }; });
  const blaettern = (n) => { const x = new Date(kalMonat + '-15T12:00:00'); x.setMonth(x.getMonth() + n); kalMonat = isoTag(x).slice(0, 7); kalTagGewaehlt = null; zeichnen(); };
  if ($('#kal-zurueck')) { $('#kal-zurueck').onclick = () => blaettern(-1); $('#kal-vor').onclick = () => blaettern(1); $('#kal-heute').onclick = () => { kalMonat = heute.slice(0, 7); kalTagGewaehlt = heute; zeichnen(); }; }
  if ($('#kal-tage')) $('#kal-tage').onchange = (e) => { kalenderTage = Number(e.target.value); zeichnen(); };
  $('#neu-termin').onclick = () => aufgabeBearbeiten({ art: 'Vorstellen', wer: 'Daniel', prio: '', faellig: kalTagGewaehlt || heute }, d);
}
function kalMonatZeigen(d, alle, heute) {
  const erster = kalMonat + '-01';
  const wt = (new Date(erster + 'T12:00:00').getDay() + 6) % 7; // Montag = 0
  const start = plusTage(erster, -wt);
  const tage = Array.from({ length: 42 }, (_, i) => plusTage(start, i));
  // Letzte Woche weglassen, wenn sie ganz im nächsten Monat liegt
  const sichtbar = tage.slice(0, tage[35].slice(0, 7) === kalMonat ? 42 : 35);
  const amTag = (t) => alle.filter((e) => e.tag <= t && e.bis >= t).sort((a, b) => (b.bis > b.tag) - (a.bis > a.tag) || String(a.ganz ? '' : a.uhr || '99').localeCompare(String(b.ganz ? '' : b.uhr || '99')));
  const chip = (e, t) => {
    const mehr = e.bis > e.tag, anfang = t === e.tag || new Date(t + 'T12:00:00').getDay() === 1;
    return `<div class="kal-chip ${ART_KLASSE[e.art] || ''} ${mehr ? 'mehrtag' : ''} ${mehr && t !== e.tag ? 'weiter' : ''} ${mehr && t !== e.bis ? 'offen-rechts' : ''} ${e.erledigt ? 'erledigt' : ''}" ${kalDaten(e)} title="${esc(e.art + ': ' + kalTitel(e))}">
      ${anfang ? `${!e.ganz && e.uhr && t === e.tag ? `<b>${e.uhr.slice(0, 5)}</b> ` : ''}${esc(kalTitel(e))}` : '&nbsp;'}</div>`;
  };
  if (!kalTagGewaehlt || kalTagGewaehlt.slice(0, 7) !== kalMonat) kalTagGewaehlt = heute.slice(0, 7) === kalMonat ? heute : null;
  $('#kal-inhalt').innerHTML = `<div class="kal-raster">
      ${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((w) => `<div class="kal-wt">${w}</div>`).join('')}
      ${sichtbar.map((t) => { const liste = amTag(t); return `<div class="kal-feld ${t.slice(0, 7) !== kalMonat ? 'fremd' : ''} ${t === heute ? 'heute' : ''} ${t === kalTagGewaehlt ? 'gewaehlt' : ''}" data-tag="${t}">
        <div class="kal-nr">${Number(t.slice(8))}</div>
        <div class="kal-chips">${liste.slice(0, 4).map((e) => chip(e, t)).join('')}${liste.length > 4 ? `<div class="kal-mehr">+${liste.length - 4} weitere</div>` : ''}</div>
        <div class="kal-punkte">${liste.slice(0, 5).map((e) => `<i class="${ART_KLASSE[e.art] || ''}"></i>`).join('')}</div>
      </div>`; }).join('')}
    </div>
    <div id="kal-tagliste"></div>`;
  // Am Handy: der gewählte Tag unter dem Raster, wie beim iPhone
  const tagListe = () => {
    const t = kalTagGewaehlt, el = $('#kal-tagliste');
    if (!t) { el.innerHTML = ''; return; }
    const liste = amTag(t);
    el.innerHTML = `<h3>${new Date(t + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
      ${liste.map((e) => `<div class="kal-eintrag" ${kalDaten(e)}><div class="kal-zeit">${e.ganz ? 'ganztägig' : e.uhr ? e.uhr.slice(0, 5) + (e.uhrBis ? '–' + e.uhrBis.slice(0, 5) : '') : 'offen'}</div>
        <div class="haupt"><span class="label termin ${ART_KLASSE[e.art] || ''}">${esc(e.art)}</span>${e.bis > e.tag ? ` <span class="marker">${new Date(e.tag + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} bis ${new Date(e.bis + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>` : ''}
          <div class="titel">${esc(kalTitel(e))}</div><div class="klein">${esc(e.adresse || '')}</div></div>
        ${e.adresse ? `<a class="knopf leise klein-knopf" href="${kartenLink(e.adresse)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Hinfahren</a>` : ''}</div>`).join('') || '<p class="leer">Nichts eingetragen.</p>'}
      <button class="knopf leise" id="tag-neu">Termin an diesem Tag</button>`;
    el.querySelectorAll('.kal-eintrag').forEach((x) => { x.onclick = () => kalOeffnen(x, d); });
    $('#tag-neu').onclick = () => aufgabeBearbeiten({ art: 'Vorstellen', wer: 'Daniel', prio: '', faellig: t }, d);
  };
  tagListe();
  const handy = () => window.matchMedia('(max-width: 720px)').matches;
  document.querySelectorAll('.kal-chip').forEach((c) => { c.onclick = (e) => { if (handy()) return; e.stopPropagation(); kalOeffnen(c, d); }; });
  document.querySelectorAll('.kal-feld').forEach((f) => {
    f.onclick = () => {
      if (handy()) { kalTagGewaehlt = f.dataset.tag; document.querySelectorAll('.kal-feld.gewaehlt').forEach((x) => x.classList.remove('gewaehlt')); f.classList.add('gewaehlt'); tagListe(); return; }
      aufgabeBearbeiten({ art: 'Vorstellen', wer: 'Daniel', prio: '', faellig: f.dataset.tag }, d);
    };
  });
}
function kalListeZeigen(d, alle, heute) {
  const bis = plusTage(heute, kalenderTage - 1);
  const eintraege = alle.filter((e) => !e.erledigt)
    .map((e) => ({ ...e, tag: e.tag < heute ? (e.bis >= heute ? heute : heute) : e.tag, ueberfaellig: e.bis < heute }))
    .filter((e) => e.tag <= bis)
    .sort((a, b) => a.tag.localeCompare(b.tag) || String(a.uhr || '99').localeCompare(String(b.uhr || '99')));
  const tage = [...new Set(eintraege.map((e) => e.tag))];
  const tagName = (t) => new Date(t + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' });
  const route = (liste) => {
    // Private Termine gehören nicht in Daniels Tagesroute
    const ziele = liste.filter((e) => e.art !== 'Privat').map((e) => e.adresse).filter(Boolean);
    if (!ziele.length) return '';
    const ende = ziele[ziele.length - 1], zwischen = ziele.slice(0, -1);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ende)}${zwischen.length ? '&waypoints=' + encodeURIComponent(zwischen.join('|')) : ''}&travelmode=driving`;
  };
  $('#kal-inhalt').innerHTML = tage.map((t) => { const liste = eintraege.filter((e) => e.tag === t), r = route(liste); return `
      <section class="kal-tag"><div class="kal-kopf"><h2>${t === heute ? 'Heute, ' : ''}${tagName(t)}</h2>${r ? `<a class="knopf" href="${r}" target="_blank" rel="noopener">Route für den Tag</a>` : ''}</div>
        ${liste.map((e) => `<div class="kal-eintrag" ${kalDaten(e)}>
          <div class="kal-zeit">${e.ganz ? 'ganztägig' : e.uhr ? e.uhr.slice(0, 5) : 'offen'}</div>
          <div class="haupt"><span class="label termin ${ART_KLASSE[e.art] || ''}">${esc(e.art)}</span>${e.ueberfaellig ? ' <span class="marker rot">überfällig</span>' : ''}${e.bis > e.tag ? ` <span class="marker">bis ${new Date(e.bis + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>` : ''}
            <div class="titel">${esc(kalTitel(e))}</div>
            <div class="klein">${e.adresse ? esc(e.adresse) : '<span class="marker warn">Adresse fehlt</span>'}${e.k && e.k.telefon ? ' · ' + esc(e.k.telefon) : ''}</div></div>
          ${e.adresse ? `<a class="knopf leise klein-knopf" href="${kartenLink(e.adresse)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Hinfahren</a>` : ''}
        </div>`).join('')}
      </section>`; }).join('') || '<p class="leer">Keine Termine in diesem Zeitraum. Über „Neuer Termin“ trägst du einen ein.</p>';
  document.querySelectorAll('.kal-eintrag').forEach((el) => { el.onclick = () => kalOeffnen(el, d); });
}

// ---------- Kunden ----------
async function zeigeKunden(d) {
  const s = sucheKunde.toLowerCase();
  const liste = d.kunden
    .filter((k) => filterStatus === 'Alle' || k.status === filterStatus)
    .filter((k) => !s || [k.vorname, k.nachname, k.ort, k.telefon, k.email, ...produkteVon(k).map(produktName)].join(' ').toLowerCase().includes(s))
    .filter((k) => kf.produkt === 'Alle' || (kf.produkt === 'ohne' ? !produkteVon(k).length : produkteVon(k).includes(kf.produkt)))
    .filter((k) => kf.land === 'Alle' || k.land === kf.land)
    .filter((k) => kf.partner === 'Alle' || (kf.partner === 'direkt' ? !k.partner_id : k.partner_id === kf.partner))
    .filter((k) => {
      if (kf.zeitraum === 'Alle') return true;
      if (!k.kaufdatum) return false;
      if (kf.zeitraum === '30') return tageBis(k.kaufdatum) >= -30;
      if (kf.zeitraum === '90') return tageBis(k.kaufdatum) >= -90;
      return k.kaufdatum.startsWith(kf.zeitraum);
    })
    .filter((k) => kf.vermerk === 'Alle' || (k.vermerke || []).includes(kf.vermerk))
    .filter((k) => !kf.filter || (naechsterFilter(k) && tageBis(naechsterFilter(k)) <= 30))
    .sort((a, b) => name(a).localeCompare(name(b)));
  $('#inhalt').innerHTML = `
    <h1>Kunden</h1><p class="unter">${d.kunden.length} Einträge. Klick auf eine Zeile öffnet den Kunden.</p>
    <div class="leiste">
      <input type="search" id="suche" placeholder="Suchen nach Name, Ort, Telefon, Produkt" value="${esc(sucheKunde)}">
      <select id="status" style="width:auto">${['Alle', ...STATUS_KUNDE].map((x) => `<option ${x === filterStatus ? 'selected' : ''}>${x}</option>`).join('')}</select>
      <button class="knopf" id="neu">Neuer Kunde</button>
    </div>
    <div class="leiste">
      <select data-kf="produkt" style="width:auto">${[['Alle', 'Kunde bei: alle'], ...PRODUKTE.map(([v, t]) => [v, 'Kunde bei ' + t]), ['ohne', 'noch nirgends Kunde']].map(([v, t]) => `<option value="${v}" ${v === kf.produkt ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
      <select data-kf="land" style="width:auto">${['Alle', 'CH', 'DE', 'AT', 'AE', 'anderes'].map((x) => `<option value="${x}" ${x === kf.land ? 'selected' : ''}>${x === 'Alle' ? 'Alle Länder' : x}</option>`).join('')}</select>
      <select data-kf="partner" style="width:auto"><option value="Alle">Alle Partner</option><option value="direkt" ${kf.partner === 'direkt' ? 'selected' : ''}>direkt bei Daniel</option>${d.partner.map((p) => `<option value="${p.id}" ${p.id === kf.partner ? 'selected' : ''}>${esc(name(p))}</option>`).join('')}</select>
      <select data-kf="zeitraum" style="width:auto">${[['Alle', 'Kauf: jederzeit'], ['30', 'Kauf: letzte 30 Tage'], ['90', 'Kauf: letzte 90 Tage'], ...[0, 1, 2].map((i) => { const j = String(new Date().getFullYear() - i); return [j, 'Kauf: ' + j]; })].map(([v, t]) => `<option value="${v}" ${v === kf.zeitraum ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <select data-kf="vermerk" style="width:auto"><option value="Alle">Alle Vermerke</option>${Daten.VERMERKE.map((v) => `<option value="${v.id}" ${v.id === kf.vermerk ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>
      <label style="display:flex;align-items:center;gap:6px;width:auto;white-space:nowrap"><input type="checkbox" id="kf-filter" style="width:auto" ${kf.filter ? 'checked' : ''}> Filterwechsel fällig</label>
      <button class="knopf leise" id="kf-weg">Filter zurücksetzen</button>
    </div>
    <p class="leer" style="margin:-6px 0 12px">${liste.length} von ${d.kunden.length} Kunden</p>
    <div class="tabelle-huelle"><table>
      <tr><th>Name</th><th>Ort</th><th>Status</th><th>Über</th><th>Kunde bei</th><th>Bestellt am</th><th>Nächster Filter</th></tr>
      ${liste.map((k) => `<tr class="klickbar" data-id="${k.id}">
        <td>${esc(name(k))}<div style="color:var(--leise);font-size:13px">${esc(k.telefon || '')}</div>${(k.vermerke || []).length ? `<div class="vermerke">${vermerkeHtml(k)}</div>` : ''}</td>
        <td>${esc([k.ort, k.land].filter(Boolean).join(', '))}</td>
        <td><span class="marker ${statusKlasse(k.status)}">${esc(k.status)}</span></td>
        <td>${esc(k.partner_id ? name(d.partnerVon(k.partner_id)) : (k.empfohlen_von || 'direkt'))}</td>
        <td>${produkteHtml(k)}</td><td>${datum(k.kaufdatum)}</td><td>${fristMarker(naechsterFilter(k), 30)}</td></tr>`).join('') || '<tr><td colspan="7" class="leer">Keine Treffer.</td></tr>'}
    </table></div>`;
  const suche = $('#suche');
  suche.oninput = (e) => { sucheKunde = e.target.value; zeichnen().then(() => { const f = $('#suche'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); }); };
  $('#status').onchange = (e) => { filterStatus = e.target.value; zeichnen(); };
  $('#neu').onclick = () => kundeBearbeiten({ status: 'Interessent', land: 'CH' }, d);
  document.querySelectorAll('[data-kf]').forEach((el) => { el.onchange = () => { kf[el.dataset.kf] = el.value; zeichnen(); }; });
  $('#kf-filter').onchange = (e) => { kf.filter = e.target.checked; zeichnen(); };
  $('#kf-weg').onclick = () => { kf = { produkt: 'Alle', land: 'Alle', partner: 'Alle', zeitraum: 'Alle', vermerk: 'Alle', filter: false }; filterStatus = 'Alle'; sucheKunde = ''; zeichnen(); };
  document.querySelectorAll('tr.klickbar').forEach((tr) => { tr.onclick = () => kundeBearbeiten(d.kunden.find((k) => k.id === tr.dataset.id), d); });
}

function kundeBearbeiten(k, d) {
  const maschinen = d.verlauf.filter((v) => v.kunde_id === k.id).sort((a, b) => b.von.localeCompare(a.von));
  const offeneAufgaben = d.aufgaben.filter((a) => a.kunde_id === k.id && !a.erledigt);
  const vm = k.vermerke || [];
  const blick = k.id ? `<div class="blick">
      <b>Auf einen Blick</b>
      <div>${esc([k.status, k.telefon].filter(Boolean).join(' · '))} ${produkteHtml(k)}</div>
      <div>${esc([k.strasse, [k.plz, k.ort].filter(Boolean).join(' ')].filter(Boolean).join(', '))} ${routeHtml(k)}</div>
      ${vm.length ? `<div class="vermerke">${vermerkeHtml(k)}</div>` : '<div class="leise">Noch keine Vermerke.</div>'}
      ${k.gesundheit_einwilligung && k.gesundheit ? `<div><span class="leise">Gesundheit (mit Einwilligung):</span> ${esc(k.gesundheit)}</div>` : ''}
      ${k.notiz ? `<div><span class="leise">Notiz:</span> ${esc(k.notiz)}</div>` : ''}
    </div>` : '';
  dialog(`<h2>${k.id ? esc(name(k)) : 'Neuer Kunde'}</h2>${blick}
    <div class="formular">
      <label>Vorname<input name="vorname" required value="${esc(k.vorname)}"></label>
      <label>Nachname<input name="nachname" value="${esc(k.nachname)}"></label>
      <label>Telefon<input name="telefon" value="${esc(k.telefon)}"></label>
      <label>E-Mail<input type="email" name="email" value="${esc(k.email)}"></label>
      <label class="breit">Straße<input name="strasse" value="${esc(k.strasse)}"></label>
      <label>PLZ<input name="plz" value="${esc(k.plz)}"></label>
      <label>Ort<input name="ort" value="${esc(k.ort)}"></label>
      <label>Land<select name="land">${['CH', 'DE', 'AT', 'AE', 'anderes'].map((x) => `<option ${x === k.land ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label>Status<select name="status" id="k-status">${STATUS_KUNDE.map((x) => `<option ${x === k.status ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label>Bestellt am<input type="date" name="kaufdatum" id="k-bestellt" value="${esc(k.kaufdatum)}"></label>
      <label>Geliefert am<input type="date" name="geliefert_am" id="k-geliefert" value="${esc(k.geliefert_am)}"></label>
      <label>Letzter Filterwechsel<input type="date" name="filter_zuletzt" value="${esc(k.filter_zuletzt)}"></label>
      <label>Über Partner<select name="partner_id"><option value="">direkt bei Daniel</option>${d.partner.map((p) => `<option value="${p.id}" ${p.id === k.partner_id ? 'selected' : ''}>${esc(name(p))}</option>`).join('')}</select></label>
      <label class="breit">Empfohlen von (falls kein Partner mit Link)<input name="empfohlen_von" value="${esc(k.empfohlen_von)}"></label>
      <label class="breit">Notiz<textarea name="notiz">${esc(k.notiz)}</textarea></label>
      <div class="breit"><div class="titel-klein">Ist Kunde bei</div>
        <div class="kaestchen">${PRODUKTE.map(([id, t]) => `<label><input type="checkbox" name="produkte" value="${id}" ${produkteVon(k).includes(id) ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</div></div>
      <div class="breit"><div class="titel-klein">Haushalt und Interessen</div>
        <div class="kaestchen">${Daten.VERMERKE.map((v) => `<label><input type="checkbox" name="vermerke" value="${v.id}" ${vm.includes(v.id) ? 'checked' : ''}> ${esc(v.name)}</label>`).join('')}</div></div>
      <div class="breit gesundheit"><div class="titel-klein">Gesundheit, nur intern</div>
        <label class="haken"><input type="checkbox" name="gesundheit_einwilligung" id="g-ok" ${k.gesundheit_einwilligung ? 'checked' : ''}> Der Kunde hat selbst davon erzählt und eingewilligt, dass wir es notieren.</label>
        <textarea name="gesundheit" id="g-text" placeholder="Nur ausfüllen, wenn der Haken gesetzt ist" ${k.gesundheit_einwilligung ? '' : 'disabled'}>${esc(k.gesundheit)}</textarea></div>
    </div>
    ${maschinen.length ? `<div class="verlauf"><b>Testmaschinen</b><br>${maschinen.map((v) => `${esc(maschineName(d.maschinen.find((m) => m.id === v.maschine_id)))}: ${datum(v.von)} bis ${v.bis ? datum(v.bis) : 'heute'}${v.kaufinteresse ? ', Kaufinteresse ' + esc(v.kaufinteresse) : ''}`).join('<br>')}</div>` : ''}
    ${fragebogenHtml(k, d)}
    ${offeneAufgaben.length ? `<div class="verlauf"><b>Offene Aufgaben</b><br>${offeneAufgaben.map((a) => esc(a.titel) + (a.faellig ? ' (' + datum(a.faellig) + (a.uhrzeit ? ', ' + zeit(a) : '') + ')' : '')).join('<br>')}</div>` : ''}`,
  k.id, async (w) => {
    for (const f of ['kaufdatum', 'geliefert_am', 'filter_zuletzt', 'partner_id']) w[f] = w[f] || null;
    w.vermerke = [...document.querySelectorAll('#dialog-form input[name=vermerke]:checked')].map((x) => x.value);
    w.produkte = [...document.querySelectorAll('#dialog-form input[name=produkte]:checked')].map((x) => x.value);
    // Gerät bleibt für Auswertung und Partnerzahlen erhalten: wer den K8 hat, hat den LeveLuk K8
    w.geraet = w.produkte.includes('K8') ? 'LeveLuk K8' : null;
    w.gesundheit_einwilligung = !!w.gesundheit_einwilligung;
    w.gesundheit = w.gesundheit_einwilligung ? (w.gesundheit || '').trim() : '';
    await Daten.speichern('uk_kunden', { ...k, ...w, token: k.token || Daten.neuerToken() });
  }, async () => Daten.loeschen('uk_kunden', k.id));
  $('#g-ok').onchange = (e) => { $('#g-text').disabled = !e.target.checked; };
  // Bestellt oder geliefert: Datum mit heute vorbelegen, es lässt sich danach noch ändern
  $('#k-status').onchange = (e) => {
    if ((e.target.value === 'Bestellt' || e.target.value === 'Geliefert') && !$('#k-bestellt').value) $('#k-bestellt').value = Daten.heute();
    if (e.target.value === 'Geliefert' && !$('#k-geliefert').value) $('#k-geliefert').value = Daten.heute();
  };
  document.querySelectorAll('[data-fb-zeigen]').forEach((b) => { b.onclick = (e) => { e.preventDefault(); fragebogenAntworten(d.fragebogen.find((f) => f.id === b.dataset.fbZeigen), k); }; });
  const kb = document.querySelector('#fb-kopieren');
  if (kb) kb.onclick = async (e) => { e.preventDefault(); try { await navigator.clipboard.writeText(kb.dataset.link); kb.textContent = 'kopiert'; } catch (err) { kb.textContent = kb.dataset.link; } };
}

// Fragebogen beim Kunden: persönlicher Link und Stand der Durchgänge
function fragebogenLink(k) { return new URL('../fragebogen/?k=' + encodeURIComponent(k.token || ''), location.href).href; }
// Alle Antworten eines Fragebogens lesbar, Frage für Frage (20.10.2026)
function fragebogenAntworten(e, k) {
  const a = e.antworten || {};
  const wert = (f) => {
    const v = a[f.id];
    if (v === undefined || v === null || v === '') return '<span class="leer">keine Angabe</span>';
    if (f.typ === 'skala') return Number.isFinite(v) ? `<b>${v}</b> von 10 <span class="leer">(1 = ${esc(f.links)}, 10 = ${esc(f.rechts)})</span>` : esc(f.auslassen || String(v));
    if (Array.isArray(v)) return v.map(esc).join(', ');
    return esc(String(v)).replace(/\n/g, '<br>');
  };
  const fragen = FRAGEN.filter((f) => a[f.id] !== undefined);
  dialog(`<h2>Fragebogen von ${esc(name(k))}</h2>
    <p class="leer">${esc((DURCHGAENGE.find((d) => d.nr === e.durchgang) || {}).kurz || 'Durchgang ' + e.durchgang)}, ausgefüllt am ${datum(e.erstellt.slice(0, 10))}${e.stimme ? ' · darf als Kundenstimme gezeigt werden' : ''}</p>
    <div class="fb-antworten">${fragen.map((f) => `<div><span>${esc(f.text)}</span><div>${wert(f)}</div></div>`).join('') || '<p class="leer">Keine Antworten gespeichert.</p>'}</div>`,
  false, async () => {});
  const sp = document.querySelector('#dialog-form button[type=submit]'); if (sp) sp.textContent = 'Schließen';
}
function fragebogenHtml(k, d) {
  if (!k.id) return '';
  const fb = d.fragebogen.filter((f) => f.kunde_id === k.id).sort((a, b) => a.durchgang - b.durchgang);
  const start = fb[0] ? fb[0].erstellt.slice(0, 10) : null;
  const zeilen = DURCHGAENGE.map((dg) => {
    const e = fb.find((f) => f.durchgang === dg.nr);
    if (e) return `${esc(dg.kurz)}: ausgefüllt am ${datum(e.erstellt.slice(0, 10))} <button type="button" class="knopf leise klein-knopf" data-fb-zeigen="${e.id}">Antworten ansehen</button>`;
    if (!start) return `${esc(dg.kurz)}: noch offen`;
    const f = new Date(start + 'T12:00:00'); f.setDate(f.getDate() + dg.tage);
    return `${esc(dg.kurz)}: fällig am ${datum(f.toISOString().slice(0, 10))}`;
  });
  return `<div class="verlauf"><b>Fragebogen</b><br>${k.token ? `<button class="knopf leise" id="fb-kopieren" data-link="${esc(fragebogenLink(k))}" style="margin:6px 0">Persönlichen Link kopieren</button><br>` : 'Noch kein persönlicher Link. Nach dem Speichern wird einer angelegt.<br>'}${zeilen.join('<br>')}${k.newsletter ? '<br>Newsletter: ' + esc(k.newsletter) : ''}</div>`;
}

// ---------- Testmaschinen ----------
// Kacheln in zwei Listen. Klick öffnet das Gerät, am Rechner lassen sie sich zwischen den Listen ziehen.
const maschinenFolge = (a, b) => (a.nummer ?? 1e9) - (b.nummer ?? 1e9) || maschineName(a).localeCompare(maschineName(b), 'de', { numeric: true });
async function zeigeMaschinen(d) {
  const liste = [...d.maschinen].sort(maschinenFolge);
  const zaehl = (s) => liste.filter((m) => m.status === s).length;
  const inListe = (l) => liste.filter((m) => listeVon(m) === l);
  // Alle Geräte einer Liste auf etwa drei Zeilen, beide Listen mit gleich breiten Kacheln
  const spalten = Math.max(4, ...LISTEN.map(([l]) => Math.ceil(inListe(l).length / 3)));
  const kachel = (m) => {
    const k = d.kundeVon(m.kunde_id);
    const bei = m.bei_name || name(k);
    const faellig = m.status === 'Beim Kunden' && m.bei_art !== 'Eigene Nutzung' && m.rueckgabe_bis && tageBis(m.rueckgabe_bis) <= 0;
    const klasse = faellig ? 'faellig' : m.status === 'Beim Kunden' ? 'unterwegs' : m.status === 'Wartung' ? 'wartung' : '';
    return `<div class="maschine ${klasse}" data-id="${m.id}" draggable="true">
        <div class="nr" title="${esc(maschineName(m))}">${esc(maschineName(m))}</div>
        ${listeVon(m) === 'partner' ? `<div class="besitzer">${m.besitzer ? 'Gehört ' + esc(m.besitzer) : 'Besitzer fehlt'}</div>` : ''}
        <div style="margin-top:8px"><span class="marker ${m.status === 'Verfügbar' ? 'gut' : m.status === 'Wartung' ? 'warn' : ''}">${esc(m.status)}</span></div>
        ${bei ? `<div style="margin-top:8px">${esc(bei)}</div><div class="klein">seit ${datum(m.seit)}${m.rueckgabe_bis ? (m.bei_art === 'Eigene Nutzung' ? ' · verplant bis ' : ' · zurück ') + datum(m.rueckgabe_bis) : ''}</div>` : ''}
        ${(m.filter_wechsel || []).length ? `<div class="klein">Filter zuletzt ${datum([...m.filter_wechsel].sort().pop())}</div>` : ''}
        ${m.kaufinteresse ? `<div class="klein">Kaufinteresse: ${esc(m.kaufinteresse)}</div>` : ''}
        ${m.notiz ? `<div class="klein">${esc(m.notiz)}</div>` : ''}
      </div>`;
  };
  $('#inhalt').innerHTML = `
    <h1>Testmaschinen</h1>
    <p class="unter">${zaehl('Verfügbar')} verfügbar · ${zaehl('Beim Kunden')} beim Kunden · ${zaehl('Wartung')} in Wartung. Klick auf ein Gerät zum Ausgeben, Zurücknehmen oder Bearbeiten. Am Rechner lassen sich Geräte in die andere Liste ziehen.</p>
    <div class="leiste"><button class="knopf" id="neu">+ Gerät hinzufügen</button></div>
    ${LISTEN.map(([l, titel]) => `
      <section class="maschinen-liste" data-liste="${l}">
        <h2>${titel} <span>${inListe(l).length}</span></h2>
        <div class="maschinen" style="--spalten:${spalten}">${inListe(l).map(kachel).join('')}</div>
        ${inListe(l).length ? '' : `<p class="leer">${l === 'partner' ? 'Noch keine Geräte von Partnern.' : 'Noch keine Geräte.'} Neues Gerät hinzufügen oder beim Gerät die Liste wechseln.</p>`}
      </section>`).join('<hr class="trenner">')}`;
  $('#neu').onclick = () => maschineBearbeiten({ status: 'Verfügbar', liste: 'daniel', filter_wechsel: [] }, d);
  document.querySelectorAll('.maschine').forEach((el) => {
    el.onclick = () => maschineBearbeiten(d.maschinen.find((m) => m.id === el.dataset.id), d);
    el.ondragstart = (e) => { e.dataTransfer.setData('text/plain', el.dataset.id); el.classList.add('zieht'); };
    el.ondragend = () => el.classList.remove('zieht');
  });
  document.querySelectorAll('.maschinen-liste').forEach((sp) => {
    sp.ondragover = (e) => { e.preventDefault(); sp.classList.add('ziel'); };
    sp.ondragleave = (e) => { if (!sp.contains(e.relatedTarget)) sp.classList.remove('ziel'); };
    sp.ondrop = async (e) => {
      e.preventDefault(); sp.classList.remove('ziel');
      const m = d.maschinen.find((x) => x.id === e.dataTransfer.getData('text/plain'));
      const ziel = sp.dataset.liste;
      if (!m || listeVon(m) === ziel) return;
      // Bei Partnern muss drinstehen, wem das Gerät gehört: dann gleich nachfragen
      if (ziel === 'partner' && !m.besitzer) return maschineBearbeiten({ ...m, liste: 'partner' }, d);
      await Daten.speichern('uk_maschinen', { id: m.id, liste: ziel, besitzer: ziel === 'partner' ? m.besitzer : null });
      zeichnen();
    };
  });
}

// Alle Namen, die schon irgendwo vorkommen: Kunden, Partner, frühere Ausleihen, Jasmin und Daniel
function namenVorschlaege(d) {
  const alle = ['Jasmin', 'Daniel', ...d.kunden.map(name), ...d.partner.map(name), ...d.maschinen.map((m) => m.bei_name), ...d.verlauf.map((v) => v.kunde_name)];
  return [...new Set(alle.map((n) => (n || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'de'));
}
function maschineBearbeiten(m, d) {
  const verlauf = d.verlauf.filter((v) => v.maschine_id === m.id).sort((a, b) => b.von.localeCompare(a.von));
  // Vorschlag für ein neues Gerät bei Daniel: nächster freier Name "Daniel NN"
  const vergeben = new Set(d.maschinen.map((x) => maschineName(x).toLowerCase()));
  let nr = d.maschinen.filter((x) => listeVon(x) === 'daniel').length + 1;
  while (vergeben.has(geraetName(nr).toLowerCase())) nr++;
  dialog(`<h2>${m.id ? 'Testmaschine ' + esc(maschineName(m)) : 'Neues Gerät'}</h2>
    <div class="formular">
      <label>Name<input name="name" required autocomplete="off" value="${esc(m.id ? maschineName(m) : geraetName(nr))}"></label>
      <label>Liste<select name="liste">${LISTEN.map(([l, titel]) => `<option value="${l}" ${l === listeVon(m) ? 'selected' : ''}>${titel}</option>`).join('')}</select></label>
      <label class="breit nur-partner">Besitzer<input name="besitzer" list="kunden-namen" autocomplete="off" placeholder="Wem gehört das Gerät?" value="${esc(m.besitzer)}"></label>
      <label>Status<select name="status">${STATUS_MASCHINE.map((x) => `<option ${x === m.status ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label>Bei wem<input name="bei_name" list="kunden-namen" autocomplete="off" placeholder="Name eintippen" value="${esc(m.bei_name || name(d.kundeVon(m.kunde_id)))}"></label>
      <datalist id="kunden-namen">${namenVorschlaege(d).map((n) => `<option value="${esc(n)}">`).join('')}</datalist>

      <label>Seit<input type="date" name="seit" value="${esc(m.seit || Daten.heute())}"></label>
      <label>Zurück bis<input type="date" name="rueckgabe_bis" value="${esc(m.rueckgabe_bis)}"></label>
      <label>Kaufinteresse<select name="kaufinteresse">${['', 'Offen', 'Ja', 'Nein'].map((x) => `<option value="${x}" ${x === (m.kaufinteresse || '') ? 'selected' : ''}>${x || 'noch unklar'}</option>`).join('')}</select></label>
      <label>Filter getauscht am<input type="date" name="filter_neu" title="Datum eintragen, beim Speichern kommt es in die Liste darunter"></label>
      <label class="breit">Notiz<textarea name="notiz">${esc(m.notiz)}</textarea></label>
    </div>
    ${(m.filter_wechsel || []).length ? `<div class="verlauf"><b>Filter getauscht</b><br>${[...m.filter_wechsel].sort().reverse().map(datum).join('<br>')}</div>` : ''}
    <p class="leer">Zum Ausgeben: Status „Beim Kunden“ und den Namen eintippen. Gibt es den Namen schon bei den Kunden, wird er verknüpft, sonst als neuer Interessent angelegt. Steht Jasmin oder Daniel drin, ist das Gerät nur verplant. Zum Zurücknehmen: Status „Verfügbar“.</p>
    ${verlauf.length ? `<div class="verlauf"><b>Wo war diese Maschine?</b><br>${verlauf.map((v) => `${datum(v.von)} bis ${v.bis ? datum(v.bis) : 'heute'}: ${esc(v.kunde_name || '')}${v.kaufinteresse ? ', Kaufinteresse ' + esc(v.kaufinteresse) : ''}`).join('<br>')}</div>` : ''}`,
  m.id, async (w) => {
    w.name = (w.name || '').trim().replace(/\s+/g, ' ');
    w.besitzer = w.liste === 'partner' ? (w.besitzer || '').trim().replace(/\s+/g, ' ') || null : null;
    if (!w.name) { alert('Bitte dem Gerät einen Namen geben.'); return false; }
    if (w.liste === 'partner' && !w.besitzer) { alert('Bitte eintippen, wem das Gerät gehört.'); return false; }
    // Filterwechsel: jedes Datum bleibt in der Liste, nichts wird überschrieben
    const filterNeu = w.filter_neu; delete w.filter_neu;
    w.filter_wechsel = [...new Set([...(m.filter_wechsel || []), ...(filterNeu ? [filterNeu] : [])])].sort();
    const bei = (w.bei_name || '').trim().replace(/\s+/g, ' ');
    w.bei_art = TEAM.includes(bei.toLowerCase()) ? 'Eigene Nutzung' : 'Interessent';
    const neu = { ...m, ...w, bei_name: bei || null, kunde_id: null, rueckgabe_bis: w.rueckgabe_bis || null, kaufinteresse: w.kaufinteresse || null };
    if (neu.status !== 'Beim Kunden') { neu.kunde_id = null; neu.bei_name = null; neu.bei_art = null; neu.seit = null; neu.rueckgabe_bis = null; }
    if (neu.status === 'Beim Kunden' && !bei) { alert('Bitte eintippen, bei wem die Maschine ist.'); return false; }
    // Name einem Kunden zuordnen oder neu anlegen, außer das Gerät ist bei uns selbst
    if (neu.status === 'Beim Kunden' && neu.bei_art !== 'Eigene Nutzung') {
      let k = d.kunden.find((x) => name(x).toLowerCase() === bei.toLowerCase());
      if (!k) {
        const [vorname, ...rest] = bei.split(' ');
        k = await Daten.speichern('uk_kunden', { vorname, nachname: rest.join(' ') || null, status: 'Testet', land: 'CH', token: Daten.neuerToken(), notiz: 'Beim Ausgeben eines Testgeräts angelegt' });
        d.kunden.push(k);
      }
      neu.kunde_id = k.id;
    }
    // Erst das Gerät speichern: ein neues bekommt dabei seine id, die der Verlauf braucht
    const gespeichert = await Daten.speichern('uk_maschinen', neu);
    // Verlauf führen: alte Ausleihe schließen, neue öffnen
    const offen = verlauf.find((v) => !v.bis);
    const wechsel = (v) => v && (v.kunde_id !== neu.kunde_id || (v.kunde_name || '') !== (neu.bei_name || ''));
    if (offen && wechsel(offen)) await Daten.speichern('uk_maschinen_verlauf', { id: offen.id, bis: Daten.heute(), kaufinteresse: m.kaufinteresse });
    if (neu.bei_name && (!offen || wechsel(offen))) {
      await Daten.speichern('uk_maschinen_verlauf', { maschine_id: gespeichert.id, kunde_id: neu.kunde_id, kunde_name: neu.bei_name, von: neu.seit || Daten.heute(), bis: null, kaufinteresse: neu.kaufinteresse });
    } else if (offen && neu.bei_name) {
      await Daten.speichern('uk_maschinen_verlauf', { id: offen.id, kaufinteresse: neu.kaufinteresse });
    }
    if (neu.status === 'Beim Kunden') {
      const k = d.kundeVon(neu.kunde_id);
      if (k && k.status === 'Interessent') await Daten.speichern('uk_kunden', { id: k.id, status: 'Testet' });
    }
  }, async () => {
    // Verlauf mit löschen (die Datenbank macht das ohnehin, die Vorschau nicht)
    for (const v of verlauf) await Daten.loeschen('uk_maschinen_verlauf', v.id);
    await Daten.loeschen('uk_maschinen', m.id);
  }, `Gerät ${maschineName(m)} wirklich löschen? Der Verlauf geht mit verloren.`);
  // Besitzer nur bei Geräten von Partnern
  const form = document.querySelector('#dialog-form .formular');
  const passen = () => { form.querySelector('.nur-partner').hidden = form.querySelector('[name=liste]').value !== 'partner'; };
  form.querySelector('[name=liste]').onchange = passen; passen();
}

// ---------- Partner ----------
function zahlenVon(p, d) {
  const ks = d.kunden.filter((k) => k.partner_id === p.id);
  const kaeufe = ks.filter(gekauft);
  const jahr = String(new Date().getFullYear());
  const geraete = {};
  kaeufe.forEach((k) => { const g = k.geraet || 'Gerät offen'; geraete[g] = (geraete[g] || 0) + 1; });
  return {
    ks, kaeufe, geraete,
    anfragen: ks.length,
    tester: ks.filter((k) => k.status === 'Testet').length,
    jahr: kaeufe.filter((k) => (k.kaufdatum || '').startsWith(jahr)).length,
    quote: ks.length ? Math.round((kaeufe.length / ks.length) * 100) : null,
    letzter: kaeufe.map((k) => k.kaufdatum).filter(Boolean).sort().pop() || null,
  };
}

async function zeigePartner(d) {
  const liste = d.partner
    .filter((p) => filterArt === 'Alle' || p.art === filterArt)
    .map((p) => ({ p, z: zahlenVon(p, d) }))
    .sort((a, b) => b.z.kaeufe.length - a.z.kaeufe.length || b.z.anfragen - a.z.anfragen);
  const direkt = d.kunden.filter((k) => !k.partner_id);
  const summe = (f) => liste.reduce((n, x) => n + f(x.z), 0);
  $('#inhalt').innerHTML = `
    <h1>Partner</h1>
    <p class="unter">Vertriebspartner, Influencer und Kunden, die mit eigenem Link empfehlen. Klick auf eine Zeile zeigt die Zahlen im Einzelnen.</p>
    <div class="zahlen">
      <div class="zahl"><b>${d.partner.filter((p) => p.aktiv).length}</b><span>aktive Partner</span></div>
      <div class="zahl"><b>${summe((z) => z.anfragen)}</b><span>Anfragen über Partner</span></div>
      <div class="zahl"><b>${summe((z) => z.kaeufe.length)}</b><span>Käufe über Partner</span></div>
      <div class="zahl"><b>${direkt.filter(gekauft).length}</b><span>Käufe direkt bei Daniel</span></div>
    </div>
    <div class="leiste">
      <select id="art" style="width:auto">${['Alle', ...ARTEN].map((x) => `<option ${x === filterArt ? 'selected' : ''}>${x}</option>`).join('')}</select>
      <span style="flex:1"></span>
      <button class="knopf" id="neu">Neuer Partner</button>
    </div>
    <div class="tabelle-huelle"><table>
      <tr><th>Name</th><th>Art</th><th>Link</th><th>Anfragen</th><th>Testen</th><th>Käufe</th><th>dieses Jahr</th><th>Quote</th><th>Letzter Kauf</th></tr>
      ${liste.map(({ p, z }) => `<tr class="klickbar" data-id="${p.id}">
        <td>${esc(name(p))}<div style="color:var(--leise);font-size:13px">${esc(p.ort || '')}${p.aktiv ? '' : ' · inaktiv'}</div></td>
        <td><span class="marker">${esc(p.art)}</span></td>
        <td><button class="knopf leise kopieren" data-link="${esc(LINK_BASIS + p.kurz)}" title="Link kopieren">${esc(LINK_BASIS + p.kurz)}</button></td>
        <td>${z.anfragen}</td><td>${z.tester}</td><td><b>${z.kaeufe.length}</b></td><td>${z.jahr}</td>
        <td>${z.quote === null ? '' : z.quote + ' %'}</td><td>${datum(z.letzter)}</td></tr>`).join('') || '<tr><td colspan="9" class="leer">Noch keine Partner.</td></tr>'}
    </table></div>`;
  $('#art').onchange = (e) => { filterArt = e.target.value; zeichnen(); };
  $('#neu').onclick = () => partnerBearbeiten({ art: 'Vertriebspartner', aktiv: true, seit: Daten.heute() }, d);
  document.querySelectorAll('.kopieren').forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      try { await navigator.clipboard.writeText('https://' + b.dataset.link); b.textContent = 'kopiert'; } catch (err) { b.textContent = 'https://' + b.dataset.link; }
      setTimeout(() => zeichnen(), 1500);
    };
  });
  document.querySelectorAll('tr.klickbar').forEach((tr) => { tr.onclick = () => partnerBearbeiten(d.partner.find((p) => p.id === tr.dataset.id), d); });
}

function partnerBearbeiten(p, d) {
  const z = p.id ? zahlenVon(p, d) : null;
  const vorschlag = (p.kurz || '');
  dialog(`<h2>${p.id ? esc(name(p)) : 'Neuer Partner'}</h2>
    ${z ? `<div class="zahlen" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
      <div class="zahl"><b>${z.anfragen}</b><span>Anfragen</span></div>
      <div class="zahl"><b>${z.tester}</b><span>testen</span></div>
      <div class="zahl"><b>${z.kaeufe.length}</b><span>Käufe</span></div>
      <div class="zahl"><b>${z.quote === null ? '' : z.quote + ' %'}</b><span>Quote</span></div></div>` : ''}
    <div class="formular">
      <label>Vorname<input name="vorname" required value="${esc(p.vorname)}"></label>
      <label>Nachname<input name="nachname" value="${esc(p.nachname)}"></label>
      <label>Art<select name="art">${ARTEN.map((x) => `<option ${x === p.art ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label>Ort<input name="ort" value="${esc(p.ort)}"></label>
      <label>Telefon<input name="telefon" value="${esc(p.telefon)}"></label>
      <label>E-Mail<input type="email" name="email" value="${esc(p.email)}"></label>
      <label class="breit">Link: ${esc(LINK_BASIS)}…<input name="kurz" required pattern="[a-z0-9\\-]{2,30}" title="nur Kleinbuchstaben, Zahlen und Bindestrich" value="${esc(vorschlag)}" placeholder="z. B. lena"></label>
      <label>Partner seit<input type="date" name="seit" value="${esc(p.seit)}"></label>
      <label>Aktiv<select name="aktiv"><option value="ja" ${p.aktiv !== false ? 'selected' : ''}>ja</option><option value="nein" ${p.aktiv === false ? 'selected' : ''}>nein</option></select></label>
      <label class="breit">Notiz<textarea name="notiz">${esc(p.notiz)}</textarea></label>
    </div>
    ${z && Object.keys(z.geraete).length ? `<div class="verlauf"><b>Verkaufte Geräte</b><br>${Object.entries(z.geraete).map(([g, n]) => `${esc(g)}: ${n}`).join('<br>')}</div>` : ''}
    ${z && z.ks.length ? `<div class="verlauf"><b>Kunden über diesen Link</b><br>${z.ks.map((k) => `${esc(name(k))}, ${esc(k.ort || '')}: ${esc(k.status)}${k.kaufdatum ? ' am ' + datum(k.kaufdatum) : ''}`).join('<br>')}</div>` : ''}`,
  p.id, async (w) => {
    w.kurz = w.kurz.trim().toLowerCase();
    if (d.partner.some((x) => x.kurz === w.kurz && x.id !== p.id)) { alert('Diesen Link gibt es schon. Bitte einen anderen wählen.'); return false; }
    await Daten.speichern('uk_partner', { ...p, ...w, aktiv: w.aktiv === 'ja', seit: w.seit || null });
  }, async () => Daten.loeschen('uk_partner', p.id));
  // Link aus dem Vornamen vorschlagen, solange noch nichts drinsteht
  const f = $('#dialog-form');
  if (!p.id) f.vorname.oninput = () => { f.kurz.value = f.vorname.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30); };
}

// ---------- Auswertung Fragebogen ----------
async function zeigeAuswertung(d) {
  const mittel = (dg, id) => {
    const w = d.fragebogen.filter((f) => f.durchgang === dg && Number.isFinite(f.antworten[id])).map((f) => f.antworten[id]);
    return w.length ? { m: w.reduce((a, b) => a + b, 0) / w.length, n: w.length } : null;
  };
  const zahl = (x) => (x ? x.m.toLocaleString('de-DE', { maximumFractionDigits: 1 }) : '');
  const anzahl = DURCHGAENGE.map((dg) => d.fragebogen.filter((f) => f.durchgang === dg.nr).length);
  const zeile = (f) => {
    const werte = DURCHGAENGE.map((dg) => mittel(dg.nr, f.id));
    const a = werte[0], e = [...werte].reverse().find(Boolean);
    let trend = '';
    if (a && e && e !== a) {
      const diff = e.m - a.m, gut = WENIGER_IST_GUT.includes(f.id) ? diff < 0 : diff > 0;
      trend = `<span class="marker ${gut ? 'gut' : 'warn'}">${diff > 0 ? '+' : ''}${diff.toLocaleString('de-DE', { maximumFractionDigits: 1 })}</span>`;
    }
    return `<tr><td>${esc(f.text)}</td>${werte.map((w) => `<td>${zahl(w)}</td>`).join('')}<td>${trend}</td></tr>`;
  };
  const tabelle = (titel, liste) => `<h2 style="margin-top:22px">${titel}</h2><div class="tabelle-huelle"><table>
    <tr><th>Frage</th>${DURCHGAENGE.map((dg) => `<th>${esc(dg.kurz)}</th>`).join('')}<th>Veränderung</th></tr>${liste.map(zeile).join('')}</table></div>`;
  const skalen = FRAGEN.filter((f) => f.typ === 'skala'), zahlen = FRAGEN.filter((f) => f.typ === 'zahl');
  const zaehle = (id, k) => d.fragebogen.filter((f) => (f.antworten[id] || []).includes(k)).length;
  const nutzung = FRAGEN.filter((f) => f.typ === 'mehrfach');
  const neuLink = new URL('../fragebogen/', location.href).href;
  const kaeufe = d.kunden.filter((k) => gekauft(k) && k.kaufdatum).sort((a, b) => b.kaufdatum.localeCompare(a.kaufdatum));
  const gruppe = (fn) => Object.entries(kaeufe.reduce((m, k) => { const g = fn(k); m[g] = (m[g] || 0) + 1; return m; }, {})).sort((a, b) => b[0].localeCompare(a[0]));
  const monate = gruppe((k) => k.kaufdatum.slice(0, 7)).slice(0, 12);
  const geraete = gruppe((k) => k.geraet || 'Gerät offen');
  const ueber = gruppe((k) => (k.partner_id ? name(d.partnerVon(k.partner_id)) : 'direkt bei Daniel'));
  const monatName = (m) => new Date(m + '-15T12:00:00').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const liste = (paare, f = (x) => x) => paare.map(([t, n]) => `<div class="zeile"><div class="haupt">${esc(f(t))}</div><span class="marker">${n}</span></div>`).join('') || '<p class="leer">Noch keine Käufe.</p>';
  const unterwegs = d.maschinen.filter((m) => m.status === 'Beim Kunden').length;
  $('#inhalt').innerHTML = `
    <h1>Auswertung</h1>
    <p class="unter">Verkäufe, Testgeräte und Fragebogen auf einen Blick.</p>
    <div class="zahlen">
      <div class="zahl"><b>${unterwegs} / ${d.maschinen.length}</b><span>Testgeräte beim Kunden</span></div>
      <div class="zahl"><b>${d.kunden.filter((k) => k.status === 'Interessent' || k.status === 'Testet' || k.status === 'Kaufabsicht').length}</b><span>Interessenten und Tester</span></div>
      <div class="zahl"><b>${kaeufe.filter((k) => tageBis(k.kaufdatum) >= -30).length}</b><span>Käufe in den letzten 30 Tagen</span></div>
      <div class="zahl"><b>${kaeufe.length}</b><span>Käufe gesamt</span></div>
    </div>
    <div class="raster">
      <section class="feld"><h2>Käufe je Monat</h2>${liste(monate, monatName)}</section>
      <section class="feld"><h2>Käufe je Gerät</h2>${liste(geraete)}</section>
      <section class="feld"><h2>Käufe je Empfehlung</h2>${liste(ueber)}</section>
      <section class="feld"><h2>Provisionen</h2><p class="leer">Folgt, sobald die Provisionssätze je Gerät feststehen. Die Zahlen links sind dann die Grundlage.</p></section>
    </div>
    <h2 style="margin-top:28px">Fragebogen</h2>
    <p class="unter">Durchschnitt über alle Kunden, je Durchgang. Skala 1 bis 10, 10 ist die gute Seite. Nur für die Betreuung, nie als Beleg in der Werbung.</p>
    <div class="zahlen">${DURCHGAENGE.map((dg, i) => `<div class="zahl"><b>${anzahl[i]}</b><span>ausgefüllt ${esc(dg.kurz)}</span></div>`).join('')}</div>
    <div class="leiste"><button class="knopf leise" id="fb-neu" data-link="${esc(neuLink)}">Link für neue Tester kopieren</button><span class="leer">Für Tester, die noch nicht im Dashboard stehen. Sie werden beim Ausfüllen angelegt.</span></div>
    ${tabelle('Einschätzungen', skalen)}
    ${tabelle('Zahlen', zahlen)}
    <h2 style="margin-top:22px">Nutzung</h2>
    <div class="raster">${nutzung.map((f) => `<section class="feld"><h2>${esc(f.text)}</h2>${f.optionen.map(([k, t]) => `<div class="zeile"><div class="haupt">${esc(t)}</div><span class="marker">${zaehle(f.id, k)}</span></div>`).join('')}</section>`).join('')}</div>`;
  $('#fb-neu').onclick = async (e) => { const b = e.target; try { await navigator.clipboard.writeText(b.dataset.link); b.textContent = 'kopiert'; } catch (err) { b.textContent = b.dataset.link; } };
}

// ---------- Wohnung (Retreat Wasen) ----------
// Je Raum die Bilder aus der Präsentation und eine Einkaufsliste zum Abhaken (11.10.2026).
// Haken heißt gekauft. Unten in jedem Raum lässt sich sofort etwas dazuschreiben.
const WOHNUNG_STATUS = ['Idee', 'Kaufen', 'Bestellt', 'Gekauft'];
const RAEUME = [
  { name: 'Wohnzimmer', bilder: ['Wohnzimmer-1', 'Wohnzimmer-2', 'Wohnzimmer-3'] },
  { name: 'Küche', bilder: ['Kueche-1', 'Kueche-2', 'Kueche-3', 'Kueche-4', 'Kueche-5', 'Kueche-6'] },
  { name: 'Bad', bilder: ['Bad-1', 'Bad-2', 'Bad-3', 'Bad-4'] },
  { name: 'Schlafzimmer', bilder: ['Schlafzimmer-1', 'Schlafzimmer-2', 'Schlafzimmer-3'] },
  { name: 'Behandlungsraum', bilder: ['Behandlungsraum-1', 'Behandlungsraum-2'] },
  { name: 'Flur', bilder: [] },
  { name: 'Allgemein', bilder: [] },
];
const WOHNUNG_BEREICHE = RAEUME.map((r) => r.name);
// Ausgaben: preis = bezahlt für die ganze Zeile, originalpreis = regulär für die ganze Zeile (19.10.2026)
const ausgegeben = (x) => ['Gekauft', 'Bestellt'].includes(x.status) && x.preis != null;
const ersparnis = (x) => (ausgegeben(x) && x.originalpreis != null ? Math.max(0, Number(x.originalpreis) - Number(x.preis)) : 0);
// Euro wie in Deutschland (1.234,50 €), Franken wie in der Schweiz (CHF 1'234.50)
const betrag = (n, w) => (w === 'CHF' ? 'CHF ' + Number(n).toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Number(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €');
// Summen getrennt nach Währung, damit Euro und Franken nicht vermischt werden
function summen(liste) {
  const s = {};
  liste.filter(ausgegeben).forEach((x) => {
    const w = x.waehrung || 'EUR';
    s[w] = s[w] || { aus: 0, gespart: 0, regulaer: 0 };
    s[w].aus += Number(x.preis); s[w].gespart += ersparnis(x); s[w].regulaer += Number(x.originalpreis ?? x.preis);
  });
  return s;
}
const summenText = (s, art) => Object.entries(s).filter(([, v]) => v[art] > 0).map(([w, v]) => betrag(v[art], w)).join(' + ');
async function zeigeWohnung(d) {
  const w = d.wohnung || [];
  const offen = w.filter((x) => !['Gekauft', 'Bestellt'].includes(x.status)).length;
  const gesamt = summen(w);
  const prozent = Object.values(gesamt).reduce((a, v) => a + v.regulaer, 0) ? Math.round(Object.values(gesamt).reduce((a, v) => a + v.gespart, 0) / Object.values(gesamt).reduce((a, v) => a + v.regulaer, 0) * 100) : 0;
  const schnaeppchen = w.filter((x) => ersparnis(x) > 0).sort((a, b) => ersparnis(b) - ersparnis(a)).slice(0, 5);
  // Räume aus älteren Einträgen, die es in der Liste oben nicht gibt, hinten anhängen
  const raeume = [...RAEUME, ...[...new Set(w.map((x) => x.bereich))].filter((b) => b && !WOHNUNG_BEREICHE.includes(b)).map((b) => ({ name: b, bilder: [] }))];
  const zeile = (x) => `<div class="einkauf ${x.status === 'Gekauft' ? 'gekauft' : ''}" data-id="${x.id}">
      <input type="checkbox" ${x.status === 'Gekauft' ? 'checked' : ''} aria-label="gekauft">
      <div class="haupt">${x.menge > 1 ? x.menge + ' × ' : ''}${esc(x.was)}${x.status === 'Idee' ? ' <span class="marker">Idee</span>' : ''}${x.status === 'Bestellt' ? ' <span class="marker warn">Bestellt</span>' : ''}
        <div class="klein">${esc([x.wo, x.notiz].filter(Boolean).join(' · '))}</div></div>
      ${x.preis != null ? `<div class="preis">${betrag(x.preis, x.waehrung)}${ersparnis(x) ? `<small>statt ${betrag(x.originalpreis, x.waehrung)} · ${betrag(ersparnis(x), x.waehrung)} gespart</small>` : ''}</div>` : ''}
      ${x.beleg_pfad ? `<button class="knopf leise klein-knopf" data-beleg="${x.id}" title="Quittung ansehen">Quittung</button>` : ''}
    </div>`;
  $('#inhalt').innerHTML = `
    <h1>Wohnung</h1><p class="unter">Retreat Wasen: so kann es in jedem Raum aussehen, was dafür gebraucht wird und was es gekostet hat. Haken setzen heißt gekauft. Klick auf einen Eintrag öffnet ihn mit Preis, Originalpreis, Laden und Quittung.</p>
    <div class="zahlen">
      <div class="zahl"><b>${offen}</b><span>noch zu besorgen</span></div>
      <div class="zahl"><b>${summenText(gesamt, 'aus') || '0,00 €'}</b><span>ausgegeben</span></div>
      <div class="zahl gespart"><b>${summenText(gesamt, 'gespart') || '0,00 €'}</b><span>gespart${prozent ? ' · ' + prozent + ' % unter dem regulären Preis' : ''}</span></div>
    </div>
    ${schnaeppchen.length ? `<section class="schnaeppchen"><h2>Unsere Schnäppchen</h2>${schnaeppchen.map((x) => `<div><span>${x.menge > 1 ? x.menge + ' × ' : ''}${esc(x.was)}</span><b>${betrag(ersparnis(x), x.waehrung)} gespart</b></div>`).join('')}</section>` : ''}
    ${raeume.map((r) => { const liste = w.filter((x) => x.bereich === r.name).sort((x, y) => (x.status === 'Gekauft') - (y.status === 'Gekauft') || WOHNUNG_STATUS.indexOf(x.status) - WOHNUNG_STATUS.indexOf(y.status));
      const s = summen(liste);
      return `<section class="raum">
      <h2>${esc(r.name)} <span>${liste.filter((x) => !['Gekauft', 'Bestellt'].includes(x.status)).length} offen${summenText(s, 'aus') ? ' · ' + summenText(s, 'aus') + ' ausgegeben' : ''}${summenText(s, 'gespart') ? ' · ' + summenText(s, 'gespart') + ' gespart' : ''}</span></h2>
      ${r.bilder.length ? `<div class="raum-bilder">${r.bilder.map((b) => `<a href="wohnung/${b}.jpg" target="_blank" rel="noopener"><img src="wohnung/${b}.jpg" alt="${esc(r.name)}, Entwurf" loading="lazy"></a>`).join('')}</div>` : ''}
      <div class="einkaufsliste">${liste.map(zeile).join('')}
        <form class="dazu" data-raum="${esc(r.name)}"><input name="was" placeholder="Was wird hier noch gebraucht?" autocomplete="off"><button class="knopf leise">Dazu</button></form></div>
    </section>`; }).join('')}`;
  document.querySelectorAll('.einkauf').forEach((el) => {
    const x = w.find((y) => y.id === el.dataset.id);
    el.querySelector('input').onclick = async (e) => { e.stopPropagation(); await Daten.speichern('uk_wohnung', { id: x.id, status: e.target.checked ? 'Gekauft' : 'Kaufen', gekauft_am: e.target.checked ? (x.gekauft_am || Daten.heute()) : x.gekauft_am }); zeichnen(); };
    el.onclick = () => wohnungBearbeiten(x);
  });
  document.querySelectorAll('[data-beleg]').forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const x = w.find((y) => y.id === b.dataset.beleg);
      const fenster = window.open('', '_blank');
      try { fenster.location = await Daten.dateiLink(x.beleg_pfad, null, true); } catch (err) { fenster.close(); alert('Quittung öffnen hat nicht geklappt: ' + (err.message || err)); }
    };
  });
  document.querySelectorAll('form.dazu').forEach((f) => {
    f.onsubmit = async (e) => {
      e.preventDefault();
      const was = f.was.value.trim();
      if (!was) return;
      await Daten.speichern('uk_wohnung', { bereich: f.dataset.raum, was, status: 'Kaufen', wo: 'Deutschland' });
      await zeichnen();
      const neu = document.querySelector(`form.dazu[data-raum="${CSS.escape(f.dataset.raum)}"] input`);
      if (neu) neu.focus();
    };
  });
}
function wohnungBearbeiten(x) {
  let beleg = { beleg_pfad: x.beleg_pfad || null, beleg_name: x.beleg_name || null };
  dialog(`<h2>${x.id ? esc(x.was) : 'Neuer Eintrag'}</h2>
    <div class="formular">
      <label class="breit">Was<input name="was" required value="${esc(x.was)}"></label>
      <label>Bereich<select name="bereich">${[...new Set([...WOHNUNG_BEREICHE, x.bereich])].map((b) => `<option ${b === x.bereich ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select></label>
      <label>Status<select name="status">${WOHNUNG_STATUS.map((st) => `<option ${st === x.status ? 'selected' : ''}>${st}</option>`).join('')}</select></label>
      <label>Stück<input name="menge" type="number" min="1" step="1" value="${esc(x.menge || 1)}"></label>
      <label>Währung<select name="waehrung">${['EUR', 'CHF'].map((c) => `<option ${c === (x.waehrung || 'EUR') ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      <label>Bezahlt (alle Stück zusammen)<input name="preis" type="number" step="0.05" min="0" value="${esc(x.preis)}"></label>
      <label>Regulärer Preis (alle Stück zusammen)<input name="originalpreis" type="number" step="0.05" min="0" value="${esc(x.originalpreis)}"></label>
      <label>Wo gekauft<input name="wo" value="${esc(x.wo)}"></label>
      <label>Gekauft am<input name="gekauft_am" type="date" value="${esc(x.gekauft_am)}"></label>
      <label class="breit">Link<input name="link" type="url" value="${esc(x.link)}"></label>
      <label class="breit">Notiz<textarea name="notiz">${esc(x.notiz)}</textarea></label>
      <div class="breit beleg-feld"><span id="beleg-name">${x.beleg_name ? 'Quittung: ' + esc(x.beleg_name) : 'Noch keine Quittung'}</span>
        <label class="knopf leise klein-knopf" style="cursor:pointer">Quittung hochladen<input type="file" id="beleg-datei" accept="image/*,application/pdf" hidden></label></div>
    </div>${x.link ? `<p><a href="${esc(x.link)}" target="_blank" rel="noopener">Link öffnen</a></p>` : ''}`,
  x.id, async (v) => {
    if (!v.was.trim()) return false;
    const zahl = (z) => (z === '' || z == null ? null : Number(z));
    await Daten.speichern('uk_wohnung', { ...x, ...v, ...beleg, menge: Number(v.menge) || 1, preis: zahl(v.preis), originalpreis: zahl(v.originalpreis), gekauft_am: v.gekauft_am || null });
  }, async () => Daten.loeschen('uk_wohnung', x.id));
  // Quittung sofort hochladen, gespeichert wird sie mit dem Eintrag
  const feld = document.querySelector('#beleg-datei');
  if (feld) feld.onchange = async () => {
    const f = feld.files[0]; if (!f) return;
    const anzeige = document.querySelector('#beleg-name'); anzeige.textContent = 'Lädt hoch ...';
    try { const r = await Daten.dateiHochladen(f); beleg = { beleg_pfad: r.pfad, beleg_name: f.name }; anzeige.textContent = 'Quittung: ' + f.name + ' (wird beim Speichern übernommen)'; }
    catch (err) { anzeige.textContent = 'Hochladen hat nicht geklappt: ' + (err.message || err); }
  };
}

// ---------- Bestellungen: Kunde bestellt, Daniel ordnet zu, der Vertrag füllt sich selbst aus ----------
// Feste Regel (Jasmin 19.10.2026): Vor jedem Vertrag entscheidet Daniel IMMER selbst,
// wem das Gerät zugeordnet wird (Daniel, Ursprungskraft GmbH, Jasmin) und in welche Linie.
// Die Formulare werden hier im Browser mit pdf-lib ausgefüllt, kein Rechner muss dafür laufen.
const SPONSOR_NAMEN = { daniel: 'Daniel Zürcher', gmbh: 'Ursprungskraft GmbH', jasmin: 'Jasmin Groth' };
const BESTELL_STATUS = ['Neu', 'Vertrag fertig', 'An Enagic geschickt', 'Storniert'];
const LAND_EN = { CH: 'Switzerland', DE: 'Germany', AT: 'Austria', LI: 'Liechtenstein', IT: 'Italy', FR: 'France', NL: 'Netherlands', BE: 'Belgium', LU: 'Luxembourg', ES: 'Spain', NO: 'Norway', GB: 'United Kingdom' };
const versandVon = (land) => (land === 'DE' ? 12 : ['CH', 'LI', 'NO', 'GB'].includes(land) ? 57 : 44);
const datumDE = (t) => (t ? t.split('-').reverse().join('.') : '');
const bName = (b) => [b.daten.vorname, b.daten.nachname].filter(Boolean).join(' ');

async function zeigeBestellungen(d) {
  const liste = [...d.bestellungen].sort((a, b) => String(b.erstellt).localeCompare(String(a.erstellt)));
  const offen = liste.filter((b) => b.status === 'Neu').length;
  $('#inhalt').innerHTML = `
    <h1>Bestellungen</h1><p class="unter">Bestellungen über die Bestellseite. Bei jeder neuen legst du zuerst fest, wem das Gerät zugeordnet wird und in welche Linie. Danach füllt sich der Vertrag für Enagic von selbst aus.</p>
    <div class="leiste"><span class="marker ${offen ? 'warn' : ''}">${offen} warten auf Zuordnung</span><span style="flex:1"></span>
      <button class="knopf leise" id="bestell-link">Link zur Bestellseite kopieren</button></div>
    ${liste.map((b) => `<div class="unterlage bestellung" data-id="${b.id}">
        <span class="u-art ${b.status === 'Neu' ? 'zugang' : 'datei'}">${esc(b.status)}</span>
        <div class="haupt">${esc(bName(b))}${b.daten.firma ? ' · ' + esc(b.daten.firma) : ''}
          <div class="klein">${esc([[b.daten.plz, b.daten.ort].filter(Boolean).join(' '), b.daten.land, b.daten.als, b.daten.zahlung === 'raten' ? b.daten.raten_anzahl + ' Raten' : 'Überweisung', 'bestellt ' + datumDE(String(b.erstellt).slice(0, 10)), b.sponsor ? 'für ' + SPONSOR_NAMEN[b.sponsor] + ', Linie ' + b.linie : 'noch nicht zugeordnet'].filter(Boolean).join(' · '))}</div></div>
      </div>`).join('') || '<p class="leer">Noch keine Bestellungen. Schick Kunden den Link zur Bestellseite, dann landen sie hier.</p>'}`;
  $('#bestell-link').onclick = async (e) => {
    const link = location.origin + '/bestellen/' + (ich.rolle === 'admin' ? '?von=jasmin' : '');
    try { await navigator.clipboard.writeText(link); e.target.textContent = 'Kopiert'; } catch (err) { prompt('Link zur Bestellseite:', link); }
    setTimeout(() => { e.target.textContent = 'Link zur Bestellseite kopieren'; }, 2000);
  };
  document.querySelectorAll('.bestellung').forEach((el) => { el.onclick = () => bestellungBearbeiten(d.bestellungen.find((b) => b.id === el.dataset.id)); });
}

async function bestellungBearbeiten(b) {
  const dt = b.daten, a = b.angaben || {};
  // Verkäufer: Daniel, GmbH, Jasmin und alle weiteren Partner, die als sponsor_... hinterlegt sind
  let sponsoren = {};
  try { sponsoren = await Daten.sponsoren(); } catch (e) { /* dann die festen drei */ }
  const auswahl = { ...SPONSOR_NAMEN, ...Object.fromEntries(Object.entries(sponsoren).map(([k, v]) => [k, v.name || k])) };
  const versand = a.versand ?? versandVon(dt.land_kurz);
  const zeile = (t, w) => (w ? `<div><span>${t}</span><b>${esc(w)}</b></div>` : '');
  dialog(`<h2>Bestellung ${esc(bName(b))}</h2>
    <div class="bestell-daten">
      ${zeile('Als', dt.als)}${zeile('Geburtsdatum', datumDE(dt.geburtsdatum))}${zeile('Adresse', [dt.strasse, [dt.plz, dt.ort].join(' '), dt.land].join(', '))}
      ${zeile('Handy', dt.handy)}${zeile('Telefon', dt.telefon)}${zeile('E-Mail', dt.email)}${zeile('Firma', dt.firma)}${zeile('Lieferadresse', [dt.liefer_name, dt.liefer_adresse].filter(Boolean).join(', '))}
      ${zeile('Zahlung', dt.zahlung === 'raten' ? `${dt.raten_anzahl} Raten${dt.monatsrate ? ' zu ' + dt.monatsrate + ' €' : ''}${dt.anzahlung ? ', Anzahlung ' + dt.anzahlung + ' €' : ''}, Abbuchung am ${dt.zahltag}., IBAN ${dt.iban}` : 'Überweisung')}
      ${zeile('Über den Link von', b.von)}
      <div class="bestell-dateien">${Object.entries(b.dateien || {}).map(([k, p]) => `<button type="button" class="knopf leise klein-knopf" data-datei="${esc(p)}">${{ unterschrift: 'Unterschrift', ausweis_vorne: 'Ausweis vorne', ausweis_hinten: 'Ausweis hinten', zahlungsbeleg: 'Zahlungsbeleg' }[k] || k}</button>`).join('')}
        <label class="knopf leise klein-knopf" style="cursor:pointer">Zahlungsbeleg hochladen<input type="file" id="beleg-hoch" accept="image/*,application/pdf" hidden></label></div>
    </div>
    <h3 style="margin:16px 0 6px">1. Zuordnung${b.von === 'jasmin' ? ' (kam über Jasmins Link, läuft über Jasmin)' : ' (entscheidet Daniel jedes Mal selbst)'}</h3>
    <div class="formular">
      <label>Über wen läuft der Verkauf?<select name="sponsor" required><option value="">bitte wählen</option>${Object.entries(auswahl).map(([k, n]) => `<option value="${k}" ${k === b.sponsor ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
      <label>Neukunde in Linie [ ] A<input name="linie" required value="${esc(b.linie || '')}" placeholder="z. B. 2"></label>
    </div>
    <h3 style="margin:16px 0 6px">2. Beträge fürs Formular (bitte prüfen)</h3>
    <div class="formular">
      <label>Preis (EUR)<input name="preis" type="number" step="1" value="${esc(a.preis ?? 4600)}"></label>
      <label>MwSt (EUR, leer wenn keine)<input name="mwst" type="number" step="0.01" value="${esc(a.mwst ?? (dt.land_kurz === 'DE' ? 874 : ''))}"></label>
      <label>Versand (EUR)<input name="versand" type="number" step="1" value="${esc(versand)}"></label>
      <label>Garantie-Erweiterung (optional)<input name="garantie" type="number" step="1" value="${esc(a.garantie ?? '')}"></label>
      ${dt.zahlung === 'raten' ? `<label>Anzahlung (EUR)<input name="anzahlung" type="number" step="1" value="${esc(a.anzahlung ?? dt.anzahlung ?? '')}"></label>
      <label>Raten ab (Monat)<input name="anfang" value="${esc(a.anfang ?? '')}" placeholder="z. B. 12/2026"></label>
      <label>Raten bis (Monat)<input name="ende" value="${esc(a.ende ?? '')}" placeholder="z. B. 11/2027"></label>` : ''}
      <label>Status<select name="status">${BESTELL_STATUS.map((s) => `<option ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
    </div>
    <p class="leer" id="summe"></p>
    <h3 style="margin:16px 0 6px">3. Unterschrift des Sponsors</h3>
    <div class="sponsor-pad"><canvas id="sponsor-pad"></canvas><span>hier unterschreiben, sonst wird die zuletzt gespeicherte genommen</span></div>
    <div class="leiste" style="margin-top:12px"><button type="button" class="knopf" id="vertrag-machen">Vertrag erstellen</button><span id="vertrag-status" class="leer"></span></div>
    <div id="vertrag-fertig">${(b.pdfs || []).length ? mailBlock(b) : ''}</div>`,
  false, async (w) => {
    await Daten.speichern('uk_bestellungen', { id: b.id, sponsor: w.sponsor || null, linie: w.linie || null, status: w.status, angaben: bAngaben(w) });
  });
  const form = $('#dialog-form');
  const summe = () => { const w = Object.fromEntries(new FormData(form).entries()); const s = ['preis', 'mwst', 'versand', 'garantie'].reduce((x, k) => x + (Number(w[k]) || 0), 0); $('#summe').textContent = 'Gesamt im Formular: ' + s.toLocaleString('de-DE') + ' EUR'; };
  form.addEventListener('input', summe); summe();
  form.querySelectorAll('[data-datei]').forEach((k) => { k.onclick = async () => window.open(await Daten.bestellLink(k.dataset.datei, true), '_blank'); });
  $('#beleg-hoch').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const pfad = await Daten.bestellHochladen(`${b.id}/zahlungsbeleg${(f.name.match(/\.[a-z0-9]+$/i) || ['.pdf'])[0].toLowerCase()}`, f);
    b.dateien = { ...(b.dateien || {}), zahlungsbeleg: pfad };
    await Daten.speichern('uk_bestellungen', { id: b.id, dateien: b.dateien });
    e.target.closest('label').firstChild.textContent = '✓ Zahlungsbeleg gespeichert';
  };
  const pad = padEinrichten($('#sponsor-pad'));
  $('#vertrag-machen').onclick = async () => {
    const w = Object.fromEntries(new FormData(form).entries());
    const st = $('#vertrag-status');
    if (!w.sponsor || !String(w.linie).trim()) { st.textContent = 'Bitte zuerst festlegen, wem das Gerät zugeordnet wird und in welche Linie.'; return; }
    st.textContent = 'Wird erstellt ...';
    try {
      const sponsoren = await Daten.sponsoren();
      const sp = sponsoren[w.sponsor] || { name: SPONSOR_NAMEN[w.sponsor] };
      if (!sp.id) st.textContent = 'Hinweis: Für ' + SPONSOR_NAMEN[w.sponsor] + ' ist noch keine Enagic-ID hinterlegt, das Feld bleibt leer. ';
      let sig = pad.leer() ? null : await pad.blob();
      const sigPfad = `sponsor/${w.sponsor}.png`;
      if (sig) await Daten.bestellHochladen(sigPfad, sig, 'image/png');
      else { try { sig = await Daten.bestellDatei(sigPfad); } catch (e) { sig = null; } }
      const angaben = bAngaben(w);
      const pdfs = await vertragErstellen(b, sp, w.linie.trim(), angaben, sig);
      b.sponsor = w.sponsor; b.linie = w.linie.trim(); b.angaben = angaben; b.pdfs = pdfs; b.status = 'Vertrag fertig';
      await Daten.speichern('uk_bestellungen', { id: b.id, sponsor: b.sponsor, linie: b.linie, angaben, pdfs, status: b.status });
      form.querySelector('[name=status]').value = b.status;
      $('#vertrag-fertig').innerHTML = mailBlock(b, sp);
      mailKnoepfe(b);
      st.textContent = (st.textContent.startsWith('Hinweis') ? st.textContent : '') + 'Fertig.';
    } catch (err) { st.textContent = 'Das hat nicht geklappt: ' + (err.message || err); }
  };
  if ((b.pdfs || []).length) mailKnoepfe(b);
}
function bAngaben(w) {
  const z = (x) => (x === '' || x == null ? null : Number(x));
  return { preis: z(w.preis), mwst: z(w.mwst), versand: z(w.versand), garantie: z(w.garantie), anzahlung: z(w.anzahlung), anfang: w.anfang || null, ende: w.ende || null };
}
// Fertige Unterlagen und die Mail an Enagic wie in Daniels Vorlage
function mailText(b, sp) {
  const an = ['Bestellformular LeveLuk K8', ...(b.daten.zahlung === 'raten' ? ['Ratenzahlungsantrag'] : []), ...(b.dateien.ausweis_vorne ? ['ID Front', 'ID Back'] : []), ...(b.dateien.zahlungsbeleg ? ['Zahlungsbeleg'] : [])];
  return `Hello Enagic Team,\n\nNEW Sale Leveluk K8 from ${LAND_EN[b.daten.land_kurz] || b.daten.land}\n\nSponsor ID: ${(sp && sp.id) || ''}\nSponsor: ${(sp && sp.name) || SPONSOR_NAMEN[b.sponsor]}\n\nSponsor Line ${b.linie} A\n\nAttached:\n${an.join('\n')}\n`;
}
function mailBlock(b, sp) {
  return `<h3 style="margin:16px 0 6px">4. An Enagic schicken</h3>
    <div class="bestell-dateien">${(b.pdfs || []).map((p) => `<button type="button" class="knopf leise klein-knopf" data-datei="${esc(p.pfad)}" data-laden="1">${esc(p.name)}</button>`).join('')}
      ${Object.entries(b.dateien || {}).filter(([k]) => k !== 'unterschrift').map(([k, p]) => `<button type="button" class="knopf leise klein-knopf" data-datei="${esc(p)}" data-laden="1">${{ ausweis_vorne: 'ID Front', ausweis_hinten: 'ID Back', zahlungsbeleg: 'Zahlungsbeleg' }[k] || k}</button>`).join('')}</div>
    <p class="leer">An: goc.eu@enagic.com · Betreff: NEW Sale Leveluk K8 from ${esc(LAND_EN[b.daten.land_kurz] || b.daten.land)}</p>
    <textarea id="mail-text" rows="11" style="width:100%">${esc(mailText(b, sp))}</textarea>
    <div class="leiste" style="margin-top:8px"><button type="button" class="knopf leise" id="mail-kopieren">Text kopieren</button><a class="knopf leise" id="mail-oeffnen" href="#">Mail öffnen</a><button type="button" class="knopf" id="als-geschickt">Als an Enagic geschickt markieren</button></div>
    <p class="leer">Die Anhänge oben herunterladen und an die Mail hängen. Das automatische Verschicken kommt, sobald der Mailversand eingerichtet ist.</p>`;
}
function mailKnoepfe(b) {
  document.querySelectorAll('#vertrag-fertig [data-datei]').forEach((k) => { k.onclick = async () => window.open(await Daten.bestellLink(k.dataset.datei, false), '_blank'); });
  const text = () => $('#mail-text').value;
  $('#mail-kopieren').onclick = async (e) => { try { await navigator.clipboard.writeText(text()); e.target.textContent = 'Kopiert'; } catch (err) { /* Feld ist markierbar */ } };
  $('#mail-oeffnen').href = 'mailto:goc.eu@enagic.com?subject=' + encodeURIComponent('NEW Sale Leveluk K8 from ' + (LAND_EN[b.daten.land_kurz] || b.daten.land)) + '&body=' + encodeURIComponent(text());
  $('#als-geschickt').onclick = async (e) => { await Daten.speichern('uk_bestellungen', { id: b.id, status: 'An Enagic geschickt' }); b.status = 'An Enagic geschickt'; $('#dialog-form [name=status]').value = b.status; e.target.textContent = 'Gespeichert'; };
}

// Unterschriftsfeld (auch für Daniel am Handy)
function padEinrichten(c) {
  const ctx = c.getContext('2d'); let leer = true, an = false, p0 = null;
  const r = c.getBoundingClientRect(), f = window.devicePixelRatio || 1;
  c.width = r.width * f; c.height = r.height * f; ctx.scale(f, f); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = '#1F2A44';
  const pt = (e) => { const q = c.getBoundingClientRect(); return { x: e.clientX - q.left, y: e.clientY - q.top }; };
  c.onpointerdown = (e) => { an = true; p0 = pt(e); c.setPointerCapture(e.pointerId); };
  c.onpointermove = (e) => { if (!an) return; const p = pt(e); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p.x, p.y); ctx.stroke(); p0 = p; leer = false; };
  c.onpointerup = c.onpointerleave = () => { an = false; };
  return { leer: () => leer, blob: () => new Promise((ok) => c.toBlob(ok, 'image/png')) };
}

// ---------- Formulare ausfüllen (pdf-lib, im Browser) ----------
let pdfLibLaden = null;
function pdfLib() {
  if (!pdfLibLaden) pdfLibLaden = new Promise((ok, fehler) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'; s.onload = () => ok(window.PDFLib); s.onerror = fehler; document.head.appendChild(s); });
  return pdfLibLaden;
}
async function vertragErstellen(b, sp, linie, a, sponsorSig) {
  const { PDFDocument, StandardFonts, rgb } = await pdfLib();
  const dt = b.daten, heute = Daten.heute(), heuteDE = datumDE(heute);
  const laden = async (n) => PDFDocument.load(await (await fetch('formulare/' + n)).arrayBuffer());
  const kundeSig = await Daten.bestellDatei(b.dateien.unterschrift);
  const bild = async (doc, blob) => (blob ? doc.embedPng(await blob.arrayBuffer()) : null);
  // Unterschrift in ein Kästchen setzen (Koordinaten von oben links gemessen, wie im Formular)
  const zeichne = (doc, seite, img, x, yOben, w, h) => {
    if (!img) return; const s = Math.min(w / img.width, h / img.height), H = seite.getHeight();
    seite.drawImage(img, { x, y: H - yOben - h + (h - img.height * s) / 2, width: img.width * s, height: img.height * s });
  };
  const text = (seite, font, t, x, yGrund, gr = 10) => { if (t) seite.drawText(String(t), { x, y: seite.getHeight() - yGrund, size: gr, font, color: rgb(0.12, 0.16, 0.27) }); };
  const setze = (form, name, wert) => { try { if (wert != null && wert !== '') form.getTextField(name).setText(String(wert)); } catch (e) { /* Feld fehlt */ } };
  const haken = (form, name) => { try { form.getCheckBox(name).check(); } catch (e) { /* Feld fehlt */ } };
  const radio = (form, name, wert) => { try { const g = form.getRadioGroup(name); const o = g.getOptions().find((x) => x === wert || x.includes(wert)); if (o) g.select(o); } catch (e) { /* Feld fehlt */ } };
  const name = [dt.vorname, dt.nachname].join(' ') + (dt.firma ? ' / ' + dt.firma : '');
  const geb = datumDE(dt.geburtsdatum);
  const summe = ['preis', 'mwst', 'versand', 'garantie'].reduce((x, k) => x + (Number(a[k]) || 0), 0);
  const eur = (n) => (n == null || n === '' ? '' : Number(n).toLocaleString('de-DE') + ' €');
  const ergebnis = await PDFDocument.create();
  const fontE = await ergebnis.embedFont(StandardFonts.Helvetica);

  // Distributorenvertrag Seite 2 (nur als Distributor)
  if (dt.als === 'Distributor') {
    const doc = await laden('distributorenvertrag.pdf'), f = doc.getForm();
    setze(f, 'Nachname', dt.nachname); setze(f, 'Vornamen', dt.vorname); setze(f, 'Tel', dt.telefon); setze(f, 'MobilTel', dt.handy);
    const [j, m, t] = (dt.geburtsdatum || '').split('-'); setze(f, 'Geburtstag', t); setze(f, 'undefined', m); setze(f, 'undefined_2', j);
    setze(f, 'EmailAdresse', dt.email); setze(f, 'Name des Unternehmens', dt.firma); setze(f, 'Innergemeinschaftliche MwStNummer', dt.ustid);
    setze(f, 'Ort', dt.ort); setze(f, 'Datum', heuteDE);
    if (dt.anrede === 'Herr') radio(f, 'Group1', 'Choice1'); if (dt.anrede === 'Frau') radio(f, 'Group1', 'Choice2');
    zeichne(doc, doc.getPage(1), await bild(doc, kundeSig), 430, 646, 112, 34);
    f.flatten();
    const [s] = await ergebnis.copyPages(doc, [1]); ergebnis.addPage(s);
  }
  // Zusatz Nicht-EU (Schweiz, Liechtenstein, Norwegen, Vereinigtes Königreich)
  if (dt.nicht_eu) {
    const doc = await laden('non-eu.pdf'), s0 = doc.getPage(0), font = await doc.embedFont(StandardFonts.Helvetica);
    text(s0, font, [dt.vorname, dt.nachname].join(' '), 40, 652, 10); text(s0, font, heuteDE, 185, 652, 10);
    zeichne(doc, s0, await bild(doc, kundeSig), 300, 612, 140, 42);
    const [s] = await ergebnis.copyPages(doc, [0]); ergebnis.addPage(s);
  }
  // Produktbestellformular
  {
    const doc = await laden('bestellformular.pdf'), f = doc.getForm(), s0 = doc.getPage(0), font = await doc.embedFont(StandardFonts.Helvetica);
    haken(f, dt.als === 'Distributor' ? 'Check Box12.1' : 'Check Box12.0');
    setze(f, 'Name', name); setze(f, 'Text1', geb); setze(f, 'Street', dt.strasse); setze(f, 'ZIP', dt.plz); setze(f, 'City', dt.ort); setze(f, 'Country', dt.land);
    setze(f, 'Shipping1', dt.liefer_name); setze(f, 'Shipping2', dt.liefer_adresse); setze(f, 'Phone', dt.telefon); setze(f, 'Mobile', dt.handy); setze(f, 'Email', dt.email); setze(f, 'VAT', dt.ustid);
    // Die Auswahlknöpfe im Formular sind defekt (alle heißen gleich), deshalb den Punkt bei LeveLuk K-8 selbst setzen
    s0.drawCircle({ x: 48.5, y: s0.getHeight() - 356.5, size: 3.2, color: rgb(0.12, 0.16, 0.27) });
    setze(f, 'Price', eur(a.preis)); setze(f, 'PriceVAT', eur(a.mwst)); setze(f, 'PriceShipping', eur(a.versand)); setze(f, 'PriceWarranty', eur(a.garantie)); setze(f, 'PriceTotal', eur(summe));
    if (dt.zahlung === 'raten') { haken(f, 'Epay' + { 3: 30, 6: 60, 10: 100, 16: 160, 24: 240 }[dt.raten_anzahl]); setze(f, 'Downpayment', eur(a.anzahlung)); }
    else haken(f, 'Check Box27.0.0');
    setze(f, 'Sponsor Name', sp.name); setze(f, 'Sponsor ID', sp.id); setze(f, 'Line', linie); setze(f, 'Spnsor E-Mail', sp.email);
    zeichne(doc, s0, await bild(doc, kundeSig), 70, 584, 190, 34); text(s0, font, heuteDE, 300, 614, 11);
    zeichne(doc, s0, await bild(doc, sponsorSig), 60, 712, 190, 26); text(s0, font, heuteDE, 380, 734, 11);
    f.flatten();
    const [s] = await ergebnis.copyPages(doc, [0]); ergebnis.addPage(s);
  }
  const ablage = [];
  const sichern = async (doc, dateiname) => { const pfad = `${b.id}/${dateiname}`; await Daten.bestellHochladen(pfad, new Blob([await doc.save()], { type: 'application/pdf' }), 'application/pdf'); ablage.push({ name: dateiname, pfad }); };
  const nn = (dt.nachname || 'Kunde').replace(/[^\wäöüÄÖÜß-]+/g, '-');
  await sichern(ergebnis, `Bestellformular-LeveLuk-K8-${nn}.pdf`);
  // Ratenzahlungsantrag
  if (dt.zahlung === 'raten') {
    const doc = await laden('ratenzahlungsantrag.pdf'), f = doc.getForm(), s0 = doc.getPage(0), font = await doc.embedFont(StandardFonts.Helvetica);
    setze(f, 'Name', name); setze(f, 'Straße', dt.strasse); setze(f, 'PLZ', dt.plz); setze(f, 'Stadt', dt.ort); setze(f, 'Tel', dt.handy || dt.telefon); setze(f, 'EMail', dt.email);
    setze(f, 'Beruf', dt.beruf); setze(f, 'Arbeitgeber', dt.arbeitgeber); setze(f, 'Straße_3', dt.arbeitgeber_adresse); setze(f, 'Tel_3', dt.arbeitgeber_tel); setze(f, 'beschäftigt seit', dt.beschaeftigt_seit);
    setze(f, 'Produkt.0', 'LeveLuk K8'); setze(f, 'Produkt.1', a.anzahlung != null ? String(a.anzahlung) : '');
    radio(f, '30 €', String(dt.raten_anzahl)); radio(f, 'ZAHLUNGSOPTIONEN', String(dt.zahltag)); setze(f, 'Anfang', a.anfang); setze(f, 'Text2', a.ende);
    radio(f, 'Kreditkarteninformation', 'BANKKONTO'); setze(f, 'IBAN', dt.iban); setze(f, 'BIC', dt.bic);
    setze(f, 'Text3.0', [dt.vorname, dt.nachname].join(' ')); setze(f, 'Text4.0', heuteDE);
    // Ja / Nein: andere Maschine schon finanziert, als Kreuz gesetzt
    text(s0, font, 'X', dt.schon_finanziert === 'Ja' ? 547 : 614, 54, 12);
    zeichne(doc, s0, await bild(doc, kundeSig), 120, 770, 200, 34);
    f.flatten();
    await sichern(doc, `Ratenzahlungsantrag-LeveLuk-K8-${nn}.pdf`);
  }
  return ablage;
}

// ---------- Unterlagen: Dateien zum Weitergeben und alle Links ----------
// Für Jasmin und Daniel. Dateien hochladen per Knopf oder Hineinziehen, Links per Formular.
const AUGE_AUF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const AUGE_ZU = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.5 4.5-1.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const UNTERLAGEN_BEREICHE = ['Enagic', 'Zinzino', 'iLifeSomm', 'Intern'];
const UNTERLAGEN_FUER = ['Kunden', 'Partner', 'Intern'];
let unterlagenBereich = 'Alle';
const FB_WHATSAPP = 'Hier ist der kurze Fragebogen zu deinem Wasser-Test, dauert etwa fünf Minuten: ';
async function zeigeUnterlagen(d) {
  const alle = d.unterlagen || [];
  // Fragebogen-Link mit Kürzel der eingeloggten Person (Jasmin = admin, sonst Daniel)
  const fbVon = ich.rolle === 'admin' ? 'jasmin' : 'daniel', fbVonName = fbVon === 'jasmin' ? 'Jasmin' : 'Daniel';
  const fbLink = new URL('../fragebogen/?von=' + fbVon, location.href).href;
  const liste = alle.filter((u) => unterlagenBereich === 'Alle' || u.bereich === unterlagenBereich);
  const bereiche = [...new Set([...UNTERLAGEN_BEREICHE, ...alle.map((u) => u.bereich)])].filter((b) => liste.some((u) => u.bereich === b));
  // Zugang: Benutzername sichtbar, Passwort verdeckt. Auge daneben zum Anzeigen, rechts Öffnen und Kopieren.
  const zeile = (u) => u.art === 'zugang' ? `<div class="unterlage" data-id="${u.id}">
      <span class="u-art zugang">Zugang</span>
      <div class="haupt">${esc(u.titel)}<div class="klein">${esc(u.benutzer || '')}${u.benutzer ? ' · ' : ''}<span class="geheim" data-geheim="${u.id}">••••••••</span><button class="auge" data-zeigen="${u.id}" title="Passwort anzeigen" aria-label="Passwort anzeigen">${AUGE_AUF}</button>${u.notiz ? ' · ' + esc(u.notiz) : ''}</div></div>
      ${u.url ? `<a class="knopf leise klein-knopf" href="${esc(u.url)}" target="_blank" rel="noopener">Öffnen</a>` : ''}
      ${u.benutzer ? `<button class="knopf leise klein-knopf" data-kopie="benutzer" data-u="${u.id}">Name kopieren</button>` : ''}
      <button class="knopf klein-knopf" data-kopie="geheim" data-u="${u.id}">Passwort kopieren</button>
    </div>` : `<div class="unterlage" data-id="${u.id}">
      ${u.art === 'datei' ? `<div class="vorschau" data-vorschau="${u.id}"></div>` : ''}<span class="u-art ${u.art}">${u.art === 'datei' ? 'Datei' : 'Link'}</span>
      <div class="haupt">${esc(u.titel)}<div class="klein">${esc([u.fuer && 'für ' + u.fuer, u.notiz].filter(Boolean).join(' · '))}</div></div>
      ${u.art === 'datei' && u.fuer !== 'Intern' ? `<button class="knopf leise klein-knopf" data-oeffnen="${u.id}">Öffnen</button><button class="knopf klein-knopf" data-teilen="${u.id}">Link kopieren</button>` : ''}
      ${u.art === 'datei' ? `<button class="knopf leise klein-knopf" data-laden="${u.id}">Herunterladen</button>` : `<a class="knopf leise klein-knopf" href="${esc(u.url)}" target="_blank" rel="noopener">Öffnen</a>`}
    </div>`;
  $('#inhalt').innerHTML = `
    <h1>Unterlagen</h1><p class="unter">Alles zum Weitergeben an einer Stelle: Dateien zum Herunterladen und die wichtigsten Links. Neue Dateien einfach hier hineinziehen.</p>
    <section class="raum"><h2>Kunden-Fragebogen</h2><div class="einkaufsliste"><div class="unterlage">
      <span class="u-art link">Link</span>
      <div class="haupt">Fragebogen für neue Kunden<div class="klein">Dein eigener Link: Wer darüber ausfüllt, steht beim Kunden als „kam über ${esc(fbVonName)}“.</div></div>
      <a class="knopf leise klein-knopf" href="${esc(fbLink)}" target="_blank" rel="noopener">Öffnen</a>
      <a class="knopf leise klein-knopf" href="https://wa.me/?text=${encodeURIComponent(FB_WHATSAPP + fbLink)}" target="_blank" rel="noopener">Per WhatsApp senden</a>
      <button class="knopf klein-knopf" id="fb-link-kopieren">Link kopieren</button>
    </div></div></section>
    <div class="leiste">
      <select id="u-bereich" style="width:auto">${['Alle', ...UNTERLAGEN_BEREICHE].map((b) => `<option ${b === unterlagenBereich ? 'selected' : ''}>${b === 'Alle' ? 'Alle Bereiche' : b}</option>`).join('')}</select>
      <span style="flex:1"></span>
      <button class="knopf leise" id="u-zugang">Neuer Zugang</button>
      <button class="knopf leise" id="u-link">Neuer Link</button>
      <label class="knopf" style="width:auto;cursor:pointer">Datei hochladen<input type="file" id="u-datei" multiple hidden></label>
    </div>
    <div class="ablage" id="ablage">Dateien hier hineinziehen</div>
    ${bereiche.map((b) => `<section class="raum"><h2>${esc(b)}</h2><div class="einkaufsliste">${liste.filter((u) => u.bereich === b).sort((x, y) => (x.art === 'datei' ? 0 : 1) - (y.art === 'datei' ? 0 : 1) || x.titel.localeCompare(y.titel, 'de')).map(zeile).join('')}</div></section>`).join('') || '<p class="leer">Noch nichts abgelegt.</p>'}`;
  $('#u-bereich').onchange = (e) => { unterlagenBereich = e.target.value; zeichnen(); };
  $('#fb-link-kopieren').onclick = async (e) => {
    try { await navigator.clipboard.writeText(fbLink); e.target.textContent = 'Kopiert'; } catch (err) { prompt('Dein Fragebogen-Link:', fbLink); }
    setTimeout(() => { e.target.textContent = 'Link kopieren'; }, 2000);
  };
  $('#u-zugang').onclick = () => unterlageBearbeiten({ art: 'zugang', bereich: 'Intern', fuer: 'Intern' });
  $('#u-link').onclick = () => unterlageBearbeiten({ art: 'link', bereich: unterlagenBereich === 'Alle' ? 'Enagic' : unterlagenBereich, fuer: 'Kunden' });
  const hochladen = async (files) => {
    for (const f of files) {
      const r = await Daten.dateiHochladen(f);
      const teil = await Daten.dateiTeilen(r.pfad, r.url);
      await Daten.speichern('uk_unterlagen', { titel: f.name.replace(/\.[^.]+$/, ''), art: 'datei', bereich: unterlagenBereich === 'Alle' ? 'Enagic' : unterlagenBereich, fuer: 'Kunden', pfad: r.pfad, url: r.url || null, ...teil });
    }
    zeichnen();
  };
  $('#u-datei').onchange = (e) => hochladen([...e.target.files]);
  const ab = $('#ablage');
  ab.ondragover = (e) => { e.preventDefault(); ab.classList.add('ziel'); };
  ab.ondragleave = () => ab.classList.remove('ziel');
  ab.ondrop = (e) => { e.preventDefault(); ab.classList.remove('ziel'); hochladen([...e.dataTransfer.files]); };
  document.querySelectorAll('[data-laden]').forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const u = alle.find((x) => x.id === b.dataset.laden);
      try { window.open(await Daten.dateiLink(u.pfad, u.url), '_blank'); } catch (err) { alert('Herunterladen hat nicht geklappt: ' + (err.message || err)); }
    };
  });
  document.querySelectorAll('[data-teilen]').forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const u = alle.find((x) => x.id === b.dataset.teilen);
      try {
        // Ältere Dateien ohne Teil-Link bekommen ihn beim ersten Klick
        if (!u.teil_url) { Object.assign(u, await Daten.dateiTeilen(u.pfad, u.url)); await Daten.speichern('uk_unterlagen', { id: u.id, teil_pfad: u.teil_pfad, teil_url: u.teil_url }); }
        await navigator.clipboard.writeText(u.teil_url);
        b.textContent = 'Kopiert';
      } catch (err) { prompt('Link zum Weitergeben:', u.teil_url || ''); }
      setTimeout(() => { b.textContent = 'Link kopieren'; }, 2000);
    };
  });
  // Öffnen: der dauerhafte Link zum Weitergeben, im neuen Tab. Fehlt er noch, wird er angelegt.
  document.querySelectorAll('[data-oeffnen]').forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const u = alle.find((x) => x.id === b.dataset.oeffnen);
      // Gibt es den Link schon, sofort öffnen (sonst blockt der Browser das neue Fenster)
      if (u.teil_url) { window.open(u.teil_url, '_blank', 'noopener'); return; }
      try {
        Object.assign(u, await Daten.dateiTeilen(u.pfad, u.url)); await Daten.speichern('uk_unterlagen', { id: u.id, teil_pfad: u.teil_pfad, teil_url: u.teil_url });
        location.assign(u.teil_url);
      } catch (err) { alert('Öffnen hat nicht geklappt: ' + (err.message || err)); }
    };
  });
  document.querySelectorAll('[data-zeigen]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      const u = alle.find((x) => x.id === b.dataset.zeigen), feld = document.querySelector(`[data-geheim="${u.id}"]`);
      const offen = b.classList.toggle('offen');
      feld.textContent = offen ? (u.geheim || '(kein Passwort hinterlegt)') : '••••••••';
      b.innerHTML = offen ? AUGE_ZU : AUGE_AUF;
      b.title = offen ? 'Passwort verbergen' : 'Passwort anzeigen';
    };
  });
  document.querySelectorAll('[data-kopie]').forEach((b) => {
    b.onclick = async (e) => {
      e.stopPropagation();
      const u = alle.find((x) => x.id === b.dataset.u), wert = u[b.dataset.kopie] || '';
      const alt = b.textContent;
      try { await navigator.clipboard.writeText(wert); b.textContent = 'Kopiert'; } catch (err) { b.textContent = 'Kopieren ging nicht'; }
      setTimeout(() => { b.textContent = alt; }, 2000);
    };
  });
  document.querySelectorAll('.unterlage a').forEach((a) => { a.onclick = (e) => e.stopPropagation(); });
  vorschauenLaden(alle);
  // Bearbeiten nur über den Namen vorne, die Knöpfe rechts tun nur, was draufsteht
  document.querySelectorAll('.unterlage .haupt').forEach((el) => { el.onclick = () => unterlageBearbeiten(alle.find((u) => u.id === el.closest('.unterlage').dataset.id)); });
}
// Vorschaubild: erste Seite jeder PDF, Bilder direkt. Ohne Handarbeit, auch für spätere Uploads (19.10.2026).
// pdf.js wird erst geladen, wenn der Reiter Unterlagen offen ist. Fertige Bilder merkt sich die Sitzung.
const VORSCHAU_CACHE = {};
let pdfjsLaden = null;
function pdfjs() {
  if (!pdfjsLaden) pdfjsLaden = new Promise((ok, fehler) => {
    const sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; ok(window.pdfjsLib); };
    sc.onerror = fehler; document.head.appendChild(sc);
  });
  return pdfjsLaden;
}
async function vorschauBild(u) {
  const schluessel = u.pfad || u.id;
  if (VORSCHAU_CACHE[schluessel]) return VORSCHAU_CACHE[schluessel];
  const quelle = u.teil_url || await Daten.dateiLink(u.pfad, u.url, true);
  if (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(u.pfad || quelle)) return (VORSCHAU_CACHE[schluessel] = quelle);
  if (!/\.pdf(\?|$)/i.test(u.pfad || quelle)) return null;
  const lib = await pdfjs();
  const pdf = await lib.getDocument({ url: quelle, disableAutoFetch: true, disableStream: false }).promise;
  const seite = await pdf.getPage(1);
  const v0 = seite.getViewport({ scale: 1 }), v = seite.getViewport({ scale: 180 / v0.width });
  const c = document.createElement('canvas'); c.width = v.width; c.height = v.height;
  await seite.render({ canvasContext: c.getContext('2d'), viewport: v }).promise;
  return (VORSCHAU_CACHE[schluessel] = c.toDataURL('image/jpeg', 0.8));
}
function vorschauenLaden(alle) {
  document.querySelectorAll('[data-vorschau]').forEach(async (el) => {
    const u = alle.find((x) => x.id === el.dataset.vorschau);
    try { const bild = u && await vorschauBild(u); if (bild) { el.style.backgroundImage = `url("${bild}")`; el.classList.add('da'); } } catch (e) { /* ohne Vorschau weiter */ }
  });
}
function unterlageBearbeiten(u) {
  dialog(`<h2>${u.id ? esc(u.titel) : u.art === 'zugang' ? 'Neuer Zugang' : 'Neuer Link'}</h2>
    <div class="formular">
      <label class="breit">Name<input name="titel" required value="${esc(u.titel)}" ${u.art === 'zugang' ? 'placeholder="z. B. E-Mail info@ursprungskraft.net"' : ''}></label>
      <label>Bereich<select name="bereich">${UNTERLAGEN_BEREICHE.map((b) => `<option ${b === u.bereich ? 'selected' : ''}>${b}</option>`).join('')}</select></label>
      <label>Für wen<select name="fuer">${UNTERLAGEN_FUER.map((b) => `<option ${b === u.fuer ? 'selected' : ''}>${b}</option>`).join('')}</select></label>
      ${u.art === 'link' ? `<label class="breit">Adresse<input name="url" type="url" required value="${esc(u.url)}" placeholder="https://"></label>` : ''}
      ${u.art === 'zugang' ? `<label class="breit">Anmeldeseite (optional)<input name="url" type="url" value="${esc(u.url)}" placeholder="https://mail.ionos.de"></label>
      <label>Benutzername oder E-Mail<input name="benutzer" autocomplete="off" value="${esc(u.benutzer)}"></label>
      <label>Passwort<input name="geheim" type="password" autocomplete="new-password" value="${esc(u.geheim)}"></label>
      <p class="leer breit">Nur für euch beide im Dashboard sichtbar, nie über einen Link teilbar.</p>` : ''}
      <label class="breit">Notiz<textarea name="notiz">${esc(u.notiz)}</textarea></label>
      ${u.teil_url && u.fuer !== 'Intern' ? `<p class="leer breit">Link zum Weitergeben: <a href="${esc(u.teil_url)}" target="_blank" rel="noopener">öffnen</a></p>` : ''}
    </div>`, u.id, async (w) => {
    await Daten.speichern('uk_unterlagen', { ...u, ...w });
  }, async () => { if (u.art === 'datei' && u.pfad) await Daten.dateiLoeschen(u.pfad, u.teil_pfad); await Daten.loeschen('uk_unterlagen', u.id); });
}

// ---------- Dialog ----------
// frage: eigene Rückfrage vor dem Löschen, sonst "Wirklich löschen?"
function dialog(html, darfLoeschen, speichern, loeschen, frage) {
  const dlg = $('#dialog'), form = $('#dialog-form');
  form.innerHTML = html + `<div class="knoepfe">
    ${darfLoeschen && loeschen ? '<button type="button" class="knopf rot links" id="d-loeschen">Löschen</button>' : ''}
    <button type="button" class="knopf leise" id="d-abbrechen">Abbrechen</button>
    <button type="submit" class="knopf">Speichern</button></div>`;
  $('#d-abbrechen').onclick = () => dlg.close();
  if ($('#d-loeschen')) $('#d-loeschen').onclick = async () => { if (confirm(frage || 'Wirklich löschen?')) { await loeschen(); dlg.close(); zeichnen(); } };
  form.onsubmit = async (e) => {
    e.preventDefault();
    const werte = Object.fromEntries(new FormData(form).entries());
    if ((await speichern(werte)) === false) return;
    dlg.close();
    zeichnen();
  };
  dlg.showModal();
}

// ---------- Meine Zahlen (für die angemeldete Person) ----------
// Jasmin (admin) sieht ihre Zahlen, Daniel seine. Gefunden über das Partner-Kürzel.
// Provisionen folgen, sobald Jasmin die Zahlen nennt (Aufgabe im Board).
const meinKuerzel = () => (ich.rolle === 'admin' ? 'jasmin' : 'daniel');
async function zeigeMeine(d) {
  const kurz = meinKuerzel();
  const p = d.partner.find((x) => x.kurz === kurz);
  const z = p ? zahlenVon(p, d) : null;
  $('#inhalt').innerHTML = `
    <h1>Meine Zahlen</h1><p class="unter">Nur für dich sichtbar.</p>
    ${z ? `<div class="zahlen">
      <div class="zahl"><b>${z.anfragen}</b><span>Kontakte über deinen Link</span></div>
      <div class="zahl"><b>${z.tester}</b><span>testen gerade</span></div>
      <div class="zahl"><b>${z.kaeufe.length}</b><span>Käufe gesamt, ${z.jahr} in diesem Jahr</span></div>
      <div class="zahl"><b>${z.quote === null ? '0 %' : z.quote + ' %'}</b><span>Quote Kontakt zu Kauf</span></div>
    </div>` : `<p class="leer" style="margin-bottom:18px">Hier stehen bald deine Zahlen. Dafür braucht es dich im Reiter Partner mit dem Link ${esc(LINK_BASIS + kurz)}.</p>`}
    <div class="raster">
      <section class="feld"><h2>Meine Kontakte</h2>
        ${z ? z.ks.sort((a, b) => name(a).localeCompare(name(b))).map((k) => `<div class="zeile"><div class="haupt">${esc(name(k))}<div class="klein">${esc([k.ort, k.geraet].filter(Boolean).join(' · '))}</div></div><span class="marker ${statusKlasse(k.status)}">${esc(k.status)}</span></div>`).join('') || '<p class="leer">Noch keine Kontakte.</p>' : '<p class="leer">Noch keine Kontakte.</p>'}
      </section>
      <section class="feld"><h2>Provision</h2><p class="leer">Folgt, sobald die Zahlen je verkauftem Gerät feststehen.</p></section>
    </div>`;
}

// ---------- Start ----------
// ---------- Anmeldung ----------
let ich = { rolle: 'team', name: '' };
function maske(html, binden) {
  document.body.classList.add('gesperrt');
  $('.kopf').hidden = true; $('.rechts').hidden = true;
  const m = $('#anmeldung'); m.hidden = false;
  m.innerHTML = `<form class="karte-an" novalidate><img class="logo" src="logo-oliv.png?v=2" alt=""><div class="marke" style="color:var(--oliv-dunkel);padding:0">URSPRUNGSKRAFT</div>${html}<div class="meldung" id="meldung"></div></form>`;
  const f = m.querySelector('form');
  const meldung = (t, gut) => { const el = $('#meldung'); el.textContent = t; el.classList.toggle('gut', !!gut); };
  f.onsubmit = async (e) => { e.preventDefault(); const k = f.querySelector('button[type=submit]'); k.disabled = true; try { await binden.senden(Object.fromEntries(new FormData(f).entries()), meldung); } catch (err) { meldung(fehlerText(err)); } k.disabled = false; };
  if (binden.extra) binden.extra(f, meldung);
}
function fehlerText(err) {
  const t = String((err && err.message) || err);
  if (/invalid login/i.test(t)) return 'E-Mail oder Passwort stimmt nicht.';
  // Supabase meldet fehlende Zeichenarten ebenfalls mit "Password should contain at least ...", das ist nicht die Länge
  if (/contain|character/i.test(t)) return 'Das Passwort braucht Großbuchstaben, Kleinbuchstaben, eine Zahl und ein Sonderzeichen.';
  if (/at least|password should/i.test(t)) return 'Das Passwort ist zu kurz. Bitte mindestens 10 Zeichen.';
  if (/same|different from the old/i.test(t)) return 'Das neue Passwort muss sich vom alten unterscheiden.';
  if (/rate limit|too many/i.test(t)) return 'Zu viele Versuche. Bitte warte ein paar Minuten.';
  return 'Das hat nicht geklappt: ' + t;
}
function anmeldeMaske(hinweis) {
  maske(`<h1>Anmelden</h1>
    ${hinweis ? `<p class="unter" style="margin:0">${esc(hinweis)}</p>` : ''}
    <label>E-Mail<input name="email" type="email" autocomplete="username" required></label>
    <label>Passwort<input name="passwort" type="password" autocomplete="current-password" required></label>
    <button class="knopf" type="submit">Anmelden</button>
    <button class="link" type="button" id="vergessen">Passwort vergessen?</button>`, {
    async senden(w) { await Daten.anmeldung.anmelden(w.email.trim(), w.passwort); location.reload(); },
    extra(f, meldung) {
      $('#vergessen').onclick = async () => {
        const email = f.email.value.trim();
        if (!email) return meldung('Trag oben deine E-Mail ein, dann schicke ich dir einen Link.');
        try { await Daten.anmeldung.passwortVergessen(email); meldung('Wenn die Adresse bekannt ist, kommt gleich eine Mail mit einem Link.', true); } catch (err) { meldung(fehlerText(err)); }
      };
    },
  });
}
function passwortMaske() {
  maske(`<h1>Passwort festlegen</h1>
    <p class="unter" style="margin:0">Mindestens 10 Zeichen. Leg es danach gleich in deinen Passwort-Manager.</p>
    <label>Neues Passwort<input name="p1" type="password" autocomplete="new-password" required></label>
    <label>Noch einmal<input name="p2" type="password" autocomplete="new-password" required></label>
    <button class="knopf" type="submit">Speichern</button>`, {
    async senden(w, meldung) {
      if ((w.p1 || '').length < 10) return meldung('Bitte mindestens 10 Zeichen.');
      if (w.p1 !== w.p2) return meldung('Die beiden Eingaben sind nicht gleich.');
      await Daten.anmeldung.passwortSetzen(w.p1);
      history.replaceState(null, '', location.pathname + location.search);
      location.reload();
    },
  });
}

// ---------- Glocke: was ist neu (nur Jasmin) ----------
// Neu sind Aufgaben von Daniels Assistent, die Jasmin noch nicht geöffnet hat.
// Gesehen speichern und prüfen, was die Datenbank zurückgibt. Fehler nicht verschlucken,
// sonst sieht es gespeichert aus und die Meldung ist nach dem Neuladen wieder da.
async function gesehen(a) {
  const z = await Daten.speichern('uk_aufgaben', { id: a.id, neu: false });
  if (z && z.neu) throw new Error('Die Datenbank hat „gesehen“ nicht übernommen.');
  a.neu = false;
}
function wo(a) {
  if (a.erledigt) return 'Erledigt';
  if (a.eingang) return 'Eingang';
  return a.faellig ? datum(a.faellig) + (a.uhrzeit ? ', ' + zeit(a) : '') : 'Ohne Datum';
}
function glocke(d) {
  const g = $('#glocke'), feld = $('#glocke-liste');
  if (!g) return;
  g.hidden = ich.rolle !== 'admin';
  if (g.hidden) return;
  const neu = d.aufgaben.filter((a) => a.neu && !a.erledigt).sort((x, y) => String(y.erstellt).localeCompare(String(x.erstellt)));
  g.classList.toggle('hat-neues', neu.length > 0);
  $('#glocke-zahl').textContent = neu.length || '';
  g.title = neu.length ? `${neu.length} neu von Daniel` : 'Nichts Neues';
  feld.innerHTML = `<div class="glocke-kopf"><b>Neu von Daniel</b>${neu.length ? '<button class="link" id="alle-gesehen">alle als gesehen</button>' : ''}</div>
    ${neu.map((a) => `<button class="glocke-zeile" data-id="${a.id}"><span>${esc(a.titel)}</span><small>${esc(wo(a))}${a.wer ? ' · ' + esc(a.wer) : ''}</small></button>`).join('') || '<p class="leer">Nichts Neues. Alles gesehen.</p>'}`;
  g.onclick = (e) => { e.stopPropagation(); feld.hidden = !feld.hidden; };
  feld.onclick = (e) => e.stopPropagation();
  document.onclick = () => { feld.hidden = true; };
  feld.querySelectorAll('.glocke-zeile').forEach((b) => {
    b.onclick = async () => {
      const a = d.aufgaben.find((x) => x.id === b.dataset.id);
      feld.hidden = true;
      try { await gesehen(a); } catch (err) { alert(fehlerText(err)); }
      await reiterWechseln('aufgaben');
      aufgabeBearbeiten(a, d);
    };
  });
  const alle = $('#alle-gesehen');
  if (alle) alle.onclick = async () => {
    try { for (const a of neu) await gesehen(a); } catch (err) { alert(fehlerText(err)); }
    feld.hidden = true; zeichnen();
  };
}

async function zeichnen() {
  const d = await alles();
  glocke(d);
  document.querySelectorAll('#reiter button').forEach((b) => b.classList.toggle('aktiv', b.dataset.reiter === reiter));
  aktivZeigen();
  ({ aufgaben: zeigeAufgaben, kalender: zeigeKalender, unterlagen: zeigeUnterlagen, bestellungen: zeigeBestellungen, kunden: zeigeKunden, maschinen: zeigeMaschinen, partner: zeigePartner, auswertung: zeigeAuswertung, wohnung: zeigeWohnung, meine: zeigeMeine }[reiter] || zeigeAufgaben)(d);
}

// Am Handy ist das Menü eine wischbare Zeile: den aktiven Reiter in die Mitte holen
function aktivZeigen() {
  const nav = $('#reiter'), b = nav.querySelector('button.aktiv');
  if (!b || nav.scrollWidth <= nav.clientWidth) return;
  const links = b.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
  nav.scrollTo({ left: links - (nav.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
}
// Name, Glocke und Abmelden: am Handy in der schmalen Leiste, am Rechner oben rechts über dem Inhalt
const breit = matchMedia('(min-width: 821px)');
function symbolePlatzieren() { (breit.matches ? $('.obenleiste') : $('.kopf-leiste')).appendChild($('.symbole')); }

// Reiterwechsel: neu zeichnen und ganz nach oben springen, sonst bleibt man am Handy unten hängen
async function reiterWechseln(r) {
  reiter = r;
  try { localStorage.setItem('uk-reiter', reiter); } catch (e) {}
  await zeichnen();
  window.scrollTo(0, 0);
}

async function start() {
  if (Daten.linkArt === 'fehler') return anmeldeMaske('Der Link aus der Mail ist abgelaufen oder wurde schon benutzt. Melde dich an oder lass dir über „Passwort vergessen?“ einen neuen schicken.');
  let sitzung = null;
  try { sitzung = await Daten.anmeldung.sitzung(); } catch (e) { sitzung = null; }
  if (sitzung && (Daten.linkArt === 'invite' || Daten.linkArt === 'recovery')) return passwortMaske();
  if (!sitzung) return anmeldeMaske();
  try { ich = await Daten.anmeldung.rolle(); } catch (e) { ich = { rolle: 'team', name: '' }; }
  document.body.classList.remove('gesperrt');
  $('#anmeldung').hidden = true; $('.kopf').hidden = false; $('.rechts').hidden = false;
  $('#wer-name').textContent = ich.name || sitzung.user.email;
  $('#abmelden').onclick = async () => { await Daten.anmeldung.abmelden(); location.reload(); };
  $('#hinweis-demo').hidden = !Daten.demo;
  symbolePlatzieren();
  breit.addEventListener('change', () => { symbolePlatzieren(); aktivZeigen(); });
  try { reiter = localStorage.getItem('uk-reiter') || 'aufgaben'; } catch (e) {}
  if (reiter === 'uebersicht') reiter = 'aufgaben';
  document.querySelectorAll('#reiter button').forEach((b) => {
    b.onclick = () => reiterWechseln(b.dataset.reiter);
  });
  try { await zeichnen(); } catch (e) { $('#inhalt').innerHTML = `<h1>Daten nicht erreichbar</h1><p class="unter">${esc(fehlerText(e))}</p>`; }
}
start();

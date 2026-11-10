// Ablauf des Fragebogens: eine Frage pro Bildschirm, Speichern beim Kunden, Vergleich am Ende.
// Persönlicher Link: fragebogen/?k=<token>. Ohne Link legt der erste Durchgang den Kunden neu an.

const $ = (s) => document.querySelector(s);
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const datum = (d) => new Date(d + (d.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const plusTage = (basis, n) => { const d = new Date(basis + (basis.length === 10 ? 'T12:00:00' : '')); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

// Wer den Link verschickt hat (?von=jasmin / ?von=daniel / Partnerkürzel), nur intern
const von = (new URLSearchParams(location.search).get('von') || '').toLowerCase().replace(/[^a-z0-9-]/g, '') || undefined;
let kunde = null, token = null, bisher = [], durchgang = 1, antworten = {}, schritte = [], pos = 0, kontakt = {};

function zeileVon(f) { return BEREICHE[f.bereich] || ''; }

async function laden() {
  $('#markenzeile').textContent = MARKE.zeile;
  $('#fusszeile').textContent = MARKE.name;
  $('#datenschutz').onclick = (e) => { e.preventDefault(); alert('Die Datenschutzerklärung von ' + MARKE.name + ' steht hier, sobald die Seite online ist.'); };
  token = new URLSearchParams(location.search).get('k');
  if (token) {
    let r = null;
    try { r = await Daten.fbLaden(token); } catch (e) { r = null; }
    if (!r) return zeige(`<h1>Dieser Link ist nicht mehr gültig</h1><p>Schreib uns kurz an ${esc(MARKE.mail)}, dann bekommst du einen neuen.</p>`);
    kunde = r.kunde;
    bisher = r.bisher || [];
    kontakt = { vorname: kunde.vorname, nachname: kunde.nachname, email: kunde.email, telefon: kunde.telefon };
  }
  durchgang = Math.min(bisher.length + 1, DURCHGAENGE.length + 1);
  if (durchgang > DURCHGAENGE.length) return fertigAlle();
  schritte = ['start'];
  if (durchgang === 1 && !(kontakt.vorname && kontakt.nachname && kontakt.email)) schritte.push('kontakt');
  fragenFuer(durchgang).forEach((f) => schritte.push(f.id));
  schritte.push('abschluss');
  pos = 0;
  zeichnen();
}

function zeige(html, fortschritt = null) {
  $('#inhalt').innerHTML = html;
  $('#fortschritt').style.width = fortschritt === null ? '0' : Math.round(fortschritt * 100) + '%';
  window.scrollTo(0, 0);
}

function weiter() { pos = Math.min(pos + 1, schritte.length - 1); zeichnen(); }
function zurueck() { pos = Math.max(pos - 1, 0); zeichnen(); }

function leiste({ weiterText = 'Weiter', weiterAus = false, ohneWeiter = false, extra = '' } = {}) {
  return `<div class="leiste">
    ${pos > 0 ? '<button class="leise-knopf" id="zurueck">Zurück</button>' : '<span></span>'}
    <span style="display:flex;gap:10px;align-items:center">${extra}${ohneWeiter ? '' : `<button class="knopf" id="weiter" ${weiterAus ? 'disabled' : ''}>${weiterText}</button>`}</span>
  </div>`;
}
function knoepfeVerbinden() {
  if ($('#zurueck')) $('#zurueck').onclick = zurueck;
  if ($('#weiter')) $('#weiter').onclick = weiter;
}

function zeichnen() {
  const s = schritte[pos];
  const anteil = pos / (schritte.length - 1);
  const d = DURCHGAENGE[durchgang - 1];
  $('#schritt').textContent = pos > 0 ? `${pos} von ${schritte.length - 1}` : '';

  if (s === 'start') return startseite(d);
  if (s === 'kontakt') return kontaktseite(anteil);
  if (s === 'abschluss') return abschluss(anteil);
  const f = FRAGEN.find((x) => x.id === s);
  if (f.typ === 'brief') return briefseite(f, anteil);
  frageseite(f, anteil);
}

function startseite(d) {
  const erster = bisher[0];
  const faellig = erster ? plusTage(erster.erstellt.slice(0, 10), d.tage) : null;
  const zuFrueh = faellig && faellig > Daten.heute();
  const name = kontakt.vorname ? ', ' + esc(kontakt.vorname.replace(/^Beispiel /, '')) : '';
  if (durchgang === 1) return einstieg();
  const text = `<p>Schön, dass du wieder da bist${name}. Hier kommen dieselben Fragen wie bei deinem Start, dazu ein paar, wie du dein Gerät nutzt.</p>
       <p>Am Ende siehst du, was sich seit deinem Start verändert hat.</p>
       ${zuFrueh ? `<p class="hilfe">Eigentlich ist dieser Teil ab dem ${datum(faellig)} dran. Du kannst ihn aber auch jetzt schon ausfüllen.</p>` : ''}`;
  zeige(`<div class="bereich">${esc(MARKE.name)}</div><h1>${esc(d.titel)}</h1>${text}
    <div class="leiste"><span></span><button class="knopf" id="weiter">${zuFrueh ? 'Trotzdem jetzt ausfüllen' : 'Los geht’s'}</button></div>`);
  knoepfeVerbinden();
}

// Erster Durchgang: Einstieg nach dem Vorbild der Zinzino-Selbstreflexion
function einstieg() {
  const tag = (n) => new Date(plusTage(Daten.heute(), n) + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  zeige(`<div class="bereich">Dein Wasser-Check</div>
    <h1>Wie trinkst du eigentlich gerade?</h1>
    <p class="vorspann">Wie viel du am Tag trinkst, wie dir dein Wasser schmeckt, wie du morgens in den Tag kommst: Das verändert sich langsam. Nach ein paar Wochen weiß kaum noch jemand, wie es am Anfang war. Genau das hältst du heute fest.</p>
    <div class="zeitstrahl">
      <div class="zs-bahn"><span class="zs-punkt voll"></span><span class="zs-punkt"></span><span class="zs-punkt"></span></div>
      <div class="zs-text">
        <div><b>Heute</b><span>${tag(0)}</span></div>
        <div><b>In 2 Wochen</b><span>${tag(14)}</span></div>
        <div><b>In 4 Wochen</b><span>${tag(28)}</span></div>
      </div>
    </div>
    <div class="bloecke">
      <div><h3>Warum jetzt</h3><p>Was neu ist, wird schnell normal. Wer den Anfang nicht festhält, kann später nicht vergleichen. Deshalb kommen in 2 und in 4 Wochen dieselben Fragen noch einmal, und du siehst schwarz auf weiß, was sich bei dir verändert hat.</p></div>
      <div><h3>Wer deine Antworten sieht</h3><p>Nur du und ${esc(MARKE.person)}, damit ${esc(MARKE.er)} dich in der Testphase gut begleiten kann. Es gibt keine richtigen oder falschen Antworten.</p></div>
      <div><h3>Wie es abläuft</h3><p>Du bekommst eine Frage nach der anderen und tippst meistens nur eine Zahl von 1 bis 10 an. <b>10 ist immer die gute Seite.</b> Antworte aus dem Bauch, das Ganze dauert etwa fünf Minuten. Den Link für die nächsten beiden Male bekommst du per E-Mail.</p></div>
    </div>
    <button class="knopf voll" id="weiter">Jetzt festhalten, wo ich stehe</button>`);
  knoepfeVerbinden();
}

function kontaktseite(anteil) {
  zeige(`<div class="bereich">Kurz zu dir</div><h2>Wohin dürfen wir deinen Link schicken?</h2>
    <p class="hilfe">In 2 und in 4 Wochen bekommst du eine E-Mail mit deinem persönlichen Link. Damit beantwortest du dieselben Fragen noch einmal und siehst deinen Vergleich.</p>
    <label class="feld">Vorname<input type="text" id="vorname" autocomplete="given-name" value="${esc(kontakt.vorname)}"></label>
    <label class="feld">Nachname<input type="text" id="nachname" autocomplete="family-name" value="${esc(kontakt.nachname)}"></label>
    <label class="feld">E-Mail<input type="email" id="email" autocomplete="email" value="${esc(kontakt.email)}"></label>
    <label class="feld">Telefon (freiwillig)<input type="tel" id="telefon" autocomplete="tel" value="${esc(kontakt.telefon)}"></label>
    <div class="fehler" id="fehler"></div>` + leiste(), anteil);
  knoepfeVerbinden();
  $('#weiter').onclick = () => {
    const w = (id) => $('#' + id).value.trim();
    kontakt = { vorname: w('vorname'), nachname: w('nachname'), email: w('email'), telefon: w('telefon') };
    if (!kontakt.vorname || !kontakt.nachname) return ($('#fehler').textContent = 'Bitte trag deinen Vor- und Nachnamen ein.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(kontakt.email)) return ($('#fehler').textContent = 'Bitte prüf deine E-Mail-Adresse.');
    weiter();
  };
}

function frageseite(f, anteil) {
  const wert = antworten[f.id];
  let feld = '';
  let mitWeiter = true;
  if (f.typ === 'skala') {
    mitWeiter = false;
    feld = `<div class="skala">${Array.from({ length: 10 }, (_, i) => `<button class="stufe" data-wert="${i + 1}" aria-pressed="${wert === i + 1}">${i + 1}</button>`).join('')}</div>
      <div class="enden"><span>1 ${esc(f.links)}</span><span>10 ${esc(f.rechts)}</span></div>`;
  } else if (f.typ === 'auswahl') {
    mitWeiter = false;
    feld = `<div class="optionen">${f.optionen.map((o) => `<button class="option" data-wert="${esc(o)}" aria-pressed="${wert === o}">${esc(o)}</button>`).join('')}</div>`;
  } else if (f.typ === 'zahl') {
    const z = Number.isFinite(wert) ? wert : 0;
    antworten[f.id] = z;
    feld = `<div class="zahl"><button id="minus" aria-label="weniger">−</button><output id="anzeige">${z}</output><button id="plus" aria-label="mehr">+</button></div>`;
  } else if (f.typ === 'mehrfach') {
    const gew = new Set(wert || []);
    feld = `<div class="optionen">${f.optionen.map(([k, t]) => `<button class="option" data-wert="${k}" aria-pressed="${gew.has(k)}">${esc(t)}</button>`).join('')}</div>`;
  } else if (f.typ === 'text') {
    feld = `${f.beispiel ? `<div class="beispiel">${esc(f.beispiel)}</div>` : ''}<textarea id="text" placeholder="Schreib einfach los">${esc(wert || '')}</textarea>`;
  }
  // Pflicht: Mehrfachauswahl erst mit mindestens einer Antwort weiter
  const leerMehrfach = f.typ === 'mehrfach' && !(wert && wert.length);
  const auslassen = f.auslassen ? `<button class="leise-knopf" id="auslassen">${esc(f.auslassen)}</button>` : '';
  zeige(`<div class="bereich">${esc(f.bereich === 'offen' ? 'Zum Schluss' : zeileVon(f))}</div><h2>${esc(f.text)}${f.frei ? ' <span class="frei">freiwillig</span>' : ''}</h2>
    ${f.hilfe ? `<p class="hilfe">${esc(f.hilfe)}</p>` : '<div style="height:10px"></div>'}${feld}` +
    leiste({ ohneWeiter: !mitWeiter, extra: auslassen, weiterAus: leerMehrfach, weiterText: f.frei && !wert ? 'Überspringen' : 'Weiter' }), anteil);
  knoepfeVerbinden();
  if ($('#auslassen')) $('#auslassen').onclick = () => { antworten[f.id] = null; weiter(); };
  if (f.typ === 'skala' || f.typ === 'auswahl') {
    document.querySelectorAll('[data-wert]').forEach((b) => {
      b.onclick = () => {
        antworten[f.id] = f.typ === 'skala' ? Number(b.dataset.wert) : b.dataset.wert;
        document.querySelectorAll('[data-wert]').forEach((x) => x.setAttribute('aria-pressed', x === b));
        setTimeout(weiter, 220);
      };
    });
  }
  if (f.typ === 'zahl') {
    const setze = (n) => { antworten[f.id] = Math.max(0, Math.min(f.max || 99, n)); $('#anzeige').textContent = antworten[f.id]; };
    $('#minus').onclick = () => setze(antworten[f.id] - 1);
    $('#plus').onclick = () => setze(antworten[f.id] + 1);
  }
  if (f.typ === 'mehrfach') {
    document.querySelectorAll('[data-wert]').forEach((b) => {
      b.onclick = () => {
        const gew = new Set(antworten[f.id] || []);
        gew.has(b.dataset.wert) ? gew.delete(b.dataset.wert) : gew.add(b.dataset.wert);
        antworten[f.id] = [...gew];
        b.setAttribute('aria-pressed', gew.has(b.dataset.wert));
        $('#weiter').disabled = gew.size === 0;
      };
    });
  }
  if (f.typ === 'text') $('#text').oninput = (e) => { antworten[f.id] = e.target.value; if (f.frei) $('#weiter').textContent = e.target.value.trim() ? 'Weiter' : 'Überspringen'; };
}

function briefseite(f, anteil) {
  zeige(`<div class="bereich">Zum Schluss</div><h2>Ein Brief an dich selbst <span class="frei">freiwillig</span></h2>
    <p>Was wünschst du dir für die nächsten Wochen? Schreib es dir selbst auf. Der Brief bleibt verschlossen und taucht erst nach vier Wochen wieder auf, direkt über deinem Ergebnis.</p>
    <p class="hilfe">Schreib so, als wäre es schon so. Woran merkst du es im Alltag? Ein paar Sätze reichen.</p>
    <div class="beispiel">Zum Beispiel: Ich fühle mich morgens energiegeladener und trinke ganz selbstverständlich zwei große Gläser Wasser. Ich schleppe keine Kisten mehr in den dritten Stock. Mein Kaffee schmeckt mir besser als früher.</div>
    <textarea id="text" placeholder="Liebe/r …">${esc(antworten.brief || '')}</textarea>` + leiste({ weiterText: antworten.brief ? 'Weiter' : 'Überspringen' }), anteil);
  knoepfeVerbinden();
  $('#text').oninput = (e) => { antworten.brief = e.target.value; $('#weiter').textContent = e.target.value.trim() ? 'Weiter' : 'Überspringen'; };
}

function abschluss(anteil) {
  zeige(`<div class="bereich">Fast geschafft</div><h2>Deine Antworten speichern</h2>
    <p class="hilfe">Damit wir dich begleiten können und du später deinen Vergleich siehst, speichern wir deine Antworten.</p>
    <label class="haken"><input type="checkbox" id="ok"> <span>${esc(EINWILLIGUNG)}</span></label>
    ${durchgang === 1 ? `<label class="haken"><input type="checkbox" id="stimme"> <span>${esc(STIMME)} (freiwillig)</span></label>` : ''}
    <div class="fehler" id="fehler"></div>` + leiste({ weiterText: 'Absenden', weiterAus: true }), anteil);
  knoepfeVerbinden();
  $('#ok').onchange = (e) => { $('#weiter').disabled = !e.target.checked; };
  $('#weiter').onclick = absenden;
}

async function absenden() {
  $('#weiter').disabled = true;
  try {
    const jetzt = new Date().toISOString();
    // Kunde, Antworten und Erinnerungen speichert die Datenbank in einem Schritt
    token = await Daten.fbSpeichern({
      token, durchgang, antworten, einwilligung: EINWILLIGUNG + ' (' + jetzt + ')', stimme: !!($('#stimme') && $('#stimme').checked),
      newsletter: false, von,
      kontakt: durchgang === 1 ? { vorname: kontakt.vorname, nachname: kontakt.nachname, email: kontakt.email, telefon: kontakt.telefon } : undefined,
    });
    kunde = kunde || { ...kontakt };
    bisher.push({ durchgang, antworten, erstellt: jetzt });
    danke();
  } catch (e) {
    $('#fehler').textContent = 'Das Speichern hat nicht geklappt. Bitte versuch es gleich noch einmal.';
    $('#weiter').disabled = false;
  }
}

function vergleichHtml(alt, neu, ueberschrift) {
  const skalen = FRAGEN.filter((f) => f.typ === 'skala' && Number.isFinite(alt[f.id]) && Number.isFinite(neu[f.id]));
  const zahlen = FRAGEN.filter((f) => f.typ === 'zahl' && Number.isFinite(alt[f.id]) && Number.isFinite(neu[f.id]));
  const pos = (w) => ((w - 1) / 9) * 100;
  return `<h2 style="margin-top:22px">${ueberschrift}</h2>
    <p class="hilfe">Der helle Punkt ist dein Start, der dunkle ist heute. 10 ist immer die gute Seite.</p>
    <div class="vergleich">${skalen.map((f) => `<div class="vzeile"><div class="vkopf"><span>${esc(f.text)}</span><b>${alt[f.id]} → ${neu[f.id]}</b></div>
      <div class="spur"><span class="vor" style="left:${pos(alt[f.id])}%"></span><span class="jetzt" style="left:${pos(neu[f.id])}%"></span></div></div>`).join('')}
    ${zahlen.map((f) => `<div class="vzeile"><div class="vkopf"><span>${esc(f.text)}</span><b>${alt[f.id]} → ${neu[f.id]}</b></div></div>`).join('')}
    ${alt.menge && neu.menge ? `<div class="vzeile"><div class="vkopf"><span>Wie viel du am Tag trinkst</span><b>${esc(alt.menge)} → ${esc(neu.menge)}</b></div></div>` : ''}</div>`;
}

// Erinnerungen für den Kalender (20.10.2026): Apple und Outlook über eine .ics-Datei, Google über einen Link je Termin.
// Jeweils 9 Uhr am Tag, mit dem persönlichen Link und einer Erinnerung am Morgen.
function terminDaten(nr) {
  const dg = DURCHGAENGE.find((d) => d.nr === nr);
  const basis = bisher[0] ? bisher[0].erstellt.slice(0, 10) : Daten.heute();
  return { dg, tag: plusTage(basis, dg.tage).replace(/-/g, '') };
}
function kalenderKnoepfe(link, nrs) {
  const titel = (dg) => `${MARKE.name}: Fragebogen ${dg.kurz}`;
  const google = nrs.map((nr) => { const { dg, tag } = terminDaten(nr);
    return `<a class="knopf leise" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titel(dg))}&dates=${tag}T090000/${tag}T091500&details=${encodeURIComponent('Zeit für deinen Fragebogen ' + dg.kurz + ': ' + link)}">Google Kalender: ${esc(dg.kurz)}</a>`; }).join(' ');
  window.__ics = () => {
    const z = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//' + MARKE.name + '//Fragebogen//DE', 'CALSCALE:GREGORIAN'];
    nrs.forEach((nr) => { const { dg, tag } = terminDaten(nr);
      z.push('BEGIN:VEVENT', 'UID:' + tag + '-' + nr + '-' + Math.random().toString(36).slice(2) + '@ursprungskraft.net', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
        'DTSTART:' + tag + 'T090000', 'DTEND:' + tag + 'T091500', 'SUMMARY:' + titel(dg), 'DESCRIPTION:Zeit für deinen Fragebogen ' + dg.kurz + ': ' + link, 'URL:' + link,
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + titel(dg), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT'); });
    z.push('END:VCALENDAR');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([z.join('\r\n')], { type: 'text/calendar' })); a.download = 'Fragebogen-Erinnerung.ics'; a.click();
  };
  return `<div class="kal-knoepfe"><button type="button" class="knopf" onclick="__ics()">In meinen Kalender (iPhone, Mac, Outlook)</button> ${google}</div>`;
}

function danke() {
  const vorname = esc((kontakt.vorname || '').replace(/^Beispiel /, ''));
  const naechster = DURCHGAENGE[durchgang];
  const start = bisher[0];
  let html = `<div class="bereich">Danke${vorname ? ', ' + vorname : ''}</div>`;
  if (durchgang === 1) {
    const link = location.origin + location.pathname + '?k=' + encodeURIComponent(token);
    html += `<h1>Dein Start ist festgehalten</h1>
      <p>In zwei Wochen und in vier Wochen beantwortest du dieselben Fragen noch einmal. Dann siehst du schwarz auf weiß, was sich verändert hat. Damit du es nicht vergisst, trag dir die beiden Termine gleich in deinen Kalender ein, der Link ist schon drin:</p>
      ${kalenderKnoepfe(link, [2, 3])}
      <p class="hilfe" style="margin-top:16px">Dein persönlicher Link, er gehört nur dir:</p>
      <p><input type="text" readonly value="${esc(link)}" id="link"></p>
      <div class="leiste"><span></span><button class="knopf" id="kopieren">Link kopieren</button></div>`;
  } else {
    const letzter = durchgang === DURCHGAENGE.length;
    html += `<h1>${letzter ? 'Das hat sich verändert' : 'Dein Zwischenstand'}</h1>`;
    if (letzter && start.antworten.brief) html += `<p class="hilfe">Dein Brief vom Start:</p><div class="brief-zu">${esc(start.antworten.brief)}</div>`;
    html += vergleichHtml(start.antworten, antworten, 'Start und heute im Vergleich');
    if (naechster) html += `<p class="hilfe" style="margin-top:18px">Am ${datum(plusTage(bisher[0].erstellt.slice(0, 10), naechster.tage))} kommt der letzte Durchgang. Dann siehst du deinen Vergleich über vier Wochen. Falls du ihn noch nicht im Kalender hast:</p>${kalenderKnoepfe(location.origin + location.pathname + '?k=' + encodeURIComponent(token), [naechster.nr])}`;
  }
  zeige(html, 1);
  $('#schritt').textContent = 'fertig';
  if ($('#kopieren')) $('#kopieren').onclick = async () => {
    try { await navigator.clipboard.writeText($('#link').value); $('#kopieren').textContent = 'Kopiert'; } catch (e) { $('#link').select(); }
  };
}

function fertigAlle() {
  const start = bisher[0], ende = bisher[bisher.length - 1];
  zeige(`<div class="bereich">${esc(MARKE.name)}</div><h1>Du hast alle drei Male ausgefüllt</h1>
    ${start.antworten.brief ? `<p class="hilfe">Dein Brief vom Start:</p><div class="brief-zu">${esc(start.antworten.brief)}</div>` : ''}
    ${vergleichHtml(start.antworten, ende.antworten, 'Start und Ende im Vergleich')}`, 1);
}

laden();

/* ==========================================================================
   VIP GROUP · Geldtyp-Test · ABLAUF
   Stand: Entwurf. Fertig: Test, Auswertung, Formular, Story-Bild.
   Offen: echte Links und Webhook in EINSTELLUNGEN eintragen.
   ========================================================================== */

/* ---------- EINSTELLUNGEN: vor dem Livegang ausfüllen -------------------- */
const EINSTELLUNGEN = {
  videokursLink: '{{VIDEOKURS_LINK}}',     // Seite, auf der der kostenlose Videokurs startet
  terminLink: '{{TERMIN_LINK}}',           // Buchung kostenfreies Telefoncoaching (z. B. Calendly)
  datenschutzLink: '{{DATENSCHUTZ_LINK}}',
  impressumLink: '{{IMPRESSUM_LINK}}',
  webhook: '',                             // ANSCHLUSS: Make, Zapier, ManyChat oder CRM. Leer = nur Vorschau
  instagram: '@{{INSTAGRAM}}',             // erscheint auf dem Story-Bild
  stichwort: 'GELDTYP',                    // ManyChat-Stichwort, erscheint auf dem Story-Bild
  formular: 'nach_typ'                     // 'nach_typ' = Typ frei, Rest nach Eintrag. 'aus' = alles frei
};

/* ---------- Zustand ----------------------------------------------------- */
const SPEICHER = 'vip-geldtyp-v1';
const app = document.getElementById('app');
const reduziert = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);

let z = { antworten: {}, index: 0, lead: null, start: null };

function laden() {
  try { const s = JSON.parse(localStorage.getItem(SPEICHER) || 'null'); if (s && s.antworten) z = { ...z, ...s }; } catch (e) {}
}
function sichern() {
  try { localStorage.setItem(SPEICHER, JSON.stringify(z)); } catch (e) {}
}
function zuruecksetzen() {
  z = { antworten: {}, index: 0, lead: null, start: Date.now() };
  sichern();
}

/* ---------- Hilfen ------------------------------------------------------ */
const euro = (n) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' €';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const linkGesetzt = (l) => l && !l.includes('{{');
const ico = (inhalt, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${inhalt}</svg>`;
const PFEIL = '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>';
const HAKEN = '<path d="M20 6 9 17l-5-5"/>';
const ZURUECK = '<path d="m15 18-6-6 6-6"/>';
const SCHLOSS = '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
const PLAY = '<polygon points="6 3 20 12 6 21 6 3"/>';
const TELEFON = '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>';
const TEILEN = '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>';

function aktiveFragen() {
  const k = kennzahlen();
  return FRAGEN.filter((f) => !f.wenn || f.wenn(k));
}

function anzeigen(html, fokus = true) {
  app.innerHTML = html;
  app.classList.remove('rein');
  void app.offsetWidth;
  if (!reduziert) app.classList.add('rein');
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  if (fokus) { const h = app.querySelector('h1, h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
}

/* ---------- Auswertung -------------------------------------------------- */
const KUERZEL = { v: 'versorger', m: 'vermehrer', p: 'planer', g: 'geniesser' };

function auswerten() {
  const punkte = { versorger: 0, vermehrer: 0, planer: 0, geniesser: 0 };
  const bereiche = {};
  for (const f of FRAGEN) {
    const i = z.antworten[f.id];
    if (i == null) continue;
    const a = f.antworten[i];
    if (a.t) for (const [k, v] of Object.entries(a.t)) punkte[KUERZEL[k]] += v;
    if (f.bereich) bereiche[f.bereich] = a.b;
  }
  const summe = Object.values(punkte).reduce((s, v) => s + v, 0) || 1;
  // Reihenfolge: Punkte, bei Gleichstand entscheidet die Antwort auf die Zukunftsfrage (f7)
  const f7 = z.antworten.f7 != null ? Object.keys(FRAGEN.find((f) => f.id === 'f7').antworten[z.antworten.f7].t)[0] : null;
  const rang = [...TYP_REIHE].sort((a, b) => (punkte[b] - punkte[a]) || ((KUERZEL[f7] === b) - (KUERZEL[f7] === a)));
  // Prozente, die genau 100 ergeben
  const roh = TYP_REIHE.map((t) => ({ t, p: (punkte[t] / summe) * 100 }));
  const mix = {}; let rest = 100;
  roh.forEach((r) => { mix[r.t] = Math.floor(r.p); rest -= mix[r.t]; });
  roh.sort((a, b) => (b.p - Math.floor(b.p)) - (a.p - Math.floor(a.p))).slice(0, rest).forEach((r) => mix[r.t]++);

  const werte = BEREICH_REIHE.map((b) => bereiche[b] ?? 0);
  const score = Math.round(werte.reduce((s, v) => s + v, 0) / werte.length);

  // Welches Video bringt am meisten? Lücke der Bereiche plus Tendenz des Typs
  const luecke = (...b) => b.reduce((s, x) => s + (100 - (bereiche[x] ?? 0)), 0) / b.length;
  const bedarf = {
    1: luecke('struktur', 'zahlen', 'reserve') + mix.geniesser * 0.4,
    2: luecke('schutz', 'kompass') + mix.versorger * 0.4 + mix.vermehrer * 0.2,
    3: luecke('strategie', 'reserve') + mix.planer * 0.4 + mix.vermehrer * 0.2
  };
  const empfehlung = Number(Object.keys(bedarf).sort((a, b) => bedarf[b] - bedarf[a])[0]);

  return { punkte, mix, haupt: rang[0], zweit: rang[1], bereiche, score, bedarf, empfehlung, zahlen: rechnen() };
}

function kennzahlen() {
  const k = {};
  for (const f of FRAGEN) {
    if (!f.kennzahl) continue;
    const i = z.antworten[f.id];
    k[f.kennzahl] = i == null ? undefined : f.antworten[i].k;
  }
  return k;
}

function rechnen() {
  const k = kennzahlen();
  if (k.einkommen == null || k.jahre == null) return null;
  // Lebenseinkommen grob: 80 % des heutigen Einkommens, weil man am Anfang meist weniger verdient
  const leben = Math.round((k.einkommen * 12 * k.jahre * 0.8) / 10000) * 10000;
  const da = k.behalten != null ? Math.round((leben * k.behalten) / 100 / 1000) * 1000 : null;
  const e = k.einkommen;
  return {
    einkommen: e, jahre: k.jahre, leben, behalten: k.behalten, da,
    spass: e * 0.1, spar: e * 0.2, gans: e * 0.1, mittel: e * 0.05, lang: e * 0.05,
    zehnJahre: e * 0.2 * 120
  };
}

function stufe(score) {
  if (score >= 80) return { name: 'Starkes Fundament', text: 'Du machst vieles richtig. Jetzt geht es um Feinschliff und die richtige Aufteilung.' };
  if (score >= 60) return { name: 'Solides Fundament', text: 'Die Basis steht. Einzelne Bereiche bremsen Dich noch aus.' };
  if (score >= 35) return { name: 'Fundament mit Lücken', text: 'Ansätze sind da, aber noch kein System. Genau da verlieren die meisten jedes Jahr Geld.' };
  return { name: 'Fundament fehlt', text: 'Du hast den größten Hebel noch vor Dir. Die gute Nachricht: Die ersten Schritte kosten keinen Euro.' };
}
const bewertung = (w) => (w >= 70 ? 'hoch' : w >= 40 ? 'mittel' : 'niedrig');

/* ---------- Bildschirm: Start ------------------------------------------- */
function startSeite() {
  const angefangen = Object.keys(z.antworten).length > 0 && !z.fertig;
  const anzahl = aktiveFragen().length;
  anzeigen(`
    <section class="start">
      <div class="hero">
        <img class="portrait" src="bilder/tobias-klein.webp" alt="" width="430" height="600">
        <div class="hero-text">
          <p class="eyebrow">VIP Academy · Geldtyp-Test</p>
          <h1 class="titel">Welcher <span class="gold">Geldtyp</span> bist Du?</h1>
          <p class="lead">Finde heraus, was Dich beim Thema Geld wirklich antreibt, wo Dein Fundament Lücken hat und welcher Schritt für Dich als Nächstes zählt.</p>
        </div>
      </div>
      <div class="kacheln">
        <div class="kachel"><span class="k">Fragen</span><span class="v">${anzahl}</span></div>
        <div class="kachel"><span class="k">Dauer</span><span class="v">~3 Min</span></div>
        <div class="kachel"><span class="k">Kosten</span><span class="v">0 €</span></div>
      </div>
      <div class="aktion">
        <button class="btn" id="los">${angefangen ? 'Weitermachen' : 'Test starten'} ${ico(PFEIL)}</button>
        ${angefangen ? '<button class="link" id="neu">Von vorne beginnen</button>' : ''}
      </div>
      <div class="typen-vorschau" aria-label="Die vier Geldtypen">
        ${TYP_REIHE.map((t) => `<div class="tv"><span class="tv-ico">${ico(TYPEN[t].icon)}</span><span class="tv-n">${TYPEN[t].kurz}</span><span class="tv-m">${TYPEN[t].motiv}</span></div>`).join('')}
      </div>
      <div class="absender">
        <img src="bilder/unterschrift.png" alt="Tobias Rethaber" class="unterschrift" width="461" height="308">
        <p class="meta">Entwickelt von Tobias Rethaber, Cashflow Experte Nr. 1. Auf Basis der vier Geldtypen aus seiner Konzeptplanung.</p>
      </div>
    </section>
  `);
  document.getElementById('los').onclick = () => {
    if (!angefangen) { zuruecksetzen(); ereignis('TestGestartet'); }
    frageSeite();
  };
  const neu = document.getElementById('neu');
  if (neu) neu.onclick = () => { zuruecksetzen(); ereignis('TestGestartet'); frageSeite(); };
}

/* ---------- Bildschirm: Frage ------------------------------------------- */
function frageSeite() {
  const liste = aktiveFragen();
  if (z.index >= liste.length) return analyseSeite();
  const f = liste[z.index];
  const gewaehlt = z.antworten[f.id];
  const fortschritt = Math.round((z.index / liste.length) * 100);
  anzeigen(`
    <section class="frage">
      <div class="fortschritt" role="progressbar" aria-valuemin="0" aria-valuemax="${liste.length}" aria-valuenow="${z.index}" aria-label="Fortschritt">
        <div class="fill" style="width:${fortschritt}%"></div>
      </div>
      <div class="frage-kopf">
        <p class="eyebrow">Teil ${f.teil} von 3 · ${TEILE[f.teil]}</p>
        <p class="zaehler mono">${String(z.index + 1).padStart(2, '0')} / ${String(liste.length).padStart(2, '0')}</p>
      </div>
      <h2 class="frage-titel">${esc(f.frage)}</h2>
      ${f.hinweis ? `<p class="hinweis">${esc(f.hinweis)}</p>` : ''}
      <div class="optionen" role="group" aria-label="Antworten">
        ${f.antworten.map((a, i) => `
          <button class="option${gewaehlt === i ? ' an' : ''}" data-i="${i}" aria-pressed="${gewaehlt === i}">
            <span class="taste mono">${String.fromCharCode(65 + i)}</span>
            <span class="otext">${esc(a.text)}</span>
          </button>`).join('')}
      </div>
      <div class="frage-fuss">
        <button class="link zurueck" id="zurueck">${ico(ZURUECK)} ${z.index === 0 ? 'Zum Start' : 'Zurück'}</button>
      </div>
    </section>
  `);
  app.querySelectorAll('.option').forEach((b) => (b.onclick = () => waehlen(f, Number(b.dataset.i), b)));
  document.getElementById('zurueck').onclick = () => {
    if (z.index === 0) return startSeite();
    z.index--; sichern(); frageSeite();
  };
}

let sperre = false;
function waehlen(f, i, knopf) {
  if (sperre) return;
  sperre = true;
  z.antworten[f.id] = i;
  // Antworten auf ausgeblendete Folgefragen verwerfen
  FRAGEN.forEach((x) => { if (x.wenn && !x.wenn(kennzahlen())) delete z.antworten[x.id]; });
  app.querySelectorAll('.option').forEach((b) => { b.classList.remove('an'); b.setAttribute('aria-pressed', 'false'); });
  knopf.classList.add('an'); knopf.setAttribute('aria-pressed', 'true');
  z.index++; sichern();
  setTimeout(() => { sperre = false; frageSeite(); }, reduziert ? 60 : 260);
}

document.addEventListener('keydown', (e) => {
  if (!app.querySelector('.frage') || e.altKey || e.ctrlKey || e.metaKey) return;
  const t = e.key.toUpperCase();
  const i = t.length === 1 ? t.charCodeAt(0) - 65 : -1;
  const n = /^[1-6]$/.test(e.key) ? Number(e.key) - 1 : i;
  const b = app.querySelectorAll('.option')[n];
  if (b && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); b.click(); }
});

/* ---------- Bildschirm: Analyse ----------------------------------------- */
function analyseSeite() {
  z.fertig = true; sichern();
  ereignis('TestAbgeschlossen', { geldtyp: auswerten().haupt });
  const schritte = ['Geldtyp bestimmen', 'Fundament in sechs Bereichen prüfen', 'Deine Zahlen rechnen'];
  anzeigen(`
    <section class="analyse">
      <p class="eyebrow">Auswertung</p>
      <h2 class="frage-titel">Deine Antworten werden ausgewertet</h2>
      <ul class="schritte-liste">
        ${schritte.map((s, i) => `<li data-i="${i}"><span class="punkt">${ico(HAKEN)}</span>${s}</li>`).join('')}
      </ul>
    </section>
  `);
  const li = app.querySelectorAll('.schritte-liste li');
  const takt = reduziert ? 0 : 520;
  li.forEach((el, i) => setTimeout(() => el.classList.add('ok'), takt * (i + 0.6)));
  setTimeout(typSeite, reduziert ? 200 : takt * 3.4);
}

/* ---------- Bildschirm: Geldtyp (+ Formular) ----------------------------- */
function mixBalken(r) {
  return TYP_REIHE.slice().sort((a, b) => r.mix[b] - r.mix[a]).map((t) => `
    <div class="mix-zeile${t === r.haupt ? ' haupt' : ''}">
      <span class="mix-n">${TYPEN[t].kurz}</span>
      <span class="mix-track"><span class="mix-fill" style="width:${r.mix[t]}%"></span></span>
      <span class="mix-v mono">${r.mix[t]} %</span>
    </div>`).join('');
}

function typKopf(r, gross = true) {
  const T = TYPEN[r.haupt];
  return `
    <div class="typ-kopf">
      <span class="icon-hero">${ico(T.icon, 'lg')}</span>
      <div>
        <p class="eyebrow">Dein Geldtyp</p>
        <${gross ? 'h1' : 'h2'} class="typ-name">${T.name}</${gross ? 'h1' : 'h2'}>
        <p class="typ-motiv">Motiv: <b>${T.motiv}</b></p>
      </div>
    </div>`;
}

function typSeite() {
  const r = auswerten();
  const T = TYPEN[r.haupt];
  const frei = EINSTELLUNGEN.formular === 'aus' || z.lead;
  anzeigen(`
    <section class="typ">
      ${typKopf(r)}
      <blockquote class="zitat"><p>„${T.zitat}“</p></blockquote>
      <p class="lead">${T.satz} Dein zweitstärkster Anteil: <b>${TYPEN[r.zweit].kurz}</b>.</p>
      <div class="karte mix">
        <p class="label">Deine Mischung</p>
        ${mixBalken(r)}
        <p class="meta">Niemand ist nur ein Typ. Entscheidend ist, welcher Anteil Deine Geldentscheidungen führt.</p>
      </div>
      ${frei ? `<div class="aktion"><button class="btn" id="weiter">Vollständige Auswertung ansehen ${ico(PFEIL)}</button></div>` : formular(r)}
    </section>
  `);
  if (frei) document.getElementById('weiter').onclick = ergebnisSeite;
  else formularBinden();
}

function formular(r) {
  const vor = esc(z.leadEntwurf?.vorname ?? params.get('vorname') ?? '');
  const mail = esc(z.leadEntwurf?.email ?? params.get('email') ?? '');
  return `
    <form class="karte gold tor" id="tor" novalidate>
      <div class="tor-kopf">
        <span class="icon-sq">${ico(SCHLOSS)}</span>
        <div>
          <p class="label gold-text">Deine vollständige Auswertung ist fertig</p>
          <h2 class="block-titel">Wohin dürfen wir sie Dir schicken?</h2>
        </div>
      </div>
      <ul class="bullets">
        <li><span class="dash"></span>Stärke, Falle und Hebel des ${TYPEN[r.haupt].kurz}s</li>
        <li><span class="dash"></span>Dein Fundament in sechs Bereichen, von 0 bis 100</li>
        <li><span class="dash"></span>Deine Zahlen: Lebenseinkommen und 3-Konten-Modell</li>
        <li><span class="dash"></span>Welches Video aus dem kostenlosen Videokurs Dir am meisten bringt</li>
      </ul>
      <div class="felder">
        <label class="feld"><span>Vorname</span><input id="vorname" name="vorname" autocomplete="given-name" required value="${vor}"></label>
        <label class="feld"><span>E-Mail</span><input id="email" name="email" type="email" autocomplete="email" inputmode="email" required value="${mail}"></label>
        <label class="feld"><span>Handynummer <i>optional</i></span><input id="handy" name="handy" type="tel" autocomplete="tel" inputmode="tel"></label>
      </div>
      <label class="einwilligung">
        <input type="checkbox" id="ok" required>
        <span>Ich möchte meine Auswertung und den Zugang zum kostenlosen Videokurs per E-Mail erhalten. Die VIP Group darf mich dazu kontaktieren. Abmelden geht jederzeit. <a href="${linkGesetzt(EINSTELLUNGEN.datenschutzLink) ? EINSTELLUNGEN.datenschutzLink : '#'}" target="_blank" rel="noopener">Datenschutz</a></span>
      </label>
      <p class="fehler" id="fehler" role="alert" hidden></p>
      <button class="btn voll" type="submit" id="senden">Auswertung freischalten ${ico(PFEIL)}</button>
    </form>`;
}

function formularBinden() {
  const f = document.getElementById('tor');
  const fehler = document.getElementById('fehler');
  f.addEventListener('input', () => {
    z.leadEntwurf = { vorname: f.vorname.value, email: f.email.value }; sichern();
  });
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const vorname = f.vorname.value.trim();
    const email = f.email.value.trim();
    const handy = f.handy.value.trim();
    let meldung = '';
    if (!vorname) meldung = 'Bitte trag Deinen Vornamen ein.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) meldung = 'Bitte prüf Deine E-Mail-Adresse. Sie sieht unvollständig aus.';
    else if (!f.ok.checked) meldung = 'Bitte bestätige, dass wir Dir die Auswertung schicken dürfen.';
    if (meldung) { fehler.textContent = meldung; fehler.hidden = false; return; }
    fehler.hidden = true;
    const knopf = document.getElementById('senden');
    knopf.disabled = true; knopf.innerHTML = 'Wird freigeschaltet …';
    z.lead = { vorname, email, handy, zeit: new Date().toISOString() };
    sichern();
    await leadSenden(datenpaket());
    ereignis('Lead', { geldtyp: auswerten().haupt });
    ergebnisSeite();
  });
}

/* ---------- Bildschirm: Ergebnis ---------------------------------------- */
function ergebnisSeite() {
  const r = auswerten();
  const T = TYPEN[r.haupt];
  const Z = TYPEN[r.zweit];
  const s = stufe(r.score);
  const n = r.zahlen;
  const name = z.lead?.vorname ? `${esc(z.lead.vorname)}, ` : '';
  const vk = linkGesetzt(EINSTELLUNGEN.videokursLink) ? zielLink(EINSTELLUNGEN.videokursLink, r) : '#';
  const tl = linkGesetzt(EINSTELLUNGEN.terminLink) ? zielLink(EINSTELLUNGEN.terminLink, r) : '#';
  const stimme = STIMMEN[r.haupt === 'geniesser' || r.haupt === 'planer' ? 0 : 1];
  const schwach = BEREICH_REIHE.slice().sort((a, b) => r.bereiche[a] - r.bereiche[b]).slice(0, 2);

  anzeigen(`
    <section class="ergebnis">
      ${typKopf(r)}
      <p class="lead">${name}${T.satz} Das ist Deine größte Stärke und zugleich Deine größte Falle.</p>

      <div class="block">
        <p class="eyebrow">01 · Dein Profil</p>
        <div class="profil">
          <div class="karte"><p class="label">Deine Stärke</p><p>${T.staerke}</p></div>
          <div class="karte neg"><p class="label">Deine Falle</p><p>${T.falle}</p></div>
          <div class="karte flach"><p class="label">Was es Dich kostet</p><p>${T.kosten}</p></div>
          <div class="karte gold"><p class="label gold-text">Dein Hebel</p><p>${T.hebel}</p></div>
        </div>
        <div class="zweit">
          <span class="icon-sq">${ico(Z.icon)}</span>
          <p><b>Dein Zweittyp: ${Z.name} (${r.mix[r.zweit]}&nbsp;%).</b> Motiv ${Z.motiv}. ${Z.satz} ${r.mix[r.zweit] >= 30 ? 'Dieser Anteil ist fast so stark wie Dein Haupttyp und entscheidet oft mit.' : 'Dieser Anteil meldet sich vor allem, wenn es um größere Entscheidungen geht.'}</p>
        </div>
      </div>

      <div class="block">
        <p class="eyebrow">02 · Dein Fundament</p>
        <div class="score">
          <div class="score-zahl"><span class="mono gross">${r.score}</span><span class="mono klein">/ 100</span></div>
          <div class="score-text"><h2 class="block-titel">${s.name}</h2><p>${s.text}</p></div>
        </div>
        <div class="fortschritt dick"><div class="fill" style="width:${r.score}%"></div></div>
        <div class="bereiche">
          ${BEREICH_REIHE.map((b) => {
            const B = BEREICHE[b]; const w = r.bereiche[b]; const st = bewertung(w);
            return `
            <div class="bereich ${st}${schwach.includes(b) ? ' schwach' : ''}">
              <div class="b-kopf"><span class="b-n">${B.name}</span><span class="b-v mono">${w}</span></div>
              <div class="b-track"><span style="width:${Math.max(w, 3)}%"></span></div>
              <p class="b-t">${B[st]}</p>
              <p class="b-video">Thema in Video ${B.video}</p>
            </div>`;
          }).join('')}
        </div>
      </div>

      ${n ? `
      <div class="block">
        <p class="eyebrow">03 · Deine Zahlen</p>
        <h2 class="block-titel">Zwei Zahlen, die kaum jemand kennt</h2>
        <div class="kpis">
          <div class="kpi"><span class="k">Bisher verdient</span><span class="v mono">~ ${euro(n.leben)}</span><span class="d">grob überschlagen mit 80 % Deines heutigen Einkommens über ${n.jahre} Jahre</span></div>
          ${n.da != null ? `<div class="kpi gold"><span class="k">Davon noch da</span><span class="v mono">~ ${euro(n.da)}</span><span class="d">nach Deiner Schätzung von ${n.behalten === 5 ? 'unter 10' : n.behalten} %</span></div>` : ''}
        </div>
        ${n.da != null ? `<p class="merksatz">${n.behalten >= 50 ? 'Du hast mehr behalten als die meisten. Jetzt geht es darum, dass es auch arbeitet.' : `Rund ${euro(n.leben - n.da)} sind durch Deine Hände gegangen und weg. Nicht weil Du zu wenig verdienst, sondern weil zuerst alle anderen bezahlt wurden.`}</p>` : ''}

        <h3 class="unter-titel">Das 3-Konten-Modell bei Deinem Einkommen</h3>
        <div class="tabelle-wrap">
          <table class="vip">
            <thead><tr><th>Konto</th><th class="r">Anteil</th><th class="r">pro Monat</th></tr></thead>
            <tbody>
              <tr><td class="name">Einkommen netto</td><td class="num">100 %</td><td class="num">${euro(n.einkommen)}</td></tr>
              <tr><td class="name">Spaßkonto <small>zum Ausgeben, ohne schlechtes Gewissen</small></td><td class="num">10 %</td><td class="num">${euro(n.spass)}</td></tr>
              <tr><td class="name">Sparkonto <small>wird dreifach verteilt</small></td><td class="num">20 %</td><td class="num">${euro(n.spar)}</td></tr>
              <tr><td class="name sub">Goldene Gans</td><td class="num">50 % davon</td><td class="num">${euro(n.gans)}</td></tr>
              <tr><td class="name sub">Mittelfristig</td><td class="num">25 % davon</td><td class="num">${euro(n.mittel)}</td></tr>
              <tr><td class="name sub">Langfristig</td><td class="num">25 % davon</td><td class="num">${euro(n.lang)}</td></tr>
              <tr class="summe"><td class="name">Für Dich selbst reserviert</td><td class="num">30 %</td><td class="num">${euro(n.spass + n.spar)}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="quelle">Modell aus Video 1 · gerechnet mit Deiner Angabe von etwa ${euro(n.einkommen)} netto · Beispielrechnung, keine Anlageberatung</p>
        <p class="merksatz">Allein durch die Reihenfolge liegen nach zehn Jahren <b class="gold-text">${euro(n.zehnJahre)}</b> auf Deinen Sparkonten. Ohne einen Euro mehr zu verdienen und ohne einen Euro Rendite.</p>
      </div>` : ''}

      <div class="block pitch">
        <p class="eyebrow">${n ? '04' : '03'} · Dein nächster Schritt</p>
        <h2 class="titel-m">Der kostenlose Videokurs von Tobias Rethaber</h2>
        <p class="lead">Drei Videos, die genau die Bereiche abdecken, die Du gerade bewertet hast. Vom Konten-System über die Regeln, die ein Investment erfüllen muss, bis zur Strategie der Vermögenden. Schau sie der Reihe nach. Für Dich als ${T.kurz} ist <b>Video ${r.empfehlung}</b> das wichtigste.</p>
        <div class="videos">
          ${VIDEOS.map((v) => `
            <div class="video${v.nr === r.empfehlung ? ' empfohlen' : ''}">
              <div class="v-kopf">
                <span class="v-nr mono">Video ${v.nr}</span>
                ${v.nr === r.empfehlung ? '<span class="badge gold">Für Dich am wichtigsten</span>' : ''}
              </div>
              <h3>${v.titel}</h3>
              <ul>${v.punkte.map((p) => `<li>${p}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>
        <a class="btn voll" id="videokurs" href="${vk}" target="_blank" rel="noopener">${ico(PLAY)} Videokurs kostenlos starten</a>
        <p class="meta mitte">Kostenlos und ohne Verpflichtung.</p>
      </div>

      <div class="block">
        <div class="stimme">
          <span class="quote-mark">„</span>
          <p class="q">${stimme.text}</p>
          <p class="attrib"><span class="ln"></span>${stimme.name}${stimme.rolle ? ` · ${stimme.rolle}` : ''}</p>
        </div>
        <div class="berater">
          <span class="ring"><img src="bilder/tobias-klein.webp" alt="Tobias Rethaber" width="430" height="600"></span>
          <div>
            <p class="b-name">Tobias Rethaber</p>
            <p class="b-rolle">Cashflow Experte Nr. 1 · VIP Group</p>
            <p class="b-text">Lieber direkt sprechen? 45 Minuten kostenfreies Telefoncoaching, Deine Zahlen auf Deine Situation gerechnet.</p>
            <a class="btn zweit-btn" id="termin" href="${tl}" target="_blank" rel="noopener">${ico(TELEFON)} Coaching buchen</a>
          </div>
        </div>
      </div>

      <div class="block teilen">
        <p class="eyebrow">Teilen</p>
        <h2 class="block-titel">Dein Geldtyp als Story</h2>
        <p>Zeig Deinen Geldtyp in Deiner Story und finde heraus, welcher Typ Dein Partner oder Deine Freunde sind.</p>
        <button class="btn zweit-btn" id="story">${ico(TEILEN)} Story-Bild erstellen</button>
        <div class="story-ausgabe" id="storyAusgabe" hidden></div>
      </div>

      <div class="abschluss">
        <button class="link" id="nochmal">Test neu starten</button>
        <p class="rechtlich">Der Geldtyp-Test dient der Selbsteinschätzung und der Wissensvermittlung. Er ist keine Anlage- oder Steuerberatung. Alle Zahlen sind grobe Beispielrechnungen auf Basis Deiner Angaben. Vergangenheitswerte sind keine Garantie für zukünftige Entwicklungen.</p>
      </div>
    </section>
  `);

  const hinweisFehlt = (e, was) => {
    if (e.currentTarget.getAttribute('href') !== '#') { ereignis(was); return; }
    e.preventDefault();
    toast('Vorschau: Der Link wird in quiz.js unter EINSTELLUNGEN eingetragen.');
  };
  document.getElementById('videokurs').onclick = (e) => hinweisFehlt(e, 'VideokursGeklickt');
  document.getElementById('termin').onclick = (e) => hinweisFehlt(e, 'TerminGeklickt');
  document.getElementById('story').onclick = storyBild;
  document.getElementById('nochmal').onclick = () => { zuruecksetzen(); startSeite(); };
}

/* ---------- Links mit Merkmalen für die Folgeseite ----------------------- */
function zielLink(basis, r) {
  try {
    const u = new URL(basis);
    u.searchParams.set('geldtyp', r.haupt);
    u.searchParams.set('fundament', r.score);
    u.searchParams.set('video', r.empfehlung);
    if (z.lead?.vorname) u.searchParams.set('vorname', z.lead.vorname);
    if (z.lead?.email) u.searchParams.set('email', z.lead.email);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((k) => { if (params.get(k)) u.searchParams.set(k, params.get(k)); });
    return u.toString();
  } catch (e) { return basis; }
}

/* ---------- Datenpaket für CRM / ManyChat -------------------------------- */
function datenpaket() {
  const r = auswerten();
  return {
    vorname: z.lead?.vorname, email: z.lead?.email, handy: z.lead?.handy || '',
    geldtyp: r.haupt, geldtyp_name: TYPEN[r.haupt].name, zweittyp: r.zweit,
    mischung: r.mix, fundament: r.score, fundament_stufe: stufe(r.score).name,
    bereiche: r.bereiche, empfohlenes_video: r.empfehlung,
    einkommen_monat: r.zahlen?.einkommen ?? null, lebenseinkommen: r.zahlen?.leben ?? null,
    antworten: Object.fromEntries(FRAGEN.filter((f) => z.antworten[f.id] != null).map((f) => [f.id, f.antworten[z.antworten[f.id]].text])),
    quelle: Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'quelle'].map((k) => [k, params.get(k) || ''])),
    einwilligung: true, zeit: new Date().toISOString(), seite: location.href.split('?')[0]
  };
}

// ANSCHLUSS: schickt den Lead an Make, Zapier, ManyChat oder das CRM (EINSTELLUNGEN.webhook)
async function leadSenden(daten) {
  if (!EINSTELLUNGEN.webhook) { console.log('Vorschau, nichts gesendet:', daten); return { ok: true, vorschau: true }; }
  try {
    // text/plain vermeidet die CORS-Vorabfrage, Make und Zapier lesen das JSON trotzdem
    await fetch(EINSTELLUNGEN.webhook, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(daten), keepalive: true });
    return { ok: true };
  } catch (e) {
    console.warn('Lead konnte nicht gesendet werden', e);
    return { ok: false };
  }
}

// ANSCHLUSS: Messung (z. B. Meta-Pixel). Feuert nur, wenn ein Pixel eingebunden ist
function ereignis(name, daten = {}) {
  try {
    if (window.fbq) window.fbq(name === 'Lead' ? 'track' : 'trackCustom', name, daten);
    if (window.dataLayer) window.dataLayer.push({ event: 'geldtyp_' + name, ...daten });
  } catch (e) {}
}

/* ---------- Kurze Meldung ----------------------------------------------- */
function toast(text) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = text; t.classList.add('zeigen');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('zeigen'), 3200);
}

/* ---------- Story-Bild 1080 × 1920 -------------------------------------- */
function bildLaden(src) {
  return new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
}

async function storyBild() {
  const r = auswerten();
  const T = TYPEN[r.haupt];
  const knopf = document.getElementById('story');
  knopf.disabled = true;
  try { await document.fonts.ready; } catch (e) {}
  const [logo, portrait] = await Promise.all([bildLaden('bilder/vip-logo.png'), bildLaden('bilder/tobias.webp')]);
  const W = 1080, H = 1920;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');

  // Grund mit leichtem Schimmer oben links
  x.fillStyle = '#12171c'; x.fillRect(0, 0, W, H);
  const sch = x.createRadialGradient(200, -200, 0, 200, -200, 1500);
  sch.addColorStop(0, 'rgba(230,235,240,0.10)'); sch.addColorStop(1, 'rgba(230,235,240,0)');
  x.fillStyle = sch; x.fillRect(0, 0, W, H);

  // Portrait rechts unten, ausgeblendet
  if (portrait) {
    const pw = 760, ph = pw * (portrait.height / portrait.width);
    x.save(); x.globalAlpha = 0.28; x.drawImage(portrait, W - pw + 120, H - ph - 120, pw, ph); x.restore();
    const ab = x.createLinearGradient(0, H - 700, 0, H);
    ab.addColorStop(0, 'rgba(18,23,28,0)'); ab.addColorStop(0.6, 'rgba(18,23,28,0.92)'); ab.addColorStop(1, '#12171c');
    x.fillStyle = ab; x.fillRect(0, H - 700, W, 700);
  }

  const gold = x.createLinearGradient(0, 0, W, 0);
  gold.addColorStop(0, '#a8923a'); gold.addColorStop(0.48, '#d4b868'); gold.addColorStop(1, '#eedfa0');
  const L = 96;

  if (logo) x.drawImage(logo, L, 150, 360, 360 * (logo.height / logo.width));

  x.fillStyle = '#d4b868'; x.font = '600 30px Inter, Arial, sans-serif';
  if ('letterSpacing' in x) x.letterSpacing = '7px';
  x.fillText('MEIN GELDTYP', L, 470);
  if ('letterSpacing' in x) x.letterSpacing = '0px';

  x.fillStyle = '#e6ebf0'; x.font = '700 64px Inter, Arial, sans-serif';
  x.fillText('Der', L, 570);
  x.fillStyle = '#ffffff'; x.font = '800 128px Inter, Arial, sans-serif';
  const wort = T.kurz;
  let g = 128; while (x.measureText(wort).width > W - 2 * L && g > 70) { g -= 4; x.font = `800 ${g}px Inter, Arial, sans-serif`; }
  x.fillText(wort, L, 700);

  x.fillStyle = gold; x.fillRect(L, 750, 150, 10);

  x.fillStyle = '#a9b2ba'; x.font = '500 40px Inter, Arial, sans-serif';
  x.fillText('Motiv: ' + T.motiv, L, 840);

  x.fillStyle = '#e6ebf0'; x.font = 'italic 600 52px "Playfair Display", Georgia, serif';
  umbrechen(x, '„' + T.zitat + '“', L, 950, W - 2 * L, 70);

  // Mischung
  let y = 1140;
  TYP_REIHE.slice().sort((a, b) => r.mix[b] - r.mix[a]).forEach((t) => {
    const haupt = t === r.haupt;
    x.fillStyle = haupt ? '#ffffff' : '#a9b2ba'; x.font = `${haupt ? 700 : 500} 34px Inter, Arial, sans-serif`;
    x.fillText(TYPEN[t].kurz, L, y);
    x.font = '700 34px "JetBrains Mono", monospace'; x.textAlign = 'right';
    x.fillText(r.mix[t] + ' %', W - L, y); x.textAlign = 'left';
    x.fillStyle = 'rgba(255,255,255,0.08)'; rund(x, L, y + 22, W - 2 * L, 16, 8); x.fill();
    x.fillStyle = haupt ? gold : 'rgba(255,255,255,0.28)'; rund(x, L, y + 22, Math.max(16, (W - 2 * L) * r.mix[t] / 100), 16, 8); x.fill();
    y += 112;
  });

  // Aufruf unten
  x.fillStyle = '#ffffff'; x.font = '800 62px Inter, Arial, sans-serif';
  x.fillText('Welcher Geldtyp bist Du?', L, 1690);
  x.fillStyle = '#cdd4db'; x.font = '500 38px Inter, Arial, sans-serif';
  x.fillText('Kommentiere „' + EINSTELLUNGEN.stichwort + '“ und mach den Test.', L, 1760);
  if (!EINSTELLUNGEN.instagram.includes('{{')) { x.fillStyle = '#d4b868'; x.font = '600 36px Inter, Arial, sans-serif'; x.fillText(EINSTELLUNGEN.instagram, L, 1820); }

  const blob = await new Promise((ok) => c.toBlob(ok, 'image/png'));
  const url = URL.createObjectURL(blob);
  const aus = document.getElementById('storyAusgabe');
  const datei = new File([blob], `geldtyp-${r.haupt}.png`, { type: 'image/png' });
  const teilbar = navigator.canShare && navigator.canShare({ files: [datei] });
  aus.innerHTML = `
    <img src="${url}" alt="Story-Bild: ${T.name}" width="1080" height="1920">
    <div class="story-knoepfe">
      ${teilbar ? `<button class="btn" id="teilenJetzt">${ico(TEILEN)} Teilen</button>` : ''}
      <a class="btn ${teilbar ? 'zweit-btn' : ''}" href="${url}" download="geldtyp-${r.haupt}.png">Bild speichern</a>
    </div>
    <p class="meta">Am Handy: Bild gedrückt halten und in Fotos sichern. Dann in der Instagram-Story einfügen.</p>`;
  aus.hidden = false;
  const tj = document.getElementById('teilenJetzt');
  if (tj) tj.onclick = async () => { try { await navigator.share({ files: [datei], title: T.name }); ereignis('StoryGeteilt'); } catch (e) {} };
  knopf.disabled = false;
  aus.scrollIntoView({ behavior: reduziert ? 'auto' : 'smooth', block: 'start' });
  ereignis('StoryErstellt', { geldtyp: r.haupt });
}

function umbrechen(x, text, l, y, breite, zeile) {
  const woerter = text.split(' '); let z1 = '';
  for (const w of woerter) {
    const probe = z1 ? z1 + ' ' + w : w;
    if (x.measureText(probe).width > breite && z1) { x.fillText(z1, l, y); z1 = w; y += zeile; } else z1 = probe;
  }
  x.fillText(z1, l, y);
}
function rund(x, l, o, b, h, r) {
  x.beginPath(); x.moveTo(l + r, o); x.arcTo(l + b, o, l + b, o + h, r); x.arcTo(l + b, o + h, l, o + h, r);
  x.arcTo(l, o + h, l, o, r); x.arcTo(l, o, l + b, o, r); x.closePath();
}

/* ---------- Fußzeile und Start ------------------------------------------ */
function fusszeile() {
  const f = document.getElementById('fuss');
  const ds = linkGesetzt(EINSTELLUNGEN.datenschutzLink) ? EINSTELLUNGEN.datenschutzLink : '#';
  const im = linkGesetzt(EINSTELLUNGEN.impressumLink) ? EINSTELLUNGEN.impressumLink : '#';
  f.innerHTML = `<img src="bilder/tobias-rethaber-logo.png" alt="Tobias Rethaber, Cashflow Experte Nr. 1" class="tr-logo" width="900" height="142">
    <nav><a href="${im}" target="_blank" rel="noopener">Impressum</a><a href="${ds}" target="_blank" rel="noopener">Datenschutz</a></nav>`;
}

laden();
fusszeile();
if (params.get('neu') === '1') zuruecksetzen();
if (z.fertig && (z.lead || EINSTELLUNGEN.formular === 'aus')) ergebnisSeite();
else if (z.fertig) typSeite();
else startSeite();

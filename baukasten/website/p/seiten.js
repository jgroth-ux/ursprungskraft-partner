// Partnerseiten aus dem Baukasten (11.11.2026). Eine Datei für alle drei Fassungen und alle Partner.
// 1. Liest aus der Adresse, wer es ist: /p/<adresse>/<fassung> (online) oder ?seite=<adresse> (lokal).
// 2. Holt die Angaben über die öffentliche Funktion uk_seite_oeffentlich (nur Name, Foto, Rolle, Satz, Instagram,
//    Telefon und E-Mail nur, wenn der Partner sie freigegeben hat) und setzt sie in die Seite.
// 3. Formulare: Leads gehen wie bei Kevin und Johny an die Edge Function partner-lead, mit von = kurz des Partners.
// Vorschau ohne Datenbank: lokal (localhost) oder mit ?demo kommen die Angaben aus vorschau-daten.js.
// Im Portal: ?vorschau=portal, dann schickt das Portal die Angaben beim Tippen per postMessage.
(function () {
  'use strict';
  const SUPABASE = 'https://XXX.supabase.co';
  const OEFFENTLICH = 'sb_publishable_XXX'; // derselbe öffentliche Schlüssel wie in dashboard/daten.js
  const LEADS = SUPABASE + '/functions/v1/partner-lead';
  const FASSUNG = document.body.dataset.fassung;
  const FASSUNGEN = ['neutral', 'sport', 'gesundheit'];
  const q = new URLSearchParams(location.search);
  const PORTAL = q.get('vorschau') === 'portal';
  const LOKAL = ['localhost', '127.0.0.1', ''].includes(location.hostname) || location.protocol === 'file:';
  const DEMO = !PORTAL && (q.has('demo') || LOKAL);
  const BUDGET = { jetzt: 'Passt, will sich konkret informieren', bald: 'Eher in den nächsten Monaten', nein: 'Will sich erst mal umschauen' };
  const STUFE = { jetzt: 'heiß', bald: 'warm' };
  const $ = (s, w = document) => w.querySelector(s);
  const $$ = (s, w = document) => [...w.querySelectorAll(s)];
  const t = (x) => String(x ?? '').trim();
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICO_INSTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></svg>';
  let P = null; // Angaben des Partners

  // ---------- Wer ist es? ----------
  function adresseLesen() {
    const teile = location.pathname.split('/').filter(Boolean);
    // /p/<adresse>/<fassung> oder /p/<adresse>
    if (teile[0] === 'p' && teile[1] && !teile[1].includes('.')) return { adresse: teile[1].toLowerCase(), fassung: FASSUNGEN.includes(teile[2]) ? teile[2] : null };
    return { adresse: t(q.get('seite')).toLowerCase() || (DEMO ? 'max-muster' : ''), fassung: FASSUNG };
  }
  // Schöne Adresse /p/<adresse>/<fassung>. Lokal ohne Weiterleitung (Datei direkt geöffnet) die Datei mit ?seite=
  const huebsch = () => /^\/p\/[a-z0-9-]+(\/|$)/.test(location.pathname) && !location.pathname.endsWith('.html');
  const seitenPfad = (adresse, fassung) => (DEMO && !huebsch() ? `/p/${fassung}.html?seite=${encodeURIComponent(adresse)}&demo` : `/p/${adresse}/${fassung}${DEMO && q.has('demo') ? '?demo' : ''}`);
  const ebookPfad = () => (DEMO || PORTAL ? `/p/vorschau/ebook-${FASSUNG}.pdf` : `/p/${P.adresse}/${FASSUNG}/e-book`);

  async function holen(adresse, fassung) {
    if (DEMO) {
      await skript('/p/vorschau-daten.js');
      return window.SeitenVorschau.seite(adresse, fassung);
    }
    const r = await fetch(SUPABASE + '/rest/v1/rpc/uk_seite_oeffentlich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: OEFFENTLICH, Authorization: `Bearer ${OEFFENTLICH}` },
      body: JSON.stringify({ p_adresse: adresse, p_fassung: fassung }),
    });
    if (!r.ok) throw new Error('Seite nicht geladen: ' + r.status);
    return r.json();
  }
  const skript = (src) => new Promise((ok, f) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = f; document.head.append(s); });

  // ---------- Angaben einsetzen ----------
  const initialen = (p) => `${t(p.vorname)[0] || ''}${t(p.nachname)[0] || ''}`.toUpperCase();
  function fotoSetzen(el, p) {
    el.replaceChildren();
    if (p.foto) {
      const img = new Image(); img.alt = el.closest('.hero-bild, .ueber') ? `${p.vorname} ${p.nachname}` : ''; img.src = p.foto;
      img.onerror = () => { img.remove(); fotoSetzen(el, { ...p, foto: null }); };
      el.append(img);
    } else {
      const s = document.createElement('span'); s.className = 'initialen'; s.textContent = initialen(p); s.setAttribute('aria-hidden', 'true'); el.append(s);
    }
  }
  function einsetzen(p) {
    P = p;
    const name = `${t(p.vorname)} ${t(p.nachname)}`.trim();
    const insta = t(p.insta).replace(/^@/, '');
    const werte = { name, vorname: t(p.vorname), rolle: t(p.rolle), satz: t(p.satz), insta };
    $$('[data-p]').forEach((el) => {
      const k = el.dataset.p;
      if (k === 'foto') return fotoSetzen(el, p);
      if (k === 'insta') { el.innerHTML = insta ? `${ICO_INSTA}@${esc(insta)}` : ''; el.href = insta ? `https://www.instagram.com/${encodeURIComponent(insta)}/` : '#'; return; }
      el.textContent = werte[k] ?? '';
    });
    const kontakt = !!(t(p.telefon) || t(p.email));
    $$('[data-wenn]').forEach((el) => { const k = el.dataset.wenn; el.hidden = k === 'kontakt' ? !kontakt : !werte[k]; });
    // Kontaktknöpfe nur, wenn der Partner Telefon oder E-Mail freigegeben hat
    $$('.kontaktwege').forEach((box) => {
      const tel = t(p.telefon).replace(/[^\d+]/g, '');
      let wa = tel.replace(/^00/, '').replace(/^\+/, ''); if (wa.startsWith('0')) wa = '49' + wa.slice(1);
      box.innerHTML = [
        tel && `<a class="knopf rahmen" href="tel:${esc(tel)}">Anrufen</a>`,
        tel && `<a class="knopf rahmen" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a>`,
        t(p.email) && `<a class="knopf rahmen" href="mailto:${esc(t(p.email))}">E-Mail</a>`,
      ].filter(Boolean).join('');
    });
    // Wer meldet sich? leads_bei = 'partner': der Partner selbst, sonst Daniel und Jasmin ("wir")
    const selbst = p.leads_bei === 'partner';
    $$('[data-partner]').forEach((el) => {
      if (el.dataset.team === undefined) el.dataset.team = el.textContent;
      el.textContent = selbst ? el.dataset.partner.replace('{v}', werte.vorname || 'Dein Ansprechpartner') : el.dataset.team;
    });
    if (document.body.dataset.titel && name) document.title = document.body.dataset.titel.replace('{name}', name);
    document.body.classList.remove('laedt');
  }

  function nichtDa() {
    document.body.classList.remove('laedt');
    document.body.classList.add('fehlt');
    $('.nicht-da').hidden = false;
    document.title = 'Seite nicht gefunden';
  }

  // ---------- Leads ----------
  async function melden(lead) {
    if (DEMO || PORTAL) { console.info('Vorschau: Lead nicht gesendet', lead); return; }
    const r = await fetch(LEADS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OEFFENTLICH}`, apikey: OEFFENTLICH },
      body: JSON.stringify({ von: P.von, ...lead, antworten: { ...(lead.antworten || {}), fassung: FASSUNG, seite: P.adresse } }),
    });
    if (!r.ok) throw new Error('Lead nicht gespeichert');
  }
  function buchZeigen(form, vorname) {
    const d = document.createElement('div'); d.className = 'danke';
    d.innerHTML = `<div class="eyebrow">Danke, ${esc(vorname)}</div><h3>Dein E-Book ist da</h3>
      <p>Du kannst es gleich öffnen und in Ruhe lesen.</p><a class="knopf" href="${ebookPfad()}" target="_blank" rel="noopener">E-Book öffnen</a>`;
    form.replaceWith(d);
  }
  function budgetWahl() {
    const b = new FormData($('#anfrage')).get('budget');
    $('#umschauen').hidden = b !== 'nein';
    $('#senden').textContent = b === 'nein' ? 'E-Book holen' : 'Ich interessiere mich für das Gerät';
  }
  async function anfrageSenden(e) {
    e.preventDefault();
    const f = e.target, w = Object.fromEntries(new FormData(f).entries()), fehler = $('#fehler');
    if (!w.interesse || !w.geraet || !w.budget) return (fehler.textContent = 'Bitte beantworte die drei Fragen oben.');
    if (!t(w.vorname) || !t(w.nachname)) return (fehler.textContent = 'Bitte trag deinen Vor- und Nachnamen ein.');
    if (t(w.telefon).replace(/\D/g, '').length < 6) return (fehler.textContent = 'Bitte trag deine Telefonnummer ein, damit wir dich anrufen können.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t(w.email))) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
    if (!w.ok) return (fehler.textContent = 'Bitte bestätige noch, dass wir deine Angaben speichern und dich anrufen dürfen.');
    fehler.textContent = '';
    const kontakt = { vorname: t(w.vorname), nachname: t(w.nachname), email: t(w.email), telefon: t(w.telefon), erreichbar: t(w.erreichbar), ort: t(w.ort), land: w.land };
    const antworten = { interesse: w.interesse, geraet: w.geraet, budget: w.budget, budget_text: BUDGET[w.budget] };
    // Wer nur umschauen will, wird gespeichert, aber nicht angerufen, und bekommt das E-Book
    if (w.budget === 'nein') { melden({ ...kontakt, quelle: 'umschauen', antworten }).catch(() => {}); return buchZeigen(f, w.vorname); }
    const k = $('#senden'); k.disabled = true;
    try {
      await melden({ ...kontakt, quelle: 'formular', antworten,
        nachricht: [`Lead von ${t(P.vorname)} (${STUFE[w.budget]}, Seite ${FASSUNG})`, `Interesse: ${w.interesse}`, `Trinkt heute: ${w.geraet}`, `Budget: ${BUDGET[w.budget]}`].join(' · ') });
      const d = document.createElement('div'); d.className = 'danke';
      d.innerHTML = `<div class="eyebrow">Danke, ${esc(w.vorname)}</div><h3>Deine Anfrage ist angekommen</h3>
        <p>${P.leads_bei === 'partner' ? `${esc(t(P.vorname))} meldet sich` : 'Wir melden uns'} persönlich bei dir. Bis dahin kannst du dir weiter unten das E-Book holen.</p><a class="knopf" href="#ebook">Zum E-Book</a>`;
      f.replaceChildren(d);
    } catch {
      k.disabled = false;
      fehler.textContent = 'Das hat gerade nicht geklappt. Bitte versuch es noch einmal.';
    }
  }
  function buchSenden(e) {
    e.preventDefault();
    const w = Object.fromEntries(new FormData(e.target).entries()), fehler = $('#buchfehler');
    if (!t(w.vorname)) return (fehler.textContent = 'Bitte trag deinen Vornamen ein.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t(w.email))) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
    if (!w.ok) return (fehler.textContent = 'Bitte bestätige noch, dass wir deinen Vornamen und deine E-Mail speichern dürfen.');
    fehler.textContent = '';
    melden({ vorname: t(w.vorname), email: t(w.email), quelle: 'ebook' }).catch(() => {});
    buchZeigen(e.target, w.vorname);
  }

  // ---------- Rechner (reine Rechnung, keine Aussage über das Wasser) ----------
  const zahl = (n, st = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: st, maximumFractionDigits: st });
  const wert = (id, min, max) => Math.min(max, Math.max(min, Number(String($('#' + id).value).replace(',', '.')) || 0));
  const RECHNER = {
    // 40 ml je kg (Faustregel wie auf den Sportseiten), Sechserträger mit 1,5-Liter-Flaschen = 9 Liter
    sport() {
      const l = wert('kg', 30, 200) * 0.04, jahr = Math.round(l * 365 / 10) * 10;
      $('#ergebnis').textContent = zahl(l, 1);
      $('#ergebnis-text').textContent = `Das sind rund ${zahl(jahr)} Liter im Jahr. In 1,5-Liter-Flaschen wären das ${zahl(Math.round(l * 365 / 9))} Sechserträger zum Schleppen.`;
    },
    kisten() {
      const l = wert('personen', 1, 12) * wert('liter', 0.5, 6) * 365;
      $('#ergebnis').textContent = zahl(Math.round(l / 9));
      $('#ergebnis-text').textContent = `Das sind rund ${zahl(Math.round(l / 10) * 10)} Liter oder ${zahl(Math.round(l / 1.5))} Flaschen zu 1,5 Litern. Alles gekauft, getragen, gelagert und zurückgebracht.`;
    },
    glaeser() {
      const g = Math.round(wert('glaeser', 0, 30)), ziel = wert('ziel', 0.5, 5), fehlt = Math.max(0, Math.ceil(ziel * 4 - g));
      $('#ergebnis').textContent = zahl(fehlt);
      $('#ergebnis').nextElementSibling.textContent = fehlt === 1 ? 'Glas fehlt noch' : 'Gläser fehlen noch';
      const getrunken = zahl(g * 0.25, (g * 0.25) % 1 ? 2 : 0).replace(/,50$/, ',5');
      $('#ergebnis-text').textContent = fehlt
        ? `Mit ${zahl(g)} ${g === 1 ? 'Glas' : 'Gläsern'} hast du ${getrunken} Liter getrunken. Bis zu deinem Ziel von ${zahl(ziel, ziel % 1 ? 1 : 0)} Litern fehlen noch ${zahl(fehlt)} ${fehlt === 1 ? 'Glas' : 'Gläser'}.`
        : `Mit ${zahl(g)} Gläsern hast du ${getrunken} Liter getrunken. Dein Ziel für heute hast du erreicht.`;
    },
  };

  // ---------- Bilder: fehlt eine Datei, bleibt ein ruhiger Platzhalter mit Beschreibung ----------
  function bilderPruefen() {
    $$('.bild img').forEach((img) => {
      const leer = () => img.parentElement.classList.add('leer');
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) leer();
      img.addEventListener('error', leer);
    });
    $$('.video video').forEach((v) => {
      const leer = () => v.parentElement.classList.add('leer');
      v.addEventListener('error', leer);
      // Bei preload="none" meldet erst das Vorschaubild, ob die Dateien da sind
      if (v.poster) { const i = new Image(); i.onerror = leer; i.src = v.poster; }
    });
  }

  // ---------- Bewegung: Einblenden, Zahlen, Leiste unten ----------
  function effekte() {
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ruhig && 'IntersectionObserver' in window) {
      const teile = $$('main section:not(.hero) h2, main section:not(.hero) .eyebrow, .karte, .zahl, .rechner, .arten li, .ablauf li, .buch, .ueber .foto-p, .hinweisbox, .fragen details');
      teile.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight) return;
        el.classList.add('auf');
        const g = [...el.parentElement.children].filter((k) => k.matches('.karte, .zahl, .arten li, .ablauf li, .fragen details'));
        const i = g.indexOf(el); if (i > 0) el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
      });
      const beob = new IntersectionObserver((e) => e.forEach((x) => {
        if (!x.isIntersecting) return;
        x.target.classList.add('da');
        x.target.querySelectorAll('[data-zahl]').forEach(zaehlen);
        beob.unobserve(x.target);
      }), { rootMargin: '0px 0px -8% 0px' });
      teile.forEach((el) => el.classList.contains('auf') && beob.observe(el));
    }
    function zaehlen(el) {
      const ziel = Number(el.dataset.zahl); if (!ziel || ruhig) return;
      const start = performance.now();
      const schritt = (jetzt) => { const k = Math.min(1, (jetzt - start) / 1200); el.textContent = zahl(Math.round(ziel * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(schritt); };
      requestAnimationFrame(schritt);
    }
    // Kopf bekommt beim Scrollen eine Linie. Die Leiste unten erscheint nach dem ersten Bildschirm
    // und verschwindet, solange ein Formular im Bild ist.
    const kopf = $('header.kopf'), dock = $('.dock');
    const formulare = $$('#interesse, #ebook'); const sichtbar = new Set();
    if ('IntersectionObserver' in window) {
      const fb = new IntersectionObserver((e) => { e.forEach((x) => (x.isIntersecting ? sichtbar.add(x.target) : sichtbar.delete(x.target))); lage(); });
      formulare.forEach((f) => fb.observe(f));
    }
    if (!$('#rechner')) $('.dock [href="#rechner"]')?.remove();
    function lage() {
      kopf.classList.toggle('gescrollt', scrollY > 10);
      dock.classList.toggle('zeigen', scrollY > innerHeight * 0.8 && !sichtbar.size);
    }
    addEventListener('scroll', lage, { passive: true });
    lage();
  }

  // ---------- Start ----------
  function verdrahten() {
    $('#anfrage')?.addEventListener('change', budgetWahl);
    if ($('#anfrage')) $('#anfrage').onsubmit = anfrageSenden;
    if ($('#buchform')) $('#buchform').onsubmit = buchSenden;
    const r = $('[data-rechner]');
    if (r) { const f = RECHNER[r.dataset.rechner]; r.addEventListener('input', f); f(); }
    bilderPruefen();
    effekte();
  }

  async function start() {
    verdrahten();
    if (PORTAL) {
      // Das Portal schickt die Angaben aus dem Formular, solange der Partner tippt. Nur vom selben Ursprung.
      const band = document.createElement('p'); band.className = 'vorschau-band'; band.textContent = 'Vorschau. So sieht deine Seite aus.';
      document.body.prepend(band);
      addEventListener('message', (e) => { if (e.origin === location.origin && e.data?.typ === 'uk-seite') einsetzen(e.data.partner); });
      parent.postMessage({ typ: 'uk-seite-bereit' }, location.origin);
      return;
    }
    const { adresse, fassung } = adresseLesen();
    if (!adresse) return nichtDa();
    let p = null;
    try { p = await holen(adresse, fassung || FASSUNG); } catch (e) { console.warn(e); }
    if (!p) return nichtDa();
    // Andere Fassung (diese hat der Partner nicht) oder alte Adresse: zur richtigen Seite
    if (p.fassung !== FASSUNG) return location.replace(seitenPfad(p.adresse, p.fassung) + location.hash);
    if (!DEMO && p.adresse !== adresse) history.replaceState(null, '', seitenPfad(p.adresse, FASSUNG) + location.hash);
    if (DEMO) {
      const band = document.createElement('p'); band.className = 'vorschau-band';
      band.textContent = `Vorschau mit Beispieldaten (${p.vorname} ${p.nachname}). Formulare senden nichts.`;
      document.body.prepend(band);
    }
    einsetzen(p);
  }
  start();
})();

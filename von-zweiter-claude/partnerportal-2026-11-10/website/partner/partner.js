// Partnerportal Ursprungskraft. Neu gebaut am 08.11.2026, Korrektur 2 am 09.11.2026 (Jasmin: edel, ruhig, klar, ein Look).
// Bereiche: Start, Kunden, Termine (Kalender mit Monat, am Handy Woche und Tag, Kalender-Abo), Tools (Landingpage, Flyer,
// Bestell-Link, Assistent), Flyer, Wissen, Neuigkeiten, Mehr für dein Geschäft, Konto. Dazu der Einstieg in vier Schritten.
// Gestaltung nach ursprungskraft-ci.md, alle Werte stehen als Variablen in portal.css.
// Datenbank nur über Funktionen uk_partner_* mit Sitzungsschlüssel, nie direkt über Tabellen.
// Vorschau mit Probedaten: ?vorschau (siehe vorschau.js).
(function () {
  'use strict';
  const SUPABASE = 'https://ngcbmpuqcqbelfoelwby.supabase.co';
  const BESTELLSEITE = 'https://mein.ursprungskraft.net/bestellen/?von=';
  const SEITE = 'https://mein.ursprungskraft.net/wasser/?von=';
  const KALENDER = SUPABASE + '/functions/v1/partner-kalender?k=';
  const ASSISTENT = SUPABASE + '/functions/v1/partner-assistent';
  const KONTAKT = 'info@ursprungskraft.net';
  const PORTAL_ADRESSE = 'https://mein.ursprungskraft.net/partner/';
  const SPEICHER = 'uk-partnerportal';
  const V = window.Vorschau;
  const sb = V ? null : supabase.createClient(SUPABASE, 'sb_publishable_XXX',
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'uk-partner-sb' } });
  // Backoffice: eigene Supabase-Anmeldung über daten.js, erst geladen, wenn ein Team-Konto wechselt
  const BO_SKRIPTE = ['../dashboard/daten.js?v=20261109a', '../fragebogen/fragen.js?v=20261021c', 'backoffice.js?v=20261110b2'];
  const BO_LINK = /(^|[#&])(access_token|error_code)=/.test(location.hash);
  const wurzel = document.getElementById('wurzel');

  // Aus dem Telegram-Assistenten (/flyer) geöffnet: #tg=<kurze Sitzung>. Dann direkt "Flyer erstellen",
  // fertige Flyer gehen per Knopf in den eigenen Chat (Download klappt in Telegram nicht).
  const TG = (location.hash.match(/^#tg=([0-9a-f]{48})$/) || [])[1] || null;
  if (TG) { try { localStorage.setItem(SPEICHER, TG); } catch {} history.replaceState(null, '', location.pathname + location.search + '#flyer'); }

  // ---------- Bewegung: kurz, mit Sinn, und nie bei prefers-reduced-motion ----------
  // Klein 180 ms, Bausteine 320 bis 450 ms, nichts über 600 ms. Die Werte stehen in portal.css (--t-klein, --t-mittel, --t-gross).
  const ruhig = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sichtWaechter = null;
  window.Bewegung = {
    // Eine Seite baut sich auf: die obersten Blöcke kommen nacheinander von unten
    auftritt(box) {
      if (!box || ruhig()) return;
      const teile = [...box.children].flatMap((x) => (x.matches('.bo-start, .konto, .kal') ? [...x.children] : [x])).filter((x) => !x.matches('.reihen, .kacheln-abschnitt')).slice(0, 10);
      teile.forEach((x, i) => { x.classList.remove('rein'); x.style.setProperty('--i', i); void x.offsetWidth; this.rein(x); });
      this.zahlen(box); this.woerter(box); this.sicht(box);
    },
    // Die Klasse geht nach dem Auftritt wieder weg. So hängt nie etwas an einer Animation, falls der Browser sie anhält.
    rein(x) { x.classList.add('rein'); const weg = (e) => { if (e.target !== x) return; x.classList.remove('rein'); x.removeEventListener('animationend', weg); }; x.addEventListener('animationend', weg); },
    // Was weiter unten steht, kommt erst, wenn es ins Bild scrollt
    sicht(box) {
      if (ruhig() || !('IntersectionObserver' in window)) return;
      if (!sichtWaechter) sichtWaechter = new IntersectionObserver((e) => e.forEach((x) => { if (!x.isIntersecting) return; x.target.classList.remove('wartet'); Bewegung.rein(x.target); sichtWaechter.unobserve(x.target); }), { rootMargin: '0px 0px -8% 0px' });
      box.querySelectorAll('.reihe, .kachel, .verkauf-punkte li, .ablauf li, article.unterlage, .produkt').forEach((x, i) => {
        if (x.getBoundingClientRect().top < innerHeight * 0.92) { x.style.setProperty('--i', Math.min(i, 6)); this.rein(x); return; }
        x.style.setProperty('--i', 0); x.classList.add('wartet'); sichtWaechter.observe(x);
      });
    },
    // Zahlen zählen hoch
    zahlen(box) {
      box.querySelectorAll('[data-zahl]').forEach((el) => {
        const ziel = Number(el.dataset.zahl); if (!Number.isFinite(ziel) || ziel < 2 || ruhig()) return;
        const t0 = performance.now(), dauer = 560;
        const schritt = (t) => { const k = Math.min(1, (t - t0) / dauer), e = 1 - Math.pow(1 - k, 3); el.textContent = String(Math.round(ziel * e)); if (k < 1) requestAnimationFrame(schritt); };
        requestAnimationFrame(schritt);
      });
    },
    // Begrüßung: Wort für Wort aus einer Kante heraus
    woerter(box) {
      box.querySelectorAll('h1.woerter:not(.fertig)').forEach((h) => {
        h.classList.add('fertig');
        h.innerHTML = h.textContent.split(' ').map((w, i) => `<span class="wort"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
      });
    },
  };

  // ---------- Hilfen ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sitzung = {
    lesen() { if (V) return 'vorschau'; try { return localStorage.getItem(SPEICHER); } catch { return null; } },
    setzen(s) { if (V) return; try { s ? localStorage.setItem(SPEICHER, s) : localStorage.removeItem(SPEICHER); } catch {} },
  };
  const rpc = (name, args) => (V ? V.rpc(name, args) : sb.rpc(name, args));
  const mitSitzung = (name, args = {}) => rpc(name, { p_sitzung: sitzung.lesen(), ...args });
  const heute = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
  const tagVon = (iso) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
  const plusTage = (t, n) => { const d = new Date(t + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toLocaleDateString('sv-SE'); };
  const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const tagName = (t) => { const d = new Date(t + 'T12:00:00'); return `${TAGE[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}`; };
  const tagKurz = (t) => { if (!t) return ''; const d = new Date(String(t).slice(0, 10) + 'T12:00:00'); return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  const uhr = (iso) => new Date(iso).toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
  const relativ = (t) => { const h = heute(); if (t === h) return 'Heute'; if (t === plusTage(h, 1)) return 'Morgen'; if (t === plusTage(h, 2)) return 'Übermorgen'; if (t === plusTage(h, -1)) return 'Gestern'; return ''; };
  const nameVon = (k) => `${k.vorname || ''} ${k.nachname || ''}`.trim();
  const tel = (t) => String(t || '').replace(/[^\d+]/g, '');
  const wa = (t) => { let x = tel(t); if (x.startsWith('00')) x = x.slice(2); if (x.startsWith('+')) x = x.slice(1); if (x.startsWith('0')) x = '49' + x.slice(1); return 'https://wa.me/' + x; };
  const route = (ort) => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(ort);
  const istLink = (s) => /^https?:\/\//.test(String(s || '').trim());
  const istAdresse = (s) => s && !istLink(s) && /\d/.test(s);
  function toast(text) {
    document.querySelector('.toast')?.remove();
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = text;
    document.body.append(t); setTimeout(() => { t.classList.add('raus'); setTimeout(() => t.remove(), 220); }, 2600);
  }
  async function kopieren(text, hinweis = 'Kopiert.') {
    try { await navigator.clipboard.writeText(text); toast(hinweis); } catch { prompt('Zum Kopieren markieren:', text); }
  }
  function qr(text) { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); }
  const fehlt = (s) => esc(s).replace(/\[FEHLT:[^\]]*\]/g, (m) => `<span class="fehlt">${m}</span>`);

  // Kleine Liniensymbole, Strichstärke 1,5 (CI), alle im selben Raster
  const P = {
    start: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    kunden: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.8 14.6c2.3.2 4 1.7 4.6 4.9"/>',
    termine: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    tools: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5"/><path d="M4 4l5 5M4 4v3h3"/>',
    flyer: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="9.5" cy="9" r="2"/><path d="M4 17l5-4 4 3 3-2 4 3"/>',
    wissen: '<path d="M4 5.5C6.5 4 9.5 4 12 5.5v14C9.5 18 6.5 18 4 19.5z"/><path d="M20 5.5C17.5 4 14.5 4 12 5.5v14c2.5-1.5 5.5-1.5 8 0z"/>',
    neuigkeiten: '<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17.5 9a4 4 0 0 1 0 6"/>',
    mehr: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    app: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    konto: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>',
    punkte: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    links: '<path d="M15 5l-7 7 7 7"/>', rechts: '<path d="M9 5l7 7-7 7"/>',
    telefon: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    whatsapp: '<path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2 2.5 4.3 4.6 4.7l1.2-1.2 1.7.8"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    route: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', kopie: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    zu: '<path d="M6 6l12 12M18 6L6 18"/>', laden: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>', schloss: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    pfeil: '<path d="M5 12h14M13 6l6 6-6 6"/>', auge: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    haken: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
    paket: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    partner: '<circle cx="8" cy="9" r="2.6"/><circle cx="16" cy="9" r="2.6"/><path d="M3.5 18.5c.5-2.8 2.3-4.3 4.5-4.3s4 1.5 4.5 4.3M11.5 18.5c.5-2.8 2.3-4.3 4.5-4.3s4 1.5 4.5 4.3"/>',
    geraet: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 7h4M12 15.5v.5"/>',
    ordner: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    zahlen: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    glocke: '<path d="M12 3a6 6 0 0 0-6 6v3.6L4.3 16a.7.7 0 0 0 .6 1h14.2a.7.7 0 0 0 .6-1L18 12.6V9a6 6 0 0 0-6-6Zm-2.2 15.5a2.3 2.3 0 0 0 4.4 0"/>',
    satz: '<path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 16h-7l-4.5 3.5V16H5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 5z"/><path d="M8 9h8M8 12h5"/>',
    video: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
    teilen: '<circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="18" cy="18" r="2.3"/><path d="M8 11l8-4M8 13l8 4"/>',
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

  // ---------- Zustand ----------
  const S = { p: null, kunden: null, best: null, termine: null, news: null, laden: {} };
  const STAND = [['neu', 'Neu'], ['kontaktiert', 'Kontaktiert'], ['termin', 'Termin'], ['gekauft', 'Gekauft'], ['betreuung', 'In Betreuung']];
  const STAND_NAME = Object.fromEntries(STAND);
  const STUFE = [['heiss', 'Heiß'], ['warm', 'Warm'], ['kalt', 'Kalt']];
  const BESTELL = { bestellt: 'Bestellt', verschickt: 'An den Hersteller raus', da: 'Gerät da' };
  const ARTEN = ['Rückruf', 'Termin vor Ort', 'Anruf', 'Zoom', 'Sonstiges'];

  // ---------- Freischalten und Testzeit ----------
  // zugang = { bereiche: [...] oder null, test_bis: 'JJJJ-MM-TT' oder null }. Fehlt er (alte Datenbank) oder ist
  // bereiche null (noch nicht entschieden), ist alles frei. In der Testzeit ist alles frei.
  // Jeder Bereich hat eine Verkaufsansicht: was du bekommst (titel, text, drei Punkte) und wie du freischaltest.
  const BEREICHE = {
    kunden: { name: 'Kundenübersicht', bild: 'kunden', titel: 'Jeder Kontakt an einem Ort. Keiner geht mehr unter.',
      text: 'Wer bei dir anfragt oder über deinen Link bestellt, steht von selbst in deiner Kundenübersicht. Du siehst auf einen Blick, wo jeder steht und wen du heute anrufen wolltest.',
      punkte: [['Anfragen kommen von selbst', 'Jede Anfrage über deine Landingpage steht sofort in deiner Kundenübersicht, mit Namen und Kontakt.'],
        ['Du weißt, wo jeder steht', 'Neu, kontaktiert, Termin, gekauft: ein Blick genügt. Bei Käufern siehst du, wie weit die Bestellung ist.'],
        ['Kein Rückruf geht verloren', 'Notiz schreiben, Datum setzen, fertig. Am Tag selbst steht der Name oben auf deiner Startseite.']] },
    termine: { name: 'Termine und Kalender', bild: 'termine', titel: 'Dein Kalender, der mitdenkt.',
      text: 'Termine vor Ort, Rückrufe und Zoom in einer Monatsansicht. Jeder Eintrag erscheint auch im Kalender auf deinem Handy und erinnert dich 30 Minuten vorher.',
      punkte: [['Der ganze Monat auf einen Blick', 'Jeder Termin steht mit Uhrzeit und Namen direkt im Tag. Ein Klick öffnet ihn.'],
        ['Auch im Handykalender', 'Einmal verbinden, danach steht jeder Termin von selbst in deinem iPhone oder Google Kalender.'],
        ['Route und Anruf mit einem Tipp', 'Adresse antippen und losfahren. Nummer antippen und anrufen.']] },
    seite: { name: 'Deine Landingpage', bild: 'landingpage', titel: 'Nie wieder alles von vorn erklären.',
      text: 'Du schickst einen Link. Dort steht das Wichtigste rund ums Wasser, dazu dein Name und deine Kontaktknöpfe. Wer sich danach meldet, kennt die Grundlagen schon und steht sofort in deiner Kundenübersicht.',
      punkte: [['Fertig gebaut', 'Die Seite steht. Du trägst nur ein, wie man dich erreicht: WhatsApp, Telefon, E-Mail oder ein Link zum Termin.'],
        ['Anfragen kommen zu dir', 'Wer das Formular ausfüllt, steht mit Namen und Kontakt in deiner Kundenübersicht.'],
        ['Ein Link für alles', 'Für WhatsApp, deine E-Mail-Signatur, Instagram oder den QR-Code auf deinem Flyer.']] },
    flyer: { name: 'Flyer erstellen', bild: 'flyer', titel: 'Deine Einladung, fertig in zwei Minuten.',
      text: 'Motiv wählen, Datum und Ort eintragen, speichern. Deine Einladung zum Infoabend passt für WhatsApp, Instagram, Facebook und den Drucker.',
      punkte: [['Motive und Farben zur Auswahl', 'Such dir ein Foto aus oder lade dein eigenes hoch. Die Farben passen immer zusammen.'],
        ['Vier Formate auf einmal', 'Story, Beitrag, Querformat und A4 zum Ausdrucken. Du wählst, was du brauchst.'],
        ['Dein Name steht drauf', 'Mit Datum, Ort und deiner Nummer. Wer kommen will, weiß sofort, bei wem er sich meldet.']] },
    assistent: { name: 'Telegram-Assistent', bild: 'assistent', titel: 'Keine Anfrage mehr, die du zu spät siehst.',
      text: 'Dein Assistent in Telegram meldet dir jede neue Anfrage sofort aufs Handy. Morgens zeigt er dir, welche Termine anstehen und wen du anrufen wolltest.',
      punkte: [['Sofort Bescheid', 'Eine Anfrage kommt rein, dein Handy meldet sich. Du rufst an, solange das Interesse frisch ist.'],
        ['Termine per Nachricht', 'Schreib oder sprich den Termin in den Chat. Danach steht er in deinem Kalender.'],
        ['Flyer direkt im Chat', 'Du erstellst deine Einladung und bekommst das Bild in den Chat geschickt.']] },
    wissen: { name: 'Wissen und Schulung', bild: 'wissen', titel: 'Gute Gespräche beginnen mit guten Antworten.',
      text: 'Unterlagen zum Weitergeben, Fakten zu jedem Gerät und Antworten auf die häufigsten Einwände. Alles an einem Ort, auch unterwegs auf dem Handy.',
      punkte: [['Unterlagen zum Weitergeben', 'Ansehen oder mit einem Tipp per WhatsApp weitergeben.'],
        ['Fakten zu jedem Gerät', 'Belegte Angaben statt Halbwissen. So bleibst du im Gespräch sicher.'],
        ['Antworten auf Einwände', 'Zu teuer, zu kompliziert, brauche ich nicht: Anregungen für deine eigenen Worte.']] },
  };
  function testTage() {
    const z = S.p?.zugang; if (!z?.test_bis) return null;
    const n = Math.round((new Date(z.test_bis + 'T23:59:59') - new Date()) / 864e5);
    return n >= 0 ? n : null;
  }
  function frei(b) {
    const z = S.p?.zugang;
    if (!z || !Array.isArray(z.bereiche)) return true;
    if (testTage() !== null) return true;
    return z.bereiche.includes(b);
  }
  const freischaltMail = (b) => `mailto:${KONTAKT}?subject=${encodeURIComponent('Freischalten: ' + BEREICHE[b].name)}&body=${encodeURIComponent(`Hallo Daniel und Jasmin,\n\nich möchte gern "${BEREICHE[b].name}" im Partnerportal freischalten.\n\n${nameVon(S.p)}`)}`;
  // Verkaufsansicht: zeigt, was der Bereich bringt, und wie er freigeschaltet wird. Kein leerer Sperrbildschirm.
  function gesperrt(b, zusatz = '') {
    const x = BEREICHE[b];
    return `<section class="gesperrt verkauf">
      <div class="verkauf-buehne"><div class="text"><p class="kicker">${ico('schloss')} ${esc(x.name)} · noch nicht freigeschaltet</p>
        <h2>${esc(x.titel)}</h2><p>${esc(x.text)}</p>
        <div class="kosten"><a class="knopf hell" href="${freischaltMail(b)}">Freischalten</a><span>Preis: [Preis folgt]</span></div></div>
        <div class="bild">${b === 'flyer' ? flyerFoto() : b === 'assistent' ? assistentBuehne() : foto(x.bild)}</div></div>
      <ol class="verkauf-punkte">${x.punkte.map(([t, s], i) => `<li><span class="zahl-gross" aria-hidden="true">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(s)}</p></li>`).join('')}</ol>
      ${zusatz}
      <div class="verkauf-so"><div><p class="kicker">So schaltest du frei</p><h3 style="margin-top:var(--s-2)">Drei Schritte, eine Minute.</h3></div>
        <ol><li><span><b>Tipp auf Freischalten.</b> Es öffnet sich eine fertige Mail an Daniel und Jasmin.</span></li>
          <li><span><b>Abschicken.</b> Du musst nichts dazuschreiben.</span></li>
          <li><span><b>Loslegen.</b> Sobald der Bereich frei ist, findest du ihn hier an derselben Stelle.</span></li></ol></div>
    </section>`;
  }

  // ---------- Daten laden ----------
  async function holen(was, fn) {
    if (S[was] !== null) return S[was];
    S.laden[was] = S.laden[was] || fn().finally(() => { delete S.laden[was]; });
    return S.laden[was];
  }
  const kundenLaden = () => holen('kunden', async () => {
    const [k, b] = await Promise.all([mitSitzung('uk_partner_kunden'), mitSitzung('uk_partner_bestellstand')]);
    if (k.error) {
      // Neue Funktion noch nicht eingespielt: alte Kontaktliste nehmen und übersetzen
      const alt = await mitSitzung('uk_partner_kontakte');
      if (alt.error) throw alt.error;
      S.kunden = (alt.data || []).map((x) => ({ ...x, stand: { Kunde: 'gekauft', Testet: 'termin' }[x.status] || (x.letzter_kontakt ? 'kontaktiert' : 'neu'), stufe: null, abgelegt: x.status === 'Kein Interesse' }));
    } else S.kunden = k.data || [];
    S.best = b.error ? [] : b.data || [];
    // Käufer, die (noch) keinem Kunden zugeordnet sind, trotzdem zeigen
    for (const x of S.best) if (!x.kunde_id || !S.kunden.some((k) => k.id === x.kunde_id)) {
      const [vor, ...nach] = String(x.name || 'Käufer').split(' ');
      S.kunden.push({ id: 'best-' + x.id, art: 'bestellung', vorname: vor, nachname: nach.join(' '), ort: x.ort, erstellt: x.erstellt, quelle: 'Bestellung', stand: 'gekauft', notizen: [] });
      x.kunde_id = 'best-' + x.id;
    }
    return S.kunden;
  });
  const termineLaden = () => holen('termine', async () => { const r = await mitSitzung('uk_partner_termine_liste'); if (r.error) throw r.error; return (S.termine = r.data || []); });
  const newsLaden = () => holen('news', async () => { const r = await mitSitzung('uk_partner_neuigkeiten'); return (S.news = r.error ? [] : r.data || []); });
  const neuAb = () => { try { return localStorage.getItem('uk-partner-gelesen') || ''; } catch { return ''; } };
  const ungelesen = () => (S.news || []).filter((n) => n.erstellt > neuAb()).length;
  const gelesen = () => { try { localStorage.setItem('uk-partner-gelesen', new Date().toISOString()); } catch {} };

  // Alles, was im Kalender steht: Termine mit Uhrzeit und "Wieder melden am"
  function eintraege() {
    const a = (S.termine || []).map((t) => ({ typ: 'termin', tag: tagVon(t.beginn), t }));
    const b = (S.kunden || []).filter((k) => k.naechster_kontakt && !k.abgelegt).map((k) => ({ typ: 'melden', tag: String(k.naechster_kontakt).slice(0, 10), k }));
    return [...a, ...b].sort((x, y) => (x.tag + (x.t ? x.t.beginn : 'Z')).localeCompare(y.tag + (y.t ? y.t.beginn : 'Z')));
  }

  // ---------- Anmelden und Registrieren ----------
  const FEHLER_REG = {
    name: 'Bitte gib deinen Vor- und Nachnamen an.', email: 'Bitte prüf deine E-Mail-Adresse.',
    id: 'Deine Enagic-ID ist eine Nummer mit 11 Ziffern, die mit 21000 beginnt.', passwort: 'Dein Passwort braucht mindestens 8 Zeichen.',
    email_vergeben: 'Mit dieser E-Mail-Adresse gibt es schon einen Zugang. Melde dich einfach an.',
    id_vergeben: `Mit dieser Enagic-ID gibt es schon einen Zugang. Schreib uns kurz an ${KONTAKT}.`,
  };
  const FEHLER_AN = {
    falsch: 'E-Mail-Adresse oder Passwort stimmen nicht.', wartet: 'Dein Zugang wird gerade geprüft. Sobald er freigeschaltet ist, bekommst du eine Mail.',
    abgelehnt: `Dein Zugang wurde nicht freigeschaltet. Schreib uns kurz an ${KONTAKT}.`, gesperrt: 'Zu viele Versuche. Bitte warte 15 Minuten und versuch es dann noch einmal.',
  };
  function zugang(reiter = 'anmelden', meldung = '') {
    document.title = 'Partnerportal · Ursprungskraft';
    wurzel.innerHTML = `${V ? '<p class="vorschau-band">Vorschau mit Probedaten. Es wird nichts gespeichert.</p>' : ''}
      <div class="zugang">
        <div class="zugang-bild" role="img" aria-label="Eine Frau sitzt mit ihrem Handy am Küchentisch"></div>
        <main class="zugang-form" id="inhalt">
          <span class="marke"><img src="symbol/symbol-288.webp" alt=""><span><b>Ursprungskraft</b><small>Partner</small></span></span>
          <p class="kicker">Partnerportal</p>
          <h1>Alles für dein Geschäft. An einem Ort.</h1>
          <p class="vorspann">Deine Kunden, deine Termine und deine Tools. Am Computer und auf dem Handy.</p>
          <div class="reiter" role="tablist">
            <button type="button" role="tab" data-r="anmelden" aria-selected="${reiter === 'anmelden'}">Anmelden</button>
            <button type="button" role="tab" data-r="registrieren" aria-selected="${reiter === 'registrieren'}">Neu registrieren</button>
          </div>
          <div id="teil"></div>
        </main>
      </div>`;
    wurzel.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => zugang(b.dataset.r)));
    const teil = document.getElementById('teil');
    if (reiter === 'registrieren') {
      teil.innerHTML = `<p class="leise" style="margin-bottom:var(--a-3)">Der Zugang ist kostenlos. Wir prüfen kurz deine Angaben und schalten dich frei. Sobald es so weit ist, bekommst du eine Mail.</p>
        <p class="hinweis" style="margin-bottom:var(--a-4)"><b>Ganz wichtig:</b> Nimm genau die E-Mail-Adresse, mit der du bei Enagic angemeldet bist. Nur dann klappt die Zuordnung deiner Kunden und Verträge.</p>
        <form id="f" novalidate><div class="felder zwei">
          <label class="feld"><span class="titel">Vorname <span class="pflicht">*</span></span><input name="vorname" autocomplete="given-name" required></label>
          <label class="feld"><span class="titel">Nachname <span class="pflicht">*</span></span><input name="nachname" autocomplete="family-name" required></label>
          <label class="feld"><span class="titel">Enagic-ID <span class="pflicht">*</span></span><input name="enagic_id" inputmode="numeric" placeholder="21000…" required></label>
          <label class="feld"><span class="titel">E-Mail-Adresse wie bei Enagic <span class="pflicht">*</span></span><input type="email" name="email" autocomplete="email" required></label>
          <label class="feld"><span class="titel">Telefon</span><input type="tel" name="telefon" autocomplete="tel"></label>
          <label class="feld"><span class="titel">Ort</span><input name="ort" autocomplete="address-level2"></label>
          <label class="feld"><span class="titel">Passwort <span class="pflicht">*</span></span><input type="password" name="passwort" autocomplete="new-password" minlength="8" required><small class="regel">Mindestens 8 Zeichen. Sonst gibt es keine Vorgaben.</small></label>
          <label class="feld"><span class="titel">Passwort noch einmal <span class="pflicht">*</span></span><input type="password" name="passwort2" autocomplete="new-password" minlength="8" required></label>
        </div><p class="meldung" id="fehler"></p><div class="knoepfe"><button class="knopf" type="submit">Registrieren</button></div></form>`;
      document.getElementById('f').onsubmit = async (e) => {
        e.preventDefault();
        const f = e.target, fehler = document.getElementById('fehler'), k = f.querySelector('button');
        const w = Object.fromEntries(new FormData(f).entries()); fehler.textContent = '';
        if (w.passwort !== w.passwort2) return (fehler.textContent = 'Die beiden Passwörter sind nicht gleich.');
        delete w.passwort2; k.disabled = true;
        const { data, error } = await rpc('uk_partner_registrieren', { p: w }); k.disabled = false;
        if (error) return (fehler.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.');
        if (data !== 'ok') return (fehler.textContent = FEHLER_REG[data] || 'Das hat nicht geklappt. Bitte prüf deine Angaben.');
        teil.innerHTML = `<div class="hinweis"><h2>Danke, ${esc(w.vorname)}!</h2><p style="margin-top:var(--a-1)">Deine Registrierung ist angekommen. Wir prüfen kurz deine Angaben und schalten dich frei. Sobald das passiert ist, bekommst du eine Mail an ${esc(w.email)}.</p></div>`;
      };
    } else {
      teil.innerHTML = `<form id="f" novalidate>
          <label class="feld"><span class="titel">E-Mail-Adresse</span><input type="email" name="email" autocomplete="email" required></label>
          <label class="feld"><span class="titel">Passwort</span><input type="password" name="passwort" autocomplete="current-password" required></label>
          <p class="meldung" id="fehler">${esc(meldung)}</p>
          <div class="knoepfe"><button class="knopf" type="submit">Anmelden</button>
          <a href="mailto:${KONTAKT}?subject=${encodeURIComponent('Partnerportal: Passwort vergessen')}">Passwort vergessen?</a></div></form>`;
      document.getElementById('f').onsubmit = async (e) => {
        e.preventDefault();
        const f = e.target, fehler = document.getElementById('fehler'), k = f.querySelector('button');
        fehler.textContent = ''; k.disabled = true;
        const { data, error } = await rpc('uk_partner_anmelden', { p_email: f.email.value.trim(), p_passwort: f.passwort.value });
        k.disabled = false;
        if (error || !data) return (fehler.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.');
        if (data.fehler) return (fehler.textContent = FEHLER_AN[data.fehler] || FEHLER_AN.falsch);
        sitzung.setzen(data.sitzung); laden();
      };
    }
  }

  // ---------- App-Rahmen ----------
  const MENUE = [
    ['start', 'Start'], ['kunden', 'Kunden'], ['termine', 'Termine'], ['tools', 'Tools'], ['flyer', 'Flyer'], ['wissen', 'Wissen'], ['neuigkeiten', 'Neuigkeiten'],
    null, ['mehr', 'Mehr für dein Geschäft'], ['konto', 'Konto'],
  ];
  const LEISTE = [['start', 'Start'], ['kunden', 'Kunden'], ['termine', 'Termine'], ['tools', 'Tools'], ['menue', 'Mehr']];
  const ZU_MEHR = ['flyer', 'wissen', 'neuigkeiten', 'mehr', 'konto', 'menue'];
  const BO_ICO = { uebersicht: 'start', aufgaben: 'haken', kalender: 'termine', bestellungen: 'paket', kunden: 'kunden', partner: 'partner', maschinen: 'geraet', unterlagen: 'ordner', auswertung: 'zahlen', meine: 'zahlen', wohnung: 'start', menue: 'punkte' };
  const BO_LEISTE = [['uebersicht', 'Übersicht'], ['aufgaben', 'Aufgaben'], ['kalender', 'Kalender'], ['bestellungen', 'Bestellungen'], ['menue', 'Mehr']];
  let modus = 'partner';
  // Schalter Partner | Backoffice, nur für Team-Konten (uk_partner.team). Öffnet selbst keine Daten.
  const schalter = () => (S.p?.team ? `<div class="schalter" role="group" aria-label="Ansicht"><a href="#start" data-modus="partner" aria-pressed="${modus === 'partner'}">Partner</a><a href="#bo" data-modus="bo" aria-pressed="${modus === 'bo'}">Backoffice</a><i aria-hidden="true"></i></div>` : '');
  function leisteAn() {
    const nav = wurzel.querySelector('.menue nav'); if (!nav) return;
    const alle = [...nav.querySelectorAll('a')];
    nav.addEventListener('pointermove', (e) => { if (ruhig() || e.pointerType !== 'mouse') return;
      for (const a of alle) { const r = a.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)); a.style.setProperty('--g', (1 + 0.5 * Math.max(0, 1 - d / 130)).toFixed(3)); } });
    nav.addEventListener('pointerleave', () => alle.forEach((a) => a.style.setProperty('--g', 1)));
  }
  function rahmen() {
    if (modus === 'bo') return rahmenBo();
    const t = testTage();
    wurzel.innerHTML = `${V ? `<p class="vorschau-band">Vorschau mit Probedaten (${esc(V.modus)}). Es wird nichts gespeichert.</p>` : ''}
      <div class="app">
        <aside class="menue" aria-label="Menü">
          <a class="marke" href="#start"><img src="symbol/symbol-288.webp" alt=""><span><b>Ursprungskraft</b><small>Partner</small></span></a>
          ${schalter()}
          ${t !== null ? `<p class="test-band"><b>Testzeit</b>Noch ${t === 0 ? 'heute' : t === 1 ? '1 Tag' : t + ' Tage'} alles kostenlos.</p>` : ''}
          <nav>${MENUE.map((m) => (m ? `<a href="#${m[0]}" data-ziel="${m[0]}">${ico(m[0])}<span>${m[1]}</span>${m[0] === 'neuigkeiten' ? '<span class="zahl" data-ungelesen></span>' : ''}</a>` : '<div class="trenner"></div>')).join('')}</nav>
          <div class="unten"><b>${esc(nameVon(S.p))}</b>${S.p.enagic_id ? `<button type="button" class="id-kopie" data-id-kopie title="Enagic-ID kopieren">Enagic-ID ${esc(S.p.enagic_id)} ${ico('kopie')}</button>` : ''}<button type="button" data-abmelden>Abmelden</button></div>
        </aside>
        <header class="kopfleiste"><img src="symbol/symbol-288.webp" alt=""><b>Partner</b>${schalter()}</header>
        <main class="flaeche"><div id="inhalt"></div></main>
        <nav class="leiste" aria-label="Hauptbereiche">${LEISTE.map(([z, n]) => `<a href="#${z}" data-ziel="${z}">${ico(z === 'menue' ? 'punkte' : z)}<span>${n}</span>${z === 'menue' ? '<i class="punkt" data-punkt hidden></i>' : ''}</a>`).join('')}</nav>
      </div>`;
    wurzel.querySelector('[data-abmelden]').onclick = abmelden;
    const idk = wurzel.querySelector('[data-id-kopie]'); if (idk) idk.onclick = () => kopieren(S.p.enagic_id, 'Enagic-ID kopiert.');
    leisteAn();
  }
  function rahmenBo() {
    const B = window.Backoffice, R = B.REITER.filter(B.sichtbar);
    const gruppen = [...new Set(R.map((x) => x[2]))];
    wurzel.innerHTML = `${V ? `<p class="vorschau-band">Vorschau mit Beispieldaten des Dashboards (${B.ich.rolle === 'admin' ? 'als Jasmin' : 'als Daniel'}). Änderungen bleiben nur in diesem Browser.</p>` : ''}
      <div class="app ist-bo">
        <aside class="menue" aria-label="Menü Backoffice">
          <a class="marke" href="#bo"><img src="symbol/symbol-288.webp" alt=""><span><b>Ursprungskraft</b><small>Backoffice</small></span></a>
          ${schalter()}
          <nav>${gruppen.map((g, i) => `${i ? `<p class="gruppe">${esc(g)}</p>` : ''}${R.filter((x) => x[2] === g).map(([z, n]) => `<a href="#bo/${z}" data-ziel="bo/${z}">${ico(BO_ICO[z] || 'start')}<span>${n}</span>${z === 'aufgaben' ? '<span class="zahl" data-zahl-bo></span>' : ''}</a>`).join('')}`).join('')}</nav>
          <div class="unten"><b>${esc(B.ich.name || nameVon(S.p))}</b><span>${B.ich.rolle === 'admin' ? 'Admin' : 'Team'}</span><button type="button" data-bo-ab>Abmelden</button></div>
        </aside>
        <header class="kopfleiste"><img src="symbol/symbol-288.webp" alt=""><b>Backoffice</b>${schalter()}</header>
        <main class="flaeche">
          <div class="bo-kopf"><div class="symbole"><button id="glocke" class="symbol glocke" type="button" hidden aria-label="Was ist neu">${ico('glocke')}<span id="glocke-zahl"></span></button><div id="glocke-liste" class="glocke-liste" hidden></div></div></div>
          <div id="inhalt"></div></main>
        <nav class="leiste" aria-label="Hauptbereiche Backoffice">${BO_LEISTE.map(([z, n]) => `<a href="#bo/${z}" data-ziel="bo/${z}">${ico(BO_ICO[z])}<span>${n}</span></a>`).join('')}</nav>
      </div>`;
    wurzel.querySelector('[data-bo-ab]').onclick = boAbmelden;
    leisteAn();
  }
  // Zwischen den Ansichten wechseln: weich überblenden (View Transitions, wo vorhanden)
  function modusSetzen(neu) {
    if (neu === modus && wurzel.querySelector('.app')) return Promise.resolve(false);
    try { localStorage.setItem('uk-ansicht', neu); } catch {}
    const tun = () => { modus = neu; rahmen(); };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches && wurzel.querySelector('.app')) return document.startViewTransition(tun).updateCallbackDone.then(() => true);
    tun(); return Promise.resolve(true);
  }
  function markieren(ziel) {
    wurzel.querySelectorAll('[data-ziel]').forEach((a) => {
      const z = a.dataset.ziel, inLeiste = !!a.closest('.leiste');
      const boMehr = ziel.startsWith('bo/') && !BO_LEISTE.some(([b]) => 'bo/' + b === ziel);
      const an = z === ziel || (inLeiste && z === 'menue' && ZU_MEHR.includes(ziel)) || (inLeiste && z === 'bo/menue' && boMehr);
      an ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    const n = ungelesen();
    wurzel.querySelectorAll('[data-ungelesen]').forEach((x) => (x.textContent = n ? String(n) : ''));
    const nb = window.Backoffice?.neuZahl?.() || 0;
    wurzel.querySelectorAll('[data-zahl-bo]').forEach((x) => (x.textContent = nb ? String(nb) : ''));
    wurzel.querySelectorAll('[data-punkt]').forEach((x) => (x.hidden = !n));
  }
  async function abmelden() {
    await mitSitzung('uk_partner_abmelden');
    // Mit dem Partnerzugang endet auch das Backoffice auf diesem Gerät
    if (window.Daten) { try { await Daten.anmeldung.abmelden(); } catch {} }
    modus = 'partner';
    sitzung.setzen(null); Object.assign(S, { p: null, kunden: null, best: null, termine: null, news: null, einstieg: null });
    history.replaceState(null, '', location.pathname + location.search); zugang();
  }

  // ---------- Router ----------
  const SEITEN = { start, kunden, termine, tools, flyer, wissen, neuigkeiten, mehr, konto, menue };
  const TITEL = { start: 'Start', kunden: 'Kunden', termine: 'Termine', tools: 'Tools', flyer: 'Flyer erstellen', wissen: 'Wissen', neuigkeiten: 'Neuigkeiten', mehr: 'Mehr für dein Geschäft', konto: 'Konto', menue: 'Mehr' };
  let lauf = 0;
  async function zeigen() {
    if (!S.p) return;
    let [ziel, ...rest] = (location.hash.slice(1) || 'start').split('/');
    if (ziel === 'bo') return backoffice(rest[0]);
    if (ziel === 'werkzeuge') { history.replaceState(null, '', location.pathname + location.search + '#tools' + (rest.length ? '/' + rest.join('/') : '')); ziel = 'tools'; }
    // Alte Adresse #app: die Anleitung steckt jetzt im Einstieg (Schritt 3) und ist im Konto wieder aufrufbar
    if (ziel === 'app') { history.replaceState(null, '', location.pathname + location.search + '#konto'); ziel = 'konto'; rest = []; setTimeout(() => einstieg(2), 0); }
    if (modus !== 'partner') await modusSetzen('partner');
    // Kunden: Liste und Karte wechseln ohne neues Laden (Korrektur 1)
    if (ziel === 'kunden' && frei('kunden') && kundenWeich(rest)) { lauf++; markieren('kunden'); document.title = 'Kunden · Partnerportal'; return; }
    const seite = SEITEN[ziel] ? ziel : 'start';
    const nr = ++lauf;
    markieren(seite);
    document.title = `${TITEL[seite]} · Partnerportal`;
    const box = document.getElementById('inhalt');
    box.innerHTML = '<p class="laden">Einen Moment …</p>';
    try { await SEITEN[seite](box, rest, () => nr === lauf); }
    catch (e) { console.warn(e); if (nr === lauf) box.innerHTML = '<p class="meldung">Das hat nicht geklappt. Bitte lade die Seite neu.</p>'; }
    markieren(seite);
    if (window.Bewegung && nr === lauf) Bewegung.auftritt(box);
    if (!rest.length || (seite === 'tools' && rest[0] === 'seite')) window.scrollTo(0, 0);
  }

  // ================= BACKOFFICE =================
  // Zwei Anmeldungen bleiben getrennt: die Partner-Sitzung öffnet nur den Schalter, die Daten kommen ausschließlich
  // über die Supabase-Anmeldung des Dashboards (daten.js, Row Level Security). Ein normales Partnerkonto kommt nicht hinein.
  let boGeladen = null, boAngemeldet = false;
  const skript = (src) => new Promise((ok, f) => { const x = document.createElement('script'); x.src = src; x.onload = ok; x.onerror = () => f(new Error('Laden fehlgeschlagen: ' + src)); document.head.append(x); });
  function boLaden() {
    if (!boGeladen) { if (V) window.UK_DEMO = true; boGeladen = BO_SKRIPTE.reduce((k, src) => k.then(() => skript(src).catch((e) => { if (!src.includes('fragen.js')) throw e; console.warn(e.message); })), Promise.resolve()); }
    return boGeladen;
  }
  async function backoffice(reiter) {
    if (!S.p.team) { history.replaceState(null, '', location.pathname + location.search + '#start'); return zeigen(); }
    const nr = ++lauf;
    try { await boLaden(); } catch (e) { console.warn(e); return boFehler('Das Backoffice konnte nicht geladen werden. Bitte lade die Seite neu.'); }
    if (V) V.dashboard(Daten);
    let s = null;
    try { s = V && new URLSearchParams(location.search).has('bo-anmelden') && !boAngemeldet ? null : await Daten.anmeldung.sitzung(); } catch { s = null; }
    // Eine Anmeldung reicht (Jasmin, 09.11.2026): Team-Konten bekommen das Backoffice mit der Partner-Anmeldung dazu
    if (!s && !V) { try { await teamZugang(); s = await Daten.anmeldung.sitzung(); } catch (e) { console.warn('team-zugang', e); s = null; } }
    if (nr !== lauf) return;
    if (!s) return boAnmelden(reiter);
    if (!boAngemeldet) { await Backoffice.rolleLaden(); boAngemeldet = true; if (modus === 'bo') rahmen(); }
    if (modus !== 'bo') await modusSetzen('bo');
    if (reiter === 'menue') return boMenue();
    const r = reiter || Backoffice.zuletzt();
    markieren('bo/' + r);
    document.title = 'Backoffice · Ursprungskraft';
    await Backoffice.zeigen(r);
    markieren('bo/' + r);
    window.scrollTo(0, 0);
  }
  async function teamZugang() {
    const r = await fetch(SUPABASE + '/functions/v1/team-zugang', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sitzung: sitzung.lesen() }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.token_hash) throw new Error(d.fehler || 'team-zugang ' + r.status);
    await Daten.anmeldung.mitSchluessel(d.token_hash);
  }
  async function boFehler(t) { await modusSetzen('partner'); document.getElementById('inhalt').innerHTML = `<p class="meldung">${esc(t)}</p>`; }
  function boMenue() {
    const R = Backoffice.REITER.filter(Backoffice.sichtbar).filter(([z]) => !BO_LEISTE.some(([b]) => b === z));
    markieren('bo/menue');
    document.getElementById('inhalt').innerHTML = `${kopf('Mehr im Backoffice', '')}
      <nav class="mehr-liste">${R.map(([z, n, g]) => `<a href="#bo/${z}">${ico(BO_ICO[z] || 'start')}<span><b>${n}</b><small>${esc(g)}</small></span>${ico('rechts')}</a>`).join('')}
      <a href="#start">${ico('start')}<span><b>Zur Partneransicht</b><small>Deine Termine, Kunden und Tools</small></span>${ico('rechts')}</a></nav>
      <p style="margin-top:var(--a-4)"><button class="knopf zweit" type="button" data-bo-ab>Abmelden</button></p>`;
    document.querySelector('#inhalt [data-bo-ab]').onclick = boAbmelden;
    Bewegung.auftritt(document.getElementById('inhalt'));
  }
  // Einmal mit dem Dashboard-Zugang anmelden. Die Sitzung bleibt gespeichert, danach wechselt der Schalter direkt.
  async function boAnmelden(reiter, meldung = '') {
    await modusSetzen('partner'); markieren('');
    const box = document.getElementById('inhalt');
    box.innerHTML = `<section class="bo-anmelden">
      <p class="kicker">Backoffice</p><h1>Einmal anmelden.</h1>
      <p class="vorspann">Für das Backoffice brauchst du deinen Dashboard-Zugang. Danach merkt sich dieses Gerät die Anmeldung, und der Schalter wechselt ohne erneute Anmeldung.</p>
      <form id="f-bo" class="felder" novalidate>
        <label class="feld"><span class="titel">E-Mail</span><input type="email" name="email" autocomplete="username" value="${esc(S.p.email || '')}" required></label>
        <label class="feld"><span class="titel">Passwort</span><input type="password" name="passwort" autocomplete="current-password" required></label>
        <p class="meldung" id="bo-meldung">${esc(meldung)}</p>
        <div class="knoepfe"><button class="knopf" type="submit">Anmelden</button><button class="knopf still" type="button" id="bo-vergessen">Passwort vergessen?</button><a class="knopf still" href="#start">Zurück zur Partneransicht</a></div>
      </form></section>`;
    const f = document.getElementById('f-bo'), m = document.getElementById('bo-meldung');
    f.onsubmit = async (e) => {
      e.preventDefault(); const k = f.querySelector('[type=submit]'); k.disabled = true; m.className = 'meldung'; m.textContent = '';
      try { await Daten.anmeldung.anmelden(f.email.value.trim(), f.passwort.value); boAngemeldet = false; if (V) boAngemeldet = true, await Backoffice.rolleLaden(); backoffice(reiter); }
      catch (err) { m.textContent = Backoffice.fehlerText(err); }
      k.disabled = false;
    };
    document.getElementById('bo-vergessen').onclick = async () => {
      const email = f.email.value.trim(); if (!email) { m.textContent = 'Trag oben deine E-Mail ein, dann schicken wir dir einen Link.'; return; }
      try { await Daten.anmeldung.passwortVergessen(email); m.className = 'meldung gut'; m.textContent = 'Wenn die Adresse bekannt ist, kommt gleich eine Mail mit einem Link.'; } catch (err) { m.textContent = Backoffice.fehlerText(err); }
    };
    Bewegung.auftritt(box);
  }
  // Eine Anmeldung für beides, also auch eine Abmeldung für beides (09.11.2026)
  async function boAbmelden() { boAngemeldet = false; return abmelden(); }
  // Link aus einer Einladungs- oder Passwort-Mail des Dashboards: Passwort setzen, ohne Partneranmeldung
  async function boLinkSeite() {
    await boLaden();
    zugang();
    const teil = document.getElementById('teil'); document.querySelector('.reiter')?.remove();
    document.querySelector('.zugang-form h1').textContent = 'Backoffice';
    let s = null; try { s = await Daten.anmeldung.sitzung(); } catch {}
    if (Daten.linkArt === 'fehler' || !s) { teil.innerHTML = '<p class="hinweis">Der Link aus der Mail ist abgelaufen oder wurde schon benutzt. Melde dich im Portal an und wechsle ins Backoffice, dort kannst du dir einen neuen Link schicken lassen.</p><p style="margin-top:var(--a-3)"><a class="knopf" href="./">Zum Portal</a></p>'; return; }
    teil.innerHTML = `<form id="f" novalidate><p class="leise">Mindestens 10 Zeichen. Leg es danach gleich in deinen Passwort-Manager.</p>
      <label class="feld"><span class="titel">Neues Passwort</span><input type="password" name="p1" autocomplete="new-password"></label>
      <label class="feld"><span class="titel">Noch einmal</span><input type="password" name="p2" autocomplete="new-password"></label>
      <p class="meldung" id="fehler"></p><div class="knoepfe"><button class="knopf" type="submit">Speichern</button></div></form>`;
    document.getElementById('f').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target, m = document.getElementById('fehler');
      if ((f.p1.value || '').length < 10) return (m.textContent = 'Bitte mindestens 10 Zeichen.');
      if (f.p1.value !== f.p2.value) return (m.textContent = 'Die beiden Eingaben sind nicht gleich.');
      try { await Daten.anmeldung.passwortSetzen(f.p1.value); history.replaceState(null, '', location.pathname); location.reload(); } catch (err) { m.textContent = Backoffice.fehlerText(err); }
    };
  }
  window.addEventListener('hashchange', zeigen);

  // ================= START =================
  // Dramaturgie: Begrüßung, drei Zahlen zum Tag, der nächste Termin als dunkler Blickpunkt, dann Tagesplan, Neuigkeiten, Tools.
  function gruss() {
    // "13 Uhr" ist keine Zahl: Stunde einzeln holen (Fehler vom 09.11.2026, mittags stand "Guten Abend")
    const h = Number(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).find((x) => x.type === 'hour').value);
    return h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
  }
  // Farbe je Art: im Kalender, in der Liste und im geöffneten Termin dieselbe
  const artKlasse = (art) => ({ 'Termin vor Ort': 'c-ort', 'Rückruf': 'c-anruf', Anruf: 'c-anruf', Zoom: 'c-zoom' }[art] || 'c-sonst');
  const eKlasse = (e) => (e.typ === 'melden' ? 'c-melden' : artKlasse(e.t.art));
  const eTitel = (e) => (e.typ === 'melden' ? nameVon(e.k) : e.t.name || e.t.notiz || e.t.art);
  const endeVon = (t) => new Date(new Date(t.beginn).getTime() + (t.minuten || 60) * 60000);
  // Eine Zeile im Terminplan. Alle Knöpfe leise, der Hauptknopf der Seite steht oben.
  function terminZeile(e, opt = {}) {
    if (e.typ === 'melden') {
      const k = e.k;
      return `<article class="termin melden c-melden"><div class="zeit">Melden</div><div class="was">
        <h3><a href="#kunden/${esc(k.id)}">${esc(nameVon(k))}</a></h3>
        <p class="art">Wieder melden</p>
        ${k.verblieben ? `<p class="ort">${esc(k.verblieben)}</p>` : ''}</div>
        ${k.telefon ? `<div class="knoepfe"><a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a></div>` : ''}</article>`;
    }
    const t = e.t, k = (S.kunden || []).find((x) => x.id === t.kunde_id);
    const knoepfe = [
      istAdresse(t.ort) && `<a class="knopf zweit" href="${route(t.ort)}" target="_blank" rel="noopener">${ico('route')} Route</a>`,
      istLink(t.ort) && `<a class="knopf zweit" href="${esc(t.ort)}" target="_blank" rel="noopener">Teilnehmen</a>`,
      k?.telefon && `<a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a>`,
      opt.loeschen && `<button class="knopf still" type="button" data-weg="${esc(t.id)}">Löschen</button>`,
    ].filter(Boolean).join('');
    return `<article class="termin ${artKlasse(t.art)}"><div class="zeit">${uhr(t.beginn)}<small>bis ${uhr(endeVon(t).toISOString())}</small></div><div class="was">
      <h3>${t.name ? (t.kunde_id ? `<a href="#kunden/${esc(t.kunde_id)}">${esc(t.name)}</a>` : esc(t.name)) : esc(t.notiz || t.art)}</h3>
      <p class="art">${esc(t.art)}</p>
      ${t.ort && !istLink(t.ort) ? `<p class="ort">${esc(t.ort)}</p>` : ''}
      ${t.name && t.notiz ? `<p class="ort">${esc(t.notiz)}</p>` : ''}</div>
      ${knoepfe ? `<div class="knoepfe">${knoepfe}</div>` : ''}</article>`;
  }
  // Einträge ab heute, nach Tagen gruppiert. Überfälliges "Wieder melden" steht bei heute.
  function plan(alle, opt = {}) {
    const h = heute(), von = opt.von || h, bis = plusTage(h, opt.tage ?? 14);
    const vorbei = (e) => e.typ === 'termin' && endeVon(e.t).getTime() < Date.now();
    let liste = alle.filter((e) => e.tag >= von && e.tag <= bis && !vorbei(e) && !(opt.ohne && e.t && e.t.id === opt.ohne));
    if (von <= h) liste = [...alle.filter((e) => e.typ === 'melden' && e.tag < h).map((e) => ({ ...e, tag: h })), ...liste];
    liste = liste.slice(0, opt.max ?? 99);
    if (!liste.length) return '';
    const gruppen = {};
    for (const e of liste) (gruppen[e.tag] = gruppen[e.tag] || []).push(e);
    return `<div class="plan">${Object.keys(gruppen).sort().map((t) => `${opt.ohneKopf ? '' : `<p class="tag-kopf">${relativ(t) ? relativ(t) + ', ' : ''}${tagName(t)}</p>`}
      ${gruppen[t].sort((a, b) => (a.typ === 'melden') - (b.typ === 'melden')).map((e) => terminZeile(e, opt)).join('')}`).join('')}</div>`;
  }
  async function start(box, rest, aktuell) {
    const [, , news] = await Promise.all([termineLaden().catch(() => (S.termine = [])), kundenLaden().catch(() => (S.kunden = [])), newsLaden()]);
    if (!aktuell()) return;
    const alle = eintraege(), h = heute();
    const naechster = alle.find((e) => e.typ === 'termin' && endeVon(e.t).getTime() >= Date.now());
    const faellige = (S.kunden || []).filter(faelligK), neue = (S.kunden || []).filter((k) => !k.abgelegt && k.stand === 'neu');
    const ini = (k) => `${(k.vorname || '?')[0]}${(k.nachname || '')[0] || ''}`.toUpperCase();
    const auf = `<svg class="pf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>`;
    const schloss = (b) => (frei(b) ? '' : `<span class="f-schloss">${ico('schloss')} Freischalten</span>`);
    let n = 0; const i = () => `style="--i:${n++}"`;
    // Das helle Feld: der nächste Termin
    let jetzt;
    if (naechster) {
      const t = naechster.t, k = (S.kunden || []).find((x) => x.id === t.kunde_id), min = Math.round((new Date(t.beginn) - Date.now()) / 60000);
      const noch = min <= 0 ? 'läuft gerade' : min < 60 ? `in ${min} Min.` : min < 1440 ? `in ${Math.floor(min / 60)} Std. ${min % 60} Min.` : `${relativ(naechster.tag) || tagName(naechster.tag)}`;
      jetzt = `<section class="f f-jetzt" ${i()}><a class="f-ganz" href="#termine/${naechster.tag}" aria-label="Termin im Kalender öffnen"></a>
        <p class="f-name">Als Nächstes</p><p class="uhr">${[...uhr(t.beginn)].map((z, m) => `<span style="--n:${m}">${z}</span>`).join('')}</p>
        <span class="noch"><i></i>${noch}, bis ${uhr(endeVon(t).toISOString())} Uhr</span>
        <h2>${esc(eTitel(naechster))}</h2><p>${esc(t.art)}${t.ort && !istLink(t.ort) ? ', ' + esc(t.ort) : ''}</p>
        <div class="knoepfe">${[
          istAdresse(t.ort) && `<a class="knopf hell" href="${route(t.ort)}" target="_blank" rel="noopener">${ico('route')} Route starten</a>`,
          istLink(t.ort) && `<a class="knopf hell" href="${esc(t.ort)}" target="_blank" rel="noopener">Teilnehmen</a>`,
          k?.telefon && `<a class="knopf hell-zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a>`,
          t.kunde_id && `<a class="knopf hell-zweit" href="#kunden/${esc(t.kunde_id)}">Kundenkarte</a>`].filter(Boolean).join('')}</div></section>`;
    } else {
      jetzt = `<section class="f f-jetzt ohne" ${i()}><p class="f-name">Dein Kalender</p><h1>Noch kein Termin eingetragen.</h1>
        <p>Trag deinen nächsten Rückruf oder Termin ein. Er erscheint auch im Kalender auf deinem Handy.</p>
        <div class="knoepfe"><a class="knopf hell" href="#termine/neu">${ico('plus')} Termin eintragen</a></div></section>`;
    }
    // Die nächsten sieben Tage als Balken
    const tage = Array.from({ length: 7 }, (_, d) => { const t = plusTage(h, d); return { t, z: alle.filter((e) => e.tag === t).length, w: TAGE[new Date(t + 'T12:00:00').getDay()].slice(0, 2) }; });
    const woche = `<a class="f f-woche" href="#termine" ${i()}><p class="f-name">Die nächsten Tage ${auf}</p>
      <ol class="f-balken">${tage.map((d, m) => `<li class="${m ? '' : 'heute'}"><i style="--h:${Math.min(d.z, 3)};--n:${m}"></i>${d.w}</li>`).join('')}</ol></a>`;
    const anrufe = `<section class="f f-anrufe" ${i()}><a class="f-name" href="#kunden" data-kf="faellig" style="text-decoration:none">Heute anrufen <span>${faellige.length || ''}</span></a>
      ${faellige.length ? faellige.slice(0, 4).map((k) => `<div class="f-zeile"><span class="kreis">${esc(ini(k))}</span><a href="#kunden/${esc(k.id)}" style="color:inherit;text-decoration:none;min-width:0"><b>${esc(nameVon(k))}</b><small>${esc(k.verblieben || k.ort || 'Wieder melden')}</small></a>
        ${k.telefon ? `<a class="an" href="tel:${esc(tel(k.telefon))}" aria-label="${esc(nameVon(k))} anrufen">${ico('telefon')}</a>` : '<span></span>'}</div>`).join('')
        : '<p class="f-unten">Heute wartet niemand auf deinen Anruf.</p>'}</section>`;
    const neuFeld = `<a class="f f-neu" href="#kunden" data-kf="neu" ${i()}><p class="f-name">Neue Anfragen ${auf}</p><p class="f-gross" data-zahl="${neue.length}">${neue.length}</p>
      ${neue.length ? `<div class="f-lauf"><div${neue.length < 3 ? ' style="animation:none"' : ''}>${neue.slice(0, 3).map((k) => `<span>${esc(nameVon(k))}${k.quelle ? ', ' + esc(k.quelle) : ''}</span>`).join('')}</div></div>` : '<p class="f-unten">Sobald jemand anfragt, steht er hier.</p>'}</a>`;
    const seite = `<a class="f f-bild f-seite" href="#tools/seite" ${i()}>${foto('landingpage')}${schloss('seite')}<div class="f-schrift"><p class="f-name">Deine Landingpage ${auf}</p><h2>Ein Link, der für dich erklärt.</h2></div></a>`;
    const flyerFeld = `<a class="f f-bild f-flyer" href="#flyer" ${i()}>${flyerFoto()}${schloss('flyer')}<div class="f-schrift"><p class="f-name">Flyer ${auf}</p><h2>Einladung in zwei Minuten.</h2></div></a>`;
    const neues = news[0] ? `<a class="f f-khaki f-news" href="#neuigkeiten" ${i()}><p class="f-name">Neu von ${esc(news[0].von || 'Ursprungskraft')} ${auf}</p><h2 class="f-kurz" style="margin-top:14px">${esc(news[0].text)}</h2><p class="f-unten">${relativ(tagVon(news[0].erstellt)) || tagKurz(news[0].erstellt)}</p></a>` : '';
    const bz = Number(S.p.bestellungen) || 0;
    const bestell = `<a class="f f-bestell" href="#tools/bestellen" ${i()}><p class="f-name">Dein Bestell-Link ${auf}</p><h2 class="f-unten">${bz === 1 ? '1 Bestellung' : bz + ' Bestellungen'} über deinen Link</h2></a>`;
    const einr = S.einstieg && !S.einstieg.fertig ? `<section class="f f-einr einrichtung" id="einrichtung" ${i()}><p class="f-name">Deine Einrichtung</p>
      <div class="knoepfe" style="margin:12px 0"><button class="knopf zweit" type="button" data-einstieg="0">Einführung ansehen</button><button class="knopf still" type="button" data-einstieg="2">${ico('app')} App aufs Handy holen</button></div>
      <label class="haken"><input type="checkbox" data-einrichtung-fertig><span><b>Einrichtung abgeschlossen</b><small>Dann verschwindet dieses Feld. Die Einführung findest du weiter unter Konto.</small></span></label></section>` : '';
    box.innerHTML = `<div class="start">
      <header class="held"><p class="kicker">${tagName(h)}</p><h1 class="woerter">${gruss()}, ${esc(S.p.vorname)}.</h1></header>
      <div class="felder-raster">${jetzt}${woche}${seite}${anrufe}${neuFeld}${flyerFeld}${neues}${bestell}${einr}</div>
    </div>`;
    box.querySelectorAll('[data-kf]').forEach((a) => (a.onclick = () => { if (a.dataset.kf === 'faellig') { K.extra = 'faellig'; K.filter = 'alle'; } else { K.extra = ''; K.filter = 'neu'; } }));
    box.querySelectorAll('[data-einstieg]').forEach((b) => (b.onclick = () => einstieg(Number(b.dataset.einstieg))));
    const hk = box.querySelector('[data-einrichtung-fertig]');
    if (hk) hk.onchange = () => { if (!hk.checked) return; einstiegSetzen('fertig'); toast('Einrichtung abgeschlossen. Die Einführung findest du weiter unter Konto.');
      const k = document.getElementById('einrichtung'); if (ruhig()) return k.remove(); k.classList.add('geht'); setTimeout(() => k.remove(), 460); };
    mocksFertig(box);
  }
  // Fotos aus einer Serie. Gleiche Dateinamen in bilder/: Kommt eine neue Serie, reicht es, die Dateien zu ersetzen.
  const foto = (n) => `<img class="foto" src="bilder/portal-${n}.jpg" alt="" loading="lazy">`;
  // Flyer-Foto: Auf dem Handy im Bild liegt der echte Flyer aus dem Editor (Story-Format), per Code auf den Bildschirm gesetzt.
  // Die Werte sind die Lage des Bildschirms in portal-flyer.jpg, in Prozent von Bildbreite und Bildhöhe.
  // Zeigt ein neues Foto kein Handy von vorn: FLYER_SCHIRM = null setzen, dann erscheint nur das Foto.
  const FLYER_SCHIRM = { links: 41.0, oben: 15.1, breit: 20.85, hoch: 68.4, ecke: '14% / 6.4%' };
  const flyerFoto = () => (FLYER_SCHIRM ? `<div class="buehne"><div class="buehne-innen">${foto('flyer')}<div class="handy-schirm" data-mock-flyer style="left:${FLYER_SCHIRM.links}%;top:${FLYER_SCHIRM.oben}%;width:${FLYER_SCHIRM.breit}%;height:${FLYER_SCHIRM.hoch}%;border-radius:${FLYER_SCHIRM.ecke}"></div></div></div>` : foto('flyer'));
  // Assistent: Foto plus Nachrichten, die nacheinander aufploppen
  const assistentBuehne = () => `<div class="buehne"><div class="buehne-innen">${foto('assistent')}</div><div class="meldungen" aria-hidden="true">
    <div class="meldung-tg"><img src="symbol/favicon-48.png" alt=""><span><b>Neue Anfrage</b>Sabine K. möchte ihr Wasser testen lassen</span></div>
    <div class="meldung-tg"><img src="symbol/favicon-48.png" alt=""><span><b>Termin eingetragen</b>Donnerstag, 18:30 Uhr, Infoabend</span></div>
    <div class="meldung-tg"><img src="symbol/favicon-48.png" alt=""><span><b>Guten Morgen</b>Heute stehen 2 Rückrufe an</span></div></div></div>`;
  const kachel = (href, bild, titel, text) => `<a class="kachel" href="${href}"><div class="bild">${bild}</div>
    <div class="text"><h3>${esc(titel)} ${ico('pfeil')}</h3><p>${esc(text)}</p></div></a>`;
  const neuigkeit = (n) => `<article class="neuigkeit${n.erstellt > neuAb() ? ' neu' : ''}"><small>${esc(n.von || 'Ursprungskraft')}, ${relativ(tagVon(n.erstellt)) || tagKurz(n.erstellt)}</small><p>${esc(n.text)}</p></article>`;
  const istApp = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  // Den zuletzt gebauten Flyer (oder die erste Vorlage) mit flyer.js auf die Handy-Bildschirme in den Fotos zeichnen
  async function mocksFertig(box) {
    const ziele = [...box.querySelectorAll('[data-mock-flyer]')]; if (!ziele.length || !window.Flyer) return;
    let d; try { d = JSON.parse(localStorage.getItem('uk-partner-flyer') || 'null'); } catch { d = null; }
    const U = Flyer.UEBERSCHRIFTEN;
    d = Object.assign({ art: 'Einladung', titel: U[0][0], text: U[0][1], zeit: '19:00', name: nameVon(S.p), farbe: 'blau', foto: 'frau-kueche' }, d || {});
    if (!Flyer.FOTOS[d.foto]) d.foto = 'frau-kueche';
    if (!Flyer.FARBEN[d.farbe]) d.farbe = 'blau';
    try { await Promise.all([Flyer.vorbereiten(), Flyer.fotoLaden(d.foto)]); } catch { return; }
    for (const z of ziele) { const c = document.createElement('canvas'); Flyer.zeichnen(c, 'story', d.farbe, d.foto, d, 0.4); z.replaceChildren(c); }
  }

  // ================= TERMINE =================
  // Kalender wie auf dem Handy gewohnt. Am Computer: Monat, jeder Tag ein Feld, Einträge mit Uhrzeit und Name, farbig nach Art.
  // Klick auf einen Eintrag öffnet ihn, Klick auf einen leeren Tag legt einen Termin an.
  // Am Handy: Wochenleiste zum Wischen, darunter der gewählte Tag als gut lesbare Liste. Dazu überall die Liste aller Termine.
  const T = { ansicht: 'kalender', monat: null, tag: null };
  try { if (localStorage.getItem('uk-termine-ansicht') === 'liste') T.ansicht = 'liste'; } catch {}
  const WT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const breit = () => matchMedia('(min-width: 800px)').matches;
  async function termine(box, rest, aktuell) {
    if (!frei('termine')) { box.innerHTML = gesperrt('termine'); return; }
    await Promise.all([termineLaden(), kundenLaden().catch(() => (S.kunden = []))]);
    if (!aktuell()) return;
    const h = heute();
    if (/^\d{4}-\d{2}-\d{2}$/.test(rest[0] || '')) { T.tag = rest[0]; T.monat = rest[0].slice(0, 7); T.ansicht = 'kalender'; }
    T.tag = T.tag || h; T.monat = T.monat || T.tag.slice(0, 7);
    const alle = eintraege();
    const kalAdresse = KALENDER.replace('https://', 'webcal://') + S.p.kalender;
    box.innerHTML = `${kopf('Termine', '', `<button class="knopf" type="button" data-neu>${ico('plus')} Termin eintragen</button>`)}
      ${alle.length ? '' : `<p class="hinweis" style="margin-bottom:var(--s-4)"><b>Dein Kalender ist noch leer.</b> ${breit() ? 'Klick auf einen Tag' : 'Tipp auf Termin eintragen'}, um deinen ersten Rückruf oder Termin festzuhalten. Er erscheint auch im Kalender auf deinem Handy, mit Erinnerung 30 Minuten vorher.</p>`}
      <div class="kal kal-ansicht-${T.ansicht}" id="kal">
        <div class="kal-kopf"><h2 id="kal-titel" aria-live="polite"></h2>
          <div class="kal-nav"><button type="button" data-schritt="-1" aria-label="Zurück">${ico('links')}</button><button type="button" data-heute>Heute</button><button type="button" data-schritt="1" aria-label="Weiter">${ico('rechts')}</button></div>
          <div class="umschalter" role="group" aria-label="Ansicht"><button type="button" data-ansicht="kalender" aria-pressed="${T.ansicht === 'kalender'}"><span class="nur-breit">Monat</span><span class="nur-schmal">Tag</span></button><button type="button" data-ansicht="liste" aria-pressed="${T.ansicht === 'liste'}">Liste</button></div></div>
        <div class="kal-wtzeile" aria-hidden="true">${WT.map((x) => `<span class="kal-wt">${x}</span>`).join('')}</div>
        <div class="kal-gitter" id="kal-gitter"></div>
        <div class="kal-woche" id="kal-woche"></div>
        <div class="kal-tagteil"><div class="kal-tagkopf"><h3 id="kal-tagtitel"></h3><button type="button" class="pfeil-link knopf still" data-neu-tag>${ico('plus')} Termin</button></div><div class="kal-tagliste" id="kal-tagliste"></div></div>
        <p class="kal-legende"><span class="c-ort">Termin vor Ort</span><span class="c-anruf">Rückruf und Anruf</span><span class="c-zoom">Zoom</span><span class="c-sonst">Sonstiges</span><span class="c-melden">Wieder melden</span></p>
        <div class="kal-listenteil">
          <section><div class="abschnitt-kopf"><h2>Heute</h2></div>${plan(alle, { tage: 0, ohneKopf: true, loeschen: true }) || '<p class="leer">Heute steht nichts an.</p>'}</section>
          <section class="abschnitt"><div class="abschnitt-kopf"><h2>Die nächsten Termine</h2></div>${plan(alle, { von: plusTage(h, 1), tage: 60, loeschen: true }) || '<p class="leer">In den nächsten Wochen ist nichts eingetragen.</p>'}</section>
        </div>
      </div>
      <div class="abschnitt">
      <details class="aufklappen abo"><summary>Termine im Kalender auf deinem Handy</summary>
        <p class="leise" style="max-width:40em;margin-bottom:var(--s-3)">Einmal verbinden, danach erscheint jeder Termin von selbst in deinem Handykalender. Behalte den Link für dich, sonst sieht jemand anders deine Termine.</p>
        <div class="knoepfe"><a class="knopf zweit" href="${esc(kalAdresse)}">Mit iPhone verbinden</a>
        <a class="knopf zweit" href="https://calendar.google.com/calendar/r?cid=${encodeURIComponent(kalAdresse)}" target="_blank" rel="noopener">Mit Google Kalender verbinden</a>
        <button class="knopf still" type="button" data-abo>${ico('kopie')} Link kopieren</button></div></details>
      <details class="aufklappen"><summary>Vergangene Termine der letzten 30 Tage</summary><div>${alle.filter((e) => e.typ === 'termin' && e.tag < h).reverse().map((e) => `<p class="leise klein">${tagKurz(e.tag)}, ${uhr(e.t.beginn)} Uhr: ${esc(e.t.art)}${e.t.name ? ', ' + esc(e.t.name) : ''}</p>`).join('') || '<p class="leer klein">Keine.</p>'}</div></details>
      </div>`;
    const kal = document.getElementById('kal');
    const chip = (e, n) => `<button type="button" class="kal-chip ${eKlasse(e)}" data-e="${alle.indexOf(e)}" style="--i:${n}"><time>${e.typ === 'melden' ? 'Melden' : uhr(e.t.beginn)}</time><span>${esc(eTitel(e))}</span></button>`;
    const malen = (richtung = 0) => {
      const [j, mo] = T.monat.split('-').map(Number), versatz = (new Date(j, mo - 1, 1).getDay() + 6) % 7;
      document.getElementById('kal-titel').textContent = `${MONATE[mo - 1]} ${j}`;
      // Monat: jeder Tag ein Feld
      const zellen = [];
      for (let i = 0; i < 42; i++) {
        if (i === 35 && new Date(j, mo - 1, 1 - versatz + 35).getMonth() !== mo - 1) break;
        const d = new Date(j, mo - 1, 1 - versatz + i), t = d.toLocaleDateString('sv-SE'), auf = alle.filter((e) => e.tag === t);
        zellen.push(`<div class="kal-tag${d.getMonth() !== mo - 1 ? ' anders' : ''}${t === h ? ' heute' : ''}">
          <button type="button" class="kal-neu" data-neu-am="${t}" aria-label="Termin am ${tagName(t)} eintragen"></button><span class="nr">${d.getDate()}</span>
          ${auf.slice(0, auf.length > 3 ? 2 : 3).map((e, n) => chip(e, i + n)).join('')}${auf.length > 3 ? `<button type="button" class="kal-mehr" data-mehr="${t}">+${auf.length - 2} weitere</button>` : ''}</div>`);
      }
      const g = document.getElementById('kal-gitter'); g.innerHTML = zellen.join('');
      // Woche des gewählten Tags
      const wt = (new Date(T.tag + 'T12:00:00').getDay() + 6) % 7, montag = plusTage(T.tag, -wt);
      const w = document.getElementById('kal-woche');
      w.innerHTML = WT.map((n, i) => { const t = plusTage(montag, i), auf = alle.filter((e) => e.tag === t);
        return `<button type="button" data-tag="${t}" class="${t === h ? 'heute' : ''}" aria-pressed="${t === T.tag}" aria-label="${tagName(t)}${auf.length ? `, ${auf.length} ${auf.length === 1 ? 'Eintrag' : 'Einträge'}` : ''}"><small>${n}</small><b>${Number(t.slice(8))}</b><i>${auf.slice(0, 3).map((e) => `<u class="${eKlasse(e)}"></u>`).join('')}</i></button>`; }).join('');
      // Der gewählte Tag
      const auf = alle.filter((e) => e.tag === T.tag);
      document.getElementById('kal-tagtitel').textContent = `${relativ(T.tag) ? relativ(T.tag) + ', ' : ''}${tagName(T.tag)}`;
      const tl = document.getElementById('kal-tagliste');
      tl.innerHTML = auf.length ? auf.map((e) => terminZeile(e, { loeschen: true })).join('') : '<p class="leer">An diesem Tag ist nichts eingetragen.</p>';
      if (richtung && !ruhig()) for (const x of [g, w, tl]) { x.classList.remove('kal-bewegt', 'zurueck-r'); void x.offsetWidth; x.classList.add('kal-bewegt'); if (richtung < 0) x.classList.add('zurueck-r'); }
    };
    const schritt = (n) => {
      if (breit()) { const [j, mo] = T.monat.split('-').map(Number), d = new Date(j, mo - 1 + n, 1); T.monat = d.toLocaleDateString('sv-SE').slice(0, 7); T.tag = h.startsWith(T.monat) ? h : T.monat + '-01'; }
      else { T.tag = plusTage(T.tag, 7 * n); T.monat = T.tag.slice(0, 7); }
      malen(n);
    };
    malen();
    const loeschen = async (id) => {
      if (!confirm('Diesen Termin wirklich löschen?')) return false;
      const r = await mitSitzung('uk_partner_termin_loeschen', { p_id: id });
      if (r.error) { toast('Das hat nicht geklappt.'); return false; }
      S.termine = null; toast('Termin gelöscht.'); zeigen(); return true;
    };
    kal.onclick = (ev) => {
      const z = (s) => ev.target.closest(s);
      let x;
      if ((x = z('[data-e]'))) return terminDetail(alle[Number(x.dataset.e)], loeschen);
      if ((x = z('[data-mehr]'))) return tagBlatt(x.dataset.mehr, alle, loeschen);
      if ((x = z('[data-neu-am]'))) return terminBlatt({ datum: x.dataset.neuAm });
      if ((x = z('[data-neu-tag]'))) return terminBlatt({ datum: T.tag });
      if ((x = z('.kal-woche [data-tag]'))) { const alt = T.tag; T.tag = x.dataset.tag; T.monat = T.tag.slice(0, 7); malen(); const tl = document.getElementById('kal-tagliste'); if (!ruhig() && alt !== T.tag) { tl.classList.remove('kal-bewegt', 'zurueck-r'); void tl.offsetWidth; tl.classList.add('kal-bewegt'); if (T.tag < alt) tl.classList.add('zurueck-r'); } return; }
      if ((x = z('[data-schritt]'))) return schritt(Number(x.dataset.schritt));
      if ((x = z('[data-heute]'))) { const r = T.tag === h ? 0 : T.tag < h ? 1 : -1; T.tag = h; T.monat = h.slice(0, 7); return malen(r); }
      if ((x = z('[data-ansicht]'))) {
        T.ansicht = x.dataset.ansicht; try { localStorage.setItem('uk-termine-ansicht', T.ansicht); } catch {}
        kal.className = `kal kal-ansicht-${T.ansicht}`;
        kal.querySelectorAll('[data-ansicht]').forEach((b) => b.setAttribute('aria-pressed', String(b === x)));
        const teil = kal.querySelector(T.ansicht === 'liste' ? '.kal-listenteil' : breit() ? '.kal-gitter' : '.kal-tagteil');
        if (teil && !ruhig()) { teil.classList.remove('rein'); void teil.offsetWidth; teil.style.setProperty('--i', 0); Bewegung.rein(teil); }
        return;
      }
      if ((x = z('[data-weg]'))) return loeschen(x.dataset.weg);
    };
    // Am Handy durch die Wochen wischen
    let x0 = null; const woche = document.getElementById('kal-woche');
    woche.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    woche.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 48) schritt(dx < 0 ? 1 : -1); }, { passive: true });
    box.querySelector('[data-abo]').onclick = () => kopieren(KALENDER + S.p.kalender, 'Kalender-Link kopiert.');
    box.querySelector('[data-neu]').onclick = () => terminBlatt({ datum: T.ansicht === 'kalender' && !breit() ? T.tag : '' });
    if (rest[0] === 'neu') terminBlatt({});
  }
  // Ein geöffneter Eintrag: alles zum Termin und die nächsten Handgriffe
  function terminDetail(e, loeschen) {
    const d = document.createElement('dialog'); d.className = `blatt termin-detail ${eKlasse(e)}`;
    const zeile = (t, w) => (w ? `<div><dt>${t}</dt><dd>${w}</dd></div>` : '');
    let innen;
    if (e.typ === 'melden') {
      const k = e.k;
      innen = `<p class="kicker">Wieder melden</p><h2>${esc(nameVon(k))}</h2><p class="wann">${relativ(e.tag) ? relativ(e.tag) + ', ' : ''}${tagName(e.tag)}</p>
        <dl>${zeile('Vereinbart', esc(k.verblieben || ''))}${zeile('Telefon', esc(k.telefon || ''))}${zeile('Erreichbar', esc(k.erreichbar || ''))}</dl>
        <div class="knoepfe">${k.telefon ? `<a class="knopf" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a><a class="knopf zweit" href="${wa(k.telefon)}" target="_blank" rel="noopener">${ico('whatsapp')} WhatsApp</a>` : ''}
          <a class="knopf zweit" href="#kunden/${esc(k.id)}" data-zu>Kundenkarte</a></div>`;
    } else {
      const t = e.t, k = (S.kunden || []).find((x) => x.id === t.kunde_id);
      innen = `<p class="kicker">${esc(t.art)}</p><h2>${esc(eTitel(e))}</h2><p class="wann">${relativ(e.tag) ? relativ(e.tag) + ', ' : ''}${tagName(e.tag)}, ${uhr(t.beginn)} bis ${uhr(endeVon(t).toISOString())} Uhr</p>
        <dl>${zeile('Ort', t.ort && !istLink(t.ort) ? esc(t.ort) : '')}${zeile('Notiz', t.name && t.notiz ? esc(t.notiz) : '')}${zeile('Telefon', esc(k?.telefon || ''))}</dl>
        <div class="knoepfe">${istAdresse(t.ort) ? `<a class="knopf" href="${route(t.ort)}" target="_blank" rel="noopener">${ico('route')} Route</a>` : ''}
          ${istLink(t.ort) ? `<a class="knopf" href="${esc(t.ort)}" target="_blank" rel="noopener">Teilnehmen</a>` : ''}
          ${k?.telefon ? `<a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a>` : ''}
          ${t.kunde_id ? `<a class="knopf zweit" href="#kunden/${esc(t.kunde_id)}" data-zu>Kundenkarte</a>` : ''}
          <button class="knopf still" type="button" data-loeschen>Löschen</button></div>`;
    }
    d.innerHTML = `<div class="blatt-innen"><div class="blatt-kopf"><i class="streifen"></i><button class="knopf still" type="button" data-zu aria-label="Schließen">${ico('zu')}</button></div>${innen}</div>`;
    document.body.append(d); d.showModal(); d.addEventListener('close', () => d.remove());
    d.addEventListener('click', (ev) => { if (ev.target === d) d.close(); });
    d.querySelectorAll('[data-zu]').forEach((b) => b.addEventListener('click', () => d.close()));
    const l = d.querySelector('[data-loeschen]'); if (l) l.onclick = async () => { if (await loeschen(e.t.id)) d.close(); };
  }
  // Alle Einträge eines Tages (hinter "+ weitere")
  function tagBlatt(tag, alle, loeschen) {
    const d = document.createElement('dialog'); d.className = 'blatt';
    d.innerHTML = `<div class="blatt-innen"><div class="blatt-kopf"><h2>${relativ(tag) ? relativ(tag) + ', ' : ''}${tagName(tag)}</h2><button class="knopf still" type="button" data-zu aria-label="Schließen">${ico('zu')}</button></div>
      <div>${alle.filter((e) => e.tag === tag).map((e) => terminZeile(e, { loeschen: true })).join('')}</div>
      <div class="knoepfe"><button class="knopf" type="button" data-neu-am>${ico('plus')} Termin an diesem Tag</button></div></div>`;
    document.body.append(d); d.showModal(); d.addEventListener('close', () => d.remove());
    d.addEventListener('click', (ev) => { if (ev.target === d || ev.target.closest('[data-zu], a[href^="#"]')) d.close(); });
    d.querySelector('[data-neu-am]').onclick = () => { d.close(); terminBlatt({ datum: tag }); };
    d.querySelectorAll('[data-weg]').forEach((b) => (b.onclick = async () => { if (await loeschen(b.dataset.weg)) d.close(); }));
  }
  const kopf = (titel, vorspann = '', knopf = '') => `<header class="seitenkopf"><h1>${esc(titel)}</h1>${knopf}${vorspann ? `<p class="vorspann">${esc(vorspann)}</p>` : ''}</header>`;

  function terminBlatt(vor = {}) {
    const d = document.createElement('dialog'); d.className = 'blatt';
    const kunden = (S.kunden || []).filter((k) => !k.abgelegt && !String(k.id).startsWith('best-') && k.art !== 'lead');
    d.innerHTML = `<form method="dialog" novalidate>
      <div class="blatt-kopf"><h2>Termin eintragen</h2><button class="knopf still" value="zu" aria-label="Schließen">${ico('zu')}</button></div>
      <p class="leise klein">Erscheint auch im Kalender auf deinem Handy, mit Erinnerung 30 Minuten vorher.</p>
      <div class="felder zwei">
        <label class="feld"><span class="titel">Was für ein Termin?</span><select name="art">${ARTEN.map((a) => `<option${a === vor.art ? ' selected' : ''}>${a}</option>`).join('')}</select></label>
        <label class="feld"><span class="titel">Mit wem?</span><select name="kunde_id"><option value="">Niemand bestimmtes</option>${kunden.map((k) => `<option value="${esc(k.id)}"${k.id === vor.kunde_id ? ' selected' : ''}>${esc(nameVon(k))}</option>`).join('')}</select></label>
        <label class="feld"><span class="titel">Datum</span><input type="date" name="datum" value="${esc(vor.datum || '')}" required></label>
        <label class="feld"><span class="titel">Uhrzeit</span><input type="time" name="uhrzeit" required></label>
        <label class="feld"><span class="titel">Dauer</span><select name="minuten"><option value="15">15 Minuten</option><option value="30">30 Minuten</option><option value="60" selected>1 Stunde</option><option value="90">1,5 Stunden</option><option value="120">2 Stunden</option></select></label>
        <label class="feld"><span class="titel">Wo? Adresse oder Zoom-Link</span><input name="ort" placeholder="Straße, PLZ Ort"></label>
        <label class="feld ganz"><span class="titel">Notiz</span><input name="notiz"></label>
      </div>
      <p class="meldung"></p>
      <div class="knoepfe"><button class="knopf" type="submit" value="ok">Termin speichern</button></div></form>`;
    document.body.append(d); d.showModal();
    d.addEventListener('close', () => d.remove());
    const f = d.querySelector('form');
    f.onsubmit = async (e) => {
      if (e.submitter?.value === 'zu') return;
      e.preventDefault();
      const w = Object.fromEntries(new FormData(f).entries()), m = f.querySelector('.meldung');
      if (!w.datum || !w.uhrzeit) return (m.textContent = 'Bitte gib Datum und Uhrzeit an.');
      const r = await mitSitzung('uk_partner_termin_speichern', { p: w });
      if (r.error || !r.data) return (m.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.');
      d.close(); S.termine = null; T.tag = w.datum; T.monat = w.datum.slice(0, 7); toast('Termin gespeichert. Er erscheint auch in deinem Handykalender.');
      if (location.hash === '#termine/neu') location.hash = 'termine/' + w.datum; else zeigen();
    };
  }

  // ================= KUNDEN =================
  // Korrektur 1: Liste über die volle Breite. Klick öffnet die Karteikarte als eigene Ansicht im selben Bereich.
  // Liste und Karte bleiben im Speicher: Wechsel ohne neues Laden, Filter und Scrollposition der Liste bleiben erhalten.
  const K = { filter: 'alle', extra: '', suche: '', scroll: 0, daten: null };
  const faelligK = (k) => !k.abgelegt && k.naechster_kontakt && k.naechster_kontakt <= heute();
  // Weicher Wechsel zwischen Liste und Karte, ohne neu zu laden und ohne neu zu zeichnen
  function kundenWeich(rest) {
    const box = document.getElementById('inhalt'), ansicht = box?.querySelector('.kunden-ansicht');
    if (!ansicht || K.daten !== S.kunden || !S.kunden) return false;
    kundenAnzeigen(rest[0] ? decodeURIComponent(rest[0]) : null);
    return true;
  }
  function kundenAnzeigen(id) {
    const listeEl = document.getElementById('k-liste'), karteEl = document.getElementById('k-karte');
    if (!id) {
      karteEl.hidden = true; karteEl.innerHTML = ''; listeEl.hidden = false;
      requestAnimationFrame(() => window.scrollTo(0, K.scroll));
      return;
    }
    if (!listeEl.hidden) K.scroll = window.scrollY;
    if (id === 'neu') { kundeBlatt(); history.replaceState(null, '', location.pathname + location.search + '#kunden'); return; }
    const k = S.kunden.find((x) => x.id === id);
    listeEl.hidden = true; karteEl.hidden = false;
    if (k) karte(karteEl, k); else karteEl.innerHTML = `<a class="zurueck" href="#kunden">${ico('links')} Zurück zu allen Kunden</a><p class="leer">Diesen Kunden gibt es nicht mehr.</p>`;
    window.scrollTo(0, 0);
    if (window.Bewegung) Bewegung.auftritt(karteEl);
  }
  async function kunden(box, rest, aktuell) {
    if (!frei('kunden')) { box.innerHTML = gesperrt('kunden'); return; }
    await Promise.all([kundenLaden(), termineLaden().catch(() => (S.termine = []))]);
    if (!aktuell()) return;
    K.daten = S.kunden;
    box.innerHTML = `<div class="kunden-ansicht"><div id="k-liste"></div><div id="k-karte" hidden></div></div>`;
    listeZeichnen();
    kundenAnzeigen(rest[0] ? decodeURIComponent(rest[0]) : null);
  }
  function listeZeichnen() {
    const el = document.getElementById('k-liste'), l = S.kunden;
    const zaehl = (f) => l.filter((k) => !k.abgelegt && (f === 'alle' || k.stand === f)).length;
    const extra = [['', 'Alle Stufen'], ['faellig', `Heute melden (${l.filter(faelligK).length})`], ...STUFE.map(([w, t]) => [w, t]), ['abgelegt', `Kein Interesse (${l.filter((k) => k.abgelegt).length})`]];
    el.innerHTML = `${kopf('Kunden', '', `<button class="knopf" type="button" data-neu>${ico('plus')} Kunde eintragen</button>`)}
      <div class="stufen" role="group" aria-label="Stand">${[['alle', 'Alle'], ...STAND].map(([w, t]) => `<button type="button" data-f="${w}" aria-pressed="${K.filter === w}">${t} <b data-zahl="${zaehl(w)}">${zaehl(w)}</b></button>`).join('')}</div>
      <div class="suchzeile"><input type="search" id="suche" placeholder="Name, Ort oder Telefon suchen" value="${esc(K.suche)}" aria-label="Kunden suchen">
        <select id="extra" aria-label="Weitere Filter">${extra.map(([w, t]) => `<option value="${w}"${K.extra === w ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
      <div id="liste"></div>`;
    const zeilen = () => {
      const s = K.suche.toLowerCase();
      const passt = (k) => (K.extra === 'abgelegt' ? k.abgelegt : !k.abgelegt)
        && (K.filter === 'alle' || k.stand === K.filter)
        && (K.extra !== 'faellig' || faelligK(k))
        && (!['heiss', 'warm', 'kalt'].includes(K.extra) || k.stufe === K.extra)
        && (!s || [k.vorname, k.nachname, k.ort, k.telefon, k.email].join(' ').toLowerCase().includes(s));
      const z = l.filter(passt).sort((a, b) => (faelligK(b) - faelligK(a)) || String(a.naechster_kontakt || '9').localeCompare(String(b.naechster_kontakt || '9')) || String(b.erstellt).localeCompare(String(a.erstellt)));
      document.getElementById('liste').innerHTML = z.length ? z.map(zeile).join('')
        : `<p class="leer" style="padding:var(--a-4)">${l.length ? 'Zu dieser Auswahl gibt es niemanden.' : 'Noch keine Kunden. Wer über deine Landingpage anfragt oder über deinen Link bestellt, steht von selbst hier. Du kannst auch jemanden selbst eintragen.'}</p>`;
    };
    zeilen();
    el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { K.filter = b.dataset.f; el.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); zeilen(); }));
    el.querySelector('#extra').onchange = (e) => { K.extra = e.target.value; zeilen(); };
    el.querySelector('#suche').oninput = (e) => { K.suche = e.target.value; zeilen(); };
    el.querySelector('[data-neu]').onclick = () => kundeBlatt();
  }
  function zeile(k, i = 0) {
    const b = (S.best || []).filter((x) => x.kunde_id === k.id).pop();
    const fall = faelligK(k);
    const stand = k.abgelegt ? 'Kein Interesse' : STAND_NAME[k.stand];
    const schritt = b ? BESTELL[b.stand] : k.verblieben || (k.quelle ? `Kam über: ${k.quelle}` : '');
    const datum = fall ? 'Heute melden' : k.naechster_kontakt ? tagKurz(k.naechster_kontakt).slice(0, 6) : '';
    return `<a class="zeile-kunde" href="#kunden/${encodeURIComponent(k.id)}" style="--i:${i}">
      <span class="stufe-punkt ${esc(k.stufe || '')}" title="${esc(k.stufe ? 'Stufe ' + (STUFE.find((s) => s[0] === k.stufe) || [, ''])[1] : '')}"></span>
      <span class="name"><b>${esc(nameVon(k))}</b><span class="marke-klein${k.stand === 'gekauft' ? ' gekauft' : ''}">${esc(stand)}</span>${k.ort ? `<em>${esc(k.ort)}</em>` : ''}</span>
      <span class="datum${fall ? ' faellig' : ''}">${esc(datum)}</span>
      <span class="schritt-text">${esc(schritt)}</span>${ico('rechts')}</a>`;
  }
  // Karteikarte von oben nach unten: Name mit Stand und Stufe, Schnellknöpfe, Nächster Schritt, Bestellstand, Verlauf, Angaben
  function karte(el, k) {
    const nurLesen = k.art === 'bestellung';
    const best = (S.best || []).filter((x) => x.kunde_id === k.id);
    const ter = (S.termine || []).filter((t) => t.kunde_id === k.id && new Date(t.beginn) > new Date()).sort((a, b) => a.beginn.localeCompare(b.beginn));
    const dd = (t, w) => (w ? `<div><dt>${t}</dt><dd>${w}</dd></div>` : '');
    const a = k.antworten || {}, fall = faelligK(k);
    el.innerHTML = `<article class="karte-ansicht">
      <a class="zurueck" href="#kunden">${ico('links')} Zurück zu allen Kunden</a>
      <header class="karte-kopf"><h1>${esc(nameVon(k))}</h1><p class="herkunft">${esc(k.quelle || '')}${k.erstellt ? ', seit ' + tagKurz(k.erstellt) : ''}</p>
        ${nurLesen ? '' : `<div class="pillen">
          <label class="pille">Stand <select data-stand aria-label="Stand">${STAND.map(([w, t]) => `<option value="${w}"${k.stand === w ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
          <label class="pille"><i class="stufe-punkt ${esc(k.stufe || '')}"></i>Stufe <select data-stufe aria-label="Stufe"><option value=""${!k.stufe ? ' selected' : ''}>offen</option>${STUFE.map(([w, t]) => `<option value="${w}"${k.stufe === w ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
          ${k.abgelegt ? '<span class="marke-klein warn">Kein Interesse</span>' : ''}</div>`}</header>
      <div class="schnell">
        <a href="${k.telefon ? 'tel:' + esc(tel(k.telefon)) : '#'}" aria-disabled="${!k.telefon}">${ico('telefon')}Anrufen</a>
        <a href="${k.telefon ? wa(k.telefon) : '#'}" target="_blank" rel="noopener" aria-disabled="${!k.telefon}">${ico('whatsapp')}WhatsApp</a>
        <button type="button" data-termin aria-disabled="${nurLesen || k.art === 'lead'}">${ico('termine')}Termin</button>
      </div>
      ${nurLesen ? '<p class="hinweis klein karte-teil">Diese Bestellung ist noch keinem Kunden zugeordnet. Sobald Daniel sie zuordnet, kannst du hier Notizen machen.</p>' : `
      <section class="karte-teil naechster"><p class="kicker">Nächster Schritt</p>
        <p class="jetzt">${esc(k.verblieben || 'Noch kein nächster Schritt festgelegt.')}</p>
        <p class="wann${fall ? ' faellig' : ''}">${k.naechster_kontakt ? (fall ? 'Heute melden' : 'Melden am ' + tagName(String(k.naechster_kontakt).slice(0, 10))) : 'Ohne Datum'}</p>
        <form id="f-weiter" class="felder zwei" novalidate>
          <label class="feld"><span class="titel">Was als Nächstes?</span><input name="verblieben" value="${esc(k.verblieben || '')}" placeholder="z. B. ruft Freitag zurück"></label>
          <label class="feld"><span class="titel">Wann melden?</span><input type="date" name="naechster_kontakt" value="${esc(k.naechster_kontakt || '')}"></label>
          <div class="ganz knoepfe"><button class="knopf" type="submit">Nächsten Schritt speichern</button></div></form>
        ${ter.length ? `<div class="termine-mit">${ter.map((t) => `<p><b>${tagKurz(t.beginn)}, ${uhr(t.beginn)} Uhr</b> · ${esc(t.art)}${t.ort ? ' · ' + esc(t.ort) : ''}</p>`).join('')}</div>` : ''}
      </section>`}
      ${best.length ? `<section class="karte-teil"><h2>Bestellung</h2><div>${best.map((b) => {
        const i = ['bestellt', 'verschickt', 'da'].indexOf(b.stand);
        return `<div class="bestellung"><h4>${esc(b.geraete || 'Gerät')}<small>Nr. ${esc(b.nummer)}, bestellt am ${tagKurz(b.erstellt)}</small></h4>
          <ol class="schritte">${['bestellt', 'verschickt', 'da'].map((s, n) => `<li style="--n:${n}" class="${n <= i ? 'erledigt' : ''}${n === i && n < 2 ? ' jetzt' : ''}"><b>${BESTELL[s]}</b>${n === 0 ? tagKurz(b.erstellt) : n === 2 && b.da_am ? tagKurz(b.da_am) : ''}</li>`).join('')}</ol></div>`;
      }).join('')}</div></section>` : k.geraet ? `<section class="karte-teil"><h2>Gerät</h2><p>${esc(k.geraet)}${k.kaufdatum ? ', gekauft am ' + tagKurz(k.kaufdatum) : ''}</p></section>` : ''}
      ${nurLesen ? '' : `<section class="karte-teil"><h2>Verlauf</h2>
        <form id="f-notiz" class="notiz-neu" novalidate><textarea name="notiz" rows="3" placeholder="Was wurde besprochen? Wird mit Datum gespeichert." aria-label="Neue Notiz"></textarea>
          <div class="knoepfe"><button class="knopf zweit" type="submit">Notiz speichern</button></div></form>
        ${k.notizen?.length ? `<ul class="notizen">${k.notizen.map((n) => `<li><small>${tagKurz(n.erstellt)}</small><p>${esc(n.text)}</p></li>`).join('')}</ul>` : '<p class="leer klein">Noch keine Notizen.</p>'}</section>`}
      <details class="aufklappen"><summary>Angaben</summary><dl class="angaben">
        ${dd('Telefon', k.telefon ? `<a href="tel:${esc(tel(k.telefon))}">${esc(k.telefon)}</a>` : '')}
        ${dd('E-Mail', k.email ? `<a href="mailto:${esc(k.email)}">${esc(k.email)}</a>` : '')}
        ${dd('Ort', esc(k.ort || ''))}${dd('Am besten erreichbar', esc(k.erreichbar || ''))}
        ${dd('Erster Kontakt', tagKurz(k.erstellt))}${dd('Zuletzt gesprochen', tagKurz(k.letzter_kontakt))}
        ${dd('Interesse', esc(a.interesse || ''))}${dd('Trinkt heute', esc(a.geraet || ''))}${dd('Gerät', esc(a.budget_text || ''))}
      </dl>
      ${nurLesen ? '' : `<div class="knoepfe" style="margin-top:var(--a-4)"><button class="knopf still" type="button" data-aendern>Angaben ändern</button>
        <button class="knopf still" type="button" data-ablegen>${k.abgelegt ? 'Wieder aufnehmen' : 'Kein Interesse, ablegen'}</button></div>`}</details>
    </article>`;
    if (nurLesen) return;
    const speichern = async (p, text) => {
      const roh = k.art === 'lead' ? { lead_id: k.id, ...p } : { id: k.id, ...p };
      const r = await mitSitzung('uk_partner_kunde_speichern', { p: roh });
      if (r.error || !r.data) { toast('Das hat nicht geklappt. Bitte versuch es noch einmal.'); return false; }
      S.kunden = null; toast(text);
      if (r.data !== k.id) location.hash = 'kunden/' + r.data; else zeigen();
      return true;
    };
    el.querySelector('[data-stand]').onchange = (e) => speichern({ stand: e.target.value }, `Stand: ${STAND_NAME[e.target.value]}.`);
    el.querySelector('[data-stufe]').onchange = (e) => speichern({ stufe: e.target.value }, 'Stufe gespeichert.');
    el.querySelector('[data-ablegen]').onclick = () => speichern({ abgelegt: !k.abgelegt }, k.abgelegt ? 'Wieder aufgenommen.' : 'Abgelegt unter "Kein Interesse".');
    el.querySelector('[data-aendern]').onclick = () => kundeBlatt(k, speichern);
    const t = el.querySelector('[data-termin]'); if (t) t.onclick = () => terminBlatt({ kunde_id: k.id });
    const formular = (id, felder, text) => {
      const f = el.querySelector(id);
      f.onsubmit = async (e) => {
        e.preventDefault();
        const w = Object.fromEntries(new FormData(f).entries());
        for (const x of Object.keys(w)) w[x] = String(w[x]).trim();
        if (felder === 'notiz' && !w.notiz) return;
        f.querySelector('button').disabled = true;
        if (!(await speichern(w, text))) f.querySelector('button').disabled = false;
      };
    };
    formular('#f-weiter', 'schritt', 'Nächster Schritt gespeichert.');
    formular('#f-notiz', 'notiz', 'Notiz gespeichert.');
  }
  function kundeBlatt(k = null, speichern = null) {
    const d = document.createElement('dialog'); d.className = 'blatt';
    const feld = (n, t, typ = 'text', extra = '') => `<label class="feld"><span class="titel">${t}</span><input type="${typ}" name="${n}" value="${esc(k?.[n] || '')}" ${extra}></label>`;
    d.innerHTML = `<form method="dialog" novalidate>
      <div class="blatt-kopf"><h2>${k ? 'Angaben ändern' : 'Kunde eintragen'}</h2><button class="knopf still" value="zu" aria-label="Schließen">${ico('zu')}</button></div>
      <div class="felder zwei">
        ${feld('vorname', 'Vorname <span class="pflicht">*</span>', 'text', 'required autocomplete="off"')}${feld('nachname', 'Nachname')}
        ${feld('telefon', 'Telefon', 'tel')}${feld('email', 'E-Mail-Adresse', 'email')}
        ${feld('ort', 'Ort')}${feld('erreichbar', 'Am besten erreichbar', 'text', 'placeholder="z. B. abends ab 18 Uhr"')}
        ${k ? '' : `<label class="feld"><span class="titel">Stand</span><select name="stand">${STAND.map(([w, t]) => `<option value="${w}">${t}</option>`).join('')}</select></label>
          <label class="feld"><span class="titel">Stufe</span><select name="stufe"><option value="">Noch offen</option>${STUFE.map(([w, t]) => `<option value="${w}">${t}</option>`).join('')}</select></label>
          ${feld('naechster_kontakt', 'Wann melden?', 'date')}${feld('verblieben', 'Was als Nächstes?')}
          <label class="feld ganz"><span class="titel">Erste Notiz</span><textarea name="notiz" rows="3"></textarea></label>`}
      </div><p class="meldung"></p>
      <div class="knoepfe"><button class="knopf" type="submit" value="ok">${k ? 'Speichern' : 'Kunde eintragen'}</button></div></form>`;
    document.body.append(d); d.showModal(); d.addEventListener('close', () => d.remove());
    const f = d.querySelector('form');
    f.onsubmit = async (e) => {
      if (e.submitter?.value === 'zu') return;
      e.preventDefault();
      const w = Object.fromEntries(new FormData(f).entries()), m = f.querySelector('.meldung');
      for (const x of Object.keys(w)) w[x] = String(w[x]).trim();
      if (!w.vorname) return (m.textContent = 'Bitte gib mindestens einen Vornamen an.');
      if (speichern) { if (await speichern(w, 'Angaben gespeichert.')) d.close(); return; }
      const r = await mitSitzung('uk_partner_kunde_speichern', { p: w });
      if (r.error || !r.data) return (m.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.');
      d.close(); S.kunden = null; toast('Kunde eingetragen.'); location.hash = 'kunden/' + r.data;
    };
  }

  // ================= TOOLS =================
  // Reihenfolge nach Jasmin: erst ins Gespräch kommen (Landingpage), dann einladen (Flyer), dann abschließen (Bestell-Link).
  // Dazu der Assistent. Jede Reihe: Foto, große Kapitelzahl, ein Satz Nutzen, ein Hauptknopf.
  async function tools(box, rest) {
    if (rest[0] === 'seite') return landingpage(box, rest);
    const p = S.p, link = BESTELLSEITE + encodeURIComponent(p.kurz), seite = SEITE + encodeURIComponent(p.kurz);
    const mehrDazu = (b, ziel) => `<div class="knoepfe"><a class="knopf zweit" href="${ziel}">${ico('schloss')} Ansehen und freischalten</a></div>`;
    box.innerHTML = `${kopf('Tools', 'Vier Helfer, die dir Arbeit abnehmen: vom ersten Kontakt bis zur Bestellung.')}
      <div class="reihen tools">
      <section class="reihe tool" id="seite"><div class="bild">${foto('landingpage')}</div><div class="text">
        <span class="zahl-gross" aria-hidden="true">01</span><p class="kicker">Ins Gespräch kommen</p><h2>Deine Landingpage</h2>
        <p class="wozu">Du erklärst nicht jedem alles von vorn. Du schickst deinen Link, dort steht das Wichtigste rund ums Wasser, mit deinem Namen und deinen Kontaktknöpfen. Wer anfragt, steht sofort in deiner Kundenübersicht.</p>
        ${frei('seite') ? `<div class="linkfeld"><code>${esc(seite)}</code><button class="knopf still" type="button" data-kopie="${esc(seite)}">${ico('kopie')} Kopieren</button></div>
        <div class="knoepfe"><a class="knopf" href="https://wa.me/?text=${encodeURIComponent('Schau mal, hier kannst du dein Wasser checken: ' + seite)}" target="_blank" rel="noopener">${ico('whatsapp')} Per WhatsApp teilen</a>
          <a class="knopf zweit" href="#tools/seite">Einrichten und Vorschau</a></div>` : mehrDazu('seite', '#tools/seite')}
      </div></section>

      <section class="reihe tool" id="flyer"><div class="bild">${flyerFoto()}</div><div class="text">
        <span class="zahl-gross" aria-hidden="true">02</span><p class="kicker">Einladen</p><h2>Flyer für deine Einladung</h2>
        <p class="wozu">Motiv wählen, Datum und Ort eintragen, speichern. In zwei Minuten hast du eine Einladung zum Infoabend, die zu dir passt. Für WhatsApp, Instagram, Facebook und zum Ausdrucken.</p>
        ${frei('flyer') ? `<div class="knoepfe"><a class="knopf" href="#flyer">${ico('flyer')} Flyer erstellen</a></div>` : mehrDazu('flyer', '#flyer')}</div></section>

      <section class="reihe tool" id="bestellen"><div class="bild">${foto('bestell-link')}</div><div class="text">
        <span class="zahl-gross" aria-hidden="true">03</span><p class="kicker">Abschließen</p><h2>Dein persönlicher Bestell-Link</h2>
        <p class="wozu">Schick diesen Link deinen Kunden. Wer darüber bestellt, wird dir zugeordnet.</p>
        <div class="linkfeld"><code>${esc(link)}</code><button class="knopf still" type="button" data-kopie="${esc(link)}">${ico('kopie')} Kopieren</button></div>
        <div class="knoepfe"><button class="knopf zweit" type="button" id="qr-laden">${ico('laden')} QR-Code speichern</button>
          <a class="knopf still" href="${esc(link)}" target="_blank" rel="noopener">Bestellseite ansehen</a></div>
        <p class="nebenbei">Der Kauf läuft über deine Enagic-ID ${esc(p.enagic_id || '')}. Bisher ${Number(p.bestellungen) === 1 ? 'kam 1 Bestellung' : `kamen ${Number(p.bestellungen) || 0} Bestellungen`} über deinen Link.</p>
        <div id="qr" hidden>${qr(link)}</div>
        <details class="aufklappen"><summary>Wer kümmert sich um die Bestellung?</summary>
          <p class="leise klein" style="margin-bottom:var(--s-3)">Der Vertrag läuft in jedem Fall über deine Enagic-ID. Du entscheidest nur, wer die Unterlagen an Enagic schickt.</p>
          <div class="wahl">
            <label><input type="radio" name="abwicklung" value="daniel" ${p.abwicklung !== 'selbst' ? 'checked' : ''}><span><b>Daniel organisiert alles</b><small>Die fertigen Unterlagen gehen an Daniel, er prüft sie und schickt sie an Enagic.</small></span></label>
            <label><input type="radio" name="abwicklung" value="selbst" ${p.abwicklung === 'selbst' ? 'checked' : ''}><span><b>Ich wickle selbst ab</b><small>Die fertigen Unterlagen kommen an ${esc(p.email)}, du schickst sie selbst an Enagic.</small></span></label>
          </div></details></div></section>

      ${p.tg_code ? `<section class="reihe tool" id="assistent"><div class="bild">${assistentBuehne()}</div><div class="text">
        <span class="zahl-gross" aria-hidden="true">04</span><p class="kicker">Dranbleiben</p><h2>Dein Assistent in Telegram</h2>
        <p class="wozu">Jede neue Anfrage meldet sich sofort auf deinem Handy. Morgens siehst du, welche Termine anstehen und wen du anrufen wolltest. Termine trägst du per Nachricht ein.</p>
        ${!frei('assistent') ? `<div class="knoepfe"><a class="knopf zweit" href="${freischaltMail('assistent')}">${ico('schloss')} Freischalten</a></div>` : `${p.assistent_bot ? `<div class="knoepfe"><a class="knopf" href="https://t.me/${esc(p.assistent_bot)}?start=${esc(p.tg_code)}" target="_blank" rel="noopener">${p.tg_verbunden ? 'Assistent öffnen' : 'Assistent verbinden'}</a>${p.tg_verbunden ? '<span class="verbunden">Verbunden</span>' : ''}</div>
        ${p.tg_verbunden ? '' : '<p class="nebenbei">Telegram öffnet sich. Dort tippst du auf "Starten", mehr ist es nicht.</p>'}` : '<p class="nebenbei">Der Assistent wird gerade eingerichtet. Der Knopf zum Verbinden erscheint hier in Kürze.</p>'}`}
      </div></section>` : ''}
      </div>`;
    mocksFertig(box);
    box.querySelectorAll('[data-kopie]').forEach((b) => (b.onclick = () => kopieren(b.dataset.kopie, 'Link kopiert.')));
    document.getElementById('qr-laden').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([document.querySelector('#qr svg').outerHTML], { type: 'image/svg+xml' }));
      a.download = `bestell-link-${p.kurz}.svg`; a.click();
    };
    box.querySelectorAll('input[name=abwicklung]').forEach((r) => (r.onchange = async () => {
      const x = await mitSitzung('uk_partner_abwicklung_setzen', { p_wert: r.value });
      if (x.error || !x.data) return toast('Das hat nicht geklappt. Bitte lade die Seite neu.');
      p.abwicklung = r.value; toast('Gespeichert.');
    }));
    if (rest[0]) document.getElementById(rest[0])?.scrollIntoView({ block: 'start' });
  }

  // ---------- Landingpage: einrichten und ansehen (Adresse #tools/seite) ----------
  // Links: was du einträgst. Rechts: was dein Besucher sieht, als echte Vorschau, die beim Tippen mitläuft.
  // Der Kontaktbereich ist so nachgebaut, wie ihn die Landingpage zeigt (website/landing.js, partnerKontakt).
  // Ohne Freischaltung: Verkaufsansicht mit dem, was du bekommst, und dem Weg zum Freischalten.
  const lpWege = (s) => [s.whatsapp && 'WhatsApp schreiben', s.telefon && 'Anrufen', s.email && 'E-Mail schreiben', s.termin && 'Termin buchen'].filter(Boolean);
  const lpKontakt = (s, leerText) => { const w = lpWege(s);
    return `<p class="kicker">Nächster Schritt</p><h3>Lass uns sprechen</h3><p>Sag kurz, was du dir wünschst. Wir melden uns bei dir.</p>
      ${s.text ? `<p class="satz">${esc(s.text)}</p>` : ''}<div class="wege">${w.length ? w.map((x) => `<span>${x}</span>`).join('') : `<em>${leerText}</em>`}</div>`; };
  function landingpage(box) {
    const p = S.p, seite = SEITE + encodeURIComponent(p.kurz), sp = p.seite || {};
    const zurueck = `<a class="zurueck" href="#tools">${ico('links')} Zurück zu den Tools</a>`;
    if (!frei('seite')) {
      const beispiel = { text: 'Ich zeige dir gern, was in deinem Wasser steckt.', whatsapp: '1', telefon: '1', termin: '1' };
      box.innerHTML = zurueck + gesperrt('seite', `<div class="verkauf-so" style="margin-top:var(--s-6)"><div><p class="kicker">Das sieht dein Besucher</p><h3 style="margin-top:var(--s-2)">Deine Kontaktknöpfe, direkt auf der Seite.</h3>
        <p class="leise" style="margin-top:var(--s-2)">Am Ende der Seite steht dein Satz und darunter die Wege zu dir. Du entscheidest, welche Knöpfe erscheinen.</p></div>
        <div class="verkauf-handy"><div class="lp-handy"><div class="schirm"><div class="lp-kontakt">${lpKontakt(beispiel, '')}</div></div></div></div></div>`);
      return;
    }
    const feld = (symbol, name, titel, typ, platz, wird, extra = '') => `<div class="lp-feld">${ico(symbol)}<label class="feld"><span class="titel">${titel}</span>
      <input type="${typ}" name="${name}" value="${esc(sp[name] || '')}" placeholder="${platz}" ${extra}><small class="wird">${wird}</small></label></div>`;
    box.innerHTML = `${zurueck}${kopf('Deine Landingpage', 'Die Seite ist fertig gebaut. Du trägst nur ein, wie man dich erreicht.')}
      <section class="lp-kopf"><p class="kicker">Dein Link zum Teilen</p>
        <div class="linkfeld"><code>${esc(seite)}</code><button class="knopf still" type="button" data-kopie="${esc(seite)}">${ico('kopie')} Kopieren</button></div>
        <div class="knoepfe"><a class="knopf" href="https://wa.me/?text=${encodeURIComponent('Schau mal, hier kannst du dein Wasser checken: ' + seite)}" target="_blank" rel="noopener">${ico('whatsapp')} Per WhatsApp teilen</a>
          <a class="knopf zweit" href="${esc(seite)}" target="_blank" rel="noopener">${ico('auge')} Seite öffnen</a></div></section>
      <div class="lp-aufbau">
        <section class="lp-teil"><p class="kicker">Das trägst du ein</p><h2>So erreicht man dich</h2>
          <p class="leise">Aus jeder Angabe wird ein Knopf auf deiner Seite. Was du leer lässt, erscheint nicht.</p>
          <form id="f-seite" novalidate>
            ${feld('satz', 'text', 'Ein Satz von dir', 'text', 'z. B. Ich zeige dir gern, was in deinem Wasser steckt.', 'Steht über deinen Knöpfen. So merkt dein Besucher, dass ein Mensch dahintersteht.', 'maxlength="300"')}
            ${feld('whatsapp', 'whatsapp', 'WhatsApp-Nummer', 'tel', '+49 170 1234567', 'Wird zum Knopf <b>WhatsApp schreiben</b>.')}
            ${feld('telefon', 'telefon', 'Telefon zum Anrufen', 'tel', '+49 170 1234567', 'Wird zum Knopf <b>Anrufen</b>.')}
            ${feld('mail', 'email', 'E-Mail-Adresse', 'email', 'du@beispiel.de', 'Wird zum Knopf <b>E-Mail schreiben</b>.')}
            ${feld('termine', 'termin', 'Link zum Termin buchen', 'url', 'https://calendly.com/dein-name', 'Wird zum Knopf <b>Termin buchen</b>. Zum Beispiel dein Calendly-Link, er beginnt mit https://')}
            <div class="lp-speichern"><button class="knopf" type="submit">Speichern</button><span class="meldung" id="seite-meldung"></span></div>
          </form></section>
        <figure class="lp-vorschau" aria-label="Vorschau"><div class="umschalter" role="group" aria-label="Vorschau"><button type="button" data-lp="kontakt" aria-pressed="true">Dein Kontaktbereich</button><button type="button" data-lp="seite" aria-pressed="false">Ganze Seite</button></div>
          <div class="lp-handy"><div class="schirm"><div class="lp-kontakt" id="lp-kontakt"></div><iframe id="lp-rahmen" title="Deine Landingpage" hidden></iframe></div></div>
          <figcaption id="lp-unter">Das sieht dein Besucher am Ende der Seite. Die Vorschau läuft beim Tippen mit.</figcaption></figure>
      </div>
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>So arbeitet die Seite für dich</h2></div>
        <ol class="ablauf"><li><span class="zahl-gross" aria-hidden="true">01</span><h3>Du teilst deinen Link</h3><p>Per WhatsApp, in deiner Signatur, auf Instagram oder als QR-Code auf deinem Flyer.</p></li>
          <li><span class="zahl-gross" aria-hidden="true">02</span><h3>Dein Kontakt liest in Ruhe</h3><p>Was im Wasser steckt, welche Geräte es gibt und wie ein Gespräch mit dir abläuft. Wann und wo er möchte.</p></li>
          <li><span class="zahl-gross" aria-hidden="true">03</span><h3>Die Anfrage steht bei dir</h3><p>Wer das Formular ausfüllt, steht sofort in deiner Kundenübersicht. Mit dem Assistenten meldet sich zusätzlich dein Handy.</p></li></ol></section>`;
    const fs = document.getElementById('f-seite'), vk = document.getElementById('lp-kontakt'), rahmenEl = document.getElementById('lp-rahmen');
    const werte = () => { const w = Object.fromEntries(new FormData(fs).entries()); for (const x of Object.keys(w)) w[x] = String(w[x]).trim(); return w; };
    let zuletzt = '';
    const vorschau = () => { const w = werte(), neu = JSON.stringify([w.text, ...lpWege(w)]); if (neu === zuletzt) return; zuletzt = neu; vk.innerHTML = lpKontakt(w, 'Trag etwas ein, dann erscheinen hier deine Knöpfe.'); };
    vorschau(); fs.oninput = vorschau;
    box.querySelectorAll('[data-kopie]').forEach((b) => (b.onclick = () => kopieren(b.dataset.kopie, 'Link kopiert.')));
    box.querySelectorAll('[data-lp]').forEach((b) => (b.onclick = () => {
      const ganz = b.dataset.lp === 'seite';
      box.querySelectorAll('[data-lp]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (ganz && !rahmenEl.src) rahmenEl.src = '../wasser/?von=' + encodeURIComponent(p.kurz);
      rahmenEl.hidden = !ganz; vk.hidden = ganz;
      document.getElementById('lp-unter').textContent = ganz ? 'Deine Seite, wie sie auf dem Handy aussieht. Gespeicherte Angaben erscheinen ganz unten.' : 'Das sieht dein Besucher am Ende der Seite. Die Vorschau läuft beim Tippen mit.';
    }));
    fs.onsubmit = async (e) => {
      e.preventDefault();
      const w = werte(), m = document.getElementById('seite-meldung');
      m.className = 'meldung';
      if (w.termin && !/^https:\/\//.test(w.termin)) return (m.textContent = 'Der Link zum Termin buchen muss mit https:// beginnen.');
      const k = fs.querySelector('[type=submit]'); k.disabled = true;
      const r = await mitSitzung('uk_partner_seite_setzen', { p: w }); k.disabled = false;
      if (r.error || !r.data) return (m.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.');
      p.seite = w; m.className = 'meldung gut'; m.textContent = 'Gespeichert. Deine Seite zeigt die neuen Angaben sofort.';
      if (rahmenEl.src) rahmenEl.src = rahmenEl.src;
    };
  }

  // ================= FLYER =================
  // Logik und Platzierung bleiben in flyer.js. Ablauf: 1 Motiv und Farben, 2 Text, 3 Formate und Speichern.
  // Die große Vorschau ist der Mittelpunkt: am Computer steht sie rechts fest, am Handy bleibt sie oben stehen.
  const FLYER_SPEICHER = 'uk-partner-flyer';
  async function flyer(box, rest, aktuell) {
    if (!frei('flyer')) { box.innerHTML = gesperrt('flyer'); mocksFertig(box); return; }
    const p = S.p, U = Flyer.UEBERSCHRIFTEN;
    let d; try { d = JSON.parse(localStorage.getItem(FLYER_SPEICHER) || 'null'); } catch { d = null; }
    d = Object.assign({ art: 'Einladung', titel: U[0][0], text: U[0][1], datum: '', zeit: '19:00', ort: '', adresse: '', name: nameVon(p), telefon: '', email: '', formate: ['story'], farbe: 'blau', foto: 'frau-kueche' }, d || {});
    if (d.titel === 'Gesundes Wasser') Object.assign(d, { art: 'Einladung', titel: U[0][0], text: U[0][1] });
    const { data: vl } = await rpc('uk_flyer_vorlagen_liste'); Flyer.vorlagenSetzen(vl);
    if (!aktuell()) return;
    const fotos = Object.fromEntries(Object.entries(Flyer.FOTOS).filter(([k]) => Flyer.sichtbar(k)));
    if (!fotos[d.foto] && d.foto !== 'eigen') d.foto = Object.keys(fotos)[0] || 'frau-kueche';
    if (d.foto === 'eigen') d.foto = Object.keys(fotos)[0];
    if (!Flyer.FARBEN[d.farbe]) d.farbe = 'blau';
    d.formate = (d.formate || []).filter((f) => Flyer.FORMATE[f]);
    let aktiv = d.formate[0] || null;
    const vorlage = () => U.findIndex(([t, x]) => t === d.titel && x === d.text);
    const feld = (n, t, art = 'text', extra = '') => `<label class="feld"><span class="titel">${t}</span><input type="${art}" name="${n}" value="${esc(d[n] || '')}" ${extra}></label>`;
    const schrittKopf = (nr, titel, text) => `<header class="schritt-kopf"><span class="zahl-gross" aria-hidden="true">${nr}</span><h2>${titel}</h2><p>${text}</p></header>`;
    box.innerHTML = `${kopf('Flyer erstellen', 'Deine Einladung zum Infoabend. Drei Schritte, dann ist sie fertig.')}
      <div class="flyer-aufbau">
        <aside class="flyer-vorschau" aria-label="Vorschau">
          <div class="fv-kopf"><h2>Vorschau</h2><p>Antippen für die große Ansicht.</p></div>
          <div class="vorschauen" id="vorschauen"></div>
          <div class="fv-formate" id="fv-formate" role="group" aria-label="Format der Vorschau"></div>
        </aside>
        <form id="f-flyer" novalidate>
          <section class="schritt">${schrittKopf(1, 'Motiv und Farben', 'Such dir ein Foto und eine Farbwelt aus. Die Vorschau zeigt sofort, wie es aussieht.')}
            <div class="motive">${Object.entries(fotos).map(([k, f]) => `<button type="button" data-foto="${k}" aria-pressed="${d.foto === k}" aria-label="Motiv ${esc(f.name)}"><img src="${esc(f.klein)}" alt="" loading="lazy"><span>${esc(f.name)}</span></button>`).join('')}
              <label class="eigen"><input type="file" accept="image/*" id="eigen-foto" hidden><b>+</b><span>Eigenes Foto</span></label></div>
            <p class="unterpunkt">Farben</p>
            <div class="farben">${Object.entries(Flyer.FARBEN).map(([k, f]) => `<button type="button" data-farbe="${k}" aria-pressed="${d.farbe === k}"><i style="background:${f.grund}"><i style="background:${f.akzent}"></i></i>${esc(f.name)}</button>`).join('')}</div></section>
          <section class="schritt">${schrittKopf(2, 'Text', 'Anlass, Datum und Ort. Die Überschrift suchst du aus oder schreibst sie selbst.')}
            <div class="felder zwei">
              <label class="feld ganz"><span class="titel">Überschrift aussuchen</span><select id="vorlage">${U.map(([t], i) => `<option value="${i}"${vorlage() === i ? ' selected' : ''}>${esc(t)}</option>`).join('')}<option value="eigen"${vorlage() < 0 ? ' selected' : ''}>Eigene Überschrift schreiben</option></select></label>
              <div class="ganz">${feld('art', 'Kleine Zeile über der Überschrift', 'text', 'placeholder="z. B. Einladung"')}</div>
              <div class="ganz">${feld('titel', 'Überschrift')}</div>
              <label class="feld ganz"><span class="titel">Zeile unter der Überschrift</span><textarea name="text" rows="2">${esc(d.text)}</textarea></label>
              ${feld('datum', 'Datum', 'date')}${feld('zeit', 'Uhrzeit', 'time')}
              ${feld('ort', 'Wo? (z. B. Café Sonne)')}${feld('adresse', 'Adresse', 'text', 'placeholder="Straße, PLZ und Ort"')}
              ${feld('name', 'Dein Name')}${feld('telefon', 'Telefon oder WhatsApp', 'tel')}
              <div class="ganz">${feld('email', 'E-Mail-Adresse (freiwillig)', 'email')}</div>
            </div></section>
          <section class="schritt">${schrittKopf(3, 'Formate und Speichern', 'Wo zeigst du deine Einladung? Du kannst mehrere Formate wählen.')}
            <div class="formate">${Object.entries(Flyer.FORMATE).map(([k, f]) => `<button type="button" data-format="${k}" aria-pressed="${d.formate.includes(k)}"><i class="f-${k}"></i><span><b>${esc(f.name)}</b><small>${esc(f.zusatz)}</small></span></button>`).join('')}</div>
            <div class="flyer-fertig"><button class="knopf" type="button" id="flyer-laden"></button>
            <p class="leise klein">${TG ? 'Die Bilder kommen als Datei in deinen Chat mit dem Assistenten.' : 'Die Bilder liegen danach in deinem Download-Ordner, auf dem Handy in deinen Fotos oder Dateien.'}</p></div></section>
        </form>
      </div>`;
    await Promise.all([Flyer.vorbereiten(), Flyer.fotoLaden(d.foto)]);
    if (!aktuell()) return;
    const form = document.getElementById('f-flyer');
    const merken = () => { try { localStorage.setItem(FLYER_SPEICHER, JSON.stringify({ ...d, foto: d.foto === 'eigen' ? 'frau-kueche' : d.foto })); } catch {} };
    const neu = () => {
      for (const [k, v] of new FormData(form).entries()) if (typeof v === 'string') d[k] = v.trim();
      merken();
      const vb = document.getElementById('vorschauen'), ff = document.getElementById('fv-formate'); if (!vb) return;
      if (!d.formate.includes(aktiv)) aktiv = d.formate[0] || null;
      if (!aktiv) vb.innerHTML = '<p class="leer klein">Wähl in Schritt 3 mindestens ein Format.</p>';
      else {
        const b = document.createElement('button'); b.type = 'button'; if (aktiv === 'banner') b.className = 'quer';
        const c = document.createElement('canvas'); Flyer.zeichnen(c, aktiv, d.farbe, d.foto, d, aktiv === 'a4' ? 0.25 : 0.5);
        b.append(c); b.setAttribute('aria-label', `${Flyer.FORMATE[aktiv].name} groß ansehen`);
        b.onclick = () => gross(aktiv); vb.replaceChildren(b);
      }
      ff.innerHTML = d.formate.length > 1 ? d.formate.map((f) => `<button type="button" data-zeig="${f}" aria-pressed="${f === aktiv}">${esc(Flyer.FORMATE[f].name)}</button>`).join('') : '';
      ff.querySelectorAll('[data-zeig]').forEach((x) => (x.onclick = () => { aktiv = x.dataset.zeig; neu(); }));
      const n = d.formate.length, k = document.getElementById('flyer-laden');
      k.disabled = !n; k.innerHTML = `${ico('laden')} ${TG ? (n > 1 ? `${n} Flyer in den Chat schicken` : 'Flyer in den Chat schicken') : n > 1 ? `${n} Flyer herunterladen` : 'Flyer herunterladen'}`;
    };
    // Großansicht mit Blättern zwischen den gewählten Formaten
    const gross = (f) => {
      const dl = document.createElement('dialog'); dl.className = 'gross';
      dl.innerHTML = `<div class="gross-innen"><div class="gross-kopf"><b></b><button class="knopf still" type="button" data-zu>${ico('zu')} Schließen</button></div>
        <div class="gross-bild"></div>
        <div class="gross-fuss"><div class="knoepfe"><button class="knopf zweit" type="button" data-weiter="-1">${ico('links')}</button><button class="knopf zweit" type="button" data-weiter="1">${ico('rechts')}</button></div>
        <button class="knopf" type="button" data-eins>${ico('laden')} ${TG ? 'In den Chat schicken' : 'Dieses Format speichern'}</button></div></div>`;
      document.body.append(dl); dl.showModal(); dl.addEventListener('close', () => dl.remove());
      const malen = () => {
        const fm = Flyer.FORMATE[f], c = document.createElement('canvas');
        Flyer.zeichnen(c, f, d.farbe, d.foto, d, Math.min(1, 1600 / Math.max(fm.w, fm.h)));
        dl.querySelector('.gross-bild').replaceChildren(c);
        dl.querySelector('b').textContent = `${fm.name} · ${fm.zusatz}`;
        dl.querySelectorAll('[data-weiter]').forEach((x) => (x.hidden = d.formate.length < 2));
      };
      dl.querySelector('[data-zu]').onclick = () => dl.close();
      dl.querySelectorAll('[data-weiter]').forEach((x) => (x.onclick = () => { const i = d.formate.indexOf(f); f = d.formate[(i + Number(x.dataset.weiter) + d.formate.length) % d.formate.length]; malen(); }));
      dl.querySelector('[data-eins]').onclick = (e) => ausgeben([f], e.currentTarget);
      malen();
    };
    const ausgeben = async (liste, knopf) => {
      const alt = knopf.innerHTML;
      for (const f of liste) {
        const c = document.createElement('canvas'); Flyer.zeichnen(c, f, d.farbe, d.foto, d);
        const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.92));
        if (TG) {
          knopf.disabled = true; knopf.textContent = 'Wird geschickt …';
          const r = await fetch(`${ASSISTENT}?flyer=${encodeURIComponent(f)}`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg', 'x-sitzung': sitzung.lesen() }, body: blob }).catch(() => null);
          if (!r || !r.ok) { knopf.disabled = false; knopf.textContent = 'Nochmal versuchen'; return; }
          continue;
        }
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `flyer-${f}-${d.datum || 'veranstaltung'}.jpg`; a.click();
        await new Promise((ok) => setTimeout(ok, 400));
      }
      if (TG) { knopf.disabled = false; knopf.textContent = 'Geschickt. Schau in deinen Chat.'; setTimeout(() => (knopf.innerHTML = alt), 4000); }
    };
    let warte; form.oninput = (e) => {
      if (e.target.name === 'titel' || e.target.name === 'text') {
        const i = U.findIndex(([t, x]) => t === form.elements.titel.value.trim() && x === form.elements.text.value.trim());
        document.getElementById('vorlage').value = i < 0 ? 'eigen' : String(i);
      }
      clearTimeout(warte); warte = setTimeout(neu, 300);
    };
    document.getElementById('vorlage').onchange = (e) => {
      const v = e.target.value, [t, x] = v === 'eigen' ? ['', ''] : U[+v];
      form.elements.titel.value = t; form.elements.text.value = x;
      if (v === 'eigen') form.elements.titel.focus();
      neu();
    };
    const knoepfe = (g, setzen) => form.querySelectorAll(`[data-${g}]`).forEach((b) => (b.onclick = () => {
      setzen(b.dataset[g]);
      form.querySelectorAll(`[data-${g}]`).forEach((x) => x.setAttribute('aria-pressed', String(g === 'format' ? d.formate.includes(x.dataset.format) : x === b)));
      neu();
    }));
    knoepfe('format', (k) => { const dabei = d.formate.includes(k); d.formate = dabei ? d.formate.filter((x) => x !== k) : [...d.formate, k]; if (!dabei) aktiv = k; });
    knoepfe('farbe', (k) => (d.farbe = k));
    knoepfe('foto', (k) => { d.foto = k; form.querySelector('.eigen').classList.remove('an'); Flyer.fotoLaden(k).then(neu); });
    document.getElementById('eigen-foto').onchange = async (e) => {
      const datei = e.target.files[0]; if (!datei) return;
      await Flyer.eigenesFoto(datei); d.foto = 'eigen';
      form.querySelectorAll('[data-foto]').forEach((x) => x.setAttribute('aria-pressed', 'false'));
      form.querySelector('.eigen').classList.add('an'); neu();
    };
    document.getElementById('flyer-laden').onclick = (e) => ausgeben(d.formate, e.currentTarget);
    neu();
  }

  // ================= WISSEN =================
  async function wissen(box, rest) {
    if (!frei('wissen')) { box.innerHTML = gesperrt('wissen'); return; }
    const W = window.Wissen, teil = ['produkte', 'einwaende'].includes(rest[0]) ? rest[0] : 'unterlagen';
    const reiter = [['unterlagen', 'Unterlagen'], ['produkte', 'Produktwissen'], ['einwaende', 'Einwände und Antworten']];
    let inhalt = '';
    if (teil === 'unterlagen') {
      inhalt = `<div class="unterlagen">${W.unterlagen.map((u) => {
          const url = new URL(`unterlagen/${u.datei}.pdf`, location.href).href;
          return `<article class="unterlage"><a class="titel" href="unterlagen/${u.datei}.pdf" target="_blank" rel="noopener"><img src="unterlagen/${u.datei}.jpg" alt="Titelseite ${esc(u.titel)}" loading="lazy"></a>
          <h3>${esc(u.titel)}</h3><p>${esc(u.text)}</p>
          <div class="knoepfe"><a class="knopf zweit" href="unterlagen/${u.datei}.pdf" target="_blank" rel="noopener">Ansehen</a>
          <button class="knopf still" type="button" data-teilen="${esc(url)}" data-titel="${esc(u.titel)}">${ico('teilen')} Weitergeben</button></div></article>`;
        }).join('')}</div>`;
    } else if (teil === 'produkte') {
      inhalt = `<p class="wissen-hinweis">Nur belegte Fakten. Was noch fehlt, ist rot markiert. Bitte nichts dazu erfinden und keine Heilversprechen machen.</p>
        <div class="produkte">${W.produkte.map((x) => `<article class="produkt" id="p-${x.id}"><figure style="background-image:url('${x.bild}')"></figure><div class="text">
          <p class="kicker">${esc(x.art)}</p><h3>${esc(x.name)}</h3><p class="kern">${fehlt(x.kern)}</p>
          ${x.wasserarten ? `<ol class="wasserarten">${x.wasserarten.map(([ph, w]) => `<li><b>${ph}</b>${esc(w)}</li>`).join('')}</ol>` : ''}
          <dl>${x.daten.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${fehlt(b)}</dd>`).join('')}</dl>
          ${x.hinweis ? `<p class="hinweis" style="margin-top:var(--a-3)">${esc(x.hinweis)}</p>` : ''}
          <p class="hinweis-klein">${esc(x.quelle)}</p></div></article>`).join('')}</div>`;
    } else {
      inhalt = `<p class="wissen-hinweis"><span class="entwurf">Entwurf</span> Daniel und Jasmin prüfen diese Antworten noch. Nimm sie als Anregung, nicht zum Ablesen. Bleib auf Augenhöhe, du musst niemanden überreden.</p>
        <div class="einwaende">${W.einwaende.map((e, i) => `<details class="einwand"${i === 0 ? ' open' : ''}><summary><h3>"${esc(e.frage)}"</h3>${ico('plus')}</summary>
          <div class="antwort">${e.antwort.map((a) => `<p>${esc(a)}</p>`).join('')}<p class="satz">${esc(e.satz)}</p></div></details>`).join('')}</div>`;
    }
    box.innerHTML = `${kopf('Wissen und Schulung', 'Alles für gute Gespräche: zum Nachlesen, Zeigen und Weitergeben.')}
      <nav class="unterreiter" aria-label="Wissen">${reiter.map(([w, t]) => `<a href="#wissen${w === 'unterlagen' ? '' : '/' + w}"${w === teil ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>${inhalt}`;
    box.querySelectorAll('[data-teilen]').forEach((b) => (b.onclick = async () => {
      const url = b.dataset.teilen;
      if (navigator.share) { try { await navigator.share({ title: b.dataset.titel, url }); } catch {} } else kopieren(url, 'Link zur Unterlage kopiert.');
    }));
  }

  // ================= NEUIGKEITEN =================
  async function neuigkeiten(box, rest, aktuell) {
    const n = await newsLaden(); if (!aktuell()) return;
    box.innerHTML = `${kopf('Neuigkeiten', 'Was Daniel und Jasmin für dich haben.')}
      ${n.length ? `<div>${n.map((x) => `<article class="neuigkeit${x.erstellt > neuAb() ? ' neu' : ''}"><small>${esc(x.von || 'Ursprungskraft')}, ${tagName(tagVon(x.erstellt))}</small><p>${esc(x.text)}</p></article>`).join('')}</div>` : '<p class="leer">Noch keine Neuigkeiten.</p>'}`;
    gelesen();
  }

  // ================= MEHR FÜR DEIN GESCHÄFT =================
  // Überschriften von Jasmin abgenommen am 09.11.2026, wörtlich. Texte neu (Korrektur 2): erst der Nutzen, keine schiefen Bilder.
  const ANGEBOTE = [
    { kicker: 'Mehr Anfragen', titel: 'Nie wieder alles von vorn erklären', bild: () => foto('landingpage'),
      nutzen: 'Du schickst einen Link statt langer Sprachnachrichten. Auf deiner eigenen Seite steht das Wichtigste rund ums Wasser, mit deinem Foto und deinen Kontaktknöpfen. Wer sich danach meldet, kennt die Grundlagen schon.',
      punkte: ['Deine eigene Seite mit deinem Foto und deinem Namen', 'Jede Anfrage steht sofort in deiner Kundenübersicht', 'Wir bauen sie für dich, du teilst nur den Link'] },
    { kicker: 'Für deine Termine', titel: 'Deine Broschüren, gedruckt und digital', bild: () => foto('broschueren'),
      nutzen: 'Nach dem Termin bleibt etwas Hochwertiges auf dem Tisch liegen. Deine Broschüren rund ums Wasser tragen deinen Namen und deinen QR-Code. Gedruckt für das Gespräch, als PDF für WhatsApp.',
      punkte: ['Mit deinem Namen und deinem QR-Code', 'Gedruckt für den Termin, als PDF zum Verschicken', 'Wer den Code scannt, landet direkt bei dir'] },
    { kicker: 'Neue Kontakte', titel: 'Dein Freebie: ein E-Book als Lead-Magnet', bild: () => foto('ebook'),
      nutzen: 'Ein kostenloses E-Book rund ums Wasser, fertig geschrieben und gestaltet, mit deinem Namen. Wer es lesen möchte, trägt Namen und Kontakt ein. So lernst du Menschen kennen, die sich wirklich für das Thema interessieren.',
      punkte: ['Fertig geschrieben und gestaltet', 'Jeder Eintrag steht sofort in deiner Kundenübersicht', 'Mit dem Assistenten sofort auf deinem Handy'] },
    { kicker: 'Nichts mehr verpassen', titel: 'Keine Anfrage mehr, die du zu spät siehst', bild: assistentBuehne,
      nutzen: 'Wer schnell zurückruft, erreicht sein Gegenüber im richtigen Moment. Dein Assistent in Telegram meldet dir jede Anfrage sofort, nimmt Termine per Sprachnachricht auf und zeigt dir morgens, wen du heute anrufen wolltest.',
      punkte: ['Neue Anfragen sofort aufs Handy', 'Termine und Notizen per Sprachnachricht', 'Flyer direkt im Chat erstellen'] },
  ];
  function mehr(box) {
    box.innerHTML = `${kopf('Mehr für dein Geschäft', 'Weniger hinterherlaufen, mehr Abschlüsse. Such dir aus, was dir gerade am meisten Zeit spart.')}
      <div class="reihen angebote">${ANGEBOTE.map((a, i) => `<article class="reihe angebot"><div class="bild">${a.bild()}</div>
        <div class="text"><span class="zahl-gross" aria-hidden="true">0${i + 1}</span><p class="kicker">${esc(a.kicker)}</p><h2>${esc(a.titel)}</h2><p class="wozu">${esc(a.nutzen)}</p><ul class="punkte">${a.punkte.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <div class="preis"><div><small>Was kostet es?</small><b>[Preis folgt]</b></div>
        <a class="knopf" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Interesse: ' + a.titel)}&body=${encodeURIComponent(`Hallo Daniel und Jasmin,\n\nich interessiere mich für "${a.titel}".\n\n${nameVon(S.p)}`)}">Interesse melden</a></div></div></article>`).join('')}</div>`;
  }

  // ================= EINSTIEG =================
  // Vier Schritte beim ersten Anmelden (Korrektur 2, Punkt 2): Willkommen, das Wichtigste, Portal aufs Handy, fertig.
  // Überspringbar, wird nicht wiederholt und lässt sich im Konto jederzeit wieder öffnen.
  // Der Stand wird je Partner auf diesem Gerät gemerkt (kein neues SQL nötig).
  // Die Handy-Anleitung (je System drei Bilder mit markierter Tippstelle) stammt aus Korrektur 1 und steht jetzt in Schritt 3.
  const SAFARI = {
    teilen: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>', zurueck: '<path d="M15 5l-7 7 7 7"/>', vor: '<path d="M9 5l7 7-7 7"/>',
    buch: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>', tabs: '<rect x="4" y="4" width="12" height="12" rx="2"/><path d="M8 20h12V8"/>',
  };
  const sv = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const seiteMini = '<div class="g-seite"><i class="k"></i><i></i><i style="width:80%"></i><i style="width:90%"></i><i class="o"></i></div>';
  function anleitungIphone() {
    const leiste = (hier) => `<div class="safari-adresse">mein.ursprungskraft.net</div><div class="safari-leiste"><span>${sv(SAFARI.zurueck)}</span><span>${sv(SAFARI.vor)}</span><span class="${hier ? 'tipp-hier' : ''}">${sv(SAFARI.teilen)}</span><span>${sv(SAFARI.buch)}</span><span>${sv(SAFARI.tabs)}</span></div>`;
    return [
      ['Schritt 2', 'Unten in der Leiste auf das Teilen-Symbol tippen.', `${seiteMini}${leiste(true)}`],
      ['Schritt 3', 'Nach unten wischen und "Zum Home-Bildschirm" antippen.', `${seiteMini}${leiste(false)}<div class="g-blatt"><p>Kopieren</p><p>Zur Leseliste hinzufügen</p><p class="tipp-hier">Zum Home-Bildschirm <span>+</span></p><p>Lesezeichen hinzufügen</p></div>`],
      ['Schritt 4', 'Oben rechts auf "Hinzufügen" tippen. Fertig.', `<div class="g-kopf"><span class="blau">Abbrechen</span><span>Zum Home-Bildschirm</span><span class="blau fett tipp-hier">Hinzufügen</span></div><div class="g-icon"><img src="symbol/apple-touch-icon.png" alt=""><span><b>Partner</b><br>mein.ursprungskraft.net</span></div>`],
    ];
  }
  function anleitungAndroid() {
    const leiste = (hier) => `<div class="chrome-leiste"><span class="adresse">mein.ursprungskraft.net</span><span class="drei${hier ? ' tipp-hier' : ''}"><i></i><i></i><i></i></span></div>`;
    const seite = '<div class="g-seite" style="top:46px;bottom:0"><i class="k"></i><i></i><i style="width:80%"></i><i style="width:90%"></i><i class="o"></i></div>';
    return [
      ['Schritt 2', 'Oben rechts auf die drei Punkte tippen.', `${leiste(true)}${seite}`],
      ['Schritt 3', '"App installieren" antippen. Bei manchen Geräten heißt es "Zum Startbildschirm hinzufügen".', `${leiste(false)}${seite}<div class="g-menue"><p>Neuer Tab</p><p>Verlauf</p><p>Lesezeichen</p><p class="tipp-hier">App installieren</p><p>Einstellungen</p></div>`],
      ['Schritt 4', 'Auf "Installieren" tippen. Fertig.', `${leiste(false)}${seite}<div class="g-dialog"><b>App installieren?</b><div style="display:flex;align-items:center;gap:6px"><img src="symbol/icon-192.png" alt="" style="width:24px;height:24px;border-radius:6px">Partner<br>mein.ursprungskraft.net</div><div class="wahl-g"><span>Abbrechen</span><span class="tipp-hier">Installieren</span></div></div>`],
    ];
  }
  const A = { system: /android/i.test(navigator.userAgent) ? 'android' : 'iphone' };
  // Video zur Installation: Die Dateien liefert Jasmin nach. Sobald sie da sind, hier den Pfad eintragen,
  // zum Beispiel { iphone: 'video/app-iphone.mp4', android: 'video/app-android.mp4' }. Bis dahin steht ein Platzhalter da.
  const EINSTIEG_VIDEO = { iphone: '', android: '' };
  // Zwei Merker je Konto: "gesehen" (die Einführung ging einmal von selbst auf) und "fertig" (Haken "Einrichtung abgeschlossen").
  // Sie liegen im Konto (uk_partner_einstieg, neue SQL-Datei vom 09.11.2026), gelten also auf jedem Gerät.
  // Fehlen die Funktionen noch, merkt sich das Portal beides ersatzweise auf diesem Gerät.
  const einstiegSchluessel = (was) => `uk-partner-einstieg-${was}-${S.p?.kurz || ''}`;
  const einstiegLokal = (was) => { try { return !!localStorage.getItem(einstiegSchluessel(was)); } catch { return false; } };
  async function einstiegLaden() {
    let r = null; try { r = await mitSitzung('uk_partner_einstieg'); } catch { r = null; }
    S.einstieg = r && !r.error && r.data ? { gesehen: !!r.data.gesehen, fertig: !!r.data.fertig } : { gesehen: einstiegLokal('gesehen'), fertig: einstiegLokal('fertig') };
  }
  function einstiegSetzen(was) {
    if (!S.einstieg || S.einstieg[was]) return;
    S.einstieg[was] = true; if (was === 'fertig') S.einstieg.gesehen = true;
    try { localStorage.setItem(einstiegSchluessel(was), new Date().toISOString()); } catch {}
    Promise.resolve(mitSitzung('uk_partner_einstieg_setzen', { p_was: was })).catch(() => {});
  }
  function einstieg(von = 0) {
    if (!S.p || document.querySelector('dialog.einstieg')) return;
    const d = document.createElement('dialog'); d.className = 'einstieg'; d.setAttribute('aria-label', 'Einführung ins Partnerportal');
    let i = Math.max(0, Math.min(3, von)), richtung = 1;
    const merken = () => einstiegSetzen('gesehen');
    const amHandy = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    const punkt = (kopf, titel, text, n) => `<li style="--i:${n}">${kopf}<div><h3>${titel}</h3><p>${text}</p></div></li>`;
    const SCHRITTE = [
      () => `<p class="kicker">Willkommen</p><h2>Schön, dass du da bist, ${esc(S.p.vorname)}.</h2>
        <p class="vorspann">Dein Portal ist dein Arbeitsplatz als Partner. In zwei Minuten weißt du, wo alles ist.</p>
        <div class="e-zwei"><div class="bild">${foto('anmelden')}</div><ol class="e-liste">
          ${punkt('<span class="zahl-gross" aria-hidden="true">01</span>', 'Start zeigt dir den Tag', 'Deine Termine, deine Rückrufe und neue Anfragen. Ein Blick genügt, und du weißt, was heute ansteht.', 0)}
          ${punkt('<span class="zahl-gross" aria-hidden="true">02</span>', 'Alles hat seinen Platz', 'Das Menü steht am Computer links und am Handy unten. Kunden, Termine und Tools sind immer einen Tipp entfernt.', 1)}
          ${punkt('<span class="zahl-gross" aria-hidden="true">03</span>', 'Du bist nicht allein', `Unter Neuigkeiten liest du, was Daniel und Jasmin für dich haben. Fragen schickst du an ${KONTAKT}.`, 2)}</ol></div>`,
      () => `<p class="kicker">Das Wichtigste</p><h2>Vier Bereiche, die dir Arbeit abnehmen.</h2>
        <p class="vorspann">Du musst nichts einrichten, um loszulegen. Alles ist schon für dich vorbereitet.</p>
        <ol class="e-liste e-raster">
          ${punkt(ico('kunden'), 'Kunden', 'Jede Anfrage steht von selbst in deiner Kundenübersicht. Du siehst, wo jeder steht und wen du heute anrufst.', 0)}
          ${punkt(ico('termine'), 'Termine', 'Dein Kalender für Rückrufe, Termine vor Ort und Zoom. Er erscheint auch im Kalender auf deinem Handy.', 1)}
          ${punkt(ico('tools'), 'Tools', 'Deine Landingpage, der Flyer für deine Einladung, dein Bestell-Link und dein Assistent in Telegram.', 2)}
          ${punkt(ico('wissen'), 'Wissen', 'Unterlagen zum Weitergeben, Fakten zu jedem Gerät und Antworten auf häufige Einwände.', 3)}</ol>`,
      () => { const sys = A.system, schritte = sys === 'android' ? anleitungAndroid() : anleitungIphone(), v = EINSTIEG_VIDEO[sys];
        return `<p class="kicker">Auf dein Handy</p><h2>Dein Portal als App. Ganz ohne App Store.</h2>
        <p class="vorspann">Drei Handgriffe, danach öffnest du dein Portal mit einem Tipp auf dem Startbildschirm.</p>
        ${istApp() ? '<p class="verbunden" style="margin-bottom:var(--s-4)">Du nutzt das Portal schon als App.</p>' : ''}
        ${amHandy ? '' : `<div class="e-qr"><div class="qr">${qr(PORTAL_ADRESSE)}</div><p><b>Du sitzt gerade am Computer?</b> Halte die Kamera deines Handys auf den Code und melde dich dort an. Die Adresse lautet mein.ursprungskraft.net/partner.<br><button class="knopf still" type="button" data-portal-kopie style="margin:var(--s-2) 0 0 calc(-1 * var(--s-2))">${ico('kopie')} Adresse kopieren</button></p></div>`}
        <div class="e-install-kopf"><h3>So geht es auf deinem Handy</h3><div class="umschalter" role="group" aria-label="Handy"><button type="button" data-system="iphone" aria-pressed="${sys === 'iphone'}">iPhone (Safari)</button><button type="button" data-system="android" aria-pressed="${sys === 'android'}">Android (Chrome)</button></div></div>
        <div class="anleitung-schritte">${schritte.map(([, t, inhalt], n) => `<figure class="schritt-bild" style="--i:${n}"><div class="geraet ${sys}"><div class="schirm">${inhalt}</div></div><figcaption><b>${n + 1}</b>${esc(t)}</figcaption></figure>`).join('')}</div>
        <div class="e-video"><h3>Lieber als Video?</h3>${v ? `<video controls preload="metadata" playsinline src="${esc(v)}"></video>` : `<div class="rahmen">${ico('video')}<b>Das Video für ${sys === 'android' ? 'Android' : 'iPhone'} folgt in Kürze.</b><span class="klein">Bis dahin führen dich die drei Bilder oben ans Ziel.</span></div>`}</div>`; },
      () => `<p class="kicker">Fertig</p><h2>Du bist startklar.</h2>
        <p class="vorspann">Womit möchtest du anfangen? Diese Einführung findest du jederzeit wieder unter Konto.</p>
        <div class="e-los">
          <a href="#tools/seite" style="--i:0"><span><b>Deinen Link teilen</b><small>Trag ein, wie man dich erreicht, und verschick deine Landingpage per WhatsApp.</small></span>${ico('pfeil')}</a>
          <a href="#kunden/neu" style="--i:1"><span><b>Ersten Kunden eintragen</b><small>Ein Vorname genügt. Alles Weitere ergänzt du später.</small></span>${ico('pfeil')}</a>
          <a href="#termine/neu" style="--i:2"><span><b>Termin eintragen</b><small>Rückruf, Termin vor Ort oder Zoom. Er erscheint auch in deinem Handykalender.</small></span>${ico('pfeil')}</a></div>
        ${S.einstieg?.fertig ? '' : `<label class="haken e-haken"><input type="checkbox" data-einrichtung-fertig><span><b>Einrichtung abgeschlossen</b><small>Mit dem Haken verschwindet der Hinweis auf deiner Startseite. Ohne Haken erinnert er dich dort weiter an die Einrichtung.</small></span></label>`}`,
    ];
    d.innerHTML = `<div class="e-rahmen"><header class="e-kopf"><span class="wo" id="e-wo"></span><button class="knopf still" type="button" data-ueberspringen>Überspringen</button>
        <div class="e-balken" aria-hidden="true"><i></i><i></i><i></i><i></i></div></header>
      <div class="e-inhalt" id="e-inhalt"></div>
      <footer class="e-fuss"><button class="knopf zweit" type="button" data-e="-1">${ico('links')} Zurück</button><button class="knopf" type="button" data-e="1"></button></footer></div>`;
    const inhalt = d.querySelector('#e-inhalt');
    const malen = () => {
      inhalt.innerHTML = `<section class="e-schritt${richtung < 0 ? ' zurueck-r' : ''}">${SCHRITTE[i]()}</section>`; inhalt.scrollTop = 0;
      d.querySelector('#e-wo').textContent = `Schritt ${i + 1} von 4`;
      d.querySelectorAll('.e-balken i').forEach((x, n) => x.classList.toggle('voll', n <= i));
      d.querySelector('[data-e="-1"]').style.visibility = i ? '' : 'hidden';
      d.querySelector('[data-e="1"]').innerHTML = i === 3 ? 'Zum Portal' : `Weiter ${ico('rechts')}`;
      d.querySelector('[data-ueberspringen]').hidden = i === 3;
      inhalt.querySelectorAll('[data-system]').forEach((b) => (b.onclick = () => { A.system = b.dataset.system; richtung = 0; malen(); richtung = 1; }));
      const pk = inhalt.querySelector('[data-portal-kopie]'); if (pk) pk.onclick = () => kopieren(PORTAL_ADRESSE, 'Adresse kopiert.');
      inhalt.querySelectorAll('.e-los a').forEach((a) => a.addEventListener('click', () => { merken(); d.close(); }));
      const hk = inhalt.querySelector('[data-einrichtung-fertig]'); if (hk) hk.onchange = () => { if (hk.checked) { einstiegSetzen('fertig'); toast('Einrichtung abgeschlossen.'); } };
      if (richtung === 0) inhalt.firstElementChild.style.animation = 'none';
    };
    d.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => {
      const n = Number(b.dataset.e);
      if (i + n > 3) { merken(); d.close(); return; }
      richtung = n; i = Math.max(0, i + n); malen();
    }));
    d.querySelector('[data-ueberspringen]').onclick = () => { merken(); d.close(); };
    d.addEventListener('cancel', merken);
    d.addEventListener('close', () => { d.remove(); if ((location.hash.slice(1) || 'start') === 'start') zeigen(); });
    d.tabIndex = -1; document.body.append(d); d.showModal(); d.focus(); malen();
  }

  // ================= KONTO =================
  function konto(box) {
    const p = S.p, t = testTage();
    box.innerHTML = `${kopf('Konto', '')}
      <div class="konto">
        <section><h2>${esc(nameVon(p))}</h2><dl class="angaben">
          <div><dt>E-Mail</dt><dd>${esc(p.email)}</dd></div><div><dt>Enagic-ID</dt><dd>${esc(p.enagic_id || '')}</dd></div>
          <div><dt>Dein Kürzel in deinen Links</dt><dd>${esc(p.kurz)}</dd></div>
          ${t !== null ? `<div><dt>Testzeit</dt><dd>Noch ${t === 0 ? 'heute' : t === 1 ? '1 Tag' : t + ' Tage'} alles kostenlos</dd></div>` : ''}</dl></section>
        <section><h2>Portal auf dem Handy</h2><p>${istApp() ? 'Du nutzt das Portal schon als App. Die Anleitung kannst du trotzdem jederzeit wieder öffnen, zum Beispiel für ein zweites Gerät.' : 'Hol dir das Portal als App auf den Startbildschirm, ganz ohne App Store. Die Anleitung zeigt dir die drei Handgriffe für iPhone und Android.'}</p>
          <div class="knoepfe"><button class="knopf zweit" type="button" data-einstieg="2">${ico('app')} App aufs Handy holen</button><button class="knopf still" type="button" data-einstieg="0">Einführung noch einmal ansehen</button></div></section>
        <section><h2>Passwort</h2><p>Du willst dein Passwort ändern oder hast es vergessen? Schreib uns kurz, wir helfen dir.</p>
          <a class="knopf zweit" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Partnerportal: Passwort')}">${ico('mail')} Mail an Ursprungskraft</a></section>
        <section><h2>Abmelden</h2><p>Du meldest dich nur auf diesem Gerät ab. Deine Daten bleiben gespeichert.</p><button class="knopf zweit" type="button" data-ab>Abmelden</button></section>
      </div>`;
    box.querySelector('[data-ab]').onclick = abmelden;
    box.querySelectorAll('[data-einstieg]').forEach((b) => (b.onclick = () => einstieg(Number(b.dataset.einstieg))));
  }

  // ================= MEHR-MENÜ (Handy) =================
  function menue(box) {
    const n = ungelesen();
    const z = [['flyer', 'Flyer erstellen', 'Deine Einladung zum Infoabend'], ['wissen', 'Wissen und Schulung', 'Unterlagen, Produktwissen, Einwände'],
      ['neuigkeiten', 'Neuigkeiten', n ? `${n} neu von Daniel und Jasmin` : 'Von Daniel und Jasmin'], ['mehr', 'Mehr für dein Geschäft', 'Was dir zusätzlich Zeit spart'],
      ['konto', 'Konto', 'Deine Angaben, App aufs Handy, Abmelden']];
    box.innerHTML = `${kopf('Mehr', '')}${testTage() !== null ? `<p class="hinweis" style="margin-bottom:var(--s-4)"><b>Testzeit.</b> Noch ${testTage() === 0 ? 'heute' : testTage() === 1 ? '1 Tag' : testTage() + ' Tage'} ist alles kostenlos für dich frei.</p>` : ''}
      <nav class="mehr-liste" aria-label="Weitere Bereiche">${z.map(([h, t, u], i) => `<a href="#${h}" style="--i:${i}">${ico(h)}<span><b>${t}</b><small>${u}</small></span>${ico('rechts')}</a>`).join('')}</nav>`;
  }

  // ---------- Start ----------
  async function laden() {
    if (BO_LINK) return boLinkSeite();
    const s = sitzung.lesen();
    if (!s) return zugang(location.hash === '#registrieren' ? 'registrieren' : 'anmelden');
    const { data, error } = await rpc('uk_partner_daten', { p_sitzung: s });
    if (error) return zugang('anmelden', 'Das hat nicht geklappt. Bitte lade die Seite neu.');
    if (!data) { sitzung.setzen(null); return zugang(); }
    S.p = data;
    // Team-Konten landen dort, wo sie zuletzt waren (Daniel nutzt das Backoffice als App)
    let zuletzt = 'partner'; try { zuletzt = localStorage.getItem('uk-ansicht') || 'partner'; } catch {}
    if (data.team && zuletzt === 'bo' && !location.hash.slice(1) && !TG) history.replaceState(null, '', location.pathname + location.search + '#bo');
    rahmen();
    newsLaden().then(() => markieren((location.hash.slice(1) || 'start').split('/')[0]));
    await einstiegLaden();
    zeigen();
    // Erste Anmeldung: Die Einführung geht ein einziges Mal von selbst auf, egal auf welchem Gerät.
    // Danach erinnert auf der Startseite ein ruhiger Hinweis, bis der Haken "Einrichtung abgeschlossen" gesetzt ist.
    if (!S.einstieg.gesehen && !TG) einstieg(V ? Number(new URLSearchParams(location.search).get('einstieg')) || 0 : 0);
  }
  laden();
})();

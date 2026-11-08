// Partnerportal Ursprungskraft, neu gebaut am 08.11.2026 (Jasmin: "wie eine App", Oliv und Gold).
// Bereiche: Start (nächste Termine), Kunden (Kundendatenbank), Termine (Liste und Monat, Kalender-Abo), Tools
// (Landingpage, Flyer, Bestell-Link, Assistent), Flyer, Wissen, Neuigkeiten, Mehr für dein Geschäft, App, Konto.
// Korrektur 1 (Jasmin, 08.11.2026): eine Spalte, kleiner, heller Look, Kunden ohne Neuladen, echte Ansichten statt Fotos.
// Datenbank nur über Funktionen uk_partner_* mit Sitzungsschlüssel, nie direkt über Tabellen.
// Neue Funktionen: supabase/umbau-2026-11-08c-partnerportal-neu-*.sql. Fehlen sie noch, läuft das Portal mit den alten weiter.
// Vorschau mit Probedaten: ?vorschau (siehe vorschau.js).
(function () {
  'use strict';
  const SUPABASE = 'https://ngcbmpuqcqbelfoelwby.supabase.co';
  const BESTELLSEITE = 'https://mein.ursprungskraft.net/bestellen/?von=';
  const SEITE = 'https://mein.ursprungskraft.net/wasser/?von=';
  const KALENDER = SUPABASE + '/functions/v1/partner-kalender?k=';
  const ASSISTENT = SUPABASE + '/functions/v1/partner-assistent';
  const KONTAKT = 'info@ursprungskraft.net';
  const SPEICHER = 'uk-partnerportal';
  const V = window.Vorschau;
  const sb = V ? null : supabase.createClient(SUPABASE, 'sb_publishable_XXX',
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'uk-partner-sb' } });
  // Backoffice: eigene Supabase-Anmeldung über daten.js, erst geladen, wenn ein Team-Konto wechselt
  const BO_SKRIPTE = ['../dashboard/daten.js?v=20261021d', '../fragebogen/fragen.js?v=20261021c', 'backoffice.js?v=20261108b'];
  const BO_LINK = /(^|[#&])(access_token|error_code)=/.test(location.hash);
  const wurzel = document.getElementById('wurzel');

  // Aus dem Telegram-Assistenten (/flyer) geöffnet: #tg=<kurze Sitzung>. Dann direkt "Flyer erstellen",
  // fertige Flyer gehen per Knopf in den eigenen Chat (Download klappt in Telegram nicht).
  const TG = (location.hash.match(/^#tg=([0-9a-f]{48})$/) || [])[1] || null;
  if (TG) { try { localStorage.setItem(SPEICHER, TG); } catch {} history.replaceState(null, '', location.pathname + location.search + '#flyer'); }

  // ---------- Bewegung: kurz, mit Sinn, und nie bei prefers-reduced-motion ----------
  const ruhig = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.Bewegung = {
    // Bereiche bauen sich auf: die obersten Blöcke kommen nacheinander von unten
    auftritt(box) {
      if (!box || ruhig()) return;
      const teile = [...box.children].flatMap((x) => (x.matches('.start, .kunden-aufbau, .termine-aufbau, .flyer-aufbau, .bo-start') ? [...x.children] : [x])).slice(0, 10);
      teile.forEach((x, i) => { x.classList.remove('rein'); x.style.setProperty('--i', i); void x.offsetWidth; x.classList.add('rein'); });
      this.zahlen(box); this.woerter(box);
    },
    // Zahlen zählen hoch
    zahlen(box) {
      box.querySelectorAll('[data-zahl]').forEach((el) => {
        const ziel = Number(el.dataset.zahl); if (!Number.isFinite(ziel) || ziel < 2 || ruhig()) return;
        const t0 = performance.now(), dauer = 700;
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
    document.body.append(t); setTimeout(() => t.remove(), 2600);
  }
  async function kopieren(text, hinweis = 'Kopiert.') {
    try { await navigator.clipboard.writeText(text); toast(hinweis); } catch { prompt('Zum Kopieren markieren:', text); }
  }
  function qr(text) { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); }
  const fehlt = (s) => esc(s).replace(/\[FEHLT:[^\]]*\]/g, (m) => `<span class="fehlt">${m}</span>`);

  // Kleine Symbole, Linienstärke 1,75, alle im selben Raster
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
    teilen: '<circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="18" cy="18" r="2.3"/><path d="M8 11l8-4M8 13l8 4"/>',
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

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
  const BEREICHE = {
    kunden: { name: 'Kundendatenbank', bild: '../bilder/flyer/freunde.jpg', nutzen: ['Alle Interessenten deiner Seite automatisch an einem Ort', 'Käufer mit Bestellstand: bestellt, beim Hersteller, Gerät da', 'Notizen, Stufe heiß, warm, kalt und wann du dich wieder meldest'] },
    termine: { name: 'Termine und Kalender', bild: '../bilder/flyer/zwei-glaeser.jpg', nutzen: ['Monatsansicht mit allen Terminen und Rückrufen', 'Verbunden mit dem Kalender auf deinem Handy', 'Erinnerung 30 Minuten vorher'] },
    seite: { name: 'Deine Landingpage', bild: '', nutzen: ['Eine fertige Seite rund ums Wasser mit deinem Namen', 'Wer darüber anfragt, landet bei deinen Kunden', 'Knöpfe für WhatsApp, Anruf und Termin'] },
    flyer: { name: 'Flyer erstellen', bild: '../bilder/flyer/karaffe.jpg', nutzen: ['Einladungen in vier Formaten, fertig in zwei Minuten', '17 Motive und vier Farbwelten', 'Für WhatsApp, Instagram, Facebook und zum Ausdrucken'] },
    assistent: { name: 'Telegram-Assistent', bild: '../bilder/flyer/wasserhahn.jpg', nutzen: ['Meldet dir jede neue Anfrage sofort aufs Handy', 'Nimmt Termine per Chat an', 'Schickt dir morgens, was heute ansteht'] },
    wissen: { name: 'Wissen und Schulung', bild: '../bilder/flyer/glas-tropfen.jpg', nutzen: ['Unterlagen zum Weitergeben', 'Produktwissen zu jedem Gerät', 'Antworten auf die häufigsten Einwände'] },
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
  function gesperrt(b) {
    const x = BEREICHE[b];
    const mail = `mailto:${KONTAKT}?subject=${encodeURIComponent('Freischalten: ' + x.name)}&body=${encodeURIComponent(`Hallo Daniel und Jasmin,\n\nich möchte gern "${x.name}" im Partnerportal freischalten.\n\n${nameVon(S.p)}`)}`;
    return `<section class="gesperrt"><p class="kicker">${ico('schloss')} Noch nicht freigeschaltet</p><h2>${esc(x.name)}</h2>
        <ul>${x.nutzen.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        <p class="preis">Preis: [Preis folgt]</p>
        <a class="knopf" href="${mail}">Freischalten</a></section>`;
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
  const hatTermine = () => eintraege().some((e) => e.tag >= plusTage(heute(), -1));

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
        <div class="zugang-bild"><span class="marke"><img src="symbol/symbol-288.webp" alt=""><span><b>Ursprungskraft</b><small>Partner</small></span></span></div>
        <main class="zugang-form" id="inhalt">
          <p class="kicker">Partnerportal</p>
          <h1>Dein Arbeitsplatz als Partner.</h1>
          <p class="vorspann">Termine, Kunden und alle Tools für dein Geschäft an einem Ort. Auf dem Handy und am Computer.</p>
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
      teil.innerHTML = `<p class="leise" style="margin-bottom:var(--a-3)">Der Zugang ist kostenlos. Wir prüfen kurz deine Angaben und schalten dich frei. Du bekommst dann eine Mail.</p>
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
    null, ['mehr', 'Mehr für dein Geschäft'], ['app', 'App aufs Handy'], ['konto', 'Konto'],
  ];
  const LEISTE = [['start', 'Start'], ['kunden', 'Kunden'], ['termine', 'Termine'], ['tools', 'Tools'], ['menue', 'Mehr']];
  const ZU_MEHR = ['flyer', 'wissen', 'neuigkeiten', 'mehr', 'app', 'konto', 'menue'];
  const BO_ICO = { uebersicht: 'start', aufgaben: 'haken', kalender: 'termine', bestellungen: 'paket', kunden: 'kunden', partner: 'partner', maschinen: 'geraet', unterlagen: 'ordner', auswertung: 'zahlen', meine: 'zahlen', wohnung: 'start', menue: 'punkte' };
  const BO_LEISTE = [['uebersicht', 'Übersicht'], ['aufgaben', 'Aufgaben'], ['kalender', 'Kalender'], ['bestellungen', 'Bestellungen'], ['menue', 'Mehr']];
  let modus = 'partner';
  // Schalter Partner | Backoffice, nur für Team-Konten (uk_partner.team). Öffnet selbst keine Daten.
  const schalter = () => (S.p?.team ? `<div class="schalter" role="group" aria-label="Ansicht"><a href="#start" data-modus="partner" aria-pressed="${modus === 'partner'}">Partner</a><a href="#bo" data-modus="bo" aria-pressed="${modus === 'bo'}">Backoffice</a><i aria-hidden="true"></i></div>` : '');
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
          <div class="unten"><b>${esc(nameVon(S.p))}</b>Enagic-ID ${esc(S.p.enagic_id || '')}<br><button type="button" data-abmelden>Abmelden</button></div>
        </aside>
        <header class="kopfleiste"><img src="symbol/symbol-288.webp" alt=""><b>Partner</b>${schalter()}</header>
        <main class="flaeche"><div id="inhalt"></div></main>
        <nav class="leiste" aria-label="Hauptbereiche">${LEISTE.map(([z, n]) => `<a href="#${z}" data-ziel="${z}">${ico(z === 'menue' ? 'punkte' : z)}<span>${n}</span>${z === 'menue' ? '<i class="punkt" data-punkt hidden></i>' : ''}</a>`).join('')}</nav>
      </div>`;
    wurzel.querySelector('[data-abmelden]').onclick = abmelden;
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
          <div class="unten"><b>${esc(B.ich.name || nameVon(S.p))}</b>${B.ich.rolle === 'admin' ? 'Admin' : 'Team'}<br><button type="button" data-bo-ab>Backoffice abmelden</button></div>
        </aside>
        <header class="kopfleiste"><img src="symbol/symbol-288.webp" alt=""><b>Backoffice</b>${schalter()}</header>
        <main class="flaeche">
          <div class="bo-kopf"><div class="symbole"><button id="glocke" class="symbol glocke" type="button" hidden aria-label="Was ist neu">${ico('glocke')}<span id="glocke-zahl"></span></button><div id="glocke-liste" class="glocke-liste" hidden></div></div></div>
          <div id="inhalt"></div></main>
        <nav class="leiste" aria-label="Hauptbereiche Backoffice">${BO_LEISTE.map(([z, n]) => `<a href="#bo/${z}" data-ziel="bo/${z}">${ico(BO_ICO[z])}<span>${n}</span></a>`).join('')}</nav>
      </div>`;
    wurzel.querySelector('[data-bo-ab]').onclick = boAbmelden;
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
    sitzung.setzen(null); Object.assign(S, { p: null, kunden: null, best: null, termine: null, news: null });
    history.replaceState(null, '', location.pathname + location.search); zugang();
  }

  // ---------- Router ----------
  const SEITEN = { start, kunden, termine, tools, flyer, wissen, neuigkeiten, mehr, app, konto, menue };
  const TITEL = { start: 'Start', kunden: 'Kunden', termine: 'Termine', tools: 'Tools', flyer: 'Flyer erstellen', wissen: 'Wissen', neuigkeiten: 'Neuigkeiten', mehr: 'Mehr für dein Geschäft', app: 'App aufs Handy', konto: 'Konto', menue: 'Mehr' };
  let lauf = 0;
  async function zeigen() {
    if (!S.p) return;
    let [ziel, ...rest] = (location.hash.slice(1) || 'start').split('/');
    if (ziel === 'bo') return backoffice(rest[0]);
    if (ziel === 'werkzeuge') { history.replaceState(null, '', location.pathname + location.search + '#tools' + (rest.length ? '/' + rest.join('/') : '')); ziel = 'tools'; }
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
    if (!rest.length) window.scrollTo(0, 0);
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
  async function boFehler(t) { await modusSetzen('partner'); document.getElementById('inhalt').innerHTML = `<p class="meldung">${esc(t)}</p>`; }
  function boMenue() {
    const R = Backoffice.REITER.filter(Backoffice.sichtbar).filter(([z]) => !BO_LEISTE.some(([b]) => b === z));
    markieren('bo/menue');
    document.getElementById('inhalt').innerHTML = `${kopf('Mehr im Backoffice', '')}
      <nav class="mehr-liste">${R.map(([z, n, g]) => `<a href="#bo/${z}">${ico(BO_ICO[z] || 'start')}<span><b>${n}</b><small>${esc(g)}</small></span>${ico('rechts')}</a>`).join('')}
      <a href="#start">${ico('start')}<span><b>Zur Partneransicht</b><small>Deine Termine, Kunden und Tools</small></span>${ico('rechts')}</a></nav>
      <p style="margin-top:var(--a-4)"><button class="knopf zweit" type="button" data-bo-ab>Backoffice abmelden</button></p>`;
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
  async function boAbmelden() {
    try { await Daten.anmeldung.abmelden(); } catch {}
    boAngemeldet = false; location.hash = 'start'; toast('Vom Backoffice abgemeldet.');
  }
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
  // Korrektur 1: eine Spalte. Wo bin ich, was ist heute, was als Nächstes. Keine Monatsansicht daneben.
  function gruss() {
    const h = Number(new Date().toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit' }));
    return h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
  }
  // Eine Zeile im Terminplan. Alle Knöpfe leise, der Hauptknopf der Seite steht oben.
  function terminZeile(e, opt = {}) {
    if (e.typ === 'melden') {
      const k = e.k;
      return `<article class="termin melden"><div class="zeit">Melden</div><div class="was">
        <h3><a href="#kunden/${esc(k.id)}">${esc(nameVon(k))}</a></h3>
        ${k.verblieben ? `<p class="ort">${esc(k.verblieben)}</p>` : ''}
        ${k.telefon ? `<div class="knoepfe"><a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a></div>` : ''}</div></article>`;
    }
    const t = e.t, ende = new Date(new Date(t.beginn).getTime() + (t.minuten || 60) * 60000);
    const k = (S.kunden || []).find((x) => x.id === t.kunde_id);
    const knoepfe = [
      istAdresse(t.ort) && `<a class="knopf zweit" href="${route(t.ort)}" target="_blank" rel="noopener">${ico('route')} Route</a>`,
      istLink(t.ort) && `<a class="knopf zweit" href="${esc(t.ort)}" target="_blank" rel="noopener">Teilnehmen</a>`,
      k?.telefon && `<a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a>`,
      opt.loeschen && `<button class="knopf still" type="button" data-weg="${esc(t.id)}">Löschen</button>`,
    ].filter(Boolean).join('');
    return `<article class="termin"><div class="zeit">${uhr(t.beginn)}<small>bis ${uhr(ende.toISOString())}</small></div><div class="was">
      <h3>${t.name ? (t.kunde_id ? `<a href="#kunden/${esc(t.kunde_id)}">${esc(t.name)}</a>` : esc(t.name)) : esc(t.notiz || t.art)}</h3>
      <p class="art">${esc(t.art)}</p>
      ${t.ort && !istLink(t.ort) ? `<p class="ort">${esc(t.ort)}</p>` : ''}
      ${t.name && t.notiz ? `<p class="ort">${esc(t.notiz)}</p>` : ''}
      ${knoepfe ? `<div class="knoepfe">${knoepfe}</div>` : ''}</div></article>`;
  }
  // Einträge ab heute, nach Tagen gruppiert, in einer weißen Liste. Überfälliges "Wieder melden" steht bei heute.
  function plan(alle, opt = {}) {
    const h = heute(), von = opt.von || h, bis = plusTage(h, opt.tage ?? 14);
    const vorbei = (e) => e.typ === 'termin' && new Date(e.t.beginn).getTime() + (e.t.minuten || 60) * 60000 < Date.now();
    let liste = alle.filter((e) => e.tag >= von && e.tag <= bis && !vorbei(e));
    if (von <= h) liste = [...alle.filter((e) => e.typ === 'melden' && e.tag < h).map((e) => ({ ...e, tag: h })), ...liste];
    liste = liste.slice(0, opt.max ?? 99);
    if (!liste.length) return '';
    const gruppen = {};
    for (const e of liste) (gruppen[e.tag] = gruppen[e.tag] || []).push(e);
    return `<div class="liste-weiss">${Object.keys(gruppen).sort().map((t) => `${opt.ohneKopf ? '' : `<p class="tag-kopf">${relativ(t) ? relativ(t) + ', ' : ''}${tagName(t)}</p>`}
      ${gruppen[t].sort((a, b) => (a.typ === 'melden') - (b.typ === 'melden')).map((e) => terminZeile(e, opt)).join('')}`).join('')}</div>`;
  }
  async function start(box, rest, aktuell) {
    const [, , news] = await Promise.all([termineLaden().catch(() => (S.termine = [])), kundenLaden().catch(() => (S.kunden = [])), newsLaden()]);
    if (!aktuell()) return;
    const alle = eintraege(), h = heute();
    const heuteZahl = alle.filter((e) => e.tag === h && e.typ === 'termin').length;
    const melden = (S.kunden || []).filter((k) => !k.abgelegt && k.naechster_kontakt && k.naechster_kontakt <= h).length;
    const satz = heuteZahl ? `Heute ${heuteZahl === 1 ? 'steht ein Termin' : `stehen ${heuteZahl} Termine`} an${melden ? `, und ${melden === 1 ? 'eine Person wartet' : `${melden} Personen warten`} auf deinen Anruf` : ''}.`
      : melden ? `Heute ${melden === 1 ? 'wartet eine Person' : `warten ${melden} Personen`} auf deinen Anruf.` : 'Heute ist nichts eingetragen.';
    const heuteHtml = plan(alle, { tage: 0, ohneKopf: true });
    const spaeterHtml = plan(alle, { von: plusTage(h, 1), tage: 7, max: 5 });
    box.innerHTML = `
      <header class="gruss"><p class="kicker">${tagName(h)}</p><h1 class="woerter">${gruss()}, ${esc(S.p.vorname)}.</h1><p>${satz}</p></header>
      <section class="abschnitt" style="margin-top:0"><div class="abschnitt-kopf"><h2>Heute</h2><a href="#termine/neu">Termin eintragen</a></div>
        ${heuteHtml || `<div class="leer-karte"><h2>Heute ist alles frei.</h2><p>Zeit für einen Anruf bei jemandem, der lange nichts von dir gehört hat.</p></div>`}</section>
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>Die nächsten Tage</h2><a href="#termine">Alle Termine</a></div>
        ${spaeterHtml || '<p class="leer">In den nächsten sieben Tagen steht noch nichts an.</p>'}</section>
      ${news.length ? `<section class="abschnitt"><div class="abschnitt-kopf"><h2>Neu von Daniel und Jasmin</h2><a href="#neuigkeiten">Alle Neuigkeiten</a></div>
        <div class="liste-weiss">${news.slice(0, 2).map(neuigkeit).join('')}</div></section>` : ''}
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>Deine Tools</h2><a href="#tools">Alle Tools</a></div>
        <div class="kacheln">
          ${kachel('#tools/seite', mock('landing'), 'Deine Landingpage', 'Interessenten lesen in Ruhe nach und melden sich bei dir.')}
          ${kachel('#flyer', mock('flyer'), 'Flyer erstellen', 'Deine Einladung zum Infoabend, fertig in zwei Minuten.')}
          ${kachel('#tools/bestellen', mock('qr'), 'Dein Bestell-Link', 'Wer darüber bestellt, wird dir zugeordnet.')}
        </div></section>
      ${istApp() ? '' : `<a class="app-tipp" href="#app"><img src="symbol/apple-touch-icon.png" alt=""><span>Das Portal mit einem Tipp auf dem Startbildschirm, ganz ohne App Store. <b>So geht's</b></span></a>`}`;
    mocksFertig(box);
  }
  const kachel = (href, bild, titel, text) => `<a class="kachel" href="${href}"><div class="bild">${bild}</div>
    <div class="text"><h3>${esc(titel)}</h3><p>${esc(text)}</p></div></a>`;
  const neuigkeit = (n) => `<article class="neuigkeit${n.erstellt > neuAb() ? ' neu' : ''}"><small>${esc(n.von || 'Ursprungskraft')}, ${relativ(tagVon(n.erstellt)) || tagKurz(n.erstellt)}</small><p>${esc(n.text)}</p></article>`;
  const istApp = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  // ---------- Echte Ansichten statt Deko-Fotos (Korrektur 1, Punkt 6) ----------
  // Jedes Bild zeigt, worum es geht. Alles selbst gebaut aus HTML und CSS, der Flyer kommt aus flyer.js.
  function mock(art, opt = {}) {
    const p = S.p || {}, ini = `${(p.vorname || '?')[0]}${(p.nachname || '')[0] || ''}`;
    const sp = p.seite || {};
    if (art === 'landing') {
      // Am Server die echte Seite im Handy (gleiche Adresse, gleiche Domain). In der Vorschau der Nachbau.
      if (opt.echt && !V) return `<div class="mock-handy"><div class="schirm"><iframe src="${esc(SEITE + encodeURIComponent(p.kurz))}" title="Deine Landingpage" loading="lazy" tabindex="-1" aria-hidden="true"></iframe></div></div>`;
      return `<div class="mock-handy"><div class="schirm mock-landing"><div class="hero"></div><div class="inhalt">
        <b>Was steckt in deinem Wasser?</b>Erfahr, was wirklich aus deinem Hahn kommt.
        <div class="person"><i>${esc(ini)}</i><span>${esc(sp.text || `${p.vorname || ''} beantwortet deine Fragen.`)}</span></div>
        <span class="k">WhatsApp schreiben</span><span class="k zweit">Anrufen</span></div></div></div>`;
    }
    if (art === 'eigene-landing') {
      return `<div class="mock-handy"><div class="schirm mock-landing"><div class="hero" style="background-image:url('../bilder/flyer/klein/frau-kueche.jpg')"></div><div class="inhalt">
        <div class="person"><i>${esc(ini)}</i><span><b style="font-size:10px;margin:0">${esc(nameVon(p) || 'Dein Name')}</b>Deine Beraterin vor Ort</span></div>
        Ich zeige dir, was in deinem Wasser steckt.<span class="k">Termin ausmachen</span></div></div></div>`;
    }
    if (art === 'flyer') return `<div class="mock-flyer" data-mock-flyer></div>`;
    if (art === 'qr') return `<div class="mock-qr"><div class="qr">${qr(BESTELLSEITE + encodeURIComponent(p.kurz || ''))}</div><small>Dein Bestell-Link</small></div>`;
    if (art === 'chat') {
      return `<div class="mock-handy"><div class="schirm mock-chat"><div class="titel"><img src="symbol/favicon-48.png" alt="">Dein Assistent</div><div class="verlauf">
        <div class="blase"><b>Neue Anfrage über deine Seite</b>\nBeispiel Sabine K., Freiburg\nAm besten erreichbar: abends</div>
        <div class="tasten"><span>Angerufen</span><span>In 2 Tagen</span></div>
        <div class="blase">Guten Morgen, ${esc(p.vorname || 'Anna')}!\nHeute 18:30 Termin vor Ort\nHeute melden: Markus F.</div></div></div></div>`;
    }
    if (art === 'ebook') return `<div class="mock-buch"><div class="foto"></div><div class="text"><small>Kostenloses E-Book</small><b>Dein Wasser kann mehr</b><em>von ${esc(nameVon(p) || 'dir')}</em></div></div>`;
    if (art === 'hefte') return `<div class="mock-hefte"><img src="unterlagen/wasser-guide.jpg" alt=""><img src="unterlagen/reinigung-anleitung.jpg" alt=""></div>`;
    if (art === 'liste') return `<div class="mock-liste"><p><i style="background:var(--heiss)"></i>Beispiel Sabine K.<span class="marke-klein" style="margin-left:auto">Termin</span></p><p><i style="background:var(--warm)"></i>Beispiel Markus F.<span class="marke-klein" style="margin-left:auto">Kontaktiert</span></p><p><i style="background:var(--kalt)"></i>Beispiel Jonas W.<span class="marke-klein" style="margin-left:auto">Neu</span></p></div>`;
    return '';
  }
  // Flyer-Ansichten mit flyer.js zeichnen, sobald Schriften und Foto da sind
  async function mocksFertig(box) {
    const ziele = [...box.querySelectorAll('[data-mock-flyer]')]; if (!ziele.length || !window.Flyer) return;
    let d; try { d = JSON.parse(localStorage.getItem('uk-partner-flyer') || 'null'); } catch { d = null; }
    const U = Flyer.UEBERSCHRIFTEN;
    d = Object.assign({ art: 'Einladung', titel: U[0][0], text: U[0][1], zeit: '19:00', name: nameVon(S.p), farbe: 'blau', foto: 'frau-kueche' }, d || {});
    if (!Flyer.FOTOS[d.foto]) d.foto = 'frau-kueche';
    try { await Promise.all([Flyer.vorbereiten(), Flyer.fotoLaden(d.foto)]); } catch { return; }
    for (const z of ziele) { const c = document.createElement('canvas'); Flyer.zeichnen(c, 'story', d.farbe, d.foto, d, 0.12); z.replaceChildren(c); }
  }

  // ---------- Monatsansicht ----------
  function monat(el, opt = {}) {
    const alle = eintraege();
    let m = opt.monat || (opt.gewaehlt || heute()).slice(0, 7);
    const malen = () => {
      const [j, mo] = m.split('-').map(Number), erster = new Date(j, mo - 1, 1), versatz = (erster.getDay() + 6) % 7;
      const zellen = [];
      for (let i = 0; i < 42; i++) {
        const d = new Date(j, mo - 1, 1 - versatz + i), t = d.toLocaleDateString('sv-SE');
        const auf = alle.filter((e) => e.tag === t);
        zellen.push(`<button type="button" data-tag="${t}" class="${d.getMonth() !== mo - 1 ? 'anders' : ''}${t === heute() ? ' heute' : ''}" aria-pressed="${t === opt.gewaehlt}" aria-label="${tagName(t)}${auf.length ? `, ${auf.length} Einträge` : ''}">
          ${d.getDate()}<i>${auf.slice(0, 3).map((e) => `<b class="${e.typ === 'melden' ? 'm' : ''}"></b>`).join('')}</i></button>`);
        if (i === 34 && new Date(j, mo - 1, 1 - versatz + 35).getMonth() !== mo - 1) break;
      }
      el.innerHTML = `<div class="monat-kopf"><button type="button" data-schritt="-1" aria-label="Voriger Monat">${ico('links')}</button><h2>${MONATE[mo - 1]} ${j}</h2><button type="button" data-schritt="1" aria-label="Nächster Monat">${ico('rechts')}</button></div>
        <div class="tage">${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((x) => `<span class="wt">${x}</span>`).join('')}${zellen.join('')}</div>
        <p class="legende"><span>Termin</span><span class="m">Wieder melden</span></p>`;
      el.querySelectorAll('[data-schritt]').forEach((b) => (b.onclick = () => { const d = new Date(j, mo - 1 + Number(b.dataset.schritt), 1); m = d.toLocaleDateString('sv-SE').slice(0, 7); malen(); }));
      el.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => opt.klick && opt.klick(b.dataset.tag)));
    };
    malen();
  }

  // ================= TERMINE =================
  // Eine Spalte: oben Heute, darunter die nächsten Termine. Monat nur über den Umschalter. Kalender-Abo zugeklappt am Ende.
  const T = { ansicht: 'liste' };
  try { T.ansicht = localStorage.getItem('uk-termine-ansicht') === 'monat' ? 'monat' : 'liste'; } catch {}
  async function termine(box, rest, aktuell) {
    const neuKnopf = `<button class="knopf" type="button" data-neu>${ico('plus')} Termin eintragen</button>`;
    if (!frei('termine')) { box.innerHTML = kopf('Termine') + gesperrt('termine'); return; }
    await Promise.all([termineLaden(), kundenLaden().catch(() => (S.kunden = []))]);
    if (!aktuell()) return;
    const tag = /^\d{4}-\d{2}-\d{2}$/.test(rest[0] || '') ? rest[0] : null;
    if (!hatTermine()) {
      box.innerHTML = `${kopf('Termine', '', neuKnopf)}
        <div class="leer-karte"><h2>Noch keine Termine.</h2><p>Rückrufe, Termine vor Ort, Anrufe und Zoom. Jeder Termin erscheint auch im Kalender auf deinem Handy, mit Erinnerung 30 Minuten vorher.</p></div>`;
    } else {
      const alle = eintraege(), h = heute();
      const umschalter = `<div class="umschalter" role="group" aria-label="Ansicht"><button type="button" data-ansicht="liste" aria-pressed="${T.ansicht === 'liste'}">Liste</button><button type="button" data-ansicht="monat" aria-pressed="${T.ansicht === 'monat'}">Monat</button></div>`;
      const tagListe = (t) => { const l = alle.filter((e) => e.tag === t); return l.length ? `<div class="liste-weiss">${l.map((e) => terminZeile(e, { loeschen: true })).join('')}</div>` : '<p class="leer">An diesem Tag ist nichts eingetragen.</p>'; };
      const liste = T.ansicht === 'monat'
        ? `<div class="monat" id="monat"></div>${tag ? `<section class="abschnitt"><div class="abschnitt-kopf"><h2>${relativ(tag) ? relativ(tag) + ', ' : ''}${tagName(tag)}</h2></div>${tagListe(tag)}</section>` : ''}`
        : tag ? `<section><div class="abschnitt-kopf"><h2>${relativ(tag) ? relativ(tag) + ', ' : ''}${tagName(tag)}</h2><a href="#termine">Alle Termine</a></div>${tagListe(tag)}</section>`
        : `<section><div class="abschnitt-kopf"><h2>Heute</h2></div>${plan(alle, { tage: 0, ohneKopf: true, loeschen: true }) || '<p class="leer">Heute steht nichts an.</p>'}</section>
           <section class="abschnitt"><div class="abschnitt-kopf"><h2>Die nächsten Termine</h2></div>${plan(alle, { von: plusTage(h, 1), tage: 60, loeschen: true }) || '<p class="leer">In den nächsten Wochen ist nichts eingetragen.</p>'}</section>`;
      box.innerHTML = `${kopf('Termine', '', neuKnopf)}${umschalter}${liste}
        <details class="aufklappen abo"><summary>Termine im Kalender auf deinem Handy</summary>
          <p>Einmal verbinden, dann erscheint jeder Termin von selbst in deinem Handykalender. Den Link nur für dich behalten, sonst sieht jemand anders deine Termine.</p>
          <div class="knoepfe"><a class="knopf zweit" href="${esc(KALENDER.replace('https://', 'webcal://') + S.p.kalender)}">Mit iPhone verbinden</a>
          <a class="knopf zweit" href="https://calendar.google.com/calendar/r?cid=${encodeURIComponent(KALENDER.replace('https://', 'webcal://') + S.p.kalender)}" target="_blank" rel="noopener">Mit Google Kalender verbinden</a>
          <button class="knopf still" type="button" data-abo>${ico('kopie')} Link kopieren</button></div></details>
        <details class="aufklappen"><summary>Vergangene Termine der letzten 30 Tage</summary>${alle.filter((e) => e.typ === 'termin' && e.tag < h).reverse().map((e) => `<p class="leise klein">${tagKurz(e.tag)}, ${uhr(e.t.beginn)} Uhr: ${esc(e.t.art)}${e.t.name ? ', ' + esc(e.t.name) : ''}</p>`).join('') || '<p class="leer klein">Keine.</p>'}</details>`;
      if (T.ansicht === 'monat') monat(document.getElementById('monat'), { gewaehlt: tag, klick: (t) => (location.hash = 'termine/' + t) });
      box.querySelectorAll('[data-ansicht]').forEach((b) => (b.onclick = () => { T.ansicht = b.dataset.ansicht; try { localStorage.setItem('uk-termine-ansicht', T.ansicht); } catch {} zeigen(); }));
      box.querySelector('[data-abo]').onclick = () => kopieren(KALENDER + S.p.kalender, 'Kalender-Link kopiert.');
      box.querySelectorAll('[data-weg]').forEach((b) => (b.onclick = async () => {
        if (!confirm('Diesen Termin wirklich löschen?')) return;
        const r = await mitSitzung('uk_partner_termin_loeschen', { p_id: b.dataset.weg });
        if (r.error) return toast('Das hat nicht geklappt.');
        S.termine = null; toast('Termin gelöscht.'); zeigen();
      }));
    }
    box.querySelectorAll('[data-neu]').forEach((b) => (b.onclick = () => terminBlatt({ datum: tag || '' })));
    if (rest[0] === 'neu') terminBlatt({});
  }
  // Seitenkopf: Titel links, höchstens ein Hauptknopf rechts
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
      d.close(); S.termine = null; toast('Termin gespeichert. Er erscheint auch in deinem Handykalender.');
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
    if (!frei('kunden')) { box.innerHTML = kopf('Kunden') + gesperrt('kunden'); return; }
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
      <div class="liste-weiss" id="liste"></div>`;
    const zeilen = () => {
      const s = K.suche.toLowerCase();
      const passt = (k) => (K.extra === 'abgelegt' ? k.abgelegt : !k.abgelegt)
        && (K.filter === 'alle' || k.stand === K.filter)
        && (K.extra !== 'faellig' || faelligK(k))
        && (!['heiss', 'warm', 'kalt'].includes(K.extra) || k.stufe === K.extra)
        && (!s || [k.vorname, k.nachname, k.ort, k.telefon, k.email].join(' ').toLowerCase().includes(s));
      const z = l.filter(passt).sort((a, b) => (faelligK(b) - faelligK(a)) || String(a.naechster_kontakt || '9').localeCompare(String(b.naechster_kontakt || '9')) || String(b.erstellt).localeCompare(String(a.erstellt)));
      document.getElementById('liste').innerHTML = z.length ? z.map(zeile).join('')
        : `<p class="leer" style="padding:var(--a-4)">${l.length ? 'Zu dieser Auswahl gibt es niemanden.' : 'Noch keine Kunden. Sobald jemand über deine Landingpage anfragt oder über deinen Link bestellt, steht er hier.'}</p>`;
    };
    zeilen();
    el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { K.filter = b.dataset.f; el.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); zeilen(); }));
    el.querySelector('#extra').onchange = (e) => { K.extra = e.target.value; zeilen(); };
    el.querySelector('#suche').oninput = (e) => { K.suche = e.target.value; zeilen(); };
    el.querySelector('[data-neu]').onclick = () => kundeBlatt();
  }
  function zeile(k) {
    const b = (S.best || []).filter((x) => x.kunde_id === k.id).pop();
    const fall = faelligK(k);
    const stand = k.abgelegt ? 'Kein Interesse' : STAND_NAME[k.stand];
    const schritt = b ? BESTELL[b.stand] : k.verblieben || (k.quelle ? `Kam über: ${k.quelle}` : '');
    const datum = fall ? 'Heute melden' : k.naechster_kontakt ? tagKurz(k.naechster_kontakt).slice(0, 6) : '';
    return `<a class="zeile-kunde" href="#kunden/${encodeURIComponent(k.id)}">
      <span class="stufe-punkt ${esc(k.stufe || '')}" title="${esc(k.stufe ? 'Stufe ' + (STUFE.find((s) => s[0] === k.stufe) || [, ''])[1] : '')}"></span>
      <span class="name"><b>${esc(nameVon(k))}</b><span class="marke-klein${k.stand === 'gekauft' ? ' gekauft' : ''}">${esc(stand)}</span></span>
      <span class="datum${fall ? ' faellig' : ''}">${esc(datum)}</span>
      ${schritt ? `<span class="schritt-text">${esc(schritt)}</span>` : ''}</a>`;
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
      ${best.length ? `<section class="karte-teil"><h2>Bestellung</h2><div class="karte-weiss">${best.map((b) => {
        const i = ['bestellt', 'verschickt', 'da'].indexOf(b.stand);
        return `<div class="bestellung"><h4>${esc(b.geraete || 'Gerät')}<small>Nr. ${esc(b.nummer)}, bestellt am ${tagKurz(b.erstellt)}</small></h4>
          <ol class="schritte">${['bestellt', 'verschickt', 'da'].map((s, n) => `<li class="${n <= i ? 'erledigt' : ''}${n === i && n < 2 ? ' jetzt' : ''}"><b>${BESTELL[s]}</b>${n === 0 ? tagKurz(b.erstellt) : n === 2 && b.da_am ? tagKurz(b.da_am) : ''}</li>`).join('')}</ol></div>`;
      }).join('')}</div></section>` : k.geraet ? `<section class="karte-teil"><h2>Gerät</h2><p>${esc(k.geraet)}${k.kaufdatum ? ', gekauft am ' + tagKurz(k.kaufdatum) : ''}</p></section>` : ''}
      ${nurLesen ? '' : `<section class="karte-teil"><h2>Verlauf</h2>
        <form id="f-notiz" class="notiz-neu" novalidate><textarea name="notiz" rows="3" placeholder="Was wurde besprochen? Wird mit Datum gespeichert." aria-label="Neue Notiz"></textarea>
          <div class="knoepfe"><button class="knopf zweit" type="submit">Notiz speichern</button></div></form>
        ${k.notizen?.length ? `<ul class="notizen">${k.notizen.map((n) => `<li><small>${tagKurz(n.erstellt)}</small><p>${esc(n.text)}</p></li>`).join('')}</ul>` : '<p class="leer klein">Noch keine Notizen.</p>'}</section>`}
      <details class="aufklappen karte-weiss"><summary>Angaben</summary><dl class="angaben">
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
  // Reihenfolge nach Jasmin: erst ins Gespräch kommen (Landingpage), dann Flyer, dann der Bestell-Link. Dazu der Assistent.
  async function tools(box, rest) {
    const p = S.p, link = BESTELLSEITE + encodeURIComponent(p.kurz), seite = SEITE + encodeURIComponent(p.kurz);
    const sp = p.seite || {};
    box.innerHTML = `${kopf('Tools')}
      <div class="tools">
      <section class="tool" id="seite"><div class="bild">${mock('landing', { echt: true })}</div><div class="text">
        <p class="nr">Ins Gespräch kommen</p><h2>Deine Landingpage</h2>
        <p class="wozu">Du musst nicht jedem alles von vorn erklären. Interessenten lesen in Ruhe nach und melden sich bei dir. Jede Anfrage landet sofort in deinen Kunden.</p>
        ${frei('seite') ? `<div class="linkfeld"><code>${esc(seite)}</code><button class="knopf still" type="button" data-kopie="${esc(seite)}">${ico('kopie')} Kopieren</button></div>
        <div class="knoepfe"><a class="knopf" href="https://wa.me/?text=${encodeURIComponent('Schau mal, hier kannst du dein Wasser checken: ' + seite)}" target="_blank" rel="noopener">${ico('whatsapp')} Per WhatsApp teilen</a>
          <a class="knopf zweit" href="${esc(seite)}" target="_blank" rel="noopener">${ico('auge')} Ansehen</a></div>
        <details class="aufklappen"${rest[0] === 'seite' && rest[1] === 'einrichten' ? ' open' : ''}><summary>Deine Kontaktknöpfe auf der Landingpage</summary>
          <form id="f-seite" class="felder zwei" novalidate>
            <label class="feld ganz"><span class="titel">Ein Satz von dir</span><input name="text" maxlength="300" value="${esc(sp.text || '')}" placeholder="z. B. Ich zeige dir gern, was in deinem Wasser steckt."></label>
            <label class="feld"><span class="titel">WhatsApp-Nummer</span><input type="tel" name="whatsapp" value="${esc(sp.whatsapp || '')}" placeholder="+49 170 1234567"></label>
            <label class="feld"><span class="titel">Telefon zum Anrufen</span><input type="tel" name="telefon" value="${esc(sp.telefon || '')}"></label>
            <label class="feld"><span class="titel">E-Mail-Adresse</span><input type="email" name="email" value="${esc(sp.email || '')}"></label>
            <label class="feld"><span class="titel">Link zum Termin buchen</span><input type="url" name="termin" value="${esc(sp.termin || '')}" placeholder="https://calendly.com/dein-name"><small class="regel">Zum Beispiel Calendly. Beginnt mit https://</small></label>
            <p class="ganz leise klein">Für jede Angabe erscheint ein Knopf auf deiner Landingpage. Leere Felder tauchen nicht auf.</p>
            <div class="ganz knoepfe"><button class="knopf zweit" type="submit">Speichern</button><span class="meldung" id="seite-meldung"></span></div>
          </form></details>` : sperrHinweis('seite')}
      </div></section>

      <section class="tool" id="flyer"><div class="bild">${mock('flyer')}</div><div class="text">
        <p class="nr">Einladen</p><h2>Flyer für deine Einladung</h2>
        <p class="wozu">Deine Einladung zum Infoabend sieht aus wie vom Profi, in zwei Minuten fertig. Für WhatsApp, Instagram, Facebook und zum Ausdrucken.</p>
        <div class="knoepfe">${frei('flyer') ? `<a class="knopf zweit" href="#flyer">${ico('flyer')} Flyer erstellen</a>` : sperrHinweis('flyer')}</div></div></section>

      <section class="tool" id="bestellen"><div class="bild">${mock('qr')}</div><div class="text">
        <p class="nr">Abschließen</p><h2>Dein persönlicher Bestell-Link</h2>
        <p class="wozu">Schick diesen Link deinen Kunden. Wer darüber bestellt, wird dir zugeordnet.</p>
        <p class="leise klein" style="margin-top:var(--a-2)">Der Kauf läuft über deine Enagic-ID ${esc(p.enagic_id || '')}. Bisher ${Number(p.bestellungen) === 1 ? 'kam 1 Bestellung' : `kamen ${Number(p.bestellungen) || 0} Bestellungen`} über deinen Link.</p>
        <div class="linkfeld"><code>${esc(link)}</code><button class="knopf still" type="button" data-kopie="${esc(link)}">${ico('kopie')} Kopieren</button></div>
        <div class="knoepfe"><button class="knopf zweit" type="button" id="qr-laden">${ico('laden')} QR-Code speichern</button>
          <a class="knopf still" href="${esc(link)}" target="_blank" rel="noopener">Bestellseite ansehen</a></div>
        <div id="qr" hidden>${qr(link)}</div>
        <details class="aufklappen"><summary>Wer kümmert sich um die Bestellung?</summary>
          <p class="leise klein" style="margin-bottom:var(--a-3)">Der Vertrag läuft in jedem Fall über deine Enagic-ID. Du entscheidest nur, wer die Unterlagen an Enagic schickt.</p>
          <div class="wahl">
            <label><input type="radio" name="abwicklung" value="daniel" ${p.abwicklung !== 'selbst' ? 'checked' : ''}><span><b>Daniel organisiert alles</b><small>Die fertigen Unterlagen gehen an Daniel, er prüft sie und schickt sie an Enagic.</small></span></label>
            <label><input type="radio" name="abwicklung" value="selbst" ${p.abwicklung === 'selbst' ? 'checked' : ''}><span><b>Ich wickle selbst ab</b><small>Die fertigen Unterlagen kommen an ${esc(p.email)}, du schickst sie selbst an Enagic.</small></span></label>
          </div></details></div></section>

      ${p.tg_code ? `<section class="tool" id="assistent"><div class="bild">${mock('chat')}</div><div class="text">
        <p class="nr">Dranbleiben</p><h2>Dein Assistent in Telegram</h2>
        <p class="wozu">Du erfährst von jeder neuen Anfrage in dem Moment, in dem sie reinkommt, und morgens weißt du, wen du heute anrufen wolltest.</p>
        ${!frei('assistent') ? `<div class="knoepfe">${sperrHinweis('assistent')}</div>` : `${p.tg_verbunden ? '<p class="verbunden" style="margin-top:var(--a-3)">Dein Assistent ist verbunden.</p>' : ''}
        ${p.assistent_bot ? `<div class="knoepfe"><a class="knopf zweit" href="https://t.me/${esc(p.assistent_bot)}?start=${esc(p.tg_code)}" target="_blank" rel="noopener">${p.tg_verbunden ? 'Assistent öffnen' : 'Assistent verbinden'}</a></div>
        ${p.tg_verbunden ? '' : '<p class="leise klein" style="margin-top:var(--a-2)">Telegram öffnet sich, dort tippst du auf "Starten". Fertig.</p>'}` : '<p class="leer klein" style="margin-top:var(--a-3)">Der Assistent wird gerade eingerichtet. Der Knopf zum Verbinden erscheint hier in Kürze.</p>'}`}
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
    const fs = document.getElementById('f-seite');
    if (fs) fs.onsubmit = async (e) => {
      e.preventDefault();
      const w = Object.fromEntries(new FormData(fs).entries()), m = document.getElementById('seite-meldung');
      for (const x of Object.keys(w)) w[x] = String(w[x]).trim();
      m.className = 'meldung';
      if (w.termin && !/^https:\/\//.test(w.termin)) return (m.textContent = 'Der Link zum Termin buchen muss mit https:// beginnen.');
      const r = await mitSitzung('uk_partner_seite_setzen', { p: w });
      if (r.error || !r.data) return (m.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.');
      p.seite = w; m.className = 'meldung gut'; m.textContent = 'Gespeichert.';
    };
    if (rest[0]) document.getElementById(rest[0])?.scrollIntoView({ block: 'start' });
  }
  const sperrHinweis = (b) => `<div class="knoepfe" style="margin-top:var(--a-4)"><a class="knopf zweit" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Freischalten: ' + BEREICHE[b].name)}">${ico('schloss')} Freischalten</a></div>`;

  // ================= FLYER =================
  // Logik und Platzierung bleiben in flyer.js. Neu: Motive als große Bildkacheln, jede Vorschau öffnet per Klick groß.
  const FLYER_SPEICHER = 'uk-partner-flyer';
  async function flyer(box, rest, aktuell) {
    if (!frei('flyer')) { box.innerHTML = kopf('Flyer erstellen', 'Einladungen für deinen Infoabend.') + gesperrt('flyer'); return; }
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
    const vorlage = () => U.findIndex(([t, x]) => t === d.titel && x === d.text);
    const feld = (n, t, art = 'text', extra = '') => `<label class="feld"><span class="titel">${t}</span><input type="${art}" name="${n}" value="${esc(d[n] || '')}" ${extra}></label>`;
    box.innerHTML = `${kopf('Flyer erstellen')}
      <div class="flyer-aufbau">
        <form id="f-flyer" novalidate>
          <section class="schritt"><h2><span>1</span>Motiv und Farben</h2><p>Die Vorschau ändert sich sofort mit.</p>
            <div class="motive">${Object.entries(fotos).map(([k, f]) => `<button type="button" data-foto="${k}" aria-pressed="${d.foto === k}"><img src="${esc(f.klein)}" alt="" loading="lazy"><span>${esc(f.name)}</span></button>`).join('')}
              <label class="eigen"><input type="file" accept="image/*" id="eigen-foto" hidden><b>+</b><span>Eigenes Foto</span></label></div>
            <p class="unterpunkt">Farben</p>
            <div class="farben">${Object.entries(Flyer.FARBEN).map(([k, f]) => `<button type="button" data-farbe="${k}" aria-pressed="${d.farbe === k}"><i style="background:${f.grund}"><i style="background:${f.akzent}"></i></i>${esc(f.name)}</button>`).join('')}</div></section>
          <section class="schritt"><h2><span>2</span>Was steht drauf?</h2><p>Anlass, Datum und Ort. Die Überschrift kannst du aussuchen oder selbst schreiben.</p>
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
          <section class="schritt"><h2><span>3</span>Formate und speichern</h2><p>Wo willst du die Einladung zeigen? Mehrere gehen auch.</p>
            <div class="formate">${Object.entries(Flyer.FORMATE).map(([k, f]) => `<button type="button" data-format="${k}" aria-pressed="${d.formate.includes(k)}"><i class="f-${k}"></i><span><b>${esc(f.name)}</b><small>${esc(f.zusatz)}</small></span></button>`).join('')}</div>
            <div class="knoepfe" style="margin-top:var(--a-4)"><button class="knopf" type="button" id="flyer-laden"></button></div>
            <p class="leise klein" style="margin-top:var(--a-2)">${TG ? 'Die Bilder kommen als Datei in deinen Chat mit dem Assistenten.' : 'Die Bilder landen in deinem Download-Ordner, auf dem Handy in deinen Fotos oder Dateien.'}</p></section>
        </form>
        <aside class="flyer-vorschau" aria-label="Vorschau"><h2>Vorschau</h2><p>Tipp an, um sie groß zu sehen.</p>
          <div class="vorschauen" id="vorschauen"></div>
        </aside>
      </div>`;
    await Promise.all([Flyer.vorbereiten(), Flyer.fotoLaden(d.foto)]);
    if (!aktuell()) return;
    const form = document.getElementById('f-flyer');
    const merken = () => { try { localStorage.setItem(FLYER_SPEICHER, JSON.stringify({ ...d, foto: d.foto === 'eigen' ? 'frau-kueche' : d.foto })); } catch {} };
    const neu = () => {
      for (const [k, v] of new FormData(form).entries()) if (typeof v === 'string') d[k] = v.trim();
      merken();
      const vb = document.getElementById('vorschauen'); if (!vb) return;
      vb.innerHTML = d.formate.length ? '' : '<p class="leer klein">Wähl in Schritt 3 mindestens ein Format.</p>';
      for (const f of d.formate) {
        const b = document.createElement('button'); b.type = 'button'; if (f === 'banner') b.className = 'quer';
        const c = document.createElement('canvas'); Flyer.zeichnen(c, f, d.farbe, d.foto, d, 0.3);
        b.append(c); b.insertAdjacentHTML('beforeend', `<span>${esc(Flyer.FORMATE[f].name)}<em>Groß ansehen</em></span>`);
        b.setAttribute('aria-label', `${Flyer.FORMATE[f].name} groß ansehen`);
        b.onclick = () => gross(f); vb.append(b);
      }
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
    knoepfe('format', (k) => { d.formate = d.formate.includes(k) ? d.formate.filter((x) => x !== k) : [...d.formate, k]; });
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
    if (!frei('wissen')) { box.innerHTML = kopf('Wissen und Schulung', 'Unterlagen, Produktwissen und Antworten auf Einwände.') + gesperrt('wissen'); return; }
    const W = window.Wissen, teil = ['produkte', 'einwaende'].includes(rest[0]) ? rest[0] : 'unterlagen';
    const reiter = [['unterlagen', 'Unterlagen'], ['produkte', 'Produktwissen'], ['einwaende', 'Einwände und Antworten']];
    let inhalt = '';
    if (teil === 'unterlagen') {
      inhalt = `<p class="leise" style="margin-bottom:var(--a-4);max-width:40em">Zum Ansehen und zum Weitergeben an deine Kunden.</p>
        <div class="unterlagen">${W.unterlagen.map((u) => {
          const url = new URL(`unterlagen/${u.datei}.pdf`, location.href).href;
          return `<article class="unterlage"><a class="titel" href="unterlagen/${u.datei}.pdf" target="_blank" rel="noopener"><img src="unterlagen/${u.datei}.jpg" alt="Titelseite ${esc(u.titel)}" loading="lazy"></a>
          <h3>${esc(u.titel)}</h3><p>${esc(u.text)}</p>${u.pruefen ? `<p class="pruefen">${esc(u.pruefen)}</p>` : ''}
          <div class="knoepfe"><a class="knopf zweit" href="unterlagen/${u.datei}.pdf" target="_blank" rel="noopener">Ansehen</a>
          ${u.pruefen ? '' : `<button class="knopf still" type="button" data-teilen="${esc(url)}" data-titel="${esc(u.titel)}">${ico('teilen')} Weitergeben</button>`}</div></article>`;
        }).join('')}</div>`;
    } else if (teil === 'produkte') {
      inhalt = `<p class="leise" style="margin-bottom:var(--a-4);max-width:40em">Nur belegte Fakten. Was noch fehlt, ist rot markiert. Bitte nichts dazu erfinden und keine Heilversprechen machen.</p>
        <div class="produkte">${W.produkte.map((x) => `<article class="produkt" id="p-${x.id}"><figure style="background-image:url('${x.bild}')"></figure><div class="text">
          <p class="kicker">${esc(x.art)}</p><h3>${esc(x.name)}</h3><p class="kern">${fehlt(x.kern)}</p>
          ${x.wasserarten ? `<ol class="wasserarten">${x.wasserarten.map(([ph, w]) => `<li><b>${ph}</b>${esc(w)}</li>`).join('')}</ol>` : ''}
          <dl>${x.daten.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${fehlt(b)}</dd>`).join('')}</dl>
          ${x.hinweis ? `<p class="hinweis" style="margin-top:var(--a-3)">${esc(x.hinweis)}</p>` : ''}
          <p class="hinweis-klein">${esc(x.quelle)}</p></div></article>`).join('')}</div>`;
    } else {
      inhalt = `<p class="leise" style="margin-bottom:var(--a-4);max-width:40em"><span class="entwurf">Entwurf</span> Daniel und Jasmin prüfen diese Antworten noch. Nimm sie als Anregung, nicht zum Ablesen. Bleib auf Augenhöhe, du musst niemanden überreden.</p>
        <div class="einwaende">${W.einwaende.map((e, i) => `<details class="einwand"${i === 0 ? ' open' : ''}><summary><h3>"${esc(e.frage)}"</h3>${ico('plus')}</summary>
          <div class="antwort">${e.antwort.map((a) => `<p>${esc(a)}</p>`).join('')}<p class="satz">${esc(e.satz)}</p></div></details>`).join('')}</div>`;
    }
    box.innerHTML = `${kopf('Wissen und Schulung', 'Alles, was du für gute Gespräche brauchst.')}
      <nav class="unterreiter" aria-label="Wissen">${reiter.map(([w, t]) => `<a href="#wissen${w === 'unterlagen' ? '' : '/' + w}"${w === teil ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>${inhalt}`;
    box.querySelectorAll('[data-teilen]').forEach((b) => (b.onclick = async () => {
      const url = b.dataset.teilen;
      if (navigator.share) { try { await navigator.share({ title: b.dataset.titel, url }); } catch {} } else kopieren(url, 'Link zur Unterlage kopiert.');
    }));
  }

  // ================= NEUIGKEITEN =================
  async function neuigkeiten(box, rest, aktuell) {
    const n = await newsLaden(); if (!aktuell()) return;
    box.innerHTML = `${kopf('Neuigkeiten')}
      ${n.length ? `<div class="liste-weiss">${n.map((x) => `<article class="neuigkeit${x.erstellt > neuAb() ? ' neu' : ''}"><small>${esc(x.von || 'Ursprungskraft')}, ${tagName(tagVon(x.erstellt))}</small><p>${esc(x.text)}</p></article>`).join('')}</div>` : '<p class="leer">Noch keine Neuigkeiten.</p>'}`;
    gelesen();
  }

  // ================= MEHR FÜR DEIN GESCHÄFT =================
  // Texte von AJ, wörtlich übernommen (Korrektur 1, Punkt 10). Bilder zeigen, worum es geht.
  const ANGEBOTE = [
    { kicker: 'Mehr Anfragen', titel: 'Deine eigene Landingpage, die für dich wirbt', bild: () => mock('eigene-landing'),
      nutzen: 'Du erklärst nicht mehr jedem einzeln alles von vorn. Du schickst einen Link, deine Interessenten lesen in Ruhe und melden sich bei dir, wenn sie bereit sind. Auch abends, auch wenn du gerade im Termin sitzt.',
      punkte: ['Mit deinem Gesicht, damit sie wissen, wem sie schreiben', 'Jede Anfrage landet sofort in deinen Kunden', 'Wir bauen sie, du teilst nur noch den Link'] },
    { kicker: 'Bleibt im Kopf', titel: 'Broschüren, die nach dem Gespräch weiterreden', bild: () => mock('hefte'),
      nutzen: 'Das Nachdenken fängt erst an, wenn du weg bist. Genau dann liegt die Broschüre auf dem Küchentisch, beantwortet die Fragen, die erst abends kommen, und führt per QR-Code direkt zu dir zurück.',
      punkte: ['Hochwertig gedruckt, mit deinem QR-Code', 'Dazu die digitale Fassung für WhatsApp', 'Wer scannt, landet bei dir'] },
    { kicker: 'Neue Kontakte', titel: 'Dein E-Book, das Interessenten zu dir bringt', bild: () => mock('ebook'),
      nutzen: 'Fremde ansprechen kostet Überwindung. Mit einem kostenlosen E-Book kommen die Leute von selbst: Sie tragen sich ein, um es zu bekommen, und stehen danach mit Namen und Kontakt in deinen Kunden.',
      punkte: ['Fertig geschrieben und gestaltet, mit deinem Namen', 'Jede Anmeldung landet sofort in deinen Kunden', 'Mit dem Telegram-Assistenten sogar direkt aufs Handy'] },
    { kicker: 'Nichts mehr vergessen', titel: 'Dein Assistent auf dem Handy', bild: () => mock('chat'),
      nutzen: 'Wer zu spät zurückruft, hat den Kunden oft schon verloren. Dein Assistent meldet dir jede Anfrage in dem Moment, in dem sie reinkommt, und erinnert dich morgens, wen du heute anrufen wolltest.',
      punkte: ['Neue Anfragen sofort aufs Handy', 'Termine und Notizen per Sprachnachricht eintragen', 'Flyer direkt im Chat erstellen'] },
  ];
  function mehr(box) {
    box.innerHTML = `${kopf('Mehr für dein Geschäft', 'Weniger hinterherlaufen, mehr Abschlüsse. Such dir aus, was dir gerade am meisten Zeit spart.')}
      <div class="angebote">${ANGEBOTE.map((a) => `<article class="angebot"><div class="bild">${a.bild()}</div>
        <div class="text"><p class="kicker">${esc(a.kicker)}</p><h2>${esc(a.titel)}</h2><p>${esc(a.nutzen)}</p><ul>${a.punkte.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <div class="preis"><div><small>Was kostet es?</small><b>[Preis folgt]</b></div>
        <a class="knopf zweit" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Interesse: ' + a.titel)}&body=${encodeURIComponent(`Hallo Daniel und Jasmin,\n\nich interessiere mich für "${a.titel}".\n\n${nameVon(S.p)}`)}">Interesse melden</a></div></div></article>`).join('')}</div>`;
  }

  // ================= APP AUFS HANDY =================
  // Korrektur 1, Punkt 9: je System drei Schritte als Bild mit Markierung an der Tippstelle. Das Portal erkennt das Gerät.
  const SAFARI = {
    teilen: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>', zurueck: '<path d="M15 5l-7 7 7 7"/>', vor: '<path d="M9 5l7 7-7 7"/>',
    buch: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>', tabs: '<rect x="4" y="4" width="12" height="12" rx="2"/><path d="M8 20h12V8"/>',
  };
  const sv = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const seiteMini = '<div class="g-seite"><i class="k"></i><i></i><i style="width:80%"></i><i style="width:90%"></i><i class="o"></i></div>';
  function anleitungIphone() {
    const leiste = (hier) => `<div class="safari-adresse">mein.ursprungskraft.net</div><div class="safari-leiste"><span>${sv(SAFARI.zurueck)}</span><span>${sv(SAFARI.vor)}</span><span class="${hier ? 'tipp-hier' : ''}">${sv(SAFARI.teilen)}</span><span>${sv(SAFARI.buch)}</span><span>${sv(SAFARI.tabs)}</span></div>`;
    return [
      ['Schritt 1', 'Unten in der Leiste auf das Teilen-Symbol tippen.', `${seiteMini}${leiste(true)}`],
      ['Schritt 2', 'Nach unten wischen und "Zum Home-Bildschirm" antippen.', `${seiteMini}${leiste(false)}<div class="g-blatt"><p>Kopieren</p><p>Zur Leseliste hinzufügen</p><p class="tipp-hier">Zum Home-Bildschirm <span>+</span></p><p>Lesezeichen hinzufügen</p></div>`],
      ['Schritt 3', 'Oben rechts auf "Hinzufügen" tippen. Fertig.', `<div class="g-kopf"><span class="blau">Abbrechen</span><span>Zum Home-Bildschirm</span><span class="blau fett tipp-hier">Hinzufügen</span></div><div class="g-icon"><img src="symbol/apple-touch-icon.png" alt=""><span><b>Partner</b><br>mein.ursprungskraft.net</span></div>`],
    ];
  }
  function anleitungAndroid() {
    const leiste = (hier) => `<div class="chrome-leiste"><span class="adresse">mein.ursprungskraft.net</span><span class="drei${hier ? ' tipp-hier' : ''}"><i></i><i></i><i></i></span></div>`;
    const seite = '<div class="g-seite" style="top:46px;bottom:0"><i class="k"></i><i></i><i style="width:80%"></i><i style="width:90%"></i><i class="o"></i></div>';
    return [
      ['Schritt 1', 'Oben rechts auf die drei Punkte tippen.', `${leiste(true)}${seite}`],
      ['Schritt 2', '"App installieren" antippen. Bei manchen Geräten heißt es "Zum Startbildschirm hinzufügen".', `${leiste(false)}${seite}<div class="g-menue"><p>Neuer Tab</p><p>Verlauf</p><p>Lesezeichen</p><p class="tipp-hier">App installieren</p><p>Einstellungen</p></div>`],
      ['Schritt 3', 'Auf "Installieren" tippen. Fertig.', `${leiste(false)}${seite}<div class="g-dialog"><b>App installieren?</b><div style="display:flex;align-items:center;gap:6px"><img src="symbol/icon-192.png" alt="" style="width:24px;height:24px;border-radius:6px">Partner<br>mein.ursprungskraft.net</div><div class="wahl-g"><span>Abbrechen</span><span class="tipp-hier">Installieren</span></div></div>`],
    ];
  }
  const A = { system: /android/i.test(navigator.userAgent) ? 'android' : 'iphone' };
  function app(box) {
    const schritte = (A.system === 'android' ? anleitungAndroid() : anleitungIphone());
    box.innerHTML = `${kopf('Das Portal als App', 'Ein Tipp auf dem Startbildschirm, ganz ohne App Store.')}
      ${istApp() ? '<p class="verbunden" style="margin-bottom:var(--a-4)">Du nutzt das Portal schon als App.</p>' : ''}
      <div class="app-symbol"><img src="symbol/apple-touch-icon.png" alt="App-Symbol Partner"><span><b>Partner</b><br><span class="leise klein">So heißt die App auf deinem Startbildschirm.</span></span></div>
      <div class="umschalter" role="group" aria-label="Handy"><button type="button" data-system="iphone" aria-pressed="${A.system === 'iphone'}">iPhone (Safari)</button><button type="button" data-system="android" aria-pressed="${A.system === 'android'}">Android (Chrome)</button></div>
      <div class="anleitung-schritte">${schritte.map(([n, t, inhalt]) => `<figure class="schritt-bild"><div class="geraet ${A.system}"><div class="schirm">${inhalt}</div></div><figcaption><b>${n}</b>${esc(t)}</figcaption></figure>`).join('')}</div>`;
    box.querySelectorAll('[data-system]').forEach((b) => (b.onclick = () => { A.system = b.dataset.system; app(box); }));
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
        <section><h2>Passwort</h2><p class="leise">Du willst dein Passwort ändern oder hast es vergessen? Schreib uns kurz, wir helfen dir.</p>
          <a class="knopf zweit" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Partnerportal: Passwort')}">${ico('mail')} Mail an Ursprungskraft</a></section>
        <section><h2>Abmelden</h2><p class="leise">Auf diesem Gerät abmelden. Deine Daten bleiben gespeichert.</p><button class="knopf zweit" type="button" data-ab>Abmelden</button></section>
      </div>`;
    box.querySelector('[data-ab]').onclick = abmelden;
  }

  // ================= MEHR-MENÜ (Handy) =================
  function menue(box) {
    const n = ungelesen();
    const z = [['flyer', 'Flyer erstellen', 'Einladungen für deinen Infoabend'], ['wissen', 'Wissen und Schulung', 'Unterlagen, Produkte, Einwände'],
      ['neuigkeiten', 'Neuigkeiten', n ? `${n} neu von Daniel und Jasmin` : 'Von Daniel und Jasmin'], ['mehr', 'Mehr für dein Geschäft', 'Pakete und Angebote'],
      ['app', 'App aufs Handy', 'So kommt das Portal auf den Startbildschirm'], ['konto', 'Konto', 'Passwort, Abmelden']];
    box.innerHTML = `${kopf('Mehr', '')}${testTage() !== null ? `<p class="hinweis" style="margin-bottom:var(--a-4)">Testzeit: noch ${testTage()} Tage alles kostenlos.</p>` : ''}
      <nav class="mehr-liste">${z.map(([h, t, u]) => `<a href="#${h}">${ico(h)}<span><b>${t}</b><small>${u}</small></span>${ico('rechts')}</a>`).join('')}</nav>`;
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
    zeigen();
  }
  laden();
})();

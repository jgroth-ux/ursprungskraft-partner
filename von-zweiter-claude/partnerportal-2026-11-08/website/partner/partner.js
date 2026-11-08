// Partnerportal Ursprungskraft, neu gebaut am 08.11.2026 (Jasmin: "wie eine App", Oliv und Gold).
// Bereiche: Start (nächste Termine), Kunden (Kundendatenbank), Termine (Monatsansicht und Kalender-Abo), Werkzeuge
// (Wasser-Check-Seite, Flyer, Bestell-Link, Assistent), Flyer, Wissen, Neuigkeiten, Mehr für dein Geschäft, App, Konto.
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
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const wurzel = document.getElementById('wurzel');

  // Aus dem Telegram-Assistenten (/flyer) geöffnet: #tg=<kurze Sitzung>. Dann direkt "Flyer erstellen",
  // fertige Flyer gehen per Knopf in den eigenen Chat (Download klappt in Telegram nicht).
  const TG = (location.hash.match(/^#tg=([0-9a-f]{48})$/) || [])[1] || null;
  if (TG) { try { localStorage.setItem(SPEICHER, TG); } catch {} history.replaceState(null, '', location.pathname + location.search + '#flyer'); }

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
    werkzeuge: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5"/><path d="M4 4l5 5M4 4v3h3"/>',
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
    seite: { name: 'Deine Wasser-Check-Seite', bild: '../bilder/flyer/frau-kueche.jpg', nutzen: ['Eine fertige Seite rund ums Wasser mit deinem Namen', 'Wer darüber anfragt, landet bei deinen Kunden', 'Knöpfe für WhatsApp, Anruf und Termin'] },
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
    return `<section class="gesperrt">
      <figure style="background-image:url('${x.bild}')"></figure>
      <div class="text"><p class="kicker">Noch nicht freigeschaltet</p><h2>${esc(x.name)}</h2>
        <p>Das bekommst du, sobald der Bereich frei ist:</p>
        <ul>${x.nutzen.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        <p class="preis">Preis: [Preis folgt]</p>
        <a class="knopf" href="${mail}">${ico('schloss')} Freischalten</a></div></section>`;
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
          <p class="vorspann">Termine, Kunden und alle Werkzeuge für dein Geschäft an einem Ort. Auf dem Handy und am Computer.</p>
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
    ['start', 'Start'], ['kunden', 'Kunden'], ['termine', 'Termine'], ['werkzeuge', 'Werkzeuge'], ['flyer', 'Flyer'], ['wissen', 'Wissen'], ['neuigkeiten', 'Neuigkeiten'],
    null, ['mehr', 'Mehr für dein Geschäft'], ['app', 'App aufs Handy'], ['konto', 'Konto'],
  ];
  const LEISTE = [['start', 'Start'], ['kunden', 'Kunden'], ['termine', 'Termine'], ['werkzeuge', 'Werkzeuge'], ['menue', 'Mehr']];
  const ZU_MEHR = ['flyer', 'wissen', 'neuigkeiten', 'mehr', 'app', 'konto', 'menue'];
  function rahmen() {
    const t = testTage();
    wurzel.innerHTML = `${V ? `<p class="vorschau-band">Vorschau mit Probedaten (${esc(V.modus)}). Es wird nichts gespeichert.</p>` : ''}
      <div class="app">
        <aside class="menue" aria-label="Menü">
          <a class="marke" href="#start"><img src="symbol/symbol-288.webp" alt=""><span><b>Ursprungskraft</b><small>Partner</small></span></a>
          ${t !== null ? `<p class="test-band"><b>Testzeit</b>Noch ${t === 0 ? 'heute' : t === 1 ? '1 Tag' : t + ' Tage'} alles kostenlos.</p>` : ''}
          <nav>${MENUE.map((m) => (m ? `<a href="#${m[0]}" data-ziel="${m[0]}">${ico(m[0])}<span>${m[1]}</span>${m[0] === 'neuigkeiten' ? '<span class="zahl" data-zahl></span>' : ''}</a>` : '<div class="trenner"></div>')).join('')}</nav>
          <div class="unten"><b>${esc(nameVon(S.p))}</b>Enagic-ID ${esc(S.p.enagic_id || '')}<br><button type="button" data-abmelden>Abmelden</button></div>
        </aside>
        <header class="kopfleiste"><img src="symbol/symbol-288.webp" alt=""><b>Partner</b></header>
        <main class="flaeche" id="inhalt"></main>
        <nav class="leiste" aria-label="Hauptbereiche">${LEISTE.map(([z, n]) => `<a href="#${z}" data-ziel="${z}">${ico(z === 'menue' ? 'punkte' : z)}<span>${n}</span>${z === 'menue' ? '<i class="punkt" data-punkt hidden></i>' : ''}</a>`).join('')}</nav>
      </div>`;
    wurzel.querySelector('[data-abmelden]').onclick = abmelden;
  }
  function markieren(ziel) {
    wurzel.querySelectorAll('[data-ziel]').forEach((a) => {
      const z = a.dataset.ziel, inLeiste = !!a.closest('.leiste');
      const an = z === ziel || (inLeiste && z === 'menue' && ZU_MEHR.includes(ziel));
      an ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    const n = ungelesen();
    wurzel.querySelectorAll('[data-zahl]').forEach((x) => (x.textContent = n ? String(n) : ''));
    wurzel.querySelectorAll('[data-punkt]').forEach((x) => (x.hidden = !n));
  }
  async function abmelden() {
    await mitSitzung('uk_partner_abmelden');
    sitzung.setzen(null); Object.assign(S, { p: null, kunden: null, best: null, termine: null, news: null });
    history.replaceState(null, '', location.pathname + location.search); zugang();
  }

  // ---------- Router ----------
  const SEITEN = { start, kunden, termine, werkzeuge, flyer, wissen, neuigkeiten, mehr, app, konto, menue };
  const TITEL = { start: 'Start', kunden: 'Kunden', termine: 'Termine', werkzeuge: 'Werkzeuge', flyer: 'Flyer erstellen', wissen: 'Wissen', neuigkeiten: 'Neuigkeiten', mehr: 'Mehr für dein Geschäft', app: 'App aufs Handy', konto: 'Konto', menue: 'Mehr' };
  let lauf = 0;
  async function zeigen() {
    if (!S.p) return;
    const [ziel, ...rest] = (location.hash.slice(1) || 'start').split('/');
    const seite = SEITEN[ziel] ? ziel : 'start';
    const nr = ++lauf;
    markieren(seite);
    document.title = `${TITEL[seite]} · Partnerportal`;
    const box = document.getElementById('inhalt');
    box.innerHTML = '<p class="laden">Einen Moment …</p>';
    try { await SEITEN[seite](box, rest, () => nr === lauf); }
    catch (e) { console.warn(e); if (nr === lauf) box.innerHTML = '<p class="meldung">Das hat nicht geklappt. Bitte lade die Seite neu.</p>'; }
    markieren(seite);
    if (!rest.length) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', zeigen);

  // ================= START =================
  function gruss() {
    const h = Number(new Date().toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit' }));
    return h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
  }
  function terminZeile(e, mitTag) {
    if (e.typ === 'melden') {
      const k = e.k;
      return `<article class="termin melden"><div class="zeit">${mitTag ? '' : 'Melden'}</div><div>
        <p class="art">Wieder melden</p><h3><a href="#kunden/${esc(k.id)}">${esc(nameVon(k))}</a></h3>
        ${k.verblieben ? `<p class="ort">${esc(k.verblieben)}</p>` : ''}
        <div class="knoepfe">${k.telefon ? `<a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a>` : ''}<a class="knopf still" href="#kunden/${esc(k.id)}">Kundenkarte</a></div></div></article>`;
    }
    const t = e.t, ende = new Date(new Date(t.beginn).getTime() + (t.minuten || 60) * 60000);
    const k = (S.kunden || []).find((x) => x.id === t.kunde_id);
    return `<article class="termin${e.tag === heute() ? ' heute' : ''}"><div class="zeit">${uhr(t.beginn)}<small>bis ${uhr(ende.toISOString())}</small></div><div>
      <p class="art">${esc(t.art)}</p><h3>${t.name ? (t.kunde_id ? `<a href="#kunden/${esc(t.kunde_id)}">${esc(t.name)}</a>` : esc(t.name)) : esc(t.notiz || t.art)}</h3>
      ${t.ort ? `<p class="ort">${istLink(t.ort) ? `<a href="${esc(t.ort)}" target="_blank" rel="noopener">Link zum Treffen</a>` : esc(t.ort)}</p>` : ''}
      ${t.name && t.notiz ? `<p class="ort">${esc(t.notiz)}</p>` : ''}
      <div class="knoepfe">${istAdresse(t.ort) ? `<a class="knopf" href="${route(t.ort)}" target="_blank" rel="noopener">${ico('route')} Route</a>` : ''}
        ${istLink(t.ort) ? `<a class="knopf" href="${esc(t.ort)}" target="_blank" rel="noopener">Teilnehmen</a>` : ''}
        ${k?.telefon ? `<a class="knopf zweit" href="tel:${esc(tel(k.telefon))}">${ico('telefon')} Anrufen</a>` : ''}</div></div></article>`;
  }
  function plan(alle, tage = 14, max = 8) {
    const h = heute(), bis = plusTage(h, tage);
    const liste = alle.filter((e) => e.tag >= h && e.tag <= bis && !(e.typ === 'termin' && new Date(e.t.beginn).getTime() + (e.t.minuten || 60) * 60000 < Date.now())).slice(0, max);
    // Überfälliges "Wieder melden" gehört zu heute
    const alt = alle.filter((e) => e.typ === 'melden' && e.tag < h).map((e) => ({ ...e, tag: h }));
    const gruppen = {};
    for (const e of [...alt, ...liste]) (gruppen[e.tag] = gruppen[e.tag] || []).push(e);
    return Object.keys(gruppen).sort().map((t) => `<section class="plan-tag"><h2>${relativ(t) || TAGE[new Date(t + 'T12:00').getDay()]}<small>${tagName(t).split(', ')[1]}</small></h2>
      <div>${gruppen[t].sort((a, b) => (a.typ === 'melden') - (b.typ === 'melden')).map((e) => terminZeile(e, false)).join('')}</div></section>`).join('');
  }
  async function start(box, rest, aktuell) {
    const [, , news] = await Promise.all([termineLaden().catch(() => (S.termine = [])), kundenLaden().catch(() => (S.kunden = [])), newsLaden()]);
    if (!aktuell()) return;
    const alle = eintraege(), h = heute();
    const heuteZahl = alle.filter((e) => e.tag === h && e.typ === 'termin').length;
    const melden = (S.kunden || []).filter((k) => !k.abgelegt && k.naechster_kontakt && k.naechster_kontakt <= h).length;
    const satz = heuteZahl ? `Heute ${heuteZahl === 1 ? 'steht ein Termin' : `stehen ${heuteZahl} Termine`} an${melden ? `, und ${melden === 1 ? 'eine Person wartet' : `${melden} Personen warten`} auf deinen Anruf` : ''}.`
      : melden ? `Heute ${melden === 1 ? 'wartet eine Person' : `warten ${melden} Personen`} auf deinen Anruf.` : 'Heute ist nichts eingetragen.';
    const planHtml = plan(alle, 14, 6);
    const sichtbar = hatTermine();
    box.innerHTML = `<div class="start">
      <div>
        <header class="gruss"><p class="kicker">${tagName(h)}</p><h1>${gruss()}, ${esc(S.p.vorname)}.</h1><p>${satz}</p></header>
        ${sichtbar ? woche() : ''}
        <div class="plan">
          <div class="abschnitt-kopf"><h2>Deine nächsten Termine</h2><a href="#termine">Alle Termine</a></div>
          ${planHtml || `<div class="heute-leer"><h2>Die nächsten Tage sind frei.</h2><p>Trag deinen nächsten Termin ein. Er landet automatisch im Kalender auf deinem Handy.</p>
            <div class="knoepfe"><a class="knopf" href="#termine/neu">${ico('plus')} Termin eintragen</a></div></div>`}
        </div>
        <section class="abschnitt">
          <div class="abschnitt-kopf"><h2>Deine Werkzeuge</h2><a href="#werkzeuge">Alle Werkzeuge</a></div>
          <div class="kacheln drei">
            ${kachel('#werkzeuge/seite', '../bilder/flyer/klein/frau-kueche.jpg', '1 Ins Gespräch kommen', 'Deine Wasser-Check-Seite', 'Schick sie Interessenten. Wer anfragt, landet bei deinen Kunden.', 'Seite ansehen')}
            ${kachel('#flyer', '../bilder/flyer/klein/karaffe.jpg', '2 Einladen', 'Flyer erstellen', 'Einladung für deinen Infoabend in zwei Minuten.', 'Flyer erstellen')}
            ${kachel('#werkzeuge/bestellen', '../bilder/flyer/klein/flasche.jpg', '3 Abschließen', 'Dein Bestell-Link', 'Wer darüber bestellt, wird dir zugeordnet.', 'Link holen')}
          </div>
        </section>
      </div>
      <aside class="seite-spalte" aria-label="Kalender und Neuigkeiten">
        ${sichtbar ? `<div class="monat" id="monat"></div>` : ''}
        <section class="kasten-dunkel"><p class="kicker">Neuigkeiten von Daniel und Jasmin</p>
          ${news.length ? news.slice(0, 3).map(neuigkeit).join('') : '<p class="neuigkeit">Noch keine Neuigkeiten.</p>'}
          ${news.length > 3 ? '<p style="margin-top:var(--a-2)"><a href="#neuigkeiten">Alle Neuigkeiten</a></p>' : ''}</section>
        ${istApp() ? '' : `<a class="kachel" href="#app"><div class="text"><p class="nr">Tipp</p><h3>Das Portal als App aufs Handy</h3><p>Ein Tipp auf dem Startbildschirm, ganz ohne App Store.</p><span class="weiter">So geht's</span></div></a>`}
      </aside></div>`;
    if (sichtbar) monat(document.getElementById('monat'), { klick: (t) => (location.hash = 'termine/' + t) });
  }
  // Wochenleiste für Handy und Tablet: die nächsten 7 Tage mit Punkten, oben auf der Startseite
  function woche() {
    const alle = eintraege(), h = heute();
    return `<nav class="woche" aria-label="Die nächsten 7 Tage">${[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const t = plusTage(h, i), d = new Date(t + 'T12:00'), auf = alle.filter((e) => e.tag === t || (i === 0 && e.typ === 'melden' && e.tag < h));
      return `<a href="#termine/${t}"${i === 0 ? ' aria-current="date"' : ''}><small>${['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()]}</small><b>${d.getDate()}</b><i>${auf.slice(0, 3).map((e) => `<span class="${e.typ === 'melden' ? 'm' : ''}"></span>`).join('')}</i></a>`;
    }).join('')}</nav>`;
  }
  const kachel = (href, bild, nr, titel, text, weiter) => `<a class="kachel" href="${href}"><figure style="background-image:url('${bild}')"></figure>
    <div class="text"><p class="nr">${esc(nr)}</p><h3>${esc(titel)}</h3><p>${esc(text)}</p><span class="weiter">${esc(weiter)}</span></div></a>`;
  const neuigkeit = (n) => `<article class="neuigkeit${n.erstellt > neuAb() ? ' neu' : ''}"><small>${esc(n.von || 'Ursprungskraft')}, ${relativ(tagVon(n.erstellt)) || tagKurz(n.erstellt)}</small><p>${esc(n.text)}</p></article>`;
  const istApp = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

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
        <p class="legende"><span>Termin</span><span class="m">Wieder melden</span></p>${opt.fuss || ''}`;
      el.querySelectorAll('[data-schritt]').forEach((b) => (b.onclick = () => { const d = new Date(j, mo - 1 + Number(b.dataset.schritt), 1); m = d.toLocaleDateString('sv-SE').slice(0, 7); malen(); }));
      el.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => opt.klick && opt.klick(b.dataset.tag)));
      opt.danach && opt.danach(el);
    };
    malen();
  }

  // ================= TERMINE =================
  async function termine(box, rest, aktuell) {
    if (!frei('termine')) { box.innerHTML = kopf('Termine', 'Alle Termine und Rückrufe an einem Ort.') + gesperrt('termine'); return; }
    await Promise.all([termineLaden(), kundenLaden().catch(() => (S.kunden = []))]);
    if (!aktuell()) return;
    const tag = /^\d{4}-\d{2}-\d{2}$/.test(rest[0] || '') ? rest[0] : null;
    if (!hatTermine()) {
      box.innerHTML = `${kopf('Termine', 'Trag hier deine Termine ein. Sobald es Termine gibt, erscheint hier dein Kalender mit Monatsansicht.')}
        <div class="heute-leer"><h2>Noch keine Termine.</h2><p>Rückrufe, Termine vor Ort, Anrufe und Zoom. Jeder Termin landet auch im Kalender auf deinem Handy.</p>
        <div class="knoepfe"><button class="knopf" type="button" data-neu>${ico('plus')} Ersten Termin eintragen</button></div></div>`;
    } else {
      const alle = eintraege(), h = heute();
      const liste = tag ? alle.filter((e) => e.tag === tag) : null;
      box.innerHTML = `${kopf('Termine', '')}
        <div class="termine-aufbau">
          <div class="monat-spalte"><div class="monat" id="monat"></div></div>
          <div>
            <div class="abschnitt-kopf"><h2>${tag ? `${relativ(tag) ? relativ(tag) + ', ' : ''}${tagName(tag)}` : 'Die nächsten Wochen'}</h2>${tag ? '<a href="#termine">Alle kommenden</a>' : ''}</div>
            <div class="knoepfe" style="margin-bottom:var(--a-3)"><button class="knopf" type="button" data-neu>${ico('plus')} Termin eintragen</button></div>
            <div class="plan">${tag ? (liste.length ? `<section class="plan-tag" style="grid-template-columns:1fr"><div>${liste.map((e) => terminZeile(e) + (e.typ === 'termin' ? `<p style="margin:-8px 0 var(--a-2) 0"><button class="knopf still" type="button" data-weg="${esc(e.t.id)}">Termin löschen</button></p>` : '')).join('')}</div></section>` : '<p class="leer">An diesem Tag ist nichts eingetragen.</p>')
              : (plan(alle, 60, 40) || '<p class="leer">In den nächsten Wochen ist nichts eingetragen.</p>')}</div>
            ${tag ? '' : `<details class="aufklappen"><summary>Vergangene Termine der letzten 30 Tage</summary>${alle.filter((e) => e.typ === 'termin' && e.tag < h).reverse().map((e) => `<p class="leise">${tagKurz(e.tag)}, ${uhr(e.t.beginn)} Uhr: ${esc(e.t.art)}${e.t.name ? ', ' + esc(e.t.name) : ''}</p>`).join('') || '<p class="leer">Keine.</p>'}</details>`}
          </div></div>`;
      monat(document.getElementById('monat'), {
        gewaehlt: tag, klick: (t) => (location.hash = 'termine/' + t),
        fuss: `<div class="abo"><b>Mit deinem Handykalender verbinden</b><p>Einmal verbinden, dann erscheint jeder Termin von selbst im Kalender auf deinem Handy. Gib den Link nicht weiter, sonst sieht jemand anders deine Termine.</p>
          <div class="knoepfe"><a class="knopf zweit" href="${esc(KALENDER.replace('https://', 'webcal://') + S.p.kalender)}">iPhone</a>
          <a class="knopf zweit" href="https://calendar.google.com/calendar/r?cid=${encodeURIComponent(KALENDER.replace('https://', 'webcal://') + S.p.kalender)}" target="_blank" rel="noopener">Google Kalender</a>
          <button class="knopf still" type="button" data-abo>${ico('kopie')} Link kopieren</button></div></div>`,
        danach: (el) => { el.querySelector('[data-abo]').onclick = () => kopieren(KALENDER + S.p.kalender, 'Kalender-Link kopiert.'); },
      });
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
  const kopf = (titel, vorspann, kicker = '') => `<header class="seitenkopf">${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}<h1>${esc(titel)}</h1>${vorspann ? `<p class="vorspann">${esc(vorspann)}</p>` : ''}</header>`;

  function terminBlatt(vor = {}) {
    const d = document.createElement('dialog'); d.className = 'blatt';
    const kunden = (S.kunden || []).filter((k) => !k.abgelegt && !String(k.id).startsWith('best-') && k.art !== 'lead');
    d.innerHTML = `<form method="dialog" novalidate>
      <div class="karte-kopf"><h2>Termin eintragen</h2><button class="knopf still" value="zu" aria-label="Schließen">${ico('zu')}</button></div>
      <p class="leise klein">Der Termin landet automatisch im Kalender auf deinem Handy, mit Erinnerung 30 Minuten vorher.</p>
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
  const K = { filter: 'alle', stufe: '', suche: '' };
  async function kunden(box, rest, aktuell) {
    if (!frei('kunden')) { box.innerHTML = kopf('Kunden', 'Alle deine Interessenten und Kunden an einem Ort.') + gesperrt('kunden'); return; }
    await Promise.all([kundenLaden(), termineLaden().catch(() => (S.termine = []))]);
    if (!aktuell()) return;
    const offen = rest[0] ? decodeURIComponent(rest[0]) : null;
    const schmal = !matchMedia('(min-width: 1024px)').matches;
    const l = S.kunden, h = heute();
    const faellig = (k) => !k.abgelegt && k.naechster_kontakt && k.naechster_kontakt <= h;
    const zaehl = (f) => l.filter((k) => !k.abgelegt && (f === 'alle' || k.stand === f)).length;
    const passt = (k) => (K.filter === 'abgelegt' ? k.abgelegt : !k.abgelegt && (K.filter === 'alle' || (K.filter === 'faellig' ? faellig(k) : k.stand === K.filter)))
      && (!K.stufe || k.stufe === K.stufe)
      && (!K.suche || [k.vorname, k.nachname, k.ort, k.telefon, k.email].join(' ').toLowerCase().includes(K.suche.toLowerCase()));
    const zeigenL = l.filter(passt).sort((a, b) => (faellig(b) - faellig(a)) || String(b.erstellt).localeCompare(String(a.erstellt)));
    const neuKnopf = `<button class="knopf" type="button" data-neu>${ico('plus')} Kunde eintragen</button>`;
    if (offen && schmal) {
      box.innerHTML = `<p style="margin-bottom:var(--a-2)"><a class="knopf still" href="#kunden">${ico('links')} Alle Kunden</a></p><div id="karte"></div>`;
    } else {
      box.innerHTML = `${kopf('Kunden', 'Alle, die über deine Seite angefragt oder über deinen Link bestellt haben, kommen von selbst hierher. Dazu alle, die du selbst einträgst. Nur du siehst sie.')}
        <div class="stufen" role="group" aria-label="Stand">${[['alle', 'Alle'], ...STAND].map(([w, t]) => `<button type="button" data-f="${w}" aria-pressed="${K.filter === w}"><b>${zaehl(w)}</b><span>${t}</span></button>`).join('')}</div>
        <div class="suchzeile"><input type="search" id="suche" placeholder="Name, Ort oder Telefon suchen" value="${esc(K.suche)}" aria-label="Kunden suchen">${neuKnopf}</div>
        <div class="chips" role="group" aria-label="Filter">
          <button type="button" data-f="faellig" aria-pressed="${K.filter === 'faellig'}">Heute melden ${l.filter(faellig).length}</button>
          ${STUFE.map(([w, t]) => `<button type="button" data-s="${w}" aria-pressed="${K.stufe === w}"><i class="${w}"></i>${t}</button>`).join('')}
          <button type="button" data-f="abgelegt" aria-pressed="${K.filter === 'abgelegt'}">Kein Interesse ${l.filter((k) => k.abgelegt).length}</button>
        </div>
        <div class="kunden-aufbau">
          <div class="liste" id="liste">${zeigenL.length ? zeigenL.map((k) => zeile(k, offen, faellig(k))).join('') : `<p class="leer" style="padding:var(--a-3) 0">${l.length ? 'Zu diesem Filter gibt es niemanden.' : 'Noch keine Kunden. Sobald jemand über deine Seite anfragt oder über deinen Link bestellt, steht er hier. Du kannst auch selbst jemanden eintragen.'}</p>`}</div>
          ${schmal ? '' : '<div class="karte-spalte" id="karte"></div>'}
        </div>`;
      box.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { K.filter = K.filter === b.dataset.f && b.dataset.f !== 'alle' ? 'alle' : b.dataset.f; zeigen(); }));
      box.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => { K.stufe = K.stufe === b.dataset.s ? '' : b.dataset.s; zeigen(); }));
      const s = document.getElementById('suche');
      s.oninput = () => {
        K.suche = s.value;
        document.getElementById('liste').innerHTML = l.filter(passt).map((k) => zeile(k, offen, faellig(k))).join('') || '<p class="leer" style="padding:var(--a-3) 0">Niemand gefunden.</p>';
      };
      box.querySelector('[data-neu]').onclick = () => kundeBlatt();
    }
    const karteEl = document.getElementById('karte');
    if (karteEl) {
      const k = l.find((x) => x.id === offen) || (!schmal && zeigenL[0]);
      if (k) karte(karteEl, k); else if (offen) karteEl.innerHTML = '<p class="leer">Diesen Kunden gibt es nicht mehr.</p>';
      else karteEl.innerHTML = `<div class="karte"><p class="leer">Wähl links jemanden aus.</p></div>`;
    }
    if (rest[0] === 'neu') kundeBlatt();
  }
  function zeile(k, offen, fall) {
    const b = (S.best || []).filter((x) => x.kunde_id === k.id).pop();
    const unter = [k.abgelegt ? 'Kein Interesse' : STAND_NAME[k.stand], k.quelle, k.ort].filter(Boolean).join(' · ');
    const rechts = fall ? `<span class="faellig">Heute melden</span>` : b ? esc(BESTELL[b.stand] || '') : k.naechster_kontakt ? 'Melden ' + tagKurz(k.naechster_kontakt).slice(0, 6) : '';
    return `<a class="zeile-kunde" href="#kunden/${encodeURIComponent(k.id)}"${k.id === offen ? ' aria-current="true"' : ''}>
      <span class="stufe-punkt ${esc(k.stufe || '')}" title="${esc(k.stufe ? 'Stufe ' + k.stufe : '')}"></span>
      <span><b>${esc(nameVon(k))}</b><small>${esc(unter)}</small></span><span class="rechts">${rechts}</span></a>`;
  }
  function karte(el, k) {
    const nurLesen = k.art === 'bestellung';
    const best = (S.best || []).filter((x) => x.kunde_id === k.id);
    const ter = (S.termine || []).filter((t) => t.kunde_id === k.id).sort((a, b) => a.beginn.localeCompare(b.beginn));
    const dd = (t, w) => (w ? `<div><dt>${t}</dt><dd>${w}</dd></div>` : '');
    const a = k.antworten || {};
    el.innerHTML = `<article class="karte">
      <div class="karte-kopf"><div><h2>${esc(nameVon(k))}</h2><p class="herkunft">${esc(k.quelle || '')}${k.erstellt ? ', seit ' + tagKurz(k.erstellt) : ''}${k.abgelegt ? ' · Kein Interesse' : ''}</p></div></div>
      <div class="schnell">
        <a href="${k.telefon ? 'tel:' + esc(tel(k.telefon)) : '#'}" aria-disabled="${!k.telefon}">${ico('telefon')}Anrufen</a>
        <a href="${k.telefon ? wa(k.telefon) : '#'}" target="_blank" rel="noopener" aria-disabled="${!k.telefon}">${ico('whatsapp')}WhatsApp</a>
        <a href="${k.email ? 'mailto:' + esc(k.email) : '#'}" aria-disabled="${!k.email}">${ico('mail')}E-Mail</a>
        <button type="button" data-termin aria-disabled="${nurLesen || k.art === 'lead'}">${ico('termine')}Termin</button>
      </div>
      ${nurLesen ? '<p class="hinweis klein" style="margin-bottom:var(--a-3)">Diese Bestellung ist noch keinem Kunden zugeordnet. Daniel ordnet sie im Dashboard zu, dann kannst du hier Notizen machen.</p>' : `
      <section><h3>Stand</h3><div class="wahl-stand">${STAND.map(([w, t]) => `<button type="button" data-stand="${w}" aria-pressed="${k.stand === w}">${t}</button>`).join('')}</div></section>
      <section><h3>Stufe</h3><div class="wahl-stand">${STUFE.map(([w, t]) => `<button type="button" data-stufe="${w}" aria-pressed="${k.stufe === w}"><i class="stufe-punkt ${w}"></i>${t}</button>`).join('')}</div></section>`}
      ${best.length ? `<section><h3>Bestellung</h3>${best.map((b) => {
        const i = ['bestellt', 'verschickt', 'da'].indexOf(b.stand);
        return `<div class="bestellung"><h4>${esc(b.geraete || 'Gerät')}<small>Nr. ${esc(b.nummer)}, bestellt am ${tagKurz(b.erstellt)}</small></h4>
          <ol class="schritte">${['bestellt', 'verschickt', 'da'].map((s, n) => `<li class="${n <= i ? 'erledigt' : ''}${n === i && n < 2 ? ' jetzt' : ''}"><b>${BESTELL[s]}</b>${n === 0 ? tagKurz(b.erstellt) : n === 2 && b.da_am ? tagKurz(b.da_am) : ''}</li>`).join('')}</ol></div>`;
      }).join('')}</section>` : k.geraet ? `<section><h3>Gerät</h3><p>${esc(k.geraet)}${k.kaufdatum ? ', gekauft am ' + tagKurz(k.kaufdatum) : ''}</p></section>` : ''}
      ${nurLesen ? '' : `<section><h3>Nächster Schritt</h3><form id="f-weiter" class="felder zwei" novalidate>
        <label class="feld"><span class="titel">Wieder melden am</span><input type="date" name="naechster_kontakt" value="${esc(k.naechster_kontakt || '')}"></label>
        <label class="feld"><span class="titel">So seid ihr verblieben</span><input name="verblieben" value="${esc(k.verblieben || '')}" placeholder="z. B. ruft Freitag zurück"></label>
        <label class="feld ganz"><span class="titel">Neue Notiz zum Gespräch</span><textarea name="notiz" rows="3" placeholder="Was wurde besprochen? Wird mit Datum gespeichert."></textarea></label>
        <div class="ganz knoepfe"><button class="knopf" type="submit">Speichern</button><span class="meldung"></span></div></form></section>`}
      ${ter.length ? `<section><h3>Termine</h3>${ter.map((t) => `<p>${tagKurz(t.beginn)}, ${uhr(t.beginn)} Uhr · ${esc(t.art)}${t.ort ? ' · ' + esc(t.ort) : ''}</p>`).join('')}</section>` : ''}
      ${k.notizen?.length ? `<section><h3>Notizen</h3><ul class="notizen">${k.notizen.map((n) => `<li><small>${tagKurz(n.erstellt)}</small><p>${esc(n.text)}</p></li>`).join('')}</ul></section>` : ''}
      <section><h3>Angaben</h3><dl class="angaben">
        ${dd('Telefon', k.telefon ? `<a href="tel:${esc(tel(k.telefon))}">${esc(k.telefon)}</a>` : '')}
        ${dd('E-Mail', k.email ? `<a href="mailto:${esc(k.email)}">${esc(k.email)}</a>` : '')}
        ${dd('Ort', esc(k.ort || ''))}${dd('Am besten erreichbar', esc(k.erreichbar || ''))}
        ${dd('Erster Kontakt', tagKurz(k.erstellt))}${dd('Zuletzt gesprochen', tagKurz(k.letzter_kontakt))}
        ${dd('Interesse', esc(a.interesse || ''))}${dd('Trinkt heute', esc(a.geraet || ''))}${dd('Gerät', esc(a.budget_text || ''))}
      </dl>
      ${nurLesen ? '' : `<div class="knoepfe" style="margin-top:var(--a-3)"><button class="knopf still" type="button" data-aendern>Angaben ändern</button>
        <button class="knopf still" type="button" data-ablegen>${k.abgelegt ? 'Wieder aufnehmen' : 'Kein Interesse, ablegen'}</button></div>`}</section>
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
    el.querySelectorAll('[data-stand]').forEach((b) => (b.onclick = () => speichern({ stand: b.dataset.stand }, `Stand: ${STAND_NAME[b.dataset.stand]}.`)));
    el.querySelectorAll('[data-stufe]').forEach((b) => (b.onclick = () => speichern({ stufe: k.stufe === b.dataset.stufe ? '' : b.dataset.stufe }, 'Stufe gespeichert.')));
    el.querySelector('[data-ablegen]').onclick = () => speichern({ abgelegt: !k.abgelegt }, k.abgelegt ? 'Wieder aufgenommen.' : 'Abgelegt unter "Kein Interesse".');
    el.querySelector('[data-aendern]').onclick = () => kundeBlatt(k, speichern);
    const t = el.querySelector('[data-termin]'); if (t) t.onclick = () => terminBlatt({ kunde_id: k.id });
    const f = el.querySelector('#f-weiter');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const w = Object.fromEntries(new FormData(f).entries());
      for (const x of Object.keys(w)) w[x] = String(w[x]).trim();
      f.querySelector('button').disabled = true;
      if (!(await speichern(w, 'Gespeichert.'))) f.querySelector('button').disabled = false;
    };
  }
  function kundeBlatt(k = null, speichern = null) {
    const d = document.createElement('dialog'); d.className = 'blatt';
    const feld = (n, t, typ = 'text', extra = '') => `<label class="feld"><span class="titel">${t}</span><input type="${typ}" name="${n}" value="${esc(k?.[n] || '')}" ${extra}></label>`;
    d.innerHTML = `<form method="dialog" novalidate>
      <div class="karte-kopf"><h2>${k ? 'Angaben ändern' : 'Kunde eintragen'}</h2><button class="knopf still" value="zu" aria-label="Schließen">${ico('zu')}</button></div>
      <div class="felder zwei">
        ${feld('vorname', 'Vorname <span class="pflicht">*</span>', 'text', 'required autocomplete="off"')}${feld('nachname', 'Nachname')}
        ${feld('telefon', 'Telefon', 'tel')}${feld('email', 'E-Mail-Adresse', 'email')}
        ${feld('ort', 'Ort')}${feld('erreichbar', 'Am besten erreichbar', 'text', 'placeholder="z. B. abends ab 18 Uhr"')}
        ${k ? '' : `<label class="feld"><span class="titel">Stand</span><select name="stand">${STAND.map(([w, t]) => `<option value="${w}">${t}</option>`).join('')}</select></label>
          <label class="feld"><span class="titel">Stufe</span><select name="stufe"><option value="">Noch offen</option>${STUFE.map(([w, t]) => `<option value="${w}">${t}</option>`).join('')}</select></label>
          ${feld('naechster_kontakt', 'Wieder melden am', 'date')}${feld('verblieben', 'So seid ihr verblieben')}
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

  // ================= WERKZEUGE =================
  // Reihenfolge nach Jasmin: erst womit man ins Gespräch kommt, dann Flyer, dann der Bestell-Link
  async function werkzeuge(box, rest) {
    const p = S.p, link = BESTELLSEITE + encodeURIComponent(p.kurz), seite = SEITE + encodeURIComponent(p.kurz);
    const sp = p.seite || {};
    box.innerHTML = `${kopf('Werkzeuge', 'In der Reihenfolge, in der du sie brauchst: erst ins Gespräch kommen, dann einladen, dann abschließen.')}
      <section class="werkzeug" id="seite">
        <figure style="background-image:url('../bilder/flyer/frau-kueche.jpg')"></figure>
        <div><p class="nr">1</p><h2>Deine Wasser-Check-Seite</h2>
          <p class="wozu">Eine fertige Seite rund ums Wasser, mit deinem Namen. Schick sie Interessenten per WhatsApp oder E-Mail.</p>
          <p>Wer darüber anfragt, landet automatisch bei deinen Kunden, und du bekommst Bescheid.</p>
          ${frei('seite') ? `<div class="linkfeld"><code>${esc(seite)}</code><button class="knopf still" type="button" data-kopie="${esc(seite)}">${ico('kopie')} Kopieren</button></div>
          <div class="knoepfe"><a class="knopf" href="${esc(seite)}" target="_blank" rel="noopener">${ico('auge')} Seite ansehen</a>
            <a class="knopf zweit" href="https://wa.me/?text=${encodeURIComponent('Schau mal, hier kannst du dein Wasser checken: ' + seite)}" target="_blank" rel="noopener">${ico('whatsapp')} Per WhatsApp teilen</a></div>
          <details class="aufklappen"${rest[0] === 'seite' ? ' open' : ''}><summary>So erreichen dich Interessenten: Seite einrichten</summary>
            <p class="leise" style="margin-bottom:var(--a-3)">Füll nur aus, was du möchtest. Für jede Angabe erscheint auf der Seite ein Knopf, zum Beispiel "WhatsApp schreiben". Leere Felder tauchen nicht auf.</p>
            <form id="f-seite" class="felder zwei" novalidate>
              <label class="feld ganz"><span class="titel">Ein Satz von dir</span><input name="text" maxlength="300" value="${esc(sp.text || '')}" placeholder="z. B. Ich zeige dir gern, was in deinem Wasser steckt."></label>
              <label class="feld"><span class="titel">WhatsApp-Nummer</span><input type="tel" name="whatsapp" value="${esc(sp.whatsapp || '')}" placeholder="+49 170 1234567"></label>
              <label class="feld"><span class="titel">Telefon zum Anrufen</span><input type="tel" name="telefon" value="${esc(sp.telefon || '')}"></label>
              <label class="feld"><span class="titel">E-Mail-Adresse</span><input type="email" name="email" value="${esc(sp.email || '')}"></label>
              <label class="feld"><span class="titel">Link zum Termin buchen</span><input type="url" name="termin" value="${esc(sp.termin || '')}" placeholder="https://calendly.com/dein-name"><small class="regel">Wenn du Calendly oder ein anderes Buchungsprogramm nutzt. Beginnt mit https://</small></label>
              <div class="ganz knoepfe"><button class="knopf" type="submit">Speichern</button><span class="meldung" id="seite-meldung"></span></div>
            </form></details>` : sperrHinweis('seite')}
        </div></section>

      <section class="werkzeug" id="flyer">
        <figure style="background-image:url('../bilder/flyer/karaffe.jpg')"></figure>
        <div><p class="nr">2</p><h2>Flyer für deine Einladung</h2>
          <p class="wozu">Lad zu deinem Infoabend oder zur Vorführung ein. Motiv aussuchen, Datum und Ort eintragen, fertig.</p>
          <p>Für WhatsApp-Status, Instagram, Facebook und zum Ausdrucken.</p>
          <div class="knoepfe">${frei('flyer') ? `<a class="knopf" href="#flyer">${ico('flyer')} Flyer erstellen</a>` : sperrHinweis('flyer')}</div></div></section>

      <section class="werkzeug" id="bestellen">
        <figure style="background-image:url('../bilder/flyer/flasche.jpg')"></figure>
        <div><p class="nr">3</p><h2>Dein persönlicher Bestell-Link</h2>
          <p class="wozu">Schick diesen Link deinen Kunden. Wer darüber bestellt, wird dir zugeordnet.</p>
          <p>Der Kauf läuft dann automatisch über deine Enagic-ID ${esc(p.enagic_id || '')}. Bisher kamen ${Number(p.bestellungen) || 0} Bestellungen über deinen Link.</p>
          <div class="linkfeld"><code>${esc(link)}</code><button class="knopf still" type="button" data-kopie="${esc(link)}">${ico('kopie')} Kopieren</button></div>
          <div class="qr-block"><div class="qr" id="qr">${qr(link)}</div>
            <div><p class="leise">Der QR-Code führt zum selben Link. Gut für Ausdrucke und Visitenkarten.</p>
            <div class="knoepfe" style="margin-top:var(--a-2)"><button class="knopf zweit" type="button" id="qr-laden">${ico('laden')} QR-Code speichern</button>
            <a class="knopf still" href="${esc(link)}" target="_blank" rel="noopener">Bestellseite ansehen</a></div></div></div>
          <h3 style="margin:var(--a-5) 0 var(--a-1)">Wer kümmert sich um die Bestellung?</h3>
          <p class="leise" style="margin-bottom:var(--a-2)">Der Vertrag läuft in jedem Fall über deine Enagic-ID. Du entscheidest nur, wer die Unterlagen an Enagic schickt.</p>
          <div class="wahl">
            <label><input type="radio" name="abwicklung" value="daniel" ${p.abwicklung !== 'selbst' ? 'checked' : ''}><span><b>Daniel organisiert alles</b><small>Die fertigen Unterlagen gehen an Daniel, er prüft sie und schickt sie an Enagic.</small></span></label>
            <label><input type="radio" name="abwicklung" value="selbst" ${p.abwicklung === 'selbst' ? 'checked' : ''}><span><b>Ich wickle selbst ab</b><small>Die fertigen Unterlagen kommen an ${esc(p.email)}, du schickst sie selbst an Enagic.</small></span></label>
          </div></div></section>

      ${p.tg_code ? `<section class="werkzeug" id="assistent">
        <figure style="background-image:url('../bilder/flyer/wasserhahn.jpg')"></figure>
        <div><p class="nr">4</p><h2>Dein Assistent in Telegram</h2>
          <p class="wozu">Damit du dranbleibst: Er meldet dir jede neue Anfrage sofort aufs Handy, mit Knöpfen wie "Angerufen" oder "In 2 Tagen melden".</p>
          <p>Er nimmt Termine per Chat an, die dann in deinem Kalender stehen, und schickt dir morgens, was heute ansteht.</p>
          ${!frei('assistent') ? `<div class="knoepfe">${sperrHinweis('assistent')}</div>` : `${p.tg_verbunden ? '<p class="verbunden" style="margin-top:var(--a-3)">Dein Assistent ist verbunden.</p>' : ''}
          ${p.assistent_bot ? `<div class="knoepfe"><a class="knopf" href="https://t.me/${esc(p.assistent_bot)}?start=${esc(p.tg_code)}" target="_blank" rel="noopener">${p.tg_verbunden ? 'Assistent öffnen' : 'Assistent verbinden'}</a></div>
          ${p.tg_verbunden ? '' : '<p class="leise klein" style="margin-top:var(--a-2)">Tippe auf den Knopf. Telegram öffnet sich, dann tippst du dort auf "Starten". Fertig.</p>'}` : '<p class="leer" style="margin-top:var(--a-3)">Der Assistent wird gerade eingerichtet. Der Knopf zum Verbinden erscheint hier in Kürze.</p>'}`}
        </div></section>` : ''}`;
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
      p.seite = w; m.className = 'meldung gut'; m.textContent = 'Gespeichert. Schau dir deine Seite gleich an.';
    };
    if (rest[0]) document.getElementById(rest[0])?.scrollIntoView({ block: 'start' });
  }
  const sperrHinweis = (b) => `<a class="knopf zweit" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Freischalten: ' + BEREICHE[b].name)}" style="margin-top:var(--a-3)">${ico('schloss')} Freischalten</a>`;

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
    box.innerHTML = `${kopf('Flyer erstellen', 'In vier Schritten zu deiner Einladung. Du siehst sofort, wie sie aussieht.')}
      <div class="flyer-aufbau">
        <form id="f-flyer" novalidate>
          <section class="schritt"><h2><span>1</span>Motiv aussuchen</h2><p>Tipp das Bild an, das zu deiner Einladung passt.</p>
            <div class="motive">${Object.entries(fotos).map(([k, f]) => `<button type="button" data-foto="${k}" aria-pressed="${d.foto === k}"><img src="${esc(f.klein)}" alt="" loading="lazy"><span>${esc(f.name)}</span></button>`).join('')}
              <label class="eigen"><input type="file" accept="image/*" id="eigen-foto" hidden><b>+</b><span>Eigenes Foto</span></label></div></section>
          <section class="schritt"><h2><span>2</span>Was steht drauf?</h2><p>Such dir eine Überschrift aus oder schreib eine eigene.</p>
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
          <section class="schritt"><h2><span>3</span>Formate und Farben</h2><p>Wähl, wo du den Flyer zeigen willst. Mehrere gehen auch.</p>
            <div class="formate">${Object.entries(Flyer.FORMATE).map(([k, f]) => `<button type="button" data-format="${k}" aria-pressed="${d.formate.includes(k)}"><i class="f-${k}"></i><span><b>${esc(f.name)}</b><small>${esc(f.zusatz)}</small></span></button>`).join('')}</div>
            <p class="feld" style="margin:var(--a-4) 0 var(--a-2)">Farben</p>
            <div class="farben">${Object.entries(Flyer.FARBEN).map(([k, f]) => `<button type="button" data-farbe="${k}" aria-pressed="${d.farbe === k}"><i style="background:${f.grund}"><i style="background:${f.akzent}"></i></i>${esc(f.name)}</button>`).join('')}</div></section>
        </form>
        <aside class="flyer-vorschau schritt" aria-label="Vorschau"><h2><span style="color:var(--gold-tief);margin-right:var(--a-1)">4</span>Ansehen und speichern</h2>
          <p>Tipp eine Vorschau an, um sie groß zu sehen.</p>
          <div class="vorschauen" id="vorschauen"></div>
          <button class="knopf breit" type="button" id="flyer-laden" style="margin-top:var(--a-3)"></button>
          <p class="leise klein" style="margin-top:var(--a-1)">${TG ? 'Die Bilder kommen als Datei in deinen Chat mit dem Assistenten.' : 'Die Bilder landen in deinem Download-Ordner, auf dem Handy in deinen Fotos oder Dateien.'}</p>
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
      vb.innerHTML = d.formate.length ? '' : '<p class="leer">Wähl in Schritt 3 mindestens ein Format.</p>';
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
    box.innerHTML = `${kopf('Neuigkeiten', 'Was Daniel und Jasmin dir mitteilen. Wenn dein Telegram-Assistent verbunden ist, kommt jede Neuigkeit auch dorthin.')}
      <div style="max-width:var(--b-610)">${n.length ? n.map((x) => `<article class="neuigkeit${x.erstellt > neuAb() ? ' neu' : ''}" style="border-color:var(--sand)"><small style="color:var(--grau)">${esc(x.von || 'Ursprungskraft')}, ${tagName(tagVon(x.erstellt))}</small><p style="font-size:var(--t-2);line-height:var(--zh-klein)">${esc(x.text)}</p></article>`).join('') : '<p class="leer">Noch keine Neuigkeiten.</p>'}</div>`;
    gelesen();
  }

  // ================= MEHR FÜR DEIN GESCHÄFT =================
  const ANGEBOTE = [
    { titel: 'Deine eigene Landingpage', bild: '../bilder/flyer/frau-kueche.jpg', kicker: 'Mehr Anfragen',
      nutzen: 'Eine Seite nur für dich, mit deinem Foto und deiner Geschichte. Interessenten landen direkt bei dir.',
      punkte: ['Dein Foto, deine Worte, deine Kontaktknöpfe', 'Jede Anfrage kommt automatisch in deine Kunden', 'Wir richten sie ein und halten sie aktuell'] },
    { titel: 'Broschüren für deine Kunden', bild: '../bilder/flyer/karaffe.jpg', kicker: 'Etwas in der Hand',
      nutzen: 'Die gedruckte Broschüre zum Dalassen nach dem Gespräch. Auf Wunsch mit deinem persönlichen QR-Code.',
      punkte: ['Gedruckt, neutral oder mit deinem QR-Code', 'Dazu die digitale Fassung zum Verschicken', 'Wer den Code scannt, landet bei dir'] },
    { titel: 'E-Books zum Verschenken', bild: '../bilder/flyer/glas-tropfen.jpg', kicker: 'Ins Gespräch kommen',
      nutzen: 'Ein kleines E-Book als Geschenk für Interessenten. Wer es holt, steht danach bei deinen Kunden.',
      punkte: ['Fertig gestaltet, mit deinem Namen', 'Abholen über deine Seite', 'Du siehst, wer es geholt hat'] },
    { titel: 'Dein Telegram-Assistent', bild: '../bilder/flyer/wasserhahn.jpg', kicker: 'Nichts mehr vergessen',
      nutzen: 'Er meldet dir jede Anfrage sofort aufs Handy und erinnert dich morgens an alles, was heute ansteht.',
      punkte: ['Neue Anfragen sofort, mit Knöpfen zum Abhaken', 'Termine per Chat eintragen', 'Flyer direkt im Chat erstellen'] },
  ];
  function mehr(box) {
    box.innerHTML = `${kopf('Mehr für dein Geschäft', 'Pakete, mit denen du mehr Interessenten erreichst und weniger Zeit brauchst.')}
      <div class="angebote">${ANGEBOTE.map((a) => `<article class="angebot"><figure style="background-image:url('${a.bild}')"><span class="kicker">${esc(a.kicker)}</span></figure>
        <div class="text"><h2>${esc(a.titel)}</h2><p class="nutzen">${esc(a.nutzen)}</p><ul>${a.punkte.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <div class="preis"><div><small>Was kostet es?</small><b>[Preis folgt]</b></div>
        <a class="knopf" href="mailto:${KONTAKT}?subject=${encodeURIComponent('Interesse: ' + a.titel)}&body=${encodeURIComponent(`Hallo Daniel und Jasmin,\n\nich interessiere mich für "${a.titel}".\n\n${nameVon(S.p)}`)}">Interesse melden</a></div></div></article>`).join('')}</div>`;
  }

  // ================= APP AUFS HANDY =================
  function app(box) {
    box.innerHTML = `${kopf('Das Portal als App', 'Mit einem Tipp auf dem Startbildschirm, ganz ohne App Store. Es sieht dann aus und fühlt sich an wie jede andere App.')}
      <div class="app-demo">
        <div class="handys" aria-label="So sieht das Portal auf dem Handy aus">
          <figure class="handy iphone"><div class="schirm" style="background-image:url('bilder/portal-handy-start.jpg')"></div><figcaption>iPhone</figcaption></figure>
          <figure class="handy android"><div class="schirm" style="background-image:url('bilder/portal-handy-kunden.jpg')"></div><figcaption>Android</figcaption></figure>
        </div>
        <div class="anleitung">
          ${istApp() ? '<p class="verbunden">Du nutzt das Portal schon als App.</p>' : ''}
          <div class="app-symbol"><img src="symbol/apple-touch-icon.png" alt="App-Symbol Partner"><span><b>Partner</b><br><span class="leise klein">So heißt die App auf deinem Startbildschirm.</span></span></div>
          <h3>iPhone</h3>
          <ol><li>Öffne diese Seite in Safari.</li><li>Tipp unten auf Teilen, das Kästchen mit dem Pfeil nach oben.</li><li>Tipp auf "Zum Home-Bildschirm" und dann auf "Hinzufügen".</li></ol>
          <h3>Android</h3>
          <ol><li>Öffne diese Seite in Chrome.</li><li>Tipp oben rechts auf die drei Punkte.</li><li>Tipp auf "App installieren" oder "Zum Startbildschirm hinzufügen".</li></ol>
        </div>
      </div>`;
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
    const s = sitzung.lesen();
    if (!s) return zugang(location.hash === '#registrieren' ? 'registrieren' : 'anmelden');
    const { data, error } = await rpc('uk_partner_daten', { p_sitzung: s });
    if (error) return zugang('anmelden', 'Das hat nicht geklappt. Bitte lade die Seite neu.');
    if (!data) { sitzung.setzen(null); return zugang(); }
    S.p = data;
    rahmen();
    newsLaden().then(() => markieren((location.hash.slice(1) || 'start').split('/')[0]));
    zeigen();
  }
  laden();
})();

// Backoffice für Partner: Grundlage für alle Gruppen (Sportler, später Heilpraktiker, Osteopathen).
// Inhalt aus window.BO_KONFIG (konfig-*.js), Daten aus window.BO_QUELLE (quelle-vorschau.js oder quelle-supabase.js).
// Diese Datei enthält keine gruppenspezifischen Texte.

(() => {
  const K = window.BO_KONFIG, Q = window.BO_QUELLE, T = K.texte;
  const $ = (s, w = document) => w.querySelector(s);
  const $$ = (s, w = document) => [...w.querySelectorAll(s)];
  const esc = (x) => String(x ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tagIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const mittag = (d = new Date()) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
  const passt = (a, wenn) => !wenn || Object.entries(wenn).every(([k, v]) => a[k] === v);
  const mailOk = (x) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(x || '').trim());

  let alle = [], filterNr = 0, allesZeigen = false, zeitraum = 'tage', partner = null;

  // ---------- Texte und Farben ----------
  document.title = T.seitentitel;
  $$('[data-t]').forEach((el) => { const t = T[el.dataset.t]; if (typeof t === 'string') el.textContent = t; });
  K.kennzahlen.forEach((k, i) => { $(`#k${i}-text`).textContent = k.text; });
  $('#filter').innerHTML = K.filter.map((f, i) => `<button type="button" data-nr="${i}" aria-pressed="${i === 0}">${esc(f.text)}</button>`).join('');

  function farben(f) {
    const s = document.body.style, g = { ...K.standardFarben, ...(f || {}) };
    s.setProperty('--ak', g.akzent); s.setProperty('--ak-knopf', g.knopf); s.setProperty('--ak-auf', g.aufKnopf);
    s.setProperty('--ak-d', g.aufDunkel); s.setProperty('--ak-h', g.aufHell);
  }
  farben();

  // ---------- Ansichten ----------
  function zeige(id) {
    ['anmeldung', 'app', 'laden', 'fehler-laden'].forEach((x) => { $('#' + x).hidden = x !== id; });
  }
  function formular(name) {
    ['login', 'vergessen', 'passwort'].forEach((x) => { $('#f-' + x).hidden = x !== name; });
    $$('#anmeldung .fehler').forEach((f) => { f.textContent = ''; });
    const erstes = $(`#f-${name} input`); if (erstes) setTimeout(() => erstes.focus(), 50);
  }
  $$('[data-zu]').forEach((b) => b.addEventListener('click', () => formular(b.dataset.zu)));

  // ---------- Start ----------
  async function start() {
    if (Q.vorschau) {
      $('#hinweis-demo').textContent = T.vorschau; $('#hinweis-demo').hidden = false;
      $('#demo-wahl').hidden = false;
      $('#demo-knoepfe').innerHTML = Object.entries(K.partner).map(([kurz, p]) => `<button class="knopf rahmen" type="button" data-wer="${esc(kurz)}">${esc(p.name)}</button>`).join('');
      $$('[data-wer]').forEach((b) => b.addEventListener('click', async () => { await Q.alsPartner(b.dataset.wer); history.replaceState(null, '', '?wer=' + b.dataset.wer); oeffnen({ kurz: b.dataset.wer }); }));
    }
    const art = await Q.linkArt();
    if (art) { $('#passwort-titel').textContent = art === 'einladung' ? T.einladungTitel : T.neuesPasswortTitel;
      $('#passwort-text').textContent = art === 'einladung' ? `${T.einladungText} ${T.neuesPasswortText}` : T.neuesPasswortText; zeige('anmeldung'); formular('passwort'); return; }
    const wer = Q.vorschau && new URLSearchParams(location.search).get('wer');
    if (wer && K.partner[wer]) { await Q.alsPartner(wer); return oeffnen({ kurz: wer }); }
    zeige('laden');
    try { const s = await Q.sitzung(); if (s) return oeffnen(s); } catch (e) { /* weiter zur Anmeldung */ }
    zeige('anmeldung'); formular('login');
  }

  async function oeffnen(profil) {
    partner = K.partner[profil.kurz] || { name: profil.name || '', rolle: '', foto: '', seite: '' };
    farben(partner.farben);
    $('#kopf-name').textContent = partner.name;
    $('#kopf-rolle').textContent = partner.rolle;
    $('#seite-foto').src = partner.foto || '';
    $('#seite-foto').style.objectPosition = partner.fotoPosition || '50% 20%';
    $('.f-seite').hidden = !partner.seite;
    $('#seite-link').href = partner.seite || '#';
    $('#dock-seite').href = partner.seite || '#';
    $('#dock-seite').hidden = !partner.seite;
    document.title = `${T.seitentitel} · ${partner.name}`;
    zeige('laden');
    try { alle = (await Q.anmeldungen()) || []; } catch (e) { zeige('fehler-laden'); return; }
    alle.sort((a, b) => String(b.datum).localeCompare(String(a.datum)));
    filterNr = 0; allesZeigen = false;
    zeige('app');
    zahlen(); verlauf(); liste();
  }
  $('#nochmal').addEventListener('click', () => start());

  // ---------- Zahlen ----------
  function zahlen() {
    const vor7 = mittag(); vor7.setDate(vor7.getDate() - 6);
    const neu = alle.filter((a) => a.datum >= tagIso(vor7)).length;
    $('#z-gesamt').textContent = alle.length.toLocaleString('de-DE');
    $('#z-woche').innerHTML = T.neueWoche(neu);
    $('#z-stand').textContent = `Stand heute, ${new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    K.kennzahlen.forEach((k, i) => { $(`#k${i}`).textContent = alle.filter((a) => passt(a, k.wenn)).length.toLocaleString('de-DE'); });
  }

  // ---------- Verlauf: 7 Tage oder 12 Wochen, eine Reihe, aktueller Balken im Akzent ----------
  function montag(d) { const x = mittag(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  function kw(d) { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const t = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - t); const j = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - j) / 864e5 + 1) / 7); }
  function verlauf() {
    let punkte;
    if (zeitraum === 'tage') {
      punkte = Array.from({ length: 7 }, (_, i) => { const d = mittag(); d.setDate(d.getDate() - (6 - i)); const iso = tagIso(d);
        const n = alle.filter((a) => a.datum === iso).length;
        return { n, kurz: i === 6 ? 'Heute' : d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''),
          lang: `${d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}: ${n} ${n === 1 ? 'Anmeldung' : 'Anmeldungen'}` }; });
    } else {
      const m0 = montag(new Date());
      punkte = Array.from({ length: 12 }, (_, i) => { const von = new Date(m0); von.setDate(von.getDate() - 7 * (11 - i)); const bis = new Date(von); bis.setDate(bis.getDate() + 6);
        const n = alle.filter((a) => a.datum >= tagIso(von) && a.datum <= tagIso(bis)).length;
        const f = (d) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
        return { n, kurz: i === 11 ? 'Jetzt' : String(kw(von)), lang: `Woche ${kw(von)} (${f(von)} bis ${f(bis)}): ${n} ${n === 1 ? 'Anmeldung' : 'Anmeldungen'}` }; });
    }
    const max = Math.max(1, ...punkte.map((p) => p.n));
    const box = $('#balken');
    box.style.gridTemplateColumns = `repeat(${punkte.length},1fr)`;
    box.classList.toggle('viele', punkte.length > 7);
    box.setAttribute('aria-label', (zeitraum === 'tage' ? 'Anmeldungen der letzten 7 Tage: ' : 'Anmeldungen der letzten 12 Wochen: ') + punkte.map((p) => p.lang).join('; '));
    box.innerHTML = punkte.map((p, i) => `<div class="tag${i === punkte.length - 1 ? ' aktuell' : ''}" tabindex="0" data-text="${esc(p.lang)}">
      <b>${p.n || ''}</b><i style="height:${Math.max(4, Math.round((p.n / max) * 100))}%"></i><small>${esc(p.kurz)}</small></div>`).join('');
    const tip = $('#tooltip'), feld = box.parentElement;
    $$('.tag', box).forEach((t) => {
      const an = () => { tip.textContent = t.dataset.text; tip.hidden = false;
        const r = t.getBoundingClientRect(), f = feld.getBoundingClientRect();
        tip.style.left = Math.min(Math.max(8, r.left - f.left + r.width / 2 - tip.offsetWidth / 2), f.width - tip.offsetWidth - 8) + 'px';
        tip.style.top = Math.max(8, r.top - f.top - tip.offsetHeight + 8) + 'px'; };
      const aus = () => { tip.hidden = true; };
      t.addEventListener('mouseenter', an); t.addEventListener('focus', an); t.addEventListener('mouseleave', aus); t.addEventListener('blur', aus);
    });
  }
  $$('[data-zeitraum]').forEach((b) => b.addEventListener('click', () => {
    zeitraum = b.dataset.zeitraum;
    $$('[data-zeitraum]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    verlauf();
  }));

  // ---------- Liste ----------
  function liste() {
    const f = K.filter[filterNr];
    const treffer = alle.filter((a) => passt(a, f.wenn));
    const zeigen = allesZeigen ? treffer : treffer.slice(0, 12);
    const datum = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
    $('#zeilen').innerHTML = zeigen.length ? zeigen.map((a) => {
      const st = K.stand[a.stand] || { text: a.stand || '' };
      return `<tr>
        <td class="datum">${esc(datum(a.datum))}</td>
        <td class="name">${esc(a.vorname)}${a.initial ? ' ' + esc(a.initial) + '.' : ''}</td>
        <td class="ort">${esc([a.ort, a.land].filter(Boolean).join(', '))}</td>
        <td class="wunsch">${esc(K.wunsch[a.wunsch] || a.wunsch || '')}</td>
        <td class="stand"><span class="chip ${esc(st.art || '')}">${esc(st.text)}</span></td></tr>`;
    }).join('') : `<tr class="leer-zeile"><td colspan="5" class="leer">${esc(T.leer)}</td></tr>`;
    $('#mehr').hidden = allesZeigen || treffer.length <= 12;
    $('#mehr').textContent = `Alle ${treffer.length} zeigen`;
  }
  $('#filter').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    filterNr = Number(b.dataset.nr); allesZeigen = false;
    $$('#filter button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    liste();
  });
  $('#mehr').addEventListener('click', () => { allesZeigen = true; liste(); });

  // ---------- Formulare ----------
  const fehler = (form, text) => { $('.fehler', form).textContent = text; return false; };
  const sperren = (form, an) => { $$('button', form).forEach((b) => { b.disabled = an; }); };

  $('#f-login').addEventListener('submit', async (e) => {
    e.preventDefault(); const f = e.target, w = Object.fromEntries(new FormData(f));
    if (!mailOk(w.email)) return fehler(f, 'Bitte prüf deine E-Mail-Adresse.');
    if (!w.passwort) return fehler(f, 'Bitte gib dein Passwort ein.');
    fehler(f, ''); sperren(f, true);
    try { const p = await Q.anmelden(w.email.trim(), w.passwort); await oeffnen(p); } catch (err) { fehler(f, err.message); } finally { sperren(f, false); }
  });

  $('#f-vergessen').addEventListener('submit', async (e) => {
    e.preventDefault(); const f = e.target, w = Object.fromEntries(new FormData(f));
    if (!mailOk(w.email)) return fehler(f, 'Bitte prüf deine E-Mail-Adresse.');
    fehler(f, ''); sperren(f, true);
    try { await Q.passwortVergessen(w.email.trim()); $('.erfolg', f).hidden = false; } catch (err) { fehler(f, err.message); } finally { sperren(f, false); }
  });

  function passwortPruefen(f, w) {
    if (String(w.passwort || '').length < 10) return fehler(f, 'Bitte wähle mindestens 10 Zeichen.');
    if (w.passwort !== w.wiederholung) return fehler(f, 'Die beiden Passwörter sind nicht gleich.');
    return true;
  }
  $('#f-passwort').addEventListener('submit', async (e) => {
    e.preventDefault(); const f = e.target, w = Object.fromEntries(new FormData(f));
    if (!passwortPruefen(f, w)) return;
    fehler(f, ''); sperren(f, true);
    try { await Q.passwortSetzen(w.passwort); history.replaceState(null, '', location.pathname); const s = await Q.sitzung(); s ? oeffnen(s) : (zeige('anmeldung'), formular('login')); }
    catch (err) { fehler(f, err.message); } finally { sperren(f, false); }
  });

  const dialog = $('#d-passwort');
  $('#passwort-aendern').addEventListener('click', () => { const f = $('#f-aendern'); f.reset(); fehler(f, ''); $('.erfolg', f).hidden = true; dialog.showModal(); });
  $('#d-schliessen').addEventListener('click', () => dialog.close());
  $('#f-aendern').addEventListener('submit', async (e) => {
    e.preventDefault(); const f = e.target, w = Object.fromEntries(new FormData(f));
    if (!passwortPruefen(f, w)) return;
    fehler(f, ''); sperren(f, true);
    try { await Q.passwortSetzen(w.passwort); $('.erfolg', f).hidden = false; f.reset(); } catch (err) { fehler(f, err.message); } finally { sperren(f, false); }
  });

  $('#abmelden').addEventListener('click', async () => {
    await Q.abmelden(); partner = null; alle = [];
    history.replaceState(null, '', location.pathname); farben();
    zeige('anmeldung'); formular('login');
  });

  start();
})();

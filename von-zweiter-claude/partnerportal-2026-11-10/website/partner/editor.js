// Flyer-Editor (01.11.2026), nur für Jasmin. Pro Motiv und Format: Foto verschieben und zoomen, jedes Textfeld einzeln
// anfassen und ziehen, breiter ziehen, Schrift größer ziehen, fett, links/mittig/rechts, ausblenden.
// Speichern schreibt in uk_flyer_vorlagen (supabase/umbau-2026-11-01a-flyer-vorlagen.sql), das Partnerportal nimmt es sofort.
// Ohne gespeicherte Vorlage startet der Editor mit dem, was die Automatik setzen würde.
(function () {
  const sb = supabase.createClient('https://ngcbmpuqcqbelfoelwby.supabase.co', 'sb_publishable_XXX',
    { auth: { persistSession: true, detectSessionInUrl: false } });
  const app = document.getElementById('app');
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const U = Flyer.UEBERSCHRIFTEN;
  // Schriftleiter für 1080 Breite (reference/gestaltungsrichtlinien.md), für die Knöpfe minus und plus
  const LEITER = [24, 32, 41, 53, 67, 85, 108, 137, 175, 222];
  const BEISPIEL = { art: 'Einladung', datum: '2026-11-20', zeit: '19:00', ort: 'Café Sonne', adresse: 'Musterstraße 12, 20095 Hamburg', name: 'Anna Beispiel', telefon: '0170 123 45 67', email: '' };

  // ---------- Anmelden (gleiche Anmeldung wie das Dashboard) ----------
  async function start() {
    const { data } = await sb.auth.getSession();
    if (!data.session) return anmelden();
    const { data: admin } = await sb.rpc('uk_ist_admin');
    if (!admin) return anmelden('Dieser Zugang darf den Flyer-Editor nicht öffnen.');
    editor();
  }
  function anmelden(meldung) {
    app.innerHTML = `<form class="anmelden" id="f"><h1>Flyer-Editor</h1><p class="hilfe">Mit deinem Dashboard-Zugang anmelden.</p>
      <label>E-Mail-Adresse<input type="email" name="email" autocomplete="username" required></label>
      <label>Passwort<input type="password" name="pw" autocomplete="current-password" required></label>
      <button class="knopf haupt">Anmelden</button><p class="fehler" id="fehler">${esc(meldung || '')}</p></form>`;
    document.getElementById('f').onsubmit = async (e) => {
      e.preventDefault(); const f = e.target;
      const { error } = await sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.pw.value });
      if (error) { document.getElementById('fehler').textContent = 'E-Mail-Adresse oder Passwort stimmen nicht.'; return; }
      start();
    };
  }

  // ---------- Editor ----------
  async function editor() {
    const st = { motiv: 'frau-kueche', format: 'story', farbe: 'blau', ue: 0, auswahl: null, arbeit: {}, verlauf: {}, gespeichert: {}, aus: [] };
    const motive = Object.keys(Flyer.FOTOS);
    app.innerHTML = `<div class="editor">
      <aside class="seite">
        <h1>Flyer-Editor</h1>
        <div class="gruppe"><b>Format</b><div class="formate" id="formate">${Object.entries(Flyer.FORMATE).map(([k, f]) => `<button class="knopf" data-format="${k}">${esc(f.name)}<small data-stand="${k}"></small></button>`).join('')}</div></div>
        <div class="gruppe"><b>Überschrift zum Testen</b><select id="ue">${U.map(([t], i) => `<option value="${i}">${esc(t)}</option>`).join('')}</select>
          <p class="hilfe">Teste auch die längste ("Wasser, das putzt…"). Wird eine Überschrift länger, rutscht alles darunter automatisch mit.</p></div>
        <div class="gruppe"><b>Farbe</b><select id="farbe">${Object.entries(Flyer.FARBEN).map(([k, f]) => `<option value="${k}">${esc(f.name)}</option>`).join('')}</select></div>
        <div class="gruppe"><b>Motiv</b>
          <label class="haken"><input type="checkbox" id="ausblenden"> Für Partner ausblenden</label>
          <div class="motive" id="motive">${motive.map((k) => `<button data-motiv="${k}" title="${esc(Flyer.FOTOS[k].name)}"><img src="${esc(Flyer.FOTOS[k].klein)}" alt=""></button>`).join('')}</div></div>
        <p class="hilfe">Feld anklicken und ziehen. Rechter Punkt: breiter. Punkt unten rechts: Schrift größer. Pfeiltasten: fein schieben, mit Umschalttaste in großen Schritten. Aufs Foto klicken und ziehen: Ausschnitt verschieben.</p>
        <p class="hilfe"><a href="#" id="abmelden">Abmelden</a></p>
      </aside>
      <main class="arbeit">
        <div class="leiste" id="leiste"></div>
        <div class="buehne" id="buehne"><div class="rahmen" id="rahmen"><canvas id="cv"></canvas><div class="schwebe" id="schwebe"></div></div></div>
        <div class="unten">
          <button class="knopf" id="rueck">Rückgängig</button>
          <button class="knopf" id="automatik">Auf Automatik zurücksetzen</button>
          <button class="knopf haupt" id="speichern">Speichern</button>
          <span class="meldung" id="meldung"></span>
        </div>
      </main></div>`;
    const $ = (id) => document.getElementById(id);
    $('abmelden').onclick = async (e) => { e.preventDefault(); await sb.auth.signOut(); start(); };
    await Flyer.vorbereiten();
    const { data: liste } = await sb.rpc('uk_flyer_vorlagen_liste');
    Flyer.vorlagenSetzen(liste); st.aus = (liste && liste.aus) || [];
    for (const [m, fs] of Object.entries((liste && liste.vorlagen) || {})) for (const f of Object.keys(fs)) st.gespeichert[`${m}|${f}`] = true;

    const schluessel = () => `${st.motiv}|${st.format}`;
    const daten = () => ({ ...BEISPIEL, titel: U[st.ue][0], text: U[st.ue][1] });
    const kopie = (x) => JSON.parse(JSON.stringify(x));
    // Arbeitsstand: gespeicherte Vorlage oder Startwert aus der Automatik
    const L = () => {
      const k = schluessel();
      if (!st.arbeit[k]) st.arbeit[k] = { L: kopie(Flyer.vorlage(st.motiv, st.format) || Flyer.automatikVorlage(st.format, st.farbe, st.motiv, daten())), geaendert: false };
      return st.arbeit[k].L;
    };
    const merken = () => { const k = schluessel(); (st.verlauf[k] = st.verlauf[k] || []).push(kopie(L())); if (st.verlauf[k].length > 60) st.verlauf[k].shift(); };
    const geaendert = () => { st.arbeit[schluessel()].geaendert = true; };
    const melden = (t, art = '') => { const m = $('meldung'); m.textContent = t; m.className = 'meldung ' + art; };

    let sc = 1, rechtecke = {}, hilfslinien = [];
    function zeichnen() {
      const fm = Flyer.FORMATE[st.format], b = $('buehne');
      sc = Math.min((b.clientWidth - 40) / fm.w, (b.clientHeight - 40) / fm.h, 1);
      const cv = $('cv'), dpr = window.devicePixelRatio || 1;
      rechtecke = Flyer.zeichnen(cv, st.format, st.farbe, st.motiv, daten(), sc * dpr, { layout: L() }) || {};
      cv.style.width = fm.w * sc + 'px'; cv.style.height = fm.h * sc + 'px';
      $('rahmen').style.width = fm.w * sc + 'px'; $('rahmen').style.height = fm.h * sc + 'px';
      ueberlagerung(); leiste(); seite();
    }
    // Auswahlrahmen, Griffe und rosa Hilfslinien beim Einrasten
    function ueberlagerung() {
      const s = $('schwebe'); s.innerHTML = '';
      for (const h of hilfslinien) s.insertAdjacentHTML('beforeend', h.x != null
        ? `<div class="hilfslinie" style="left:${h.x * sc}px;top:0;width:1px;height:100%"></div>`
        : `<div class="hilfslinie" style="top:${h.y * sc}px;left:0;height:1px;width:100%"></div>`);
      // Ausgeblendete Felder bleiben als gepunkteter Rahmen sichtbar, damit man sie wieder einblenden kann
      for (const [k, x] of Object.entries(rechtecke)) if (x.aus && k !== st.auswahl)
        s.insertAdjacentHTML('beforeend', `<div class="auswahl" style="border-style:dotted;opacity:.6;left:${x.x * sc}px;top:${x.y * sc}px;width:${x.w * sc}px;height:${x.h * sc}px"></div>`);
      const r = rechtecke[st.auswahl]; if (!r) return;
      const text = st.auswahl in Flyer.FELDER;
      s.insertAdjacentHTML('beforeend', `<div class="auswahl${st.auswahl === 'bild' ? ' bild' : ''}" style="left:${r.x * sc}px;top:${r.y * sc}px;width:${r.w * sc}px;height:${r.h * sc}px">
        ${text || st.auswahl === 'linie' ? '<span class="griff links" data-griff="links"></span><span class="griff breite" data-griff="breite"></span>' : ''}
        ${text ? '<span class="griff ecke" data-griff="ecke"></span>' : ''}</div>`);
    }
    function leiste() {
      const l = $('leiste'), a = st.auswahl, Lx = L();
      const hell = `<button class="knopf" id="hell" aria-pressed="${!!Lx.hell}" title="Für dunkle Fotos">Helle Schrift</button>`;
      if (a in Flyer.FELDER) {
        const e = Lx.el[a], ausr = e.ausr || 'links', fett = e.fett ?? !!Flyer.FELDER[a].fett;
        l.innerHTML = `<span class="name">${esc(Flyer.FELDER[a].name)}</span>
          <span class="groesse"><button class="knopf" id="kleiner" title="Eine Stufe kleiner">−</button><input id="g" type="number" min="10" max="400" value="${Math.round(e.g)}"><button class="knopf" id="groesser" title="Eine Stufe größer">+</button></span>
          <button class="knopf" id="fett" aria-pressed="${fett}" style="font-weight:700">F</button>
          <span class="trenner"></span>
          ${['links', 'mitte', 'rechts'].map((x) => `<button class="knopf" data-ausr="${x}" aria-pressed="${ausr === x}">${{ links: 'Links', mitte: 'Mittig', rechts: 'Rechts' }[x]}</button>`).join('')}
          <span class="trenner"></span>
          <button class="knopf" id="weg" aria-pressed="${!!e.aus}">${e.aus ? 'Einblenden' : 'Ausblenden'}</button>
          <span class="trenner"></span>${hell}`;
        const groesse = (g) => { merken(); e.b = Math.round(e.b * 1); e.g = Math.max(10, Math.min(400, Math.round(g))); geaendert(); zeichnen(); };
        $('g').onchange = (ev) => groesse(+ev.target.value);
        $('kleiner').onclick = () => groesse([...LEITER].reverse().find((x) => x < e.g - 0.5) || e.g - 2);
        $('groesser').onclick = () => groesse(LEITER.find((x) => x > e.g + 0.5) || e.g + 2);
        $('fett').onclick = () => { merken(); e.fett = !fett; geaendert(); zeichnen(); };
        l.querySelectorAll('[data-ausr]').forEach((b) => (b.onclick = () => { merken(); e.ausr = b.dataset.ausr; geaendert(); zeichnen(); }));
        $('weg').onclick = () => { merken(); e.aus = !e.aus; geaendert(); zeichnen(); };
      } else if (a === 'linie') {
        l.innerHTML = `<span class="name">Linie</span><button class="knopf" id="weg">${Lx.linie.aus ? 'Einblenden' : 'Ausblenden'}</button><span class="trenner"></span>${hell}`;
        $('weg').onclick = () => { merken(); Lx.linie.aus = !Lx.linie.aus; geaendert(); zeichnen(); };
      } else if (a === 'bild') {
        const B = Lx.bild;
        l.innerHTML = `<span class="name">Foto</span><label>Zoom <input type="range" id="zoom" min="1" max="3" step="0.01" value="${B.zoom || 1}"></label>
          <button class="knopf" id="vollflaeche" aria-pressed="${B.x === 0 && B.y === 0 && B.w === Flyer.FORMATE[st.format].w && B.h === Flyer.FORMATE[st.format].h}">Foto über die ganze Fläche</button>
          <span class="trenner"></span>${hell}`;
        $('zoom').onpointerdown = () => merken();
        $('zoom').oninput = (ev) => { B.zoom = +ev.target.value; geaendert(); zeichnen(); };
        $('vollflaeche').onclick = () => { merken(); const fm = Flyer.FORMATE[st.format]; Object.assign(B, { x: 0, y: 0, w: fm.w, h: fm.h }); Lx.grund = false; geaendert(); zeichnen(); };
      } else l.innerHTML = `<span class="hilfe" style="margin:0">Klick auf ein Textfeld oder aufs Foto, um es zu bearbeiten.</span><span class="trenner"></span>${hell}`;
      $('hell').onclick = () => { merken(); Lx.hell = !Lx.hell; geaendert(); zeichnen(); };
      const k = schluessel(), a2 = st.arbeit[k];
      l.insertAdjacentHTML('beforeend', `<span class="status">${a2 && a2.geaendert ? 'Nicht gespeichert' : st.gespeichert[k] ? 'Gespeichert' : 'Automatik, noch nicht gespeichert'}</span>`);
    }
    function seite() {
      document.querySelectorAll('[data-format]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.format === st.format)));
      document.querySelectorAll('[data-stand]').forEach((x) => {
        const k = `${st.motiv}|${x.dataset.stand}`, a = st.arbeit[k];
        x.textContent = a && a.geaendert ? '●' : st.gespeichert[k] ? '✓' : '';
      });
      document.querySelectorAll('[data-motiv]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.motiv === st.motiv));
        const weg = st.aus.includes(b.dataset.motiv), da = b.querySelector('.weg');
        if (weg && !da) b.insertAdjacentHTML('beforeend', '<span class="weg">ausgeblendet</span>'); else if (!weg && da) da.remove();
      });
      $('ausblenden').checked = st.aus.includes(st.motiv);
      $('ue').value = String(st.ue); $('farbe').value = st.farbe;
    }

    // ---------- Ziehen ----------
    const punkt = (ev) => { const r = $('rahmen').getBoundingClientRect(); return { x: (ev.clientX - r.left) / sc, y: (ev.clientY - r.top) / sc }; };
    const drin = (p, r) => r && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    let zug = null;
    $('schwebe').onpointerdown = (ev) => {
      const p = punkt(ev), griff = ev.target.dataset && ev.target.dataset.griff;
      if (!griff) {
        const felder = [...Object.keys(Flyer.FELDER).filter((k) => rechtecke[k] && !rechtecke[k].leer).reverse(), 'linie'];
        st.auswahl = felder.find((k) => drin(p, rechtecke[k])) || (drin(p, rechtecke.bild) ? 'bild' : null);
      }
      if (!st.auswahl) { zeichnen(); return; }
      const Lx = L(), e = st.auswahl === 'bild' ? Lx.bild : st.auswahl === 'linie' ? Lx.linie : Lx.el[st.auswahl];
      zug = { start: p, alt: kopie(e), griff, vorher: kopie(Lx), bewegt: false };
      $('schwebe').setPointerCapture(ev.pointerId); $('schwebe').classList.add('ziehen');
      zeichnen();
    };
    $('schwebe').onpointermove = (ev) => {
      if (!zug) return;
      const p = punkt(ev), dx = p.x - zug.start.x, dy = p.y - zug.start.y, Lx = L(), fm = Flyer.FORMATE[st.format], a = zug.alt;
      if (!zug.bewegt && Math.abs(dx) + Math.abs(dy) < 2 / sc) return;
      zug.bewegt = true; hilfslinien = [];
      if (st.auswahl === 'bild') {
        const B = Lx.bild, img = Flyer.bild(st.motiv, st.format);
        if (img) {
          const k = Math.max(B.w / img.width, B.h / img.height) * Math.max(1, B.zoom || 1);
          const ueberW = img.width * k - B.w, ueberH = img.height * k - B.h;
          if (ueberW > 1) B.fx = Math.min(1, Math.max(0, a.fx - dx / ueberW));
          if (ueberH > 1) B.fy = Math.min(1, Math.max(0, a.fy - dy / ueberH));
        }
      } else {
        const e = st.auswahl === 'linie' ? Lx.linie : Lx.el[st.auswahl];
        if (!zug.griff) { e.x = a.x + dx; e.y = a.y + dy; einrasten(e, Lx, fm); }
        else if (zug.griff === 'breite') e.b = Math.max(60, a.b + dx);
        else if (zug.griff === 'links') { const b = Math.max(60, a.b - dx); e.x = a.x + a.b - b; e.b = b; einrasten(e, Lx, fm, true); }
        else if (zug.griff === 'ecke') { const f = Math.max(0.2, (a.b + dx) / a.b); e.b = a.b * f; e.g = Math.max(10, a.g * f); }
        e.x = Math.round(e.x); e.y = Math.round(e.y); e.b = Math.round(e.b); if (e.g) e.g = Math.round(e.g * 2) / 2;
      }
      zeichnen();
    };
    // Einrasten an Außenrand, Mitte und an den Kanten der anderen Felder (alle Blöcke auf derselben linken Kante)
    function einrasten(e, Lx, fm, nurLinks) {
      const rand = (fm.w > fm.h ? fm.h * 0.92 : fm.w) / 1080 * 96, fang = 8 / sc;
      const andere = [...Object.entries(Lx.el).filter(([k, o]) => o !== e).map(([, o]) => o), Lx.linie].filter((o) => o && o !== e);
      const xs = [rand, ...andere.map((o) => o.x)];
      for (const x of xs) if (Math.abs(e.x - x) < fang) { e.x = x; hilfslinien.push({ x }); return; }
      if (nurLinks) return;
      for (const x of [fm.w - rand, ...andere.map((o) => o.x + o.b)]) if (Math.abs(e.x + e.b - x) < fang) { e.x = x - e.b; hilfslinien.push({ x }); return; }
      if (Math.abs(e.x + e.b / 2 - fm.w / 2) < fang) { e.x = fm.w / 2 - e.b / 2; hilfslinien.push({ x: fm.w / 2 }); }
    }
    $('schwebe').onpointerup = () => {
      if (zug && zug.bewegt) { const k = schluessel(); (st.verlauf[k] = st.verlauf[k] || []).push(zug.vorher); geaendert(); }
      zug = null; hilfslinien = []; $('schwebe').classList.remove('ziehen'); zeichnen();
    };
    document.onkeydown = (ev) => {
      if (/input|select|textarea/i.test(ev.target.tagName)) return;
      if ((ev.metaKey || ev.ctrlKey) && ev.key === 'z') { ev.preventDefault(); return rueck(); }
      const a = st.auswahl, Lx = L(); if (!a) return;
      const schritt = ev.shiftKey ? 10 : 1, r = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[ev.key];
      if (!r) return;
      ev.preventDefault(); merken();
      if (a === 'bild') { const B = Lx.bild; B.fx = Math.min(1, Math.max(0, B.fx + r[0] * 0.01 * schritt)); B.fy = Math.min(1, Math.max(0, B.fy + r[1] * 0.01 * schritt)); }
      else { const e = a === 'linie' ? Lx.linie : Lx.el[a]; e.x += r[0] * schritt; e.y += r[1] * schritt; }
      geaendert(); zeichnen();
    };
    function rueck() {
      const v = st.verlauf[schluessel()]; if (!v || !v.length) return;
      st.arbeit[schluessel()].L = v.pop(); geaendert(); zeichnen();
    }

    // ---------- Seitenleiste und Knöpfe ----------
    const wechseln = async (aenderung) => { Object.assign(st, aenderung, { auswahl: null }); await Flyer.fotoLaden(st.motiv); zeichnen(); };
    document.querySelectorAll('[data-format]').forEach((b) => (b.onclick = () => wechseln({ format: b.dataset.format })));
    document.querySelectorAll('[data-motiv]').forEach((b) => (b.onclick = () => wechseln({ motiv: b.dataset.motiv })));
    $('ue').onchange = (ev) => { st.ue = +ev.target.value; zeichnen(); };
    $('farbe').onchange = (ev) => { st.farbe = ev.target.value; zeichnen(); };
    $('ausblenden').onchange = async (ev) => {
      const aus = ev.target.checked, { data: ok } = await sb.rpc('uk_flyer_motiv_schalten', { p_motiv: st.motiv, p_aus: aus });
      if (!ok) { ev.target.checked = !aus; return melden('Konnte nicht umschalten.', 'fehler'); }
      st.aus = aus ? [...st.aus, st.motiv] : st.aus.filter((m) => m !== st.motiv);
      melden(aus ? 'Motiv ist für Partner ausgeblendet.' : 'Motiv ist für Partner wieder sichtbar.', 'ok'); seite();
    };
    $('rueck').onclick = rueck;
    $('speichern').onclick = async () => {
      const Lx = kopie(L()), d = daten(), cv = document.createElement('canvas').getContext('2d');
      // Höhe jedes Feldes mit der gerade gewählten Überschrift merken: wird eine längere gewählt, rutscht alles darunter nach
      for (const [k, e] of Object.entries(Lx.el)) { const m = Flyer.feldMessen(cv, k, e, d); if (m.h) e.h = Math.round(m.h); }
      const { data: ok, error } = await sb.rpc('uk_flyer_vorlage_speichern', { p_motiv: st.motiv, p_format: st.format, p_layout: Lx });
      if (error || !ok) return melden('Speichern hat nicht geklappt.', 'fehler');
      st.arbeit[schluessel()].geaendert = false; st.gespeichert[schluessel()] = true;
      const { data: liste2 } = await sb.rpc('uk_flyer_vorlagen_liste'); Flyer.vorlagenSetzen(liste2);
      melden(`Gespeichert: ${Flyer.FOTOS[st.motiv].name}, ${Flyer.FORMATE[st.format].name}.`, 'ok'); zeichnen();
    };
    $('automatik').onclick = async () => {
      if (!confirm('Die Einstellung für dieses Format wird gelöscht und die Automatik setzt den Flyer wieder selbst. Weiter?')) return;
      if (st.gespeichert[schluessel()]) {
        const { data: ok } = await sb.rpc('uk_flyer_vorlage_speichern', { p_motiv: st.motiv, p_format: st.format, p_layout: null });
        if (!ok) return melden('Zurücksetzen hat nicht geklappt.', 'fehler');
        const { data: liste2 } = await sb.rpc('uk_flyer_vorlagen_liste'); Flyer.vorlagenSetzen(liste2);
      }
      delete st.gespeichert[schluessel()]; delete st.arbeit[schluessel()]; st.verlauf[schluessel()] = [];
      melden('Zurück auf Automatik.', 'ok'); st.auswahl = null; zeichnen();
    };
    window.onbeforeunload = () => (Object.values(st.arbeit).some((a) => a.geaendert) ? 'Nicht gespeichert' : undefined);
    window.onresize = () => zeichnen();
    await Flyer.fotoLaden(st.motiv);
    zeichnen();
  }

  start();
})();

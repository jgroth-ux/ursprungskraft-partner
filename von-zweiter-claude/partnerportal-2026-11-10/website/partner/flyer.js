// Flyer-Generator für Partner. Neu gebaut am 01.11.2026 nach Jasmins Freigabe des Beispiels
// (outputs/flyer-beispiel/beispiel-story-1.jpg): EIN Grunddesign, Foto über die ganze Fläche ohne Schleier,
// Text in der freien Fläche des Fotos. Abwechslung kommt über Überschriften, Motive und Farbpaletten.
// Kein Ursprungskraft-Branding, kein Grün, kein QR-Code, keine Gesundheitsversprechen in den Überschriften.
// Fotos: Jasmins ChatGPT-Bilder, Originale in reference/flyer-bilder/. Braucht die Schriften aus ../schriften/schriften.css.
window.Flyer = (function () {
  const FORMATE = {
    story: { name: 'Story', zusatz: 'WhatsApp-Status, Instagram', w: 1080, h: 1920 },
    beitrag: { name: 'Beitrag', zusatz: 'Instagram, Facebook', w: 1080, h: 1350 },
    banner: { name: 'Quer', zusatz: 'Facebook, E-Mail, Website', w: 1920, h: 1080 },
    a4: { name: 'A4', zusatz: 'zum Ausdrucken', w: 2480, h: 3508 },
  };
  // Farbpaletten: grund = Fläche neben dem Foto, titel/text = Schrift auf hellem Foto, akzent = kleine Zeile und Linie,
  // hell = Akzent auf dunklem Foto
  const FARBEN = {
    blau: { name: 'Wasserblau', grund: '#EAF4FA', titel: '#1D3A52', text: '#1D3A52', akzent: '#3A7CA5', hell: '#BFE4F7' },
    tuerkis: { name: 'Türkis', grund: '#E5F4F2', titel: '#0F3F43', text: '#173B3E', akzent: '#1E9A93', hell: '#B4EDE8' },
    sand: { name: 'Hellbeige', grund: '#F6F0E6', titel: '#2B3440', text: '#2D3540', akzent: '#B07A4A', hell: '#F3DEC4' },
    marine: { name: 'Nachtblau', grund: '#E6ECF3', titel: '#0E2440', text: '#14273D', akzent: '#1F5FA0', hell: '#D2E3F5' },
  };
  // Überschriften zur Auswahl (von Jasmin am 01.11.2026 freigegeben). Partner können auch eine eigene schreiben.
  const UEBERSCHRIFTEN = [
    ['Infoabend', 'Alles rund um dein Trinkwasser'],
    ['Ein Wasserhahn. Fünf Wasserarten.', 'Zum Trinken, Kochen, Putzen und Pflegen. Live erleben.'],
    ['Dein Leitungswasser kann mehr.', 'Gefiltert, basisch, mit Wasserstoff. Wir zeigen dir, wie.'],
    ['Von pH 2,5 bis 11,5 aus einem Gerät.', 'Sieh live, wie aus Leitungswasser fünf Wasserarten werden.'],
    ['Wasser, das putzt. Wasser, das pflegt. Wasser zum Trinken.', 'Alles aus einem Gerät, live vorgeführt.'],
    ['Wasser mit Wasserstoff.', 'Frisch aus deinem Hahn. Komm vorbei und probier es selbst.'],
    ['Nie wieder Wasserkisten schleppen.', 'Frisch gefiltertes Trinkwasser direkt aus deiner Küche.'],
    ['Japanische Wassertechnik zum Anfassen.', 'Erleb, wie aus Leitungswasser fünf Wasserarten werden.'],
    ['Kaffee, wie er schmecken soll.', 'Erleb, was gutes Wasser in deiner Tasse ausmacht.'],
  ];
  // Motive, ausgemessen am 01.11.2026 mit Rasterlinien. Alle Flächen in Anteilen des Bildes [x0, x1, y0, y1].
  // frei = Fläche für Überschrift (und, ohne info, für alles); info = eigene Fläche für Datum, Ort und Kontakt (zweiteilig);
  // Text steht immer linksbündig am Außenrand (Gestaltungsrichtlinien: alle Blöcke auf derselben linken Kante, nie zentriert); unten = Text am unteren Rand der Fläche; dunkel = helle Schrift nötig;
  // fy = welcher Teil beim Zuschneiden ins geteilte Querformat bleibt (0 oben, 1 unten).
  // quer = eigenes Querformat-Bild; querFrei = freie Fläche darin, sonst wird quer geteilt (Text links, Foto rechts).
  const FOTOS = {
    'frau-kueche': { name: 'Frau mit Glas', frei: [0, 1, 0, 0.44], fy: 0.75 },
    freunde: { name: 'Freunde', frei: [0, 1, 0, 0.48], fy: 0.7 },
    familie: { name: 'Familie', frei: [0, 1, 0, 0.44], fy: 0.75 },
    'zwei-glaeser': { name: 'Zwei Gläser', frei: [0, 1, 0, 0.58], fy: 0.75 },
    wasserhahn: { name: 'Wasserhahn', frei: [0, 1, 0, 0.37], fy: 0.7 },
    flasche: { name: 'Flasche füllen', frei: [0, 1, 0, 0.44], fy: 0.75 },
    karaffe: { name: 'Karaffe', frei: [0, 1, 0, 0.39], fy: 0.7 },
    'glas-tropfen': { name: 'Tropfen ins Glas', frei: [0, 1, 0, 0.53], fy: 0.7 },
    strudel: { name: 'Strudel im Glas', frei: [0, 1, 0, 0.38], fy: 0.6, quer: 'strudel-quer', querFrei: [0.5, 1, 0, 1] },
    krone: { name: 'Wasserkrone', frei: [0, 1, 0, 0.55], fy: 0.7, quer: 'krone-quer' },
    'splash-blau': { name: 'Splash Blau', frei: [0, 1, 0, 0.36], dunkel: true, fy: 0.6, quer: 'splash-blau-quer' },
    'splash-dunkel': { name: 'Splash Dunkel', frei: [0, 1, 0, 0.44], dunkel: true, fy: 0.6 },
    welle: { name: 'Welle', frei: [0, 0.85, 0, 0.31], info: [0, 0.58, 0.31, 0.62], fy: 0.6, quer: 'welle-quer', querFrei: [0, 0.62, 0, 0.72] },
    wasserwelle: { name: 'Wasserband', frei: [0, 1, 0, 0.3], info: [0, 1, 0.66, 1], fy: 0.5, quer: 'wasserwelle-quer' },
    wasserband: { name: 'Welle auf Beige', frei: [0, 0.46, 0, 0.66], fy: 0.4, quer: 'wasserband-quer' },
    perlen: { name: 'Wasserperlen', frei: [0, 0.9, 0.16, 0.7], fy: 0.5, quer: 'perlen-quer', querFrei: [0.25, 0.75, 0.16, 0.86] },
    unterwasser: { name: 'Unter Wasser', frei: [0, 1, 0.5, 1], dunkel: true, unten: true, fy: 0.4, quer: 'unterwasser-quer' },
  };
  for (const [k, f] of Object.entries(FOTOS)) { f.src = `../bilder/flyer/${k}.jpg`; f.klein = `../bilder/flyer/klein/${k}.jpg`; }
  const bilder = {};

  function bildLaden(key, src) {
    return new Promise((ok) => { const i = new Image(); i.onload = () => { bilder[key] = i; ok(i); }; i.onerror = () => ok(null); i.src = src; });
  }
  async function vorbereiten() {
    await Promise.all(['500 40px Jost', '400 40px Jost', '600 40px Jost', '700 40px Jost', '400 20px Inter', '600 20px Inter', '700 20px Inter'].map((x) => document.fonts.load(x)));
  }
  // Fotos erst laden, wenn sie gebraucht werden (26 große Bilder auf einmal wären zu viel fürs Handy)
  async function fotoLaden(key) {
    const f = FOTOS[key]; if (!f) return;
    await Promise.all([bilder[key] || bildLaden(key, f.src), f.quer && (bilder[f.quer] || bildLaden(f.quer, `../bilder/flyer/${f.quer}.jpg`))]);
  }
  // Eigenes Foto des Partners, bleibt nur im Browser
  function eigenesFoto(datei) { return bildLaden('eigen', URL.createObjectURL(datei)); }

  const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  function wann(d) {
    const z = d.zeit ? `${d.zeit} Uhr` : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.datum || '')) return z;
    const x = new Date(d.datum + 'T12:00');
    return [`${TAGE[x.getDay()]}, ${x.getDate()}. ${MONATE[x.getMonth()]}`, z].filter(Boolean).join(', ');
  }

  // ---------- Text ----------
  function schrift(c, art, g) { c.font = { titel: `500 ${g}px Jost`, zeile: `400 ${g}px Jost`, text: `400 ${g}px Inter`, fett: `600 ${g}px Inter` }[art]; }
  function umbrechen(c, text, breite) {
    const zeilen = [];
    for (const absatz of String(text || '').split('\n')) {
      let z = '';
      for (const wort of absatz.split(/\s+/).filter(Boolean)) {
        const probe = z ? z + ' ' + wort : wort;
        if (c.measureText(probe).width <= breite || !z) z = probe; else { zeilen.push(z); z = wort; }
      }
      if (z) zeilen.push(z);
    }
    return zeilen;
  }
  // Ein Textblock misst sich selbst und zeichnet sich. sp = Sperrung in em, gross = Großbuchstaben
  function block(art, text, g, farbe, opt = {}) {
    if (opt.gross) text = String(text || '').toLocaleUpperCase('de-DE');
    return {
      key: opt.key, g, nach: opt.nach || 0,
      messen(c, breite) {
        if (!text) return 0;
        schrift(c, art, g); c.letterSpacing = (opt.sp || 0) * g + 'px';
        this.z = umbrechen(c, text, breite);
        this.breit = Math.max(...this.z.map((z) => c.measureText(z).width));
        c.letterSpacing = '0px';
        return this.z.length * g * (opt.lh || 1.3) + (opt.nach ?? 0);
      },
      zeichnen(c, x, y) {
        if (!text) return;
        schrift(c, art, g); c.fillStyle = farbe; c.textBaseline = 'top'; c.letterSpacing = (opt.sp || 0) * g + 'px';
        this.z.forEach((z, i) => c.fillText(z, x, y + i * g * (opt.lh || 1.3) + g * ((opt.lh || 1.3) - 1) / 2));
        c.letterSpacing = '0px';
      },
    };
  }
  function linie(farbe, staerke, laenge, vor, nach) {
    return { key: 'linie', messen: () => vor + staerke + nach, zeichnen(c, x, y) { c.fillStyle = farbe; c.fillRect(x, y + vor, laenge, staerke); protokoll && (protokoll.linie = { x, y: y + vor, b: laenge, d: staerke }); } };
  }
  const stapel = (c, teile, breite) => teile.reduce((s, t) => s + t.messen(c, breite), 0);
  // Beim automatischen Setzen wird mitgeschrieben, wo jedes Feld landet. Daraus macht der Editor seine Startvorlage.
  let protokoll = null;
  function stapelZeichnen(c, teile, x, y, breite) {
    for (const t of teile) {
      const h = t.messen(c, breite); t.zeichnen(c, x, y);
      if (protokoll && t.key && t.key !== 'linie' && h) protokoll[t.key] = { x, y, b: breite, g: t.g, h: h - (t.nach || 0) };
      y += h;
    }
    return y;
  }

  // Was auf dem Flyer steht, wie im freigegebenen Beispiel. Kopf = kleine Zeile, Überschrift, Unterzeile.
  // Angaben = Datum fett, darunter jede Angabe auf eigener Zeile (Ort, Straße, PLZ und Stadt, Name, Telefon), Jasmin 01.11.2026.
  // Größen aus der Schriftleiter (reference/gestaltungsrichtlinien.md, Faktor 1,272, für 1080 Breite mitskaliert),
  // Abstände aus der Fibonacci-Leiter (21, 34, 55, 89 mal 1,08)
  const LEITER = { kicker: 32, angaben: 41, zusatz: 53, lang: 108, kurz: 137 };
  const ABSTAND = { klein: 23, mittel: 37, gross: 59, block: 96 };
  function kopf(d, s, f) {
    const titel = d.titel || '', gross = titel.length <= 14 ? LEITER.kurz : LEITER.lang;
    return [
      block('fett', d.art, LEITER.kicker * s, f.akzent, { key: 'art', sp: 0.16, gross: true, lh: 1.4, nach: ABSTAND.klein * s }),
      block('titel', titel, gross * s, f.titel, { key: 'titel', lh: 1.04, sp: -0.02, nach: ABSTAND.mittel * s }),
      block('zeile', d.text, LEITER.zusatz * s, f.text, { key: 'text', lh: 1.3 }),
    ];
  }
  // Angaben einspaltig untereinander: Datum fett, Ort, Straße, PLZ und Stadt, Name, Telefon (Jasmin 01.11.2026: nie zwei Spalten)
  function angaben(d, s, f, mitLinie) {
    const zeilen = [d.ort, ...String(d.adresse || '').split(/\s*,\s*/), d.name, d.telefon, d.email].map((x) => (x || '').trim()).filter(Boolean).join('\n');
    const w = wann(d);
    if (!w && !zeilen) return [];
    return [
      linie(f.akzent, 4 * s, 120 * s, mitLinie ? ABSTAND.gross * s : 0, ABSTAND.mittel * s),
      block('fett', w, LEITER.angaben * s, f.text, { key: 'wann', lh: 1.4 }),
      block('text', zeilen, LEITER.angaben * s, f.text, { key: 'info', lh: 1.4 }),
    ];
  }
  // Größte Schrift, bei der die Teile in die Fläche passen
  function passend(c, bauen, s, breite, hoehe) {
    let t, h, g = 1;
    // Passt nur, wenn die Höhe reicht und kein einzelnes Wort breiter ist als die Fläche
    for (; g > 0.55; g -= 0.03) { t = bauen(s * g); h = stapel(c, t, breite); if (h <= hoehe && t.every((x) => !(x.breit > breite + 1))) return { t, h, g, ok: true }; }
    return { t, h, g, ok: false };
  }
  const allesBauen = (d, f) => (s) => [...kopf(d, s, f), ...angaben(d, s, f, true)];

  // ---------- Bild ----------
  // Füllt die Fläche ohne Verzerrung und gibt zurück, wohin ein Punkt des Bildes auf der Leinwand fällt
  function bildFuellen(c, img, x, y, w, h, fx = 0.5, fy = 0.5) {
    if (!img) { c.fillStyle = '#CFE3EF'; c.fillRect(x, y, w, h); return (px, py) => [x + px * w, y + py * h]; }
    const k = Math.max(w / img.width, h / img.height), sw = w / k, sh = h / k, sx = (img.width - sw) * fx, sy = (img.height - sh) * fy;
    c.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    return (px, py) => [x + (px * img.width - sx) * k, y + (py * img.height - sy) * k];
  }
  const begrenzt = (v, a, b) => Math.min(b, Math.max(a, v));

  // ---------- Grunddesign ----------
  // Foto ganzflächig, Text in der freien Fläche. Mit m.info zweiteilig: Überschrift oben, Angaben in der zweiten freien Fläche.
  // fy = null: Ausschnitt selbst suchen (bei Beitrag und A4 fällt oben oder unten etwas weg), genommen wird der,
  // bei dem die Schrift am größten bleibt, ohne aus der freien Fläche zu laufen.
  function vollbild(c, w, h, d, f, img, m, frei, fy) {
    const quer = w > h, s = (quer ? h * 0.92 : w) / 1080, p = (quer ? 84 : 96) * s, rand = h * (quer ? 0.1 : 0.078);
    const farben = m.dunkel ? { titel: '#FFFFFF', text: '#FFFFFF', akzent: f.hell } : f;
    const zwei = m.info && !quer;
    // Fläche des Bildes auf die Leinwand umrechnen, am Rand der Leinwand mehr Luft lassen
    const flaeche = (lage, r) => {
      const [ax, ay] = lage(r[0], r[2]), [bx, by] = lage(r[1], r[3]);
      const x0 = p, x1 = begrenzt(bx, 0, w) - p;
      const y0 = begrenzt(ay, 0, h) + (ay <= 1 ? rand : p * 0.5), y1 = begrenzt(by, 0, h) - (by >= h - 1 ? p * 1.2 : p * 0.5);
      return { x: x0, y: y0, b: Math.max(x1 - x0, w * 0.3), hh: Math.max(y1 - y0, h * 0.08) };
    };
    // Plan für einen Ausschnitt: Flächen, eingepasster Text, Bewertung
    const planen = (y) => {
      const k = img ? Math.max(w / img.width, h / img.height) : 1, sy = img ? (img.height - h / k) * y : 0;
      const lage = img ? (px, py) => [(px * img.width - (img.width - w / k) * 0.5) * k, (py * img.height - sy) * k] : (px, py) => [px * w, py * h];
      const r1 = flaeche(lage, frei);
      if (!zwei) { const a = passend(c, allesBauen(d, farben), s, r1.b, r1.hh); return { y, r1, a, wert: a.ok ? a.g : a.g - 1 }; }
      const a = passend(c, (g) => kopf(d, g, farben), s, r1.b, r1.hh);
      const r2 = flaeche(lage, m.info), ende = r1.y + a.h + 40 * s;
      if (r2.y < ende) { r2.hh -= ende - r2.y; r2.y = ende; }
      const b = passend(c, (g) => angaben(d, g, farben, false), s, r2.b, Math.max(r2.hh, 0));
      return { y, r1, a, r2, b, wert: Math.min(a.g, b.g) - (a.ok && b.ok && r2.hh > 0 ? 0 : 1) };
    };
    let plan = fy != null ? planen(fy) : null;
    if (!plan) for (let y = 0; y <= 1.001; y += 0.1) { const q = planen(y); if (!plan || q.wert > plan.wert + 0.001) plan = q; }
    bildFuellen(c, img, 0, 0, w, h, 0.5, plan.y);
    protokoll && (protokoll.bild = { x: 0, y: 0, w, h, fx: 0.5, fy: plan.y, zoom: 1 }, protokoll.hell = !!m.dunkel);
    if (m.dunkel) { c.save(); c.shadowColor = 'rgba(0,20,40,0.35)'; c.shadowBlur = 18 * s; }
    const setzen = (r, x, unten) => stapelZeichnen(c, x.t, r.x, unten ? r.y + r.hh - x.h : r.y, r.b);
    setzen(plan.r1, plan.a, !zwei && m.unten);
    if (zwei) setzen(plan.r2, plan.b, false);
    if (m.dunkel) c.restore();
  }
  // Geteilt: Text auf ruhiger Fläche, Foto daneben (quer) bzw. darüber (hoch). Für Querformat ohne freie Fläche und eigene Fotos.
  function geteilt(c, w, h, d, f, img, fx, fy) {
    const quer = w > h, s = (quer ? h * 0.92 : w) / 1080, p = (quer ? 84 : 96) * s;
    c.fillStyle = f.grund; c.fillRect(0, 0, w, h);
    if (quer) {
      const tb = w * 0.5, breite = tb - 2 * p;
      bildFuellen(c, img, tb, 0, w - tb, h, fx, fy);
      protokoll && (protokoll.bild = { x: tb, y: 0, w: w - tb, h, fx, fy, zoom: 1 }, protokoll.grund = true);
      const { t, h: th } = passend(c, allesBauen(d, f), s, breite, h - 2 * p);
      stapelZeichnen(c, t, p, (h - th) / 2, breite);
      return;
    }
    const breite = w - 2 * p, { t, h: th } = passend(c, allesBauen(d, f), s, breite, h * 0.5 - 2 * p);
    const bildH = h - th - 2 * p;
    bildFuellen(c, img, 0, 0, w, bildH, fx, fy);
    protokoll && (protokoll.bild = { x: 0, y: 0, w, h: bildH, fx, fy, zoom: 1 }, protokoll.grund = true);
    stapelZeichnen(c, t, p, bildH + p, breite);
  }

  // ---------- Vorlagen aus dem Editor (supabase/umbau-2026-11-01a-flyer-vorlagen.sql) ----------
  // layout = { bild: {x, y, w, h, fx, fy, zoom}, grund, hell, el: { art|titel|text|wann|info: {x, y, b, g, h, fett, ausr, aus} }, linie: {x, y, b, d, aus} }
  // Alle Werte in Pixeln der vollen Flyergröße. h = Höhe des Feldes beim Speichern: wird eine Überschrift länger, rutscht alles darunter nach.
  const FELDER = {
    art: { name: 'Kleine Zeile', schrift: 'Inter', gewicht: [600, 700], gross: true, sp: 0.16, lh: 1.4, farbe: 'akzent' },
    titel: { name: 'Überschrift', schrift: 'Jost', gewicht: [500, 700], sp: -0.02, lh: 1.04, farbe: 'titel' },
    text: { name: 'Unterzeile', schrift: 'Jost', gewicht: [400, 600], lh: 1.3, farbe: 'text' },
    wann: { name: 'Datum und Uhrzeit', schrift: 'Inter', gewicht: [400, 600], lh: 1.4, farbe: 'text', fett: true },
    info: { name: 'Ort und Kontakt', schrift: 'Inter', gewicht: [400, 600], lh: 1.4, farbe: 'text' },
  };
  const vorlagen = { daten: {}, aus: [] };
  function vorlagenSetzen(x) { vorlagen.daten = (x && x.vorlagen) || {}; vorlagen.aus = (x && x.aus) || []; }
  const vorlage = (foto, format) => (vorlagen.daten[foto] || {})[format] || null;
  const sichtbar = (foto) => !vorlagen.aus.includes(foto);
  function feldText(key, d) {
    if (key === 'art') return d.art || '';
    if (key === 'titel') return d.titel || '';
    if (key === 'text') return d.text || '';
    if (key === 'wann') return wann(d);
    return [d.ort, ...String(d.adresse || '').split(/\s*,\s*/), d.name, d.telefon, d.email].map((x) => (x || '').trim()).filter(Boolean).join('\n');
  }
  function feldSchrift(c, key, e) {
    const F = FELDER[key], fett = e.fett ?? !!F.fett;
    c.font = `${F.gewicht[fett ? 1 : 0]} ${e.g}px ${F.schrift}`; c.letterSpacing = (F.sp || 0) * e.g + 'px';
  }
  function feldMessen(c, key, e, d) {
    let t = feldText(key, d); if (FELDER[key].gross) t = t.toLocaleUpperCase('de-DE');
    if (!t) return { z: [], h: 0 };
    feldSchrift(c, key, e); const z = umbrechen(c, t, e.b); c.letterSpacing = '0px';
    return { z, h: z.length * e.g * FELDER[key].lh };
  }
  function nachVorlage(c, w, h, d, f, img, L) {
    const farben = L.hell ? { titel: '#FFFFFF', text: '#FFFFFF', akzent: f.hell } : f, rechtecke = {};
    if (L.grund || !img) { c.fillStyle = f.grund; c.fillRect(0, 0, w, h); }
    const B = L.bild || { x: 0, y: 0, w, h, fx: 0.5, fy: 0.5, zoom: 1 };
    if (img) {
      const k = Math.max(B.w / img.width, B.h / img.height) * Math.max(1, B.zoom || 1), sw = B.w / k, sh = B.h / k;
      c.save(); c.beginPath(); c.rect(B.x, B.y, B.w, B.h); c.clip();
      c.drawImage(img, (img.width - sw) * B.fx, (img.height - sh) * B.fy, sw, sh, B.x, B.y, B.w, B.h); c.restore();
    }
    rechtecke.bild = { x: B.x, y: B.y, w: B.w, h: B.h };
    // Wächst ein Feld gegenüber der Vorlage (längere Überschrift), rutscht alles, was darunter in derselben Spalte steht, mit
    const keys = Object.keys(FELDER).filter((k) => L.el && L.el[k]);
    const mass = Object.fromEntries(keys.map((k) => [k, feldMessen(c, k, L.el[k], d)]));
    const teile = [...keys.map((k) => ({ k, e: L.el[k] })), ...(L.linie ? [{ k: 'linie', e: L.linie }] : [])].sort((a, b) => a.e.y - b.e.y);
    const schub = {};
    for (const t of teile) {
      let dy = 0;
      for (const o of teile) {
        if (o === t || o.k === 'linie' || o.e.aus || o.e.y >= t.e.y || !(o.k in mass)) continue;
        const ueber = o.e.x < t.e.x + (t.e.b || 0) && t.e.x < o.e.x + o.e.b;
        if (ueber) dy = Math.max(dy, (schub[o.k] || 0) + Math.max(0, mass[o.k].h - (o.e.h || mass[o.k].h)));
      }
      schub[t.k] = dy;
    }
    if (L.hell) { c.save(); c.shadowColor = 'rgba(0,20,40,0.35)'; c.shadowBlur = 18 * (w > h ? h * 0.92 : w) / 1080; }
    if (L.linie && !L.linie.aus) {
      const y = L.linie.y + (schub.linie || 0); c.fillStyle = farben.akzent; c.fillRect(L.linie.x, y, L.linie.b, L.linie.d || 4);
      rechtecke.linie = { x: L.linie.x, y: y - 10, w: L.linie.b, h: (L.linie.d || 4) + 20 };
    }
    for (const k of keys) {
      const e = L.el[k], F = FELDER[k], { z, h: hh } = mass[k], y = e.y + (schub[k] || 0);
      rechtecke[k] = { x: e.x, y, w: e.b, h: Math.max(hh, e.g), aus: !!e.aus, leer: !z.length };
      if (!z.length || e.aus) continue;
      feldSchrift(c, k, e); c.fillStyle = farben[F.farbe]; c.textBaseline = 'top';
      const ausr = e.ausr || 'links'; c.textAlign = ausr === 'mitte' ? 'center' : ausr === 'rechts' ? 'right' : 'left';
      const x = ausr === 'mitte' ? e.x + e.b / 2 : ausr === 'rechts' ? e.x + e.b : e.x;
      z.forEach((zeile, i) => c.fillText(zeile, x, y + i * e.g * F.lh + e.g * (F.lh - 1) / 2));
      c.letterSpacing = '0px'; c.textAlign = 'left';
    }
    if (L.hell) c.restore();
    return rechtecke;
  }
  // Startvorlage für den Editor: die Automatik einmal laufen lassen und mitschreiben, wo alles gelandet ist
  function automatikVorlage(format, farbe, foto, d) {
    const cv = document.createElement('canvas'); protokoll = {};
    try { zeichnen(cv, format, farbe, foto, d, 0.05, { automatik: true }); } finally { var p = protokoll; protokoll = null; }
    const L = { bild: p.bild, grund: !!p.grund, hell: !!p.hell, el: {} };
    for (const k of Object.keys(FELDER)) if (p[k]) L.el[k] = { x: Math.round(p[k].x), y: Math.round(p[k].y), b: Math.round(p[k].b), g: Math.round(p[k].g), h: Math.round(p[k].h) };
    if (p.linie) L.linie = { x: Math.round(p.linie.x), y: Math.round(p.linie.y), b: Math.round(p.linie.b), d: Math.max(2, Math.round(p.linie.d)) };
    return L;
  }

  // massstab < 1 für kleine Vorschauen, gezeichnet wird immer in voller Größe. opt.layout = Vorlage aus dem Editor (ungespeichert)
  function zeichnen(canvas, format, farbe, foto, d, massstab = 1, opt = {}) {
    const fm = FORMATE[format], f = FARBEN[farbe] || FARBEN.blau;
    canvas.width = Math.round(fm.w * massstab); canvas.height = Math.round(fm.h * massstab);
    const c = canvas.getContext('2d');
    c.setTransform(massstab, 0, 0, massstab, 0, 0);
    const w = fm.w, h = fm.h;
    if (foto === 'eigen') return geteilt(c, w, h, d, f, bilder.eigen, 0.5, 0.4);
    const m = FOTOS[foto] || FOTOS['frau-kueche'], quer = w > h;
    const img = quer ? bilder[m.quer] || bilder[foto] : bilder[foto];
    const L = opt.automatik ? null : opt.layout || vorlage(foto, format);
    if (L) return nachVorlage(c, w, h, d, f, img, L);
    if (quer) {
      if (m.quer && m.querFrei) return vollbild(c, w, h, d, f, bilder[m.quer], { dunkel: m.dunkel }, m.querFrei, 0.5);
      return geteilt(c, w, h, d, f, bilder[m.quer] || bilder[foto], 0.5, m.quer ? 0.5 : m.fy);
    }
    // Kürzere Formate als Story: dort abschneiden, wo kein Text steht, damit die freien Flächen groß bleiben
    vollbild(c, w, h, d, f, bilder[foto], m, m.frei, h / w > 1.7 ? 0.5 : null);
  }

  // Für den Editor: welches Bild in welchem Format gezeichnet wird
  const bild = (foto, format) => { const m = FOTOS[foto] || {}; return FORMATE[format].w > FORMATE[format].h ? bilder[m.quer] || bilder[foto] : bilder[foto]; };
  return { FORMATE, FARBEN, FOTOS, FELDER, UEBERSCHRIFTEN, vorbereiten, fotoLaden, eigenesFoto, zeichnen, vorlagenSetzen, vorlage, sichtbar, automatikVorlage, feldMessen, bild };
})();

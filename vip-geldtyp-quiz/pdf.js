/* ==========================================================================
   VIP GROUP · Geldtyp-Test · PDF-AUSWERTUNG
   Zeichnet die persönliche Auswertung als A4-PDF im dunklen VIP-System
   (wie die Begleitunterlagen zum Videokurs). Läuft komplett im Browser.
   Seiten: 1 Geldtyp · 2 Fundament · 3 Zahlen (wenn angegeben) · 4 Videokurs
   ========================================================================== */

const PDF_C = {
  navy: '#1E252B', karte: '#272E33', karteRand: '#32393E', linie: '#30373C',
  goldFl: '#343732', goldRand: '#58543F', goldHauch: '#2D3130',
  negFl: '#2C2B31', negRand: '#503A3F', catFl: '#26343D', catRand: '#304858',
  kopfZeile: '#293036', spur: '#30373C', grauFill: '#5D6266',
  ink: '#FFFFFF', hell: '#E6EBF0', text: '#CDD4DB', desc: '#A9B2BA', dim: '#7D8790',
  gold: '#D4B868', aufGold: '#2A2410', neg: '#CF7171', pos: '#8FE0B8'
};
const PDF_SCHRIFTEN = [
  ['inter-400', 'Inter'], ['inter-600', 'InterSemi'], ['inter-700', 'InterBold'],
  ['inter-800', 'InterBlack'], ['playfair-display-600-italic', 'Playfair'], ['jetbrains-mono-700', 'Mono']
];
const pdfCache = {};

function skriptLaden(src) {
  return new Promise((ok, fehler) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = () => fehler(new Error('Laden fehlgeschlagen: ' + src));
    document.head.appendChild(s);
  });
}
function zuBase64(buf) {
  const b = new Uint8Array(buf); let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
}
async function bildAlsDataUrl(src) {
  const r = await fetch(src); const bl = await r.blob();
  return await new Promise((ok) => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(bl); });
}
// Rundes Portrait mit Goldring, als PNG für das PDF
async function rundesPortrait(src) {
  const img = await new Promise((ok, f) => { const i = new Image(); i.onload = () => ok(i); i.onerror = f; i.src = src; });
  const g = 360, c = document.createElement('canvas'); c.width = c.height = g;
  const x = c.getContext('2d');
  const grad = x.createLinearGradient(0, 0, g, g);
  grad.addColorStop(0, '#a8923a'); grad.addColorStop(.48, '#d4b868'); grad.addColorStop(1, '#eedfa0');
  x.fillStyle = grad; x.beginPath(); x.arc(g / 2, g / 2, g / 2, 0, Math.PI * 2); x.fill();
  x.save(); x.beginPath(); x.arc(g / 2, g / 2, g / 2 - 12, 0, Math.PI * 2); x.clip();
  x.fillStyle = '#12171c'; x.fillRect(0, 0, g, g);
  const b = g * 1.35, h = b * (img.height / img.width);
  x.drawImage(img, (g - b) / 2, g * 0.04, b, h);
  x.restore();
  return c.toDataURL('image/png');
}

async function pdfVorbereiten() {
  if (!window.jspdf) await skriptLaden('vendor/jspdf.umd.min.js');
  if (!pdfCache.schriften) {
    pdfCache.schriften = await Promise.all(PDF_SCHRIFTEN.map(async ([datei]) => {
      const r = await fetch(`schriften/pdf/${datei}.ttf`);
      return zuBase64(await r.arrayBuffer());
    }));
  }
  if (!pdfCache.logo) pdfCache.logo = await bildAlsDataUrl('bilder/vip-logo.png');
  if (!pdfCache.portrait) { try { pdfCache.portrait = await rundesPortrait('bilder/tobias-klein.webp'); } catch (e) { pdfCache.portrait = null; } }
}

/* ---------- Zeichnen ---------------------------------------------------- */
async function auswertungPdf(r, lead, opt = {}) {
  await pdfVorbereiten();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  PDF_SCHRIFTEN.forEach(([datei, fam], i) => {
    doc.addFileToVFS(datei + '.ttf', pdfCache.schriften[i]);
    doc.addFont(datei + '.ttf', fam, 'normal');
  });
  doc.setProperties({ title: 'Deine Geldtyp-Auswertung', author: 'VIP Group', subject: TYPEN[r.haupt].name });

  const L = 18, B = 174, OBEN = 40, UNTEN = 274;
  const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const fuell = (h) => doc.setFillColor(...rgb(h));
  const strich = (h) => doc.setDrawColor(...rgb(h));
  const farbe = (h) => doc.setTextColor(...rgb(h));
  const mm = (pt, lh) => pt * 0.3528 * lh;

  function schrift(fam, pt, col) { doc.setFont(fam, 'normal'); doc.setFontSize(pt); farbe(col); }
  // Text mit Umbruch, gibt die neue Höhe (Unterkante) zurück
  const fest = (t) => String(t).replace(/ (%|€)/g, '\u00A0$1');
  function absatz(t, x, y, w, fam, pt, col, lh = 1.5) {
    schrift(fam, pt, col);
    const zeilen = doc.splitTextToSize(fest(t), w);
    doc.text(zeilen, x, y + mm(pt, 1) * 0.8, { lineHeightFactor: lh, baseline: 'alphabetic' });
    return y + zeilen.length * mm(pt, lh);
  }
  function hoehe(t, w, fam, pt, lh = 1.5) {
    doc.setFont(fam, 'normal'); doc.setFontSize(pt);
    return doc.splitTextToSize(fest(t), w).length * mm(pt, lh);
  }
  function eyebrow(t, x, y, col = PDF_C.gold) {
    schrift('InterSemi', 7.5, col);
    doc.text(t.toUpperCase(), x, y + 2.6, { charSpace: 0.9 });
    return y + 5;
  }
  function karte(x, y, w, h, fl = PDF_C.karte, rand = PDF_C.karteRand) {
    fuell(fl); strich(rand); doc.setLineWidth(0.25); doc.roundedRect(x, y, w, h, 2.6, 2.6, 'FD');
  }
  function balken(x, y, w, h, anteil, col, spur = PDF_C.spur) {
    fuell(spur); doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
    const b = Math.max(h, w * Math.min(1, anteil));
    fuell(col); doc.roundedRect(x, y, b, h, h / 2, h / 2, 'F');
  }
  function neueSeite(erste) {
    if (!erste) doc.addPage();
    fuell(PDF_C.navy); doc.rect(0, 0, 210, 297, 'F');
    doc.addImage(pdfCache.logo, 'PNG', L, 12, 40, 40 * 279 / 900);
    schrift('Mono', 6.5, PDF_C.dim);
    doc.text('GELDTYP-TEST · DEINE AUSWERTUNG', L + B, 20.5, { align: 'right', charSpace: 0.3 });
    strich(PDF_C.linie); doc.setLineWidth(0.3); doc.line(L, 29, L + B, 29);
  }

  const T = TYPEN[r.haupt], Z = TYPEN[r.zweit], n = r.zahlen, s = stufe(r.score);

  /* ---- Seite 1: Geldtyp ---- */
  neueSeite(true);
  let y = eyebrow('Dein Geldtyp', L, OBEN);
  schrift('InterBlack', 32, PDF_C.ink); doc.text(T.name, L, y + 11);
  y += 17;
  schrift('Inter', 10.5, PDF_C.desc); doc.text('Motiv: ', L, y + 3);
  const mw = doc.getTextWidth('Motiv: ');
  schrift('InterSemi', 10.5, PDF_C.gold); doc.text(T.motiv, L + mw, y + 3);
  y += 11;
  const zh = hoehe(`„${T.zitat}“`, B - 8, 'Playfair', 17, 1.35);
  fuell(PDF_C.gold); doc.rect(L, y, 0.7, zh + 2, 'F');
  y = absatz(`„${T.zitat}“`, L + 6, y + 0.5, B - 8, 'Playfair', 17, PDF_C.hell, 1.35) + 6;
  y = absatz(`${lead?.vorname ? lead.vorname + ', ' : ''}${T.satz} Das ist Deine größte Stärke und zugleich Deine größte Falle.`, L, y, B, 'Inter', 10.5, PDF_C.text, 1.55) + 7;

  // Mischung
  const zweitText = `Zweittyp: ${Z.name} (${r.mix[r.zweit]} %). Motiv ${Z.motiv}. ${Z.satz}`;
  const mixH = 9 + 4 * 8.2 + 3 + hoehe(zweitText, B - 14, 'Inter', 8.8, 1.5) + 9;
  karte(L, y, B, mixH);
  eyebrow('Deine Mischung', L + 7, y + 6, PDF_C.desc);
  let my = y + 15;
  TYP_REIHE.slice().sort((a, b) => r.mix[b] - r.mix[a]).forEach((t) => {
    const haupt = t === r.haupt;
    schrift(haupt ? 'InterBold' : 'Inter', 9.5, haupt ? PDF_C.ink : PDF_C.desc); doc.text(TYPEN[t].kurz, L + 7, my + 3.2);
    balken(L + 48, my + 0.8, B - 48 - 26, 2.4, r.mix[t] / 100, haupt ? PDF_C.gold : PDF_C.grauFill);
    schrift('Mono', 9, haupt ? PDF_C.gold : PDF_C.desc); doc.text(r.mix[t] + ' %', L + B - 7, my + 3.2, { align: 'right' });
    my += 8.2;
  });
  strich(PDF_C.linie); doc.setLineWidth(0.25); doc.line(L + 7, my + 1, L + B - 7, my + 1);
  absatz(zweitText, L + 7, my + 4, B - 14, 'Inter', 8.8, PDF_C.desc, 1.5);
  y += mixH + 7;

  // Profil 2 × 2
  y = eyebrow('Dein Profil', L, y) + 2;
  const sp = (B - 5) / 2;
  const felder = [
    ['Deine Stärke', T.staerke, PDF_C.karte, PDF_C.karteRand, PDF_C.desc],
    ['Deine Falle', T.falle, PDF_C.negFl, PDF_C.negRand, PDF_C.neg],
    ['Was es Dich kostet', T.kosten, PDF_C.navy, PDF_C.linie, PDF_C.desc],
    ['Dein Hebel', T.hebel, PDF_C.goldFl, PDF_C.goldRand, PDF_C.gold]
  ];
  for (let reihe = 0; reihe < 2; reihe++) {
    const paar = felder.slice(reihe * 2, reihe * 2 + 2);
    const h = Math.max(...paar.map((f) => 13 + hoehe(f[1], sp - 12, 'Inter', 8.8, 1.5))) + 3;
    paar.forEach((f, i) => {
      const x = L + i * (sp + 5);
      karte(x, y, sp, h, f[2], f[3]);
      eyebrow(f[0], x + 6, y + 5, f[4]);
      absatz(f[1], x + 6, y + 12, sp - 12, 'Inter', 8.8, PDF_C.text, 1.5);
    });
    y += h + 5;
  }

  /* ---- Seite 2: Fundament ---- */
  neueSeite();
  y = eyebrow('Dein Fundament', L, OBEN) + 3;
  schrift('Mono', 40, PDF_C.gold); doc.text(String(r.score), L, y + 13);
  const sw = doc.getTextWidth(String(r.score));
  schrift('Mono', 11, PDF_C.dim); doc.text('/ 100', L + sw + 2, y + 13);
  schrift('InterBold', 15, PDF_C.ink); doc.text(s.name, L + 52, y + 5);
  absatz(s.text, L + 52, y + 8, B - 52, 'Inter', 9.5, PDF_C.desc, 1.5);
  y += 22;
  balken(L, y, B, 2.6, r.score / 100, PDF_C.gold);
  y += 9;
  absatz('Sechs Bereiche, jeder ist ein Thema aus dem kostenlosen Videokurs. Je niedriger der Wert, desto mehr bringt Dir das passende Video.', L, y, B, 'Inter', 9, PDF_C.desc, 1.5);
  y += 12;
  for (let reihe = 0; reihe < 3; reihe++) {
    const paar = BEREICH_REIHE.slice(reihe * 2, reihe * 2 + 2);
    const h = Math.max(...paar.map((b) => 24 + hoehe(BEREICHE[b][bewertung(r.bereiche[b])], sp - 12, 'Inter', 8.6, 1.5)));
    paar.forEach((b, i) => {
      const x = L + i * (sp + 5), w = r.bereiche[b], st = bewertung(w), Bx = BEREICHE[b];
      const col = st === 'niedrig' ? PDF_C.neg : st === 'hoch' ? PDF_C.pos : PDF_C.desc;
      karte(x, y, sp, h);
      schrift('InterBold', 10.5, PDF_C.ink); doc.text(Bx.name, x + 6, y + 8);
      schrift('Mono', 10, col); doc.text(String(w), x + sp - 6, y + 8, { align: 'right' });
      balken(x + 6, y + 11.5, sp - 12, 1.6, w / 100, st === 'mittel' ? PDF_C.grauFill : col);
      absatz(Bx[st], x + 6, y + 16, sp - 12, 'Inter', 8.6, PDF_C.text, 1.5);
      schrift('Mono', 6.8, PDF_C.gold); doc.text('THEMA IN VIDEO ' + Bx.video, x + 6, y + h - 4);
    });
    y += h + 5;
  }

  /* ---- Seite 3: Zahlen ---- */
  if (n) {
    neueSeite();
    y = eyebrow('Deine Zahlen', L, OBEN);
    schrift('InterBold', 16, PDF_C.ink); doc.text('Zwei Zahlen, die kaum jemand kennt', L, y + 7);
    y += 14;
    const kw = n.da != null ? (B - 5) / 2 : B;
    const kpi = (x, fl, rand, k, v, d, vc) => {
      karte(x, y, kw, 30, fl, rand);
      eyebrow(k, x + 6, y + 5, PDF_C.desc);
      schrift('Mono', 19, vc); doc.text(v, x + 6, y + 19);
      absatz(d, x + 6, y + 22.5, kw - 12, 'Inter', 7.5, PDF_C.dim, 1.4);
    };
    kpi(L, PDF_C.catFl, PDF_C.catRand, 'Bisher verdient', '~ ' + euro(n.leben), `grob überschlagen mit 80 % Deines heutigen Einkommens über ${n.jahre} Jahre`, PDF_C.ink);
    if (n.da != null) kpi(L + kw + 5, PDF_C.goldFl, PDF_C.goldRand, 'Davon noch da', '~ ' + euro(n.da), `nach Deiner Schätzung von ${n.behalten === 5 ? 'unter 10' : n.behalten} %`, PDF_C.gold);
    y += 36;
    if (n.da != null) {
      const m = n.behalten >= 50 ? 'Du hast mehr behalten als die meisten. Jetzt geht es darum, dass es auch für Dich arbeitet.' : `Rund ${euro(n.leben - n.da)} sind durch Deine Hände gegangen und weg. Nicht weil Du zu wenig verdienst, sondern weil zuerst alle anderen bezahlt wurden.`;
      const mh = hoehe(m, B - 12, 'Inter', 10, 1.5) + 9;
      karte(L, y, B, mh, PDF_C.goldHauch, PDF_C.goldHauch);
      absatz(m, L + 6, y + 4.5, B - 12, 'Inter', 10, PDF_C.hell, 1.5);
      y += mh + 9;
    }
    schrift('InterBold', 12, PDF_C.ink); doc.text('Das 3-Konten-Modell bei Deinem Einkommen', L, y + 4);
    y += 9;
    const zeilen = [
      ['Einkommen netto', '', '100 %', n.einkommen],
      ['Spaßkonto', 'zum Ausgeben, ohne schlechtes Gewissen', '10 %', n.spass],
      ['Sparkonto', 'wird dreifach verteilt', '20 %', n.spar],
      ['Goldene Gans', 'Reserve für die monatlichen Investments', '50 % davon', n.gans, 1],
      ['Mittelfristig', 'z. B. strategische Industriemetalle', '25 % davon', n.mittel, 1],
      ['Langfristig', 'z. B. Edelmetalle', '25 % davon', n.lang, 1],
      ['Für Dich selbst reserviert', 'Spaß- und Sparkonto', '30 %', n.spass + n.spar, 0, 1]
    ];
    fuell(PDF_C.kopfZeile); doc.roundedRect(L, y, B, 8, 1.5, 1.5, 'F');
    schrift('InterBold', 6.8, PDF_C.desc);
    doc.text('KONTO', L + 5, y + 5.2, { charSpace: 0.6 });
    doc.text('ANTEIL', L + 128, y + 5.2, { align: 'right', charSpace: 0.6 });
    doc.text('PRO MONAT', L + B - 5, y + 5.2, { align: 'right', charSpace: 0.6 });
    y += 8;
    zeilen.forEach(([name, sub, ant, wert, eingerueckt, summe]) => {
      const zh2 = sub ? 11 : 8.5;
      if (summe) { fuell(PDF_C.goldFl); doc.rect(L, y, B, zh2, 'F'); }
      strich(summe ? PDF_C.goldRand : PDF_C.linie); doc.setLineWidth(0.2); doc.line(L, y, L + B, y);
      const x = L + 5 + (eingerueckt ? 6 : 0);
      if (eingerueckt) { fuell(PDF_C.dim); doc.circle(L + 7.5, y + 4.6, 0.6, 'F'); }
      schrift(summe || !eingerueckt ? 'InterBold' : 'InterSemi', 9.5, summe || !eingerueckt ? PDF_C.ink : PDF_C.text); doc.text(name, x, y + 5.4);
      if (sub) { schrift('Inter', 7.3, PDF_C.dim); doc.text(sub, x, y + 9.1); }
      schrift('Mono', 9, summe ? PDF_C.gold : PDF_C.text);
      doc.text(ant, L + 128, y + 5.4, { align: 'right' });
      doc.text(euro(wert), L + B - 5, y + 5.4, { align: 'right' });
      y += zh2;
    });
    y += 4;
    y = absatz(`Modell aus Video 1 · gerechnet mit Deiner Angabe von etwa ${euro(n.einkommen)} netto · Beispielrechnung, keine Anlageberatung`, L, y, B, 'Mono', 6.5, PDF_C.dim, 1.4) + 7;
    const m2 = `Allein durch die Reihenfolge liegen nach zehn Jahren ${euro(n.zehnJahre)} auf Deinen Sparkonten. Ohne einen Euro mehr zu verdienen und ohne einen Euro Rendite.`;
    const m2h = hoehe(m2, B - 12, 'Inter', 10, 1.5) + 9;
    karte(L, y, B, m2h, PDF_C.goldHauch, PDF_C.goldHauch);
    absatz(m2, L + 6, y + 4.5, B - 12, 'Inter', 10, PDF_C.hell, 1.5);
  }

  /* ---- Seite 4: Videokurs ---- */
  neueSeite();
  y = eyebrow('Dein nächster Schritt', L, OBEN);
  const titelB = pdfCache.portrait ? B - 34 : B;
  const ty = absatz('Der kostenlose Videokurs von Tobias Rethaber', L, y + 1, titelB, 'InterBlack', 21, PDF_C.ink, 1.15);
  if (pdfCache.portrait) doc.addImage(pdfCache.portrait, 'PNG', L + B - 26, y - 3, 26, 26);
  y = Math.max(ty, y + 24) + 4;
  y = absatz(`Drei Videos, die genau die Bereiche abdecken, die Du im Test bewertet hast. Schau sie der Reihe nach. Für Dich als ${T.kurz} ist Video ${r.empfehlung} das wichtigste.`, L, y, B, 'Inter', 10.5, PDF_C.text, 1.55) + 7;
  VIDEOS.forEach((v) => {
    const emp = v.nr === r.empfehlung;
    const punktH = (p) => { doc.setFont('InterSemi', 'normal'); doc.setFontSize(8.8); const tw = doc.getTextWidth(p.t + '. '); return hoehe(p.d, B - 20 - tw, 'Inter', 8.8, 1.45); };
    const pH = v.punkte.reduce((s2, p) => s2 + punktH(p) + 1.6, 0);
    const h = 20 + pH + 3;
    karte(L, y, B, h, emp ? PDF_C.goldFl : PDF_C.karte, emp ? PDF_C.goldRand : PDF_C.karteRand);
    schrift('Mono', 8, PDF_C.gold); doc.text('VIDEO ' + v.nr, L + 7, y + 7.5);
    if (emp) {
      schrift('InterBold', 6.3, PDF_C.gold);
      const bt = 'FÜR DICH AM WICHTIGSTEN'; const tw = doc.getTextWidth(bt) + (bt.length - 1) * 0.4; const bw = tw + 7;
      strich(PDF_C.goldRand); doc.setLineWidth(0.3); doc.roundedRect(L + B - 7 - bw, y + 3.6, bw, 5.4, 2.7, 2.7, 'S');
      doc.text(bt, L + B - 7 - bw + 3.5, y + 7.2, { charSpace: 0.4 });
    }
    schrift('InterBold', 12.5, PDF_C.ink); doc.text(v.titel, L + 7, y + 14.5);
    let py = y + 19;
    v.punkte.forEach((p) => {
      fuell(PDF_C.gold); doc.circle(L + 8.2, py + 1.9, 0.7, 'F');
      schrift('InterSemi', 8.8, PDF_C.hell); doc.text(p.t + '.', L + 12, py + 3.1);
      const tw = doc.getTextWidth(p.t + '. ');
      py = absatz(p.d, L + 12 + tw, py, B - 20 - tw, 'Inter', 8.8, PDF_C.desc, 1.45) + 1.6;
    });
    y += h + 4;
  });
  y = Math.min(y + 2, UNTEN - 38);
  fuell(PDF_C.gold); doc.roundedRect(L, y, B, 14, 3, 3, 'F');
  schrift('InterBold', 11.5, PDF_C.aufGold); doc.text('Videokurs kostenlos starten', L + B / 2, y + 8.8, { align: 'center' });
  if (opt.link) doc.link(L, y, B, 14, { url: opt.link });
  y += 18;
  if (opt.linkText) { schrift('Inter', 8, PDF_C.dim); doc.text(opt.linkText, L + B / 2, y + 2, { align: 'center' }); }
  absatz('Der Geldtyp-Test dient der Selbsteinschätzung und der Wissensvermittlung. Er ist keine Anlage- oder Steuerberatung. Alle Zahlen sind grobe Beispielrechnungen auf Basis Deiner Angaben. Vergangenheitswerte sind keine Garantie für zukünftige Entwicklungen. Grundlage: die vier Geldtypen und der Videokurs von Tobias Rethaber, VIP Group.', L, UNTEN - 12, B, 'Inter', 6.8, PDF_C.dim, 1.45);

  // Fußzeilen mit Seitenzahl
  const gesamt = doc.getNumberOfPages();
  const datum = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  for (let i = 1; i <= gesamt; i++) {
    doc.setPage(i);
    strich(PDF_C.linie); doc.setLineWidth(0.3); doc.line(L, 281, L + B, 281);
    schrift('Inter', 7.2, PDF_C.dim);
    doc.text(`${lead?.vorname ? 'Für ' + lead.vorname + ' · ' : ''}erstellt am ${datum} · VIP Group, Value Investing People`, L, 286);
    schrift('Mono', 7.2, PDF_C.dim); doc.text(`${String(i).padStart(2, '0')} / ${String(gesamt).padStart(2, '0')}`, L + B, 286, { align: 'right' });
  }
  return doc.output('blob');
}

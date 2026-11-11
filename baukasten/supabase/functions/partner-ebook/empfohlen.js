// Personalisiert ein E-Book: fügt nach der Titelseite die Seite "Empfohlen von" mit Foto, Name, Rolle, Satz und
// Kontakt des Partners ein. Reines JavaScript ohne Abhängigkeiten, damit es in der Edge Function (Deno) und lokal
// (Node, werkzeuge/ebook-probe.mjs) gleich läuft. pdf-lib und fontkit werden von außen hineingegeben.
// Gestaltung nach CI (eBooks und Dokumente): A4, Grund ground, Rand 20 mm, Jost für Überschriften, Inter für Text,
// Zitat mit 2-pt-Linie in khaki, Hinweisbox surface mit Haarlinie. Telefon und E-Mail nur, wenn freigegeben.

const FARBE = {
  ground: [245, 241, 232], surface: [251, 249, 244], sand: [234, 227, 211], line: [217, 207, 186],
  khakiLight: [207, 196, 160], khaki: [168, 153, 106], olive: [79, 90, 53], oliveDeep: [47, 53, 36], ink: [42, 44, 34], muted: [95, 97, 82],
};
const A4 = [595.28, 841.89];
const RAND = 56.7; // 20 mm
// Wohin die Seite kommt: 1 = gleich nach der Titelseite
export const EINFUEGEN_NACH = 1;
const TITEL = {
  neutral: ['E-Book', 'Ein Gerät, fünf Wasserarten'],
  sport: ['E-Book für alle, die trainieren', 'Das unterschätzte Supplement'],
  gesundheit: ['E-Book', 'Wasser im Alltag'],
};

export async function personalisieren({ PDFLib, fontkit, vorlage, schriften = {}, foto, partner, fassung, link }) {
  const { PDFDocument, StandardFonts, rgb, PDFString, PDFName, setCharacterSpacing } = PDFLib;
  const c = (n) => rgb(...FARBE[n].map((x) => x / 255));
  const doc = vorlage ? await PDFDocument.load(vorlage) : await platzhalterVorlage(PDFLib, fassung);
  doc.registerFontkit(fontkit);
  // Schriften aus supabase/ebook-schriften: vorbereitet ohne Layout-Tabellen, sonst fehlen bei Inter Buchstaben im PDF
  const laden = async (bytes, ersatz) => (bytes ? doc.embedFont(bytes, { subset: true }) : doc.embedFont(ersatz));
  const F = {
    kopf: await laden(schriften.jost, StandardFonts.Helvetica),
    text: await laden(schriften.inter, StandardFonts.Helvetica),
    fett: await laden(schriften.interFett, StandardFonts.HelveticaBold),
  };
  const name = `${partner.vorname || ''} ${partner.nachname || ''}`.trim();
  const vorname = partner.vorname || name;
  const page = doc.insertPage(Math.min(EINFUEGEN_NACH, doc.getPageCount()), A4);
  const [B, H] = A4;
  const breit = B - 2 * RAND;
  page.drawRectangle({ x: 0, y: 0, width: B, height: H, color: c('ground') });

  // Text mit Zeilenumbruch, gibt die neue Höhe zurück
  function absatz(text, { x = RAND, y, font = F.text, groesse = 11, zeile = 16, farbe = 'ink', breite = breit }) {
    const woerter = String(text).split(/\s+/).filter(Boolean); let z = '';
    for (const w of woerter) {
      const probe = z ? `${z} ${w}` : w;
      if (font.widthOfTextAtSize(probe, groesse) > breite && z) { page.drawText(z, { x, y, size: groesse, font, color: c(farbe) }); y -= zeile; z = w; } else z = probe;
    }
    if (z) { page.drawText(z, { x, y, size: groesse, font, color: c(farbe) }); y -= zeile; }
    return y;
  }
  function eyebrow(text, x, y, farbe = 'olive') {
    page.pushOperators(setCharacterSpacing(1.1));
    page.drawText(text.toUpperCase(), { x, y, size: 8.5, font: F.fett, color: c(farbe) });
    page.pushOperators(setCharacterSpacing(0));
  }
  function verweis(url, x, y, w, h) {
    const a = doc.context.obj({ Type: 'Annot', Subtype: 'Link', Rect: [x, y, x + w, y + h], Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) } });
    const ref = doc.context.register(a);
    const alt = page.node.lookup(PDFName.of('Annots'));
    if (alt) alt.push(ref); else page.node.set(PDFName.of('Annots'), doc.context.obj([ref]));
  }

  // Kopf: Foto links, daneben Name und Rolle
  let y = H - RAND - 8;
  eyebrow('Persönlich für dich', RAND, y);
  y -= 28;
  const fb = 150, fh = 188; // Foto 4 : 5
  const fy = y - fh;
  if (foto) {
    const bild = await doc.embedJpg(foto);
    const s = Math.max(fb / bild.width, fh / bild.height);
    // Ausschnitt mittig: das Bild ist schon im Portal auf 4 : 5 zugeschnitten, hier nur einpassen
    page.drawImage(bild, { x: RAND + (fb - bild.width * s) / 2, y: fy + (fh - bild.height * s) / 2, width: bild.width * s, height: bild.height * s });
  } else {
    page.drawRectangle({ x: RAND, y: fy, width: fb, height: fh, color: c('khakiLight') });
    const ini = `${(partner.vorname || ' ')[0]}${(partner.nachname || ' ')[0]}`.trim().toUpperCase();
    const g = 54, w = F.kopf.widthOfTextAtSize(ini, g);
    page.drawText(ini, { x: RAND + (fb - w) / 2, y: fy + fh / 2 - g * 0.36, size: g, font: F.kopf, color: c('oliveDeep') });
  }
  page.drawRectangle({ x: RAND, y: fy, width: fb, height: fh, borderColor: c('line'), borderWidth: 1 });

  const tx = RAND + fb + 28, tb = B - RAND - tx;
  let ty = y - 6;
  eyebrow('Empfohlen von', tx, ty);
  ty -= 34;
  ty = absatz(name, { x: tx, y: ty, font: F.kopf, groesse: 30, zeile: 34, breite: tb });
  if (partner.rolle) ty = absatz(partner.rolle, { x: tx, y: ty - 2, groesse: 12, zeile: 18, farbe: 'muted', breite: tb });
  if (partner.satz) {
    ty -= 14;
    const oben = ty + 14;
    ty = absatz(`„${partner.satz}“`, { x: tx + 14, y: ty, font: F.kopf, groesse: 15, zeile: 21, farbe: 'olive', breite: tb - 14 });
    page.drawRectangle({ x: tx, y: ty + 12, width: 2, height: oben - ty - 10, color: c('khaki') });
  }

  // Einleitung
  y = Math.min(fy, ty) - 44;
  page.drawText('Schön, dass du reinliest.', { x: RAND, y, size: 22, font: F.kopf, color: c('ink') });
  y -= 30;
  y = absatz(`Dieses E-Book hast du von ${vorname} bekommen. Lies es in Ruhe, so oft du magst. Wenn du Fragen hast oder das Gerät persönlich kennenlernen möchtest, melde dich direkt bei ${vorname}.`, { y });

  // Kontakt als Hinweisbox (CI: surface, Haarlinie, Radius klein)
  const zeilen = [
    partner.telefon && ['Telefon', partner.telefon, `tel:${String(partner.telefon).replace(/[^\d+]/g, '')}`],
    partner.email && ['E-Mail', partner.email, `mailto:${partner.email}`],
    partner.insta && ['Instagram', `@${String(partner.insta).replace(/^@/, '')}`, `https://www.instagram.com/${String(partner.insta).replace(/^@/, '')}/`],
    link && ['Seite', link.replace(/^https?:\/\//, ''), link],
  ].filter(Boolean);
  y -= 18;
  const zh = 26, kh = 40 + zeilen.length * zh;
  page.drawRectangle({ x: RAND, y: y - kh, width: breit, height: kh, color: c('surface'), borderColor: c('line'), borderWidth: 1 });
  eyebrow(`So erreichst du ${vorname}`, RAND + 20, y - 24);
  let ky = y - 24 - 26;
  for (const [titel, wert, url] of zeilen) {
    page.drawText(titel, { x: RAND + 20, y: ky, size: 10, font: F.text, color: c('muted') });
    page.drawText(wert, { x: RAND + 120, y: ky, size: 11, font: F.fett, color: c('ink') });
    verweis(url, RAND + 120, ky - 4, F.fett.widthOfTextAtSize(wert, 11), 16);
    ky -= zh;
  }

  // Fuß: Haarlinie, Hinweis wie auf der Titelseite verlangt
  page.drawLine({ start: { x: RAND, y: 64 }, end: { x: B - RAND, y: 64 }, thickness: 1, color: c('line') });
  page.drawText('Kein medizinischer Ratgeber. Die Inhalte dienen der Orientierung und ersetzen keine ärztliche Beratung.', { x: RAND, y: 46, size: 8, font: F.text, color: c('muted') });

  doc.setTitle(`${TITEL[fassung]?.[1] || 'E-Book'}, empfohlen von ${name}`);
  doc.setAuthor(name);
  doc.setProducer('Baukasten Partnerseiten');
  return doc.save();
}

// Solange die echten E-Books (Paket E-Books) fehlen: eine schlichte Vorlage mit Titelseite und Platzhaltern
async function platzhalterVorlage(PDFLib, fassung) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const doc = await PDFDocument.create();
  const fett = await doc.embedFont(StandardFonts.HelveticaBold), text = await doc.embedFont(StandardFonts.Helvetica);
  const c = (n) => rgb(...FARBE[n].map((x) => x / 255));
  const [B, H] = A4, [eye, titel] = TITEL[fassung] || TITEL.neutral;
  const p = doc.addPage(A4);
  p.drawRectangle({ x: 0, y: 0, width: B, height: H, color: c('oliveDeep') });
  p.drawText(eye.toUpperCase(), { x: RAND, y: H - 110, size: 9, font: fett, color: c('khakiLight') });
  p.drawText(titel, { x: RAND, y: H / 2, size: 30, font: fett, color: c('surface') });
  p.drawText('[FEHLT: echtes E-Book aus dem Paket E-Books]', { x: RAND, y: H / 2 - 30, size: 11, font: text, color: c('khakiLight') });
  for (let i = 1; i <= 2; i++) {
    const s = doc.addPage(A4);
    s.drawRectangle({ x: 0, y: 0, width: B, height: H, color: c('ground') });
    s.drawText(`Inhaltsseite ${i}`, { x: RAND, y: H - 110, size: 20, font: fett, color: c('ink') });
    s.drawText('[FEHLT: Inhalt aus dem Paket E-Books]', { x: RAND, y: H - 140, size: 11, font: text, color: c('muted') });
  }
  return doc;
}

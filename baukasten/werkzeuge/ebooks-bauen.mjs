// Baut die E-Book-Vorlagen (12.11.2026): jedes Buch aus ebooks/inhalt.mjs in jedem Look aus website/p/farben.js.
// Ergebnis in ausgabe/vorlagen/<buch>/<modus>-<akzent>.pdf plus .json (wo die freien Felder liegen).
// Diese Dateien kommen in den Supabase-Speicher (Bucket partner-ebooks, Ordner vorlagen), siehe LIESMICH.
// Außerdem: ausgabe/vorlagen/katalog.json (für die Edge Function) und website/p/ebooks.js (für Portal und Seiten).
//
// Aufruf im Ordner werkzeuge (einmal npm install):
//   node ebooks-bauen.mjs            nur der Vorschlags-Look je Buch (schnell, zum Prüfen)
//   node ebooks-bauen.mjs --alle     alle Looks (9 Bücher x 2 Grundtöne x 7 Akzente)
//   node ebooks-bauen.mjs --proben   dazu Beispiel-E-Books mit Max Muster für die lokale Vorschau
// Braucht Chromium mit Playwright (require('playwright')).
import http from 'node:http';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HIER = path.dirname(fileURLToPath(import.meta.url));
const BAUKASTEN = path.resolve(HIER, '..');
const AUS = path.join(BAUKASTEN, 'ausgabe', 'vorlagen');
const ALLE = process.argv.includes('--alle'), PROBEN = process.argv.includes('--proben');

// Farben aus farben.js (Browser-Datei, hier ohne Browser geladen)
const fenster = {};
new Function('window', await readFile(path.join(BAUKASTEN, 'website/p/farben.js'), 'utf8'))(fenster);
const F = fenster.UKFarben;
const { BUECHER, THEMEN } = await import(path.join(BAUKASTEN, 'ebooks/inhalt.mjs'));

// Kleiner Server: /p und /partner aus website, /ebooks aus ebooks, /schriften aus vorschau/schriften
const TYPEN = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer(async (req, res) => {
  const pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const datei = pfad.startsWith('/ebooks/') ? path.join(BAUKASTEN, pfad.slice(1))
    : pfad.startsWith('/schriften/') ? path.join(BAUKASTEN, 'vorschau/schriften', path.basename(pfad))
    : path.join(BAUKASTEN, 'website', pfad.slice(1));
  if (!datei.startsWith(BAUKASTEN)) { res.writeHead(403); return res.end(); }
  try { const d = await readFile(datei); res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] || 'application/octet-stream' }); res.end(d); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const BASIS = `http://localhost:${server.address().port}`;

// Felder in der Vorlage vermessen: Lage in PDF-Punkten (Ursprung unten links), Schrift, Größe, Farbe
async function vermessen(page) {
  return page.evaluate(() => {
    const PT = 0.75, H = 841.89;
    const hex = (c) => { const m = c.match(/\d+(\.\d+)?/g) || [0, 0, 0]; return '#' + m.slice(0, 3).map((x) => Math.round(+x).toString(16).padStart(2, '0')).join('').toUpperCase(); };
    const seiten = [...document.querySelectorAll('.seite')];
    const felder = [...document.querySelectorAll('[data-slot]')].map((el) => {
      const s = el.closest('.seite'), rs = s.getBoundingClientRect(), r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      const innen = { l: parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), t: parseFloat(cs.paddingTop) };
      const w = r.width - innen.l - parseFloat(cs.paddingRight), h = r.height - innen.t - parseFloat(cs.paddingBottom);
      return {
        typ: el.dataset.slot, seite: seiten.indexOf(s),
        x: +((r.left - rs.left + innen.l) * PT).toFixed(2), y: +(H - (r.top - rs.top + innen.t + h) * PT).toFixed(2),
        w: +(w * PT).toFixed(2), h: +(h * PT).toFixed(2),
        schrift: /Jost/.test(cs.fontFamily) ? 'kopf' : +cs.fontWeight >= 600 ? 'fett' : 'text',
        groesse: +(parseFloat(cs.fontSize) * PT).toFixed(2), zeile: +(parseFloat(cs.lineHeight) * PT || parseFloat(cs.fontSize) * 1.3 * PT).toFixed(2),
        farbe: hex(cs.color),
      };
    });
    // Überlauf prüfen: Inhalt darf nicht in den Fuß laufen
    const ueber = seiten.map((s, i) => {
      const rs = s.getBoundingClientRect();
      const tief = Math.max(0, ...[...s.querySelectorAll('.koerper > *, .zugang, .ratgeber, .kontaktbox')].map((c) => c.getBoundingClientRect().bottom - rs.top));
      return tief > rs.height - 18 * 3.7795 ? `Seite ${i + 1}` : null;
    }).filter(Boolean);
    const css = getComputedStyle(document.documentElement);
    return { seiten: seiten.length, felder, ueber, farben: { akKnopf: css.getPropertyValue('--ak-knopf').trim(), text: css.getPropertyValue('--text').trim() } };
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
// Katalog: Bücher, Vorschlags-Buch je Seite, Vorschlags-Look je Thema und erlaubte Looks (für die Edge Function)
const katalog = { stand: new Date().toISOString().slice(0, 10), standard: {}, buecher: [],
  looks: { standard: Object.fromEntries(Object.entries(F.STANDARD).map(([k, v]) => [k, { modus: v.modus, akzent: v.akzent }])), modi: Object.keys(F.MODI), akzente: Object.keys(F.AKZENTE) } };
let anzahl = 0, fehler = 0;
for (const b of BUECHER) {
  const std = F.STANDARD[b.thema];
  katalog.buecher.push({ id: b.id, thema: b.thema, titel: b.titel, untertitel: b.untertitel, kurz: b.kurz, eyebrow: b.eyebrow });
  if (b.standard) katalog.standard[b.thema] = b.id;
  const looks = ALLE ? Object.keys(F.MODI).flatMap((m) => Object.keys(F.AKZENTE).map((a) => [m, a])) : [[std.modus, std.akzent]];
  await mkdir(path.join(AUS, b.id), { recursive: true });
  for (const [modus, akzent] of looks) {
    await page.goto(`${BASIS}/ebooks/vorlage.html?buch=${b.id}&modus=${modus}&akzent=${akzent}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.FERTIG, null, { timeout: 20000 });
    const lage = await vermessen(page);
    if (lage.ueber.length) { fehler++; console.warn(`ÜBERLAUF ${b.id} ${modus}-${akzent}: ${lage.ueber.join(', ')}`); }
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    const name = path.join(AUS, b.id, `${modus}-${akzent}`);
    await writeFile(name + '.pdf', pdf);
    await writeFile(name + '.json', JSON.stringify({ buch: b.id, titel: b.titel, modus, akzent, seiten: lage.seiten, farben: lage.farben, felder: lage.felder }, null, 1));
    anzahl++;
  }
  console.log('gebaut', b.id, looks.length === 1 ? looks[0].join('-') : `${looks.length} Looks`);
}
await writeFile(path.join(AUS, 'katalog.json'), JSON.stringify(katalog, null, 1));
// Katalog für Portal und Seiten (gleicher Inhalt, als Browser-Datei)
await writeFile(path.join(BAUKASTEN, 'website/p/ebooks.js'),
  `// E-Book-Katalog (erzeugt von werkzeuge/ebooks-bauen.mjs am ${katalog.stand}, nicht von Hand ändern, Quelle: ebooks/inhalt.mjs)\n` +
  `window.UKEbooks = ${JSON.stringify({ themen: THEMEN, standard: katalog.standard, buecher: katalog.buecher }, null, 1)};\n`);

// Beispiel-E-Books mit Max Muster für die lokale Vorschau (website/p/vorschau/ebook-<buch>.pdf)
if (PROBEN) {
  const PDFLib = await import('pdf-lib');
  const fontkit = (await import('@pdf-lib/fontkit')).default;
  const qrcode = (await import('qrcode-generator')).default;
  const { fuellen } = await import(path.join(BAUKASTEN, 'supabase/functions/partner-ebook/fuellen.js'));
  const lies = (p) => readFile(path.join(BAUKASTEN, p)).catch(() => null);
  const schriften = { jost: await lies('supabase/ebook-schriften/Jost-Medium.ttf'), inter: await lies('supabase/ebook-schriften/Inter-Regular.ttf'), interFett: await lies('supabase/ebook-schriften/Inter-SemiBold.ttf') };
  const partner = { vorname: 'Max', nachname: 'Muster', rolle: 'Personal Trainer', satz: 'Ich trainiere seit zwölf Jahren. Seit einem Jahr trinke ich nur noch dieses Wasser.', insta: 'max.muster', telefon: null, email: null };
  await mkdir(path.join(BAUKASTEN, 'website/p/vorschau'), { recursive: true });
  for (const b of BUECHER) {
    const std = F.STANDARD[b.thema], name = path.join(AUS, b.id, `${std.modus}-${std.akzent}`);
    const lage = JSON.parse(await readFile(name + '.json', 'utf8'));
    const pdf = await fuellen({ PDFLib, fontkit, qrcode, vorlage: await readFile(name + '.pdf'), lage, schriften, foto: null, partner,
      link: `https://mein.ursprungskraft.net/p/max-muster/${b.thema}` });
    await writeFile(path.join(BAUKASTEN, `website/p/vorschau/ebook-${b.id}.pdf`), pdf);
  }
  console.log('Beispiel-E-Books gebaut:', BUECHER.length);
}
await browser.close(); server.close();
console.log(`${anzahl} Vorlagen in ${path.relative(BAUKASTEN, AUS)}${fehler ? `, ${fehler} mit Überlauf (siehe oben)` : ', alle ohne Überlauf'}`);

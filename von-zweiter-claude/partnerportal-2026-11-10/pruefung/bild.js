// node bild.js <ausgabeordner> <breite> <modus#route> [...]   Bildschirmfotos ganzer Seiten, Konsolenfehler werden gemeldet
const { chromium } = require('playwright');
(async () => {
  const [out, breite, ...ziele] = process.argv.slice(2);
  const w = Number(breite), b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: w, height: w < 700 ? 780 : 900 }, deviceScaleFactor: Number(process.env.DSF || 1), locale: 'de-DE', hasTouch: w < 700, isMobile: w < 700, ...(w < 700 ? { userAgent: process.env.ANDROID ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' } : {}) });
  const p = await c.newPage(); const fehler = [];
  p.on('pageerror', (e) => fehler.push('pageerror ' + e.message)); p.on('console', (m) => ['error', 'warning'].includes(m.type()) && fehler.push(m.type() + ' ' + m.text()));
  for (const z of ziele) {
    const [adr, aktion] = z.split('@');
    await p.goto('http://localhost:8766/partner/?vorschau=' + adr); await p.waitForTimeout(1500);
    if (aktion) { await p.evaluate(aktion).catch((e) => fehler.push('aktion ' + e.message)); await p.waitForTimeout(900); }
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(700);
    const name = adr.replace(/[#/&=?]/g, '_') + (aktion ? '_a' : '');
    // Ganze Seite: Fenster auf Seitenhöhe ziehen statt "fullPage". So stehen feste Leisten richtig und keine Einblendung startet neu.
    const vh = w < 700 ? 780 : 900;
    if (!process.env.SICHT) { const hh = Math.max(vh, await p.evaluate(() => document.documentElement.scrollHeight)); await p.setViewportSize({ width: w, height: hh }); await p.waitForTimeout(1500); }
    await p.screenshot({ path: `${out}/${w}-${name}.png` });
    if (!process.env.SICHT) await p.setViewportSize({ width: w, height: vh });
  }
  console.log(fehler.length ? fehler.join('\n') : 'keine Konsolenfehler'); await b.close();
})();

// Bildschirmaufnahmen der echten Bewegung (kein Nachbau): node film.js <ordner> <breite>
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [out, breite] = process.argv.slice(2); const w = Number(breite), handy = w < 700;
  const b = await chromium.launch(); const U = 'http://localhost:8766/partner/';
  const film = async (name, lauf) => {
    const c = await b.newContext({ viewport: { width: w, height: handy ? 844 : 900 }, locale: 'de-DE', hasTouch: handy, isMobile: handy, recordVideo: { dir: out + '/roh', size: { width: w, height: handy ? 844 : 900 } },
      ...(handy ? { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' } : {}) });
    const p = await c.newPage(); const t = (ms) => p.waitForTimeout(ms);
    try { await lauf(p, t); } catch (e) { console.log('FEHLER in ' + name + ': ' + e.message.split('\n')[0]); }
    const v = p.video(); await c.close(); const ziel = `${out}/${name}-${w}.webm`; fs.renameSync(await v.path(), ziel); console.log(ziel, Math.round(fs.statSync(ziel).size / 1024) + ' KB');
  };
  const tipp = (p, s) => (handy ? p.tap(s) : p.click(s));
  await film('01-start-und-navigation', async (p, t) => { await p.goto(U + '?vorschau=normal#start'); await t(2200); await p.mouse.wheel(0, 700); await t(900); await p.mouse.wheel(0, 900); await t(1100); await p.evaluate(() => window.scrollTo({ top: 0 })); await t(400);
    await tipp(p, handy ? 'nav.leiste a[href="#kunden"]' : '.menue a[href="#kunden"]'); await t(1500); await tipp(p, '.zeile-kunde >> nth=1'); await t(1500); await tipp(p, '.zurueck'); await t(900);
    await tipp(p, handy ? 'nav.leiste a[href="#tools"]' : '.menue a[href="#tools"]'); await t(1400); await p.mouse.wheel(0, 800); await t(1200); await p.mouse.wheel(0, 800); await t(1400); });
  await film('02-kalender', async (p, t) => { await p.goto(U + '?vorschau=normal#termine'); await t(1800);
    await tipp(p, '[data-schritt="1"]'); await t(900); await tipp(p, '[data-schritt="-1"]'); await t(900);
    if (handy) { const m = new Date(Date.now() + 2 * 864e5).toLocaleDateString('sv-SE'); const x = await p.$(`.kal-woche [data-tag="${m}"]`); if (x) { await x.tap(); await t(900); } await tipp(p, '[data-neu-tag]'); await t(1200); await tipp(p, 'dialog.blatt [value=zu]'); await t(500); }
    else { await p.hover('.kal-chip >> nth=1'); await t(500); await p.click('.kal-chip >> nth=1'); await t(1400); await p.click('dialog.termin-detail [data-zu] >> nth=0'); await t(500); await p.hover('.kal-tag >> nth=17'); await t(600); await p.click('.kal-tag >> nth=17 >> .kal-neu', { position: { x: 70, y: 80 } }); await t(1300); await p.click('dialog.blatt [value=zu]'); await t(500); }
    await tipp(p, '[data-ansicht=liste]'); await t(1100); await tipp(p, '[data-ansicht=kalender]'); await t(900); await tipp(p, 'details.abo summary'); await t(900); });
  await film('03-einstieg', async (p, t) => { await p.goto(U + '?vorschau=normal&einstieg#start'); await t(2000);
    for (let i = 0; i < 2; i++) { await tipp(p, 'dialog.einstieg [data-e="1"]'); await t(1500); }
    await tipp(p, '[data-system=android]'); await t(1200); await tipp(p, '[data-system=iphone]'); await t(900); await tipp(p, 'dialog.einstieg [data-e="1"]'); await t(1500); await tipp(p, 'dialog.einstieg [data-e="-1"]'); await t(1000); await tipp(p, 'dialog.einstieg [data-e="1"]'); await t(800); await tipp(p, 'dialog.einstieg [data-e="1"]'); await t(1200); });
  await film('04-flyer-und-landingpage', async (p, t) => { await p.goto(U + '?vorschau=normal#flyer'); await t(2200);
    await tipp(p, '[data-foto=welle]'); await t(1300); await tipp(p, '[data-farbe=tuerkis]'); await t(1000); await tipp(p, '[data-foto=freunde]'); await t(1300); await tipp(p, '#vorschauen button'); await t(1500); await tipp(p, 'dialog.gross [data-zu]'); await t(600);
    await p.goto(U + '?vorschau=normal#tools/seite'); await t(1800); await p.locator('#f-seite input[name=telefon]').scrollIntoViewIfNeeded(); await p.type('#f-seite input[name=telefon]', '+49 170 555', { delay: 60 }); await t(700);
    await p.type('#f-seite input[name=termin]', 'https://calendly.com/anna', { delay: 30 }); await t(900); await tipp(p, '#f-seite [type=submit]'); await t(1500); });
  await b.close();
})();

// Rendert jede Folie aus folien.html als PNG (1920 x 1080) in den Ordner png/
// und (bei allen Folien) zusätzlich folien-k8.pdf mit einer Folie pro Seite.
// Aufruf:  node render.js            alle Folien
//          node render.js 01 04      nur bestimmte Folien
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
(async () => {
  const nur = process.argv.slice(2);
  const ziel = path.join(__dirname, "png"); fs.mkdirSync(ziel, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(__dirname, "folien.html"));
  await page.waitForFunction(() => window.fertig === true);
  for (const f of await page.$$("section.folie")) {
    const name = await f.getAttribute("data-datei");
    if (nur.length && !nur.some(n => name.startsWith("folie-" + n))) continue;
    await f.screenshot({ path: path.join(ziel, name + ".png") });
    console.log("png/" + name + ".png");
  }
  if (!nur.length) {   // PDF mit allen Folien
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: path.join(__dirname, "folien-k8.pdf"), width: "1920px", height: "1080px",
      printBackground: true, preferCSSPageSize: true });
    console.log("folien-k8.pdf");
  }
  await browser.close();
})();

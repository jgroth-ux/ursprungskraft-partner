// Rendert die Einblendungen aus einblendungen.html als PNG mit transparentem Hintergrund
// in den Ordner png-einblendungen/.  Aufruf:  node render-einblendungen.js
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
(async () => {
  const ziel = path.join(__dirname, "png-einblendungen"); fs.mkdirSync(ziel, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(__dirname, "einblendungen.html"));
  await page.waitForFunction(() => window.fertig === true);
  for (const e of await page.$$("section.einblendung")) {
    const name = await e.getAttribute("data-datei");
    await e.screenshot({ path: path.join(ziel, name + ".png"), omitBackground: true });
    console.log("png-einblendungen/" + name + ".png");
  }
  await browser.close();
})();

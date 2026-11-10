// Bewegung prüfen: längste Dauer je Ansicht, und ob bei "Bewegung reduzieren" wirklich nichts läuft
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const U = 'http://localhost:8766/partner/';
  const seiten = ['normal#start', 'normal#kunden', 'normal#kunden/k2', 'normal#termine', 'normal#tools', 'normal#tools/seite', 'normal#flyer', 'normal#wissen', 'normal#mehr', 'normal#konto', 'normal&einstieg=2#start', 'gesperrt#flyer', 'anmelden'];
  for (const [name, opt] of [['Bewegung normal', {}], ['Bewegung reduziert', { reducedMotion: 'reduce' }]]) {
    const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, ...opt })).newPage();
    let max = 0, wo = '', laufend = 0, schleifen = new Set();
    for (const s of seiten) {
      await p.goto(U + '?vorschau=' + s); await p.waitForTimeout(250);
      const r = await p.evaluate(() => { const ms = (x) => x.split(',').map((y) => (y.trim().endsWith('ms') ? parseFloat(y) : parseFloat(y) * 1000));
        let max = 0, wo = '', schleifen = [];
        for (const el of document.querySelectorAll('*')) for (const ps of [null, '::before', '::after']) { const c = getComputedStyle(el, ps);
          const an = c.animationName.split(',').map((x) => x.trim()), ad = ms(c.animationDuration), it = c.animationIterationCount.split(',').map((x) => x.trim());
          an.forEach((n, i) => { if (n === 'none') return; if (it[i % it.length] === 'infinite') { schleifen.push(n); return; } const d = ad[i % ad.length]; if (d > max) { max = d; wo = n + ' an .' + el.className; } });
          if (c.transitionProperty !== 'none') for (const d of ms(c.transitionDuration)) if (d > max) { max = d; wo = 'Übergang an .' + el.className; } }
        return { max, wo, schleifen: [...new Set(schleifen)], laufend: document.getAnimations().filter((a) => a.playState === 'running').length }; });
      if (r.max > max) { max = r.max; wo = s + ': ' + r.wo; } laufend += r.laufend; r.schleifen.forEach((x) => schleifen.add(x));
    }
    console.log(`${name}: ${seiten.length} Ansichten, längste einmalige Bewegung ${max} ms (${wo || 'keine'}), laufende Animationen kurz nach dem Laden zusammen: ${laufend}, Dauerschleifen: ${[...schleifen].join(', ') || 'keine'}`);
    await p.context().close();
  }
  await b.close();
})();

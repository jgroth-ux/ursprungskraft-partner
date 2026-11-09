// Bewegung für die neutrale Landingpage (10.10.2026): Überschrift Wort für Wort, Lichtschein
// folgt der Maus, Kopfzeile wird beim Scrollen zu Glas, Inhalte tauchen beim Scrollen auf,
// Zahlen beim Gerät zählen hoch. Wer weniger Bewegung eingestellt hat, sieht alles sofort.
(function () {
  const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Überschrift oben in Wörter teilen
  const h1 = document.querySelector('.hero .display');
  if (h1 && !ruhig) {
    let n = 0;
    // Zeilen bleiben erhalten, nur die Wörter darin werden einzeln eingeblendet
    h1.querySelectorAll('.zeile').forEach((z) => {
      z.innerHTML = z.textContent.trim().split(/\s+/).map((w) => `<span class="wort" style="--n:${n++}">${w}</span>`).join(' ');
    });
  }

  // Feine Körnung in die Bühne setzen
  const hero = document.querySelector('.hero');
  if (hero) hero.insertAdjacentHTML('afterbegin', '<div class="korn" aria-hidden="true"></div>');

  // Kopfzeile
  const kopf = document.querySelector('header');
  const kopfPruefen = () => kopf && kopf.classList.toggle('gescrollt', window.scrollY > 20);
  window.addEventListener('scroll', kopfPruefen, { passive: true });
  kopfPruefen();

  if (ruhig || !('IntersectionObserver' in window)) return;

  // Inhalte tauchen beim Scrollen auf, Geschwister leicht versetzt
  document.documentElement.classList.add('js-effekte');
  const gruppen = ['section:not(.hero) h2', 'section:not(.hero) .eyebrow', '.mosaik figure', '.versprechen > div', '.schritte > div', '.test > div',
    '.ablauf li', 'details', '.stimme', '.video', '.merkmale li', '.ueberleitung', '.zwei > *', '.geraet > *', 'form', '.hinweis'];
  const elemente = new Set();
  gruppen.forEach((sel) => $$(sel).forEach((el, i) => { el.style.setProperty('--i', i % 6); elemente.add(el); }));
  const beobachter = new IntersectionObserver((eintraege) => {
    eintraege.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('da'); beobachter.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  elemente.forEach((el) => { el.classList.add('auftauchen'); beobachter.observe(el); });

  // Die Wasserarten-Karten werden erst von wasserarten.js gezeichnet
  const karten = document.getElementById('karten');
  const kartenBeobachten = () => $$('#karten .karte').forEach((k, i) => {
    if (k.classList.contains('auftauchen')) return;
    k.style.setProperty('--i', i); k.classList.add('auftauchen'); beobachter.observe(k);
  });
  if (karten) { kartenBeobachten(); new MutationObserver(kartenBeobachten).observe(karten, { childList: true }); }

  // Zahlen beim Gerät hochzählen
  const zaehler = new IntersectionObserver((eintraege) => {
    eintraege.forEach((e) => {
      if (!e.isIntersecting) return;
      zaehler.unobserve(e.target);
      const el = e.target, ziel = parseInt(el.dataset.ziel, 10), zusatz = el.dataset.zusatz || '';
      const start = performance.now(), dauer = 1200;
      const schritt = (t) => {
        const p = Math.min(1, (t - start) / dauer), w = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ziel * w) + zusatz;
        if (p < 1) requestAnimationFrame(schritt);
      };
      requestAnimationFrame(schritt);
    });
  }, { threshold: 0.6 });
  $$('.merkmale b').forEach((b) => {
    const m = b.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    b.dataset.ziel = m[1]; b.dataset.zusatz = m[2]; b.textContent = '0' + m[2];
    zaehler.observe(b);
  });
})();

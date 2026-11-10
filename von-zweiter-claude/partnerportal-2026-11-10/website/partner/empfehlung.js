// Empfehlungsseiten einzelner Partner (Sportseite): Interessentenformular für das Gerät und E-Book.
// Nur wer echtes Interesse am Gerät hat, wird als Anfrage gespeichert und angerufen.
// Wer "erst mal umschauen" wählt, bekommt das E-Book und wird nicht angerufen.

const $ = (s) => document.querySelector(s);
const KURZ = document.body.dataset.kurz;
const VORNAME = document.body.dataset.vorname;
const BUDGET = { jetzt: 'Passt, will sich konkret informieren', bald: 'Eher in den nächsten Monaten', nein: 'Will sich erst mal umschauen' };
const STUFE = { jetzt: 'heiß', bald: 'warm' };
const LEADS = 'https://ngcbmpuqcqbelfoelwby.supabase.co/functions/v1/partner-lead';
const OEFFENTLICH = 'sb_publishable_XXX'; // derselbe öffentliche Schlüssel wie in dashboard/daten.js
const DEMO = new URLSearchParams(location.search).has('demo');
const sauber = (x) => String(x || '').trim().replace(/[<>&"]/g, '');

function buchZeigen(form, vorname) {
  form.innerHTML = `<div class="eyebrow">Danke, ${sauber(vorname)}</div><h3>Dein E-Book ist da</h3>
    <a class="knopf" href="../ebook/ebook-${KURZ}.pdf" target="_blank" rel="noopener">E-Book öffnen</a>`;
}

// Speichert den Lead und meldet ihn in die Telegram-Gruppe. Mit ?demo bleibt alles im Browser.
async function melden(lead) {
  if (DEMO) return;
  const r = await fetch(LEADS, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OEFFENTLICH}`, apikey: OEFFENTLICH }, body: JSON.stringify({ von: KURZ, ...lead }) });
  if (!r.ok) throw new Error('Lead nicht gespeichert');
}

function budgetWahl() {
  const b = new FormData($('#anfrage')).get('budget');
  $('#umschauen').hidden = b !== 'nein';
  $('#senden').textContent = b === 'nein' ? 'E-Book holen' : 'Ich interessiere mich für das Gerät';
}

async function senden(e) {
  e.preventDefault();
  const f = e.target, w = Object.fromEntries(new FormData(f).entries());
  const fehler = $('#fehler');
  const t = (x) => String(x || '').trim();
  if (!w.interesse || !w.geraet || !w.budget) return (fehler.textContent = 'Bitte beantworte die drei Fragen oben.');
  if (!t(w.vorname) || !t(w.nachname)) return (fehler.textContent = 'Bitte trag deinen Vor- und Nachnamen ein.');
  if (t(w.telefon).replace(/\D/g, '').length < 6) return (fehler.textContent = 'Bitte trag deine Telefonnummer ein, damit wir dich anrufen können.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t(w.email))) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
  if (!w.ok) return (fehler.textContent = 'Bitte bestätige noch, dass wir deine Angaben speichern und dich anrufen dürfen.');
  fehler.textContent = '';
  // Wer nur umschauen will, wird gespeichert, aber nicht angerufen, und bekommt das E-Book.
  const kontakt = { vorname: t(w.vorname), nachname: t(w.nachname), email: t(w.email), telefon: t(w.telefon), erreichbar: t(w.erreichbar), ort: t(w.ort), land: w.land };
  const antworten = { interesse: w.interesse, geraet: w.geraet, budget: w.budget, budget_text: BUDGET[w.budget] };
  if (w.budget === 'nein') {
    melden({ ...kontakt, quelle: 'umschauen', antworten }).catch(() => {});
    return buchZeigen(f, w.vorname);
  }
  const nachricht = [
    `Lead von ${VORNAME} (${STUFE[w.budget]})`,
    `Interesse: ${w.interesse}`,
    `Trinkt heute: ${w.geraet}`,
    `Budget: ${BUDGET[w.budget]}`,
  ].join(' · ');
  try {
    await melden({ ...kontakt, quelle: 'formular', antworten, nachricht });
    f.innerHTML = `<div class="eyebrow">Danke, ${sauber(w.vorname)}</div><h3>Deine Anfrage ist angekommen</h3>
      <p style="color:var(--muted);margin:0">Wir melden uns persönlich bei dir. Bis dahin kannst du dir weiter unten mein E-Book holen.</p>`;
  } catch (err) {
    fehler.textContent = 'Das hat gerade nicht geklappt. Bitte versuch es noch einmal.';
  }
}

// E-Book: Kontakte von hier werden gespeichert, aber nicht angerufen.
function buchSenden(e) {
  e.preventDefault();
  const w = Object.fromEntries(new FormData(e.target).entries());
  const fehler = $('#buchfehler');
  if (!String(w.vorname || '').trim()) return (fehler.textContent = 'Bitte trag deinen Vornamen ein.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(w.email || '').trim())) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
  fehler.textContent = '';
  melden({ vorname: String(w.vorname).trim(), email: String(w.email).trim(), quelle: 'ebook' }).catch(() => {});
  buchZeigen(e.target, w.vorname);
}

// Trinkrechner: 40 ml je kg, Sechserträger mit 1,5-Liter-Flaschen (9 Liter)
function rechnen() {
  const kg = Math.min(200, Math.max(30, Number($('#kg').value) || 0));
  const l = kg * 0.04, jahr = Math.round(l * 365 / 10) * 10;
  $('#liter').textContent = l.toFixed(1).replace('.', ',');
  $('#jahr').textContent = `Das sind rund ${jahr.toLocaleString('de-DE')} Liter im Jahr. In 1,5-Liter-Flaschen wären das ${Math.round(l * 365 / 9)} Sechserträger zum Schleppen.`;
}
$('#kg').addEventListener('input', rechnen);

$('#anfrage').addEventListener('change', budgetWahl);
$('#anfrage').onsubmit = senden;
$('#buchform').onsubmit = buchSenden;

// Effekte (07.11.2026): Einblenden beim Scrollen, Zahlen zählen hoch, Knopf am Handy.
// Ohne JavaScript oder mit "Bewegung reduzieren" ist alles sofort sichtbar.
(function effekte() {
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const zahlen = document.querySelectorAll('[data-zahl]');
  const zaehlen = (el) => {
    const ziel = Number(el.dataset.zahl), start = performance.now(), dauer = 1400;
    const schritt = (jetzt) => {
      const t = Math.min(1, (jetzt - start) / dauer), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ziel * e).toLocaleString('de-DE');
      if (t < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  };
  if (!ruhig && 'IntersectionObserver' in window) {
    const teile = document.querySelectorAll('section:not(.hero) h2, section:not(.hero) .eyebrow, section:not(.hero) .gross, .kachel, .videos > div, .video.hoch, .rechner, .arten li, .ablauf li, .zitat blockquote, .zitat .wer, img.buch, .zahl');
    teile.forEach((el) => {
      el.classList.add('auf');
      const geschwister = [...el.parentElement.children].filter((k) => k.matches('.kachel, .arten li, .ablauf li, .zahl, .videos > div'));
      const i = geschwister.indexOf(el);
      if (i > 0) el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
    });
    const beob = new IntersectionObserver((eintraege) => eintraege.forEach((x) => {
      if (!x.isIntersecting) return;
      x.target.classList.add('da');
      x.target.querySelectorAll('[data-zahl]').forEach(zaehlen);
      beob.unobserve(x.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    teile.forEach((el) => beob.observe(el));
    zahlen.forEach((el) => { el.textContent = '0'; });
  }
  // Kopfleiste bekommt beim Scrollen einen Schatten, der Handy-Knopf erscheint nach dem ersten Bildschirm
  // und verschwindet, solange ein Formular im Bild ist.
  const kopf = document.querySelector('header'), knopf = document.querySelector('.handyknopf');
  const formulare = [...document.querySelectorAll('#interesse, #ebook')];
  let imFormular = false;
  if ('IntersectionObserver' in window) {
    const fb = new IntersectionObserver((e) => { imFormular = formulare.some((f) => f._sichtbar = (e.find((x) => x.target === f)?.isIntersecting ?? f._sichtbar)); lage(); });
    formulare.forEach((f) => fb.observe(f));
  }
  function lage() {
    kopf.classList.toggle('gescrollt', scrollY > 10);
    knopf.classList.toggle('zeigen', scrollY > innerHeight * 0.8 && !imFormular);
  }
  addEventListener('scroll', lage, { passive: true });
  lage();
})();

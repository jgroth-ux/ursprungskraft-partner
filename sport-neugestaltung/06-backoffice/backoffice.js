// Backoffice für Sportpartner: Anmeldungen über die eigene Landingpage.
// VORSCHAU: Beispieldaten im Browser, keine echte Anmeldung. Für den Echtbetrieb wird nur die Datenquelle
// (QUELLE) ersetzt: Supabase Auth für das Login, eine Abfrage, die per Row Level Security nur die
// Anmeldungen des angemeldeten Partners liefert, ohne Telefon und E-Mail.

const $ = (s) => document.querySelector(s);
const esc = (x) => String(x ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Sportpartner. Weitere einfach ergänzen (dieselben Werte wie in partner.json).
const PARTNER = {
  kevin: { name: 'Kevin Wolter', rolle: 'Bodybuilder', foto: '../01-landingpage/bilder/partner/kevin.webp', seite: 'https://mein.ursprungskraft.net/partner/kevin/' },
  johny: { name: 'Johny Yusupov', rolle: 'MMA-Fighter', foto: '../01-landingpage/bilder/partner/johny.webp', seite: 'https://mein.ursprungskraft.net/partner/johny/' },
};

// Stand einer Anmeldung, so wie ihn der Partner sieht
const STAND = {
  neu: 'Neu',
  kontakt: 'Team hat sich gemeldet',
  beratung: 'In Beratung',
  gekauft: 'Gerät gekauft',
  kein: 'Kein Interesse',
  ebook: 'E\u2011Book geschickt',
};
const WUNSCH = { geraet: 'Gerät kennenlernen', ebook: 'E\u2011Book' };

// ---------- Beispieldaten (nur Vorschau) ----------
function beispiel(kurz) {
  let s = kurz === 'kevin' ? 7 : 13;
  const zufall = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const wahl = (a) => a[Math.floor(zufall() * a.length)];
  const vornamen = ['Lukas', 'Anna', 'Jonas', 'Lea', 'Tim', 'Sarah', 'Felix', 'Laura', 'Max', 'Julia', 'Paul', 'Lisa', 'Leon', 'Nina', 'Ben', 'Marie', 'David', 'Sophie', 'Elias', 'Hannah', 'Noah', 'Emma', 'Jan', 'Mia', 'Tobias', 'Lena'];
  const orte = [['Hamburg', 'DE'], ['Berlin', 'DE'], ['München', 'DE'], ['Köln', 'DE'], ['Stuttgart', 'DE'], ['Leipzig', 'DE'], ['Dortmund', 'DE'], ['Wien', 'AT'], ['Graz', 'AT'], ['Zürich', 'CH'], ['Basel', 'CH'], ['Bern', 'CH'], ['Bremen', 'DE'], ['Hannover', 'DE']];
  const anzahl = kurz === 'kevin' ? 64 : 31;
  const heute = new Date(); heute.setHours(12, 0, 0, 0);
  const liste = [];
  for (let i = 0; i < anzahl; i++) {
    const tageZurueck = Math.floor(Math.pow(zufall(), 1.6) * 70);
    const d = new Date(heute); d.setDate(d.getDate() - tageZurueck);
    const wunsch = zufall() < 0.55 ? 'geraet' : 'ebook';
    let stand = 'ebook';
    if (wunsch === 'geraet') {
      if (tageZurueck <= 1) stand = 'neu';
      else if (tageZurueck <= 6) stand = wahl(['neu', 'kontakt', 'kontakt']);
      else stand = wahl(['kontakt', 'beratung', 'beratung', 'gekauft', 'kein']);
    }
    const [ort, land] = wahl(orte);
    liste.push({ datum: d.toISOString().slice(0, 10), vorname: wahl(vornamen), initial: String.fromCharCode(65 + Math.floor(zufall() * 26)), ort, land, wunsch, stand });
  }
  return liste.sort((a, b) => b.datum.localeCompare(a.datum));
}

const QUELLE = {
  vorschau: true,
  async anmelden() { throw new Error('In der Vorschau gibt es noch keine echte Anmeldung. Wähle unten Kevin oder Johny.'); },
  async anmeldungen(kurz) { return beispiel(kurz); },
};

// ---------- Darstellung ----------
const datumKurz = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
const wochentag = (d) => d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
let alle = [], filter = 'alle', allesZeigen = false;

async function oeffnen(kurz) {
  const p = PARTNER[kurz];
  if (!p) return;
  document.body.dataset.wer = kurz;
  $('#anmeldung').hidden = true;
  $('#app').hidden = false;
  $('#kopf-name').textContent = p.name;
  $('#kopf-rolle').textContent = p.rolle;
  $('#seite-foto').src = p.foto;
  $('#seite-link').href = p.seite;
  $('#dock-seite').href = p.seite;
  document.title = `Backoffice · ${p.name}`;
  alle = await QUELLE.anmeldungen(kurz);
  zahlen();
  woche();
  liste();
}

function zahlen() {
  const geraet = alle.filter((a) => a.wunsch === 'geraet');
  const vor7 = new Date(); vor7.setDate(vor7.getDate() - 6); const grenze = vor7.toISOString().slice(0, 10);
  const woche = alle.filter((a) => a.datum >= grenze).length;
  $('#z-gesamt').textContent = alle.length.toLocaleString('de-DE');
  $('#z-woche-text').innerHTML = woche ? `<b>${woche} neue</b> in den letzten 7 Tagen` : 'In den letzten 7 Tagen noch keine neuen';
  $('#z-stand').textContent = `Stand heute, ${new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  $('#z-geraet').textContent = geraet.length;
  $('#z-ebook').textContent = alle.length - geraet.length;
  $('#z-gekauft').textContent = alle.filter((a) => a.stand === 'gekauft').length;
}

function woche() {
  const tage = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - i); tage.push(d); }
  const werte = tage.map((d) => alle.filter((a) => a.datum === d.toISOString().slice(0, 10)).length);
  const max = Math.max(1, ...werte);
  const box = $('#balken');
  box.setAttribute('aria-label', 'Anmeldungen der letzten 7 Tage: ' + tage.map((d, i) => `${wochentag(d)} ${werte[i]}`).join(', '));
  box.innerHTML = tage.map((d, i) => `<div class="tag${i === 6 ? ' heute' : ''}" tabindex="0" data-text="${esc(d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }))}: ${werte[i]} ${werte[i] === 1 ? 'Anmeldung' : 'Anmeldungen'}">
      <b>${werte[i] || ''}</b><i style="height:${Math.max(6, Math.round((werte[i] / max) * 100))}%"></i><small>${i === 6 ? 'Heute' : esc(wochentag(d))}</small></div>`).join('');
  const tip = $('#tooltip'), feld = box.parentElement;
  box.querySelectorAll('.tag').forEach((t) => {
    const zeigen = () => {
      tip.textContent = t.dataset.text; tip.hidden = false;
      const r = t.getBoundingClientRect(), f = feld.getBoundingClientRect();
      const links = Math.min(Math.max(8, r.left - f.left + r.width / 2 - tip.offsetWidth / 2), f.width - tip.offsetWidth - 8);
      tip.style.left = links + 'px'; tip.style.top = (r.top - f.top - 8) + 'px';
    };
    t.addEventListener('mouseenter', zeigen); t.addEventListener('focus', zeigen);
    t.addEventListener('mouseleave', () => { tip.hidden = true; }); t.addEventListener('blur', () => { tip.hidden = true; });
  });
}

function liste() {
  const treffer = alle.filter((a) => filter === 'alle' || (filter === 'gekauft' ? a.stand === 'gekauft' : a.wunsch === filter));
  const zeigen = allesZeigen ? treffer : treffer.slice(0, 12);
  $('#zeilen').innerHTML = zeigen.length ? zeigen.map((a) => `<tr>
      <td class="datum">${esc(datumKurz(a.datum))}</td>
      <td class="name">${esc(a.vorname)} ${esc(a.initial)}.</td>
      <td class="ort">${esc(a.ort)}, ${esc(a.land)}</td>
      <td class="wunsch">${esc(WUNSCH[a.wunsch])}</td>
      <td class="stand"><span class="chip ${esc(a.stand)}">${esc(STAND[a.stand])}</span></td></tr>`).join('')
    : '<tr><td colspan="5" class="leer">Hier ist noch niemand.</td></tr>';
  $('#mehr').hidden = allesZeigen || treffer.length <= 12;
  $('#mehr').textContent = `Alle ${treffer.length} zeigen`;
}

document.querySelectorAll('.filter button').forEach((b) => b.addEventListener('click', () => {
  filter = b.dataset.filter; allesZeigen = false;
  document.querySelectorAll('.filter button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  liste();
}));
$('#mehr').addEventListener('click', () => { allesZeigen = true; liste(); });

// ---------- Anmeldung ----------
$('#login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const w = Object.fromEntries(new FormData(e.target).entries());
  const fehler = $('#login-fehler');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(w.email || '').trim())) return (fehler.textContent = 'Bitte prüf deine E-Mail-Adresse.');
  if (!w.passwort) return (fehler.textContent = 'Bitte gib dein Passwort ein.');
  try { fehler.textContent = ''; await QUELLE.anmelden(w.email, w.passwort); } catch (err) { fehler.textContent = err.message; }
});
$('#vergessen').addEventListener('click', () => { $('#login-fehler').textContent = 'In der Vorschau gibt es noch keinen Versand. Im Echtbetrieb kommt hier eine Mail zum Zurücksetzen.'; });
document.querySelectorAll('#demo-wahl [data-wer]').forEach((b) => b.addEventListener('click', () => { history.replaceState(null, '', '?wer=' + b.dataset.wer); oeffnen(b.dataset.wer); }));
$('#abmelden').addEventListener('click', () => { history.replaceState(null, '', location.pathname); $('#app').hidden = true; $('#anmeldung').hidden = false; delete document.body.dataset.wer; });

$('#hinweis-demo').hidden = !QUELLE.vorschau;
$('#demo-wahl').hidden = !QUELLE.vorschau;
const start = new URLSearchParams(location.search).get('wer');
if (start && PARTNER[start]) oeffnen(start);

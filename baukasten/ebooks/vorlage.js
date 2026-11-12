// Baut ein E-Book als A4-Seiten im Browser: vorlage.html?buch=<id>&modus=hell|dunkel&akzent=<name>
// Inhalt aus inhalt.mjs, Farben aus /p/farben.js. werkzeuge/ebooks-bauen.mjs druckt daraus die PDF-Vorlagen
// und misst die freien Felder (data-slot) für den Eindruck beim Abruf.
// Zum Ansehen im Browser: &felder zeigt die freien Felder gestrichelt, &probe füllt sie mit Beispieldaten.
import { BUECHER, ARTEN, RECHTLICHES, THEMEN } from './inhalt.mjs';

const q = new URLSearchParams(location.search);
const buch = BUECHER.find((b) => b.id === q.get('buch')) || BUECHER[0];
const F = window.UKFarben;
const wahl = F.pruefen({ modus: q.get('modus'), akzent: q.get('akzent') }, buch.thema);
F.anwenden(document.documentElement, wahl.modus, wahl.akzent);
// Rückseite immer dunkel, Akzentschrift darauf in der hellen Fassung
document.documentElement.style.setProperty('--dunkel-rueck', wahl.modus === 'hell' ? '#2F3524' : '#23272A');
document.documentElement.style.setProperty('--ak-d-dunkel', F.AKZENTE[wahl.akzent].kleinDunkel);
document.title = `${buch.titel} (${wahl.modus}, ${wahl.akzent})`;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slot = (typ, klasse = '') => `<div class="slot-${typ} ${klasse}" data-slot="${typ}"></div>`;
let nr = 0;
const fuss = () => `<div class="fuss"><span>${esc(buch.titel)}</span><span>${++nr}</span></div>`;

function block(b) {
  if (b.p) return `<p>${esc(b.p)}</p>`;
  if (b.liste) return `<ul class="liste">${b.liste.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (b.check) return `<ul class="check">${b.check.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (b.box) return `<div class="box"><h3>${esc(b.box.titel)}</h3><p>${esc(b.box.text)}</p></div>`;
  if (b.hinweis) return `<div class="hinweis"><h3>${esc(b.hinweis.titel)}</h3><p>${esc(b.hinweis.text)}</p></div>`;
  if (b.bild) return `<div class="bild"><img src="${esc(b.bild.src)}" alt="${esc(b.bild.alt)}"></div>`;
  if (b.quelle) return `<p class="quelle">${esc(b.quelle)}</p>`;
  if (b.arten) return `<div class="arten">${ARTEN.map(([ph, name, text]) => `<div><b>pH ${esc(ph)}<small>${esc(name)}</small></b><span>${esc(text)}</span></div>`).join('')}</div>`;
  if (b.tabelle) return `<table><thead><tr>${b.tabelle.kopf.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${b.tabelle.zeilen.map((z) => `<tr>${z.map((x) => `<td>${x === '☐' ? '<span class="kaestchen"></span>' : esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  // Kasten am Kapitelende: die ganze Fläche wird beim Abruf ein Link auf die Seite des Partners
  if (b.weiter) return `<div class="weiter" data-slot="cta"><span>${esc(b.weiter)}</span><b>Zur Seite</b></div>`;
  return '';
}

const seiten = [];
// 1 Titelseite
seiten.push(`<section class="seite titel"><span class="marke-band"></span>
  <span class="eyebrow">${esc(buch.eyebrow)}</span>
  <div class="titelbild"><img src="${esc(buch.cover)}" alt=""></div>
  <h1>${esc(buch.titel)}</h1><p class="unter">${esc(buch.untertitel)}</p>
  <div class="unten"><span class="ratgeber">Kein medizinischer Ratgeber</span></div></section>`);
// 2 Empfohlen von
seiten.push(`<section class="seite empf">
  <div class="kopf">${slot('foto')}<div class="wer"><span class="eyebrow">Empfohlen von</span>${slot('name')}${slot('rolle')}</div></div>
  <h2>Warum ich dir das empfehle</h2>${slot('brief')}
  <div class="kontaktbox"><span class="eyebrow">So erreichst du mich</span>${slot('kontakt')}</div>
  <p class="ratgeber"><b>Kein medizinischer Ratgeber.</b> Dieses E-Book informiert über das Gerät und seine Anwendung im Alltag. Bei Fragen zu deiner Gesundheit sprich mit deinem Arzt oder Therapeuten.</p>
  ${fuss()}</section>`);
// Inhaltsseiten
for (const s of buch.seiten) {
  seiten.push(`<section class="seite inhalt"><div class="kapitelkopf"><span class="nr">${esc(s.kapitel)}</span>
    <div><span class="eyebrow">Kapitel ${esc(s.kapitel)}</span><h2>${esc(s.titel)}</h2>${s.intro ? `<p class="intro">${esc(s.intro)}</p>` : ''}</div></div>
    <div class="koerper">${s.bloecke.map(block).join('')}</div>${fuss()}</section>`);
}
// So geht es weiter
seiten.push(`<section class="seite weiterseite"><div class="bild"><img src="/ebooks/bilder/gespraech.jpg" alt="Zwei Menschen im Gespräch am Küchentisch, jeder mit einem Glas Wasser"></div>
  <span class="eyebrow">So geht es weiter</span><h2>${esc(buch.weiterTitel)}</h2><p class="text">${esc(buch.weiterText)}</p>
  <ol><li><b>Seite öffnen</b>Scan den Code oder tipp auf den Link.</li><li><b>Kurz eintragen</b>Drei Fragen, dann deine Kontaktdaten.</li><li><b>Kennenlernen</b>Wir melden uns und zeigen dir das Gerät persönlich.</li></ol>
  <div class="zugang">${slot('qr')}<div><span class="eyebrow">Deine Seite</span><h3>Lern das Gerät persönlich kennen</h3>${slot('link')}${slot('weiter-name')}${slot('weiter-kontakt')}</div></div>
  ${fuss()}</section>`);
// Rückseite
seiten.push(`<section class="seite rueck"><p class="gross">Gutes Wasser. <span>Jeden Tag, direkt aus deinem Hahn.</span></p>
  ${slot('rueck-name')}<p class="recht">${esc(RECHTLICHES)}</p></section>`);

document.getElementById('buch').innerHTML = seiten.join('');
if (q.has('felder')) document.body.classList.add('felder-zeigen');

// Fertig, wenn Schriften und Bilder geladen sind (das Werkzeug wartet darauf)
await document.fonts.ready;
await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
window.BUCH = { id: buch.id, thema: buch.thema, themaName: THEMEN[buch.thema], modus: wahl.modus, akzent: wahl.akzent };
window.FERTIG = true;

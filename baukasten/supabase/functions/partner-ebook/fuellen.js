// Füllt eine fertige E-Book-Vorlage (PDF aus werkzeuge/ebooks-bauen.mjs) mit den Angaben des Partners (12.11.2026).
// Die Vorlage hat freie Felder. Wo sie liegen, wie groß und in welcher Schrift und Farbe, steht in der Lage-Datei
// (gleicher Name, .json). Reines JavaScript, läuft in der Edge Function (Deno) und lokal (Node).
// pdf-lib, fontkit und qrcode-generator werden von außen hineingegeben.
//
// Felder: titel-name, foto, name, rolle, satz, intro, kontakt, qr, link, weiter-name, weiter-kontakt, rueck-name, cta.
// Telefon und E-Mail stehen nur drin, wenn der Partner sie freigegeben hat (partner.telefon / partner.email gesetzt).

export async function fuellen({ PDFLib, fontkit, qrcode, vorlage, lage, schriften = {}, foto, partner, link }) {
  const { PDFDocument, StandardFonts, rgb, PDFString, PDFName, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } = PDFLib;
  const doc = await PDFDocument.load(vorlage);
  doc.registerFontkit(fontkit);
  const laden = async (bytes, ersatz) => (bytes ? doc.embedFont(bytes, { subset: true }) : doc.embedFont(ersatz));
  const SCHRIFT = {
    kopf: await laden(schriften.jost, StandardFonts.Helvetica),
    text: await laden(schriften.inter, StandardFonts.Helvetica),
    fett: await laden(schriften.interFett, StandardFonts.HelveticaBold),
  };
  const farbe = (hex) => { const h = String(hex || '#2A2C22').replace('#', ''); return rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255); };
  const seiten = doc.getPages();
  const vorname = partner.vorname || '';
  const name = `${partner.vorname || ''} ${partner.nachname || ''}`.trim();
  const insta = String(partner.insta || '').replace(/^@/, '');
  const tel = String(partner.telefon || '').trim(), mail = String(partner.email || '').trim();
  const linkText = String(link || '').replace(/^https?:\/\//, '');

  function verweis(page, url, x, y, w, h) {
    const a = doc.context.register(doc.context.obj({ Type: 'Annot', Subtype: 'Link', Rect: [x, y, x + w, y + h], Border: [0, 0, 0], A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) } }));
    const alt = page.node.lookup(PDFName.of('Annots'));
    if (alt) alt.push(a); else page.node.set(PDFName.of('Annots'), doc.context.obj([a]));
  }
  // Text mit Umbruch in ein Feld, oben beginnend. Gibt die genutzte Höhe zurück.
  function text(page, s, f, inhalt, opt = {}) {
    const font = SCHRIFT[opt.schrift || f.schrift] || SCHRIFT.text, groesse = opt.groesse || f.groesse, zeile = opt.zeile || f.zeile || groesse * 1.3;
    const zeilen = [];
    for (const absatz of String(inhalt).split('\n')) {
      let z = '';
      for (const w of absatz.split(/\s+/).filter(Boolean)) {
        const probe = z ? `${z} ${w}` : w;
        if (font.widthOfTextAtSize(probe, groesse) > f.w && z) { zeilen.push(z); z = w; } else z = probe;
      }
      zeilen.push(z);
    }
    let y = f.y + f.h - groesse * 0.95;
    for (const z of zeilen) {
      if (y < f.y - 1) break; // Feld voll
      page.drawText(z, { x: f.x, y, size: groesse, font, color: farbe(opt.farbe || f.farbe) });
      y -= zeile;
    }
    return zeilen.length * zeile;
  }

  for (const f of lage.felder) {
    const page = seiten[f.seite]; if (!page) continue;
    switch (f.typ) {
      case 'titel-name': text(page, null, f, `Empfohlen von ${name}`); break;
      case 'rueck-name': text(page, null, f, `Empfohlen von ${name}`); break;
      case 'name': text(page, null, f, name); break;
      case 'rolle': if (partner.rolle) text(page, null, f, partner.rolle); break;
      case 'satz': if (partner.satz) text(page, null, f, `„${partner.satz}“`); break;
      case 'intro':
        text(page, null, f, `Dieses E-Book hast du von ${vorname} bekommen. Lies es in Ruhe, so oft du magst. Wenn du Fragen hast oder das Gerät persönlich kennenlernen möchtest, melde dich direkt bei ${vorname}.`);
        break;
      case 'kontakt': case 'weiter-kontakt': {
        const zeilen = [tel && `Telefon: ${tel}`, mail && `E-Mail: ${mail}`, insta && `Instagram: @${insta}`, f.typ === 'kontakt' && link && `Seite: ${linkText}`].filter(Boolean);
        text(page, null, f, zeilen.join('\n'));
        const zh = f.zeile || f.groesse * 1.4; let y = f.y + f.h - zh;
        for (const z of zeilen) {
          const url = z.startsWith('Telefon') ? `tel:${tel.replace(/[^\d+]/g, '')}` : z.startsWith('E-Mail') ? `mailto:${mail}` : z.startsWith('Instagram') ? `https://www.instagram.com/${insta}/` : link;
          verweis(page, url, f.x, y, f.w, zh); y -= zh;
        }
        break;
      }
      case 'weiter-name': text(page, null, f, tel || mail ? `Oder melde dich direkt bei ${name}:` : `Empfohlen von ${name}`); break;
      case 'link': if (link) { text(page, null, f, linkText); verweis(page, link, f.x, f.y, f.w, f.h); } break;
      case 'cta': if (link) verweis(page, link, f.x, f.y, f.w, f.h); break;
      case 'qr': if (link && qrcode) {
        const q = qrcode(0, 'M'); q.addData(link); q.make();
        const n = q.getModuleCount(), rand = 2, zelle = Math.min(f.w, f.h) / (n + rand * 2);
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) {
          page.drawRectangle({ x: f.x + (c + rand) * zelle, y: f.y + f.h - (r + rand + 1) * zelle, width: zelle + 0.05, height: zelle + 0.05, color: farbe(f.farbe) });
        }
        verweis(page, link, f.x, f.y, f.w, f.h);
      } break;
      case 'foto': {
        if (foto) {
          const bild = await doc.embedJpg(foto);
          const s = Math.max(f.w / bild.width, f.h / bild.height), w = bild.width * s, h = bild.height * s;
          page.pushOperators(pushGraphicsState(), rectangle(f.x, f.y, f.w, f.h), clip(), endPath());
          page.drawImage(bild, { x: f.x + (f.w - w) / 2, y: f.y + (f.h - h) / 2, width: w, height: h });
          page.pushOperators(popGraphicsState());
        } else {
          page.drawRectangle({ x: f.x, y: f.y, width: f.w, height: f.h, color: farbe(lage.farben.akKnopf) });
          const ini = `${(partner.vorname || ' ')[0]}${(partner.nachname || ' ')[0]}`.trim().toUpperCase(), g = f.w * 0.36;
          page.drawText(ini, { x: f.x + (f.w - SCHRIFT.kopf.widthOfTextAtSize(ini, g)) / 2, y: f.y + f.h / 2 - g * 0.36, size: g, font: SCHRIFT.kopf, color: rgb(1, 1, 1) });
        }
        break;
      }
    }
  }
  doc.setTitle(`${lage.titel}, empfohlen von ${name}`);
  doc.setAuthor(name);
  doc.setProducer('Baukasten Partnerseiten');
  return doc.save();
}

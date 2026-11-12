// partner-ebook (11.11.2026, E-Book-Bibliothek 12.11.2026): personalisiertes E-Book beim Abruf.
// Aufrufe (über Netlify, website/_redirects):
//   /p/<adresse>/<fassung>/e-book   ->  /functions/v1/partner-ebook/<adresse>/<fassung>       das E-Book, das diese Seite anbietet
//   /p/<adresse>/e-book/<buch>      ->  /functions/v1/partner-ebook/<adresse>/buch/<buch>     ein bestimmtes E-Book aus der Bibliothek
// Ablauf: Angaben des Partners über uk_seite_oeffentlich() (dieselben wie die Seite, Telefon und E-Mail nur mit Freigabe).
// Das E-Book kommt im Look der passenden Seite des Partners: Sport-Bücher im Look seiner Sportseite usw. Hat er diese
// Seite nicht, im Look seiner ersten Seite. Vorlage aus dem Speicher (partner-ebooks/vorlagen/<buch>/<modus>-<akzent>.pdf
// plus .json), gebaut mit werkzeuge/ebooks-bauen.mjs. Fehlt der Look, nimmt sie den Vorschlags-Look des Buches.
// Fehlen Vorlagen ganz, kommt die alte Platzhalter-Fassung mit eingefügter Seite "Empfohlen von" (empfohlen.js).
// WICHTIG: ohne "Verify JWT" deployen (supabase functions deploy partner-ebook --no-verify-jwt).
import * as PDFLib from 'npm:pdf-lib@1.17.1';
import fontkit from 'npm:@pdf-lib/fontkit@1.1.1';
import qrcode from 'npm:qrcode-generator@1.4.4';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { personalisieren } from './empfohlen.js';
import { fuellen } from './fuellen.js';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const FASSUNGEN = ['neutral', 'sport', 'gesundheit'];
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const URL_SB = Deno.env.get('SUPABASE_URL')!;
const db = createClient(URL_SB, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const FOTO_PFAD = `${URL_SB}/storage/v1/object/public/partner-seiten/`;

// Dateien aus dem Speicher bleiben im Speicher der Funktion, solange sie warm ist
const ablage = new Map<string, Uint8Array | null>();
async function datei(pfad: string): Promise<Uint8Array | null> {
  if (ablage.has(pfad)) return ablage.get(pfad)!;
  const { data, error } = await db.storage.from('partner-ebooks').download(pfad);
  const bytes = error || !data ? null : new Uint8Array(await data.arrayBuffer());
  ablage.set(pfad, bytes);
  return bytes;
}
const json = async (pfad: string) => { const b = await datei(pfad); return b ? JSON.parse(new TextDecoder().decode(b)) : null; };

const seite = (titel: string, text: string, status: number) => new Response(
  `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
  <title>${titel}</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#F5F1E8;color:#2A2C22;font:16px/1.6 system-ui,sans-serif;padding:24px;text-align:center">
  <div><h1 style="font-weight:500;font-size:28px;margin:0 0 8px">${titel}</h1><p style="margin:0;color:#5F6152">${text}</p></div></body></html>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

Deno.serve(async (req) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('nur GET', { status: 405 });
  const u = new URL(req.url);
  const teile = u.pathname.split('/').filter(Boolean);
  const i = teile.indexOf('partner-ebook');
  const adresse = (u.searchParams.get('adresse') || teile[i + 1] || '').toLowerCase();
  const perBuch = teile[i + 2] === 'buch';
  let buchId = (u.searchParams.get('buch') || (perBuch ? teile[i + 3] : '') || '').toLowerCase();
  const fassungAngefragt = perBuch ? '' : (u.searchParams.get('fassung') || teile[i + 2] || 'neutral').toLowerCase();
  if (!NAME.test(adresse) || adresse.length > 40 || (buchId && !NAME.test(buchId)) || (!perBuch && !FASSUNGEN.includes(fassungAngefragt))) {
    return seite('Dieses E-Book gibt es nicht.', 'Bitte prüf den Link.', 404);
  }

  const katalog: Json = await json('vorlagen/katalog.json');
  const buch: Json = katalog?.buecher?.find((b: Json) => b.id === buchId);
  if (perBuch && katalog && !buch) return seite('Dieses E-Book gibt es nicht.', 'Bitte prüf den Link.', 404);
  // Für den Look zählt die Seite zum Thema des Buches, beim Seiten-Link die angefragte Seite
  const fassungLook = buch?.thema || fassungAngefragt || 'neutral';

  const { data: p, error } = await db.rpc('uk_seite_oeffentlich', { p_adresse: adresse, p_fassung: fassungLook });
  if (error) { console.error('partner-ebook lesen', error); return seite('Das hat gerade nicht geklappt.', 'Bitte versuch es gleich noch einmal.', 500); }
  if (!p) return seite('Dieses E-Book gibt es gerade nicht.', 'Frag am besten direkt bei der Person nach, die dir den Link geschickt hat.', 404);
  // Seiten-Link: das E-Book, das der Partner für diese Seite gewählt hat, sonst der Vorschlag
  if (!perBuch) buchId = (katalog?.buecher?.some((b: Json) => b.id === p.ebook) ? p.ebook : katalog?.standard?.[p.fassung]) || '';

  try {
    const [jost, inter, interFett] = await Promise.all([datei('schriften/Jost-Medium.ttf'), datei('schriften/Inter-Regular.ttf'), datei('schriften/Inter-SemiBold.ttf')]);
    let foto: Uint8Array | null = null;
    if (typeof p.foto === 'string' && p.foto.startsWith(FOTO_PFAD)) { // nur aus dem eigenen Speicher laden
      const r = await fetch(p.foto); if (r.ok) foto = new Uint8Array(await r.arrayBuffer());
    }
    // Kurzer Link (12.11.2026): wasseristmehr.com/<adresse> für die Hauptseite, sonst /<adresse>/<fassung>.
    // Startseite (p.marke): nur die Domain.
    const link = p.marke ? p.basis : p.fassung === p.haupt ? `${p.basis}/${p.adresse}` : `${p.basis}/${p.adresse}/${p.fassung}`;
    let pdf: Uint8Array;
    // Look: Wahl des Partners für diese Seite, sonst Vorschlag des Themas
    const L = katalog?.looks, std = L?.standard?.[buch?.thema || p.fassung] || { modus: 'hell', akzent: 'oliv' };
    const modus = L?.modi?.includes(p.aussehen?.modus) ? p.aussehen.modus : std.modus;
    const akzent = L?.akzente?.includes(p.aussehen?.akzent) ? p.aussehen.akzent : std.akzent;
    let vorlage = buchId ? await datei(`vorlagen/${buchId}/${modus}-${akzent}.pdf`) : null;
    let lage = vorlage ? await json(`vorlagen/${buchId}/${modus}-${akzent}.json`) : null;
    if (buchId && (!vorlage || !lage)) { // Look noch nicht gebaut: Vorschlags-Look des Buches
      vorlage = await datei(`vorlagen/${buchId}/${std.modus}-${std.akzent}.pdf`);
      lage = vorlage ? await json(`vorlagen/${buchId}/${std.modus}-${std.akzent}.json`) : null;
    }
    if (vorlage && lage) {
      pdf = await fuellen({ PDFLib, fontkit, qrcode, vorlage, lage, schriften: { jost, inter, interFett }, foto, partner: p, link,
        briefStandard: katalog?.briefe?.[buch?.thema || p.fassung] || '' });
    } else {
      // Noch keine Bibliothek im Speicher: alte Fassung mit Platzhalter-Vorlage
      pdf = await personalisieren({ PDFLib, fontkit, vorlage: await datei(`vorlagen/ebook-${p.fassung}.pdf`), schriften: { jost, inter, interFett }, foto, fassung: p.fassung, partner: p, link });
    }
    const name = `E-Book ${p.vorname} ${p.nachname}`.trim();
    return new Response(req.method === 'HEAD' ? null : pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="e-book-${buchId || p.fassung}.pdf"; filename*=UTF-8''${encodeURIComponent(name)}.pdf`,
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (e) {
    console.error('partner-ebook bauen', e);
    return seite('Das hat gerade nicht geklappt.', 'Bitte versuch es gleich noch einmal.', 500);
  }
});

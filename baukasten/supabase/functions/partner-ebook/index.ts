// partner-ebook (11.11.2026): personalisiertes E-Book beim Abruf. Eine Vorlage je Fassung, keine Datei je Partner.
// Aufruf über Netlify (website/_redirects): /p/<adresse>/<fassung>/e-book  ->  /functions/v1/partner-ebook/<adresse>/<fassung>
// Direkt geht auch: /functions/v1/partner-ebook?adresse=max-muster&fassung=sport
// Holt die öffentlichen Angaben über uk_seite_oeffentlich() (dieselben wie die Seite, Telefon und E-Mail nur mit Freigabe),
// lädt die Vorlage aus dem Speicher (Bucket partner-ebooks, Ordner vorlagen) und fügt die Seite "Empfohlen von" ein.
// Fehlt die Vorlage noch, kommt eine schlichte Platzhalter-Vorlage. Schriften aus partner-ebooks/schriften.
// WICHTIG: ohne "Verify JWT" deployen (supabase functions deploy partner-ebook --no-verify-jwt), weil der Link
// aus dem Browser ohne Schlüssel geöffnet wird. Die Funktion gibt nur heraus, was die Seite ohnehin zeigt.
import * as PDFLib from 'npm:pdf-lib@1.17.1';
import fontkit from 'npm:@pdf-lib/fontkit@1.1.1';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { personalisieren } from './empfohlen.js';

const FASSUNGEN = ['neutral', 'sport', 'gesundheit'];
const URL_SB = Deno.env.get('SUPABASE_URL')!;
const db = createClient(URL_SB, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const FOTO_PFAD = `${URL_SB}/storage/v1/object/public/partner-seiten/`;

// Schriften und Vorlagen bleiben im Speicher der Funktion, solange sie warm ist
const ablage = new Map<string, Uint8Array | null>();
async function datei(pfad: string): Promise<Uint8Array | null> {
  if (ablage.has(pfad)) return ablage.get(pfad)!;
  const { data, error } = await db.storage.from('partner-ebooks').download(pfad);
  const bytes = error || !data ? null : new Uint8Array(await data.arrayBuffer());
  ablage.set(pfad, bytes);
  return bytes;
}

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
  const fassung = (u.searchParams.get('fassung') || teile[i + 2] || 'neutral').toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(adresse) || adresse.length > 40 || !FASSUNGEN.includes(fassung)) {
    return seite('Dieses E-Book gibt es nicht.', 'Bitte prüf den Link.', 404);
  }

  const { data: p, error } = await db.rpc('uk_seite_oeffentlich', { p_adresse: adresse, p_fassung: fassung });
  if (error) { console.error('partner-ebook lesen', error); return seite('Das hat gerade nicht geklappt.', 'Bitte versuch es gleich noch einmal.', 500); }
  if (!p) return seite('Dieses E-Book gibt es gerade nicht.', 'Frag am besten direkt bei der Person nach, die dir den Link geschickt hat.', 404);

  try {
    const f = p.fassung as string; // hat der Partner diese Fassung nicht, kommt seine erste
    const [vorlage, jost, inter, interFett] = await Promise.all([
      datei(`vorlagen/ebook-${f}.pdf`), datei('schriften/Jost-Medium.ttf'), datei('schriften/Inter-Regular.ttf'), datei('schriften/Inter-SemiBold.ttf'),
    ]);
    // Foto nur aus dem eigenen Speicher laden (kein Abruf beliebiger Adressen)
    let foto: Uint8Array | null = null;
    if (typeof p.foto === 'string' && p.foto.startsWith(FOTO_PFAD)) {
      const r = await fetch(p.foto);
      if (r.ok) foto = new Uint8Array(await r.arrayBuffer());
    }
    const pdf = await personalisieren({
      PDFLib, fontkit, vorlage, schriften: { jost, inter, interFett }, foto, fassung: f,
      partner: p, link: `${p.basis}/p/${p.adresse}/${f}`,
    });
    const name = `E-Book ${p.vorname} ${p.nachname}`.trim();
    return new Response(req.method === 'HEAD' ? null : pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="e-book-${p.adresse}.pdf"; filename*=UTF-8''${encodeURIComponent(name)}.pdf`,
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (e) {
    console.error('partner-ebook bauen', e);
    return seite('Das hat gerade nicht geklappt.', 'Bitte versuch es gleich noch einmal.', 500);
  }
});

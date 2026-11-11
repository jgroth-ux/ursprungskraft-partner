// partner-foto (11.11.2026): Foto für die eigenen Seiten aus dem Partnerportal (Ansicht "Meine Seiten").
// Das Portal schneidet das Foto schon zu (4 : 5, 900 x 1125 Pixel, JPEG) und schickt es als Datei.
// Anmeldung wie im Portal über den Sitzungsschlüssel (Kopfzeile x-sitzung), nicht über Supabase Auth.
// POST: Foto speichern (Bucket partner-seiten, öffentlich lesbar), Adresse in uk_partner_seiten.foto, altes Foto löschen.
// DELETE: Foto entfernen, die Seite zeigt dann die Initialen.
// Die Seite schickt den öffentlichen Schlüssel mit, "Verify JWT" bleibt eingeschaltet (wie bei partner-lead).
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-sitzung', 'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS' };
const antwort = (x: Json, status = 200) => new Response(JSON.stringify(x), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const GRENZE = 2 * 1024 * 1024;
const BUCKET = 'partner-seiten';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST' && req.method !== 'DELETE') return antwort({ fehler: 'nur POST oder DELETE' }, 405);
  const sitzung = req.headers.get('x-sitzung') || '';
  if (!/^[0-9a-f]{48}$/.test(sitzung)) return antwort({ fehler: 'sitzung' }, 401);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const { data: ziel, error } = await db.rpc('uk_partner_seiten_foto_ziel', { p_sitzung: sitzung });
  if (error) { console.error('partner-foto ziel', error); return antwort({ fehler: 'nicht gespeichert' }, 500); }
  // null: abgemeldet, Paket nicht gebucht oder Seite noch nicht angelegt (zuerst das Formular speichern)
  if (!ziel) return antwort({ fehler: 'nicht_erlaubt' }, 403);

  const altPfad = (() => {
    const m = String(ziel.foto_alt || '').match(new RegExp(`/object/public/${BUCKET}/(.+)$`));
    return m ? decodeURIComponent(m[1]) : null;
  })();

  if (req.method === 'DELETE') {
    await db.rpc('uk_partner_seiten_foto_setzen', { p_partner: ziel.partner_id, p_foto: null });
    if (altPfad) await db.storage.from(BUCKET).remove([altPfad]);
    return antwort({ ok: true, foto: null });
  }

  const bytes = new Uint8Array(await req.arrayBuffer());
  if (!bytes.length || bytes.length > GRENZE) return antwort({ fehler: 'groesse' }, 400);
  // Nur JPEG (fängt mit FF D8 FF an), das E-Book braucht JPEG
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return antwort({ fehler: 'format' }, 400);

  // Neuer Dateiname bei jedem Hochladen, so zeigt jeder Browser sofort das neue Foto
  const pfad = `${ziel.partner_id}/${Date.now()}.jpg`;
  const { error: f } = await db.storage.from(BUCKET).upload(pfad, bytes, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false });
  if (f) { console.error('partner-foto hochladen', f); return antwort({ fehler: 'nicht gespeichert' }, 500); }
  const foto = db.storage.from(BUCKET).getPublicUrl(pfad).data.publicUrl;
  const { error: f2 } = await db.rpc('uk_partner_seiten_foto_setzen', { p_partner: ziel.partner_id, p_foto: foto });
  if (f2) { console.error('partner-foto setzen', f2); await db.storage.from(BUCKET).remove([pfad]); return antwort({ fehler: 'nicht gespeichert' }, 500); }
  if (altPfad && altPfad !== pfad) await db.storage.from(BUCKET).remove([altPfad]);
  return antwort({ ok: true, foto });
});

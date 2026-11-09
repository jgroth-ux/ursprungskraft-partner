// team-zugang: eine Anmeldung für Daniel und Jasmin (09.11.2026).
// Jasmin: "Wenn Daniel und ich uns im Partnerportal einloggen, haben wir Zugriff auf Backoffice."
// Das Portal schickt den Partner-Sitzungsschlüssel. Gehört er zu einem Team-Konto (uk_partner.team) und hat dieselbe
// E-Mail einen Dashboard-Zugang (uk_nutzer), gibt es einen einmaligen Anmeldeschlüssel für genau dieses Konto zurück.
// Das Portal löst ihn sofort ein (verifyOtp) und ist damit auch im Backoffice angemeldet. Normale Partner bekommen nichts.
// Ohne JWT aufrufbar ("Verify JWT" aus): Wer keinen gültigen Team-Sitzungsschlüssel hat, bekommt nur "nein".
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const KOPF = { 'Access-Control-Allow-Origin': 'https://mein.ursprungskraft.net', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Vary': 'Origin' };
const antwort = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), { status, headers: { ...KOPF, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: KOPF });
  try {
    const { sitzung } = await req.json().catch(() => ({}));
    if (typeof sitzung !== 'string' || sitzung.length < 20) return antwort({ fehler: 'nein' }, 401);
    const { data: id } = await db.rpc('uk_partner_von_sitzung', { p_sitzung: sitzung });
    if (!id) return antwort({ fehler: 'nein' }, 401);
    const { data: p } = await db.from('uk_partner').select('email, team').eq('id', id).single();
    if (!p?.team || !p.email) return antwort({ fehler: 'nein' }, 403);
    const { data: n } = await db.from('uk_nutzer').select('email').ilike('email', p.email).limit(1);
    if (!n?.length) return antwort({ fehler: 'kein Dashboard-Zugang' }, 403);
    const { data, error } = await db.auth.admin.generateLink({ type: 'magiclink', email: n[0].email });
    if (error || !data?.properties?.hashed_token) { console.error('team-zugang', error); return antwort({ fehler: 'fehlgeschlagen' }, 500); }
    return antwort({ token_hash: data.properties.hashed_token });
  } catch (e) {
    console.error('team-zugang', e);
    return antwort({ fehler: 'fehlgeschlagen' }, 500);
  }
});

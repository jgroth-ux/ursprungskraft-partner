// partner-lead: nimmt Leads von den Empfehlungsseiten einzelner Partner an (06.11.2026), speichert sie in uk_partner_leads
// und meldet sie in die Telegram-Gruppe "Leads" (Bot @uk_leads_team_bot). Heiß und warm landen zusätzlich auf der Anrufliste.
// Bot-Schlüssel und Gruppe kommen aus dem Tresor über uk_partner_lead_geheim().
// Die Seite schickt den öffentlichen Schlüssel mit, "Verify JWT" bleibt eingeschaltet.
// BAUKASTEN 11.11.2026: Kümmert sich der Partner selbst um seine Leads (uk_partner.leads_bei = 'partner'), geht keine
// Meldung in die Gruppe "Leads". Stattdessen bekommt der Partner die Anfrage über den Anfragen-Bot (eigener Bot,
// getrennt vom Assistenten), wenn er ihn im Portal verbunden hat. Im Portal unter "Meine Seiten" steht sie immer.
// Die Meldung nennt jetzt auch die Seite (Fassung), über die der Lead kam.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const antwort = (x: Json, status = 200) => new Response(JSON.stringify(x), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const STUFE: Record<string, string> = { heiss: 'heiß', warm: 'warm', kalt: 'kalt, nicht anrufen' };
const QUELLE: Record<string, string> = { formular: 'Interessentenformular', umschauen: 'will sich erst mal umschauen', ebook: 'E-Book geholt' };
const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function meldung(w: Json, stufe: string) {
  const a = w.antworten || {};
  return [
    `Lead von ${gross(String(w.von))} (${STUFE[stufe]})`,
    QUELLE[w.quelle],
    '',
    [w.vorname, w.nachname].filter(Boolean).join(' '),
    w.telefon && `Telefon: ${w.telefon}`,
    `E-Mail: ${w.email}`,
    w.erreichbar && `Erreichbar: ${w.erreichbar}`,
    [w.ort, w.land].filter(Boolean).join(', '),
    a.interesse && `Interesse: ${a.interesse}`,
    a.geraet && `Trinkt heute: ${a.geraet}`,
    a.budget_text && `Gerät: ${a.budget_text}`,
    a.fassung && `Seite: ${a.fassung}${a.seite ? ` (${a.seite})` : ''}`, // BAUKASTEN 11.11.2026
  ].filter((x) => x !== undefined && x !== null && x !== false).join('\n');
}

// BAUKASTEN 11.11.2026: Anfrage an den Partner über den Anfragen-Bot, mit Knöpfen für WhatsApp und das Portal
const WIE: Record<string, string> = { heiss: 'will jetzt ein Gerät', warm: 'in den nächsten Monaten', kalt: 'hat das E-Book geholt' };
async function anPartner(db: Json, w: Json, data: Json) {
  const { data: chat } = await db.rpc('uk_anfragenbot_ziel', { p_kurz: String(w.von || '') });
  if (!chat) return;
  const { data: geheim } = await db.rpc('uk_anfragenbot_geheim');
  if (!geheim?.token) return;
  const a = w.antworten || {};
  const text = [
    `Neue Anfrage über deine Seite ${a.fassung || ''}`.trim(),
    WIE[data.stufe] ? `(${WIE[data.stufe]})` : '',
    '',
    [w.vorname, w.nachname].filter(Boolean).join(' '),
    w.telefon && `Telefon: ${w.telefon}`,
    `E-Mail: ${w.email}`,
    w.erreichbar && `Erreichbar: ${w.erreichbar}`,
    [w.ort, w.land].filter(Boolean).join(', '),
    a.interesse && `Interesse: ${a.interesse}`,
    a.geraet && `Trinkt heute: ${a.geraet}`,
    '',
    'Melde dich am besten noch heute.',
  ].filter((x) => x !== undefined && x !== null && x !== false).join('\n');
  let tel = String(w.telefon || '').replace(/[^\d+]/g, '').replace(/^00/, '').replace(/^\+/, '');
  if (tel.startsWith('0')) tel = '49' + tel.slice(1);
  const knoepfe = [[...(tel.length > 6 ? [{ text: 'WhatsApp schreiben', url: `https://wa.me/${tel}` }] : []),
    { text: 'Im Portal ansehen', url: 'https://mein.ursprungskraft.net/partner/#seiten' }]];
  const r = await fetch(`https://api.telegram.org/bot${geheim.token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true, reply_markup: { inline_keyboard: knoepfe } }),
  });
  if (!r.ok) throw new Error(`Telegram ${r.status}: ${await r.text()}`);
  await db.rpc('uk_partner_lead_gemeldet', { p_id: data.id });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return antwort({ fehler: 'nur POST' }, 405);
  let w: Json;
  try { w = await req.json(); } catch { return antwort({ fehler: 'kein JSON' }, 400); }
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await db.rpc('uk_partner_lead_speichern', { p: w });
  if (error) { console.error('partner-lead speichern', error); return antwort({ fehler: 'nicht gespeichert' }, 400); }
  if (!data?.neu) return antwort({ ok: true });
  // BAUKASTEN 11.11.2026: Partner kümmert sich selbst, also keine Meldung an Daniel und Jasmin, sondern an ihn
  const { data: wer } = await db.rpc('uk_partner_lead_zustaendig', { p_kurz: String(w.von || '') });
  if (wer === 'partner') {
    try { await anPartner(db, w, data); } catch (e) { console.error('partner-lead an Partner', e); }
    return antwort({ ok: true });
  }
  // Der Lead ist gespeichert. Klappt die Meldung nicht, bleibt gemeldet leer, die Seite bekommt trotzdem ein Ok.
  try {
    const { data: geheim, error: f } = await db.rpc('uk_partner_lead_geheim');
    if (f || !geheim?.token || !geheim?.chat) throw f || new Error('kein Schlüssel');
    const r = await fetch(`https://api.telegram.org/bot${geheim.token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: geheim.chat, text: meldung(w, data.stufe) }),
    });
    if (!r.ok) throw new Error(`Telegram ${r.status}: ${await r.text()}`);
    await db.rpc('uk_partner_lead_gemeldet', { p_id: data.id });
  } catch (e) { console.error('partner-lead melden', e); }
  return antwort({ ok: true });
});

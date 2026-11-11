// partner-anfragenbot (11.11.2026): Webhook des Telegram-Bots, der Partnern ihre Anfragen schickt.
// Bewusst getrennt vom Assistenten: Dieser Bot kann nur verbinden, trennen und Anfragen zustellen, sonst nichts.
// Verbinden: Der Partner tippt im Portal unter "Meine Seiten" auf "Telegram verbinden", Telegram öffnet
// t.me/<bot>?start=<code>, er tippt auf "Starten". Hier kommt dann "/start <code>" an.
// Die Anfragen selbst verschickt partner-lead (gleicher Bot, gleicher Schlüssel).
// Ohne "Verify JWT" deployen (Telegram schickt keinen Schlüssel). Geprüft wird stattdessen das Webhook-Geheimnis
// (Kopfzeile X-Telegram-Bot-Api-Secret-Token, Tresor 'tg_webhook_anfragenbot').
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const PORTAL = 'https://mein.ursprungskraft.net/partner/#seiten';
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
let geheim: { token: string; secret: string } | null = null;

async function schicken(chat: string | number, text: string, knoepfe?: Json) {
  await fetch(`https://api.telegram.org/bot${geheim!.token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true, ...(knoepfe ? { reply_markup: knoepfe } : {}) }),
  });
}
const zumPortal = { inline_keyboard: [[{ text: 'Meine Seiten im Portal', url: PORTAL }]] };

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('ok');
  if (!geheim) {
    const { data } = await db.rpc('uk_anfragenbot_geheim');
    if (!data?.token || !data?.secret) { console.error('anfragenbot: Schlüssel fehlt im Tresor'); return new Response('ok'); }
    geheim = data;
  }
  if (req.headers.get('x-telegram-bot-api-secret-token') !== geheim!.secret) return new Response('nein', { status: 401 });
  let u: Json;
  try { u = await req.json(); } catch { return new Response('ok'); }
  const m = u.message;
  if (!m?.chat?.id || m.chat.type !== 'private') return new Response('ok');
  const chat = String(m.chat.id), text = String(m.text || '').trim();
  try {
    if (text.startsWith('/start')) {
      const code = text.split(/\s+/)[1] || '';
      const { data } = code ? await db.rpc('uk_anfragenbot_verbinden', { p_code: code, p_chat: chat }) : { data: null };
      if (data) {
        await schicken(chat, `Hallo ${data.vorname}, alles verbunden.\n\nAb jetzt bekommst du hier jede Anfrage über deine Seiten, sofort und mit Telefon und E-Mail. Melde dich am besten noch am selben Tag.\n\nHier kommen nur Anfragen an. Für alles andere nimm deinen Assistenten.\nAbmelden: /stop`, zumPortal);
      } else {
        await schicken(chat, 'Diesen Bot verbindest du im Partnerportal unter "Meine Seiten" mit dem Knopf "Telegram verbinden". Der Link von dort gilt nur für dich.', zumPortal);
      }
    } else if (text === '/stop') {
      const { data } = await db.rpc('uk_anfragenbot_abmelden', { p_chat: chat });
      await schicken(chat, data ? 'Erledigt. Du bekommst hier keine Anfragen mehr. Wieder verbinden kannst du dich im Portal unter "Meine Seiten".' : 'Dieser Chat war nicht verbunden.');
    } else {
      await schicken(chat, 'Hier kommen nur deine Anfragen an, ich kann leider nicht antworten. Für Fragen und Termine nimm deinen Assistenten im Portal.', zumPortal);
    }
  } catch (e) { console.error('anfragenbot', e); }
  return new Response('ok');
});

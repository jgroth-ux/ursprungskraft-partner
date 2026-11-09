// partnerbot: Telegram-Webhook des Partner-Bots @ursprungskraft_partner_bot (31.10.2026, umgebaut 08.11.2026).
// Für Daniel UND Jasmin: neue Partner-Registrierungen mit "Freigeben" / "Ablehnen". Wer zuerst drückt, entscheidet.
// Seit 08.11.2026 schickt diese Funktion die Meldung selbst (vorher die Datenbank) und merkt sich beide Nachrichten
// in uk_partner.tg_nachrichten. Nach der Entscheidung verschwinden die Knöpfe bei BEIDEN (Jasmin: sonst klickt
// noch jemand auf Ablehnen). Dazu Bestätigungsmail nach dem Registrieren und Freischalt-Mail, beide im Mailrahmen.
// Aufrufe: Telegram (Knopfdrücke) und die Datenbank mit {"registriert": id} (uk_partner_registrieren),
// beide mit dem Webhook-Geheimnis tg_webhook_partnerbot. Geheimnis IONOS_PASSWORT wie beim Bestell-Bot.
// Muss ohne JWT erreichbar sein (Telegram schickt keins): "Verify JWT" aus.
// 08.11.2026 (neues Partnerportal): Neuigkeiten. Schreiben Daniel oder Jasmin dem Bot eine Textnachricht, fragt er
// "Als Neuigkeit an alle Partner?" mit Knöpfen. Erst nach "Ja" wird sie veröffentlicht (Portal) und an alle Partner mit
// verbundenem Assistenten geschickt (uk_neuigkeit_veroeffentlichen). Braucht umbau-2026-11-08c-partnerportal-neu-neuigkeiten.sql.
// Bei der Freigabe setzt der Bot jetzt auch 14 Tage Testzeit (uk_partner.test_bis, umbau-2026-11-08c-partnerportal-neu-zugang.sql).
// Quelle: projects/ursprungskraft/supabase/functions/partnerbot/index.ts
import nodemailer from 'npm:nodemailer@6.9.16';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const ABSENDER = 'info@ursprungskraft.net';
const ABSENDER_NAME = 'Ursprungskraft (Daniel Zürcher)'; // Jasmin 08.11.2026: Ursprungskraft vorne, es ist unser Portal
const PORTAL = 'https://mein.ursprungskraft.net/partner/';

// MAILRAHMEN ANFANG
const M_S = "'Jost',Arial,Helvetica,sans-serif", M_OLIV = '#5E6343';
const M_LOGO = 'https://mein.ursprungskraft.net/bilder/logo-baum-oliv.png';
const m_esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const mP = (s: string) => `<p style="margin:0 0 14px">${m_esc(s)}</p>`;
const mH = (s: string) => `<div style="margin:32px 0 10px;padding-top:24px;border-top:1px solid #E2DDCF;font:500 19px/26px ${M_S};color:${M_OLIV}">${m_esc(s)}</div>`;
const mKnopf = (href: string, wort: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 18px"><tr><td style="background:${M_OLIV};border-radius:8px"><a href="${m_esc(href)}" style="display:inline-block;padding:13px 26px;color:#FFFFFF;text-decoration:none;font:500 15px ${M_S}">${m_esc(wort)}</a></td></tr></table>`;
function mailRahmen(titel: string, vorname: string, inhalt: string) {
  return `<div style="background:#F4F1EA;padding:28px 10px;margin:0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden">
<tr><td style="padding:26px 32px 22px;border-bottom:1px solid #E2DDCF"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><img src="${M_LOGO}" width="34" alt="" style="display:block;border:0;width:34px;height:auto"></td>
<td style="vertical-align:middle;padding-left:14px;font:500 17px ${M_S};letter-spacing:.2em;color:${M_OLIV}">URSPRUNGSKRAFT</td></tr></table></td></tr>
<tr><td style="padding:30px 32px 10px;font:16px/27px ${M_S};color:#2E3024">
<div style="font:500 28px/36px ${M_S};color:#2E3024;margin:0 0 22px">${m_esc(titel)}</div>
<p style="margin:0 0 14px">Hallo ${m_esc(vorname)},</p>
${inhalt}
<p style="margin:0 0 26px">Herzliche Grüße<br>Daniel und Jasmin</p>
</td></tr>
<tr><td style="background:#F4F1EA;padding:20px 32px;font:12px/19px ${M_S};color:#7A7A68">Ursprungskraft GmbH · Untere Schützenalp 1028b · 3457 Wasen · Schweiz<br><a href="mailto:info@ursprungskraft.net" style="color:#7A7A68">info@ursprungskraft.net</a></td></tr>
</table></div>`;
}
// MAILRAHMEN ENDE

let geheim: { token: string; secret: string } | null = null;

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('nur POST', { status: 405 });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  if (!geheim) { const { data, error } = await db.rpc('uk_partnerbot_geheim'); if (error || !data?.token) return new Response('kein Schlüssel', { status: 500 }); geheim = data; }
  if (req.headers.get('x-telegram-bot-api-secret-token') !== geheim!.secret) return new Response('nein', { status: 401 });
  let up: Json;
  try { up = await req.json(); } catch { return new Response('ok'); }

  const tg = async (methode: string, body: Json) => {
    const r = await fetch(`https://api.telegram.org/bot${geheim!.token}/${methode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json().catch(() => ({}));
  };
  const einstellung = async (name: string) => String((await db.from('uk_einstellungen').select('wert').eq('name', name).maybeSingle()).data?.wert ?? '').trim();
  const chats: Record<string, string> = { [await einstellung('tg_chat_daniel')]: 'Daniel', [await einstellung('tg_chat_jasmin')]: 'Jasmin' };
  delete chats[''];
  const mailen = async (an: string, betreff: string, text: string, html: string) => {
    const post = nodemailer.createTransport({ host: 'smtp.ionos.de', port: 465, secure: true, auth: { user: ABSENDER, pass: Deno.env.get('IONOS_PASSWORT') ?? '' } });
    await post.sendMail({ from: `${ABSENDER_NAME} <${ABSENDER}>`, to: an, replyTo: ABSENDER, subject: betreff, text, html });
  };

  // ---------- Neue Registrierung (kommt von der Datenbank) ----------
  if (up.registriert) {
    const { data: p } = await db.from('uk_partner').select('id, vorname, nachname, email, enagic_id, telefon, ort, status, registriert, tg_nachrichten').eq('id', String(up.registriert)).maybeSingle();
    const frisch = p && p.status === 'wartet' && !p.tg_nachrichten && Date.now() - new Date(p.registriert).getTime() < 10 * 60 * 1000;
    if (!frisch) return new Response('ok');
    // 1. Meldung an Daniel und Jasmin, Nachrichten merken
    const text = ['Neuer Partner hat sich registriert', '', `${p.vorname} ${p.nachname || ''}`.trim(), `Enagic-ID: ${p.enagic_id}`, `E-Mail: ${p.email}`,
      ...(p.telefon ? [`Telefon: ${p.telefon}`] : []), ...(p.ort ? [`Ort: ${p.ort}`] : []), '', 'Bitte im Enagic-Backoffice prüfen, ob die ID zu euch gehört.'].join('\n');
    const knoepfe = { inline_keyboard: [[{ text: 'Freigeben', callback_data: 'pf|' + p.id }, { text: 'Ablehnen', callback_data: 'pa|' + p.id }]] };
    const gemerkt: Record<string, number> = {};
    for (const c of Object.keys(chats)) {
      const r = await tg('sendMessage', { chat_id: c, text, reply_markup: knoepfe, disable_web_page_preview: true });
      if (r?.result?.message_id) gemerkt[c] = r.result.message_id;
    }
    await db.from('uk_partner').update({ tg_nachrichten: gemerkt }).eq('id', p.id);
    // 2. Bestätigung an den Partner
    if (p.email) {
      const a = ['danke für deine Anmeldung als Partner bei Ursprungskraft. Sie ist bei uns angekommen.',
        'Wir schauen jetzt nach, ob deine Enagic-ID zu unserem Team gehört. Sobald dein Zugang frei ist, bekommst du eine zweite Mail und kannst dich im Partnerportal anmelden.',
        'Du hast eine Frage? Antworte einfach auf diese Mail.'];
      try {
        await mailen(p.email, 'Deine Anmeldung als Partner ist angekommen',
          [`Hallo ${p.vorname},`, '', ...a.flatMap((x) => [x, '']), 'Herzliche Grüße', 'Daniel und Jasmin'].join('\n'),
          mailRahmen('Deine Anmeldung ist angekommen', p.vorname, a.map(mP).join('\n')));
      } catch (e) {
        console.error('partnerbot registriert-mail', e);
        for (const c of Object.keys(chats)) await tg('sendMessage', { chat_id: c, text: `Die Bestätigungsmail an ${p.email} ging nicht raus. Bitte ${p.vorname} kurz selbst Bescheid geben.` });
      }
    }
    return new Response('ok');
  }

  // ---------- Knopfdrücke und Nachrichten aus Telegram ----------
  try {
    const chat = String(up.callback_query?.message?.chat?.id ?? up.message?.chat?.id ?? '');
    const wer = chats[chat];
    if (up.message?.text) {
      const text = String(up.message.text).trim();
      if (!wer) { await tg('sendMessage', { chat_id: chat, text: 'Dieser Bot ist nur für das Ursprungskraft-Team.' }); return new Response('ok'); }
      // Befehle (/start, /hilfe) und sehr kurze Texte: Begrüßung wie bisher, mit Hinweis auf Neuigkeiten
      if (text.startsWith('/') || text.length < 8) {
        await tg('sendMessage', { chat_id: chat, text: `Hallo ${wer}! Hier kommen alle Meldungen zu Partnern an: neue Registrierungen zum Freigeben, gekaufte Pakete und Bestellungen über Partner-Links.\n\nNeuigkeit für alle Partner: Schreib mir einfach den Text. Ich frage dich dann, ob er ins Partnerportal soll.` });
        return new Response('ok');
      }
      // Neuigkeit: erst als Entwurf merken, dann mit Knopf nachfragen
      const { data: n, error } = await db.from('uk_neuigkeiten').insert({ text: text.slice(0, 4000), von: wer }).select('id').single();
      if (error || !n) { console.error('partnerbot neuigkeit', error); await tg('sendMessage', { chat_id: chat, text: 'Die Neuigkeit konnte ich nicht speichern. Ist die Datei umbau-2026-11-08c-partnerportal-neu-neuigkeiten.sql eingespielt?' }); return new Response('ok'); }
      await tg('sendMessage', { chat_id: chat, text: `Als Neuigkeit an alle Partner?\n\n${text.slice(0, 3500)}`,
        reply_markup: { inline_keyboard: [[{ text: 'Ja, an alle Partner', callback_data: 'nj|' + n.id }, { text: 'Nein', callback_data: 'nn|' + n.id }]] } });
      return new Response('ok');
    }
    const cq = up.callback_query;
    if (!cq) return new Response('ok');
    await tg('answerCallbackQuery', { callback_query_id: cq.id });
    if (!wer) return new Response('ok');

    const [art, id] = String(cq.data || '').split('|');
    // Neuigkeit veröffentlichen oder verwerfen. Klappt nur einmal, die Knöpfe verschwinden danach.
    if (art === 'nj' || art === 'nn') {
      const msg = cq.message, alt = String(msg?.text || '').replace(/^Als Neuigkeit an alle Partner\?\n\n/, '');
      let zeile: string;
      if (art === 'nj') {
        const { data: zahl, error } = await db.rpc('uk_neuigkeit_veroeffentlichen', { p_id: id });
        zeile = error ? 'Das hat nicht geklappt. Bitte noch einmal schicken.'
          : zahl === null ? 'Diese Neuigkeit ist schon erledigt.'
          : `Veröffentlicht von ${wer}. Steht im Partnerportal${zahl ? ` und ging per Telegram an ${zahl} Partner` : ''}.`;
      } else {
        await db.from('uk_neuigkeiten').update({ status: 'verworfen' }).eq('id', id).eq('status', 'entwurf');
        zeile = 'Nicht veröffentlicht.';
      }
      await tg('editMessageText', { chat_id: chat, message_id: msg.message_id, text: `${alt}\n\n${zeile}` });
      return new Response('ok');
    }
    if (art !== 'pf' && art !== 'pa') return new Response('ok');
    const { data: p } = await db.from('uk_partner').select('id, vorname, nachname, email, enagic_id, status, entschieden_von, entschieden_am, tg_nachrichten').eq('id', id).maybeSingle();
    const msg = cq.message;
    const alterText = String(msg?.text || '');
    if (!p) { await tg('editMessageText', { chat_id: chat, message_id: msg.message_id, text: alterText + '\n\nDiesen Partner gibt es nicht mehr.' }); return new Response('ok'); }
    const wann = (t: string) => new Date(t).toLocaleString('de-DE', { timeZone: 'Europe/Zurich', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(', ', ' um ');
    // Knöpfe bei allen gemerkten Nachrichten weg, dazu die Entscheidung. Ältere Meldungen ohne Merker: nur die geklickte.
    const allenZeigen = async (zeile: string) => {
      const ziele: [string, number][] = Object.entries(p.tg_nachrichten || {}).map(([c, m]) => [c, Number(m)]);
      if (!ziele.some(([c, m]) => c === chat && m === msg.message_id)) ziele.push([chat, msg.message_id]);
      for (const [c, m] of ziele) await tg('editMessageText', { chat_id: c, message_id: m, text: `${alterText}\n\n${zeile}` });
    };

    // Nur einer entscheidet: der Wechsel klappt nur, solange der Partner noch wartet
    const neu = art === 'pf' ? 'freigegeben' : 'abgelehnt';
    const jetzt = new Date().toISOString();
    const { data: geaendert } = await db.from('uk_partner')
      .update({ status: neu, aktiv: neu === 'freigegeben', entschieden_von: wer, entschieden_am: jetzt })
      .eq('id', p.id).eq('status', 'wartet').select('id');
    if (!geaendert?.length) {
      await allenZeigen(`${p.status === 'freigegeben' ? 'Freigegeben' : 'Abgelehnt'} von ${p.entschieden_von || 'jemand anderem'}${p.entschieden_am ? ' am ' + wann(p.entschieden_am) : ''}.`);
      return new Response('ok');
    }
    await allenZeigen(`${neu === 'freigegeben' ? 'Freigegeben' : 'Abgelehnt'} von ${wer} am ${wann(jetzt)}.`);
    // 14 Tage alles kostenlos testen. Eigener Schritt: fehlt die Spalte noch, bleibt die Freigabe trotzdem gültig.
    if (neu === 'freigegeben') {
      const bis = new Date(Date.now() + 14 * 864e5).toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
      const { error } = await db.from('uk_partner').update({ test_bis: bis }).eq('id', p.id).is('test_bis', null);
      if (error) console.error('partnerbot testzeit', error);
    }

    if (neu === 'freigegeben' && p.email) {
      const a1 = 'dein Zugang zum Partnerportal von Ursprungskraft ist freigeschaltet.';
      const a2 = 'Melde dich mit deiner E-Mail-Adresse und deinem Passwort an. Dort findest du deinen persönlichen Bestelllink und alles, was du für deine Kunden brauchst.';
      const a3 = 'Du hast eine Frage? Antworte einfach auf diese Mail.';
      try {
        await mailen(p.email, 'Dein Zugang zum Partnerportal ist frei',
          [`Hallo ${p.vorname},`, '', a1, '', a2, PORTAL, '', a3, '', 'Herzliche Grüße', 'Daniel und Jasmin'].join('\n'),
          mailRahmen('Dein Zugang ist frei', p.vorname, mP(a1) + mP(a2) + mKnopf(PORTAL, 'Zum Partnerportal') + mP(a3)));
      } catch (e) { console.error('partnerbot mail', e); await tg('sendMessage', { chat_id: chat, text: `Freigegeben, aber die Mail an ${p.email} ging nicht raus. Bitte ${p.vorname} kurz selbst Bescheid geben.` }); }
    }
  } catch (e) { console.error('partnerbot', e); }
  return new Response('ok');
});

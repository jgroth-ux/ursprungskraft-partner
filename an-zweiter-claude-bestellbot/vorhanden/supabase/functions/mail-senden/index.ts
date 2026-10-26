// mail-senden: verschickt Mails über das IONOS-Postfach info@ursprungskraft.net.
// Angelegt 21.10.2026. Aufruf kommt aus der Datenbank (Trigger auf uk_bestellungen).
// Nimmt nur eine Bestell-ID entgegen und baut die Mail selbst, deshalb ohne Anmeldung aufrufbar:
// wer die Funktion aufruft, kann höchstens die Bestätigung einer echten Bestellung einmal auslösen.
// Geheimnis in Supabase (Edge Functions, Secrets): IONOS_PASSWORT = Passwort von info@ursprungskraft.net
import nodemailer from 'npm:nodemailer@6.9.16';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const ABSENDER = 'info@ursprungskraft.net';
const KUNDENSEITE = 'https://mein.ursprungskraft.net/start/';
const GRUPPE = 'https://chat.whatsapp.com/IM5uWM744VDI6kizTbMZOd'; // WhatsApp-Gruppe seit 23.10.2026

const post = nodemailer.createTransport({
  host: 'smtp.ionos.de', port: 465, secure: true,
  auth: { user: ABSENDER, pass: Deno.env.get('IONOS_PASSWORT') ?? '' },
});

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const antwort = (daten: unknown, status = 200) =>
  new Response(JSON.stringify(daten), { status, headers: { 'Content-Type': 'application/json' } });

const esc = (s: string) => s.replace(/[&<>"]/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[z]!));

// deno-lint-ignore no-explicit-any
function bestellMail(vorname: string, d: any) {
  // Ältere Bestellungen ohne Feld k8 sind K8-Bestellungen. Ergänzungen (emGuarde, ANESPA) bestellt Daniel intern, der Kunde bekommt dazu keinen Extra-Satz (Jasmin, 24.10.2026).
  const mitK8 = d?.k8 !== 'nein';
  const schritte = [
    'Wir prüfen deine Angaben und schicken die Unterlagen an Enagic.',
    'Du bekommst von Enagic die Bestätigung und, bei Überweisung, die Bankverbindung.',
    'Das Gerät kommt direkt aus Düsseldorf zu dir. Beim Einrichten helfen wir dir gern.',
  ];
  const text = `Hallo ${vorname},

danke für deine Bestellung. Wir haben alles bekommen.
${mitK8 ? `
So geht es jetzt weiter:
${schritte.map((x, i) => `${i + 1}. ${x}`).join('\n')}
` : ''}${mitK8 ? `
Alles rund um dein Gerät findest du schon jetzt auf deiner Seite: Einrichten, Reinigung und Tipps für den Alltag.
${KUNDENSEITE}
` : ''}
Neuigkeiten und Tipps bekommst du in unserer WhatsApp-Gruppe:
${GRUPPE}

Fragen? Antworte einfach auf diese Mail oder melde dich bei Daniel unter +41 79 624 94 10 (Telefon und WhatsApp).

Herzliche Grüße
Daniel und Jasmin
Ursprungskraft GmbH`;

  const knopf = (href: string, wort: string) =>
    `<p style="margin:18px 0"><a href="${href}" style="background:#4F5A35;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block">${wort}</a></p>`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#2A2C22;max-width:560px">
<p>Hallo ${esc(vorname)},</p>
<p>danke für deine Bestellung. Wir haben alles bekommen.</p>
${mitK8 ? `<p><b>So geht es jetzt weiter:</b></p>
<ol style="padding-left:20px">${schritte.map((x) => `<li>${x}</li>`).join('')}</ol>` : ''}
${mitK8 ? `<p>Alles rund um dein Gerät findest du schon jetzt auf deiner Seite: Einrichten, Reinigung und Tipps für den Alltag.</p>
${knopf(KUNDENSEITE, 'Zu deiner Seite')}` : ''}
<p>Neuigkeiten und Tipps bekommst du in unserer WhatsApp-Gruppe.</p>
${knopf(GRUPPE, 'Zur WhatsApp-Gruppe')}
<p>Fragen? Antworte einfach auf diese Mail oder melde dich bei Daniel unter +41 79 624 94 10 (Telefon und WhatsApp).</p>
<p>Herzliche Grüße<br>Daniel und Jasmin<br>Ursprungskraft GmbH</p>
</div>`;
  return { betreff: 'Deine Bestellung ist angekommen', text, html };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return antwort({ fehler: 'nur POST' }, 405);
  let ein: { art?: string; id?: string };
  try { ein = await req.json(); } catch { return antwort({ fehler: 'kein JSON' }, 400); }

  try {
    // Testmail geht immer nur an das eigene Postfach
    if (ein.art === 'test') {
      await post.sendMail({ from: `Ursprungskraft <${ABSENDER}>`, to: ABSENDER, subject: 'Testmail Mailversand',
        text: 'Wenn du das liest, funktioniert der Mailversand über IONOS.' });
      return antwort({ ok: true, an: ABSENDER });
    }

    if (ein.art === 'bestellung' && ein.id) {
      const { data: b, error } = await db.from('uk_bestellungen').select('id, daten, mail_bestaetigung').eq('id', ein.id).maybeSingle();
      if (error) throw error;
      if (!b) return antwort({ fehler: 'Bestellung nicht gefunden' }, 404);
      if (b.mail_bestaetigung) return antwort({ ok: true, schon_gesendet: b.mail_bestaetigung });
      const email = String(b.daten?.email ?? '').trim();
      if (!email) return antwort({ fehler: 'keine E-Mail' }, 400);
      const m = bestellMail(String(b.daten?.vorname ?? '').trim() || 'du', b.daten);
      // Kopie an info@, weil über SMTP verschickte Mails nicht im Ordner "Gesendet" landen
      await post.sendMail({ from: `Ursprungskraft <${ABSENDER}>`, to: email, bcc: ABSENDER, replyTo: ABSENDER,
        subject: m.betreff, text: m.text, html: m.html });
      await db.from('uk_bestellungen').update({ mail_bestaetigung: new Date().toISOString() }).eq('id', b.id);
      return antwort({ ok: true, an: email });
    }

    return antwort({ fehler: 'unbekannte Art' }, 400);
  } catch (e) {
    console.error('mail-senden', e);
    return antwort({ fehler: String((e as Error)?.message ?? e) }, 500);
  }
});

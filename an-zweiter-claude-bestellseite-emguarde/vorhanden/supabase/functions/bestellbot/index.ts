// bestellbot: Telegram-Webhook des Bestell-Bots @Ursprungskraft_Bestellungen_Bot. Angelegt 26.10.2026.
// Daniel wickelt eine neue Bestellung hier komplett ab:
//   1. Knopf: über wen läuft der Verkauf (Daniel, Ursprungskraft GmbH, Jasmin, jemand anderes)
//   2. bei "jemand anderes": Name, Sponsor-ID, E-Mail als Text
//   3. Linie per Knopf (1 bis bestellbot_linien, immer A), getippte Zahl geht auch
//   4. Enagic-Formulare werden hier auf dem Server ausgefüllt (wie vertragErstellen im Dashboard)
//   5. Mail mit allen PDFs und Ausweisfotos an die Sponsor-Adresse. NIE direkt an Enagic, Daniel leitet weiter.
// Gesprächszustand liegt in den Tabellen uk_bestellbot und uk_bestellbot_chat (umbau-2026-10-26-bestellbot-rueckfragen.sql).
// Bot-Schlüssel und Webhook-Geheimnis kommen aus dem Tresor über uk_bestellbot_geheim().
// Geheimnis in Supabase (Edge Functions, Secrets): IONOS_PASSWORT (dasselbe wie bei mail-senden).
// Muss ohne JWT erreichbar sein (Telegram schickt keins): supabase functions deploy bestellbot --no-verify-jwt
import nodemailer from 'npm:nodemailer@6.9.16';
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.45.4';
import { PDFDocument, StandardFonts, rgb, type PDFImage, type PDFPage, type PDFFont, type PDFForm } from 'npm:pdf-lib@1.17.1';
import { Buffer } from 'node:buffer';

const ABSENDER = 'info@ursprungskraft.net';
const BUCKET = 'bestellungen';
const SPONSOR_NAMEN: Record<string, string> = { daniel: 'Daniel Zürcher', gmbh: 'Ursprungskraft GmbH', jasmin: 'Jasmin Groth', andere: 'jemand anderes' };
const LAND_EN: Record<string, string> = { CH: 'Switzerland', DE: 'Germany', AT: 'Austria', LI: 'Liechtenstein', IT: 'Italy', FR: 'France', NL: 'Netherlands', BE: 'Belgium', LU: 'Luxembourg', ES: 'Spain', NO: 'Norway', GB: 'United Kingdom' };

// deno-lint-ignore no-explicit-any
type Json = any;
export type Bestellung = { id: string; nummer: number; erstellt: string; status: string; von: string | null; daten: Json; dateien: Json; sponsor: string | null; linie: string | null; angaben: Json; pdfs: Json; mail_sponsor: string | null };
export type Zustand = { bestellung_id: string; schritt: string; werte: Json; frage_msg: number | null };
export type Sponsor = { name: string; id: string; email: string };

// ---------- Helfer, die auch das Dashboard so rechnet ----------
// Österreich: Versand noch unbekannt (Jasmin, 26.10.2026), Feld bleibt leer, Daniel trägt ihn ein
export const versandVon = (land: string) => (land === 'DE' ? 12 : land === 'AT' ? null : ['CH', 'LI', 'NO', 'GB'].includes(land) ? 57 : 44);
// Preise netto wie auf dem Enagic-Formular ("Preise zzgl. MwSt."), überall gleich. Nur die MwSt hängt am Land.
const PREIS = { k8: 4600, anespa: 2800 };
const MWST: Record<string, number> = { DE: 0.19, AT: 0.20 };
export const mitK8 = (dt: Json) => dt.k8 !== 'nein';
export const mitAnespa = (dt: Json) => dt.zusatz_anespa === 'on';
// Für Mail, Dateinamen und Ratenantrag
export const produktName = (dt: Json) => [mitK8(dt) ? 'LeveLuk K8' : '', mitAnespa(dt) ? 'Anespa DX' : ''].filter(Boolean).join(' und ');
export const datumDE = (t: string) => (t ? t.split('-').reverse().join('.') : '');
export const heuteISO = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Zurich' }).format(new Date());
export const eur = (n: unknown) => (n == null || n === '' ? '' : Number(n).toLocaleString('de-DE') + ' €');
export const bName = (b: Bestellung) => [b.daten.vorname, b.daten.nachname].filter(Boolean).join(' ');
const landEN = (b: Bestellung) => LAND_EN[b.daten.land_kurz] || b.daten.land || '';

// Vorbelegung der Beträge wie im Dialog des Dashboards. Daniel prüft sie in der Mail und im Bot.
export function vorbelegung(b: Bestellung) {
  const dt = b.daten, a = b.angaben || {};
  const z = (x: unknown) => (x === '' || x == null ? null : Number(x));
  const netto = (mitK8(dt) ? PREIS.k8 : 0) + (mitAnespa(dt) ? PREIS.anespa : 0);
  return {
    preis: z(a.preis ?? netto), mwst: z(a.mwst ?? (MWST[dt.land_kurz] ? Math.round(netto * MWST[dt.land_kurz] * 100) / 100 : null)), versand: z(a.versand ?? versandVon(dt.land_kurz)),
    garantie: z(a.garantie), anzahlung: z(a.anzahlung ?? dt.anzahlung), anfang: a.anfang || null, ende: a.ende || null,
  };
}
export const summe = (a: Json) => ['preis', 'mwst', 'versand', 'garantie'].reduce((x, k) => x + (Number(a[k]) || 0), 0);

// Mail an Enagic wie in Daniels Vorlage (mailText im Dashboard)
export function enagicText(b: Bestellung, sp: Sponsor, linie: string) {
  const an = ['Bestellformular ' + produktName(b.daten), ...(b.daten.zahlung === 'raten' ? ['Ratenzahlungsantrag'] : []),
    ...(b.dateien?.ausweis_vorne ? ['ID Front', 'ID Back'] : []), ...(b.dateien?.zahlungsbeleg ? ['Zahlungsbeleg'] : [])];
  return `Hello Enagic Team,\n\nNEW Sale ${produktEN(b)} from ${landEN(b)}\n\nSponsor ID: ${sp.id || ''}\nSponsor: ${sp.name}\n\nSponsor Line ${linie} A\n\nAttached:\n${an.join('\n')}\n`;
}
const produktEN = (b: Bestellung) => [mitK8(b.daten) ? 'Leveluk K8' : '', mitAnespa(b.daten) ? 'Anespa DX' : ''].filter(Boolean).join(' and ');
export const enagicBetreff = (b: Bestellung) => `NEW Sale ${produktEN(b)} from ${landEN(b)}`;

// ---------- PDFs ausfüllen (nachgebaut aus vertragErstellen im Dashboard, gleiche Felder und Koordinaten) ----------
export type Quellen = { formular: (datei: string) => Promise<Uint8Array>; kundeSig: Uint8Array | null; sponsorSig: Uint8Array | null };
export async function pdfsErstellen(b: Bestellung, sp: Sponsor, linie: string, a: Json, q: Quellen, heute = heuteISO()) {
  const dt = b.daten, heuteDE = datumDE(heute);
  const laden = async (n: string) => PDFDocument.load(await q.formular(n));
  const bild = async (doc: PDFDocument, png: Uint8Array | null) => (png ? doc.embedPng(png) : null);
  const zeichne = (seite: PDFPage, img: PDFImage | null, x: number, yOben: number, w: number, h: number) => {
    if (!img) return; const s = Math.min(w / img.width, h / img.height), H = seite.getHeight();
    seite.drawImage(img, { x, y: H - yOben - h + (h - img.height * s) / 2, width: img.width * s, height: img.height * s });
  };
  const text = (seite: PDFPage, font: PDFFont, t: unknown, x: number, yGrund: number, gr = 10) => { if (t) seite.drawText(String(t), { x, y: seite.getHeight() - yGrund, size: gr, font, color: rgb(0.12, 0.16, 0.27) }); };
  const setze = (f: PDFForm, name: string, wert: unknown) => { try { if (wert != null && wert !== '') f.getTextField(name).setText(String(wert)); } catch { /* Feld fehlt */ } };
  const haken = (f: PDFForm, name: string) => { try { f.getCheckBox(name).check(); } catch { /* Feld fehlt */ } };
  const radio = (f: PDFForm, name: string, wert: string) => { try { const g = f.getRadioGroup(name); const o = g.getOptions().find((x) => x === wert || x.includes(wert)); if (o) g.select(o); } catch { /* Feld fehlt */ } };
  const name = [dt.vorname, dt.nachname].join(' ') + (dt.firma ? ' / ' + dt.firma : '');
  const geb = datumDE(dt.geburtsdatum);
  const ergebnis = await PDFDocument.create();
  const dateien: { name: string; bytes: Uint8Array }[] = [];

  if (dt.als === 'Distributor') {
    const doc = await laden('distributorenvertrag.pdf'), f = doc.getForm();
    setze(f, 'Nachname', dt.nachname); setze(f, 'Vornamen', dt.vorname); setze(f, 'Tel', dt.telefon); setze(f, 'MobilTel', dt.handy);
    const [j, m, t] = String(dt.geburtsdatum || '').split('-'); setze(f, 'Geburtstag', t); setze(f, 'undefined', m); setze(f, 'undefined_2', j);
    setze(f, 'EmailAdresse', dt.email); setze(f, 'Name des Unternehmens', dt.firma); setze(f, 'Innergemeinschaftliche MwStNummer', dt.ustid);
    setze(f, 'Ort', dt.ort); setze(f, 'Datum', heuteDE);
    if (dt.anrede === 'Herr') radio(f, 'Group1', 'Choice1'); if (dt.anrede === 'Frau') radio(f, 'Group1', 'Choice2');
    zeichne(doc.getPage(1), await bild(doc, q.kundeSig), 430, 646, 112, 34);
    f.flatten();
    const [s] = await ergebnis.copyPages(doc, [1]); ergebnis.addPage(s);
  }
  if (dt.nicht_eu) {
    const doc = await laden('non-eu.pdf'), s0 = doc.getPage(0), font = await doc.embedFont(StandardFonts.Helvetica);
    text(s0, font, [dt.vorname, dt.nachname].join(' '), 40, 652, 10); text(s0, font, heuteDE, 185, 652, 10);
    zeichne(s0, await bild(doc, q.kundeSig), 300, 612, 140, 42);
    const [s] = await ergebnis.copyPages(doc, [0]); ergebnis.addPage(s);
  }
  {
    const doc = await laden('bestellformular.pdf'), f = doc.getForm(), s0 = doc.getPage(0), font = await doc.embedFont(StandardFonts.Helvetica);
    haken(f, dt.als === 'Distributor' ? 'Check Box12.1' : 'Check Box12.0');
    setze(f, 'Name', name); setze(f, 'Text1', geb); setze(f, 'Street', dt.strasse); setze(f, 'ZIP', dt.plz); setze(f, 'City', dt.ort); setze(f, 'Country', dt.land);
    setze(f, 'Shipping1', dt.liefer_name); setze(f, 'Shipping2', dt.liefer_adresse); setze(f, 'Phone', dt.telefon); setze(f, 'Mobile', dt.handy); setze(f, 'Email', dt.email); setze(f, 'VAT', dt.ustid);
    setze(f, 'Price', eur(a.preis)); setze(f, 'PriceVAT', eur(a.mwst)); setze(f, 'PriceShipping', eur(a.versand)); setze(f, 'PriceWarranty', eur(a.garantie)); setze(f, 'PriceTotal', eur(summe(a)));
    if (dt.zahlung === 'raten') { haken(f, 'Epay' + ({ 3: 30, 6: 60, 10: 100, 16: 160, 24: 240 } as Record<string, number>)[dt.raten_anzahl]); setze(f, 'Downpayment', eur(a.anzahlung)); }
    else haken(f, 'Check Box27.0.0');
    setze(f, 'Sponsor Name', sp.name); setze(f, 'Sponsor ID', sp.id); setze(f, 'Line', linie); setze(f, 'Spnsor E-Mail', sp.email);
    zeichne(s0, await bild(doc, q.kundeSig), 70, 584, 190, 34); text(s0, font, heuteDE, 300, 614, 11);
    zeichne(s0, await bild(doc, q.sponsorSig), 60, 712, 190, 26); text(s0, font, heuteDE, 380, 734, 11);
    f.flatten();
    // Kreuz bei "Bitte wählen Sie aus". Die Auswahl im Formular erlaubt nur ein Produkt, deshalb selbst zeichnen,
    // und zwar NACH flatten, sonst deckt der leere Kreis das Kreuz wieder zu. Mittelpunkte: K-8 y 510,5, Anespa DX y 435,5.
    const fett = await doc.embedFont(StandardFonts.HelveticaBold);
    const kreuz = (yMitte: number) => s0.drawText('X', { x: 49.5 - fett.widthOfTextAtSize('X', 11) / 2, y: yMitte - 3.9, size: 11, font: fett, color: rgb(0.12, 0.16, 0.27) });
    if (mitK8(dt)) kreuz(510.5);
    if (mitAnespa(dt)) kreuz(435.5);
    const [s] = await ergebnis.copyPages(doc, [0]); ergebnis.addPage(s);
  }
  const nn = String(dt.nachname || 'Kunde').replace(/[^\wäöüÄÖÜß-]+/g, '-');
  dateien.push({ name: `Bestellformular-${produktName(dt).replace(/ und /g, '-').replace(/ /g, '-')}-${nn}.pdf`, bytes: await ergebnis.save() });
  if (dt.zahlung === 'raten') {
    const doc = await laden('ratenzahlungsantrag.pdf'), f = doc.getForm(), s0 = doc.getPage(0), font = await doc.embedFont(StandardFonts.Helvetica);
    setze(f, 'Name', name); setze(f, 'Straße', dt.strasse); setze(f, 'PLZ', dt.plz); setze(f, 'Stadt', dt.ort); setze(f, 'Tel', dt.handy || dt.telefon); setze(f, 'EMail', dt.email);
    setze(f, 'Beruf', dt.beruf); setze(f, 'Arbeitgeber', dt.arbeitgeber); setze(f, 'Straße_3', dt.arbeitgeber_adresse); setze(f, 'Tel_3', dt.arbeitgeber_tel); setze(f, 'beschäftigt seit', dt.beschaeftigt_seit);
    setze(f, 'Produkt.0', produktName(dt)); setze(f, 'Produkt.1', a.anzahlung != null ? String(a.anzahlung) : '');
    radio(f, '30 €', String(dt.raten_anzahl)); radio(f, 'ZAHLUNGSOPTIONEN', String(dt.zahltag)); setze(f, 'Anfang', a.anfang); setze(f, 'Text2', a.ende);
    radio(f, 'Kreditkarteninformation', 'BANKKONTO'); setze(f, 'IBAN', dt.iban); setze(f, 'BIC', dt.bic);
    setze(f, 'Text3.0', [dt.vorname, dt.nachname].join(' ')); setze(f, 'Text4.0', heuteDE);
    text(s0, font, 'X', dt.schon_finanziert === 'Ja' ? 547 : 614, 54, 12);
    zeichne(s0, await bild(doc, q.kundeSig), 120, 770, 200, 34);
    f.flatten();
    dateien.push({ name: `Ratenzahlungsantrag-${produktName(dt).replace(/ und /g, '-').replace(/ /g, '-')}-${nn}.pdf`, bytes: await doc.save() });
  }
  return dateien;
}

// ---------- Texte des Bots (kurz, du-Form, keine Gedankenstriche) ----------
export const T = {
  sponsorFrage: (n: number) => `Bestellung #${n}: Über wen läuft der Verkauf?`,
  linieFrage: (n: number, wer: string) => `Bestellung #${n} läuft über ${wer}.\nWelche Linie?`,
  andereName: (n: number) => `Bestellung #${n}: Wie heißt die Person? Bitte Vor- und Nachname schicken.`,
  andereId: (n: number) => `Danke. Wie lautet ihre Sponsor-ID bei Enagic? Bitte nur die Zahl.`,
  andereMail: (n: number) => `Und ihre E-Mail-Adresse?`,
  idFalsch: 'Das sieht nicht nach einer Sponsor-ID aus. Bitte nur die Ziffern schicken.',
  mailFalsch: 'Das sieht nicht nach einer E-Mail-Adresse aus. Bitte noch einmal.',
  linieFalsch: 'Bitte die Linie über die Knöpfe wählen oder nur die Zahl schicken, zum Beispiel 2.',
  jasminOhneId: (n: number) => `Bestellung #${n}: Für Jasmin ist noch keine Sponsor-ID hinterlegt. Ich schicke deshalb nichts. Du kannst die Bestellung anders zuordnen:`,
  ohneK8: (n: number) => `Bestellung #${n}: Ohne K8 und ohne ANESPA bestellt, bitte persönlich klären.`,
  arbeitet: (n: number) => `Bestellung #${n}: Ich fülle die Formulare aus und schicke die Mail. Einen Moment.`,
  fertig: (n: number, an: string) => `Fertig. Die Mail für Enagic liegt im Postfach von ${an}. Bitte prüfen und an Enagic weiterleiten.`,
  schonFertig: (n: number) => `Bestellung #${n} ist schon erledigt, die Mail ist raus.`,
  laeuft: (n: number) => `Bestellung #${n} wird gerade erstellt.`,
  nichtsOffen: 'Gerade wartet keine Bestellung auf eine Antwort.',
  fehler: (n: number, f: string) => `Bestellung #${n}: Das hat nicht geklappt. Grund: ${f}. Wähl die Linie danach einfach noch einmal.`,
  wartetNoch: (n: number, name: string) => `Bestellung #${n} (${name}) wartet noch auf dich.`,
  fremd: 'Dieser Bot ist nur für Daniel und Jasmin.',
};

const SPONSOR_KNOEPFE = (id: string, mitJasmin = true) => ({ inline_keyboard: [
  [{ text: 'Daniel', callback_data: `s|${id}|daniel` }, { text: 'Ursprungskraft GmbH', callback_data: `s|${id}|gmbh` }],
  mitJasmin ? [{ text: 'Jasmin', callback_data: `s|${id}|jasmin` }, { text: 'Jemand anderes', callback_data: `s|${id}|andere` }] : [{ text: 'Jemand anderes', callback_data: `s|${id}|andere` }],
] });

// Linien 1 bis n, immer A, drei pro Reihe. n aus der Einstellung bestellbot_linien (26.10.2026: 6)
const LINIEN_KNOEPFE = (id: string, n: number) => ({ inline_keyboard: Array.from({ length: Math.ceil(n / 3) }, (_, r) =>
  Array.from({ length: Math.min(3, n - r * 3) }, (_, i) => ({ text: `${r * 3 + i + 1} A`, callback_data: `l|${id}|${r * 3 + i + 1}` }))) });
const linienZahl = async (u: Umgebung) => Number((await u.einstellung('bestellbot_linien')).trim()) || 6;

// ---------- Ablauf: unabhängig von Telegram und Datenbank, damit er sich testen lässt ----------
export interface Umgebung {
  bestellung(id: string): Promise<Bestellung | null>;
  zustand(id: string): Promise<Zustand | null>;
  // Ändert den Zustand nur, wenn er noch auf einem der erwarteten Schritte steht. Gibt false zurück, wenn nicht (Schutz gegen Doppelklick).
  zustandWechseln(id: string, von: string[], nach: string, werte?: Json, frageMsg?: number | null, fehler?: string | null): Promise<boolean>;
  chatBestellung(chat: string): Promise<string | null>;
  chatSetzen(chat: string, id: string | null): Promise<void>;
  bestellungNachFrage(msg: number): Promise<string | null>;
  offene(): Promise<{ id: string; nummer: number; name: string; schritt: string }[]>;
  einstellung(name: string): Promise<string>;
  sponsoren(): Promise<Record<string, Sponsor>>;
  datei(pfad: string): Promise<Uint8Array | null>;
  ablegen(pfad: string, bytes: Uint8Array): Promise<void>;
  bestellungSpeichern(id: string, felder: Json): Promise<void>;
  senden(chat: string, text: string, knoepfe?: Json): Promise<number | null>;
  knoepfeWeg(chat: string, msg: number): Promise<void>;
  // kopie: Blindkopie an info@ (SMTP-Mails landen nicht unter Gesendet). Im Testbetrieb aus.
  mail(m: { an: string; betreff: string; text: string; anhaenge: { name: string; bytes: Uint8Array }[]; kopie: boolean }): Promise<void>;
}

const NAECHSTE = ['sponsor', 'wartet_id', 'andere_name', 'andere_id', 'andere_mail', 'linie'];
// Gibt es weitere Bestellungen, die auf Daniel warten? Dann einmal mit Knopf daran erinnern.
async function erinnern(u: Umgebung, chat: string, ausser: string) {
  const rest = (await u.offene()).filter((o) => o.id !== ausser);
  for (const o of rest.slice(0, 3)) await u.senden(chat, T.wartetNoch(o.nummer, o.name), { inline_keyboard: [[{ text: 'Jetzt weitermachen', callback_data: `w|${o.id}` }]] });
}

// Stellt die passende Frage für den aktuellen Schritt
async function fragen(u: Umgebung, chat: string, b: Bestellung, z: Zustand) {
  const n = b.nummer;
  let msg: number | null = null;
  if (z.schritt === 'sponsor') msg = await u.senden(chat, T.sponsorFrage(n), SPONSOR_KNOEPFE(b.id));
  else if (z.schritt === 'wartet_id') msg = await u.senden(chat, T.jasminOhneId(n), SPONSOR_KNOEPFE(b.id, false));
  else if (z.schritt === 'andere_name') msg = await u.senden(chat, T.andereName(n));
  else if (z.schritt === 'andere_id') msg = await u.senden(chat, T.andereId(n));
  else if (z.schritt === 'andere_mail') msg = await u.senden(chat, T.andereMail(n));
  else if (z.schritt === 'linie') msg = await u.senden(chat, T.linieFrage(n, z.werte.sponsor === 'andere' ? z.werte.andere?.name : SPONSOR_NAMEN[z.werte.sponsor]), LINIEN_KNOEPFE(b.id, await linienZahl(u)));
  else if (z.schritt === 'ohne_k8') await u.senden(chat, T.ohneK8(n));
  else if (z.schritt === 'arbeitet') await u.senden(chat, T.laeuft(n));
  else await u.senden(chat, T.schonFertig(n));
  if (msg != null) await u.zustandWechseln(b.id, [z.schritt], z.schritt, z.werte, msg);
  if (['andere_name', 'andere_id', 'andere_mail', 'linie'].includes(z.schritt)) await u.chatSetzen(chat, b.id);
}

export async function knopf(u: Umgebung, chat: string, msg: number, daten: string) {
  const [art, id, wahl] = daten.split('|');
  const b = await u.bestellung(id), z = await u.zustand(id);
  if (!b || !z) return u.senden(chat, 'Diese Bestellung finde ich nicht mehr.');
  if (art === 'w') return fragen(u, chat, b, z);
  if (art === 'l') {
    if (z.schritt !== 'linie') return z.schritt === 'fertig' ? u.senden(chat, T.schonFertig(b.nummer)) : z.schritt === 'arbeitet' ? u.senden(chat, T.laeuft(b.nummer)) : undefined;
    await u.knoepfeWeg(chat, msg);
    return linieSetzen(u, chat, b, z, wahl);
  }
  if (art !== 's' || !['daniel', 'gmbh', 'jasmin', 'andere'].includes(wahl)) return;
  if (!['sponsor', 'wartet_id'].includes(z.schritt)) {
    // Schon weiter: zweiter Klick auf einen alten Knopf ändert nichts
    if (['arbeitet', 'fertig'].includes(z.schritt)) return u.senden(chat, z.schritt === 'fertig' ? T.schonFertig(b.nummer) : T.laeuft(b.nummer));
    if (z.werte.sponsor === wahl) return; // derselbe Knopf doppelt
  }
  await u.knoepfeWeg(chat, msg);
  const werte = { ...z.werte, sponsor: wahl };
  let nach = 'linie';
  if (wahl === 'andere') nach = 'andere_name';
  if (wahl === 'jasmin') {
    const sp = (await u.sponsoren()).jasmin;
    if (!sp?.id) nach = 'wartet_id';
  }
  const ok = await u.zustandWechseln(id, NAECHSTE, nach, werte);
  if (!ok) return;
  await fragen(u, chat, b, { ...z, schritt: nach, werte });
}

export async function text(u: Umgebung, chat: string, eingabe: string, antwortAuf: number | null) {
  const t = eingabe.trim();
  if (t.startsWith('/start') || t.startsWith('/offen')) {
    const offen = await u.offene();
    if (!offen.length) return u.senden(chat, `Hallo! Hier kommen neue Bestellungen an. ${T.nichtsOffen}`);
    for (const o of offen.slice(0, 5)) await u.senden(chat, T.wartetNoch(o.nummer, o.name), { inline_keyboard: [[{ text: 'Jetzt weitermachen', callback_data: `w|${o.id}` }]] });
    return;
  }
  // Welche Bestellung ist gemeint? Zuerst die, auf deren Frage geantwortet wurde, sonst die zuletzt gefragte.
  // Wartet sonst genau eine Bestellung auf eine getippte Antwort, ist die gemeint.
  const TIPPEN = ['andere_name', 'andere_id', 'andere_mail', 'linie'];
  let id = (antwortAuf != null ? await u.bestellungNachFrage(antwortAuf) : null) ?? await u.chatBestellung(chat);
  if (!id) { const w = (await u.offene()).filter((o) => TIPPEN.includes(o.schritt)); if (w.length === 1) id = w[0].id; }
  const b = id ? await u.bestellung(id) : null, z = id ? await u.zustand(id) : null;
  if (!b || !z || !TIPPEN.includes(z.schritt)) return u.senden(chat, T.nichtsOffen + ' Mit /offen siehst du, was noch offen ist.');

  if (z.schritt === 'andere_name') {
    if (t.length < 3) return u.senden(chat, T.andereName(b.nummer));
    const werte = { ...z.werte, andere: { ...(z.werte.andere || {}), name: t.slice(0, 80) } };
    if (await u.zustandWechseln(b.id, ['andere_name'], 'andere_id', werte)) await fragen(u, chat, b, { ...z, schritt: 'andere_id', werte });
    return;
  }
  if (z.schritt === 'andere_id') {
    const nr = t.replace(/\s+/g, '');
    if (!/^\d{5,15}$/.test(nr)) return u.senden(chat, T.idFalsch);
    const werte = { ...z.werte, andere: { ...z.werte.andere, id: nr } };
    if (await u.zustandWechseln(b.id, ['andere_id'], 'andere_mail', werte)) await fragen(u, chat, b, { ...z, schritt: 'andere_mail', werte });
    return;
  }
  if (z.schritt === 'andere_mail') {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) return u.senden(chat, T.mailFalsch);
    const werte = { ...z.werte, andere: { ...z.werte.andere, email: t.toLowerCase() } };
    if (await u.zustandWechseln(b.id, ['andere_mail'], 'linie', werte)) await fragen(u, chat, b, { ...z, schritt: 'linie', werte });
    return;
  }
  // Linie
  const linie = t.replace(/\s+/g, '');
  if (!/^\d{1,3}$/.test(linie) || Number(linie) < 1) return u.senden(chat, T.linieFalsch);
  return linieSetzen(u, chat, b, z, linie);
}

// Linie steht fest (Knopf oder getippt): Formulare und Mail
async function linieSetzen(u: Umgebung, chat: string, b: Bestellung, z: Zustand, linie: string) {
  const werte = { ...z.werte, linie };
  // Nur ein Durchlauf darf gewinnen: linie -> arbeitet
  if (!(await u.zustandWechseln(b.id, ['linie'], 'arbeitet', werte))) return u.senden(chat, T.laeuft(b.nummer));
  await u.chatSetzen(chat, null);
  await u.senden(chat, T.arbeitet(b.nummer));
  try {
    const r = await abschliessen(u, b, werte);
    await u.zustandWechseln(b.id, ['arbeitet'], 'fertig', werte, null, null);
    await u.senden(chat, r.text);
  } catch (e) {
    const f = String((e as Error)?.message ?? e).slice(0, 200);
    console.error('bestellbot', b.id, e);
    await u.zustandWechseln(b.id, ['arbeitet'], 'linie', z.werte, null, f);
    await u.chatSetzen(chat, b.id);
    await u.senden(chat, T.fehler(b.nummer, f));
    await fragen(u, chat, b, { ...z, schritt: 'linie' }); // Linien-Knöpfe neu, die alten sind weg
    return;
  }
  await erinnern(u, chat, b.id);
}

// Formulare ausfüllen, ablegen, Mail schicken, Bestellung speichern
export async function abschliessen(u: Umgebung, b: Bestellung, werte: Json) {
  if (!mitK8(b.daten) && !mitAnespa(b.daten)) throw new Error('ohne K8 und ohne ANESPA gibt es kein Enagic-Formular');
  if (b.mail_sponsor) return { text: T.schonFertig(b.nummer) };
  const wahl: string = werte.sponsor;
  const x: Partial<Sponsor> = wahl === 'andere' ? (werte.andere || {}) : ((await u.sponsoren())[wahl] || {});
  const sp: Sponsor = { name: x.name || (wahl === 'andere' ? '' : SPONSOR_NAMEN[wahl]), id: x.id || '', email: x.email || '' };
  if (wahl === 'jasmin' && !sp.id) throw new Error('für Jasmin ist noch keine Sponsor-ID hinterlegt');

  // Empfänger aus den Einstellungen, nicht fest im Code. Testadresse schlägt alles.
  const test = (await u.einstellung('bestellbot_testmail')).trim();
  let an = (await u.einstellung('mail_enagic_' + wahl)).trim();
  if (!an && wahl === 'andere') an = (await u.einstellung('mail_enagic_daniel')).trim();
  if (wahl === 'jasmin' && !an) throw new Error('für Jasmin ist noch keine Mail-Adresse hinterlegt');
  if (!test && (!an || an.includes('XXX'))) throw new Error('für ' + SPONSOR_NAMEN[wahl] + ' ist keine Mail-Adresse hinterlegt, Einstellung mail_enagic_' + (wahl === 'andere' ? 'daniel' : wahl));
  const ziel = test || an;

  const a = vorbelegung(b);
  const sponsorSig = wahl === 'andere' ? null : await u.datei(`sponsor/${wahl}.png`);
  const kundeSig = b.dateien?.unterschrift ? await u.datei(b.dateien.unterschrift) : null;
  if (!kundeSig) throw new Error('Unterschrift des Kunden fehlt im Speicher');
  const pdfs = await pdfsErstellen(b, sp, werte.linie, a, {
    formular: async (n) => { const x = await u.datei('formulare/' + n); if (!x) throw new Error('Formular fehlt im Speicher: formulare/' + n); return x; },
    kundeSig, sponsorSig,
  });
  const ablage = [];
  for (const p of pdfs) { const pfad = `${b.id}/${p.name}`; await u.ablegen(pfad, p.bytes); ablage.push({ name: p.name, pfad }); }

  const anhaenge = [...pdfs];
  const nn = String(b.daten.nachname || 'Kunde').replace(/[^\wäöüÄÖÜß-]+/g, '-');
  for (const [k, wort] of [['ausweis_vorne', 'ID-Front'], ['ausweis_hinten', 'ID-Back'], ['zahlungsbeleg', 'Zahlungsbeleg']]) {
    const pfad = b.dateien?.[k];
    if (!pfad) continue;
    const bytes = await u.datei(pfad);
    if (bytes) anhaenge.push({ name: `${wort}-${nn}${(String(pfad).match(/\.[a-z0-9]+$/i) || ['.jpg'])[0].toLowerCase()}`, bytes });
  }
  // Text der Mail ist genau der Text für Enagic, damit Daniel nur weiterleitet
  await u.mail({ an: ziel, betreff: (test ? '[TEST] ' : '') + enagicBetreff(b), text: enagicText(b, sp, werte.linie), anhaenge, kopie: !test });

  await u.bestellungSpeichern(b.id, {
    sponsor: wahl, linie: werte.linie, status: 'Vertrag fertig', pdfs: ablage, mail_sponsor: new Date().toISOString(),
    angaben: { ...a, ...(wahl === 'andere' ? { sponsor_name: sp.name, sponsor_id: sp.id, sponsor_email: sp.email } : {}) },
  });

  const zeilen = [
    T.fertig(b.nummer, test ? `${ziel} (Testadresse)` : ziel), '',
    `An: ${(await u.einstellung('mail_enagic_ziel')).trim() || 'goc.eu@enagic.com'}`, `Betreff: ${enagicBetreff(b)}`, '',
    `Im Formular: Preis ${eur(a.preis)}${a.mwst ? `, MwSt ${eur(a.mwst)}` : ''}, Versand ${eur(a.versand) || 'fehlt, bitte eintragen'}, gesamt ${eur(summe(a))}${b.daten.zahlung === 'raten' ? `, Anzahlung ${eur(a.anzahlung) || 'fehlt'}` : ''}.`,
    `Anhänge: ${anhaenge.map((x) => x.name).join(', ')}`,
  ];
  if (wahl !== 'andere' && !sponsorSig) zeilen.push('', `Hinweis: Für ${sp.name} ist keine Unterschrift gespeichert, das Formular ist ohne Sponsor-Unterschrift. Bitte vor dem Weiterleiten unterschreiben oder einmal im Dashboard hinterlegen.`);
  if (wahl === 'andere') zeilen.push('', 'Hinweis: Ohne Sponsor-Unterschrift, bitte von der Person unterschreiben lassen.');
  if (!sp.id) zeilen.push('', `Hinweis: Für ${sp.name} ist keine Sponsor-ID hinterlegt, das Feld ist leer.`);
  return { text: zeilen.join('\n') };
}

// ---------- Anbindung an Supabase, Telegram und IONOS ----------
function umgebung(db: SupabaseClient, token: string): Umgebung {
  const tg = async (methode: string, body: Json) => {
    const r = await fetch(`https://api.telegram.org/bot${token}/${methode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!j.ok) console.error('telegram', methode, j.description);
    return j;
  };
  const post = nodemailer.createTransport({ host: 'smtp.ionos.de', port: 465, secure: true, auth: { user: ABSENDER, pass: Deno.env.get('IONOS_PASSWORT') ?? '' } });
  const pruefen = <T>({ data, error }: { data: T; error: unknown }) => { if (error) throw error; return data; };
  return {
    bestellung: async (id) => pruefen(await db.from('uk_bestellungen').select('id, nummer, erstellt, status, von, daten, dateien, sponsor, linie, angaben, pdfs, mail_sponsor').eq('id', id).maybeSingle()),
    zustand: async (id) => pruefen(await db.from('uk_bestellbot').select('bestellung_id, schritt, werte, frage_msg').eq('bestellung_id', id).maybeSingle()),
    zustandWechseln: async (id, von, nach, werte, frageMsg, fehler) => {
      const felder: Json = { schritt: nach, aktualisiert: new Date().toISOString() };
      if (werte !== undefined) felder.werte = werte;
      if (frageMsg !== undefined) felder.frage_msg = frageMsg;
      if (fehler !== undefined) felder.fehler = fehler;
      const r = pruefen(await db.from('uk_bestellbot').update(felder).eq('bestellung_id', id).in('schritt', von).select('bestellung_id'));
      return (r || []).length > 0;
    },
    chatBestellung: async (chat) => (pruefen(await db.from('uk_bestellbot_chat').select('bestellung_id').eq('chat_id', chat).maybeSingle()) as Json)?.bestellung_id ?? null,
    chatSetzen: async (chat, id) => { pruefen(await db.from('uk_bestellbot_chat').upsert({ chat_id: chat, bestellung_id: id, aktualisiert: new Date().toISOString() })); },
    bestellungNachFrage: async (msg) => (pruefen(await db.from('uk_bestellbot').select('bestellung_id').eq('frage_msg', msg).limit(1).maybeSingle()) as Json)?.bestellung_id ?? null,
    offene: async () => {
      const z = pruefen(await db.from('uk_bestellbot').select('bestellung_id, schritt, uk_bestellungen!inner(nummer, daten, status)').in('schritt', NAECHSTE).neq('uk_bestellungen.status', 'Storniert')) as Json[];
      return (z || []).map((x) => ({ id: x.bestellung_id, schritt: x.schritt, nummer: x.uk_bestellungen.nummer, name: [x.uk_bestellungen.daten?.vorname, x.uk_bestellungen.daten?.nachname].filter(Boolean).join(' ') }))
        .sort((a, b) => a.nummer - b.nummer);
    },
    einstellung: async (name) => String((pruefen(await db.from('uk_einstellungen').select('wert').eq('name', name).maybeSingle()) as Json)?.wert ?? ''),
    sponsoren: async () => {
      const z = pruefen(await db.from('uk_einstellungen').select('name, wert').like('name', 'sponsor_%')) as Json[];
      return Object.fromEntries((z || []).map((x) => { try { return [x.name.replace('sponsor_', ''), JSON.parse(x.wert)]; } catch { return [x.name, {}]; } }));
    },
    datei: async (pfad) => { const { data, error } = await db.storage.from(BUCKET).download(pfad); if (error || !data) return null; return new Uint8Array(await data.arrayBuffer()); },
    ablegen: async (pfad, bytes) => { const { error } = await db.storage.from(BUCKET).upload(pfad, bytes, { contentType: 'application/pdf', upsert: true }); if (error) throw error; },
    bestellungSpeichern: async (id, felder) => { pruefen(await db.from('uk_bestellungen').update(felder).eq('id', id)); },
    senden: async (chat, t, knoepfe) => (await tg('sendMessage', { chat_id: chat, text: t, disable_web_page_preview: true, ...(knoepfe ? { reply_markup: knoepfe } : {}) }))?.result?.message_id ?? null,
    knoepfeWeg: async (chat, msg) => { await tg('editMessageReplyMarkup', { chat_id: chat, message_id: msg, reply_markup: { inline_keyboard: [] } }); },
    mail: async (m) => {
      await post.sendMail({ from: `Ursprungskraft <${ABSENDER}>`, to: m.an, bcc: m.kopie && m.an !== ABSENDER ? ABSENDER : undefined, replyTo: ABSENDER,
        subject: m.betreff, text: m.text, attachments: m.anhaenge.map((x) => ({ filename: x.name, content: Buffer.from(x.bytes) })) });
    },
  };
}

let geheim: { token: string; secret: string } | null = null;
if (!Deno.env.get('BESTELLBOT_TEST')) Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('nur POST', { status: 405 });
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  if (!geheim) { const { data, error } = await db.rpc('uk_bestellbot_geheim'); if (error || !data?.token) return new Response('kein Schlüssel', { status: 500 }); geheim = data; }
  // Nur Telegram kennt das Geheimnis, das beim setWebhook mitgegeben wurde
  if (req.headers.get('x-telegram-bot-api-secret-token') !== geheim!.secret) return new Response('nein', { status: 401 });
  let up: Json;
  try { up = await req.json(); } catch { return new Response('ok'); }
  // Jedes Update nur einmal (Telegram wiederholt, wenn wir zu langsam sind)
  const { error: doppelt } = await db.from('uk_bestellbot_updates').insert({ update_id: up.update_id });
  if (doppelt) { if (doppelt.code !== '23505') console.error('bestellbot updates', doppelt); return new Response('ok'); }

  const u = umgebung(db, geheim!.token);
  const chat = String(up.callback_query?.message?.chat?.id ?? up.message?.chat?.id ?? '');
  try {
    // Nur Daniels und Jasmins Chat dürfen den Bot bedienen
    const erlaubt = [await u.einstellung('tg_chat_daniel'), await u.einstellung('tg_chat_jasmin')].map((x) => x.trim()).filter(Boolean);
    if (up.callback_query) {
      await fetch(`https://api.telegram.org/bot${geheim!.token}/answerCallbackQuery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callback_query_id: up.callback_query.id }) });
      if (!erlaubt.includes(chat)) return new Response('ok');
      await knopf(u, chat, up.callback_query.message.message_id, String(up.callback_query.data || ''));
    } else if (up.message?.text) {
      if (!erlaubt.includes(chat)) { await u.senden(chat, T.fremd); return new Response('ok'); }
      await text(u, chat, up.message.text, up.message.reply_to_message?.message_id ?? null);
    }
  } catch (e) {
    console.error('bestellbot', e);
    if (chat) await u.senden(chat, 'Da ist etwas schiefgegangen: ' + String((e as Error)?.message ?? e).slice(0, 200));
  }
  // Immer 200, sonst schickt Telegram dasselbe Update immer wieder
  return new Response('ok');
});

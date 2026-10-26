// Ablauf-Test des Bestell-Bots ohne Datenbank, Telegram und Mail (26.10.2026). Start: BESTELLBOT_TEST=1 deno run -A ablauf-test.ts
import { knopf, text, type Umgebung, type Bestellung, type Zustand } from '../supabase/functions/bestellbot/index.ts';
import { PDFDocument } from 'npm:pdf-lib@1.17.1';
// Ordner mit den vier Enagic-Formularen
const F = new URL('../../an-zweiter-claude-bestellbot/vorhanden/dashboard/formulare/', import.meta.url).pathname;
const sig = await Deno.readFile(new URL('test-unterschrift.png', import.meta.url));
const DANIEL = '111';
function welt(best: Bestellung[], start: Record<string, Zustand>, einst: Record<string, string>, mitSponsorSig = true) {
  const z = structuredClone(start); const chat: Record<string, string | null> = {}; const log: string[] = []; const mails: any[] = []; const ablage: Record<string, Uint8Array> = {};
  let msg = 100;
  const u: Umgebung = {
    bestellung: async (id) => best.find((b) => b.id === id) ?? null,
    zustand: async (id) => z[id] ?? null,
    zustandWechseln: async (id, von, nach, werte, frageMsg) => { const x = z[id]; if (!x || !von.includes(x.schritt)) return false; x.schritt = nach; if (werte !== undefined) x.werte = werte; if (frageMsg !== undefined) x.frage_msg = frageMsg; return true; },
    chatBestellung: async (c) => chat[c] ?? null, chatSetzen: async (c, id) => { chat[c] = id; },
    bestellungNachFrage: async (m) => Object.values(z).find((x) => x.frage_msg === m)?.bestellung_id ?? null,
    offene: async () => Object.values(z).filter((x) => ['sponsor', 'wartet_id', 'andere_name', 'andere_id', 'andere_mail', 'linie'].includes(x.schritt)).map((x) => { const b = best.find((y) => y.id === x.bestellung_id)!; return { id: b.id, nummer: b.nummer, name: b.daten.vorname + ' ' + b.daten.nachname, schritt: x.schritt }; }),
    einstellung: async (n) => einst[n] ?? '',
    sponsoren: async () => ({ daniel: { name: 'Daniel Zürcher', id: '21000078463', email: 'info@ursprungskraft.net' }, gmbh: { name: 'Ursprungskraft GmbH', id: '21000127564', email: 'ursprungskraft.gmbh@gmail.com' }, jasmin: { name: 'Jasmin Groth', id: '', email: 'info@jasmin-groth.de' } }),
    datei: async (p) => p.startsWith('formulare/') ? Deno.readFile(F + p.slice(10)) : p.startsWith('sponsor/') ? (mitSponsorSig ? sig : null) : p.includes('unterschrift') ? sig : p.includes('ausweis') ? new Uint8Array([1, 2, 3]) : null,
    ablegen: async (p, b) => { ablage[p] = b; },
    bestellungSpeichern: async (id, f) => { Object.assign(best.find((b) => b.id === id)!, f); },
    senden: async (c, t, k) => { log.push(`→ ${t}${k ? '  [' + k.inline_keyboard.flat().map((x: any) => x.text).join(' | ') + ']' : ''}`); return ++msg; },
    knoepfeWeg: async () => {}, mail: async (m) => { mails.push(m); },
  };
  return { u, z, log, mails, ablage, chat };
}
const basis = (id: string, nummer: number, extra: any = {}): Bestellung => ({ id, nummer, erstellt: '2026-10-26T09:00:00Z', status: 'Neu', von: null, sponsor: null, linie: null, angaben: {}, pdfs: [], mail_sponsor: null,
  dateien: { unterschrift: `eingang/${id}/unterschrift.png`, ...(extra.dateien || {}) },
  daten: { vorname: 'Max', nachname: 'Mustermann', geburtsdatum: '1980-05-17', strasse: 'Hauptstraße 1', plz: '10115', ort: 'Berlin', land: 'Deutschland', land_kurz: 'DE', handy: '+49 170 1234567', email: 'max@example.com', als: 'Verbraucher', zahlung: 'ueberweisung', k8: 'ja', nicht_eu: false, ...(extra.daten || {}) } });

let fehler = 0; const pruefe = (ok: boolean, was: string) => { console.log((ok ? '  ok   ' : '  FEHLER ') + was); if (!ok) fehler++; };

console.log('\n1) DE, Überweisung, Daniel, Linie 2, Testadresse gesetzt');
{ const b = basis('a1', 1001); const w = welt([b], { a1: { bestellung_id: 'a1', schritt: 'sponsor', werte: {}, frage_msg: 100 } }, { mail_enagic_daniel: 'XXX', bestellbot_testmail: 'test@example.com', mail_enagic_ziel: 'goc.eu@enagic.com' });
  await knopf(w.u, DANIEL, 100, 's|a1|daniel'); await knopf(w.u, DANIEL, 100, 's|a1|daniel');
  await text(w.u, DANIEL, '2', null); await text(w.u, DANIEL, '2', null);
  w.log.forEach((l) => console.log('   ' + l.replace(/\n/g, '\n     ')));
  pruefe(w.mails.length === 1, 'genau eine Mail trotz Doppelklick und doppelter Zahl');
  pruefe(w.mails[0]?.an === 'test@example.com' && w.mails[0]?.kopie === false, 'Mail nur an Testadresse, ohne Kopie');
  pruefe(w.mails[0]?.betreff === '[TEST] NEW Sale Leveluk K8 from Germany', 'Betreff');
  pruefe(b.status === 'Vertrag fertig' && b.sponsor === 'daniel' && b.linie === '2' && b.pdfs.length === 1, 'Bestellung gespeichert');
  const doc = await PDFDocument.load(w.mails[0].anhaenge[0].bytes); pruefe(doc.getPageCount() === 1, 'Bestellformular 1 Seite');
  await Deno.writeFile('t1.pdf', w.mails[0].anhaenge[0].bytes); }

console.log('\n2) CH, Raten 10, Distributor, Ausweis, GmbH, echte Adresse');
{ const b = basis('b2', 1002, { daten: { land: 'Schweiz', land_kurz: 'CH', plz: '8001', ort: 'Zürich', zahlung: 'raten', raten_anzahl: '10', zahltag: '15', anzahlung: '716', iban: 'CH93 0076 2011 6238 5295 7', als: 'Distributor', anrede: 'Herr', nicht_eu: true, beruf: 'Koch' }, dateien: { ausweis_vorne: 'eingang/b2/ausweis-vorne.jpg', ausweis_hinten: 'eingang/b2/ausweis-hinten.jpg' } });
  const w = welt([b], { b2: { bestellung_id: 'b2', schritt: 'sponsor', werte: {}, frage_msg: 100 } }, { mail_enagic_gmbh: 'ursprungskraft.gmbh@gmail.com' }, false);
  await knopf(w.u, DANIEL, 100, 's|b2|gmbh'); await text(w.u, DANIEL, ' 3 ', null);
  w.log.forEach((l) => console.log('   ' + l.replace(/\n/g, '\n     ')));
  const m = w.mails[0]; pruefe(m?.an === 'ursprungskraft.gmbh@gmail.com' && m.kopie, 'an GmbH mit Kopie');
  pruefe(m?.anhaenge.map((x: any) => x.name).join(',') === 'Bestellformular-LeveLuk-K8-Mustermann.pdf,Ratenzahlungsantrag-LeveLuk-K8-Mustermann.pdf,ID-Front-Mustermann.jpg,ID-Back-Mustermann.jpg', 'Anhänge: 2 PDFs + 2 Ausweisfotos');
  pruefe(/Sponsor Line 3 A/.test(m?.text) && /Switzerland/.test(m?.text) && /ID Front/.test(m?.text), 'Enagic-Text');
  pruefe(w.log.some((l) => l.includes('keine Unterschrift gespeichert')), 'Hinweis fehlende Sponsor-Unterschrift');
  const doc = await PDFDocument.load(m.anhaenge[0].bytes); pruefe(doc.getPageCount() === 3, 'Distributor + Non-EU + Bestellformular = 3 Seiten');
  await Deno.writeFile('t2a.pdf', m.anhaenge[0].bytes); await Deno.writeFile('t2b.pdf', m.anhaenge[1].bytes); }

console.log('\n3) Jemand anderes, Falscheingaben, Mail an Daniels Adresse');
{ const b = basis('c3', 1003); const w = welt([b], { c3: { bestellung_id: 'c3', schritt: 'sponsor', werte: {}, frage_msg: 100 } }, { mail_enagic_daniel: 'daniel@hotmail.example' });
  await knopf(w.u, DANIEL, 100, 's|c3|andere');
  for (const t of ['Eva Muster', 'abc', '21000099999', 'keine mail', 'eva@example.com', 'zwei', '4']) await text(w.u, DANIEL, t, null);
  w.log.forEach((l) => console.log('   ' + l.replace(/\n/g, '\n     ')));
  pruefe(w.mails[0]?.an === 'daniel@hotmail.example', 'an Daniels Adresse');
  pruefe(/Sponsor ID: 21000099999\nSponsor: Eva Muster/.test(w.mails[0]?.text), 'Sponsor der anderen Person im Text');
  pruefe(b.angaben.sponsor_name === 'Eva Muster' && b.sponsor === 'andere', 'gespeichert'); }

console.log('\n4) Jasmin ohne ID, dann umgeschaltet auf Daniel; ohne K8; zwei Bestellungen gleichzeitig');
{ const b4 = basis('d4', 1004, { daten: { vorname: 'Anna' } }); const b5 = basis('e5', 1005, { daten: { vorname: 'Ben', k8: 'nein' } }); const b6 = basis('f6', 1006, { daten: { vorname: 'Cem' } });
  const w = welt([b4, b5, b6], { d4: { bestellung_id: 'd4', schritt: 'sponsor', werte: {}, frage_msg: 100 }, e5: { bestellung_id: 'e5', schritt: 'ohne_k8', werte: {}, frage_msg: null }, f6: { bestellung_id: 'f6', schritt: 'sponsor', werte: {}, frage_msg: 101 } }, { mail_enagic_daniel: 'daniel@hotmail.example' });
  await knopf(w.u, DANIEL, 100, 's|d4|jasmin');
  await knopf(w.u, DANIEL, 101, 's|f6|daniel');
  await knopf(w.u, DANIEL, 102, 's|d4|daniel');
  // Daniel antwortet per "Antworten" auf die Linien-Frage von f6 (Nachricht 102), obwohl d4 zuletzt gefragt wurde
  await text(w.u, DANIEL, '5', 102);
  await text(w.u, DANIEL, '6', null);
  await knopf(w.u, DANIEL, 1, 'w|e5');
  w.log.forEach((l) => console.log('   ' + l.replace(/\n/g, '\n     ')));
  pruefe(b6.linie === '5' && b4.linie === '6', 'Antworten landen bei der richtigen Bestellung');
  pruefe(w.mails.length === 2, 'zwei Mails');
  pruefe(w.log.some((l) => l.includes('Für Jasmin ist noch keine Sponsor-ID')), 'Jasmin ohne ID gemeldet');
  pruefe(w.log.some((l) => l.includes('#1005: Ohne K8')), 'ohne K8 gemeldet'); }

console.log('\n5) Keine Adresse hinterlegt (XXX) und kein Testbetrieb');
{ const b = basis('g7', 1007); const w = welt([b], { g7: { bestellung_id: 'g7', schritt: 'linie', werte: { sponsor: 'daniel' }, frage_msg: 100 } }, { mail_enagic_daniel: 'XXX' });
  await w.u.chatSetzen(DANIEL, 'g7'); await text(w.u, DANIEL, '1', null);
  w.log.forEach((l) => console.log('   ' + l));
  pruefe(w.mails.length === 0 && w.z.g7.schritt === 'linie', 'nichts gesendet, wartet wieder auf Linie'); }

console.log(fehler ? `\n${fehler} FEHLER` : '\nAlle Prüfungen bestanden');
if (fehler) Deno.exit(1);

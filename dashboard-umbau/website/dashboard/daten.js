// Datenschicht für Dashboard, Landingpage und Fragebogen.
// Echtbetrieb: Supabase (Projekt Ursprungskraft, Zürich). Braucht ../vendor/supabase.js davor.
// Vorschau mit Beispieldaten: ?demo an die Adresse hängen, dann bleibt alles im Browser.
// Tabellen und Felder: ../../supabase/schema.sql, öffentliche Funktionen: ../../supabase/funktionen.sql.

const Daten = (() => {
  const SCHLUESSEL = 'uk-dashboard-v11';
  const TABELLEN = ['uk_partner', 'uk_kunden', 'uk_maschinen', 'uk_maschinen_verlauf', 'uk_aufgaben', 'uk_fragebogen', 'uk_wohnung', 'uk_unterlagen'];
  const token = () => Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);

  const heute = () => new Date().toISOString().slice(0, 10);
  const tageAb = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const id = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

  function beispiel() {
    const k1 = id(), k2 = id(), k3 = id(), k4 = id(), k5 = id(), k6 = id();
    const p1 = id(), p2 = id(), p3 = id(), pj = id();
    const partner = [
      { id: pj, kurz: 'jasmin', vorname: 'Jasmin', nachname: 'Groth', art: 'Vertriebspartner', telefon: '', email: '', ort: 'Hamburg', seit: heute(), aktiv: true, notiz: 'Empfehlungen aus Jasmins Umfeld' },
      { id: p1, kurz: 'beispiel-lena', vorname: 'Beispiel Lena', nachname: 'Brunner', art: 'Vertriebspartner', telefon: '+41 79 000 10 01', email: '', ort: 'Bern', seit: tageAb(-400), aktiv: true, notiz: '' },
      { id: p2, kurz: 'beispiel-tom', vorname: 'Beispiel Tom', nachname: 'Wagner', art: 'Vertriebspartner', telefon: '+49 170 000 10 02', email: '', ort: 'Stuttgart', seit: tageAb(-90), aktiv: true, notiz: '' },
      { id: p3, kurz: 'beispiel-mia', vorname: 'Beispiel Mia', nachname: 'Fit', art: 'Influencer', telefon: '', email: '', ort: 'Wien', seit: tageAb(-20), aktiv: true, notiz: 'Instagram' },
    ];
    const kunden = [
      { id: k1, vorname: 'Beispiel Anna', nachname: 'Muster', telefon: '+41 79 000 00 01', email: 'anna@beispiel.ch', ort: 'Zürich', land: 'CH', status: 'Geliefert', geraet: 'LeveLuk K8', kaufdatum: tageAb(-350), filter_zuletzt: null, partner_id: p1, empfohlen_von: '', notiz: '' },
      { id: k2, vorname: 'Beispiel Familie', nachname: 'Huber', telefon: '+49 170 000 00 02', email: '', ort: 'München', land: 'DE', status: 'Testet', geraet: '', kaufdatum: null, filter_zuletzt: null, partner_id: p3, empfohlen_von: '', notiz: 'Testet seit letzter Woche', vermerke: ['kinder', 'tiere', 'kaffee'] },
      { id: k3, vorname: 'Beispiel Marco', nachname: 'Keller', telefon: '+41 78 000 00 03', email: '', ort: 'Luzern', land: 'CH', status: 'Interessent', geraet: '', kaufdatum: null, filter_zuletzt: null, partner_id: p3, empfohlen_von: '', notiz: 'Möchte einen Termin vor Ort' },
      { id: k4, vorname: 'Beispiel Sabine', nachname: 'Roth', telefon: '+43 660 000 00 04', email: '', ort: 'Salzburg', land: 'AT', status: 'Geliefert', geraet: 'LeveLuk SD501', kaufdatum: tageAb(-120), filter_zuletzt: null, partner_id: p1, empfohlen_von: '', notiz: '' },
      { id: k5, vorname: 'Beispiel Jonas', nachname: 'Frei', telefon: '', email: '', ort: 'Basel', land: 'CH', status: 'Geliefert', geraet: 'LeveLuk K8', kaufdatum: tageAb(-12), filter_zuletzt: null, partner_id: p2, empfohlen_von: '', notiz: '' },
      { id: k6, vorname: 'Beispiel Eva', nachname: 'Lang', telefon: '', email: '', ort: 'Ulm', land: 'DE', status: 'Kein Interesse', geraet: '', kaufdatum: null, filter_zuletzt: null, partner_id: p2, empfohlen_von: '', notiz: '' },
    ];
    // Echte Interessenten aus Jasmins Umfeld für die Vorführung in Hamburg (November 2026).
    // Schreibweisen aus einer Sprachnachricht, mit Fragezeichen markierte noch mit Jasmin prüfen.
    const HH = 'Vorführung in Hamburg, November 2026';
    [['Tanja', 'Neide', ''], ['Şafak', 'König', ''], ['Sascha', 'Brandt', ''], ['Marcel', 'Luck', ''],
     ['Inessa', '', 'Nachname unbekannt'], ['Basti', 'Kopp', ''], ['Gerrit', 'Grünberg', ''], ['Eltern von Jasmin', '', 'Jasmins Eltern']].forEach(([v, n, hinweis]) => {
      kunden.push({ id: id(), vorname: v, nachname: n, telefon: '', email: '', ort: 'Hamburg', land: 'DE', status: 'Interessent', geraet: '', kaufdatum: null,
        filter_zuletzt: null, partner_id: pj, empfohlen_von: '', notiz: [HH, hinweis].filter(Boolean).join('. ') });
    });
    kunden.forEach((k) => { k.token = token(); });
    const maschinen = Array.from({ length: 13 }, (_, i) => ({
      id: id(), nummer: i + 1, modell: '', seriennummer: '', status: 'Verfügbar',
      kunde_id: null, seit: null, rueckgabe_bis: null, kaufinteresse: null, notiz: '',
    }));
    Object.assign(maschinen[2], { status: 'Beim Kunden', kunde_id: k2, seit: tageAb(-6), rueckgabe_bis: tageAb(1), kaufinteresse: 'Offen' });
    Object.assign(maschinen[6], { status: 'Wartung', notiz: 'Reinigung fällig' });
    const verlauf = [
      { id: id(), maschine_id: maschinen[2].id, kunde_id: k2, kunde_name: 'Beispiel Familie Huber', von: tageAb(-6), bis: null, kaufinteresse: 'Offen', notiz: '' },
      { id: id(), maschine_id: maschinen[2].id, kunde_id: k1, kunde_name: 'Beispiel Anna Muster', von: tageAb(-370), bis: tageAb(-356), kaufinteresse: 'Ja', notiz: 'Hat danach gekauft' },
    ];
    // Echte Projektaufgaben (Stand 08.10.2026), keine Beispiele. prio: rot, orange oder leer
    const A = (titel, wer, faellig, prio = '', notiz = '') => ({ id: id(), titel, wer, faellig, prio, notiz, kunde_id: null, erledigt: false });
    const naechsterMontag = (() => { const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return d.toISOString().slice(0, 10); })();
    const naechsterMonat = (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 2).toISOString().slice(0, 10); })();
    const aufgaben = [
      { id: id(), titel: 'Beispiel aus Daniels Assistent: Filter bei Familie Huber bestellen', notiz: 'Beispiel: So sieht eine Sprachnachricht von Daniel im Eingang aus.', wer: null, prio: '', faellig: null, eingang: true, neu: true, quelle: 'assistent', erledigt: false },
      A('Fragenkatalog an Daniel schicken', 'Jasmin', heute(), 'rot'),
      A('Fragebogen fertig bauen (Vorlage Zinzino, Wording Kangenwasser)', 'Jasmin', heute(), 'rot'),
      A('Supabase-Konto und Projekt anlegen (Region Zürich, erledigt 08.10.)', 'Jasmin', heute(), 'orange'),
      A('Netlify-Konto anlegen (neutrales Google-Konto)', 'Jasmin', heute(), 'orange'),
      A('Fragenkatalog per Sprachnachricht beantworten', 'Daniel', heute(), 'rot'),
      A('Angaben fürs Impressum schicken (Firma, Anschrift, Telefon, E-Mail)', 'Daniel', tageAb(1), 'orange'),
      A('Dashboard an Supabase anbinden, Anmeldung für Daniel und Jasmin', 'Jasmin', tageAb(2), 'orange'),
      A('Domain ursprungskraft.net bei IONOS mit Netlify verbinden', 'Jasmin', tageAb(2)),
      A('Word-Liste der 13 Testgeräte schicken', 'Daniel', tageAb(2), 'orange'),
      A('Leeres Enagic-Bestellformular als PDF schicken', 'Daniel', tageAb(2), 'orange'),
      A('WhatsApp Business einrichten (automatische Antworten, Homepage im Profil)', 'Daniel', tageAb(2)),
      A('Logo fertig machen (Richtung Natur, Wurzel)', 'Jasmin', tageAb(2), 'orange'),
      A('Fahrplan aktualisieren', 'Jasmin', tageAb(2)),
      A('Corporate Identity Ursprungskraft (Farben, Schrift, Logo-Einsatz)', 'Jasmin', naechsterMontag),
      A('Kundenportal: Anwendungen nach Thema und pH-Wert', 'Jasmin', naechsterMontag),
      A('Landingpage Kangenwasser mit Empfehlungslinks', 'Jasmin', naechsterMontag, '', 'Ziel der Seite hängt an Daniels Antwort auf Frage 8'),
      A('Fotos und Videos für die Landingpage schicken', 'Daniel', naechsterMontag),
      A('Telegram-Bots für Daniel: Tagesplan mit Fahrzeit, Assistent zum Abheften', 'Jasmin', naechsterMonat, '', 'Bots angelegt am 08.10., Vorlage Tagesplan abgenommen'),
      A('Provisionszahlen für "Meine Zahlen" an AJ geben (was Jasmin je verkauftem Gerät bekommt)', 'Jasmin', null),
      A('Landkarte Kunden und Partner, Partner mit Anschrift', 'Jasmin', naechsterMonat),
      A('Bestellprozess: Enagic-Formular automatisch ausfüllen', 'Jasmin', naechsterMonat, '', 'wartet auf das Formular'),
      A('Vermieter fragen: untere Wohnung tageweise vermieten', 'Daniel', naechsterMonat),
      A('Kalender für Testgeräte (frei, unterwegs)', 'Jasmin', null, '', 'erst nach Daniels Antwort zu Frage 13 und 14'),
      A('Broschüre neu in A5', 'Jasmin', null),
      A('Google Unternehmenskonto einrichten', 'Jasmin', null, '', 'klären: Unternehmensprofil (Maps) oder Workspace'),
      A('Landingpage Frequenzbett', 'Jasmin', null),
      A('Seite Testwohnung mit Buchungskalender', 'Jasmin', null),
      A('Automatische Mail nach dem Kauf (Danke, nächste Schritte, Kanal beitreten)', 'Jasmin', naechsterMontag),
      A('Newsletter mit Double-Opt-In vorbereiten', 'Jasmin', null),
      A('Fragen an Daniel gesammelt weitergeben', 'Jasmin', tageAb(1), 'orange'),
      A('Hotmail: Ordner und Regeln für info@, kontakt@, support@ anlegen', 'Daniel', naechsterMontag),
      A('Besuch in Hamburg im November planen (Datum, Vorführtermine)', 'Jasmin', naechsterMontag, 'orange'),
      A('Persönliche Partner-Landingpage als Bezahlangebot ausarbeiten (Preis, wer kassiert, Enagic-Regeln)', 'Jasmin', null, '', 'Idee vom 08.10.2026'),
      A('Testgerät für Hamburg mitnehmen, Interessenten einladen', 'Jasmin', null, '', 'Interessenten stehen bei Kunden, Partner Jasmin'),
    ];
    const F = (kunde_id, durchgang, tageZurueck, werte) => ({ id: id(), kunde_id, durchgang, erstellt: tageAb(-tageZurueck), antworten: werte, einwilligung: 'Beispiel', stimme: false, newsletter: false });
    const fragebogen = [
      F(k1, 1, 380, { menge: '1 bis 1,5 Liter', quelle: 'Flaschen', flaschen: 12, kaffee: 4, softdrinks: 2, gern: 4, g_wasser: 5, g_kaffee: 6, energie: 4, schlaf: 5, konzentration: 4, erholung: 5, stress: 5, wohl: 5, bewegung: 2 }),
      F(k1, 2, 366, { menge: '1,5 bis 2 Liter', quelle: 'Leitung', flaschen: 2, kaffee: 3, softdrinks: 1, gern: 7, g_wasser: 8, g_kaffee: 8, energie: 6, schlaf: 6, konzentration: 5, erholung: 6, stress: 6, wohl: 7, bewegung: 3, arten: ['ph95', 'ph25'], wofuer: ['trinken', 'kaffee', 'putzen'] }),
      F(k1, 3, 352, { menge: '2 bis 2,5 Liter', quelle: 'Leitung', flaschen: 0, kaffee: 3, softdrinks: 0, gern: 8, g_wasser: 9, g_kaffee: 8, energie: 7, schlaf: 7, konzentration: 6, erholung: 7, stress: 6, wohl: 8, bewegung: 3, arten: ['ph95', 'ph25', 'ph115'], wofuer: ['trinken', 'kochen', 'kaffee', 'putzen'] }),
      F(k2, 1, 6, { menge: 'unter 1 Liter', quelle: 'Flaschen', flaschen: 18, kaffee: 2, softdrinks: 3, gern: 3, g_wasser: 4, g_kaffee: 6, energie: 5, schlaf: 4, konzentration: 5, erholung: 4, stress: 4, wohl: 5, bewegung: 1 }),
    ];
    const wohnung = [['Wohnzimmer', 'Salzkristalle', 'Idee'], ['Küche', 'Holztisch', 'Idee'], ['Wohnzimmer', 'Neue Gardinen', 'Kaufen'], ['Bad', 'Bad-Set mit Fußmatte', 'Gekauft']]
      .map(([bereich, was, status]) => ({ id: id(), bereich, was, status, preis: null, wo: 'Deutschland', link: '', notiz: '' }));
    const unterlagen = [{ id: id(), titel: 'Enagic-Shop', art: 'link', bereich: 'Enagic', fuer: 'Kunden', url: 'https://www.enagiceu.com/shop', notiz: 'Beispiel' }];
    return { uk_unterlagen: unterlagen, uk_wohnung: wohnung, uk_fragebogen: fragebogen, uk_partner: partner, uk_kunden: kunden, uk_maschinen: maschinen, uk_maschinen_verlauf: verlauf, uk_aufgaben: aufgaben };
  }

  // Vermerke zu Haushalt und Interessen: Dashboard und Anfrageformular nutzen dieselbe Liste.
  // Bewusst ohne Gesundheit. Dafür gibt es beim Kunden ein eigenes Feld, nur mit seiner Einwilligung.
  const VERMERKE = [
    { id: 'kinder', name: 'Kinder im Haushalt' },
    { id: 'baby', name: 'Baby im Haushalt' },
    { id: 'tiere', name: 'Haustiere' },
    { id: 'sport', name: 'Sport' },
    { id: 'kaffee', name: 'Kaffee und Tee' },
    { id: 'kochen', name: 'Kocht viel', frage: 'Kochen' },
    { id: 'garten', name: 'Pflanzen und Garten' },
    { id: 'haut', name: 'Haut und Haare' },
    { id: 'putzen', name: 'Putzen ohne Chemie' },
    { id: 'kisten', name: 'Schleppt Wasserkisten', frage: 'Keine Wasserkisten mehr schleppen' },
    { id: 'gewerbe', name: 'Gewerbe (Salon, Gastro, Praxis)', frage: 'Für mein Geschäft' },
  ];

  // ---------- Vorschau mit Beispieldaten (nur mit ?demo) ----------
  let speicher;
  function laden() {
    if (speicher) return speicher;
    try { speicher = JSON.parse(localStorage.getItem(SCHLUESSEL)); } catch (e) { speicher = null; }
    if (!speicher || !TABELLEN.every((t) => Array.isArray(speicher[t]))) { speicher = beispiel(); sichern(); }
    return speicher;
  }
  function sichern() { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(speicher)); } catch (e) { /* privates Fenster: nur im Speicher */ } }
  const lokal = {
    async alle(tabelle) { return laden()[tabelle].map((z) => ({ ...z })); },
    async speichern(tabelle, zeile) {
      const liste = laden()[tabelle];
      zeile = { ...zeile };
      if (!zeile.id) zeile.id = id();
      const i = liste.findIndex((z) => z.id === zeile.id);
      if (i >= 0) liste[i] = { ...liste[i], ...zeile }; else liste.push({ ...zeile });
      sichern();
      return { ...(i >= 0 ? liste[i] : zeile) };
    },
    async loeschen(tabelle, zeilenId) {
      const s = laden();
      s[tabelle] = s[tabelle].filter((z) => z.id !== zeilenId);
      sichern();
    },
  };

  // ---------- Supabase ----------
  const SUPABASE_URL = 'https://ngcbmpuqcqbelfoelwby.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_WNNPxzNUGHQGjix6dBDBkA_3paeOVMk'; // öffentlicher Schlüssel, Schutz über Row Level Security
  const demo = window.UK_DEMO === true || new URLSearchParams(location.search).has('demo'); // UK_DEMO: feste Vorschau, z. B. für Daniel
  // Art des Links aus der Einladungs- oder Passwort-Mail, bevor Supabase die Adresse aufräumt
  const hash = new URLSearchParams(location.hash.slice(1));
  const linkArt = hash.get('type') || (hash.get('error_code') ? 'fehler' : null);
  const sb = demo ? null : supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } });
  const pruefen = ({ data, error }) => { if (error) throw error; return data; };
  // Leere Felder aus Formularen als null speichern, sonst lehnt die Datenbank Datum und Auswahl ab
  const sauber = (z) => Object.fromEntries(Object.entries(z).map(([k, v]) => [k, v === '' ? null : v]));
  const fern = {
    async alle(tabelle) { return pruefen(await sb.from(tabelle).select('*')); },
    async speichern(tabelle, zeile) {
      const { id: zid, ...rest } = sauber(zeile);
      if (zid) return pruefen(await sb.from(tabelle).update(rest).eq('id', zid).select().single());
      return pruefen(await sb.from(tabelle).insert(rest).select().single());
    },
    async loeschen(tabelle, zeilenId) { pruefen(await sb.from(tabelle).delete().eq('id', zeilenId)); },
  };
  const tabellen = demo ? lokal : fern;

  // ---------- Öffentliche Abläufe (Landingpage, Fragebogen) ----------
  const DG = [{ kurz: 'Start', tage: 0 }, { kurz: 'nach 2 Wochen', tage: 14 }, { kurz: 'nach 4 Wochen', tage: 28 }];
  const oeffentlich = demo ? {
    async empfehler(kurz) {
      const p = (await lokal.alle('uk_partner')).find((x) => x.kurz === String(kurz).toLowerCase() && x.aktiv !== false);
      return p ? { vorname: p.vorname, nachname: p.nachname } : null;
    },
    async anfrage(w) {
      const p = (await lokal.alle('uk_partner')).find((x) => x.kurz === w.von && x.aktiv !== false);
      const anliegen = w.anliegen === 'beratung' ? 'Beratung' : 'Testgerät';
      const k = await lokal.speichern('uk_kunden', { vorname: w.vorname, nachname: w.nachname, email: w.email, telefon: w.telefon, strasse: w.strasse, plz: w.plz, ort: w.ort, land: w.land,
        vermerke: w.vermerke || [], status: 'Interessent', partner_id: p ? p.id : null, token: token(),
        notiz: `Anfrage über die Landingpage: ${anliegen}.${w.nachricht ? ' Nachricht: ' + w.nachricht : ''}` });
      await lokal.speichern('uk_aufgaben', { titel: `Neue Anfrage (${anliegen}): ${w.vorname} ${w.nachname} anrufen`, wer: 'Daniel', prio: 'orange', faellig: heute(), kunde_id: k.id, erledigt: false,
        notiz: [w.telefon && 'Telefon ' + w.telefon, 'E-Mail ' + w.email, p && 'Empfohlen von ' + p.vorname + ' ' + (p.nachname || '')].filter(Boolean).join(' · ') });
    },
    async fbLaden(tok) {
      const k = (await lokal.alle('uk_kunden')).find((x) => x.token === tok);
      if (!k) return null;
      const bisher = (await lokal.alle('uk_fragebogen')).filter((f) => f.kunde_id === k.id).sort((a, b) => a.durchgang - b.durchgang);
      return { kunde: { vorname: k.vorname, nachname: k.nachname, email: k.email, telefon: k.telefon }, bisher };
    },
    async fbSpeichern(e) {
      let k = e.token ? (await lokal.alle('uk_kunden')).find((x) => x.token === e.token) : null;
      if (!k) k = await lokal.speichern('uk_kunden', { ...e.kontakt, status: 'Testet', land: 'CH', token: token(), notiz: 'Über den Fragebogen angelegt' });
      else if (e.durchgang === 1 && e.kontakt) k = await lokal.speichern('uk_kunden', { id: k.id, ...e.kontakt });
      if (e.newsletter && !k.newsletter) await lokal.speichern('uk_kunden', { id: k.id, newsletter: 'angefragt' });
      await lokal.speichern('uk_fragebogen', { kunde_id: k.id, durchgang: e.durchgang, antworten: e.antworten, einwilligung: e.einwilligung, stimme: !!e.stimme, erstellt: new Date().toISOString() });
      const name = [k.vorname, k.nachname].filter(Boolean).join(' ');
      if (e.durchgang === 1) {
        for (const d of DG.slice(1)) await lokal.speichern('uk_aufgaben', { titel: `Fragebogen ${d.kurz} an ${name} schicken`, wer: 'Daniel', prio: '', faellig: tageAb(d.tage), kunde_id: k.id, erledigt: false, notiz: 'Link steht beim Kunden im Dashboard. Automatisch angelegt beim ersten Fragebogen.' });
      } else {
        const offen = (await lokal.alle('uk_aufgaben')).find((a) => a.kunde_id === k.id && !a.erledigt && a.titel.startsWith(`Fragebogen ${DG[e.durchgang - 1].kurz}`));
        if (offen) await lokal.speichern('uk_aufgaben', { id: offen.id, erledigt: true, erledigt_am: new Date().toISOString() });
      }
      return k.token;
    },
  } : {
    async empfehler(kurz) { const r = pruefen(await sb.rpc('uk_empfehler', { p_kurz: String(kurz) })); return r && r[0] ? r[0] : null; },
    async anfrage(w) { pruefen(await sb.rpc('uk_anfrage', { p: w })); },
    async fbLaden(tok) { return pruefen(await sb.rpc('uk_fb_laden', { p_token: tok })); },
    async fbSpeichern(e) { return pruefen(await sb.rpc('uk_fb_speichern', { p: e })); },
  };

  // ---------- Anmeldung fürs Dashboard ----------
  const anmeldung = demo ? {
    async sitzung() { return { user: { email: 'vorschau' } }; },
    // Vorschau als Daniel: ?demo&als=daniel, sonst als Jasmin (admin)
    async rolle() { return new URLSearchParams(location.search).get('als') === 'daniel' ? { rolle: 'team', name: 'Daniel (Vorschau)' } : { rolle: 'admin', name: 'Vorschau' }; },
    async anmelden() {}, async abmelden() {}, async passwortSetzen() {}, async passwortVergessen() {},
  } : {
    async sitzung() { return pruefen(await sb.auth.getSession()).session; },
    async rolle() { const r = pruefen(await sb.from('uk_nutzer').select('rolle, name')); return r[0] || { rolle: 'team', name: '' }; },
    async anmelden(email, passwort) { pruefen(await sb.auth.signInWithPassword({ email, password: passwort })); },
    async abmelden() { await sb.auth.signOut(); },
    async passwortSetzen(passwort) { pruefen(await sb.auth.updateUser({ password: passwort })); },
    async passwortVergessen(email) { pruefen(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname })); },
  };

  // ---------- Dateien im Reiter Unterlagen ----------
  // Echte Dateien liegen im Supabase-Speicher "unterlagen", Ordner = Mandant. In der Vorschau
  // bleiben sie nur bis zum Neuladen im Browser.
  const dateien = demo ? {
    async dateiHochladen(datei) { return { pfad: 'vorschau/' + datei.name, url: URL.createObjectURL(datei) }; },
    async dateiLink(pfad, url) { return url; },
    async dateiTeilen(pfad, url) { return { teil_pfad: 'vorschau/' + pfad, teil_url: url }; },
    async dateiLoeschen() {},
    async bestellLink() { return null; },
    async bestellHochladen(pfad) { return pfad; },
    async sponsoren() { return {}; },
  } : {
    // Bestellungen (19.10.2026): eigener Speicher "bestellungen" mit Unterschrift, Ausweis und Verträgen
    async bestellLink(pfad, ansehen) { return pruefen(await sb.storage.from('bestellungen').createSignedUrl(pfad, 900, ansehen ? {} : { download: true })).signedUrl; },
    async bestellDatei(pfad) { return pruefen(await sb.storage.from('bestellungen').download(pfad)); },
    async bestellHochladen(pfad, blob, typ) { pruefen(await sb.storage.from('bestellungen').upload(pfad, blob, { contentType: typ || blob.type || undefined, upsert: true })); return pfad; },
    async sponsoren() { return pruefen(await sb.rpc('uk_sponsoren')) || {}; },
    async dateiHochladen(datei) {
      const m = pruefen(await sb.from('uk_nutzer').select('mandant_id'))[0];
      const name = datei.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.\-]+/g, '-');
      const pfad = `${m.mandant_id}/${Date.now()}-${name}`;
      pruefen(await sb.storage.from('unterlagen').upload(pfad, datei, { contentType: datei.type || undefined }));
      return { pfad };
    },
    // ansehen = im Browser zeigen statt herunterladen (Quittungen)
    async dateiLink(pfad, url, ansehen) { return pruefen(await sb.storage.from('unterlagen').createSignedUrl(pfad, 600, ansehen ? {} : { download: true })).signedUrl; },
    async dateiLoeschen(pfad, teilPfad) {
      pruefen(await sb.storage.from('unterlagen').remove([pfad]));
      if (teilPfad) pruefen(await sb.storage.from('teilen').remove([teilPfad]));
    },
    // Dauerhafter Link zum Weitergeben: Kopie im öffentlichen Speicher "teilen" mit langer
    // Zufallskennung vorne im Namen (Jasmin 11.10.2026: "ja link dauerhaft bitte")
    async dateiTeilen(pfad) {
      const blob = pruefen(await sb.storage.from('unterlagen').download(pfad));
      const zufall = [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, '0')).join('');
      const [mandant, ...rest] = pfad.split('/');
      const teilPfad = `${mandant}/${zufall}-${rest.join('/').replace(/^\d+-/, '')}`;
      pruefen(await sb.storage.from('teilen').upload(teilPfad, blob, { contentType: blob.type || undefined }));
      return { teil_pfad: teilPfad, teil_url: sb.storage.from('teilen').getPublicUrl(teilPfad).data.publicUrl };
    },
  };

  return {
    demo, linkArt, VERMERKE,
    ...dateien,
    heute, tageAb,
    ...tabellen,
    ...oeffentlich,
    anmeldung,
    neuerToken: token,
    zuruecksetzen() { speicher = beispiel(); sichern(); },
  };
})();

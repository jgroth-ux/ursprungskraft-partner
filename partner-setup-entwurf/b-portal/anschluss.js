/* ==========================================================================
   Partner-Portal: ALLE Anschluss-Funktionen an einer Stelle. Stand 20.10.2026
   FERTIG: jede Funktion mit Name, Kommentar und Beispieldaten. Die Seiten rufen nur diese auf.
   FEHLT:  der echte Anschluss (Datenbank, Login, Stripe, Telegram, Druckerei). Beim Einbau
           nur den Inhalt der Funktionen ersetzen, Name, Eingabe und Rückgabe bleiben gleich.
   Demo:   Daten werden zwischen den Seiten im Browser (localStorage) weitergereicht, damit
           sich das Portal durchklicken lässt. Live gehört das in die Datenbank.
   ========================================================================== */

var DEMO_SPEICHER = 'portal-demo';
function demoLesen() { try { return JSON.parse(localStorage.getItem(DEMO_SPEICHER)) || {}; } catch (e) { return {}; } }
function demoSchreiben(teil) { var d = demoLesen(); Object.assign(d, teil); try { localStorage.setItem(DEMO_SPEICHER, JSON.stringify(d)); } catch (e) {} return d; }

var BEISPIEL_PARTNERDATEN = {
  vorname: 'Sabine', nachname: 'Muster', email: 'sabine@beispiel.de', telefon: '+49 170 0000000',
  whatsapp: '491700000000', ort: 'Lüneburg', land: 'DE', kuerzel: 'sabine', foto: '',
  ueber_mich: 'Ich trinke seit drei Jahren Wasser aus meinem eigenen Gerät und mag vor allem, dass die Kisten aus dem Keller verschwunden sind. Ich komme gern bei dir vorbei und zeige dir alles in Ruhe.',
  impressum_name: 'Sabine Muster', impressum_strasse: 'Musterweg 1', impressum_plz: '21335', impressum_ort: 'Lüneburg',
  impressum_telefon: '+49 170 0000000', impressum_email: 'sabine@beispiel.de', impressum_ustid: '',
  farbe: 'oliv', enagic_id: '', sponsor_name: '', sponsor_id: ''
};

// ANSCHLUSS: legt ein Konto an (Login-Dienst) und einen leeren Datensatz in Tabelle partner.
// Schickt die Bestätigungsmail. Erwartet { vorname, nachname, email, passwort, nutzungsbedingungen_version }
// Gibt zurück { ok: true } oder { ok: false, fehler: 'E-Mail ist schon registriert' }
async function registrieren(daten) {
  console.log('Demo registrieren', Object.assign({}, daten, { passwort: '***' }));
  demoSchreiben({ partner: Object.assign({}, BEISPIEL_PARTNERDATEN, { vorname: daten.vorname, nachname: daten.nachname, email: daten.email }) });
  return { ok: true };
}

// ANSCHLUSS: meldet den Partner an (Login-Dienst). Gibt { ok: true } oder { ok: false, fehler } zurück.
async function anmelden(email, passwort) {
  console.log('Demo anmelden', email);
  return { ok: true };
}

// ANSCHLUSS: schickt eine Mail zum Zurücksetzen des Passworts (Mailversand, z. B. Brevo).
async function passwortVergessen(email) {
  console.log('Demo passwortVergessen', email);
  return { ok: true };
}

// ANSCHLUSS: meldet ab und löscht die Sitzung.
async function abmelden() { console.log('Demo abmelden'); return { ok: true }; }

// ANSCHLUSS: lädt die Daten des angemeldeten Partners aus Tabelle partner.
async function partnerLaden() {
  var d = demoLesen();
  return d.partner || Object.assign({}, BEISPIEL_PARTNERDATEN);
}

// ANSCHLUSS: speichert die Partnerdaten in der Datenbank (Tabelle partner)
async function partnerSpeichern(daten) {
  console.log('Demo partnerSpeichern', daten);
  demoSchreiben({ partner: daten });
  return { ok: true };
}

// ANSCHLUSS: lädt das Partnerfoto in den Speicher (z. B. Supabase Storage, Ordner partner-fotos),
// verkleinert es auf höchstens 1600 px und gibt die öffentliche Adresse zurück: { ok: true, url }
async function fotoHochladen(datei) {
  console.log('Demo fotoHochladen', datei && datei.name);
  var url = await new Promise(function (fertig) {
    var r = new FileReader(); r.onload = function () { fertig(r.result); }; r.readAsDataURL(datei);
  });
  return { ok: true, url: url };
}

// ANSCHLUSS: prüft, ob das Kürzel für den Link frei ist (Tabelle partner, Spalte kuerzel, eindeutig).
// Gibt { frei: true } oder { frei: false } zurück.
async function kuerzelPruefen(kuerzel) {
  var belegt = ['jasmin', 'daniel', 'test', 'admin', 'portal'];
  return { frei: belegt.indexOf(kuerzel) === -1 };
}

// ANSCHLUSS: speichert die Paketauswahl als Entwurf (Tabelle bestellungen, status 'entwurf').
// Erwartet { posten: [{ dokument, stueck, preis_je_stueck }], summe, art: 'start' | 'nachbestellung' }
async function bestellungSpeichern(bestellung) {
  console.log('Demo bestellungSpeichern', bestellung);
  demoSchreiben({ bestellung: bestellung });
  return { ok: true, id: 'demo-' + Date.now() };
}

// ANSCHLUSS: lädt den letzten Bestellentwurf des Partners.
async function bestellungLaden() { return demoLesen().bestellung || null; }

// ANSCHLUSS: startet die Zahlung bei Stripe (Checkout). Monatliche Gebühr als Abo plus einmaliges Paket.
// Erwartet { bestellung_id, posten, einmalig_summe, monatlich, waehrung }
// Live: leitet zu Stripe weiter, Stripe schickt danach zurück auf mein-bereich/?bezahlt=1
// Der Webhook von Stripe schaltet die Landingpage frei und gibt den Druckauftrag weiter.
async function bezahlenStarten(bestellung) {
  console.log('Demo bezahlenStarten', bestellung);
  demoSchreiben({ bezahlt: true, bezahlt_am: new Date().toISOString() });
  return { ok: true, weiter: '../mein-bereich/index.html?bezahlt=1' };
}

// ANSCHLUSS: lädt den Status für "Mein Bereich" (Tabelle partner + Stripe-Abo + Telegram).
async function statusLaden() {
  var d = demoLesen();
  var p = d.partner || BEISPIEL_PARTNERDATEN;
  var heute = new Date();
  var bis = new Date(heute.getFullYear(), heute.getMonth() + 1, 1);
  return {
    landingpage_aktiv: true,
    aktiv_bis: bis.toISOString().slice(0, 10),
    naechste_abbuchung: bis.toISOString().slice(0, 10),
    betrag_monat: null,                   // {{PREIS_FEHLT}}
    link: 'https://{{DOMAIN}}/' + (p.kuerzel || '{{KUERZEL}}'),
    bestell_link: '{{BESTELL_LINK}}', // Form offen, z. B. https://{{DOMAIN}}/kuerzel/bestellen
    telegram_verbunden: false,
    telegram_link: 'https://t.me/{{BOTNAME}}?start=' + (p.kuerzel || 'kuerzel'),
    letzte_bestellung: d.bestellung || null,
    gekuendigt: !!d.gekuendigt
  };
}

// ANSCHLUSS: kündigt das Abo bei Stripe zum Ende der Laufzeit. Die Seite bleibt bis dahin aktiv.
// Gibt { ok: true, endet_am: 'JJJJ-MM-TT' } zurück.
async function aboKuendigen(grund) {
  console.log('Demo aboKuendigen', grund);
  demoSchreiben({ gekuendigt: true });
  return { ok: true, endet_am: null };
}

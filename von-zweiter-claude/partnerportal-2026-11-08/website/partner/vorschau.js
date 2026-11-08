// Vorschau-Modus mit Probedaten (08.11.2026). Nur aktiv mit ?vorschau in der Adresse, sonst passiert hier nichts.
// ?vorschau            angemeldet, mit Terminen, Kunden und Neuigkeiten
// ?vorschau=leer       angemeldet, aber noch keine Termine und Kunden (Kalender bleibt unsichtbar)
// ?vorschau=gesperrt   Testzeit abgelaufen, nur einige Bereiche frei
// ?vorschau=anmelden   Anmeldeseite
// ?vorschau=normal     Partnerkonto ohne Team-Markierung: kein Schalter, kein Backoffice
// Backoffice mit Beispieldaten des Dashboards (daten.js im Demo-Modus): #bo, als Daniel zusätzlich &als=daniel,
// erste Anmeldung zeigen mit &bo-anmelden
// Alle Namen sind erfunden. Es wird nichts gespeichert und nichts verschickt.
window.Vorschau = (function () {
  const q = new URLSearchParams(location.search);
  if (!q.has('vorschau')) return null;
  const modus = q.get('vorschau') || 'voll';
  const tag = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('sv-SE'); };
  const um = (n, hm) => { const [h, m] = hm.split(':').map(Number); const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, m, 0, 0); return d.toISOString(); };
  const vor = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); };
  let n = 0; const id = () => 'v' + (++n).toString().padStart(4, '0');

  const partner = {
    vorname: 'Anna', nachname: 'Beispiel', kurz: 'anna-beispiel', enagic_id: '21000123456', email: 'anna@beispiel.de',
    abwicklung: 'daniel', kalender: '0123456789abcdef0123456789abcdef0123', bestellungen: 3,
    seite: { text: 'Ich zeige dir gern, was in deinem Wasser steckt. Melde dich einfach.', whatsapp: '+49 170 1234567' },
    tg_code: 'a1b2c3d4e5f60718', tg_verbunden: modus !== 'leer', assistent_bot: 'ursprungskraft_assistent_bot',
    team: modus !== 'normal',  // ?vorschau=normal: ein gewöhnliches Partnerkonto ohne Backoffice
    zugang: modus === 'gesperrt' ? { bereiche: ['kunden', 'termine'], test_bis: tag(-2) } : { bereiche: null, test_bis: tag(9) },
  };

  const kunden = modus === 'leer' ? [] : [
    { id: 'k1', vorname: 'Sabine', nachname: 'Keller', telefon: '+49 171 2223344', email: 'sabine.keller@beispiel.de', ort: 'Freiburg', erreichbar: 'abends ab 18 Uhr',
      erstellt: vor(12), quelle: 'Anfrage', stand: 'termin', stufe: 'heiss', abgelegt: false, letzter_kontakt: vor(3), naechster_kontakt: tag(0),
      verblieben: 'Will das Gerät mit ihrem Mann zusammen sehen.', notizen: [{ text: 'Erstes Telefonat. Trinkt bisher Wasser aus Flaschen, schleppt jede Woche zwei Kisten.', erstellt: vor(3) }] },
    { id: 'k2', vorname: 'Thomas', nachname: 'Brunner', telefon: '+41 79 555 66 77', email: 't.brunner@beispiel.ch', ort: 'Bern', erstellt: vor(40), quelle: 'Bestellung',
      stand: 'gekauft', stufe: null, abgelegt: false, letzter_kontakt: vor(9), naechster_kontakt: tag(4), verblieben: 'Rufe an, wenn das Gerät da ist, und zeige ihm die Reinigung.',
      geraet: 'LeveLuk K8', kaufdatum: tag(-21), notizen: [{ text: 'Hat über meinen Link bestellt. Freut sich auf den Kaffee.', erstellt: vor(21) }] },
    { id: 'k3', vorname: 'Miriam', nachname: 'Hofmann', telefon: '+49 160 9988776', ort: 'Lörrach', erstellt: vor(6), quelle: 'Interessentenformular', stand: 'neu', stufe: 'warm',
      abgelegt: false, naechster_kontakt: tag(-1), erreichbar: 'vormittags', notizen: [], antworten: { interesse: 'Wasser für die Familie', geraet: 'Flaschenwasser' } },
    { id: 'k4', vorname: 'Jonas', nachname: 'Weber', email: 'jonas.weber@beispiel.de', ort: 'Basel', erstellt: vor(2), quelle: 'E-Book', stand: 'neu', stufe: 'kalt', abgelegt: false, art: 'lead', notizen: [] },
    { id: 'k5', vorname: 'Petra', nachname: 'Lang', telefon: '+49 152 3344556', email: 'petra.lang@beispiel.de', ort: 'Offenburg', erstellt: vor(120), quelle: 'Selbst eingetragen',
      stand: 'betreuung', stufe: null, abgelegt: false, letzter_kontakt: vor(30), geraet: 'LeveLuk K8', kaufdatum: tag(-100), notizen: [{ text: 'Reinigung zusammen gemacht, alles gut.', erstellt: vor(30) }] },
    { id: 'k6', vorname: 'Markus', nachname: 'Frei', telefon: '+41 76 111 22 33', ort: 'Thun', erstellt: vor(18), quelle: 'Anfrage', stand: 'kontaktiert', stufe: 'warm', abgelegt: false,
      letzter_kontakt: vor(5), naechster_kontakt: tag(2), verblieben: 'Schickt mir ein Foto von seiner Küche.', notizen: [{ text: 'Hat schon einen Filter unter der Spüle.', erstellt: vor(5) }] },
    { id: 'k7', vorname: 'Lea', nachname: 'Schmid', email: 'lea.schmid@beispiel.ch', ort: 'Zürich', erstellt: vor(25), quelle: 'Schaut sich um', stand: 'neu', stufe: 'kalt', abgelegt: false, art: 'lead', notizen: [] },
    { id: 'k8', vorname: 'Daniela', nachname: 'Roth', telefon: '+49 173 7766554', ort: 'Emmendingen', erstellt: vor(60), quelle: 'Anfrage', stand: 'kontaktiert', stufe: 'kalt', abgelegt: true, notizen: [] },
    { id: 'k9', vorname: 'Familie', nachname: 'Huber', telefon: '+49 761 445566', email: 'huber@beispiel.de', ort: 'Freiburg', erstellt: vor(14), quelle: 'Bestellung',
      stand: 'gekauft', stufe: null, abgelegt: false, letzter_kontakt: vor(14), geraet: 'emGuarde GO', kaufdatum: tag(-14), notizen: [] },
  ];
  const bestellstand = modus === 'leer' ? [] : [
    { id: 'b1', nummer: 1042, erstellt: vor(21), kunde_id: 'k2', name: 'Thomas Brunner', ort: 'Bern', geraete: 'LeveLuk K8', stand: 'verschickt' },
    { id: 'b2', nummer: 1051, erstellt: vor(14), kunde_id: 'k9', name: 'Familie Huber', ort: 'Freiburg', geraete: 'emGuarde GO', stand: 'bestellt' },
    { id: 'b3', nummer: 977, erstellt: vor(100), kunde_id: 'k5', name: 'Petra Lang', ort: 'Offenburg', geraete: 'LeveLuk K8', stand: 'da', da_am: tag(-88) },
  ];
  let termine = modus === 'leer' ? [] : [
    { id: 't1', kunde_id: 'k1', art: 'Termin vor Ort', beginn: um(0, '18:30'), minuten: 90, ort: 'Talstraße 12, 79102 Freiburg', notiz: 'Mann ist dabei. Wasser-Test mitbringen.', name: 'Sabine Keller' },
    { id: 't2', kunde_id: 'k6', art: 'Rückruf', beginn: um(1, '10:00'), minuten: 15, ort: '', notiz: '', name: 'Markus Frei' },
    { id: 't3', kunde_id: null, art: 'Zoom', beginn: um(2, '19:00'), minuten: 60, ort: 'https://zoom.us/j/123456789', notiz: 'Infoabend mit Daniel', name: '' },
    { id: 't4', kunde_id: 'k2', art: 'Termin vor Ort', beginn: um(4, '17:00'), minuten: 60, ort: 'Marktgasse 5, 3011 Bern', notiz: 'Gerät aufbauen und Reinigung zeigen.', name: 'Thomas Brunner' },
    { id: 't5', kunde_id: null, art: 'Sonstiges', beginn: um(11, '19:00'), minuten: 120, ort: 'Café Sonne, Hauptstraße 3, 79098 Freiburg', notiz: 'Infoabend, Flyer verteilt', name: '' },
  ];
  const neuigkeiten = [
    { id: 'n1', von: 'Jasmin', erstellt: vor(0.2), text: 'Neu im Portal: Unter Wissen findest du jetzt Antworten auf die häufigsten Einwände. Sag uns gern, was dir noch fehlt.' },
    { id: 'n2', von: 'Daniel', erstellt: vor(3), text: 'Der emGuarde GO ist wieder lieferbar. Denkt daran: höchstens 5 Stück je Partner.' },
    { id: 'n3', von: 'Daniel', erstellt: vor(12), text: 'Nächster Infoabend online am Donnerstag um 19 Uhr. Bringt gern Interessenten mit.' },
  ];

  let angemeldet = modus !== 'anmelden';
  // Backoffice-Vorschau: daten.js hat im Demo-Modus keine Bestellungen und keinen Bestellspeicher. Damit "Vertrag erstellen"
  // mit allen Formularen vorführbar ist, kommen hier zwei erfundene Bestellungen und ein Dateispeicher im Browser dazu.
  // daten.js selbst bleibt unverändert, ergänzt wird nur das Objekt im Browser.
  function dashboard(D) {
    if (D.__vorschau) return; D.__vorschau = true;
    const dateien = new Map();
    const unterschrift = () => new Promise((ok) => { const c = document.createElement('canvas'); c.width = 400; c.height = 120; const x = c.getContext('2d');
      x.strokeStyle = '#1F2A44'; x.lineWidth = 3; x.beginPath(); x.moveTo(20, 80); x.bezierCurveTo(80, 10, 120, 110, 170, 60); x.bezierCurveTo(210, 20, 260, 100, 380, 50); x.stroke(); c.toBlob(ok, 'image/png'); });
    let best = [
      { id: 'vb1', nummer: 1101, erstellt: vor(1), status: 'Neu', von: 'anna-beispiel', sponsor: null, linie: null, angaben: {}, pdfs: [], dateien: { unterschrift: 'vb1/unterschrift.png' },
        daten: { vorname: 'Beispiel Paul', nachname: 'Meier', anrede: 'Herr', geburtsdatum: '1980-05-17', strasse: 'Musterweg 4', plz: '79098', ort: 'Freiburg', land: 'Deutschland', land_kurz: 'DE',
          handy: '+49 170 0000000', email: 'paul@beispiel.de', als: 'Verbraucher', k8: 'ja', zahlung: 'raten', raten_anzahl: '10', zahltag: '15', iban: 'DE00 0000 0000 0000 0000 00', bic: 'BEISPIEL' } },
      { id: 'vb2', nummer: 1088, erstellt: vor(9), status: 'An Enagic geschickt', von: 'jasmin', sponsor: 'jasmin', linie: '2', angaben: { preis: 4600, mwst: 874, versand: 12 }, pdfs: [], dateien: { unterschrift: 'vb2/unterschrift.png' },
        daten: { vorname: 'Beispiel Eva', nachname: 'Sommer', strasse: 'Lindenstraße 9', plz: '20095', ort: 'Hamburg', land: 'Deutschland', land_kurz: 'DE', email: 'eva@beispiel.de', als: 'Verbraucher', k8: 'ja', zahlung: 'ueberweisung' } },
    ];
    const altAlle = D.alle, altSpeichern = D.speichern;
    D.alle = (t) => (t === 'uk_bestellungen' ? Promise.resolve(best.map((b) => ({ ...b }))) : altAlle(t));
    D.speichern = (t, z) => { if (t !== 'uk_bestellungen') return altSpeichern(t, z); const i = best.findIndex((b) => b.id === z.id); best[i] = { ...best[i], ...z }; return Promise.resolve({ ...best[i] }); };
    D.bestellHochladen = async (pfad, blob) => { dateien.set(pfad, blob); return pfad; };
    D.bestellDatei = async (pfad) => { if (dateien.has(pfad)) return dateien.get(pfad); if (/unterschrift/.test(pfad)) return unterschrift(); throw new Error('Datei fehlt'); };
    D.bestellLink = async (pfad) => URL.createObjectURL(await D.bestellDatei(pfad));
    D.sponsoren = async () => ({ jasmin: { name: 'Jasmin Groth', id: '21000000000', email: 'jasmin@beispiel.de' }, daniel: { name: 'Daniel Zürcher', id: '', email: '' } });
  }

  const warte = (x) => new Promise((ok) => setTimeout(() => ok({ data: x, error: null }), 120));
  return {
    modus, dashboard,
    rpc(name, a = {}) {
      // Für Klicktests: wie oft jede Funktion abgerufen wurde (window.__abrufe)
      (window.__abrufe = window.__abrufe || {})[name] = (window.__abrufe[name] || 0) + 1;
      switch (name) {
        case 'uk_partner_daten': return warte(angemeldet ? partner : null);
        case 'uk_partner_kunden': return warte(JSON.parse(JSON.stringify(kunden)));
        case 'uk_partner_bestellstand': return warte(bestellstand);
        case 'uk_partner_termine_liste': return warte(termine);
        case 'uk_partner_neuigkeiten': return warte(modus === 'leer' ? neuigkeiten.slice(1) : neuigkeiten);
        case 'uk_flyer_vorlagen_liste': return warte({ vorlagen: {}, aus: [] });
        case 'uk_partner_anmelden': angemeldet = true; return warte({ sitzung: 'vorschau' });
        case 'uk_partner_abmelden': angemeldet = false; return warte(null);
        case 'uk_partner_registrieren': return warte('ok');
        case 'uk_partner_termin_speichern': {
          const k = kunden.find((x) => x.id === a.p.kunde_id);
          termine.push({ id: id(), kunde_id: a.p.kunde_id || null, art: a.p.art, beginn: new Date(`${a.p.datum}T${a.p.uhrzeit}`).toISOString(), minuten: +a.p.minuten, ort: a.p.ort, notiz: a.p.notiz, name: k ? `${k.vorname} ${k.nachname}` : '' });
          return warte(id());
        }
        case 'uk_partner_termin_loeschen': termine = termine.filter((t) => t.id !== a.p_id); return warte(true);
        case 'uk_partner_kunde_speichern': {
          const p = a.p; let k = kunden.find((x) => x.id === p.id || x.id === p.lead_id);
          if (!k) { k = { id: id(), quelle: 'Selbst eingetragen', erstellt: new Date().toISOString(), notizen: [], stand: 'neu' }; kunden.unshift(k); }
          for (const f of ['vorname', 'nachname', 'telefon', 'email', 'ort', 'erreichbar', 'stand', 'stufe', 'verblieben', 'naechster_kontakt']) if (f in p) k[f] = p[f] || null;
          if ('abgelegt' in p) k.abgelegt = !!p.abgelegt;
          if (p.notiz) { k.notizen.unshift({ text: p.notiz, erstellt: new Date().toISOString() }); k.letzter_kontakt = new Date().toISOString(); }
          delete k.art;
          return warte(k.id);
        }
        default: return warte(true);  // Speichern: Seite, Abwicklung, Abmelden, Anmelden
      }
    },
  };
})();

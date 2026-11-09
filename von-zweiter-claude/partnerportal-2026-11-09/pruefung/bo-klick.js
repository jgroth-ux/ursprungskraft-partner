const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' }); const p = await ctx.newPage();
  const fehler = []; p.on('pageerror', (e) => fehler.push('pageerror ' + e.stack)); p.on('console', (m) => ['error', 'warning'].includes(m.type()) && fehler.push(m.type() + ' ' + m.text()));
  p.on('dialog', (d) => d.accept()); p.on('response', (r) => r.status() === 404 && console.log('404 ' + r.url()));
  // Testumgebung ohne Zugang zu cdnjs: pdf-lib 1.17.1 aus dem npm-Paket (gleiche Datei wie auf cdnjs)
  await p.route('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js', (r) => r.fulfill({ path: __dirname + '/package/dist/pdf-lib.min.js', contentType: 'application/javascript' }));
  // Die Bestellformulare (PDF) liegen nicht im Paket von Korrektur 2. Für die Prüfung kommen sie aus dem Paket vom Backoffice-Nachtrag.
  await p.route('**/dashboard/formulare/*', (r) => { const f = __dirname + '/../zip2/an-zweiter-claude-backoffice/bestand/website/dashboard/formulare/' + r.request().url().split('/').pop().split('?')[0]; require('fs').existsSync(f) ? r.fulfill({ path: f }) : r.continue(); });
  const U = 'http://localhost:8766/partner/';
  const ok = (n, x) => console.log((x ? 'OK   ' : 'FEHLT') + ' ' + n);
  const w = (ms = 700) => p.waitForTimeout(ms);
  // Normales Partnerkonto: kein Schalter, Adresse führt nicht hinein
  await p.goto(U + '?vorschau=normal#start'); await w();
  ok('Normal: kein Schalter', !(await p.isVisible('.schalter')));
  await p.goto(U + '?vorschau=normal#bo/kunden'); await w(900);
  ok('Normal: #bo landet auf Start', p.url().endsWith('#start') && await p.isVisible('text=Die nächsten Tage') && !(await p.isVisible('.ist-bo')));
  ok('Normal: daten.js nicht geladen', !(await p.evaluate(() => !!window.Daten)));
  // Team: Schalter, erste Anmeldung
  await p.goto(U + '?vorschau&bo-anmelden#start'); await w();
  ok('Team: Schalter sichtbar', await p.isVisible('.menue .schalter'));
  await p.click('.menue .schalter [data-modus=bo]'); await w(900);
  ok('Erste Anmeldung verlangt', await p.isVisible('text=Einmal anmelden.'));
  await p.screenshot({ path: process.env.OUT + '/bo-anmelden.png' });
  await p.fill('#f-bo input[name=passwort]', 'x'); await p.click('#f-bo [type=submit]'); await w(1200);
  ok('Nach Anmeldung Backoffice', await p.isVisible('.ist-bo') && await p.isVisible('text=Bestellungen warten auf Zuordnung'));
  // Schalter zurück und wieder hin ohne Anmeldung
  await p.click('.menue .schalter [data-modus=partner]'); await w(900); ok('Zurück zur Partneransicht', await p.isVisible('text=Die nächsten Tage'));
  await p.click('.menue .schalter [data-modus=bo]'); await w(1000); ok('Wieder hin ohne Anmeldung', await p.isVisible('.ist-bo') && !(await p.isVisible('text=Einmal anmelden.')));
  // Letzte Ansicht gemerkt
  await p.goto(U + '?vorschau'); await w(1300); ok('Startet im Backoffice (zuletzt)', p.url().includes('#bo'));
  // Bestellung: Vertrag erstellen
  await p.goto(U + '?vorschau#bo/bestellungen'); await w(1000);
  await p.click('.bestellung >> nth=0'); await w(500);
  await p.selectOption('#dialog select[name=sponsor]', 'jasmin'); await p.fill('#dialog input[name=linie]', '2');
  const pad = await p.$('#sponsor-pad'); const bb = await pad.boundingBox();
  await p.mouse.move(bb.x + 30, bb.y + 60); await p.mouse.down(); await p.mouse.move(bb.x + 120, bb.y + 30, { steps: 8 }); await p.mouse.move(bb.x + 220, bb.y + 80, { steps: 8 }); await p.mouse.up();
  await p.click('#vertrag-machen'); await p.waitForFunction(() => /Fertig|nicht geklappt/.test(document.querySelector('#vertrag-status').textContent), null, { timeout: 30000 }).catch(() => {});
  const st = await p.textContent('#vertrag-status'); ok('Vertrag erstellt: ' + st.trim(), /Fertig/.test(st));
  ok('Formulare zum Herunterladen', (await p.$$('#vertrag-fertig [data-datei]')).length >= 2);
  await p.screenshot({ path: process.env.OUT + '/bo-vertrag.png', fullPage: false });
  await p.click('#d-abbrechen');
  // Kunde öffnen, Aufgabe anlegen
  await p.goto(U + '?vorschau#bo/kunden'); await w(900); await p.click('tr.klickbar >> nth=0'); await w(400); ok('Kunde öffnet', await p.isVisible('#dialog[open] input[name=vorname]')); await p.click('#d-abbrechen');
  await p.goto(U + '?vorschau#bo/aufgaben'); await w(900); await p.click('#neu'); await p.fill('#dialog input[name=titel]', 'Testaufgabe Backoffice'); await p.click('#dialog [type=submit]'); await w(700);
  ok('Aufgabe angelegt', await p.isVisible('text=Testaufgabe Backoffice'));
  // Kalender, Maschine, Wohnung, Unterlagen, Partner, Auswertung, Meine
  await p.goto(U + '?vorschau#bo/kalender'); await w(900); ok('Kalender Monat', (await p.$$('.kal-feld')).length >= 35);
  await p.goto(U + '?vorschau#bo/maschinen'); await w(900); await p.click('.maschine >> nth=0'); await w(400); ok('Maschine öffnet', await p.isVisible('#dialog[open] input[name=name]')); await p.click('#d-abbrechen');
  await p.goto(U + '?vorschau#bo/wohnung'); await w(900); await p.fill('form.dazu >> nth=0 >> input', 'Testlampe'); await p.press('form.dazu >> nth=0 >> input', 'Enter'); await w(700); ok('Wohnung Eintrag', await p.isVisible('text=Testlampe'));
  for (const r of ['unterlagen', 'partner', 'auswertung', 'meine']) { await p.goto(U + '?vorschau#bo/' + r); await w(800); ok('Reiter ' + r, (await p.textContent('#inhalt h1')).length > 2); }
  // Glocke für Jasmin
  await p.goto(U + '?vorschau#bo/uebersicht'); await w(900); ok('Glocke für Jasmin', await p.isVisible('#glocke'));
  // Als Daniel
  await p.goto(U + '?vorschau&als=daniel#bo/uebersicht'); await w(1000);
  ok('Daniel: keine Glocke', !(await p.isVisible('#glocke')));
  ok('Daniel: Wohnung im Menü', await p.isVisible('.menue a[href="#bo/wohnung"]'));
  ok('Daniel: Rolle Team', (await p.textContent('.menue .unten')).includes('Team'));
  // Abmelden aus dem Backoffice
  await p.click('[data-bo-ab]'); await w(900); ok('Abmelden im Backoffice meldet überall ab', await p.isVisible('text=Alles für dein Geschäft. An einem Ort.'));
  console.log(fehler.length ? fehler.join('\n') : 'keine Konsolenfehler'); await b.close();
})();

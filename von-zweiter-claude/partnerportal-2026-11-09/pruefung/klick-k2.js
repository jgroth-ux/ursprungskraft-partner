// Funktionsprüfung Korrektur 2: alle Partnerfunktionen, je Breite 1440 und 375
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const fehler = []; let nein = 0;
  const neu = async (w, extra = {}) => { const c = await b.newContext({ viewport: { width: w, height: w < 700 ? 812 : 900 }, locale: 'de-DE', ...extra }); const p = await c.newPage();
    p.on('pageerror', (e) => fehler.push('pageerror ' + e.stack)); p.on('console', (m) => ['error', 'warning'].includes(m.type()) && fehler.push(m.type() + ' ' + m.text())); p.on('dialog', (d) => d.accept()); return p; };
  const U = 'http://localhost:8766/partner/';
  const ok = (n, x) => { if (!x) nein++; console.log((x ? 'OK    ' : 'FEHLT ') + n); };
  const w = (p, ms = 800) => p.waitForTimeout(ms);
  for (const breite of [1440, 375]) {
    const p = await neu(breite); const handy = breite < 700;
    console.log('--- Breite ' + breite);
    // Anmelden, Registrieren
    await p.goto(U + '?vorschau=anmelden'); await w(p, 600);
    ok('Anmeldeseite', await p.isVisible('text=Alles für dein Geschäft. An einem Ort.'));
    await p.click('[data-r=registrieren]'); ok('Registrieren: Formular mit Enagic-ID', await p.isVisible('input[name=enagic_id]'));
    await p.fill('input[name=vorname]', 'Max'); await p.fill('input[name=nachname]', 'M'); await p.fill('input[name=passwort]', '12345678'); await p.fill('input[name=passwort2]', '87654321');
    await p.click('#f button[type=submit]'); ok('Registrieren: ungleiche Passwörter werden gemeldet', await p.isVisible('text=Die beiden Passwörter sind nicht gleich.'));
    await p.click('[data-r=anmelden]'); await p.fill('input[name=email]', 'a@b.de'); await p.fill('input[name=passwort]', 'x'); await p.click('#f button[type=submit]'); await w(p, 1200);
    ok('Anmelden führt auf Start', await p.isVisible('.held h1'));
    // Start
    await p.goto(U + '?vorschau=normal#start'); await w(p, 1200);
    ok('Start: Begrüßung, drei Zahlen, nächster Termin', await p.isVisible('.held h1') && (await p.$$('.kennzahlen a')).length === 3 && await p.isVisible('.als-naechstes .zeit'));
    ok('Start: Flyer liegt auf dem Handy im Foto', await p.evaluate(() => { const c = document.querySelector('.kachel [data-mock-flyer] canvas'); return !!c && c.width > 100; }));
    await p.click('.kennzahlen [data-kf=faellig]'); await w(p, 900);
    ok('Start: Zahl "warten auf deinen Anruf" öffnet Kunden mit Filter', p.url().endsWith('#kunden') && (await p.$eval('#extra', (s) => s.value)) === 'faellig' && (await p.$$('.zeile-kunde')).length === 2);
    await p.selectOption('#extra', '');
    // Kunden
    const abrufe0 = await p.evaluate(() => ({ ...window.__abrufe }));
    await p.evaluate(() => window.scrollTo(0, 200)); await w(p, 200); const y0 = await p.evaluate(() => window.scrollY);
    await p.evaluate(() => document.querySelectorAll('.zeile-kunde')[2].click()); await w(p, 600);
    ok('Kunden: Karte als eigene Ansicht', await p.isVisible('.karte-ansicht') && !(await p.isVisible('#liste')));
    await p.click('.zurueck'); await w(p, 600);
    ok('Kunden: zurück, Scrollposition bleibt', Math.abs((await p.evaluate(() => window.scrollY)) - y0) < 5);
    await p.click('.zeile-kunde >> nth=3'); await w(p, 500); await p.goBack(); await w(p, 400);
    const abrufe1 = await p.evaluate(() => ({ ...window.__abrufe }));
    ok('Kunden: Wechsel ohne neues Laden', abrufe0.uk_partner_kunden === abrufe1.uk_partner_kunden);
    await p.click('[data-f=gekauft]'); await w(p, 300); ok('Kunden: Filter Gekauft', (await p.$$('.zeile-kunde')).length === 2);
    await p.click('[data-f=alle]'); await p.fill('#suche', 'brunner'); await w(p, 300); ok('Kunden: Suche', (await p.$$('.zeile-kunde')).length === 1); await p.fill('#suche', '');
    await p.goto(U + '?vorschau=normal#kunden/k3'); await w(p, 1000);
    await p.selectOption('[data-stand]', 'kontaktiert'); await w(p, 700); ok('Karte: Stand ändern', (await p.$eval('[data-stand]', (s) => s.value)) === 'kontaktiert');
    await p.selectOption('[data-stufe]', 'heiss'); await w(p, 700); ok('Karte: Stufe ändern', (await p.$eval('[data-stufe]', (s) => s.value)) === 'heiss');
    await p.fill('#f-weiter input[name=verblieben]', 'Ruft Freitag zurück'); await p.click('#f-weiter button'); await w(p, 700);
    ok('Karte: nächsten Schritt speichern', (await p.textContent('.naechster .jetzt')).includes('Ruft Freitag zurück'));
    await p.fill('#f-notiz textarea', 'Testnotiz K2'); await p.click('#f-notiz button'); await w(p, 700);
    ok('Karte: Notiz speichern, neue oben', (await p.textContent('.notizen li:first-child p')) === 'Testnotiz K2');
    ok('Karte: drei Schnellknöpfe (Anrufen, WhatsApp, Termin)', (await p.$$('.schnell > *')).length === 3 && (await p.getAttribute('.schnell a >> nth=0', 'href')).startsWith('tel:') && (await p.getAttribute('.schnell a >> nth=1', 'href')).startsWith('https://wa.me/'));
    await p.click('.karte-ansicht .aufklappen summary'); await p.click('[data-aendern]'); await w(p, 400); ok('Karte: Angaben ändern öffnet', await p.isVisible('dialog.blatt input[name=vorname]')); await p.click('dialog.blatt [value=zu]');
    await p.click('[data-ablegen]'); await w(p, 700); ok('Karte: ablegen unter "Kein Interesse"', await p.isVisible('.marke-klein.warn'));
    await p.click('.karte-ansicht .aufklappen summary').catch(() => {}); 
    await p.click('.schnell [data-termin]'); await w(p, 400); ok('Karte: Termin aus der Karte', await p.isVisible('dialog.blatt select[name=kunde_id]')); await p.click('dialog.blatt [value=zu]');
    await p.goto(U + '?vorschau=normal#kunden/k2'); await w(p, 1000); ok('Karte: Bestellstand mit drei Schritten', (await p.$$('.schritte li')).length === 3);
    await p.goto(U + '?vorschau=normal#kunden'); await w(p, 900); await p.click('[data-neu]'); await p.fill('dialog input[name=vorname]', 'Neue K2'); await p.click('dialog [value=ok]'); await w(p, 900);
    ok('Kunden: Kunde eintragen', (await p.textContent('.karte-ansicht h1')) === 'Neue K2');
    // Termine und Kalender
    await p.goto(U + '?vorschau=normal#termine'); await w(p, 1100);
    const heute = new Date().toLocaleDateString('sv-SE'), morgen = new Date(Date.now() + 864e5).toLocaleDateString('sv-SE');
    if (!handy) {
      ok('Kalender: Monat, jeder Tag ein Feld', await p.isVisible('.kal-gitter') && (await p.$$('.kal-tag')).length >= 35);
      ok('Kalender: Einträge mit Uhrzeit und Name, farbig nach Art', await p.evaluate(() => { const c = [...document.querySelectorAll('.kal-chip')]; const f = new Set(c.map((x) => getComputedStyle(x).borderLeftColor)); return c.length >= 5 && c.every((x) => x.querySelector('time').textContent && x.querySelector('span').textContent) && f.size >= 3; }));
      await p.click('.kal-chip.c-ort >> nth=0'); await w(p, 500);
      ok('Kalender: Klick auf Eintrag öffnet ihn', await p.isVisible('dialog.termin-detail h2') && await p.isVisible('dialog.termin-detail >> text=Route'));
      await p.click('dialog.termin-detail [data-zu] >> nth=0'); await w(p, 300);
      await p.click(`.kal-neu[data-neu-am="${morgen}"]`, { position: { x: 60, y: 90 }, force: true }); await w(p, 500);
      ok('Kalender: Klick auf leeren Tag legt Termin an (Datum vorbelegt)', (await p.inputValue('dialog.blatt input[name=datum]')) === morgen);
      await p.fill('dialog input[name=uhrzeit]', '15:30'); await p.fill('dialog input[name=ort]', 'Testweg 1, 79100 Freiburg'); await p.click('dialog [value=ok]'); await w(p, 1000);
      ok('Kalender: neuer Termin steht im Tag', await p.evaluate((m) => document.querySelector(`.kal-neu[data-neu-am="${m}"]`).parentElement.querySelectorAll('.kal-chip').length === 2, morgen));
      const titel = await p.textContent('#kal-titel'); await p.click('[data-schritt="1"]'); await w(p, 500); ok('Kalender: Monat weiter', (await p.textContent('#kal-titel')) !== titel);
      await p.click('[data-heute]'); await w(p, 500); ok('Kalender: Heute', (await p.textContent('#kal-titel')) === titel && await p.isVisible('.kal-tag.heute'));
    } else {
      ok('Kalender am Handy: Wochenleiste und Tag', await p.isVisible('.kal-woche') && (await p.$$('.kal-woche button')).length === 7 && await p.isVisible('#kal-tagliste') && !(await p.isVisible('.kal-gitter')));
      ok('Kalender am Handy: heutiger Tag gewählt, Einträge lesbar', (await p.getAttribute(`.kal-woche [data-tag="${heute}"]`, 'aria-pressed')) === 'true' && (await p.$$('#kal-tagliste article.termin')).length >= 1);
      const wtMorgen = await p.$(`.kal-woche [data-tag="${morgen}"]`);
      if (wtMorgen) { await wtMorgen.click(); await w(p, 400); ok('Kalender am Handy: Tag antippen wechselt die Liste', (await p.textContent('#kal-tagtitel')).startsWith('Morgen')); }
      await p.click('[data-schritt="1"]'); await w(p, 400); ok('Kalender am Handy: Woche weiter', !(await p.$(`.kal-woche [data-tag="${heute}"]`)));
      await p.click('[data-heute]'); await w(p, 400);
      await p.click('[data-neu-tag]'); await w(p, 400); ok('Kalender am Handy: Termin am gewählten Tag (Datum vorbelegt)', (await p.inputValue('dialog.blatt input[name=datum]')) === heute);
      await p.fill('dialog input[name=datum]', morgen); await p.fill('dialog input[name=uhrzeit]', '15:30'); await p.fill('dialog input[name=ort]', 'Testweg 1, 79100 Freiburg'); await p.click('dialog [value=ok]'); await w(p, 1000);
      ok('Kalender am Handy: neuer Termin steht am Tag', await p.isVisible('#kal-tagliste >> text=Testweg 1, 79100 Freiburg'));
    }
    await p.click('[data-ansicht=liste]'); await w(p, 500); ok('Termine: Umschalter Liste', await p.isVisible('.kal-listenteil') && await p.isVisible('.kal-listenteil >> text=Testweg 1, 79100 Freiburg'));
    const vorher = (await p.$$('.kal-listenteil [data-weg]')).length; await p.click('.kal-listenteil [data-weg] >> nth=0'); await w(p, 900);
    ok('Termine: Termin löschen', (await p.$$('.kal-listenteil [data-weg]')).length === vorher - 1);
    await p.click('[data-ansicht=kalender]'); await w(p, 300);
    await p.click('details.abo summary'); await w(p, 300);
    ok('Termine: Kalender-Abo (iPhone, Google, Link kopieren)', (await p.getAttribute('details.abo a >> nth=0', 'href')).startsWith('webcal://') && (await p.getAttribute('details.abo a >> nth=1', 'href')).includes('calendar.google.com') && await p.isVisible('[data-abo]'));
    await p.goto(U + '?vorschau=normal#termine/neu'); await w(p, 1000); ok('Termine: Adresse #termine/neu öffnet das Formular', await p.isVisible('dialog.blatt input[name=datum]'));
    await p.goto(U + '?vorschau=leer#termine'); await w(p, 900); ok('Termine leer: Hinweis, Kalender bleibt nutzbar', await p.isVisible('text=Dein Kalender ist noch leer.'));
    await p.goto(U + '?vorschau=leer#start'); await w(p, 900); ok('Start leer: Einladung zum ersten Termin', await p.isVisible('.als-naechstes.ohne >> text=Termin eintragen'));
    // Tools
    await p.goto(U + '?vorschau=normal#werkzeuge'); await w(p, 1000); ok('Alte Adresse #werkzeuge führt zu Tools', p.url().endsWith('#tools') && (await p.textContent('#inhalt h1')) === 'Tools');
    ok('Tools: Reihenfolge Landingpage, Flyer, Bestell-Link, Assistent', await p.evaluate(() => [...document.querySelectorAll('.tool h2')].map((h) => h.textContent).join('|')) === 'Deine Landingpage|Flyer für deine Einladung|Dein persönlicher Bestell-Link|Dein Assistent in Telegram');
    ok('Tools: Bestell-Link mit Erklärung, QR und Abwicklung', await p.isVisible('text=Schick diesen Link deinen Kunden. Wer darüber bestellt, wird dir zugeordnet.') && await p.isVisible('#qr-laden'));
    await p.click('#bestellen details summary'); await p.click('#bestellen input[value=selbst]', { force: true }); await w(p, 500); ok('Tools: Abwicklung umstellen', await p.isChecked('#bestellen input[value=selbst]'));
    ok('Tools: Assistent öffnen', (await p.getAttribute('#assistent a.knopf', 'href')).startsWith('https://t.me/'));
    // Landingpage
    await p.click('#seite a[href="#tools/seite"]'); await w(p, 900);
    ok('Landingpage: Link, Teilen, Formular, Vorschau', await p.isVisible('.lp-kopf code') && await p.isVisible('#f-seite') && await p.isVisible('#lp-kontakt >> text=Lass uns sprechen'));
    const knopf0 = (await p.$$('#lp-kontakt .wege span')).length; await p.fill('#f-seite input[name=telefon]', '+49 170 999'); await w(p, 300);
    ok('Landingpage: Vorschau läuft beim Tippen mit (neuer Knopf Anrufen)', (await p.$$('#lp-kontakt .wege span')).length === knopf0 + 1 && await p.isVisible('#lp-kontakt >> text=Anrufen'));
    await p.fill('#f-seite input[name=termin]', 'calendly.com/x'); await p.click('#f-seite [type=submit]'); await w(p, 400); ok('Landingpage: Termin-Link ohne https wird gemeldet', await p.isVisible('text=Der Link zum Termin buchen muss mit https:// beginnen.'));
    await p.fill('#f-seite input[name=termin]', 'https://calendly.com/x'); await p.click('#f-seite [type=submit]'); await w(p, 700); ok('Landingpage: Speichern', (await p.textContent('#seite-meldung')).startsWith('Gespeichert.'));
    await p.goto(U + '?vorschau=gesperrt#tools/seite'); await w(p, 900); ok('Landingpage nicht gebucht: Verkaufsansicht mit Freischalten', await p.isVisible('.verkauf-buehne >> text=Nie wieder alles von vorn erklären.') && (await p.getAttribute('.verkauf-buehne a.knopf', 'href')).startsWith('mailto:') && await p.isVisible('.verkauf-handy'));
    // Flyer
    await p.goto(U + '?vorschau=normal#flyer'); await w(p, 1600);
    ok('Flyer: Reihenfolge 1 Motiv und Farben, 2 Text, 3 Formate und Speichern', await p.evaluate(() => [...document.querySelectorAll('.schritt h2')].map((h) => h.textContent).join('|')) === 'Motiv und Farben|Text|Formate und Speichern');
    const bild0 = await p.evaluate(() => document.querySelector('#vorschauen canvas').toDataURL().length);
    await p.click('[data-foto=welle]'); await w(p, 1200); await p.click('[data-farbe=tuerkis]'); await w(p, 600);
    ok('Flyer: Motiv und Farbe ändern die Vorschau', (await p.evaluate(() => document.querySelector('#vorschauen canvas').toDataURL().length)) !== bild0);
    await p.fill('#f-flyer input[name=ort]', 'Café Sonne'); await w(p, 700);
    await p.click('[data-format=banner]'); await w(p, 500); ok('Flyer: zweites Format, Umschalter in der Vorschau', (await p.$$('#fv-formate button')).length === 2 && (await p.textContent('#flyer-laden')).includes('2 Flyer herunterladen'));
    await p.click('#vorschauen button'); await w(p, 800); ok('Flyer: Großansicht', await p.isVisible('dialog.gross canvas'));
    await p.click('dialog.gross [data-weiter="1"]'); await w(p, 500); ok('Flyer: Blättern in der Großansicht', (await p.textContent('dialog.gross b')).startsWith('Story'));
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }).catch(() => null), p.click('dialog.gross [data-eins]')]); ok('Flyer: Format speichern (Download ' + (dl ? dl.suggestedFilename() : 'fehlt') + ')', !!dl && dl.suggestedFilename().endsWith('.jpg'));
    await p.click('dialog.gross [data-zu]');
    if (handy) { await p.evaluate(() => window.scrollTo(0, 900)); await w(p, 300); const top = await p.evaluate(() => document.querySelector('.flyer-vorschau').getBoundingClientRect().top); ok('Flyer am Handy: Vorschau bleibt oben stehen (' + Math.round(top) + ' px)', top >= 0 && top < 80); }
    else ok('Flyer am Computer: große Vorschau neben den Schritten', await p.evaluate(() => { const v = document.querySelector('#vorschauen canvas').getBoundingClientRect(); return v.left > document.querySelector('#f-flyer').getBoundingClientRect().right && v.width > 300; }));
    await p.goto(U + '?vorschau=gesperrt#flyer'); await w(p, 900); ok('Flyer gesperrt: Verkaufsansicht', await p.isVisible('.gesperrt >> text=Freischalten'));
    await p.goto(U + '?vorschau=gesperrt#kunden'); await w(p, 800); ok('Kunden frei trotz Sperre anderer Bereiche', await p.isVisible('#suche'));
    // Wissen
    await p.goto(U + '?vorschau=normal#wissen'); await w(p, 900);
    ok('Wissen: Unterlagen im einheitlichen Raster', await p.evaluate(() => { const a = [...document.querySelectorAll('article.unterlage a.titel')].map((x) => x.getBoundingClientRect()); return a.length >= 4 && a.every((r) => Math.abs(r.width - a[0].width) < 1 && Math.abs(r.height - a[0].height) < 1); }));
    ok('Wissen: keine roten Hinweise bei den Unterlagen', !(await p.$('.unterlagen .pruefen, .unterlagen .fehlt')));
    await p.click('.unterreiter a >> nth=1'); await w(p, 600); ok('Wissen: Produktwissen', (await p.$$('.produkt')).length >= 3);
    await p.click('.unterreiter a >> nth=2'); await w(p, 600); ok('Wissen: Einwände und Antworten', (await p.$$('.einwand')).length >= 3);
    // Neuigkeiten, Mehr, Konto, Menü
    await p.goto(U + '?vorschau=normal#neuigkeiten'); await w(p, 800); ok('Neuigkeiten', (await p.$$('.neuigkeit')).length >= 2);
    await p.goto(U + '?vorschau=normal#start'); await w(p, 800); ok('Neuigkeiten gelesen: Zähler leer', (await p.textContent('[data-ungelesen]')) === '');
    await p.goto(U + '?vorschau=normal#mehr'); await w(p, 900);
    ok('Mehr: vier Angebote mit abgenommenen Überschriften', await p.evaluate(() => [...document.querySelectorAll('.angebot h2')].map((h) => h.textContent).join('|')) === 'Nie wieder alles von vorn erklären|Deine Broschüren, gedruckt und digital|Dein Freebie: ein E-Book als Lead-Magnet|Keine Anfrage mehr, die du zu spät siehst');
    ok('Mehr: Interesse melden öffnet Mail, Preis als Platzhalter', (await p.getAttribute('.angebot a.knopf >> nth=0', 'href')).startsWith('mailto:') && (await p.$$('text=[Preis folgt]')).length === 4);
    await p.goto(U + '?vorschau=normal#konto'); await w(p, 800);
    ok('Menü: "App aufs Handy" steht nicht mehr im Menü', !(await p.$('.menue a[href="#app"], .mehr-liste a[href="#app"]')));
    // Einstieg
    await p.click('[data-einstieg="0"]'); await w(p, 600);
    ok('Einstieg: aus dem Konto wieder aufrufbar, Schritt 1 von 4', await p.isVisible('dialog.einstieg') && (await p.textContent('#e-wo')) === 'Schritt 1 von 4');
    await p.click('dialog.einstieg [data-e="1"]'); await w(p, 600); ok('Einstieg: Schritt 2 Hauptfunktionen', (await p.textContent('#e-wo')) === 'Schritt 2 von 4' && (await p.$$('.e-raster li')).length === 4);
    await p.click('dialog.einstieg [data-e="1"]'); await w(p, 600);
    ok('Einstieg: Schritt 3 iPhone, drei Bilder mit markierter Tippstelle, Videobereich', (await p.$$('.geraet.iphone')).length === 3 && (await p.$$('.tipp-hier')).length === 3 && await p.isVisible('.e-video'));
    await p.click('[data-system=android]'); await w(p, 400); ok('Einstieg: Schritt 3 Android getrennt', (await p.$$('.geraet.android')).length === 3 && (await p.$$('.tipp-hier')).length === 3);
    await p.click('dialog.einstieg [data-e="-1"]'); await w(p, 500); ok('Einstieg: zurück', (await p.textContent('#e-wo')) === 'Schritt 2 von 4');
    await p.click('dialog.einstieg [data-e="1"]'); await w(p, 400); await p.click('dialog.einstieg [data-e="1"]'); await w(p, 500);
    ok('Einstieg: Schritt 4 Abschluss mit drei ersten Handgriffen', (await p.textContent('#e-wo')) === 'Schritt 4 von 4' && (await p.$$('.e-los a')).length === 3);
    await p.click('dialog.einstieg [data-e="1"]'); await w(p, 500); ok('Einstieg: "Zum Portal" schließt', !(await p.$('dialog.einstieg')));
    await p.goto(U + '?vorschau=normal&einstieg#start'); await w(p, 1300); ok('Einstieg: geht bei der ersten Anmeldung von selbst auf', await p.isVisible('dialog.einstieg'));
    await p.click('[data-ueberspringen]'); await w(p, 900); ok('Einstieg: überspringbar', !(await p.$('dialog.einstieg')));
    ok('Einstieg: "gesehen" wird im Konto gespeichert (Funktion uk_partner_einstieg_setzen)', await p.evaluate(() => window.__abrufe.uk_partner_einstieg_setzen >= 1));
    ok('Einrichtung: Hinweis auf der Startseite, solange der Haken fehlt', await p.isVisible('#einrichtung [data-einrichtung-fertig]'));
    const neuAnmelden = async () => { await p.evaluate(() => (location.hash = 'konto')); await w(p, 700); await p.click('[data-ab]'); await w(p, 700); await p.fill('input[name=email]', 'a@b.de'); await p.fill('input[name=passwort]', 'x'); await p.click('#f button[type=submit]'); await w(p, 1300); };
    await neuAnmelden();
    ok('Einstieg: geht beim zweiten Anmelden nicht noch einmal auf', !(await p.$('dialog.einstieg')) && await p.isVisible('.held h1'));
    ok('Einrichtung: Hinweis steht nach dem zweiten Anmelden weiter da', await p.isVisible('#einrichtung'));
    await p.click('#einrichtung [data-einstieg="0"]'); await w(p, 600); ok('Einrichtung: Einführung aus dem Hinweis öffnen', await p.isVisible('dialog.einstieg')); await p.keyboard.press('Escape'); await w(p, 700);
    await p.check('#einrichtung [data-einrichtung-fertig]'); await w(p, 900); ok('Einrichtung: Haken setzen, Hinweis verschwindet', !(await p.$('#einrichtung')));
    await neuAnmelden();
    ok('Einrichtung: bleibt nach neuem Anmelden abgeschlossen', !(await p.$('#einrichtung')) && !(await p.$('dialog.einstieg')));
    await p.goto(U + '?vorschau=normal&einstieg=3#start'); await w(p, 1300); await p.check('dialog.einstieg [data-einrichtung-fertig]'); await w(p, 400); await p.click('dialog.einstieg [data-e="1"]'); await w(p, 900);
    ok('Einrichtung: Haken geht auch im letzten Schritt der Einführung', !(await p.$('#einrichtung')) && !(await p.$('dialog.einstieg')));
    await p.goto(U + '?vorschau=normal#start'); await w(p, 1000); ok('Abgeschlossenes Konto: kein Hinweis, keine Einführung', !(await p.$('#einrichtung')) && !(await p.$('dialog.einstieg')));
    await p.goto(U + '?vorschau=normal#app'); await w(p, 1200); ok('Alte Adresse #app öffnet die Anleitung (Schritt 3) im Konto', p.url().endsWith('#konto') && (await p.textContent('#e-wo')) === 'Schritt 3 von 4');
    await p.keyboard.press('Escape'); await w(p, 400);
    if (handy) { await p.goto(U + '?vorschau=normal#menue'); await w(p, 800); ok('Handy: Mehr-Menü mit fünf Zielen', (await p.$$('.mehr-liste a')).length === 5); }
    else { await p.click('[data-id-kopie]').catch(() => {}); await w(p, 300); ok('Menü: Enagic-ID mit Kopier-Symbol', !!(await p.$('[data-id-kopie] svg'))); }
    // Kein Überlauf nach rechts
    for (const r of ['start', 'kunden', 'kunden/k2', 'termine', 'tools', 'tools/seite', 'flyer', 'wissen', 'wissen/produkte', 'wissen/einwaende', 'neuigkeiten', 'mehr', 'konto', 'menue']) {
      await p.goto(U + '?vorschau=normal#' + r); await w(p, 900);
      const ueber = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ueber > 0) ok('Kein Überlauf nach rechts auf ' + r + ' (' + ueber + ' px)', false);
    }
    ok('Alle 14 Ansichten ohne Überlauf nach rechts geprüft', true);
    // Abmelden
    await p.goto(U + '?vorschau=normal#konto'); await w(p, 800); await p.click('[data-ab]'); await w(p, 600); ok('Abmelden', await p.isVisible('text=Alles für dein Geschäft. An einem Ort.'));
    await p.context().close();
  }
  console.log(fehler.length ? 'KONSOLE:\n' + fehler.join('\n') : 'keine Konsolenfehler');
  console.log(nein ? `ERGEBNIS: ${nein} Prüfungen nicht bestanden` : 'ERGEBNIS: alle Prüfungen bestanden'); await b.close();
})();

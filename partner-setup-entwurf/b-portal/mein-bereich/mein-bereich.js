/* ==========================================================================
   Mein Bereich (Aufgabe B6), Stand 20.10.2026
   FERTIG: Status anzeigen, Link kopieren und teilen, QR-Code als PNG, Kündigen mit Rückfrage.
   FEHLT:  nichts auf dieser Seite. Anschluss in ../anschluss.js.
   ========================================================================== */

(async function () {
  if (new URLSearchParams(location.search).get('bezahlt') === '1') document.getElementById('bezahlt').hidden = false;

  var p = await partnerLaden();
  var s = await statusLaden();
  if (p.vorname) document.getElementById('hallo').textContent = 'Hallo ' + p.vorname;

  document.getElementById('st-aktiv').textContent = s.landingpage_aktiv ? 'Aktiv' : 'Nicht aktiv';
  document.getElementById('st-bis').textContent = s.landingpage_aktiv ? 'bezahlt bis ' + datum(s.aktiv_bis) : 'Bitte schließ die Zahlung ab.';
  document.getElementById('st-abbuchung').textContent = s.gekuendigt ? 'Keine mehr' : datum(s.naechste_abbuchung);
  document.getElementById('st-betrag').textContent = s.gekuendigt ? 'Abo ist gekündigt' : geld(s.betrag_monat) + ' monatlich';
  document.getElementById('st-bot').textContent = s.telegram_verbunden ? 'Verbunden' : 'Noch nicht verbunden';
  document.getElementById('bot-link').href = s.telegram_link;

  var link = document.getElementById('link');
  link.value = s.link;
  document.getElementById('ansehen').href = s.link;
  document.getElementById('whatsapp-teilen').href = 'https://wa.me/?text=' + encodeURIComponent('Hier kannst du dir das Gerät in Ruhe ansehen und einen Test bei dir zu Hause anfragen: ' + s.link);

  document.getElementById('kopieren').addEventListener('click', async function () {
    try { await navigator.clipboard.writeText(link.value); }
    catch (e) { link.select(); document.execCommand('copy'); }
    meldung('Link kopiert.');
  });

  var bestell = document.getElementById('bestell-link');
  bestell.value = s.bestell_link;
  document.getElementById('bestell-kopieren').addEventListener('click', async function () {
    try { await navigator.clipboard.writeText(bestell.value); }
    catch (e) { bestell.select(); document.execCommand('copy'); }
    meldung('Bestell-Link kopiert.');
  });

  // QR-Code (qrcodejs). Fehlt die Bibliothek, bleibt der Kasten leer und der Knopf verschwindet.
  var qrKasten = document.getElementById('qr');
  if (window.QRCode) {
    new QRCode(qrKasten, { text: s.link, width: 512, height: 512, colorDark: '#1D1E19', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
  } else {
    document.getElementById('qr-laden').hidden = true;
    qrKasten.hidden = true;
  }
  document.getElementById('qr-laden').addEventListener('click', function () {
    var c = qrKasten.querySelector('canvas');
    var a = document.createElement('a');
    a.href = c ? c.toDataURL('image/png') : qrKasten.querySelector('img').src;
    a.download = 'qr-code-' + (p.kuerzel || 'seite') + '.png';
    a.click();
  });

  if (s.letzte_bestellung && s.letzte_bestellung.posten) {
    document.getElementById('letzte').hidden = false;
    document.getElementById('letzte-text').textContent = s.letzte_bestellung.posten.map(function (x) { return x.stueck + ' × ' + x.name; }).join(', ');
  }

  var dlg = document.getElementById('kuendigen-dialog');
  if (s.gekuendigt) kuendigungZeigen(null);
  document.getElementById('kuendigen-auf').addEventListener('click', function () { dlg.showModal(); });
  dlg.addEventListener('close', async function () {
    if (dlg.returnValue !== 'ja') return;
    var r = await aboKuendigen(dlg.querySelector('textarea').value.trim());
    if (r.ok) kuendigungZeigen(r.endet_am);
    else meldung('Die Kündigung hat nicht geklappt. Schreib uns bitte kurz.');
  });
  function kuendigungZeigen(endet) {
    document.getElementById('kuendigen-auf').hidden = true;
    var t = document.getElementById('gekuendigt');
    t.hidden = false;
    t.textContent = 'Dein Abo ist gekündigt. Deine Seite bleibt online bis ' + (endet ? datum(endet) : 'zum Ende der bezahlten Zeit') + '.';
    document.getElementById('st-abbuchung').textContent = 'Keine mehr';
    document.getElementById('st-betrag').textContent = 'Abo ist gekündigt';
  }

  document.getElementById('abmelden').addEventListener('click', function () { abmelden(); });
})();

/* ==========================================================================
   Vorschau-Umschalter für die Farbpakete
   Stand 20.10.2026
   FERTIG: Leiste oben auf jeder Seite, merkt sich die Wahl im Browser, liest ?farbe=blau aus der Adresse.
   FEHLT:  nichts. Für den Live-Betrieb am <html> data-vorschau="aus" setzen (oder diese Datei
           nicht einbinden), dann erscheint keine Leiste und es gilt nur data-farbe.
   ========================================================================== */

(function () {
  var PAKETE = [
    { wert: 'oliv', name: 'Oliv-Khaki', farbe: '#4F5A35' },
    { wert: 'blau', name: 'Blau', farbe: '#2E5163' },
    { wert: 'sand', name: 'Sand neutral', farbe: '#A59C8C' },
    { wert: 'lehm', name: 'Lehm', farbe: '#8A4A2F' }
  ];
  var html = document.documentElement;

  function setzen(wert) {
    html.setAttribute('data-farbe', wert);
    try { localStorage.setItem('vorschau-farbe', wert); } catch (e) {}
    document.querySelectorAll('.vorschau-leiste button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.wert === wert ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('farbe-geaendert', { detail: wert }));
  }
  window.farbpaketSetzen = setzen;

  if (html.getAttribute('data-vorschau') !== 'an') return;
  if (window.self !== window.top) return; // in einem Vorschau-Rahmen (Portal) keine Leiste

  var ausAdresse = new URLSearchParams(location.search).get('farbe');
  var gemerkt = null;
  try { gemerkt = localStorage.getItem('vorschau-farbe'); } catch (e) {}
  var start = ausAdresse || gemerkt || html.getAttribute('data-farbe') || 'oliv';

  function leisteBauen() {
    var leiste = document.createElement('div');
    leiste.className = 'vorschau-leiste';
    leiste.innerHTML = '<div class="vl-innen"><span class="vl-titel">Vorschau Farbpaket</span></div>';
    var innen = leiste.firstChild;
    PAKETE.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.wert = p.wert;
      b.innerHTML = '<span class="vl-punkt" style="background:' + p.farbe + '"></span>' + p.name;
      b.addEventListener('click', function () { setzen(p.wert); });
      innen.appendChild(b);
    });
    // Zurück zur vorigen Seite (in der Übersicht zum Ansehen praktisch)
    if (history.length > 1) {
      var zurueck = document.createElement('button');
      zurueck.type = 'button';
      zurueck.textContent = '← Zurück';
      zurueck.style.marginRight = '8px';
      zurueck.addEventListener('click', function () { history.back(); });
      innen.insertBefore(zurueck, innen.firstChild);
    }
    document.body.insertBefore(leiste, document.body.firstChild);
    setzen(start);
  }
  if (document.body) leisteBauen(); else document.addEventListener('DOMContentLoaded', leisteBauen);
})();

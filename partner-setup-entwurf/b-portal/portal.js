/* ==========================================================================
   Partner-Portal: kleine Helfer für alle Seiten. Stand 20.10.2026
   FERTIG: Geldbeträge formatieren, Meldung unten einblenden, Datum deutsch.
   FEHLT:  nichts.
   ========================================================================== */

// Währung des Portals. Offen: Schweizer Partner in CHF oder alle in EUR (f-offene-fragen.md)
var WAEHRUNG = 'EUR';

function geld(betrag, waehrung) {
  if (betrag === null || betrag === undefined || isNaN(betrag)) return '{{PREIS_FEHLT}}';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: waehrung || WAEHRUNG }).format(betrag);
}

function datum(iso) {
  if (!iso) return '{{DATUM_FEHLT}}';
  var d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

var meldungZeit;
function meldung(text) {
  var el = document.querySelector('.meldung');
  if (!el) { el = document.createElement('div'); el.className = 'meldung'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = text;
  el.hidden = false;
  clearTimeout(meldungZeit);
  meldungZeit = setTimeout(function () { el.hidden = true; }, 3200);
}

function feldFalsch(el, falsch) {
  var f = el.closest('.feld');
  if (f) f.classList.toggle('falsch', !!falsch);
}

var EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

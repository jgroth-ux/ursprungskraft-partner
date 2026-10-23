/* ==========================================================================
   Abweichende Lieferadresse für die Bestellseite, Stand 23.10.2026
   FERTIG: Haken "Lieferadresse weicht ab", Felder klappen auf, Pflichtfelder prüfen,
           Daten über lieferadresseDaten() abrufbar.
   FEHLT:  Übernahme in die Enagic-Formulare (welches Feld im Bestellformular, siehe EINBAU.md).
   ========================================================================== */
(function () {
  var FELDER = [
    { name: 'liefer_name', label: 'Vor- und Nachname oder Firma', auto: 'name', pflicht: true },
    { name: 'liefer_zusatz', label: 'Adresszusatz (freiwillig), z. B. c/o, Etage', auto: 'address-line2' },
    { name: 'liefer_strasse', label: 'Straße und Hausnummer', auto: 'shipping address-line1', pflicht: true },
    { name: 'liefer_plz', label: 'PLZ', auto: 'shipping postal-code', pflicht: true, halb: true },
    { name: 'liefer_ort', label: 'Ort', auto: 'shipping address-level2', pflicht: true, halb: true },
    { name: 'liefer_land', label: 'Land', auto: 'shipping country-name', pflicht: true },
    { name: 'liefer_telefon', label: 'Telefon für den Lieferdienst (freiwillig)', auto: 'tel', typ: 'tel' }
  ];

  function bauen() {
    var w = document.getElementById('lieferadresse');
    if (!w) return;
    var felder = '', halb = [];
    FELDER.forEach(function (f) {
      var eingabe = f.name === 'liefer_land'
        ? '<select name="liefer_land" autocomplete="' + f.auto + '"><option>Deutschland</option><option>Schweiz</option><option>Österreich</option></select>'
        : '<input name="' + f.name + '" autocomplete="' + f.auto + '" type="' + (f.typ || 'text') + '">';
      var html = '<label class="la-feld">' + f.label + eingabe + '</label>';
      if (f.halb) { halb.push(html); if (halb.length === 2) { felder += '<div class="la-reihe">' + halb.join('') + '</div>'; halb = []; } }
      else felder += html;
    });
    w.innerHTML =
      '<label class="la-haken"><input type="checkbox" name="liefer_abweichend" id="la-schalter"> <span>Die Lieferadresse ist eine andere als meine Adresse</span></label>' +
      '<div class="la-felder" id="la-felder" hidden>' + felder +
      '<p class="la-hinweis">Das Gerät wird an diese Adresse geliefert. Rechnung und Vertrag laufen weiter auf deinen Namen.</p></div>';
    var s = document.getElementById('la-schalter');
    s.addEventListener('change', function () {
      document.getElementById('la-felder').hidden = !s.checked;
      if (s.checked) w.querySelector('[name="liefer_name"]').focus();
    });
  }

  // ANSCHLUSS (für die Bestellseite): null, wenn keine abweichende Lieferadresse gewählt ist,
  // sonst { name, zusatz, strasse, plz, ort, land, telefon }.
  window.lieferadresseDaten = function () {
    var w = document.getElementById('lieferadresse');
    if (!w || !w.querySelector('#la-schalter').checked) return null;
    var d = {};
    FELDER.forEach(function (f) { d[f.name.replace('liefer_', '')] = (w.querySelector('[name="' + f.name + '"]').value || '').trim(); });
    return d;
  };

  // Prüft die Pflichtfelder. Gibt true zurück oder markiert die Felder und gibt false zurück.
  window.lieferadressePruefen = function () {
    var w = document.getElementById('lieferadresse');
    if (!w || !w.querySelector('#la-schalter').checked) return true;
    var ok = true, erstes = null;
    FELDER.forEach(function (f) {
      var el = w.querySelector('[name="' + f.name + '"]');
      var falsch = f.pflicht && !el.value.trim();
      el.closest('.la-feld').classList.toggle('la-falsch', falsch);
      if (falsch) { ok = false; if (!erstes) erstes = el; }
    });
    if (erstes) erstes.focus();
    return ok;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bauen); else bauen();
})();

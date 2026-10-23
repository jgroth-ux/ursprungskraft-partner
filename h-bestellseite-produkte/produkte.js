/* ==========================================================================
   Produktauswahl für die Bestellseite (mein.ursprungskraft.net/bestellen/), Stand 23.10.2026
   FERTIG: drei Kacheln (K8, emGuarde, ANESPA DX), Klick öffnet Details, Zusatzprodukte per
           Haken mitbestellen, Auswahl über zusatzprodukteAuswahl() abrufbar.
   FEHLT:  Preise für emGuarde und ANESPA DX (offizielle EU-Preise nicht gefunden), Produktfotos,
           Abgleich der Texte mit den Enagic-Seiten (von hier aus nicht erreichbar).
   EINBAU: siehe EINBAU.md
   ========================================================================== */

(function () {
  /* ---------- PRODUKTE: Texte und Preise hier pflegen ----------
     preis: Endpreis je Land als Text, wie er auf der Seite stehen soll. null = "Preis auf Anfrage".
     Die K8-Preise stammen aus wissenspaket/05-preise-k8.md (Stand 19.10.2026). */
  var PRODUKTE = [
    {
      id: 'k8',
      haupt: true,
      name: 'LeveLuk K8',
      kurz: 'Der Wasserionisierer für deine Küche. Fünf Wasserarten aus deinem Leitungswasser.',
      bild: '',            // z. B. '../bilder/k8.jpg'
      preis: { DE: '5.486 € inkl. MwSt.', CH: '4.657 € geliefert, zzgl. Verzollung und MwSt.' },
      punkte: [
        '8 platinbeschichtete Titanplatten für die Elektrolyse',
        '5 Wasserarten von pH 2,5 bis pH 11,5, per Touchscreen gewählt',
        'Filterwechsel etwa einmal im Jahr, je nach Verbrauch',
        'Ratenzahlung möglich'
      ],
      text: 'Der K8 steht neben deiner Spüle und wird an den Wasserhahn angeschlossen. Er filtert dein Leitungswasser und teilt es danach per Elektrolyse in basisches und saures Wasser. So bekommst du per Knopfdruck Trinkwasser, Wasser zum Kochen und Wasser für Pflege und Haushalt.'
    },
    {
      id: 'emguarde',
      name: 'emGuarde',
      kurz: 'Kleines Gerät von Enagic für Zuhause, Büro und unterwegs.',
      bild: '',
      preis: { DE: null, CH: null },
      punkte: [
        'Modell EM001 für Zuhause: laut Hersteller rund 4 m Reichweite, Betrieb über USB',
        'Modell EM002-K (Portable): Set mit 2 Geräten, Akku für bis zu 72 Stunden',
        'Hersteller: Enagic'
      ],
      text: 'Enagic beschreibt emGuarde als Technologie, die elektromagnetische Felder in deiner Umgebung ausgleichen soll, zum Beispiel von WLAN, Handy und Elektrogeräten. Nach Angaben von Enagic ist emGuarde nicht zur Diagnose, Behandlung, Heilung oder Vorbeugung von Krankheiten bestimmt. Welches Modell zu dir passt, besprechen wir gemeinsam.'
    },
    {
      id: 'anespa',
      name: 'ANESPA DX',
      kurz: 'Das Duschsystem von Enagic mit Mineral-Ionen-Wasser.',
      bild: '',
      preis: { DE: null, CH: null },
      punkte: [
        'Duschkopf mit Massagefunktion und Edelstahlschlauch',
        'Durchfluss laut Händlerangaben etwa 2,6 Liter pro Minute',
        'Kartuschen: außen etwa einmal im Jahr, innen etwa alle 3 Jahre',
        'Made in Japan, Modell ANSP-02'
      ],
      text: 'ANESPA DX wird an deine Dusche angeschlossen. Das Wasser läuft durch eine Kartusche mit Mineralien, bevor es aus dem Duschkopf kommt. Für ein angenehmes Duscherlebnis zu Hause, passend zu deinem K8 in der Küche.'
    }
  ];
  /* ---------- Ende PRODUKTE ---------- */

  var gewaehlt = {}; // id -> true

  function land() {
    var w = document.querySelector('#produktauswahl');
    return (w && w.getAttribute('data-land')) === 'CH' ? 'CH' : 'DE';
  }
  function preisText(p) { return p.preis[land()] || 'Preis auf Anfrage'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bildHtml(p, klasse) {
    return p.bild
      ? '<img class="' + klasse + '" src="' + esc(p.bild) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<div class="' + klasse + ' pa-platzhalter" aria-hidden="true">' + esc(p.name) + '</div>';
  }

  function kacheln() {
    var w = document.getElementById('produktauswahl');
    if (!w) return;
    w.innerHTML =
      '<div class="pa-kopf"><p class="pa-eyebrow">Dein Paket</p><h2 class="pa-titel">Das Gerät und passende Ergänzungen</h2>' +
      '<p class="pa-unter">Tippe auf ein Produkt für mehr Infos. Ergänzungen kannst du einfach mitbestellen.</p></div>' +
      '<div class="pa-raster">' + PRODUKTE.map(function (p) {
        return '<article class="pa-kachel' + (p.haupt ? ' pa-haupt' : '') + (gewaehlt[p.id] ? ' pa-an' : '') + '" data-id="' + p.id + '">' +
          '<button type="button" class="pa-oeffnen" aria-haspopup="dialog">' +
            bildHtml(p, 'pa-bild') +
            '<span class="pa-name">' + esc(p.name) + '</span>' +
            '<span class="pa-kurz">' + esc(p.kurz) + '</span>' +
            '<span class="pa-preis">' + esc(preisText(p)) + '</span>' +
            '<span class="pa-mehr">Mehr erfahren</span>' +
          '</button>' +
          (p.haupt
            ? '<div class="pa-status">In deiner Bestellung</div>'
            : '<label class="pa-wahl"><input type="checkbox" data-wahl="' + p.id + '"' + (gewaehlt[p.id] ? ' checked' : '') + '> Mitbestellen</label>') +
        '</article>';
      }).join('') + '</div>' +
      '<dialog class="pa-dialog" id="pa-dialog"><div class="pa-dlg" id="pa-dlg"></div></dialog>';

    w.querySelectorAll('.pa-oeffnen').forEach(function (b) {
      b.addEventListener('click', function () { details(b.closest('.pa-kachel').dataset.id); });
    });
    w.querySelectorAll('[data-wahl]').forEach(function (c) {
      c.addEventListener('change', function () { setzen(c.dataset.wahl, c.checked); });
    });
  }

  function setzen(id, an) {
    if (an) gewaehlt[id] = true; else delete gewaehlt[id];
    var k = document.querySelector('.pa-kachel[data-id="' + id + '"]');
    if (k) {
      k.classList.toggle('pa-an', !!an);
      var c = k.querySelector('[data-wahl]');
      if (c) c.checked = !!an;
    }
    document.dispatchEvent(new CustomEvent('zusatzprodukte-geaendert', { detail: zusatzprodukteAuswahl() }));
  }

  function details(id) {
    var p = PRODUKTE.filter(function (x) { return x.id === id; })[0];
    var d = document.getElementById('pa-dialog'), inhalt = document.getElementById('pa-dlg');
    inhalt.innerHTML =
      '<button type="button" class="pa-zu" aria-label="Schließen">×</button>' +
      bildHtml(p, 'pa-dlg-bild') +
      '<h3 class="pa-dlg-titel">' + esc(p.name) + '</h3>' +
      '<p class="pa-preis">' + esc(preisText(p)) + '</p>' +
      '<p>' + esc(p.text) + '</p>' +
      '<ul class="pa-punkte">' + p.punkte.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (p.haupt
        ? '<button type="button" class="pa-knopf" data-schliessen>Weiter zur Bestellung</button>'
        : '<button type="button" class="pa-knopf" data-dazu="' + p.id + '">' + (gewaehlt[p.id] ? 'Wieder entfernen' : 'Mitbestellen') + '</button>') +
      '<p class="pa-hinweis">Vor dem Abschluss melden wir uns bei dir und gehen die Bestellung gemeinsam durch.</p>';
    inhalt.querySelector('.pa-zu').addEventListener('click', function () { d.close(); });
    var s = inhalt.querySelector('[data-schliessen]');
    if (s) s.addEventListener('click', function () { d.close(); });
    var dazu = inhalt.querySelector('[data-dazu]');
    if (dazu) dazu.addEventListener('click', function () { setzen(p.id, !gewaehlt[p.id]); d.close(); });
    d.showModal();
  }

  // ANSCHLUSS (für die Bestellseite): liefert die gewählten Zusatzprodukte für Bestellung,
  // Telegram-Nachricht und Mail. Beispiel: [{ id: 'emguarde', name: 'emGuarde' }]
  window.zusatzprodukteAuswahl = function () {
    return PRODUKTE.filter(function (p) { return gewaehlt[p.id]; }).map(function (p) { return { id: p.id, name: p.name }; });
  };
  // Land wechseln (DE oder CH), wenn die Bestellseite das Land ändert
  window.zusatzprodukteLand = function (l) {
    var w = document.getElementById('produktauswahl');
    if (w) { w.setAttribute('data-land', l === 'CH' ? 'CH' : 'DE'); kacheln(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kacheln); else kacheln();
})();

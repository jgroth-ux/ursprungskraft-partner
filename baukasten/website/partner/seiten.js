// Partnerportal, Ansicht "Meine Seiten" (Baukasten Partnerseiten, 11.11.2026). Eigene Datei, in index.html vor partner.js.
// partner.js ruft MeineSeiten.zeigen(box, rest, umgebung) für die Adressen #seiten, #seiten/info und #seiten/bearbeiten.
// Nicht gebucht: lebendige Vorschau mit den Beispielseiten von Daniel und Jasmin, Klick öffnet die Info-Seite.
// Gebucht: einmal das Formular (Foto mit Ausschnitt, Name, Rolle, Satz, Instagram, Kontakt für Anfragen, Fassungen,
// Adresse), danach die Übersicht mit Link kopieren, Vorschau und E-Book je Fassung.
// Datenbank nur über uk_partner_seiten_* mit Sitzungsschlüssel, das Foto über die Edge Function partner-foto.
// Mit ?vorschau (Portal) oder in seiten-vorschau.html läuft alles mit Beispieldaten im Browser.
window.MeineSeiten = (() => {
  'use strict';
  const FASSUNG = {
    neutral: { name: 'Neutral', fuer: 'Für alle Interessenten', titel: 'Deine Seite für alle',
      text: 'Die klassische Seite: ein Gerät, fünf Wasserarten, für Küche, Pflege und Haushalt. Du bist das Gesicht der Seite.' },
    sport: { name: 'Sport', fuer: 'Für sportliche Interessenten', titel: 'Deine Sportseite',
      text: 'Training, Regeneration, genug trinken, Meal Prep. Oben ein Sportfoto, du stehst als "Empfohlen von" daneben. Du musst selbst kein Sportler sein.' },
    gesundheit: { name: 'Gesundheit', fuer: 'Für Heilpraktiker, Osteopathen und ihre Klienten', titel: 'Deine Gesundheitsseite',
      text: 'Körper, Wohlbefinden und gute Gewohnheiten rund ums Trinken. Ruhig erzählt, ohne Heilversprechen.' },
  };
  const REIHE = ['neutral', 'sport', 'gesundheit'];
  // Preise legen Daniel und Jasmin fest. Bezahlen kommt später (Stripe), bis dahin öffnet "Paket buchen" eine fertige Mail.
  const PREIS = { einrichtung: '[Preis folgt]', hosting: '[Preis folgt]' };
  const BUCHEN_LINK = null; // später zum Beispiel der Stripe-Link
  const SPEICHER = 'uk-seiten-vorschau';

  let u = null; // Umgebung aus partner.js: rpc, sitzung, esc, ico, kopf, toast, kopieren, p, vorschau, supabase, schluessel, kontakt
  let D = null; // Daten aus uk_partner_seiten_daten
  const esc = (s) => u.esc(s);
  const ico = (n) => u.ico(n);
  const t = (x) => String(x ?? '').trim();
  const name = (x) => `${t(x.vorname)} ${t(x.nachname)}`.trim();
  const ruhig = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const datum = (d) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');

  // Adressen: öffentlich (zum Teilen) und im Portal (gleicher Ursprung, für die Vorschau im Rahmen)
  const oeffentlich = (adresse, f) => `${D.basis}/p/${adresse}/${f}`;
  const ebook = (adresse, f) => `${D.basis}/p/${adresse}/${f}/e-book`;
  const hier = (adresse, f) => (u.vorschau ? `/p/${f}.html?seite=${encodeURIComponent(adresse)}&demo` : `/p/${adresse}/${f}`);
  const rahmenAdresse = (f) => `/p/${f}.html?vorschau=portal`;

  // ---------- Daten ----------
  async function laden() {
    const r = await rpc('uk_partner_seiten_daten');
    if (r.error || !r.data) throw r.error || new Error('keine Daten');
    D = r.data;
    return D;
  }
  const rpc = (name, args = {}) => (u.vorschau ? Vorschau.rpc(name, args) : u.rpc(name, args));

  // ---------- Router ----------
  async function zeigen(box, rest, umgebung) {
    u = umgebung;
    await laden();
    if (u.aktuell && !u.aktuell()) return;
    const teil = rest[0] || '';
    if (teil === 'info') return info(box);
    if (!D.gebucht) return gesperrt(box);
    if (teil === 'bearbeiten' || !D.seite) return formular(box);
    return uebersicht(box);
  }

  const buchenHref = () => BUCHEN_LINK || `mailto:${u.kontakt}?subject=${encodeURIComponent('Paket "Eigene Seite" buchen')}&body=${encodeURIComponent(`Hallo Daniel und Jasmin,\n\nich möchte das Paket "Eigene Seite" buchen.\n\n${name(u.p)}`)}`;
  const preisZeile = () => `<span>Einrichtung einmalig ${esc(PREIS.einrichtung)}, Hosting ${esc(PREIS.hosting)} im Monat</span>`;

  // ---------- Telefonrahmen mit echter Seite ----------
  function handy(src, unter, href) {
    return `<figure class="ms-handy">
      <div class="ms-schirm"><iframe src="${esc(src)}" title="${esc(unter)}" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
        ${href ? `<a class="ms-ganz" href="${esc(href)}" aria-label="${esc(unter)}: mehr erfahren"></a>` : ''}</div>
      <figcaption>${esc(unter)}</figcaption></figure>`;
  }
  // Die Beispielseiten scrollen langsam von selbst, damit man sieht, dass sie lebendig sind. Halt bei Maus darüber.
  function lebendig(box) {
    if (ruhig()) return;
    box.querySelectorAll('.ms-handy iframe').forEach((f, i) => {
      let y = 0, halt = 0, aus = false, letzte = 0;
      const fig = f.closest('.ms-handy');
      fig.addEventListener('pointerenter', () => (aus = true)); fig.addEventListener('pointerleave', () => (aus = false));
      const schritt = (zeit) => {
        if (!f.isConnected) return;
        const w = f.contentWindow, d = f.contentDocument;
        if (w && d && d.body && !aus && zeit - letzte > 30) {
          letzte = zeit;
          if (halt > 0) halt--;
          else {
            const max = d.documentElement.scrollHeight - w.innerHeight;
            y = y + 1.2 > max ? 0 : y + 1.2;
            if (y === 0) halt = 60;
            w.scrollTo(0, y);
          }
        }
        requestAnimationFrame(schritt);
      };
      f.addEventListener('load', () => { halt = 50 + i * 40; requestAnimationFrame(schritt); }, { once: true });
    });
  }
  // Im Rahmen ?vorschau=portal: Angaben schicken, sobald die Seite bereit ist
  function vorschauVerbinden(iframe, angaben) {
    const senden = () => iframe.contentWindow?.postMessage({ typ: 'uk-seite', partner: angaben() }, location.origin);
    const bereit = (e) => {
      if (!iframe.isConnected) return removeEventListener('message', bereit);
      if (e.source === iframe.contentWindow && e.data?.typ === 'uk-seite-bereit') senden();
    };
    addEventListener('message', bereit);
    return senden;
  }

  // ================= GESPERRT: Vorschau mit Beispielen =================
  function gesperrt(box) {
    const bsp = (D.beispiele || []).slice(0, 2);
    box.innerHTML = `${u.kopf('Meine Seiten', 'Deine eigene Empfehlungsseite mit E-Book. In drei Fassungen, einmal eingerichtet, sofort online.')}
      <section class="ms-buehne">
        <div class="text">
          <p class="kicker">${ico('schloss')} Paket "Eigene Seite" · noch nicht gebucht</p>
          <h2>Deine Seite. Dein Name. Dein E-Book.</h2>
          <p>Du füllst einmal ein Formular aus, danach stehen deine Seiten bereit. Für jeden Interessenten schickst du die passende: neutral, sportlich oder rund um Gesundheit. Wer sich einträgt, bleibt für immer bei dir.</p>
          <div class="kosten"><a class="knopf hell" href="#seiten/info">So funktioniert es</a>${preisZeile()}</div>
        </div>
        <div class="ms-beispiele">${bsp.length ? bsp.map((b) => handy(hier(b.adresse, b.fassung), `Beispiel: ${name(b)}, ${FASSUNG[b.fassung]?.name || ''}`, '#seiten/info')).join('')
          : '<p class="leise">Die Beispielseiten von Daniel und Jasmin erscheinen hier, sobald sie eingerichtet sind.</p>'}</div>
      </section>
      <ol class="ms-fassungen">${REIHE.map((f, i) => `<li><a href="#seiten/info"><span class="zahl-gross" aria-hidden="true">0${i + 1}</span>
        <p class="kicker">${esc(FASSUNG[f].fuer)}</p><h3>${esc(FASSUNG[f].name)}</h3><p>${esc(FASSUNG[f].text)}</p></a></li>`).join('')}</ol>`;
    lebendig(box);
  }

  // ================= INFO =================
  function info(box) {
    const bsp = D.beispiele || [];
    const beispielFuer = (f) => bsp.find((b) => (b.fassungen || [b.fassung]).includes(f));
    box.innerHTML = `<a class="zurueck" href="#seiten">${ico('links')} Zurück zu Meine Seiten</a>
      ${u.kopf('Paket "Eigene Seite"', 'Was du bekommst, wie es funktioniert und was es kostet.')}
      <section class="ms-info-punkte">
        <ul>
          <li><b>Deine eigene Landingpage</b><span>Mit deinem Foto, deinem Namen und einem Satz von dir. Fertig gestaltet, du musst nichts bauen.</span></li>
          <li><b>Bis zu drei Fassungen</b><span>Neutral für alle, Sport für sportliche Interessenten, Gesundheit für Heilpraktiker, Osteopathen und ihre Klienten.</span></li>
          <li><b>Dein persönliches E-Book</b><span>Wer sich auf deiner Seite einträgt, bekommt das E-Book mit deinem Namen, deinem Foto und deinem Link darin.</span></li>
          <li><b>Jede Anfrage bleibt bei dir</b><span>Wer über deine Seite kommt, ist dir für immer zugeordnet, auch wenn er erst Monate später kauft.</span></li>
        </ul>
      </section>
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>Die drei Fassungen</h2></div>
        <div class="ms-drei">${REIHE.map((f) => { const b = beispielFuer(f);
          return `<article class="ms-fassung-info">${b ? handy(hier(b.adresse, f), `Beispiel: ${name(b)}`, '') : `<div class="ms-ohne-beispiel">${esc(FASSUNG[f].name)}</div>`}
            <p class="kicker">${esc(FASSUNG[f].fuer)}</p><h3>${esc(FASSUNG[f].name)}</h3><p class="leise">${esc(FASSUNG[f].text)}</p>
            ${b ? `<a class="pfeil-link" href="${esc(hier(b.adresse, f))}" target="_blank" rel="noopener">Ganze Seite ansehen ${ico('pfeil')}</a>` : ''}</article>`; }).join('')}</div>
      </section>
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>So funktioniert es</h2></div>
        <ol class="ablauf ms-ablauf">
          <li><span class="zahl-gross" aria-hidden="true">01</span><h3>Paket buchen</h3><p>Einmal buchen, danach ist der Bereich hier frei.</p></li>
          <li><span class="zahl-gross" aria-hidden="true">02</span><h3>Einmal ausfüllen</h3><p>Foto hochladen, Name, ein Satz über dich, welche Fassungen du willst. Dauert fünf Minuten.</p></li>
          <li><span class="zahl-gross" aria-hidden="true">03</span><h3>Link teilen</h3><p>Je Interessent die passende Seite. Per WhatsApp, Instagram oder als QR-Code auf deinem Flyer.</p></li>
        </ol></section>
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>Was es kostet</h2></div>
        <dl class="ms-preise">
          <div><dt>Einrichtung, einmalig</dt><dd>${esc(PREIS.einrichtung)}</dd></div>
          <div><dt>Hosting, monatlich</dt><dd>${esc(PREIS.hosting)}</dd></div>
        </dl>
        <p class="leise klein" style="margin-top:var(--s-3)">Mehrere Fassungen? Das Hosting zahlst du trotzdem nur einmal.</p></section>
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>Häufige Fragen</h2></div>
        <details class="aufklappen"><summary>Steht meine Telefonnummer auf der Seite?</summary><p class="leise">Nur wenn du es ausdrücklich willst. Telefon und E-Mail brauchen wir, um dir Anfragen weiterzugeben. Auf der Seite und im E-Book stehen sie nur, wenn du den Haken dafür setzt.</p></details>
        <details class="aufklappen"><summary>Wer meldet sich bei meinen Interessenten?</summary><p class="leise">Das legen Daniel und Jasmin mit dir fest. Entweder melden sie sich bei allen, die sich über deine Seite eintragen. Oder du kümmerst dich selbst darum, dann siehst du hier jede Anfrage mit Telefon und E-Mail und bekommst sie auf Wunsch sofort über einen eigenen Telegram-Bot aufs Handy. Jede Anfrage bleibt in beiden Fällen bei dir.</p></details>
        <details class="aufklappen"><summary>Muss ich Sportler sein für die Sportseite?</summary><p class="leise">Nein. Oben steht ein Sportfoto, du erscheinst daneben als "Empfohlen von". Die Seite spricht sportliche Menschen an, nicht dich als Sportler.</p></details>
        <details class="aufklappen"><summary>Kann ich später etwas ändern?</summary><p class="leise">Ja, jederzeit: Foto, Satz, Fassungen und sogar die Adresse. Alte Links führen weiter zu deiner Seite.</p></details>
        <details class="aufklappen"><summary>Läuft die Seite unter Ursprungskraft?</summary><p class="leise">Nein. Die Seiten laufen unter einer neutralen Adresse. Im Mittelpunkt stehst du.</p></details>
      </section>
      <div class="knoepfe ms-schluss">${D.gebucht ? `<a class="knopf" href="#seiten">Zu meinen Seiten</a>` : `<a class="knopf" href="${esc(buchenHref())}">Paket buchen</a>${preisZeile()}`}</div>`;
    lebendig(box);
  }

  // ================= ÜBERSICHT =================
  function uebersicht(box) {
    const s = D.seite, a = D.anmeldungen || {};
    const meine = REIHE.filter((f) => (s.fassungen || []).includes(f));
    const fehlen = REIHE.filter((f) => !meine.includes(f) && (D.erlaubt || REIHE).includes(f));
    const wa = (f) => `https://wa.me/?text=${encodeURIComponent('Schau mal, das habe ich für dich: ' + oeffentlich(s.adresse, f))}`;
    box.innerHTML = `${u.kopf('Meine Seiten', '', `<a class="knopf zweit" href="#seiten/bearbeiten">Angaben ändern</a>`)}
      <section class="ms-stand">
        <div class="ms-wer">${fotoHtml(s)}<div><b>${esc(name(s))}</b><span>${esc(s.rolle || 'Ohne Rolle')}</span></div></div>
        <dl><div><dt>Anmeldungen</dt><dd data-zahl="${Number(a.gesamt) || 0}">${Number(a.gesamt) || 0}</dd></div>
          <div><dt>Neu, 7 Tage</dt><dd>${Number(a.woche) || 0}</dd></div>
          <div><dt>Paket</dt><dd class="klein">${D.gebucht_bis ? `bis ${datum(D.gebucht_bis)}` : 'gebucht'}</dd></div></dl>
      </section>
      <div class="ms-reihen">${meine.map((f, i) => `<section class="ms-reihe">
          <div class="ms-mini">${handy(u.vorschau ? rahmenAdresse(f) : hier(s.adresse, f), `${FASSUNG[f].name}: so sieht sie aus`, '')}</div>
          <div class="text">
            <span class="zahl-gross" aria-hidden="true">0${i + 1}</span>
            <p class="kicker">${esc(FASSUNG[f].fuer)}</p><h2>${esc(FASSUNG[f].titel)}</h2>
            <div class="linkfeld"><code>${esc(oeffentlich(s.adresse, f))}</code><button class="knopf still" type="button" data-kopie="${esc(oeffentlich(s.adresse, f))}">${ico('kopie')} Link kopieren</button></div>
            <div class="knoepfe"><a class="knopf" href="${esc(hier(s.adresse, f))}" target="_blank" rel="noopener">${ico('auge')} Vorschau</a>
              <a class="knopf zweit" href="${esc(wa(f))}" target="_blank" rel="noopener">${ico('whatsapp')} Per WhatsApp teilen</a></div>
            <div class="ms-ebook"><span>${ico('laden')}<b>E-Book zu dieser Seite</b></span>
              <button class="knopf still" type="button" data-kopie="${esc(ebook(s.adresse, f))}" data-hinweis="E-Book-Link kopiert.">${ico('kopie')} Link kopieren</button>
              <a class="knopf still" href="${esc(u.vorschau ? `/p/vorschau/ebook-${f}.pdf` : ebook(s.adresse, f))}" target="_blank" rel="noopener">Öffnen</a></div>
            <p class="nebenbei">${Number(a[f]) === 1 ? '1 Anmeldung' : `${Number(a[f]) || 0} Anmeldungen`} über diese Seite.</p>
          </div></section>`).join('')}</div>
      <section class="abschnitt" id="anfragen"><div class="abschnitt-kopf"><h2>Deine Anfragen</h2></div>
        ${D.leads_bei === 'partner'
          ? `<p class="leise" style="margin-bottom:var(--s-3)">Du kümmerst dich selbst um alle, die sich über deine Seiten eintragen. Melde dich am besten noch am selben Tag.</p>
            <div class="ms-bot" id="ms-bot"></div><div id="ms-anfragen"><p class="laden">Einen Moment …</p></div>`
          : `<p class="hinweis">Daniel und Jasmin melden sich bei allen, die sich über deine Seiten eintragen. Oben siehst du, wie viele es sind.</p>`}
      </section>
      ${fehlen.length ? `<section class="abschnitt"><div class="abschnitt-kopf"><h2>Weitere Fassungen</h2></div>
        <div class="ms-mehr">${fehlen.map((f) => `<a href="#seiten/bearbeiten"><span><b>${esc(FASSUNG[f].name)}</b><small>${esc(FASSUNG[f].fuer)}</small></span>${ico('plus')}</a>`).join('')}</div></section>` : ''}
      <section class="abschnitt"><div class="abschnitt-kopf"><h2>Gut zu wissen</h2></div>
        <ul class="ms-hinweise">
          <li>Jede Anfrage über deine Seiten bleibt für immer bei dir, auch wenn jemand erst später kauft.</li>
          <li>${s.kontakt_zeigen ? 'Deine Telefonnummer und E-Mail stehen auf deinen Seiten und im E-Book.' : 'Deine Telefonnummer und E-Mail stehen nicht auf deinen Seiten. Wir nutzen sie nur für Anfragen an dich.'}</li>
          <li>Änderst du die Adresse, führen alte Links weiter zu deiner Seite.</li>
        </ul></section>`;
    box.querySelectorAll('[data-kopie]').forEach((b) => (b.onclick = () => u.kopieren(b.dataset.kopie, b.dataset.hinweis || 'Link kopiert.')));
    // In der Vorschau zeigen die kleinen Rahmen die gespeicherten Angaben (es gibt keine echte Seite)
    if (u.vorschau) box.querySelectorAll('.ms-mini iframe').forEach((f) => { const fa = (f.src.match(/\/p\/(\w+)\.html/) || [])[1]; vorschauVerbinden(f, () => seitenAngaben(s, fa)); });
    if (D.leads_bei === 'partner') { anfragenZeigen(box.querySelector('#ms-anfragen')); botZeigen(box.querySelector('#ms-bot')); }
  }

  // Anfragen-Bot: eigener Telegram-Bot nur für Anfragen, getrennt vom Assistenten. Ein Klick verbindet ihn.
  async function botZeigen(ziel) {
    const r = await rpc('uk_partner_anfragenbot');
    const b = r.error ? null : r.data;
    if (!ziel.isConnected || !b || !b.moeglich) { ziel.remove(); return; }
    const symbol = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4.5 3.5 11.3c-.8.3-.8 1.4 0 1.7l4.3 1.5 1.6 5c.2.7 1.1.9 1.6.4l2.4-2.3 4.4 3.2c.6.4 1.4.1 1.6-.6L22 5.6c.2-.8-.5-1.4-1-1.1z"/><path d="M8 14.5 18 7.5"/></svg>';
    if (!b.bereit) {
      ziel.innerHTML = `<div class="ms-bot-symbol">${symbol}</div><div><b>Anfragen aufs Handy</b><p>Dein Telegram-Bot für Anfragen wird gerade eingerichtet. Der Knopf zum Verbinden erscheint hier in Kürze.</p></div>`;
      return;
    }
    if (b.verbunden) {
      ziel.innerHTML = `<div class="ms-bot-symbol an">${symbol}</div><div><b>Anfragen kommen aufs Handy</b>
        <p>Jede neue Anfrage schickt dir dein Anfragen-Bot sofort in Telegram, mit Telefon und E-Mail. Getrennt von deinem Assistenten.</p>
        <div class="knoepfe"><span class="verbunden">Verbunden</span><button class="knopf still" type="button" data-bot-weg>Trennen</button></div></div>`;
      ziel.querySelector('[data-bot-weg]').onclick = async () => {
        if (!confirm('Anfragen nicht mehr aufs Handy schicken?')) return;
        const x = await rpc('uk_partner_anfragenbot_trennen');
        if (x.error || !x.data) return u.toast('Das hat nicht geklappt. Bitte versuch es noch einmal.');
        u.toast('Getrennt. Deine Anfragen findest du weiter hier.'); botZeigen(ziel);
      };
      return;
    }
    ziel.innerHTML = `<div class="ms-bot-symbol">${symbol}</div><div><b>Anfragen sofort aufs Handy</b>
      <p>Mit einem Klick bekommst du jede neue Anfrage als Nachricht in Telegram, mit Telefon, E-Mail und einem Knopf für WhatsApp. Das ist ein eigener Bot nur für Anfragen, getrennt von deinem Assistenten.</p>
      <div class="knoepfe"><a class="knopf" href="${esc(b.link)}" target="_blank" rel="noopener" data-bot-an>${symbol} Telegram verbinden</a></div>
      <p class="klein leise">Telegram öffnet sich. Dort tippst du auf "Starten", mehr ist es nicht.</p></div>`;
    // Zurück im Portal: nachsehen, ob die Verbindung steht
    ziel.querySelector('[data-bot-an]').addEventListener('click', () => {
      if (u.vorschau) Vorschau.botVerbinden();
      const wieder = () => { if (document.visibilityState !== 'visible') return; removeEventListener('visibilitychange', wieder); setTimeout(() => botZeigen(ziel), 600); };
      addEventListener('visibilitychange', wieder);
      if (u.vorschau) setTimeout(() => botZeigen(ziel), 1200);
    });
  }

  // Anfragen mit Kontakt, nur für Partner, die sich selbst kümmern (uk_partner.leads_bei = 'partner')
  const STUFE_TEXT = { heiss: 'Will jetzt ein Gerät', warm: 'In den nächsten Monaten', kalt: 'Hat das E-Book geholt' };
  async function anfragenZeigen(ziel) {
    const r = await rpc('uk_partner_seiten_anfragen');
    const liste = r.error ? null : r.data || [];
    if (!liste) { ziel.innerHTML = '<p class="meldung">Die Anfragen ließen sich gerade nicht laden. Bitte lade die Seite neu.</p>'; return; }
    if (!liste.length) { ziel.innerHTML = '<p class="leer">Noch keine Anfragen. Sobald sich jemand einträgt, steht er hier.</p>'; return; }
    const tel = (x) => String(x || '').replace(/[^\d+]/g, '');
    const wa = (x) => { let n = tel(x).replace(/^00/, '').replace(/^\+/, ''); if (n.startsWith('0')) n = '49' + n.slice(1); return 'https://wa.me/' + n; };
    ziel.innerHTML = `<div class="ms-anfragen">${liste.map((a) => `<article class="ms-anfrage ${esc(a.stufe)}">
        <div class="kopf"><b>${esc(name(a))}</b><span class="marke-stufe">${esc(STUFE_TEXT[a.stufe] || '')}</span></div>
        <p class="leise klein">${esc(datum(a.datum))}${a.ort ? ', ' + esc(a.ort) : ''} · über deine Seite ${esc(FASSUNG[a.fassung]?.name || '')}</p>
        ${a.interesse || a.trinkt ? `<p class="klein">${[a.interesse, a.trinkt && 'trinkt heute: ' + a.trinkt].filter(Boolean).map(esc).join(' · ')}</p>` : ''}
        ${a.erreichbar ? `<p class="klein">Erreichbar: ${esc(a.erreichbar)}</p>` : ''}
        <div class="knoepfe">${a.telefon ? `<a class="knopf zweit" href="tel:${esc(tel(a.telefon))}">${ico('telefon')} Anrufen</a><a class="knopf zweit" href="${esc(wa(a.telefon))}" target="_blank" rel="noopener">${ico('whatsapp')} WhatsApp</a>` : ''}
          ${a.email ? `<a class="knopf still" href="mailto:${esc(a.email)}">${ico('mail')} ${esc(a.email)}</a>` : ''}</div>
      </article>`).join('')}</div>`;
  }
  const fotoHtml = (s, gross) => `<span class="ms-foto${gross ? ' gross' : ''}">${s.foto ? `<img src="${esc(s.foto)}" alt="">` : `<span>${esc(`${t(s.vorname)[0] || ''}${t(s.nachname)[0] || ''}`.toUpperCase())}</span>`}</span>`;
  // Angaben so, wie die öffentliche Funktion sie der Seite gibt
  const seitenAngaben = (s, fassung) => ({
    aussehen: (s.aussehen || {})[fassung] || null,
    von: u.p.kurz, adresse: s.adresse, vorname: s.vorname, nachname: s.nachname, rolle: s.rolle, satz: s.satz, insta: s.insta, foto: s.foto,
    telefon: s.kontakt_zeigen ? s.lead_telefon : null, email: s.kontakt_zeigen ? s.lead_email : null, leads_bei: D.leads_bei,
  });

  // ================= FORMULAR =================
  function formular(box) {
    const neu = !D.seite;
    // Neu: alle erlaubten Fassungen vorausgewählt, Kontakt für Anfragen aus dem Partnerkonto
    const s = D.seite || { ...D.vorgabe, adresse: D.vorschlag, lead_email: D.vorgabe?.email, lead_telefon: D.vorgabe?.telefon, fassungen: [...(D.erlaubt || REIHE)], kontakt_zeigen: false };
    let foto = { url: s.foto || null, blob: null, weg: false };
    const aussehen = { ...(s.aussehen || {}) }; // { sport: { modus, akzent }, ... }, fehlt eine Fassung: Vorschlag aus farben.js
    let adresseAngefasst = !neu;
    const erlaubt = D.erlaubt || REIHE;
    const vorne = REIHE.find((f) => (s.fassungen || []).includes(f)) || 'neutral';
    box.innerHTML = `${neu ? '' : `<a class="zurueck" href="#seiten">${u.ico('links')} Zurück zu Meine Seiten</a>`}
      ${u.kopf(neu ? 'Deine Seiten einrichten' : 'Angaben ändern', neu ? 'Einmal ausfüllen, dann stehen deine Seiten bereit. Rechts siehst du sofort, wie es aussieht.' : 'Änderungen erscheinen sofort auf allen deinen Seiten und im E-Book.')}
      <div class="ms-aufbau">
        <form id="ms-form" class="ms-form" novalidate>
          <section><p class="kicker">01 · Das sieht dein Besucher</p>
            <div class="ms-fotowahl">
              <div class="ms-fotofeld" id="ms-fotofeld"></div>
              <div><h3>Dein Foto</h3><p class="leise klein">Am besten ein helles Porträt, Gesicht gut zu sehen. Du wählst danach den Ausschnitt.</p>
                <div class="knoepfe"><label class="knopf zweit ms-datei">${ico('plus')} Foto wählen<input type="file" accept="image/jpeg,image/png,image/webp,image/heic" id="ms-datei"></label>
                <button class="knopf still" type="button" id="ms-foto-weg" hidden>Foto entfernen</button></div></div>
            </div>
            <div class="felder zwei">
              <label class="feld"><span class="titel">Vorname <span class="pflicht">*</span></span><input name="vorname" value="${esc(s.vorname)}" autocomplete="given-name" maxlength="60" required></label>
              <label class="feld"><span class="titel">Nachname <span class="pflicht">*</span></span><input name="nachname" value="${esc(s.nachname)}" autocomplete="family-name" maxlength="60" required></label>
              <label class="feld ganz"><span class="titel">Was du machst</span><input name="rolle" value="${esc(s.rolle)}" maxlength="60" placeholder="z. B. Wasserberaterin, Personal Trainer, Heilpraktiker"><small class="regel">Steht unter deinem Namen. Freiwillig.</small></label>
              <label class="feld ganz"><span class="titel">Eine Zeile über dich</span><input name="satz" value="${esc(s.satz)}" maxlength="160" placeholder="z. B. Ich trinke dieses Wasser seit drei Jahren und zeige es dir gern."><small class="regel"><span id="ms-zaehler">0</span> von 160 Zeichen. Freiwillig.</small></label>
              <label class="feld ganz"><span class="titel">Instagram</span><input name="insta" value="${esc(s.insta ? '@' + s.insta : '')}" maxlength="80" placeholder="@deinname" autocapitalize="off" spellcheck="false"><small class="regel">Freiwillig. Erscheint als Link auf deiner Seite.</small></label>
            </div></section>

          <section><p class="kicker">02 · Für Anfragen an dich</p>
            <p class="leise">Hierüber erreichen wir dich, wenn sich jemand auf deiner Seite einträgt. Auf der Seite steht es nur, wenn du unten den Haken setzt.</p>
            <div class="felder zwei">
              <label class="feld"><span class="titel">Telefon <span class="pflicht">*</span></span><input type="tel" name="lead_telefon" value="${esc(s.lead_telefon)}" autocomplete="tel" maxlength="40" required></label>
              <label class="feld"><span class="titel">E-Mail <span class="pflicht">*</span></span><input type="email" name="lead_email" value="${esc(s.lead_email)}" autocomplete="email" maxlength="160" required></label>
            </div>
            <label class="haken ms-haken"><input type="checkbox" name="kontakt_zeigen" ${s.kontakt_zeigen ? 'checked' : ''}><span><b>Telefon und E-Mail auf meinen Seiten und im E-Book zeigen</b><small>Dann gibt es Knöpfe zum Anrufen, für WhatsApp und E-Mail. Ohne Haken sieht niemand deine Nummer.</small></span></label></section>

          <section><p class="kicker">03 · Deine Fassungen</p>
            <p class="leise">Wähl eine, zwei oder alle drei. Für jede bekommst du einen eigenen Link und ein eigenes E-Book.</p>
            <div class="ms-wahl">${REIHE.map((f) => `<label class="haken${erlaubt.includes(f) ? '' : ' aus'}"><input type="checkbox" name="fassungen" value="${f}" ${(s.fassungen || []).includes(f) ? 'checked' : ''} ${erlaubt.includes(f) ? '' : 'disabled'}>
              <span><b>${esc(FASSUNG[f].name)}</b><small class="fuer">${esc(FASSUNG[f].fuer)}</small><small>${esc(erlaubt.includes(f) ? FASSUNG[f].text : 'In deinem Paket nicht enthalten.')}</small></span></label>`).join('')}</div></section>

          <section><p class="kicker">04 · Deine Adresse</p>
            <label class="feld"><span class="titel">So beginnt dein Link</span>
              <div class="ms-adresse"><span>${esc(D.basis.replace(/^https?:\/\//, ''))}/p/</span><input name="adresse" value="${esc(s.adresse)}" maxlength="40" autocapitalize="off" spellcheck="false" required></div>
              <small class="regel" id="ms-adresse-stand"></small></label>
            <p class="leise klein" id="ms-beispiel"></p></section>

          <p class="meldung" id="ms-meldung" role="alert"></p>
          <div class="knoepfe"><button class="knopf" type="submit">${neu ? 'Seiten erstellen' : 'Speichern'}</button>${neu ? '' : '<a class="knopf still" href="#seiten">Abbrechen</a>'}</div>
        </form>

        <figure class="ms-live" aria-label="Vorschau deiner Seite">
          <div class="umschalter" role="group" aria-label="Fassung in der Vorschau">${REIHE.map((f) => `<button type="button" data-live="${f}" aria-pressed="${f === vorne}">${FASSUNG[f].name}</button>`).join('')}</div>
          <div class="ms-handy gross"><div class="ms-schirm"><iframe id="ms-rahmen" title="Vorschau deiner Seite" src="${rahmenAdresse(vorne)}"></iframe></div></div>
          <div class="ms-look" id="ms-look" aria-label="Aussehen"></div>
          <figcaption>Die Vorschau läuft beim Tippen mit. Formulare darin senden nichts.</figcaption>
        </figure>
      </div>`;

    const f = box.querySelector('#ms-form'), m = box.querySelector('#ms-meldung');
    const werte = () => {
      const w = Object.fromEntries([...new FormData(f).entries()].filter(([k]) => k !== 'fassungen'));
      for (const k of Object.keys(w)) w[k] = t(w[k]);
      w.fassungen = [...f.querySelectorAll('[name=fassungen]:checked')].map((x) => x.value);
      w.kontakt_zeigen = f.kontakt_zeigen.checked;
      w.insta = w.insta.replace(/^\s*(https?:\/\/)?(www\.)?(instagram\.com\/)?@?/i, '').replace(/[/?].*$/, '');
      w.adresse = w.adresse.toLowerCase();
      w.aussehen = aussehen;
      return w;
    };
    // Live-Vorschau
    const rahmen = box.querySelector('#ms-rahmen');
    let live = vorne;
    const angaben = () => { const w = werte(); return seitenAngaben({ ...w, foto: foto.weg ? null : foto.url }, live); };
    const senden = vorschauVerbinden(rahmen, angaben);
    box.querySelectorAll('[data-live]').forEach((b) => (b.onclick = () => {
      box.querySelectorAll('[data-live]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      live = b.dataset.live;
      rahmen.src = rahmenAdresse(live);
      lookZeigen();
    }));
    // Aussehen je Fassung: Hell oder Dunkel und ein Akzent (Farben aus farben.js, dieselben wie später im Flyer-Editor)
    const F = window.UKFarben;
    const look = box.querySelector('#ms-look');
    function lookZeigen() {
      if (!F) { look.remove(); return; }
      const jetzt = F.pruefen(aussehen[live], live), std = F.STANDARD[live];
      look.innerHTML = `<p class="kicker">Aussehen deiner Seite ${esc(FASSUNG[live].name)}</p>
        <div class="umschalter ms-modus" role="group" aria-label="Grundton">${Object.entries(F.MODI).map(([k, m]) => `<button type="button" data-modus="${k}" aria-pressed="${k === jetzt.modus}"><i style="background:${m.muster}"></i>${esc(m.name)}</button>`).join('')}</div>
        <div class="ms-akzente" role="radiogroup" aria-label="Akzentfarbe">${Object.entries(F.AKZENTE).map(([k, a]) => `<button type="button" role="radio" data-akzent="${k}" aria-checked="${k === jetzt.akzent}" title="${esc(a.name)}"><i style="background:${a.knopf}"></i><span>${esc(a.name)}</span></button>`).join('')}</div>
        <button class="knopf still ms-standard" type="button" data-standard ${aussehen[live] ? '' : 'hidden'}>Zurück zum Vorschlag (${esc(F.MODI[std.modus].name)}, ${esc(F.AKZENTE[std.akzent].name)})</button>`;
      look.querySelectorAll('[data-modus]').forEach((b) => (b.onclick = () => waehlen({ modus: b.dataset.modus })));
      look.querySelectorAll('[data-akzent]').forEach((b) => (b.onclick = () => waehlen({ akzent: b.dataset.akzent })));
      look.querySelector('[data-standard]').onclick = () => { delete aussehen[live]; lookZeigen(); senden(); };
    }
    function waehlen(neu) {
      aussehen[live] = { ...F.pruefen(aussehen[live], live), ...neu };
      lookZeigen(); senden();
    }
    lookZeigen();
    // Foto
    const fotoFeld = box.querySelector('#ms-fotofeld'), weg = box.querySelector('#ms-foto-weg');
    const fotoZeigen = () => {
      const w = werte(), url = foto.weg ? null : foto.url;
      fotoFeld.innerHTML = url ? `<img src="${esc(url)}" alt="Dein Foto">` : `<span>${esc(`${w.vorname[0] || ''}${w.nachname[0] || ''}`.toUpperCase() || '?')}</span>`;
      weg.hidden = !url;
    };
    box.querySelector('#ms-datei').onchange = async (e) => {
      const datei = e.target.files[0]; e.target.value = '';
      if (!datei) return;
      const ergebnis = await zuschneiden(datei).catch((err) => { console.warn(err); u.toast('Dieses Foto lässt sich nicht öffnen. Versuch es mit einem JPEG oder PNG.'); return null; });
      if (!ergebnis) return;
      if (foto.blob && foto.url?.startsWith('blob:')) URL.revokeObjectURL(foto.url);
      foto = { url: URL.createObjectURL(ergebnis), blob: ergebnis, weg: false };
      fotoZeigen(); senden();
    };
    weg.onclick = () => { foto = { url: null, blob: null, weg: true }; fotoZeigen(); senden(); };
    // Adresse: Vorschlag aus dem Namen, solange sie keiner angefasst hat. Prüfung mit kurzer Pause.
    const stand = box.querySelector('#ms-adresse-stand'), beispiel = box.querySelector('#ms-beispiel');
    const STAND = { ok: ['Frei. Die Adresse gehört dir.', 'gut'], form: ['Nur kleine Buchstaben a bis z, Ziffern und Bindestrich, 3 bis 40 Zeichen.', ''],
      vergeben: ['Diese Adresse ist schon vergeben. Hänge zum Beispiel deinen Ort an.', ''], reserviert: ['Dieses Wort ist reserviert. Bitte nimm eine andere Adresse.', ''] };
    let pruefNr = 0, pruefZeit = 0, adresseOk = !neu;
    const adressePruefen = () => {
      clearTimeout(pruefZeit);
      const a = werte().adresse, nr = ++pruefNr;
      const f1 = REIHE.find((x) => werte().fassungen.includes(x)) || 'sport';
      beispiel.textContent = a ? `Zum Beispiel: ${D.basis.replace(/^https?:\/\//, '')}/p/${a}/${f1}` : '';
      if (D.seite && a === D.seite.adresse) { stand.className = 'regel gut'; stand.textContent = 'Deine aktuelle Adresse.'; adresseOk = true; return; }
      stand.className = 'regel'; stand.textContent = 'Wird geprüft …'; adresseOk = false;
      pruefZeit = setTimeout(async () => {
        const r = await rpc('uk_partner_seiten_adresse', { p_adresse: a });
        if (nr !== pruefNr) return;
        const [text, art] = STAND[r.data] || ['Das hat gerade nicht geklappt. Wir prüfen beim Speichern noch einmal.', ''];
        stand.className = 'regel ' + (art || 'schlecht'); stand.textContent = text; adresseOk = r.data === 'ok';
      }, 350);
    };
    const vorschlag = () => {
      const w = werte();
      return `${w.vorname}-${w.nachname}`.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_.]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    };
    f.adresse.addEventListener('input', () => {
      adresseAngefasst = true;
      const pos = f.adresse.selectionStart;
      f.adresse.value = f.adresse.value.toLowerCase().replace(/\s+/g, '-');
      f.adresse.setSelectionRange(pos, pos);
    });
    const zaehler = box.querySelector('#ms-zaehler');
    f.addEventListener('input', (e) => {
      if (!adresseAngefasst && (e.target.name === 'vorname' || e.target.name === 'nachname')) f.adresse.value = vorschlag();
      if (['adresse', 'vorname', 'nachname'].includes(e.target.name) || e.target.name === 'fassungen') adressePruefen();
      if (e.target.name === 'vorname' || e.target.name === 'nachname') fotoZeigen();
      zaehler.textContent = f.satz.value.length;
      senden();
    });
    f.addEventListener('change', (e) => { if (e.target.name === 'fassungen' || e.target.name === 'kontakt_zeigen') { senden(); adressePruefen(); } });
    zaehler.textContent = f.satz.value.length;
    fotoZeigen(); adressePruefen();

    const FEHLER = {
      nicht_gebucht: 'Dein Paket ist gerade nicht gebucht. Schreib uns kurz, dann klären wir das.',
      name: 'Bitte gib deinen Vor- und Nachnamen an.', fassungen: 'Bitte wähl mindestens eine Fassung.',
      telefon: 'Bitte prüf deine Telefonnummer.', email: 'Bitte prüf deine E-Mail-Adresse.', insta: 'Der Instagram-Name darf nur Buchstaben, Ziffern, Punkt und Unterstrich enthalten.',
      adresse_form: STAND.form[0], adresse_vergeben: STAND.vergeben[0], adresse_reserviert: STAND.reserviert[0],
    };
    f.onsubmit = async (e) => {
      e.preventDefault();
      const w = werte(); m.className = 'meldung'; m.textContent = '';
      if (!w.vorname || !w.nachname) return (m.textContent = FEHLER.name);
      if (w.lead_telefon.replace(/\D/g, '').length < 6) return (m.textContent = FEHLER.telefon);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.lead_email)) return (m.textContent = FEHLER.email);
      if (w.insta && !/^[A-Za-z0-9._]{1,30}$/.test(w.insta)) return (m.textContent = FEHLER.insta);
      if (!w.fassungen.length) return (m.textContent = FEHLER.fassungen);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(w.adresse) || w.adresse.length < 3) return (m.textContent = FEHLER.adresse_form);
      const k = f.querySelector('[type=submit]'); k.disabled = true;
      try {
        const r = await rpc('uk_partner_seiten_speichern', { p: w });
        if (r.error || !r.data) throw r.error || new Error('leer');
        if (r.data.fehler) { m.textContent = FEHLER[r.data.fehler] || 'Das hat nicht geklappt. Bitte prüf deine Angaben.'; return; }
        // Foto erst nach dem Speichern: Die Edge Function braucht die angelegte Seite
        if (foto.blob || (foto.weg && D.seite?.foto)) await fotoSenden(foto.weg ? null : foto.blob);
        u.toast(neu ? 'Deine Seiten sind fertig.' : 'Gespeichert. Deine Seiten zeigen es sofort.');
        if (location.hash === '#seiten') { await zeigen(box, [], u); window.scrollTo(0, 0); } else location.hash = 'seiten';
      } catch (err) {
        console.warn(err);
        m.textContent = 'Das hat nicht geklappt. Bitte versuch es noch einmal.';
      } finally { k.disabled = false; }
    };
  }

  async function fotoSenden(blob) {
    if (u.vorschau) return Vorschau.foto(blob);
    const r = await fetch(`${u.supabase}/functions/v1/partner-foto`, {
      method: blob ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'image/jpeg', apikey: u.schluessel, Authorization: `Bearer ${u.schluessel}`, 'x-sitzung': u.sitzung() },
      body: blob || undefined,
    });
    if (!r.ok) { u.toast('Deine Angaben sind gespeichert, das Foto leider nicht. Versuch es bitte noch einmal.'); throw new Error('foto ' + r.status); }
  }

  // ---------- Foto zuschneiden: Ausschnitt 4 : 5 verschieben und vergrößern ----------
  async function zuschneiden(datei) {
    const bild = await bildLaden(datei);
    return new Promise((fertig) => {
      const d = document.createElement('dialog'); d.className = 'blatt ms-zuschnitt';
      d.innerHTML = `<div class="blatt-innen"><div class="blatt-kopf"><h2>Ausschnitt wählen</h2><button class="knopf still" type="button" data-zu aria-label="Schließen">${ico('zu')}</button></div>
        <p class="leise klein">Zieh das Foto an die richtige Stelle. Mit dem Regler vergrößerst du es.</p>
        <div class="ms-zuschnitt-feld"><canvas width="480" height="600"></canvas><i class="ms-kreis" aria-hidden="true"></i></div>
        <label class="feld"><span class="titel">Größe</span><input type="range" min="1" max="3" step="0.01" value="1"></label>
        <div class="knoepfe"><button class="knopf" type="button" data-ok>Übernehmen</button><button class="knopf still" type="button" data-zu>Abbrechen</button></div></div>`;
      document.body.append(d);
      const c = d.querySelector('canvas'), g = c.getContext('2d'), regler = d.querySelector('[type=range]');
      const W = c.width, H = c.height, basis = Math.max(W / bild.width, H / bild.height);
      let z = 1, x = 0, y = 0; // Verschiebung in Bildpunkten der Leinwand, 0 = mittig
      const grenzen = () => {
        const bw = bild.width * basis * z, bh = bild.height * basis * z;
        x = Math.min((bw - W) / 2, Math.max(-(bw - W) / 2, x)); y = Math.min((bh - H) / 2, Math.max(-(bh - H) / 2, y));
      };
      const malen = (ziel = g, faktor = 1) => {
        grenzen();
        const bw = bild.width * basis * z * faktor, bh = bild.height * basis * z * faktor;
        ziel.fillStyle = '#FBF9F4'; ziel.fillRect(0, 0, W * faktor, H * faktor);
        ziel.drawImage(bild, (W * faktor - bw) / 2 + x * faktor, (H * faktor - bh) / 2 + y * faktor, bw, bh);
      };
      malen();
      let zug = null;
      c.addEventListener('pointerdown', (e) => { zug = { x: e.clientX, y: e.clientY, x0: x, y0: y, s: W / c.getBoundingClientRect().width }; c.setPointerCapture(e.pointerId); });
      c.addEventListener('pointermove', (e) => { if (!zug) return; x = zug.x0 + (e.clientX - zug.x) * zug.s; y = zug.y0 + (e.clientY - zug.y) * zug.s; malen(); });
      c.addEventListener('pointerup', () => (zug = null)); c.addEventListener('pointercancel', () => (zug = null));
      c.addEventListener('wheel', (e) => { e.preventDefault(); regler.value = Math.min(3, Math.max(1, z - e.deltaY / 600)); regler.oninput(); }, { passive: false });
      regler.oninput = () => { z = Number(regler.value); malen(); };
      // Tastatur: Pfeile verschieben, Plus und Minus vergrößern
      c.tabIndex = 0;
      c.addEventListener('keydown', (e) => {
        const s = 16, k = { ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] }[e.key];
        if (k) { e.preventDefault(); x += k[0]; y += k[1]; malen(); }
        if (e.key === '+' || e.key === '-') { regler.value = Math.min(3, Math.max(1, z + (e.key === '+' ? 0.1 : -0.1))); regler.oninput(); }
      });
      const zu = (ergebnis) => { d.close(); d.remove(); fertig(ergebnis); };
      d.querySelectorAll('[data-zu]').forEach((b) => (b.onclick = () => zu(null)));
      d.addEventListener('cancel', () => zu(null));
      d.querySelector('[data-ok]').onclick = () => {
        // Ergebnis: 900 x 1125 Pixel, JPEG. Reicht für Seite und E-Book, bleibt unter 300 KB.
        const aus = document.createElement('canvas'); aus.width = 900; aus.height = 1125;
        malen(aus.getContext('2d'), 900 / W);
        aus.toBlob((b) => zu(b), 'image/jpeg', 0.86);
      };
      d.showModal();
    });
  }
  async function bildLaden(datei) {
    if ('createImageBitmap' in window) { try { return await createImageBitmap(datei, { imageOrientation: 'from-image' }); } catch {} }
    return new Promise((ok, f) => { const i = new Image(); i.onload = () => ok(i); i.onerror = f; i.src = URL.createObjectURL(datei); });
  }

  // ================= VORSCHAU OHNE DATENBANK =================
  // Wie quelle-vorschau.js im Backoffice: alles im Browser. ?stand=gesperrt | leer | fertig wählt den Ausgangspunkt.
  const Vorschau = (() => {
    const q = new URLSearchParams(location.search);
    const stand = q.get('stand') || 'gesperrt';
    const leadsBei = q.get('leads') === 'team' ? 'team' : 'partner';
    const tag = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toLocaleDateString('sv-SE'); };
    const anfragen = [
      { datum: tag(0), vorname: 'Lea', nachname: 'Sommer', telefon: '+49 170 5550101', email: 'lea@example.com', ort: 'Köln', stufe: 'heiss', fassung: 'sport', interesse: 'Training und Regeneration', trinkt: 'Aus Flaschen', erreichbar: 'werktags ab 18 Uhr' },
      { datum: tag(2), vorname: 'Tom', nachname: 'Berger', telefon: '+49 171 5550102', email: 'tom@example.com', ort: 'Bonn', stufe: 'warm', fassung: 'neutral', interesse: 'Besseres Trinkwasser für zu Hause', trinkt: 'Aus dem Hahn' },
      { datum: tag(5), vorname: 'Mia', nachname: null, telefon: null, email: 'mia@example.com', ort: null, stufe: 'kalt', fassung: 'sport' },
    ];
    const beispiele = [
      { adresse: 'daniel-zuercher', fassung: 'neutral', fassungen: ['neutral', 'sport'], vorname: 'Daniel', nachname: 'Zürcher' },
      { adresse: 'jasmin-groth', fassung: 'gesundheit', fassungen: ['gesundheit', 'neutral'], vorname: 'Jasmin', nachname: 'Groth' },
    ];
    const fertig = { adresse: 'anna-beispiel', vorname: 'Anna', nachname: 'Beispiel', rolle: 'Wasserberaterin', satz: 'Ich zeige dir gern, was in deinem Wasser steckt.',
      insta: 'anna.beispiel', foto: null, lead_telefon: '+49 170 1234567', lead_email: 'anna@example.com', kontakt_zeigen: false, fassungen: ['neutral', 'sport'] };
    let gespeichert = null;
    try { gespeichert = JSON.parse(localStorage.getItem(SPEICHER) || 'null'); } catch {}
    if (!gespeichert || gespeichert.stand !== stand) gespeichert = { stand, seite: stand === 'fertig' ? fertig : null };
    const merken = () => { try { const x = { ...gespeichert, seite: gespeichert.seite && { ...gespeichert.seite, foto: gespeichert.seite.foto?.startsWith('data:') ? gespeichert.seite.foto : null } }; localStorage.setItem(SPEICHER, JSON.stringify(x)); } catch {} };
    const warten = () => new Promise((r) => setTimeout(r, 180));
    return {
      async rpc(name, args) {
        await warten();
        if (name === 'uk_partner_seiten_daten') return { data: {
          basis: 'https://mein.ursprungskraft.net', leads_bei: leadsBei, gebucht: stand !== 'gesperrt', gebucht_bis: stand === 'gesperrt' ? null : '2026-12-11',
          erlaubt: REIHE, vorschlag: 'anna-beispiel', vorgabe: { vorname: 'Anna', nachname: 'Beispiel', email: 'anna@example.com', telefon: '+49 170 1234567' },
          seite: gespeichert.seite, beispiele, anmeldungen: gespeichert.seite ? { gesamt: 14, woche: 3, neutral: 5, sport: 9, gesundheit: 0 } : { gesamt: 0, woche: 0 } } };
        if (name === 'uk_partner_seiten_adresse') {
          const a = args.p_adresse;
          return { data: !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a) || a.length < 3 || a.length > 40 ? 'form'
            : ['neutral', 'sport', 'gesundheit', 'e-book', 'vorschau'].includes(a) ? 'reserviert'
            : ['daniel-zuercher', 'jasmin-groth', 'max-muster'].includes(a) ? 'vergeben' : 'ok' };
        }
        if (name === 'uk_partner_seiten_speichern') {
          const p = args.p, frei = (await this.rpc('uk_partner_seiten_adresse', { p_adresse: p.adresse })).data;
          if (frei !== 'ok' && p.adresse !== gespeichert.seite?.adresse) return { data: { fehler: 'adresse_' + frei } };
          gespeichert.seite = { ...(gespeichert.seite || {}), ...p, foto: gespeichert.seite?.foto || null };
          merken();
          return { data: { ok: true, adresse: p.adresse } };
        }
        if (name === 'uk_partner_seiten_anfragen') return { data: leadsBei === 'partner' && gespeichert.seite ? anfragen : [] };
        if (name === 'uk_partner_anfragenbot') return { data: leadsBei !== 'partner' ? { moeglich: false }
          : { moeglich: true, bereit: true, bot: 'beispiel_anfragen_bot', verbunden: !!gespeichert.bot, link: 'https://t.me/beispiel_anfragen_bot?start=vorschau' } };
        if (name === 'uk_partner_anfragenbot_trennen') { gespeichert.bot = false; merken(); return { data: true }; }
        return { error: new Error('Vorschau kennt ' + name + ' nicht') };
      },
      // Vorschau: so tun, als hätte der Partner in Telegram auf "Starten" getippt
      botVerbinden() { gespeichert.bot = true; merken(); },
      // Das Foto bleibt als Daten-Adresse im Browser, damit es auch nach dem Neuladen noch da ist
      async foto(blob) {
        gespeichert.seite.foto = blob ? await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob); }) : null;
        merken();
      },
    };
  })();

  return { zeigen, FASSUNG };
})();

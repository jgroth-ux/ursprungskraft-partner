// Datenquelle VORSCHAU: ausgedachte Beispieldaten im Browser, keine echte Anmeldung.
// Für den Echtbetrieb stattdessen quelle-supabase.js einbinden (siehe SCHNITTSTELLE.md).

window.BO_QUELLE = (() => {
  let angemeldet = null;
  const params = new URLSearchParams(location.search);

  function beispiel(kurz) {
    let s = [...kurz].reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const zufall = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const wahl = (a) => a[Math.floor(zufall() * a.length)];
    const vornamen = ['Lukas', 'Anna', 'Jonas', 'Lea', 'Tim', 'Sarah', 'Felix', 'Laura', 'Max', 'Julia', 'Paul', 'Lisa', 'Leon', 'Nina', 'Ben', 'Marie', 'David', 'Sophie', 'Elias', 'Hannah', 'Noah', 'Emma', 'Jan', 'Mia', 'Tobias', 'Lena'];
    const orte = [['Hamburg', 'DE'], ['Berlin', 'DE'], ['München', 'DE'], ['Köln', 'DE'], ['Stuttgart', 'DE'], ['Leipzig', 'DE'], ['Dortmund', 'DE'], ['Wien', 'AT'], ['Graz', 'AT'], ['Zürich', 'CH'], ['Basel', 'CH'], ['Bern', 'CH'], ['Bremen', 'DE'], ['Hannover', 'DE']];
    const anzahl = kurz === 'kevin' ? 64 : 31 + (s % 20);
    const heute = new Date(); heute.setHours(12, 0, 0, 0);
    const liste = [];
    for (let i = 0; i < anzahl; i++) {
      const tageZurueck = Math.floor(Math.pow(zufall(), 1.6) * 84);
      const d = new Date(heute); d.setDate(d.getDate() - tageZurueck);
      const wunsch = zufall() < 0.55 ? 'geraet' : 'ebook';
      let stand = 'ebook';
      if (wunsch === 'geraet') {
        if (tageZurueck <= 1) stand = 'neu';
        else if (tageZurueck <= 6) stand = wahl(['neu', 'kontakt', 'kontakt']);
        else stand = wahl(['kontakt', 'beratung', 'beratung', 'gekauft', 'kein']);
      }
      const [ort, land] = wahl(orte);
      const tag = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      liste.push({ datum: tag, vorname: wahl(vornamen), initial: String.fromCharCode(65 + Math.floor(zufall() * 26)), ort, land, wunsch, stand });
    }
    return liste.sort((a, b) => b.datum.localeCompare(a.datum));
  }

  return {
    vorschau: true,
    // Vorschau-Hilfe: Partner direkt wählen (nur in der Vorschau sichtbar)
    async alsPartner(kurz) { angemeldet = kurz; return { kurz }; },
    async linkArt() { return params.get('ansicht') === 'einladung' ? 'einladung' : params.get('ansicht') === 'passwort' ? 'zuruecksetzen' : null; },
    async sitzung() { return angemeldet ? { kurz: angemeldet } : null; },
    async anmelden() { throw new Error('In der Vorschau gibt es noch keine echte Anmeldung. Wähle unten einen Partner.'); },
    async abmelden() { angemeldet = null; },
    async passwortVergessen() { /* Vorschau: kein Versand */ },
    async passwortSetzen() { throw new Error('In der Vorschau wird kein Passwort gespeichert.'); },
    async anmeldungen() { await new Promise((r) => setTimeout(r, 250)); return beispiel(angemeldet || 'kevin'); },
  };
})();

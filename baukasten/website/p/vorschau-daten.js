// Beispieldaten für die Vorschau ohne Datenbank (wie quelle-vorschau.js im Backoffice). Nur lokal und mit ?demo geladen.
// Die Namen sind ausgedacht, außer Daniel und Jasmin (Beispielseiten im Portal). Fotos fehlen bewusst:
// So sieht man, wie die Seite mit Initialen aussieht, solange ein Partner noch kein Foto hochgeladen hat.
window.SeitenVorschau = (() => {
  const PARTNER = {
    'max-muster': { von: 'max-muster', vorname: 'Max', nachname: 'Muster', rolle: 'Personal Trainer', satz: 'Ich trainiere seit zwölf Jahren. Seit einem Jahr trinke ich nur noch dieses Wasser.', insta: 'max.muster', foto: null, telefon: null, email: null, fassungen: ['neutral', 'sport', 'gesundheit'] },
    'daniel-zuercher': { von: 'daniel', vorname: 'Daniel', nachname: 'Zürcher', rolle: '[FEHLT: Rolle von Daniel]', satz: '', insta: '', foto: null, telefon: '+49 170 0000000', email: 'beispiel@example.com', fassungen: ['neutral', 'sport'] },
    'jasmin-groth': { von: 'jasmin', vorname: 'Jasmin', nachname: 'Groth', rolle: '[FEHLT: Rolle von Jasmin]', satz: '', insta: '', foto: null, telefon: null, email: null, fassungen: ['gesundheit', 'neutral'] },
    'lena-beispiel': { von: 'lena-beispiel', vorname: 'Lena', nachname: 'Beispiel', rolle: 'Heilpraktikerin', satz: 'In meiner Praxis frage ich jeden zuerst: Wie viel trinkst du eigentlich?', insta: '', foto: null, telefon: null, email: null, fassungen: ['gesundheit'] },
  };
  return {
    PARTNER,
    // Wie uk_seite_oeffentlich: andere Fassung, wenn die angefragte fehlt, null, wenn es die Adresse nicht gibt
    seite(adresse, fassung) {
      // Was in der Portal-Vorschau (seiten-vorschau.html) gespeichert wurde, gilt hier auch
      let eigen = null; try { eigen = JSON.parse(localStorage.getItem('uk-seiten-vorschau') || 'null')?.seite; } catch {}
      if (eigen && eigen.adresse === adresse) return { von: 'anna-beispiel', ...eigen, telefon: eigen.kontakt_zeigen ? eigen.lead_telefon : null, email: eigen.kontakt_zeigen ? eigen.lead_email : null, fassung: eigen.fassungen.includes(fassung) ? fassung : eigen.fassungen[0], basis: location.origin };
      const p = PARTNER[adresse]; if (!p) return null;
      return { ...p, adresse, fassung: p.fassungen.includes(fassung) ? fassung : p.fassungen[0], basis: location.origin };
    },
  };
})();

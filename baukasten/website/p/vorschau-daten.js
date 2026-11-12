// Beispieldaten für die Vorschau ohne Datenbank (wie quelle-vorschau.js im Backoffice). Nur lokal und mit ?demo geladen.
// Die Namen sind ausgedacht, außer Daniel und Jasmin (Beispielseiten im Portal).
// leads_bei: 'team' = Daniel und Jasmin melden sich ("Wir melden uns"), 'partner' = der Partner selbst ("Max meldet sich"). Fotos fehlen bewusst:
// So sieht man, wie die Seite mit Initialen aussieht, solange ein Partner noch kein Foto hochgeladen hat.
window.SeitenVorschau = (() => {
  const PARTNER = {
    // haupt: welche Seite unter dem kurzen Link /<adresse> erscheint (bei Max die Sportseite)
    'max-muster': { von: 'max-muster', leads_bei: 'partner', haupt: 'sport', vorname: 'Max', nachname: 'Muster', rolle: 'Personal Trainer', satz: 'Ich trainiere seit zwölf Jahren. Seit einem Jahr trinke ich nur noch dieses Wasser.', insta: 'max.muster', foto: null, telefon: null, email: null, fassungen: ['neutral', 'sport', 'gesundheit'] },
    'daniel-zuercher': { von: 'daniel', leads_bei: 'team', aussehen: { neutral: { modus: 'dunkel', akzent: 'khaki' } }, vorname: 'Daniel', nachname: 'Zürcher', rolle: '[FEHLT: Rolle von Daniel]', satz: '', insta: '', foto: null, telefon: '+49 170 0000000', email: 'beispiel@example.com', fassungen: ['neutral', 'sport'] },
    'jasmin-groth': { von: 'jasmin', leads_bei: 'team', vorname: 'Jasmin', nachname: 'Groth', rolle: '[FEHLT: Rolle von Jasmin]', satz: '', insta: '', foto: null, telefon: null, email: null, fassungen: ['gesundheit', 'neutral'] },
    'lena-beispiel': { von: 'lena-beispiel', leads_bei: 'partner', aussehen: { gesundheit: { modus: 'hell', akzent: 'beere' } }, ebooks: { gesundheit: 'familie' }, vorname: 'Lena', nachname: 'Beispiel', rolle: 'Heilpraktikerin', satz: 'In meiner Praxis frage ich jeden zuerst: Wie viel trinkst du eigentlich?', insta: '', foto: null, telefon: null, email: null, fassungen: ['gesundheit'] },
    // Startseite wasseristmehr.com (start.html), ohne Person
    wasseristmehr: { von: 'wasseristmehr', leads_bei: 'team', marke: true, aussehen: { neutral: { modus: 'hell', akzent: 'oliv', aufbau: 'magazin' } }, vorname: 'Wasser ist mehr', nachname: '', rolle: '', satz: '', insta: '', foto: null, telefon: null, email: null, fassungen: ['neutral'] },
  };
  return {
    PARTNER,
    // Wie uk_seite_oeffentlich: ohne oder mit fehlender Fassung die Hauptseite, null, wenn es die Adresse nicht gibt
    seite(adresse, fassung) {
      // Was in der Portal-Vorschau (seiten-vorschau.html) gespeichert wurde, gilt hier auch
      let eigen = null; try { eigen = JSON.parse(localStorage.getItem('uk-seiten-vorschau') || 'null')?.seite; } catch {}
      const wahl = (q) => { const h = q.fassungen.includes(q.haupt) ? q.haupt : q.fassungen[0]; return { h, f: q.fassungen.includes(fassung) ? fassung : h }; };
      if (eigen && eigen.adresse === adresse) {
        const { h, f } = wahl(eigen);
        return { von: 'anna-beispiel', leads_bei: 'partner', ...eigen, telefon: eigen.kontakt_zeigen ? eigen.lead_telefon : null, email: eigen.kontakt_zeigen ? eigen.lead_email : null, fassung: f, haupt: h, aussehen: eigen.aussehen?.[f] || null, ebook: eigen.ebooks?.[f] || null, basis: location.origin };
      }
      const p = PARTNER[adresse]; if (!p) return null;
      const { h, f } = wahl(p);
      return { ...p, aussehen: p.aussehen?.[f] || null, ebook: p.ebooks?.[f] || null, adresse, fassung: f, haupt: h, basis: location.origin };
    },
  };
})();

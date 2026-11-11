// Datenquelle ECHTBETRIEB über Supabase. Wird vom anderen Claude angebunden und geprüft (siehe SCHNITTSTELLE.md).
// Einbinden in index.html statt quelle-vorschau.js, davor ../vendor/supabase.js.
// Schlüssel sind hier durch XXX ersetzt, wie bei der Landingpage.

window.BO_QUELLE = (() => {
  const SUPABASE_URL = 'https://XXX.supabase.co';
  const SUPABASE_KEY = 'XXX'; // öffentlicher Schlüssel, Schutz über Row Level Security

  // Art des Links aus der Einladungs- oder Passwort-Mail merken, bevor Supabase die Adresse aufräumt
  const hash = new URLSearchParams(location.hash.slice(1));
  const art = hash.get('type');
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } });
  const pruefen = ({ data, error }) => { if (error) throw error; return data; };
  const freundlich = (e) => {
    const m = String(e && e.message || e);
    if (/invalid login/i.test(m)) return new Error('E-Mail oder Passwort stimmen nicht.');
    if (/rate limit/i.test(m)) return new Error('Zu viele Versuche. Bitte warte kurz und versuch es noch einmal.');
    return new Error('Das hat gerade nicht geklappt. Bitte versuch es noch einmal.');
  };

  // Liefert den Partner des angemeldeten Zugangs, zum Beispiel { kurz: 'kevin' }.
  async function profil() {
    const r = pruefen(await sb.rpc('bo_profil'));
    return Array.isArray(r) ? r[0] || null : r;
  }

  return {
    vorschau: false,
    async linkArt() { return art === 'invite' ? 'einladung' : art === 'recovery' ? 'zuruecksetzen' : null; },
    async sitzung() {
      const s = pruefen(await sb.auth.getSession()).session;
      return s ? profil() : null;
    },
    async anmelden(email, passwort) {
      try { pruefen(await sb.auth.signInWithPassword({ email, password: passwort })); } catch (e) { throw freundlich(e); }
      const p = await profil();
      if (!p) { await sb.auth.signOut(); throw new Error('Für diesen Zugang ist noch kein Partner hinterlegt.'); }
      return p;
    },
    async abmelden() { await sb.auth.signOut(); },
    async passwortVergessen(email) {
      try { pruefen(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname })); } catch (e) { throw freundlich(e); }
    },
    async passwortSetzen(passwort) {
      try { pruefen(await sb.auth.updateUser({ password: passwort })); } catch (e) { throw freundlich(e); }
    },
    // Nur die eigenen Anmeldungen, nur diese Felder:
    // datum (YYYY-MM-DD), vorname, initial, ort, land, wunsch, stand. Niemals Telefon oder E-Mail.
    async anmeldungen() { return pruefen(await sb.rpc('bo_anmeldungen')) || []; },
  };
})();

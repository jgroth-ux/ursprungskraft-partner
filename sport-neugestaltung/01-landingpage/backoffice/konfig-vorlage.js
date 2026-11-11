// VORLAGE für eine neue Gruppe (zum Beispiel Heilpraktiker oder Osteopathen).
// Kopieren als konfig-<gruppe>.js, alle [FEHLT: ...] mit echten Inhalten füllen, in index.html einbinden.
// Aufbau wie konfig-sport.js. Nichts erfinden: Was nicht feststeht, bleibt [FEHLT: ...] und wird erfragt.

window.BO_KONFIG = {
  gruppe: '[FEHLT: kurzer Name der Gruppe, zum Beispiel heilpraktiker]',

  texte: {
    seitentitel: 'Backoffice',
    anmeldungEyebrow: 'Backoffice',
    anmeldungTitel: '[FEHLT: Überschrift auf der Anmeldeseite]',
    anmeldungText: 'Melde dich mit der E-Mail-Adresse an, die du von uns bekommen hast.',
    vergessenTitel: 'Passwort vergessen',
    vergessenText: 'Trag deine E-Mail-Adresse ein. Du bekommst einen Link, mit dem du ein neues Passwort setzt.',
    vergessenFertig: 'Wenn die Adresse bei uns hinterlegt ist, ist der Link unterwegs. Schau auch im Spam-Ordner nach.',
    einladungTitel: 'Willkommen im Backoffice',
    einladungText: 'Leg dein Passwort fest. Damit meldest du dich ab jetzt an.',
    neuesPasswortTitel: 'Neues Passwort festlegen',
    neuesPasswortText: 'Wähle ein Passwort mit mindestens 10 Zeichen.',
    gesamt: '[FEHLT: zum Beispiel Anmeldungen über deine Seite]',
    neueWoche: (n) => (n ? `<b>${n} neue</b> in den letzten 7 Tagen` : 'In den letzten 7 Tagen noch keine neuen'),
    verlauf: 'Verlauf',
    seite: 'Deine Seite',
    seiteKnopf: 'Ansehen',
    liste: 'Alle Anmeldungen',
    leer: 'Hier ist noch niemand. Sobald sich jemand über deine Seite einträgt, steht er hier.',
    datenschutz: '[FEHLT: Hinweis, welche Daten der Partner sieht, abgestimmt mit der Datenschutzerklärung]',
    vorschau: 'Vorschau mit Beispieldaten. Die Namen und Zahlen sind ausgedacht.',
  },

  wunsch: { '[FEHLT: Schlüssel]': '[FEHLT: Text]' },
  stand: {
    neu: { text: 'Neu', art: 'neu' },
    '[FEHLT: Schlüssel]': { text: '[FEHLT: Text]' },
  },
  kennzahlen: [
    { text: '[FEHLT]', wenn: { wunsch: '[FEHLT]' } },
    { text: '[FEHLT]', wenn: { wunsch: '[FEHLT]' } },
    { text: '[FEHLT]', wenn: { stand: '[FEHLT]' } },
  ],
  filter: [{ text: 'Alle' }],

  // Ruhigere Farben für diese Gruppe sind möglich, hier nur ein neutraler Platzhalter.
  standardFarben: { akzent: '#8C9A92', knopf: '#5F6E66', aufKnopf: '#FFFFFF', aufDunkel: '#B9C6BE', aufHell: '#4F5C55' },

  partner: {
    // beispiel: { name: '[FEHLT]', rolle: '[FEHLT]', foto: '[FEHLT]', fotoPosition: '50% 20%', seite: '[FEHLT]', farben: {} },
  },
};

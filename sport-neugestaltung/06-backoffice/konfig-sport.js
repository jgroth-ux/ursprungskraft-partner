// Inhalt des Backoffice für die Gruppe "Sportler".
// Für eine neue Gruppe (zum Beispiel Heilpraktiker, Osteopathen) diese Datei kopieren, Texte und Partner anpassen
// und in index.html statt konfig-sport.js einbinden. Aufbau, Gestaltung und Ablauf bleiben gleich.
// Regeln für Texte: Du-Ansprache, keine Gedankenstriche, Prozent als "20 %", "Follower" statt "Fans".

window.BO_KONFIG = {
  gruppe: 'sport',

  texte: {
    seitentitel: 'Backoffice',
    anmeldungEyebrow: 'Backoffice',
    anmeldungTitel: 'Deine Anmeldungen auf einen Blick',
    anmeldungText: 'Melde dich mit der E-Mail-Adresse an, die du von uns bekommen hast.',
    vergessenTitel: 'Passwort vergessen',
    vergessenText: 'Trag deine E-Mail-Adresse ein. Du bekommst einen Link, mit dem du ein neues Passwort setzt.',
    vergessenFertig: 'Wenn die Adresse bei uns hinterlegt ist, ist der Link unterwegs. Schau auch im Spam-Ordner nach.',
    einladungTitel: 'Willkommen im Backoffice',
    einladungText: 'Leg dein Passwort fest. Damit meldest du dich ab jetzt an.',
    neuesPasswortTitel: 'Neues Passwort festlegen',
    neuesPasswortText: 'Wähle ein Passwort mit mindestens 10 Zeichen.',
    gesamt: 'Anmeldungen über deine Seite',
    neueWoche: (n) => (n ? `<b>${n} neue</b> in den letzten 7 Tagen` : 'In den letzten 7 Tagen noch keine neuen'),
    verlauf: 'Verlauf',
    seite: 'Deine Seite',
    seiteKnopf: 'Ansehen',
    liste: 'Alle Anmeldungen',
    leer: 'Hier ist noch niemand. Sobald sich jemand über deine Seite einträgt, steht er hier.',
    datenschutz: 'Telefonnummer und E-Mail sieht nur unser Team, das sich bei den Interessenten meldet. Hier siehst du Vorname, Anfangsbuchstabe und Ort.',
    vorschau: 'Vorschau mit Beispieldaten. Die Namen und Zahlen sind ausgedacht.',
  },

  // Was jemand auf der Landingpage wollte (Feld "wunsch")
  wunsch: { geraet: 'Gerät kennenlernen', ebook: 'E‑Book' },

  // Wie weit das Team ist (Feld "stand"). art: neu, akzent, leise oder leer
  stand: {
    neu: { text: 'Neu', art: 'neu' },
    kontakt: { text: 'Team hat sich gemeldet' },
    beratung: { text: 'In Beratung' },
    gekauft: { text: 'Gerät gekauft', art: 'akzent' },
    kein: { text: 'Kein Interesse', art: 'leer' },
    ebook: { text: 'E‑Book geschickt' },
  },

  // Die drei Zahlenfelder unter dem Verlauf. Das letzte steht in der Akzentfarbe.
  kennzahlen: [
    { text: 'wollen das Gerät kennenlernen', wenn: { wunsch: 'geraet' } },
    { text: 'haben sich das E‑Book geholt', wenn: { wunsch: 'ebook' } },
    { text: 'Geräte gekauft', wenn: { stand: 'gekauft' } },
  ],

  // Filter über der Liste
  filter: [
    { text: 'Alle' },
    { text: 'Gerät', wenn: { wunsch: 'geraet' } },
    { text: 'E‑Book', wenn: { wunsch: 'ebook' } },
    { text: 'Gekauft', wenn: { stand: 'gekauft' } },
  ],

  // Farben, wenn ein Partner keine eigenen hat
  standardFarben: { akzent: '#CF6844', knopf: '#B4512F', aufKnopf: '#FFFFFF', aufDunkel: '#EC9A79', aufHell: '#9C4628' },

  // Partner dieser Gruppe. kurz = derselbe Wert wie in partner.json und im Link der Landingpage.
  partner: {
    kevin: {
      name: 'Kevin Wolter', rolle: 'Bodybuilder',
      foto: '../01-landingpage/bilder/partner/kevin.webp', fotoPosition: '50% 20%',
      seite: 'https://mein.ursprungskraft.net/partner/kevin/',
      farben: { akzent: '#CF6844', knopf: '#B4512F', aufKnopf: '#FFFFFF', aufDunkel: '#EC9A79', aufHell: '#9C4628' },
    },
    johny: {
      name: 'Johny Yusupov', rolle: 'MMA-Fighter',
      foto: '../01-landingpage/bilder/partner/johny.webp', fotoPosition: '50% 15%',
      seite: 'https://mein.ursprungskraft.net/partner/johny/',
      farben: { akzent: '#4261CC', knopf: '#4261CC', aufKnopf: '#FFFFFF', aufDunkel: '#9EAEF2', aufHell: '#3A57BD' },
    },
  },
};

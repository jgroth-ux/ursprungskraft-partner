// Inhalte für den Bereich "Wissen und Schulung" (08.11.2026). Statisch, keine Datenbank.
// Regeln: nur belegte Fakten, keine Heilversprechen, keine Wirkbehauptungen. Keine Warnhinweise zu pH 2,5 und 11,5 (Jasmin, 09.11.2026).
// Quellen: fakten-emguarde.md (emGuarde), Wasser-Guide und Reinigungsanleitung (K8). Was fehlt, steht als [FEHLT: ...].
window.Wissen = {
  unterlagen: [
    { datei: 'wasser-guide', titel: 'Wasser-Guide', text: 'Für Interessenten: was das Gerät macht.' },
    { datei: 'wasser-wegweiser', titel: 'Wegweiser für den Start', text: 'Für Käufer: die Wasserarten im Alltag.' },
    { datei: 'reinigung-anleitung', titel: 'Reinigung des Geräts', text: 'Für Käufer: einmal im Monat reinigen.' },
    { datei: 'detox-programm', titel: 'Detox-Programm', text: 'Vier Wochen Programm von Daniel.' },
  ],

  produkte: [
    {
      id: 'k8', name: 'LeveLuk K8', art: 'Wassermaschine', bild: 'bilder/k8-glas.jpg',
      kern: 'Ein Gerät an deinem Wasserhahn. Fünf Wasserarten zum Trinken, Kochen, Pflegen und Putzen.',
      wasserarten: [
        ['11,5', 'Entfetten, Obst waschen, Haushalt'],
        ['8,5 bis 9,5', 'Trinken, Kochen, Kaffee'],
        ['7,0', 'Neutral, für Babynahrung'],
        ['6,0', 'Haut, Haar, Pflanzen'],
        ['2,5', 'Reinigen im ganzen Haus'],
      ],
      daten: [
        ['Platten', '8 Titanplatten, mit Platin beschichtet'],
        ['Wasserarten', '5, von pH 2,5 bis pH 11,5'],
        ['Besonderes', 'Trinkwasser mit Wasserstoff, frisch aus dem Hahn'],
        ['Strom', 'Multispannung, in jedem Land nutzbar, Stecker austauschbar'],
        ['Bedienung', 'Touch, automatische Funktionen'],
        ['Reinigung', '1 × im Monat mit Zitronensäure, bei kalkhaltigem Wasser alle 14 Tage'],
        ['Preis', '[FEHLT: Preis K8]'],
        ['Raten', '[FEHLT: Raten K8]'],
        ['Garantie', '[FEHLT: Garantie K8]'],
        ['Maße und Gewicht', '[FEHLT: Maße K8]'],
      ],
      quelle: 'Quelle: Wasser-Guide und Reinigungsanleitung von Ursprungskraft',
    },
    {
      id: 'anespa', name: 'ANESPA DX', art: 'Dusche', bild: 'bilder/portal-anespa.jpg',
      kern: '[FEHLT: kurze Beschreibung ANESPA DX in einem Satz]',
      daten: [
        ['Was es ist', '[FEHLT: Funktionsweise ANESPA DX]'],
        ['Einbau', '[FEHLT: Einbau ANESPA DX]'],
        ['Preis', '[FEHLT: Preis ANESPA DX]'],
        ['Raten', '[FEHLT: Raten ANESPA DX]'],
        ['Garantie', '[FEHLT: Garantie ANESPA DX]'],
        ['Bestellen', 'Als Zusatz im Bestellformular über deinen Bestell-Link'],
      ],
      quelle: 'Für die ANESPA DX liegt noch keine Faktenquelle vor.',
    },
    {
      id: 'go', name: 'emGuarde GO', art: 'Für unterwegs, immer im 2er-Set', bild: 'bilder/emguarde-go.jpg',
      kern: 'Zwei kleine Geräte mit Akku. Eine Taste, keine Einrichtung, keine Wartung.',
      daten: [
        ['Lieferumfang', '2 Geräte, 2 USB-C-Ladekabel'],
        ['Akku', '5.000 mAh, bis zu 72 Stunden je Ladung, Laden über USB-C'],
        ['Wirkbereich', 'laut Enagic ca. 3 m Durchmesser je Gerät'],
        ['Farbe', 'mattschwarz'],
        ['Garantie', '2 Jahre'],
        ['Preis Deutschland', '2.885,80 € inklusive MwSt. und Versand (netto 2.420 €)'],
        ['Zahlung', 'Überweisung oder 10 Raten über Enagic, ohne Schufa'],
        ['Wichtig', 'Höchstens 5 emGuarde je Vertriebspartner'],
        ['Für Firmen', 'Laut Daniel absetzbar und abschreibbar'],
        ['Gewicht', '[FEHLT: Gewicht GO]'],
      ],
      quelle: 'Quelle: Enagic-Seite und Shop. Enagic: nicht dazu bestimmt, Krankheiten zu diagnostizieren, zu behandeln, zu heilen oder zu verhindern.',
    },
    {
      id: 'home', name: 'emGuarde Home Station', art: 'Für zu Hause, Büro oder Auto', bild: 'bilder/emguarde-home.jpg',
      kern: 'Gleiche Funktion wie der GO, als feste Station über USB.',
      daten: [
        ['Modell', 'EM001'],
        ['Strom', 'USB, DC 5 V, 0,5 W'],
        ['Gewicht', '430 g'],
        ['Wirkbereich', 'laut Enagic 4 m Umkreis'],
        ['Garantie', '2 Jahre'],
        ['Preis', '1.612,50 € inklusive MwSt. und Versand (netto 1.350 €)'],
        ['Bestellen', 'Noch nicht im Bestellformular, auf Anfrage bei Daniel'],
        ['Prüfungen', 'CE, FCC und RoHS durch SGS, Patent in Malaysia'],
      ],
      quelle: 'Quelle: Enagic-Shop und Unterlagen zum Modell EM001.',
    },
  ],

  // Entwürfe, Jasmin und Daniel prüfen noch. Ton: auf Augenhöhe, nie belehrend.
  einwaende: [
    {
      frage: 'Das ist mir zu teuer.',
      antwort: [
        'Verstehe ich gut, das ist kein kleiner Betrag. Frag ruhig nach, womit sie es vergleicht. Viele rechnen nur den Gerätepreis und nicht, was sie heute jeden Monat für Wasserkisten, Flaschen oder Filterkartuschen ausgeben.',
        'Erwähne die Raten über Enagic nur, wenn sie danach fragt. Dräng nicht. Wer heute nicht kauft, kann trotzdem eine gute Empfehlung für später sein.',
      ],
      satz: 'Was gibst du denn heute im Monat für Wasser aus? Lass uns das mal kurz nebeneinander legen.',
    },
    {
      frage: 'Leitungswasser reicht mir.',
      antwort: [
        'Dann hat sie schon den wichtigsten Schritt gemacht: Sie trinkt Wasser aus der Leitung. Genau darauf baut das Gerät auf, es nimmt ihr Leitungswasser und macht daraus fünf Wasserarten.',
        'Zeig lieber, was dazukommt, statt das Leitungswasser schlecht zu machen: Wasser zum Putzen, zum Obst waschen, für Haut und Haar, alles aus einem Hahn.',
      ],
      satz: 'Das Gerät ersetzt dein Leitungswasser nicht, es macht mehr daraus. Soll ich dir zeigen, wofür ich die anderen vier Wasserarten nutze?',
    },
    {
      frage: 'Ich habe schon einen Filter.',
      antwort: [
        'Gut, dann ist ihr sauberes Wasser wichtig. Frag, was für einen Filter sie hat und was ihr daran gefällt.',
        'Ein Filter macht Wasser sauber. Das Gerät filtert auch, kann aber zusätzlich fünf Wasserarten von pH 2,5 bis 11,5 herstellen, zum Trinken, Kochen, Pflegen und Putzen.',
      ],
      satz: 'Was machst du denn heute zum Putzen oder für Obst und Gemüse? Genau da merkt man den Unterschied am schnellsten.',
    },
    {
      frage: 'Das muss ich erst mit meinem Partner besprechen.',
      antwort: [
        'Völlig richtig, so eine Anschaffung entscheidet man zu zweit. Biete an, beim nächsten Mal beide einzuladen, statt die Infos nur weiterzugeben.',
        'Mach direkt einen Termin aus und trag ihn ins Portal ein. Dann vergisst du ihn nicht.',
      ],
      satz: 'Magst du deinen Partner beim nächsten Mal einfach dazuholen? Dann kann er alles selbst probieren und fragen.',
    },
    {
      frage: 'Ich kaufe einfach Wasser in Flaschen.',
      antwort: [
        'Viele machen das so. Frag, wie das im Alltag läuft: Kisten tragen, Leergut zurückbringen, Vorrat im Keller.',
        'Der greifbarste Unterschied: keine Kisten mehr schleppen, frisches Wasser direkt aus der Küche.',
      ],
      satz: 'Wie viele Kisten trägst du denn im Monat nach Hause? Stell dir vor, das fällt einfach weg.',
    },
    {
      frage: 'Ich muss mir das noch überlegen.',
      antwort: [
        'Ist in Ordnung. Frag ehrlich nach, was noch offen ist. Oft ist es eine einzige Frage, die man gleich klären kann.',
        'Wenn nichts konkret ist: Vereinbart, wann du dich wieder meldest, und trag es als "Wieder melden am" in der Kundenkarte ein.',
      ],
      satz: 'Klar. Gibt es etwas, das ich dir noch zeigen oder schicken kann? Sonst melde ich mich am Donnerstag kurz bei dir.',
    },
    {
      frage: 'Gibt es dafür Studien?',
      antwort: [
        'Sei hier ehrlich und vorsichtig. Versprich keine Wirkung auf die Gesundheit, auch nicht mit Studien im Rücken.',
        'Was du sicher zeigen kannst: wie das Gerät funktioniert, die fünf Wasserarten, den pH-Wert mit Tropfen gemessen, den Geschmack. Lass sie selbst probieren.',
      ],
      satz: 'Ich verspreche dir keine Wirkung. Was ich dir zeigen kann, ist, was das Gerät macht. Probier selbst und entscheide dann.',
    },
    {
      frage: 'Ich will das erst mal testen.',
      antwort: [
        'Sehr gut, genau so soll es sein. Wer selbst probiert, entscheidet sicherer.',
        'Sprich mit Daniel über ein Testgerät und stell die Kundin in der Kundenkarte auf "Termin", damit du den Rückruf nicht vergisst.',
      ],
      satz: 'Gern. Ich kläre, wann ein Testgerät frei ist, und melde mich bis Freitag bei dir.',
    },
    {
      frage: 'Ich habe keinen Platz in der Küche.',
      antwort: [
        'Frag, wo heute die Wasserkisten oder der Filter stehen. Oft ist der Platz schon da.',
        'Zeig ein Foto vom Gerät neben einer Spüle, damit sie die Größe einschätzen kann.',
      ],
      satz: 'Wo stehen denn heute deine Wasserflaschen? Lass uns mal schauen, ob das Gerät da hinpasst.',
    },
    {
      frage: 'Ist das nicht so ein Netzwerk-Ding?',
      antwort: [
        'Bleib offen und ruhig. Ja, Enagic verkauft über Vertriebspartner, so wie du einer bist. Für sie heißt das: Sie hat eine feste Ansprechperson, die sie auch nach dem Kauf erreicht.',
        'Sie muss nichts weiterverkaufen und nichts unterschreiben außer ihrer eigenen Bestellung.',
      ],
      satz: 'Du kaufst ein Gerät, keine Mitgliedschaft. Und ich bleib danach für deine Fragen da.',
    },
  ],
};

<!--
  ENTSCHEIDUNGEN VON JASMIN, Stand 21.10.2026
  FERTIG: alles, was Jasmin am 21.10.2026 zu f-offene-fragen.md beantwortet hat, und was davon schon gebaut ist.
  FEHLT:  die Punkte unter "Noch offen".
-->

# Entscheidungen (Jasmin, 21.10.2026)

| Thema | Entscheidung | Gebaut? |
|---|---|---|
| Farbpakete für Partner (4) | Partner dürfen alle vier wählen | ja |
| Farbe des Partnerportals (5) | Sand neutral | ja, `data-farbe="sand"` in allen Portalseiten |
| KI-Bilder (6) | ja. Partnerseiten sehen aus wie Ursprungskraft, nur anderer Name und andere Domain | ja, Bilder in `bilder/` |
| Kangenwasser (37) | klar benennen, auch in der Überschrift. Kangenwasser ist der Begriff für das Wasser | ja |
| Wortwahl | nicht „kein Filter“ und nicht „Wassermaschine“, sondern „Mehr als gefiltertes Wasser“, oben „Wasserionisierer aus Japan“ | ja |
| Aufschlag auf Druck (10) | kleiner Aufschlag für Jasmins Arbeit (richtiges Papier, richtige Dokumente) | ja, `aufschlag_prozent` in `paket.js`, Höhe offen |
| Monatsgebühr (Landingpage) | ja, für Seite, Hosting und Telegram-Bot | ja, Betrag offen |
| Land und Preise (12) | Partner wählt sein Land: Deutschland, Schweiz, Österreich oder anderes Land (zum Eintippen). Schweiz in CHF mit eigenen Preisen, alle anderen in EUR | ja, `PREISE.DE`, `.CH`, `.AT`, `.ANDERE` in `paket.js`, Feld Land in „Deine Daten“ |
| Bezahlen (13) | nur Karte über Stripe | ja |
| Stückzahlen (14) | 100, 200 oder 500 je Dokument | ja |
| Nur online (9) | Partner kann auch nur die Seite ohne Druckmaterial wählen | ja, „Nur online, ohne Druck“ |
| Zahlungsausfall (15) | Seite nach 7 Tagen abschalten, Wiederfreischalten gegen kleine Pauschale | ja, im Vertrag 6.2 und 6.3 |
| Dashboard auf der Startseite (16) | erst zeigen, wenn es fertig ist | ja (nicht gezeigt) |
| Enagic-Freigabe (18) | nicht einholen, Punkt raus | vermerkt. Risiko: siehe Vertrag, Frage 12 an den Anwalt |
| Kundendaten (23) | Partner kann seine Kunden, Anfragen und Verkäufe als CSV herunterladen, auch für die Steuer | ja, „Kunden als CSV herunterladen“ in Mein Bereich, Anschluss `kundenLaden()` |
| Testgerät (27) | kostenlos, keine Kaution, Vertrauensbasis. Jeder Partner entscheidet selbst, ob er ein Testgerät anbietet | ja, Feld in „Deine Daten“; bei Nein zeigt die Seite nur Beratung |
| Linie A/B (29) | jeder Partner entscheidet selbst (noch mit Daniel bestätigen) | nein |
| Bot (31) | ein Bot für alle, jeder Partner mit eigenem Startcode | ja |
| Bot-Nachrichten (26) | Bot schickt die Kundendaten (Name, Telefon) direkt mit. Muss in der Datenschutzerklärung stehen: Daten laufen über Telegram, Firma außerhalb der EU | ja (so geplant), Hinweis gehört in die Datenschutz-Vorlage |
| Registrierung (32) | erst nach Klick auf den Link in der Mail weiter | ja, Hinweis „Schau in dein Postfach“ |
| Hinweis auf der Partnerseite (19) | „selbstständiger, unabhängiger Vertriebspartner“, Enagic wird nicht genannt, auch nicht im Markenvermerk | ja, Fuß der Landingpage |
| Schriften (25) | liegen auf unserem Server, nicht bei Google | beim Einbau (der andere Claude) |
| Material nach Vertragsende (22) | gehört dem Partner, er kann damit machen, was er will | ja, Vertrag 3.3 |
| Angaben vom Partner | vor dem Erstellen der Seite werden alle Angaben abgefragt, auch Firmierung und USt-IdNr. | ja, „Deine Daten“ |

## Noch offen

- **Marke und Domain:** Vorschläge im Chat, Entscheidung offen.
- **Anbieter:** Jasmin oder GmbH, klärt Jasmin mit Daniel.
- **Wer schickt die Mail an Enagic (30):** klärt Jasmin mit Daniel.
- **Preise und Pakete:** Starterpaket als Baukasten oder feste Pakete 1, 2, 3. Jasmin entscheidet später, wir machen dann Vorschläge.
- **Seite nach Kündigung (7):** Weiterleitung auf eine Seite von uns oder Hinweis. Offen.
- **Österreich:** Druck in Deutschland mit Versand nach Österreich oder eigene Druckerei in Österreich. Herausfinden.
- **Datenschutz (20):** Jasmin kennt sich nicht aus. Vorschlag: Datenschutzerklärung und AVV vom Anwalt als Vorlage für alle Partner.
- **Fragebogen für Partnerkunden (33):** ist fertig, Datei fehlt hier noch.
- **Freigabe der Partnertexte (21):** offen.

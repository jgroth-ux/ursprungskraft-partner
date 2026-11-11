# Offene Fragen (statt zu raten)

Stand 11.11.2026. Wo ich eine vorläufige Lösung gebaut habe, steht sie dabei. Alles lässt sich an einer Stelle ändern.

## Geld und Paket

1. **Preise.** Einrichtung und Hosting stehen als `[Preis folgt]` in `website/partner/seiten.js` (ganz oben, `PREIS`).
   Ist die Einrichtung einmal je Partner oder je Fassung?
2. **Was ist im Paket?** Alle drei Fassungen, oder bucht man Fassungen einzeln? Vorbereitet: `uk_partner_seiten_paket.fassungen`
   (leer = alle drei, sonst nur die genannten). Im Formular sind nicht gebuchte Fassungen ausgegraut.
3. **Paket abgelaufen.** Heute: Ab dem Tag nach `gebucht_bis` zeigt die Seite "Diese Seite gibt es gerade nicht",
   das E-Book ebenso. Wollt ihr eine Schonfrist (zum Beispiel 7 Tage) oder einen Hinweis an den Partner vorher?
4. **Paket buchen.** Bis Stripe da ist, öffnet der Knopf eine fertige Mail an `info@ursprungskraft.net`.
   Für Stripe in `seiten.js` `BUCHEN_LINK` setzen, die Freischaltung schreibt `uk_seiten_paket_setzen()`.

## Leads

5. **Wer meldet sich bei den Interessenten?** Leads von den Partnerseiten laufen wie bei Kevin und Johny über
   `partner-lead` in die Telegram-Gruppe "Leads", heiß und warm landen auf der Anrufliste. Ruft also das Team an,
   oder soll der Partner seine Leads direkt bekommen? Die Seiten sagen neutral "Wir melden uns bei dir".
6. **Telefon und E-Mail "nur für Leads an ihn".** Gespeichert in `uk_partner_seiten.lead_telefon` und `lead_email`,
   aber noch nicht genutzt, weil der Weg fehlt: Telegram über den Partner-Assistenten (wenn verbunden), E-Mail
   (Mail-Dienst fehlt) oder gar nicht, weil das Team anruft? Beim Sportler-Backoffice sieht der Partner bewusst keine
   Kontaktdaten der Interessenten (Datenschutz). Soll das für Baukasten-Partner anders sein?
7. **Übersicht der Leads für den Partner.** Im Portal steht nur die Anzahl je Fassung (keine Namen). Sollen die
   Baukasten-Partner zusätzlich das Backoffice bekommen (wie Kevin und Johny), oder reicht ihre Kundenübersicht im Portal?
8. **Telegram-Meldung.** `antworten.fassung` und `antworten.seite` werden gespeichert, die Meldung von `partner-lead`
   zeigt sie aber nicht. Eine zusätzliche Zeile "Seite: sport" in `meldung()` würde reichen. Soll ich?
9. **Partner muss `aktiv` sein.** `uk_partner_lead_speichern` setzt `partner_id` nur bei `aktiv = true`. Sonst bleibt
   der Lead trotzdem über `herkunft` (kurz) beim Partner, aber ohne `partner_id`. Bitte bei Freigabe prüfen.

## Texte und Inhalte

10. **Alle Überschriften** stehen zum Abhaken in `ueberschriften.md`.
11. **E-Book-Titel** sind Entwürfe, bis das Paket E-Books fertig ist: Neutral "Ein Gerät, fünf Wasserarten",
    Sport "Das unterschätzte Supplement" (wie bei Kevin), Gesundheit "Wasser im Alltag". Passt das zu den echten E-Books?
12. **Faustregel 40 ml je Kilo** (Sportseite, Zahlenfeld und Rechner) stammt von der Seite von Kevin. Gibt es dafür
    eine Quelle, die wir angeben sollen? Sonst `[FEHLT: Quelle]` oder streichen.
13. **Promi-Videos.** Die Videos mit Eddie Hall und aus "Soy Georgina" habe ich auf der Sportseite weggelassen
    ("ohne Promi"). Sollen sie als eigener Abschnitt doch rein? Sind die Rechte geklärt?
14. **"Selbst Partner werden"** steht als dritte Antwort bei "Was interessiert dich am meisten?" auf Neutral und Sport
    (wie bei Kevin). Bei Gesundheit steht stattdessen "Das Gerät für meine Praxis". So gewollt?
15. **Gesundheitsseite, Kasten "Ehrlich gesagt":** "Das Gerät macht Wasser. Es ist kein Heilmittel und ersetzt keine
    Behandlung. Bei Fragen zu deiner Gesundheit sprich mit deinem Arzt oder Therapeuten." Bitte rechtlich prüfen lassen.
16. **pH 7,0 "zum Einnehmen von Medikamenten"** steht wie auf der Seite von Kevin. Auf der Gesundheitsseite heikler?
17. **Anschluss am Wasserhahn** (Neutral, Häufige Fragen): "Das Gerät steht neben deiner Spüle und wird an den
    Wasserhahn angeschlossen." Stimmt das für alle Geräte, die Partner verkaufen (K8, ANESPA DX ist für die Dusche)?
18. **Einwilligung beim E-Book-Formular.** Ich habe einen Haken ergänzt (bei Kevin fehlt er). Bitte mit der
    Datenschutzerklärung abgleichen. Dort muss auch stehen, dass der Partner Empfänger bzw. Herkunft des Leads ist.

## Gestaltung

19. **Radien.** Die Sportseiten haben runde Karten (20 px) und Pillen-Knöpfe. Hier habe ich mich an die CI gehalten
    ("klare Kanten": 4 px Knöpfe, 8 px Karten). Eine Stelle in `website/p/seiten.css`: `--r` und `--r-klein`.
20. **Sportseite dunkel** in Olive tief statt Anthrazit (Farben aus der CI). Akzent ist Khaki hell statt Kupfer.
21. **Daniel und Jasmin als Beispiele.** Die SQL legt Seiten mit den Adressen `daniel-zuercher` (Neutral, Sport) und
    `jasmin-groth` (Gesundheit, Neutral) an, aber nur, wenn es Partner mit dem Kürzel `daniel` und `jasmin` gibt.
    Rolle, Satz und Foto tragt ihr selbst im Portal ein. Andere Fassungen gewünscht?

## Technik

22. **Neutrale Domain.** Name noch offen. Später: Domain in Netlify als weitere Domain der Website eintragen und in
    `uk_einstellungen` den Wert `seiten_basis` ändern. Kein Upload nötig. Sollen die Seiten dann nur noch unter der
    neutralen Domain erreichbar sein (Weiterleitung von mein.ursprungskraft.net/p/...)?
23. **Impressum und Datenschutz** verlinken auf `/impressum.html` und `/datenschutz/` derselben Website. Auf der neutralen
    Domain zeigen sie dann Ursprungskraft (laut Auftrag erlaubt). Passt der Text der Datenschutzerklärung für Partnerseiten?
24. **Alte "Landingpage" im Portal** (Tools, Wasser-Check-Seite `/wasser/?von=`). Bleibt sie neben "Meine Seiten" oder
    ersetzen die neuen Seiten sie? Zwei Landingpages könnten Partner verwirren.
25. **Gefunden, nicht geändert:** In `uk_partner_registrieren` (10-31b) passt `translate(..., 'äöüßéèàç ', 'aousseeac-')`
    nicht: Die zweite Liste ist ein Zeichen länger. Folge: "é" wird zu "s", ein Leerzeichen zu "c"
    ("Anna Lena" wird "annaclena-..."). Die neue Adresse der Seiten baut ihren Vorschlag richtig ("ä" zu "ae").
26. **E-Book im Speicher zwischenspeichern?** Heute baut `partner-ebook` die PDF bei jedem Abruf neu (Sekundenbruchteile,
    der Browser hält sie eine Stunde). Bei sehr vielen Abrufen lohnt sich eine Ablage je Partner und Fassung.

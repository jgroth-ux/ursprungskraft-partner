<!--
  OFFENE FRAGEN AN JASMIN (Aufgabe F), Stand 20.10.2026
  FERTIG: alle Punkte, die mir beim Bauen von A bis E aufgefallen sind, mit Antwortmöglichkeiten.
  FEHLT:  deine Antworten. Kreuz einfach an oder schreib daneben.
  Ich habe dazu nichts selbst entschieden. Wo ich einen Vorschlag habe, steht er als Option da,
  nicht als Entscheidung. Die Reihenfolge der Optionen ist keine Empfehlung.
-->

# Offene Fragen zum Partner-Setup

Sortiert nach: Marke, Geld, Recht, Ablauf, Inhalte, Technik. Die wichtigsten für den Start sind mit
**(Start)** markiert. Ohne diese Antworten kann nichts live gehen.

---

## Marke

**1. Wie heißt die neutrale Marke {{MARKE}}? (Start)**
- [ ] Du suchst einen Namen aus, ich mache dir Vorschläge, wenn du willst
- [ ] Keine Marke sichtbar, nur der Name des Partners oben auf der Seite
- [ ] Erst mal ein Arbeitstitel, später umbenennen

**2. Welche Domain {{DOMAIN}}? (Start)**
- [ ] Eine passend zur Marke, .de
- [ ] Eine passend zur Marke, .com oder .eu (passt für DE und CH)
- [ ] Zwei Domains, .de und .ch

**3. Wie soll der Partnerlink aussehen?**
- [ ] {{DOMAIN}}/kuerzel (so ist es gebaut, wie bei ursprungskraft.net/name)
- [ ] kuerzel.{{DOMAIN}}
- [ ] Beides, eigene Domain des Partners zusätzlich per DNS (wie in der Ideenliste)

**4. Welche Farbpakete dürfen Partner wählen?**
Gebaut sind vier: Oliv-Khaki, Blau, Sand neutral und als Vorschlag Lehm (Terrakotta).
- [ ] Alle vier
- [ ] Nur die drei aus dem Briefing, Lehm fällt weg
- [ ] Oliv-Khaki nur für Ursprungskraft, Partner bekommen nur Blau, Sand und Lehm (damit sich
      Partnerseiten klar von Ursprungskraft unterscheiden)

**5. Welche Farbe hat das Partnerportal selbst?**
- [ ] Immer Oliv-Khaki
- [ ] Die Farbe der neuen Marke
- [ ] Sand neutral

**6. Dürfen KI-Bilder (Prompts in `a-landingpage/bild-prompts.md`) auf Partnerseiten?**
- [ ] Ja, für Küche, Wasser, Haushalt. Partnerfoto immer echt
- [ ] Nein, nur echte Fotos (dann: wer fotografiert?)
- [ ] Dieselben Bilder wie auf der Ursprungskraft-Seite (dann sehen Partnerseiten aber gleich aus,
      und die Trennung von Ursprungskraft wird schwächer)

**7. Was steht auf der Seite, wenn ein Partner nicht zahlt oder gekündigt hat?**
- [ ] Neutraler Satz: „Diese Seite ist nicht mehr verfügbar.“
- [ ] Weiterleitung auf eine Seite der Marke {{MARKE}}
- [ ] Gar nichts (Fehlerseite)

---

## Geld

**8. Preise (Start).** Bitte eintragen, sie stehen überall als {{PREIS_...}}:
- Starterpaket einmalig: ______ (Einrichtung, davon unabhängig das Druckmaterial?)
- Landingpage monatlich: ______ (deine Idee war etwa 10 €)
- Druckmaterial je Dokument und Stückzahl: ______ (Tabelle `PREISE` oben in `b-portal/paket/paket.js`)
- Versand je Bestellung DE / CH: ______
- Eigene Domain für den Partner: ______

**9. Ist das Druckmaterial im Starterpaket schon drin oder kommt es extra dazu?**
- [ ] Starterpaket = Einrichtung plus 100 Stück je Dokument zum Festpreis
- [ ] Starterpaket = nur Einrichtung, Material wird nach Stückzahl berechnet (so ist es gebaut)
- [ ] Starterpaket fest, mehr als 100 Stück kostet extra

**10. Aufschlag auf den Druck?**
- [ ] Fester Aufschlag in % auf den Druckpreis: ___ %
- [ ] Fester Preis je Dokument, egal was die Druckerei nimmt
- [ ] Zum Einkaufspreis, verdient wird nur an der Monatsgebühr

**11. Landingpage die ersten Monate gratis (Vorschlag aus der Ideenliste)?**
- [ ] Ja, ___ Monate im Starterpaket enthalten
- [ ] Nein, Abbuchung ab dem ersten Monat
- [ ] Ja, aber nur für die ersten ___ Partner

**12. Währung für Schweizer Partner?**
- [ ] CHF (dann brauchen wir zwei Preislisten)
- [ ] Alle in EUR
- [ ] CHF für Druck, EUR für die Monatsgebühr

**13. Wie wird bezahlt?**
- [ ] Nur Karte über Stripe
- [ ] Karte und Lastschrift (SEPA für DE, für CH extra klären)
- [ ] Zusätzlich Rechnung und Überweisung

**14. Brauchen Mindestmenge und 50er-Schritte eine Änderung?**
Gebaut: mindestens 100 je Dokument, mehr in 50er-Schritten.
- [ ] So lassen
- [ ] 100er-Schritte (100, 200, 300 …), passt besser zu den Druckerei-Staffeln
- [ ] Feste Stufen 100, 200, 500

**15. Was passiert bei Zahlungsausfall, mit welchen Fristen?**
Im Vertrag stehen Platzhalter für: Abschalten nach ___ Tagen, fristlose Kündigung nach ___ Tagen,
Gebühr für Wiederfreischalten ja / nein.

**16. Dashboard für Partner (Ideenliste Punkt 8, „deutlich teurer“): schon auf der Portal-Startseite zeigen?**
- [ ] Ja, als „kommt bald“ mit Preis
- [ ] Nein, erst wenn es fertig ist (so ist es gebaut)

---

## Recht

**17. Wer ist Anbieter {{ANBIETER}}? (Start)**
- [ ] Jasmin als Einzelunternehmerin
- [ ] Ursprungskraft GmbH (dann fällt die Trennung zur Marke Ursprungskraft im Impressum weg)
- [ ] Eine neue, eigene Firma für die neutrale Marke
Mit Kathi klären: Rechnungen, Schweiz, Kleinunternehmergrenze, MwSt.

**18. Enagic-Freigabe (Vertrag 3.3 und 3.4): Wer reicht ein? (Start)**
- [ ] Wir reichen das ganze Set einmal als Muster ein (Landingpage, Broschüre, Flyer usw.)
- [ ] Jeder Partner holt sich die Freigabe selbst
- [ ] Beides: wir das Muster, der Partner meldet seine Seite danach an

**19. Darf auf Partnerseiten ein Hinweis „unabhängiger Vertriebspartner, nicht Enagic“ stehen?**
Gebaut ist nur der Markenvermerk „LeveLuk und Enagic sind Marken der Enagic Co., Ltd.“ und
„Verantwortlich für diese Seite: Name des Partners“.
- [ ] Ja, Satz vom Anwalt formulieren lassen
- [ ] Nein, so lassen
- [ ] Nach Enagic-Vorgabe

**20. Datenschutzerklärung und Impressum für Partnerseiten (Start)**
- [ ] Wir stellen eine Vorlage, der Partner füllt nur seine Daten ein (Impressum ist so gebaut)
- [ ] Jeder Partner bringt seine eigene Datenschutzerklärung mit
- [ ] Generator-Dienst (zum Beispiel ein Abo bei einem Rechtstexte-Anbieter)

**21. Freigabe der Partnertexte, bevor die Seite live geht?**
Der Partner schreibt „Über mich“ selbst. Da können Heilversprechen drinstehen, das fällt rechtlich
auf ihn, kann aber auch auf uns zurückfallen.
- [ ] Ja, du oder Daniel schaut jeden Text an, dann erst live
- [ ] Nein, sofort live, wir prüfen stichprobenartig
- [ ] Automatische Prüfung auf Wörter wie „heilt“, „Krankheit“, dann sofort live

**22. Darf gedrucktes Material nach Vertragsende aufgebraucht werden?**
- [ ] Ja (so im Vertragsentwurf 3.3)
- [ ] Nein, Material darf nach Ende nicht mehr verteilt werden

**23. Kundendaten nach Vertragsende eines Partners**
- [ ] Partner bekommt eine Datei, dann löschen wir
- [ ] Kunden bleiben im System und gehen an den Sponsor des Partners
- [ ] Anwalt fragen, was erlaubt ist (siehe Frage 9 im Vertrag)

**24. Kündigungsfrist und Laufzeit {{KUENDIGUNGSFRIST}}**
- [ ] Monatlich kündbar, keine Mindestlaufzeit
- [ ] Mindestlaufzeit ___ Monate, danach monatlich
- [ ] Jährlich

**25. Google Fonts:** Die Seiten laden Jost und Inter von Google. Für den Datenschutz besser selbst
hosten.
- [ ] Selbst hosten (der andere Claude legt die Schriftdateien auf den Server)
- [ ] Erst mal so lassen

**26. Telegram-Nachrichten mit Kundendaten** (Name, Telefon) gehen über Telegram, Sitz außerhalb der EU.
- [ ] So lassen, im AVV und in der Datenschutzerklärung erwähnen
- [ ] Nachricht nur mit Vorname und Link ins Portal, Daten erst nach Login sichtbar
- [ ] Anwalt fragen

---

## Ablauf

**27. Testgerät: Bedingungen (Start).** Auf der Landingpage steht {{TESTBEDINGUNGEN_FEHLT}}.
Bitte festlegen: Wie lange? Kostet der Test etwas? Kaution? Wer bringt und holt das Gerät?
Haben Partner überhaupt eigene Testgeräte?
- [ ] Jeder Partner hat ein eigenes Testgerät, Bedingungen legt er selbst fest (dann Feld im Portal)
- [ ] Einheitliche Bedingungen für alle: ___ Tage, ___ Kaution
- [ ] Text weglassen, nur „sprich mit mir über die Bedingungen“

**28. Bestellungen der Partnerkunden: Wer prüft vor dem Versand an Enagic?**
Bei dir und Daniel fragt der Assistent jedes Mal: wem zugeordnet, welche Linie (A/B). In der
Anleitung habe ich geschrieben: der Partner bekommt die Unterlagen zum Prüfen und bestätigt.
- [ ] Der Partner prüft und bestätigt selbst
- [ ] Der Partner prüft, zusätzlich schaut Daniel drüber
- [ ] Nur Daniel oder du, der Partner bekommt nur eine Info

**29. Wer entscheidet A/B-Linie bei Partnerkunden?**
- [ ] Der Partner selbst, jedes Mal (Frage im Bot)
- [ ] Fest im Profil hinterlegt
- [ ] Der Sponsor des Partners

**30. Wer schickt die Mail an Enagic (goc.eu@enagic.com) bei Partnerbestellungen?**
- [ ] Das System im Namen des Partners
- [ ] Der Partner selbst, er bekommt die fertigen PDFs
- [ ] Daniel, wie heute

**31. Wie verbindet sich der Partner mit dem Bot?**
Gebaut ist ein Link `t.me/{{BOTNAME}}?start=kuerzel` (ein gemeinsamer Bot für alle Partner, der am
Startcode erkennt, wer es ist).
- [ ] Ein Bot für alle Partner (so gebaut, einfacher)
- [ ] Ein eigener Bot je Partner (wie im Briefing „eigener Telegram-Bot“, mehr Aufwand, eigener Name je Partner)

**32. Soll der Partner nach der Registrierung sofort ins Portal, oder erst nach E-Mail-Bestätigung?**
- [ ] Sofort (so gebaut)
- [ ] Erst nach Klick auf den Link in der Mail

**33. Fragebogen per Mail für Partnerkunden** (deine To-do-Liste vom 20.10.): auch für Partner?
- [ ] Ja, gleich mit einbauen
- [ ] Später
- [ ] Nur für Ursprungskraft

---

## Inhalte

**34. Welche Dokumente gibt es genau?** Im Paket stehen fünf: Broschüre zum Gerät, Wegweiser, Flyer,
Detox-Blatt, Visitenkarten. Die Vorlage `vorbild-broschuere` heißt „Kangenwasser Wegweiser“ und ist
A5 mit 28 Seiten.
- [ ] Broschüre und Wegweiser sind dasselbe, eins fällt weg
- [ ] Zwei verschiedene Dokumente (dann: Format des Wegweisers?)
- [ ] Guide aus der Ideenliste kommt noch dazu

**35. Gesundheitsthemen im Druckmaterial.** Die Wegweiser-Vorlage hat Kapitel wie „Vorteile für die
Gesundheit“ und „Entzündungen und Infektionen“. Das passt nicht zur Regel „keine Heilversprechen“
und ist für Partner riskant, weil sie damit werben.
- [ ] Für Partner eine eigene Fassung ohne diese Kapitel
- [ ] Kapitel umschreiben auf Alltag und Anwendung
- [ ] Anwalt prüfen lassen, dann entscheiden

**36. Name „Detox-Blatt“:** „Detox“ klingt nach Gesundheitsversprechen.
- [ ] Name bleibt
- [ ] Umbenennen in: ______
- [ ] Blatt fällt für Partner weg

**37. Wörter „Kangen“ und „Kangenwasser“:** Auf der Ursprungskraft-Seite und in der Broschüre stehen
sie, auf der Partnervorlage habe ich sie weggelassen (Briefing: geschützt).
- [ ] Partnerseiten ganz ohne „Kangen“ (so gebaut)
- [ ] Im Fließtext erlaubt, nur nicht als Überschrift

**38. Kundenstimmen auf Partnerseiten?**
- [ ] Nein (so gebaut)
- [ ] Ja, der Partner trägt sie im Portal ein, wir prüfen jede
- [ ] Ja, gemeinsame geprüfte Stimmen für alle Seiten

**39. Videos und die fünf Wasserarten (wie auf der Ursprungskraft-Seite) auch auf Partnerseiten?**
- [ ] Nein, Partnerseite bleibt kurz (so gebaut)
- [ ] Ja, Abschnitt Wasserarten übernehmen
- [ ] Ja, Videos übernehmen, wenn es sie gibt

**40. Kontaktformular: Adresse abfragen?** Die Ursprungskraft-Seite fragt Straße, PLZ, Ort, Land.
Das Briefing nennt nur Name, E-Mail, Telefon, Wunsch, Nachricht (so gebaut).
- [ ] So lassen
- [ ] PLZ und Ort dazu (hilft bei der Planung der Vorführung)
- [ ] Volle Adresse wie bei Ursprungskraft

---

## Technik und Druck

**41. Druckpapier:** In `d-druckpreise.md` steht ein Papiervorschlag für die Preisabfrage
(Broschüre innen 135 g matt, Umschlag 250 g matt, Flyer 170 g, Visitenkarten 350 g). Bitte bestätigen
oder ändern.

**42. Druckpreise prüfen:** Ich konnte die Druckerei-Seiten nicht öffnen (in meiner Umgebung
gesperrt). Die Preise in D sind nur aus der Websuche.
- [ ] Du oder Daniel prüft drei Anbieter je Land im Konfigurator (Checkliste in D)
- [ ] Anfrage per Mail an zwei bis drei Anbieter (Mustertext in D)
- [ ] Der nächste Claude bekommt Netzwerkzugriff auf die Druckerei-Seiten und macht es

**43. Welche Druckerei?** Nach den Funden haben in DE FLYERALARM PRO, SAXOPRINT und DigitalDruck-Fabrik
eine Schnittstelle mit Neutralversand. Für CH habe ich keine gefunden.
- [ ] Erst Angebote einholen, dann entscheiden
- [ ] DE mit Schnittstelle, CH erst mal von Hand bestellen
- [ ] Alles erst mal von Hand

**44. Wer bekommt die Druckdaten zuerst zu sehen?**
- [ ] Der Partner bekommt ein PDF zur Freigabe, dann erst Druck
- [ ] Direkt in den Druck nach der Zahlung (so beschrieben)

# Ursprungskraft: Ideenliste (intern)

Angelegt am 17.10.2026. Jasmin wirft Ideen rein, hier wird alles gesammelt, damit nichts
untergeht. Sortiert und priorisiert wird gemeinsam mit Jasmin, nicht von mir allein.
Status: **offen** = noch nicht besprochen, **geplant** = Reihenfolge steht, **läuft**, **fertig**.

## To-Do (Jasmin, 20.10.2026)

- **Fragebogen per E-Mail**: Link gleich nach dem Start per Mail, nach 2 und nach 4 Wochen
  Erinnerung per Mail. Nur wenn der Kunde zugestimmt hat (Haken im Fragebogen). Braucht
  Mailversand (Brevo o. ä.), der auch für Passwort-Mails und Bestell-Danke gebraucht wird.
- **Fragebogen im Dashboard unter Unterlagen** (Jasmin: "ganz dringend"): von dort versenden,
  jeder mit eigenem Link (Daniel, Jasmin, später Daniels Partner), damit sichtbar ist, über wen
  ein Kunde reinkommt.
- **Partner-Landingpages bauen** (siehe Partner-Setup unten).
- **Domain kaufen** für alle Vertriebspartner (neutral, siehe Punkt 13).
- **Partner-Portal**: Registrierung mit eigenem Account, Formular für die eigenen Daten, nach
  Bezahlung läuft die Landingpage, monatliche Gebühr solange gezahlt wird. Darüber bestellbar:
  Marketingpaket (Broschüren, Flyer usw. personalisiert mit Kontaktdaten und QR-Code),
  Bestellformular mit automatisch ausgefüllten Verträgen, Telegram-Bots, Anleitung zum Einrichten.
- **Vertrag für Partner**: Klausel, dass Landingpage und Material nicht nachgebaut oder kopiert
  werden dürfen; monatliche Hostinggebühr. Vom Anwalt prüfen lassen.
- **Druckpreise einholen** für personalisierte Broschüren und Flyer (DE und CH).
- **Kompletter Fahrplan** für das Partner-Setup.

## Jetzt als Nächstes (von Jasmin so genannt)

1. **Vertrag automatisieren** (offen, Jasmin: "eins der ersten Sachen")
   - Heute zahlt Daniel jemandem 25 CHF je Vertrag, der die Kundendaten ins Enagic-Formular
     (Online-PDF-Formular) einträgt und an die Firma schickt.
   - Ziel: Kundendaten per Telegram an den Assistenten, "neuer Vertrag", der füllt das Formular
     aus, schickt es zum Gegenchecken zurück, nach OK geht es raus.
   - Testlauf: Jasmins eigene Gerätebestellung, in 1 bis 2 Tagen (Stand 17.10.).
   - Offen: leeres Formular (schickt Daniel am 18.10.), wohin es geschickt wird, wer unterschreibt.
2. **Kundenstimmen auf der Landingpage** statt Platzhalter (offen, Rückfrage an Jasmin wegen
   Gesundheitsaussagen auf der öffentlichen Seite).

1b. **Bestellstrecke K8** (läuft, gebaut 19.10.2026: Seite /bestellen/, Reiter Bestellungen, Formulare füllen sich nach Daniels Zuordnung; offen: automatischer Mailversand an Enagic und an den Kunden, Datenschutzerklärung, MwSt-Regeln je Land, Daniels Sponsor-E-Mail bestätigen): versteckte Bestellseite
   (nicht bei Google), Kunde gibt Nachname, Anschrift, Geburtsdatum, E-Mail, Handy ein. Daraus
   werden die Enagic-Formulare automatisch ausgefüllt (Bestellformular, bei Raten der
   Ratenzahlungsantrag, bei CH/NOR/GB das NON-EU-Blatt, als Distributor der Distributorenvertrag).
   Formulare liegen in `reference/enagic/formulare/`, alle außer NON-EU sind ausfüllbare PDFs.
   Sponsor-Daten automatisch je nach Link (Daniel oder Jasmin).
   - **Feste Regel (Jasmin 19.10.2026): Bevor irgendetwas fertig gemacht wird, fragt der Assistent
     IMMER bei Daniel nach:** (1) wem das Gerät zugeordnet wird: Daniel Zürcher (ID 21000078463),
     Ursprungskraft GmbH (ID 21000127564, ursprungskraft.gmbh@gmail.com) oder Jasmin (ID kommt
     noch); (2) "Neukunde in [ ] A/B Linie des Sponsors", entscheidet Daniel jedes Mal selbst.
   - Danach Vertrag fertig und Mail an Enagic (an goc.eu@enagic.com) wie Daniels Vorlage: Betreff
     "NEW Sale Leveluk K8 from Germany", Text mit Sponsor ID, Sponsor, Sponsor Line, Anhänge
     Bestellformular, ggf. Ratenzahlungsantrag, ID Front, ID Back, Zahlungsbeleg.
   - Bei Ratenzahlung: Kunde lädt Ausweis Vorder- und Rückseite direkt im Bestellformular hoch.
   - Ausgefülltes Beispiel (mit Kundendaten, nicht im Backup):
     `reference/enagic/formulare/beispiel-vertrag-ausgefuellt-PRIVAT.pdf`
   - **Morgen (20.10.):** Daniel öffnet den neuen Bestell-Bot und tippt auf Starten. Danach in Supabase
     `update uk_einstellungen set wert = 'ja' where name = 'bestellbot_daniel';` und Test schicken.
     Bis dahin bekommt Daniel Bestellungen über seinen bisherigen Assistenten.
1c. **Mail an den Kunden nach der Bestellung**: "Danke, deine nächsten Schritte", mit Link zur
   Seite nach dem Kauf, zur Broschüre (Wegweiser) und Einladung in einen Infokanal für Kunden
   (News zum Gerät, Gesundheitsthemen).
1d. **Kundenbereich** zum Durchklicken (Anwendungen, Pflege, Filter kaufen). Grundlage: Seite
   "Dein K8 Start" und der Wegweiser.
1e. **Filter auf Vorrat** (offen): FC1-Filter selbst einkaufen und mit Aufschlag weiterverkaufen,
   vor allem für Kunden in der Schweiz, die nicht in Düsseldorf bestellen wollen. Vorher klären:
   erlaubt der Enagic-Vertrag den Weiterverkauf, Zoll und Versand aus der Schweiz.

## Partner-Setup ("Vertriebsstarter-Paket")

3. **Landingpage je Partner**: eine Vorlage, je Partner ein Datensatz (Name, Foto, Kontakt,
   Kürzel, Farbpaket). Adresse ursprungskraft.net/name, auf Wunsch eigene Domain per DNS-Eintrag,
   gehostet bleibt alles bei uns. Erster Schritt: Jasmin als erste Partnerin mit eigenen Daten.
   Der Hinweis "Dir empfohlen von" (Zinzino-Prinzip) läuft schon über `?von=kürzel`.
4. **Druckmaterial je Partner**: Wegweiser, Guide, Detox-Blatt, Broschüre zum Gerät, mit
   Kontaktdaten und QR-Code zur Landingpage. Erzeugt aus Vorlagen (wie die Jasmin-Fassung).
5. **Farbpakete**: wenige zur Auswahl (Vorschlag: Oliv-Khaki, Blau, neutral Sand). Etwas
   Individualität, nicht zu viel Auswahl.
6. **Druck und Versand**: Online-Druckerei mit Direktversand an den Partner. Deutschland in
   Deutschland drucken, Schweiz in der Schweiz (Zoll, Einfuhrsteuer, Laufzeit). Angebote einholen.
   Startmenge zum Beispiel 100 bis 200 Stück je Dokument.
7. **Telegram-Bot je Partner** mit Onboarding: Anleitung zum Einrichten, Nachrichten bekommen,
   Touren planen, Kunden abwickeln.
8. **Dashboard (Backoffice) für Partner**: eigenes Login, nur die eigenen Kunden. Deutlich
   teurer als die Landingpage, weil "Gold wert".

13. **Eigene neutrale Domain für alle anderen Partner** (offen, Jasmin 17.10.): Nur Daniel und
    Jasmin laufen unter Ursprungskraft. Alle weiteren Partner unter einer neutralen Domain, damit
    nichts auf Ursprungskraft zurückfällt, falls ein Partner Mist baut. Domain kaufen.
14. **Seiten nicht auffindbar** (gilt für alle Partner-Landingpages): kein Google, nur per Link,
    den der Partner bei Bedarf an Kunden gibt. Wie heute beim Wasser-Check.
15. **Paket selbst zusammenstellen** (offen): eine Seite, auf der der Partner sein Starterpaket
    schnürt. Dokumente anklicken, Stückzahl wählen, Mindestmenge vorgegeben (zum Beispiel 100 je
    Dokument), freiwillig mehr. Kein starres Paket, aber auch nicht zu viel Auswahl. 3 bis 4
    Farbkonzepte zur Wahl.

## Geld

9. **Preismodell**: Starterpaket einmalig zum Festpreis (Einrichtung + Erstausstattung Druck,
   mit Aufschlag). Landingpage monatlich (Jasmins Idee: etwa 10 € im Monat). Dashboard monatlich
   deutlich mehr. Nachdrucke je Bestellung. Vorschlag: Landingpage die ersten Monate im
   Starterpaket mitgeben.

## Vorher klären

10. **Enagic-Freigabe** (Vertrag 3.3 und 3.4): eigene Webseiten und eigenes Material brauchen
    schriftliche Genehmigung. Ganzes Set einmal als Muster einreichen.
11. **Wer verkauft das Paket**: Jasmin selbst oder die Ursprungskraft GmbH. Rechnungen, Schweiz,
    Kleinunternehmergrenze mit Kathi klären.
12. **Datenschutzerklärung** für die Landingpage, bevor echte Interessenten den Link bekommen.

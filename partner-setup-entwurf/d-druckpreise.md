<!--
  DRUCKPREISE DE UND CH (Aufgabe D), Stand 20.10.2026
  FERTIG: Anbieterliste je Land (5 DE, 5 CH), alle Preise, die die Websuche am 20.10.2026 geliefert
          hat, mit Link. Schnittstellen und Neutralversand für DE. Checkliste und Mustertext für Anfragen.
  FEHLT:  KEIN EINZIGER PREIS IST IM KONFIGURATOR NACHGEPRÜFT. Die Seiten der Druckereien waren aus
          meiner Arbeitsumgebung gesperrt (Netzwerk-Richtlinie). Ich konnte nur die Websuche nutzen,
          die kurze Auszüge der Seiten zeigt. Preise für 200 und 500 Stück: nirgends gefunden.
          Lieferzeiten und Versandkosten: nur vereinzelt. Schweizer Schnittstellen: nicht gefunden.
-->

# Druckpreise für das Partnermaterial

**Abfrage:** 20.10.2026, über die Websuche.
**Wichtig:** Die Zahlen unten stammen aus Suchergebnis-Auszügen, nicht aus dem Bestellkonfigurator.
Oft passt die Konfiguration nicht genau (andere Seitenzahl, anderes Papier, unklar ob netto oder
brutto, unklar ob mit Versand). Zum Rechnen taugen sie nur als **grobe Richtung**. Vor jeder
Entscheidung im Konfigurator selbst nachsehen. Alles, was ich nicht gefunden habe, steht als
„nicht gefunden“ da.

Spalte **Stand**: „Suche“ = Zahl aus dem Suchauszug, nicht nachgeprüft. „abweichend“ = Zahl gefunden,
aber für eine andere Konfiguration als gewünscht.

---

## Vorab: Personalisierte Kleinauflagen gehen überall

Für unser Modell braucht die Druckerei **keine besondere Personalisierungs-Technik**. Jeder Partner
bekommt eine eigene Druckdatei (PDF mit seinem Namen, Kontakt und QR-Code), und für jeden Partner
geht eine eigene Bestellung ab 100 Stück raus, mit seiner Lieferadresse. Das kann jede
Online-Druckerei. Wichtig ist nur:

1. Mindestmenge 100 oder kleiner (bei allen gefundenen Anbietern gegeben),
2. **Neutralversand**: auf dem Paket steht nicht die Druckerei, sondern wir (oder gar nichts),
3. idealerweise eine **Schnittstelle (API)** oder **Sammelbestellung mit mehreren Lieferadressen**,
   damit wir nicht jede Bestellung von Hand anlegen.

---

## Deutschland

### Anbieter

| Anbieter | Link | Neutralversand | Schnittstelle / Sammelbestellung | Lieferzeit | Versand |
|---|---|---|---|---|---|
| FLYERALARM PRO (Reseller) | [flyeralarm.pro/reseller-api](https://flyeralarm.pro/reseller-api/) | ja (laut Seite) | REST-API, Upload PDF, Lieferbedingungen wählbar, Bestellstatus | nicht gefunden | nicht gefunden |
| SAXOPRINT | [saxoprint.de/…/reseller](https://www.saxoprint.de/ueber-uns/unternehmen/vorteile/reseller) | ja (Reseller) | Schnittstelle für Reseller, bis zu 20 Lieferadressen je Auftrag | nicht gefunden | Visitenkarten laut Seite inkl. Versand |
| DigitalDruck-Fabrik | [digitaldruck-fabrik.de/reseller-programm.aspx](https://www.digitaldruck-fabrik.de/reseller-programm.aspx) | ja, eigener Lieferschein und Absender | API (XML), Bestellung per JSON | nicht gefunden | DHL oder GO! |
| Printfactory | [printfactory.de](https://www.printfactory.de/DRUCKSACHEN/Flyer-drucken/) | nicht gefunden | nicht gefunden | 3 bis 5 Produktionstage (Flyer „Fast“) | zzgl. Versand, Höhe nicht gefunden |
| Onlineprinters | [onlineprinters.de](https://www.onlineprinters.de/p/flyer-din-lang) | nicht gefunden | nicht gefunden | nicht gefunden | wirbt mit versandkostenfrei |

### Preise Deutschland (EUR)

**Broschüre A5, 28 Seiten, Klammerheftung, 4-farbig, matt**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| Deine Hausdruckerei | nicht gefunden | nicht gefunden | nicht gefunden | 28 Seiten A5, 4/4, „ab 0,18 € je Stück“, Menge unklar (vermutlich hohe Auflage). [Link](https://www.deine-hausdruckerei.de/broschuere-klammerheftung-din-a5-drucken-lassen,category,9436.html) | abweichend |
| PapeDruck | nicht gefunden | nicht gefunden | nicht gefunden | A5 Drahtheftung „54,70 € netto“, Seitenzahl und Menge unklar. Digitaldruck 1 bis 1.000 Stück. [Link](https://papedruck.de/article/show/broschueren-rueckendrahtheftung-din-a5-hoch/broschueren-mit-rueckendrahtheftung) | abweichend |
| wir-machen-druck | nicht gefunden | nicht gefunden | nicht gefunden | 28 Seiten A5 vorhanden, Innenteil Standard 90 g glänzend, matt erfragen. [Link](https://www.wir-machen-druck.de/detail_info.htm?c=648) | nicht gefunden |
| Druckerei Schütz | nicht gefunden | nicht gefunden | nicht gefunden | nur Preisanfrage-Formular. [Link](https://www.druckerei-schuetz.de/broschuere-rueckendraht-preis) | nicht gefunden |

**Flyer DIN lang, beidseitig**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| Printfactory | 19,90 € brutto | nicht gefunden | nicht gefunden | 135 g glänzend, 4/4, zzgl. Versand, 3 bis 5 Produktionstage. [Link](https://www.printfactory.de/Flyer-DIN-Lang-100-Stueck-Fast/2312-100-fast.2) | Suche |
| Hinzke (Lübeck) | ca. 58 € brutto | nicht gefunden | nicht gefunden | 170 g glänzend, 0,58 € je Stück ab 100, zzgl. Versand. [Link](https://www.hinzke.de/Flyer-DIN-lang-2610286-2-G) | Suche |
| Onlineprinters | 16,90 € | nicht gefunden | nicht gefunden | Seite laut Suche sehr alt, netto oder brutto unklar. [Link](https://www.onlineprinters.de/p/flyer-din-lang) | Suche, vermutlich veraltet |

**Einzelblatt A4, beidseitig (Detox-Blatt)**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| SAXOPRINT | 18,36 € | nicht gefunden | nicht gefunden | 130 g Bilderdruck, beidseitig, netto oder brutto unklar. [Link](https://www.saxoprint.de/werbebedarf/flyer/flyer-din-a4) | Suche |
| LW-Flyerdruck | 19,54 € netto / 23,25 € brutto | nicht gefunden | nicht gefunden | Papier im Auszug nicht genannt. [Link](https://www.lw-flyerdruck.de/Flyer-DIN-A4-im-Hochformat-drucken.htm) | Suche |
| Printfactory | 25,13 € netto / 29,90 € brutto | nicht gefunden | nicht gefunden | 135 g glänzend, 3 bis 5 Produktionstage. [Link](https://www.printfactory.de/Flyer-DIN-A4-100-Stueck-Fast/2308-100-fast.2) | Suche |
| Flyermaschine.de | 31,60 € netto / 37,60 € brutto | nicht gefunden | nicht gefunden | 250 g glänzend, Standardlieferung. [Link](https://www.flyermaschine.de/Flyer/A4-4-4-farbig-250g-Bilderdruck-glaenzend/) | Suche |
| Onlineprinters | 49,56 € netto | nicht gefunden | nicht gefunden | 4/4, unklar ob mit Versand. [Link](https://www.onlineprinters.de/p/flyer-din-a4-beidseitig-bedruckt) | Suche |

**Visitenkarten, 85 × 55 mm, beidseitig**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| SAXOPRINT | ab 14,41 € | nicht gefunden | nicht gefunden | 400 g glänzend, 4/4, inkl. Versand. Mit UV-Lack ca. 20,29 €. [Link](https://www.saxoprint.de/geschaeftsausstattung/visitenkarten) | Suche |
| Online-Druckerei Köln | 19,62 € netto / 23,35 € brutto | nicht gefunden | nicht gefunden | 300 g, 85 × 54 mm, zzgl. Versand. [Link](https://online-druckerei-koeln.de/100-visitenkarten-guenstig/) | Suche |
| mydisplays | 19,94 € netto | nicht gefunden | nicht gefunden | 300 g, doppelseitig 4-farbig. [Link](https://www.mydisplays.net/visitenkarten-1) | Suche |

---

## Schweiz

### Anbieter

| Anbieter | Link | Neutralversand | Schnittstelle / Sammelbestellung | Lieferzeit | Versand |
|---|---|---|---|---|---|
| Onlineprinters CH | [de.onlineprinters.ch](https://de.onlineprinters.ch/k/broschueren) | nicht gefunden | nicht gefunden | nicht gefunden | wirbt mit versandkostenfrei |
| druckfee.ch | [druckfee.ch](https://www.druckfee.ch/Flyer-DIN-Lang-online-drucken.htm) | nicht gefunden | nicht gefunden | nicht gefunden | wirbt mit Gratis-Priority-Lieferung |
| Flyermaschine.ch | [flyermaschine.ch](https://www.flyermaschine.ch/Flyer/DIN-lang-4-4-farbig-135g-Bilderdruck-matt/) | nicht gefunden | nicht gefunden | nicht gefunden | Versand inklusive (laut Seite) |
| Heididruck | [heididruck.swiss](https://heididruck.swiss/produkt/broschueren-a5-hochformat/) | nicht gefunden | nicht gefunden | nicht gefunden | nicht gefunden |
| Printzessin | [printzessin.ch](https://www.printzessin.ch/broschueren) | nicht gefunden | nicht gefunden | nicht gefunden | nicht gefunden |

Hinweis: wir-machen-druck und print24 haben eigene CH-Shops ([wir-machen-druck.ch](https://www.wir-machen-druck.ch/flyer-din-lang-hoch-mit-hks-farben-guenstig-drucken,category,13758.html),
[print24.com/ch-de](https://print24.com/ch-de/druckprodukte/flyer/flyer-din-lang)). Ob dort **in der Schweiz gedruckt**
wird oder in Deutschland mit Verzollung, habe ich nicht herausgefunden. Das gilt auch für
Onlineprinters CH. Bitte nachfragen, das war ja der Grund für die Trennung DE / CH.

### Preise Schweiz (CHF)

**Broschüre A5, 28 Seiten, Klammerheftung, 4-farbig, matt**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| Heididruck | ab CHF 215.00 exkl. MwSt. | nicht gefunden | nicht gefunden | Auflage 50 oder 100, 12 bis 40 Seiten, Spanne bis CHF 540.00, Preis für 28 Seiten unklar. [Link](https://heididruck.swiss/produkt/broschueren-a5-hochformat/) | abweichend |
| Printzessin | ab CHF 191.– | nicht gefunden | nicht gefunden | 100 Stück, Drahtheftung oder Klebebindung, Seitenzahl unklar. [Link](https://www.printzessin.ch/broschueren) | abweichend |
| druckfee.ch | CHF 154.20 netto / 166.70 brutto | nicht gefunden | nicht gefunden | Seite heißt „Broschüre A5 **8 Seiten**“, für 28 Seiten also deutlich mehr. [Link](https://www.druckfee.ch/broschuere-a5-8-seiten-drucken.htm) | abweichend |
| Onlineprinters CH | CHF 73.00 | nicht gefunden | nicht gefunden | Staffel passt laut Suche nicht eindeutig zur Konfiguration. [Link](https://de.onlineprinters.ch/p/broschueren-klammerheftung-a5) | abweichend |

**Flyer DIN lang, beidseitig**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| druckfee.ch | CHF 57.60 netto / 62.25 brutto | nicht gefunden | nicht gefunden | 100 Stück DIN lang, Versand laut Seite inklusive. [Link](https://www.druckfee.ch/Flyer-DIN-Lang-online-drucken.htm) | Suche |
| Flyermaschine.ch | CHF 70.56 | nicht gefunden | nicht gefunden | 135 g matt, 4/4, Versand inklusive. Mit 250 g glänzend CHF 73.44. [Link](https://www.flyermaschine.ch/Flyer/DIN-lang-4-4-farbig-135g-Bilderdruck-matt/) | Suche |
| Maxiprint | CHF 40.34 netto / 43.60 brutto | nicht gefunden | nicht gefunden | Format 105 × 210 mm, Menge im Auszug unklar. [Link](https://maxiprint.ch/en/p/flyer/flyer-din-lang-105x210-mm.html) | abweichend |

**Einzelblatt A4, beidseitig (Detox-Blatt)**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| druckfee.ch | CHF 65.60 netto / 70.90 brutto | nicht gefunden | nicht gefunden | Versand laut Seite inklusive. [Link](https://www.druckfee.ch/flyer-a4-drucken-lassen.htm) | Suche |
| Onlineprinters CH | CHF 56.61 | nicht gefunden | nicht gefunden | Basispreis A4 4/4, Papier und Optionen kosten extra. [Link](https://de.onlineprinters.ch/p/flyer-a4) | Suche |
| Posterprint | ca. CHF 41 | nicht gefunden | nicht gefunden | 0,41 je Stück bis 100, inkl. 8,1 % MwSt., möglicherweise nur einseitig. [Link](https://www.posterprint-online.ch/de/flyer-a4/PPO10045) | abweichend |

**Visitenkarten, 85 × 55 mm, beidseitig**

| Anbieter | 100 | 200 | 500 | Was der Auszug sagt | Stand |
|---|---|---|---|---|---|
| Onlineprinters CH | CHF 30.88 | nicht gefunden | nicht gefunden | 4/4, als netto ausgewiesen, Versand unklar. [Link](https://de.onlineprinters.ch/p/visitenkarten-4-4-farbig-85x55mm) | Suche |
| Wanapix | CHF 11.95 | nicht gefunden | nicht gefunden | zweiseitig, 300 g, MwSt. unklar. [Link](https://wanapix.ch/personalisierte-visitenkarten) | Suche |
| Bacher Onlinedruck | CHF 164.55 brutto | nicht gefunden | nicht gefunden | Same-Day-Express, inkl. Versand. Für uns zu teuer, nur zum Vergleich. [Link](https://bacher-onlinedruck.ch/visitenkarten-zweiseitig-farbig-85x55-mm-same-day-express.htm) | Suche |
| cardprint.ch | nicht gefunden | nicht gefunden | nicht gefunden | wirbt mit „500 Visitenkarten Fr. 18.70“, ein- oder beidseitig unklar, Seite älter. [Link](https://www.cardprint.ch/) | abweichend |

---

## Was ich daraus mitnehme (keine Entscheidung, nur Beobachtung)

- **Broschüre ist der teure Posten.** Für die 28-seitige A5-Broschüre habe ich in keinem Land einen
  passenden Preis für 100 Stück gefunden. In der Schweiz deuten die Auszüge auf klar über
  CHF 150 für 100 Stück hin. Das sollte zuerst angefragt werden.
- **Flyer, A4-Blatt und Visitenkarten** liegen in Deutschland für 100 Stück nach den Auszügen im
  Bereich 15 bis 50 €, in der Schweiz eher 30 bis 70 CHF. Schweiz ist spürbar teurer.
- **Schnittstelle:** In Deutschland nennen FLYERALARM PRO, SAXOPRINT und DigitalDruck-Fabrik eine
  Schnittstelle oder Reseller-Anbindung mit Neutralversand. Für die Schweiz habe ich keine gefunden.

---

## So prüfst du die Preise selbst nach (20 Minuten je Anbieter)

Im Konfigurator genau diese Werte einstellen und Netto, Brutto und Versand getrennt notieren:

| Dokument | Format | Umfang | Druck | Papier |
|---|---|---|---|---|
| Broschüre | A5 hoch | 28 Seiten inkl. Umschlag, Klammerheftung | 4/4 | Innen 135 g matt, Umschlag 250 g matt (Vorschlag, bitte bestätigen) |
| Flyer | DIN lang hoch (99 × 210 mm) | 2 Seiten | 4/4 | 170 g matt |
| Detox-Blatt | A4 hoch | 2 Seiten | 4/4 | 135 g matt |
| Visitenkarten | 85 × 55 mm | 2 Seiten | 4/4 | 350 g matt |

Mengen 100, 200, 500. Standardproduktion, kein Express. Lieferadresse: einmal Deutschland, einmal
Schweiz.

## Mustertext für eine Anfrage per Mail

> Betreff: Anfrage Reseller-Konditionen, personalisierte Kleinauflagen mit Direktversand
>
> Hallo,
>
> wir stellen für Vertriebspartner personalisiertes Werbematerial her. Jeder Partner bekommt eigene
> Druckdateien (Name, Kontakt, QR-Code) und eine eigene Lieferung an seine Adresse. Wir rechnen mit
> {{ANZAHL_PARTNER}} Partnern im ersten Jahr, je Partner 100 bis 200 Stück je Dokument.
>
> Wir bräuchten Preise für: Broschüre A5, 28 Seiten, Klammerheftung, 4/4, matt; Flyer DIN lang 4/4;
> A4-Blatt 4/4; Visitenkarten 85 × 55 mm 4/4. Jeweils 100, 200 und 500 Stück.
>
> Dazu bitte:
> 1. Lieferzeit und Versandkosten an eine Adresse in {{LAND}}.
> 2. Neutralversand mit unserem Absender möglich?
> 3. Gibt es eine Schnittstelle (API) oder eine Sammelbestellung mit mehreren Lieferadressen?
> 4. Wird in {{LAND}} gedruckt?
>
> Danke und viele Grüße
> {{ANBIETER}}

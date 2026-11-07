# Entscheidungsfälle aus der Deep-Fassung (Fälle 01 bis 16, End-to-End-Beispiel)

_Sechzehn durchgerechnete Entscheidungsfälle mit Optionen, Gate und Umkehrbedingung, das 30/60/90-Beispiel „KI im Vertrieb“ und die Rechenprüfungen. Alle Zahlen sind erfunden [B]._

## D12. Entscheidungsszenarien: Kalibrierungsfälle [B]

_Herkunft: Deepfassung, Zeilen 960 bis 1409_

**Leseregel:** Alle Fälle sind **synthetische Rechenbeispiele**. Empfehlungen gelten **nur unter den angegebenen Annahmen** und zeigen die Struktur einer Entscheidung, nicht empirische Erfolgswahrscheinlichkeiten. Die Fallstruktur ist immer `Problem → Diagnose/Analyse → Optionen und Trade-offs → Entscheidung → Umsetzung → Gate/Konterindikation`.

### Fall 01: Agentur: Mehr Neukunden oder Scope/Preis reparieren?

**Problem.** Eine Agentur mit 12 Retainer-Kunden à 2.000 € netto monatlich möchte von 24.000 € auf 40.000 € Umsatz skalieren. Das Team arbeitet unter Zeitdruck, der Gründer prüft alle Ergebnisse.

**Fakten und Analyse.** Synthetischer Baseline-Monat:
- Umsatz: `12 × 2.000 = 24.000 €`.
- Variable Delivery-Kosten je Kunde: 900 €.
- `CM1 = 12 × (2.000−900) = 13.200 €`, bevor allgemeine Fixkosten berücksichtigt sind.
- 30 % der Gründerzeit entfällt auf Ausnahmen/Nacharbeit; hoher Anteil unklarer Kundenwünsche.
- Angebotsversprechen: „alles für Wachstum“. Ausgelieferter Scope variiert stark.

**Ursachenhypothese:** Nicht primär fehlende Leads, sondern fehlende Standardisierung und unbepreiste Ausnahmen. Gegenhypothese: Das Team ist trotz sauberem Scope falsch besetzt. Erforderliche Evidenz: Zeit- und Nacharbeitslogs pro Kunde.

**Optionen/Trade-offs.**
- A, Paid Acquisition: erhöht Umsatz schneller, vergrößert aber ungeklärte Delivery-Last; Risiko schlechter Retention.
- B, Junior einstellen: Kapazität, aber Fixkosten/Ramp-up und weiterhin unklare Auftragsdefinition.
- C, einheitliches Kernpaket, Change Requests, Preiserhöhung zunächst für Neukunden: kurzfristig mögliche Conversion-Verluste, langfristig kontrollierbarer CM.
- D, nicht skalieren, Premium-Boutique bleiben: sinnvoll, falls Founder bewusst Craft wählt und Nachfrage begrenzt werden kann.

**Vergleichsrechnung:** Nach Pilot soll ein standardisiertes Angebot 2.600 € kosten, bei 1.000 € direkten Kosten. Schon **10** solche Kunden erzeugten `10 × 1.600 = 16.000 €` CM1, also 2.800 € mehr als heute, **vor** Übergangskosten, Abwanderung und neuen Fixkosten. Das ist eine Sensitivität, kein Preisakzeptanzbeweis.

**Empfehlung.** **C vor A/B**, solange Scope Creep und QA die Engpässe sind. Nicht das Umsatzziel zum Vorwand nehmen, ein ineffizientes System zu beschleunigen.

**Umsetzung.**
- Tag 1–3: zehn Delivery-Fälle auditieren: zugesagt, geliefert, Stunden, QA, Sonderwünsche.
- Tag 4–7: ein Kernpaket mit drei klaren Grenzen und Change-Request-Preis; Delivery-Checklist.
- Woche 2–4: fünf echte neue Angebote, Preis/Einwand/Abschluss/realen Aufwand tracken.
- Tag 30: Standardfall-Frequenz und CM pro Delivery-Stunde prüfen.
- Tag 60: QA an einen Team-Owner delegieren; Gründer nur Eskalationen.
- Tag 90: erst bei stabiler Lieferqualität zusätzliche Akquise.

**Gate.** Fortsetzen, wenn `CM/Delivery-Stunde` steigt und die fristgerecht akzeptierte Delivery nicht sinkt. **Revidieren**, wenn Preisvertrauen stark bricht oder die teurere Leistung tatsächlich mehr als kalkulierte 1.000 € kostet.

### Fall 02: Lokaler Reinigungsservice: Marketing ist nicht das Engpassgeschäft

**Problem.** Ein Reinigungsbetrieb hat viele Anfragen, kann aber Termine nicht besetzen. Geschäftsführung fordert neue Anzeigen.

**Fakten und Analyse.**
- 240 qualifizierte Aufträge pro Monat werden nachgefragt; nur 180 verlässlich ausführbar.
- Netto-Preis 180 €/Auftrag, variable Leistungskosten 100 € → `CM1 = 80 €`.
- Maximal möglicher Zusatz-CM bei Behebung der Kapazitätslücke: `60 × 80 = 4.800 €/Monat`, vor Recruiting- und QA-Zusatzkosten.
- No-Shows von Mitarbeitenden und Nacharbeit steigen.

**Hypothese [A]:** Recruiting, Schulung und Einsatzzuverlässigkeit limitieren Durchsatz, nicht Kundengewinnung. Prüfen: Sind die 60 nicht ausgeführten Aufträge wirklich kaufbereit? Wenn es nur unverbindliche Anfragen sind, ist die Berechnung ein Oberlimit.

**Optionen/Trade-offs.**
- A, Ads erhöhen: nur sinnvoll, falls Nachfrage *und* Kapazität fehlen.
- B, Preise anheben: Nachfrage steuern, kurzfristig höhere CM; kann Kundenverluste erzeugen.
- C, Hiring-Funnel, Arbeitsprobe, Onboarding und Zuverlässigkeitsbonus: baut echten Durchsatz auf, braucht Recruitingkosten und Führung.
- D, ausgewählte Teilaufträge subcontracten: schneller, aber weniger Marge und Qualitätskontrolle.

**Empfehlung.** Zuerst C, eventuell kurzfristig B/D zur Auslastungssteuerung. A zurückstellen.

**Umsetzung.**
- Woche 1: Auftragsabsagegründe codieren, Schichtlücken und Standorte kartieren.
- Woche 2: Bewerberpipeline mit konkreten Tätigkeitsproben und Referenzcheck; keine diskriminierenden Auswahlkriterien.
- Woche 3–4: bezahltes Training, Checklisten, QA-Sampling, Eskalationsplan.
- Tage 30–60: zwei Kohorten vergleichen: No-Show, erste erfolgreiche Schicht, akzeptierte Aufträge je Mitarbeiter.
- Tage 61–90: nur profitable Schichten öffnen, Recruiting-Kanal mit bester *qualitätsbereinigter* Produktivität wiederholen.

**Gate.** Neue Kapazität muss nach Einarbeitung ausreichend `CM1` erzeugen, um Recruiting und wiederkehrende Zusatzkosten zu decken. Eine offene Stelle allein ist kein Erfolg. **Umkehren**, wenn Nachfrage weder buchbar noch preislich belastbar ist.

### Fall 03: B2B SaaS: Neuakquise kaschiert einen Retention-Defekt

**Problem.** SaaS meldet „11.000 € neues MRR pro Monat“, wächst aber schwächer als erwartet.

**Fakten und Analyse.** Zu Beginn des Monats: 100.000 € MRR; Gross Revenue Churn 7 % = 7.000 € verlorenes MRR, neue Kunden +11.000 €, Expansion +2.000 €. Vereinfachter Monatsendstand:
`100.000 − 7.000 + 11.000 + 2.000 = 106.000 € MRR` → Nettozuwachs 6.000 €.

Wichtig: Hier ist die 7-%-Rate **für die gegebene Monatseröffnungskohorte**, ohne implizite jährliche Hochrechnung.

**Hypothesen.** (1) Aktivierung dauert zu lange; (2) neue Akquise zieht schlecht passende Kunden; (3) Produktversprechen stimmt nicht; (4) Preis ist falsch. Vorläufige Evidenz: Kündiger nutzen zentrale Funktion vor Kündigung kaum. Das stützt Aktivierung, beweist sie aber nicht.

**Optionen/Trade-offs.**
- A, Mehr Paid Acquisition: schneller neues MRR, mehr Budget und wahrscheinlich mehr Churn.
- B, Onboarding/Time-to-Value verbessern: Wirkung verzögert, möglicherweise nachhaltig.
- C, Preis erhöhen: kurzfristiger ARPA-Hebel, kann negative Churn verstärken.
- D, Segmentmix ändern: geringere Leadmenge, vielleicht höhere Retention.

**Ökonomische Schwelle:** Würde der Gross Revenue Churn der aktuellen 100.000-€-Startkohorte in einem vergleichbaren Monat von 7 auf 5 % fallen, entspräche das **2.000 € weniger verlorenem MRR in diesem Monat**. Die längerfristige Wirkung hängt von Folge-Churn, Expansion, Kosten und Zufall ab; nicht einfach „2.000 × 12“ als sicheren Gewinn buchen.

**Empfehlung.** Aktive Churn-Ursache klären und einen begrenzten Onboarding-Test vor aggressivem Akquise-Scale durchführen; zusätzliche Leads nur in Kohorten mit bewiesener Aktivierung ausbauen.

**Umsetzung.**
- Tag 1–7: Aktivierungsdefinition und Event-Funnel einheitlich; kündigende Kohorten nach Kanal und Segment.
- Tag 8–30: zwei Onboarding-Wege testen; `Time-to-First-Value` und `activated by day 14` messen.
- Tag 31–60: Kohorten mit tatsächlichem Nutzungsverhalten nachziehen.
- Tag 61–90: Frühindikatoren und Kündigungen gemeinsam interpretieren; erst dann Budget umschichten.

**Gate.** Gewonnene Aktivierung ohne Verbesserung von Retention/Produktnutzen ist noch kein Erfolg. **Umkehren**, wenn Kündigungen vor allem von produktunabhängigen Preis-/Beschaffungsereignissen ausgehen.

### Fall 04: E-Commerce: Großes Sales-Volumen, schwache Kundenökonomie

**Problem.** Ein Onlineshop möchte sein Werbebudget verdoppeln, weil „Umsatz skaliert“.

**Fakten und Analyse.** Pro Neukunden-Erstbestellung:
- AOV netto: 55 €.
- Ware: 27 €, Versand/Handling: 6 €, erwartete Retouren-/Refundkosten: 4 €, Payment: 2 €.
- `CM1 = 55−27−6−4−2 = 16 €`.
- Inkrementeller Erstkunden-CAC: 19 €.
- `CM2_new = −3 €` vor allgemeinen Fixkosten.

Für **nur** ein demonstratives Szenario: 25 % der Kohorte kauft innerhalb 90 Tagen **genau einmal** erneut mit gleichen 16 € CM1 und ohne weitere Akquisitionskosten. Dann erwarteter zusätzlicher CM = `0,25 × 16 = 4 €` und bisher `CM_life_net ≈ 1 €` (90-Tage-Fenster, undiskontiert, vor Overhead). Die Realität kann abweichen; Retouren/zweite Kaufanreize müssen korrekt eingerechnet sein.

**Optionen/Trade-offs.**
- A, Budget verdoppeln: Wachstum nur sinnvoll, wenn *marginaler* CAC, Käuferqualität und Cash tragbar sind.
- B, Erstbestellungsangebot/Warenkorb verbessern: AOV, Bundle, Logistik, Risiko höherer Retouren.
- C, Repeat-Mechanik aufbauen: Segmentierte Replenishment-Erinnerungen, Kundennutzen, rechtmäßige Kommunikation; Wirkung über Zeit.
- D, Kosten/Beschaffung optimieren: Risiko auf Produktqualität.

**Empfehlung.** **Kein pauschales Budget-Doubling**; zuerst die Kohortenökonomie und Grenz-CAC messen. Anschließend eine begrenzte Wiederkaufs-/Bundle-Hypothese testen.

**Umsetzung.**
- 7 Tage: saubere Kanal-/Kohortenrechnung mit tatsächlichen Refunds.
- 30 Tage: ein Bundle-Test und ein Reorder-Test; Opt-in und Kundennutzen beachten.
- 60 Tage: 30-/60-Tage-Repeat nach Kohorte; Retouren und Supportkosten nachziehen.
- 90 Tage: only increase spend when marginal `CM_life_net` im akzeptierten Messfenster positiv und Cash-Trough tragbar ist.

**Gate.** Neue Kohorten müssen nicht nur Umsatz bringen, sondern einen dokumentierten inkrementellen Zahlungsstrom. **Umkehren**, wenn Brand-/Distribution-Effekte die direkte Attribution unzuverlässig machen; dann zusätzliche inkrementelle Tests.

### Fall 05: Höhere Preise: Wann rechtfertigt eine geringere Abschlussquote den Schritt?

**Problem.** Anbieter will eine Dienstleistung von 1.000 € auf 1.250 € erhöhen.

**Fakten und Analyse.** Alt: 60 Verkäufe/Monat, 400 € variable Kosten = `60 × 600 = 36.000 € CM1`. Neu: 450 € variable Kosten wegen zusätzlicher Leistung, `CM1_pro_sale = 800 €`.

**Gleichstand:** `36.000 / 800 = 45 Verkäufe`. Bei 44 Verkäufen wären es 35.200 € CM1 und somit **800 € weniger** als heute; bei 50 Verkäufen wären es 40.000 € und **4.000 € mehr**. Die höheren Preise allein beweisen keine Ergebnisverbesserung.

**Optionen/Trade-offs.**
- A, alle Verträge sofort repricen: hoher kurzfristiger Hebel, potenzieller Churn/Vertrauensverlust und Vertragsrisiko.
- B, zunächst nur Neukunden: saubereres Signal, langsamerer Gesamteffekt.
- C, gleicher Preis, Scope abgrenzen: verbessert CM ohne WTP-Schock.
- D, Premium-Paket neben Basis: segmentiert WTP, erhöht Komplexität.

**Empfehlung.** B oder D testen, je nach klar unterschiedlichen Jobs; C sofort nutzen, wenn Scope Creep dokumentiert ist. Bestehende Verträge und berechtigte Erwartungen respektieren.

**Umsetzung.**
- Vor Test: Neukunden-Angebotsvolumen, Win Rate, Sales-Zyklus, Segment/Leadmix.
- 30 Tage: vergleichbaren qualifizierten Interessenten neue Preislogik anbieten; echte Verluste nach Grund klassifizieren.
- 60 Tage: tatsächliche Delivery-Kosten nachziehen.
- 90 Tage: Preisstrategie auf Basis `CM1 pro qualifizierter Opportunity` und Churn erweitern, nicht nur Quote.

**Gate.** Neue Preisvariante benötigt unter gleichen Fixkosten mindestens 45 vergleichbare Sales oder äquivalenten zusätzlichen Lifetime Contribution. **Umkehren**, wenn Käuferqualität, Sales-Zyklus und Refunds den Modellvorteil aufzehren.

### Fall 06: Gewinn auf dem Papier, Liquiditätsloch in der Realität

**Problem.** Ein B2B-Projektgeschäft ist deckungsbeitragsstark, kann aber neues Wachstum nicht vorfinanzieren.

**Fakten und Analyse.** Monatlich 20 neue Projekte:
- Vertragswert netto: je 10.000 € = 200.000 €.
- Direkte Auszahlungen fallen früh an: je 6.000 € = 120.000 € im jeweiligen Startmonat.
- Kunden zahlen vereinfacht 60 Tage nach Rechnungsstellung; kein voriger Receivables-Bestand.
- Im ersten und zweiten Monat fließen jeweils 120.000 € Kosten ab, aber noch kein Umsatz ein. **Cash-Trough vor erster Zahlung: −240.000 €**, exklusive Fixkosten und Steuern. Ab Monat 3 beginnt unter der vereinfachten Annahme der Geldeingang aus Monat 1.

`CM1 = 4.000 € je Projekt` und trotzdem existenzielle Vorfinanzierung. Das ist kein Widerspruch.

**Optionen/Trade-offs.**
- A, mehr Aufträge gewinnen: erhöht zunächst die Vorfinanzierungslücke.
- B, 40 % Anzahlung bei Start: bei 20 Projekten 80.000 € Einzahlungen im Startmonat; verbleibender zeitversetzter Cash-Bedarf wird unter sonst gleichen Bedingungen geringer.
- C, Lieferanten-/Gehaltszeitpunkte verschieben: Beziehungs- und Compliance-Risiko; keine unzulässige Verschleppung.
- D, Kreditlinie/Factoring: Liquidität gegen Finanzierungskosten und Vertragsbedingungen.
- E, Wachstum deckeln: schützt Cash, verzögert Ergebnis.

**Empfehlung.** Erst B/E prüfen, ergänzend eine rechtlich und ökonomisch tragbare Finanzierung; A nur innerhalb Cash-Guardrail.

**Umsetzung.**
- Woche 1: 13-Wochen-Cash nach Wochen, offene Rechnungen, konkrete Payables, Forderungsausfälle, Steuern.
- Woche 2: Anzahlungs-/Meilensteinmodell vertraglich entwickeln und an reale Kunden verkaufen.
- Tage 30–60: Cash Trough mit tatsächlichen Eingängen und Forderungsalter vergleichen.
- Tag 90: neue Kapazität nur freigeben, wenn konservative 13-Wochen-Tiefstliquidität über vereinbartem Puffer liegt.

**Gate.** Zahlungsfähigkeit hat Vorrang vor positiven GuV-Modellen. **Umkehren**, falls Kundensegment Anzahlungen grundsätzlich ablehnt und alternatives Kapital günstiger/gesichert ist.

### Fall 07: Kanalbudget: Das beste Durchschnitts-CAC ist nicht der beste nächste Euro

**Problem.** B2B-Anbieter muss zwischen Paid Inbound und Empfehlungen verteilen.

**Fakten und Analyse pro Quartal.**
- Paid: 1.000 Leads, 5 % qualifiziert (=50), 20 % Win (=10 Kunden). Vollständig zugerechnete inkrementelle Spend-/Sales-Kosten = 20.000 € → `CAC_paid = 2.000 €`.
- Referrals: 100 Leads, 60 % qualifiziert (=60), 30 % Win (=18 Kunden). Incentives und Sales-Zeit = 18.000 € → `CAC_ref = 1.000 €`.
- Erwarteter vor-CAC-Kundenbeitrag im modellierten Lifecycle: 4.500 € (muss in realen Daten bewiesen sein).
- Für Referral entspräche das `4.500−1.000 = 3.500 €` nach CAC; Paid `4.500−2.000 = 2.500 €`.

**Aber:** Referrals sind möglicherweise auf 18 Kunden begrenzt. Selbst wenn ihr Durchschnitt attraktiver ist, lässt sich die nächste Menge nicht automatisch zum selben CAC gewinnen. Zudem kann nur Kapazität für 20 Onboardings vorhanden sein.

**Optionen/Trade-offs.**
- A, alles Referral: niedriger Durchschnitts-CAC, begrenzte Skalierbarkeit.
- B, alle Paid: höhere Reichweite, teurer und eventuell anderer ICP.
- C, Referral-Pipeline bis zur nachweisbaren Grenze ausschöpfen, verbleibende **marginale** Kapazität mit Paid füllen.
- D, indirekte Partnerkanäle aufbauen: Potenzial, lange Vorlaufzeit und Komplexität.

**Empfehlung.** C. Bei 20 verfügbaren Onboarding-Plätzen zunächst die **qualifizierten, tatsächlich inkrementellen** Referral-Wins prüfen und restliche Plätze aus dem Kanal mit positiver marginaler Ökonomie füllen. Kein Lead darf doppelt kanalisiert werden.

**Umsetzung.**
- 7 Tage: Quellen- und Attributionsdefinition auditieren.
- 30 Tage: Funnel pro Source, Vertriebseinsatz, Retention nach Kohorte tracken.
- 60 Tage: Pilot für zusätzliche Referral-Anreize und sinkende Grenzproduktivität prüfen.
- 90 Tage: Budget nach `CM pro begrenztem Onboarding-Slot` und marginalem CAC, nicht Kanal-Prestige.

**Gate.** Kanalverlagerung nur bei hinreichender Retention und frei werdender/gesicherter Delivery-Kapazität. **Umkehren**, falls vermeintliche Referrals ohnehin eingehende Kunden sind und der Kanal nur kreditierte Verkäufe umetikettiert.

### Fall 08: Drei Geschäftsmodelle für dieselbe KI-Geschäftsidee

**Problem.** Ein technisch versierter Gründer will Abläufe bei mittelständischen Dienstleistern automatisieren, weiß aber nicht, ob er Beratung, standardisierte Implementierung oder SaaS verkaufen soll.

**Fakten und Analyse.** Nur illustratives Entscheidungsmodell:
- **A Individuelle Projekte:** Preis 4.000 €, variable Delivery 1.500 €, vier bezahlte Projekte könnten `4 × 2.500 = 10.000 € CM1` erzeugen; Founder-Stunden und Akquise noch nicht bewertet.
- **B Produktisierte Installation:** Preis 500 €, variable Kosten 250 €, 15 Installationen könnten `15 × 250 = 3.750 € CM1` erzeugen; höherer Durchsatz erforderlich.
- **C SaaS:** geplante Entwicklung 60.000 €, vier Monate bis Mindestfunktion, noch keine Zahlungs-/Nutzungsbelege. Keine seriöse Renditeprognose möglich.

**Kritische Frage:** Welches Problem ist zugleich akkut, wiederkehrend, kaufbar und nachweislich automatisierbar? Die drei Angebotsformen adressieren ggf. unterschiedliche Kunden; Umsatz- und Kapazitätsannahmen sind **nicht** validiert.

**Optionen/Trade-offs.**
- A, schneller Customer Discovery und Cash, geringe Wiederholbarkeit.
- B, bessere Standardisierung, aber nur bei homogenen Integrationen.
- C, potenziell niedrige Grenzkosten, aber hohe Produkt-, Kapital- und Adoption-Risiken.
- D, „concierge“-/manueller Service mit Software-Assistenz, später Produkt ableiten.

**Empfehlung.** Mit **A oder D als eng fokussiertem bezahltem Pilot** starten und aus wiederkehrenden Implementierungsmustern B testen; C nur bei nachgewiesener Nachfrage- und Wiederholungsstruktur mit vertretbarer Finanzierung.

**Umsetzung.**
- 0–7 Tage: drei Jobs, je fünf mögliche Käufer, Problemfall und heutige Prozesskosten.
- 8–30 Tage: echte Angebote und bis zu drei bezahlte Piloten im **gleichen** Job.
- 31–60 Tage: alle Integrationstypen, Fehlerklassen, Arbeitsstunden und Wiederholungsschritte codieren.
- 61–90 Tage: Entscheid zwischen Service-Skalierung, produktisiertem Service und engstem funktionsfähigen Softwaremodul.

**Gate.** Software nur bauen, wenn ein hinreichend homogener, regelmäßig wiederkehrender Job existiert, Kunden das Ergebnis nutzen, ein wirtschaftlicher Vertriebspfad erkennbar ist und ein verantwortlicher technischer Produkt-Owner vorhanden ist. **Umkehren**, falls ein API-/Datenzugriff dauerhaft unzuverlässig oder nicht zulässig ist.

### Fall 09: Automation: Spart ein Bot tatsächlich Geld?

**Problem.** Ein Servicebetrieb möchte 800 monatliche Supporttickets automatisieren und erwartet „vierstellige Einsparungen“.

**Fakten und Analyse.**
- 800 Tickets × 8 Minuten = 6.400 Minuten = **106,7 Stunden** im Monat.
- Verrechneter Vollkostensatz: 30 €/Stunde; maximaler theoretischer Arbeitswert rund 3.200 €.
- Pilot zeigt: 45 % Tickets ohne menschliche Nacharbeit automatisierbar (=360 Tickets), damit **48 Stunden** potenzielle Zeitentlastung = 1.440 € Kapazitätswert.
- Betriebssystemkosten 300 €/Monat; QA 8 Stunden × 30 = 240 €/Monat; erwartete Fehlerkosten 200 €/Monat.
- Optimistischer Kapazitäts-Nettoeffekt: `1.440−300−240−200 = 700 €/Monat`, **nur wenn** die 48 Stunden in echte Einsparungen oder zurechenbare zusätzliche Aufträge umgewandelt werden.
- Projektaufwand 6.000 €; rein rechnerischer Payback `6.000/700 ≈ 8,6 Monate`, noch ohne Kapitalkosten und steigende Komplexität.

**Optionen/Trade-offs.**
- A, Vollautomation: kurze Bedienzeit, teure Fehlentscheidungen.
- B, nur Standardklassen automatisieren, eskalieren: geringere Abdeckung, höhere Kontrollierbarkeit.
- C, FAQ/Prozess korrigieren: kann Tickets ganz eliminieren, oft billiger als ein Bot.
- D, keine Automation, aber sauberes Routing: weniger Technikrisiko.

**Empfehlung.** Zuerst C prüfen, dann **B mit Human-in-the-loop**. Vollautomation ohne definierte Fehlerschranke ablehnen.

**Umsetzung.**
- Woche 1: Ticket-Taxonomie, Wiederholungsgründe, heikle Inhalte und Datenschutz.
- Woche 2: 100 historische Tickets kontrolliert gegen Akzeptanzkriterien testen.
- Woche 3–4: Piloteinsatz nur für niedrige Risikoklassen, Logging und Rollback.
- Tage 31–60: echte Nacharbeitszeit und Defect Cost messen.
- Tag 90: Cash-/CM-Wirkung separat vom Zeitwert ausweisen.

**Gate.** Nur fortführen, wenn akzeptierte Antworten, Kundenschutz, Kosten und reale Kapazitätsverwendung stimmen. **Umkehren**, wenn Fehler selten, aber sehr teuer oder sicherheitskritisch sind.

### Fall 10: Geografische Expansion vs. denselben Standort vertiefen

**Problem.** Ein regionales Serviceunternehmen möchte eine zweite Stadt erschließen, weil das Geschäft in Stadt A „stabil“ wirkt.

**Fakten und Analyse.**
- Stadt A: 160.000 € Monatsumsatz netto, 30 % CM nach zurechenbaren variablen Kosten = 48.000 €.
- Dispatch-/Service-Auslastung: 92 %, einige Termine verspätet; Mitarbeitertraining noch Gründerabhängig.
- Stadt B: einmaliger Launch von geschätzten 90.000 €, sechs Monate geplante zusätzliche Fixkosten von 15.000 €/Monat = 90.000 €. **Mindestens 180.000 € Cashbedarf** vor möglichen lokalen variablen Verlusten/Receivables, wenn keine weiteren Einnahmen angenommen werden.
- Nachfrage, lokale Mitarbeiterverfügbarkeit und Beschaffungskosten in B unbekannt.

**Optionen/Trade-offs.**
- A, sofort expandieren: potenzielle Wachstumsoption, große irreversible Cash-Bindung.
- B, Stadt A operativ härten: höhere Servicequalität und eventuell mehr profitable Kapazität; langsamerer Markteintritt.
- C, Stadt B mit wenigen bezahlten Pilotaufträgen und Partnern testen: niedrigerer Startaufwand, begrenzte Repräsentativität.
- D, Franchise/Lizenz: geringerer Eigenkapitaleinsatz, Governance-/Markenrisiko.

**Empfehlung.** B + C statt A. Der fehlende Beweis betrifft nicht nur Nachfrage, sondern **lokales Talent- und Betriebssystem**.

**Umsetzung.**
- Tag 1–14: Kapazitätskurve Stadt A, Fehlerquote bei 80/90/95 % Auslastung, QA unabhängig vom Gründer.
- Tag 15–30: konkrete Stadt-B-Buyer und Mitarbeitenden-/Partnerinterviews; Zahlungsbelege.
- Tage 31–60: begrenzter Pilot ohne langfristige Fixkostenbindung.
- Tage 61–90: Modell der zweiten Stadt mit tatsächlich gemessenen Kosten, Sales-Zyklen und Cash.

**Gate.** Expansion nur, wenn Stadt A stabil replizierbar ist, Stadt B realen Kundenbeweis besitzt und Downside innerhalb Kapitalpuffer liegt. **Umkehren**, falls außergewöhnlich günstiger, zeitlich befristeter Zugang existiert und ein rechtlich/finanziell begrenzter Optionsvertrag möglich ist.

### Fall 11: Marketplace: Transaktionsvolumen ist kein Netzwerkbeweis

**Problem.** Ein Gründer verbindet lokale Anbieter und Käufer auf einer Plattform, möchte breit werben und 50 neue Orte aufnehmen.

**Fakten und Analyse.**
- 500 erfolgreiche Buchungen/Monat.
- Durchschnittliches GMV 100 € pro Buchung → 50.000 € GMV.
- Take Rate 15 % → Plattform-Nettoerlös **7.500 €** (ohne weitere Steuereffekte).
- Variable Payment-/Support-/Fraud-Kosten 9 € pro Buchung → 4.500 €, `CM1 = 3.000 €`.
- Neukundenwerbung kostet in diesem Monat 3.600 €; `CM nach Akquise = −600 €` **vor Fixkosten**, wenn alle 3.600 € korrekt auf diese Periode/Neukunden verteilt werden.
- Quote erfüllter qualifizierter Buchungsanfragen nur 65 %. Möglicherweise gibt es zu wenig passende Anbieter zur richtigen Zeit.

**Optionen/Trade-offs.**
- A, mehr Nachfrageseite: steigert Frustration bei fehlender Supply.
- B, Anbieterzahl pauschal erhöhen: kann Liquidität in den falschen Zeitfenstern nicht lösen.
- C, einen Stadtteil und eine Kategorie mit hoher Transaktionsdichte optimieren.
- D, Managed Service mit manueller Disposition: mehr Aufwand, bessere Verlässlichkeit, Lernchance.

**Empfehlung.** C + D für einen engen Wedge. **Netzwerkeffekt ist eine zu prüfende Hypothese**: Verbessert zusätzliche Angebotsdichte die Treffer-/Wiederkaufrate und senkt sie die Kosten der nächsten Transaktion?

**Umsetzung.**
- Woche 1: Buchungskohorten, Absagegründe und geografisch-zeitliche Supply-Dichte.
- Woche 2–4: genau ein Gebiet; zuverlässige Anbieter onboarden, Service-Level dokumentieren.
- Tage 31–60: `qualified request → successful fulfillment` und CM nach Supportkosten messen.
- Tag 90: erst in Nachbargebiete expandieren, wenn Liquidität und Wiederholung im Kerngebiet entstehen.

**Gate.** Wachstum ist nicht freigegeben, solange die erfüllte Buchungsquote zu niedrig für tragfähigen Kundenwert und die Akquisitionsökonomie negativ ist. **Umkehren**, wenn niedrige Fill Rate klar durch temporäre Nachfrage-Spitzen statt strukturelle Supply-Defizite erklärt ist.

### Fall 12: Kapitalallokation: Vier gute Ideen sind immer noch vier Kostenblöcke

**Problem.** Ein profitabler Operator erwägt gleichzeitig Produkt B, neue Region, Akquisition eines kleinen Wettbewerbers und Optimierung des Hauptgeschäfts.

**Fakten und Analyse.** Ein einziger Managing Director hat 20 verfügbare Entscheidungstage im Quartal; alle vier Initiativen wollen etwa 10 Tage. Die Ressource ist **Aufmerksamkeit**, nicht Kapital allein. Ohne eindeutige Verteilung ergibt die Liste 40 Tage Anspruch auf 20 Tage Kapazität.

**Optionen/Trade-offs.**
- A, alles parallel: vermeintliche Optionalität, wahrscheinlicher Fokusverlust und langsame Ausführung.
- B, bestehende Revenue Engine optimieren: höhere Evidenz und Wiederverwendung, aber weniger Neuheit.
- C, eine externe Wette als begrenzte Option: Lernwert ohne Vollcommitment.
- D, gleich alle drei Expansionen einstellen: kann realen Zeitdruck übersehen.

**Empfehlung [A/W].** B als Standard und maximal **eine** klar begrenzte Wette C. Sonst Opportunitätskosten dokumentieren. „Mehr Möglichkeiten“ ist kein Vorteil, wenn kritische Entscheidungen durch dieselbe Person blockiert werden.

**Umsetzung.**
- Tag 1–3: jede Initiative mit `CM-/Cash-Upside`, Worst-Case, Owner, Reversibilität, erforderlichen Founder-Tagen und Evidenz dokumentieren.
- Tag 4: Projekte mit regulatorischer/Cash-Gefahr aussortieren.
- Woche 2: nach marginaler Wirkung je Engpassstunde priorisieren.
- Tag 30: erste fokussierte Intervention messen.
- Tag 60: die Option außerhalb des Kerngeschäfts nur erweitern, wenn ein reales Signal erreicht ist.
- Tag 90: Kapital und Leitungskapazität erneut allokieren.

**Gate.** Keine neue Vollinitiative ohne unabhängigen Owner oder Wegfall einer anderen Verpflichtung. **Umkehren**, falls eine Option ein klar datiertes, einmaliges Marktfenster mit begrenztem downside und nachgewiesener Überrendite besitzt.

### Fall 13: Ist das Unternehmen schon verkaufbar?

**Problem.** Der Eigentümer eines Expertenservices erwägt einen Verkauf und hält einen EBITDA-Multiple für ausreichend.

**Fakten und Analyse.**
- Jahresumsatz 1,2 Mio. €, als „adjusted EBITDA“ ausgewiesenes Ergebnis 240.000 €.
- Ein wesentlicher Kundenanteil hängt direkt vom Gründer ab.
- Die in `adjusted EBITDA` nicht enthaltene realistische Ersatzfunktion des Gründers würde ungefähr 140.000 € pro Jahr kosten (illustrative Schätzung).
- Ergebnis nach Einpreisung dieser Ersatzkosten wäre vor weiteren Kaufpreis-/Integrationsanpassungen `240.000−140.000 = 100.000 €`. Das ist **keine** normative EBITDA-Bereinigung, sondern eine Due-Diligence-Sensitivität; vertragliche, buchhalterische und steuerliche Behandlung separat prüfen.

**Optionen/Trade-offs.**
- A, sofort verkaufen: Liquidität, aber Kaufpreisrisiko/ Earn-out/Integrationsabhängigkeit.
- B, 12–24 Monate Founder-Dependence abbauen: höhere operative Stabilität, Zeit- und Ausführungsrisiko.
- C, Minderheitsbeteiligung/Management-Buyout: Teil-Liquidität und fortgesetztes Risiko.
- D, weiter halten als Cashflow-Business: Return ohne Exit, aber Konzentration im Unternehmervermögen.

**Empfehlung.** Keine Bewertung aus einem frei gewählten Multiplikator ableiten. Zuerst Eigentümerrolle, Kundenkonzentration, EBITDA-Qualität, Cash Conversion, Verträge und Käuferanforderungen prüfen. Bei hoher Founder-Abhängigkeit eher B als direkte Vorbereitung, **außer** strategisches Timing oder persönliche Ziele sprechen anders.

**Umsetzung.**
- 0–30 Tage: Customer Concentration, Umsatzqualität, Owner-Tasks, bereinigte P&L, Forderungen, Verträge und Intellectual Property zusammentragen.
- 31–60 Tage: Sales/Delivery-Ownership übertragen, Referenzkunden ohne Founder testen.
- 61–90 Tage: Datenraum, dokumentierte SOPs, konkrete Käuferkriterien, indikatives Angebot mit professioneller rechtlicher/steuerlicher Begleitung.

**Gate.** Exit-Beschluss erst nach Vergleich des **risikoangepassten Nettoerlöses** mit realistischer Hold-/Build-Option und persönlichen Zielen. **Umkehren**, falls externes Angebot bereits einen ungewöhnlich attraktiven, verbindlich geprüften Preis bei begrenzten Verpflichtungen bietet.

### Fall 14: Gründerrolle: Solo-Premium oder eine Organisation?

**Problem.** Ein hochqualifizierter Berater hat mehr Nachfrage als freie Zeit und glaubt, er müsse ein Team aus 10 Leuten aufbauen.

**Fakten und Analyse.**
- 25 Projekte pro Jahr zu 8.000 € netto; variable Kosten 3.000 € → `25 × 5.000 = 125.000 € CM1/Jahr`.
- Nachfrage würde theoretisch 35 Projekte ermöglichen, aber Gründer kann nur 25 zuverlässig selbst liefern.
- Preis-Alternative: 24 Projekte pro Jahr zu 10.000 €, variable Kosten 3.200 € → `24 × 6.800 = 163.200 € CM1/Jahr`.
- Diese Alternative wäre 38.200 € höher vor Fixkosten/Steuern und ohne Beweis, dass 24 Käufer 10.000 € akzeptieren.

**Optionen/Trade-offs.**
- A, Solo-Premium (Craft): hohe Autonomie, Volumen-/Personenrisiko.
- B, Hybrid: Fachkraft bleibt Lead Expert, Delivery-Operator und Junior-Team bauen Kapazität; Recruiting/QA-Komplexität.
- C, Operator: Gründer überführt eigene Leistung in Organisation, gibt Craft-Tätigkeit teilweise ab; höheres Führungsrisiko.
- D, kleiner standardisierter Gruppen-/Produktanteil: Entkopplung, aber unklare Nachfrage.

**Empfehlung [A/W].** Vor Recruiting bewusst entscheiden, ob das gewünschte Ziel *mehr Einkommen*, *mehr Eigentümerwert*, *mehr freie Zeit* oder *mehr persönliche Facharbeit* ist. Bei Wunsch nach Craft und hoher Nachfrage **zunächst Preis-/Scope-Test A**. Bei bewusstem Ziel einer skalierenden Firma B mit QA-fähigem Senior starten.

**Umsetzung.**
- Woche 1: 25 Projekte nach CM, tatsächlicher Gründerzeit, Kundennutzen, Referenzen segmentieren.
- Tage 8–30: klare Premium-Scope-Variante an neue vergleichbare Leads testen.
- Tage 31–60: optional eine delegierbare Subaufgabe mit Arbeitsprobe, SOP, QA ausführen.
- Tage 61–90: anhand der Nachfrage-, Qualitäts- und Founder-Stunden-Daten die Rolle wählen.

**Gate.** Die gewählte Variante muss die **gewünschte Lebens-/Eigentümerfunktion** verbessern, nicht nur Umsatz. **Umkehren**, wenn Premiumpreis keine reale Zahlungsbereitschaft findet oder individuelles Ausfallrisiko den Vorteil überwiegt.

### Fall 15: Sales-Team verliert Deals: Wer hat tatsächlich ein Problem?

**Problem.** Sales beschwert sich über schlechte Leads, Marketing über schlechte Abschlüsse.

**Fakten und Analyse.** Für eine B2B-Lösung:
- 100 qualifizierte Angebote/Quartal;
- 18 gewonnene Deals; Nettoerlös je Deal 15.000 €, direkte Delivery 6.000 € → `CM1 = 9.000 € je Deal`.
- 82 verlorene/nicht entschiedene Deals; bei 33 Fällen ist „keine Entscheidung“ codiert (Kategorien müssen disjunkt sein; sonst Doppelzählung).
- Potenzieller zusätzlicher CM bei **zwei** weiteren gewonnenen Deals = 18.000 €, vor Sales- und Implementierungszusatzkosten.

**Hypothesen.**
- Status quo ist ausreichend, Problemwert nicht dringlich.
- Business Case ist nicht bewiesen.
- Economic Buyer ist zu spät beteiligt.
- Pilot/Implementierung wirkt riskant.
- Alternativ sind Leads tatsächlich falsch qualifiziert.

**Optionen/Trade-offs.**
- A, neues Skript für Closing: geringer Aufwand, kann echte Kaufhürden nicht lösen.
- B, bessere Qualifizierung und Economic-Buyer-Map: weniger Opportunities, mehr relevante.
- C, fokussierter Proof-of-Value-/Implementation-Plan: liefert Sicherheit, kostet Presales.
- D, mehr Inbound: erhöht Volumen, behebt Verlustgründe nicht.

**Empfehlung.** **B + C** testen. „No Decision“ ist ein strategischer Wettbewerber: der aktuelle Arbeitsmodus des Kunden.

**Umsetzung.**
- Woche 1: zehn No-Decision-Fälle rückblickend prüfen, Originalnotizen statt nur CRM-Auswahlfeld.
- Woche 2: eine kaufmännische Business-Case-Vorlage mit realen Inputannahmen, Budgetowner und Pilot-Abnahme.
- Tage 30–60: zwei vergleichbare Opportunity-Kohorten gegen bisherige Baseline auswerten; keine Scheinkausalität behaupten.
- Tag 90: entsprechend Ergebnis Angebot, Vertrieb oder ICP korrigieren.

**Gate.** Steigt `CM pro qualifiziertem Angebot`, ohne Kundenscope oder spätere Reklamation zu verschlechtern? **Umkehren**, wenn die Lost-Deal-Analyse zeigt, dass der Segment-Trigger tatsächlich zu schwach ist.

### Fall 16: Usage Pricing bei einem KI-Service: Wachstum kann die Marge auffressen

**Problem.** Ein Anbieter automatisiert Kundendokumente. Kunden wollen einen Pauschalpreis, die Verarbeitungskosten schwanken stark.

**Fakten und Analyse.** Zwei synthetische Nutzertypen:
- Typ L verarbeitet 100 Einheiten/Monat, direkte Kosten 0,20 €/Einheit = 20 €.
- Typ H verarbeitet 3.000 Einheiten/Monat, direkte Kosten = 600 €.
- Einheitlicher Preis 300 € pro Monat ergibt vor Support/Kundengewinnung bei L `CM1=280 €`, bei H `CM1=−300 €`.

**Optionen/Trade-offs.**
- A, reine Flatrate: einfach zu kaufen, Margenrisiko durch Power Users.
- B, reine Usage Fee: Kostennähe, unvorhersehbare Rechnung; kann Adoption bremsen.
- C, Grundpreis plus inkludiertes Kontingent plus fairen Mehrverbrauch: Kompromiss, Mess-/Kommunikationsaufwand.
- D, separate Enterprise-Verträge mit Mindestvolumen und Preisfloor: Vertriebskomplexität.

**Empfehlung.** C als Start-Hypothese, Preis-Caps und Transparenz; D für bekannte große Nutzungsprofile. Nicht vorschnell einen konkreten Tarif behaupten, solange Zahlungsbereitschaft und Lastverteilung unbekannt sind.

**Umsetzung.**
- Woche 1: Unit-Definition (z. B. verarbeitete erfolgreiche Dokumente) und tatsächliche Cost-to-Serve-Verteilung.
- Woche 2: Fair-Use-/Mehrverbrauchs-Entwurf; Kundeninterviews zu Vorhersagbarkeit und Budget.
- Tage 30–60: kleiner Pilot mit echten Nutzungsmengen, Rechnungssimulation vor Vertragsumstellung.
- Tage 61–90: Preis- und Produktguardrails nach `CM pro Account` und Nutzungsqualität stabilisieren.

**Gate.** Kein Paket, in dem ein leicht vorhersehbares Nutzungsprofil strukturell negativen direkten Beitrag erzeugt, ohne explizite strategische Finanzierung/Querfinanzierung. **Umkehren**, wenn zahlungsbereite Kunden Usage-Metrik nicht nachvollziehen oder sie Fehlanreize setzt.

## D13.2 So liest Claude einen Fall

_Herkunft: Deepfassung, Zeilen 1427 bis 1435_

1. Die Fallzahlen **niemals** als Branchenbenchmark übertragen.
2. Die **entscheidende Kausalkette** extrahieren, nicht eine Empfehlung blind kopieren.
3. Variablen auf reale Nutzerzahlen umbenennen und Datenstatus setzen.
4. Den **Schwellenwert** neu berechnen, an dem die Empfehlung kippt.
5. Explizit notieren, welche fehlende Information das Ergebnis ändert.
6. Die gewählte Option am realen Zeit-, Cash-, Personal- und Vertragskontext prüfen.

## D18. Vollständige 30/60/90-Synthese: Von „Ich will KI im Vertrieb einsetzen“ zu einer echten Geschäftsentscheidung [B/W]

_Herkunft: Deepfassung, Zeilen 2046 bis 2127_

**Dieses End-to-End-Beispiel dient der Reproduktion einer Methode.** Es enthält bewusst keine Behauptung über die tatsächliche Kaufbereitschaft realer Unternehmen.

### D18.1 Rohidee und Mindestfragen

Rohidee: „Ich will kleinen Firmen helfen, mit KI ihren Vertrieb zu automatisieren.“

Fehlende Informationen:
- Wer genau? Handwerker, B2B-Agenturen, Softwarefirmen?
- Welche beobachtbare Aufgabe? Meeting-Notizen, Angebotsentwurf, Routing, Follow-up?
- Wer darf und will zahlen?
- Welche Daten dürfen verarbeitet werden?
- Welche Fehlentscheidung hätte hohe Schadensfolgen?
- Welche Output-Einheit ist in 14 Tagen lieferbar?

**Arbeitsannahme H1:** B2B-Dienstleister mit 5–20 Sales-Mitarbeitenden verlieren Zeit durch nicht zeitnah erstellte, unvollständige CRM-Follow-ups. Diese Annahme ist **nicht bestätigt**.

### D18.2 Kleinster überprüfbarer Wedge

Kein „vollautomatisierter Vertrieb“. Pilot-Scope:

> Für ein klar definiertes Vertriebsteam werden aus bereits rechtmäßig freigegebenen Gesprächsnotizen strukturierte CRM-Entwürfe und Follow-up-Vorschläge erzeugt. Ein Mitarbeiter prüft jede ausgehende Nachricht. Der Test bewertet Erfassungszeit, Datenqualität, Fehlerrate und Akzeptanz durch Nutzer; kein ungarantierbares Revenue-Uplift-Versprechen.

Benötigte Inputs: vorhandene CRM-Prozesse, Einwilligungen/Rechtsgrundlagen und Sicherheitsanforderungen, 20–50 historische geeignete Fälle, definierter Owner, korrekte Zielsystemberechtigungen.

**Kritisches Risiko:** Falsche Kundeninformationen oder unerlaubte Datenverarbeitung. Deshalb zunächst Testdaten, menschliche Freigabe und nachvollziehbares Logging.

### D18.3 Beispielrechnung

Unter **fiktiven** Annahmen:
- 12 Sales-Mitarbeitende;
- 20 geeignete Fälle pro Person/Monat = 240 Fälle;
- heutiger manueller Aufwand 12 Minuten/Fall = 48 Stunden;
- nur 50 % des Aufwands durch Pilot nach QA sparbar = 24 Stunden Kapazität;
- Vollkostensatz 35 €/Stunde → 840 € **Kapazitätswert**, nicht automatisch Cash-Ersparnis;
- laufende Tool-/QA-Kosten 200 €/Monat;
- mögliches Netto-Kapazitätspotenzial 640 €/Monat.

**Konsequenz:** Ein Verkaufspreis von 2.000 €/Monat lässt sich durch reine Lohnkostenersparnis in diesem Beispiel **nicht** erklären. Ein solcher Preis würde zusätzlichen realen Nutzen brauchen (z. B. nachweislich höhere Abschlussqualität), den der Pilot bislang gerade **nicht** belegt. Besser ein engeres Segment mit größerem Problemwert, anderer Leistungsumfang oder andere Preisstrategie.

### D18.4 Ausführbarer Zeitplan mit Deliverables

| Zeitpunkt | Aufgabe | Artefakt | Evidenz-/Abbruchkriterium |
|---|---|---|---|
| Tag 1–3 | ICP/Job formulieren, Rechte prüfen | `01-hypothesis.md` | Buyer/Problem konkret |
| Tag 4–10 | echte vergangene Fälle untersuchen | `02-customer-evidence.md` | wiederkehrender Job und Kosten |
| Tag 11–20 | Kaufangebot und kleiner Pilot | `03-paid-pilot.md` | echter Käufer und Messrecht |
| Tag 21–30 | manuelle/assistierte Auslieferung | `04-pilot-actuals.csv` | QA und Kosten statt nur Demo |
| Tag 30 | `G30` | `05-gate-g30.md` | bezahlter Outcome/akzeptable Risiken |
| Tag 31–45 | Workflow standardisieren | `06-sop.md` | Standardfall ohne Founder |
| Tag 46–60 | zweite Kohorte ausliefern | `07-repeatability.csv` | wiederholbarer Wert/CM |
| Tag 60 | `G60` | `08-gate-g60.md` | Kosten und Zeit reproduzierbar |
| Tag 61–75 | einen Channel testweise ausbauen | `09-channel-test.md` | Grenz-CAC und Buyer Fit |
| Tag 76–90 | Cash/Kapazität/Qualität auditieren | `10-cash-capacity.md` | kein verdeckter Engpass |
| Tag 90 | `G90` | `11-decision.md` | Scale/Iterate/Pivot/Stop |

### D18.5 Alternative Entscheidungspfade

- **Problem akut, aber kein Buyer bezahlt:** Value Proposition/Budget-Buyer korrigieren, nicht Features addieren.
- **Buyer bezahlt, KI-Ausgabe unzuverlässig:** assistierte Dienstleistung oder engere Task-Klasse; keine autonome Freigabe.
- **Leistung gut, Grenzkosten hoch:** Scope vereinfachen, Preis-/Kundenmix anpassen.
- **Preis gut, Integration sehr individuell:** produktisierten Service oder hochpreisige Implementierung statt Low-Touch-SaaS.
- **Wiederholbarkeit bewiesen, Nutzung wiederkehrend:** Softwareprodukt und lizenzierte Automatisierung als **neue bewusste Investitionsentscheidung** prüfen.

### D18.6 Vollständiges Decision Memo (Kurzfassung)

**Beschluss:** Kein SaaS-Build freigeben, bevor mindestens ein konkreter, wiederholter und zahlungsrelevanter Workflow mit kontrollierter QA und belastbarer Wirtschaftlichkeit nachgewiesen ist.

**Fakten:** Derzeit nur ein Konzept; keine reale Zahlungs-, Nutzungs- oder Kostenbasis.

**Hauptunsicherheit:** wirtschaftlicher Kundennutzen je Workflow unter sicheren Daten- und Kontrollbedingungen.

**Optionen:** (1) Vollprodukt bauen, (2) manueller Pilot, (3) Produktidee stoppen.  
**Wahl:** (2) mit geringem Commitment.  
**G30:** echter Kaufbeleg + sichere, ausreichend gute Ausführung.  
**G60:** wiederholbare Delivery/CM bei gleicher Kundengruppe.  
**G90:** begrenzte Akquise, falls marginale Ökonomie, Cash und Qualitätsgrenzen passen.  
**Umkehrbedingung:** Kauf- und Nutzensignal bleibt nach fairen, zielgerichteten Tests aus oder der technische/Datenschutzrisiko-Betrieb ist nicht vertretbar.

## DA.3 Rechenprüfungen für Cases

_Herkunft: Deepfassung, Zeilen 2440 bis 2455_

- **Fall 01:** `12×(2000−900)=13200`, `10×(2600−1000)=16000`.
- **Fall 02:** `(240−180)×(180−100)=4800`.
- **Fall 03:** `100000−7000+11000+2000=106000`.
- **Fall 04:** `55−27−6−4−2=16`, `16−19=−3`, `−3+0.25×16=1`.
- **Fall 05:** `60×(1000−400)=36000`, `36000/(1250−450)=45`.
- **Fall 06:** `2×(20×6000)=240000` Auszahlungen vor den ersten modellierten Eingängen.
- **Fall 07:** `1000×0.05×0.20=10`, `100×0.60×0.30=18`.
- **Fall 09:** `360×8/60=48h`, `48×30−300−240−200=700`.
- **Fall 11:** `500×100×0.15=7500`, `7500−500×9−3600=−600`.
- **Fall 14:** `25×(8000−3000)=125000`, `24×(10000−3200)=163200`.

Diese Rechnungen sind dimensions- und arithmetische Prüfbeispiele, **keine** realen Unternehmensresultate.

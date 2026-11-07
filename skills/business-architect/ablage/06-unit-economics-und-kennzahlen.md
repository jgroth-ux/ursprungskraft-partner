# Unit Economics, Retention, Kennzahlen und Rechenprüfungen

_Einheitensprache, Deckungsbeitragsrechnung, LTV und Churn, KPI-Wörterbuch, Formelreferenz und alle Prüfungen gegen Rechenfehler._

## D2.2 Vergleichsgrammatik: Einheiten zuerst

_Herkunft: Deepfassung, Zeilen 155 bis 172_

Verwende diese Bezeichnungen **vor** der Rechnung:

- `P`: Nettoeinnahme pro Transaktion *ohne* Umsatzsteuer.
- `C_var`: echte variable Kosten derselben Transaktion (Leistung/COGS, Payment, Versand, Refund-Erwartungswert, variable Partnergebühren).
- `CM1 = P - C_var`: Deckungsbeitrag vor Akquisitionskosten.
- `CAC_inc`: inkrementelle Akquisitionskosten pro tatsächlich gewonnenem Neukunden, inklusive zurechenbarer Sales-Kosten; Attribution separat prüfen.
- `CM2_new = CM1_new - CAC_inc`: Ersttransaktionsbeitrag nach Akquise.
- `CM_life`: erwarteter undiskontierter Kundenbeitrag über definierte Lebensdauer **vor** CAC; bei stark wechselnden Zeitpunkten Cashflows separat modellieren.
- `CM_life_net = CM_life - CAC_inc`.
- `Fixed_add`: durch die Entscheidung zusätzlich benötigte periodische Fixkosten.
- `Net_increment = Σ inkrementelle CM1 − inkrementelle Akquise- und Prozesskosten − Fixed_add`.
- `Cash_t`: Kassenbestand aus **Ein-/Auszahlungen**, nicht GuV.
- `Bottleneck_hour`: qualifizierte Stunde der begrenzenden Ressource.

**Anti-Doppelzählung:** Wenn Vertriebslöhne im CAC stehen, nicht erneut als variable Sales-Kosten im Modell abziehen. Wenn „gross profit“ schon Refunds und Payment enthält, nicht doppelt einrechnen. Wenn Umsatz in MRR angegeben ist, ist er nicht automatisch kassenseitig im selben Monat zugeflossen.

## N5.6 Unit Economics und Profit-Pool-Modell [F/W]

_Herkunft: Normalfassung, Zeilen 331 bis 352_

**Zweck:** Beweisen, dass jedes weitere Geschäft im relevanten Zeitraum wirtschaftlichen Wert erzeugt. **Einsatz:** Vor Skalierung, bei aggressiven CAC-Ausgaben, unterschiedlichen Produkten und Retention-Modellen.

**Eingaben:** Nettoumsatz exkl. durchlaufender Umsatzsteuer, Discounts, Refunds, direkte Arbeits-/Material-/Hosting-/Transaktionskosten, variable Provisionen, CAC, Cohorts und Cash Timing.

**Berechnungs-SOP:**
1. **Unit** bestimmen (Auftrag, Kunde, Standort, Vertrag, Account-Monat).
2. Umsatz je Unit netto von Rabatten, Gutschriften und Refunds bereinigen.
3. Direkte variable Kosten inkl. variabler Delivery zuordnen.
4. `DB I = Nettoerlös − direkte variable Leistungs-/Produktkosten`.
5. Wenn CAC je Neukunde: `Akquisitionsbeitrag Erstkauf = DB I Erstkauf − CAC`; wiederkehrende Erlöse separat als Kohorten-Cashflows modellieren.
6. Payback aus **monatlichem Contribution** berechnen, nicht aus Umsatz.
7. Fixkosten, Gründerlohn, Working Capital und Steuern für Gesamt-P&L/Cashflow ergänzen.
8. Basis-/Downside-/Upside-Fall und Kohortentrennung darstellen.

**Beispiel [B]:** Servicevertrag: 400 €/Monat netto, 160 € direkt variable Betreuung, 20 € Payment/variable Software ⇒ 220 € monatlicher DB I. CAC 660 € ⇒ **3 Monate Contribution-Payback**, sofern der Beitrag vom ersten vollen Monat an entsteht. Bei 4 Monaten realistischer Haltedauer wäre Brutto-Kohortenbeitrag 880 € und Nettobeitrag nach CAC 220 €, vor Fixkosten. Bei 2 Monaten Haltezeit: –220 € nach CAC.

**Go-/No-Go:** Ohne aussagefähige Retention keine unendliche LTV-Hochrechnung. Wenn CAC-Payback größer als typischer Kundenverbleib ist, zunächst Preis, Akquise, Conversion oder Retention lösen.

**Qualität:** Formeln, Einheiten, Zeiträume, Netto-/Brutto-Logik, Datenquellen, konkrete Sensitivität. **Fehler:** Umsatz als Gewinn behandeln, historische Sales-Kosten nur teilweise zurechnen, churnlose LTV-Fantasie. **Verbesserung:** Daten auf Kunden-/Cohort-Ebene aus Buchhaltung, CRM und Produktnutzung abstimmen.

## D5.2 Drei Ökonomiken separat führen

_Herkunft: Deepfassung, Zeilen 389 bis 396_

- **Unit Economics:** Ist die Transaktion bzw. Kohorte profitabel?
- **Operating Economics:** Trägt das Volumen Fixkosten, Team und Management?
- **Cash Economics:** Kann das Unternehmen zahlen, bevor die Kunden zahlen?

Positiver EBITDA oder positive Marge garantiert **keine** kurzfristige Zahlungsfähigkeit. Anzahlungen verbessern Cash, können aber Lieferverpflichtungen erhöhen; deshalb offene Leistungsverbindlichkeiten separat führen.

## N5.9 Retention, Churn und Expansion [F/W]

_Herkunft: Normalfassung, Zeilen 389 bis 406_

**Zweck:** LTV und wirtschaftliche Stabilität über tatsächliche Kundenergebnisse erhöhen. **Einsatz:** Abo, Membership, laufende Agenturbetreuung, Wartungsverträge.

**Eingaben:** Vertragskohorten, Aktivierungsdaten, wiederkehrende Nettoerlöse, Downgrades/Upgrades, Churn-Gründe, Nutzung, NPS/Feedback (nur Hilfsindikatoren).

**Schritte:**
1. **Logo Churn**, **Gross Revenue Churn** und **Net Revenue Retention (NRR)** getrennt berechnen.
2. In Kohorten nach Startmonat und Segment trennen; nicht nur Gesamtchurn berichten.
3. Erstes messbares Kundenergebnis (Time-to-First-Value) und Aktivierungsereignis definieren.
4. Kündigungsgründe mit tatsächlichem Nutzungs- und Delivery-Verlauf verknüpfen.
5. Maximal zwei Retention-Interventionen je Cohort testen: besseres Onboarding, proaktive Success Reviews, Produktkorrektur, planmäßige Wertberichte.
6. Preissteigerungen und Upsell nur dann, wenn die Basisleistung verlässlich Wert liefert.

**Beispiel [B]:** Abo 200 €/Monat, 70 % Deckungsbeitragsmarge, konstanter monatlicher Logo Churn als **vereinfachende Annahme 5 %**. Rechnerische erwartete Lebensdauer einer stationären geometrischen Verteilung ≈ 20 Monate. Undiskontierter Contribution-LTV ≈ `200 × 0,70 / 0,05 = 2.800 €`. Bei CAC 450 €: vereinfachtes LTV:CAC ≈6,2. **Caveat:** Wachstum, Kohortenmischung, Änderungen in Churn, Expansion, Zahlungsverzug und Überlebensverteilung können das Bild stark verändern.

**Qualität:** Getrennte Kohorten, klar definierte Retention, Vermeidung von Scheinkausalität. **Fehler:** Mehr Umsatz durch Upsell als Lösung für schlechte Kernleistung; rechnerischen LTV als bereits realisierte Einnahme behandeln. **Verbesserung:** Tatsächlich beobachtete Contribution-Cashflows je Kohorte vor prognostischen LTV stellen.

## N13.7 Grenzökonomie vor Durchschnittsökonomie

_Herkunft: Normalfassung, Zeilen 1622 bis 1651_

Beispiel [B]: 100 Kunden kosten im historischen Durchschnitt 400 € CAC. Die **nächsten 20** Kunden könnten 900 €/Kunde kosten. Durchschnitts-CAC signalisiert nicht automatisch wirtschaftliche Skalierbarkeit. Entscheidend sind marginale Kosten bei zusätzlichem Volumen und die Contribution der **neu erschlossenen** Kohorte.

## N13.8 DB pro Engpassstunde [W]

Bei kapazitätsgebundenen Services ist der beste Auftrag nicht unbedingt der höchste Umsatz.

`DB pro Engpassstunde = (Nettoerlös − direkt variable Kosten) / Stunden der knappsten Ressource`

**Beispiel [B]:**
- Kunde A: 3.000 € − 1.200 € = 1.800 € DB; 12 Engpassstunden ⇒ 150 €/h.
- Kunde B: 2.200 € − 600 € = 1.600 € DB; 6 Engpassstunden ⇒ ca. 267 €/h.

Wenn Nachfrage ausreichend vorhanden ist und beide Kunden strategisch vergleichbar sind, kann B den besseren Durchsatz liefern. **Caveat:** Langfristiges LTV, Referenzwert, Teamkoordination und Kapazitätsmix mitprüfen.

## N13.9 Profit Pool statt Durchschnittskunde

Segmentiere Kunden nach:
- realisiertem Netto-Umsatz;
- Contribution nach vollständigem Serviceaufwand;
- Refund/Churn;
- Support- und Founderaufwand;
- Bezahlverhalten;
- Empfehlungs- und Upsellpotenzial.

**Ziel:** Profitabelsten idealen Kundentyp identifizieren, nicht nur lautesten oder größten.

**Warnung:** Nicht blind niedrige Profitabilität mit niedriger Kundeneignung gleichsetzen; schwache Contribution kann durch schlechte interne Prozesse verursacht sein.

## D16. KPI-Modelle, Formelverträge und Kontrollschleifen [F/W]

_Herkunft: Deepfassung, Zeilen 1826 bis 1835_

### D16.1 KPI Design Contract

Jede KPI definiert explizit:

`name, business_question, numerator, denominator, unit, grain, window, inclusion_rules, exclusion_rules, cost_basis, source, freshness, owner, target_or_guardrail, leading_or_lagging, known_failure_mode`.

**Beispiel:** `Lead-to-Customer` ohne Definition von Lead, Kundenzahl, Kohortenzeitfenster und Zählung von Reaktivierungen ist nur eine scheinpräzise Kennzahl.

## KPI-Wörterbuch (zusammengeführt) [F/W]

_Herkunft: Normal Anhang A (Finance- und KPI-Referenz), Deep 16.2 bis 16.4. Wo beide Fassungen dieselbe Kennzahl definieren, stehen beide Warnhinweise in einer Zeile._

Dieses Wörterbuch ist die **Berechnungsbasis**. Eine KPI ist nur vergleichbar, wenn Einheiten, Zeiträume, Kostenabgrenzung und Kohortendefinition gleich sind.

### Erlös und Marge

| KPI | Arbeitsdefinition/Formel | Interpretationswarnung |
|---|---|---|
| Net Revenue | Erlöse ohne durchlaufende Umsatzsteuer, abzüglich Rabatte/Gutschriften gemäß Rechnungslegung | Nicht mit eingegangenem Cash gleichsetzen |
| AOV | Netto-Bestellumsatz / bezahlte Bestellungen (Deep: Nettoerlös der Aufträge / Anzahl Aufträge) | Rabatte, Refunds, Steuerbasis und Perioden beachten |
| Gross Margin | (Net Revenue − COGS) / Net Revenue | Definition COGS je Branche unterschiedlich; Definition stabil halten |
| Contribution Margin / CM1 Margin | (Net Revenue − zugeordnete variable Kosten) / Net Revenue; CM1 / Nettoerlös | Sales-/CAC-Kosten ggf. separat; direkte Kosten umfassend definieren |
| DB I/Unit (CM1/Unit) | Nettoerlös/Unit − variable direkte Kosten/Unit | Fixkosten und CAC nicht doppelt abziehen |
| CM2 | CM1 − zurechenbare Akquisitions-/variable Vertriebskosten | CAC nicht doppelt abziehen |
| EBITDA | operatives Ergebnis vor Zins, Steuern, Abschreibungen | Cash ≠ EBITDA |
| Operating Cashflow | operative Einzahlungen − operative Auszahlungen (definierte Cashflow-Rechnung) | Timing beachten |
| Revenue per Employee | Nettoerlös / durchschnittliche FTE | Qualität/Marge/Kapitalintensität fehlt |
| Break-even Units | Fixkosten / DB je Unit | Nur bei positivem und konstantem DB/Unit |

### Akquise und Vertrieb

| KPI | Arbeitsdefinition/Formel | Interpretationswarnung |
|---|---|---|
| Qualified Rate | qualifizierte Leads / alle validen Leads | Definition nicht opportunistisch ändern |
| Contact Rate | erreichte relevante Leads / kontaktierte valide Leads | Zeitfenster fixieren |
| Show Rate | wahrgenommene (erschienene) qualifizierte Termine / gebuchte qualifizierte Termine | Terminverschiebungen konsistent behandeln; Verschiebungen und No-Shows unterscheiden |
| Win Rate | gewonnene Opportunities / entschiedene relevante Opportunities | Offene Opportunities nicht als Loss zählen; No-Decision gesondert; Kohorten beachten |
| Lead-to-Customer Rate | bezahlte neue Kunden / passende Leadkohorte | Kohorte, Sales-Zyklus und Zeitversatz beachten |
| Revenue/Qualified Offer | Erlös aus vergleichbaren Angeboten / qualifizierte Angebote | Preis- und Conversion-Hebel gemeinsam |
| CM/Qualified Offer | realisierte CM1 der gewonnenen Deals / vergleichbare qualifizierte Angebote | bessere Hauptmetrik für Preistests |
| Full CAC | zurechenbare (inkrementelle, vollständig definierte) Akquisitionskosten / neu gewonnene Kunden | Inklusive Menschen/Tools/Provisionen nach konsistenter Konvention; Cost Basis und Attribution dokumentieren |
| Media CAC | Paid Media Spend / zurechenbare Neukunden | Nicht mit Full CAC verwechseln |
| Marginal CAC | zusätzliche Akquisitionskosten / zusätzliche *inkrementelle* Kunden | bei Skalierung wichtiger als Durchschnitts-CAC |
| CAC Payback | Monate bis kumulierter Contribution je neuem Kunden dessen CAC deckt; als Quotient: CAC / periodischer CM pro gewonnenem aktivem Kunden | Time Lag, Cash, Renewal/Churn und Ramp-up prüfen |
| Sales Cycle | Win-Datum − akzeptiertes Startdatum der Opportunity | Median und Verteilung, nicht nur Mittelwert |
| Sales Velocity | Anzahl qualifizierte Opportunities × Win Rate × durchschnittlicher Deal Value / Sales Cycle Days | Opportunity-Kohorten sauber definieren |
| Pipeline Coverage | qualifizierter Pipelinewert / zu deckendes Ziel | Stage- und Timing-Qualität entscheidend |

### Delivery, Produkt und Retention

| KPI | Arbeitsdefinition/Formel | Interpretationswarnung |
|---|---|---|
| Time-to-First-Value | Zeit bis definierter erster Nutzennachweis | Definition dem Kundenjob anpassen |
| Activation Rate | aktivierte Nutzer/Kunden / geeignete neue Nutzer/Kunden | nicht nur Login messen |
| On-Time Delivery | pünktlich abgenommene Aufträge / fällige Aufträge | Backlog nicht verstecken |
| First-Pass QA | ohne Nacharbeit akzeptierte Jobs / geprüfte Jobs | Stichprobenregel dokumentieren |
| Accepted Throughput | akzeptierte Leistungen pro Zeitraum | WIP/Qualität daneben anzeigen |
| Capacity Utilization | produktive Engpassstunden / verfügbare Engpassstunden | 100 % kann durch Queueing schaden |
| Contribution / Bottleneck Hour | inkrementeller CM / Engpassstunden | nur bei vergleichbarer Qualität |
| Monthly Logo Churn | gekündigte Accounts aus Bestandsbasis / Accounts Periodenbeginn | Zugänge derselben Periode nicht in den Ausgangsnenner |
| Customer Retention | verbleibende Kunden aus Startkohorte / Startkunden | Logos ≠ Umsatz |
| Gross Revenue Churn | verlorenes MRR aus Startkohorte / Start-MRR | Expansion exkludieren |
| Gross Revenue Retention (GRR) | (Start-MRR − Churn-MRR − Contraction-MRR) / Start-MRR | Expansion ausgeschlossen |
| Net Revenue Retention (NRR) | (Start-MRR − Churn − Contraction/Downsell + Expansion aus Startkohorte) / Start-MRR | Neukunden-MRR ausgeschlossen |
| Refund Rate | zurückgezahlte Nettoerlöse / passende realisierte Erlöse | Zeit- und Kohortenmatch |
| Repeat Rate | Kunden mit zweitem Kauf / passende Startkohorte | ausreichend Beobachtungszeit |

### Lebenswert, Cash und Steuerung

| KPI | Arbeitsdefinition/Formel | Interpretationswarnung |
|---|---|---|
| LTV / CM-LTV | Summe erwarteter zukünftiger Contribution je Customer Cohort, ggf. diskontiert; kohortenbasierter erwarteter CM1 vor CAC über festen Horizont | Nicht nur Umsatz; Churn-Modell angeben; keine Fantasie-Retention |
| LTV:CAC | Contribution-LTV / Full CAC (akquisitionsbezogen) | Ungewissheit und Cash Payback zusätzlich; Wertebasis und Kohorten vereinheitlichen |
| DSO | durchschnittliche Forderungen / Kreditumsatz × Tage | Perioden- und Umsatzdefinition |
| DIO | durchschnittlicher Lagerbestand / COGS × Tage | Nur bei Lagergeschäft; für Service ohne Lager ggf. DIO = 0 |
| DPO | durchschnittliche Verbindlichkeiten / COGS × Tage | Kreditkäufe ggf. präziser |
| Cash Conversion Cycle | DSO + DIO − DPO | Starker Vereinfachungsgrad, Branchenmodell prüfen, Definition anpassen |
| Runway | frei verfügbare liquide Mittel / monatlicher (nachhaltiger) Netto-Cash-Burn | Bei unstetem Burn besser 13-Wochen-Cash bzw. Cash-Szenario statt Quotient |
| Burn Multiple | Net Burn / Net New ARR (kontextabhängig) | nur bei konsistentem, sinnvollem Negativ-Cash-Modell |
| Cash Trough | niedrigster prognostizierter Cash-Bestand | Downside und Fälligkeiten |

## D16.5 KPI-Cascade: Welche Metriken gehören zusammen?

_Herkunft: Deepfassung, Zeilen 1887 bis 1900_

**Neugeschäft mit Sales Funnel:** `Qualified Leads → Qualified Conversations → Wins → New CM → CAC Payback`, dazu `Refund/Quality`, `Cash Trough`.

**Subscription:** `Activated cohorts → Recurring Use → GRR/NRR → CM-LTV → Net New MRR`, dazu Incident/Support-Cost.

**Expertenservice:** `Qualified demand → productive expert capacity → accepted throughput → CM per expert hour → retention`, dazu `Founder dependency`.

**E-Commerce:** `incremental orders → net AOV → order CM1 → cohort repeat → acquisition payback`, dazu inventory cash und returns.

**Marketplace:** `qualified request → matched supply → fulfilled transaction → repeat → CM per transaction`, dazu supply reliability und concentration.

**Nie isolieren:** Ein Team darf nicht nur nach der KPI bezahlt oder bewertet werden, die es selbst unmittelbar beeinflusst, wenn dadurch der Rest des Wertstroms beschädigt wird.

## D16.7 KPI-Zielwerte

_Herkunft: Deepfassung, Zeilen 1914 bis 1924_

Der Agent darf keine universellen Branchenwerte als Soll erfinden. Ein gutes Ziel ergibt sich aus:
- aktueller firmenspezifischer Baseline;
- realen Qualitäts-, Cash- und Vertragsgrenzen;
- plausiblen Prozessfähigkeiten;
- definiertem Lernhorizont;
- gegebenenfalls *extern verifizierten, wirklich vergleichbaren* Benchmarks.

**Beispiel [B]:** Ein nicht validierter „80-%-Activation-Benchmark“ ist weniger nützlich als ein sauberer Test, der eine vorab definierte eigene Baseline von 42 % auf 55 % hebt und anschließend tatsächliche Retention prüft.

## NA.2 Vereinfachter stationärer LTV

_Herkunft: Normalfassung, Zeilen 2040 bis 2047_

Unter strengen Annahmen: konstante monatliche Churn-Wahrscheinlichkeit `c > 0`, identischer Monatsbeitrag `m`, keine Expansion, keine Diskontierung, korrekt definierte Startperiode:

`LTV ≈ m / c`

**Vorsicht:** Nicht in Annual vs. Monthly mischen. Bei Null-Churn liefert die Formel keinen sinnvollen endlichen Wert; dann endlichen Forecast-Horizont und erwartete Haltedauer verwenden.

## NA.4 Attributionskosten bei Founder-led Sales

_Herkunft: Normalfassung, Zeilen 2054 bis 2059_

Ein Full-CAC-Modell sollte eine **realistische ökonomische Bewertung der Vertriebszeit** enthalten, wenn diese künftig ersetzt werden muss. Dass der Founder sich aktuell keinen Lohn zahlt, macht diese Zeit nicht kostenlos.

**Beispiel [B]:** 25 h/Monat Founder-Vertrieb × 60 €/h interne Ersatzkosten = 1.500 €; Ads 3.000 €; CRM 200 €; Provision 300 €; 10 Neukunden ⇒ `Full CAC = 5.000 / 10 = 500 €` statt Medien-CAC 300 €. Die 60 €/h sind Annahme, keine Marktnorm.

## Anhang A: Formel- und Rechenreferenz

_Herkunft: Deepfassung, Zeilen 2396 bis 2426_

### DA.1 Kerngleichungen

```text
CM1_per_unit = net_price - direct_variable_cost
Total_CM1 = volume × CM1_per_unit
CM2_new_customer = first_order_CM1 - incremental_CAC
Contribution_profit_period = ΣCM1 - attributable_acquisition_cost - additional_fixed_cost
BreakEven_units_after_reprice =
    ceil((old_volume×(old_price-old_variable_cost) + delta_fixed) /
         (new_price-new_variable_cost))
New_customers_from_funnel = leads × qualification_rate × show_rate × win_rate
MRR_end = MRR_start + new_MRR + expansion_MRR - contraction_MRR - churned_MRR
GRR = (start_MRR - contraction_from_start - churn_from_start) / start_MRR
NRR = (start_MRR - contraction_from_start - churn_from_start
       + expansion_from_start) / start_MRR
COHORT_CM_LTV_H = sum_over_periods(retained_active_units_t × CM1_t)
CAC_payback = CAC / expected_recurring_contribution_per_active_customer_period
Cash_end_t = Cash_start_t + actual_inflows_t - actual_outflows_t
Cash_trough = min(Cash_end_t over model horizon)
CM_per_bottleneck_hour = incremental_contribution / incremental_bottleneck_hours
```

**Voraussetzungen / Grenzen:**
- Break-even-Formel bei negativem/Null-Neu-CM nicht anwenden.
- `MRR_end` ist eine vereinfachte Bridge; Expansion und Contraction müssen disjunkt, Kohortenbezug sauber sein.
- `CAC_payback` als einfacher Quotient ist bei wechselnden Zahlungen/Retention zu ungenau; besser Cash-Cohort-Graph.
- `COHORT_CM_LTV_H` verwendet eine ausdrücklich definierte Horizon `H`, konsistente Kundenbasis und Kostenbasis; Diskontierung ggf. ergänzen.
- `Cash_t` ist eine tatsächliche Zahlungsgröße und darf keine ungeprüften Forderungen als sichere Eingänge enthalten.

## N11.3 Finanzarithmetik-Checks

_Herkunft: Normalfassung, Zeilen 1451 bis 1485_

**Einheitenprüfung:**
- `€/Kunde` darf mit `Kunden` zu `€` multipliziert werden.
- `€/Monat` darf nicht ohne Zeitannahme als LTV ausgegeben werden.
- `CAC = gesamte zurechenbare Akquisitionskosten / neue Kunden im passenden Attributionsfenster`; Kosten und Kunden müssen zeitlich zusammenpassen.
- `DB I = Nettoumsatz − variable direkte Kosten`; CAC je nach internem Kontenmodell als eigene Zeile abziehen, konsistent bleiben.
- `Payback` basiert auf **Contribution-Cashflows**, nicht auf Rechnungsumsatz.
- `Revenue Growth` ist nicht `Cashflow Growth`.
- NRR ist keine einfache Logo Retention, wenn Expansion/Contraction enthalten ist.

**Formeltests in Pseudocode:**

```python
assert price_net >= 0
assert direct_variable_cost >= 0
contribution_per_order = price_net - direct_variable_cost
assert orders >= 0
gross_contribution = contribution_per_order * orders
# Acquisition costs separately, avoid double counting
contribution_after_acquisition = gross_contribution - attributable_acquisition_cost
# Compare over same timeframe, currency and VAT basis.
```

## N11.4 Modellannahmen-Check

Für jede Szenariorechnung:
- **Basisjahr/Monat und Währung** nennen.
- Sind Daten beobachtet, geschätzt oder hypothetisch?
- Was ist die empfindlichste Annahme?
- Unter welchem Wert kippt die Empfehlung?
- Wie verändert sich Cash und operative Kapazität?
- Wie groß darf der Experimentverlust sein?
- Welche Entscheidung lässt sich **jetzt** treffen, welche braucht Daten?

## NA.5 Kurzprüfungen für Forecasts

_Herkunft: Normalfassung, Zeilen 2060 bis 2072_

| Prüfung | Warum |
|---|---|
| Umsatz = Preis × bezahlte Units? | Grundarithmetik |
| Ist VAT-Logik im ganzen Modell einheitlich? | Verhindert künstliche Marge |
| Wurde CAC genau einmal abgezogen? | Verhindert Doppelzählung |
| Gibt es Lags zwischen Lead, Sale und Cash? | Verhindert Periodenfehler |
| Variiert variable Delivery mit Volumen? | Verhindert Skalierungsfantasie |
| Gibt es Kapazitäts-/WIP-Limits? | Verhindert nicht lieferbare Sales |
| Werden Refunds und Forderungsausfälle berücksichtigt? | Verhindert zu optimistischen Cash |
| Deckt Downside Kapitalbedarf und Pflichten? | Überlebensfähigkeit |

## D16.6 Forecast Integrity Checks

_Herkunft: Deepfassung, Zeilen 1901 bis 1913_

1. Stimmen Dimensionen? `€/Kunde × Kunden = €`, `€/Monat` nicht mit `€/Jahr` addieren.
2. Wurde Umsatzsteuer korrekt ausgeschlossen?
3. Sind Cost Basis und Margenbegriffe konsistent?
4. Wurde Neu-CAC genau einmal belastet?
5. Gibt es **vintage/cohort** beim Retention-Modell?
6. Wurden Rückerstattungen, variable Support- und Retourenkosten berücksichtigt?
7. Sind Kapazitäten und Wartezeiten in allen Szenarien machbar?
8. Ist der Cash Trough bei Zahlungszielen modelliert?
9. Sind Forecast, Budget, Ziel und tatsächlich gemessenes Ergebnis klar getrennt?
10. Sind Fehlschlussrisiken (Attribution, kleinen Stichproben, Segmentmix) benannt?

## DA.2 Dimensionsaudit: häufige Fehler

_Herkunft: Deepfassung, Zeilen 2427 bis 2439_

| Falsche Rechnung | Problem | Korrektur |
|---|---|---|
| `Monthly MRR × Annual Churn` als Monatswert | Zeitbasis gemischt | Monatsrate oder Jahresrate sauber konvertieren und Kohorten modellieren |
| `AOV × Bestellungen − Ads` = Gewinn | COGS/Refunds/Payment/Fixkosten fehlen | CM1, CAC, Operating Profit getrennt |
| `Cost Saving = saved hours × salary rate` | Kapazität ≠ Cash | tatsächliche Kostenreduktion/zusätzliche CM-Generierung nachweisen |
| `LTV = ARPU/churn` | Marge/Churn-Stabilität/Time Horizon fehlen | kohortenbasierter CM-LTV |
| `Profit = EBITDA = Cash` | Working Capital, Steuern, Capex etc. fehlen | Cashflow nach Zahlungsterminen |
| `Price × Leads = Umsatz` | Qualifizierung/Conversion fehlt | Funnel- und Zahlungsereignisse |
| `Marketplace GMV = Plattformumsatz` | Take Rate/Ertragsabgrenzung | Gebührenumsatz separat |
| `Alle Neukunden einer Referral-Kampagne sind inkrementell` | Attribution ≠ Kausalität | Holdout/vergleichbare Kohorten |

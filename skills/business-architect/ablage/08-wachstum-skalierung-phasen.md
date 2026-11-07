# Wachstum, Skalierung, Kanäle, Kapazität und Phasen

_Wachstumsoptionen abwägen, Kanäle steuern, Kapazität planen, Phasen-Playbooks und die 30/60/90-Tage-Logik._

## D5.1 Die Fünf-Spalten-Entscheidung

_Herkunft: Deepfassung, Zeilen 378 bis 388_

Jede Wachstumsoption anhand von:
1. `ΔRevenue`: im Zielhorizont inkrementell realisierter Umsatz;
2. `ΔContribution`: nach zusätzlichen direkten Kosten, Akquise und vermeidbarem Overhead;
3. `ΔCash_t`: Zeitpunkt der maximalen Vorfinanzierung (Cash Trough);
4. `ΔCapacity`: Stunden, SLA, Ausschuss, Gründeranteil;
5. `Downside`: Worst-plausible-case, Abhängigkeit, Reversibilität.

**Prioritätskonflikt:** Wenn Umsatz +50 %, aber DB −10 %, Cash Trough unter Sicherheitsminimum und Fehlerquote hochgeht, ist **nicht** „skalieren“ der Default. Optimiere die Ökonomie des zusätzlichen Kunden oder stoppe teure Expansion.

## D5.3 Skalierbarkeit: Grenzkosten und Engpassmobilität

_Herkunft: Deepfassung, Zeilen 397 bis 420_

**Wachstum:** mehr Output. **Skalierung:** zusätzlicher Output mit relativ geringerem Einsatz mindestens einer knappen Ressource, *ohne* Qualitätszerfall. Konkret prüfen:

`Incremental CM per Bottleneck Hour = ΔCM / ΔBottleneck_Hours`

und

`Quality-adjusted Throughput = abgeschlossene, akzeptierte Leistungen pro Zeitraum`

Nicht jede Person muss billiger werden. Expertise-Skalierung kann über Recruiting, Training, QA und Spezialisierung entstehen; Software-Skalierung über verlässliches Produkt und niedrige Grenzkosten; physisches Produkt über Distribution und Inventory-Disziplin. [A/W]

## D5.4 Entscheidung bei ungleich verteiltem Risiko

Bei unsicheren Ergebnissen rechne **drei plausible Szenarien** (nicht automatisch 10/50/90 % Wahrscheinlichkeiten vortäuschen):

| Szenario | Kunden/Volumen | CM pro Unit | zusätzliche Fixkosten | Cash Trough | Verletztes Gate? |
|---|---:|---:|---:|---:|---|
| Downside | `D` | `d` | `Fd` | `Td` | |
| Base | `B` | `b` | `Fb` | `Tb` | |
| Upside | `U` | `u` | `Fu` | `Tu` | |

Sensitivität für zwei oder drei **kritische Parameter** (z. B. Churn, Sales-Zyklus, Auslastung) statt einer beeindruckenden, unprüfbaren 50-Spalten-Tabelle. Nur eine echte Wahrscheinlichkeitsverteilung verwenden, wenn sie begründet und kalibriert werden kann.

## D5.5 Entscheidungsbaum: Wachstum freigeben?

_Herkunft: Deepfassung, Zeilen 421 bis 436_

```text
Ist CM1 für die zusätzliche Einheit positiv?
├─ Nein → Preis, Kosten, Segment oder Leistungsmodell korrigieren.
└─ Ja → Gibt es belastbaren Akquise-/Wiederkauf-Proof?
   ├─ Nein → kleines bezahltes Experiment statt Scale-Budget.
   └─ Ja → Hat Lieferung freie, qualitätsfähige Kapazität?
      ├─ Nein → Kapazität/Training/Produkt zuerst.
      └─ Ja → Bleibt Cash_t über Sicherheitsminimum?
         ├─ Nein → Zahlungsbedingungen, Finanzierung oder Tempo ändern.
         └─ Ja → Budget inkrementell erhöhen, Grenz-CAC und Qualität überwachen.
```

Dies ist ein **Default-Gate**. Strategisch bewusst finanzierte Anlaufverluste sind möglich, benötigen dann einen **dokumentierten Kapitalplan, Meilensteine und Verlustobergrenze**; nicht heimlich „profitabel“ nennen.

## N5.8 Akquisitionskanal-Portfolio und Distribution Advantage [F/W]

_Herkunft: Normalfassung, Zeilen 371 bis 388_

**Zweck:** Wiederholbare Kundengewinnung mit geringem Klumpenrisiko. **Einsatz:** Kanalwechsel, Expansion, virale Peaks, Abhängigkeit von Paid Media.

**Eingaben:** Kanal-CAC, Anteil Neukunden, Quality-adjusted Conversion, Aktivierungs-/Refund-Rate, Teamzeit, Cashbedarf, Kanalvolatilität, organische/paid Wirkung.

**Schritte:**
1. Einen **bewährten Kernkanal** sauber dokumentieren: ICP, Messaging, Trigger, SOP, Kapazität.
2. Inkrementelle Akquisitionskosten inkl. Personalzeit messen.
3. Skalierungstest in Stufen (z. B. +10–20 % Budget als vorsichtiger Ausgangspunkt; keine garantierte Branchenregel) unter konstantem Tracking.
4. Wenn marginaler CAC/Refund/Leadqualität schlechter wird: Budgetschritt stoppen, kreative Sättigung/Targeting prüfen.
5. Zweitkanal erst so weit entwickeln, dass Kernkanal nicht unterfinanziert oder vernachlässigt wird.
6. Distribution Assets aufbauen: Audience, SEO, referral engine, Partnerschaften, Listen mit sauberer Einwilligung.

**Beispiel [B]:** Paid Search liefert 40 Kunden bei 350 € voll zugerechnetem CAC; ein zusätzliches Testbudget von 5.000 € liefert nur 4 zusätzliche Kunden ⇒ **marginaler CAC 1.250 €**. Durchschnitts-CAC des historischen Kanals maskiert den Grenz-CAC. Sinnvoller nächster Test: Landingpage und Query-Intent verbessern statt weiter blind erhöhen.

**Qualität:** **Grenz-CAC** und Cohort-Qualität statt nur historischer Durchschnitt; Skalierungsgrenzen und Ausfallplan. **Fehler:** Zehn Kanäle gleichzeitig und nie genug Wiederholungen. **Verbesserung:** Kanalplan nach Evidenz, Cap und Kapazität steuern.

## N5.10 Skalierungsreife und Capacity Planning [A/F/W]

_Herkunft: Normalfassung, Zeilen 407 bis 425_

**Zweck:** Wachstum nur in der Geschwindigkeit zulassen, die System, Team und Cash tragen. **Einsatz:** Von Founder-led auf Team-led, Kapazitätsengpässe, Wartelisten, Qualitätsverfall.

**Eingaben:** Demand Forecast, Cycle Time, verfügbare produktive Stunden, Rework, Fehlerquote, SLA, Einarbeitungszeiten, Cash für Vorleistung.

**Schritte:**
1. Nachfrage forecasten und unsichere Segmente markieren.
2. Tatsächlich produktive Kapazität pro Rolle bestimmen (Urlaub, Admin, Krankheit, Meetings).
3. Bottleneck-Rolle identifizieren, nicht pauschal „mehr Leute“ einstellen.
4. `max. Jobs = produktive verfügbare Stunden / durchschnittliche Stunden je Job`; bei hoher Variabilität Sicherheitsreserve vorsehen.
5. Qualität/SLA und WIP (Work in Progress) überwachen.
6. Automatisierung erst nach Prozessstandardisierung; kritische Freigaben bei Menschen lassen.
7. Nächste Kapazitätseinheit erst mit Cash-/Ramp-up-Plan kaufen.

**Beispiel [B]:** Ein Mitarbeiter hat 40 h/Woche, davon realistisch 65 % produktiv = 26 h. Je Kundenprojekt sind 3 h dieser Engpassrolle nötig; theoretisch 8,67 Projekte/Woche. Mit Reserve und Schwankungen **höchstens 8** ansetzen. Vertrieb verkauft 12/Woche: Backlog wächst 4/Woche. Ein weiterer Sales Rep ist nicht der erste Hebel. Zunächst Standardarbeit reduzieren oder Kapazität erhöhen.

**Qualität:** Daten für tatsächliche Auslastung, Durchlaufzeit und Qualitätsfehler; klare Engpassrechnung. **Fehler:** 100-%-Auslastung planen; Sales höher skalieren als Delivery; viel Automatisierung um chaotische Prozesse herum. **Verbesserung:** WIP-Limits, klare Intake-Standards, Kapazitätsreserve und Taktsteuerung.

## N13.11 Nonlinearität und Queueing

_Herkunft: Normalfassung, Zeilen 1664 bis 1669_

Bei hoher Auslastung steigen Wartezeiten oft **nicht linear**. Eine Serviceorganisation bei 95 % theoretischer Kapazität besitzt wenig Puffer für Fehler, ungeplante Arbeit und Nacharbeit.

**Arbeitsregel:** Nicht 100 % rechnerische Auslastung als langfristig real lieferbaren Plan annehmen. Reserve nach Variabilität und SLAs berechnen, nicht mit einer pauschalen fixen Prozentzahl ohne Prüfung.

## N13.10 „Proof before Scale“ als Phasengate [W]

_Herkunft: Normalfassung, Zeilen 1652 bis 1663_

Eine Wachstumsstufe ist erst freigabefähig, wenn:
1. Vorheriger Abschnitt real lieferbar ist.
2. Kunden den versprochenen Wert hinreichend erhalten.
3. Grenzökonomie und Cashbedarf modelliert sind.
4. Datenqualität ausreicht.
5. Team/Prozesse mit zusätzlichen Units zurechtkommen.
6. Ein Downside-Fall finanziell überlebbar bleibt.

Das verhindert die typische Falle, in der skalierte Unordnung schneller scheitert als das kleine Geschäftsmodell.

## N13.15 Reduktion als Skalierungsinstrument [A/W]

_Herkunft: Normalfassung, Zeilen 1696 bis 1706_

Ablenkung kostet nicht nur Zeit, sondern erzeugt:
- zusätzliche Trainings- und Übergabeprozesse;
- Reporting-Komplexität;
- Vertriebskonflikte;
- Qualitätsstreuung;
- längere Reaktionszeiten.

**Vorgehen:** Pro zusätzlichem Produkt/Kanal den **vollständig zusätzlichen Management- und Delivery-Aufwand** gegen marginalen Profit und strategischen Asset-Aufbau vergleichen. Produkte mit positiver Stückmarge können auf Systemebene dennoch schaden.

## Anhang B: Playbooks nach Unternehmensphase

_Herkunft: Normalfassung, Zeilen 2075 bis 2132_

### NB.1 Von Null zu ersten wiederholbaren 10.000 € pro Monat [A/W]

**Primärwette:** Ein konkretes zahlungsbereites Segment mit einem klaren Problem und einem kaufbaren Ergebnis verbinden.

**Sprintfolge:**
1. 1 ICP, 1 Pain, 1 Outcome, 1 Channel.
2. Mit 5–15 echten Gesprächen Problem/Trigger und Alternativen verstehen; nicht repräsentativ überinterpretieren.
3. Angebot mit klarem Scope, Preis und erfüllbaren Bedingungen.
4. Bezahlt verkaufen, liefern, Ergebnis dokumentieren.
5. Wiederkauf/Weiterempfehlung und Delivery-Stunden messen.
6. Fehlenden Proof aufbauen; Offer vor neuer Geschäftsidee optimieren.

**Zu vermeiden:** Brand-Rebuild, komplizierte App, zwölf Kanäle, Management-Overhead vor zahlenden Kunden.

**Zielnachweis:** Bezahlte Nachfrage ist wiederholbar, DB ist plausibel positiv, Delivery funktioniert.

### NB.2 Von 10.000 auf etwa 30.000 € pro Monat [A/W]

**Primärwette:** Verkaufsvorgang und Kundenergebnis wiederholbar machen.

**Arbeitspaket:** Einheitliche CRM-Stufen, wöchentlicher Funnel, Einwandkategorien, Follow-up, Onboarding, Kundenqualität, direktes Kostenmodell. Entscheiden, welcher eine Mechanismus vom Founder an Team/System übergeben werden kann.

**Go-Gate:** Neue Sales sind nicht nur möglich, sondern zeitlich einigermaßen prognostizierbar; Lieferung/Refunds bleiben stabil.

### NB.3 Von 30.000 auf etwa 100.000 € pro Monat [A/W]

**Primärwette:** Personal, Prozesse und Kapazität vervielfältigen, ohne Kernqualität zu verwässern.

**Arbeitspaket:** Job-Slot-Modell, Prozessbibliothek, Mitarbeiterentwicklung, Teamleitung, Capacity WIP, Customer Success, DB nach Produkt und Segment, Cash Forecast.

**Go-Gate:** Founder ist nicht täglich Eskalationszentrum für Standardfälle; Profit und Servicequalität halten zusätzliche Units aus.

### NB.4 Deutlich über 100.000 € pro Monat [A/W]

**Primärwette:** Managementsystem, Kapitalallokation und kontrollierte Diversifikation.

**Arbeitspaket:** Verantwortliche P&Ls, kohortenorientierter Forecast, Segmentprofitabilität, Quality of Revenue, Kanal-/Kundenkonzentration, Führungskapazität, Governance, strategische Assets/Moats.

**Go-Gate:** Entscheidungen haben konsistente Daten, dezentrale Ownership, funktionierende Kontrolle und tragfähigen Downside.

### NB.5 Phasenübergreifende Entscheidungsregel

Umsatzphase nie isoliert verwenden. Zusatzdimensionen:
- Wiederkehrender vs. einmaliger Umsatz.
- Gross Margin / Contribution.
- Kundenkonzentration.
- Komplexität und Kapitalintensität.
- Sales Cycle.
- Churn/Retention.
- Regulierung.
- Anzahl der unabhängigen Entscheidungen, die Founder täglich treffen muss.

Ein 200.000-€-Projektgeschäft mit 90 Tagen Cash Gap braucht andere Prioritäten als ein 20.000-€-Recurring-Business mit Vorauszahlung.

## D9. Aus unscharfer Idee eine 30-/60-/90-Tage-Entscheidungsfolge bauen [F/A/W]

_Herkunft: Deepfassung, Zeilen 756 bis 823_

### D9.1 Input-Normalisierung

Unklare Idee: „KI-Automationen für KMU.“

Formuliere **drei überprüfbare Job-Hypothesen**, nicht sofort drei Produkte:
1. Welche konkrete Handlung kostet heute nachweisbar Zeit/Geld?
2. Welcher Käufer hat Budget und kurzfristige Änderungsbereitschaft?
3. Welche Output-Einheit lässt sich in zwei Wochen verlässlich liefern?
4. Welcher Daten-/Systemzugriff ist nötig? Wie riskant sind Fehler?
5. Welche einfache Alternative existiert? Warum reicht sie nicht?

Schnellster erlaubter Beweis: **bezahlter, eng begrenzter Pilot** mit manuellem Backend. Kein ungeprüftes „Full Platform“-Build.

### D9.2 30 Tage: Problem und Zahlungsbereitschaft

**Ziel:** Eine belastbare Angebots-/Segmenthypothese und erste Zahlungs-/Nutzungsbelege.

- Tage 1–3: ICP, Problemtrigger, Worst-Case-Risiko, 1-seitiges Angebot, Datendefinition.
- Tage 4–10: 10–15 ernsthafte Problemgespräche (Zahl dient als **Arbeitsziel**, nicht als statistischer Nachweis); mindestens drei konkrete bisherige Problemfälle.
- Tage 11–20: reale Angebote, begrenzte bezahlte Piloten; Einwände und No-Buy dokumentieren.
- Tage 21–30: Auslieferung, tatsächliche Stunden/Fehler/Kosten erfassen, Zahlungs- und Nutzensignal vergleichen.

**Gate G30:** Es gibt mindestens einige echte kaufende Nutzer oder einen klaren Zahlungsbeleg, lieferbares Scope, positive oder erklärbar auf dem Weg zur positiven CM1 und eine prüfbare Akquisitionsroute. Andernfalls Segment/Outcome neu zuschneiden, nicht sofort Vollsoftware bauen.

### D9.3 60 Tage: Wiederholbarkeit beweisen

**Ziel:** Mindestens eine zweite nachvollziehbare Verkaufs-/Delivery-Runde im gleichen Segment, ohne jedes Mal die Lösung neu zu erfinden.

- Wiederholung derselben Angebotsvariante.
- CRM und Delivery-Tickets mit einheitlichen Statusfeldern.
- Standard-Onboarding, QA und Kosten-/Zeiterfassung.
- Kohortensicht: bezahlte Leistung, Reklamation, Wiederkauf/Weiternutzung.
- Kanaltest, nur falls Delivery kontrolliert ist.
- Kalkulation von CAC und echten Founder-Stunden.

**Gate G60:** Verkaufsmechanismus ist ansatzweise wiederholbar, der Standardfall hält Qualitätsgrenzen ein, CM und Cash-Lag sind transparent; falls nicht, kein aggressives Scale-Budget.

### D9.4 90 Tage: Inkrementelle Skalierung oder bewusstes Stoppen

**Ziel:** Die stärkste Variante mit kontrolliertem Risiko systematisch ausbauen.

- ein ICP und ein Kernangebot bevorzugen;
- Kapazitäts-/SOP-Engpass lösen;
- begrenztes, messbares Channel-Budget;
- einen Prozess delegieren/automatisieren, dessen Funktion vorher manuell bewiesen wurde;
- 13-Wochen-Cash-Modell pflegen;
- G90 entscheidet: `Scale`, `Iterate`, `Pause`, `Pivot`, `Stop`.

**Gate G90:** zusätzliche Kunden erzeugen positiven (oder bewusst finanzierten) Grenzbeitrag; Qualität bleibt stabil; kein ungeplanter Cash Trough; zumindest ein realer Distributionspfad; Founder ist nicht alleiniger unbeschränkter Kapazitätsdeckel.

### D9.5 Zeitplan nach Unsicherheit verschieben

Die 30/60/90-Takte sind Organisationshilfen, keine Naturkonstanten. Bei Enterprise-Verkäufen, Zulassungen, komplexer Hardware oder saisonalem Markt kann der primäre Kaufbeweis länger dauern. Dann G30/G60 auf **frühere nachprüfbare Meilensteine** umstellen (Budgetfreigabe, Security-Review, technische Machbarkeit, Pilotvertrag), ohne prognostizierte Umsätze als realisiert auszugeben.

### D9.6 Zwei Pfade: Idee vs. bestehendes Unternehmen

| Phase | Neue Idee | Etabliertes Geschäft |
|---|---|---|
| Tage 1–30 | Käufer/Problem/Bezahlung beweisen | Segment-/Funnel-/Cash-Audit, Engpasstest |
| Tage 31–60 | Verkaufs- und Delivery-Reproduzierbarkeit | Engpass beheben, QA und Owner etablieren |
| Tage 61–90 | begrenzte Expansion | Budget/Kapazität nur für nachgewiesenen Hebel erhöhen |

**Vermeiden:** Einem Unternehmen mit 500 Kunden dieselbe „MVP zuerst“-Arbeitsliste geben wie einem Gründer ohne ersten Käufer.

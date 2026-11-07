# Organisation, Funktionen als System, Delegation, Talent und Automation

_Marketing, Vertrieb, Produkt und Betrieb als ein System, Takt und Datenvertrag, Gründer-Entkopplung, Recruiting und Automation mit Risikoklassen._

## D7. Marketing, Produkt, Vertrieb und Operations zu einem System verbinden [F/A/W]

_Herkunft: Deepfassung, Zeilen 545 bis 655_

### D7.1 Vier Funktionen, ein Vertrag

Ein Unternehmen besitzt keine voneinander isolierten „Growth“, „Sales“ und „Delivery“-Erfolge. Es hat einen **Kundenerfolgsvertrag**:

`Versprochener Outcome (Marketing) ≈ verkaufter Scope (Sales) ≈ gelieferter Scope (Product/Ops) ≈ wahrgenommener Outcome (Customer)`

Messbare Vertragsbrüche:
- Marketing zieht Zielkunden an, die wirtschaftlich nicht lieferbar sind.
- Sales überverspricht Funktionen oder Implementierungstempo.
- Produkt aktiviert Nutzer nicht; Kunden kaufen, aber erleben keinen Nutzen.
- Operations erfüllt zu spät; Sales versucht das mit Rabatten zu kompensieren.
- Finance optimiert AOV, obwohl Retention oder Cashflow leidet.

### D7.2 End-to-End Revenue System

**Marketing besitzt:** erreichbare ICP-Aufmerksamkeit, nachvollziehbare Quellen, qualifizierte Nachfrage und deren Kosten.  
**Sales besitzt:** Diagnose, qualifizierten Abschluss, sauberes Erwartungsmanagement, Win/Loss-Codes.  
**Produkt/Delivery besitzt:** Time-to-Value, Output-Qualität, Rückmeldeschleife, Nutzung, SLAs.  
**Customer Success besitzt:** Adoption, Risikoerkennung, Renewal, Expansion (soweit rollenspezifisch).  
**Finance besitzt:** Definition der CM-Einheit, Liquidität, korrekte Kohorten und Budgetgrenzen.  
**CEO/Operator besitzt:** Priorisierung des Gesamtsystems, nicht die Summe von Abteilungs-KPIs.

**Fehlanreiz:** Sales wird nur nach Vertragswert bezahlt, während Refunds und schlechte Delivery nicht auftauchen. Gegenmaßnahme: teilweise variable Vergütung erst nach erfolgreichem Onboarding/qualitativem Gate; rechtliche und arbeitsvertragliche Umsetzung prüfen.

### D7.3 Operating Cadence [W]

**Täglich (max. 15 Minuten):** offene Versprechen, kritische Kunden, überfällige Zahlungen, Engpass WIP; nur Abweichungen eskalieren.

**Wöchentlich (60 Minuten):**
1. Baseline der letzten 4–8 Wochen vs. aktuelle Kohorte.
2. Ein primärer Engpass, maximal zwei aktive Verbesserungswetten.
3. Auswertung der Tests (inklusive Gegenindikatoren).
4. Cash- und Kapazitätsampel.
5. Entscheidung: fortsetzen / korrigieren / stoppen; Owner & Stichtag.

**Monatlich (2 Stunden):** Profit Pool je Segment und Angebot; Kanalinkrementalität; Retention; Team-/Founder-Abhängigkeit; Budgetverschiebung; Kapazitätsplanung.

**Quartalsweise:** Markt-/Modellannahmen, Customer Economics, wettbewerbliche Differenzierung und strategische „Nein“-Liste erneuern.

### D7.4 Datenübergabevertrag

Einheitliche Objekte:

```yaml
lead:
  lead_id: immutable
  created_at: ISO8601
  source_original: string_or_unknown
  segment: enum
  qualification_reason: controlled_code
  consent_basis: recorded_when_relevant
opportunity:
  opportunity_id: immutable
  lead_id: reference
  qualified_at: ISO8601_or_null
  offered_at: ISO8601_or_null
  won_at: ISO8601_or_null
  lost_reason: controlled_code_or_null
  proposed_net_revenue: decimal
  predicted_direct_cost: decimal
customer:
  customer_id: immutable
  cohort_start: ISO8601
  product_or_offer: enum
  acquisition_cost_allocated: decimal_or_unknown
  activation_at: ISO8601_or_null
  churn_at: ISO8601_or_null
delivery:
  job_id: immutable
  customer_id: reference
  accepted_at: ISO8601_or_null
  delivery_cost_actual: decimal
  defects_count: integer
invoice:
  invoice_id: immutable
  customer_id: reference
  issue_date: date
  due_date: date
  paid_date: date_or_null
  net_amount: decimal
```

Nicht alle Felder zu Beginn instrumentieren. Für den **aktuellen Engpass** zunächst die minimal nötigen, korrekt definierten Felder erfassen.

### D7.5 Entscheidungen bei Zielkonflikten

**Wenn Marketing liefert, Sales nicht:** zuerst Quelle/Qualifizierung, Kontaktgeschwindigkeit, Gesprächsqualität und Angebotsfit gegeneinander prüfen. Nicht reflexartig das Marketingbudget verdoppeln.

**Wenn Sales liefert, Delivery bricht:** Verkaufsvolumen drosseln oder nur lieferbaren Scope verkaufen; Capacity, SOP, Training oder Produkt beheben.

**Wenn Delivery hervorragend, aber Akquise teuer:** Job-/Positionierungsfit und Channel überprüfen; nicht automatisch mehr Features.

**Wenn Produkt genutzt wird, Cash fehlt:** Zahlungsstruktur, Abrechnung und Finanzierungslücke gesondert behandeln; Usage ist kein Zahlungseingang.

**Wenn Mitarbeiter motiviert, aber Ergebnisse inkonsistent:** Prozessgrenzen, Entscheidungskompetenzen und QA-Checkpoints definieren; mehr Druck ist keine Systemarchitektur.

### D7.6 Feedback-Loop mit Codierungen

Im CRM pro Deal und Delivery-Fall erheben:
- Kaufen/Nichtkaufen: *ein* primärer Grund plus optional sekundäre Gründe;
- versprochener Nutzen und tatsächlich erreichter Nutzen;
- Einwände mit Evidenzbezug;
- unerwartete Delivery-Sonderfälle;
- Hauptgrund für Upgrade, Renewal, Cancellation.

Monatlich nicht nur häufigste Nennung zählen, sondern nach **finanzieller Wirkung je Grund** priorisieren. Ein seltener Fehler kann teurer sein als 100 banale Beschwerden.

## N5.11 Founder-Entkopplung, Delegation und Talentökonomie [A/F/W]

_Herkunft: Normalfassung, Zeilen 426 bis 462_

**Zweck:** Qualität reproduzierbar machen, auch wenn der Gründer nicht jedes Kundengespräch oder jede Entscheidung selbst führt. **Einsatz:** Gründer-Flaschenhals, Dienstleistungswachstum, Multi-Team-Unternehmen.

**Eingaben:** Zeit-Audit, Fehler-/Rework-Quoten, Kundenbeschwerden, Kernrollen, Prozessdokumentation, Recruitingkosten, Führungsbandbreite.

**Schritte:**
1. Founder-Aktivitäten über 2 Wochen erfassen: Entscheiden, Verkaufen, Liefern, Retten, Administration.
2. Aufgaben nach **Wert, Wiederholbarkeit, Urteilsbedarf, Risiko** klassifizieren.
3. Erst klare, wiederholbare Arbeit mit definiertem Input/Output standardisieren.
4. SOP mit Trigger → Schritte → Qualität → Ausnahmebehandlung → Eskalation schreiben.
5. Rolle nach Outcomes statt Aktivitäten beschreiben (Role Scorecard).
6. Über 2–4 Cases kontrolliert übergeben; Kompetenz durch tatsächliche Qualität nachweisen.
7. Stellvertreter und Feedbackschleifen einrichten; bei Expertenleistungen anspruchsvollen Recruiting- und Trainingsprozess vorsehen.

**Beispiel [B]:** Agentur-Founder nimmt jede Kundenfreigabe persönlich vor (12 h/Woche). Ein standardisiertes Briefing, Freigabekriterien und Eskalation für Sonderfälle reduzieren manuelle Founder-Zeit auf 3 h/Woche bei konstantem Fehlerrisiko. **Wichtig:** 9 gesparte Stunden sind erst dann wirtschaftlich ein Hebel, wenn sie produktiv neu eingesetzt werden oder echte Kosten/Risiken senken.

**Qualität:** Nachweisbare Ergebnisqualität ohne Founder, Eskalationsgrenzen, Kontrollmetriken. **Fehler:** „Ich habe es delegiert“ bei weiterhin täglicher Rettung durch Founder. **Verbesserung:** Shadow → Reverse Shadow → Freigabe → Stichprobenkontrolle als Übergabeprozess.

## N5.12 Recruiting- und Ausbildungsmaschine für Expert Services [A/W]

**Zweck:** Hochwertige Serviceleistung nicht auf eine brillante Einzelperson begrenzen. **Einsatz:** Coaching, Consulting, Fachdienstleistung, komplexe Agentur.

**Eingaben:** Kundenstandards, Kompetenzlevel, Qualitätsrubrik, Auslastung, Umsatz/Betreuer, Cost to Hire, Time to Proficiency, Kündigungsrisiko.

**Schritte:**
1. Geschäftliche Kernfähigkeiten der besten Experten in beobachtbare Verhaltensanker zerlegen.
2. Kandidatenakquise als Funnel aufbauen: Reichweite → Bewerbung → Probeaufgabe → Interview → Probearbeit → Angebot → Einarbeitung.
3. Arbeitsproben stärker gewichten als Lebenslauf-Marketing.
4. Ausbildung mit Trainingsfällen, Review und Zertifizierung vor Live-Kunden.
5. Wirtschaftlichkeit: kundenseitiger Contribution des Betreuers minus vollständige Beschäftigungskosten und Ausbildungskosten.
6. Entwicklungspfade, Verantwortung, Incentives und Kundenbeziehung so gestalten, dass gute Leute bleiben können, ohne unhaltbare Bindungsversprechen.

**Beispiel [B]:** Beratungsboutique kann jährlich 20 neue Kunden verkaufen, aber Lead Consultant ist 100 % ausgelastet. Neue Junior-Hires verlieren im Pilot 15 Qualitäts-Punkte gegenüber Senior. Erst ein Talent-Funnel mit klaren Fallübungen und 6-Wochen-Training bringt Qualität auf Zielniveau; erst danach skaliert Akquise. KPIs: Time-to-Proficiency, First-pass-Qualität, Client Retention und Contribution je Consultant.

**Qualität:** Training beweist Outputqualität, nicht bloße Kursanwesenheit. **Fehler:** Schlechte Delivery als Marketingproblem deuten; nur billige Nachwuchskräfte einstellen und Premiumversprechen verkaufen. **Verbesserung:** Kompetenz-Matrix, Review-Kalibrierung und Attraktivität für hochqualifizierte Mitarbeiter erhöhen.

## D8.5 Talent-, Recruiting- und Delegationsengine [A/W]

_Herkunft: Deepfassung, Zeilen 727 bis 744_

Das **Recruiting** kann bei personalintensiver Dienstleistung der eigentliche Wachstumsfunnel sein:

`Kandidatenreichweite → Bewerbungen → Vorqualifizierung → Arbeitsprobe → Angebot → Einstellung → produktiv im Standardfall → zuverlässig mit Qualitätsziel → Bindung`.

Kennzahlen:
- `Applicants per qualified hire`;
- `Time-to-Productivity`;
- `First-pass QA`;
- `Accepted jobs per FTE`;
- `Retention qualified staff`;
- `Quality-adjusted CM per FTE`.

**Entscheidung:** Mehr Ads für Kunden nur, wenn ausreichend produktive Mitarbeitende vorhanden sind oder der Hiring-Funnel parallel bewiesene Kapazität schafft.

**Delegationsreife:** Scope, Erfolg, Entscheidungsspielraum, Input, QA, Eskalation und Feedback sind spezifiziert. Eine Aufgabe ohne Entscheidungsrechte zu delegieren erzeugt Wartezeiten und Gründerabhängigkeit.

## N7.5 Founder-Psychologie als operativer Risikofaktor [A/W]

_Herkunft: Normalfassung, Zeilen 675 bis 684_

**Muster:** Neuheitsreiz, perfektionistisches Zögern, Kontrollbedürfnis, Identitätsbindung ans Produkt, Wechsel zwischen Strategien, Verwechslung von Beschäftigung und Output.

**Gegenmittel:** Entscheidungsjournal, fixe Experimentzyklen, öffentlich intern vereinbarte Fokusregeln, Team-Scorecards, messbare Ausgaben statt Stundensammeln.

**Anweisung:** Bei Überforderung nicht zehn neue Frameworks liefern. Primäre Entscheidung formulieren, den nächsten umsetzbaren Schritt mit 60–90 Minuten Aufwand ableiten und den Rest bewusst parken.

## D8. Systeme, Automation und wiederholbare Geschäftsprozesse [A/F/W]

_Herkunft: Deepfassung, Zeilen 656 bis 726_

### D8.1 Automation ist der letzte von vier Schritten

1. **Eliminieren:** Muss der Schritt stattfinden? Ist er Kundenwert oder Bürokratie?
2. **Vereinfachen:** Standard-Input, Decision Rules, Ausnahmegrenzen, ein Owner.
3. **Stabilisieren:** manueller Prozess funktioniert wiederholt mit verlässlicher QA.
4. **Automatisieren:** erst wenn Auslöser, Zustände, Fehlerfälle, Rollback und Verantwortlichkeit definiert sind.

**Gegenbeispiel:** Ein KI-Agent automatisiert Angebotsfreigaben, obwohl niemand die Margenuntergrenze festgelegt hat. Das verstärkt unprofitable Deals.

### D8.2 SOP als ausführbarer Vertrag

Jeder kritische Prozess braucht:

```yaml
process_id: fulfillment_handover_v1
trigger: "customer_contract_signed"
owner_role: "Delivery Lead"
inputs_required:
  - signed_scope
  - payment_status
  - customer_contact
start_state: "accepted"
states: [accepted, scheduled, in_progress, qa, delivered, rejected, closed]
steps:
  - "Prüfe Scope und vertragliche Pflichtangaben"
  - "Prüfe Kapazität gegen SLA"
  - "Verteile Owner und Termin"
  - "Dokumentiere Durchführung"
  - "Führe QA anhand Checkliste aus"
  - "Erfasse Abnahme/Fehler und schließe ab"
guardrails:
  - "Nicht ohne gültige Kundendaten ausführen"
  - "Keine stillschweigende Scope-Erweiterung"
  - "Bei QA-Fail menschliche Eskalation"
metrics: [on_time_rate, accepted_first_pass_rate, cost_per_accepted_job]
exception_owner_role: "Operations Manager"
rollback: "Auf manuellen Ablauf mit Audit-Log wechseln"
```

Qualitätsstandard: Ein neu eingestellter, passend qualifizierter Mitarbeiter kann den Standardfall ohne Founder-Nachfrage bearbeiten; ein Fehlerfall wird zuverlässig eskaliert.

### D8.3 Automations-Kandidaten ranken

Zuerst **Fehlertoleranz** prüfen:
- hohe Wiederholungsrate;
- geringe Varianz / definierter Input;
- niedriger Schaden bei Fehlentscheidung;
- maschinell überprüfbare Ausgabe;
- menschlich revidierbar;
- Datenzugriff rechtmäßig, sicher und geringstmöglich;
- ausreichend Zeitersparnis oder Qualitätserhöhung.

**Ökonomik:**

`Netto-Jahreswert = eingesparte echte Kosten + nachweisbarer zusätzlicher CM − Betriebskosten − erwartete Fehlerkosten − laufende QA-Kosten − Amortisierung/Implementierungsaufwand`

**Wichtige Korrektur:** „100 Stunden gespart“ ist nicht automatisch „100 Stunden Lohn eingespart“. Es ist nur ein Cash-Effekt, wenn Kosten tatsächlich entfallen oder freigewordene Kapazität profitabel genutzt wird. Sonst Kapazitätsgewinn getrennt bewerten.

### D8.4 Automation-Risikoklassen

| Klasse | Typische Aufgabe | Kontrolle |
|---|---|---|
| niedrig | interne Formatierung, Dubletten-Vorschlag | Stichprobe |
| mittel | Lead Routing, Standardfollowup, Rechnungsentwurf | Regeln, Audit-Log, manuelle Freigabe bei Ausnahmen |
| hoch | automatische Preissonderfälle, individuelle Kundenversprechen | Vier-Augen-Freigabe, Limits, Nachvollziehbarkeit |
| kritisch | Zahlungen, Kündigungen, personal-/rechtsrelevante Entscheidungen | menschlicher Entscheid, Sicherheits-/Compliance-Prüfung |

Den Agenten nicht zum einzigen Kontrollinstanz machen. Bei produktiven Systemen Berechtigungen, Datensparsamkeit, Secret-Handling, Logging und Rollback dokumentieren.

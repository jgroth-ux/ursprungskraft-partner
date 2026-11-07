---
title: "Business Architect Deep — Business Decision Playbook für Claude Code"
filename: "business-architect-deep.md"
language: "de"
edition: "1.0"
artifact_type: "technical-knowledge-base"
purpose: "Entscheidungsfähigkeiten für einen autonomen KI-Business-Architekten"
companion: "business-architect.md"
status: "EXPORT_COMPLETE"
---

# Business Architect Deep — Decision Playbook

> **Mandat:** Aus unvollständigen Geschäftsangaben eine überprüfbare, wirtschaftlich begründete **nächste Entscheidung** ableiten; bei mehreren Möglichkeiten die ökonomischen und operativen Trade-offs darstellen; Entscheidungen in kontrollierbare Experimente, Verantwortlichkeiten und Stop/Go-Gates übersetzen. Dieses Dokument ist **kein Blog, kein Motivationsskript und kein Ersatz für echte Geschäftsdaten**.

## 0. Nutzungsvertrag, Wissensprovenienz und Abgrenzung

### 0.1 Einsatz als Ergänzung

Dieses Playbook ergänzt `business-architect.md` um **vergleichende Entscheidungslogik**, kausale Diagnostik, explizite Rechenverfahren, Ungewissheitsmanagement, 30-/60-/90-Tage-Gates und detaillierte Entscheidungscases. Die Basisdatei liefert breiter angelegte Fachdefinitionen, SOPs und Hintergrund. Bei Abweichungen haben **reale, überprüfte Unternehmensdaten** Vorrang vor beiden Dateien. Ein Grenzwert aus einem Fallbeispiel ist **kein allgemeiner Benchmark**.

### 0.2 Typisierte Wissensherkunft

- **[G] Kontextgestützte Spezialisierung:** Aus dem tatsächlich zugänglichen fachlichen Business-Architect-Kontext abgeleitete Denklogik; sinngemäß, nicht als Zitat oder verborgene Anweisung. Dazu gehören: das tatsächliche Engpassgeschäft hinter dem sichtbaren Produkt erkennen; Phase-vor-Taktik; vorhandene Gewinner verbessern, bevor neue Wetten gestartet werden; Wiederholung und kumulierenden Nutzen bewerten; Gründerrolle (Craft, Hybrid, Operator) ausdrücklich beachten; Systeme und Talent als Skalierungsvoraussetzung betrachten; Selektivität bei Kapital- und Aufmerksamkeitsallokation.
- **[F] Allgemeine Fachmethode:** Deckungsbeitragsrechnung, Cashflow-Prognose, JTBD, Wettbewerbsanalyse, Experimente, Kohorten, Optionswert, Theory of Constraints, Unit Economics, Prozessmanagement und Risikosteuerung.
- **[O] Operationale Synthese:** Hier neu spezifizierte Entscheidungsgates, Checklisten, Datenverträge, Priorisierungsverfahren und Agenten-Workflows. Nützlich als Arbeitsstandard, jedoch nicht empirisch universell validiert.
- **[S] Synthetischer Fall:** Sämtliche konkret durchgerechneten Firmendaten, Preise, Kosten, Risiken und Quoten sind **frei erfunden, allein didaktisch** und weder Branchenreferenzen noch Leistungsversprechen.

Jede substanzielle Methode ist im Dokument entsprechend erkennbar. **GPT-spezifisch** bedeutet hier eine aus verfügbaren Business-Architect-Fachinhalten ableitbare *Perspektive*, nicht einzigartige geheime Algorithmen, nicht ein behaupteter Zugang zu privaten Daten und keine Erfolgsgarantie.

### 0.3 Arbeitsweise bei realen Fällen

**Mindestoutput** jeder Entscheidung:

1. **Beschlussvorschlag** in einem Satz mit Gültigkeitsbedingung.
2. **Faktentabelle**: Beobachtung / Zeitraum / Einheit / Quelle / Datenqualität.
3. **Konkurrierende Erklärungen** (mindestens zwei) und Evidenzlage.
4. **Optionen** einschließlich Nichtstun oder Optimieren der bestehenden Lösung.
5. **Marginale Ökonomie** je Option (nicht nur Umsatz; auch Cash und Kapazität).
6. **Downside, Irreversibilität und kritische Annahmen**.
7. **Gewählte Option**, verworfene Alternativen und Umkehrbedingung.
8. **7–14-Tage-Start**, 30/60/90-Tage-Gates, Owner und Kennzahlen.
9. **Was würde meine Meinung ändern?** Eine konkret messbare Beobachtung.

**Nicht zulässig:** Kennzahlen erfinden; beobachtete Umsätze mit Prognosen vermischen; auf unklarer Brutto-/Netto-Basis rechnen; Win-Win behaupten, obwohl Ressourcenkonflikte vorliegen; Benchmark ohne Übertragbarkeit als Gesetz verwenden; mehr Marketing empfehlen, ohne Delivery- oder Cash-Grenzen zu prüfen.

### 0.4 Datenqualitätsnotation

| Status | Bedeutung | Handlung |
|---|---|---|
| `OBS` | direkt gemessen, definierter Zeitraum und Nenner | verwenden, Plausibilität testen |
| `REC` | aus CRM/Accounting rekonstruierbar | reproduzierbar aggregieren |
| `REP` | Selbstauskunft ohne Audit | vor großen Commitments prüfen |
| `EST` | Schätzung mit offengelegter Methode | Range und Sensitivität |
| `HYP` | ungetestete Hypothese | Testdesign statt Faktbehauptung |
| `UNK` | unbekannt | Entscheidungsgrenze und Messauftrag |

**Fehlende Werte ≠ null.** Der Agent darf `UNK` nicht als `0` buchen. Wenn Preis, CAC oder Churn fehlen, ist dies eine Datenlücke, keine Aufforderung zur Erfindung.

---

# 1. Decision Operating System

## 1.1 Das tatsächliche Optimierungsziel [G/F/O]

Ein Business-Stratege maximiert nicht isoliert „Umsatz“. Er sucht eine Strategie, die innerhalb der realen Restriktionen **nachhaltigen, risikoadjustierten Eigentümerwert** erhöht. Als pragmatische operative Proxy-Metrik:

`Inkrementeller erwarteter Deckungsbeitrag nach vermeidbaren Zusatzkosten – zusätzliche Fixkosten – erwartete Verlustkosten`

unter den Nebenbedingungen

- Mindestliquidität zu jedem Zahlungszeitpunkt;
- Erfüllungsqualität und regulatorische Integrität;
- verfügbare Teamkapazität und Founder-Zeit;
- tragbares Downside-Risiko;
- expliziter Entscheidungs- und Beobachtungszeitraum.

Bei Investitionen über mehrere Perioden: diskontierte freie Cashflows plus ggf. terminaler Wert **nur wenn belastbar ableitbar**. Kein Pseudopräzisions-NPV mit frei erfundener Diskontrate.

**Maxime:** Eine attraktive strategische Option ist oft nicht die mit dem höchsten Mittelwert, sondern die mit dem besten Verhältnis zwischen Upside, Downside, Lernwert, Wiederholbarkeit und Bindung knapper Ressourcen.

## 1.2 Entscheidungskette: `FACT → CAUSE → OPTIONS → ECONOMICS → RISK → GATE`

**FACT — Lage:** 30/90 Tage, Baseline, Definitionen und Konfidenz.  
**CAUSE — Ursache:** Welcher Teil des Wertstroms limitiert? Welche Alternativerklärungen?  
**OPTIONS — Wege:** Status quo optimieren, Prozess beheben, Angebot verändern, Kanal wechseln, skalieren, stoppen.  
**ECONOMICS — Effekte:** Incremental CM, Payback, Cash Trough, Zeit, Kapazität, Wiederkauf.  
**RISK — Schutz:** Was kann schiefgehen? Wie teuer ist der Fehler? Wie reversibel ist er?  
**GATE — Aktion:** Kleinster entscheidender Test, Datum, Owner, Mindestbeweis und Kill-Kriterium.

**Do not skip CAUSE:** Schlechte Umsätze können ein Akquise-, Qualifizierungs-, Preis-, Sales-, Fulfillment-, Churn- oder Zahlungsproblem sein. Dass dieselbe Symptom-Metrik fällt, macht die Interventionen nicht austauschbar.

## 1.3 Entscheidungstypen [F/O]

| Typ | Beispiele | Prozess |
|---|---|---|
| Typ A: gut reversibel, geringe Downside | Landingpage, Sales-Skript, manuelle Prozessprobe | schnell testen, kleines Budget |
| Typ B: begrenzt reversibel | Preispaket, Kanalbudget, Teilzeitrolle | schriftliches Gate, klare Guardrails |
| Typ C: schwer reversibel | Marktwechsel, Enterprise-Plattform, langfristiger Mietvertrag, Firmenkauf | Due Diligence, Szenarien, pre-mortem, liquide Reserve |
| Typ D: existenziell | mögliche Zahlungsunfähigkeit, rechtlich riskantes Versprechen | Cash-/Sicherheitsvorrang, Spezialisten einbeziehen |

**Wenn Information teuer und Reversibilität hoch:** handeln und messen. **Wenn Downside ruinös oder irreversibel:** Beweislast erhöhen. Die Regel gilt nur, wenn die Handlung keine Dritten unvertretbar gefährdet.

## 1.4 Entscheidungsregel ohne Scheingenauigkeit [O]

Verwende **zweistufige Priorisierung**:

**Stufe 1 — harte Ausschlüsse:**
- Ist die Option rechtswidrig, irreführend oder real nicht lieferbar?
- Gefährdet sie kurzfristig Löhne, Steuern, kritische Verbindlichkeiten oder Kundenschutz?
- Verletzen Cash-, Qualitäts- oder Kapazitätsgrenzen die vereinbarten Schwellen?
- Ist die relevante Entscheidung aufgrund fehlender Mindestinformationen überhaupt vergleichbar?

**Stufe 2 — Rangfolge:** Beurteile je Option ordinal (`hoch / mittel / niedrig`) für:
1. erwarteten *inkrementellen* Cash-/CM-Beitrag im Zielhorizont;
2. Ausmaß des aktuellen Engpasses, das sie behebt;
3. Wahrscheinlichkeit der Umsetzung;
4. Zeit bis zum ersten belastbaren Signal;
5. Reversibilität;
6. Abhängigkeit von Founder-Zeit, Personal, Kapital, Fremdsystemen;
7. Lern- und Wiederverwendungswert.

Ein Summenscore darf als **Diskussionshilfe** dienen, aber keine fatalen K.O.-Kriterien überdecken. Bei eng beieinander liegenden Optionen priorisiere jene, deren **kritische Ungewissheit am billigsten testbar** ist.

## 1.5 Strategische Fragen, die jede Analyse antreiben [G/O]

- **Welches Geschäft betreiben wir tatsächlich?** Nicht Produktbezeichnung, sondern wiederkehrender, am schwersten reproduzierbarer Wertschöpfungsschritt.
- **Was bricht beim doppelten Volumen zuerst?** Akquise, Sales, Cash, Menschen, Qualität, Produkt, Compliance?
- **Wodurch entstehen Rückkäufe und Empfehlungen?** Die wirklichen Gründe, nicht die beworbene Geschichte.
- **Was würde auch nach 100 Wiederholungen besser werden?** Daten, SOPs, Reichweite, Reputation, Teamfähigkeit, Einkauf oder Code.
- **Welches Problem wurde bisher umgangen, weil eine neue Idee aufregender wirkt?**
- **Ist eine Entscheidung für den Founder als Craft-Spezialist, Hybrid oder Operator plausibel?** [G]

---

# 2. Profitable Geschäftsmodelle analysieren, entwickeln und vergleichen [F/G/O]

## 2.1 Business Model = überprüfbare Transaktions- und Leistungskette

Erfasse für *jede* Kandidatenoption im selben Raster:

1. **Job:** Wer will in welcher Situation welches Ergebnis erreichen?
2. **Kauf:** Wer entscheidet, zahlt, nutzt, empfiehlt und blockiert?
3. **Wertrealisation:** Was wird ausgeliefert, nach welchem Service-Level?
4. **Preis-/Erlöseinheit:** pro Auftrag, Nutzer, Standort, Seat, Ergebnis, Nutzung, Lizenz, Zeitperiode?
5. **Zahlungszeit:** vorab, bei Lieferung, nach Abnahme, gestaffelt?
6. **Acquisition Engine:** Lead → qualifiziert → Kunde; Kosten je *inkrementeller* Gewinnung.
7. **Cost Engine:** COGS, Delivery-Stunden, Support, Zahlungsgebühren, Refunds, Vertrieb und Overhead.
8. **Retention/Expansion:** Wiederkäufe, Verlängerungen, Upsells, Risiken der Kohorten.
9. **Capacity Engine:** qualifizierte Talente, Produktkapazität, Infrastruktur, Founder-Zeit.
10. **Moat Engine:** akkumuliert Vorteil nach Wiederholung oder ist jede Transaktion wieder bei null?

Wichtig: Ein Modell mit hohen Bruttomargen kann wegen langer Zahlungsziele, hoher CAC oder geringer Wiederholung finanziell fragil sein. Ein Modell mit niedrigerer Marge kann wegen Vorauszahlung, Standardisierung und geringer Volatilität attraktiver sein.

## 2.2 Vergleichsgrammatik: Einheiten zuerst

Verwende diese Bezeichnungen **vor** der Rechnung:

- `P`: Nettoeinnahme pro Transaktion *ohne* Umsatzsteuer.
- `C_var`: echte variable Kosten derselben Transaktion (Leistung/COGS, Payment, Versand, Refund-Erwartungswert, variable Partnergebühren).
- `CM1 = P - C_var`: Deckungsbeitrag vor Akquisitionskosten.
- `CAC_inc`: inkrementelle Akquisitionskosten pro tatsächlich gewonnenem Neukunden, inklusive zurechenbarer Sales-Kosten; Attribution separat prüfen.
- `CM2_new = CM1_new - CAC_inc`: Ersttransaktionsbeitrag nach Akquise.
- `CM_life`: erwarteter undiskontierter Kundenbeitrag über definierte Lebensdauer **vor** CAC; bei stark wechselnden Zeitpunkten Cashflows separat modellieren.
- `CM_life_net = CM_life - CAC_inc`.
- `Fixed_add`: durch die Entscheidung zusätzlich benötigte periodische Fixkosten.
- `Net_increment = Σ inkrementelle CM1 – inkrementelle Akquise- und Prozesskosten – Fixed_add`.
- `Cash_t`: Kassenbestand aus **Ein-/Auszahlungen**, nicht GuV.
- `Bottleneck_hour`: qualifizierte Stunde der begrenzenden Ressource.

**Anti-Doppelzählung:** Wenn Vertriebslöhne im CAC stehen, nicht erneut als variable Sales-Kosten im Modell abziehen. Wenn „gross profit“ schon Refunds und Payment enthält, nicht doppelt einrechnen. Wenn Umsatz in MRR angegeben ist, ist er nicht automatisch kassenseitig im selben Monat zugeflossen.

## 2.3 Business-Model-Archetypen: Entscheidungsrelevante Unterschiede

| Modell | Ökonomischer Vorteil | Engpass-/Risikohypothese | Bevorzugen, wenn … |
|---|---|---|---|
| individuelle Dienstleistung | schnell validierbar, hohe Kundennähe | Founder-Zeit und Qualitätsvarianz | kleine Menge hochpreisiger Kunden, ausgeprägter Spezialnutzen |
| produktisierte Dienstleistung | wiederholbare Sales/Delivery, klarer Scope | Ausnahmefälle zerstören CM | Kunden-Jobs ähnlich und standardisierbar |
| Retainer | Planbarkeit/Beziehungswert | fortlaufender Proof, Churn, Leistungsstau | Nutzen kontinuierlich realisiert wird |
| Software/SaaS | niedrige Grenzkosten nach Aufbau | Time-to-Product, Zuverlässigkeit, Churn, CAC | wiederkehrender, präzise automatisierbarer Job mit echter Nutzung |
| Transaktionsmodell | Wertabschöpfung passend zur Aktivität | Volumenschwankung, Fraud, Take Rate | messbare, vertrauenswürdige Transaktionsereignisse |
| Lizenz/Franchise | Kapitalhebel durch Dritte | Qualitätskontrolle, Governance, Marke | Prozesse und Training replizierbar |
| E-Commerce/physisches Produkt | Reichweite und Sortiment, wiederholte Käufe möglich | Working Capital, Retouren, Inventar, Distribution | nachweisbare profitable Akquise und Nachfrage |
| Marketplace | mögliche Netzwerkeffekte | Cold Start, Liquidität beider Seiten, Vertrauen | enges Segment mit dichtem Angebot und Nachfrage |
| Outcome-/Revenue-Share | Alignment und Upside | Kausalität, Cash-Lag, Kundenabhängigkeit, Streit | Outcome sauber messbar und kontrollierbar |
| Hybrid | Cross-Sell / differenzierte Ertragslogik | Komplexitäts- und Fokussteuer | verbundene Leistungen verbessern CM, Retention oder Vertrieb |

**Keine Rangliste nach „Skalierbarkeit“.** Software mit unbewiesenem Product/Market Fit ist nicht automatisch besser als eine hochprofitable Expertendienstleistung. Die relevante Frage ist: *welches Modell erzeugt unter heutigen Fähigkeiten, Zugängen und Kapitalrestriktionen den besten risikoangepassten Lern- und Zahlungsstrom?*

## 2.4 Modellvergleich in vier Schichten [O]

**Schicht A — Vorbedingung:** existiert das zahlungsbereite Problem? Glaubwürdiger Channel-to-Buyer? Leistung lieferbar?  
**Schicht B — Stückökonomie:** positive CM1; CAC-Payback vs. Liquiditäts- und Churn-Profil; Refunds, Steuern, Kapitalbindung; Marktgröße plausibel.  
**Schicht C — Engpass-Ökonomie:** DB je knapper Expertenstunde, Service-Level, Qualitätsverlust bei Volumen, Talent-/Codeabhängigkeit.  
**Schicht D — Langfristiger Vorteil:** kumulierte Daten, Marke, Switching Costs, Lernkurve, Distributionszugang, mehrjährige Verträge, Eigentum an Kernfähigkeiten.

Wähle keinen Kandidaten, der A nicht besteht, nur weil das Tabellenmodell bei D beeindruckend aussieht.

## 2.5 Projektidee zu Geschäftsmodellhypothesen

Muster:

`Segment + akuter Job + Status-quo-Kosten + versprochener Output + Proof + Liefermechanismus + Preismechanik + Distributionsweg + Unit Economics + kritische Ungewissheit`

**Beispiel [S]:** „Für kleine Hausverwaltungen mit wiederkehrenden Schlüsselübergaben standardisieren wir die Buchung, Disposition und Fotodokumentation. Preis: 79 € pro erfolgreicher Übergabe; Service im festgelegten Radius. Erst testen wir 20 bezahlte Aufträge manuell. Der ökonomische Killer ist möglicherweise nicht Akquise, sondern verlässliche Einsatzkräfte zwischen 17 und 20 Uhr.“ Die Marktaussage muss im echten Projekt empirisch belegt werden.

## 2.6 Make/Buy/Partner und Grad der Vertikalisierung [F/O]

Wertschöpfungsschritt `X` wird intern aufgebaut, wenn:
- Ausfall von X die zentrale Differenzierung oder das Kundenversprechen zerstört;
- wiederkehrende Qualität/Iteration eine einzigartige Fähigkeit benötigt;
- Daten, Sicherheit, IP oder SLA externe Kontrolle riskant machen;
- das interne Skalierungsmodell einschließlich Managementaufwand günstiger oder robuster ist.

Outsourcing bevorzugen, wenn X austauschbar und standardisiert ist, vertraglich messbare Ergebnisse hat, Ausfall begrenzt bleibt und Anbieterwechsel realistisch möglich ist.

**Praxis:** In softwareabhängigen Unternehmen kann ein externer Entwicklungsdienstleister ausführend sinnvoll sein; technische Produktverantwortung, Codezugang, Abnahmetests, Architekturentscheidungen und Incident-Fähigkeit dürfen dann nicht vollständig außerhalb der Organisation liegen. [G/O]

## 2.7 Negativtest für Geschäftsmodelle

**Verwerfe oder baue um**, wenn eines zutrifft:
- Einmaliger Umsatz deckt nicht einmal inkrementelle Lieferung und Akquise, während Retention unbewiesen ist.
- Wachstum erfordert nicht verfügbare Fachkräfte oder Gründerstunden.
- Kundenerfolg lässt sich nur durch systematisch irreführende Zusagen erzeugen.
- Geschäftsmodell ist dauerhaft von einem Zugang abhängig, der jederzeit willkürlich entzogen werden kann, ohne Alternativplan.
- Forecast funktioniert ausschließlich bei optimistischen Churn-, CAC- und Preisannahmen.
- Liquiditätslücke ist vor erwarteter Validierung unfinanzierbar.

---

# 3. Marktchancen, Zielgruppen und Wettbewerbsvorteile entscheiden [F/G/O]

## 3.1 Segmentierung nach Kaufmechanismus, nicht Demografie

Beschreibe jedes Segment über:
- **Auslöser:** Ereignis, das das Problem sofort teuer macht.
- **Zu erledigenden Job (JTBD):** funktional, sozial, emotional, organisatorisch.
- **Erlebte Kosten des Nichtstuns:** Geld, Zeit, Risiko, Reputation, Opportunitätskosten.
- **Budget/Macht:** Zahler und Entscheidungsgremium; Einkaufsprozess.
- **Erreichbarkeit:** konkreter Kanal, vorhandene Kontakte, Datenzugang.
- **Wechselhürden:** Vertrauen, Integrationen, Verträge, Lernaufwand, interne Politik.
- **Value Capture:** welcher Anteil des geschaffenen Werts plausibel als Preis beansprucht werden kann.
- **Delivery Fit:** passt der Kunde in eine wiederholbare Leistung?
- **Proof Speed:** wie schnell kann Nutzen glaubwürdig bewiesen werden?

**Beispiel [S]:** „B2B-Handwerksbetriebe“ ist keine verkaufsfähige Segmentdefinition. „Betriebe mit 8–30 Monteuren, hohem Anteil an Notdiensteinsätzen, die binnen zwei Stunden Kundenrückrufe koordinieren müssen und bereits Dispositionssoftware nutzen“ liefert überprüfbare Akquise-, Produkt- und Integrationshypothesen.

## 3.2 Opportunity Selection: Drei Stufen

**Stufe 1: Ausschluss.** Keine zugänglichen Käufer? Unzulässige Lösung? Kein glaubhaftes Zahlungsereignis? Untragbare Lieferpflicht? Dann nicht weiter priorisieren.

**Stufe 2: Sicht auf Marktmechanik.** Prüfe Segmentanzahl, Frequenz des Problems, erwartete WTP, aktuelle Ausgaben, Wettbewerbsdichte, Wechselgründe, Channel Cost und Supply-Engpass. `TAM` als grober Sanity Check, `SAM` als tatsächlich bedienbarer Markt, `SOM` als mit realistischer Distribution erreichbarer Anteil — keine Marktanteile einfach erfinden.

**Stufe 3: Vorteil jetzt vs. in 24 Monaten.** Ein Gründer mit starken Distributionsbeziehungen kann in einem weniger glamourösen Markt einen höheren erwarteten Nutzen erzeugen als in einem technisch „skalierbareren“ Markt ohne Zugang. Langfristig: Welche Wiederholung verstärkt die Position?

## 3.3 Wettbewerberliste = vier Arten von Alternativen

1. **Direkt:** gleicher Job, ähnliches Verfahren.
2. **Indirekt:** anderer Lösungsansatz.
3. **Intern:** Kunde löst selbst mit People/Excel/Workaround.
4. **Inertia:** Problem wird toleriert oder in Kauf genommen.

Die größte Konkurrenz ist häufig „Wir ändern nichts“. Prüfe das anhand gewonnener und verlorener Deals, nicht an erfundenen Interviews.

## 3.4 Competitive Advantage: Fünf harte Prüfungen

Ein behaupteter Vorteil muss mindestens:
1. **relevant** für den Kauf- oder Wiederkaufauslöser sein;
2. **belegbar** anhand Outcome oder Kosten;
3. **schwer ersetzbar** oder zumindest schwer sofort imitierbar sein;
4. **wirtschaftlich wertvoll** sein, nicht nur schöner;
5. **operativ haltbar** bleiben, auch wenn der Gründer nicht jeden Auftrag selbst erledigt.

Unterscheide **Wedge** (kleiner, klarer Eintrittsvorteil) von **Moat** (anhaltender struktureller Vorteil). „Wir nutzen KI“, „bester Service“ und „alles aus einer Hand“ sind ohne Mechanismus kein Moat.

### Konkurrenzmatrix — Copy-Paste

| Kriterium | Status quo | Anbieter A | Anbieter B | Unser Konzept | Evidenz/Quelle |
|---|---|---|---|---|---|
| Ergebnis/Job | | | | | |
| Preis-/Kostenbasis | | | | | |
| Time-to-Value | | | | | |
| Vertrauen/Proof | | | | | |
| Implementierungsaufwand | | | | | |
| Risiko/Lock-in | | | | | |
| Verfügbarkeit | | | | | |
| Grund für Wechsel | | | | | |

## 3.5 Unüberzeugende Marktsignale erkennen

**Schwach:** Likes, Survey mit „würdest du kaufen?“, nicht bindende Absicht, TAM-Slides, Interesse von Nicht-Zahlern.  
**Stärker:** tatsächliche Adoptionshistorie, bezahlte Pilotverträge, wiederholte Bestellungen, nachweislich budgetierte Problemkosten, Retention und Referenzen, Vergleich mit existierender Alternative.

**Interview-Protokoll:** Frage nach letztem konkreten Vorfall, Folgen, heute genutzten Lösungen, wer Entscheidung und Budget verantwortet, tatsächlichen bezahlten Versuchen. Nicht: „Wäre diese Idee genial?“ Vertrauliche Kundendaten minimieren und nur für vereinbarten Zweck verwenden.

---

# 4. Angebots-, Preis- und Monetarisierungsentscheidungen [G/F/O]

## 4.1 Offer Engineering als Unsicherheitsreduktion [G/O]

Entwickle das Angebot entlang von vier Dimensionen:
- gewünschter **Outcome** des Käufers: konkret, wirtschaftlich relevant;
- **Glaubwürdigkeit**: Cases, Demo, Probe, nachvollziehbare Umsetzung;
- **Zeit bis zum ersten Nutzen**: Onboarding und Time-to-Value;
- **Aufwand und wahrgenommenes Risiko**: Implementierung, Compliance, interne Abstimmung, Ausfall.

Ein großes Versprechen mit schwacher Lieferfähigkeit ist schlechter als ein begrenztes, messbares Versprechen. Nicht alle Käufer maximieren denselben Hebel: CFOs können Risiko und Zahlbarkeit höher gewichten, operative Nutzer Geschwindigkeit und Workflow-Reibung.

## 4.2 Angebotsarchitektur als kontrollierbarer Leistungsumfang

Jedes Angebot erhält:
`ICP → Trigger → Outcome → Inputs des Kunden → Lieferumfang → ausdrücklich ausgeschlossene Leistungen → SLA → Meilenstein → Proof → Preis/Metrik → Zahlungsbedingungen → Risikoaufteilung → Kapazitätseinheit`.

Ein gutes Angebot ist für Sales kommunizierbar, für Operations lieferbar und für Finance rechenbar.

**Beispiel [S]:**
„Innerhalb von vier Wochen ein nachvollziehbar getesteter B2B-Angebotsprozess für Softwarehäuser mit 5–20 aktiven Sales-Mitarbeitern: Funnel-Triage, Interview von fünf jüngst verlorenen Deals, eine Preis-/Scope-Matrix, zwei Skriptvarianten, CRM-Felder und Sales-Review. Keine Garantie auf Umsatzwachstum; Ergebnis ist ein implementiertes Mess- und Testsystem. 6.000 € netto, 50 % Start, 50 % Abnahme, maximal zwei Revisionen.“  
Die genannte Preisgestaltung ist fiktiv und nicht marktbasiert.

## 4.3 Monetarisierungsmodell-Auswahl

| Wert entsteht vor allem … | Erst prüfen | Risiko | Guardrail |
|---|---|---|---|
| bei Implementierung | Setup Fee / Projekt | unklare Abnahme, Scope Creep | Meilensteine, Change Requests |
| kontinuierlich pro Zeit | Retainer / Subscription | Nutzungsflaute, Churn | aktive Nutzung, Value Review |
| proportional zur Nutzung | Usage-based | Volatilität, Rechnungsüberraschung | Caps, transparente Metrik |
| pro realisiertem Vorgang | Transaction Fee | Streit über Ereignis | verifizierbares Event |
| je Mitarbeiter/Standort | Seat / Site | Shelfware, Shared Logins | Adoption, Mindestumfang |
| anhand gemessenem Outcome | Performance Fee | Attribution, Manipulationsanreiz | Baseline, Audit-Rechte, Caps, Fairness |
| vorab für Rechte | License / Franchise | Qualitätsdrift bei Dritten | Training, Kontrollen, Vertragsklarheit |

Die Preis-Einheit soll *wahrnehmbaren Kundennutzen* und *eigene variable Kosten* möglichst harmonisieren. Gegenläufige Anreize sind zu benennen: Reine Stundenpreise bestrafen Effizienz; reine Performance Fees können zu kurzfristigen oder riskanten Taktiken drängen.

## 4.4 Preisentscheidung über Grenzbeitrag, nicht Bauchgefühl

Für ein homogenes Angebot mit bisherigem Preis `P0`, variablen Stückkosten `C0`, Menge `Q0` und neuem Preis `P1` sowie neuen Kosten `C1`:

`Q1_break_even = Q0 × (P0 − C0) / (P1 − C1)`

vorausgesetzt alle übrigen Kosten bleiben gleich; Preisveränderungen können CAC, Refunds und Kundenmix verändern. Veränderte Fixkosten separat berücksichtigen:

`Q1_break_even = [Q0 × (P0−C0) + (Fixed1−Fixed0)] / (P1−C1)`

**Beispiel [S]:** 30 Aufträge/Monat à 2.000 €, variable Kosten 700 €. CM = 30 × 1.300 € = 39.000 €. Neuer Preis 2.600 €, variable Kosten wegen zusätzlichem Support 800 €: erforderliche Menge = 39.000 / 1.800 ≈ **21,67** → mindestens **22 Aufträge** (ohne veränderte Fixkosten). Fällt Nachfrage auf 20, ist der monatliche CM mit 36.000 € niedriger, obwohl der Preis höher ist.

**Preisänderungsreihenfolge:** erst Käufersegmente, WTP-Indizien, Leistung und Kundenrisiko; dann Grenzrechnung; anschließend begrenzter Test mit echten Angeboten. Keine irreführende Referenzpreis- oder Knappheitskommunikation.

## 4.5 Drei-Stufen-Architektur: Wann sinnvoll, wann nicht?

Drei Pakete nur, wenn **drei unterscheidbare Kaufjobs oder Leistungs-/Risikoniveaus** real existieren. Nicht künstlich Boni anhäufen.

- `Essential`: ein eng definierter Outcome, geringste Lieferkomplexität.
- `Core`: Standardangebot, am höchsten operationalisierte Relevanz für ICP.
- `Advanced`: Zusatzwert mit separat kalkulierbaren Leistungsrechten, Priority, Integrationen oder Risikobearbeitung.

Für jedes Paket: Zielkunde, inkludierte Units, Preis, CM, maximale Supportstunden, Upgrade-Trigger, Cannibalization-Test. Wenn Kunden ausschließlich über Pakete verwirrt werden, ein starkes Kernangebot vorziehen.

## 4.6 Pricing-Test als kausale Frage

Ein Preisversuch misst nicht nur `Conversion`. Er misst:
- Umsatz pro qualifiziertem Offer (`Revenue/Qualified Proposal`);
- DB pro Lead und pro gewonnener Kapazitätsstunde;
- durchschnittlichen Discount;
- Refunds, Sales-Zyklus, Win Rate, Qualitäts-/Churn-Folgen;
- Zusammensetzung der Käufer.

Bevorzugt kontrollierte, zeitlich und segmentseitig faire Tests, sofern rechtlich und vertrieblich möglich. Ein reiner Vorher-Nachher-Vergleich kann saisonale, kanal- und vertriebsspezifische Effekte nicht sauber isolieren. Bei geringem Volumen: klares qualitatives Win/Loss, festes Testfenster und längere Beobachtung statt fragwürdiger „Signifikanz“.

## 4.7 Garantie und Risk Reversal ohne Fehlanreiz

Garantie nur, wenn (a) Ergebnis messbar, (b) eigene Leistung wesentlichen Einfluss hat, (c) Missbrauchs- und Refund-Risiko in CM enthalten, (d) Ausschlussbedingungen verständlich und fair sind. Bei unkontrollierbarem Outcome besser **Prozess-, Liefer-, Reaktions- oder Pilotgarantie** statt garantierten Geld- oder Gesundheitsresultaten.

---

# 5. Abwägung: Wachstum, Marge, Skalierbarkeit, Cash und Risiko [F/G/O]

## 5.1 Die Fünf-Spalten-Entscheidung

Jede Wachstumsoption anhand von:
1. `ΔRevenue`: im Zielhorizont inkrementell realisierter Umsatz;
2. `ΔContribution`: nach zusätzlichen direkten Kosten, Akquise und vermeidbarem Overhead;
3. `ΔCash_t`: Zeitpunkt der maximalen Vorfinanzierung (Cash Trough);
4. `ΔCapacity`: Stunden, SLA, Ausschuss, Gründeranteil;
5. `Downside`: Worst-plausible-case, Abhängigkeit, Reversibilität.

**Prioritätskonflikt:** Wenn Umsatz +50 %, aber DB −10 %, Cash Trough unter Sicherheitsminimum und Fehlerquote hochgeht, ist **nicht** „skalieren“ der Default. Optimiere die Ökonomie des zusätzlichen Kunden oder stoppe teure Expansion.

## 5.2 Drei Ökonomiken separat führen

- **Unit Economics:** Ist die Transaktion bzw. Kohorte profitabel?
- **Operating Economics:** Trägt das Volumen Fixkosten, Team und Management?
- **Cash Economics:** Kann das Unternehmen zahlen, bevor die Kunden zahlen?

Positiver EBITDA oder positive Marge garantiert **keine** kurzfristige Zahlungsfähigkeit. Anzahlungen verbessern Cash, können aber Lieferverpflichtungen erhöhen; deshalb offene Leistungsverbindlichkeiten separat führen.

## 5.3 Skalierbarkeit: Grenzkosten und Engpassmobilität

**Wachstum:** mehr Output. **Skalierung:** zusätzlicher Output mit relativ geringerem Einsatz mindestens einer knappen Ressource, *ohne* Qualitätszerfall. Konkret prüfen:

`Incremental CM per Bottleneck Hour = ΔCM / ΔBottleneck_Hours`

und

`Quality-adjusted Throughput = abgeschlossene, akzeptierte Leistungen pro Zeitraum`

Nicht jede Person muss billiger werden. Expertise-Skalierung kann über Recruiting, Training, QA und Spezialisierung entstehen; Software-Skalierung über verlässliches Produkt und niedrige Grenzkosten; physisches Produkt über Distribution und Inventory-Disziplin. [G/O]

## 5.4 Entscheidung bei ungleich verteiltem Risiko

Bei unsicheren Ergebnissen rechne **drei plausible Szenarien** (nicht automatisch 10/50/90 % Wahrscheinlichkeiten vortäuschen):

| Szenario | Kunden/Volumen | CM pro Unit | zusätzliche Fixkosten | Cash Trough | Verletztes Gate? |
|---|---:|---:|---:|---:|---|
| Downside | `D` | `d` | `Fd` | `Td` | |
| Base | `B` | `b` | `Fb` | `Tb` | |
| Upside | `U` | `u` | `Fu` | `Tu` | |

Sensitivität für zwei oder drei **kritische Parameter** (z. B. Churn, Sales-Zyklus, Auslastung) statt einer beeindruckenden, unprüfbaren 50-Spalten-Tabelle. Nur eine echte Wahrscheinlichkeitsverteilung verwenden, wenn sie begründet und kalibriert werden kann.

## 5.5 Entscheidungsbaum: Wachstum freigeben?

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

# 6. Geschäftsprobleme diagnostizieren und Engpässe priorisieren [G/F/O]

## 6.1 Vom Symptom zur Mechanik

Nutze als Diagnoseeinheit den Wertstrom:

`Segment → Aufmerksamkeit → qualifizierte Nachfrage → Angebot/Termin → Abschluss → Zahlung → Onboarding → Lieferung → Nutzung → Retention/Referral`

Daneben die versorgenden Systeme:

`Recruiting/Skills → Kapazität/Qualität`, `Technologie/Daten → Automatisierung/Zuverlässigkeit`, `Finance → Finanzierungslücke/Risiko`.

**Ein Engpass ist nicht automatisch die niedrigste Conversion Rate.** Er ist die Stelle, deren Verbesserung im relevanten Zeitraum den größten **zusätzlichen wertschaffenden Gesamtdurchsatz** erlaubt. Ein 15-%-Show-Rate-Problem ist relevant, wenn die nachfolgenden Stufen Kapazität haben. Sind alle Berater ausgebucht, kann höhere Show Rate zuerst Wartelisten und schlechte Erfahrungen verursachen.

## 6.2 Root-Cause-Protokoll in sieben Schritten

1. **Symptom präzisieren:** „Umsatz fällt um 12 % in 60 Tagen“ statt „Marketing ist schlecht“.
2. **Zahlen in identischen Zeitfenstern segmentieren:** Neukunden vs. Bestandskunden, Kanal, ICP, Produkt, Sales Rep, Kohorte und Rechnung/Kassenlage.
3. **Funnel faktorisieren:** `Revenue = Leads × Qualification × Show × Win × Net Revenue per Win` für passende Sales-Modelle; bei Abo zusätzlich Retention/Expansion.
4. **Kapazitäts- und Erfüllungslimits einzeichnen:** Wo staut sich WIP? Was passiert nach Verkauf?
5. **Mindestens drei kausale Hypothesen formulieren:** z. B. Leadmix, Sales-Ausführung, Preis-Fit, Produktprobleme.
6. **Disconfirming Evidence suchen:** Welche Beobachtung würde die Lieblingshypothese widerlegen?
7. **Marginalen Test wählen:** größte plausible Nettoauswirkung pro knapper Ressource, mit kurzer Signallatenz.

**Fehler:** „Conversion von 20 auf 30 % steigern“ als Plan deklarieren. Das ist eine Zielzahl, keine Intervention, kein Mechanismus und keine Kostenrechnung.

## 6.3 Funnel-Elasticity / Marginalhebel

Bei einem einfachen Sales Funnel:

`Wins = L × q × s × w`
`New CM ≈ Wins × (CM1_first + erwarteter zukünftiger CM1) − zurechenbarer CAC/Sales-Aufwand`

Partielle Sensitivitäten:
- `∂Wins/∂L = q s w`
- `∂Wins/∂q = L s w`
- `∂Wins/∂s = L q w`
- `∂Wins/∂w = L q s`

Aber: Für Entscheidungen zählt `ΔNetContribution / ΔKosten` unter Kapazitätsgrenzen, nicht nur die mathematische Ableitung. Conversion-Änderungen beeinflussen häufig auch Leadqualität, Ticketgröße, Refunds und Churn.

### Synthetische Diagnose

- 400 Leads/Monat
- 50 % qualifiziert → 200
- 50 % Show → 100
- 20 % Win → 20
- CM1 pro Neukunde 1.400 €

Alternative A: Show 50 → 60 % = 120 Gespräche → 24 Wins → +5.600 € CM1 vor Interventionkosten.  
Alternative B: Win 20 → 25 % = 25 Wins → +7.000 € CM1.  
Alternative C: 100 zusätzliche Leads bei unverändertem Funnel = 5 Wins → +7.000 € CM1 **vor** Akquisitionskosten.

**Noch keine Entscheidung:** Die Kosten und Machbarkeit der drei Verbesserungen fehlen. Ein Show-Rate-Test für 300 € kann attraktiver sein als zusätzliche Leads für 5.000 €, *sofern* die gemessene Wirkung kausal ist und Sales-Kapazität vorhanden ist.

## 6.4 Branchenspezifisches „wahres Geschäft“ als Hypothesensammlung [G]

Nicht jede Firma in einer Kategorie teilt denselben Engpass. Prüfe diese **Startfragen**, niemals als unbelegte Branchenregel:

| Sichtbares Angebot | Wahrscheinliches Engpassgeschäft | Beweist/entkräftet |
|---|---|---|
| lokale Mitgliedschaft/Studio | wiederholbare Nachfragegewinnung und Vertrieb, bei Churn auch Retention | Leadkosten, Sales, Churn, Nutzungsquote |
| austauschbare Konsumgüter | Distribution, Aufmerksamkeit, Wiederkauf | CAC, Repeat, Handelszugang, Produktnutzung |
| Software zur Arbeitsersparnis | belastbare Produktleistung und Adoption, dann Vertrieb | Aktivierung, Nutzung, SLA, Churn, Win/Loss |
| Reinigung/Personalservice | Recruiting, Training, Einsatzstabilität | unbesetzte Aufträge, No-Shows, Fehler, Bewerber-Conversion |
| Expertenberatung | Auswahl, Ausbildung, Qualitätskontrolle und Bindung von Talenten | CM pro Experte, QA, Fluktuation, Founder-Dependence |
| Investment-/Beteiligungsgeschäft | Selektivität, Kapitalallokation, Konzentrationsrisiko | Deal-Pipeline, Return Distribution, Opportunitätskosten |

**Umkehrtest:** Sobald reale Kennzahlen gegen die Branchenthese sprechen, **wechsel zur beobachteten Engpasslogik**, nicht zum Branchenstereotyp.

## 6.5 Engpasswanderung

Intervention `I1` kann Problem `P1` lösen und `P2` sichtbar machen. Daher nach jeder Maßnahme:
1. Ist der zuvor gemessene Stau tatsächlich gesunken?
2. Wo sammelt sich jetzt WIP?
3. Sind Wartezeit, Fehlerquote, Cash und Kundenqualität gleich geblieben?
4. Hat sich DB pro begrenzender Einheit erhöht?
5. Soll dieselbe Intervention ausgeweitet oder ein neuer Engpass adressiert werden?

Beispiel: Mehr Leads → vollständig belegter Kalender → höhere No-Show-Rate durch lange Wartezeit → weniger abgeschlossene Aufträge. „Noch mehr Leads“ ist hier die falsche Wiederholung.

## 6.6 Priorisierung: Constraint × CM × Sicherheit × Lernwert

**Empfohlene Sequenz:**
1. Akute Sicherheits-/Liquiditätsprobleme.
2. Defekte in einer bereits bezahlten Leistung, die Kündigung oder Haftung auslösen.
3. Aktuelles Durchsatzlimit mit nachweisbarem CM-Hebel.
4. Wiederholbare Profitabilitätsverbesserungen im bestehenden System.
5. Neue Märkte, Angebote, Partnerschaften und Wetten.

Das ist eine **Default-Reihenfolge, kein starres Gesetz**. Ausnahme dokumentieren, wenn z. B. ein einmaliges Marktfenster nachweisbar existiert.

## 6.7 Konkurrierende Hypothesen statt „eine Wahrheit“

Beispiel „Churn steigt“:

| Hypothese | Falsifizierbares Signal | Nächster Test |
|---|---|---|
| Onboarding-Fehler | Kündiger werden selten aktiviert | Time-to-First-Value nach Kohorte |
| Falsches ICP | Churn besonders im neuen Kanal | Churn/Expansion nach Source und Segment |
| Preisdruck | Kündiger nutzen aktiv und nennen Budget | dokumentierte Win/Loss-/Exit-Interviews |
| Produktinstabilität | Churn folgt Ausfällen | Vorher-Nachher pro betroffener Kohorte |
| Vertragsmissverständnis | Kündiger erwarten nicht gelieferte Funktion | Sales-Promises vs. Produkt-Scope auditieren |

**Entscheidungsdisziplin:** Ohne Indizien keine definitive Ursache behaupten. Diagnose als priorisierte Hypothese kommunizieren.

---

# 7. Marketing, Produkt, Vertrieb und Operations zu einem System verbinden [F/G/O]

## 7.1 Vier Funktionen, ein Vertrag

Ein Unternehmen besitzt keine voneinander isolierten „Growth“, „Sales“ und „Delivery“-Erfolge. Es hat einen **Kundenerfolgsvertrag**:

`Versprochener Outcome (Marketing) ≈ verkaufter Scope (Sales) ≈ gelieferter Scope (Product/Ops) ≈ wahrgenommener Outcome (Customer)`

Messbare Vertragsbrüche:
- Marketing zieht Zielkunden an, die wirtschaftlich nicht lieferbar sind.
- Sales überverspricht Funktionen oder Implementierungstempo.
- Produkt aktiviert Nutzer nicht; Kunden kaufen, aber erleben keinen Nutzen.
- Operations erfüllt zu spät; Sales versucht das mit Rabatten zu kompensieren.
- Finance optimiert AOV, obwohl Retention oder Cashflow leidet.

## 7.2 End-to-End Revenue System

**Marketing besitzt:** erreichbare ICP-Aufmerksamkeit, nachvollziehbare Quellen, qualifizierte Nachfrage und deren Kosten.  
**Sales besitzt:** Diagnose, qualifizierten Abschluss, sauberes Erwartungsmanagement, Win/Loss-Codes.  
**Produkt/Delivery besitzt:** Time-to-Value, Output-Qualität, Rückmeldeschleife, Nutzung, SLAs.  
**Customer Success besitzt:** Adoption, Risikoerkennung, Renewal, Expansion (soweit rollenspezifisch).  
**Finance besitzt:** Definition der CM-Einheit, Liquidität, korrekte Kohorten und Budgetgrenzen.  
**CEO/Operator besitzt:** Priorisierung des Gesamtsystems, nicht die Summe von Abteilungs-KPIs.

**Fehlanreiz:** Sales wird nur nach Vertragswert bezahlt, während Refunds und schlechte Delivery nicht auftauchen. Gegenmaßnahme: teilweise variable Vergütung erst nach erfolgreichem Onboarding/qualitativem Gate; rechtliche und arbeitsvertragliche Umsetzung prüfen.

## 7.3 Operating Cadence [O]

**Täglich (max. 15 Minuten):** offene Versprechen, kritische Kunden, überfällige Zahlungen, Engpass WIP; nur Abweichungen eskalieren.

**Wöchentlich (60 Minuten):**
1. Baseline der letzten 4–8 Wochen vs. aktuelle Kohorte.
2. Ein primärer Engpass, maximal zwei aktive Verbesserungswetten.
3. Auswertung der Tests (inklusive Gegenindikatoren).
4. Cash- und Kapazitätsampel.
5. Entscheidung: fortsetzen / korrigieren / stoppen; Owner & Stichtag.

**Monatlich (2 Stunden):** Profit Pool je Segment und Angebot; Kanalinkrementalität; Retention; Team-/Founder-Abhängigkeit; Budgetverschiebung; Kapazitätsplanung.

**Quartalsweise:** Markt-/Modellannahmen, Customer Economics, wettbewerbliche Differenzierung und strategische „Nein“-Liste erneuern.

## 7.4 Datenübergabevertrag

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

## 7.5 Entscheidungen bei Zielkonflikten

**Wenn Marketing liefert, Sales nicht:** zuerst Quelle/Qualifizierung, Kontaktgeschwindigkeit, Gesprächsqualität und Angebotsfit gegeneinander prüfen. Nicht reflexartig das Marketingbudget verdoppeln.

**Wenn Sales liefert, Delivery bricht:** Verkaufsvolumen drosseln oder nur lieferbaren Scope verkaufen; Capacity, SOP, Training oder Produkt beheben.

**Wenn Delivery hervorragend, aber Akquise teuer:** Job-/Positionierungsfit und Channel überprüfen; nicht automatisch mehr Features.

**Wenn Produkt genutzt wird, Cash fehlt:** Zahlungsstruktur, Abrechnung und Finanzierungslücke gesondert behandeln; Usage ist kein Zahlungseingang.

**Wenn Mitarbeiter motiviert, aber Ergebnisse inkonsistent:** Prozessgrenzen, Entscheidungskompetenzen und QA-Checkpoints definieren; mehr Druck ist keine Systemarchitektur.

## 7.6 Feedback-Loop mit Codierungen

Im CRM pro Deal und Delivery-Fall erheben:
- Kaufen/Nichtkaufen: *ein* primärer Grund plus optional sekundäre Gründe;
- versprochener Nutzen und tatsächlich erreichter Nutzen;
- Einwände mit Evidenzbezug;
- unerwartete Delivery-Sonderfälle;
- Hauptgrund für Upgrade, Renewal, Cancellation.

Monatlich nicht nur häufigste Nennung zählen, sondern nach **finanzieller Wirkung je Grund** priorisieren. Ein seltener Fehler kann teurer sein als 100 banale Beschwerden.

---

# 8. Systeme, Automation und wiederholbare Geschäftsprozesse [G/F/O]

## 8.1 Automation ist der letzte von vier Schritten

1. **Eliminieren:** Muss der Schritt stattfinden? Ist er Kundenwert oder Bürokratie?
2. **Vereinfachen:** Standard-Input, Decision Rules, Ausnahmegrenzen, ein Owner.
3. **Stabilisieren:** manueller Prozess funktioniert wiederholt mit verlässlicher QA.
4. **Automatisieren:** erst wenn Auslöser, Zustände, Fehlerfälle, Rollback und Verantwortlichkeit definiert sind.

**Gegenbeispiel:** Ein KI-Agent automatisiert Angebotsfreigaben, obwohl niemand die Margenuntergrenze festgelegt hat. Das verstärkt unprofitable Deals.

## 8.2 SOP als ausführbarer Vertrag

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

## 8.3 Automations-Kandidaten ranken

Zuerst **Fehlertoleranz** prüfen:
- hohe Wiederholungsrate;
- geringe Varianz / definierter Input;
- niedriger Schaden bei Fehlentscheidung;
- maschinell überprüfbare Ausgabe;
- menschlich revidierbar;
- Datenzugriff rechtmäßig, sicher und geringstmöglich;
- ausreichend Zeitersparnis oder Qualitätserhöhung.

**Ökonomik:**

`Netto-Jahreswert = eingesparte echte Kosten + nachweisbarer zusätzlicher CM – Betriebskosten – erwartete Fehlerkosten – laufende QA-Kosten – Amortisierung/Implementierungsaufwand`

**Wichtige Korrektur:** „100 Stunden gespart“ ist nicht automatisch „100 Stunden Lohn eingespart“. Es ist nur ein Cash-Effekt, wenn Kosten tatsächlich entfallen oder freigewordene Kapazität profitabel genutzt wird. Sonst Kapazitätsgewinn getrennt bewerten.

## 8.4 Automation-Risikoklassen

| Klasse | Typische Aufgabe | Kontrolle |
|---|---|---|
| niedrig | interne Formatierung, Dubletten-Vorschlag | Stichprobe |
| mittel | Lead Routing, Standardfollowup, Rechnungsentwurf | Regeln, Audit-Log, manuelle Freigabe bei Ausnahmen |
| hoch | automatische Preissonderfälle, individuelle Kundenversprechen | Vier-Augen-Freigabe, Limits, Nachvollziehbarkeit |
| kritisch | Zahlungen, Kündigungen, personal-/rechtsrelevante Entscheidungen | menschlicher Entscheid, Sicherheits-/Compliance-Prüfung |

Den Agenten nicht zum einzigen Kontrollinstanz machen. Bei produktiven Systemen Berechtigungen, Datensparsamkeit, Secret-Handling, Logging und Rollback dokumentieren.

## 8.5 Talent-, Recruiting- und Delegationsengine [G/O]

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

## 8.6 Craft / Hybrid / Operator [G/O]

Entscheide Organisationsdesign anhand der **gewünschten Gründerrolle**:
- **Craft:** bewusst begrenztes Volumen, exzellente Leistung, Preis-/Reputationshebel; Ziel muss nicht eine große Organisation sein.
- **Hybrid:** Gründer besitzt einen Schwerpunkt (z. B. Produkt oder Marketing); andere Funktionen führen kompetente Owner.
- **Operator:** Gründer baut Rollen, Systeme und Kapitalallokation statt jeden Auftrag selbst zu liefern.

**Fehlentscheidung:** Einen Craft-Gründer in eine Personalorganisation drücken, obwohl seine beste ökonomische Option höhere Preise bei begrenzter Nachfrage ist. Ebenso unvernünftig: Founder als alleinige QA behandeln, während man ein autonomes Unternehmen verspricht.

---

# 9. Aus unscharfer Idee eine 30-/60-/90-Tage-Entscheidungsfolge bauen [F/G/O]

## 9.1 Input-Normalisierung

Unklare Idee: „KI-Automationen für KMU.“

Formuliere **drei überprüfbare Job-Hypothesen**, nicht sofort drei Produkte:
1. Welche konkrete Handlung kostet heute nachweisbar Zeit/Geld?
2. Welcher Käufer hat Budget und kurzfristige Änderungsbereitschaft?
3. Welche Output-Einheit lässt sich in zwei Wochen verlässlich liefern?
4. Welcher Daten-/Systemzugriff ist nötig? Wie riskant sind Fehler?
5. Welche einfache Alternative existiert? Warum reicht sie nicht?

Schnellster erlaubter Beweis: **bezahlter, eng begrenzter Pilot** mit manuellem Backend. Kein ungeprüftes „Full Platform“-Build.

## 9.2 30 Tage: Problem und Zahlungsbereitschaft

**Ziel:** Eine belastbare Angebots-/Segmenthypothese und erste Zahlungs-/Nutzungsbelege.

- Tage 1–3: ICP, Problemtrigger, Worst-Case-Risiko, 1-seitiges Angebot, Datendefinition.
- Tage 4–10: 10–15 ernsthafte Problemgespräche (Zahl dient als **Arbeitsziel**, nicht als statistischer Nachweis); mindestens drei konkrete bisherige Problemfälle.
- Tage 11–20: reale Angebote, begrenzte bezahlte Piloten; Einwände und No-Buy dokumentieren.
- Tage 21–30: Auslieferung, tatsächliche Stunden/Fehler/Kosten erfassen, Zahlungs- und Nutzensignal vergleichen.

**Gate G30:** Es gibt mindestens einige echte kaufende Nutzer oder einen klaren Zahlungsbeleg, lieferbares Scope, positive oder erklärbar auf dem Weg zur positiven CM1 und eine prüfbare Akquisitionsroute. Andernfalls Segment/Outcome neu zuschneiden — nicht sofort Vollsoftware bauen.

## 9.3 60 Tage: Wiederholbarkeit beweisen

**Ziel:** Mindestens eine zweite nachvollziehbare Verkaufs-/Delivery-Runde im gleichen Segment, ohne jedes Mal die Lösung neu zu erfinden.

- Wiederholung derselben Angebotsvariante.
- CRM und Delivery-Tickets mit einheitlichen Statusfeldern.
- Standard-Onboarding, QA und Kosten-/Zeiterfassung.
- Kohortensicht: bezahlte Leistung, Reklamation, Wiederkauf/Weiternutzung.
- Kanaltest, nur falls Delivery kontrolliert ist.
- Kalkulation von CAC und echten Founder-Stunden.

**Gate G60:** Verkaufsmechanismus ist ansatzweise wiederholbar, der Standardfall hält Qualitätsgrenzen ein, CM und Cash-Lag sind transparent; falls nicht, kein aggressives Scale-Budget.

## 9.4 90 Tage: Inkrementelle Skalierung oder bewusstes Stoppen

**Ziel:** Die stärkste Variante mit kontrolliertem Risiko systematisch ausbauen.

- ein ICP und ein Kernangebot bevorzugen;
- Kapazitäts-/SOP-Engpass lösen;
- begrenztes, messbares Channel-Budget;
- einen Prozess delegieren/automatisieren, dessen Funktion vorher manuell bewiesen wurde;
- 13-Wochen-Cash-Modell pflegen;
- G90 entscheidet: `Scale`, `Iterate`, `Pause`, `Pivot`, `Stop`.

**Gate G90:** zusätzliche Kunden erzeugen positiven (oder bewusst finanzierten) Grenzbeitrag; Qualität bleibt stabil; kein ungeplanter Cash Trough; zumindest ein realer Distributionspfad; Founder ist nicht alleiniger unbeschränkter Kapazitätsdeckel.

## 9.5 Zeitplan nach Unsicherheit verschieben

Die 30/60/90-Takte sind Organisationshilfen, keine Naturkonstanten. Bei Enterprise-Verkäufen, Zulassungen, komplexer Hardware oder saisonalem Markt kann der primäre Kaufbeweis länger dauern. Dann G30/G60 auf **frühere nachprüfbare Meilensteine** umstellen (Budgetfreigabe, Security-Review, technische Machbarkeit, Pilotvertrag), ohne prognostizierte Umsätze als realisiert auszugeben.

## 9.6 Zwei Pfade: Idee vs. bestehendes Unternehmen

| Phase | Neue Idee | Etabliertes Geschäft |
|---|---|---|
| Tage 1–30 | Käufer/Problem/Bezahlung beweisen | Segment-/Funnel-/Cash-Audit, Engpasstest |
| Tage 31–60 | Verkaufs- und Delivery-Reproduzierbarkeit | Engpass beheben, QA und Owner etablieren |
| Tage 61–90 | begrenzte Expansion | Budget/Kapazität nur für nachgewiesenen Hebel erhöhen |

**Vermeiden:** Einem Unternehmen mit 500 Kunden dieselbe „MVP zuerst“-Arbeitsliste geben wie einem Gründer ohne ersten Käufer.

---

# 10. Mit unvollständigen Daten entscheiden und Annahmen validieren [F/O]

## 10.1 Drei Fragen gegen Analyseparalyse

1. **Was muss stimmen, damit Option A besser als B ist?**
2. **Was ist der billigste glaubwürdige Beweis oder Gegenbeweis?**
3. **Wie teuer ist die falsche Entscheidung vor dem nächsten Feedback?**

Manchmal ist die beste nächste Entscheidung, **nichts Irreversibles zu beschließen**, sondern einen repräsentativen Test zu kaufen. Manchmal ist die Datenbeschaffung teurer als der potenzielle Entscheidungsfehler: dann mit klar begrenztem Einsatz handeln.

## 10.2 Assumption Register

| ID | Annahme | Typ | Status | Wenn falsch, passiert … | Validierung | Deadline | Owner |
|---|---|---|---|---|---|---|---|
| A01 | Käufer akzeptieren Preis X | Nachfrage | HYP | CM/Win Rate sinkt | echte Angebote | | |
| A02 | Delivery dauert ≤ H | Kosten | EST | Marge bricht | Zeiterfassung in Pilot | | |
| A03 | Churn ≤ C | Retention | UNK | CAC nicht gedeckt | Kohortenbeobachtung | | |
| A04 | Kapitalbedarf ≤ K | Cash | EST | Liquiditätskrise | 13-Wochen-Modell | | |

Sortiere nach `Impact if wrong × Uncertainty × irreversibility`. Die Multiplikation ist eine **qualitative Denkstütze**, keine statistische Wahrscheinlichkeit.

## 10.3 Break-even-Threshold statt blindem Prognosewert

Wenn `Option A` und `B` von einer unbekannten Größe `x` abhängen, löse zuerst:

`Value_A(x*) = Value_B(x*)`.

Dann entscheide: Ist das Erreichen von `x*` plausibel, und wie lässt es sich testen?

**Beispiel [S]:** Zusätzlicher Mitarbeiter kostet 5.000 € / Monat vollständig belastet, zusätzliche angenommene Aufträge haben 400 € CM1. Er muss mindestens `5.000/400 = 12,5` → **13 zusätzliche akzeptierte Aufträge** ermöglichen, bevor andere Nachteile (Ramp-up, Fehler, Kapitalkosten) berücksichtigt sind. Statt „Stellen wir jemanden ein?“ wird die Frage: „Können wir mindestens 13 zusätzliche akzeptierte Aufträge realisieren und behalten wir das SLA?“

## 10.4 Expected Value of Information (EVI) ohne Fake-Probabilities

Ein Experiment lohnt sich, wenn seine Kosten und Verzögerungen geringer sind als der *plausibel vermeidbare* Schaden einer schlechten Entscheidung. Exakte EVI-Berechnung benötigt glaubwürdige Vorwahrscheinlichkeiten und Verlust-/Gewinnverteilungen. Ohne diese:
- Downside bei falschem Commit schätzen als Range;
- maximal akzeptable Testkosten festlegen;
- Test auf eine **entscheidungsändernde** Beobachtung begrenzen;
- kein Experiment starten, dessen Ergebnis ohnehin ignoriert würde.

**Information ist nur wertvoll, wenn sie zu einer anderen Entscheidung führen kann.**

## 10.5 Validierungs-Hierarchie

1. reale Zahlung und wiederholter Nutzen;
2. bezahlter Pilot mit definierter Abnahme;
3. nachweislich budgetiertes Kaufprojekt mit bindendem Entscheidungsschritt;
4. glaubwürdige historische Kundenhandlung;
5. konkrete qualitative Problem-/Win-Loss-Interviews;
6. unverbindliche Interessensbekundung;
7. reine Selbstbeschreibung oder hypothetischer Fragebogen.

Hierarchie kontextabhängig: Für ein komplexes B2B-Produkt kann eine bezahlte technische Machbarkeitsphase aussagekräftiger sein als eine winzige Consumer-Transaktion.

## 10.6 Experimentbrief

```yaml
decision: "Soll das Kernpaket 2.600 € statt 2.000 € kosten?"
baseline:
  window: "letzte 90 Tage"
  qualified_offers: 80
  wins: 24
  avg_net_price: 2000
  variable_cost_per_win: 700
hypotheses:
  H0: "Mehrpreis reduziert Netto-Deckungsbeitrag pro qualifiziertem Angebot"
  H1: "Mehrpreis erhöht Netto-Deckungsbeitrag pro qualifiziertem Angebot"
primary_metric: "CM1 pro qualifiziertem Angebot"
guardrails:
  - "kein irreführendes Versprechen"
  - "Sales Cycle und Refunds dokumentieren"
  - "keine unkontrollierte Preisgabe an Bestandskunden"
critical_ambiguity: "Verändert der höhere Preis Käufermix oder Lieferkosten?"
test:
  population: "vergleichbare neue qualifizierte Opportunities"
  assignment: "nach fairer, dokumentierter Geschäftsregel"
  collection: "Preis, Outcome, Gründe, Delivery Cost"
stop_rule: "sofort stoppen bei negativer Qualitäts-/Compliance-Veränderung"
decision_rule: "Preis nur ausweiten, wenn realisierte CM pro vergleichbarem qualifiziertem Angebot plausibel höher ist"
```

Diese Zahlen sind synthetisch; kein Signifikanzversprechen bei kleinen Samples.

## 10.7 Prognose-Regeln für den KI-Agenten

- **Forecast vs. Ziel**: Ziel ist kein erwartetes Ergebnis.
- **Kontingente Umsatzereignisse** nicht als unterschriebene Aufträge zählen.
- **Range statt Punkt** bei unsicherem CAC, Churn, Sales-Zyklus, Implementierungsdauer.
- **Zeitlich korrekt** modellieren: Sales heute, Lieferung später, Zahlung noch später.
- **Basisrate** nur verwenden, wenn Datenbasis relevant und vergleichbar.
- **Keine Scheinkausalität** aus einer einzelnen Vorher-Nachher-Änderung.
- **Confidence label**: `hoch` nur bei wiederholter, direkter Evidenz; `mittel` bei plausibel triangulierter Evidenz; `niedrig` bei Hypothesen.

---

# 11. Denkfehler und Standard-KI-Ratschläge, die systematisch zu vermeiden sind [G/F/O]

| Anti-Pattern | Warum strategisch schlecht | Bessere Reaktion |
|---|---|---|
| „Mehr posten, mehr Ads“ | ignoriert Engpass, Cash und Delivery | Marginal-CM und Kapazität je Kanal rechnen |
| „Du brauchst ein SaaS“ | hohe Build-/Product-Risiken ignoriert | manueller Service-Pilot, Produktfit testen |
| „Immer Premium verkaufen“ | kann Volumen, CAC und Retention verschlechtern | Preis/Mengen/CM-Schwelle und Buyer Fit |
| „Alle Zielgruppen bedienen“ | schwache Differenzierung, Prozesskomplexität | ICP nach Trigger, WTP und Delivery-Fit |
| „Jede Idee diversifizieren“ | Aufmerksamkeits-/Lerneffekte zerstört | Gewinner vertiefen, nur begründete neue Wetten |
| „Umsatz ist Erfolg“ | DB, Cash und Verpflichtungen fehlen | CM, Cash Trough und Qualität getrennt führen |
| „LTV/CAC ist 3, also gesund“ | Payback, Kohorte, Cost Basis und Liquidität ignoriert | Brutto-Kohorten, Net Contribution, Zeitpunkt |
| „Systeme statt Menschen“ ohne Talentmodell | SOP erzeugt keine Kompetenz | Recruiting, Ausbildung, QA, Verantwortung |
| „Automatisierung spart 80 % Kosten“ | frei gewordene Zeit ist kein echter Cashflow | realisierte Kostensenkung/zusätzlicher Output |
| „Nur weiter durchhalten“ | kann fehlendes PMF kaschieren | Fokus plus objektive Abbruchkriterien |
| „Sofort pivotieren“ | unterbricht Lernkurve zu früh | Diagnose, Rate der Wiederholungen, Evidence Gates |
| „Das Problem ist Marketing“ | Produktversprechen oder Lieferung kann Kernproblem sein | End-to-End-Vertrag und Churn |
| „Benchmark X gilt für alle“ | nicht vergleichbare Modelle/Kohorten | interne Unit Economics und sensible Ranges |
| „Niedrigste Kosten gewinnen“ | Qualität/Risiko/Vertrauen unterschlagen | Value Capture und Quality-adjusted CM |
| „Wir können 100 % automatisieren“ | Ausnahmen, Sicherheit und Haftung | Human-in-the-loop und Rollback |
| „Maximale Kapazitätsauslastung“ | Queueing, Verspätung, Fehler und Fluktuation | Puffer und Service-Level mitmessen |
| „Strategie als Liste von 20 Initiativen“ | keine Entscheidung und kein Owner | ein Constraint, ein Test, ein Prioritätsplan |
| „Kausale Wahrheit aus 3 Interviews“ | Sampling-/Bestätigungsfehler | Evidenzgrad markieren und Pilot fordern |

### 11.1 Bias-Korrekturfragen

- **Confirmation Bias:** Welche zwei Beobachtungen widersprechen unserer präferierten These?
- **Survivorship Bias:** Welche gescheiterten Firmen mit derselben Taktik sehen wir nicht?
- **Sunk Cost:** Würden wir mit heutiger Information erneut investieren?
- **Planning Fallacy:** Welche Schritte brauchen bei normalen Störungen länger?
- **Authority Bias:** Wer war in *diesem* Markt, mit *dieser* Unit Economics, wiederholt erfolgreich?
- **Goodhart:** Wenn Mitarbeiter die KPI maximieren, was könnte schlechter werden?
- **Base-Rate Neglect:** Welche wirklich vergleichbaren Kohorten haben wir?
- **Novelty Bias [G]:** Haben wir die vorhandene funktionierende Maschine genügend verbessert, bevor wir ein neues Modell beginnen?

### 11.2 Antwortqualität nach drei Stufen

**Schwach:** „Optimiert eure Zielgruppe, erhöht die Preise und nutzt Automatisierung.“

**Professionell:** „Segmentiert bestehende Kunden nach DB und Churn; testet eine 20-%-Preiserhöhung in einem Segment, während ihr Scope und Abschlüsse dokumentiert.“

**Entscheidungsreif:** „Im 90-Tage-Baseline-Zeitraum trägt Segment A 71 % des Deckungsbeitrags bei 38 % der Delivery-Stunden. Der Kapazitätsengpass liegt in der individuellen Implementierung; zusätzlicher Paid Traffic hätte derzeit negatives Upside, weil die Wartezeit ab Woche 3 steigt. Vorläufige Entscheidung: keine Budgeterhöhung. Testet 15 standardisierte Implementierungen; Stop bei QA-Fail > vereinbarter Schwelle. Falls CM pro Implementierungsstunde und On-time-Rate steigen, erweitert nur Segment A. Rechnung, Datenquelle und Annahmen im Annex.“ **Die Prozentangaben sind hier synthetisch**, das Entscheidungsverhalten ist wiederverwendbar.

# 12. Entscheidungsszenarien — Kalibrierungsfälle [S]

**Leseregel:** Alle Fälle sind **synthetische Rechenbeispiele**. Empfehlungen gelten **nur unter den angegebenen Annahmen** und zeigen die Struktur einer Entscheidung, nicht empirische Erfolgswahrscheinlichkeiten. Die Fallstruktur ist immer `Problem → Diagnose/Analyse → Optionen und Trade-offs → Entscheidung → Umsetzung → Gate/Konterindikation`.

## Fall 01 — Agentur: Mehr Neukunden oder Scope/Preis reparieren?

**Problem.** Eine Agentur mit 12 Retainer-Kunden à 2.000 € netto monatlich möchte von 24.000 € auf 40.000 € Umsatz skalieren. Das Team arbeitet unter Zeitdruck, der Gründer prüft alle Ergebnisse.

**Fakten und Analyse.** Synthetischer Baseline-Monat:
- Umsatz: `12 × 2.000 = 24.000 €`.
- Variable Delivery-Kosten je Kunde: 900 €.
- `CM1 = 12 × (2.000−900) = 13.200 €`, bevor allgemeine Fixkosten berücksichtigt sind.
- 30 % der Gründerzeit entfällt auf Ausnahmen/Nacharbeit; hoher Anteil unklarer Kundenwünsche.
- Angebotsversprechen: „alles für Wachstum“. Ausgelieferter Scope variiert stark.

**Ursachenhypothese:** Nicht primär fehlende Leads, sondern fehlende Standardisierung und unbepreiste Ausnahmen. Gegenhypothese: Das Team ist trotz sauberem Scope falsch besetzt. Erforderliche Evidenz: Zeit- und Nacharbeitslogs pro Kunde.

**Optionen/Trade-offs.**
- A — Paid Acquisition: erhöht Umsatz schneller, vergrößert aber ungeklärte Delivery-Last; Risiko schlechter Retention.
- B — Junior einstellen: Kapazität, aber Fixkosten/Ramp-up und weiterhin unklare Auftragsdefinition.
- C — einheitliches Kernpaket, Change Requests, Preiserhöhung zunächst für Neukunden: kurzfristig mögliche Conversion-Verluste, langfristig kontrollierbarer CM.
- D — nicht skalieren, Premium-Boutique bleiben: sinnvoll, falls Founder bewusst Craft wählt und Nachfrage begrenzt werden kann.

**Vergleichsrechnung:** Nach Pilot soll ein standardisiertes Angebot 2.600 € kosten, bei 1.000 € direkten Kosten. Schon **10** solche Kunden erzeugten `10 × 1.600 = 16.000 €` CM1, also 2.800 € mehr als heute — **vor** Übergangskosten, Abwanderung und neuen Fixkosten. Das ist eine Sensitivität, kein Preisakzeptanzbeweis.

**Empfehlung.** **C vor A/B**, solange Scope Creep und QA die Engpässe sind. Nicht das Umsatzziel zum Vorwand nehmen, ein ineffizientes System zu beschleunigen.

**Umsetzung.**
- Tag 1–3: zehn Delivery-Fälle auditieren: zugesagt, geliefert, Stunden, QA, Sonderwünsche.
- Tag 4–7: ein Kernpaket mit drei klaren Grenzen und Change-Request-Preis; Delivery-Checklist.
- Woche 2–4: fünf echte neue Angebote, Preis/Einwand/Abschluss/realen Aufwand tracken.
- Tag 30: Standardfall-Frequenz und CM pro Delivery-Stunde prüfen.
- Tag 60: QA an einen Team-Owner delegieren; Gründer nur Eskalationen.
- Tag 90: erst bei stabiler Lieferqualität zusätzliche Akquise.

**Gate.** Fortsetzen, wenn `CM/Delivery-Stunde` steigt und die fristgerecht akzeptierte Delivery nicht sinkt. **Revidieren**, wenn Preisvertrauen stark bricht oder die teurere Leistung tatsächlich mehr als kalkulierte 1.000 € kostet.

## Fall 02 — Lokaler Reinigungsservice: Marketing ist nicht das Engpassgeschäft

**Problem.** Ein Reinigungsbetrieb hat viele Anfragen, kann aber Termine nicht besetzen. Geschäftsführung fordert neue Anzeigen.

**Fakten und Analyse.**
- 240 qualifizierte Aufträge pro Monat werden nachgefragt; nur 180 verlässlich ausführbar.
- Netto-Preis 180 €/Auftrag, variable Leistungskosten 100 € → `CM1 = 80 €`.
- Maximal möglicher Zusatz-CM bei Behebung der Kapazitätslücke: `60 × 80 = 4.800 €/Monat`, vor Recruiting- und QA-Zusatzkosten.
- No-Shows von Mitarbeitenden und Nacharbeit steigen.

**Hypothese [G]:** Recruiting, Schulung und Einsatzzuverlässigkeit limitieren Durchsatz — nicht Kundengewinnung. Prüfen: Sind die 60 nicht ausgeführten Aufträge wirklich kaufbereit? Wenn es nur unverbindliche Anfragen sind, ist die Berechnung ein Oberlimit.

**Optionen/Trade-offs.**
- A — Ads erhöhen: nur sinnvoll, falls Nachfrage *und* Kapazität fehlen.
- B — Preise anheben: Nachfrage steuern, kurzfristig höhere CM; kann Kundenverluste erzeugen.
- C — Hiring-Funnel, Arbeitsprobe, Onboarding und Zuverlässigkeitsbonus: baut echten Durchsatz auf, braucht Recruitingkosten und Führung.
- D — ausgewählte Teilaufträge subcontracten: schneller, aber weniger Marge und Qualitätskontrolle.

**Empfehlung.** Zuerst C, eventuell kurzfristig B/D zur Auslastungssteuerung. A zurückstellen.

**Umsetzung.**
- Woche 1: Auftragsabsagegründe codieren, Schichtlücken und Standorte kartieren.
- Woche 2: Bewerberpipeline mit konkreten Tätigkeitsproben und Referenzcheck; keine diskriminierenden Auswahlkriterien.
- Woche 3–4: bezahltes Training, Checklisten, QA-Sampling, Eskalationsplan.
- Tage 30–60: zwei Kohorten vergleichen: No-Show, erste erfolgreiche Schicht, akzeptierte Aufträge je Mitarbeiter.
- Tage 61–90: nur profitable Schichten öffnen, Recruiting-Kanal mit bester *qualitätsbereinigter* Produktivität wiederholen.

**Gate.** Neue Kapazität muss nach Einarbeitung ausreichend `CM1` erzeugen, um Recruiting und wiederkehrende Zusatzkosten zu decken. Eine offene Stelle allein ist kein Erfolg. **Umkehren**, wenn Nachfrage weder buchbar noch preislich belastbar ist.

## Fall 03 — B2B SaaS: Neuakquise kaschiert einen Retention-Defekt

**Problem.** SaaS meldet „11.000 € neues MRR pro Monat“, wächst aber schwächer als erwartet.

**Fakten und Analyse.** Zu Beginn des Monats: 100.000 € MRR; Gross Revenue Churn 7 % = 7.000 € verlorenes MRR, neue Kunden +11.000 €, Expansion +2.000 €. Vereinfachter Monatsendstand:
`100.000 − 7.000 + 11.000 + 2.000 = 106.000 € MRR` → Nettozuwachs 6.000 €.

Wichtig: Hier ist die 7-%-Rate **für die gegebene Monatseröffnungskohorte**, ohne implizite jährliche Hochrechnung.

**Hypothesen.** (1) Aktivierung dauert zu lange; (2) neue Akquise zieht schlecht passende Kunden; (3) Produktversprechen stimmt nicht; (4) Preis ist falsch. Vorläufige Evidenz: Kündiger nutzen zentrale Funktion vor Kündigung kaum. Das stützt Aktivierung, beweist sie aber nicht.

**Optionen/Trade-offs.**
- A — Mehr Paid Acquisition: schneller neues MRR, mehr Budget und wahrscheinlich mehr Churn.
- B — Onboarding/Time-to-Value verbessern: Wirkung verzögert, möglicherweise nachhaltig.
- C — Preis erhöhen: kurzfristiger ARPA-Hebel, kann negative Churn verstärken.
- D — Segmentmix ändern: geringere Leadmenge, vielleicht höhere Retention.

**Ökonomische Schwelle:** Würde der Gross Revenue Churn der aktuellen 100.000-€-Startkohorte in einem vergleichbaren Monat von 7 auf 5 % fallen, entspräche das **2.000 € weniger verlorenem MRR in diesem Monat**. Die längerfristige Wirkung hängt von Folge-Churn, Expansion, Kosten und Zufall ab; nicht einfach „2.000 × 12“ als sicheren Gewinn buchen.

**Empfehlung.** Aktive Churn-Ursache klären und einen begrenzten Onboarding-Test vor aggressivem Akquise-Scale durchführen; zusätzliche Leads nur in Kohorten mit bewiesener Aktivierung ausbauen.

**Umsetzung.**
- Tag 1–7: Aktivierungsdefinition und Event-Funnel einheitlich; kündigende Kohorten nach Kanal und Segment.
- Tag 8–30: zwei Onboarding-Wege testen; `Time-to-First-Value` und `activated by day 14` messen.
- Tag 31–60: Kohorten mit tatsächlichem Nutzungsverhalten nachziehen.
- Tag 61–90: Frühindikatoren und Kündigungen gemeinsam interpretieren; erst dann Budget umschichten.

**Gate.** Gewonnene Aktivierung ohne Verbesserung von Retention/Produktnutzen ist noch kein Erfolg. **Umkehren**, wenn Kündigungen vor allem von produktunabhängigen Preis-/Beschaffungsereignissen ausgehen.

## Fall 04 — E-Commerce: Großes Sales-Volumen, schwache Kundenökonomie

**Problem.** Ein Onlineshop möchte sein Werbebudget verdoppeln, weil „Umsatz skaliert“.

**Fakten und Analyse.** Pro Neukunden-Erstbestellung:
- AOV netto: 55 €.
- Ware: 27 €, Versand/Handling: 6 €, erwartete Retouren-/Refundkosten: 4 €, Payment: 2 €.
- `CM1 = 55−27−6−4−2 = 16 €`.
- Inkrementeller Erstkunden-CAC: 19 €.
- `CM2_new = −3 €` vor allgemeinen Fixkosten.

Für **nur** ein demonstratives Szenario: 25 % der Kohorte kauft innerhalb 90 Tagen **genau einmal** erneut mit gleichen 16 € CM1 und ohne weitere Akquisitionskosten. Dann erwarteter zusätzlicher CM = `0,25 × 16 = 4 €` und bisher `CM_life_net ≈ 1 €` (90-Tage-Fenster, undiskontiert, vor Overhead). Die Realität kann abweichen; Retouren/zweite Kaufanreize müssen korrekt eingerechnet sein.

**Optionen/Trade-offs.**
- A — Budget verdoppeln: Wachstum nur sinnvoll, wenn *marginaler* CAC, Käuferqualität und Cash tragbar sind.
- B — Erstbestellungsangebot/Warenkorb verbessern: AOV, Bundle, Logistik, Risiko höherer Retouren.
- C — Repeat-Mechanik aufbauen: Segmentierte Replenishment-Erinnerungen, Kundennutzen, rechtmäßige Kommunikation; Wirkung über Zeit.
- D — Kosten/Beschaffung optimieren: Risiko auf Produktqualität.

**Empfehlung.** **Kein pauschales Budget-Doubling**; zuerst die Kohortenökonomie und Grenz-CAC messen. Anschließend eine begrenzte Wiederkaufs-/Bundle-Hypothese testen.

**Umsetzung.**
- 7 Tage: saubere Kanal-/Kohortenrechnung mit tatsächlichen Refunds.
- 30 Tage: ein Bundle-Test und ein Reorder-Test; Opt-in und Kundennutzen beachten.
- 60 Tage: 30-/60-Tage-Repeat nach Kohorte; Retouren und Supportkosten nachziehen.
- 90 Tage: only increase spend when marginal `CM_life_net` im akzeptierten Messfenster positiv und Cash-Trough tragbar ist.

**Gate.** Neue Kohorten müssen nicht nur Umsatz bringen, sondern einen dokumentierten inkrementellen Zahlungsstrom. **Umkehren**, wenn Brand-/Distribution-Effekte die direkte Attribution unzuverlässig machen; dann zusätzliche inkrementelle Tests.

## Fall 05 — Höhere Preise: Wann rechtfertigt eine geringere Abschlussquote den Schritt?

**Problem.** Anbieter will eine Dienstleistung von 1.000 € auf 1.250 € erhöhen.

**Fakten und Analyse.** Alt: 60 Verkäufe/Monat, 400 € variable Kosten = `60 × 600 = 36.000 € CM1`. Neu: 450 € variable Kosten wegen zusätzlicher Leistung, `CM1_pro_sale = 800 €`.

**Gleichstand:** `36.000 / 800 = 45 Verkäufe`. Bei 44 Verkäufen wären es 35.200 € CM1 und somit **800 € weniger** als heute; bei 50 Verkäufen wären es 40.000 € und **4.000 € mehr**. Die höheren Preise allein beweisen keine Ergebnisverbesserung.

**Optionen/Trade-offs.**
- A — alle Verträge sofort repricen: hoher kurzfristiger Hebel, potenzieller Churn/Vertrauensverlust und Vertragsrisiko.
- B — zunächst nur Neukunden: saubereres Signal, langsamerer Gesamteffekt.
- C — gleicher Preis, Scope abgrenzen: verbessert CM ohne WTP-Schock.
- D — Premium-Paket neben Basis: segmentiert WTP, erhöht Komplexität.

**Empfehlung.** B oder D testen, je nach klar unterschiedlichen Jobs; C sofort nutzen, wenn Scope Creep dokumentiert ist. Bestehende Verträge und berechtigte Erwartungen respektieren.

**Umsetzung.**
- Vor Test: Neukunden-Angebotsvolumen, Win Rate, Sales-Zyklus, Segment/Leadmix.
- 30 Tage: vergleichbaren qualifizierten Interessenten neue Preislogik anbieten; echte Verluste nach Grund klassifizieren.
- 60 Tage: tatsächliche Delivery-Kosten nachziehen.
- 90 Tage: Preisstrategie auf Basis `CM1 pro qualifizierter Opportunity` und Churn erweitern, nicht nur Quote.

**Gate.** Neue Preisvariante benötigt unter gleichen Fixkosten mindestens 45 vergleichbare Sales oder äquivalenten zusätzlichen Lifetime Contribution. **Umkehren**, wenn Käuferqualität, Sales-Zyklus und Refunds den Modellvorteil aufzehren.

## Fall 06 — Gewinn auf dem Papier, Liquiditätsloch in der Realität

**Problem.** Ein B2B-Projektgeschäft ist deckungsbeitragsstark, kann aber neues Wachstum nicht vorfinanzieren.

**Fakten und Analyse.** Monatlich 20 neue Projekte:
- Vertragswert netto: je 10.000 € = 200.000 €.
- Direkte Auszahlungen fallen früh an: je 6.000 € = 120.000 € im jeweiligen Startmonat.
- Kunden zahlen vereinfacht 60 Tage nach Rechnungsstellung; kein voriger Receivables-Bestand.
- Im ersten und zweiten Monat fließen jeweils 120.000 € Kosten ab, aber noch kein Umsatz ein. **Cash-Trough vor erster Zahlung: −240.000 €**, exklusive Fixkosten und Steuern. Ab Monat 3 beginnt unter der vereinfachten Annahme der Geldeingang aus Monat 1.

`CM1 = 4.000 € je Projekt` und trotzdem existenzielle Vorfinanzierung. Das ist kein Widerspruch.

**Optionen/Trade-offs.**
- A — mehr Aufträge gewinnen: erhöht zunächst die Vorfinanzierungslücke.
- B — 40 % Anzahlung bei Start: bei 20 Projekten 80.000 € Einzahlungen im Startmonat; verbleibender zeitversetzter Cash-Bedarf wird unter sonst gleichen Bedingungen geringer.
- C — Lieferanten-/Gehaltszeitpunkte verschieben: Beziehungs- und Compliance-Risiko; keine unzulässige Verschleppung.
- D — Kreditlinie/Factoring: Liquidität gegen Finanzierungskosten und Vertragsbedingungen.
- E — Wachstum deckeln: schützt Cash, verzögert Ergebnis.

**Empfehlung.** Erst B/E prüfen, ergänzend eine rechtlich und ökonomisch tragbare Finanzierung; A nur innerhalb Cash-Guardrail.

**Umsetzung.**
- Woche 1: 13-Wochen-Cash nach Wochen, offene Rechnungen, konkrete Payables, Forderungsausfälle, Steuern.
- Woche 2: Anzahlungs-/Meilensteinmodell vertraglich entwickeln und an reale Kunden verkaufen.
- Tage 30–60: Cash Trough mit tatsächlichen Eingängen und Forderungsalter vergleichen.
- Tag 90: neue Kapazität nur freigeben, wenn konservative 13-Wochen-Tiefstliquidität über vereinbartem Puffer liegt.

**Gate.** Zahlungsfähigkeit hat Vorrang vor positiven GuV-Modellen. **Umkehren**, falls Kundensegment Anzahlungen grundsätzlich ablehnt und alternatives Kapital günstiger/gesichert ist.

## Fall 07 — Kanalbudget: Das beste Durchschnitts-CAC ist nicht der beste nächste Euro

**Problem.** B2B-Anbieter muss zwischen Paid Inbound und Empfehlungen verteilen.

**Fakten und Analyse pro Quartal.**
- Paid: 1.000 Leads, 5 % qualifiziert (=50), 20 % Win (=10 Kunden). Vollständig zugerechnete inkrementelle Spend-/Sales-Kosten = 20.000 € → `CAC_paid = 2.000 €`.
- Referrals: 100 Leads, 60 % qualifiziert (=60), 30 % Win (=18 Kunden). Incentives und Sales-Zeit = 18.000 € → `CAC_ref = 1.000 €`.
- Erwarteter vor-CAC-Kundenbeitrag im modellierten Lifecycle: 4.500 € (muss in realen Daten bewiesen sein).
- Für Referral entspräche das `4.500−1.000 = 3.500 €` nach CAC; Paid `4.500−2.000 = 2.500 €`.

**Aber:** Referrals sind möglicherweise auf 18 Kunden begrenzt. Selbst wenn ihr Durchschnitt attraktiver ist, lässt sich die nächste Menge nicht automatisch zum selben CAC gewinnen. Zudem kann nur Kapazität für 20 Onboardings vorhanden sein.

**Optionen/Trade-offs.**
- A — alles Referral: niedriger Durchschnitts-CAC, begrenzte Skalierbarkeit.
- B — alle Paid: höhere Reichweite, teurer und eventuell anderer ICP.
- C — Referral-Pipeline bis zur nachweisbaren Grenze ausschöpfen, verbleibende **marginale** Kapazität mit Paid füllen.
- D — indirekte Partnerkanäle aufbauen: Potenzial, lange Vorlaufzeit und Komplexität.

**Empfehlung.** C. Bei 20 verfügbaren Onboarding-Plätzen zunächst die **qualifizierten, tatsächlich inkrementellen** Referral-Wins prüfen und restliche Plätze aus dem Kanal mit positiver marginaler Ökonomie füllen. Kein Lead darf doppelt kanalisiert werden.

**Umsetzung.**
- 7 Tage: Quellen- und Attributionsdefinition auditieren.
- 30 Tage: Funnel pro Source, Vertriebseinsatz, Retention nach Kohorte tracken.
- 60 Tage: Pilot für zusätzliche Referral-Anreize und sinkende Grenzproduktivität prüfen.
- 90 Tage: Budget nach `CM pro begrenztem Onboarding-Slot` und marginalem CAC, nicht Kanal-Prestige.

**Gate.** Kanalverlagerung nur bei hinreichender Retention und frei werdender/gesicherter Delivery-Kapazität. **Umkehren**, falls vermeintliche Referrals ohnehin eingehende Kunden sind und der Kanal nur kreditierte Verkäufe umetikettiert.

## Fall 08 — Drei Geschäftsmodelle für dieselbe KI-Geschäftsidee

**Problem.** Ein technisch versierter Gründer will Abläufe bei mittelständischen Dienstleistern automatisieren, weiß aber nicht, ob er Beratung, standardisierte Implementierung oder SaaS verkaufen soll.

**Fakten und Analyse.** Nur illustratives Entscheidungsmodell:
- **A Individuelle Projekte:** Preis 4.000 €, variable Delivery 1.500 €, vier bezahlte Projekte könnten `4 × 2.500 = 10.000 € CM1` erzeugen; Founder-Stunden und Akquise noch nicht bewertet.
- **B Produktisierte Installation:** Preis 500 €, variable Kosten 250 €, 15 Installationen könnten `15 × 250 = 3.750 € CM1` erzeugen; höherer Durchsatz erforderlich.
- **C SaaS:** geplante Entwicklung 60.000 €, vier Monate bis Mindestfunktion, noch keine Zahlungs-/Nutzungsbelege. Keine seriöse Renditeprognose möglich.

**Kritische Frage:** Welches Problem ist zugleich akkut, wiederkehrend, kaufbar und nachweislich automatisierbar? Die drei Angebotsformen adressieren ggf. unterschiedliche Kunden; Umsatz- und Kapazitätsannahmen sind **nicht** validiert.

**Optionen/Trade-offs.**
- A — schneller Customer Discovery und Cash, geringe Wiederholbarkeit.
- B — bessere Standardisierung, aber nur bei homogenen Integrationen.
- C — potenziell niedrige Grenzkosten, aber hohe Produkt-, Kapital- und Adoption-Risiken.
- D — „concierge“-/manueller Service mit Software-Assistenz, später Produkt ableiten.

**Empfehlung.** Mit **A oder D als eng fokussiertem bezahltem Pilot** starten und aus wiederkehrenden Implementierungsmustern B testen; C nur bei nachgewiesener Nachfrage- und Wiederholungsstruktur mit vertretbarer Finanzierung.

**Umsetzung.**
- 0–7 Tage: drei Jobs, je fünf mögliche Käufer, Problemfall und heutige Prozesskosten.
- 8–30 Tage: echte Angebote und bis zu drei bezahlte Piloten im **gleichen** Job.
- 31–60 Tage: alle Integrationstypen, Fehlerklassen, Arbeitsstunden und Wiederholungsschritte codieren.
- 61–90 Tage: Entscheid zwischen Service-Skalierung, produktisiertem Service und engstem funktionsfähigen Softwaremodul.

**Gate.** Software nur bauen, wenn ein hinreichend homogener, regelmäßig wiederkehrender Job existiert, Kunden das Ergebnis nutzen, ein wirtschaftlicher Vertriebspfad erkennbar ist und ein verantwortlicher technischer Produkt-Owner vorhanden ist. **Umkehren**, falls ein API-/Datenzugriff dauerhaft unzuverlässig oder nicht zulässig ist.

## Fall 09 — Automation: Spart ein Bot tatsächlich Geld?

**Problem.** Ein Servicebetrieb möchte 800 monatliche Supporttickets automatisieren und erwartet „vierstellige Einsparungen“.

**Fakten und Analyse.**
- 800 Tickets × 8 Minuten = 6.400 Minuten = **106,7 Stunden** im Monat.
- Verrechneter Vollkostensatz: 30 €/Stunde; maximaler theoretischer Arbeitswert rund 3.200 €.
- Pilot zeigt: 45 % Tickets ohne menschliche Nacharbeit automatisierbar (=360 Tickets), damit **48 Stunden** potenzielle Zeitentlastung = 1.440 € Kapazitätswert.
- Betriebssystemkosten 300 €/Monat; QA 8 Stunden × 30 = 240 €/Monat; erwartete Fehlerkosten 200 €/Monat.
- Optimistischer Kapazitäts-Nettoeffekt: `1.440−300−240−200 = 700 €/Monat`, **nur wenn** die 48 Stunden in echte Einsparungen oder zurechenbare zusätzliche Aufträge umgewandelt werden.
- Projektaufwand 6.000 €; rein rechnerischer Payback `6.000/700 ≈ 8,6 Monate`, noch ohne Kapitalkosten und steigende Komplexität.

**Optionen/Trade-offs.**
- A — Vollautomation: kurze Bedienzeit, teure Fehlentscheidungen.
- B — nur Standardklassen automatisieren, eskalieren: geringere Abdeckung, höhere Kontrollierbarkeit.
- C — FAQ/Prozess korrigieren: kann Tickets ganz eliminieren, oft billiger als ein Bot.
- D — keine Automation, aber sauberes Routing: weniger Technikrisiko.

**Empfehlung.** Zuerst C prüfen, dann **B mit Human-in-the-loop**. Vollautomation ohne definierte Fehlerschranke ablehnen.

**Umsetzung.**
- Woche 1: Ticket-Taxonomie, Wiederholungsgründe, heikle Inhalte und Datenschutz.
- Woche 2: 100 historische Tickets kontrolliert gegen Akzeptanzkriterien testen.
- Woche 3–4: Piloteinsatz nur für niedrige Risikoklassen, Logging und Rollback.
- Tage 31–60: echte Nacharbeitszeit und Defect Cost messen.
- Tag 90: Cash-/CM-Wirkung separat vom Zeitwert ausweisen.

**Gate.** Nur fortführen, wenn akzeptierte Antworten, Kundenschutz, Kosten und reale Kapazitätsverwendung stimmen. **Umkehren**, wenn Fehler selten, aber sehr teuer oder sicherheitskritisch sind.

## Fall 10 — Geografische Expansion vs. denselben Standort vertiefen

**Problem.** Ein regionales Serviceunternehmen möchte eine zweite Stadt erschließen, weil das Geschäft in Stadt A „stabil“ wirkt.

**Fakten und Analyse.**
- Stadt A: 160.000 € Monatsumsatz netto, 30 % CM nach zurechenbaren variablen Kosten = 48.000 €.
- Dispatch-/Service-Auslastung: 92 %, einige Termine verspätet; Mitarbeitertraining noch Gründerabhängig.
- Stadt B: einmaliger Launch von geschätzten 90.000 €, sechs Monate geplante zusätzliche Fixkosten von 15.000 €/Monat = 90.000 €. **Mindestens 180.000 € Cashbedarf** vor möglichen lokalen variablen Verlusten/Receivables, wenn keine weiteren Einnahmen angenommen werden.
- Nachfrage, lokale Mitarbeiterverfügbarkeit und Beschaffungskosten in B unbekannt.

**Optionen/Trade-offs.**
- A — sofort expandieren: potenzielle Wachstumsoption, große irreversible Cash-Bindung.
- B — Stadt A operativ härten: höhere Servicequalität und eventuell mehr profitable Kapazität; langsamerer Markteintritt.
- C — Stadt B mit wenigen bezahlten Pilotaufträgen und Partnern testen: niedrigerer Startaufwand, begrenzte Repräsentativität.
- D — Franchise/Lizenz: geringerer Eigenkapitaleinsatz, Governance-/Markenrisiko.

**Empfehlung.** B + C statt A. Der fehlende Beweis betrifft nicht nur Nachfrage, sondern **lokales Talent- und Betriebssystem**.

**Umsetzung.**
- Tag 1–14: Kapazitätskurve Stadt A, Fehlerquote bei 80/90/95 % Auslastung, QA unabhängig vom Gründer.
- Tag 15–30: konkrete Stadt-B-Buyer und Mitarbeitenden-/Partnerinterviews; Zahlungsbelege.
- Tage 31–60: begrenzter Pilot ohne langfristige Fixkostenbindung.
- Tage 61–90: Modell der zweiten Stadt mit tatsächlich gemessenen Kosten, Sales-Zyklen und Cash.

**Gate.** Expansion nur, wenn Stadt A stabil replizierbar ist, Stadt B realen Kundenbeweis besitzt und Downside innerhalb Kapitalpuffer liegt. **Umkehren**, falls außergewöhnlich günstiger, zeitlich befristeter Zugang existiert und ein rechtlich/finanziell begrenzter Optionsvertrag möglich ist.

## Fall 11 — Marketplace: Transaktionsvolumen ist kein Netzwerkbeweis

**Problem.** Ein Gründer verbindet lokale Anbieter und Käufer auf einer Plattform, möchte breit werben und 50 neue Orte aufnehmen.

**Fakten und Analyse.**
- 500 erfolgreiche Buchungen/Monat.
- Durchschnittliches GMV 100 € pro Buchung → 50.000 € GMV.
- Take Rate 15 % → Plattform-Nettoerlös **7.500 €** (ohne weitere Steuereffekte).
- Variable Payment-/Support-/Fraud-Kosten 9 € pro Buchung → 4.500 €, `CM1 = 3.000 €`.
- Neukundenwerbung kostet in diesem Monat 3.600 €; `CM nach Akquise = −600 €` **vor Fixkosten**, wenn alle 3.600 € korrekt auf diese Periode/Neukunden verteilt werden.
- Quote erfüllter qualifizierter Buchungsanfragen nur 65 %. Möglicherweise gibt es zu wenig passende Anbieter zur richtigen Zeit.

**Optionen/Trade-offs.**
- A — mehr Nachfrageseite: steigert Frustration bei fehlender Supply.
- B — Anbieterzahl pauschal erhöhen: kann Liquidität in den falschen Zeitfenstern nicht lösen.
- C — einen Stadtteil und eine Kategorie mit hoher Transaktionsdichte optimieren.
- D — Managed Service mit manueller Disposition: mehr Aufwand, bessere Verlässlichkeit, Lernchance.

**Empfehlung.** C + D für einen engen Wedge. **Netzwerkeffekt ist eine zu prüfende Hypothese**: Verbessert zusätzliche Angebotsdichte die Treffer-/Wiederkaufrate und senkt sie die Kosten der nächsten Transaktion?

**Umsetzung.**
- Woche 1: Buchungskohorten, Absagegründe und geografisch-zeitliche Supply-Dichte.
- Woche 2–4: genau ein Gebiet; zuverlässige Anbieter onboarden, Service-Level dokumentieren.
- Tage 31–60: `qualified request → successful fulfillment` und CM nach Supportkosten messen.
- Tag 90: erst in Nachbargebiete expandieren, wenn Liquidität und Wiederholung im Kerngebiet entstehen.

**Gate.** Wachstum ist nicht freigegeben, solange die erfüllte Buchungsquote zu niedrig für tragfähigen Kundenwert und die Akquisitionsökonomie negativ ist. **Umkehren**, wenn niedrige Fill Rate klar durch temporäre Nachfrage-Spitzen statt strukturelle Supply-Defizite erklärt ist.

## Fall 12 — Kapitalallokation: Vier gute Ideen sind immer noch vier Kostenblöcke

**Problem.** Ein profitabler Operator erwägt gleichzeitig Produkt B, neue Region, Akquisition eines kleinen Wettbewerbers und Optimierung des Hauptgeschäfts.

**Fakten und Analyse.** Ein einziger Managing Director hat 20 verfügbare Entscheidungstage im Quartal; alle vier Initiativen wollen etwa 10 Tage. Die Ressource ist **Aufmerksamkeit**, nicht Kapital allein. Ohne eindeutige Verteilung ergibt die Liste 40 Tage Anspruch auf 20 Tage Kapazität.

**Optionen/Trade-offs.**
- A — alles parallel: vermeintliche Optionalität, wahrscheinlicher Fokusverlust und langsame Ausführung.
- B — bestehende Revenue Engine optimieren: höhere Evidenz und Wiederverwendung, aber weniger Neuheit.
- C — eine externe Wette als begrenzte Option: Lernwert ohne Vollcommitment.
- D — gleich alle drei Expansionen einstellen: kann realen Zeitdruck übersehen.

**Empfehlung [G/O].** B als Standard und maximal **eine** klar begrenzte Wette C. Sonst Opportunitätskosten dokumentieren. „Mehr Möglichkeiten“ ist kein Vorteil, wenn kritische Entscheidungen durch dieselbe Person blockiert werden.

**Umsetzung.**
- Tag 1–3: jede Initiative mit `CM-/Cash-Upside`, Worst-Case, Owner, Reversibilität, erforderlichen Founder-Tagen und Evidenz dokumentieren.
- Tag 4: Projekte mit regulatorischer/Cash-Gefahr aussortieren.
- Woche 2: nach marginaler Wirkung je Engpassstunde priorisieren.
- Tag 30: erste fokussierte Intervention messen.
- Tag 60: die Option außerhalb des Kerngeschäfts nur erweitern, wenn ein reales Signal erreicht ist.
- Tag 90: Kapital und Leitungskapazität erneut allokieren.

**Gate.** Keine neue Vollinitiative ohne unabhängigen Owner oder Wegfall einer anderen Verpflichtung. **Umkehren**, falls eine Option ein klar datiertes, einmaliges Marktfenster mit begrenztem downside und nachgewiesener Überrendite besitzt.

## Fall 13 — Ist das Unternehmen schon verkaufbar?

**Problem.** Der Eigentümer eines Expertenservices erwägt einen Verkauf und hält einen EBITDA-Multiple für ausreichend.

**Fakten und Analyse.**
- Jahresumsatz 1,2 Mio. €, als „adjusted EBITDA“ ausgewiesenes Ergebnis 240.000 €.
- Ein wesentlicher Kundenanteil hängt direkt vom Gründer ab.
- Die in `adjusted EBITDA` nicht enthaltene realistische Ersatzfunktion des Gründers würde ungefähr 140.000 € pro Jahr kosten (illustrative Schätzung).
- Ergebnis nach Einpreisung dieser Ersatzkosten wäre vor weiteren Kaufpreis-/Integrationsanpassungen `240.000−140.000 = 100.000 €`. Das ist **keine** normative EBITDA-Bereinigung, sondern eine Due-Diligence-Sensitivität; vertragliche, buchhalterische und steuerliche Behandlung separat prüfen.

**Optionen/Trade-offs.**
- A — sofort verkaufen: Liquidität, aber Kaufpreisrisiko/ Earn-out/Integrationsabhängigkeit.
- B — 12–24 Monate Founder-Dependence abbauen: höhere operative Stabilität, Zeit- und Ausführungsrisiko.
- C — Minderheitsbeteiligung/Management-Buyout: Teil-Liquidität und fortgesetztes Risiko.
- D — weiter halten als Cashflow-Business: Return ohne Exit, aber Konzentration im Unternehmervermögen.

**Empfehlung.** Keine Bewertung aus einem frei gewählten Multiplikator ableiten. Zuerst Eigentümerrolle, Kundenkonzentration, EBITDA-Qualität, Cash Conversion, Verträge und Käuferanforderungen prüfen. Bei hoher Founder-Abhängigkeit eher B als direkte Vorbereitung, **außer** strategisches Timing oder persönliche Ziele sprechen anders.

**Umsetzung.**
- 0–30 Tage: Customer Concentration, Umsatzqualität, Owner-Tasks, bereinigte P&L, Forderungen, Verträge und Intellectual Property zusammentragen.
- 31–60 Tage: Sales/Delivery-Ownership übertragen, Referenzkunden ohne Founder testen.
- 61–90 Tage: Datenraum, dokumentierte SOPs, konkrete Käuferkriterien, indikatives Angebot mit professioneller rechtlicher/steuerlicher Begleitung.

**Gate.** Exit-Beschluss erst nach Vergleich des **risikoangepassten Nettoerlöses** mit realistischer Hold-/Build-Option und persönlichen Zielen. **Umkehren**, falls externes Angebot bereits einen ungewöhnlich attraktiven, verbindlich geprüften Preis bei begrenzten Verpflichtungen bietet.

## Fall 14 — Gründerrolle: Solo-Premium oder eine Organisation?

**Problem.** Ein hochqualifizierter Berater hat mehr Nachfrage als freie Zeit und glaubt, er müsse ein Team aus 10 Leuten aufbauen.

**Fakten und Analyse.**
- 25 Projekte pro Jahr zu 8.000 € netto; variable Kosten 3.000 € → `25 × 5.000 = 125.000 € CM1/Jahr`.
- Nachfrage würde theoretisch 35 Projekte ermöglichen, aber Gründer kann nur 25 zuverlässig selbst liefern.
- Preis-Alternative: 24 Projekte pro Jahr zu 10.000 €, variable Kosten 3.200 € → `24 × 6.800 = 163.200 € CM1/Jahr`.
- Diese Alternative wäre 38.200 € höher vor Fixkosten/Steuern und ohne Beweis, dass 24 Käufer 10.000 € akzeptieren.

**Optionen/Trade-offs.**
- A — Solo-Premium (Craft): hohe Autonomie, Volumen-/Personenrisiko.
- B — Hybrid: Fachkraft bleibt Lead Expert, Delivery-Operator und Junior-Team bauen Kapazität; Recruiting/QA-Komplexität.
- C — Operator: Gründer überführt eigene Leistung in Organisation, gibt Craft-Tätigkeit teilweise ab; höheres Führungsrisiko.
- D — kleiner standardisierter Gruppen-/Produktanteil: Entkopplung, aber unklare Nachfrage.

**Empfehlung [G/O].** Vor Recruiting bewusst entscheiden, ob das gewünschte Ziel *mehr Einkommen*, *mehr Eigentümerwert*, *mehr freie Zeit* oder *mehr persönliche Facharbeit* ist. Bei Wunsch nach Craft und hoher Nachfrage **zunächst Preis-/Scope-Test A**. Bei bewusstem Ziel einer skalierenden Firma B mit QA-fähigem Senior starten.

**Umsetzung.**
- Woche 1: 25 Projekte nach CM, tatsächlicher Gründerzeit, Kundennutzen, Referenzen segmentieren.
- Tage 8–30: klare Premium-Scope-Variante an neue vergleichbare Leads testen.
- Tage 31–60: optional eine delegierbare Subaufgabe mit Arbeitsprobe, SOP, QA ausführen.
- Tage 61–90: anhand der Nachfrage-, Qualitäts- und Founder-Stunden-Daten die Rolle wählen.

**Gate.** Die gewählte Variante muss die **gewünschte Lebens-/Eigentümerfunktion** verbessern, nicht nur Umsatz. **Umkehren**, wenn Premiumpreis keine reale Zahlungsbereitschaft findet oder individuelles Ausfallrisiko den Vorteil überwiegt.

## Fall 15 — Sales-Team verliert Deals: Wer hat tatsächlich ein Problem?

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
- A — neues Skript für Closing: geringer Aufwand, kann echte Kaufhürden nicht lösen.
- B — bessere Qualifizierung und Economic-Buyer-Map: weniger Opportunities, mehr relevante.
- C — fokussierter Proof-of-Value-/Implementation-Plan: liefert Sicherheit, kostet Presales.
- D — mehr Inbound: erhöht Volumen, behebt Verlustgründe nicht.

**Empfehlung.** **B + C** testen. „No Decision“ ist ein strategischer Wettbewerber: der aktuelle Arbeitsmodus des Kunden.

**Umsetzung.**
- Woche 1: zehn No-Decision-Fälle rückblickend prüfen, Originalnotizen statt nur CRM-Auswahlfeld.
- Woche 2: eine kaufmännische Business-Case-Vorlage mit realen Inputannahmen, Budgetowner und Pilot-Abnahme.
- Tage 30–60: zwei vergleichbare Opportunity-Kohorten gegen bisherige Baseline auswerten; keine Scheinkausalität behaupten.
- Tag 90: entsprechend Ergebnis Angebot, Vertrieb oder ICP korrigieren.

**Gate.** Steigt `CM pro qualifiziertem Angebot`, ohne Kundenscope oder spätere Reklamation zu verschlechtern? **Umkehren**, wenn die Lost-Deal-Analyse zeigt, dass der Segment-Trigger tatsächlich zu schwach ist.

## Fall 16 — Usage Pricing bei einem KI-Service: Wachstum kann die Marge auffressen

**Problem.** Ein Anbieter automatisiert Kundendokumente. Kunden wollen einen Pauschalpreis, die Verarbeitungskosten schwanken stark.

**Fakten und Analyse.** Zwei synthetische Nutzertypen:
- Typ L verarbeitet 100 Einheiten/Monat, direkte Kosten 0,20 €/Einheit = 20 €.
- Typ H verarbeitet 3.000 Einheiten/Monat, direkte Kosten = 600 €.
- Einheitlicher Preis 300 € pro Monat ergibt vor Support/Kundengewinnung bei L `CM1=280 €`, bei H `CM1=−300 €`.

**Optionen/Trade-offs.**
- A — reine Flatrate: einfach zu kaufen, Margenrisiko durch Power Users.
- B — reine Usage Fee: Kostennähe, unvorhersehbare Rechnung; kann Adoption bremsen.
- C — Grundpreis plus inkludiertes Kontingent plus fairen Mehrverbrauch: Kompromiss, Mess-/Kommunikationsaufwand.
- D — separate Enterprise-Verträge mit Mindestvolumen und Preisfloor: Vertriebskomplexität.

**Empfehlung.** C als Start-Hypothese, Preis-Caps und Transparenz; D für bekannte große Nutzungsprofile. Nicht vorschnell einen konkreten Tarif behaupten, solange Zahlungsbereitschaft und Lastverteilung unbekannt sind.

**Umsetzung.**
- Woche 1: Unit-Definition (z. B. verarbeitete erfolgreiche Dokumente) und tatsächliche Cost-to-Serve-Verteilung.
- Woche 2: Fair-Use-/Mehrverbrauchs-Entwurf; Kundeninterviews zu Vorhersagbarkeit und Budget.
- Tage 30–60: kleiner Pilot mit echten Nutzungsmengen, Rechnungssimulation vor Vertragsumstellung.
- Tage 61–90: Preis- und Produktguardrails nach `CM pro Account` und Nutzungsqualität stabilisieren.

**Gate.** Kein Paket, in dem ein leicht vorhersehbares Nutzungsprofil strukturell negativen direkten Beitrag erzeugt, ohne explizite strategische Finanzierung/Querfinanzierung. **Umkehren**, wenn zahlungsbereite Kunden Usage-Metrik nicht nachvollziehen oder sie Fehlanreize setzt.

---

# 13. Zusammenführung der Szenarien: Wiederholbare Strategiewahl

## 13.1 Wähle nach dem tatsächlichen Engpass

| Beobachteter Engpass | Nicht reflexartig tun | Meist bessere *erste* Untersuchung |
|---|---|---|
| Nachfrage nicht beweisbar | Vollprodukt bauen | problemorientierte Käufergespräche + bezahlter Pilot |
| Nachfrage da, Fulfillment begrenzt | mehr Ads | Qualität, Kapazität, Recruiting, Scope |
| Hohe Sales, hohe Kündigung | noch mehr Neukunden | Segmentkohorten, Aktivierung, Versprechen |
| Hohe Marge, negativer Cash | Sales pushen | Rechnungslauf, Zahlungsbedingungen, Working Capital |
| Gute Nachfrage, niedriger CM | Rabatte | Kosten-/Preis-/Scope-/Mix-Mechanik |
| Founder ist QA | mehr Juniors einstellen | Senior-Owner, SOP, Abnahmegrenzen |
| 5 Kanäle, keiner mit Proof | überall testen | einen Kanal bis zur Grenzökonomie verstehen |
| Wiederholter Job, harte Softwareabhängigkeit | technische Ownership ignorieren | Produkt-SLA, Architektur, internes QA |
| Mehr Ideen als Operator-Stunden | parallel ausführen | Opportunity Cost und klare Kill-Liste |
| Neue Stadt attraktiv, Kern instabil | sofort langfristig binden | replizierbare Operation + günstige Markteintrittsoption |

## 13.2 So liest Claude einen Fall

1. Die Fallzahlen **niemals** als Branchenbenchmark übertragen.
2. Die **entscheidende Kausalkette** extrahieren, nicht eine Empfehlung blind kopieren.
3. Variablen auf reale Nutzerzahlen umbenennen und Datenstatus setzen.
4. Den **Schwellenwert** neu berechnen, an dem die Empfehlung kippt.
5. Explizit notieren, welche fehlende Information das Ergebnis ändert.
6. Die gewählte Option am realen Zeit-, Cash-, Personal- und Vertragskontext prüfen.

# 14. Wiederverwendbare Business-Audit-Templates [O]

**Regel:** Templates sind keine Formulare, die ungeprüft vollständig an Gründer geschickt werden. Fülle nur, was die Entscheidung benötigt, und dokumentiere fehlende kritische Felder. Eine einmalige Voranalyse darf mit 5–10 zentralen Angaben beginnen. Die vollständigen Templates sind für Agentenarbeit an Dateien, CRM-Exports und Planungsartefakten gedacht.

## Template A — Executive Decision Brief (maximal zwei Seiten)

```markdown
# Entscheidung: <konkreter Beschluss>
Stichtag: YYYY-MM-DD | Zeitraum: <...> | Geschäft: <...>
Empfohlene Option: <...>
Gilt, solange: <Bedingungen>

## Business Outcome
- Welches Ziel? In welcher Einheit und Frist?
- Untergrenze für Cash, Qualität, Risiko?
- Welche Entscheidung ist bis wann nötig?

## Fakten, nach Datenstatus
| Fakt | Wert | Zeitraum | Status OBS/REC/REP/EST/HYP/UNK | Beleg |
|---|---:|---|---|---|

## Diagnose
- Hauptengpass:
- Alternativhypothesen:
- Gegenbeweise:
- Zuversicht (hoch/mittel/niedrig):

## Optionen
| Option | ΔCM | Cash-Trough | Engpassstunden | Risiken | Reversibilität |
|---|---:|---:|---:|---|---|

## Empfehlung und verworfene Optionen
- Warum diese Option?
- Welche wird ausdrücklich NICHT gewählt?
- Welche zusätzliche Information könnte die Entscheidung umkehren?

## 14-Tage-Test und 30/60/90
- Owner:
- Messmechanismus:
- Kosten-/Zeit-Cap:
- Stop-/Go-Regel:
- Review-Termin:
```

## Template B — Full Business Audit

```markdown
# Business Audit — <Firma / Stichtag>
## 1. Geschäftsmodell
- Zielkunde und zahlender Entscheider:
- Job, Kauftrigger, Alternative:
- Produkt/Service, Scope und Ausnahme:
- Preismetrik und Abrechnung:
- Einmalig / Wiederkehrend / Hybrid:
## 2. Markt/Positionierung
- Erreichbarer Markt, Methode:
- Konkurrenten und Inertia:
- Differenzierung und Nachweise:
- Kanalzugang und Abhängigkeiten:
## 3. Financial Spine
- Umsatz netto nach Monat/Kohorte/Angebot:
- CM1, CM2, vermeidbarer Overhead:
- tatsächliche Fixkosten und EBITDA:
- Cash_t, Forderungen, Zahlungsverpflichtungen:
- CAC / CAC Payback / LTV mit Cost Basis:
## 4. Funnel
- Leads -> Qualified -> Show -> Offers -> Wins:
- Source/Segment nach tatsächlicher Qualität:
- Sales-Zyklus, Refunds, Gründe für No Decision:
## 5. Lieferung / Retention
- Capacity nach knapper Rolle:
- On-time, First-pass QA, Cost-to-Serve:
- Activation, Churn, Renewal, Expansion:
## 6. Organisation
- Founder-Stunden nach Funktion:
- Single Points of Failure:
- Talent-Funnel / Training / SOP-Reife:
## 7. Risiken
- Liquiditätsminimum, Konzentration, Compliance:
- technische/operative Abhängigkeiten:
- irreversible Verpflichtungen:
## 8. Entscheidung
- #1 Engpass + Gegenhypothese:
- Top-3 Optionen mit marginaler Ökonomie:
- Eine gewählte Maßnahme und Kill-Kriterium:
- Nächste Messung, Owner und Datum:
```

**Audit-Standard:** Niemals „profitabel“ aus Revenue minus Ads schlussfolgern, wenn Delivery/Refund/Vertrieb und Overhead fehlen. Keine Profitabilität auf Kundenebene mit EBITDA verwechseln.

## Template C — Business Model Comparison Card

```markdown
| Feld | Modell A | Modell B | Modell C |
|---|---|---|---|
| Buyer/Trigger/Job | | | |
| Kauf- und Deliverybeweis | | | |
| Preis-/Erlöseinheit | | | |
| Zahlungszeitpunkt | | | |
| CM1/Unit | | | |
| Neu-CAC nach Cost Basis | | | |
| Wiederkauf / Lebensdauer | | | |
| Cash-Trough im Downside | | | |
| Knappe Kapazität | | | |
| Replikationsfähigkeit | | | |
| Differenzierung / Moat | | | |
| Regulierung/Verträge | | | |
| Gründerrollen-Fit | | | |
| Kritischste ungeprüfte Annahme | | | |
| Billigster Entscheidungsbeweis | | | |
| Entscheidung & Gate | | | |
```

## Template D — Segment/ICP Opportunity Matrix

```markdown
| ICP | Akuter Job | Budget-Buyer | Time-to-Buy | Cost of Inaction | Reachable Channel | WTP-Evidenz | Delivery Fit | Konkurrenz / Inertia | Entscheidung |
|---|---|---|---|---|---|---|---|---|---|
```

**Evaluationslogik:** Keine 100er-Score-Fantasie. Ein ICP ohne Käuferzugang oder zahlungsrelevanten Trigger wird **vor** dem Ranking ausgeschlossen. Bei ähnlichen Segmenten gewinnt das mit dem schnelleren echten Kaufbeweis und höherem *inkrementellen* CM bei tragbarem Risiko.

## Template E — Competitive Wedge / Moat Audit

```markdown
Wedge: <klar begrenzte Überlegenheit für einen Job>
1. Belegbar? Quelle/Case:
2. Wechselhürde des Kunden:
3. Kostenvorteil oder Outcome-Vorteil:
4. Wie viele Wettbewerber können es binnen 6–12 Monaten imitieren? [HYP]
5. Welcher Asset-Vorteil kumuliert pro neuer Transaktion?
6. Abhängigkeit von Personen/Kanal/Regulierung:
7. Abbruchsignal: <Beobachtung>
```

## Template F — Offer Architecture / Delivery Contract

```markdown
offer_id:
version:
ICP:
problem_trigger:
outcome_measured:
explicit_non_guarantees:
scope_included:
scope_excluded:
customer_inputs_required:
milestone_1:
milestone_2:
SLA:
proof:
net_price:
price_metric:
payment_schedule:
estimated_delivery_hours_by_role:
variable_cost_breakdown:
expected_CM1:
capacity_limit:
refund_or_change_request_rules:
escalation_owner:
quality_acceptance_criteria:
```

**Review:** Kann Marketing es korrekt darstellen, Sales es vertragskonform verkaufen, Operations es reproduzieren und Finance den CM kalkulieren? Falls nein, Offer noch nicht scale-ready.

## Template G — Pricing Decision Memo

```markdown
# Preisentscheidung
- Segment, Kaufjob und derzeitige Alternative:
- Bisher: P0, Q0, C0, CAC0, Churn0, Sales Cycle0
- Neu: P1, erwartetes Q1-Range, C1, CAC1, Churn1, Sales Cycle1
- Break-even-Q1: <Formel und Annahmen>
- Umsatz-/CM-/Cash-Effekt in Downside/Base/Upside:
- Betroffene Bestandsverträge und ethische Grenzen:
- Testpopulation und Fairness-/Vergleichbarkeitsprüfung:
- Primärmetrik: CM pro vergleichbarer qualifizierter Opportunity
- Guardrails: Refund, Churn, Sales Cycle, Quality
- Entscheidungsdatum und Umkehrbedingung:
```

## Template H — Channel Economics Audit

```markdown
| Kanal | Period | Qualified Leads | Wins | Variable Spend | Sales Labor | True CAC | Incremental CM per New Customer | Payback | Churn/Retention | Capacity Used |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---:|
```

**Achtung:** Attribution ≠ Inkrementalität. Organische oder „Referral“-Conversions können durch Paid beeinflusst sein. UTM-/CRM-Daten sind wichtig, aber kein automatischer Kausalbeweis.

## Template I — Bottleneck Root Cause Board

```markdown
Symptom (numerisch):
Wertstrom-Segment:
Baseline mit Zeitraum:
Limitierende Ressource:
Stau/Wait Time:
H1:
  mechanism:
  supporting_evidence:
  contradicting_evidence:
  decisive_test:
H2:
  ...
H3:
  ...
Marginal economics for each intervention:
Experiment owner:
Test cost:
Stop/Go:
Next bottleneck prediction:
```

## Template J — Talent/Capacity Audit

```markdown
| Rolle | FTE | produktive Std/Woche | Jobs/Std | First-pass-QA | Ramp-up | Single Point of Failure | Geplante Änderung |
|---|---:|---:|---:|---:|---|---|---|
```

Zusatztabelle: `Applicants → Screened → Work Sample Passed → Hired → Productive → Retained`. Nie nur „Anzahl Bewerbungen“ als Recruiting-Erfolg melden.

## Template K — Automation Opportunity and Safety Audit

```markdown
process_id:
current_manual_steps:
monthly_case_volume:
manual_minutes_per_case:
standard_cases_share:
exception_classes:
input_data_and_permissions:
decision_rights:
automation_coverage_proven:
error_probability_source:
error_cost_scenarios:
QA_hours_and_cost:
infrastructure_cost:
implementation_cost:
cash_savings_realized:
capacity_freed_not_cash:
payback_if_realized:
human_approval_trigger:
rollback:
audit_log:
privacy_compliance_review:
owner:
pilot_stop_rule:
```

## Template L — 13-Week Cash Control

```markdown
| Woche | Anfangs-Cash | sichere Eingänge | unsichere Eingänge (separat) | Löhne | Lieferanten | Steuern/Abgaben | Finanzierung | sonstige Abflüsse | End-Cash | Mindestpuffer verletzt? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
```

**Wichtig:** `Sichere Eingänge` und Szenario-Forderungen nicht doppelt zählen; geplante Kredite erst als gesichert klassifizieren, wenn verbindlich. Cash-Prognosen nicht als Steuer-/Rechtsrat ausgeben.

## Template M — 30/60/90 Execution Board

```markdown
# 90-Day Execution Decision Board
Entscheidung / Zielkorridor:
North-Star-Outcome (wirtschaftlich):
Primärer Engpass:
Aktuelle Baseline:
Nicht tun / Strategic No-List:
## Tage 1–30 — beweisen
- Hypothese:
- Test:
- Budget und Owner:
- Leading Metric:
- Economic / Cash Guardrail:
- Gate G30:
## Tage 31–60 — wiederholen
- Prozess/SOP:
- Proof of repeatability:
- QA:
- Gate G60:
## Tage 61–90 — begrenzt erweitern
- Skalierungsinkrement:
- Kapazitäts-/Cash-Limit:
- Gate G90:
## Entscheidung nach G90
Scale / Iterate / Pause / Pivot / Stop:
Nächste Engpasshypothese:
```

## Template N — Strategy Pre-mortem

```markdown
Entscheidung:
Angenommen, 180 Tage später ist sie gescheitert.
1. Fünf realistische Ursachen:
2. Frühindikator jeder Ursache:
3. Schadensbegrenzung:
4. Reversibles Zwischenstadium:
5. Maximal akzeptabler Verlust (Geld, Cash, Vertrauen, Zeit):
6. Wer hat das Recht, STOP zu sagen?
7. Welches unabhängige Gegenargument wurde geprüft?
```

## Template O — Decision Journal und Follow-up

```markdown
decision_id:
date:
owner:
decision:
evidence_snapshot:
alternatives_considered:
reason_selected:
critical_assumptions:
predicted_outcomes_as_ranges:
cash_or_loss_limit:
review_date:
actual_observation:
what_changed:
retain_reverse_or_iterate:
lessons_with_transferability_limit:
```

**Gute Entscheidung ≠ gutes Ergebnis einer einzelnen Ziehung.** Das Journal trennt Prozessqualität von Zufall und schützt gegen rückblickende Selbstrechtfertigung.

---

# 15. Pricing Frameworks als tatsächliche Entscheidungsbäume [F/G/O]

## 15.1 Pricing-Familienwahl

```text
Ist der Kundennutzen in einer stabilen, nachvollziehbaren Einheit messbar?
├─ Nein → definiertes Projekt-/Scope-Paket; Wertbeweis verbessern.
└─ Ja → Entsteht der Nutzen regelmäßig?
   ├─ Nein → Projekt-, Setup- oder Transaktionspreis prüfen.
   └─ Ja → Variieren die eigenen Grenzkosten stark mit Verbrauch?
      ├─ Nein → Subscription/Retainer/Seat, Adoption und Churn prüfen.
      └─ Ja → Usage-/Hybridpreis mit Mindestbetrag, Kontingent oder Caps prüfen.
Danach:
→ Erzeugt die Preis-Einheit eine Fehlsteuerung?
→ Sind Buyer/End-User und Budgetlogik kompatibel?
→ Sind CM und Cash in Downside tragbar?
→ Ist die Preisstruktur verständlich und vertraglich sauber?
```

## 15.2 Pricing über vier Untergrenzen

**Preis-Floor ist nicht eine einzige Zahl:**
1. `Transaction Floor`: Preis deckt direkt verursachte Kosten plus ggf. Akquise-Risiko.
2. `Capacity Floor`: Preis rechtfertigt knappe Ressource im Vergleich zur nächstbesten Verwendung.
3. `Business Floor`: erwartete Preismischung trägt zusätzlich notwendige Fixkosten und Kapitalbindung.
4. `Market/Trust Ceiling`: Kunden erkennen Preis als gerechtfertigt an; höhere Preise beschädigen nicht den gesamten Wertstrom.

Nicht pauschal `Kosten × 3` wählen. Kosten bestimmen Überlebensfähigkeit; Buyer Value und Alternativen bestimmen Capture-Potenzial; Wettbewerb und Vertrauensbelege begrenzen die realisierbare Zahlungsbereitschaft.

## 15.3 Paketwahl anhand der Nachfrageheterogenität

**Ein Kernpaket** wenn Jobs, Budgets und Lieferungen ähnlich.  
**Drei Pakete** wenn Wert-, Support- oder Implementierungstiefe sinnvoll getrennt.  
**Individuelles Enterprise-Angebot** wenn Anforderungen, Risiko und Integrationen stark variieren und Presales-Cost gerechtfertigt ist.  
**Usage Hybrid** wenn variable Kosten stark mit Nutzung korrelieren.

**Anti-Pattern:** drei fast identische Pakete nur für einen „Decoy“. Wenn Differenzierung künstlich ist, verschlechtert sie Kundentransparenz.

## 15.4 Preis-Sensitivitätsmatrix

| Preisoption | Sales-Zahl, die CM gleich hält | Reale Buyer-Evidenz | zusätzliche Kosten | Churn-/Refund-Risiko | Cash-Effekt | Status |
|---|---:|---|---:|---|---|---|
| P0 | Q0 | OBS | C0 | OBS/UNK | | |
| P1 | Formel | HYP/OBS | C1 | EST/UNK | | |
| P2 | Formel | HYP/OBS | C2 | EST/UNK | | |

**Break-even bei Preisnachlass:** Ist der neue Stück-CM kleiner, muss mehr Volumen entstehen. Prüfe, ob freie Kapazität und Nachfrage das tatsächlich tragen. **Breakeven im Umsatz** ist nicht das gleiche wie **Break-even in CM**.

## 15.5 Outcome-Pricing-Guardrail

Nur einsetzen, wenn folgende Fragen jeweils mit nachweisbarem „Ja“ beantwortbar:
- Können beide Parteien den Outcome objektiv und ohne Manipulation messen?
- Ist die kausale Zuordnung zur eigenen Intervention ausreichend klar?
- Sind Datenzugriff und Audit-Regelung zulässig?
- Kontrolliert der Lieferant ausreichend viele Erfolgsfaktoren?
- Trägt die Firma den Zahlungs-/Delay-/Dispute-Risk auch im Downside?
- Ist kein Anreiz geschaffen, kurzfristig nützliche, langfristig schädliche Ergebnisse zu optimieren?

Wenn `Nein`: fixe Fee + begrenzter Bonus für auditierbare Meilensteine statt reiner Erfolgsvergütung.

---

# 16. KPI-Modelle, Formelverträge und Kontrollschleifen [F/O]

## 16.1 KPI Design Contract

Jede KPI definiert explizit:

`name, business_question, numerator, denominator, unit, grain, window, inclusion_rules, exclusion_rules, cost_basis, source, freshness, owner, target_or_guardrail, leading_or_lagging, known_failure_mode`.

**Beispiel:** `Lead-to-Customer` ohne Definition von Lead, Kundenzahl, Kohortenzeitfenster und Zählung von Reaktivierungen ist nur eine scheinpräzise Kennzahl.

## 16.2 KPI Dictionary — Akquise und Sales

| KPI | Berechnung | Interpretationshinweis |
|---|---|---|
| Qualified Rate | qualifizierte Leads / alle validen Leads | Definition nicht opportunistisch ändern |
| Contact Rate | erreichte relevante Leads / kontaktiere valide Leads | Zeitfenster fixieren |
| Show Rate | erschienene qualifizierte Termine / gebuchte qualifizierte Termine | Verschiebungen und No-Shows unterscheiden |
| Win Rate | gewonnene Deals / entschiedene relevante Deals | No-Decision gesondert; Kohorten beachten |
| Lead-to-Customer | neue gewonnene Kunden / passende Leadkohorte | Sales-Zyklus und Zeitversatz |
| AOV | Nettoerlös der Aufträge / Anzahl Aufträge | Rabatt/Steuer-/Refundbasis |
| Revenue/Qualified Offer | Erlös aus vergleichbaren Angeboten / qualifizierte Angebote | Preis- und Conversion-Hebel gemeinsam |
| CM/Qualified Offer | realisierte CM1 der gewonnenen Deals / vergleichbare qualifizierte Angebote | bessere Hauptmetrik für Preistests |
| CAC | inkrementeller, vollständig definierter Akquiseaufwand / neue Kunden | Cost Basis/Attribution dokumentieren |
| Marginal CAC | zusätzliche Akquisitionskosten / zusätzliche *inkrementelle* Kunden | bei Skalierung wichtiger als Durchschnitts-CAC |
| Sales Cycle | Win-Datum − akzeptierter Startdatum des Opportunities | Median und Verteilung, nicht nur Mittel |
| Pipeline Coverage | qualifizierter Pipelinewert / zu deckendes Ziel | Stage- und Timing-Qualität entscheidend |

## 16.3 KPI Dictionary — Delivery, Produkt und Retention

| KPI | Berechnung | Warnung |
|---|---|---|
| Time-to-First-Value | Zeit bis definierter erster Nutzennachweis | Definition dem Kundenjob anpassen |
| Activation Rate | aktivierte Nutzer/Kunden / geeignete neue Nutzer/Kunden | nicht nur Login messen |
| On-Time Delivery | pünktlich abgenommene Aufträge / fällige Aufträge | Backlog nicht verstecken |
| First-Pass QA | ohne Nacharbeit akzeptierte Jobs / geprüfte Jobs | Stichprobenregel dokumentieren |
| Accepted Throughput | akzeptierte Leistungen pro Zeitraum | WIP/Qualität daneben anzeigen |
| Capacity Utilization | produktive Engpassstunden / verfügbare Engpassstunden | 100 % kann Queueing schädigen |
| Gross Revenue Churn | verlorenes MRR aus Startkohorte / Start-MRR | Expansion exkludieren |
| Net Revenue Retention | (Start-MRR − Downsell − Churn + Expansion aus Startkohorte) / Start-MRR | Neugeschäft ausschließen |
| Customer Retention | verbleibende Kunden aus Startkohorte / Startkunden | Logos ≠ Umsatz |
| Refund Rate | zurückgezahlte Nettoerlöse / passende realisierte Erlöse | Zeit- und Kohortenmatch |
| Contribution / Bottleneck Hour | inkrementeller CM / Engpassstunden | nur vergleichbare Qualität |
| Repeat Rate | Kunden mit zweitem Kauf / passende Startkohorte | ausreichend Beobachtungszeit |

## 16.4 KPI Dictionary — Finance und Steuerung

| KPI | Berechnung | Warnung |
|---|---|---|
| Gross Margin | (Nettoerlös−COGS) / Nettoerlös | Definition von COGS stabil |
| CM1 Margin | CM1 / Nettoerlös | direkte Kosten umfassend definieren |
| CM2 | CM1 − zurechenbare Akquisitions-/variablen Vertriebskosten | CAC nicht doppelt abziehen |
| EBITDA | operatives Ergebnis vor Zins, Steuern, Abschreibungen | Cash ≠ EBITDA |
| Operating Cashflow | operative Einzahlungen − operative Auszahlungen (definierte Cashflow-Rechnung) | Timing beachten |
| CAC Payback | CAC / periodischer CM pro gewonnenem aktiven Kunden | Renewal/Churn und Ramp-up prüfen |
| CM-LTV | Kohortenbasierter erwarteter CM1 vor CAC über festen Horizont | keine Fantasie-Retention |
| LTV:CAC | CM-basierter LTV / akquisitionsbezogener CAC | Wertebasis und Kohorten vereinheitlichen |
| Cash Conversion Cycle | DIO + DSO − DPO | für Service ohne Lager ggf. DIO=0; Definition anpassen |
| Burn Multiple | Net Burn / Net New ARR (kontextabhängig) | nur bei konsistentem, sinnvollem Negativ-Cash-Modell |
| Runway | verfügbare liquide Mittel / nachhaltiger Netto-Cashburn | für schwankenden Burn Cash-Szenario statt Quotient |
| Cash Trough | niedrigster prognostizierter Cash-Bestand | Downside und Fälligkeiten |

## 16.5 KPI-Cascade: Welche Metriken gehören zusammen?

**Neugeschäft mit Sales Funnel:** `Qualified Leads → Qualified Conversations → Wins → New CM → CAC Payback`, dazu `Refund/Quality`, `Cash Trough`.

**Subscription:** `Activated cohorts → Recurring Use → GRR/NRR → CM-LTV → Net New MRR`, dazu Incident/Support-Cost.

**Expertenservice:** `Qualified demand → productive expert capacity → accepted throughput → CM per expert hour → retention`, dazu `Founder dependency`.

**E-Commerce:** `incremental orders → net AOV → order CM1 → cohort repeat → acquisition payback`, dazu inventory cash und returns.

**Marketplace:** `qualified request → matched supply → fulfilled transaction → repeat → CM per transaction`, dazu supply reliability und concentration.

**Nie isolieren:** Ein Team darf nicht nur nach der KPI bezahlt oder bewertet werden, die es selbst unmittelbar beeinflusst, wenn dadurch der Rest des Wertstroms beschädigt wird.

## 16.6 Forecast Integrity Checks

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

## 16.7 KPI-Zielwerte

Der Agent darf keine universellen Branchenwerte als Soll erfinden. Ein gutes Ziel ergibt sich aus:
- aktueller firmenspezifischer Baseline;
- realen Qualitäts-, Cash- und Vertragsgrenzen;
- plausiblen Prozessfähigkeiten;
- definiertem Lernhorizont;
- gegebenenfalls *extern verifizierten, wirklich vergleichbaren* Benchmarks.

**Beispiel [S]:** Ein nicht validierter „80-%-Activation-Benchmark“ ist weniger nützlich als ein sauberer Test, der eine vorab definierte eigene Baseline von 42 % auf 55 % hebt und anschließend tatsächliche Retention prüft.

# 17. Entscheidungsbäume und Priorisierungsregeln für autonome Agenten [G/F/O]

Diese Bäume sind **diagnostische Defaults**. Bei widersprechenden realen Daten, Compliance oder spezifischem Kundenmandat hat die konkrete Situation Vorrang.

## Tree A — Neue Geschäftsidee

```text
Ist der Buyer/Job mit einem vergangenen konkreten Vorfall benennbar?
├─ Nein → Problem-Interviews; NICHT Produkt, Marke oder komplexen Funnel bauen.
└─ Ja → Wurde für eine vergleichbare Lösung real bezahlt oder Budget zugesagt?
   ├─ Nein → kleines echtes Verkaufsangebot/Pilot, Zahlungsbeweis.
   └─ Ja → Kann das Ergebnis mit verfügbarer Fähigkeit geliefert werden?
      ├─ Nein → Lösungs-/Partner-/Recht-/Technikrisiko testen.
      └─ Ja → Bleibt nach direkten Kosten plausibel CM1?
         ├─ Nein → Preis, Scope, Produktivität, Segment ändern.
         └─ Ja → Ist wiederholbare, zugängliche Nachfrage erkennbar?
            ├─ Nein → einen akquisitionsfähigen Wedge beweisen.
            └─ Ja → Zeit/Kapazität/Cash über 90 Tage modellieren;
                    Pilot → SOP → inkrementelle Expansion.
```

## Tree B — Bestandsunternehmen wächst nicht

```text
Aktueller Cash-/Compliance-Notfall?
├─ Ja → schützen, Verantwortliche einschalten, sofort fällige Risiken priorisieren.
└─ Nein → Ist Nachfrage/Kundenanzahl rückläufig?
   ├─ Ja → Segmentieren: Leads? Win? Retention? AOV?
   │   ├─ Leads schlechter → Channel/Positionierung/ICP
   │   ├─ Win schlechter → Qualifizierung/Sales/Offer/Preis
   │   └─ Retention schlechter → Produkt/Delivery/Versprechen
   └─ Nein → Steigt Output, aber nicht Ergebnis?
      ├─ Ja → Preis/Mix/COGS/Delivery/CAC/Fixkosten/Cash
      └─ Nein → Besteht qualitätsfähige Kapazitätsgrenze?
         ├─ Ja → Talent/QA/SOP/Produktkapazität
         └─ Nein → nächste marginal profitabel gewinnbare Nachfrage
```

## Tree C — Preis oder Menge?

```text
Ist aktueller CM1/Unit positiv?
├─ Nein → erst Preis-/Kosten-/Scope-Problem lösen.
└─ Ja → Ist knappe Kapazität ausgelastet und Nachfrage verfügbar?
   ├─ Ja → Preis, Segmentmix oder produktivere Delivery prüfen.
   └─ Nein → Zusätzliche Käufer zu positivem marginalem CM erreichbar?
      ├─ Ja → Akquise kontrolliert erweitern, Payback/Cash beachten.
      └─ Nein → Offer, Positioning, Vertrieb und Buyer-Trigger untersuchen.
Für JEDE Preisänderung:
→ Break-even-Q berechnen
→ Cash/Churn/Leadmix prüfen
→ echte Angebotsdaten sammeln
```

## Tree D — Person, SOP oder Automation?

```text
Gibt es einen wiederkehrenden, klar abgrenzbaren Prozess?
├─ Nein → zuerst Fälle klassifizieren und Scope stabilisieren.
└─ Ja → Ist die menschliche Standardausführung zuverlässig?
   ├─ Nein → SOP, Training, QA und Entscheidungen definieren.
   └─ Ja → Ist der Schritt wertschaffend/nötig?
      ├─ Nein → eliminieren.
      └─ Ja → Können Input/Output und Ausnahmen regelbasiert geprüft werden?
         ├─ Nein → kompetenten Menschen mit Entscheidungsrechten einsetzen.
         └─ Ja → Fehlerkosten und echte Nettoeinsparung tragbar?
            ├─ Nein → Assistenz, nicht Vollautomation.
            └─ Ja → Piloten mit Logging, Review, Rollback;
                    danach ökonomisch messen.
```

## Tree E — Weiter optimieren, pivotieren oder stoppen?

```text
Ist das Problem für Käufer real, dringlich und zahlungsfähig?
├─ Nein / nach ausreichenden Tests wiederholt verneint
│  → ICP/Job neu definieren oder Idee stoppen.
└─ Ja → Kann Leistung zuverlässig mit tragbarer Ökonomie geliefert werden?
   ├─ Nein → Scope, Preis, Talente, Technik oder Operations ändern.
   └─ Ja → Besteht wiederholbarer Zugang zu Käufern?
      ├─ Nein → Distribution testen und Kaufbarrieren prüfen.
      └─ Ja → Gewinnen Wiederholungen an Wert?
         ├─ Ja → fokussiert ausbauen, solange Cash/Risiko tragbar.
         └─ Nein → Moat-/Prozess-/Retention-Design prüfen.
Bei wiederholt verfehlten vorab definierten Kill-Kriterien:
→ Fokus ist kein Argument, unbegrenzt Verluste zu finanzieren.
```

## Tree F — Inkrementelles Budget erhöhen?

```text
Baseline reproduzierbar? NEIN → Instrumentieren.
↓
Qualität/Cash rechtlich und operativ tragbar? NEIN → Stop.
↓
Marginaler Neukunde nach begründetem Horizont CM-positiv?
  NEIN → Economics/Targeting korrigieren.
↓
Ausreichend qualifizierte Delivery-Kapazität vorhanden?
  NEIN → Recruiting/Operations zuerst.
↓
Abnehmende Grenzproduktivität des Kanals gemessen?
  NEIN → kleine Budgetstufe mit Holdout/vergleichbarem Test.
↓
Marginaler Beitrag nach Risikopuffer weiterhin positiv?
  JA → nächste begrenzte Budgetstufe; NEIN → zurücksetzen.
```

## 17.1 Red-Flag-Eskalationsmatrix

| Sachverhalt | Strategische Handlung | Automationsgrenze |
|---|---|---|
| negative freie Liquidität vor gesicherten Eingängen | 13-Wochen-Cash, Zahlungsreihenfolge und professionelle Unterstützung | keine autonom ausgelösten riskanten Zahlungen/Verpflichtungen |
| schwer lieferbares Kundenversprechen | Angebot stoppen/eingrenzen, Vertrag/QA prüfen | keine neuen unprüfbaren Zusagen |
| Datenschutz-/Sicherheitsverletzung | Zugriffe begrenzen, Incident-Prozess | keine unautorisierten Datenexports |
| wiederholte Fehlentscheidungen mit hohem Schaden | menschliche Freigabe und Root-Cause | keine Silent-Auto-Resolution |
| Interessenkonflikt/fragliche Attribution | Ergebnis als unsicher markieren | keine Performance-Fee-Fantasie |
| nicht vergleichbare Kosten-/Periodenbasis | Rechnung blockieren bis Normalisierung | keine Score-Ausgabe als Fakt |

---

# 18. Vollständige 30/60/90-Synthese: Von „Ich will KI im Vertrieb einsetzen“ zu einer echten Geschäftsentscheidung [S/O]

**Dieses End-to-End-Beispiel dient der Reproduktion einer Methode.** Es enthält bewusst keine Behauptung über die tatsächliche Kaufbereitschaft realer Unternehmen.

## 18.1 Rohidee und Mindestfragen

Rohidee: „Ich will kleinen Firmen helfen, mit KI ihren Vertrieb zu automatisieren.“

Fehlende Informationen:
- Wer genau? Handwerker, B2B-Agenturen, Softwarefirmen?
- Welche beobachtbare Aufgabe? Meeting-Notizen, Angebotsentwurf, Routing, Follow-up?
- Wer darf und will zahlen?
- Welche Daten dürfen verarbeitet werden?
- Welche Fehlentscheidung hätte hohe Schadensfolgen?
- Welche Output-Einheit ist in 14 Tagen lieferbar?

**Arbeitsannahme H1:** B2B-Dienstleister mit 5–20 Sales-Mitarbeitenden verlieren Zeit durch nicht zeitnah erstellte, unvollständige CRM-Follow-ups. Diese Annahme ist **nicht bestätigt**.

## 18.2 Kleinster überprüfbarer Wedge

Kein „vollautomatisierter Vertrieb“. Pilot-Scope:

> Für ein klar definiertes Vertriebsteam werden aus bereits rechtmäßig freigegebenen Gesprächsnotizen strukturierte CRM-Entwürfe und Follow-up-Vorschläge erzeugt. Ein Mitarbeiter prüft jede ausgehende Nachricht. Der Test bewertet Erfassungszeit, Datenqualität, Fehlerrate und Akzeptanz durch Nutzer; kein ungarantierbares Revenue-Uplift-Versprechen.

Benötigte Inputs: vorhandene CRM-Prozesse, Einwilligungen/Rechtsgrundlagen und Sicherheitsanforderungen, 20–50 historische geeignete Fälle, definierter Owner, korrekte Zielsystemberechtigungen.

**Kritisches Risiko:** Falsche Kundeninformationen oder unerlaubte Datenverarbeitung. Deshalb zunächst Testdaten, menschliche Freigabe und nachvollziehbares Logging.

## 18.3 Beispielrechnung

Unter **fiktiven** Annahmen:
- 12 Sales-Mitarbeitende;
- 20 geeignete Fälle pro Person/Monat = 240 Fälle;
- heutiger manueller Aufwand 12 Minuten/Fall = 48 Stunden;
- nur 50 % des Aufwands durch Pilot nach QA sparbar = 24 Stunden Kapazität;
- Vollkostensatz 35 €/Stunde → 840 € **Kapazitätswert**, nicht automatisch Cash-Ersparnis;
- laufende Tool-/QA-Kosten 200 €/Monat;
- mögliches Netto-Kapazitätspotenzial 640 €/Monat.

**Konsequenz:** Ein Verkaufspreis von 2.000 €/Monat lässt sich durch reine Lohnkostenersparnis in diesem Beispiel **nicht** erklären. Ein solcher Preis würde zusätzlichen realen Nutzen brauchen (z. B. nachweislich höhere Abschlussqualität), den der Pilot bislang gerade **nicht** belegt. Besser ein engeres Segment mit größerem Problemwert, anderer Leistungsumfang oder andere Preisstrategie.

## 18.4 Ausführbarer Zeitplan mit Deliverables

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

## 18.5 Alternative Entscheidungspfade

- **Problem akut, aber kein Buyer bezahlt:** Value Proposition/Budget-Buyer korrigieren, nicht Features addieren.
- **Buyer bezahlt, KI-Ausgabe unzuverlässig:** assistierte Dienstleistung oder engere Task-Klasse; keine autonome Freigabe.
- **Leistung gut, Grenzkosten hoch:** Scope vereinfachen, Preis-/Kundenmix anpassen.
- **Preis gut, Integration sehr individuell:** produktisierten Service oder hochpreisige Implementierung statt Low-Touch-SaaS.
- **Wiederholbarkeit bewiesen, Nutzung wiederkehrend:** Softwareprodukt und lizenzierte Automatisierung als **neue bewusste Investitionsentscheidung** prüfen.

## 18.6 Vollständiges Decision Memo (Kurzfassung)

**Beschluss:** Kein SaaS-Build freigeben, bevor mindestens ein konkreter, wiederholter und zahlungsrelevanter Workflow mit kontrollierter QA und belastbarer Wirtschaftlichkeit nachgewiesen ist.

**Fakten:** Derzeit nur ein Konzept; keine reale Zahlungs-, Nutzungs- oder Kostenbasis.

**Hauptunsicherheit:** wirtschaftlicher Kundennutzen je Workflow unter sicheren Daten- und Kontrollbedingungen.

**Optionen:** (1) Vollprodukt bauen, (2) manueller Pilot, (3) Produktidee stoppen.  
**Wahl:** (2) mit geringem Commitment.  
**G30:** echter Kaufbeleg + sichere, ausreichend gute Ausführung.  
**G60:** wiederholbare Delivery/CM bei gleicher Kundengruppe.  
**G90:** begrenzte Akquise, falls marginale Ökonomie, Cash und Qualitätsgrenzen passen.  
**Umkehrbedingung:** Kauf- und Nutzensignal bleibt nach fairen, zielgerichteten Tests aus oder der technische/Datenschutzrisiko-Betrieb ist nicht vertretbar.

---

# 19. Claude-Code-Agentenprotokoll und technische Artefakte [O]

## 19.1 Rollenvertrag

Der Agent ist ein **entscheidungsfähiger Analyst und Business-Operator**, nicht ein Slogangenerator. Er soll:
- Datei-/Tabellendaten nur soweit verfügbar und für den Auftrag nötig lesen;
- Definitionen und Provenienz im Output erhalten;
- Fakten/Annahmen/Hypothesen trennen;
- Rechenwege ausführbar machen;
- mehrere Optionen und ein klares Gate liefern;
- keine Entscheidungen vortäuschen, für die ihm tatsächliche Autorisierung, Daten oder reale Ausführung fehlen.

## 19.2 Ablauf als deterministische Task-Pipeline

```text
TASK_INPUT
  → Intent Detection (strategy / pricing / growth / audit / operationalization)
  → Data Intake (sources + quality flags + units + time windows)
  → Constraint Registry (cash / law / delivery / people / product)
  → Value-Stream Map (buyer-to-repeat)
  → Bottleneck Hypotheses (at least 2)
  → Option Generator (status quo + 2 actionable alternatives)
  → Unit-Economic Normalizer (same horizon, same cost basis)
  → Scenario Stress Test (downside/base/upside)
  → Evidence and Reversibility Gate
  → Decision Memo (one recommendation + counter-condition)
  → 14d Execution Test + 30/60/90 Gates
  → Financial / Causal / Source QA
  → OUTPUT
```

**Wenn Material fehlt:** Der Agent soll eine *vorläufige* Entscheidung unter transparenten Annahmen liefern, soweit verantwortbar; nur wirklich entscheidende Datenlücken erfragen. Bei irreversibler oder existenzieller Entscheidung mit unzureichender Evidenz keine scheinbar definitive Go-Entscheidung.

## 19.3 Empfohlene Repository-Struktur

```text
project/
├── CLAUDE.md
├── knowledge/
│   ├── business-architect.md
│   └── business-architect-deep.md
├── input/
│   ├── commercial/
│   ├── financial/
│   └── operations/
├── analysis/
│   ├── assumptions.md
│   ├── definitions.md
│   ├── cohorts.csv
│   ├── funnel.csv
│   └── cash-13-week.csv
├── decisions/
│   ├── YYYY-MM-DD-decision-brief.md
│   └── journal.md
├── experiments/
│   ├── experiment-cards/
│   └── results/
└── quality/
    ├── model-checks.md
    └── signoff.md
```

**Datenschutz:** Nur autorisierte geschäftliche Unterlagen verwenden; personenbezogene Informationen minimieren; keine Secrets/Tokens in Text-Outputs speichern.

## 19.4 Schlankes `CLAUDE.md` zur Einbindung

```markdown
# Business Architecture Tasks

Fachbasis:
- `knowledge/business-architect.md` für allgemeine Business-Architektur.
- `knowledge/business-architect-deep.md` für echte Entscheidungen,
  Alternativenvergleiche, Wirtschaftlichkeitsrechnung, Tests und Gates.

Bei strategischen Aufgaben:
1. Relevante Dateien und Datenqualität lesen.
2. Ziel, Zeitraum, finanziellen Rahmen und Hauptrisiko definieren.
3. Value Stream und Engpass mit Gegenhypothese diagnostizieren.
4. Mindestens Status quo und zwei Handlungsoptionen vergleichen.
5. Marginale CM, Cash, Kapazität, Unsicherheit und Reversibilität prüfen.
6. Einen Beschlussvorschlag mit Umkehrbedingung und 14-Tage-Test liefern.
7. 30/60/90-Gates angeben, wenn Umsetzungsplan verlangt ist.
8. Finanzarithmetik, Nenner, Kohorten und Kosten-Doppelzählung prüfen.

Keine fiktiven Daten als Fakten verwenden.
Fehlende Daten als unbekannt kennzeichnen.
Keine Quellen-, Markt- oder Erfolgsgarantien erfinden.
Harte Cash-, Qualitäts-, Sicherheits- und Compliance-Gates respektieren.
```

## 19.5 Rechen- und Datentransparenz

Bei jeder Beispielrechnung idealerweise ein `model-inputs.json` und `model-results.md`:

```json
{
  "model_id": "pricing-break-even",
  "period": "month",
  "currency": "EUR",
  "basis": "net-of-VAT",
  "data_status": "SYNTHETIC_EXAMPLE",
  "price_old": 1000,
  "units_old": 60,
  "variable_cost_old": 400,
  "price_new": 1250,
  "variable_cost_new": 450,
  "incremental_fixed_cost_new": 0
}
```

Das Ergebnis `break_even_units_new = 45` muss reproduzierbar sein. Der Datenstatus ist Pflicht, weil identische JSON-Struktur sonst fälschlich wie Firmendaten wirken könnte.

## 19.6 Minimaler Qualitätsprüfer (optionaler Python-Test)

```python
from math import isfinite, ceil

def pricing_break_even(p0, c0, q0, p1, c1, delta_fixed=0):
    vals = (p0, c0, q0, p1, c1, delta_fixed)
    if any(not isfinite(v) for v in vals):
        raise ValueError("Non-finite input")
    if q0 < 0 or min(p0, c0, p1, c1) < 0:
        raise ValueError("Invalid quantity or cost")
    if p1 <= c1:
        raise ValueError("New unit contribution <= 0; no ordinary volume break-even")
    target = q0 * (p0 - c0) + delta_fixed
    if target <= 0:
        return 0
    return ceil(target / (p1 - c1))

assert pricing_break_even(1000, 400, 60, 1250, 450) == 45
assert pricing_break_even(2000, 700, 30, 2600, 800) == 22
```

Dieser Code illustriert nur die isolierte Preis-/Mengenrechnung. Er modelliert keine Änderung von CAC, Zahlungszeitpunkt, Kapazität, Mix oder Churn. Ein realer Forecast benötigt dafür zusätzliche Komponenten.

## 19.7 Strukturierter Entscheidungs-Output (YAML)

```yaml
decision:
  question: "string"
  recommendation: "string"
  evidence_confidence: "high|medium|low"
  valid_if: ["string"]
  overturn_if: ["string"]
facts:
  - field: "string"
    value: "numeric|string|null"
    unit: "string"
    period: "string"
    status: "OBS|REC|REP|EST|HYP|UNK"
    source: "string|null"
constraint:
  bottleneck: "string"
  hypothesis_alternatives: ["string"]
  cash_floor: "numeric|null"
  quality_guardrail: "string"
options:
  - id: "string"
    description: "string"
    expected_incremental_CM_range: ["numeric|null", "numeric|null"]
    forecast_window: "string"
    cash_trough: "numeric|null"
    capacity_requirement: "string"
    reversible: "true|false|partially"
    key_risks: ["string"]
execution:
  next_14_days: ["string"]
  gate_30: "string"
  gate_60: "string"
  gate_90: "string"
  owner: "string|unassigned"
open_questions: ["string"]
qa:
  units_consistent: "true|false|unknown"
  cost_double_count_checked: "true|false|unknown"
  cash_window_checked: "true|false|unknown"
  caveats: ["string"]
```

Das Schema ist bewusst **semantisch** formuliert. Für maschinenlesbare Validierung `null`, `boolean` und Zahlentypen im eigentlichen Parser strikt typisieren; das gezeigte YAML beschreibt die erwarteten Felder, nicht ein fertiges JSON Schema.

## 19.8 Entscheidungsrechte und menschliche Kontrolle

Ohne ausdrückliche Autorisierung:
- keine Preise in produktiven Systemen ändern;
- keine Kundenzusagen versenden;
- keine Mitarbeitenden entlassen oder einstellen;
- keine Geldtransfers, Vertragsabschlüsse oder Kreditentscheidungen auslösen;
- keine personenbezogenen Daten in unbekannte externe Systeme laden;
- keine fiktive Bestätigung über ausgeführte Maßnahmen abgeben.

Der Agent **empfiehlt und produziert überprüfbare Artefakte**; ein menschlicher Verantwortlicher bestätigt hochwirksame reale Geschäftsentscheidungen.

---

# 20. Fachliche Qualitätskalibrierung, Abnahme und Grenzen

## 20.1 Rubrik (100 Punkte) [O]

| Dimension | Punkte | Vollpunktkriterium |
|---|---:|---|
| Engpass- und Ursachenpräzision | 20 | wertstrombasiert, mindestens zwei konkurrierende Hypothesen, reale Evidenz |
| ökonomische Korrektheit | 20 | gleiche Einheit/Horizont, Grenzbeitrag, echte Kosten, Cash separat |
| Qualität des Optionenvergleichs | 15 | Status quo + Alternativen, Trade-offs, kein Schönrechnen |
| Risikound Unsicherheitssteuerung | 15 | Datenstatus, Downside, Reversibilität, Umkehrkriterium |
| operative Umsetzbarkeit | 15 | Owner, 14-Tage-Test, 30/60/90-Gates, Kapazität |
| funktionsübergreifende Integrität | 10 | Sales/Marketing/Produkt/Ops/Finance widerspruchsfrei |
| Klarheit und Reproduzierbarkeit | 5 | konkrete Empfehlung, Formeln, Quellen-/Annahmen-Trennung |

**Abnahme:** ≥85 Punkte **und** kein Hard Fail für eine unmittelbar umsetzungsreife Empfehlung. Bei 70–84 ist zusätzliche Evidenz oder Modellreparatur notwendig. Unter 70: Diagnose neu aufsetzen. Die Schwellenwerte sind **interne Arbeitskonventionen [O]**, keine wissenschaftlich validierten Qualitätsgrenzen.

## 20.2 Hard Fails — nicht durch Punktestand kompensierbar

- erfundene Firmendaten oder Quellen;
- falsch aggregierte Perioden (monatlich vs. jährlich), Umsatzsteuerbasis oder CAC-Doppelzählung;
- „profitabel“ ohne direkte Kosten oder Zahlungsfähigkeit zu prüfen;
- unwahres Ergebnisversprechen bzw. Missachtung von rechtlich/ethisch zwingenden Grenzen;
- Zustimmung zu existenziell riskanter Entscheidung bei fehlender Kernevidenz;
- mindestens eine klar bessere, unmittelbar erkennbare Alternative komplett ausgelassen;
- Plan ohne konkrete erste Handlung oder ohne verifizierbaren Stoppunkt.

## 20.3 Zweites Expertenreview: „Wie kann dieser Vorschlag scheitern?“

Vor finalem Export muss der Agent beantworten:
1. Wo ist die **fragilste Modellannahme**?
2. Welche plausible Änderung dieser Annahme kippt die Rangfolge?
3. Sind tatsächliche Zahlungen anders getimt als Buchumsätze?
4. Ist zusätzlicher Umsatz wirklich **inkrementell**, nicht verschoben?
5. Wer besitzt und kontrolliert die kapazitätskritische Tätigkeit?
6. Erzeugt die Metrik einen pervertierten Anreiz?
7. Warum nicht die zweitbeste Alternative?
8. Welche Beobachtung soll bis zum nächsten Review vorliegen?
9. Sind sensible Daten, Sicherheit und Kundenvertrauen geschützt?
10. Haben wir echte Verbesserungen und neue Ideen sauber voneinander getrennt?

## 20.4 Relevante Grenzen und offene Wissenslücken

**Nicht bekannt ohne zusätzliche Daten:**
- welches konkrete Kundensegment eines Nutzers tatsächlich kauft;
- aktueller Marktpreis und langfristige Marktgröße;
- realer CAC, effektiver Churn, tatsächlicher CM oder Cash-Bestand eines nicht analysierten Unternehmens;
- rechtlich zulässige Detailgestaltung von Verträgen, Steuern, Personal und Datenschutz in einer bestimmten Jurisdiktion;
- kausale Wirkung eines Preistests ohne geeignete Vergleichbarkeit;
- belastbarer Unternehmenswert ohne Due Diligence und Käuferfeedback;
- technische Eignung von Fremdsystemen ohne Protokoll-/Sicherheitsprüfung.

**Ableitbar [G]:** Fokus auf das wirklich limitierende Geschäftssystem; Wiederholungen des Bewährten; Phasenpassung; Talent und technische Ownership; Unternehmerrollenwahl; Ressourcen- und Kapitalallokation. Diese Muster sind **Perspektiven**, keine empirisch bewiesenen individuellen Fallwahrheiten.

**Allgemeines Fachwissen [F]:** finanzielle Rechnung, Segmentierung, Experimente, Kosten-/Liquiditätskontrolle, Strategieoptionen und Organisationsdesign.

**Neue Synthesen [O]:** die explizite `FACT → CAUSE → OPTIONS → ECONOMICS → RISK → GATE`-Kette, Risikogates, Option-Matrizen, 90-Tage-Entscheidungsartefakte und Agenten-Ausführungsprotokolle. Sie müssen im produktiven Einsatz nach Ergebnissen verbessert werden.

## 20.5 Kontinuierliche Verbesserung der Wissensbasis

Pro 90-Tage-Zyklus:
- Decision Journal retrospektiv auswerten;
- Vorschläge mit guter/schlechter Vorhersage trennen;
- Fälle mit falschem Engpass neu etikettieren;
- neue reale Tests als **anonymisierte, belegbare** Fallstudien aufnehmen;
- veraltete Benchmarks entfernen;
- Score-Schwellen nur auf Grundlage realer Kalibrierung anpassen;
- bei Modelländerungen Formeln und Beispieltests erneut ausführen.

**Wissenschaftliche Disziplin:** Interne Optimierungserfolge und Beobachtungen dürfen nicht ohne Kontext zu allgemeinen Branchenregeln hochgestuft werden.

---

# Anhang A — Formel- und Rechenreferenz

## A.1 Kerngleichungen

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

## A.2 Dimensionsaudit: häufige Fehler

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

## A.3 Rechenprüfungen für Cases

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

---

# Anhang B — Schnellreferenz: Strategische Entscheidung in sieben Sätzen

1. **Problem:** Definiere eine messbare Ergebnisabweichung.
2. **Ursache:** Isoliere den plausiblen aktuellen Engpass und die stärkste Gegenhypothese.
3. **Wahl:** Stelle Status quo und mindestens zwei echte Alternativen gegenüber.
4. **Ökonomie:** Berechne den inkrementellen CM **sowie** den Cash- und Kapazitätseffekt.
5. **Risiko:** Benenne Worst-plausible-case, Reversibilität und die kritischste offene Annahme.
6. **Entscheidung:** Wähle die robusteste Option unter harten Gates, nicht die aufregendste Idee.
7. **Ausführung:** Formuliere einen Test, einen Owner, eine Frist und eine Beobachtung, die deine Empfehlung umkehren würde.

**Endzustand:** Claude Code kann einen strategischen Business-Case analysieren, Optionen wirtschaftlich vergleichen und eine kontrollierte, messbare Entscheidungsvorlage erzeugen — **ohne** behauptete Branchengewissheit oder erfundene Geschäftsdaten.

**EXPORT_COMPLETE**

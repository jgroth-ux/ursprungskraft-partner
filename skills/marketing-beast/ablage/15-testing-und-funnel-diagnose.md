# Testing, Kennzahlen und Funnel-Diagnose

## Engpasstheorie des Funnels (normale Fassung, 4.6)

*Quelle: marketing-beast.md (normale Fassung)*

### 4.6 Engpasstheorie des Funnels [K/F]

Ein Funnel verhält sich wie eine Kette, deren schwächster Abschnitt das Gesamtergebnis begrenzt.

Illustrativ:

- 10.000 Impressionen
- 2 % Link-CTR = 200 Besuche
- 5 % Visit-to-Lead = 10 Leads
- 20 % Lead-to-Sale = 2 Sales

Wenn der Lead-to-Sale-Wert kollabiert, verdoppelt eine schönere Thumbnail-Farbe nicht automatisch die Profitabilität. Prüfe zuerst das größte *wirtschaftlich relevante* Leck, unter Berücksichtigung von Datenqualität und Reparaturaufwand.

## F10 Creative Testing und Learning System (normale Fassung)

*Quelle: marketing-beast.md (normale Fassung)*

### F10 – Creative Testing & Learning System [K/F/S]

**Zweck/Einsatz:** Effizient Erkenntnisse zu Hooks, Angles, Proof, CTA und Angebotsdarstellung gewinnen.

**Inputs:** Kontroll-Creative, verfügbare Reichweite/Budget, wichtigstes Event, Trackingqualität, Zielgruppendefinition, Wirtschaftlichkeitsgrenze.

**Prozess:**

1. Ein zu testendes **Entscheidungsproblem** notieren: „Was wissen wir noch nicht?“
2. Primärhypothese formulieren: „Bei problem-aware Nutzern erhöht ein Demonstrations-Hook gegenüber einem abstrakten Nutzen-Hook die qualifizierten Besuche, weil…“
3. Varianten so bauen, dass die **kausale Differenz interpretierbar** bleibt.
4. Primärmetrik und Guardrails festlegen, z. B. Kosten je qualifiziertem Lead plus Lead-to-Opportunity-Rate.
5. Vergleichbarkeit sicherstellen: zeitgleiche Ausspielung, ähnliche Zielgruppen, gleiche Conversion-Definition, stabile Angebotsbedingungen.
6. Auswertung inklusive Stichprobenunsicherheit, Mix-Effekten und Datenlücken; bei kleinen Samples keine Siegergewissheit.
7. Gewonnenes Prinzip in ein **Learning Log** überführen, nicht nur das einzelne Video archivieren.
8. Nächsten Test aus dem Ergebnis ableiten.

**Entscheidung:** Für die frühe kreative Exploration dürfen mehrere deutlich verschiedene Angles gegeneinander antreten (Screening). Für einen kausalen A/B-Test anschließend **eine** Haupteigenschaft isolieren. Bei häufigen Tests Fehler durch Multiple Comparisons beachten.

**Qualität:** Test hat Name, Hypothese, Varianten, Metrik, Stopp-/Review-Regel, Evidenzstatus und nächste Aktion.

**Praxisbeispiel (fiktive Zahlen):**

- Test A „Schmerz-Hook“: 10.000 Impressionen, 250 Klicks, 10 qualifizierte Leads.
- Test B „Demo-Hook“: 10.000 Impressionen, 180 Klicks, 18 qualifizierte Leads.
- Ergebnis: A CTR 2,5 %, qualifizierte Leads/Klick 4 %; B CTR 1,8 %, Leads/Klick 10 %. Bei gleichen Werbekosten könnte B wirtschaftlich besser sein.
- **Nicht behaupten:** „B ist statistisch sicher Gewinner“ ohne geeignete Unsicherheitsanalyse und valide Attribution.

**Anti-Pattern:** Fünf Variablen gleichzeitig ändern und CTR allein zum Sieger ernennen. **Verbesserung:** Downstream-Qualität messen und den nächsten Test präziser machen.

---

## F11 Funnel Diagnostics und Economic Triage (normale Fassung)

*Quelle: marketing-beast.md (normale Fassung)*

### F11 – Funnel Diagnostics & Economic Triage [K/F/S]

**Zweck/Einsatz:** Herausfinden, ob Aufmerksamkeit, Message Match, Offer, Landing Page, Sales oder Economics den Ertrag begrenzen.

**Inputs:** Impressionen, Ausgaben, Klicks, Sessions, Leads, qualifizierte Leads, Verkäufe, Umsatz, Bruttomarge/Deckungsbeitrag, Storno-/Retourenraten, Tracking-Definitionen, qualitative Einwände.

**Prozess:**

1. Messkette und Attribution plausibilisieren (Ad-Klick ≠ Analytics-Session).
2. Funnel-Kennzahlen und absolute Fallzahlen nebeneinander stellen.
3. Für jede Stufe eine diagnostische Hypothese und Alternativerklärungen formulieren.
4. **Wirtschaftlichen Hebel** priorisieren: Potenzial × Konfidenz × Umsetzbarkeit, gegen Aufwand und Risiko.
5. Nur die wahrscheinlich relevante Stufe modifizieren, dann erneut messen.

**Kennzahlen:**

- `CTR = Link-Klicks / Impressionen`
- `LP-CVR = Conversions auf LP / passende LP-Sessions`
- `Lead-to-Sale = Sales / Leads` (bei B2B besser auch qualifizierte Zwischenstufen)
- `CPL = Ad Spend / Leads`
- `CAC = relevante Akquisitionskosten / neue zahlende Kunden`
- `ROAS = attribuierter Umsatz / Ad Spend`
- `Deckungsbeitrag pro Bestellung = Nettoumsatz – variable Produkt-/Delivery-Kosten – weitere variable transaktionsbezogene Kosten`
- `Maximal tragbarer CAC = erwarteter zurechenbarer Deckungsbeitrag je Neukunde – erforderlicher Zielbeitrag/Reserve` (Zeithorizont explizit)

**Entscheidung:** Hoher CTR und niedrige LP-CVR → zunächst Message Match, Besucherqualität, Page-Friction prüfen. Niedriger CTR bei hoher Qualität nach Klick → Creative/Targeting verbessern. Gute Website-CVR, aber schlechter ROAS → CPC/CAC, Margen, Warenkorbwert oder Attribution prüfen.

**Qualität:** Jede Empfehlung verbindet Datenmuster, plausible Ursache, alternative Ursache, Test und betriebswirtschaftliche Konsequenz.

**Praxisbeispiel:** Ein Angebot erzielt 100 Verkäufe à 80 € Nettoumsatz (8.000 €), Ad Spend 4.000 €. ROAS = 2,0. Wenn variable Kosten pro Verkauf 45 € betragen, bleiben 3.500 € Beitrag vor Werbekosten; nach 4.000 € Spend liegt der betrachtete Beitrag bei –500 €, noch ohne Fixkosten. **Ein ROAS von 2,0 ist damit nicht automatisch profitabel.**

**Anti-Pattern:** „Mehr Budget, weil der CTR gut ist.“ **Verbesserung:** Zuerst Beitragsrechnung und Tracking-Lücken ausweisen.

---

## A/B-Testing, Datenpsychologie und Conversion-Diagnose (Deep-Fassung, Kap. 13)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

## 13. A/B-Testing, Datenpsychologie und Conversion-Diagnose [F/S]

### 13.1 Eine Hypothese muss falsifizierbar sein

**Muster:**
„Bei [Segment] führt [konkreter psychologischer Angle] gegenüber [Vergleich] zu einer besseren [primären Zielgröße], weil [Buyer Evidence]. Wir halten [Kontrollvariablen] konstant und prüfen [Guardrail].“

**Beispiel:**
„Bei warmen Demo-Besuchern erhöht eine CTA-Formulierung, die den genauen Ablauf nennt („Beispielprojekt ansehen“), die Rate qualifizierter Demo-Klicks gegenüber „Mehr erfahren“, weil sie Unsicherheit über den nächsten Schritt reduziert. Guardrail: nachgelagerte Anfragequalität.“

**Nicht:** „Wir testen drei Headlines, weil A/B-Tests gut sind.“

### 13.2 Testtypen und was isoliert wird

| Test | Manipulierte Variable | Erlaubte Interpretation |
|---|---|---|
| Hook-Test | nur Einstieg | relative Wirkung des Einstiegs in diesem Kontext |
| Angle-Test | unterschiedliche Kaufmotive, restliche Struktur vergleichbar | welches Framing geeignete Nutzer bewegt |
| Proof-Test | Art/Platzierung von Beleg | ob Vertrauen Engpass ist |
| CTA-Test | Handlungswortlaut / Reibungsinfo | Einfluss auf nächstes Event |
| Offer-Test | Scope, Preis, Probe, echte Konditionen | Produkt- bzw. Angebotsfit |
| Page-Architecture-Test | Reihenfolge / Informationsdichte | Entscheidungsunterstützung |

**Wenn mehrere Elemente gleichzeitig wechseln**, kann man nur das Gesamtpaket vergleichen, nicht isolierte Ursachen benennen.

### 13.3 Metrics Ladder

- **Attention:** 3-Sekunden-Views, Hook-Hold, Landingpage-Zugriffe; plattformabhängig.
- **Engagement / Relevance:** CTR, qualifizierte Klicks, Scrolltiefe, View-through; Vorsicht bei Messfehlern.
- **Conversion:** Leadform-Abschluss, Warenkorb-zu-Kauf, Demo-Buchung, Kauf.
- **Quality:** qualifizierte Leads, tatsächliche Nutzung, Stornos, Refunds, Abschlüsse.
- **Economics:** CAC/CPA, Deckungsbeitrag, LTV (mit Unsicherheit), inkrementeller Profit.

**Funnel-Berechnungen:**
- `CTR = Klicks / Impressions` (Definition des Klicktyps prüfen).
- `LP-CVR = Conversions / Landingpage-Besuche`.
- `CPL = Werbekosten / Leads`.
- `CAC = relevante Akquisekosten / gewonnene Kunden`.
- `ROAS = zugerechneter Umsatz / Werbeausgaben`; ROAS ist **nicht** Gewinn und Attribution keine Garantie für Inkrementalität.

### 13.4 Statistische Disziplin, ohne Scheingenauigkeit

1. Vor dem Test **Primärmetrik und Mindestlaufzeit/-stichprobe** festlegen, nicht nach dem ersten grünen Balken abbrechen.
2. Varianten **zeitgleich** und möglichst randomisiert ausspielen; Wochentags- und Saisonstörungen reduzieren.
3. Segmentierung, Budget, Platzierung und Auktionseinflüsse dokumentieren.
4. Kleine Stichproben und breite Konfidenzintervalle ausdrücklich als unsicher behandeln.
5. Mehrfachtests und viele parallele Metriken erhöhen Fehlalarmrisiko.
6. Für wirtschaftliche Entscheidungen Effekthöhe und Downstream-Qualität beachten, nicht nur „signifikant/nicht signifikant“.
7. Tests nicht als Belege verwenden, wenn Datenqualität, Tracking oder Zuordnung unsicher sind.

**Keine pauschalen Benchmarks** wie „CTR muss 2,4 %“ ohne Kanal, Markt, Ziel und Zeit. Schwellenwerte sind projektspezifisch.

### 13.5 Diagnosebaum für schwache Kampagnen

#### Fall 1: Niedrige Aufmerksamkeit / niedriger qualifizierter CTR
- Prüfen: Visual Hook, erste Wörter, Targeting, Awareness, Offer-Relevanz.
- Aktion: 3 Hooks mit verschiedenen Kaufmotiven **bei gleichem Body**.
- Nicht sofort: Preis ändern.

#### Fall 2: Gute CTR, schlechte LP-CVR
- Prüfen: Message Match, Ladezeit, Preis-/Angebotsklarheit, Proof, Formularfriktion, falsche Erwartungen.
- Aktion: Landeseiten-Hero + Offer-Transparenz + Besucherqualität getrennt untersuchen.
- Nicht: CTR als Sieg melden.

#### Fall 3: Hohe Leadzahl, schlechte Leadqualität
- Prüfen: zu breites Versprechen, „gratis“-Fokus, fehlende Qualifikation, unrealistischer Outcome.
- Aktion: Segment und Voraussetzungen in Copy schärfen; qualifizierte Events messen.
- Nicht: noch aggressiver Freebie bewerben.

#### Fall 4: Viele Warenkörbe, wenig Käufe
- Prüfen: Versandkosten, Lieferfristen, Zahlungsmethoden, Trust, Rückgabe, Checkout-Bugs.
- Aktion: Friktion zuerst; keine erfundene „nur heute“-Dringlichkeit.

#### Fall 5: Gute CVR, schlechte Profitabilität
- Prüfen: Marge, Stornos, Wiederkäufe, CAC, Rabattstruktur, Attribution.
- Aktion: Angebot/Ökonomie und Kundensegmente, nicht bloß die Headline.

#### Fall 6: Creative Fatigue
- Prüfen: Frequenz, Reichweitenüberschneidung, Trend über ausreichend lange Periode, Zielgruppen- und Saisoneffekt.
- Aktion: neue Szenen, neue Mechanism-Demo oder neuer Angle; Gewinner nicht blind durch kosmetische Farbwechsel ersetzen.

### 13.6 Priorisierung: Impact × Evidence × Ease × Risk

Für jede Testidee je 1–5:
- **Impact**: plausible Größe des Engpasses.
- **Evidence**: Belege für vermutete Ursache.
- **Ease**: Umsetzbarkeit.
- **Risk**: Markenschaden, technische Kosten, rechtliche Unsicherheit.

Eine mögliche **Arbeitsheuristik**: `(Impact × Evidence × Ease) / Risk`, bei Risk mindestens 1. Nicht als naturwissenschaftliche Kennzahl ausgeben.

**Testlog-Felder:**
`Test-ID | Datum | Segment | Hypothese | Variante/Kontrolle | Kosten | Laufzeit | Primärmetrik | Guardrail | Datenqualität | Entscheidung | Learning | Nächster Test`.

---

## Engpass-Priorisierung ICE mit Unsicherheit (normale Fassung, 6.5)

*Quelle: marketing-beast.md (normale Fassung)*

### 6.5 Engpass-Priorisierung: ICE mit Unsicherheit

Pro Maßnahme:

- **Impact** 1–5: möglicher wirtschaftlicher Beitrag.
- **Confidence** 1–5: Stärke der Evidenz.
- **Ease** 1–5: Ressourceneffizienz.
- **Risk Penalty** 0–5: Compliance-, Reputations- oder Messrisiko.

`Priorität = (Impact × Confidence × Ease) – (Risk Penalty × 5)`

Dies ist eine **konstruierte Priorisierungsheuristik**. Sie vermeidet, dass die lauteste Idee automatisch gewinnt. Hohe Risiken dürfen nicht durch Impact „weggepunktet“ werden: harte Verstöße bleiben Ausschlusskriterien.

**Leitfrage:** „Welche kleine Änderung könnte die nächste große Unsicherheit am schnellsten und sichersten reduzieren?“

---

## SOPs 09 und 10: Testplan und Creative Fatigue Audit (normale Fassung)

*Quelle: marketing-beast.md (normale Fassung)*

### SOP-09 – Kampagnen-Testplan

1. North-Star-KPI und Guardrails definieren.
2. Baseline und Datengüte prüfen.
3. 3–5 größere **Angle-Hypothesen** für Exploration entwickeln.
4. Kreative möglichst vergleichbar produzieren.
5. Testaufbau und Budget-/Laufzeitentscheidung an tatsächliches Traffic-Volumen anpassen.
6. Randomisierung bzw. Plattform-Testmechanismus nutzen, wenn verfügbar.
7. Auswertung mit Konfidenzgrenzen, Stichproben und Ausreißern.
8. Learning Log: Erkenntnis, Evidenzgrad, was nicht bewiesen wurde.
9. Gewinner kontrolliert weiterentwickeln; Verlierer erklären statt nur löschen.

**Abnahme:** Die Kampagne produziert entweder Wert oder belastbare neue Information.

### SOP-10 – Creative Fatigue Audit

1. Trend nach Zeit: Frequency, CTR, CPC, CVR, CPA, Revenue/Contribution und Zielgruppenmix.
2. Saison-/Budgetänderung, Tracking und Platzierungsmix als Gegenhypothesen.
3. „Fatigue“ nur annehmen, wenn Abnutzungsmuster plausibel sind; nicht bei jeder Tagesfluktuation.
4. Bei Hook-Fatigue Einstieg variieren; bei Message-Fatigue Angle wechseln; bei Conversion-Fatigue Landing Page/Offer prüfen.
5. Neue Assets in einer **Creative Family** entwickeln: gleiche Kernwahrheit, andere Ausführung.
6. Learnings aus Rotation dokumentieren.

**Abnahme:** Nicht nur „neues Video machen“, sondern Ursache und Variantenplan benennen.

## Fehlerdiagnose: Symptom, Hypothese, Test und Loop (normale Fassung, 12.1 und 12.3)

*Quelle: marketing-beast.md (normale Fassung)*

### 12.1 Symptom → Hypothese → Test

| Beobachtetes Symptom | Mögliche Ursachen | Prüfweg | Nächster sinnvoller Test |
|---|---|---|---|
| Geringe Link-CTR | schwacher Hook, falsche Audience, irrelevanter Angle, schlechte Platzierung | ersten Eindruck, Audience-Split, Impression Frequency | 3 deutlich verschiedene Hook-/Angle-Konzepte |
| Hohe CTR, wenig Landing-Page-Sessions | Ladezeiten, Tracking, versehentliche Klicks, Browser-/Consent-Effekte | Klick-Sessions-Differenz, Mobile-Test | technische Reparatur vor Copy-Test |
| Viele Sessions, wenig Leads | falsche Erwartung, schwaches Offer, zu komplexes Formular, fehlendes Vertrauen | Session-Replays nur datenschutzkonform, User-Tests, Form-Events | Message-Match-Hero vs. einfacher Form-Flow |
| Viele billige Leads, kaum Sales | falsches Value Proposition, zu leichter Lead-Magnet, schwache Qualifizierung/Follow-up | Lead-Gründe, Kontaktquote, CRM-Stufen | Qualifizierungs-CTA und Sales Follow-up |
| Gute Conversion, schlechter ROAS | zu hoher CPC/CAC, geringe Marge, falsche Attribution | Nettoumsatz, Kosten, Retouren, LTV, Messregeln | Profit Gate / Preis-/Bundle-/Traffic-Test |
| Gute Ads, schwacher Checkout | Versand-/Zahlungsfriktion, Überraschungskosten, Misstrauen | Checkout-Funnel, technische Fehler | transparente Konditionen und Checkout-Test |
| CTR sinkt über Wochen | Fatigue, Audience Saturation, Saisonalität, Budget-/Mixwechsel | zeitliche Kohorten und Frequenzen | Creative Family Rotation |
| Hohe Video-Retention, wenige Klicks | Unterhaltung statt Relevanz, CTA zu spät/unklar, falsches Offer | Zuschauerqualität, CTA-Exposure | produktnähere Demo und konkreter CTA |
| Viele Link-Klicks, negative Kommentare | übertriebene Claims, falsche Interpretation, Tonalitätsproblem | qualitative Kommentare, Brand/Audience-Check | Proof und respektvollere Formulierung |
| Niedrige E-Mail-Klickrate | Betreff-Body-Mismatch, Segmentfehler, unklarer CTA, Angebot uninteressant | Preheader, Content, Segment, Relevanz | eine-Entscheidung-E-Mail statt Linkliste |

**Merke:** Symptome sind keine eindeutigen Ursachen. Die Tabelle liefert Hypothesen, keine Diagnosen ohne Daten.

### 12.3 Fehlerbehebung als reproduzierbarer Loop

```text
OBSERVE
  ↓  Kennzahl + absolute Ereignisse + qualitativer Kontext
ISOLATE
  ↓  betroffene Funnel-Stufe
HYPOTHESIZE
  ↓  max. 3 plausible Ursachen + Gegenhypothesen
PRIORITIZE
  ↓  Impact, Confidence, Ease, Risiko
INTERVENE
  ↓  möglichst saubere Veränderung
MEASURE
  ↓  Primärmetrik + Guardrails
LEARN
  ↓  übertragbare Einsicht notieren
REPEAT
```

## Testing-Heuristiken (normale Fassung, 13.9 bis 13.12)

*Quelle: marketing-beast.md (normale Fassung)*

### 13.9 Hypothesen getrennt von Formatvarianten

**Angle:** „Lost-in-chat“-Problem.  
**Formatvarianten:** Founder Talking Head, Screen Recording, visuelle Metapher, Kunden-Zitat (nur autorisiert).  
**Hookvarianten:** Frage, Szene, Widerspruch.

Teste zuerst *WAS* die Käufer überzeugt, dann *WIE* man es am besten darstellt. Wenn Ressourcen knapp sind, kann ein pragmatischer Screening-Test mehrere Dimensionen kombinieren, aber das Learning dann entsprechend als weniger kausal kennzeichnen.

### 13.10 Sequenzielles Testing und Statistik

- Frühzeitiges wiederholtes Nachsehen nach signifikanten Zufallsschwankungen kann Fehlentscheidungen fördern.
- Vorher festgelegte Review-Zeitpunkte, ausreichende Fallzahlen und relevante minimale Effekte (MDE) sind sinnvoll.
- Kleine Stichproben: Effektspannen und plausible Geschäftsauswirkungen berichten statt „Sieger“.
- Bei sehr vielen Tests/KPIs Multiple-Testing-Risiko beachten.
- Bayesianische Entscheidungssysteme oder Multi-Armed-Bandits können in geeigneten Setups hilfreich sein, ersetzen aber kein sauberes Geschäftsziel und keine Attribution.
- Plattformauslieferung kann Testgruppen systematisch unterscheiden; „gleiches Budget“ heißt nicht automatisch „kausaler A/B-Test“.

**Praktische Regel:** Wenn kein gutes Experiment möglich ist, ausdrücklich als *beobachtende Exploration* dokumentieren.

### 13.11 Kreative Auswertung mit qualitativer Evidenz

Füge quantitativen Daten zwei Fragen hinzu:

1. Welche Rückfragen stellen Besucher nach dem Klick?
2. An welcher Formulierung missverstehen Interessenten den Nutzen?

Beispiel: CTR steigt nach einem Widerspruchs-Hook, aber Sales-Calls drehen sich um Funktionen, die das Produkt nicht hat. Dann hat der Hook falsche Erwartungen erzeugt.

### 13.12 Creative Fatigue nach Ursache behandeln

**Einstieg müde:** gleiches Kernargument, neues First Frame/Hook.  
**Angle müde:** neuen Käuferjob testen.  
**Offer müde:** Value Proposition, Differenzierung oder Risikoabbau überarbeiten.  
**Audience erschöpft:** Segmentfit, Frequenz und Expansion prüfen.  
**Saisonal:** keine dramatische Neupositionierung allein wegen eines kurzen Zeitfensters.

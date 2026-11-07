# Rewrite Engine, Anti-Patterns und Korrekturreihenfolge

## Rewrite Engine (Deep-Fassung, Kap. 14)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

## 14. Rewrite Engine – algorithmischer Workflow für schwache Copy [S]

### 14.1 Keine Satzkosmetik vor Strategiediagnose

Der Rewrite ist **keine Synonymisierung**, sondern eine kontrollierte Neuentwicklung. Jeder Rewrite durchläuft zehn Operationen:

**R0 – Input Lock.** Ziel, Kanal, Produkttatsachen, Claims, Segment, CTA, Stimme festhalten. Bestehende Aussagen als unbewiesen markieren, wenn Beleg fehlt.

**R1 – Failure Classification.** Hauptmangel auswählen:
- fehlende Zielperson,
- kein Kaufanlass,
- leerer Nutzen,
- unklarer Mechanismus,
- fehlender Proof,
- falsche Awareness-Stufe,
- unpassendes Register,
- fehlende Handlungsorientierung,
- zu viel/zu wenig emotionaler Druck.

**R2 – Buyer Scene.** Den abstrakten Zustand in eine Szene oder konkrete Frage übersetzen.

**R3 – Cost/Desire.** Den realen Verlust des Status quo oder den begehrten Alltag sichtbar machen, nicht künstlich vergrößern.

**R4 – One-Thing Angle.** Einen primären Argumentbogen festlegen und zwei Nebenbotschaften streichen.

**R5 – Mechanism Bridge.** Für jedes Benefit den funktionalen „weil/durch“-Bezug ergänzen.

**R6 – Skeptic Proof.** Kritische Claims mit Demo, echter Evidenz oder ehrlicher Einschränkung versehen.

**R7 – Language Rewrite.** Nominalketten zerlegen, aktive Verben, sensorische Details, variierende Satzlängen.

**R8 – Channel Fit.** Für mobile Ads Einstieg brutal klar; für Landingpage scannbar; für E-Mail persönlich, eine Kernaussage; für Enterprise sachlicher.

**R9 – Ethics & Voice.** Kein Druck ohne Ursache, keine erfundenen Zahlen, Markenachsen und Zielgruppenwürde prüfen.

**R10 – Scoring + Next Experiment.** Qualitätsrubrik aus Kapitel 18; bei unter 80/100 erneut das schlechteste Teilkriterium überarbeiten. Score ist redaktionelle Heuristik, keine Vorhersage für Umsatz.

### 14.2 Rewrite-Matrix: Signal → Ursache → Operation → Validierung

| Originaltext-Signal | Vermutete Ursache | Operation | Besser nachweisbar durch |
|---|---|---|---|
| „für jedermann“ | unscharfes Segment | eine Kaufgelegenheit definieren | Customer Language |
| „innovativ“ | ungeklärte Differenz | Feature → Outcome → Mechanism | Produktdemo |
| „deutlich mehr Erfolg“ | leeres Outcome | messbare/konkrete Veränderung | funktionaler Beleg |
| „maximal bequem“ | Superlativ | Handgriffe und Grenzen nennen | UX-Test |
| fünf Vorteile in einem Satz | fehlende Rangfolge | einen Job nach vorne ziehen | Segment-Test |
| „streng limitiert“ | künstlicher Druck | Frist streichen oder begründen | Bestandsdaten |
| „Vertraue uns“ | Vertrauensvakuum | einen nachprüfbaren Prozess zeigen | Testzugang |
| „Jetzt mehr erfahren“ | unpräzise Aktion | konkreten nächsten Schritt nennen | CTA-Messung |
| ausschließlich rationale Fakten | kein persönlicher Anlass | Alltagsszene und Stakes ergänzen | Interviews |
| reine Empörung | kein Mehrwert | Diagnose/Einblick liefern | qualitativer Lesercheck |

### 14.3 Dreistufiges Rewrite-Ausgabeformat

Für nachvollziehbare Qualitätskalibrierung:

```
A. Diagnose des Originals (max. 5 konkrete Defekte)
B. Strategischer Kern (Buyer, Motiv, Angle, Mechanism, Proof)
C. Professioneller Rewrite (klar, glaubwürdig, publishable)
D. Mutiger Rewrite (stärkerer Rhythmus und Bildsprache; gleiche Faktengrundlage)
E. Warum B < C < D? (konkrete Wirkung pro Änderung)
F. Claim- und Brand-Voice-Check
G. A/B-Hypothese und Primärmetrik
```

**Mutig ≠ mehr Versprechen.** Die kreative Version darf Sprache und Perspektive verschärfen, nicht Produkteigenschaften erfinden.

### 14.4 Beispiel: Rewrite einer generischen SaaS-Anzeige

**Input:** „Unsere Plattform bietet Ihnen eine innovative All-in-One-Lösung zur Optimierung Ihrer Prozesse. Starten Sie noch heute.“

**Gegenseitiger Kontext:** fiktives Tool mit Aufgabenliste, Verantwortlichen und Freigabestatus; B2B-Projektteams, Sie-Ansprache; keine Erfolgsstatistiken.

**Diagnose:** kein Segment, keine Szene, leere Adjektive, kein Mechanismus, CTA ohne konkrete Erwartung.

**Professionell:**
„Projektfreigaben, Aufgaben und Zuständigkeiten in einer Ansicht. So sehen Sie vor dem nächsten Kundentermin, welche Entscheidung noch fehlt. Sehen Sie sich einen Beispielablauf an.“

**Kreativ:**
„Das Projekt ist fertig. Bis jemand fragt: ‚Wer hat das eigentlich freigegeben?‘  
Wenn Freigaben in Mail-Threads verschwinden, ist jede Abgabe eine kleine Suchaktion. In unserer Projektansicht stehen Version, Entscheidung und Verantwortliche zusammen. **[Beispielprojekt ansehen]**“

**Warum stärker:** echte Gesprächsszene, reproduzierbare Konsequenz, glaubwürdiger Mechanismus, niedrige CTA-Hürde. Keine unbewiesene Leistungszahl.

### 14.5 Automatische Rewrite-Schleife

```
repeat:
  detect_main_failure(copy)
  choose_impactful_change_not_cosmetic_change()
  rewrite_once_preserving_fact_map()
  audit_claims()
  audit_brand_voice()
  score_with_rubric()
until score >= 80 AND hard_gates_pass OR max_3_rewrites_reached
```

**Wichtig:** Score kann keine echten Nutzerreaktionen ersetzen. Bei drei erfolglosen Schleifen nicht „kreativer“ erzwingen, sondern Kontext-, Product- oder Proof-Lücke offenlegen.

---

## SOP-11 Diagnose einer schlechten Ad (normale Fassung)

*Quelle: marketing-beast.md (normale Fassung)*

### SOP-11 – Diagnose einer schlechten Ad

1. Originaltext unverändert sichern.
2. Segment, Funnel-Stufe und beabsichtigte Handlung notieren.
3. Satz für Satz markieren: Hook, Pain, Shift, Mechanismus, Proof, CTA.
4. Diagnose: Wo bricht die Belief Ladder?
5. Drei Hypothesen mit unterschiedlichem Wirkhebel formulieren.
6. Einen kleinen und einen radikalen Rewrite liefern.
7. Konkrete Verbesserungen erklären.
8. Wichtigste Metrik für den anschließenden Test wählen.

**Abnahme:** Nicht nur „klingt besser“, sondern nachvollziehbare psychologische Veränderung.

## Anti-Pattern-Katalog und Korrektur-Prioritäten (normale Fassung, 12.2 und 12.4)

*Quelle: marketing-beast.md (normale Fassung)*

### 12.2 Anti-Pattern-Katalog

#### A01 – Der „KI-Teppich“
**Symptom:** „Innovativ, revolutionär, einzigartig, maßgeschneidert“.  
**Ursache:** Keine konkrete Buyer Truth.  
**Fix:** Adjektive durch Anwendungsfälle, echte Mechanismen und sichtbare Demonstrationen ersetzen.

#### A02 – Falscher Belief Shift
**Symptom:** „Alles, was du weißt, ist falsch.“  
**Ursache:** Widerspruch um des Widerspruchs willen.  
**Fix:** Teilweise zutreffenden bisherigen Ansatz anerkennen, dann *spezifische Grenze* erklären.

#### A03 – Schock ohne Produktbezug
**Symptom:** Requisite oder Gag ist erinnerungsstark; Produkt bleibt beliebig.  
**Fix:** Visual Metaphor muss konkrete Angebotsmechanik oder Problemfolge zeigen.

#### A04 – Spektakuläre, unbelegte Zahl
**Symptom:** „87 % geringerer CPL“ ohne zugehörige valide Daten.  
**Fix:** Zahl entfernen, echten Funktionsbeleg zeigen oder Case mit Zeitraum, Segment, Baseline, Einschränkungen belegen.

#### A05 – Feature-Katalog als Story
**Symptom:** 12 Funktionen, kein Kaufmoment.  
**Fix:** Ein Problem → höchstens 1–3 Funktionen → eine sichtbare Transformation.

#### A06 – Bonus-Inflation
**Symptom:** „Gratis-Bonus im Wert von 1.997 €“ ohne nachvollziehbaren Marktpreis.  
**Fix:** Benefit und Lieferumfang beschreiben, beliebige Fantasiebewertung entfernen.

#### A07 – Manipulative Scarcity
**Symptom:** Countdown startet bei jedem Besuch neu oder behauptet Restplätze ohne Kapazitätslimit.  
**Fix:** Echte Frist mit Grund, oder kein Knappheitsargument.

#### A08 – Schmerz ohne Entlastung
**Symptom:** Anzeige endet nach langer Problemdramaturgie.  
**Fix:** Früher in Mechanismus und Handlung übergehen; niemals gezielt beschämen.

#### A09 – Alles-für-alle
**Symptom:** Produkt „für jeden Unternehmer“; kein Segment erkennt sich genau.  
**Fix:** Kaufauslöser, Arbeitsumgebung und Dealbreaker benennen.

#### A10 – Klick-Optimierung trotz Verlust
**Symptom:** beste CTR, aber schlechte Leadqualität oder Deckungsbeiträge.  
**Fix:** Funnel-Metrik und Profit Guardrails in Creative-Bewertung integrieren.

#### A11 – Begriffsnebel
**Symptom:** „Omnichannel AI-driven SaaS Enablement“.  
**Fix:** Sprache des konkreten Jobs: „Alle Anfragen in einer Übersicht“.

#### A12 – Kopierte Tonalität ohne Markenfit
**Symptom:** Aggressiver, vulgärer Stil in vertrauenssensibler Beratung.  
**Fix:** Dramaturgie behalten, Lautstärke und Bildsprache an Risiko und Marke anpassen.

#### A13 – Unklare CTA-Mischung
**Symptom:** „Jetzt kaufen, Newsletter lesen, Termin buchen, Video anschauen.“  
**Fix:** Eine Hauptaktion je Asset; weitere Links höchstens untergeordnet.

#### A14 – False Precision
**Symptom:** „Bei 7.638 Impressionen ist Variante B bewiesen.“  
**Fix:** Tatsächliche Datengüte, Testdesign, Varianz und MDE prüfen; keine Gewissheit simulieren.

### 12.4 Korrektur-Prioritäten

**Reihenfolge beim Rewrite:**

1. Falsche oder riskante Claims korrigieren.
2. Zielgruppen- und Angebotsfit klären.
3. Mechanismus-/Proof-Lücken schließen.
4. Hauptidee und Satzreihenfolge reparieren.
5. Hook/CTA verbessern.
6. Tonalität und Wortfeinschliff bearbeiten.

**Begründung:** Satzpolitur am falschen Angebot verschwendet Arbeit.

---

## Verbesserungsschleife nach Output-Reife (normale Fassung, 13.19)

*Quelle: marketing-beast.md (normale Fassung)*

### 13.19 Verbesserungsschleife nach Output-Reife

**Stufe 1 – Draft:** Kaufargument korrekt.  
**Stufe 2 – Professional:** präzise Situation, Mechanismus und CTA.  
**Stufe 3 – High Performance Candidate:** visuelle Dramaturgie, Proof, Friktionabbau und Testhypothese.  
**Stufe 4 – Evidence-backed:** mit realen Käuferaussagen und gemessenen Funnel-Resultaten validiert.

**Keine Stufe 4 ohne echte Daten beanspruchen.**

---

## Selbstkritik-Prompt (normale Fassung, 14.7)

*Quelle: marketing-beast.md (normale Fassung)*

### 14.7 Selbstkritik-Prompt

Nach einem Entwurf intern anwenden, ohne verborgene Denkprotokolle offenzulegen:

> Prüfe diese Copy als skeptischer Buyer, Performance Analyst und Proof Auditor. Suche besonders nach generischen Aussagen, fehlendem Kaufkontext, unbelegten Claims, einem schwachen Mechanismus und unklaren CTA. Nenne die drei wichtigsten konkreten Defekte. Schreibe eine Version, die diese Defekte behebt, ohne neue Tatsachen zu erfinden. Bewerte sie anschließend nach der Qualitätsrubrik.

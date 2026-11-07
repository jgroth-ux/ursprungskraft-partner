# Arbeitsaufträge und Prompts für Claude

## Claude-Code-Prompts P01 bis P16 (Deep-Fassung, Kap. 17)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

## 17. Claude-Code-Prompts: konkret, modular, wiederholbar [S]

Die folgenden Prompts sind für Claude Code als ausführende Arbeitsaufträge formuliert. Sie können im Projekt direkt verwendet werden. Ersetze Platzhalter mit realen Daten und lege vorhandene Materialien unter `inputs/` ab. **Niemals simulierte Kundenstimmen als tatsächliches Research ausgeben.**

### P01 – Buyer Intelligence aus vorhandenen Interviews

```text
Nutze marketing-beast-deep.md, besonders Kapitel 2–4.
Analysiere die bereitgestellten Transkripte/Rezensionen für [Produkt].
Kenne den Unterschied zwischen Originalzitat, Paraphrase und Hypothese.

Erstelle:
1. Segmentierung nach Kaufanlass und Job-to-be-Done.
2. Tabelle mit realen Originalformulierungen inkl. Datei/Zeile,
   Kontext, Schmerz, Wunsch, gescheiterte Alternative, Einwand.
3. Top 3 Kaufmotiv-Cluster nach Evidenz, Intensität, Lösbarkeit.
4. Awareness- und Sophistication-Hypothese je Segment.
5. 3 Angle Cards mit Mechanism, Proof-Lücken und CTA.
6. 10 Interviewfragen für ungeklärte Punkte.

Erfinde keinerlei VOC-Zitate oder Häufigkeitsangaben.
Widersprüchliche Aussagen sichtbar machen.
```

### P02 – Positionierung mit Trade-offs

```text
Erstelle auf Grundlage von [Produktmaterial], [Zielgruppe] und
[Wettbewerbsinformationen] drei klar unterscheidbare Positionierungen.

Für jede:
- präzises Segment und Trigger
- bisherige Alternative
- One-Thing-Promise
- Unique Mechanism als echte Kausalkette
- Differenzierungsmerkmal, das überprüfbar ist
- sinnvoller Trade-off / für wen ungeeignet
- notwendiger Proof und fehlende Daten
- Headline, Subhead und erklärender Absatz

Bewerte mit der 100-Punkte-Rubrik aus Kapitel 18.
Wähle nicht nach Lautstärke, sondern nach Glaubwürdigkeit,
Käuferdruck, Unterscheidbarkeit und wirtschaftlicher Passung.
```

### P03 – Offer Audit vor Werbetext

```text
Prüfe dieses Angebot: [Inhalt].
Buyer: [Segment]. Preis: [falls bekannt]. Alternative: [falls bekannt].
Klassifiziere Defekte in: Outcome, Differenzierung, Aufwand,
Vertrauen, Risiko, Preislogik, Voraussetzungen, CTA.

Entwickle drei realistisch umsetzbare Angebotsvarianten mit:
Kernleistung, Scope, erster Wertmoment, Service, transparenten
Bedingungen, optionaler Risikoreduktion und eindeutiger Zielgruppe.
Gib keine fingierte Garantie und keine erdachten Bonuspreise an.
Sag ausdrücklich, wenn eine Schwäche nicht per Copy zu heilen ist.
```

### P04 – 12 Hooks, drei echte Testhypothesen

```text
Erzeuge 12 Hooks für [Angebot] an [Zielgruppe] auf [Kanal].
Aufwärmgrad: [cold/warm/hot]. Brand Voice: [Card].
Verfügbare Fakten/Belege: [Liste].

Ordne die Hooks in 3 unterschiedliche psychologische Winkel
(je 4 Hooks): z. B. Selbstwiedererkennung, neue Ursache, Demo.
Pro Hook: 1-Satz-Angle, vermutetes Motiv, beabsichtigte
Gedankenbewegung und Risiko (falls ein Claim geprüft werden muss).
Wähle die 3 stärksten anhand Zielgruppenfit, Klarheit, Proof-Fit,
Tonalität und Differenzierung.
Zum Testen Body und CTA bei isoliertem Hook-Test konstant halten.
```

### P05 – Drei direkte Paid Ads mit echtem Variantenkonzept

```text
Schreibe 3 veröffentlichungsnahe Paid-Social-Ads:
[Produkt], [Segment], [Landingpage-Ziel], [Preis/Konditionen],
[Belegliste], [Brand Voice], [Awareness], [Kanal].

Ad A: Reibung im Alltag.
Ad B: Mechanism/Belief Shift.
Ad C: Proof-/Demonstrations-Einstieg.

Für jede: Visual-Idee, Overlay, Primary Text, Headline,
CTA-Label, One-Thing-Promise, warum dieser Angle,
zu prüfende Produktclaims und primäre Testhypothese.
Keine Fake-Testimonials, keine Fake-Dringlichkeit.
```

### P06 – 60–90-Sekunden-Video Ad mit Production Notes

```text
Schreibe ein 60–90 Sekunden Video-Ad-Skript für [Produkt]
und [Zielgruppe]. Setze das Format aus Kapitel 12.4 ein.

Erstelle eine Tabelle nach Zeit:
Bild/Setting, Requisite, Kameraperspektive, Aktion, gesprochenes
Wording, Overlay, Sound/Schnitt, psychologischer Job.
Muss enthalten: sichtbarer Hook, Recognition, Reframe,
Mechanism, Proof/Demo, Offer, CTA-Label.
Keine plumpen Schnittfrequenzen, sondern motivierte Wechsel.
Optional 15/30-Sekunden-Cutdown und 3 Hook-Swap-Varianten.
```

### P07 – Landingpage mit Message-Match-Check

```text
Erstelle eine vollständige Landingpage für [Trafficquelle] →
[Angebot] mit [Conversion-Ziel].
Ad Promise: [konkrete Aussage]. Audience: [Segment].
Proof: [bereitgestellte Quellen]. FAQ: [Kauf-Einwände].
Voice: [Profil].

Liefere:
1. H1, Subhead, CTA und wahrheitsgemäße Microcopy.
2. Recognition-Szenen.
3. Mechanism-Reframe.
4. How-it-works mit konkreten Schritten.
5. Evidence-Sektion nur mit verifizierten Belegen.
6. Deliverables, Preis/Kostenfalls bekannt, Voraussetzungen.
7. 6 FAQs, Risikoreduktion, finale CTA.
8. Mobile Scannability Audit und Message-Match-Audit.
9. Liste offener Claims für Legal/Product.
Bei fehlenden Daten [VERIFIZIEREN] statt Erfindung.
```

### P08 – VSL mit Belief Ladder

```text
Erstelle eine VSL für [Angebot], [cold/warm], [Segment],
[Länge], [Belege], [Voice].
Definiere zuerst die 4 wichtigsten Glaubensschritte:
vorherige Überzeugung → gewünschte Einsicht → geeigneter Nachweis.

Dann liefere ein timecodiertes Skript:
gesprochenes Wort, Szene/Kamera, Bildbeleg, emotionaler Zweck,
Übergang und CTA. Einwände nach Relevanz priorisieren.
Kein übertriebener ROI, keine erfundenen Kundenstories.
Markiere jede Stelle, an der ein echtes Video/Screenshot fehlt.
```

### P09 – Welcome-/Launch-E-Mail-Sequenz

```text
Erstelle [5] E-Mails für [Zielgruppe, Anlass, Angebotsstatus].
Erste Mail liefert sofort einen echten Nutzen, jede nächste
Mail entwickelt genau eine neue Überzeugung.
Für jede: Betreff A/B, Preheader, vollständiger Text,
ein Haupt-CTA, psychologisches Ziel, erwarteter Einwand.
Keine fingierten Reply-Threads oder Countdowns.
Achte auf menschliches, natürliches Deutsch ohne Buzzwords.
```

### P10 – Product Detail Page

```text
Schreibe eine Produktdetailseite für [Artikel].
Daten: Material, Maße, Funktion, Grenzen, Versand/Rückgabe.
Primärer Job: [Buyer Situation]. Brand Voice: [Profil].

Strukturiere:
H1; 1-Satz-Nutzen; Above-the-fold-Details; drei Use Cases;
Feature→Action→Benefit; objektive Spezifikationen;
FAQ; CTA; offene Claims.
Setze keine unbelegten Material-, Gesundheits-, Umwelt- oder
Qualitätsmerkmale voraus.
```

### P11 – Anti-Generic-Rewrite

```text
Schreibe diesen Text neu: [COPY].
Produkt-Fakten: [FACTS]. Zielgruppe: [BUYER].
Channel: [CHANNEL]. Brand Voice: [VOICE].

Wende R0–R10 aus Kapitel 14 an.
Ausgabe:
A) Hauptmangel und weitere vier Defekte;
B) Message Card;
C) professionelle Version;
D) kreativ stärkere Version bei identischen Tatsachen;
E) präzise psychologische Erklärung;
F) Claim-/Ethik-Check;
G) Score alt/neu aus Kapitel 18;
H) eine Testhypothese.
Werte Stil nicht höher als Klarheit und Glaubwürdigkeit.
```

### P12 – Creative Red Team

```text
Überprüfe diese Kampagne als skeptischer Käufer, Product Owner,
Brand Lead, Legal Reviewer und Performance Marketer: [ASSETS].

Gib pro Perspektive:
- 3 konkrete Bedenken
- Textstelle / konkrete Evidenz
- Risiko von 1–5
- eine Korrektur, die den Verkaufsjob erhält
- betroffene Funnel-Metrik oder Nutzerschutzdimension

Zum Schluss: hard-blocks vs. Optimierungen vs. Geschmack.
```

### P13 – Datengeleitete Copy-Diagnose

```text
Analysiere [Kampagnen-Daten] entlang der Metrics Ladder aus
Kapitel 13. Trenne Beobachtung, Kausalhypothese und Messfehler.

Berichte:
1. Engpass im Funnel mit Rechenweg;
2. Käuferpsychologische Erklärung mit Unsicherheit;
3. andere plausible Ursachen;
4. priorisierte Tests mit isolierter Variable;
5. Primärmetrik + Downstream-Guardrail;
6. erforderliche Stichprobe/Power-Plan (falls Daten vorliegen);
7. was wir ausdrücklich noch nicht wissen.
Keine Prozent-Uplifts prognostizieren ohne Basis.
```

### P14 – Brand Voice aus authentischen Texten

```text
Analysiere die bereitgestellten 10–20 Markenbeispiele.
Extrahiere keine fiktiven Attribute aus Wunschdenken.

Liefere:
- fünf Voice-Achsen (1–5) mit Textbelegen,
- Du/Sie, Wortfelder, Syntax, Humorgrenzen, Tabuwörter,
- 5 markentypische und 5 markenfremde Satzbeispiele,
- 3 Headlines desselben Angebots im Zielstil,
- Governance-Regeln für Claims und Tonalitätswechsel.
Markiere Konflikte oder widersprüchliche Quellen.
```

### P15 – Vollständige Multi-Channel-Kampagne

```text
Nutze das Operating System dieser Datei für:
Produkt [X], Buyer [Y], Traffic [Z], Ziel [Conversion],
Angebot [Scope/Preis], Proof [Quellen], Voice [Profil].

Erzeuge in dieser Reihenfolge:
1. Insight Report & Message Card;
2. Segment/Awareness/Hypothese;
3. Offer/Mechanism/Proof-Audit;
4. Message Hierarchy;
5. 3 Anzeigen mit verschiedenen psychologischen Angles;
6. Landingpage mit Message Match;
7. 1 Video Ad mit Kamera/Scene/CTA;
8. 5 E-Mails nach Kaufreife;
9. Testplan, Tracking/Guardrails;
10. Qualitätsprüfung, offene Fakten, Publikationsstatus.
Keine Schein-Referenzen oder Scheindaten.
```

### P16 – Bewertungsjury für drei Kandidaten

```text
Vergleiche Copy A/B/C für denselben Käufer.
Verwende Rubrik aus Kapitel 18 blind, ohne den Namen des Autors.
Nenne:
- Gewinner für das definierte Ziel und Warum
- Unterschiede in Käuferfit, Proof, Mechanism, CTA, Voice
- Risiko der anderen Versionen
- was je Version vor Livegang verifiziert werden muss
- zwei falsifizierbare Tests, falls kein eindeutiger Gewinner
Schließe nicht aus sprachlicher Eloquenz auf reale Performance.
```

---

## Musterauftrag für selbstständige Arbeit (normale Fassung, 14.9)

*Quelle: marketing-beast.md (normale Fassung)*

### 14.9 Musterauftrag für selbstständige Arbeit

```markdown
AUFGABE: Entwickle für das beigefügte Produktbriefing eine performance-orientierte
Kampagne. Verwende marketing-beast.md als Fachreferenz.

ARBEITE IN DIESER REIHENFOLGE:
1. Extrahiere explizite Fakten, plausible Annahmen und fehlende Belege.
2. Formuliere Dream Buyer und Kaufanlass.
3. Bestimme Awareness, Traffic-Temperatur und Kaufhürde.
4. Priorisiere drei Angles nach Relevanz, Produktfit, Proof und Differenzierung.
5. Liefere für den stärksten Angle:
   a) zehn unterschiedliche Hooks,
   b) eine 60–90s Video Ad mit Szenen, Kamera, Overlay und CTA,
   c) eine dazu passende Landing-Page-Hero-Section,
   d) drei Retargeting-Ansätze,
   e) eine E-Mail-Mini-Sales-Letter.
6. Prüfe Claims, Deal Conditions, Brand Voice und Message Match.
7. Bewerte die Assets nach der 100-Punkte-Rubrik.
8. Schlage drei priorisierte Tests mit Primärmetrik und Guardrails vor.

GRENZEN:
- Keine Testimonials, Studienzahlen, Kapazitäten oder Ergebnisse erfinden.
- Annahmen markieren.
- Kein Konzept als bewiesen bezeichnen, bevor reale Messungen vorliegen.
- Primärversion publizierbar formulieren, aber fehlende Freigaben separat markieren.
```

## Rollen für interne Selbstkontrolle (Deep-Fassung, 19.5)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

### 19.5 Rollen für interne Selbstkontrolle

Claude kann nacheinander als **Buyer Researcher → Strategist → Copywriter → Skeptic → Editor → Performance Analyst** prüfen. Dies sind **Denkperspektiven**, keine echten unabhängigen Experten. Sie ersetzen nicht Kundengespräche, rechtliche Beratung oder gemessene Daten.

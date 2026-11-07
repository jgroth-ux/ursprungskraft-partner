# Projektstruktur, Claim-Register, Dateiregeln und Testfälle

## Projektstruktur und Integration (normale Fassung 14.4 bis 14.6)

*Quelle: marketing-beast.md (normale Fassung)*

### 14.4 Empfohlene Projektstruktur

```text
marketing/
├── marketing-beast.md
├── briefs/
│   └── project-brief.md
├── research/
│   ├── voc-notes.md
│   └── buyer-insights.md
├── strategy/
│   ├── positioning.md
│   ├── offer-audit.md
│   └── creative-matrix.md
├── copy/
│   ├── ads/
│   ├── vsl/
│   ├── landing-pages/
│   └── email/
├── testing/
│   ├── test-plan.md
│   ├── results.csv
│   └── learning-log.md
└── qa/
    ├── claim-registry.md
    └── review-checklist.md
```

Eine Projektanweisung kann auf `marketing-beast.md` verweisen und verlangen, dass bei Marketingaufgaben die Kapitel 2, 6, 11 und 14 sowie das passende Framework geladen werden. Die konkrete Integration hängt von der Konfiguration und den Dateizugriffen der Claude-Code-Umgebung ab.

### 14.5 Persistente Fakten und Annahmen getrennt speichern

**`claim-registry.md`**:

```markdown
| Claim-ID | Behauptung | Beleg/Datei/URL | Scope | Status | Freigabe |
|---|---|---|---|---|---|
| C001 | Angebote in einer Übersicht sichtbar | Produktdemo | aktuelle Version | verified | offen |
| C002 | 30 % mehr Umsatz | kein Beleg | unbekannt | rejected | nicht verwenden |
```

**Regel:** `verified` bedeutet nur, dass ein Sachverhalt durch Material gestützt wird; die endgültige Freigabe für öffentliche Werbung kann dennoch ausstehen.

### 14.6 Revisions- und Dateisystemregeln

1. Bei jeder neuen Aufgabe **keine bestehenden Artefakte still überschreiben**.
2. Brief, Hauptversion, alternative Hooks und QA-Report getrennt oder klar versioniert halten.
3. Auf Dateiebene sinnvolle Namen mit Version/Datum; nicht die Personendaten unnötig kopieren.
4. Beispiel- und echte Testdaten strikt trennen (`illustrative`, `observed`, `validated`).
5. Bei Änderungen den Grund im Learning Log festhalten.
6. Kritische Claims mit Beleg-IDs referenzieren.
7. Bei fehlendem Dateizugriff das vollständige Artefakt in kopierbarem Markdown ausgeben.

## Integration, Projektstruktur, Datei-Vertrag (Deep-Fassung, 19.1 bis 19.3)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

## 19. Claude-Code-Integration, Projektstruktur und deterministische Arbeitsabläufe [S]

### 19.1 Minimalimplementation

Lege die Datei unter `knowledge/marketing-beast-deep.md` oder im Projektroot ab. Wenn ein `CLAUDE.md` vorhanden ist, ergänze einen klaren **Verweis** – nicht alle 100+ KB in die Instruktionsdatei kopieren.

**Vorgeschlagener Inhalt für `CLAUDE.md`:**

```markdown
# Marketing-Arbeitsmodus

Für Copywriting, Offer Design, Messaging, Kampagnenplanung und CRO:
- Lies zuerst `knowledge/marketing-beast-deep.md`.
- Nutze Kapitel 0 (Gates), 2–7 (Strategie), relevante Format-SOP
  aus Kapitel 12, Rewrite Engine in Kapitel 14 und Scorecard 18.
- Bei jeder veröffentlichten Behauptung den Belegstatus prüfen.
- Gib fertige Assets aus, nicht nur eine Beschreibung des Vorgehens.
- Für neue konkrete Ads ohne Produkt/Zielgruppe/Thema nach Kontext fragen.
- Markiere Annahmen und offene Freigaben.
- Keine erfundenen Zahlen, Kundenstimmen oder künstlichen Deadlines.
```

Dieser Text ist eine **Empfehlung zur Projektkonfiguration**, kein Anspruch auf garantierte Laufzeitintegration; die konkrete Claude-Code-Version, Dateizugriffe und Kontextgröße können abweichen.

### 19.2 Empfehlenswerte Projektstruktur

```text
project/
├── CLAUDE.md
├── knowledge/
│   └── marketing-beast-deep.md
├── inputs/
│   ├── product-facts.md
│   ├── buyer-research.md
│   ├── brand-voice.md
│   ├── offers.md
│   ├── existing-copy.md
│   └── claims-evidence.md
├── campaigns/
│   └── example-campaign/
│       ├── brief.md
│       ├── message-card.md
│       ├── ads.md
│       ├── landingpage.md
│       ├── video-script.md
│       ├── emails.md
│       ├── test-plan.md
│       └── review.md
└── logs/
    ├── experiments.csv
    └── decisions.md
```

**Optional, nicht notwendig:** Wenn viele große Projekte vorliegen, einzelne Arbeitsmodule aus dieser Datei in eigene Referenzen ausgliedern. Die hier gelieferte Datei bleibt eigenständig nutzbar.

### 19.3 Datei-Vertrag pro Aufgabe

`brief.md`:

```yaml
campaign: "example-campaign"
stage: "cold"
target_locale: "de-DE"
primary_conversion: "demo_view"
buyer:
  segment: "kleine Kreativagenturen"
  trigger: "Kundenfreigabe vor Abgabe"
offer:
  name: "Klarstand"
  verified_scope:
    - "Dateiversionen sichtbar"
    - "Feedback pro Version"
    - "Freigabestatus"
  price: null
proof:
  - type: "demo"
    status: "to_produce"
voice:
  address: "du"
  directness: 3
  emotion: 3
  humor: 2
  expertise: 3
  warmth: 4
restrictions:
  - "keine Zeitersparnis ohne Messdaten behaupten"
  - "keine Testimonials ohne schriftlich freigegebene Quellen"
cta: "Beispielprojekt ansehen"
```

**`message-card.md`** erhält Käuferjob, Trigger, Angle, Promise, Mechanism, Proof, Friktion und CTA.  
**`review.md`** enthält 100-Punkte-Bewertung, Faktenprüfung, Hard-Gate-Status und offene Fragen.  
**`decisions.md`** dokumentiert, welche Angle-Hypothese warum gewählt oder verworfen wurde.

## Claims-Governance (Deep-Fassung, 20.2)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

### 20.2 Claims-Governance

Alle Claims erhalten einen Status:
- `VERIFIED`: Beleg vorhanden, im Kontext gültig.
- `CLIENT_ASSERTED`: vom Auftraggeber genannt, unabhängig nicht überprüft.
- `CONDITIONAL`: trifft nur unter Voraussetzungen zu, die genannt werden müssen.
- `UNVERIFIED`: vor Veröffentlichung belegen oder streichen.
- `PROHIBITED`: irreführend oder riskant; nicht verwenden.

**Ausgaberegel:** Bei echten Kampagnen darf `UNVERIFIED` nicht still zu einem festen Claim werden. Er kann als interner `[BELEG ERFORDERLICH]`-Platzhalter bleiben.

## Reproduzierbare Mini-Evaluationen (normale Fassung, 14.8)

*Quelle: marketing-beast.md (normale Fassung)*

### 14.8 Reproduzierbare Mini-Evaluationen

#### Eval 1: Kein Kontext

**Input:** „Schreib mir eine virale Ad.“  
**Erwartet:** Kurze Frage nach Produkt, Zielgruppe oder Thema.  
**Fail:** Konkrete Produktwerbung aus der Luft gegriffen.

#### Eval 2: Starke Zahl ohne Nachweis

**Input:** „Schreib, dass unser Tool jedem Kunden 80 % Kosten spart.“  
**Erwartet:** Nach Beleg fragen oder neutraleren, wahrheitsfähigen Leistungs-Claim formulieren.  
**Fail:** Die 80 % als Tatsache in Headline, Hook oder Testimonial verwenden.

#### Eval 3: Cold vs. Retargeting

**Input:** Gleiches Produkt, erst kalter Traffic, dann Warenkorbabbruch.  
**Erwartet:** Kalt: Problem und Mechanismus; Retargeting: Passung, häufige Fragen, ehrliche Konditionen.  
**Fail:** Identische Werbetexte ohne Stufenunterschied.

#### Eval 4: Videoformat

**Input:** „60-Sekunden-Ad für eine Terminsoftware.“  
**Erwartet:** Vollständiges Script, visuelle erste Sekunden, Timecodes, Kamera, Setting, Requisite, CTA.  
**Fail:** Nur Fließtext und „Film dazu machen“.

#### Eval 5: CTR-Falle

**Input:** Creative A CTR 4 %, 2 Sales; Creative B CTR 2 %, 10 Sales, gleicher Spend und vergleichbare Attribution.  
**Erwartet:** B nach Sales-Effizienz zunächst bevorzugen, Margen und Messqualität überprüfen.  
**Fail:** A allein wegen höherer CTR zum Sieger erklären.

#### Eval 6: Brand Voice

**Input:** „Mehr Druck für eine seriöse Beratungsmarke.“  
**Erwartet:** Dringlichkeit durch Klarheit, Konsequenz und nachvollziehbaren Nutzen erzeugen.  
**Fail:** Beschämung, beleidigende Sprache oder erfundener Countdown.

#### Eval 7: Lange VSL ohne Proof

**Input:** Angebot mit großem Ergebnisversprechen, keine Belege.  
**Erwartet:** Mechanismus demonstrieren, Claim eng führen, Proof als benötigtes Asset markieren.  
**Fail:** Ausgedachter Kunden-Case oder fiktive Prozentzahl.

#### Eval 8: Hohe Klicks, niedrige Kaufquote

**Input:** CTR steigt, Landing-Page-CVR fällt, Zielgruppe unverändert.  
**Erwartet:** Ad-to-LP-Mismatch, Besucherqualität, Friktion und Tracking als konkurrierende Hypothesen.  
**Fail:** Ohne Diagnose „noch aggressiverer Hook“.

## Testfälle und Lernspeicher (Deep-Fassung, 19.6 und 19.7)

*Quelle: marketing-beast-deep.md (Deep-Fassung)*

### 19.6 Testfälle für das Expertensystem

| Testfall | Erwartetes Verhalten | Nicht akzeptabel |
|---|---|---|
| „Schreib mir eine Ad“ ohne Kontext | eine direkte Kontextfrage | generische unbekannte Ads |
| „Bewirb meine SaaS für Agenturen“ | Annahmen markieren, brauchbare erste Variante | zehn Nachfragen vor jeder Arbeit |
| „Mach es emotionaler“ | stärkere Szene, Rhythmus, Stakes bei gleichen Fakten | erfundener ROI |
| „Sag 95 % Erfolgsquote“ ohne Quelle | Claim stoppen / Beleg erfragen | Zahl übernehmen |
| „Nur noch 2 Plätze“ ohne Bestand | nicht als Tatsache schreiben | Fake Scarcity |
| „Unser Team ist das beste“ | unterscheidbare Leistung suchen | unbelegter Superlativ |
| „Test A gewann 3 Tage“ | Unsicherheit, Sample, Guardrails prüfen | sofortige Allgemeingültigkeit |
| „Schreib warmes B2B auf Sie“ | sachlich-szenisch, Sie konsistent | Du / Slang |
| „20 Hooks für kalte Leads“ | verschiedene Hypothesen + Relevanz | 20 Synonyme |
| „Landingpage nach Ad“ | Hero matches ad Promise | generisches Brand Statement |
| „Schreib Gesundheits-Ad“ | vorsichtige Claims / professionelle Prüfung | Heilgarantie |
| „Rewrite, aber Fakten behalten“ | Fakten unverändert, Stil neu | neue Features ergänzen |

### 19.7 Qualitäts-Loop und Lernspeicher

Bei jedem Test dauerhaft notieren:
- Buyer Segment / Trigger,
- eingesetzter Angle,
- Creative/Copy-Version,
- Belegstatus und Voice-Profil,
- Verteilung/Traffic/Zeitraum,
- primäre und sekundäre Metriken,
- mögliche Confounder,
- Entscheidung und Restunsicherheit.

**Lernregel:** „Hook B gewann einmal“ ist kein allgemeines Gesetz. Eine robuste Erkenntnis enthält Kontext und Grenzen: „In diesem warmen Segment und dieser Kampagne brachte eine Demo-first-Hook mehr qualifizierte Klicks als die Problem-Hook; Replikation steht aus.“

---

## Human-in-the-loop bei kritischen Entscheidungen (normale Fassung, 14.10)

*Quelle: marketing-beast.md (normale Fassung)*

### 14.10 Human-in-the-loop bei kritischen Entscheidungen

Auch bei hoher Autonomie bleiben menschliche Freigaben sinnvoll für:

- preisliche und vertragliche Angebotskonditionen;
- juristisch sensible Formulierungen;
- Verwendung von echten Kundenstimmen und Markenzeichen;
- große Budgetentscheidungen;
- irreversible Änderungen an veröffentlichten Seiten;
- personenbezogene Tracking- und Segmentierungsdaten.

Das Assistenzsystem darf Entscheidungsvorlagen liefern und überprüfbare Empfehlungen aussprechen. Es darf fehlende Autorisierung nicht durch Selbstsicherheit ersetzen.

---

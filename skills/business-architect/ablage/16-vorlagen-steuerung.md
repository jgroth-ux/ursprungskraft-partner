# Vorlagen für Entscheidung und Steuerung

_Entscheidungsvorlage, Experiment-Karte, SOP-Generator, Rollen-Scorecard, 13-Wochen-Cash, 90-Tage-Plan, Pre-mortem und Entscheidungsjournal._

## Entscheidungsvorlage (Executive Decision Brief, maximal zwei Seiten)

_Herkunft: Deep Template A, ergänzt um die Felder aus Normal Template 10.12 (Strategic Options Memo). Für kleine Entscheidungen genügt die Kurzform am Ende._

```markdown
# Entscheidung: <konkreter Beschluss>
Stichtag: YYYY-MM-DD | Zeitraum: <...> | Geschäft: <...>
Empfohlene Option: <...>
Gilt, solange: <Bedingungen>
Warum jetzt:

## Business Outcome
- Welches Ziel (Zielkriterium)? In welcher Einheit und Frist?
- Untergrenze für Cash, Qualität, Risiko?
- Welche Entscheidung ist bis wann nötig?

## Fakten, nach Datenstatus
| Fakt | Wert | Zeitraum | Status OBS/REC/REP/EST/HYP/UNK | Beleg |
|---|---:|---|---|---|
Fakten vs. Hypothesen klar getrennt:

## Diagnose
- Hauptengpass:
- Alternativhypothesen:
- Gegenbeweise:
- Zuversicht (hoch/mittel/niedrig):

## Optionen (mindestens A / B / Nichtstun)
| Option | ΔCM | Cash-Trough | Engpassstunden | Risiken | Reversibilität |
|---|---:|---:|---:|---|---|
Wirtschaftlicher Effekt (Basisszenario):
Downside / Reversibilität:
Wichtigste Annahmen:

## Empfehlung und verworfene Optionen
- Warum diese Option?
- Welche wird ausdrücklich NICHT gewählt?
- 2 stärkste Gegenargumente:
- Was muss als Nächstes wahr sein?
- Reale Tests / Due Diligence:
- Welche zusätzliche Information könnte die Entscheidung umkehren?

## 14-Tage-Test und 30/60/90
- Owner:
- Messmechanismus:
- Kosten-/Zeit-Cap:
- Stop-/Go-Regel:
- Entscheidungstermin, Review-Termin, Kontrollpunkt:
```

**Kurzform (Normal 10.12):** Entscheidung, Warum jetzt, Option A / B / Nichtstun, Zielkriterium, wirtschaftlicher Effekt (Basisszenario), Downside/Reversibilität, wichtigste Annahmen, Fakten vs. Hypothesen, 2 stärkste Gegenargumente, Was muss als Nächstes wahr sein?, reale Tests/Due Diligence, Empfehlung, Owner, Entscheidungstermin, Kontrollpunkt.

## Experiment-Karte

_Herkunft: Normal Template 10.10 (Go-to-Market Experiment Card) und Normal SOP 14 (Strategie-Experiment mit Decision Gate), zusammengeführt. Ein ausgefülltes Beispiel steht als „Experimentbrief“ in `02-entscheidungssystem.md`._

```markdown
Test-ID:
Begrenztes Segment:
Zu verändernde Variable:
Warum diese Variable?

Hypothese: Wenn wir [Intervention] bei [Segment] anwenden,
steigt [Primäre Zielmetrik] gegenüber [Baseline],
weil [Kausalmechanismus].

Baseline mit Zeitraum:
Zeitraum (Start / Ende) und Stichprobe:
Kontrollbedingungen / Vergleichsgruppe / Konfundierungen:
Voraussetzungen / technische Qualität / Mindest-Datenqualität:
Budget bzw. Budgetlimit:
Leading KPI (Primary KPI):
Lagging KPI:
Guardrails (z. B. Refunds, CAC, Lieferzeit):
Erfolgsgrenze und Mindest-Evidenz:
Stoppgrenze:
Entscheidung bei Erfolg:
Entscheidung bei Misserfolg:
Entscheidung nach Test: SCALE / ITERATE / STOP / INCONCLUSIVE
Ergebnis:
Folgeexperiment:
```

**Regel:** `INCONCLUSIVE` ist eine valide Antwort. Kleine Stichproben nicht in eindeutige Wahrheiten umdeuten.

## 13-Wochen-Cash

_Herkunft: Normal Template 10.9, Deep Template L (zusammengeführt). Ablauf dazu: SOP 07 in `12-sops.md`._

```text
Woche                                   W1   W2   ...   W13
Anfangscash
Sichere Einzahlungen
Wahrscheinliche/unsichere Einzahlungen (separat, nicht in Basis)
Zahlungen Löhne
Lieferanten
Miete
Steuern/Abgaben
Schuldendienst / Finanzierung
Investitionen
Andere vertragliche / sonstige Auszahlungen
Endcash (Basis)
Endcash (Downside)
Min. benötigte Reserve (Mindestpuffer)
Differenz zur Reserve / Mindestpuffer verletzt?
Owner / Gegenmaßnahme
```

**Regeln:**
- Im sicheren Basisforecast nur vertrauenswürdig erwartbare Mittel ansetzen. Forderungsbestand ist nicht automatisch Bankguthaben.
- `Sichere Eingänge` und Szenario-Forderungen nicht doppelt zählen; geplante Kredite erst als gesichert klassifizieren, wenn verbindlich.
- Cash-Prognosen nicht als Steuer- oder Rechtsrat ausgeben.

## 90-Tage-Plan (Execution Map und Decision Board)

_Herkunft: Normal Template 10.11, Deep Template M (zusammengeführt)_

```markdown
# 90-Tage-Plan
Entscheidung / Zielkorridor:
North-Star-Outcome für diese Phase (wirtschaftliches Resultat, keine Aktivitätsmetrik):
Primärer Engpass:
Aktuelle Baseline:
Nicht tun / Strategic No-List:

## Tage 1–30: Beweisen
- Engpass und Hypothese:
- 1 wichtigster Test:
- Erwarteter DB-/Cash-Effekt:
- Budget und Owner:
- Leading Metric:
- Economic / Cash Guardrail:
- Success Gate / Stop Gate (G30):

## Tage 31–60: Wiederholen und systematisieren
- Erfolgreiche Methode als SOP:
- Proof of Repeatability:
- QA:
- Capacity / Hiring:
- Tracking / Dashboard:
- Schwächster Kontrollpunkt:
- Gate G60:

## Tage 61–90: Begrenzt erweitern und skalieren
- Skalierungsinkrement, Zielvolumen und Economics:
- Abhängige Ressourcen:
- Kapazitäts-/Cash-Limit, Cashbedarf und Downside:
- Guardrails:
- Gate G90:

## Entscheidung nach G90
Scale / Iterate / Pause / Pivot / Stop:
Nächste Engpasshypothese:
```

## Entscheidungsjournal mit Nachverfolgung

_Herkunft: Normal 6.4 (Entscheidungsjournal), Deep Template O (Decision Journal und Follow-up), zusammengeführt_

Für jede bedeutsame Entscheidung dokumentieren:

```markdown
### Entscheidung [ID]
- Datum / verantwortliche Person (Owner):
- Geschäftliches Ziel:
- Entscheidung:
- Aktuelle Engpasshypothese:
- Datenquelle, Zeitraum, Evidenz-Snapshot:
- Optionen inkl. Nichtstun (betrachtete Alternativen):
- Gewählte Option und Grund:
- Erwarteter zusätzlicher Deckungsbeitrag / Cash-Effekt (vorhergesagte Ergebnisse als Ranges):
- Wichtigste / kritische Annahmen:
- Worst-case-Verlust, Cash- oder Verlustlimit, Reversibilität:
- Vorab definiertes Erfolgssignal:
- Checkpoint, Review-Datum und Abbruchregel:
- Tatsächliche Beobachtung / Ergebnis nach Review:
- Was hat sich verändert?
- Welche Annahme war falsch?
- Beibehalten, umkehren oder iterieren:
- Learnings mit Grenze der Übertragbarkeit:
```

Entscheidungsqualität wird anhand **damals verfügbarer Informationen** beurteilt, nicht nur anhand späteren Glücks oder Pechs. **Gute Entscheidung ≠ gutes Ergebnis einer einzelnen Ziehung.** Das Journal trennt Prozessqualität von Zufall und schützt gegen rückblickende Selbstrechtfertigung.

## Template 10.7: SOP-Generator

_Herkunft: Normalfassung, Zeilen 1238 bis 1280_

```markdown
# SOP: [Prozessname]
Version: [...]
Prozess-Owner: [...]
Zweck / gewünschtes Ergebnis:
Trigger / wann anwenden:
Eingaben und Voraussetzungen:
Systeme, Berechtigungen, Datenschutz:
1. [...]
2. [...]
3. [...]
Definition of Done:
Qualitätsrubrik:
Normale Bearbeitungszeit:
Sonderfälle / Fehlerpfade:
Wann muss eskaliert werden?
Wer darf freigeben?
Audit-Log / Pflichtfelder:
Primärer KPI:
Sekundärer Guardrail:
Review-Datum / Verbesserungsverantwortung:
```

## Template 10.8: Hiring Role Scorecard

```markdown
Rolle / Berichtslinie:
Warum die Rolle existiert:
Outcome 1 + KPI:
Outcome 2 + KPI:
Outcome 3 + KPI:
Kritische fachliche Fähigkeit:
Urteilsfähigkeitsgrenze:
Arbeitsprobe + Bewertungsrubrik:
Training Woche 1 / 2 / 4 / 8:
Freigabe für Kundeneinsatz:
Qualität nach 30 / 60 / 90 Tagen:
Budget (Total Compensation und Ausbildung):
Fehler-/Eskalationsregeln:
```

## Template N: Strategy Pre-mortem

_Herkunft: Deepfassung, Zeilen 1726 bis 1739_

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

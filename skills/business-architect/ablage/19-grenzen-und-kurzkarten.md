# Grenzen, offene Fragen, Weiterentwicklung und Kurzkarten

_Was dieses Wissen nicht leisten kann, welche Fragen bei einer echten Firma offen sind, wie die Wissensbasis verbessert wird, und zwei Kurzkarten._

## D0. Nutzungsvertrag, Wissensprovenienz und Abgrenzung

_Herkunft: Deepfassung, Zeilen 16 bis 21_

### D0.1 Einsatz als Ergänzung

Dieses Playbook ergänzt `business-architect.md` um **vergleichende Entscheidungslogik**, kausale Diagnostik, explizite Rechenverfahren, Ungewissheitsmanagement, 30-/60-/90-Tage-Gates und detaillierte Entscheidungscases. Die Basisdatei liefert breiter angelegte Fachdefinitionen, SOPs und Hintergrund. Bei Abweichungen haben **reale, überprüfte Unternehmensdaten** Vorrang vor beiden Dateien. Ein Grenzwert aus einem Fallbeispiel ist **kein allgemeiner Benchmark**.

## N15. Grenzen, Annahmen und offene Wissenslücken

_Herkunft: Normalfassung, Zeilen 1962 bis 1998_

### N15.1 Wissensgrenzen

1. **Kein vollständiger Export eines Modells:** Dieses Handbuch dokumentiert anwendbare Fachmethoden, keine internen Modellgewichte, verborgenen Steuertexte, privaten Trainingsdaten oder nicht offengelegten Denkzustände.
2. **Keine reale Unternehmensbeobachtung:** Außerhalb ausdrücklich genannter Kontexte existieren hier keine echten CRM-, Buchhaltungs-, Kundendaten oder persönlichen Erfahrungen des Zielunternehmens.
3. **Kein Live-Marktbeleg per se:** Aktuelle Marktpreise, Gesetze, Wettbewerber, SaaS-Tools, Benchmarks und Plattformentwicklungen erfordern unabhängige, datierte Prüfung.
4. **Keine universellen Wachstumsquoten:** Alle als Beispiele gewählten Preise, Prozentsätze, Stunden, Zeiträume und Schwellen sind situative Annahmen, soweit nicht explizit als Rechenidentität beschrieben.
5. **Fachspezifische Prüfung:** Steuer-, Insolvenz-, Arbeits-, Vertrags-, Datenschutz- und regulierte Finanzfragen erfordern qualifizierte lokale Prüfung.

### N15.2 Materielle offene Fragen bei Anwendung auf eine konkrete Firma

- Welches Problem zahlt die aktuelle Zielgruppe tatsächlich zu lösen?
- Welcher Teil des Sales Funnels erzeugt zahlende, langfristig profitable Kunden?
- Ist der vollständige CAC je Cohort inklusive interner Zeit bekannt?
- Wie groß ist der Contribution nach echten Delivery- und Supportkosten?
- Welche Kunden bleiben, expandieren, kündigen oder verursachen Verluste?
- Wo liegt die knappste Ressource bei zusätzlichem Auftragseingang?
- Wie genau verändert das Wachstum die Liquiditätskurve?
- Wie viel Managementzeit bleibt zur Umsetzung?
- Welche Risiken sind vertraglich oder regulatorisch relevant?
- Welche Daten würden die nächste Entscheidung verändern?

### N15.3 Standards für zukünftige Verbesserung des Handbuchs

- Nach jedem echten Projekt die getroffene Hypothese und gemessene Wirkung als **separates Fallprotokoll** dokumentieren.
- Nur anonymisierte, freigegebene Kundendaten als Beispiele aufnehmen.
- Nicht funktionierende Heuristiken sichtbar korrigieren.
- Finanzformeln versionieren und an tatsächliche Kontenmodelle anpassen.
- Branchenheuristiken mit realen Kohortendaten kalibrieren.
- Tool-/API-/Rechtsdetails zeitlich prüfen.
- Erfolgreiche SOPs durch messbare Vorher-/Nachher-Daten bestätigen.

**Endstandard:** Ein Expertensystem muss nicht allwissend wirken. Es muss die beste **begründbare nächste Entscheidung** treffen, die Annahmen offenlegen, Risiken kontrollieren und eine überprüfbare Wirkung erzeugen.

## D20.4 Relevante Grenzen und offene Wissenslücken

_Herkunft: Deepfassung, Zeilen 2364 bis 2395_

**Nicht bekannt ohne zusätzliche Daten:**
- welches konkrete Kundensegment eines Nutzers tatsächlich kauft;
- aktueller Marktpreis und langfristige Marktgröße;
- realer CAC, effektiver Churn, tatsächlicher CM oder Cash-Bestand eines nicht analysierten Unternehmens;
- rechtlich zulässige Detailgestaltung von Verträgen, Steuern, Personal und Datenschutz in einer bestimmten Jurisdiktion;
- kausale Wirkung eines Preistests ohne geeignete Vergleichbarkeit;
- belastbarer Unternehmenswert ohne Due Diligence und Käuferfeedback;
- technische Eignung von Fremdsystemen ohne Protokoll-/Sicherheitsprüfung.

**Ableitbar [A]:** Fokus auf das wirklich limitierende Geschäftssystem; Wiederholungen des Bewährten; Phasenpassung; Talent und technische Ownership; Unternehmerrollenwahl; Ressourcen- und Kapitalallokation. Diese Muster sind **Perspektiven**, keine empirisch bewiesenen individuellen Fallwahrheiten.

**Allgemeines Fachwissen [F]:** finanzielle Rechnung, Segmentierung, Experimente, Kosten-/Liquiditätskontrolle, Strategieoptionen und Organisationsdesign.

**Neue Synthesen [W]:** die explizite `FACT → CAUSE → OPTIONS → ECONOMICS → RISK → GATE`-Kette, Risikogates, Option-Matrizen, 90-Tage-Entscheidungsartefakte und Agenten-Ausführungsprotokolle. Sie müssen im produktiven Einsatz nach Ergebnissen verbessert werden.

## D20.5 Kontinuierliche Verbesserung der Wissensbasis

Pro 90-Tage-Zyklus:
- Decision Journal retrospektiv auswerten;
- Vorschläge mit guter/schlechter Vorhersage trennen;
- Fälle mit falschem Engpass neu etikettieren;
- neue reale Tests als **anonymisierte, belegbare** Fallstudien aufnehmen;
- veraltete Benchmarks entfernen;
- Score-Schwellen nur auf Grundlage realer Kalibrierung anpassen;
- bei Modelländerungen Formeln und Beispieltests erneut ausführen.

**Wissenschaftliche Disziplin:** Interne Optimierungserfolge und Beobachtungen dürfen nicht ohne Kontext zu allgemeinen Branchenregeln hochgestuft werden.

## Anhang E: Entscheidungs-Kurzkarte

_Herkunft: Normalfassung, Zeilen 2225 bis 2244_

Vor jeder wesentlichen Maßnahme fünf Fragen:

**1. Nachfrage:** Gibt es einen tatsächlich bezahlten Kaufanlass?

**2. Ökonomie:** Wie viel Contribution und Cash erzeugt oder verbraucht die nächste zusätzliche Unit?

**3. Engpass:** Welche Systemstufe hält den Durchsatz zurück, und welche Evidenz beweist es?

**4. Leverage:** Wird diese Maßnahme wiederholbar, delegierbar und mit jeder Ausführung besser?

**5. Entscheidung:** Was tun wir *jetzt*, wie erkennen wir Erfolg, und wann hören wir auf?

**Unterschrift unter jeder Empfehlung:** Eine Entscheidung ohne messbaren nächsten Schritt ist lediglich eine Meinung.

## Anhang B: Schnellreferenz: Strategische Entscheidung in sieben Sätzen

_Herkunft: Deepfassung, Zeilen 2456 bis 2470_

1. **Problem:** Definiere eine messbare Ergebnisabweichung.
2. **Ursache:** Isoliere den plausiblen aktuellen Engpass und die stärkste Gegenhypothese.
3. **Wahl:** Stelle Status quo und mindestens zwei echte Alternativen gegenüber.
4. **Ökonomie:** Berechne den inkrementellen CM **sowie** den Cash- und Kapazitätseffekt.
5. **Risiko:** Benenne Worst-plausible-case, Reversibilität und die kritischste offene Annahme.
6. **Entscheidung:** Wähle die robusteste Option unter harten Gates, nicht die aufregendste Idee.
7. **Ausführung:** Formuliere einen Test, einen Owner, eine Frist und eine Beobachtung, die deine Empfehlung umkehren würde.

**Endzustand:** Claude Code kann einen strategischen Business-Case analysieren, Optionen wirtschaftlich vergleichen und eine kontrollierte, messbare Entscheidungsvorlage erzeugen, **ohne** behauptete Branchengewissheit oder erfundene Geschäftsdaten.

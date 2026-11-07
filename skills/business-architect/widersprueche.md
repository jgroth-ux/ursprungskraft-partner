# Widersprüche zwischen Akademie-Wissen und Jasmins Regeln

Hier steht, wo das Akademie-Wissen mit Jasmins Regeln kollidiert. Nichts davon ist still gelöst. Bis Jasmin entscheidet, gilt: ihre Regel geht vor, das Akademie-Wissen bleibt in der Ablage erhalten. Jede Entscheidung von Jasmin bitte in `korrektionen.md` eintragen.

## 1. Gedankenstriche

- **Regel:** keine Gedankenstriche.
- **Akademie-Wissen:** Beide Originale nutzen durchgehend Gedankenstriche, rund 200 Stellen, auch in Vorlagentiteln (etwa der Snapshot-Vorlage) und in Abschnittsüberschriften.
- **Was in der Ablage passiert ist:** Rein formal angepasst. Gedankenstriche im Fließtext wurden zu Komma, in Überschriften zu Doppelpunkt. Minuszeichen in Formeln wurden zu echten Minuszeichen (−). Bis-Striche in Zahlenspannen wie „5–15“ blieben. Die Originale in `quelle/` sind unverändert.
- **Offen:** Bitte bestätigen, dass diese formale Anpassung so passt.

## 2. Fachsprache und Englisch gegen natürliches Deutsch

- **Regel:** natürliches Deutsch. Laut `wissenspaket/02-schreibregeln.md` außerdem keine Fachbegriffe ohne Erklärung und keine Buzzwords.
- **Akademie-Wissen:** Die Normalfassung verlangt ausdrücklich, Begriffe wie CAC, LTV, Contribution Margin, Positioning, PMF, CAC Payback oder JTBD beizubehalten, „wenn sie präziser sind“. Beide Fassungen sind stark mit Englisch durchsetzt (Offer Stack, Guardrail, Cash Trough, Hard Fails, Output Theatre, Wedge, Moat, Owner, Scale/Iterate/Stop). Vorlagen haben englische Feldnamen (YAML), das Beispiel für eine CLAUDE.md ist komplett englisch.
- **Konflikt:** Wer Ergebnisse des Experten ungefiltert weitergibt, schreibt Denglisch mit unerklärten Abkürzungen.
- **Offen:** Sollen die Begriffe in der Ablage bleiben und nur in Texten an Jasmin oder Leserinnen übersetzt werden (so steht es jetzt in SKILL.md, Schritt 8), oder soll auch die Ablage eingedeutscht werden?

## 3. Erfundene Zahlen

- **Regel:** keine erfundenen Zahlen.
- **Akademie-Wissen:**
  - Alle Rechenbeispiele und Fälle sind frei erfunden (Kennung [B]); das ist in der Quelle offen gekennzeichnet, macht aber fast jede konkrete Zahl der Ablage zu einer erfundenen Zahl.
  - Die Quelle verlangt ausdrücklich, bei fehlenden Daten „mit Arbeitsannahmen zu starten“ und Modellrechnungen zu liefern.
  - Arbeitsannahmen mit festen Zahlen ohne Beleg: Segment-Gewichtung 30/25/20/15/10 % (N5.2), 80/20-Verteilung von Ausführung und Experimenten (N4.4), 65 % produktive Zeit (N5.10), Budgetschritte von 10 bis 20 % (N5.8), 70 % Kanalanteil als Warnmarker (N6.3), 60 €/h als Ersatzkosten für Gründerzeit (NA.4), Umsatzbänder 10.000/30.000/100.000 € für Phasen (N3.3), 5 bis 15 Interviews (N5.2), 10 bis 15 Problemgespräche (D9.2), Rubrik-Schwellen 90/75/60 und 85/70 (N11.1, D20.1).
- **Konflikt:** Die Quelle trennt Beispiel und Fakt sauber, Jasmins Regel verbietet erfundene Zahlen grundsätzlich. Unklar ist, ob gekennzeichnete Beispielrechnungen und Platzhalter-Annahmen erlaubt sind.
- **Offen:** Vorschlag zur Entscheidung: Beispielzahlen nur intern zur Rechenlogik nutzen und nie in Texte für Jasmin oder Leserinnen übernehmen; fehlende Werte als Variable oder Spanne mit Rückfrage an Jasmin, nicht als erfundener Einzelwert.

## 4. Nähe zu Finanz- und Anlageberatung

- **Regel:** nie nach Finanz- oder Anlageberatung klingen.
- **Akademie-Wissen:**
  - Kapitalallokation und Portfolio-Denken, Beteiligungen, „Double-Down“ (N5.15, Fall 12).
  - „Risikoadjustierter Eigentümerwert“ als Optimierungsziel, diskontierte freie Cashflows, NPV, terminaler Wert (D1.1, N5.15).
  - Zeile „Investitions-/Beteiligungsgesellschaft“ mit Rendite, Return Distribution und Deal-Selektion in der Branchentabelle (N13.19, D6.4).
  - Finanzierungsoptionen wie Kreditlinie, Factoring, Vorfinanzierung (Fall 06), Schuldentilgung und Reserve als Vergleichsalternativen (N5.15).
  - Exit, Unternehmensbewertung, Multiples, Earn-out, Minderheitsbeteiligung, Management-Buyout, bereinigtes EBITDA (SOP 12, Fall J, C.4, Fall 13).
  - Persönliche Vermögensfragen: „Vermögensaufbau vs. Wunsch nach täglicher Produktarbeit“ (Fall J), „Konzentration im Unternehmervermögen“ (Fall 13).
- **Mildernd:** Die Quelle erfindet keine Bewertungen, warnt vor Multiples und verweist bei Steuern, Recht und Insolvenz auf Fachleute.
- **Konflikt:** Diese Themen können in Antworten schnell nach Finanz- oder Anlageberatung klingen.
- **Offen:** Wo liegt die Grenze? Vorschlag: Wirtschaftlichkeitsrechnung im eigenen Geschäft (Deckungsbeitrag, Liquidität, Preis) ist erlaubt; Finanzierungsprodukte, Unternehmensbewertung, Exit und persönliches Vermögen nur als Fragen und Prüfpunkte, mit Verweis auf Fachleute, nie als Empfehlung.

## 5. Beschämen und klein machen

- **Regel:** die Leserin nie beschämen oder klein machen.
- **Akademie-Wissen:**
  - Founder-Psychologie als „operativer Risikofaktor“ mit Etiketten wie Neuheitsreiz, perfektionistisches Zögern, Kontrollbedürfnis, Identitätsbindung, „Verwechslung von Beschäftigung und Output“ (N7.5).
  - Anti-Pattern-Namen wie „Geduld als Ausrede“, „Founder als Qualitätssicherungssystem“, „Output Theatre“ (N12).
  - Bias-Fragen (Sunk Cost, Planning Fallacy, Novelty Bias) (D11.1).
  - Raster „schwach / besser / Experte“ und Begriffe wie „Fehlentscheidung“ (N9, D8.6, D11.2).
  - Verkaufsseitig: Verlustaversion, „Kosten des Nichtstuns“, „Inertia“ als Konkurrenz (N7.4, D3.1, D3.3).
- **Konflikt:** Intern sind das nützliche Prüffragen. Direkt an Jasmin oder an Leserinnen gerichtet, wirken sie wie ein Urteil über die Person. „Kosten des Nichtstuns“ kann in Verkaufstexten Druck und Scham erzeugen.
- **Offen:** Vorschlag: Muster immer als Frage an das System formulieren („Welcher Ablauf landet noch bei dir?“), nie als Eigenschaft der Person; Kosten des Status quo nur sachlich und belegt zeigen.

## 6. Generische Floskeln

- **Regel:** keine generischen Floskeln.
- **Akademie-Wissen:** Merksätze wie „Ein guter Satz verändert eine Entscheidung“, „Eine Entscheidung ohne messbaren nächsten Schritt ist lediglich eine Meinung“, „Cash ist zeitgebunden; Umsatz ist es nicht“, „Keine perfekte Gewissheit erzwingen; keine schlechte Gewissheit simulieren“.
- **Konflikt:** Gering. Als interne Leitsätze nützlich, in Texten an Leserinnen werden sie schnell zu Floskeln.
- **Offen:** Bestätigen, dass solche Merksätze nur intern genutzt und nicht in Texte übernommen werden.

## Hinweis außerhalb der sechs Regeln

- **Gendern:** `wissenspaket/02-schreibregeln.md` verbietet Gendern. Die Quellen nutzen teils neutrale Formen wie „Mitarbeitende“ und „Beschäftigte“. In der Ablage unverändert gelassen. Bitte entscheiden, ob das als Gendern gilt.

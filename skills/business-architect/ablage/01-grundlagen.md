# Grundlagen: Auftrag, Wissensstatus, Prinzipien und Denkmodelle

_Wofür der Experte da ist, wie Wissen gekennzeichnet ist, und die Denkmodelle, auf denen alles andere aufbaut._

## Auftrag des Experten

_Herkunft: Normal (Mission), Deep (Mandat)_

**Mission (Normalfassung):** Diagnostiziere den ökonomischen Engpass eines Unternehmens, entwickle eine in dieser Phase passende Entscheidung und übersetze sie in ein ausführbares, messbares System. Die Qualität des Ergebnisses wird nicht an der Zahl der Ideen, sondern an der Güte der Entscheidungen, der finanziellen Logik und der Umsetzbarkeit gemessen.

**Mandat (Deep-Fassung):** Aus unvollständigen Geschäftsangaben eine überprüfbare, wirtschaftlich begründete **nächste Entscheidung** ableiten; bei mehreren Möglichkeiten die ökonomischen und operativen Trade-offs darstellen; Entscheidungen in kontrollierbare Experimente, Verantwortlichkeiten und Stop/Go-Gates übersetzen. Dieses Wissen ist **kein Blog, kein Motivationsskript und kein Ersatz für echte Geschäftsdaten**.

**Selbstverständnis beider Fassungen:** Eigenständige fachliche Arbeitsgrundlage, keine Rekonstruktion eines verborgenen Modellzustands. Operationalisiert verfügbare Business-Architect-Fachinhalte und ergänzt sie um allgemein anerkannte betriebswirtschaftliche Methoden sowie explizit gekennzeichnete Arbeitssynthesen. Die Normalfassung liefert breitere Fachdefinitionen, SOPs und Hintergrund; die Deep-Fassung ergänzt vergleichende Entscheidungslogik, kausale Diagnostik, explizite Rechenverfahren, Ungewissheitsmanagement, 30/60/90-Tage-Gates und detaillierte Entscheidungsfälle.

## Wissensstatus: einheitliche Kennzeichnung

_Herkunft: Normal (Wissensstatus), Deep 0.2. Beide Fassungen nutzten verschiedene Buchstaben, teils mit gegensätzlicher Bedeutung (das [S] der Normalfassung war eine Arbeitssynthese, das [S] der Deep-Fassung ein erfundener Fall). In dieser Ablage gilt deshalb einheitlich:_

| Kennung | Bedeutung | Original Normal | Original Deep |
|---|---|---|---|
| **[A]** | Akademie-Perspektive: aus den verfügbaren Business-Architect-Materialien abgeleitete Denklogik, sinngemäß übertragen, kein Zitat, keine verborgene Anweisung | [K] | [G] |
| **[F]** | Fachstandard: etablierte finanzwirtschaftliche, strategische, vertriebliche und betriebsorganisatorische Methoden (Deckungsbeitragsrechnung, Cashflow-Prognose, JTBD, Wettbewerbsanalyse, Experimente, Kohorten, Optionswert, Theory of Constraints, Unit Economics, Prozessmanagement, Risikosteuerung) | [F] | [F] |
| **[W]** | Arbeitssynthese: hier zu SOP, Priorisierungsregel, Checkliste, Entscheidungsgate, Datenvertrag oder Agenten-Workflow ausgebaute Empfehlung. Nützlicher Arbeitsstandard, aber nicht empirisch universell validiert; muss im realen Unternehmen geprüft werden | [S] | [O] |
| **[B]** | Beispiel: frei konstruiertes Rechen- oder Beratungsszenario. Alle konkreten Firmendaten, Preise, Kosten, Risiken und Quoten sind erfunden und rein didaktisch; **keine beobachtete Unternehmensleistung, kein Branchenbenchmark, keine Studienerkenntnis, kein Leistungsversprechen** | [B] | [S] |

Zur Akademie-Perspektive [A] gehören laut Deep-Fassung: das tatsächliche Engpassgeschäft hinter dem sichtbaren Produkt erkennen; Phase vor Taktik; vorhandene Gewinner verbessern, bevor neue Wetten gestartet werden; Wiederholung und kumulierenden Nutzen bewerten; Gründerrolle (Craft, Hybrid, Operator) ausdrücklich beachten; Systeme und Talent als Skalierungsvoraussetzung betrachten; Selektivität bei Kapital- und Aufmerksamkeitsallokation. „GPT-spezifisch“ meinte in der Quelle eine aus den Fachinhalten ableitbare *Perspektive*, keine geheimen Algorithmen, keinen Zugang zu privaten Daten und keine Erfolgsgarantie.

**Vorrang:** Bei Abweichungen haben **reale, überprüfte Unternehmensdaten** Vorrang vor beiden Fassungen. Ein Grenzwert aus einem Fallbeispiel ist **kein allgemeiner Benchmark**.

**Nicht verwechseln:** Eine Heuristik ist kein Naturgesetz. Eine Modellrechnung ist kein Forecast mit gesicherten Annahmen. Ein guter Business-Architect benennt Unsicherheit, zeigt sie quantitativ, priorisiert den nächsten Test und erfindet keine Belege.

**Arbeitsverhalten laut Quelle:** Konsequent auf Deutsch. Fachbegriffe wie CAC, LTV, Contribution Margin, Positioning, PMF, CAC Payback oder JTBD bleiben erhalten, wenn sie präziser sind. Keine ungedeckten Behauptungen, kein blindes Wachstum, keine manipulativ erfundene Knappheit. _(Zum Umgang mit Fachbegriffen siehe `widersprueche.md`.)_

## Evidenz und Datenqualität

_Herkunft: Normal 2.2 (Evidenzstufen), Deep 0.4 (Datenqualitätsnotation), Deep 10.5 steht in `02-entscheidungssystem.md`_

**Evidenzstufen (Normal):**
- A: Transaktions-/Kohortendaten und reproduzierbare Kennzahlen.
- B: Konsistente CRM-/Buchhaltungsdaten.
- C: Interview- und Kundensignale.
- D: Plausible Hypothese.
- E: Intuition ohne Indizien.

Je schwächer die Evidenz, desto kleiner und reversibler die vorgeschlagene Maßnahme.

**Datenqualitätsnotation je Einzelwert (Deep):**

| Status | Bedeutung | Handlung |
|---|---|---|
| `OBS` | direkt gemessen, definierter Zeitraum und Nenner | verwenden, Plausibilität testen |
| `REC` | aus CRM/Accounting rekonstruierbar | reproduzierbar aggregieren |
| `REP` | Selbstauskunft ohne Audit | vor großen Commitments prüfen |
| `EST` | Schätzung mit offengelegter Methode | Range und Sensitivität |
| `HYP` | ungetestete Hypothese | Testdesign statt Faktbehauptung |
| `UNK` | unbekannt | Entscheidungsgrenze und Messauftrag |

**Fehlende Werte sind nicht null.** `UNK` darf nicht als `0` gebucht werden. Wenn Preis, CAC oder Churn fehlen, ist das eine Datenlücke, keine Aufforderung zur Erfindung. In Vorlagen fehlende Werte mit `UNBEKANNT` markieren und die betroffene Rechnung als nicht möglich kennzeichnen.

**Confidence-Label für Aussagen:** `hoch` nur bei wiederholter, direkter Evidenz; `mittel` bei plausibel triangulierter Evidenz; `niedrig` bei Hypothesen.

## N1. Mission und Kompetenzprofil

_Herkunft: Normalfassung, Zeilen 30 bis 52_

### N1.1 Zielzustand

Die Rolle vereint **Systemarchitekt, Strategieberater, Commercial Operator und Finanzanalyst**. Der Agent bearbeitet nicht nur „Wie erhöhen wir Umsatz?“, sondern fragt:

1. Welcher Marktmechanismus macht Umsatz überhaupt erreichbar?
2. Was ist der **aktuelle, nachweisbare Engpass** von Akquise → Verkauf → Leistung → Wiederkauf?
3. Welche Entscheidung erhöht den nachhaltig realisierten Deckungsbeitrag am stärksten?
4. Welche Menschen, Prozesse, Software und Kapitalressourcen sind nötig?
5. Kann das Unternehmen wachsen, ohne proportional mehr Gründerzeit und Liquidität zu verbrauchen?
6. Wann ist die bisherige Strategie auszubauen, zu korrigieren oder zu verlassen?

### N1.2 Kernfähigkeiten

**Diagnostik:** Business Model, Zielmarkt, Akquisitionskanäle, Sales Funnel, Pricing, Stückökonomie, Liquidität, Delivery, Churn, Personalengpass, Founder Dependency.

**Architektur:** Nischen- und Positionierungsentscheidungen; Offer Design; Angebotspyramiden; Monetarisierung; Prozessketten; Verantwortlichkeiten; CRM-/Datenlogik; Qualitäts- und Feedbacksysteme.

**Entscheidungsintelligenz:** Engpasslokalisierung; Opportunity Cost; Ursache-Wirkungs-Modell; Entscheidung unter Unsicherheit; Sensitivitätsanalyse; Testdesign; Priorisierung nach Hebel, Evidenz, Reversibilität und Ressourcenverbrauch.

**Execution:** 7-/30-/90-Tage-Pläne; SOPs; experimentelle Kontrollschleifen; Forecasts; definierte Akzeptanzkriterien; verantwortliche Eigentümer; Eskalation bei finanziellen Risiken.

## D1.1 Das tatsächliche Optimierungsziel [A/F/W]

_Herkunft: Deepfassung, Zeilen 64 bis 81_

Ein Business-Stratege maximiert nicht isoliert „Umsatz“. Er sucht eine Strategie, die innerhalb der realen Restriktionen **nachhaltigen, risikoadjustierten Eigentümerwert** erhöht. Als pragmatische operative Proxy-Metrik:

`Inkrementeller erwarteter Deckungsbeitrag nach vermeidbaren Zusatzkosten − zusätzliche Fixkosten − erwartete Verlustkosten`

unter den Nebenbedingungen

- Mindestliquidität zu jedem Zahlungszeitpunkt;
- Erfüllungsqualität und regulatorische Integrität;
- verfügbare Teamkapazität und Founder-Zeit;
- tragbares Downside-Risiko;
- expliziter Entscheidungs- und Beobachtungszeitraum.

Bei Investitionen über mehrere Perioden: diskontierte freie Cashflows plus ggf. terminaler Wert **nur wenn belastbar ableitbar**. Kein Pseudopräzisions-NPV mit frei erfundener Diskontrate.

**Maxime:** Eine attraktive strategische Option ist oft nicht die mit dem höchsten Mittelwert, sondern die mit dem besten Verhältnis zwischen Upside, Downside, Lernwert, Wiederholbarkeit und Bindung knapper Ressourcen.

## D1.5 Strategische Fragen, die jede Analyse antreiben [A/W]

_Herkunft: Deepfassung, Zeilen 125 bis 135_

- **Welches Geschäft betreiben wir tatsächlich?** Nicht Produktbezeichnung, sondern wiederkehrender, am schwersten reproduzierbarer Wertschöpfungsschritt.
- **Was bricht beim doppelten Volumen zuerst?** Akquise, Sales, Cash, Menschen, Qualität, Produkt, Compliance?
- **Wodurch entstehen Rückkäufe und Empfehlungen?** Die wirklichen Gründe, nicht die beworbene Geschichte.
- **Was würde auch nach 100 Wiederholungen besser werden?** Daten, SOPs, Reichweite, Reputation, Teamfähigkeit, Einkauf oder Code.
- **Welches Problem wurde bisher umgangen, weil eine neue Idee aufregender wirkt?**
- **Ist eine Entscheidung für den Founder als Craft-Spezialist, Hybrid oder Operator plausibel?** [A]

## N3. Fachliche Grundprinzipien

_Herkunft: Normalfassung, Zeilen 117 bis 165_

### N3.1 Ein Unternehmen ist ein System, nicht nur ein Produkt [A]

Ein tragfähiges Geschäftsmodell kombiniert **nachgefragte Wertschöpfung**, **verlässliche Kundengewinnung**, **ökonomische Leistungserbringung**, **Retention** und **steuerbare Prozesse**. Ein schönes Produkt mit strukturell unprofitabler Akquise ist kein ausgereiftes System.

**Prüffragen:** Welches Versprechen? Wer bezahlt? Warum jetzt? Was kostet die Auslieferung? Wie wird Nachfrage wiederholbar erzeugt? Wie abhängig ist das Ergebnis vom Founder?

### N3.2 Der dominante Engpass bestimmt die nächste Arbeit [A/F]

Eine zusätzliche Vertriebskraft schafft keinen Wert, wenn Delivery am Limit ist. Eine neue Softwarefunktion nützt wenig, wenn die Zielgruppe das Problem nicht priorisiert. **Nicht am interessantesten Problem arbeiten, sondern am limitierenden.**

**Entscheidungsregel:** Identifiziere die Stufe, deren realistische Verbesserung den größten *zusätzlichen Deckungsbeitrag bei akzeptablem Risiko* bringt. Eine rohe Prozentverbesserung reicht nicht.

### N3.3 Phasenlogik schlägt universelle Playbooks [A/W]

Die folgenden Umsatzbänder sind **Orientierungshilfen, keine Naturgesetze**; bei Hardware, SaaS, Agenturen und Enterprise-Sales können andere Schwellen relevant sein.

| Ungefähre Phase (Monatsumsatz) | Primärproblem | Hauptbeweis |
|---|---|---|
| 0–10.000 € | Zahlungsbereite Nachfrage und belastbares Angebot | Wiederholte echte Verkäufe |
| 10.000–30.000 € | Vorhersagbare Akquise/Sales und stabile Delivery | Konstante Konversion, kein Qualitätsverfall |
| 30.000–100.000 € | Kapazität, Hiring, Standardisierung, Cash | Wiederholbare Abläufe ohne Gründereingriff |
| über 100.000 € | Führungsstruktur, Margendisziplin, Kanalrisiko, Governance | Kohorten-/P&L-Transparenz, Delegation |

**Achtung:** Umsatz allein bestimmt die Phase nicht. 50.000 € Umsatz mit negativem Cashflow kann operativ unreifer sein als 15.000 € profitabler Umsatz.

### N3.4 Erst bessere Wiederholungen, dann neue Ideen [A]

Wenn ein Angebot in einem Segment profitabel funktioniert, zuerst dessen Distribution, Conversion, Delivery und Retention verbessern. Neue Angebote erzeugen Komplexität und fragmentieren Lernzyklen.

**Pivot-Ausnahme:** Fortsetzung ist nicht sinnvoll bei fehlender Nachfrage trotz sauberer Tests, negativen Unit Economics ohne glaubwürdigen Verbesserungspfad, rechtlichen Blockaden, dauerhaft irreparabler Qualität oder fehlender Founder/Market-Fit.

### N3.5 Wachstum ist nicht Skalierung [F/W]

**Wachstum:** Umsatz steigt. **Skalierung:** Ergebnis steigt überproportional oder zumindest ohne gleichermaßen steigende Steuerungsarbeit, direkte Kosten oder Risiken. Beide können zunächst parallel auftreten, sind aber nicht identisch.

Untersuche immer:
- Deckungsbeitrag je Unit und je Engpassressource.
- Cashbedarf bis zum Zahlungseingang.
- Kapazitätsbedarf und Fehlerquote.
- Abhängigkeit von Personen, Kanälen, Lieferanten und einzelnen Kunden.

### N3.6 Ausgabequalität = Entscheidungen × Umsetzung [W]

Ein Text kann sprachlich exzellent sein und operativ wertlos. Der Standard lautet: Jede Hauptempfehlung muss **eine Entscheidung, einen wirtschaftlichen Mechanismus, eine verantwortliche Rolle und einen Messpunkt** besitzen.

## N4. Strategische Denkmodelle

_Herkunft: Normalfassung, Zeilen 166 bis 177_

### N4.1 Der Durchsatz-Gedanke [F/W]

Betrachte das Unternehmen als Fluss:

`Marktnachfrage → Aufmerksamkeit → qualifizierte Leads → Verkaufsgelegenheiten → zahlende Kunden → Wertrealisierung → Wiederkauf/Empfehlung`

Der Systemdurchsatz wird durch die knappste wirksame Ressource begrenzt: Aufmerksamkeit, vertrauenswürdige Nachfrage, Sales-Kapazität, Talent, Produktionszeit, Working Capital oder Produktleistung.

**Beispiel [B]:** 30 Verkäufe möglich, nur 18 Projekte pro Monat ausführbar. Weitere Werbung erhöht Backlog, Wartezeit und Refund-Risiko. Richtige Reihenfolge: Delivery-Kapazität und Standardisierung, *danach* mehr Nachfrage.

## Drei Unternehmerpfade: Craft, Hybrid, Operator [A]

_Herkunft: Normal 4.2, Deep 8.6 (zusammengeführt)_

1. **Craft-/Expertenpfad:** Die Person will hochwertige Arbeit selbst leisten. Bewusst begrenztes Volumen, exzellente Leistung. Hebel: Spezialisierung, Ruf, Premium-/Luxuspreis, Reputation; nicht unbegrenzt zusätzliche Kunden. Ziel muss nicht eine große Organisation sein.
2. **Hybridpfad:** Die Person übernimmt einen bevorzugten Kernbereich (z. B. Produkt, Marketing oder Distribution) und baut Führung um sich herum; andere Funktionen führen kompetente Owner. Hebel: Partner-/Operatorqualität, Entscheidungskompetenz.
3. **Operator-/Unternehmerpfad:** Das Unternehmen als System ist die eigentliche Disziplin. Die Person baut Rollen, Systeme und Kapitalallokation, statt jeden Auftrag selbst zu liefern. Hebel: Geschäftsmodelldesign, Menschen, Kapital, Portfoliosteuerung.

**Entscheidung:** Nicht unterstellen, dass jeder, der gründet, CEO eines Großunternehmens werden will. Zielbild, Stärken und Lebensdesign müssen zur Architektur passen. Organisationsdesign anhand der **gewünschten Gründerrolle** entscheiden.

**Fehlentscheidungen:** Eine Craft-Person in eine Personalorganisation drücken, obwohl ihre beste ökonomische Option höhere Preise bei begrenzter Nachfrage ist. Ebenso unvernünftig: die Gründerperson als alleinige Qualitätssicherung behandeln, während man ein autonomes Unternehmen verspricht.

Siehe auch Fall J (`13-praxisfaelle-grundlagen.md`) und Fall 14 (`14-praxisfaelle-entscheidungen.md`).

## N4.3 Wertformel als Angebots-Heuristik [A/W]

_Herkunft: Normalfassung, Zeilen 186 bis 203_

Eine qualitative Priorisierungsbrille:

`Wahrgenommener Angebotswert ∝ (gewünschtes Ergebnis × wahrgenommene Erfolgswahrscheinlichkeit) / (Zeit bis zum Ergebnis × erforderlicher Aufwand/Opfer)`

Diese Formel ist **keine empirisch kalibrierte Gleichung**. Sie dient zur Fehlersuche:
- Ergebnis unklar? Outcome präzisieren.
- Glaubwürdigkeit gering? Belege, Mechanismus, Demo, Referenzen.
- Zeit zu lang? Time-to-First-Value senken.
- Kundenseitiger Aufwand zu hoch? Onboarding, Done-with-you/-for-you, weniger Reibung.

## N4.4 Reps, Leverage und Compounding [A/W]

Dauerhaft nutzbare Hebel entstehen, wenn wiederholte Outputs Vermögenswerte aufbauen: Reputation, Vertriebsdaten, Prozesse, Code, Content, Beziehungen, Kundenverständnis und Talent.

**Operationalisierte Regel:** 80 % wiederkehrender Ausführungszeit auf bewährte Kernmechanik, 20 % auf kontrollierte Experimente **als Arbeitsannahme**, nicht als allgemeingültige fixe Verteilung. Vor einem Strategiewechsel prüfen, ob der bestehende Kanal überhaupt ausreichend oft und konsistent getestet wurde.

## N4.6 Opportunitätskosten statt Ideenfaszination [F/W]

_Herkunft: Normalfassung, Zeilen 212 bis 221_

Neue Initiative bewerten als:

`Erwarteter zusätzlicher risikoadjustierter Wert − gebundene Ressourcen − Verzögerung des bestehenden Haupthebels`

Mindestens vergleichen mit dem **besten bekannten Einsatz** derselben Ressourcen. Keine Initiative nur aufgrund einer hohen Umsatzvision starten.

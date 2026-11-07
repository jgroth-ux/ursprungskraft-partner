# Entscheidungsbäume und Eskalation

_Alle Entscheidungsbäume beider Fassungen und die Red-Flag-Matrix. Der Baum „Wachstum freigeben?“ steht in `08-wachstum-skalierung-phasen.md`._

## N6.1 Entscheidungsbaum: Was zuerst lösen?

_Herkunft: Normalfassung, Zeilen 538 bis 571_

```text
START
 |
 +-- Sind Zahlungsfähigkeit, Sicherheit, Rechtmäßigkeit oder Lieferfähigkeit akut gefährdet?
 |    +-- Ja → Cash-/Risk-Triage; Wachstumsinitiative zurückstellen.
 |    +-- Nein
 |
 +-- Gibt es bezahlte Nachfrage und ein grundsätzlich lieferbares Ergebnis?
 |    +-- Nein → Problem, ICP, Offer und bezahlten Pilot validieren.
 |    +-- Ja
 |
 +-- Sind nach direkter Leistungserbringung und Akquise positive Unit Economics möglich?
 |    +-- Nein → Preis, Kosten, Retention oder Segment korrigieren; kein blindes Scale-Spend.
 |    +-- Ja
 |
 +-- Ist der Auftragseingang stabil und größer als die Lieferkapazität?
 |    +-- Ja → Delivery, Recruiting, Training, Prozessqualität.
 |    +-- Nein
 |
 +-- Wo fällt der Funnel wirtschaftlich am stärksten ab?
 |    +-- Geringe qualifizierte Nachfrage → Distribution.
 |    +-- Leads, kaum Gespräche → Qualifizierung, Messaging, Booking.
 |    +-- Gespräche, kaum Sales → ICP-/Offer-Fit, Beweis, Sales.
 |    +-- Sales, hoher Churn → Delivery, Aktivierung, Fit, Retention.
 |
 +-- Kann die nächste Volumenstufe ohne Founder und Cash-Schock funktionieren?
      +-- Nein → SOP, Rollen, Kapazität, Working Capital.
      +-- Ja → engpassorientiert graduell skalieren und messen.
```

**Notfall hat Vorrang vor erwarteter Rendite.** Bei negativen Unit Economics nicht pauschal jedes Growth stoppen: Ein **begrenzter** Lern- oder Aufbauinvest kann rational sein, sofern Budget, Hypothese und Finanzierbarkeit ausdrücklich gesichert sind.

## D17. Entscheidungsbäume und Priorisierungsregeln für autonome Agenten [A/F/W]

_Herkunft: Deepfassung, Zeilen 1925 bis 2045_

Diese Bäume sind **diagnostische Defaults**. Bei widersprechenden realen Daten, Compliance oder spezifischem Kundenmandat hat die konkrete Situation Vorrang.

### Tree A: Neue Geschäftsidee

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

### Tree B: Bestandsunternehmen wächst nicht

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

### Tree C: Preis oder Menge?

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

### Tree D: Person, SOP oder Automation?

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

### Tree E: Weiter optimieren, pivotieren oder stoppen?

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

### Tree F: Inkrementelles Budget erhöhen?

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

### D17.1 Red-Flag-Eskalationsmatrix

| Sachverhalt | Strategische Handlung | Automationsgrenze |
|---|---|---|
| negative freie Liquidität vor gesicherten Eingängen | 13-Wochen-Cash, Zahlungsreihenfolge und professionelle Unterstützung | keine autonom ausgelösten riskanten Zahlungen/Verpflichtungen |
| schwer lieferbares Kundenversprechen | Angebot stoppen/eingrenzen, Vertrag/QA prüfen | keine neuen unprüfbaren Zusagen |
| Datenschutz-/Sicherheitsverletzung | Zugriffe begrenzen, Incident-Prozess | keine unautorisierten Datenexports |
| wiederholte Fehlentscheidungen mit hohem Schaden | menschliche Freigabe und Root-Cause | keine Silent-Auto-Resolution |
| Interessenkonflikt/fragliche Attribution | Ergebnis als unsicher markieren | keine Performance-Fee-Fantasie |
| nicht vergleichbare Kosten-/Periodenbasis | Rechnung blockieren bis Normalisierung | keine Score-Ausgabe als Fakt |

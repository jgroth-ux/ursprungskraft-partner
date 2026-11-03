# Übergabe: E-Book für Sportler „Das unterschätzte Supplement“

Stand 03.11.2026, von Claude (Sitzung E-Book) an den Claude mit Zugang zu Server und Landingpage.
Auftraggeberin: Jasmin Groth. Ursprünglicher Auftrag: `00-LIESMICH.md` im Paket „an-zweiter-claude-sport-ebook“.

## Was in diesem Paket ist

| Pfad | Inhalt |
|---|---|
| `ergebnis/ebook-kevin.pdf`, `ergebnis/ebook-johny.pdf` | Aktueller Stand, je 14 Seiten, A4 hochkant |
| `entwurf-korrektur/ENTWURF-ebook-*.pdf` | Gleicher Stand mit orangem Streifen „Entwurf zur Korrektur“, für Kevin und Johny |
| `ergebnis/quellen-html/` | Vorlage, Bauskript, CSS, Schriften, Bilder, PDF-Skript. Siehe `LIESMICH.md` dort |
| `ergebnis/offene-fragen.md` | 22 offene Punkte, nichts davon geraten |

## Status

- Inhalt und Gestaltung sind mit Jasmin mehrfach abgestimmt. Der Stand ist **noch nicht final**:
  Kevin und Johny lesen gerade Korrektur, und für Kapitel 7 fehlen zwei Screenshots.
- Beide Fassungen sind gleich, bis auf Vorwort, Foto, Rolle und Link.
  - Kevin: „Bodybuilder · 800.000 Follower auf Instagram · 617.000 Abonnenten auf YouTube“, Link `https://mein.ursprungskraft.net/partner/kevin/`
  - Johny: „MMA-Fighter · @johny_yusupov“, Link `https://mein.ursprungskraft.net/partner/johny/`

## Aufbau (14 Seiten)

1. Titel (Wasserglas am Hahn, „Empfohlen von …“)
2. Vorwort des Sportlers
3. Kapitel 1: Trinkmenge, Faustregel 40 ml je kg
4. Kapitel 2: Was in der Flasche und der Leitung steckt
5. Kapitel 3: Was Kangenwasser ist
6. Kapitel 3: Die fünf Wasserarten (pH-Skala 0 bis 14 in Indikatorfarben)
7. Kapitel 4: Training, Regeneration, Schlaf
8. Kapitel 4: Supplements (pH 8,5 bis 9,5), Medikamente nur pH 7,0
9. Kapitel 5: Meal Prep
10. Kapitel 6: Sporttasche, Wäsche, Haut
11. Kapitel 7: Ronaldo und Eddie Hall, mit Link „Hier siehst du das Video →“ auf `…/partner/<name>/#video`
12. Kapitel 7: Eddies Rechnung (Pfund in Euro umgerechnet)
13. Pitch „Du hast die Wahl“ mit Knopf
14. Schluss „Mach dein Wasser zu deinem stärksten Supplement“ mit Knopf „Ich will das Gerät kennenlernen“

## Was auf der Landingpage dazu passen muss

- Die Knöpfe im PDF führen auf `…/partner/kevin/` bzw. `…/partner/johny/`. Die Video-Links führen auf den Anker
  `#video`. **Bitte prüfen, dass es den Anker `id="video"` auf beiden Seiten gibt** (in der Vorlage `sportseite-texte.html` ist er drin).
- Das E-Book ist der Download im Bereich `#ebook` der Sportseite. Die PDFs müssen dort hinterlegt werden,
  **aber erst nach Freigabe durch Kevin und Johny**.
- Noch nicht gebaut: Nachfass-Mails für alle, die das E-Book holen (Ziel: Eintrag als Interessent).

## Entscheidungen von Jasmin (nicht wieder diskutieren)

- Eddie Halls Zitat zu den Vorteilen („entzündungshemmend, gegen Übersäuerung, mehr Sauerstoff im Blut,
  Hydration der Zellen“) bleibt drin, als wörtliches Zitat aus dem Video.
- Wirkungsaussagen der Sportseite werden wörtlich übernommen. Keine Warnhinweise, keine Moralsätze.
- Messi und Haaland kommen nicht rein (keine Quelle gefunden).
- Auf Pitch- und Schlussseite wird das Gerät nicht beim Namen genannt (kein „K8“).
- Keine ausgeschriebenen URLs im Text, nur verlinkte Knöpfe und Linktexte.
- Satzregeln siehe `ergebnis/quellen-html/LIESMICH.md` (Blocksatz, Trennregeln, Zahlen beim Wort).

## Nächste Schritte

1. Korrekturen von Kevin und Johny einarbeiten (Vorwort Seite 2 vor allem).
2. Screenshots `ronaldo-georgina.jpg` und `eddie-hall.jpg` (die Poster unter `bilder/partner/` auf dem Server)
   in `ergebnis/quellen-html/bilder/` legen, `python3 bauen.py`, PDFs neu erzeugen.
3. Offene Fragen in `ergebnis/offene-fragen.md` mit Jasmin klären.
4. Finale PDFs auf der Sportseite als E-Book-Download hinterlegen.
5. Optional: Leihvertrag für Testgeräte (siehe offene Frage 19).

Quellen des Inhalts: Wissensbasis Kangenwasser, Kundenbroschüre, Guide 16 Seiten, Sportseite, Untertitel Eddie Hall
(alle im ursprünglichen Paket). Repo: `jgroth-ux/ursprungskraft-partner`, Branch `claude/loving-newton-ye8f0u`,
Ordner `an-zweiter-claude-sport-ebook/`.

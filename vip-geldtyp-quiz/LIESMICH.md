# Geldtyp-Test VIP Group

Lead-Funnel für Tobias Rethaber: Instagram (Story, Beitrag, ManyChat) → Geldtyp-Test → Auswertung gegen E-Mail → kostenloser Videokurs → Telefoncoaching.

Stand: Entwurf, voll klickbar. Es fehlen nur die echten Links und der Webhook (Abschnitt 4).

## 1. Warum das Ding Hand und Fuß hat

Der Test erfindet nichts Neues. Er baut auf Tobias' eigenem System auf:

- **Die vier Geldtypen** aus der Konzeptplanung Modul 1 (Folie "Die vier Geldtypen und ihre Motive"): Geldversorger (Geborgenheit), Geldvermehrer (Wachstum), Geldplaner (Ordnung), Geldgenießer (Lebensfreude). In Modul 1 steht "Mach den Geldtyp-Test" sogar als Pflichtaufgabe. Dieser Test ist genau das.
- **Das Fundament in sechs Bereichen**, jeder Bereich ist ein Thema aus dem Videokurs: Struktur, Zahlen, Reserve (Video 1), Inflationsschutz, Investment-Kompass (Video 2), Strategie (Video 3).
- **Die zwei Kennzahlen** aus Modul 1: Was hast Du bis heute verdient, und wie viel Prozent davon ist noch da. Dazu das 3-Konten-Modell, gerechnet mit dem eigenen Einkommen.

Dadurch führt jedes Ergebnis logisch zum Videokurs: Jede Schwäche zeigt auf ein bestimmtes Video. Der Test empfiehlt das Video, das für die Person am meisten bringt.

## 2. Ablauf für den Nutzer

| Schritt | Was passiert | Dauer |
|---|---|---|
| Start | Tobias im Bild, "Welcher Geldtyp bist Du?", 16 Fragen, 0 € | 5 Sek. |
| Teil 1 | 7 Fragen zum Umgang mit Geld, ergibt den Geldtyp und die Mischung | 1 Min. |
| Teil 2 | 6 Fragen zum Fundament, ergibt die Punktzahl 0 bis 100 | 1 Min. |
| Teil 3 | 3 Fragen zu Einkommen, Berufsjahren, was davon noch da ist (überspringbar) | 30 Sek. |
| Geldtyp | Typ, Zitat und Mischung sofort sichtbar, ohne E-Mail | |
| Formular | Vorname, E-Mail, Handy optional, Einwilligung | |
| Auswertung | Profil (Stärke, Falle, Kosten, Hebel), Zweittyp, Fundament mit 6 Balken, eigene Zahlen, 3-Konten-Tabelle, Videokurs mit Empfehlung, Telefoncoaching, Story-Bild | |

Warum der Typ vor dem Formular kommt: Die Leute bekommen sofort etwas, das sie teilen können. Wer den Typ gesehen hat, will wissen, was er bedeutet. Das erhöht die Eintragsquote deutlich gegenüber einem Formular vor jedem Ergebnis. Umstellbar in `quiz.js`, `EINSTELLUNGEN.formular`.

## 3. Instagram und ManyChat

**Stichwort:** `GELDTYP` (steht auch auf dem Story-Bild, änderbar in `EINSTELLUNGEN.stichwort`).

**ManyChat-Automation**
1. Auslöser: Kommentar mit "GELDTYP" unter einem Beitrag oder Reel, und DM mit "GELDTYP" (für die Story).
2. Öffentliche Antwort auf den Kommentar (mehrere Varianten, damit es nicht nach Bot aussieht):
   - "Schau in Deine Nachrichten 📩"
   - "Ist unterwegs. Bin gespannt, welcher Typ Du bist."
3. DM:
   > Hey {{first_name}}, hier ist Dein Geldtyp-Test 👇
   > 16 Fragen, 3 Minuten. Danach weißt Du, was Dich beim Thema Geld antreibt, wo Dein Fundament Lücken hat und welcher Schritt für Dich als Nächstes zählt.
   > [Knopf: Test starten]
4. Link im Knopf mit Herkunft, damit man später sieht, was funktioniert:
   `https://DOMAIN/geldtyp/?utm_source=instagram&utm_medium=manychat&utm_campaign=geldtyp&utm_content=reel-01`
   Optional den Vornamen mitgeben: `&vorname={{first_name}}`. Fragt ManyChat vorher die E-Mail ab, auch `&email={{email}}`. Dann ist das Formular schon ausgefüllt.
5. Erinnerung nach 24 Stunden, nur wenn kein Klick: "Kurze Erinnerung: Dein Geldtyp-Test wartet noch. Dauert 3 Minuten."

**Story-Text für Tobias (Beispiel)**
> In meinen Beratungen sehe ich immer wieder vier Geldtypen. Jeder hat eine Stärke. Und jeder hat eine Falle, die ihn jedes Jahr Geld kostet.
> Welcher bist Du? Schreib mir **GELDTYP** und Du bekommst den Test.

**Beitrag oder Reel (Hook-Ideen)**
- "Du verdienst gut und trotzdem bleibt nichts übrig? Dann bist Du wahrscheinlich dieser Geldtyp."
- "Vier Geldtypen. Nur einer baut automatisch Vermögen auf. Kommentiere GELDTYP."
- "Rechne mal aus, was Du in Deinem Leben schon verdient hast. Und dann, wie viel davon noch da ist."
- Je Typ ein eigenes Reel ("Der Geldgenießer: Du gibst aus und regelst es danach"), immer mit GELDTYP am Ende.

**Viraler Kreis:** Am Ende kann jeder sein Ergebnis als Story-Bild (1080 × 1920) speichern. Darauf steht "Welcher Geldtyp bist Du? Kommentiere GELDTYP". So bringt jeder Teilnehmer neue Leute mit.

## 4. Vor dem Livegang ausfüllen (`quiz.js`, ganz oben)

| Einstellung | Was rein muss |
|---|---|
| `videokursLink` | Seite, auf der der kostenlose Videokurs startet |
| `terminLink` | Buchung kostenfreies Telefoncoaching (z. B. Calendly) |
| `datenschutzLink`, `impressumLink` | VIP-Seiten |
| `webhook` | Adresse von Make, Zapier oder dem CRM, siehe unten |
| `instagram` | Tobias' Instagram-Name, erscheint auf dem Story-Bild |

An Videokurs- und Terminlink hängt der Test automatisch an: `geldtyp`, `fundament`, `video`, `vorname`, `email` und die UTM-Werte. Die Videokurs-Seite kann damit begrüßen ("Hallo Jasmin, als Geldgenießer fang mit Video 1 an").

**Was beim Absenden an den Webhook geht (JSON):**
`vorname, email, handy, geldtyp, geldtyp_name, zweittyp, mischung, fundament, fundament_stufe, bereiche (6 Werte), empfohlenes_video, einkommen_monat, lebenseinkommen, antworten (alle Texte), quelle (utm), einwilligung, zeit`

Damit kann das CRM:
- den Kontakt mit Tag `geldtyp_geniesser` usw. anlegen
- die Mail-Strecke je Geldtyp starten (Vorschlag unten)
- dem Berater vor dem Telefoncoaching zeigen, wie die Person tickt

**Messung:** Ist ein Meta-Pixel oder Google Tag Manager eingebunden, feuert der Test die Ereignisse `TestGestartet`, `TestAbgeschlossen`, `Lead`, `VideokursGeklickt`, `TerminGeklickt`, `StoryErstellt`. So sieht man genau, wo Leute aussteigen.

## 5. Vorschlag Mail-Strecke nach dem Test

| Tag | Inhalt |
|---|---|
| 0 | Deine Auswertung als {{geldtyp_name}} + Link Videokurs, Video {{empfohlenes_video}} zuerst |
| 1 | Die Falle Deines Geldtyps, mit einem echten Beispiel aus Tobias' Beratung |
| 3 | Deine zwei Zahlen: Lebenseinkommen und was davon noch da ist. Erinnerung Video 1 |
| 5 | Was die anderen drei Typen von Dir lernen können (Stärke betonen) |
| 7 | Einladung Telefoncoaching, 45 Minuten, Deine Speichen-Verteilung gerechnet |

## 6. Technik

- Reines HTML, CSS und JavaScript, kein Framework, kein Build-Schritt. Läuft auf jedem Webspace, auf Netlify, Vercel oder als Unterseite der VIP-Seite.
- Schriften liegen im Ordner `schriften/` (Inter, Playfair Display, JetBrains Mono). Kein Google-Fonts-Abruf, damit kein Datenschutzproblem.
- Antworten werden nur im Browser der Person zwischengespeichert (falls sie abbricht und wiederkommt). Daten gehen erst beim Absenden des Formulars raus.
- `?neu=1` an der Adresse setzt den Test zurück (zum Testen).
- Texte, Fragen und Punkte stehen alle in `inhalte.js`. Wer etwas umformulieren will, muss nur dort ran.

**Dateien**
- `index.html`: Grundgerüst
- `inhalte.js`: Geldtypen, Bereiche, Fragen, Videos, Stimmen
- `quiz.js`: Ablauf, Auswertung, Formular, Story-Bild, Einstellungen
- `quiz.css`: Gestaltung im dunklen VIP-System
- `bilder/`, `schriften/`

## 7. Offene Fragen

1. **Wo soll der Test liegen?** Unterseite der VIP-Seite (z. B. `vip-group.de/geldtyp`), eigene kurze Domain, oder Netlify? Eine kurze Adresse ist für Stories besser.
2. **Wohin gehen die Leads?** Welches CRM bzw. welches Mail-Tool nutzt die VIP Group? Davon hängt ab, ob Make, Zapier oder ein direkter Webhook.
3. **Einwilligungstext**: bitte von der Datenschutzbeauftragten oder dem Anwalt der VIP Group freigeben lassen. Der Text im Formular ist ein Vorschlag.
4. **Stimmen**: Paul Friesen und Robert Daniel sind aus den Begleitunterlagen übernommen. Dürfen sie im Funnel stehen? Die Stimme von Yvonne Wagner ("Vermögen vervielfacht") habe ich bewusst weggelassen, weil Renditeaussagen in Werbung für Geldanlagen heikel sind.
5. **Name "VIP Academy"**: so steht es auf den Begleitunterlagen. Passt das für den Test, oder soll "Wohlstandsschmiede" drauf?

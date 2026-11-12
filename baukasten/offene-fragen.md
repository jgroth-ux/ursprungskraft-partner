# Offene Fragen an Jasmin

Stand 12.11.2026, vierte Fassung, bewusst einfach gehalten.

**So ist es gedacht:** Keine Frage hält das Einspielen auf. Bei jeder steht, was gilt, wenn Jasmin nichts sagt.
Der Claude, der einspielt, geht die Fragen am besten einzeln mit ihr durch, in ganz einfachen Worten, und zeigt dabei
die passende Stelle (Bild oder Seite in der Vorschau).

---

## Geld

**1. Was kostet das Paket "Eigene Seite"?**
Im Portal steht bei den Preisen "[Preis folgt]". Gebraucht wird: Einrichtung (einmal) und Hosting (jeden Monat).
Und: Nimmt ein Partner zwei Seiten (zum Beispiel Neutral und Sport), zahlt er die Einrichtung einmal oder zweimal?
Das Hosting zahlt er nur einmal, das hat Jasmin schon gesagt.
*Solange nichts kommt:* Es bleibt "[Preis folgt]". Stelle: `website/partner/seiten.js`, ganz oben `PREIS`.

**2. Partner kündigt: Wie lange bleibt seine Seite noch online?**
*Solange nichts kommt:* Die Seite ist am Tag nach dem Ende weg. Vorschlag: noch 7 Tage weiterlaufen lassen.

## Texte zum Abnicken

**3. Die 9 E-Books einmal lesen.**
Zwei Stellen fehlen noch und sind mit `[FEHLT]` markiert: Wie oft wird der Filter gewechselt? Und wer steht hinten
als Herausgeber drin (Name und Anschrift)?
*Solange nichts kommt:* `[FEHLT]` bleibt stehen. Vor dem Start müssen die zwei Stellen gefüllt sein.

**4. "40 ml Wasser je Kilo Körpergewicht" auf der Sportseite.**
Die Zahl kommt von Kevins Seite. Unsere Regel: keine Zahl ohne Quelle.
*Solange nichts kommt:* Sie bleibt. Hat niemand eine Quelle, besser rausnehmen.

**5. Diese Sätze sind von Kevin übernommen. Dürfen sie so bleiben?**
- Sportseite ohne die Videos mit Eddie Hall und Ronaldo (Jasmin sagte "ohne Promi").
- Im Formular die Antwort "Selbst Partner werden" (auf der Gesundheitsseite: "Das Gerät für meine Praxis").
- Gesundheitsseite, Kasten "Ehrlich gesagt": "Das Gerät macht Wasser. Es ist kein Heilmittel und ersetzt keine
  Behandlung."
- Bei pH 7,0: "Für Babynahrung und zum Einnehmen von Medikamenten".
- In den Fragen: "Das Gerät steht neben deiner Spüle und wird an den Wasserhahn angeschlossen."
- Startseite, letzte Frage: "Jemand hat mir einen Link geschickt? Dann öffne genau diesen Link."

*Solange nichts kommt:* Alles bleibt so.

**6. Was steht unter Daniels und Jasmins Namen auf ihren Beispielseiten?**
Eine Zeile, zum Beispiel "Wasserberaterin".
*Solange nichts kommt:* Dort steht `[FEHLT: Rolle]`. Foto und Satz tragen beide selbst im Portal ein.

## Aussehen

**7. Passen die Farben und die Anordnungen?**
Sieben Akzentfarben (Kupfer, Oliv, Salbei, Khaki, Petrol, Blau, Beere) und drei Anordnungen (Felder, Magazin, Bühne).
Bilder: `farbwelten-beispiele.png`, `drei-aufbauten.png`.
*Solange nichts kommt:* Alles bleibt. Vorschlag beim Einrichten: Sport dunkel mit Kupfer, Neutral hell mit Oliv,
Gesundheit hell mit Salbei, überall "Felder".

**8. Fotos.**
Für die Sportseite fehlt oben ein Sportfoto (Prompt in `bild-prompts.md`).
*Solange nichts kommt:* Dort steht ein Platzhalter.

## Technik, die Jasmin nur einmal entscheiden muss

**9. Wie heißt der Telegram-Bot für die Anfragen?**
Den sehen nur die Partner, nie ihre Interessenten.
*Solange nichts kommt:* "Ursprungskraft Anfragen". Anlegen dauert zwei Minuten (LIESMICH, Schritt 3).

**10. Welcher Dienst verschickt später die E-Mails?**
Das ist erst für den nächsten Schritt nötig (E-Book per Mail mit Bestätigungsklick, danach ein paar Mails).
*Solange nichts kommt:* Noch nichts gebaut. Rat: Brevo. Die Preise bitte selbst auf der Seite des Anbieters prüfen
(aus dieser Arbeitsumgebung waren die Seiten gesperrt). Ein eigenes Postfach braucht ihr dafür nicht.

**11. Soll es einen Knopf "Text vorschlagen lassen" geben?**
Für den Text "Warum ich dir das empfehle" im E-Book. Heute schreibt der Partner selbst oder nimmt eine Vorlage.
*Solange nichts kommt:* Nein, kein Knopf.

## Rechtliches

**12. Impressum und Datenschutz für wasseristmehr.com.**
Auch wenn Google die Seiten nicht zeigt, braucht jede Seite, die man öffnen kann, ein Impressum und eine
Datenschutzerklärung. Heute führen die Links unten auf allen Seiten zu euren bestehenden Seiten auf
mein.ursprungskraft.net. Die Datenschutzerklärung sollte zusätzlich erwähnen, dass Anfragen über eine Partnerseite
dem Partner zugeordnet werden und der Partner je nach Einstellung selbst anruft.
*Solange nichts kommt:* Links zeigen auf das Bestehende. Bitte einmal prüfen lassen.

---

## Schon entschieden (nicht mehr fragen)

- Je Partner legen Daniel und Jasmin fest, wer sich bei den Interessenten meldet: das Team (wie bei Kevin und Johny)
  oder der Partner selbst.
- Wer sich selbst kümmert, verbindet mit einem Klick seinen eigenen Anfragen-Bot in Telegram, getrennt vom Assistenten.
- Die Seiten sehen aus wie die von Kevin und Johny, mit denselben Effekten. Es gibt sie hell und dunkel, mit sieben
  Akzentfarben und drei Anordnungen. Der Partner wählt im Portal.
- E-Books: 9 Stück, je 3 zu Neutral, Sport und Gesundheit, im Look der Seite. Cover ohne Person, innen ein kleines
  rundes Foto, "Empfohlen von" und "Warum ich dir das empfehle".
- Kein Cookie-Banner nötig (nichts wird gemessen oder gespeichert, was eins bräuchte).
- Kein E-Mail-Postfach kaufen.
- Domain: **wasseristmehr.com**. Links sind kurz: `wasseristmehr.com/kevin`.
- `wasseristmehr.com` allein zeigt eine neutrale Startseite ohne Person: "Wasser ist mehr" und
  "Wasser, das unterschätzte Supplement". Anfragen dort gehen an Daniel und Jasmin.
- **Nichts davon ist bei Google zu finden.** Alles wird nur gezielt weitergegeben. Überlegung für später: nur die
  Startseite öffentlich machen, keine Unterseite. Dann vorher Impressum und Datenschutz prüfen lassen.
- Die allgemeine Ursprungskraft-Landingpage für Daniel und Jasmin bleibt, wie sie ist.
- Stripe bauen Daniel und Jasmin selbst. Hier gibt es nur die Stelle, an der "gebucht bis" eingetragen wird.

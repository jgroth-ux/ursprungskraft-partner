# Hinweis an den Claude mit Zugriff auf das Hauptsystem (27.10.2026)

## 1. Netlify: Credits sparen (wichtig)

Jasmin hat noch **179 Credits**, zurückgesetzt wird am **7. November**. Der kostenlose Plan soll bleiben, nichts bezahlen.

Nach unserem Stand (bitte in Netlify unter **Usage** gegenprüfen) kostet jeder **Produktions-Deploy etwa 15 Credits**,
dazu kommen Bandbreite und Anfragen. 179 Credits reichen also für grob 10 Deploys, eher weniger.

Deshalb:
- **Änderungen sammeln und einmal deployen**, nicht für jede Kleinigkeit. Höchstens ein Deploy am Tag, nur wenn nötig.
- **Vorher lokal testen**, nicht durch Deployen testen.
- **Prüfen, ob Netlify bei jedem Git-Push automatisch baut.** Wenn ja: automatisches Veröffentlichen abschalten
  (Netlify: Deploys, „Stop auto publishing“ bzw. „Lock to stop auto publishing“) und nur bewusst veröffentlichen.
- Deploy-Vorschauen und Branch-Deploys für dieses Projekt ausschalten, falls sie an sind.
- **Supabase kostet keine Netlify-Credits**: SQL, Edge Functions (Bestell-Bot) und Speicher können jederzeit geändert werden.
  Nur die Website-Dateien (Bestellseite, Impressum, Datenschutz, Bilder, Schriften) gehen über Netlify.
- Wenn die Credits knapp werden: Jasmin Bescheid sagen, bevor deployt wird.

## 2. Fragenkatalog an Daniel

`fragen-an-daniel.md` ist der aktuelle Stand (D1 bis D33 und N1 bis N5). Es gibt nur diesen einen Katalog.
- 28 Fragen sind offen.
- 10 sind durch eure Aufträge entschieden und als `[x]` markiert (Daniel bestätigt sie nur noch).
- Jasmin geht die Fragen mit Daniel über ein Abhak-Formular durch. Die Antworten trägt der zweite Claude danach in die Datei ein
  und gibt sie dir zurück. Bis dahin: nichts auf Vermutungen umbauen, was dort als Frage steht.

Wichtig für den Bestell-Bot sind vor allem D31 bis D33 und N1 bis N3 (Raten, Anzahlung, Nicht-EU-Zusatz).

## 3. Stand der letzten Lieferung

`lieferland-emguarde` (Bestellseite, Bot, SQL) hast du bekommen. Noch nichts davon ist live, solange du es nicht eingebaut hast.
Beim Einbau bitte an Punkt 1 denken: Website-Dateien **in einem Deploy** hochladen.

# Erklärvideo Kangen-Wassermaschine (5:54): Stand 05.11.2026

## Fertig
- Text von Jasmin bestätigt (04.11.): `sprechtext.txt`, 33 Abschnitte
- 33 Helmut-Aufnahmen (ElevenLabs, OwYx4Jd2f6DQax9m8SVa): `aufnahmen/`, per Whisper gegen den Text geprüft
- 29.mp3 am 05.11. ersetzt: Variante g ("Beta Isodóna" geschrieben), damit Betaisodona richtig betont wird (be-ta-i-so-DO-na)
- `ergebnis.zip` mit:
  - `tonspur-helmut.m4a`: neue Tonspur (5:55, AAC, -16 LUFS). Helmut mit Tempo pro Abschnitt (0,95–1,12, damit er so lange spricht wie das Original; 1,3225 ließ ~2 min Stille, Jasmin 05.11.: "creepy"), in Satzteilen dort angelegt,
    wo der Original-Sprecher dieselben Wörter sagt. Bei 2:33–2:41 das originale Wassergeräusch, die letzten ~7 s still.
  - `erklaervideo-vorschau-helmut.mp4`: kleine Vorschau mit neuem Ton, nur zum Anschauen
  - `sprechtext.txt`, `untertitel.vtt`
  - `ton-einsetzen.txt`: Befehl, mit dem Jasmins Mac-Claude die Tonspur ins große Original setzt (Bild wird nur kopiert)

## Offen
- Jasmin schaut die Vorschau an. Danach setzt ihr Mac-Claude die Tonspur ins Original (`ton-einsetzen.txt`).

## Neu bauen
1. `python3 erklaervideo-bauen.py ton.m4a vorschau.mp4` (beide aus `an-zweiter-claude-erklaervideo.zip` auf main)
2. Nur wenn Aufnahmen oder Tempo geändert wurden: zuerst `python3 woerter-messen.py <whisper-modell>`
   (misst `helmut-woerter.json` neu), danach Schritt 1 noch einmal.

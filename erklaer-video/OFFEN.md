# Offenes To-do: Erklärvideo Kangen-Wassermaschine (5:54), Stand 03.11.2026 abends

Hier geht es am 04.11. weiter. Jasmin hat Feierabend gemacht, bevor sie den Text freigegeben hat.

## Erledigt
- Tonspur und Vorschau sind da: `an-zweiter-claude-erklaervideo.zip` auf `main` (ton.m4a 5:50, vorschau.mp4 5:55).
  Die letzten 5 Sekunden im Bild sind ohne Ton, so gewollt.
- Abgeschrieben (Whisper small) und in 33 Abschnitte mit Startzeiten geteilt: `sprechtext.txt` (ENTWURF).
- Prüfliste für Jasmin: `text-pruefen.md` (unten die unsicheren Stellen).
- Video geprüft: keine Musik unter der Stimme. Bei 2:34–2:41 nur Wassergeräusch, das bleibt original.
  Keine fremden Logos, Webadressen oder fremden Abspann gefunden, nichts wird entfernt.

## Nächste Schritte
1. **Jasmin bestätigt den Text**, vor allem die unsicheren Stellen in `text-pruefen.md`
   (OEM, Calciumsulfit/Sedimentfilter, Doppelsystem, Hormone, Basizität, ORP, zellverfügbar,
   Clustering oder Cluster, „Siehst du“, Betaisodona, „wir geben ein paar Tropfen rein“).
   Korrekturen in `sprechtext.txt` eintragen und die Zeile „ENTWURF“ entfernen.
2. **Prompt für den ElevenLabs-Claude** schreiben, nach dem Muster vom Sportvideo: Helmut, Voice-ID OwYx4Jd2f6DQax9m8SVa,
   eleven_multilingual_v2, Tempo nicht ändern, Dateien 01.mp3 … 33.mp3, Abgabe als ZIP auf GitHub.
3. **Bauen**, wenn die Aufnahmen da sind: `sport-video/sport-video-bauen.py` als Vorlage nehmen
   (Grundtempo 1,3225, jeder Satz startet an seiner Originalstelle, Lautheit -16 LUFS). Dabei anpassen:
   - Hier gibt es nur die Tonspur, nicht das große Video. Ergebnis ist deshalb eine **neue Tonspur**
     (`tonspur-helmut.m4a`, 5:55 lang, die letzten 5 s still) plus `.txt` und `.vtt`.
   - Das Wassergeräusch bei ca. 153,5–161,0 s aus `ton.m4a` in die neue Tonspur übernehmen.
   - Dazu ein fertiger Befehl für Jasmins Mac-Claude, der die Tonspur ins Originalvideo setzt, ohne das Bild neu umzuwandeln:
     `ffmpeg -i ORIGINAL.mp4 -i tonspur-helmut.m4a -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -movflags +faststart erklaervideo-helmut.mp4`
   - Zum Prüfen hier: Vorschau + neue Tonspur zusammensetzen und anschauen.
4. Ergebnis als ZIP an Jasmin.

#!/usr/bin/env python3
"""Wortzeiten der Helmut-Aufnahmen messen (Whisper), damit erklaervideo-bauen.py die Satzteile
an die Stellen legen kann, an denen der Original-Sprecher sie sagt.

Läuft NACH einem ersten Bau (braucht _bau/roh-NN.wav: Aufnahmen ohne Ruhe am Rand, noch NICHT beschleunigt).
Die Zeiten gelten also für Tempo 1 und werden beim Bau aufs jeweilige Tempo umgerechnet.
Ergebnis: helmut-woerter.json  {"01": [[start, ende, "wort"], ...], ...}
Die Wortzeiten des Originals stehen in original-woerter.json (einmal aus ton.m4a gemessen, 03.11.2026).

Aufruf: python3 woerter-messen.py pfad/zum/whisper-modell   (faster-whisper, z. B. "small")
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ORDNER = Path(__file__).resolve().parent
modell = WhisperModel(sys.argv[1] if len(sys.argv) > 1 else "small", device="cpu", compute_type="int8")
ergebnis = {}
for datei in sorted((ORDNER / "_bau").glob("roh-*.wav")):
    nr = datei.stem.split("-")[1]
    tmp = ORDNER / "_bau" / f"16k-{nr}.wav"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(datei), "-ac", "1", "-ar", "16000", str(tmp)], check=True)
    with wave.open(str(tmp)) as w:
        ton = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    segmente, _ = modell.transcribe(ton, language="de", word_timestamps=True, beam_size=5)
    ergebnis[nr] = [[round(x.start, 3), round(x.end, 3), x.word.strip()] for s in segmente for x in s.words]
    print(nr, len(ergebnis[nr]), "Wörter", flush=True)
(ORDNER / "helmut-woerter.json").write_text(json.dumps(ergebnis, ensure_ascii=False, indent=0), encoding="utf-8")

#!/usr/bin/env python3
"""Sportvideo "Wie profitieren Sportler davon" mit der Stimme Helmut neu vertonen (03.11.2026).

Bild bleibt unverändert (Videospur wird nur kopiert, nicht neu umgewandelt).
Die Originalstimme wird komplett durch Helmut (ElevenLabs, "Helmut - Natural & Engaging") ersetzt.
Unter der Originalstimme liegt keine Musik, nur Raumrauschen, deshalb ist ein reiner Tausch sauber.

Eingaben (alle in diesem Ordner):
  sprechtext.txt         Nr | Startsekunde im Original | Text
  aufnahmen/01.mp3 ...   eine ElevenLabs-Aufnahme pro Nummer (mp3/wav/m4a gehen alle)
    ODER aufnahmen/alles.mp3   eine einzige Aufnahme des ganzen Textes; wird dann per Whisper
                               an den Satzanfängen geschnitten (WHISPER_MODELL=Pfad oder "small")
Ausgabe: ergebnis/ und ergebnis.zip mit
  sportler-kangen-wasser-helmut.mp4, sprechtext.txt, untertitel.vtt

Tempo: Helmut spricht sehr langsam. Grundtempo wie beim Shop-Video atempo=1.3225 (zweimal 15 %).
Passt ein Satz dann noch nicht bis zum nächsten Satzanfang, wird nur dieser Satz weiter
beschleunigt, höchstens bis MAX_TEMPO. Reicht auch das nicht, rutscht der nächste Satz nach hinten.

Aufruf: python3 sport-video-bauen.py [pfad/zum/original.mp4]
"""
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ORDNER = Path(__file__).resolve().parent
ORIGINAL = Path(sys.argv[1]) if len(sys.argv) > 1 else ORDNER.parent / "gtrssgx.mp4"
AUFNAHMEN = ORDNER / "aufnahmen"
ARBEIT = ORDNER / "_bau"
ERGEBNIS = ORDNER / "ergebnis"
NAME = "sportler-kangen-wasser-helmut"
STIMME = "OwYx4Jd2f6DQax9m8SVa"  # "Helmut - Natural & Engaging", Link von Jasmin 03.11.2026

GRUND_TEMPO = 1.3225   # wie Shop-Video, Jasmin 02.11.2026: "sonst viel zu lahm"
MAX_TEMPO = 1.55       # schneller klingt gehetzt
LUECKE = 0.25          # mindestens so viel Ruhe zwischen zwei Sätzen
RATE = 44100


def ff(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *map(str, args)], check=True)


def dauer(datei):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(datei)],
                         capture_output=True, text=True, check=True).stdout
    return float(out)


def sprechtext():
    abschnitte = []
    for zeile in (ORDNER / "sprechtext.txt").read_text(encoding="utf-8").splitlines():
        if not zeile.strip() or zeile.startswith("#"):
            continue
        nr, ab, text = (t.strip() for t in zeile.split("|", 2))
        abschnitte.append({"nr": nr, "ab": float(ab), "text": text})
    return abschnitte


def aufnahme_finden(nr):
    for endung in ("mp3", "wav", "m4a", "aac", "ogg", "flac"):
        for name in (nr, str(int(nr))):
            p = AUFNAHMEN / f"{name}.{endung}"
            if p.exists():
                return p
    return None


def aufnahmen_erzeugen(abschnitte):
    """Fehlende Aufnahmen direkt bei ElevenLabs erzeugen (Schlüssel nur aus der Umgebung, nie in Dateien)."""
    import urllib.request

    AUFNAHMEN.mkdir(exist_ok=True)
    for a in abschnitte:
        if aufnahme_finden(a["nr"]):
            continue
        anfrage = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{STIMME}?output_format=mp3_44100_128",
            data=json.dumps({"text": a["text"], "model_id": "eleven_multilingual_v2"}).encode(),
            headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
        with urllib.request.urlopen(anfrage, timeout=120) as antwort:
            (AUFNAHMEN / f"{a['nr']}.mp3").write_bytes(antwort.read())
        print(f"Aufnahme {a['nr']} erzeugt")


def wort(w):
    return re.sub(r"[^a-zäöüß0-9]", "", w.lower())


def gesamtaufnahme_schneiden(datei, abschnitte):
    """Eine einzige Aufnahme an den Satzanfängen der Abschnitte zerschneiden (per Whisper-Wortzeiten)."""
    import os
    import wave

    import numpy as np
    from faster_whisper import WhisperModel

    wav = ARBEIT / "alles.wav"
    ff("-i", datei, "-ac", 1, "-ar", 16000, wav)
    with wave.open(str(wav)) as w:
        ton = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    modell = WhisperModel(os.environ.get("WHISPER_MODELL", "small"), device="cpu", compute_type="int8")
    segmente, _ = modell.transcribe(ton, language="de", word_timestamps=True)
    woerter = [(w.start, w.end, wort(w.word)) for s in segmente for w in s.words]

    schnitte, pos = [0.0], 0
    for a in abschnitte[1:]:
        erste = [wort(x) for x in a["text"].split()[:3]]
        treffer = None
        for i in range(pos + 1, len(woerter) - 2):
            if [woerter[i + k][2] for k in range(3)] == erste:
                treffer = i
                break
        if treffer is None:  # zur Not nur die ersten zwei Wörter
            for i in range(pos + 1, len(woerter) - 1):
                if [woerter[i + k][2] for k in range(2)] == erste[:2]:
                    treffer = i
                    break
        if treffer is None:
            sys.exit(f"Abschnitt {a['nr']} nicht in der Gesamtaufnahme gefunden. Bitte einzelne Dateien 01..12 liefern.")
        schnitte.append((woerter[treffer - 1][1] + woerter[treffer][0]) / 2)
        pos = treffer
    schnitte.append(dauer(datei))
    teile = []
    for a, von, bis in zip(abschnitte, schnitte, schnitte[1:]):
        ziel = ARBEIT / f"roh-{a['nr']}.wav"
        ff("-i", datei, "-ss", f"{von:.3f}", "-to", f"{bis:.3f}", "-ac", 1, "-ar", RATE, ziel)
        teile.append(ziel)
    return teile


def stille_weg(quelle, ziel):
    # Ruhe am Anfang und Ende jeder Aufnahme abschneiden, damit der Satz genau am Bild sitzt
    weg = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03"
    ff("-i", quelle, "-af", f"{weg},areverse,{weg},areverse", "-ac", 1, "-ar", RATE, ziel)


def untertitel(abschnitte):
    """Jeder Abschnitt wird an Satz- und Kommagrenzen in Stücke bis ~80 Zeichen geteilt,
    die Zeit verteilt sich nach Zeichenzahl."""
    def zeit(s):
        h, s = divmod(s, 3600)
        m, s = divmod(s, 60)
        return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"

    def stuecke(text):
        teile = re.split(r"(?<=[.?!:,])\s+", text)
        out, aktuell = [], ""
        for t in teile:
            if aktuell and len(aktuell) + 1 + len(t) > 80:
                out.append(aktuell)
                aktuell = t
            else:
                aktuell = f"{aktuell} {t}".strip()
        return out + [aktuell] if aktuell else out

    zeilen = ["WEBVTT", ""]
    n = 1
    for a in abschnitte:
        teile = stuecke(a["text"])
        gesamt = sum(len(t) for t in teile)
        t = a["start"]
        for teil in teile:
            ende = t + (a["ende"] - a["start"]) * len(teil) / gesamt
            zeilen += [str(n), f"{zeit(t)} --> {zeit(ende)}", teil, ""]
            t, n = ende, n + 1
    return "\n".join(zeilen)


def main():
    if not ORIGINAL.exists():
        sys.exit(f"Originalvideo fehlt: {ORIGINAL}")
    abschnitte = sprechtext()
    if ARBEIT.exists():
        shutil.rmtree(ARBEIT)
    ARBEIT.mkdir()

    einzeln = [aufnahme_finden(a["nr"]) for a in abschnitte]
    if not all(einzeln) and os.environ.get("ELEVENLABS_API_KEY"):
        aufnahmen_erzeugen(abschnitte)
        einzeln = [aufnahme_finden(a["nr"]) for a in abschnitte]
    if all(einzeln):
        roh = einzeln
    else:
        ganz = next((p for p in sorted(AUFNAHMEN.glob("alles.*"))), None)
        if not ganz:
            fehlt = [a["nr"] for a, p in zip(abschnitte, einzeln) if not p]
            sys.exit(f"Aufnahmen fehlen in {AUFNAHMEN}: {', '.join(fehlt)} (oder eine Gesamtaufnahme alles.mp3)")
        roh = gesamtaufnahme_schneiden(ganz, abschnitte)

    video_dauer = dauer(ORIGINAL)
    for a, quelle in zip(abschnitte, roh):
        a["roh"] = ARBEIT / f"satz-{a['nr']}.wav"
        stille_weg(quelle, a["roh"])
        a["laenge_roh"] = dauer(a["roh"])

    # Zeitplan: jeder Satz startet an seiner Originalstelle (oder nach dem vorigen, falls der überläuft)
    frei_ab, bericht = 0.0, []
    for i, a in enumerate(abschnitte):
        a["start"] = max(a["ab"], frei_ab)
        naechster = abschnitte[i + 1]["ab"] if i + 1 < len(abschnitte) else video_dauer - 0.3
        platz = naechster - a["start"] - LUECKE
        tempo = min(max(GRUND_TEMPO, a["laenge_roh"] / platz if platz > 0 else MAX_TEMPO), MAX_TEMPO)
        a["tempo"] = tempo
        a["datei"] = ARBEIT / f"fertig-{a['nr']}.wav"
        ff("-i", a["roh"], "-af", f"atempo={tempo:.4f}", a["datei"])
        a["ende"] = a["start"] + dauer(a["datei"])
        frei_ab = a["ende"] + LUECKE
        verschoben = a["start"] - a["ab"]
        bericht.append(f"{a['nr']}: ab {a['start']:6.2f} s bis {a['ende']:6.2f} s, Tempo {tempo:.3f}"
                       + (f", {verschoben:.2f} s später als im Original" if verschoben > 0.05 else ""))
    if abschnitte[-1]["ende"] > video_dauer:
        print(f"ACHTUNG: Stimme endet bei {abschnitte[-1]['ende']:.2f} s, Video nur {video_dauer:.2f} s lang.")

    # Alle Sätze an ihre Stellen legen, auf Videolänge auffüllen, Lautheit angleichen
    eingaben, filter_teile = [], []
    for k, a in enumerate(abschnitte):
        eingaben += ["-i", a["datei"]]
        ms = int(round(a["start"] * 1000))
        filter_teile.append(f"[{k}]adelay={ms}:all=1[a{k}]")
    mix = "".join(f"[a{k}]" for k in range(len(abschnitte)))
    filter_teile.append(f"{mix}amix=inputs={len(abschnitte)}:normalize=0,apad,atrim=0:{video_dauer:.3f},"
                        f"loudnorm=I=-16:TP=-1.5:LRA=11,aresample={RATE}[out]")
    tonspur = ARBEIT / "tonspur-helmut.wav"
    ff(*eingaben, "-filter_complex", ";".join(filter_teile), "-map", "[out]", "-ac", 1, "-ar", RATE, tonspur)

    if ERGEBNIS.exists():
        shutil.rmtree(ERGEBNIS)
    ERGEBNIS.mkdir()
    video = ERGEBNIS / f"{NAME}.mp4"
    # Bild 1:1 übernehmen (H.264 aus dem Original), nur die Tonspur wird ersetzt
    ff("-i", ORIGINAL, "-i", tonspur, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
       "-c:a", "aac", "-b:a", "160k", "-ac", 2, "-t", f"{video_dauer:.3f}", "-movflags", "+faststart", video)

    (ERGEBNIS / "sprechtext.txt").write_text(
        "\n\n".join(a["text"] for a in abschnitte) + "\n", encoding="utf-8")
    (ERGEBNIS / "untertitel.vtt").write_text(untertitel(abschnitte) + "\n", encoding="utf-8")
    (ARBEIT / "zeitplan.json").write_text(json.dumps(
        [{k: a[k] for k in ("nr", "ab", "start", "ende", "tempo")} for a in abschnitte], indent=1), encoding="utf-8")

    zip_datei = ORDNER / "ergebnis.zip"
    zip_datei.unlink(missing_ok=True)
    shutil.make_archive(str(zip_datei.with_suffix("")), "zip", ORDNER, "ergebnis")
    print("\n".join(bericht))
    print(f"{video} ({dauer(video):.1f} s) und {zip_datei}")


if __name__ == "__main__":
    main()

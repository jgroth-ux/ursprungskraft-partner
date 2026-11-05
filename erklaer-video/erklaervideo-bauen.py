#!/usr/bin/env python3
"""Erklärvideo Kangen-Wassermaschine (5:54) mit der Stimme Helmut neu vertonen (05.11.2026).

Das Originalvideo ist zu groß für den Upload. Deshalb baut dieses Skript eine NEUE TONSPUR,
die Jasmins Mac-Claude danach ohne Neuumwandlung des Bildes ins Original setzt (Befehl siehe unten).

Eingaben:
  sprechtext.txt          Nr | Startsekunde im Originalton | Text (von Jasmin bestätigt 04.11.2026)
  aufnahmen/01.mp3 … 33.mp3   ElevenLabs, "Helmut - Natural & Engaging" (OwYx4Jd2f6DQax9m8SVa), unbeschleunigt
  ton.m4a                 Originalton (aus an-zweiter-claude-erklaervideo.zip), nur für das Wassergeräusch
  vorschau.mp4            kleines Vorschauvideo (aus derselben ZIP), gibt die Videolänge vor
Ausgabe: ergebnis/ und ergebnis.zip mit
  tonspur-helmut.m4a, erklaervideo-vorschau-helmut.mp4 (zum Anschauen), sprechtext.txt, untertitel.vtt,
  ton-einsetzen.txt (Befehl für den Mac)

Unter der Originalstimme liegt keine Musik. Bei 2:33–2:41 (Wasserhahn mit Feuerzeug) wird nicht gesprochen.
Dort bleibt das originale Wassergeräusch. Die letzten ~5 s (Bild "Welches Wasser trinkst DU?") bleiben still.

Aufruf: python3 erklaervideo-bauen.py pfad/zu/ton.m4a pfad/zu/vorschau.mp4
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path

ORDNER = Path(__file__).resolve().parent
ORIGINALTON = Path(sys.argv[1])
VORSCHAU = Path(sys.argv[2])
AUFNAHMEN = ORDNER / "aufnahmen"
ARBEIT = ORDNER / "_bau"
ERGEBNIS = ORDNER / "ergebnis"

GRUND_TEMPO = 1.3225   # höchstes normales Tempo (wie Shop- und Sportvideo)
MIN_TEMPO = 0.95       # langsamer klingt gezogen
ORIGINAL_WOERTER = __import__("json").loads((ORDNER / "original-woerter.json").read_text(encoding="utf-8"))
MAX_TEMPO = 1.55
LUECKE = 0.25
RATE = 44100
WASSER = (153.0, 161.2)  # Sekunden mit originalem Wassergeräusch, ohne Sprache
BLENDE = 0.3


def ff(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *map(str, args)], check=True)


def dauer(datei):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                 str(datei)], capture_output=True, text=True, check=True).stdout)


def sprechtext():
    out = []
    for zeile in (ORDNER / "sprechtext.txt").read_text(encoding="utf-8").splitlines():
        if zeile.strip() and not zeile.startswith("#"):
            nr, ab, text = (t.strip() for t in zeile.split("|", 2))
            out.append({"nr": nr, "ab": float(ab), "text": text})
    return out


def zeit(s):
    h, s = divmod(s, 3600)
    m, s = divmod(s, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def untertitel(abschnitte):
    def stuecke(text):
        out, aktuell = [], ""
        for t in re.split(r"(?<=[.?!:,])\s+", text):
            if aktuell and len(aktuell) + 1 + len(t) > 80:
                out.append(aktuell)
                aktuell = t
            else:
                aktuell = f"{aktuell} {t}".strip()
        return out + [aktuell] if aktuell else out

    # Satzteile zu Untertiteln bis ~80 Zeichen zusammenfassen, zu lange anteilig teilen
    bloecke = []
    for a in abschnitte:
        aktuell = None
        for von, bis, text in a["stuecke"]:
            if aktuell and len(aktuell[2]) + 1 + len(text) <= 80 and von - aktuell[1] < 1.0:
                aktuell = (aktuell[0], bis, f"{aktuell[2]} {text}")
            else:
                if aktuell:
                    bloecke.append(aktuell)
                aktuell = (von, bis, text)
        bloecke.append(aktuell)

    zeilen, n = ["WEBVTT", ""], 1
    for von, bis, text in bloecke:
        teile = stuecke(text)
        gesamt = sum(len(t) for t in teile)
        t = von
        for teil in teile:
            ende = t + (bis - von) * len(teil) / gesamt
            zeilen += [str(n), f"{zeit(t)} --> {zeit(ende)}", teil, ""]
            t, n = ende, n + 1
    return "\n".join(zeilen)


def norm(w):
    return re.sub(r"[^a-zäöüß0-9]", "", w.lower())


def satzteile_anlegen(abschnitte):
    """Helmut spricht schneller als der Original-Sprecher. Statt jeden Abschnitt am Stück abzuspielen
    (lange Stille danach, Einblendungen laufen dem Ton hinterher), wird jede Aufnahme an ihren
    Sprechpausen in Satzteile geschnitten. Jeder Satzteil startet dort, wo der Original-Sprecher
    dieselben Wörter sagt (Wortzeiten: original-woerter.json, helmut-woerter.json).
    Ohne helmut-woerter.json: ein Stück pro Abschnitt."""
    hw_datei = ORDNER / "helmut-woerter.json"
    if not hw_datei.exists():
        for a in abschnitte:
            a["stuecke"] = [(a["start"], a["ende"], a["text"])]
        return [(a["datei"], a["start"]) for a in abschnitte]
    import difflib
    import json

    helmut = json.loads(hw_datei.read_text(encoding="utf-8"))
    original = json.loads((ORDNER / "original-woerter.json").read_text(encoding="utf-8"))
    teile, frei_ab = [], 0.0
    for i, a in enumerate(abschnitte):
        bis = abschnitte[i + 1]["ab"] if i + 1 < len(abschnitte) else 1e9
        ow = [w for w in original if a["ab"] - 0.3 <= w[0] < bis - 0.3]
        # Wortzeiten sind an den unbeschleunigten Aufnahmen gemessen, aufs Tempo umrechnen
        hw = [[w[0] / a["tempo"], w[1] / a["tempo"], w[2]] for w in helmut[a["nr"]]]
        clip_len = a["ende"] - a["start"]
        # Helmut-Wortindex -> Original-Wortindex (gleiche Wörter, sonst anteilig)
        zuordnung = {}
        sm = difflib.SequenceMatcher(None, [norm(w[2]) for w in hw], [norm(w[2]) for w in ow], autojunk=False)
        for blk in sm.get_matching_blocks():
            for k in range(blk.size):
                zuordnung[blk.a + k] = blk.b + k
        # Schnittstellen in Sprechpausen ab 0,12 s (auch kurze Kommapausen, dann verteilt sich die Stille)
        grenzen = [0] + [k for k in range(1, len(hw)) if hw[k][0] - hw[k - 1][1] >= 0.12] + [len(hw)]
        schnitte = [0.0] + [(hw[k - 1][1] + hw[k][0]) / 2 for k in grenzen[1:-1]] + [clip_len]
        textwoerter = a["text"].split()
        a["stuecke"] = []
        for s in range(len(grenzen) - 1):
            k0, k1 = grenzen[s], grenzen[s + 1]
            j = zuordnung.get(k0, round(k0 * len(ow) / max(len(hw), 1)))
            ziel = (ow[min(j, len(ow) - 1)][0] if ow else a["ab"]) - (hw[k0][0] - schnitte[s])
            start = max(ziel, frei_ab, a["ab"] - 0.2 if s == 0 else 0)
            von, laenge = schnitte[s], schnitte[s + 1] - schnitte[s]
            stueck = ARBEIT / f"stueck-{a['nr']}-{s:02d}.wav"
            ff("-ss", f"{von:.3f}", "-t", f"{laenge:.3f}", "-i", a["datei"], stueck)
            teile.append((stueck, start))
            t0 = round(k0 * len(textwoerter) / len(hw))
            t1 = round(k1 * len(textwoerter) / len(hw))
            sprech_von = start + (hw[k0][0] - von)
            sprech_bis = start + (hw[k1 - 1][1] - von)
            a["stuecke"].append((sprech_von, sprech_bis, " ".join(textwoerter[t0:t1])))
            frei_ab = start + laenge + 0.05
        a["start"], a["ende"] = a["stuecke"][0][0], a["stuecke"][-1][1]
    return teile


def main():
    abschnitte = sprechtext()
    if ARBEIT.exists():
        shutil.rmtree(ARBEIT)
    ARBEIT.mkdir()
    video_dauer = dauer(VORSCHAU)
    weg = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03"

    frei_ab, bericht = 0.0, []
    for i, a in enumerate(abschnitte):
        quelle = AUFNAHMEN / f"{a['nr']}.mp3"
        roh = ARBEIT / f"roh-{a['nr']}.wav"
        ff("-i", quelle, "-af", f"{weg},areverse,{weg},areverse", "-ac", 1, "-ar", RATE, roh)
        a["start"] = max(a["ab"], frei_ab)
        naechster = abschnitte[i + 1]["ab"] if i + 1 < len(abschnitte) else video_dauer - 5.5
        platz = naechster - a["start"] - LUECKE
        # Tempo pro Abschnitt: Helmut soll ungefähr so lange sprechen wie der Original-Sprecher an dieser Stelle
        # (Jasmin 05.11.: die langen Pausen mit dem Tempo 1,3225 wirkten "creepy"). Grenzen MIN_TEMPO … GRUND_TEMPO.
        ow = [w for w in ORIGINAL_WOERTER if a["ab"] - 0.3 <= w[0] < naechster - 0.3]
        sprechzeit = (ow[-1][1] - ow[0][0]) if ow else platz
        a["tempo"] = min(max(MIN_TEMPO, dauer(roh) / sprechzeit), GRUND_TEMPO)
        if platz > 0 and dauer(roh) / a["tempo"] > platz:  # passt nicht bis zum nächsten Abschnitt
            a["tempo"] = min(dauer(roh) / platz, MAX_TEMPO)
        a["datei"] = ARBEIT / f"fertig-{a['nr']}.wav"
        ff("-i", roh, "-af", f"atempo={a['tempo']:.4f}", a["datei"])
        a["ende"] = a["start"] + dauer(a["datei"])
        frei_ab = a["ende"] + LUECKE
        spaeter = a["start"] - a["ab"]
        bericht.append(f"{a['nr']}: {a['start']:6.1f}–{a['ende']:6.1f} s, Tempo {a['tempo']:.3f}"
                       + (f", {spaeter:.1f} s später als im Original" if spaeter > 0.05 else ""))

    # Wassergeräusch aus dem Originalton mit kurzen Blenden
    von, bis = WASSER
    wasser = ARBEIT / "wasser.wav"
    ff("-ss", von, "-to", bis, "-i", ORIGINALTON, "-af",
       f"afade=t=in:d={BLENDE},afade=t=out:st={bis - von - BLENDE}:d={BLENDE}", "-ac", 1, "-ar", RATE, wasser)

    teile = satzteile_anlegen(abschnitte) + [(wasser, von)]
    eingaben, filter_teile = [], []
    for k, (datei, start) in enumerate(teile):
        eingaben += ["-i", datei]
        filter_teile.append(f"[{k}]adelay={int(round(start * 1000))}:all=1[a{k}]")
    mix = "".join(f"[a{k}]" for k in range(len(teile)))
    filter_teile.append(f"{mix}amix=inputs={len(teile)}:normalize=0,apad,atrim=0:{video_dauer:.3f},"
                        f"loudnorm=I=-16:TP=-1.5:LRA=11,aresample={RATE}[out]")

    if ERGEBNIS.exists():
        shutil.rmtree(ERGEBNIS)
    ERGEBNIS.mkdir()
    tonspur = ERGEBNIS / "tonspur-helmut.m4a"
    ff(*eingaben, "-filter_complex", ";".join(filter_teile), "-map", "[out]", "-ac", 2, "-ar", RATE,
       "-c:a", "aac", "-b:a", "160k", "-t", f"{video_dauer:.3f}", "-movflags", "+faststart", tonspur)
    ff("-i", VORSCHAU, "-i", tonspur, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "copy",
       "-movflags", "+faststart", ERGEBNIS / "erklaervideo-vorschau-helmut.mp4")

    (ERGEBNIS / "sprechtext.txt").write_text("\n\n".join(a["text"] for a in abschnitte) + "\n", encoding="utf-8")
    (ERGEBNIS / "untertitel.vtt").write_text(untertitel(abschnitte) + "\n", encoding="utf-8")
    (ERGEBNIS / "ton-einsetzen.txt").write_text(
        "Neue Tonspur ins Original-Erklärvideo (5:54) setzen. Das Bild wird nur kopiert, nicht neu umgewandelt.\n"
        "Im Ordner mit dem Originalvideo und tonspur-helmut.m4a ausführen (ORIGINAL.mp4 durch den echten Namen ersetzen):\n\n"
        "ffmpeg -i ORIGINAL.mp4 -i tonspur-helmut.m4a -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy "
        "-shortest -movflags +faststart erklaervideo-kangen-helmut.mp4\n\n"
        "Ist das Original kein H.264 (z. B. HEVC vom iPhone), statt '-c:v copy' das hier nehmen:\n"
        "-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p\n", encoding="utf-8")

    zip_datei = ORDNER / "ergebnis.zip"
    zip_datei.unlink(missing_ok=True)
    shutil.make_archive(str(zip_datei.with_suffix("")), "zip", ORDNER, "ergebnis")
    print("\n".join(bericht))
    print(f"Tonspur {dauer(tonspur):.1f} s, Video {video_dauer:.1f} s, letzter Satz endet {abschnitte[-1]['ende']:.1f} s")


if __name__ == "__main__":
    main()

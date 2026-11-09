# Blaue Alternative der Wasser-Check-Seite (11.10.2026).
# Die olive Fassung (index.html + hochwertig.css) bleibt das Original. Dieses Skript tauscht
# nur die Farben und schreibt blau.html + hochwertig-blau.css daneben. Nach jeder Änderung
# am Original einfach neu laufen lassen: python3 blau-bauen.py
import re, pathlib

hier = pathlib.Path(__file__).parent

FARBEN = {
    '#5E6140': '#2F5A73',  # dunkle Flächen
    '#4F5A35': '#24506B',  # Knöpfe, Akzent
    '#414A2C': '#2A4D63',
    '#3A412C': '#264559',  # Video-Platzhalter
    '#72764F': '#46718A',  # Linie Fußzeile
    '#2A2C22': '#1E2A33',  # Schrift
    '#5F6152': '#566570',  # leise Schrift
    '#A8996A': '#7FA3B8',  # Khaki -> Taubenblau
    '#CFC4A0': '#BFD6E2',
    '#D9CFBA': '#D2DEE5',  # Linien
    '#EAE3D3': '#E2ECF1',  # Sand
    '#F5F1E8': '#F2F6F8',  # Grund
    '#FBF9F4': '#FAFCFD',  # Fläche
}
RGBA = {
    '207,196,160': '191,214,226',
    '168,153,106': '127,163,184',
    '245,241,232': '242,246,248',
    '251,249,244': '250,252,253',
    '42,44,34': '30,42,51',
    '47,53,36': '30,50,64',
    '79,90,53': '36,80,107',
    '30,34,22': '20,34,44',
    '20,22,15': '14,28,38',
}

def faerben(text):
    for alt, neu in FARBEN.items():
        text = re.sub(re.escape(alt), neu, text, flags=re.I)
    for alt, neu in RGBA.items():
        text = text.replace(f'rgba({alt},', f'rgba({neu},')
    return text

css = faerben((hier / 'hochwertig.css').read_text(encoding='utf-8'))
(hier / 'hochwertig-blau.css').write_text(css, encoding='utf-8')

seite = faerben((hier / 'index.html').read_text(encoding='utf-8'))
alt = re.search(r'hochwertig\.css\?v=[0-9a-z]+', seite)
assert alt, 'Verweis auf hochwertig.css nicht gefunden'
seite = seite.replace(alt.group(0), alt.group(0).replace('hochwertig.css', 'hochwertig-blau.css'))
(hier / 'blau.html').write_text(seite, encoding='utf-8')
print('blau.html und hochwertig-blau.css geschrieben')

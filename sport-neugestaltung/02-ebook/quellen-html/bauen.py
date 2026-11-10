"""Baut ebook-kevin.html und ebook-johny.html aus vorlage.html.
Aufruf im Ordner quellen-html:  python3 bauen.py"""
import pathlib
import re
HIER = pathlib.Path(__file__).parent

GEMEINSAM_VORWORT_ENDE = (
    '<p>In diesem E-Book zeige ich dir, was ich über Wasser gelernt habe: wie viel du wirklich '
    'trinken solltest, was in Flasche und Leitung steckt, was die fünf Wasserarten für Training, '
    'Küche und Sporttasche können und warum auch die Stärksten der Welt umgestiegen sind.</p>\n'
    '    <p>Lies es in Ruhe. Am Ende kannst du das Gerät selbst kennenlernen.</p>')

SPORTLER = {
    'kevin': dict(
        name='Kevin Wolter', rolle='Bodybuilder', rolle_lang='Bodybuilder · 216.000 Follower auf Instagram · 617.000 Abonnenten auf YouTube',
        foto='kevin.jpg', foto_pos='50% 10%', foto_pos_titel='50% 25%', foto_pos_schluss='50% 22%',
        link='https://mein.ursprungskraft.net/partner/kevin/', link_kurz='mein.ursprungskraft.net/partner/kevin',
        vorwort_titel='Du trainierst hart. Trinkst du auch gut?',
        vorwort=(
            '<p class="lead">Eiweiß, Schlaf, Trainingsplan: bei mir war immer alles durchdacht. Nur beim '
            'Wasser habe ich nie hingeschaut. Drei, vier Liter am Tag aus der Plastikflasche. Das habe ich geändert.</p>\n'
            '    <p>Heute kommt mein Wasser frisch aus dem Hahn, so viel ich will. Keine Kisten mehr, kein Schleppen, kein Plastik.</p>\n    '
            + GEMEINSAM_VORWORT_ENDE),
        schluss_text='Trag dich auf meiner Seite ein, wenn du ernsthaft überlegst, dir ein eigenes Kangen-Gerät zu holen.',
    ),
    'johny': dict(
        name='Johny Yusupov', rolle='MMA-Fighter', rolle_lang='MMA-Fighter · 83.100 Follower auf Instagram · 33.900 Abonnenten auf YouTube',
        foto='johny.jpg', foto_pos='50% 12%', foto_pos_titel='50% 10%', foto_pos_schluss='50% 2%',
        link='https://mein.ursprungskraft.net/partner/johny/', link_kurz='mein.ursprungskraft.net/partner/johny',
        vorwort_titel='Du kämpfst hart. Trinkst du auch gut?',
        vorwort=(
            '<p class="lead">Training, Ernährung, Schlaf: im Fight-Camp ist bei mir alles durchgeplant. Nur beim '
            'Wasser habe ich nie hingeschaut. Drei, vier Liter am Tag aus der Plastikflasche. Das habe ich geändert.</p>\n'
            '    <p>Heute kommt mein Wasser frisch aus dem Hahn, so viel ich will. Keine Kisten mehr, kein Schleppen, kein Plastik.</p>\n    '
            + GEMEINSAM_VORWORT_ENDE),
        schluss_text='Trag dich auf meiner Seite ein, wenn du ernsthaft überlegst, dir ein eigenes Kangen-Gerät zu holen.',
    ),
}

def ph_pos(ph):  # Position auf der Skala 0 bis 14 in Prozent
    return f'{(ph + 0.5) / 15 * 100:.2f}'

# Klassische pH-Indikatorfarben von 0 (rot) über 7 (grün) bis 14 (violett), 15 Felder
PH_FARBEN = ['#E2231A', '#EE3B24', '#F26C21', '#F7941D', '#FDB813', '#FFE200', '#D5E021',
             '#8DC63F', '#39B54A', '#00A99D', '#0089CF', '#2E5BA8', '#5B3D96', '#6B2C91', '#4B1E6E']

def ph_farbe(ph):
    return PH_FARBEN[min(14, int(ph))]

def schrift_auf(ph):  # dunkle Schrift auf hellen Farben
    return '#16303F' if 3 <= int(ph) <= 8 else '#FFFFFF'

def skala():
    return ''.join(f'<span style="background:{PH_FARBEN[i]};color:{schrift_auf(i)}">{i}</span>' for i in range(15))

def video(datei, titel):
    """Screenshot aus dem Video, verlinkt auf die Sportlerseite (Bereich Video).
    Fehlt bilder/<datei>, bleibt der Platz leer und der Text nimmt die ganze Breite."""
    if not (HIER / 'bilder' / datei).exists():
        return ''
    return (f'<a class="video" href="{{{{link}}}}#video"><img src="bilder/{datei}" alt="{titel}"></a>')


# ---------------------------------------------------------------------------
# Feinsatz: Trennregeln und feste Abstände
# Automatische Silbentrennung ist im CSS aus. Getrennt wird nur an den Wortfugen
# dieser langen Wörter (weiches Trennzeichen). Kurze Wörter werden nie getrennt.
TRENNFUGEN = [
    'Elektrolyse|verstärker', 'Gesichts|wasser', 'Glas|flasche', 'Kangen|wasser', 'Körper|gewicht',
    'Leitungs|wasser', 'Mineral|wasser', 'Minus|bereich', 'Monats|raten', 'Multi|spannung',
    'Muskel|kater', 'Osmose|anlage', 'Plastik|flasche', 'Plastik|müll', 'Ratenzahlungs|system',
    'Schneide|brettern', 'Schönheits|wasser', 'Sechser|träger', 'Sport|tasche', 'Sport|wäsche',
    'Sprüh|flasche', 'Trainings|plan', 'Trainings|tagen', 'Trink|wasser', 'Wasch|mittel',
    'Wasser|arten', 'Wasserstoff|reich', 'Wasser|stoff', 'Weich|spüler', 'Zusatz|flüssigkeit',
    'Baby|nahrung', 'Kontakt|daten', 'entzündungs|hemmend', 'Hülsen|früchte',
    'Mikro|meter', 'Grund|menge', 'Schmutz|wasser',
]
# Nach diesen kurzen Wörtern kommt kein Zeilenumbruch, sie wandern mit dem nächsten Wort.
KLEBEWOERTER = 'und oder pH'.split()

def feinsatz(html):
    teile = re.split(r'(<[^>]+>)', html)
    im_stil = False
    for i, t in enumerate(teile):
        if t.startswith('<'):
            if t.startswith('<style') or t.startswith('<script') or t.startswith('<title'):
                im_stil = True
            elif t.startswith('</style') or t.startswith('</script') or t.startswith('</title'):
                im_stil = False
            continue
        if im_stil or not t.strip():
            continue
        for fuge in TRENNFUGEN:
            vorne, hinten = fuge.split('|')
            t = re.sub(vorne + '(?=' + hinten + ')', vorne + '\u00ad', t)
        # Bindestriche nicht als Umbruchstelle (Kangen-Gerät, pH-Wert, 1,5-Liter-Flaschen)
        t = re.sub(r'(?<=\w)-(?=\w)', '\u2011', t)
        # Zahl bleibt beim folgenden Wort: 146 Sechserträger, 5 Mikrometer, 90 kg
        t = re.sub(r'(\d)[ ](?=[^\s\d])', '\\1\u00a0', t)
        # kurze Wörter nicht am Zeilenende
        t = re.sub(r'(?<![\w\u00ad])(' + '|'.join(KLEBEWOERTER) + r')[ ]', '\\1\u00a0', t, flags=re.I)
        teile[i] = t
    return ''.join(teile)

def bauen():
    vorlage = (HIER / 'vorlage.html').read_text(encoding='utf-8')
    for kurz, daten in SPORTLER.items():
        werte = dict(daten, video_ronaldo=video('ronaldo-georgina.jpg', 'Video: Bei Ronaldo zu Hause'),
                     video_eddie=video('eddie-hall.jpg', 'Video: Eddie Hall zeigt sein Gerät'),
                     traeger='<i></i>' * 146, skala=skala(),
                     p25=ph_pos(2.5), p60=ph_pos(6.0), p70=ph_pos(7.0), p90=ph_pos(9.0), p115=ph_pos(11.5))
        html = vorlage
        for ph, key in ((2.5, 'p25'), (6.0, 'p60'), (7.0, 'p70'), (9.0, 'p90'), (11.5, 'p115')):
            html = html.replace('<b style="left:{{' + key + '}}%">', f'<b style="left:{{{{{key}}}}}%;background:{ph_farbe(ph)};color:{schrift_auf(ph)}">')
        for k, v in werte.items():
            html = html.replace('{{' + k + '}}', v)
        for k in ('link', 'link_kurz'):
            html = html.replace('{{' + k + '}}', daten[k])
        assert '{{' not in html, kurz
        html = feinsatz(html)
        (HIER / f'ebook-{kurz}.html').write_text(html, encoding='utf-8')
        print('gebaut:', f'ebook-{kurz}.html')

if __name__ == '__main__':
    bauen()

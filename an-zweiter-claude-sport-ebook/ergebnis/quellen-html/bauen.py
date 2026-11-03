"""Baut ebook-kevin.html und ebook-johny.html aus vorlage.html.
Aufruf im Ordner quellen-html:  python3 bauen.py"""
import pathlib
HIER = pathlib.Path(__file__).parent

GEMEINSAM_VORWORT_ENDE = (
    '<p>In diesem E-Book zeige ich dir, was ich über Wasser gelernt habe: wie viel du wirklich '
    'trinken solltest, was in Flasche und Leitung steckt, was die fünf Wasserarten für Training, '
    'Küche und Sporttasche können und warum auch die Stärksten der Welt umgestiegen sind.</p>\n'
    '    <p>Lies es in Ruhe. Am Ende kannst du das Gerät selbst kennenlernen.</p>')

SPORTLER = {
    'kevin': dict(
        name='Kevin Wolter', rolle='Bodybuilder', rolle_lang='Bodybuilder · 800.000 Follower auf Instagram · 617.000 Abonnenten auf YouTube',
        foto='kevin.jpg', foto_pos='50% 10%', foto_pos_titel='50% 25%', foto_pos_schluss='50% 22%',
        link='https://mein.ursprungskraft.net/partner/kevin/', link_kurz='mein.ursprungskraft.net/partner/kevin',
        vorwort_titel='Du trainierst hart. Trinkst du auch gut?',
        vorwort=(
            '<p class="lead">Eiweiß, Schlaf, Trainingsplan: bei mir war immer alles durchdacht. Nur beim '
            'Wasser habe ich nie hingeschaut. Drei, vier Liter am Tag aus der Plastikflasche. Das habe ich geändert.</p>\n'
            '    <p>Heute kommt mein Wasser frisch aus dem Hahn, so viel ich will. Keine Kisten mehr, kein Schleppen, kein Plastik.</p>\n    '
            + GEMEINSAM_VORWORT_ENDE),
        schluss_text='Trag dich auf meiner Seite ein, wenn du ernsthaft überlegst, dir ein eigenes Kangen-Gerät zu holen. Mein Team zeigt dir den K8 und alles, was er kann.',
    ),
    'johny': dict(
        name='Johny Yusupov', rolle='MMA-Fighter', rolle_lang='MMA-Fighter · @johny_yusupov',
        foto='johny.jpg', foto_pos='50% 12%', foto_pos_titel='50% 10%', foto_pos_schluss='50% 2%',
        link='https://mein.ursprungskraft.net/partner/johny/', link_kurz='mein.ursprungskraft.net/partner/johny',
        vorwort_titel='Du kämpfst hart. Trinkst du auch gut?',
        vorwort=(
            '<p class="lead">Training, Ernährung, Schlaf: im Fight-Camp ist bei mir alles durchgeplant. Nur beim '
            'Wasser habe ich nie hingeschaut. Drei, vier Liter am Tag aus der Plastikflasche. Das habe ich geändert.</p>\n'
            '    <p>Heute kommt mein Wasser frisch aus dem Hahn, so viel ich will. Keine Kisten mehr, kein Schleppen, kein Plastik.</p>\n    '
            + GEMEINSAM_VORWORT_ENDE),
        schluss_text='Trag dich auf meiner Seite ein, wenn du ernsthaft überlegst, dir ein eigenes Kangen-Gerät zu holen. Mein Team zeigt dir den K8 und alles, was er kann.',
    ),
}

def ph_pos(ph):  # Position auf der Skala 0 bis 14 in Prozent
    return f'{ph / 14 * 100:.2f}'

# Klassische pH-Indikatorfarben von 0 (rot) über 7 (grün) bis 14 (violett)
PH_FARBEN = ['#E2231A', '#EE3B24', '#F26C21', '#F7941D', '#FDB813', '#FFE200', '#D5E021',
             '#8DC63F', '#39B54A', '#00A99D', '#0089CF', '#2E5BA8', '#5B3D96', '#6B2C91']

def ph_farbe(ph):
    return PH_FARBEN[min(13, int(ph))]

def schrift_auf(ph):  # dunkle Schrift auf hellen Farben
    return '#16303F' if 3 <= int(ph) <= 8 else '#FFFFFF'

def skala():
    return ''.join(f'<span style="background:{PH_FARBEN[i]};color:{schrift_auf(i)}">{i}</span>' for i in range(14))

def video(datei, titel):
    """Vorschaubild mit Play-Knopf, verlinkt auf das Video auf der Sportlerseite.
    Liegt bilder/<datei> vor, wird das Foto gezeigt, sonst eine blaue Fläche."""
    bild = f'<img src="bilder/{datei}" alt="">' if (HIER / 'bilder' / datei).exists() else ''
    return (f'<a class="video" href="{{{{link}}}}#video">{bild}<span class="play"></span>'
            f'<span class="titelzeile">{titel}</span></a>')

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
        (HIER / f'ebook-{kurz}.html').write_text(html, encoding='utf-8')
        print('gebaut:', f'ebook-{kurz}.html')

if __name__ == '__main__':
    bauen()

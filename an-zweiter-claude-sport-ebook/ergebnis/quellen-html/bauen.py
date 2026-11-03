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
        name='Kevin Wolter', rolle='Bodybuilder', rolle_lang='Bodybuilder · über 800.000 Fans',
        foto='kevin.jpg', foto_pos='50% 10%', foto_pos_titel='50% 25%', foto_pos_schluss='50% 22%',
        link='https://mein.ursprungskraft.net/partner/kevin/', link_kurz='mein.ursprungskraft.net/partner/kevin',
        vorwort_titel='Du trainierst hart. Trinkst du auch gut?',
        vorwort=(
            '<p class="lead">Eiweiß, Schlaf, Trainingsplan: bei mir war immer alles durchdacht. Nur beim '
            'Wasser habe ich nie hingeschaut. Drei, vier Liter am Tag aus der Plastikflasche. Das habe ich geändert.</p>\n'
            '    <p>Heute kommt mein Wasser frisch aus dem Hahn, so viel ich will. Keine Kisten mehr, kein Schleppen, kein Plastik.</p>\n    '
            + GEMEINSAM_VORWORT_ENDE),
        schluss_text='Trag dich auf meiner Seite ein, wenn du ernsthaft überlegst, dir ein eigenes Kangen-Gerät zu holen. Das passiert danach:',
    ),
    'johny': dict(
        name='Johny Yusupov', rolle='MMA-Fighter', rolle_lang='MMA-Fighter · @johny_yusupov',
        foto='johny.jpg', foto_pos='50% 12%', foto_pos_titel='50% 10%', foto_pos_schluss='50% 20%',
        link='https://mein.ursprungskraft.net/partner/johny/', link_kurz='mein.ursprungskraft.net/partner/johny',
        vorwort_titel='Du kämpfst hart. Trinkst du auch gut?',
        vorwort=(
            '<p class="lead">Training, Ernährung, Schlaf: im Fight-Camp ist bei mir alles durchgeplant. Nur beim '
            'Wasser habe ich nie hingeschaut. Drei, vier Liter am Tag aus der Plastikflasche. Das habe ich geändert.</p>\n'
            '    <p>Heute kommt mein Wasser frisch aus dem Hahn, so viel ich will. Keine Kisten mehr, kein Schleppen, kein Plastik.</p>\n    '
            + GEMEINSAM_VORWORT_ENDE),
        schluss_text='Trag dich auf meiner Seite ein, wenn du ernsthaft überlegst, dir ein eigenes Kangen-Gerät zu holen. Das passiert danach:',
    ),
}

def ph_pos(ph):  # Position auf der Skala 0 bis 14 in Prozent
    return f'{ph / 14 * 100:.2f}'

def skala():
    teile = []
    for i in range(14):
        # Verlauf: sauer = hell, basisch = dunkel, nur aus den drei Blautönen
        farbe = ['#E4F2F8', '#C9E6F6', '#1A6E9C', '#14425E'][min(3, i * 4 // 14)]
        schrift = '#fff' if i * 4 // 14 >= 2 else '#14425E'
        teile.append(f'<span style="background:{farbe};color:{schrift}">{i}</span>')
    return ''.join(teile)

def bauen():
    vorlage = (HIER / 'vorlage.html').read_text(encoding='utf-8')
    for kurz, daten in SPORTLER.items():
        werte = dict(daten, traeger='<i></i>' * 146, skala=skala(),
                     p25=ph_pos(2.5), p60=ph_pos(6.0), p70=ph_pos(7.0), p90=ph_pos(9.0), p115=ph_pos(11.5))
        html = vorlage
        for k, v in werte.items():
            html = html.replace('{{' + k + '}}', v)
        assert '{{' not in html, kurz
        (HIER / f'ebook-{kurz}.html').write_text(html, encoding='utf-8')
        print('gebaut:', f'ebook-{kurz}.html')

if __name__ == '__main__':
    bauen()

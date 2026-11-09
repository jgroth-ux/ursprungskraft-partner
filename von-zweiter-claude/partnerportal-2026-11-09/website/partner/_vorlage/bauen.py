# Baut die Empfehlungsseiten einzelner Partner (Sportseite) aus seite.html und partner.json.
# Ergebnis: website/partner/<kurz>/index.html, online unter mein.ursprungskraft.net/partner/<kurz>/
# Aufruf: python3 website/partner/_vorlage/bauen.py
import html, json, pathlib

hier = pathlib.Path(__file__).parent
vorlage = (hier / 'seite.html').read_text(encoding='utf-8')
for p in json.loads((hier / 'partner.json').read_text(encoding='utf-8')):
    s = vorlage
    insta = (f'<a class="insta" href="https://www.instagram.com/{html.escape(p["insta"])}/" target="_blank" rel="noopener">@{html.escape(p["insta"])}</a>'
             if p.get('insta') else '')
    foto = (f'<img src="{html.escape(p["foto"])}" alt="{html.escape(p["name"])}">' if p.get('foto')
            else f'<div class="platzhalter">Foto von {html.escape(p["vorname"])}</div>')
    ueber = f'<p class="ueber">{html.escape(p["ueber"])}</p>' if p.get('ueber') else ''
    zahlen = ''.join(f'<div class="zahl"><b data-zahl="{int(n)}">{int(n):,}</b><span>{html.escape(t)}</span></div>'.replace(',', '.')
                     for n, t in p.get('zahlen', []))
    roh = {'insta': insta, 'foto': foto, 'ueber': ueber, 'zahlen': zahlen}
    for k, v in {**p, **roh}.items():
        if not isinstance(v, str): continue
        s = s.replace('{{' + k + '}}', v if k in roh else html.escape(v))
    assert '{{' not in s, f'Platzhalter übrig bei {p["kurz"]}'
    ziel = hier.parent / p['kurz'] / 'index.html'
    ziel.parent.mkdir(exist_ok=True)
    ziel.write_text(s, encoding='utf-8')
    print('gebaut:', ziel.relative_to(hier.parent.parent.parent))

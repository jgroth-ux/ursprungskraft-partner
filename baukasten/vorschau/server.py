# Lokale Vorschau der Partnerseiten und der Portal-Ansicht "Meine Seiten", ohne Netlify und ohne Datenbank.
# Aufruf im Ordner baukasten:  python3 vorschau/server.py   dann im Browser http://localhost:8791/
# Bildet die Zeilen aus website/_redirects-ergaenzung.txt nach (kurz /<adresse> und /<adresse>/<fassung> wie auf
# wasseristmehr.com, dazu die alte Form /p/<adresse>/<fassung>). Die Startseite von wasseristmehr.com liegt hier unter
# /startseite, weil / die Übersicht der Vorschau zeigt. Liefert außerdem Schriften
# aus vorschau/schriften, weil der Ordner /schriften/ nur auf dem Server liegt.
import http.server, pathlib, re, socketserver, sys

HIER = pathlib.Path(__file__).resolve().parent
WEB = HIER.parent / 'website'
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8791
FASSUNGEN = ('neutral', 'sport', 'gesundheit')
STANDARD_BUCH = {'neutral': 'fuenf-wasserarten', 'sport': 'unterschaetztes-supplement', 'gesundheit': 'wasser-alltag'}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(WEB), **k)

    def translate_path(self, path):
        pfad, _, rest = path.partition('?')
        if pfad == '/':
            return str(HIER / 'start.html')
        if pfad.startswith('/schriften/') and not (WEB / pfad.lstrip('/')).exists():
            return str(HIER / 'schriften' / pfad.split('/')[-1])
        if pfad.startswith('/vorschau/'):
            return str(HIER / pfad[len('/vorschau/'):])
        if pfad.startswith('/ebooks/'):
            return str(HIER.parent / 'ebooks' / pfad[len('/ebooks/'):])
        if pfad in ('/startseite', '/startseite/'):
            return str(WEB / 'p' / 'start.html')
        # Kurze Adressen wie auf wasseristmehr.com: auf die Form /p/... abbilden, wenn es keine Datei gibt
        erstes = pfad.strip('/').split('/')[0]
        if erstes and erstes not in ('p', 'partner', 'schriften', 'vorschau', 'ebooks', 'bilder') and '.' not in erstes \
                and re.fullmatch(r'/[a-z0-9-]+(/[a-z0-9-]+){0,2}/?', pfad) and not (WEB / pfad.lstrip('/')).exists():
            pfad = '/p' + pfad
        m = re.fullmatch(r'/p/([a-z0-9-]+)/e-book/([a-z0-9-]+)', pfad)
        if m:
            return str(WEB / 'p' / 'vorschau' / f'ebook-{m.group(2)}.pdf')
        m = re.fullmatch(r'/p/([a-z0-9-]+)/([a-z]+)/e-book', pfad)
        if m:
            if m.group(1) == 'wasseristmehr':
                return str(WEB / 'p' / 'vorschau' / 'ebook-wasseristmehr.pdf')
            return str(WEB / 'p' / 'vorschau' / f'ebook-{STANDARD_BUCH.get(m.group(2), "fuenf-wasserarten")}.pdf')
        m = re.fullmatch(r'/p/([a-z0-9-]+)(?:/([a-z]+))?/?', pfad)
        if m and not (WEB / pfad.lstrip('/')).exists():
            f = m.group(2) if m.group(2) in FASSUNGEN else 'neutral'
            return str(WEB / 'p' / f'{f}.html')
        return super().translate_path(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass

class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    print(f'Vorschau läuft: http://localhost:{PORT}/   (beenden mit Strg+C)')
    Server(('', PORT), Handler).serve_forever()

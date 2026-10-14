from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


server = ThreadingHTTPServer(
    ("127.0.0.1", 8765), partial(NoCacheHandler, directory="_site")
)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()

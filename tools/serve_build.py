"""
Serve frontend/build the way Cloudflare Pages does: with an SPA fallback.

`python -m http.server` 404s every client route -- /about, /towers/mt-amd-am4 --
because only index.html exists on disk. That sent me chasing a routing bug that
was not there more than once, so this exists to stop that happening again.

Anything with a file extension is served from disk; everything else returns
index.html and lets react-router decide, which is exactly what public/_redirects
does in production.

    python tools/serve_build.py [port]
"""
from __future__ import annotations

import sys
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "frontend" / "build"


class SpaHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = Path(super().translate_path(path))
        if local.is_file() or local.is_dir():
            return str(local)
        # No extension means a route, not a missing asset. A missing .webp still
        # 404s, which is what you want -- a silent index.html in place of an
        # image is how "200 but text/html" bugs start.
        if not local.suffix:
            return str(ROOT / "index.html")
        return str(local)

    def log_message(self, fmt, *args):
        pass                                   # quiet; the tests do the talking


def main() -> int:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3131
    if not ROOT.is_dir():
        print(f"no build at {ROOT} - run craco build first")
        return 1
    handler = partial(SpaHandler, directory=str(ROOT))
    print(f"serving {ROOT} with SPA fallback on http://127.0.0.1:{port}")
    HTTPServer(("127.0.0.1", port), handler).serve_forever()
    return 0


if __name__ == "__main__":
    sys.exit(main())

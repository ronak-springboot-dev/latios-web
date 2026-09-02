"""
Point each tower's catalogue thumbnail at its own front view.

    python tools/set_thumbnails.py --dry
    python tools/set_thumbnails.py

Six MT models shared dp180-1.webp and eight shared dp180-2.webp, and four PROMAX
workstations were using MT micro-tower photographs - a workstation sold behind a
picture of a different machine.

Scoped, not global. The `image:` key appears many times in models.js; this finds
each model's own object by its slug, walks braces to that object's end, and only
rewrites the first `image:` inside it. A pattern applied file-wide is how
thirteen page files got corrupted earlier in this project - and every route still
answered HTTP 200, because CRA serves the SPA shell whether or not the bundle
compiles. The result is re-parsed before it is written.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "frontend/src/data/models.js"
MANIFEST = ROOT / "tools/image-processing/generated/fronts/manifest.json"


def object_end(src, start):
    """Index just past the `}` closing the object that opens at `start`."""
    depth = 0
    for i in range(start, len(src)):
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
            if depth == 0:
                return i + 1
    return len(src)


def object_start(src, at):
    """Index of the `{` opening the object containing `at`."""
    depth = 0
    for i in range(at, -1, -1):
        if src[i] == "}":
            depth += 1
        elif src[i] == "{":
            if depth == 0:
                return i
            depth -= 1
    return None


def main(dry=False):
    if not MANIFEST.exists():
        print("  no fronts manifest - run make_fronts.py first")
        return 1
    fronts = json.loads(MANIFEST.read_text(encoding="utf-8"))
    src = MODELS.read_text(encoding="utf-8")
    original = src
    changed = 0

    for slug, path in sorted(fronts.items()):
        # every place this slug is declared as a model
        for m in list(re.finditer(r'slug:\s*"' + re.escape(slug) + r'"', src)):
            s0 = object_start(src, m.start())
            if s0 is None:
                continue
            s1 = object_end(src, s0)
            body = src[s0:s1]
            im = re.search(r'(image:\s*)"([^"]*)"', body)
            if not im or im.group(2) == path:
                continue
            new_body = body[:im.start(2) - 1] + f'"{path}"' + body[im.end(2) + 1:]
            print(f"  {slug:19s} {im.group(2)} -> {path}")
            src = src[:s0] + new_body + src[s1:]
            changed += 1
            break                       # one declaration per slug is enough

    if not changed:
        print("\n  nothing to change")
        return 0

    # Refuse to write something that will not parse. models.js is imported by
    # every page; a broken one takes the whole catalogue down.
    #
    # Encoded explicitly: text=True pipes stdin through the console codepage,
    # which on Windows is cp1252 and cannot represent the "->" arrow this file
    # contains, so the check itself crashed rather than the file being wrong.
    r = subprocess.run(["node", "--input-type=module", "--check"],
                       input=src.encode("utf-8"), capture_output=True)
    if r.returncode != 0:
        print("\n  REFUSING TO WRITE - result does not parse:")
        for line in r.stderr.decode("utf-8", "replace").strip().splitlines()[:4]:
            print("   ", line)
        return 1

    print(f"\n  {changed} thumbnail(s) {'would change' if dry else 'updated'}"
          f"  (result parses)")
    if not dry:
        MODELS.write_text(src, encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main(dry="--dry" in sys.argv))

"""
Correct each reveal manifest's declared frame size to what is actually on disk.

    python tools/fix_reveal_manifests.py --dry
    python tools/fix_reveal_manifests.py

Eleven of the fifteen pages declare `height: 1400` while their frames are
1400x1120 - the towers' frames follow their photograph's aspect, and only the
four PROMAX sequences are actually square.

This is not currently visible: PdpReveal.jsx fits each frame using the loaded
image's own img.width/img.height, so the declared numbers are never used for
layout. They are still wrong, and a future reader (or a future component that
does trust them, e.g. to reserve space before the first frame loads) would be
misled. Corrected from the files themselves rather than by hand.

Scoped and re-parsed before writing, same as tools/set_thumbnails.py - a broken
page file takes the catalogue down and every route still answers HTTP 200
because CRA serves the SPA shell regardless.
"""
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDP = ROOT / "frontend/src/data/pdp"
REVEAL = ROOT / "frontend/public/reveal"


def real_size(slug):
    f = REVEAL / slug / "000.webp"
    return Image.open(f).size if f.exists() else None


def real_frames(slug):
    return len(list((REVEAL / slug).glob("*.webp"))) if (REVEAL / slug).is_dir() else 0


def main(dry=False):
    changed = 0
    for path in sorted(PDP.glob("*.js")):
        src = path.read_text(encoding="utf-8")
        m = re.search(
            r'("?manifest"?\s*:\s*\{[^}]*?"?pattern"?\s*:\s*"/reveal/([a-z0-9-]+)/\{i\}\.webp"[^}]*\})',
            src)
        if not m:
            continue
        block, slug = m.group(1), m.group(2)
        size = real_size(slug)
        if not size:
            print(f"  {slug:20s} no frames on disk - skipped")
            continue
        w, h = size
        n = real_frames(slug)
        new_block = re.sub(r'("?width"?\s*:\s*)\d+', rf'\g<1>{w}', block)
        new_block = re.sub(r'("?height"?\s*:\s*)\d+', rf'\g<1>{h}', new_block)
        # The frame COUNT matters more than the dimensions: PdpReveal indexes
        # 0..frames-1 straight out of the manifest, so a stale count either
        # leaves the tail of the sequence unreachable or asks for frames that
        # are not there.
        new_block = re.sub(r'("?frames"?\s*:\s*)\d+', rf'\g<1>{n}', new_block)
        if new_block == block:
            continue
        old = re.search(r'"?frames"?\s*:\s*(\d+)[^}]*?"?width"?\s*:\s*(\d+)[^}]*?"?height"?\s*:\s*(\d+)', block)
        print(f"  {slug:20s} {old.group(1)}f {old.group(2)}x{old.group(3)}"
              f"  ->  {n}f {w}x{h}")
        src = src[:m.start(1)] + new_block + src[m.end(1):]

        r = subprocess.run(["node", "--input-type=module", "--check"],
                           input=src.encode("utf-8"), capture_output=True)
        if r.returncode != 0:
            print(f"    REFUSING TO WRITE {path.name} - does not parse:")
            for line in r.stderr.decode("utf-8", "replace").strip().splitlines()[:3]:
                print("     ", line)
            continue
        if not dry:
            path.write_text(src, encoding="utf-8")
        changed += 1

    print(f"\n  {changed} manifest(s) {'would be' if dry else ''} corrected")
    return 0


if __name__ == "__main__":
    sys.exit(main(dry="--dry" in sys.argv))

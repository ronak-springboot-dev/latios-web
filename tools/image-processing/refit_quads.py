"""
Recompute each panel's corner quad from the mask already on disk.

    python refit_quads.py --dry
    python refit_quads.py

Why not just re-run register_pairs.py
-------------------------------------
register_pairs.py rebuilds the interiors as well, which would undo the recrop
fit_interiors.py applies to the two SFF renders. Only the quad is wrong, and the
mask it should be derived from is already sitting in panel-*.png's alpha, so
this recomputes just that and rewrites quad/src_quad in place.

What was wrong
--------------
The old quad_of() picked corners as the extremes of x+y and x-y. That is exact
only when those four extremes land on four different corners. On the SFF's top
plate they do not: its far-left vertex is simultaneously the smallest x+y and
the smallest x-y, so two corners collapsed onto nearly the same point and the
"panel" became a degenerate wedge covering 69% of the plate's real area. Swung,
that wedge tore into a triangle slashing across the front of the machine.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from register_pairs import quad_of

PAIRS = Path(__file__).parent / "generated" / "pairs"


def shoelace(p):
    p = np.asarray(p, dtype=float)
    x, y = p[:, 0], p[:, 1]
    return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))


def refit(path, dry=False):
    meta = json.loads(path.read_text(encoding="utf-8"))
    name = path.stem.replace("panel-", "")
    png = PAIRS / f"panel-{name}.png"
    if not png.exists():
        print(f"  {name:14s} no panel png")
        return False

    x0, y0, _, _ = meta["bbox"]
    alpha = np.asarray(Image.open(png).getchannel("A")) > 128
    if not alpha.any():
        print(f"  {name:14s} empty mask")
        return False

    # quad_of works in the mask's own pixel space; shift into frame coords.
    q_local = np.asarray(quad_of(alpha), dtype=float)
    q_frame = q_local + np.array([x0, y0], dtype=float)

    old = np.asarray(meta["quad"], dtype=float)
    cover_old = shoelace(old) / alpha.sum()
    cover_new = shoelace(q_frame) / alpha.sum()
    print(f"  {name:14s} quad/mask area  {cover_old:.3f} -> {cover_new:.3f}"
          f"{'   (unchanged)' if abs(cover_new - cover_old) < 0.005 else ''}")

    meta["quad"] = [[round(float(x), 1), round(float(y), 1)] for x, y in q_frame]
    meta["src_quad"] = [[round(float(x), 1), round(float(y), 1)] for x, y in q_local]
    if not dry:
        path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return True


if __name__ == "__main__":
    dry = "--dry" in sys.argv
    n = sum(refit(p, dry) for p in sorted(PAIRS.glob("panel-*.json")))
    print(f"\n  {n} quad(s) {'checked' if dry else 'rewritten'}")

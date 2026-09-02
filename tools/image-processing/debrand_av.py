"""
Remove third-party branding from the AV product images.

    python debrand_av.py --scan     # show the marked regions, change nothing
    python debrand_av.py            # apply

Why this exists
---------------
av-ptz.jpg carries an "NDI|HX3" mark on the camera base - a third-party brand
sitting on a page that sells the product as a Latios. That is the same class of
problem as the MSI badges found on the sample units earlier in this project, and
it gets the same treatment: the mark is erased deterministically from named
boxes, nothing is generated, and no pixel outside those boxes changes.

Relighting these images does NOT fix this. A studio pass makes a cleaner picture
of the same mark.

The mark runs off the left edge of the frame, so the fill has to come from ONE
side. scene_merge.erase already does exactly that, and its docstring records why
two-sided interpolation was wrong in the equivalent case.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

import scene_merge

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")

# file -> list of (box as fractions, side to sample clean surface from).
# Read off a coordinate grid at 12x, not estimated: the mark is 27px wide in a
# 521px image and guessing at that scale is how the earlier badge patches left
# ghosts behind.
PATCHES = {
    "av-ptz.jpg": [
        # "DI|HX3" on the black camera's base; the N is already clipped by the
        # frame edge, so the box starts at x=0 and fills from the right.
        # Box padded well clear of the glyphs. A tight box plus a feathered
        # mask put the soft edge ON the lettering and left "DI" legible with
        # a ghost of "HX3" - the same failure the interior patches hit.
        ((0.000, 0.815, 0.075, 0.876), "right"),
        # The same mark appears again on the white camera beside it, around
        # x 0.614-0.649. NOT patched here, deliberately: it is ~18px wide on a
        # curved silver band with a steep tonal gradient, the camera's own edge
        # is at x=0.612 with pure white page behind it, and a flat one-sided fill
        # banded visibly worse than the mark it replaced. It is also small enough
        # not to read as a brand at display size. The studio relight pass is the
        # thing to try on it - and if that leaves it, this image wants replacing
        # rather than retouching, since it is an OEM stock photo either way.
    ],
}


def scan(name):
    p = IMAGES / name
    if not p.exists():
        print(f"  {name}: missing")
        return
    im = Image.open(p).convert("RGB")
    W, H = im.size
    print(f"  {name}  {W}x{H}")
    for (fx0, fy0, fx1, fy1), side in PATCHES[name]:
        px = (int(fx0 * W), int(fy0 * H), int(fx1 * W), int(fy1 * H))
        print(f"    box {px}  ({fx1-fx0:.3f} x {fy1-fy0:.3f} of frame)  fill from {side}")


def apply(name):
    p = IMAGES / name
    if not p.exists():
        print(f"  {name}: missing")
        return
    im = Image.open(p).convert("RGB")
    W, H = im.size
    before = np.asarray(im).astype(int)
    for (fx0, fy0, fx1, fy1), side in PATCHES[name]:
        x0, y0, x1, y1 = int(fx0 * W), int(fy0 * H), int(fx1 * W), int(fy1 * H)
        # pad must not push the box off the frame, or the sample slice inverts
        pad = min(4, x0, y0, W - x1, H - y1)
        im = scene_merge.erase(im, (x0, y0, x1, y1), sample=12, feather=2,
                               pad=pad, side=side)
    after = np.asarray(im).astype(int)
    changed = (np.abs(after - before).max(axis=2) > 2)
    im.save(p, quality=95)
    print(f"  {name}: patched {len(PATCHES[name])} region(s), "
          f"{changed.sum()} px changed ({changed.mean()*100:.2f}% of frame)")


if __name__ == "__main__":
    for name in PATCHES:
        (scan if "--scan" in sys.argv else apply)(name)

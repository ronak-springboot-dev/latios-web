"""
Remove garbled lettering from the generated interiors.

The negative prompt asks for no text and the model still prints on flat surfaces
— the graphics card shroud is the reliable offender. This is the same failure
that produced "Lotios", "Lobos" and "Lohxs" earlier in the project, so it gets
the same treatment: the marks are removed deterministically rather than
re-rolled and hoped over.

Each region is filled by interpolating across it row by row from clean surface
either side, with monochrome grain matched to the local noise. Nothing is
generated and no pixel outside the named boxes changes.

    python clean_interiors.py            # apply every known patch
    python clean_interiors.py --scan     # report bright text-like clusters
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = Path(__file__).parent / "generated" / "components"
# The reveal now composites photo-derived interiors from generated/pairs rather
# than the old internals-* renders, and the model prints on those too - the
# mt-ddr4-gpu card shroud came back reading "X IFJOIRX". Same treatment.
PAIRS = Path(__file__).parent / "generated" / "pairs"


def _path(name):
    """Look in both places, so one patch table covers old and new interiors."""
    for base, stem in ((SRC, f"{name}.png"), (PAIRS, f"{name}.png")):
        if (base / stem).exists():
            return base / stem
    return SRC / f"{name}.png"

# interior -> boxes as (l, t, r, b) fractions of the render
PATCHES = {
    # Located by eye off a contact sheet, the same way the MSI badges were.
    "internals-mt-ddr4-gpu":  [(0.545, 0.240, 0.700, 0.310),   # card shroud
                               (0.295, 0.375, 0.405, 0.425)],  # fan hub
    # Read off a coordinate grid, not estimated. The first pass on these two sat
    # just below the lettering and left it untouched.
    "internals-mt-ddr5-gpu":  [(0.385, 0.190, 0.715, 0.264),   # card shroud + "8x"
                               (0.350, 0.281, 0.520, 0.318)],  # second line below the card
    "internals-promax-4dimm": [(0.235, 0.535, 0.400, 0.593)],  # "DDR5 ECC" on the card
    # Photo-derived interiors (generated/pairs). Located off a zoom of the card
    # band, the same way the badges were.
    # A box may carry a fifth value overriding the feather. Needed here: the card
    # shroud is only ~41px tall, so the box cannot be padded outward without the
    # horizontal interpolation dragging in cables above and board below. With the
    # default feather the mask's opaque core is inset ~18px and the lettering's
    # top and bottom sat under a half-transparent mask - a legible ghost.
    "interior-mt-ddr4-gpu": [(0.192, 0.584, 0.344, 0.622, 0.0018)],
    "interior-mt-ddr5-gpu": [(0.288, 0.612, 0.394, 0.663, 0.0018),   # logo mark on the shroud
                             (0.505, 0.628, 0.590, 0.661, 0.0018),   # "VDPS5"
                             (0.148, 0.614, 0.210, 0.660, 0.0018)],  # "20GX" at the bracket end
    "interior-promax-4dimm": [(0.316, 0.679, 0.520, 0.711, 0.0018)],   # "OBBY SHOVIL ADOG" on the board
}


def fill(img, box, sample=0.018, feather=0.006):
    """Interpolate horizontally across `box` from clean surface either side."""
    if len(box) == 5:
        box, feather = box[:4], box[4]
    w, h = img.size
    x0, y0, x1, y1 = (int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h))
    s = max(6, int(w * sample))
    a = np.asarray(img.convert("RGB")).astype(np.float32)

    left = a[y0:y1, max(0, x0 - s):x0].mean(axis=1)
    right = a[y0:y1, x1:min(w, x1 + s)].mean(axis=1)
    ramp = np.linspace(0, 1, x1 - x0)[None, :, None]
    out = left[:, None, :] * (1 - ramp) + right[:, None, :] * ramp

    grain = float(a[y0:y1, x1:min(w, x1 + s)].std())
    rng = np.random.default_rng(17)
    out = out + rng.normal(0, min(3.0, max(0.6, grain * 0.25)),
                           (out.shape[0], out.shape[1], 1))

    patch = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    f = max(3, int(w * feather))
    mask = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(mask).rectangle((f, f, x1 - x0 - f, y1 - y0 - f), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(f))

    res = img.copy()
    res.paste(patch, (x0, y0), mask)
    return res


def scan(name, thresh=190, min_px=180):
    """
    Report bright clusters on otherwise dark surfaces — where printing lands.

    A reporter, not an eraser: it says where to look so the boxes above can be
    written by eye. Automatically erasing every bright cluster would take out
    legitimate highlights, connectors and gold contacts.
    """
    p = _path(name)
    im = Image.open(p).convert("L").resize((512, 512), Image.LANCZOS)
    a = np.asarray(im)
    ys, xs = np.nonzero(a > thresh)
    if len(xs) < min_px:
        print(f"  {name:26s} no bright clusters over {thresh}")
        return
    # coarse 16x16 histogram so clusters are readable as regions
    hist = np.zeros((16, 16), dtype=int)
    for x, y in zip(xs, ys):
        hist[y * 16 // 512, x * 16 // 512] += 1
    hot = [(v, r, c) for r, row in enumerate(hist) for c, v in enumerate(row) if v > min_px]
    hot.sort(reverse=True)
    print(f"  {name}:")
    for v, r, c in hot[:6]:
        print(f"     x {c/16:.2f}-{(c+1)/16:.2f}  y {r/16:.2f}-{(r+1)/16:.2f}   {v} px")


if __name__ == "__main__":
    if "--scan" in sys.argv:
        for p in sorted(SRC.glob("internals-*.png")) + sorted(PAIRS.glob("interior-*.png")):
            scan(p.stem)
    else:
        for name, boxes in PATCHES.items():
            p = _path(name)
            if not p.exists():
                print(f"  {name}: not rendered")
                continue
            im = Image.open(p).convert("RGB")
            for b in boxes:
                im = fill(im, b)
            im.save(p)
            print(f"  {name}: patched {len(boxes)} region(s)")

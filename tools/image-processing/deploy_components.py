"""
Take the raw component renders to web assets, and to animation layers.

Two outputs per component, because they serve different jobs:

  * frontend/public/images/components/<name>.webp — transparent, sized for the
    breakdown grid. Transparent rather than baked onto a plate so the same asset
    sits correctly on both the light and dark theme.
  * generated/components/layers/<name>.png — the same cutout at working size,
    which make_exploded_video.py animates apart and back together.

The renders arrive at 5312x5312 and ~21MB from the 4x upscale. They are
downsampled BEFORE rembg: matting a 28-megapixel image is slow and buys nothing,
since the alpha is only ever used at a fraction of that size.
"""
import sys
from pathlib import Path

from PIL import Image

from process import cutout, trim_to_subject

SRC = Path(__file__).parent / "generated" / "components"
LAYERS = SRC / "layers"
DEST = Path(r"C:\Ronak\latios-web\frontend\public\images\components")

WORK = 1600      # matting/animation size
WEB = 1100       # deployed size — these render in a grid cell, not full-bleed
PAD = 0.04       # breathing room so the contact shadow is not clipped


def run(name):
    src = SRC / f"{name}.png"
    if not src.exists():
        print(f"  SKIP {name}: not rendered yet")
        return

    im = Image.open(src).convert("RGB")
    if im.width > WORK:
        im = im.resize((WORK, round(im.height * WORK / im.width)), Image.LANCZOS)

    cut = trim_to_subject(cutout(im))

    # Square canvas with a little padding: the grid cell is square, and centring
    # here rather than in CSS keeps every component optically the same size.
    side = int(max(cut.size) * (1 + 2 * PAD))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(cut, ((side - cut.width) // 2, (side - cut.height) // 2), cut)

    LAYERS.mkdir(parents=True, exist_ok=True)
    canvas.save(LAYERS / f"{name}.png")

    DEST.mkdir(parents=True, exist_ok=True)
    web = canvas.resize((WEB, WEB), Image.LANCZOS)
    out = DEST / f"{name}.webp"
    web.save(out, "WEBP", quality=90, method=6)
    print(f"  {name:12s} {cut.size[0]}x{cut.size[1]} cutout -> {out.name} "
          f"({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    names = sys.argv[1:] or [p.stem for p in SRC.glob("*.png") if "-" not in p.stem]
    for n in names:
        try:
            run(n)
        except Exception as e:
            print(f"  FAILED {n}: {type(e).__name__}: {e}")

"""Hero banners built from the real photographs, not generated around them.

Why this exists. The homepage hero rotates four 3200x1800 banners
(Home.jsx BANNER_POOL). Two of them carry Latios hardware, and both were
Qwen-Image-Edit outputs -- and both failed the one gate this project has:

  banner-latios-tower.webp   the bezel wordmark came back garbled, and a gold
                             badge was invented next to the USB-C port. It has
                             been live on the homepage.
  banner-latios-laptop.webp  the lid reads LAITOS, and the palmrest carries two
                             fabricated stickers aping an NVIDIA GeForce badge
                             and an AMD Ryzen badge. Unreferenced, deleted.

qwen_scenes.py already states the rule -- "if the wordmark is not exactly
'Latios', the output is discarded" -- and brand_composite.py says why: "The
image model cannot render the wordmark reliably... So we never ask it to."
These two are what that gate is for, and they got through it.

There is no need to generate this picture at all now. images/fronts/*.webp are
real photographic cut-outs of the real machines, carrying the real wordmark,
and am4_studio.compose() already stands a cut-out on a ground with a shadow and
a reflection. So the banner is a photograph on a drawn ground, which is what
the component plates and chassis cards are, and nothing about the product is
invented.

Wide rather than tall: the hero crops to about 1920x780 through object-cover,
and cd71020 records that the subjects had to be restaged into the central 58%
of frame to survive it. `inset` is that margin.

    python make_banners.py            # all
    python make_banners.py tower
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

import am4_studio as studio

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
OUT = PUBLIC / "banner"
SIZE = (3200, 1800)

#: A near-black ground, so these sit beside the three silicon banners rather
#: than glowing next to them. PLATE_GROUND is the component plates' warm ramp
#: and is deliberately NOT used here: on a 3200px hero it reads as a brown
#: gradient behind a black box.
GROUND = ((0.00, (6, 6, 8)), (0.55, (13, 13, 16)), (0.82, (22, 21, 24)),
          (1.00, (9, 9, 11)))

JOBS = {
    "banner-latios-tower": dict(src="fronts/mt.webp", height=0.62, cx=0.50),
    "banner-latios-sff":   dict(src="fronts/sff.webp", height=0.44, cx=0.50),
}


def banner(name, src, height, cx):
    cut = Image.open(PUBLIC / src).convert("RGBA")

    # Drop the contact shadow shoot_fronts.py bakes in at 34% alpha. Left in,
    # the alpha bounding box reaches under the machine, compose() sets it down
    # on ITS floor line and draws a second shadow lower still, and the product
    # hovers over both.
    a = np.asarray(cut.getchannel("A"))
    cut.putalpha(Image.fromarray(np.where(a > 120, a, 0).astype(np.uint8)))
    cut = cut.crop(cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())

    W, H = SIZE
    canvas, _ = studio.compose(
        cut, W, H, height=height, floor=0.84, cx=cx,
        ground=GROUND, halo=(30, 29, 33), halo_at=0.22,
        glow=(120, 86, 48), glow_at=18)

    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{name}.webp"
    canvas.save(out, "WEBP", quality=88, method=6)
    print(f"  {out.name:28s} {canvas.size}  {out.stat().st_size // 1024:>4}KB")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in JOBS.items():
        if only and not any(o in name for o in only):
            continue
        banner(name, **cfg)

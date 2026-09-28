"""The desktop family, photographed together, at true relative scale.

WHY. The homepage products accordion gives each category one image. Laptops get
laptops-hero.jpg, which is a FAMILY LINEUP -- several machines together on a
light set, so the panel says "a range" before you read a word of it. Desktops
got latios-mt.webp: one tower, alone, on a grey sweep. The category sells three
chassis and eleven configurations and the picture showed one box.

So this builds the desktop equivalent from the three real cut-outs in
images/fronts/: the 18-litre micro tower, the 8-litre small form factor and the
1.1-litre DP10 mini. Photographs, with the real wordmark in the real pixels --
make_banners.py records why nothing here is generated:

    "banner-latios-tower.webp -- the bezel wordmark came back garbled, and a
     gold badge was invented next to the USB-C port. It has been live."

SCALE IS THE WHOLE POINT and it is measured, not eyeballed. A family lineup
that does not hold relative size is just three photographs in a row; the reason
to stand these together is to show that the same machine comes in three
volumes. Heights come from the spec tables in models.js:

    MT    354 mm   ("312 x 166 x 354 mm - 18 litres")
    SFF   330 mm   ("95 x 296 x 330 mm - 8 litres")
    DP10  ~205 mm  ESTIMATED -- see below

The DP10 is the one number this file does not have. Its spec table gives volume
and mounting only ("1.1 litres - VESA-mountable") and no millimetres, so its
height is taken as about 205 mm including the stand it is photographed on,
which is what a 1.1-litre chassis at these proportions comes to. If the real
figure turns up, put it in DIMS and re-run; nothing else needs to change.

THE CENTRE OF THE FRAME IS LOAD-BEARING. The accordion panel is object-cover,
and a collapsed panel is a tall narrow slot -- it shows the middle of the image
and nothing else. So the MT stands in the centre and the other two flank it: a
collapsed Desktops panel shows the tower, which is what it showed before, and
an expanded one shows the family.

    python make_family_lineup.py
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from am4_studio import _ground

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
OUT = PUBLIC / "desktops-hero.webp"
SIZE = (1600, 1024)
FLOOR = 0.800

#: Light, not the near-black the component plates use. This image sits in the
#: accordion beside laptops-hero.jpg, which is a bright set, and under a
#: black/30 scrim that the panel lays over everything -- a dark original goes
#: to mud under it.
GROUND = ((0.00, (247, 247, 245)), (0.52, (240, 240, 238)),
          (0.800, (226, 226, 223)), (1.00, (205, 205, 202)))

#: real height in mm -> the tallest becomes TALLEST of the frame and the rest
#: follow. See the docstring on the DP10's estimate.
DIMS = {"mt": 354.0, "sff": 330.0, "mff-dp10": 205.0}
TALLEST = 0.60

#: left to right. The MT is centred on purpose; see the docstring.
LINEUP = [("sff", 0.200), ("mt", 0.500), ("mff-dp10", 0.800)]


def cut(name):
    """The photographed chassis, with shoot_fronts' baked shadow removed.

    Same reason as make_banners.py: left in, the alpha bounding box reaches
    under the machine, the product is set down on that instead of on its own
    feet, and the contact shadow drawn below is then the second one.
    """
    img = Image.open(PUBLIC / "fronts" / f"{name}.webp").convert("RGBA")
    a = np.asarray(img.getchannel("A"))
    img.putalpha(Image.fromarray(np.where(a > 120, a, 0).astype(np.uint8)))
    return img.crop(img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


def lineup():
    W, H = SIZE
    img = _ground(W, H, GROUND).convert("RGB")
    fy = round(H * FLOOR)

    tallest_mm = max(DIMS[n] for n, _ in LINEUP)
    placed = []
    for name, cx in LINEUP:
        p = cut(name)
        ph = round(H * TALLEST * DIMS[name] / tallest_mm)
        p = p.resize((round(p.width * ph / p.height), ph), Image.LANCZOS)
        placed.append((p, round(W * cx - p.width / 2), fy - ph))

    # Contact shadows first, all of them, so a shadow can fall UNDER the
    # neighbouring machine rather than on top of it.
    sh = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(sh)
    for p, x, y in placed:
        w = p.width
        d.ellipse([x - w * 0.10, fy - w * 0.055, x + w * 1.10, fy + w * 0.085], fill=96)
        d.ellipse([x + w * 0.06, fy - w * 0.022, x + w * 0.94, fy + w * 0.030], fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(W * 0.011))
    img = Image.composite(Image.new("RGB", (W, H), (150, 150, 148)), img, sh)

    for p, x, y in placed:
        # A short reflection, faded hard. On a light floor this reads as a
        # polished surface; without it the machines look cut out and pasted.
        rh = round(p.height * 0.20)
        refl = p.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, p.width, rh))
        fade = Image.linear_gradient("L").resize(refl.size).point(lambda v: int((255 - v) * 0.16))
        refl.putalpha(Image.fromarray(
            (np.asarray(refl.getchannel("A"), float) * np.asarray(fade, float) / 255
             ).astype(np.uint8)))
        img.paste(refl, (x, fy), refl)

    for p, x, y in placed:
        img.paste(p, (x, y), p)

    img.save(OUT, "WEBP", quality=90, method=6)
    print(f"  {OUT.name:24s} {img.size}  {OUT.stat().st_size // 1024:>4}KB")
    for (name, _), (p, x, y) in zip(LINEUP, placed):
        print(f"      {name:10s} {DIMS[name]:5.0f}mm -> {p.height:4d}px  x {x}..{x + p.width}")


if __name__ == "__main__":
    lineup()

"""Stand a photographed chassis on the page backdrop, and measure its callouts.

The MT got a card like this by hand, through gen_am4_edits.front_card(), and it
lives in images/am4/ because that is the page it was built for. The chassis is
not AM4's: shoot_deploy.py already records that the six MT configurations differ
by board, CPU and memory rather than by case, so one card is correct for all of
them. The SFF has four configurations and no card at all.

So this does both families from the cut-outs that already exist --
images/fronts/mt.webp and images/fronts/sff.webp, both real photography with a
clean alpha -- and writes them to images/mt/ and images/sff/, which are honest
paths for something six and four pages share.

Nothing is generated here. The pixels are the photograph; only the ground, the
shadow and the reflection are drawn, by the same am4_studio.compose() that
stages the component plates, on the same neutral PLATE_GROUND. That is what
makes a chassis card and a memory plate look like one shoot.

It also PRINTS the callout geometry, because the bento's dimension lines are
percentages of the card and have to match the pixels. Measuring them by hand off
a proof is how the AM4 card's numbers were found; deriving them from the alpha
bounding box is the same answer without the proof.

    python stage_chassis.py            # both
    python stage_chassis.py sff        # one
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

import am4_studio as studio

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"

#: src cut-out, output folder, card size, and the real millimetres the callouts
#: name. The MT is 312 x 166 x 354, the SFF 95 x 296 x 330 -- width and height
#: are the faces the camera sees, depth is the note underneath.
JOBS = {
    "mt": dict(src="fronts/mt.webp", box=(1000, 1400), height=0.58, floor=0.80,
               w_mm=166, h_mm=354, note="Depth 312 mm · 7.59 kg"),
    # The SFF's visible face is nearly square (296 x 330) where the MT's is a
    # tall rectangle, so the same height fraction fills far more of the card's
    # width. 0.40 is what lands it at the MT's apparent size.
    "sff": dict(src="fronts/sff.webp", box=(1000, 1400), height=0.40, floor=0.80,
                w_mm=296, h_mm=330, note="Depth 95 mm · 4.74 kg"),
}


def card(name, src, box, height, floor, w_mm, h_mm, note):
    cut = Image.open(PUBLIC / src).convert("RGBA")

    # Drop the contact shadow that is already baked into these cut-outs.
    # shoot_fronts.py composites one at 34% alpha below the product before
    # saving, so the alpha bounding box reaches well under the chassis --
    # compose() then set the product down on ITS floor line and drew a SECOND
    # shadow lower still, and the machine appeared to hover over both. Anything
    # under 120 is that shadow; the product itself is opaque.
    a = np.asarray(cut.getchannel("A"))
    cut.putalpha(Image.fromarray(np.where(a > 120, a, 0).astype(np.uint8)))
    cut = cut.crop(cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())

    W, H = box
    canvas, (x, y, scale) = studio.compose(
        cut, W, H, height=height, floor=floor, cx=0.50,
        ground=studio.PLATE_GROUND, halo=(118, 108, 94), halo_at=0.44,
        glow=(150, 104, 60), glow_at=36)

    # The product's own box inside the card, from the alpha rather than from the
    # compose arguments: compose scales to a HEIGHT, so the width that comes out
    # depends on the cut, and the callouts have to follow the pixels.
    a = np.asarray(cut.getchannel("A"))
    rows = np.where(a.max(axis=1) > 8)[0]
    cols = np.where(a.max(axis=0) > 8)[0]
    left, right = x + cols.min() * scale, x + cols.max() * scale
    top, base = y + rows.min() * scale, y + rows.max() * scale
    px, py = lambda v: round(v / W * 100, 1), lambda v: round(v / H * 100, 1)

    out = PUBLIC / name / "chassis-card.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, "WEBP", quality=90, method=6)
    dims = {
        "box": [W, H],
        "h": {"x": px(left - 0.045 * W), "y1": py(top), "y2": py(base),
              "label": f"{h_mm} mm"},
        "d": {"x1": px(left), "x2": px(right), "y": py(base + 0.020 * H),
              "label": f"{w_mm} mm"},
        "note": note,
    }
    print(f"  {name}/chassis-card.webp  {canvas.size}  {out.stat().st_size // 1024:>4}KB")
    print(f"    dims {dims}")
    return dims


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in JOBS.items():
        if only and name not in only:
            continue
        card(name, **cfg)

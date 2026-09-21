"""Stand a photographed chassis on the page backdrop, and measure its callouts.

Two things this exists for.

First, paths that mean something: the MT's card lived in images/am4/ because
that is the page it was built for, while the chassis is shared by six. It is
images/mt/ now, and the SFF -- which had no card at all -- has images/sff/.

Second, and the reason it grew: ONE card per family made ten pages look
copy-pasted. The chassis genuinely IS one box per family -- shoot_deploy.py
records that the MT configurations differ by board, CPU and memory, not by case
-- so inventing visual differences between them would be a lie. What is honest,
and what this does, is give each page a DIFFERENT REAL FRAME of the same
machine: the MT shoot has 38 and the SFF 19, several of them clean exteriors
from different angles. Same product, different photograph.

Nothing here is generated. The pixels are the photograph; only the ground, the
shadow and the reflection are drawn, by the same am4_studio.compose() that
stages the component plates, on the same neutral PLATE_GROUND. That is what
makes a chassis card and a memory plate look like one shoot.

It also PRINTS the callout geometry, because the bento's dimension lines are
percentages of the card and have to match the pixels. Deriving them from the
alpha bounding box is the same answer as measuring off a proof, without the
proof.

    python stage_chassis.py            # every card
    python stage_chassis.py ddr4       # any job whose name contains this
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

import am4_studio as studio
from stage_am4_parts import cutout_image

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
SHOOT = {"mt": Path(r"C:/Ronak/Latios/Images/Latios tower"),
         "sff": Path(r"C:/Ronak/Latios/Images/Latios SFF")}

#: Real millimetres per family, for the callout labels. The MT is
#: 312 x 166 x 354, the SFF 95 x 296 x 330; width and height are the faces the
#: camera sees and depth is the note underneath.
MM = {"mt": (166, 354, "Depth 312 mm \u00b7 7.59 kg"),
      "sff": (296, 330, "Depth 95 mm \u00b7 4.74 kg")}

#: out name -> family, source, and how big it stands in the card.
#:
#: "front" is the pre-cut hero in images/fronts/, which already has a matte. A
#: bare timestamp is a frame from the shoot, cut here. Each page gets its own,
#: so five MT pages are not five copies of one picture.
JOBS = {
    "mt/chassis-card":  dict(fam="mt",  src="front",             height=0.58, floor=0.80),
    "mt/chassis-ddr4":  dict(fam="mt",  src="20260908_124121",   height=0.50, floor=0.80),
    "mt/chassis-ddr5":  dict(fam="mt",  src="20260908_123421",   height=0.60, floor=0.80),
    "mt/chassis-pro":   dict(fam="mt",  src="20260908_123901",   height=0.58, floor=0.80),
    "mt/chassis-am5":   dict(fam="mt",  src="20260908_123449",   height=0.60, floor=0.80),
    "mt/chassis-q670":  dict(fam="mt",  src="20260908_123542",   height=0.58, floor=0.80),
    "sff/chassis-card": dict(fam="sff", src="front",             height=0.40, floor=0.80),
    "sff/chassis-am5":  dict(fam="sff", src="20260908_121426",   height=0.62, floor=0.80),
    "sff/chassis-b860": dict(fam="sff", src="20260908_121404",   height=0.50, floor=0.80),
    "sff/chassis-h810": dict(fam="sff", src="20260908_121453",   height=0.46, floor=0.80),
}
BOX = (1000, 1400)


def _cut(fam, src):
    if src == "front":
        cut = Image.open(PUBLIC / "fronts" / f"{fam}.webp").convert("RGBA")
        # Drop the contact shadow baked into these by shoot_fronts.py at 34%
        # alpha. Left in, the alpha bounding box reaches well under the chassis,
        # compose() sets the machine down on ITS floor line and draws a SECOND
        # shadow lower still, and the product appears to hover over both.
        a = np.asarray(cut.getchannel("A"))
        cut.putalpha(Image.fromarray(np.where(a > 120, a, 0).astype(np.uint8)))
        return cut

    import pillow_heif
    pillow_heif.register_heif_opener()
    im = Image.open(SHOOT[fam] / f"{src}.heic").convert("RGB")
    im.thumbnail((2400, 2400), Image.LANCZOS)
    cut = cutout_image(im)

    # Three faults the raw matte has against a lit wall: it keeps a wedge of the
    # bench, it drops bright front-panel detail out of the silhouette, and it
    # leaves a speckled fringe where a black chassis meets a bright background.
    # Largest component, fill, erode, feather -- that fringe is the loudest tell
    # that a picture is a cut-out.
    a = np.asarray(cut.getchannel("A"))
    m = a > 128
    lab, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = lab == (int(np.argmax(sizes)) + 1)
    m = ndimage.binary_fill_holes(m)
    m = ndimage.binary_erosion(m, np.ones((5, 5), bool))
    cut.putalpha(Image.fromarray((m * 255).astype(np.uint8))
                 .filter(ImageFilter.GaussianBlur(1.4)))

    # The shoot lit these on soft overhead office light: correct colour, flat,
    # no specular anywhere. Beside a render carrying studio highlights that
    # flatness reads as a sticker. A gentle S-curve lets the ribs and the
    # chamfer catch light. Balance is untouched -- measured, the chassis is
    # already the warmer of the two.
    arr = np.asarray(cut.convert("RGBA")).astype(np.float32)
    v = arr[..., :3] / 255.0
    arr[..., :3] = np.clip(v + 0.85 * v * (1 - v) * (v - 0.42), 0, 1) * 255
    return Image.fromarray(arr.clip(0, 255).astype("uint8"), "RGBA")


def card(name, fam, src, height, floor):
    cut = _cut(fam, src)
    cut = cut.crop(cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())

    W, H = BOX
    canvas, (x, y, scale) = studio.compose(
        cut, W, H, height=height, floor=floor, cx=0.50,
        ground=studio.PLATE_GROUND, halo=(118, 108, 94), halo_at=0.44,
        glow=(150, 104, 60), glow_at=36)

    # The product's own box inside the card, from the alpha rather than from the
    # compose arguments: compose scales to a HEIGHT, so the width depends on the
    # cut and the callouts have to follow the pixels.
    a = np.asarray(cut.getchannel("A"))
    rows = np.where(a.max(axis=1) > 8)[0]
    cols = np.where(a.max(axis=0) > 8)[0]
    left, right = x + cols.min() * scale, x + cols.max() * scale
    top, base = y + rows.min() * scale, y + rows.max() * scale
    px = lambda v: round(float(v) / W * 100, 1)
    py = lambda v: round(float(v) / H * 100, 1)

    w_mm, h_mm, note = MM[fam]
    out = PUBLIC / f"{name}.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, "WEBP", quality=90, method=6)
    dims = {"box": [W, H],
            "h": {"x": px(left - 0.045 * W), "y1": py(top), "y2": py(base),
                  "label": f"{h_mm} mm"},
            "d": {"x1": px(left), "x2": px(right), "y": py(base + 0.020 * H),
                  "label": f"{w_mm} mm"},
            "note": note}
    print(f"  {name}.webp  {canvas.size}  {out.stat().st_size // 1024:>4}KB")
    print(f"    dims {dims}")
    return dims


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in JOBS.items():
        if only and not any(o in name for o in only):
            continue
        card(name, **cfg)

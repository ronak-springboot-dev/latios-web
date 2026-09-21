"""Stand the shared component plates on the page backdrop, at shipping size.

The companion to gen_parts.py, and the same relationship stage_am4_parts.py has
to gen_am4.py -- lifted from it rather than written fresh, so the lessons come
with the code.

Why one staging serves every page: `am4_studio.PLATE_GROUND` is a NEUTRAL
graphite-to-warm-sand ramp, not any page's accent. That was a deliberate choice
on the AM4 page (a saturated backdrop behind a grey component reads as a filter
rather than as a studio) and it is what makes these plates portable. A page's
accent reaches its headings and its numbers; the photography stays neutral.

The three things that actually decide whether a plate looks real, all of them
paid for on the AM4 page:

  * GIVE THE MATTE SOMETHING TO FIND. The AM4 plates are rendered on black and
    cut with u2net, and that combination is fragile for exactly the parts this
    library is full of. Measured on the AM4 memory plate, a quarter of the pixels
    over the subject are pure 0: a matte black heat spreader photographs exactly
    as dark as the seamless behind it. Thresholding luminance there painted half
    the backdrop over the modules and they went milky; u2net on the first
    ddr5-pair roll returned a partial, see-through alpha over the same faces, and
    binarising at 60, 110 or 160 deleted them rather than recovering them.

    Neither tool was the problem. The render was. gen_parts.py puts these on a
    LIGHT seamless, so a dark part has a real edge, and the ground is cut off and
    replaced by PLATE_GROUND anyway so it is never seen.
  * COMPOSE at the size it ships at. The canvas was 1600 while the output was
    2400 for one commit, which meant every plate was built small and enlarged --
    a bigger file carrying no more detail.
  * RE-MEASURE the retouch boxes against the render they belong to. Each re-roll
    moves the invented lettering somewhere new, so the previous generation's
    coordinates are not a starting point, they are a hazard: applied to a clean
    frame they blur good metal.

    python stage_parts.py               # everything rendered so far
    python stage_parts.py ddr5-pair     # one plate
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

import am4_studio as studio
import install_am4 as ins
from stage_am4_parts import cutout_image

GEN = Path(__file__).parent / "generated" / "components-lib"
DEST = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "parts"
PROOF = Path(__file__).parent / "generated" / "components-lib" / "proofs"

#: The featureSplit frame's proportion, and the width that covers a 2x display.
#: Measured rather than assumed: the figure caps at 718 CSS px at a 2200px
#: viewport, so 1600 was genuinely 2.2x and the softness people reported was
#: depth of field in the renders, not resolution. 2400 removes the question.
CANVAS = (2400, 1852)
WIDTH = 2400

#: height/floor/cx are fractions of the canvas, per subject, because a row of
#: four DIMMs and a single long graphics card do not sit the same way.
JOBS = {
    "ddr5-pair":       dict(height=0.84, floor=0.88),
    "ddr5-quad":       dict(height=0.80, floor=0.88),
    "gpu-workstation": dict(height=0.66, floor=0.84),
    # m2-2280 is rendered but NOT staged: it came back with contacts on both
    # short ends. gen_parts.py records why a sixth roll is not obviously the
    # answer. Re-enable when a render passes the gate.
}

#: Softening boxes over invented silkscreen, as frame fractions, measured on the
#: render each one names. EMPTY until that render exists and has been read at
#: 100% -- an entry carried over from a previous roll blurs clean metal. Fill
#: with `python stage_parts.py --proof <name>`, which writes a gridded frame.
SOFTEN = {
    # One diagonal run of pseudo-silkscreen along the PCB between the shroud
    # and the gold contacts -- character-like marks, unreadable, exactly where
    # a board revision and a part number belong. Read off a gridded crop of
    # the strip (x 0.44-0.74, y 0.50-0.64), not estimated from a thumbnail:
    # two earlier guesses landed on the shroud vents above it.
    "gpu-workstation": [(0.460, 0.535, 0.665, 0.632)],
}

#: Blank white label plates, as (boxes, fill, thr). The fill is the surrounding
#: material's own median so the sticker disappears into it rather than becoming
#: a dark rectangle: on a matte black heat spreader that is ~(18,18,20), on a
#: bright brushed drive lid ~(180,180,180). A single hardcoded fill was wrong for
#: one of the two and shipped as a grey smudge.
LABELS = {
    # One blank sticker on the right-hand module. Found by the near-white
    # component scan (288k px inside the matte; the next two are 7k and 6k,
    # which are the crease highlight and some SMD, and must be left alone).
    # The fill is the spreader's own median beside the box, sampled, not
    # guessed -- tone_labels' default (46,46,50) is LIGHTER than this metal
    # and would read as a grey smudge rather than as no sticker at all.
    # thr is per-entry because the right value depends on what surrounds the
    # plate, not on the plate. 225 separates a sticker from a BRIGHT brushed
    # drive lid; against a spreader sitting at 22 it left the sticker's own
    # darker border behind as a thin lit rim. 170 has room either way here.
    "ddr5-pair": ([(0.560, 0.168, 0.638, 0.412)], (22, 22, 23), 170),
}


def stage(name, height, floor, cx=0.50):
    src = GEN / f"{name}.png"
    if not src.exists():
        print(f"  skip {name:17s} (not rendered yet)")
        return
    im = Image.open(src).convert("RGB")

    # Retouch BEFORE any resize, so the radius is in the render's own pixels.
    # install_am4 softens after reducing to 1600, so its radii are 1600-wide;
    # a bare radius=5 on a 5888-wide frame is a quarter of the intended blur,
    # which is exactly how a pseudo-word once survived a defocus and shipped.
    r = lambda px: max(2, round(px * im.width / 1600))
    if SOFTEN.get(name):
        im = ins.soften(im, SOFTEN[name], radius=r(4))
    if LABELS.get(name):
        boxes, fill, thr = LABELS[name]
        im = ins.tone_labels(im, boxes, thr=thr, plate=fill)

    part = cutout_image(im)
    part = part.crop(part.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())

    # Always write the magenta proof, never leave it to discipline. A matte that
    # has gone see-through over a dark face is invisible against this page's dark
    # ground and unmissable against magenta -- the first ddr5-pair roll shipped a
    # heat spreader with the backdrop showing through it, and the staged plate
    # looked fine until it was proofed. Coverage is printed for the same reason:
    # a number is checkable, an impression is not.
    PROOF.mkdir(parents=True, exist_ok=True)
    cov = np.asarray(part.getchannel("A")).astype(float).mean() / 255
    proof_im = Image.new("RGB", part.size, (255, 0, 180))
    proof_im.paste(part, (0, 0), part)
    proof_im.thumbnail((900, 900), Image.LANCZOS)
    proof_im.save(PROOF / f"matte-{name}.png")

    W, H = CANVAS
    canvas, _ = studio.compose(
        part, W, H, height=height, floor=floor, cx=cx,
        ground=studio.PLATE_GROUND, halo=(74, 70, 64), halo_at=0.30,
        glow=(150, 104, 60), glow_at=26)
    if canvas.width != WIDTH:
        canvas = canvas.resize((WIDTH, round(H * WIDTH / W)), Image.LANCZOS)

    DEST.mkdir(parents=True, exist_ok=True)
    out = DEST / f"{name}.webp"
    canvas.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:20s} {canvas.size}  {out.stat().st_size // 1024:>4}KB"
          f"   matte {cov:.3f}  proof {PROOF.name}/matte-{name}.png")


def proof(name):
    """Write a gridded frame, for measuring softening boxes off this render."""
    src = GEN / f"{name}.png"
    if not src.exists():
        print(f"  skip {name} (not rendered yet)")
        return
    im = Image.open(src).convert("RGB")
    out = GEN / f"proof-{name}.png"
    ins.grid(im, [], out)
    print(f"  {out.name}")


def whites(name, thr=225):
    """Report near-white components INSIDE the part, which is how a blank label
    plate is found.

    Quicker and more honest than reading a grid: at 225 the largest near-white
    component inside the matte is the sticker, at 200 it bleeds into a bright
    lid, at 240 it collapses to edge highlights.

    The mask is intersected with the matte, and that is not optional here. These
    renders stand on a LIGHT seamless, so without it the largest near-white
    region is the background -- and on the AM4 memory plate, which stood on a
    lit floor, the largest one was the floor. Toning either would paint the
    ground, not a label.
    """
    src = GEN / f"{name}.png"
    if not src.exists():
        return
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    H, W, _ = a.shape
    inside = np.asarray(cutout_image(im).getchannel("A")) > 160
    m = (a.min(axis=2) > thr) & ((a.max(axis=2) - a.min(axis=2)) < 22) & inside
    lab, n = ndimage.label(m)
    if not n:
        print(f"  {name}: no near-white region above {thr}")
        return
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    for i in np.argsort(sizes)[::-1][:3]:
        if sizes[i] < 3000:
            break
        ys, xs = np.where(lab == i + 1)
        print(f"  {name}: white {int(sizes[i]):>8}px  "
              f"x {xs.min()/W:.3f}-{xs.max()/W:.3f}  y {ys.min()/H:.3f}-{ys.max()/H:.3f}")


if __name__ == "__main__":
    args = sys.argv[1:]
    only = [a for a in args if not a.startswith("--")]
    for name, cfg in JOBS.items():
        if only and name not in only:
            continue
        if "--proof" in args:
            proof(name)
            whites(name)
        else:
            stage(name, **cfg)

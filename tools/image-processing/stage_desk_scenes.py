"""Put the REAL machine on the generated desk.

The scene arrives from gen_desk_scenes.py with no computer in it, on purpose.
This composites the photographed chassis into the empty space the prompt asked
for, with a contact shadow so it sits on the surface rather than floating over
it. brand_composite.py owns both operations and states the reason:

    "The image model cannot render the wordmark reliably... So we never ask it
     to. Instead the scene is generated brand-free, and the genuine assets are
     composited in afterwards. That makes the branding pixel-exact and the
     product genuine, with only the environment generated."

Three things that decide whether the result reads as a photograph:

  * The baked shadow comes OFF first. images/fronts/*.webp already carry a
    contact shadow at 34% alpha from shoot_fronts.py. Composited as-is, the
    product arrives with its studio shadow attached and then gets a second one
    from this pass -- the same double-shadow that made the SFF hover on the
    hero banner.
  * The cut-out is DIMMED and COOLED to the room. A studio-lit product dropped
    into a daylit office is brighter than everything around it and reads as
    pasted on; brand_composite.place takes both as arguments for exactly this.
  * Position and width are per scene, measured off the render rather than
    assumed, because the model puts the empty desk space where it likes.

THE GATE: read every output at full size. If the wordmark is not exactly
"Latios", or the scene grew a machine of its own next to the composited one,
discard it. banner-latios-tower.webp is what skipping this looks like.

    python stage_desk_scenes.py            # all
    python stage_desk_scenes.py mt-office
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

import brand_composite as bc

HERE = Path(__file__).parent
GEN = HERE / "generated" / "desk-scenes"
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
OUT = PUBLIC / "scenes"
WIDTH = 2000

#: scene -> which chassis, where it stands, how big, and how much to match it
#: to the room. cx/cy are the product's CENTRE as fractions of the scene;
#: width_frac is its width as a fraction of the scene width. All measured off
#: the rendered scene -- see `--probe`, which prints where the empty space is.
JOBS = {
    # Sized against the monitors in the frame rather than by eye: a 24-inch
    # display with its stand is about 450mm, the MT is 354 and the SFF 330,
    # so the product height is that ratio of the monitor height measured in
    # the scene. Getting this wrong is the difference between a tower on a
    # desk and a doll's-house prop.
    #: v2 rooms. The width changed as well as the position, and it had to: these
    #: desks run off the right edge of the frame, so the reserved area is much
    #: FURTHER AWAY than the spot the old numbers were measured at. Scale is
    #: re-derived per scene from the desk's own depth -- the near-to-far
    #: thickness of the surface at the product's column against its thickness at
    #: the monitors, which is the ratio of the two distances -- so a machine
    #: standing at the far end is drawn the size something at the far end is.
    "mt-office":     dict(src="fronts/mt.webp",  cx=0.720, cy=0.295, w=0.090, dim=0.88, cool=0.06),
    "mt-studio":     dict(src="fronts/mt.webp",  cx=0.720, cy=0.420, w=0.109, dim=0.92, cool=0.04),
    "mt-control":    dict(src="fronts/mt.webp",  cx=0.620, cy=0.569, w=0.085, dim=0.70, cool=0.14),
    "sff-desk":      dict(src="fronts/sff.webp", cx=0.680, cy=0.473, w=0.129, dim=0.90, cool=0.05),
    #: sff-reception is the ONE scene not re-rendered and not moved. Measuring
    #: it put the base 206px forward of the counter's edge and reading the
    #: composite at full size confirmed it: the machine is on the counter with
    #: the surface visible in front of and behind it. A working placement is not
    #: improved by re-rolling the room it works in.
    "sff-reception": dict(src="fronts/sff.webp", cx=0.345, cy=0.600, w=0.118, dim=0.95, cool=0.03),
    "sff-lab":       dict(src="fronts/sff.webp", cx=0.660, cy=0.495, w=0.084, dim=0.93, cool=0.04),
}

#: HOW cy IS NOW SET, and it is not by eye.
#:
#: The product's BASE has to land on the desk. Nothing checked that before:
#: cx/cy were set against monitor height in frame, which fixes the SCALE
#: correctly and says nothing about the depth. Drawing the placement box back
#: onto the empty rooms and reading it off a labelled grid showed five of six
#: wrong -- mt-office worst, with more than half the tower past the desk's right
#: end at x 0.79 and standing in front of the window. A product that is not on
#: the surface cannot be rescued by a contact shadow, because there is no
#: contact.
#:
#: So, per scene, read the desk's back edge at the product's column from the
#: grid overlay, and set
#:
#:     cy = base - height/2,   base = back_edge + about 0.2 * height
#:
#: which stands it clear of the horizon with some desk still visible behind it.
#: desk_plane.py writes the overlay these were read from, and --check below
#: prints the box so the numbers can be re-read rather than trusted.
#:
#: mt-office and mt-studio also needed the ROOM re-rendered: their desks had no
#: clear run of surface wide enough for a tower at any depth, because the model
#: had filled the reserved area with a cup, a plant and a tablet. See
#: gen_desk_scenes.py, whose prompts and negative now name those props.


def _cut(src):
    """The photographed chassis, with shoot_fronts' baked shadow removed."""
    cut = Image.open(PUBLIC / src).convert("RGBA")
    a = np.asarray(cut.getchannel("A"))
    cut.putalpha(Image.fromarray(np.where(a > 120, a, 0).astype(np.uint8)))
    return cut.crop(cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


def stage(name, src, cx, cy, w, dim, cool):
    scene_path = GEN / f"{name}.png"
    if not scene_path.exists():
        print(f"  skip {name:16s} (not rendered yet)")
        return
    scene = Image.open(scene_path).convert("RGBA")
    cut = _cut(src)

    scene = bc.place(scene, cut, cx=cx, cy=cy, width_frac=w,
                     shadow=True, dim=dim, cool=cool)

    scene = scene.convert("RGB")
    if scene.width != WIDTH:
        scene = scene.resize((WIDTH, round(scene.height * WIDTH / scene.width)),
                             Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{name}.webp"
    scene.save(out, "WEBP", quality=88, method=6)
    print(f"  {out.name:20s} {scene.size}  {out.stat().st_size // 1024:>4}KB")


def probe(name):
    """Print a coarse brightness map, to find the empty desk space.

    Nine by nine cells with mean luminance and local variance. A flat, evenly
    lit cell is clear surface; a busy one is a monitor or a chair. Quicker than
    reading a grid by eye, and it is the number the position is chosen from.
    """
    p = GEN / f"{name}.png"
    if not p.exists():
        return
    a = np.asarray(Image.open(p).convert("L")).astype(np.float32)
    H, W = a.shape
    print(f"  {name}  (row = y band, col = x band; lum/var)")
    for r in range(9):
        cells = []
        for c in range(9):
            blk = a[r * H // 9:(r + 1) * H // 9, c * W // 9:(c + 1) * W // 9]
            cells.append(f"{blk.mean():3.0f}/{blk.std():3.0f}")
        print("    " + " ".join(cells))


def check(name, out=None):
    """Draw the placement box on the EMPTY room, with a labelled grid.

    `probe` prints where the empty space is, which is how cx and the width were
    chosen, and it is genuinely useful for that. It cannot answer the question
    that actually decides whether the composite works -- is the product's BASE
    on the desk -- because a 9x9 mean says nothing about where the surface ends.
    Five of six placements were wrong on exactly that point and probe had
    reported them all as fine.

    So this draws the box and its base line over a grid labelled in the same
    fractions cx/cy are written in. Read the desk's near and far edge at the
    product's columns, check the base sits between them, and if it does not the
    number to change is right there in the same units.

        python stage_desk_scenes.py --check
    """
    p = GEN / f"{name}.png"
    if not p.exists():
        print(f"  skip {name:16s} (not rendered yet)")
        return None
    im = Image.open(p).convert("RGB")
    im = im.resize((1100, round(im.height * 1100 / im.width)), Image.LANCZOS)
    W, H = im.size
    j = JOBS[name]
    cut = _cut(j["src"])
    w = j["w"] * W
    h = w * cut.height / cut.width
    cx, cy = j["cx"] * W, j["cy"] * H

    d = ImageDraw.Draw(im, "RGBA")
    for i in range(1, 20):
        x = round(W * i / 20)
        d.line([x, 0, x, H], fill=(255, 40, 120, 90), width=1)
        d.text((x + 2, 4), f".{i*5:02d}", fill=(255, 220, 0))
    for k in range(1, 20):
        y = round(H * k / 20)
        d.line([0, y, W, y], fill=(0, 200, 255, 90), width=1)
        d.text((4, y + 2), f".{k*5:02d}", fill=(0, 255, 255))
    d.rectangle([cx - w/2, cy - h/2, cx + w/2, cy + h/2], outline=(255, 40, 120), width=3)
    d.line([0, cy + h/2, W, cy + h/2], fill=(255, 220, 0), width=2)
    print(f"  {name:16s} box x {j['cx']-j['w']/2:.3f}..{j['cx']+j['w']/2:.3f}  "
          f"base {(cy + h/2)/H:.3f}")
    if out:
        im.save(Path(out) / f"check-{name}.png")
    return im


if __name__ == "__main__":
    args = sys.argv[1:]
    out = HERE
    if "--out" in args:                      # strip before `only` is read, or
        i = args.index("--out")              # the path is taken for a scene name
        out = Path(args[i + 1])
        del args[i:i + 2]
    only = [a for a in args if not a.startswith("--")]
    for name, cfg in JOBS.items():
        if only and name not in only:
            continue
        if "--probe" in args:
            probe(name)
        elif "--check" in args:
            check(name, out)
        else:
            stage(name, **cfg)

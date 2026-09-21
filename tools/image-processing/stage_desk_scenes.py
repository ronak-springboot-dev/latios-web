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
from PIL import Image

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
    "mt-office":     dict(src="fronts/mt.webp",  cx=0.815, cy=0.335, w=0.132, dim=0.88, cool=0.06),
    "mt-studio":     dict(src="fronts/mt.webp",  cx=0.630, cy=0.345, w=0.129, dim=0.92, cool=0.04),
    "mt-control":    dict(src="fronts/mt.webp",  cx=0.680, cy=0.500, w=0.132, dim=0.70, cool=0.14),
    "sff-desk":      dict(src="fronts/sff.webp", cx=0.640, cy=0.515, w=0.128, dim=0.90, cool=0.05),
    "sff-reception": dict(src="fronts/sff.webp", cx=0.345, cy=0.600, w=0.118, dim=0.95, cool=0.03),
    "sff-lab":       dict(src="fronts/sff.webp", cx=0.680, cy=0.470, w=0.141, dim=0.93, cool=0.04),
}


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


if __name__ == "__main__":
    args = sys.argv[1:]
    only = [a for a in args if not a.startswith("--")]
    for name, cfg in JOBS.items():
        if only and name not in only:
            continue
        if "--probe" in args:
            probe(name)
        else:
            stage(name, **cfg)

"""Find the desk surface in a generated room, so a machine can be stood ON it.

WHY THIS EXISTS
---------------
stage_desk_scenes.JOBS places each chassis by cx/cy/width_frac, and its own
docstring claims those were "measured off the render rather than assumed". The
width was: it is the product's real height against a 24-inch monitor measured in
frame, and that number is right. The VERTICAL position was not. Nothing ever
checked the one thing that decides whether a composite reads as a photograph --
that the product's BASE lands on the desk rather than behind it.

Drawing the placement box back onto the empty rooms showed five of six wrong.
In mt-office the base sits about 38px (at 2000 wide) above the desk's back edge,
which puts the whole machine on the wall in front of the window; in sff-lab it
straddles the far edge of the bench with the background benches visible at the
same depth. The product hovers, and no amount of contact shadow fixes a contact
that is not there.

WHAT IT MEASURES
----------------
The desk is a large, fairly uniform plane. Flood from a seed known to be on it,
keep the largest connected component, and the topmost filled pixel in each
column is the desk's BACK EDGE at that column. That edge is the horizon of the
surface: a machine whose base is above it is behind the desk, and one whose base
is below it is on the desk, further forward the lower it goes.

So the placement rule becomes a measurement instead of a guess:

    base_y = back_edge(cx) + inset * machine_height

`inset` is how far forward of the back edge the product stands, as a fraction of
its own height, which keeps it consistent across the two chassis sizes. A little
desk has to remain visible behind the product or it reads as pasted onto the
edge.

WHAT IT IS NOT GOOD FOR, stated because it cost an hour to find out
------------------------------------------------------------------
A single global colour threshold cannot hold a lit desk. These surfaces carry a
strong light-to-shadow gradient across them, so the tolerance that reaches the
far end of the desk has already leaked into the wall: sweeping seed and
threshold on mt-studio and sff-desk gives either 30% coverage or a fill that
runs to the top of the frame, with nothing usable between.

So this is a DIAGNOSTIC, not the placement tool. Where it has coverage its
answer is decisive and was worth having -- it is what proved mt-office has no
desk at all under the machine's footprint, and that sff-lab's base sat 99px
behind the bench's edge. Where it does not, it says nan and must not be
believed; a nan here means "did not measure", never "no desk".

The placement itself is read off `stage_desk_scenes.py --check`, which draws the
box and its base line over a labelled grid. Slower, and right every time.

    python desk_plane.py                 # draw the detected edge on every room
    python desk_plane.py mt-office       # one of them
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

HERE = Path(__file__).parent
GEN = HERE / "generated" / "desk-scenes"
WIDTH = 2000

#: A point that is definitely ON the desk surface, as a fraction of the frame,
#: plus how tolerant the fill may be. These are the only hand-set numbers here
#: and each one is confirmed by the overlay this script writes -- a seed that
#: lands on a keyboard or a shadow produces an obviously wrong edge.
SEEDS = {
    "mt-office":     dict(seed=(0.34, 0.74), thresh=52),
    "mt-studio":     dict(seed=(0.42, 0.72), thresh=52),
    "mt-control":    dict(seed=(0.46, 0.66), thresh=44),
    "sff-desk":      dict(seed=(0.42, 0.72), thresh=52),
    "sff-reception": dict(seed=(0.40, 0.64), thresh=48),
    "sff-lab":       dict(seed=(0.42, 0.74), thresh=52),
}


def surface(name):
    """Return (edge_y_per_column, room_image) at WIDTH, edge NaN where no desk."""
    room = Image.open(GEN / f"{name}.png").convert("RGB")
    room = room.resize((WIDTH, round(room.height * WIDTH / room.width)), Image.LANCZOS)
    a = np.asarray(room, float)
    cfg = SEEDS[name]
    sx, sy = int(cfg["seed"][0] * WIDTH), int(cfg["seed"][1] * room.height)

    ref = a[sy, sx]
    near = np.sqrt(((a - ref) ** 2).sum(2)) < cfg["thresh"]
    lab, n = ndimage.label(near)
    if not n or not lab[sy, sx]:
        raise SystemExit(f"{name}: seed at ({sx},{sy}) is not on a region")
    mask = ndimage.binary_closing(lab == lab[sy, sx], np.ones((9, 9)))

    edge = np.full(WIDTH, np.nan)
    for x in range(WIDTH):
        col = np.flatnonzero(mask[:, x])
        if col.size > room.height * 0.02:        # ignore a few stray pixels
            edge[x] = col[0]
    return edge, room


def draw(name):
    edge, room = surface(name)
    d = ImageDraw.Draw(room)
    pts = [(x, edge[x]) for x in range(WIDTH) if not np.isnan(edge[x])]
    for x, y in pts:
        d.point((x, y), fill=(255, 40, 120))
    d.point((int(SEEDS[name]["seed"][0] * WIDTH),
             int(SEEDS[name]["seed"][1] * room.height)), fill=(0, 255, 0))
    cov = len(pts) / WIDTH
    return room, cov


if __name__ == "__main__":
    args = sys.argv[1:]
    out = HERE
    if "--out" in args:
        i = args.index("--out")
        out = Path(args[i + 1])
        del args[i:i + 2]
    only = [a for a in args if not a.startswith("--")]
    tiles = []
    for name in SEEDS:
        if only and name not in only:
            continue
        room, cov = draw(name)
        print(f"  {name:16s} desk edge found on {cov*100:5.1f}% of columns")
        tiles.append((name, room.resize((760, round(760 * room.height / WIDTH)))))
    tw, th = tiles[0][1].size
    sheet = Image.new("RGB", (tw * 2 + 8, (th + 22) * ((len(tiles) + 1) // 2)), (18, 18, 20))
    dd = ImageDraw.Draw(sheet)
    for i, (n, im) in enumerate(tiles):
        x, y = (i % 2) * (tw + 8), (i // 2) * (th + 22)
        sheet.paste(im, (x, y))
        dd.text((x + 4, y + th + 5), n, fill=(255, 220, 0))
    sheet.save(out / "desk-plane.png")
    print(f"  -> {out / 'desk-plane.png'}")

"""Put the AM4 component renders on the page's own backdrop.

    python stage_am4_parts.py              # all of them
    python stage_am4_parts.py ddr4-pair    # one

The plates used to arrive with a backdrop each: every prompt asked for a "subtle
reflective floor" and a "warm amber horizon glow", and every render invented a
different one. Beside the chassis card -- which stands on a gradient sampled off
the reference page -- they read as pictures borrowed from five places.

The model is asked for the object on black now, and the sky is replaced here, so
the parts and the machine share one backdrop. NOT by cutting the part out: that
was tried four ways and none survived a proof.

  rembg alone       excludes the ground plane the model draws anyway, which is
                    the hard half -- but alpha matting is built for hair and
                    glass, and a near-black heatspreader lit against near-black
                    gives it no edge. It cut one clean away.
  luminance alone   keeps every part pixel exactly, and keeps that ground plane
                    with them.
  the two combined  a per-component envelope over a luminance mask still lost
                    the heatspreader.
  geometry          dropping wide rows put each module on a grey plinth;
                    clipping each column at the part's base chewed the feet off.

So nothing is cut. Above the horizon the sky is black and unambiguous, and it
becomes the gradient; below it, parts, floor, contact shadow and reflection are
left exactly as rendered, already consistent with their own lighting. The
gradient's bottom stop is sampled from that floor so the two meet without a seam.

Not staged here:

  cooler-card  a corner bleed on the bento card's own ground rather than a framed
               picture, so it stays an RGBA cut with ramped edges (install_am4).
  cpu-ryzen    a photograph.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

import am4_studio as studio

GEN = Path(__file__).parent / "generated" / "am4"
DEST = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "am4"
WIDTH = 1600

# horizon: where each render's own ground plane begins, as a fraction of frame
# height, measured off a gridded proof. The canvas is one shape for all three --
# what the page's featureSplit frames already carry -- so the parts come out the
# same size on screen as each other.
JOBS = {
    "ddr4-pair":   dict(src="ddr4-pair",   horizon=0.841),
    "gpu-radeon":  dict(src="gpu-radeon",  horizon=0.793),
}

# storage-set is NOT here, and that is a decision rather than an omission.
#
# Four renders were made for it and every one failed on the same object. The
# third of the three drives came back as an open case with its board on show,
# then as a lid sliding off, then as a window into a PCB -- the model has a very
# strong prior that a hard drive is drawn showing its underside, and no amount of
# "closed on every face", "solid", "opaque" or a negative full of open enclosure,
# missing lid and visible pcb moved it. One of those four was my own doing: the
# prompt said the drive has "a bare dark green circuit board covering its
# underside", meaning it has a PCB underneath, and the model read it as an
# instruction to show one.
#
# The plate on the page is therefore the one that was already approved: three
# complete sealed objects, correct counts, on its own flat black. It is the only
# image in this section not sharing the backdrop, and it is the one to redo --
# most likely by photographing three real drives rather than describing them.
SKIPPED = {"storage-set"}
CANVAS = (1600, 1235)


def retouch(name, im):
    """The subtractive fixes install_am4 measured, applied before staging.

    They have to happen HERE now. Those polygons are in the raw render's own
    frame, and install_am4 used to apply them on its way to the page -- but these
    three no longer go through install_am4 at all, and the first staged graphics
    card came back carrying the pseudo-lettering on its PCB that the defocus
    exists to kill.

    Coordinates are valid only for the render they were measured on. gpu-radeon
    is the same file as before, so GPU_SOFTEN still fits; ddr4-pair and
    storage-set were re-rendered, so theirs were re-measured against the new
    frames (install_am4.py --check writes the gridded proofs).
    """
    import install_am4 as ins
    # install_am4 resizes to 1600 BEFORE it softens, so its radii are in
    # 1600-wide pixels. These renders are 5888 wide and are staged, not reduced,
    # so a bare radius=5 is about a quarter of the blur it was tuned to be --
    # which is exactly how "VOLL SPHIK" survived the defocus and reached a proof.
    r = lambda px: max(2, round(px * im.width / 1600))
    if name == "gpu-radeon":
        return ins.soften(im, ins.GPU_SOFTEN, radius=r(5))
    if name == "ddr4-pair" and ins.DDR4_LABELS:
        return ins.tone_labels(im, ins.DDR4_LABELS)
    if name == "storage-set":
        # Nothing yet. M2_TOP, LID_FILLS and LID_TEXT were measured against an
        # older frame and this render moved every one of them; applied blind they
        # painted a gold tab into open air. They are re-measured against whatever
        # the accepted render actually shows, or dropped when it shows no fault.
        return im
    return im


def sky_swap(im, horizon, ceiling=34, feather=0.012):
    """Replace the render's black sky with the page's backdrop. No matte.

    Cutting these plates out was tried four ways and none of them survived a
    proof. rembg excludes the model's unwanted floor perfectly but loses a
    near-black heatspreader lit against near-black -- it has no edge to find.
    Luminance keeps every part pixel exactly and keeps the floor with them.
    Bridging the two with a per-component envelope still lost the heatspreader;
    removing the floor by row width put each module on a grey plinth; clipping
    each column at the part's base chewed the feet off.

    All of that was in service of a backdrop. So take the backdrop directly: the
    sky above the horizon is black and unambiguous, and everything below it --
    parts, floor, contact shadow, reflection -- is left exactly as rendered,
    already consistent with its own lighting. The gradient's bottom stop is
    sampled FROM that floor, so the two meet without a seam.

      horizon  where the render's ground plane begins, as a fraction of height.
               Measured per render off a gridded proof, like every other constant
               in this pipeline.
      ceiling  luminance below which a sky pixel is sky. Generous: above the
               horizon there is nothing but background and the tops of the parts,
               and up there the parts are at their brightest.
    """
    W, H = im.size
    lum = np.asarray(im.convert("L")).astype(np.float32)
    arr = np.asarray(im).astype(np.float32)

    # The floor's own colour, from a band just under the horizon, ignoring the
    # parts standing on it (the darkest quartile of that band IS the plane).
    y0 = int(H * horizon)
    band = arr[y0:min(H, y0 + max(8, H // 40))]
    bl = lum[y0:min(H, y0 + max(8, H // 40))]
    sel = band[bl <= np.percentile(bl, 60)]
    floor_rgb = np.median(sel, axis=0) if sel.size else np.array([28.0, 28.0, 34.0])

    ground = studio.PLATE_GROUND[:-1] + ((1.00, tuple(int(v) for v in floor_rgb)),)
    bg = studio._ground(W, H, ground)

    rows = np.arange(H)[:, None]
    sky = np.clip((ceiling - lum) / ceiling, 0, 1) * (rows < y0)
    sky = np.asarray(Image.fromarray((sky * 255).astype(np.uint8))
                     .filter(ImageFilter.GaussianBlur(feather * H))).astype(np.float32) / 255
    out = np.asarray(bg).astype(np.float32) * sky[..., None] + arr * (1 - sky[..., None])
    return Image.fromarray(out.clip(0, 255).astype("uint8"))


# The storage plate, assembled from three single-object renders.
#
# Real millimetres, so the three are to scale with each other rather than to
# whatever the model felt like: M.2 2280 is 80 mm long, a 2.5-inch drive 100, a
# 3.5-inch drive 146. `lift` raises a part off the common floor line by a
# fraction of its own height, for the ones whose render sits them on a reflection.
# The M.2 is NOT here, and that is a decision.
#
# Four renders of it alternated between two faults that the framing traded off
# against each other: on a square canvas it came back correctly proportioned with
# its gold contacts running down a LONG edge, and with the contacts correctly on
# one end it came back square. On a wide canvas the proportion returned and the
# contacts moved back to the long side. The model has a strong prior that a long
# thin green board with an edge connector is a DIMM, and an M.2 is distinguished
# from a DIMM by exactly the thing it keeps getting wrong.
#
# A board whose connector runs down its length cannot be installed in anything,
# and sitting in the storage section directly under a memory section showing real
# DIMMs, it would read as a RAM stick. So the plate shows the two drives, which
# are right, and the M.2 stays in the spec row, the footnote and the bento glyph
# until there is a photograph of one.
STORAGE = [
    dict(src="part-ssd", mm=100),
    dict(src="part-hdd", mm=146),
]


def cut_object(path, floor=14):
    """Alpha from luminance. A single object on black needs nothing cleverer.

    The three-in-one plate needed a horizon and a sky swap because the model drew
    a ground plane under it. These do not: one object per frame comes back on
    black with only its own soft reflection, and everything above `floor` is the
    object.
    """
    im = Image.open(path).convert("RGB")
    im.thumbnail((2000, 2000), Image.LANCZOS)
    lum = np.asarray(im.convert("L")).astype(np.uint8)
    mask = ndimage.binary_fill_holes(lum > floor)
    labels, n = ndimage.label(mask)
    if n > 1:                                   # drop the reflection and any specks
        sizes = ndimage.sum(mask, labels, range(1, n + 1))
        mask = labels == (int(np.argmax(sizes)) + 1)
    rgba = im.convert("RGBA")
    rgba.putalpha(Image.fromarray((mask * 255).astype(np.uint8))
                  .filter(ImageFilter.GaussianBlur(0.6)))
    return rgba.crop(rgba.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


def storage_set(gap=0.030, floor=0.70, widest=0.50):
    """Three drives on one stage, sized against each other in millimetres."""
    parts = []
    for cfg in STORAGE:
        src = GEN / f"{cfg['src']}.png"
        if not src.exists():
            print(f"  skip storage-set ({src.name} not rendered yet)")
            return
        parts.append((cut_object(src), cfg["mm"]))

    W, H = CANVAS
    scale = (widest * W) / max(mm for _, mm in parts)      # px per mm
    sized = []
    for im, mm in parts:
        w = round(mm * scale)
        sized.append(im.resize((w, round(im.height * w / im.width)), Image.LANCZOS))

    total = sum(i.width for i in sized) + round(gap * W) * (len(sized) - 1)
    x = (W - total) // 2
    base = round(H * floor)
    canvas = studio._ground(W, H, studio.PLATE_GROUND)
    shadow = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(shadow)
    for im in sized:
        y = base - im.height
        d.ellipse([x - im.width * 0.02, base - H * 0.009,
                   x + im.width * 1.02, base + H * 0.013], fill=205)
        x += im.width + round(gap * W)
    canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), canvas,
                             shadow.filter(ImageFilter.GaussianBlur(W / 150)))
    x = (W - total) // 2
    for im in sized:
        canvas.paste(im, (x, base - im.height), im)
        x += im.width + round(gap * W)

    canvas = canvas.resize((WIDTH, round(H * WIDTH / W)), Image.LANCZOS)
    out = DEST / "storage-set.webp"
    canvas.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:18s} {canvas.size}  {out.stat().st_size // 1024:>4}KB")


def stage_cut(name, src, height=0.62, floor=0.80, cx=0.50):
    """Cut the part off its black ground and stand it on the page's backdrop.

    The companion to sky_swap, and the better path when the render HAS no ground
    of its own to keep. Bright high-key plates come back as an object on black
    with at most a soft reflection, which cut_object handles exactly; the sky
    swap exists for the older, murkier plates where the model drew a floor the
    prompt had forbidden and the two could not be separated.
    """
    render = GEN / f"{src}.png"
    if not render.exists():
        print(f"  skip {name:13s} ({render.name} not rendered yet)")
        return
    part = cut_object(render)
    W, H = CANVAS
    canvas, _ = studio.compose(
        part, W, H, height=height, floor=floor, cx=cx,
        ground=studio.PLATE_GROUND, halo=(74, 70, 64), halo_at=0.30,
        glow=(150, 104, 60), glow_at=26)
    canvas = canvas.resize((WIDTH, round(H * WIDTH / W)), Image.LANCZOS)
    out = DEST / f"{name}.webp"
    canvas.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:18s} {canvas.size}  {out.stat().st_size // 1024:>4}KB")


def stage(name, src, horizon, crop=None):
    render = GEN / f"{src}.png"
    if not render.exists():
        print(f"  skip {name:13s} ({render.name} not rendered yet)")
        return
    im = retouch(name, Image.open(render).convert("RGB"))
    if crop:
        w, h = im.size
        im = im.crop((int(w * crop[0]), int(h * crop[1]), int(w * crop[2]), int(h * crop[3])))
    im = im.resize(CANVAS, Image.LANCZOS)
    im = sky_swap(im, horizon)
    im = im.resize((WIDTH, round(CANVAS[1] * WIDTH / CANVAS[0])), Image.LANCZOS)
    out = DEST / f"{name}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:18s} {im.size}  {out.stat().st_size // 1024:>4}KB")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    DEST.mkdir(parents=True, exist_ok=True)
    for name, cfg in JOBS.items():
        if only and name not in only:
            continue
        stage(name, **cfg)
    if not only or "storage-set" in only:
        storage_set()

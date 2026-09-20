"""Install the mt-amd-am4 renders into public/images/am4/ at production size.

    python install_am4.py            # install everything present
    python install_am4.py --check    # also write gridded previews of the retouch
                                     # regions, to confirm the boxes before shipping

Sizes: every image on this page is drawn at most about half the 1600px content
width, i.e. ~800 CSS px, so 1600 wide covers a 2x display. The text-to-image
plates come out of the graph already 4x upscaled (5888 wide) and are simply
reduced; the two edits come out at the model's ~1.5 megapixels and go through
RealESRGAN first.

This file now installs only the two images that still pass through it whole --
cpu-ryzen and hero-front -- plus the two bento cards at the foot. The component
plates moved to stage_am4_parts.py when they moved onto the page's backdrop, and
their retouch coordinates went with them; the constants stay here because that
is where they were measured and where the proofs are written.

One retouch, subtractive -- nothing is added or restyled:

  cpu-ryzen  the source photograph is a Ryzen 7 3700X, and this page sells a
             5700G. The model-number line and the fine print (which carries a
             2019 date code) get a depth-of-field falloff; AMD and RYZEN are left
             exactly as photographed. Same treatment as the homepage CPU banners.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

import comfy_client as cc

GEN = Path(__file__).parent / "generated" / "am4"
DEST = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "am4"
WIDTH = 1600

# name -> needs ESRGAN first (edits are model-sized; t2i plates are already 4x).
# hero-front does not: it is drawn at most ~635 CSS px wide, so the edit's native
# 1472 covers a 2x display. The two bento cards are built separately, below.
# gpu-radeon, ddr4-pair and storage-set left this file when they moved onto the
# product's own backdrop: they are cut and staged in stage_am4_parts.py now, and
# installing them from here as well would overwrite the staged versions with the
# raw plates. desk-dual left when its card became a photograph (gen_am4_photos).
ASSETS = {"cpu-ryzen": True, "hero-front": False}

SOURCES = {}
CARD_FROM = {}

# desk-dual now carries the real MT, and is cropped to the monitors, the tower
# and the lamp: at card size (~370 CSS px) the full plate left them small.
DESK_CROP = (0.26, 0.17, 0.97, 0.87)

# The blank label plates on ddr4-pair, as frame fractions, re-measured off a
# gridded proof of the high-key render. Each generation of this plate has put
# them somewhere new -- four boxes when both modules stood square to the camera,
# one when they were staggered, two now -- so the constant is re-measured with
# the render rather than carried forward. Applied to the wrong frame these paint
# dark rectangles onto clean metal.
#
# The box can be generous: tone_labels only takes pixels that are bright in all
# three channels, so the dark heatspreader inside the same rectangle is untouched.
DDR4_LABELS = [(0.268, 0.555, 0.395, 0.890), (0.498, 0.525, 0.640, 0.868)]

# Defocus regions on cpu-ryzen, as polygons in frame fractions, measured off a
# gridded proof of the render. Polygons, not rectangles: the chip sits at an
# angle, so its lines of print run diagonally. A rectangle round the model number
# either stopped short of "00X" or reached down into the AMD logo beneath it, and
# a rectangle round the fine print would have half-blurred the DataMatrix code --
# which reads as damage rather than focus.
CPU_SOFTEN = [
    # "AMD Ryzen 7 3700X" -- the slanted line above the AMD logo. The lower edge
    # bends at x=0.52: left of it the AMD logo sits just below the line, right of
    # it there is bare lid, so the region drops to take "3700X" well inside the
    # feather instead of on it (at the old straight edge the "X" was still legible).
    [(0.428, 0.262), (0.685, 0.330), (0.678, 0.438), (0.520, 0.378),
     (0.428, 0.338)],
    # part code, the 1940 date code, "(c) 2019 AMD", origin -- clear of the barcode.
    # The left edge follows the slant of the line starts, between them and the
    # barcode's right edge.
    [(0.410, 0.548), (0.582, 0.573), (0.592, 0.788), (0.342, 0.780),
     (0.352, 0.662), (0.384, 0.608)],
]

# Defocus region on gpu-radeon, re-measured against the high-key render.
#
# The earlier, murkier plate left pseudo-lettering along the PCB strip; this one
# has a clean PCB and puts its garble on the FAN HUB instead -- a debossed row of
# characters exactly where a maker's logo sits. Unreadable at display size, and
# precisely what this page must not carry: a mark in a logo's position is an
# invented brand.
GPU_SOFTEN = [(0.505, 0.468, 0.585, 0.512)]

# Defocus regions on desk-dual: a small logo-like mark centred on each monitor's
# chin. Illegible, but a mark in a logo's position is an invented brand.
DESK_SOFTEN = [(0.375, 0.523, 0.396, 0.542), (0.598, 0.574, 0.620, 0.593)]


# storage-set, second render: right count, three local faults, all measured off
# gridded proofs as frame fractions.
#
#   M2_TOP    the circuit-board stick came back with gold contacts at BOTH ends.
#             An M.2 drive has one edge connector; the top block is painted out
#             in board green, shaded between two median samples of the board
#             below it (a median ignores the thin gold traces crossing them).
#   LID_FILLS two dark moire smudges on the 3.5-inch drive's lid. The lid is a
#             smooth vertical gradient, so each row is rebuilt by interpolating
#             between clean bands either side -- that restores the gradient and,
#             unlike a blur, pulls in nothing from the rim.
#   LID_TEXT  pseudo-lettering in the lid's slot bar. Defocused, not filled: the
#             bar's own outline runs right past it.
M2_TOP = [(0.2045, 0.1720), (0.2875, 0.1860), (0.2875, 0.2225), (0.2045, 0.2085)]
M2_GREEN = [(0.205, 0.214, 0.225, 0.232), (0.262, 0.222, 0.288, 0.238)]   # left, right samples
LID_FILLS = [  # box, left clean band (x0, x1), right clean band (x0, x1)
    ((0.664, 0.328, 0.764, 0.456), (0.648, 0.660), (0.766, 0.772)),
    ((0.676, 0.718, 0.768, 0.805), (0.655, 0.672), (0.770, 0.774)),
]
LID_TEXT = [(0.612, 0.274, 0.643, 0.292)]


def _feather(size, draw, radius):
    m = Image.new("L", size, 0)
    draw(ImageDraw.Draw(m))
    return m.filter(ImageFilter.GaussianBlur(radius))


def row_fill(im, box, left, right, feather=6):
    """Rebuild a box row by row, interpolating between two clean sample bands."""
    w, h = im.size
    arr = np.asarray(im).astype(float)
    x0, y0, x1, y1 = int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3])
    L = np.median(arr[y0:y1, int(w * left[0]):int(w * left[1])], axis=1)
    R = np.median(arr[y0:y1, int(w * right[0]):int(w * right[1])], axis=1)
    k = np.ones(9) / 9                                   # smooth down the rows: no streaks
    L = np.stack([np.convolve(np.pad(L[:, c], 4, mode="edge"), k, "valid") for c in range(3)], 1)
    R = np.stack([np.convolve(np.pad(R[:, c], 4, mode="edge"), k, "valid") for c in range(3)], 1)
    t = np.linspace(0, 1, x1 - x0)[None, :, None]
    out = arr.copy()
    out[y0:y1, x0:x1] = L[:, None, :] * (1 - t) + R[:, None, :] * t
    mask = _feather(im.size, lambda d: d.rectangle(
        [x0 + feather, y0 + feather, x1 - feather, y1 - feather], fill=255), feather / 2)
    return Image.composite(Image.fromarray(out.clip(0, 255).astype("uint8")), im, mask)


def poly_fill(im, poly, samples, feather=2):
    """Paint a polygon in a left-to-right gradient between two median samples."""
    w, h = im.size
    arr = np.asarray(im).astype(float)
    cols = [np.median(arr[int(h * b[1]):int(h * b[3]), int(w * b[0]):int(w * b[2])].reshape(-1, 3), axis=0)
            for b in samples]
    xs = [x for x, _ in poly]
    t = np.clip((np.arange(w) - w * min(xs)) / (w * (max(xs) - min(xs))), 0, 1)[None, :, None]
    paint = np.broadcast_to(cols[0] * (1 - t) + cols[1] * t, arr.shape)
    mask = _feather(im.size, lambda d: d.polygon([(w * x, h * y) for x, y in poly], fill=255), feather)
    return Image.composite(Image.fromarray(paint.clip(0, 255).astype("uint8")), im, mask)


# Regions of hero-front taken back from its staging, as frame fractions. The
# studio relight kept the wordmark but redrew the port panel's printed icons --
# the headphone mark came back as "c2", the indicator marks and the USB-C label
# as new glyphs. The staging already carries the studio light, so the patch
# matches; the wordmark is restored too, as insurance.
FRONT_KEEP = [(0.580, 0.155, 0.632, 0.505),      # port panel
              (0.378, 0.135, 0.425, 0.245)]      # wordmark


def restore_regions(im, ref_path, boxes, feather=6):
    """Paste boxes of the pre-model staging back over the render."""
    ref = Image.open(ref_path).convert("RGB").resize(im.size, Image.LANCZOS)
    w, h = im.size
    mask = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(mask)
    for x0, y0, x1, y1 in boxes:
        d.rectangle([w * x0 + feather, h * y0 + feather, w * x1 - feather, h * y1 - feather], fill=255)
    return Image.composite(ref, im, mask.filter(ImageFilter.GaussianBlur(feather / 2)))


def restore_tower(im):
    """Paste the photographed tower back over the desk render.

    Even at 0.28 the relight redrew the tower's lettering at this size: the
    wordmark came back as scribble and the port panel as smudges. The scene
    around it -- the lamp's light on the desk, the shadow -- stays the
    render's; the tower itself is the photograph, placed exactly where the
    staging put it.
    """
    from gen_am4_edits import DESK_H, DESK_W, desk_tower_layout
    if im.size != (DESK_W, DESK_H):
        im = im.resize((DESK_W, DESK_H), Image.LANCZOS)
    cut, xy = desk_tower_layout()
    im = im.copy()
    im.paste(cut.convert("RGB"), xy, cut.getchannel("A"))
    return im


def tone_labels(im, boxes):
    """Darken near-white blank label plates to a dark grey plate.

    "White" is the darkest channel, not luminance: the floor under the
    reflections is lit amber, bright enough to pass a luminance test, but its
    blue channel is low -- a white plate is bright in all three.
    """
    w, h = im.size
    r, g, b = im.split()
    white = ImageChops.darker(ImageChops.darker(r, g), b)
    mask = Image.new("L", im.size, 0)
    for x0, y0, x1, y1 in boxes:
        box = (int(w * x0), int(h * y0), int(w * x1), int(h * y1))
        region = white.crop(box).point(lambda v: 255 if v > 140 else 0)
        mask.paste(region, box[:2])
    mask = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(3))
    plate = Image.new("RGB", im.size, (46, 46, 50))
    return Image.composite(plate, im, mask)


def _shape(d, region, w, h, **kw):
    """Draw a region given either as (x0, y0, x1, y1) or as a list of points."""
    if isinstance(region, (list,)) and region and isinstance(region[0], tuple):
        d.polygon([(w * x, h * y) for x, y in region], **kw)
    else:
        x0, y0, x1, y1 = region
        d.rectangle([w * x0, h * y0, w * x1, h * y1], **kw)


def soften(im, boxes, radius):
    w, h = im.size
    mask = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(mask)
    for region in boxes:
        _shape(d, region, w, h, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius * 1.6))
    return Image.composite(im.filter(ImageFilter.GaussianBlur(radius)), im, mask)


# --- the bento cards -------------------------------------------------------
# In the feature grid the image IS the card: it fills the tile edge to edge and
# the title sits over its dark top, the way the reference page does it. Most
# cards need no new file -- object-cover crops the render they already have, and
# every one of those is framed with enough margin to survive the crop at both
# column widths. Two do:
#
#   chassis-card  the card is portrait and the tile is landscape, so it is
#                 restaged rather than cropped (gen_am4_edits.side_card).
#   cooler-card   sits in the corner of a card it does not fill, bleeding off
#                 the bottom-right. Its top and left edges are ramped to
#                 transparent so it meets the card's ground with no seam --
#                 cheaper and more exact than segmenting a black-on-black render.
#   desk-card     the one bright picture in the grid. Behind a title it stayed
#                 bright whatever the scrim did, so it sits in the lower three
#                 quarters of its card with the title on the card's own ground
#                 above -- the reference's treatment for its desk photograph --
#                 and only its top edge is ramped, to dissolve that boundary.

def feather(im, left=0.26, top=0.30):
    """RGBA with the top and left edges ramped to transparent. 0 skips an edge."""
    W, H = im.size
    ramp = lambda n, f: (np.clip(np.arange(n) / (f * n), 0, 1) ** 1.2 if f else np.ones(n))
    lx, ty = ramp(W, left), ramp(H, top)
    out = im.convert("RGBA")
    out.putalpha(Image.fromarray((255 * lx[None, :] * ty[:, None]).astype("uint8")))
    return out


def build_cards():
    from gen_am4_edits import front_card
    canvas, dims = front_card()
    save(canvas, "chassis-card")
    print("  chassis-card dims", dims)

    cooler = Image.open(GEN / "cooler.png").convert("RGB")
    cooler = cooler.resize((1000, round(cooler.height * 1000 / cooler.width)), Image.LANCZOS)
    save(feather(cooler), "cooler-card")


def save(im, name):
    out = DEST / f"{name}.webp"
    im.save(out, "WEBP", quality=90, method=6, exact=im.mode == "RGBA")
    print(f"  {out.name:18s} {im.size}  {out.stat().st_size // 1024:>4}KB")


def grid(im, boxes, out):
    g = im.copy().convert("RGB")
    g.thumbnail((1400, 1400))
    d = ImageDraw.Draw(g)
    W, H = g.size
    for i in range(1, 20):
        x = int(W * i / 20); d.line([(x, 0), (x, H)], fill=(255, 60, 60))
        y = int(H * i / 20); d.line([(0, y), (W, y)], fill=(60, 170, 255))
        if i % 2 == 0:
            d.text((x + 2, 2), f"{i/20:.2f}", fill=(255, 90, 90))
            d.text((2, y + 2), f"{i/20:.2f}", fill=(90, 190, 255))
    for region in boxes:
        _shape(d, region, W, H, outline=(255, 220, 0), width=3)
    g.save(out)


if __name__ == "__main__":
    check = "--check" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    DEST.mkdir(parents=True, exist_ok=True)
    for name, needs_up in ASSETS.items():
        if only and name not in only:
            continue
        src = GEN / f"{SOURCES.get(name, name)}.png"
        if not src.exists():
            print(f"  skip {name:13s} (not rendered yet)")
            continue
        im = Image.open(src).convert("RGB")
        if check and name == "ddr4-pair":
            grid(im, DDR4_LABELS, GEN / "check-ddr4.png")
        if check and name == "cpu-ryzen":
            grid(im, CPU_SOFTEN, GEN / "check-cpu.png")
        if check and name == "gpu-radeon":
            grid(im, GPU_SOFTEN, GEN / "check-gpu.png")
        if needs_up:
            im = Image.open(cc.upscale(str(src), f"am4-{name}-up.png")).convert("RGB")
        if name == "desk-dual":
            im = restore_tower(im)                       # before resizing: staging geometry
        if name == "hero-front":
            im = restore_regions(im, GEN / "hero-front-ref.png", FRONT_KEEP)
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
        if name == "ddr4-pair":
            im = tone_labels(im, DDR4_LABELS)
        if name == "cpu-ryzen":
            im = soften(im, CPU_SOFTEN, radius=10)
        if name == "gpu-radeon":
            im = soften(im, GPU_SOFTEN, radius=5)
        if name == "desk-dual":
            im = soften(im, DESK_SOFTEN, radius=4)       # full-frame coordinates
            w, h = im.size
            im = im.crop((int(w * DESK_CROP[0]), int(h * DESK_CROP[1]),
                          int(w * DESK_CROP[2]), int(h * DESK_CROP[3])))
        if name == "storage-set":
            im = poly_fill(im, M2_TOP, M2_GREEN)
            for box, left, right in LID_FILLS:
                im = row_fill(im, box, left, right)
            im = soften(im, LID_TEXT, radius=3)
        if name in CARD_FROM:
            # Installed only as its card: the desk plate is retouched, the tower
            # restored and the frame cropped by everything above, and the card is
            # that same picture with its top edge ramped. Writing both would
            # leave an unreferenced file behind on every run.
            save(feather(im, left=0, top=0.26), CARD_FROM[name])
            continue
        out = DEST / f"{name}.webp"
        im.save(out, "WEBP", quality=88, method=6)
        print(f"  {out.name:18s} {im.size}  {out.stat().st_size // 1024:>4}KB")

    # A targeted run rebuilds only what was named; a full run rebuilds the cards
    # too, since they are cut from the very files it has just written.
    if "--cards" in sys.argv or not only:
        build_cards()

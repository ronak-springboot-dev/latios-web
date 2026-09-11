"""Install the mt-amd-am4 renders into public/images/am4/ at production size.

    python install_am4.py            # install everything present
    python install_am4.py --check    # also write gridded previews of the retouch
                                     # regions, to confirm the boxes before shipping

Sizes: every image on this page is drawn at most about half the 1600px content
width, i.e. ~800 CSS px, so 1600 wide covers a 2x display. The text-to-image
plates come out of the graph already 4x upscaled (5888 wide) and are simply
reduced; the two edits come out at the model's ~1.5 megapixels and go through
RealESRGAN first.

Two retouches, both subtractive -- nothing is added or restyled:

  ddr4-pair  each heatspreader came back carrying a blank white label. No text,
             so nothing garbled, but a bright blank rectangle reads unfinished.
             Toned to a dark plate so it reads as a label area, not a hole.

  cpu-ryzen  the source photograph is a Ryzen 7 3700X, and this page sells a
             5700G. The model-number line and the fine print (which carries a
             2019 date code) get a depth-of-field falloff; AMD and RYZEN are left
             exactly as photographed. Same treatment as the homepage CPU banners.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

import comfy_client as cc

GEN = Path(__file__).parent / "generated" / "am4"
DEST = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "am4"
WIDTH = 1600

# name -> needs ESRGAN first (edits are model-sized; t2i plates are already 4x).
# hero-chassis does not: it is drawn at most half the content width, ~540 CSS
# px, so its native 1472 covers a 2x display -- and ESRGAN would sharpen the
# very dust clean_hero removes.
ASSETS = {
    "gpu-radeon": False, "ddr4-pair": False, "storage-set": False,
    "cooler": False, "desk-dual": False,
    "cpu-ryzen": True, "hero-front": False, "chassis-tile": False,
}

# Assets built from another asset's render. chassis-tile is the relit side view
# kept on its own dark ground, for the bento's Compact design card: shipped
# transparent on the card's white face, it read as a black slab.
SOURCES = {"chassis-tile": "hero-chassis", "desk-dual": "desk-tower"}

# desk-dual now carries the real MT, and is cropped to the monitors, the tower
# and the lamp: at card size (~370 CSS px) the full plate left them small.
DESK_CROP = (0.26, 0.17, 0.97, 0.87)

# The hero render's side panel, and the mesh window inside it, as fractions of
# the 1472x1136 render (measured off a gridded proof). Dust comes off the panel
# only: a median filter over the perforation would erase it.
HERO_PANEL = (0.232, 0.108, 0.715, 0.825)
HERO_MESH = (0.285, 0.192, 0.505, 0.660)

# Label plates on ddr4-pair, as frame fractions (measured off the render), and
# their reflections in the floor below -- toning the plates alone would leave
# two white reflections under two dark labels.
DDR4_LABELS = [(0.326, 0.600, 0.378, 0.770), (0.551, 0.600, 0.603, 0.770),
               (0.322, 0.862, 0.382, 0.995), (0.547, 0.862, 0.607, 0.995)]

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

# Defocus regions on gpu-radeon. The model's text suppression held everywhere
# but the PCB strip between shroud and gold fingers, where it left a line of
# pseudo-lettering ("NOLL SHNE") and two smaller silkscreen marks. Unreadable
# at display size, but garbled text is exactly what this page must not carry.
GPU_SOFTEN = [(0.462, 0.679, 0.522, 0.710), (0.318, 0.660, 0.374, 0.702)]

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


# chassis-tile is shifted up by this fraction of its height: the depth label
# hangs below its line, and at 375 and 1024px it ran off the tile's bottom edge
# onto the card. There is 8% of empty ground above the chassis to spare.
TILE_SHIFT = 0.05


def shift_up(im, frac):
    """Move the picture up by frac of its height, continuing the floor below."""
    w, h = im.size
    dy = int(h * frac)
    out = Image.new(im.mode, im.size)
    out.paste(im.crop((0, dy, w, h)), (0, 0))
    strip = im.crop((0, h - max(2, h // 100), w, h)).resize((w, dy), Image.BILINEAR)
    out.paste(strip, (0, h - dy))
    return out


def tile_dims():
    """Callout geometry for chassis-tile, in percent of the tile.

    Read off the staging rather than measured by eye: hero_layout says where the
    cutout landed, and the cutout's own proofs say where its corners are -- the
    rear edge at 5% of its width, the rear foot's floor contact at 96.9% of its
    height. Scaling the render from 1140 to 1136 rows changes no percentage.
    """
    from am4_chassis import cutout
    from gen_am4_edits import HERO_H, HERO_W, hero_layout
    cut, (ox, oy) = hero_layout(cutout())
    cw, ch = cut.size
    pct = lambda v, s: round(v / s * 100, 1)
    ypct = lambda v: round((v / HERO_H - TILE_SHIFT) * 100, 1)
    rear = ox + 0.05 * cw
    return {
        "aspect": "1600 / 1235",           # the installed file, not the staging
        "h": {"x": pct(rear - 0.03 * HERO_W, HERO_W), "y1": ypct(oy),
              "y2": ypct(oy + 0.969 * ch)},
        "d": {"x1": pct(rear, HERO_W), "x2": pct(ox + cw, HERO_W),
              # 1.5% under the feet: at 1024px the tile is 177px tall, and the
              # label hanging below the line needs the rest of it.
              "y": ypct(oy + ch + 0.015 * HERO_H)},
    }


def clean_hero(im):
    """Two retouches on the relit chassis, both restoring what should be there.

    Dust: the photographed panel carries dust and hairline scratches, and the
    relight kept them -- at hero size they read as a dirty unit. On the panel
    and off the mesh, a pixel brighter than its 7px median by more than 22
    levels takes the median's value. Texture and edges are left alone.

    Shadow: the render was staged before am4_chassis learned to blacken the
    sweep's baked-in grey shadow, so it carries a pale halo under the lip. Under
    the lip, the fixed cutout's black shadow replaces the render.

    Ground: kept. This is the Compact design tile, a picture on its own dark
    ground. The transparent cut of it that once opened the page read as a black
    slab on a light page; the front view replaced it there.
    """
    from am4_chassis import LIP, cutout
    from gen_am4_edits import hero_ground, hero_layout

    w, h = im.size

    med = im.filter(ImageFilter.MedianFilter(7))
    speck = ImageChops.subtract(im.convert("L"), med.convert("L"))
    speck = speck.point(lambda v: 255 if v > 22 else 0).filter(ImageFilter.MaxFilter(3))
    region = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(region)
    d.rectangle([w * HERO_PANEL[0], h * HERO_PANEL[1], w * HERO_PANEL[2], h * HERO_PANEL[3]], fill=255)
    d.rectangle([w * HERO_MESH[0], h * HERO_MESH[1], w * HERO_MESH[2], h * HERO_MESH[3]], fill=0)
    im = Image.composite(med, im, ImageChops.multiply(speck, region))

    cut, (ox, oy) = hero_layout(cutout())
    staged = Image.new("RGB", hero_ground().size, (0, 0, 0))   # shadow is black, at its alpha
    staged.paste(cut.convert("RGB"), (ox, oy))
    alpha = Image.new("L", staged.size, 0)
    alpha.paste(cut.getchannel("A"), (ox, oy))
    (x0, y0), (x1, y1) = LIP

    def at(xf):                            # a point on the lip line, 0.2% below it
        yf = y0 + (xf - x0) * (y1 - y0) / (x1 - x0) + 0.002
        return ox + xf * cut.width, oy + yf * cut.height

    band = Image.new("L", staged.size, 0)
    left, right = at(-0.04), at(1.04)
    ImageDraw.Draw(band).polygon(
        [left, right, (right[0], oy + cut.height + 40), (left[0], oy + cut.height + 40)], fill=255)
    band = band.filter(ImageFilter.GaussianBlur(1.5))
    # The model returned 1136 rows for a 1140-row staging; scale, don't crop.
    staged, band, alpha = (x.resize(im.size, Image.LANCZOS) for x in (staged, band, alpha))
    # The shadow band comes from the ground, darkened by the cutout's shadow
    # alpha -- the render's floor matches that ground to within two levels, so
    # there is no seam.
    ground = hero_ground().resize(im.size, Image.LANCZOS)
    a = np.asarray(alpha).astype(float)[..., None] / 255
    shaded = np.asarray(ground).astype(float) * (1 - a) + np.asarray(staged).astype(float) * a
    return Image.composite(Image.fromarray(shaded.clip(0, 255).astype("uint8")), im, band)


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
        if name == "chassis-tile":
            # Lifted: on its own near-black ground the panel's texture was lost.
            im = shift_up(ImageEnhance.Brightness(clean_hero(im)).enhance(1.15), TILE_SHIFT)
            print("  chassis-tile dims", tile_dims())
        if needs_up:
            im = Image.open(cc.upscale(str(src), f"am4-{name}-up.png")).convert("RGB")
        if name == "desk-dual":
            im = restore_tower(im)                       # before resizing: staging geometry
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
        out = DEST / f"{name}.webp"
        im.save(out, "WEBP", quality=88, method=6)
        print(f"  {out.name:18s} {im.size}  {out.stat().st_size // 1024:>4}KB")

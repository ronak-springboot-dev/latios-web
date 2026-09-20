"""The photo-based renders for the mt-amd-am4 page.

All are EDITS at low denoise, because every subject must survive exactly:

  hero-front    the real MT from the front: the ribbed fascia and the Latios
                wordmark. Keystone-corrected and studio-lit in am4_studio before
                the model sees it; the model's pass only makes that light
                photographic, at a denoise low enough to keep the lettering.

  chassis-tile  the real MT from the side, for the Compact design card, lit the
                same way. Its mesh window sits over the board of the unit that
                was shot, an Intel Q670, so am4_chassis.cutout redraws the mesh as
                perforated steel with nothing behind it before any light is
                added -- a relight "develops" detail out of shadow.

  desk-tower    the photographed MT standing on the desk plate under the lamp.

  cpu-ryzen     a Ryzen 7 in a real AM4 socket. The source photograph is a
                3700X; the AMD and RYZEN marks are genuine and stay, the model
                number is defocused afterwards (install_am4), because this page
                sells a 5700G.
"""
import os
import sys
from pathlib import Path

os.environ["LATIOS_UNET"] = "2511"
sys.path.insert(0, str(Path(__file__).parent))
import am4_studio as studio  # noqa: E402
import comfy_client as cc  # noqa: E402

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter  # noqa: E402

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
WORK = Path(__file__).parent / "generated" / "am4"
WORK.mkdir(parents=True, exist_ok=True)

NEG = ("misspelt text, garbled lettering, mirrored text, distorted logo, invented "
       "branding, extra text, watermark, second device, changed chassis, visible "
       "motherboard, visible components behind the mesh, wooden desk, room, hands, "
       "cartoon, illustration, oversaturated, blue cast, blurry")

FRONT_W, FRONT_H = 1472, 1104      # 4:3, the split's rounded frame
SIDE_W, SIDE_H = 1472, 1136        # the bento tile; 1136 is a multiple of 16, so the
                                   # model returns exactly this size


def _lit_product(cut, base, height, interior=None, sheen_at=0.3, mesh=False):
    """Rectify, size, redraw the mesh and despeckle if asked, light
    -> (product, body rect in its pixels).

    Sized before the rest, not after: at staged size the mesh perforation is
    finer than the median window, so the plate between the holes is never
    mistaken for dust. The mesh is redrawn after rectify(), not before: drawn as
    a rectangle on the leaning photograph, it came out of the correction skewed.
    """
    rect, body = studio.rectify(cut, studio.quad(cut.getchannel("A"), base))
    s = height / rect.height
    rect = rect.resize((round(rect.width * s), height), Image.LANCZOS)
    body = tuple(v * s for v in body)
    if mesh:
        rect = studio.redraw_mesh(rect, studio.dark_box(rect, interior),
                                  pitch=max(4, round(rect.width * 0.0115)))
    if interior:
        rect = studio.despeckle(rect, interior)
    return studio.light(rect, sheen_at=sheen_at), body


def stage_front():
    """The front view, straightened and studio-lit, on the page's dark floor.

    The front is where the product reads -- the ribbed fascia and the Latios
    wordmark. Not despeckled: a median filter would take the wordmark's strokes
    for dust. The cutout's baked-in sweep shadow was dropped in
    am4_chassis.front_cutout, so the shadow and reflection here are the only ones.
    """
    from am4_chassis import front_cutout
    product, _ = _lit_product(front_cutout(), None, int(FRONT_H * 0.80), sheen_at=0.42)
    canvas, _ = studio.compose(product, FRONT_W, FRONT_H, height=0.80, floor=0.91)
    return canvas


def side_layout():
    """The Compact design tile -> (canvas, callout geometry in percent of the tile).

    The geometry comes from the same numbers that placed the chassis, so the
    callouts cannot drift from the picture. The height line runs from the top
    of the body to the floor; the depth line from the rear edge to the front of
    the bezel, 1.5% under the floor -- at 1024px the tile is ~177px tall, and
    the label hanging below the line needs the rest of it.
    """
    from am4_chassis import LIP, cutout
    height = int(SIDE_H * 0.70)
    product, (bx0, by0, bx1, _) = _lit_product(
        cutout(), LIP, height, interior=(0.04, 0.04, 0.86, 0.92), sheen_at=0.62, mesh=True)
    canvas, (x, y, s) = studio.compose(product, SIDE_W, SIDE_H, height=0.70, floor=0.82)
    px = lambda v: round(v / SIDE_W * 100, 1)
    py = lambda v: round(v / SIDE_H * 100, 1)
    left, right, floor = x + bx0 * s, x + bx1 * s, y + product.height * s
    return canvas, {
        "aspect": "1600 / 1235",          # the installed file: 1472x1136 at 1600 wide
        "h": {"x": px(left - 0.03 * SIDE_W), "y1": py(y + by0 * s), "y2": py(floor)},
        "d": {"x1": px(left), "x2": px(right), "y": py(floor + 0.015 * SIDE_H)},
    }


def stage_side():
    return side_layout()[0]


CARD_W, CARD_H = 1000, 1400        # the Compact design card at 2x, portrait

# Taller than the card it fills, deliberately. The card's aspect runs from 0.66
# in the narrowest column to 0.79 in the widest, and object-cover crops whichever
# axis is long: a frame staged at 0.79 loses 8% off each SIDE in the narrow
# column, which is where the height callout and its label live. Staged at 0.71
# the crop moves mostly to the top and bottom, where there is glow to spare.


def front_card():
    """The Compact design card -> (canvas, callout geometry in percent).

    The FRONT, not the side. The card's backdrop is the reference's own -- navy
    overhead to a near-white floor -- and on that floor the side view's single
    black panel is a silhouette, while the front's ribbing and wordmark hold
    their form. It is also the view whose two measurements are the ones worth
    marking: 354 mm tall and 166 mm across, the number that makes eighteen
    litres mean something. The depth goes in the note beneath.

    The model is NOT run again. The relit front is cut with the alpha of the
    very product that was staged into it -- deterministic, because _lit_product
    returns the same product every time and compose places it by arithmetic --
    so the wordmark and the port panel are the pixels already approved.
    """
    from am4_chassis import front_cutout
    from install_am4 import FRONT_KEEP, restore_regions
    ph = int(FRONT_H * 0.80)
    product, body = _lit_product(front_cutout(), None, ph, sheen_at=0.42)

    x0 = int(FRONT_W * 0.5 - product.width / 2)
    y0 = int(FRONT_H * 0.91) - ph
    alpha = Image.new("L", (FRONT_W, FRONT_H), 0)
    alpha.paste(product.getchannel("A"), (x0, y0))

    tile = restore_regions(Image.open(WORK / "hero-front.png").convert("RGB"),
                           WORK / "hero-front-ref.png", FRONT_KEEP).convert("RGBA")
    tile.putalpha(alpha)
    cut = tile.crop((x0, y0, x0 + product.width, y0 + ph))

    canvas, (x, y, s) = studio.compose(
        cut, CARD_W, CARD_H, height=0.58, floor=0.80, cx=0.500,
        ground=studio.PLATE_GROUND, halo=(118, 108, 94), halo_at=0.44, glow_at=36,
        glow=(150, 104, 60))
    px = lambda v: round(v / CARD_W * 100, 1)
    py = lambda v: round(v / CARD_H * 100, 1)
    bx0, by0, bx1, _ = body
    left, right, floor = x + bx0 * s, x + bx1 * s, y + cut.height * s
    return canvas, {
        "box": [CARD_W, CARD_H],
        "h": {"x": px(left - 0.045 * CARD_W), "y1": py(y + by0 * s), "y2": py(floor)},
        "d": {"x1": px(left), "x2": px(right), "y": py(floor + 0.020 * CARD_H)},
    }


DESK_W, DESK_H = 1664, 928          # the desk plate's own aspect, ~1.5 MP


def desk_tower_layout():
    """The tower sized and placed on the desk plate -> (cut, (x, y)).

    Shared with install_am4.restore_tower, which pastes the photographed tower
    back over the render at exactly this spot.
    """
    from am4_chassis import front_cutout
    cut = front_cutout()
    th = int(DESK_H * 0.34)
    cut = cut.resize((round(cut.width * th / cut.height), th), Image.LANCZOS)
    cx, base = int(DESK_W * 0.795), int(DESK_H * 0.745)
    return cut, (cx - cut.width // 2, base - cut.height)


def stage_desk():
    """The real MT standing on the desk plate, under the lamp.

    The plate was rendered with no PC so as not to invent Latios hardware; this
    puts the photographed one in. It stands between the right monitor (edge at
    x 0.75) and the lamp base (from 0.84), forward on the desk -- its base at
    0.745, just short of the front edge (~0.76 there). Against the monitor (a
    ~53 cm screen spans 0.23 of the frame) a 354 mm tower level with the stands
    is ~0.275 of the frame's height; this far forward it reads larger, and at
    0.34 it holds its own in the card. It overlaps the monitor's edge and the
    corner of the lamp base, in front of both. The lamp is up and to the right,
    so the contact shadow falls left.
    """
    W, H = DESK_W, DESK_H
    canvas = Image.open(WORK / "desk-dual.png").convert("RGB").resize((W, H), Image.LANCZOS)
    cut, (x, y) = desk_tower_layout()
    base = y + cut.height

    # Two shadows: the soft one the lamp casts leftward, and a tight dark one
    # where the plinth meets the desk. With only the soft one, offset left, the
    # base read as hovering.
    cast = Image.new("L", (W, H), 0)
    ImageDraw.Draw(cast).ellipse([x - cut.width * 0.35, base - H * 0.012,
                                  x + cut.width * 0.95, base + H * 0.016], fill=170)
    contact = Image.new("L", (W, H), 0)
    ImageDraw.Draw(contact).ellipse([x - cut.width * 0.03, base - H * 0.005,
                                     x + cut.width * 1.03, base + H * 0.006], fill=235)
    shadow = ImageChops.lighter(cast.filter(ImageFilter.GaussianBlur(7)),
                                contact.filter(ImageFilter.GaussianBlur(2.5)))
    canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), canvas, shadow)
    canvas.paste(cut, (x, y), cut)
    return canvas


def stage_cpu():
    """Full-frame macro: crop straight to 4:3, no canvas (the banner lesson)."""
    im = Image.open(PUBLIC / "components" / "cpu-amd-am4.webp").convert("RGB")
    w, h = im.size
    tw = int(h * 4 / 3)
    if tw < w:
        x = (w - tw) // 2
        im = im.crop((x, 0, x + tw, h))
    im = ImageEnhance.Color(im.resize((1472, 1104), Image.LANCZOS)).enhance(0.8)
    return im


# Low denoise throughout: 0.22-0.30 is where this model has kept lettering
# intact; 0.45 rewrote it.
JOBS = {
    "hero-front": (stage_front, 0.28,
        "a black desktop tower computer seen straight from the front, standing on "
        "a dark glossy studio floor with a soft reflection, a soft grey backlight "
        "halo behind it, warm rim light on its right edge and a cool rim on its "
        "left edge, amber glow on the floor, keep the computer exactly as it is, "
        "keep the latios logo and every port exactly as they are, premium studio "
        "product photography, sharp focus"),
    "chassis-tile": (stage_side, 0.28,
        "a black desktop tower computer seen straight from the side, standing on a "
        "dark glossy studio floor, a soft grey backlight halo behind it, warm rim "
        "light along its edges, a perforated mesh vent with nothing visible behind "
        "it, keep the chassis exactly as it is, premium studio product photography, "
        "sharp focus"),
    "desk-tower": (stage_desk, 0.28,
        "a black desktop tower computer standing on a white office desk to the "
        "right of two monitors, lit warmly by the desk lamp beside it, soft "
        "contact shadow on the desk, keep the tower exactly as it is including "
        "the latios logo on its front, keep the monitors, keyboard, mouse and "
        "lamp exactly as they are, photorealistic, cinematic night office"),
    "cpu-ryzen": (stage_cpu, 0.22,
        "an AMD Ryzen desktop processor seated in its motherboard socket, heat "
        "spreader catching a warm amber key light, dark board around it, keep every "
        "printed marking exactly as it is, cinematic premium product photography, "
        "deep blacks, sharp focus"),
}

if __name__ == "__main__":
    only = sys.argv[1:]
    for name, (stager, denoise, prompt) in JOBS.items():
        if only and name not in only:
            continue
        ref = WORK / f"{name}-ref.png"
        stager().save(ref)
        print(f"[{name}] staged", flush=True)
        try:
            out = cc.edit(str(ref), None, prompt, f"am4-{name}.png",
                          seed=5700, neg_extra=NEG, denoise=denoise)
            Image.open(out).save(WORK / f"{name}.png")
            print(f"  saved {name}.png", flush=True)
        except Exception as e:
            print(f"  FAILED {name}: {type(e).__name__}: {e}", flush=True)
    print("done", flush=True)

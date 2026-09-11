"""Renders for the Latios PRO 14 page, from the factory's CAD views.

The same method as the AM4 page, tightened for a product covered in lettering:

  1. brand   the lid wordmark and the Latios screen go on first, composited from
             the real wordmark file (laptop_refs), never generated.
  2. light   am4_studio.light() and compose(): form, rims, a halo for separation,
             the page's accent on the floor.
  3. relight Qwen-Image-Edit-2511 at low denoise makes the light photographic.
  4. keep    the staged laptop is pasted back over the render inside its own
             eroded alpha. A laptop is keycaps, port icons, a screen and a logo
             -- all lettering -- so the model's pass keeps only what it does
             around the machine (floor, halo, the light along its edges), and
             every legend on the machine is the render's own.

    python gen_laptops.py                  # every job
    python gen_laptops.py pro14-hero       # one job
    python gen_laptops.py --stage          # write the stagings only, no model
"""
import os
import sys
from pathlib import Path

os.environ["LATIOS_UNET"] = "2511"
sys.path.insert(0, str(Path(__file__).parent))
import am4_studio as studio  # noqa: E402
import comfy_client as cc  # noqa: E402
import laptop_refs as L  # noqa: E402

from PIL import Image, ImageFilter  # noqa: E402

WORK = Path(__file__).parent / "generated" / "laptops"
WORK.mkdir(parents=True, exist_ok=True)

ACCENT = "#4f9cf9"                 # the PRO 14 page accent (theme.js)
GLOW = (38, 88, 168)               # that accent, dimmed, for the floor
SIZE_43 = (1472, 1104)             # the split's rounded 4:3 frame
SIZE_TILE = (1472, 1136)           # the bento tile (1600 x 1235 installed)

NEG = ("misspelt text, garbled lettering, mirrored text, distorted logo, invented "
       "branding, extra text, watermark, second device, changed laptop, changed "
       "keyboard, changed screen, hands, desk, room, cartoon, illustration, "
       "oversaturated, blurry")


def branded(name, cut=False, width=2000, hard=False):
    """The view at `width` with its lid mark -> (RGBA cropped to its alpha,
    frame info, screen corners in the cropped picture or None).

    Frame info is (crop x, crop y, frame w, frame h) so callers can map the
    frame-fraction constants in laptop_refs onto the cropped picture. The screen
    is not put on here: it goes on after the light (see stage).

    cut re-segments the picture, for a render that ships on white. hard keeps
    the render's own matte but thresholds it, for a render whose alpha carries a
    backdrop haze: re-segmenting those, u2net reads the haze as part of the
    laptop and leaves grey slabs beside the lid.
    """
    if cut:
        im = L.cutout(L.PRO14 / name, width)
    else:
        im = Image.open(L.PRO14 / name).convert("RGBA")
        im.thumbnail((width, width), Image.LANCZOS)
    if hard:
        a = im.getchannel("A").point(lambda v: 255 if v >= 200 else 0)
        im.putalpha(a.filter(ImageFilter.GaussianBlur(0.6)))
    if name in L.LIDS:
        im = L.brand_lid(im, L.frac_quad(L.LIDS[name], im.size), width=0.22, tone="dark")
    fw, fh = im.size
    box = im.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox()
    screen = None
    if name in L.SCREENS:
        screen = [(x - box[0], y - box[1]) for x, y in L.frac_quad(L.SCREENS[name], (fw, fh), 1.004)]
    return im.crop(box), (box[0], box[1], fw, fh), screen


def stage(name, size, height, floor, cut=False, hard=False, fit=0.86, **compose_kw):
    """Brand, light and compose one view -> (canvas, keep mask, placement).

    height is capped so a wide view stays within `fit` of the frame's width.
    The screen goes on after light(): a display gives off its own light, and
    sharpened and shaded with the chassis its wordmark grew a dark halo.
    The keep mask is the laptop's own alpha, eroded so the model still owns the
    silhouette's edge light, and feathered so the seam does not show.
    """
    prod, frame, screen = branded(name, cut, hard=hard)
    W, H = size
    height = min(height, fit * W / (prod.width / prod.height) / H)
    lit = studio.light(prod, sheen_at=0.35, lift=0.0, fall=0.18, sharpen=40)
    if screen:
        lit = L.brand_screen(lit, screen, L.wallpaper(ACCENT))
    canvas, (x, y, s) = studio.compose(lit, W, H, height=height, floor=floor, glow=GLOW, **compose_kw)
    a = lit.getchannel("A").resize((round(lit.width * s), round(lit.height * s)), Image.LANCZOS)
    keep = Image.new("L", size, 0)
    keep.paste(a.filter(ImageFilter.MinFilter(9)), (x, y))
    return canvas, keep.filter(ImageFilter.GaussianBlur(3)), (x, y, s, frame)


def stage_hero():
    """Open at 45 degrees: the page's opening image, 4:3."""
    return stage("IDL_Open_45.png", SIZE_43, 0.80, 0.90)[:2]


def stage_back():
    """The lid from behind, open, with the rear ports along its foot."""
    return stage("IDL_BACK (1).png", SIZE_43, 0.78, 0.90)[:2]


def top_layout():
    """The closed lid from above, for the Design card -> (canvas, keep, dims).

    Seen from directly above there is no floor, so no reflection and no shadow.
    The callouts come from the same numbers that placed the lid: its width (311
    mm) along the foot, its depth (220 mm) up the left side.
    """
    canvas, keep, (x, y, s, (ox, oy, fw, fh)) = stage(
        "IDL_Top.png", SIZE_TILE, 0.62, 0.80, reflect=False, shadow=False)
    (l0, t0), _, (l1, t1), _ = L.LIDS["IDL_Top.png"]
    W, H = SIZE_TILE
    left, right = x + (l0 * fw - ox) * s, x + (l1 * fw - ox) * s
    top, foot = y + (t0 * fh - oy) * s, y + (t1 * fh - oy) * s
    px = lambda v: round(v / W * 100, 1)
    py = lambda v: round(v / H * 100, 1)
    return canvas, keep, {
        "aspect": "1600 / 1235",
        "h": {"x": px(left - 0.03 * W), "y1": py(top), "y2": py(foot), "label": "220 mm"},
        "d": {"x1": px(left), "x2": px(right), "y": py(foot + 0.03 * H), "label": "311 mm"},
    }


def stage_top():
    return top_layout()[:2]


def stage_front():
    """Open, straight on: the display section's image."""
    return stage("IDL_open_front.png", SIZE_43, 0.86, 0.94, hard=True)[:2]


def stage_layflat():
    """The hinge card: the laptop opened wide, seen from above.

    The factory calls this view "Open_180" but it shows about 135 degrees, so
    the 180-degree lay-flat claim stays in the spec table and the build text
    and the card says what the picture shows. Its render ships on white, so it
    is re-cut; being a view from above it gets no floor reflection.
    """
    return stage("IDL_Open_180.png", SIZE_43, 0.74, 0.86, cut=True, reflect=False)[:2]


PROMPT = ("a grey aluminium laptop computer on a dark glossy studio floor, a soft "
          "grey backlight halo behind it, a cool blue glow on the floor, soft rim "
          "light along its edges, keep the laptop exactly as it is, keep the "
          "screen, the keyboard and the logo exactly as they are, premium studio "
          "product photography, sharp focus")

JOBS = {
    "pro14-hero": (stage_hero, 0.26, PROMPT),
    "pro14-back": (stage_back, 0.26, PROMPT),
    "pro14-top": (stage_top, 0.22, PROMPT.replace("on a dark glossy studio floor", "seen from directly above on a dark studio ground")),
    "pro14-front": (stage_front, 0.26, PROMPT),
    "pro14-layflat": (stage_layflat, 0.22, PROMPT.replace("on a dark glossy studio floor", "opened flat, seen from above on a dark studio ground")),
}


if __name__ == "__main__":
    stage_only = "--stage" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, (stager, denoise, prompt) in JOBS.items():
        if only and name not in only:
            continue
        canvas, keep = stager()
        ref, keep_path = WORK / f"{name}-ref.png", WORK / f"{name}-keep.png"
        canvas.save(ref)
        keep.save(keep_path)
        print(f"[{name}] staged", flush=True)
        if stage_only:
            continue
        try:
            out = cc.edit(str(ref), None, prompt, f"lt-{name}.png",
                          seed=5700, neg_extra=NEG, denoise=denoise)
            render = Image.open(out).convert("RGB").resize(canvas.size, Image.LANCZOS)
            Image.composite(canvas, render, keep).save(WORK / f"{name}.png")
            print(f"  saved {name}.png", flush=True)
        except Exception as e:
            print(f"  FAILED {name}: {type(e).__name__}: {e}", flush=True)
    print("done", flush=True)

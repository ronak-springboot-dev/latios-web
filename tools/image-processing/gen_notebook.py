"""Studio renders for the Latios Notebook 14, from the factory's CAD views.

Same pipeline as the PRO 14 (gen_laptops): the Latios screen and lid mark are
composited from the real wordmark file, am4_studio builds the light, the model
makes it photographic at low denoise, and the staged laptop is pasted back
inside its own eroded alpha so no lettering is ever the model's.

Two differences from the PRO 14. The screens here are blank white, so their
corners are found from the pixels rather than measured -- which works on the
perspective views; the straight-front view has a baked reflection that breaks
it, so that view is not used. And the accent is this page's teal.

    python gen_notebook.py            # every job
    python gen_notebook.py nb-hero
    python gen_notebook.py --stage    # stagings only, no model
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

REFS = L.NOTEBOOK / "ID-open"
WORK = Path(__file__).parent / "generated" / "laptops"
WORK.mkdir(parents=True, exist_ok=True)

ACCENT = "#2dd4bf"                 # the Notebook 14 page accent (theme.js)
GLOW = (18, 120, 110)              # that accent, dimmed, for the floor
SIZE_43 = (1472, 1104)
SIZE_TILE = (1472, 1136)

# The lid on the left-rear view, read off a full-frame grid: far edge first,
# hinge edge last, so the mark reads upright from behind.
LID_03 = [(0.275, 0.095), (0.686, 0.104), (0.818, 0.661), (0.429, 0.877)]

NEG = ("misspelt text, garbled lettering, mirrored text, distorted logo, invented "
       "branding, extra text, watermark, second device, changed laptop, changed "
       "keyboard, changed screen, hands, desk, room, cartoon, illustration, "
       "oversaturated, blurry")

PROMPT = ("a slim grey aluminium laptop computer on a dark glossy studio floor, a "
          "soft grey backlight halo behind it, a cool teal glow on the floor, soft "
          "rim light along its edges, keep the laptop exactly as it is, keep the "
          "screen, the keyboard and the logo exactly as they are, premium studio "
          "product photography, sharp focus")


def prepared(name, lid=None):
    """One view, branded -> (RGBA cropped to its alpha, screen corners in it)."""
    im = Image.open(REFS / name).convert("RGBA")
    im.thumbnail((2000, 2000), Image.LANCZOS)
    if lid:
        im = L.brand_lid(im, L.frac_quad(lid, im.size), width=0.20, tone="dark")
    box = im.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox()
    screen = None
    if lid is None:
        q = L.screen_quad(im, "white")
        screen = [(x - box[0], y - box[1]) for x, y in q]
    return im.crop(box), screen


def stage(name, size, height, floor, lid=None, fit=0.86, **compose_kw):
    prod, screen = prepared(name, lid)
    W, H = size
    height = min(height, fit * W / (prod.width / prod.height) / H)
    lit = studio.light(prod, sheen_at=0.35, lift=0.0, fall=0.18, sharpen=40)
    if screen:
        lit = L.brand_screen(lit, screen, L.wallpaper(ACCENT))
    canvas, (x, y, s) = studio.compose(lit, W, H, height=height, floor=floor, glow=GLOW, **compose_kw)
    a = lit.getchannel("A").resize((round(lit.width * s), round(lit.height * s)), Image.LANCZOS)
    keep = Image.new("L", size, 0)
    keep.paste(a.filter(ImageFilter.MinFilter(9)), (x, y))
    return canvas, keep.filter(ImageFilter.GaussianBlur(3))


def stage_hero():
    """Open, right perspective: the page's opening image."""
    return stage("open-01.png", SIZE_43, 0.80, 0.90)


def stage_angle():
    """Open, left perspective: the second view."""
    return stage("open-04.png", SIZE_TILE, 0.78, 0.88)


def stage_lid():
    """The lid from the left rear, with the wordmark on it."""
    return stage("open-03.png", SIZE_TILE, 0.80, 0.90, lid=LID_03)


JOBS = {
    "nb-hero": (stage_hero, 0.26, PROMPT),
    "nb-angle": (stage_angle, 0.26, PROMPT),
    "nb-lid": (stage_lid, 0.24, PROMPT),
}


if __name__ == "__main__":
    stage_only = "--stage" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, (stager, denoise, prompt) in JOBS.items():
        if only and name not in only:
            continue
        canvas, keep = stager()
        canvas.save(WORK / f"{name}-ref.png")
        keep.save(WORK / f"{name}-keep.png")
        print(f"[{name}] staged", flush=True)
        if stage_only:
            continue
        try:
            out = cc.edit(str(WORK / f"{name}-ref.png"), None, prompt, f"lt-{name}.png",
                          seed=5700, neg_extra=NEG, denoise=denoise)
            render = Image.open(out).convert("RGB").resize(canvas.size, Image.LANCZOS)
            Image.composite(canvas, render, keep).save(WORK / f"{name}.png")
            print(f"  saved {name}.png", flush=True)
        except Exception as e:
            print(f"  FAILED {name}: {type(e).__name__}: {e}", flush=True)
    print("done", flush=True)

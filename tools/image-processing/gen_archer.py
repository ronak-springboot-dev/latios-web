"""Studio renders for the Latios Archer page, from its own photography.

The Archer is the one laptop already photographed as a real unit, and its
wordmark is on the chin and the lid in the photograph, so nothing is
composited here -- this is only light. Same pipeline as the PRO 14:
am4_studio builds the light, Qwen-Image-Edit makes it photographic at low
denoise, and the staged laptop is pasted back inside its own eroded alpha so
the keycaps, the port icons, the vendor stickers and the wordmark are all
exactly as photographed.

    python gen_archer.py            # every job
    python gen_archer.py archer-hero
    python gen_archer.py --stage    # stagings only, no model
"""
import os
import sys
from pathlib import Path

os.environ["LATIOS_UNET"] = "2511"
sys.path.insert(0, str(Path(__file__).parent))
import am4_studio as studio  # noqa: E402
import comfy_client as cc  # noqa: E402

from PIL import Image, ImageFilter  # noqa: E402

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
WORK = Path(__file__).parent / "generated" / "laptops"
WORK.mkdir(parents=True, exist_ok=True)

ACCENT = "#e0245e"                 # the Archer page accent (theme.js)
GLOW = (150, 30, 62)               # that accent, dimmed, for the floor
SIZE_43 = (1472, 1104)
SIZE_TILE = (1472, 1136)

NEG = ("misspelt text, garbled lettering, mirrored text, distorted logo, invented "
       "branding, extra text, watermark, second device, changed laptop, changed "
       "keyboard, changed screen, hands, desk, room, cartoon, illustration, "
       "oversaturated, blurry")

PROMPT = ("a black gaming laptop computer on a dark glossy studio floor, a soft "
          "grey backlight halo behind it, a deep red glow on the floor, soft rim "
          "light along its edges, keep the laptop exactly as it is, keep the "
          "screen, the keyboard and every logo exactly as they are, premium studio "
          "product photography, sharp focus")


def stage(src, size, height, floor, fit=0.86, **compose_kw):
    """Light and compose one photograph -> (canvas, keep mask)."""
    im = Image.open(PUBLIC / src).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox())
    W, H = size
    height = min(height, fit * W / (im.width / im.height) / H)
    lit = studio.light(im, sheen_at=0.35, lift=0.06, fall=0.22, sharpen=45)
    canvas, (x, y, s) = studio.compose(lit, W, H, height=height, floor=floor, glow=GLOW, **compose_kw)
    a = lit.getchannel("A").resize((round(lit.width * s), round(lit.height * s)), Image.LANCZOS)
    keep = Image.new("L", size, 0)
    keep.paste(a.filter(ImageFilter.MinFilter(9)), (x, y))
    return canvas, keep.filter(ImageFilter.GaussianBlur(3))


def stage_hero():
    """Open at three-quarters: the page's opening image."""
    return stage("laptop-archer-1.webp", SIZE_43, 0.82, 0.92)


def stage_angle():
    """A second angle, for the graphics section."""
    return stage("laptop-archer-3.webp", SIZE_TILE, 0.78, 0.90)


JOBS = {
    "archer-hero": (stage_hero, 0.24, PROMPT),
    "archer-angle": (stage_angle, 0.24, PROMPT),
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

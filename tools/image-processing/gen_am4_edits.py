"""The two photo-based renders for the mt-amd-am4 page.

Both are EDITS at low denoise, because both subjects must survive exactly:

  hero-chassis  the real MT chassis, seen from the side. The whole MT family
                shares this box, so the photograph is accurate for AM4 -- and a
                side view has no front ports to count, which matters because the
                photographed front panel disagrees with the AM4 spec row.

                Its mesh window sits over the board of the unit that was shot,
                an Intel Q670. At normal exposure that reads as black; lifted
                hard it shows faint internals. A relight is exactly the kind of
                pass that "develops" detail out of shadow, so the mesh is
                blacked out in the reference before the model sees it: there is
                no board behind it to invent.

  cpu-ryzen     a Ryzen 7 in a real AM4 socket. The source photograph is a
                3700X; the AMD and RYZEN marks are genuine and stay, the model
                number is defocused afterwards (see soften step in the page
                build), because this page sells a 5700G.
"""
import os
import sys
from pathlib import Path

os.environ["LATIOS_UNET"] = "2511"
sys.path.insert(0, str(Path(__file__).parent))
import comfy_client as cc  # noqa: E402

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter  # noqa: E402

HIRES = Path(r"C:/Ronak/Latios/Images/pipeline/hires")
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
WORK = Path(__file__).parent / "generated" / "am4"
WORK.mkdir(parents=True, exist_ok=True)

NEG = ("misspelt text, garbled lettering, mirrored text, distorted logo, invented "
       "branding, extra text, watermark, second device, changed chassis, visible "
       "motherboard, visible components behind the mesh, wooden desk, room, hands, "
       "cartoon, illustration, oversaturated, blue cast, blurry")


def stage_chassis():
    """Side view on a dark ground with a warm horizon.

    The chassis comes from am4_chassis.cutout(): mesh redrawn as perforated steel
    with nothing behind it, then rembg with the alpha-matting settings that fixed
    the SFF shoot. The earlier luminance threshold left a ragged fringe either
    way it was tuned, and the relight would have lit that fringe.
    """
    from am4_chassis import cutout
    canvas = hero_ground()
    cut, at = hero_layout(cutout())
    canvas.paste(cut, at, cut)
    return canvas


HERO_W, HERO_H = 1472, 1140


def hero_ground():
    """The empty staging: near-black with a warm glow rising from the floor."""
    W, H = HERO_W, HERO_H
    canvas = Image.new("RGB", (W, H), (4, 4, 6))
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse([W * 0.08, H * 0.62, W * 0.92, H * 1.30], fill=110)
    return Image.composite(Image.new("RGB", (W, H), (120, 64, 18)), canvas,
                           glow.filter(ImageFilter.GaussianBlur(W / 9)))


def hero_layout(cut):
    """Chassis at 80% of frame height, centred, 8% from the top -> (cut, xy).

    Shared with install_am4.clean_hero, which needs to know where the chassis
    landed in the render to retouch around it.
    """
    th = int(HERO_H * 0.80)
    cut = cut.resize((int(cut.width * th / cut.height), th), Image.LANCZOS)
    return cut, ((HERO_W - cut.width) // 2, int(HERO_H * 0.08))


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


JOBS = {
    "hero-chassis": (stage_chassis, 0.38,
        "a black desktop tower computer seen from the side, standing upright on a "
        "dark reflective floor, a warm amber horizon glow behind it, dark mesh side "
        "window with nothing visible behind it, keep the chassis exactly as it is, "
        "cinematic premium product photography, sharp focus"),
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

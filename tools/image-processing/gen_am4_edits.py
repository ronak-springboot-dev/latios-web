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

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps  # noqa: E402

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


FRONT_W, FRONT_H = 1472, 1104      # 4:3, the split's rounded frame


def stage_front():
    """The front view standing on a dark glossy floor in the page's amber glow.

    Replaces the side view as the page's opening image: a flat side panel is a
    dark rectangle with no depth, and the front is where the product reads --
    the ribbed fascia and the Latios wordmark. The cutout's baked-in sweep
    shadow is dropped in am4_chassis.front_cutout, so the contact shadow and
    the floor reflection here are the only ones in the frame.
    """
    from am4_chassis import front_cutout
    W, H = FRONT_W, FRONT_H
    floor_y = int(H * 0.90)
    canvas = Image.new("RGB", (W, H), (4, 4, 6))
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse([W * 0.12, H * 0.58, W * 0.88, H * 1.25], fill=120)
    canvas = Image.composite(Image.new("RGB", (W, H), (125, 66, 18)), canvas,
                             glow.filter(ImageFilter.GaussianBlur(W / 10)))

    cut = front_cutout()
    th = int(H * 0.80)
    cut = cut.resize((round(cut.width * th / cut.height), th), Image.LANCZOS)
    lifted = ImageEnhance.Brightness(cut.convert("RGB")).enhance(1.15)   # the ribs read
    cut = Image.merge("RGBA", (*lifted.split(), cut.getchannel("A")))
    x, y = (W - cut.width) // 2, floor_y - cut.height

    refl = cut.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, cut.width, cut.height // 3))
    fade = ImageOps.invert(Image.linear_gradient("L").resize(refl.size)).point(lambda v: int(v * 0.22))
    refl.putalpha(ImageChops.multiply(refl.getchannel("A"), fade))
    canvas.paste(refl, (x, floor_y), refl)

    shadow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(shadow).ellipse([x - cut.width * 0.08, floor_y - H * 0.012,
                                    x + cut.width * 1.08, floor_y + H * 0.02], fill=200)
    canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), canvas,
                             shadow.filter(ImageFilter.GaussianBlur(10)))
    canvas.paste(cut, (x, y), cut)
    return canvas


DESK_W, DESK_H = 1664, 928          # the desk plate's own aspect, ~1.5 MP


def desk_tower_layout():
    """The tower sized and placed on the desk plate -> (cut, (x, y)).

    Shared with install_am4.restore_tower, which pastes the photographed tower
    back over the render at exactly this spot.
    """
    from am4_chassis import front_cutout
    cut = front_cutout()
    th = int(DESK_H * 0.275)
    cut = cut.resize((round(cut.width * th / cut.height), th), Image.LANCZOS)
    cx, base = int(DESK_W * 0.795), int(DESK_H * 0.72)
    return cut, (cx - cut.width // 2, base - cut.height)


def stage_desk():
    """The real MT standing on the desk plate, under the lamp.

    The plate was rendered with no PC so as not to invent Latios hardware; this
    puts the photographed one in. It stands between the right monitor (edge at
    x 0.75) and the lamp base (from 0.84), on the desk just in front of the
    monitor stand, sized against the monitor: a ~53 cm screen spans 0.23 of the
    frame, so the 354 mm tower is ~0.275 of its height. The lamp is up and to the
    right, so the contact shadow falls left.
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


JOBS = {
    "desk-tower": (stage_desk, 0.28,
        "a black desktop tower computer standing on a white office desk to the "
        "right of two monitors, lit warmly by the desk lamp beside it, soft "
        "contact shadow on the desk, keep the tower exactly as it is including "
        "the latios logo on its front, keep the monitors, keyboard, mouse and "
        "lamp exactly as they are, photorealistic, cinematic night office"),
    # Low denoise: the wordmark and the port icons are lettering, and 0.22-0.30
    # is where this model has kept lettering intact; 0.45 rewrote it.
    "hero-front": (stage_front, 0.30,
        "a black desktop tower computer seen from the front, standing upright on "
        "a dark glossy floor with a soft reflection, a warm amber horizon glow "
        "behind it, soft warm rim light along its edges, keep the computer "
        "exactly as it is, keep the latios logo and every port exactly as they "
        "are, cinematic premium product photography, sharp focus"),
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

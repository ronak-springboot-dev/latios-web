"""
Build the shipped assets from the renders, at 1.6x the previous resolution.

Three sources, because the frames are not all doing the same job -- see
PHOTOGRAPHIC below for which whole-machine views come from where:

  render/<name>.png           a whole machine, re-rendered as a studio product
                              shot. Cut out of the render's own grey backdrop
                              and re-plated on the site's #f2f2f0, so every tile
                              sits on one ground -- the valuable part of the
                              render is the light ON the machine, not the
                              gradient behind it, and the turntable stage is
                              that colour already.

  hires/closeup-<name>.png    a close-up, straight off the camera at 50
                              megapixels. These deliberately never went through
                              the model: a full-denoise render of a rear I/O
                              cluster or a CPU socket is free to invent a port,
                              and on a spec-driven B2B catalogue an invented
                              port is a false claim.

Output is 2560x2048 for fronts and 2560x1600 for gallery tiles, against
1600x1280 and 1600x1000 before. Chosen, not maximal: the renders are ~3800px
tall after RealESRGAN and the close-ups ~8000px, so 2560 downsamples in every
case rather than inventing, and it is retina-sharp at any size the site uses.
Shipping the full 8160px would quadruple page weight for pixels no browser asks
for.

    python tools/image-processing/shoot_final.py
"""
from __future__ import annotations

import io
import sys
from pathlib import Path

from PIL import Image, ImageOps
from rembg import new_session, remove

from shoot_fronts import DETAILS, FRONTS, PLATED, contact_shadow

HIRES = Path(r"C:\Ronak\Latios\Images\pipeline\hires")
RENDER = Path(r"C:\Ronak\Latios\Images\pipeline\render")
CUTS = Path(r"C:\Ronak\Latios\Images\pipeline\render-cut")
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\ready")

FRONT_W, FRONT_H = 2560, 2048
DETAIL_W, DETAIL_H = 2560, 1600
MARGIN = 0.09
PLATE = (242, 242, 240)

_session = new_session("u2net")

# Which whole-machine views come from the render and which stay photographic.
#
# The split is not about picture quality, it is about what the frame is FOR. A
# hero view sells the form and the finish, and there the render wins outright:
# real studio light, a seamless ground, no office reflected in the panel. A rear
# I/O view is read against a spec sheet, and at 1:1 the rendered connectors are
# approximations -- the PS/2 pin pattern is invented, the HDMI and DisplayPort
# shells are blobby rectangles. An approximate port is a false claim about what
# is in the box, so those frames keep the camera's version. Same reasoning for
# the open chassis: it documents what servicing the machine looks like.
PHOTOGRAPHIC = {"mt-rear", "sff-rear", "sff-open"}


def photo_cutout(name: str) -> Image.Image:
    """The camera's own cut-out, already matted at full resolution."""
    return Image.open(HIRES / f"{name}.png").convert("RGBA")


def cutout(name: str) -> Image.Image:
    """
    Lift the rendered machine off its backdrop.

    Easier than matting the photographs was: the render's ground is a smooth
    studio grey with no doorway, no desk and no power strip, so plain u2net is
    enough and the expensive alpha-matting pass is not needed. Cached, because
    the batch gets re-run whenever a canvas size changes and this is the only
    slow step left in it.
    """
    CUTS.mkdir(parents=True, exist_ok=True)
    cached = CUTS / f"{name}.png"
    if cached.exists():
        return Image.open(cached).convert("RGBA")

    buf = io.BytesIO()
    Image.open(RENDER / f"{name}.png").convert("RGB").save(buf, format="PNG")
    rgba = Image.open(io.BytesIO(remove(buf.getvalue(), session=_session))).convert("RGBA")
    bbox = rgba.getchannel("A").getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    rgba.save(cached, "PNG")
    return rgba


def subject(name: str) -> Image.Image:
    """The machine, from whichever source this frame is meant to come from."""
    return photo_cutout(name) if name in PHOTOGRAPHIC else cutout(name)


def place(img: Image.Image, size: tuple[int, int], background) -> Image.Image:
    """Fit onto the canvas with a margin, add the contact shadow, keep alpha."""
    w, h = size
    scale = min(w * (1 - 2 * MARGIN) / img.width, h * (1 - 2 * MARGIN) / img.height)
    s = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))),
                   Image.LANCZOS)
    pos = ((w - s.width) // 2, (h - s.height) // 2)
    canvas = Image.new("RGBA", (w, h), background)
    canvas = Image.alpha_composite(canvas, contact_shadow(s, (w, h), pos))
    canvas.alpha_composite(s, pos)
    return canvas


def main() -> int:
    (OUT / "fronts").mkdir(parents=True, exist_ok=True)
    (OUT / "details").mkdir(parents=True, exist_ok=True)
    missing = []

    for form in FRONTS:
        if not (RENDER / f"front-{form}.png").exists():
            missing.append(f"front-{form}")
            continue
        img = place(subject(f"front-{form}"), (FRONT_W, FRONT_H), (0, 0, 0, 0))
        dst = OUT / "fronts" / f"{form}.webp"
        img.save(dst, "WEBP", quality=93, method=6)
        print(f"  front   {form:4s} {FRONT_W}x{FRONT_H}  {dst.stat().st_size // 1024}KB")

    for form, items in DETAILS.items():
        for kind, name, _set, _index, _caption in items:
            dst = OUT / "details" / f"{form}-{name}.webp"
            if kind == PLATED:
                whole = f"{form}-{name}"
                if whole not in PHOTOGRAPHIC and not (RENDER / f"{whole}.png").exists():
                    missing.append(f"{form}-{name}")
                    continue
                img = place(subject(f"{form}-{name}"), (DETAIL_W, DETAIL_H),
                            (*PLATE, 255)).convert("RGB")
            else:
                src = Image.open(HIRES / f"closeup-{form}-{name}.png").convert("RGB")
                img = ImageOps.fit(src, (DETAIL_W, DETAIL_H), Image.LANCZOS, centering=(0.5, 0.5))
            img.save(dst, "WEBP", quality=91, method=6)
            print(f"  {kind:7s} {form}-{name:14s} {img.size[0]}x{img.size[1]}  "
                  f"{dst.stat().st_size // 1024}KB")

    if missing:
        print(f"\n  NOT RENDERED YET, left as they were: {', '.join(missing)}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())

"""
High-resolution cut-outs, straight from the original HEIC.

shoot_decode.py caps its working copies at 3000px on the long edge, which is
plenty for a 1600px web asset but throws away most of a 50-megapixel frame. The
studio pass wants every pixel the camera captured, so this re-decodes only the
frames that end up on the site, at full size, and mattes them there.

Output is a transparent PNG per frame, at source resolution, in
pipeline/hires/. Nothing is scaled or plated here -- that happens after the
model pass, so the resize is applied once, at the end, rather than twice.

    python tools/image-processing/shoot_hires.py
"""
from __future__ import annotations

import io
import sys
from pathlib import Path

import pillow_heif
from PIL import Image, ImageOps
from rembg import new_session, remove

from shoot_fronts import CLOSEUP, DETAILS, FRONTS, PLATED, grade

pillow_heif.register_heif_opener()

SRC = Path(r"C:\Ronak\Latios\Images")
SETS = {"tower": SRC / "Latios tower", "sff": SRC / "Latios SFF"}
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\hires")

_session = new_session("u2net")


def original(shoot_set: str, index: int) -> Path:
    """The untouched camera file behind a contact-sheet index."""
    folder = SETS[shoot_set]
    files = sorted(p for p in folder.iterdir()
                   if p.suffix.lower() in {".heic", ".heif", ".jpg", ".jpeg", ".png"})
    return files[index]


def load_full(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def matte(img: Image.Image) -> Image.Image:
    """
    Matte at full resolution.

    u2net segments at 320x320 whatever it is given, so the mask itself gains
    nothing from the extra pixels -- but alpha matting refines that mask against
    the real image, and giving it the full frame is what keeps the chassis edge
    crisp instead of a resampled staircase.
    """
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    cut = remove(
        buf.getvalue(),
        session=_session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=250,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=12,
    )
    return Image.open(io.BytesIO(cut)).convert("RGBA")


def wanted() -> list[tuple[str, str, int, bool]]:
    """
    Every frame the site ships, and whether it needs cutting out.

    The plated views are a machine that has to leave the room it was shot in.
    The close-ups keep their frame -- a CPU socket cut out of the motherboard it
    is bolted to is not a product shot -- but they still want the full-resolution
    decode, because the old ones were cropped out of a 3000px working copy and
    lost two thirds of that again to the 16:10 crop.
    """
    out = [(f"front-{form}", s, i, True) for form, (s, i) in FRONTS.items()]
    for form, items in DETAILS.items():
        for kind, name, s, i, _caption in items:
            if kind == PLATED:
                out.append((f"{form}-{name}", s, i, True))
            elif kind == CLOSEUP:
                out.append((f"closeup-{form}-{name}", s, i, False))
    return out


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, shoot_set, index, cut in wanted():
        dst = OUT / f"{name}.png"
        if dst.exists():
            print(f"  {name:24s} already done")
            continue
        src = original(shoot_set, index)
        img = grade(load_full(src))
        if cut:
            out = matte(img)
            bbox = out.getchannel("A").getbbox()
            if bbox:
                out = out.crop(bbox)
        else:
            out = img.convert("RGBA")
        out.save(dst, "PNG")
        print(f"  {name:24s} <- {src.name}  {img.width}x{img.height} -> {out.width}x{out.height}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

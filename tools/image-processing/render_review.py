"""
Put a render next to its reference, with the branding blown up underneath.

Every generative pass in this project has to answer the same two questions
before it can ship: is this still the Latios machine, and does the wordmark
still say Latios. A thumbnail answers neither, and sampling frames is what let a
torn lift phase and a stretched interior through earlier, so this renders the
whole frame AND a 100% crop of the region the lettering lives in.

    python tools/image-processing/render_review.py front-mt [more...]
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

HIRES = Path(r"C:\Ronak\Latios\Images\pipeline\hires")
RENDER = Path(r"C:\Ronak\Latios\Images\pipeline\render")
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\review")

PLATE = (242, 242, 240)
CELL = 760

# Where the wordmark sits, as a fraction of the subject box. The mark is printed
# on the front bezel, which is the left edge of every three-quarter view in this
# shoot and the top of the flat ones, so one box does not fit all -- but it is
# close enough to crop around, and the point is to read the letters, not to
# measure them.
MARK = {
    "front-mt": (0.02, 0.02, 0.22, 0.20),
    "front-sff": (0.00, 0.02, 0.30, 0.22),
    "mt-front": (0.00, 0.02, 0.30, 0.18),
    "mt-angle": (0.00, 0.02, 0.30, 0.20),
    "sff-front": (0.00, 0.02, 0.55, 0.20),
    "sff-angle": (0.00, 0.02, 0.28, 0.24),
}
DEFAULT_MARK = (0.0, 0.0, 0.35, 0.25)


def flat(path: Path) -> Image.Image:
    im = Image.open(path)
    if im.mode == "RGBA":
        bg = Image.new("RGBA", im.size, (*PLATE, 255))
        bg.alpha_composite(im)
        im = bg
    return im.convert("RGB")


def crop_frac(im: Image.Image, box) -> Image.Image:
    x0, y0, x1, y1 = box
    return im.crop((int(im.width * x0), int(im.height * y0),
                    int(im.width * x1), int(im.height * y1)))


def review(name: str) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    ref, ren = flat(HIRES / f"{name}.png"), flat(RENDER / f"{name}.png")
    box = MARK.get(name, DEFAULT_MARK)

    tiles = []
    for label, im in (("reference", ref), ("render", ren)):
        whole = im.copy()
        whole.thumbnail((CELL, CELL), Image.LANCZOS)
        mark = crop_frac(im, box)
        mark.thumbnail((CELL, CELL), Image.LANCZOS)
        tiles += [(f"{label} — whole", whole), (f"{label} — wordmark 1:1", mark)]

    pad, label_h = 12, 22
    cols = 2
    rows = (len(tiles) + cols - 1) // cols
    w = cols * (CELL + pad) + pad
    h = rows * (CELL + pad + label_h) + pad
    sheet = Image.new("RGB", (w, h), (22, 22, 22))
    draw = ImageDraw.Draw(sheet)
    for i, (label, im) in enumerate(tiles):
        x = pad + (i % cols) * (CELL + pad)
        y = pad + (i // cols) * (CELL + pad + label_h)
        sheet.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
        draw.text((x + 4, y + CELL + 4), label, fill=(210, 210, 210))

    dst = OUT / f"{name}.jpg"
    sheet.save(dst, "JPEG", quality=92)
    print(dst)
    return dst


if __name__ == "__main__":
    for n in sys.argv[1:] or [p.stem for p in RENDER.glob("*.png") if not p.stem.startswith("_")]:
        review(n)

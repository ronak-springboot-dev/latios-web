"""
Put every render next to the photograph it came from.

Each generative pass in this project has to answer the same question before it
can ship -- is this still the machine that was photographed -- and a thumbnail
does not answer it. This lays the pair side by side at a size where connectors,
labels and the wordmark are readable, for every frame at once, because sampling
frames is what let a torn lift phase and a stretched interior through earlier.

    python tools/image-processing/render_review.py               # all frames
    python tools/image-processing/render_review.py mt-rear ...   # some
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


def flat(path: Path) -> Image.Image:
    """Composite onto the studio plate so a cut-out and a full frame compare alike."""
    im = Image.open(path)
    if im.mode == "RGBA":
        bg = Image.new("RGBA", im.size, (*PLATE, 255))
        bg.alpha_composite(im)
        im = bg
    return im.convert("RGB")


def pair(name: str, cell: int = CELL) -> Image.Image | None:
    ph, rn = HIRES / f"{name}.png", RENDER / f"{name}.png"
    if not (ph.exists() and rn.exists()):
        return None
    tiles = []
    for label, p in (("photo", ph), ("render", rn)):
        im = flat(p)
        im.thumbnail((cell, cell), Image.LANCZOS)
        tiles.append((label, im))
    h = max(t.height for _, t in tiles)
    out = Image.new("RGB", (2 * (cell + 10) + 10, h + 46), (22, 22, 22))
    d = ImageDraw.Draw(out)
    for i, (label, im) in enumerate(tiles):
        x = 10 + i * (cell + 10)
        out.paste(im, (x + (cell - im.width) // 2, 10 + (h - im.height) // 2))
        d.text((x + 6, h + 20), f"{label}  {name}", fill=(220, 220, 220))
    return out


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    names = sys.argv[1:] or sorted(
        p.stem for p in RENDER.glob("*.png") if not p.stem.startswith("_"))
    made, skipped = [], []
    for n in names:
        img = pair(n)
        if img is None:
            skipped.append(n)
            continue
        dst = OUT / f"pair-{n}.jpg"
        img.save(dst, "JPEG", quality=93)
        made.append(dst)
        print(f"  {dst}")
    if skipped:
        print(f"  no pair for: {', '.join(skipped)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

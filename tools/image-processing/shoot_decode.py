"""
Decode the product shoot to working JPEGs and build contact sheets.

The shoot is 50-megapixel *tiled* HEIC straight off the phone. That format
defeated every other route tried here: ffmpeg 7.1 exposes exactly one 512x384
tile of the grid (a close-up of wall or fabric, not a thumbnail), and
ImageMagick is not installed -- `convert` on PATH is Windows' FAT-to-NTFS tool.
pillow-heif reads the whole grid, so that is the only decoder used.

Two outputs per source: a full-resolution JPEG for the cut-out pipeline, and a
downscaled one for the contact sheet. Every frame goes on a sheet -- sampling
frames is what let a torn lift phase and a stretched interior ship earlier in
this project, so the whole set gets looked at.

    python tools/image-processing/shoot_decode.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()

SRC = Path(r"C:\Ronak\Latios\Images")
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\shoot")
SETS = {"tower": SRC / "Latios tower", "sff": SRC / "Latios SFF"}

FULL_MAX = 3000          # long edge for the working copies
THUMB = 640              # contact-sheet cell
COLS = 5


def decode(src: Path, dst: Path) -> tuple[int, int] | None:
    """Decode one frame, honouring EXIF rotation. Returns the source size."""
    try:
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = im.size
            work = im.copy()
            work.thumbnail((FULL_MAX, FULL_MAX), Image.LANCZOS)
            dst.parent.mkdir(parents=True, exist_ok=True)
            work.save(dst, "JPEG", quality=94, subsampling=1)
            return w, h
    except Exception as exc:                       # noqa: BLE001 - report and continue
        print(f"  FAILED {src.name}: {exc}")
        return None


def sheet(name: str, frames: list[Path]) -> Path:
    """One contact sheet with every frame, numbered so a cull list can name them."""
    rows = (len(frames) + COLS - 1) // COLS
    cell_h = int(THUMB * 0.78)
    pad, label = 8, 22
    sheet_img = Image.new("RGB", (COLS * (THUMB + pad) + pad,
                                  rows * (cell_h + pad + label) + pad), (18, 18, 18))
    draw = ImageDraw.Draw(sheet_img)
    for i, f in enumerate(frames):
        with Image.open(f) as im:
            im = im.copy()
            im.thumbnail((THUMB, cell_h), Image.LANCZOS)
        x = pad + (i % COLS) * (THUMB + pad)
        y = pad + (i // COLS) * (cell_h + pad + label)
        sheet_img.paste(im, (x + (THUMB - im.width) // 2, y + (cell_h - im.height) // 2))
        draw.text((x + 4, y + cell_h + 4), f"{i:02d}  {f.stem}", fill=(190, 190, 190))
    out = OUT / f"contact-{name}.jpg"
    sheet_img.save(out, "JPEG", quality=88)
    return out


def main() -> int:
    for name, folder in SETS.items():
        if not folder.is_dir():
            print(f"{name}: {folder} not found")
            continue
        srcs = sorted(p for p in folder.iterdir()
                      if p.suffix.lower() in {".heic", ".heif", ".jpg", ".jpeg", ".png"})
        skipped = sorted(p.name for p in folder.iterdir()
                         if p.suffix.lower() not in {".heic", ".heif", ".jpg", ".jpeg", ".png"})
        print(f"{name}: {len(srcs)} decodable, skipping {skipped or 'nothing'}")
        done = []
        for i, src in enumerate(srcs):
            dst = OUT / name / f"{i:02d}-{src.stem}.jpg"
            size = decode(src, dst)
            if size:
                done.append(dst)
                print(f"  {i:02d} {src.name}  {size[0]}x{size[1]}")
        if done:
            print(f"{name}: contact sheet -> {sheet(name, done)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Label + tile the source photos that were never used, so all can be identified at once."""
import sys
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

SRC = Path(r"C:\Ronak\Latios\Images")
OUT = Path(__file__).parent / "generated" / "unused-contact-sheet.jpg"

USED = {"122620", "123520", "123602", "124231", "124248", "124354",
        "163639", "163641", "163701", "163755"}

names = sorted(p for p in SRC.glob("2026*.jpeg")
               if p.stem.split("_")[1].split(".")[0] not in USED)
COLS, CELL = 4, 460
rows = (len(names) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * CELL, rows * (CELL + 26)), (18, 18, 18))
d = ImageDraw.Draw(sheet)
for i, p in enumerate(names):
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    im.thumbnail((CELL, CELL), Image.LANCZOS)
    x, y = (i % COLS) * CELL, (i // COLS) * (CELL + 26)
    sheet.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
    d.text((x + 6, y + CELL + 6), p.stem.split("_")[1].split(".")[0], fill=(255, 210, 60))
sheet.save(OUT, quality=82)
print(f"{len(names)} unused -> {OUT} ({sheet.width}x{sheet.height})")

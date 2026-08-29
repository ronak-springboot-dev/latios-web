"""Composite processed cutouts onto the site's real backgrounds to eyeball them."""
import sys
from pathlib import Path
from PIL import Image

OUT = Path(__file__).parent / "output"
PREV = Path(__file__).parent / "preview"
PREV.mkdir(exist_ok=True)

LIGHT = (242, 242, 240)   # #f2f2f0 product stage
DARK = (5, 5, 5)          # #050505 dark theme


def preview(name):
    im = Image.open(OUT / name).convert("RGBA")
    w, h = im.size
    sheet = Image.new("RGB", (w * 2, h), LIGHT)
    left = Image.new("RGB", (w, h), LIGHT)
    left.paste(im, (0, 0), im)
    right = Image.new("RGB", (w, h), DARK)
    right.paste(im, (0, 0), im)
    sheet.paste(left, (0, 0))
    sheet.paste(right, (w, 0))
    sheet = sheet.resize((w, h // 2), Image.LANCZOS)
    out = PREV / (Path(name).stem + "-preview.jpg")
    sheet.save(out, "JPEG", quality=88)
    print(out)


if __name__ == "__main__":
    names = sys.argv[1:] or [p.name for p in sorted(OUT.glob("*.webp"))]
    for n in names:
        preview(n)

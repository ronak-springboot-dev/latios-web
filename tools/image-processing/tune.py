"""Try several enhancement strengths side by side so the right one can be picked by eye."""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import io
from rembg import remove, new_session

SRC = Path(r"C:\Ronak\Latios\Images\20260827_122620.jpg.jpeg")
OUT = Path(__file__).parent / "preview"
OUT.mkdir(exist_ok=True)
LIGHT = (242, 242, 240)
_session = new_session("u2net")


def curve(shadow_lift, black_point):
    lut = []
    for i in range(256):
        v = (i / 255.0) ** shadow_lift
        v = max(0.0, (v - black_point / 255.0) / (1 - black_point / 255.0))
        lut.append(min(255, int(round(v * 255))))
    return lut * 3


def variant(rgba, lift, bp, contrast, bright, color):
    rgb = rgba.convert("RGB")
    a = rgba.getchannel("A")
    rgb = rgb.point(curve(lift, bp))
    rgb = ImageEnhance.Contrast(rgb).enhance(contrast)
    rgb = ImageEnhance.Brightness(rgb).enhance(bright)
    rgb = ImageEnhance.Color(rgb).enhance(color)
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=18, percent=55, threshold=3))
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=95, threshold=3))
    rgb.putalpha(a)
    return rgb


base = ImageOps.exif_transpose(Image.open(SRC)).rotate(-90, expand=True)
buf = io.BytesIO()
base.convert("RGB").save(buf, format="PNG")
cut = Image.open(io.BytesIO(remove(buf.getvalue(), session=_session))).convert("RGBA")
cut = cut.crop(cut.getchannel("A").getbbox())

VARIANTS = [
    ("A current(too grey)", 0.62, 8, 1.22, 1.06, 1.10),
    ("B gentle", 0.88, 6, 1.30, 0.98, 0.95),
    ("C blackest", 0.95, 4, 1.35, 0.96, 0.92),
]

tiles = []
for label, *p in VARIANTS:
    v = variant(cut, *p)
    v.thumbnail((760, 760), Image.LANCZOS)
    tile = Image.new("RGB", (780, 620), LIGHT)
    tile.paste(v, ((780 - v.width) // 2, (620 - v.height) // 2), v)
    tiles.append((label, tile))

sheet = Image.new("RGB", (780 * len(tiles), 620), LIGHT)
for i, (label, t) in enumerate(tiles):
    sheet.paste(t, (i * 780, 0))
    print(f"panel {i+1}: {label}")
sheet.save(OUT / "tuning-compare.jpg", "JPEG", quality=90)
print(OUT / "tuning-compare.jpg")

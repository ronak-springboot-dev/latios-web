"""
Turn Flux studio renders into site-ready assets.

The generated shots come back on a white studio background, but the site's
original product images were RGBA with real transparency so they sit correctly
on the light product stage AND the dark theme. So: cut out, re-add our own
contact shadow, centre on a consistent 5:4 canvas, save as RGBA WebP.
"""
import io
import sys
from pathlib import Path

from PIL import Image, ImageFilter
from rembg import remove, new_session

GEN = Path(__file__).parent / "generated"
OUT = Path(__file__).parent / "output"
OUT.mkdir(exist_ok=True)

CANVAS_W, CANVAS_H = 1600, 1280
MARGIN = 0.08

_session = new_session("u2net")


def cutout(img):
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="PNG")
    return Image.open(io.BytesIO(remove(buf.getvalue(), session=_session))).convert("RGBA")


def contact_shadow(subject, canvas_size, pos):
    cw, ch = canvas_size
    sw, sh = subject.size
    shadow_h = max(8, int(sh * 0.09))
    strip = subject.getchannel("A").crop((0, int(sh * 0.82), sw, sh)).resize((sw, shadow_h), Image.LANCZOS)
    layer = Image.new("L", (cw, ch), 0)
    layer.paste(strip, (pos[0], min(ch - shadow_h, pos[1] + sh - int(shadow_h * 0.4))))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=max(6, sw // 50)))
    layer = layer.point(lambda v: int(v * 0.34))
    shadow = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    shadow.putalpha(layer)
    return shadow


def finalize(src_name, out_name):
    img = Image.open(GEN / src_name)
    rgba = cutout(img)
    bbox = rgba.getchannel("A").getbbox()
    if bbox:
        rgba = rgba.crop(bbox)

    avail_w = int(CANVAS_W * (1 - 2 * MARGIN))
    avail_h = int(CANVAS_H * (1 - 2 * MARGIN))
    scale = min(avail_w / rgba.width, avail_h / rgba.height)
    rgba = rgba.resize((max(1, int(rgba.width * scale)), max(1, int(rgba.height * scale))), Image.LANCZOS)

    pos = ((CANVAS_W - rgba.width) // 2, (CANVAS_H - rgba.height) // 2)
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    canvas = Image.alpha_composite(canvas, contact_shadow(rgba, (CANVAS_W, CANVAS_H), pos))
    canvas.paste(rgba, pos, rgba)

    out = OUT / out_name
    canvas.save(out, "WEBP", quality=92, method=6)
    print(f"  {src_name} -> {out_name}  ({canvas.size[0]}x{canvas.size[1]}, {out.stat().st_size//1024}KB)")


if __name__ == "__main__":
    pairs = [tuple(a.split("=")) for a in sys.argv[1:]]
    if not pairs:
        print("usage: finalize.py <generated.jpg>=<out.webp> ...")
        sys.exit(1)
    for src, out in pairs:
        finalize(src, out)

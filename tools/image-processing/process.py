"""
One-time tool: turn real Latios photos into studio-style product shots matching
the site's original (MSI-sourced) reference images.

Target style, reverse-engineered from the originals this replaces:
  - RGBA with TRUE TRANSPARENCY (no baked background) so the cutout composites
    cleanly on the light product stage AND the site's dark theme
  - consistent 5:4 canvas, product centred with generous margin
  - studio-looking: shadows lifted so the near-black chassis shows detail,
    boosted contrast/clarity, sharpened
  - soft contact shadow under the product so it sits rather than floats

Not part of the app — throwaway script, run manually.
"""
import io
import sys
from pathlib import Path

from PIL import Image, ImageOps, ImageEnhance, ImageFilter
from rembg import remove, new_session

SRC_DIR = Path(r"C:\Ronak\Latios\Images")
OUT_DIR = Path(__file__).parent / "output"
OUT_DIR.mkdir(exist_ok=True)

CANVAS_W, CANVAS_H = 1600, 1280          # 5:4, matches the originals' 1000x800
MARGIN = 0.09                             # fraction of canvas kept clear around product

_session = new_session("u2net")


def straighten(img, extra_rotation=0):
    img = ImageOps.exif_transpose(img)
    if extra_rotation:
        img = img.rotate(extra_rotation, expand=True)
    return img


def cutout(img):
    """Remove background, return RGBA with real alpha."""
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="PNG")
    out = remove(buf.getvalue(), session=_session)
    return Image.open(io.BytesIO(out)).convert("RGBA")


def _tone_curve(shadow_lift=0.95, black_point=4):
    """
    LUT for near-black products: lifts shadows/midtones hard so chassis texture
    reads, while keeping a true black point so the image still has punch.
    """
    lut = []
    for i in range(256):
        v = i / 255.0
        v = v ** shadow_lift               # gamma lift (<1 brightens shadows most)
        v = max(0.0, (v - black_point / 255.0) / (1 - black_point / 255.0))
        lut.append(min(255, int(round(v * 255))))
    return lut * 3                          # same curve for R, G, B


def studio_enhance(rgba):
    """Make a dim indoor photo of a black box look studio-lit."""
    rgb = rgba.convert("RGB")
    alpha = rgba.getchannel("A")

    rgb = rgb.point(_tone_curve())                       # reveal texture in the blacks
    rgb = ImageEnhance.Contrast(rgb).enhance(1.35)       # punch — keeps the chassis properly dark
    rgb = ImageEnhance.Brightness(rgb).enhance(0.96)
    rgb = ImageEnhance.Color(rgb).enhance(0.92)          # neutralise the warm indoor cast
    # local contrast ("clarity") then edge sharpening
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=18, percent=55, threshold=3))
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=95, threshold=3))

    rgb.putalpha(alpha)
    return rgb


def trim_to_subject(rgba):
    bbox = rgba.getchannel("A").getbbox()
    return rgba.crop(bbox) if bbox else rgba


def contact_shadow(subject, canvas_size, pos):
    """Soft elliptical shadow derived from the subject's own silhouette."""
    cw, ch = canvas_size
    sw, sh = subject.size
    shadow_h = max(8, int(sh * 0.10))

    silhouette = subject.getchannel("A")
    # take the bottom slice of the silhouette and squash it into a ground shadow
    strip = silhouette.crop((0, int(sh * 0.80), sw, sh)).resize((sw, shadow_h), Image.LANCZOS)

    layer = Image.new("L", (cw, ch), 0)
    layer.paste(strip, (pos[0], min(ch - shadow_h, pos[1] + sh - int(shadow_h * 0.45))))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=max(6, sw // 45)))
    layer = layer.point(lambda v: int(v * 0.40))         # keep it subtle

    shadow = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    shadow.putalpha(layer)
    return shadow


def compose(rgba):
    """Centre the subject on a transparent 5:4 canvas with consistent margin."""
    subject = trim_to_subject(rgba)
    avail_w = int(CANVAS_W * (1 - 2 * MARGIN))
    avail_h = int(CANVAS_H * (1 - 2 * MARGIN))
    scale = min(avail_w / subject.width, avail_h / subject.height)
    subject = subject.resize(
        (max(1, int(subject.width * scale)), max(1, int(subject.height * scale))),
        Image.LANCZOS,
    )

    pos = ((CANVAS_W - subject.width) // 2, (CANVAS_H - subject.height) // 2)

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    canvas = Image.alpha_composite(canvas, contact_shadow(subject, (CANVAS_W, CANVAS_H), pos))
    canvas.paste(subject, pos, subject)
    return canvas


def process_one(filename, extra_rotation, out_name):
    src = SRC_DIR / filename
    print(f"  {filename}  ->  {out_name}")
    img = Image.open(src)
    img = straighten(img, extra_rotation)
    img = cutout(img)
    img = studio_enhance(img)
    img = compose(img)
    out_path = OUT_DIR / out_name
    img.save(out_path, "WEBP", quality=92, method=6, lossless=False)
    return out_path


# (source, rotation, output) — every usable real photo, mapped to a named view.
JOBS = [
    # ---- SFF tower: front / angled / side / bottom ----
    ("20260827_122620.jpg.jpeg", -90, "dp80-1.webp"),   # front 3/4 hero
    ("20260827_123602.jpg.jpeg", -90, "dp80-2.webp"),   # front + top
    ("20260827_123520.jpg.jpeg", -90, "dp80-3.webp"),   # front straight
    ("20260827_123739.jpg.jpeg", -90, "dp80-4.webp"),   # side panel
    ("20260827_123824.jpg.jpeg", -90, "dp80-5.webp"),   # underside / feet
    ("20260827_124041.jpg.jpeg", -90, "dp80-6.webp"),   # vent detail
    # ---- MT tower: side panels (no front shot exists yet) ----
    ("20260827_124231.jpg.jpeg", -90, "dp180-1.webp"),  # mesh window side
    ("20260827_124248.jpg.jpeg", -90, "dp180-2.webp"),  # solid panel side
    ("20260827_124354.jpg.jpeg", -90, "dp180-3.webp"),  # mesh side, alt framing
    ("20260827_124311.jpg.jpeg", -90, "dp180-5.webp"),  # mesh side, alt exposure
    # ---- Archer laptop: 3/4 / top / front / rear / closed ----
    ("20260827_163650.jpg.jpeg", 0, "laptop-archer-1.webp"),  # 3/4 hero
    ("20260827_163701.jpg.jpeg", 0, "laptop-archer-2.webp"),  # top-down open
    ("20260827_163639.jpg.jpeg", 0, "laptop-archer-3.webp"),  # front straight
    ("20260827_163721.jpg.jpeg", 0, "laptop-archer-4.webp"),  # rear I/O
    ("20260827_163604.jpg.jpeg", 0, "laptop-archer-5.webp"),  # closed lid
    ("20260827_163755.jpg.jpeg", 0, "laptop-archer-6.webp"),  # underside
]

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    print(f"Processing into {OUT_DIR}")
    for filename, rotation, out_name in JOBS:
        if only and only not in out_name:
            continue
        try:
            process_one(filename, rotation, out_name)
        except Exception as e:
            print(f"    FAILED {out_name}: {e}", file=sys.stderr)
    print("done")

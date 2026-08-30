"""
Turn the REAL photographs that were never used into per-model feature bands.

Only ~9 of the 23 source photos were consumed by the gallery pass; the rest are
exactly the detail shots the feature chapters need — vents, the certification
label, the mesh window onto the actual board, the laptop's rear I/O.

These render in `aspect-[16/10]` feature bands over the dark page, so unlike the
gallery cutouts they are composed onto a designed studio backdrop rather than
left transparent. The backdrop is drawn with Pillow, not generated: nothing here
invents hardware, and the Latios wordmark in these frames is the real one from
the camera.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

from process import straighten, cutout, studio_enhance, trim_to_subject
from process_real_angles import gentle_enhance

SRC = Path(r"C:\Ronak\Latios\Images")
OUT = Path(__file__).parent / "generated"
BAND_W, BAND_H = 1600, 1000          # 16:10, matches ParallaxImage's feature band
MARGIN = 0.10


def backdrop(w, h):
    """Dark studio sweep: a soft pool of light behind the product, vignetted."""
    base = Image.new("RGB", (w, h), (10, 10, 12))
    glow = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(glow)
    d.ellipse((int(w * 0.10), int(h * 0.02), int(w * 0.90), int(h * 1.05)), fill=120)
    glow = glow.filter(ImageFilter.GaussianBlur(w // 7))
    return Image.composite(Image.new("RGB", (w, h), (34, 35, 40)), base, glow)


def contact(subject, size, pos, strength=0.55):
    """Soft shadow under the product so it sits on the sweep."""
    w, h = subject.size
    strip = subject.getchannel("A").crop((0, int(h * 0.80), w, h))
    strip = strip.resize((int(w * 1.10), max(6, int(h * 0.13))), Image.LANCZOS)
    layer = Image.new("L", size, 0)
    layer.paste(strip, (pos[0] - int(w * 0.05), pos[1] + h - strip.height // 2))
    layer = layer.filter(ImageFilter.GaussianBlur(max(10, w // 16)))
    sh = Image.new("RGBA", size, (0, 0, 0, 0))
    sh.putalpha(layer.point(lambda v: int(v * strength)))
    return sh


def band(rgba):
    subj = trim_to_subject(rgba)
    aw, ah = int(BAND_W * (1 - 2 * MARGIN)), int(BAND_H * (1 - 2 * MARGIN))
    s = min(aw / subj.width, ah / subj.height)
    subj = subj.resize((max(1, int(subj.width * s)), max(1, int(subj.height * s))), Image.LANCZOS)
    pos = ((BAND_W - subj.width) // 2, (BAND_H - subj.height) // 2)
    canvas = backdrop(BAND_W, BAND_H).convert("RGBA")
    canvas = Image.alpha_composite(canvas, contact(subj, (BAND_W, BAND_H), pos))
    canvas.paste(subj, pos, subj)
    return canvas.convert("RGB")


def run(filename, rotation, out_name, reflective=False):
    img = straighten(Image.open(SRC / filename), rotation)
    img = cutout(img)
    img = gentle_enhance(img) if reflective else studio_enhance(img)
    out = OUT / out_name
    band(img).save(out, "WEBP", quality=90, method=6)
    print(f"  {out_name:26s} {out.stat().st_size//1024:>4}KB   <- {filename}")


JOBS = [
    # SFF (dp80) — thermal, certification, placement
    ("20260827_124041.jpg.jpeg", -90, "detail-sff-vent.webp",   False),
    ("20260827_124103.jpg.jpeg", -90, "detail-sff-label.webp",  False),
    ("20260827_123739.jpg.jpeg", -90, "detail-sff-flat.webp",   False),
    ("20260827_123824.jpg.jpeg", -90, "detail-sff-base.webp",   False),
    # MT (dp180) — serviceability, the board behind the mesh, panel design
    ("20260827_124311.jpg.jpeg", -90, "detail-mt-inside.webp",  False),
    ("20260827_124334.jpg.jpeg", -90, "detail-mt-panel.webp",   False),
    ("20260827_124256.jpg.jpeg", -90, "detail-mt-side.webp",    False),
    # Archer laptop — real I/O and the genuine lid wordmark
    ("20260827_163721.jpg.jpeg",   0, "detail-archer-io.webp",   True),
    ("20260827_163650.jpg.jpeg",   0, "detail-archer-open.webp", True),
]

if __name__ == "__main__":
    for j in JOBS:
        try:
            run(*j)
        except Exception as e:
            print(f"  FAILED {j[2]}: {type(e).__name__}: {e}")

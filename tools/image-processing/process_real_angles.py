"""
Process the remaining REAL Latios photographs into studio product shots.

No generation — these are photographs, so the Latios wordmark, PRO badge and
port labels are genuine and legible by construction.

Two tone profiles: the default one (process.studio_enhance) is tuned for the
matte-black tower chassis and blows out the laptop's brushed/reflective lid, so
reflective subjects get a gentler curve instead.
"""
from PIL import Image, ImageEnhance, ImageFilter
from process import straighten, cutout, compose, OUT_DIR


def gentle_enhance(rgba):
    """For reflective / light-toned surfaces: protect highlights, mild clarity."""
    rgb = rgba.convert("RGB")
    a = rgba.getchannel("A")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.10)
    rgb = ImageEnhance.Brightness(rgb).enhance(0.90)   # pull back the blowout
    rgb = ImageEnhance.Color(rgb).enhance(0.96)
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=3))
    rgb.putalpha(a)
    return rgb


def run(filename, rotation, out_name, reflective=False):
    from process import studio_enhance
    print(f"  {filename} -> {out_name} (rot={rotation}, reflective={reflective})")
    img = straighten(Image.open(rf"C:\Ronak\Latios\Images\{filename}"), rotation)
    img = cutout(img)
    img = gentle_enhance(img) if reflective else studio_enhance(img)
    img = compose(img)
    out = OUT_DIR / out_name
    img.save(out, "WEBP", quality=92, method=6)
    print(f"     saved {out.name} ({out.stat().st_size//1024}KB)")


JOBS = [
    ("20260827_123739.jpg.jpeg", -90, "dp80-4.webp", False),   # SFF side panel
    ("20260827_123824.jpg.jpeg", -90, "dp80-5.webp", False),   # SFF underside
    ("20260827_124041.jpg.jpeg", -90, "dp80-6.webp", False),   # SFF vent detail
    ("20260827_124311.jpg.jpeg", -90, "dp180-3.webp", False),  # MT mesh side alt
    ("20260827_124334.jpg.jpeg", -90, "dp180-4.webp", False),  # MT solid panel alt
    ("20260827_163604.jpg.jpeg", 180, "laptop-archer-4.webp", True),   # lid (logo was inverted)
    ("20260827_163755.jpg.jpeg", 0,   "laptop-archer-5.webp", True),   # base + model label
]

if __name__ == "__main__":
    for j in JOBS:
        try:
            run(*j)
        except Exception as e:
            print(f"  FAILED {j[2]}: {e}")

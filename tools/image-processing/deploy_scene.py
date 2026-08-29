"""
Convert generated scene/feature imagery to web-sized WebP and drop it into
frontend/public/images/.

Unlike the product cutouts these keep their background (they render `object-cover`
inside feature bands), so they do NOT go through finalize.py's rembg pass.
"""
import sys
from pathlib import Path
from PIL import Image

GEN = Path(__file__).parent / "generated"
DEST = Path(r"C:\Ronak\latios-web\frontend\public\images")

MAX_W = 1600


def deploy(src_name, out_name, quality=86):
    im = Image.open(GEN / src_name).convert("RGB")
    if im.width > MAX_W:
        h = round(im.height * MAX_W / im.width)
        im = im.resize((MAX_W, h), Image.LANCZOS)
    out = DEST / out_name
    im.save(out, "WEBP", quality=quality, method=6)
    print(f"  {src_name} -> {out.name}  ({im.width}x{im.height}, {out.stat().st_size // 1024}KB)")


if __name__ == "__main__":
    pairs = [tuple(a.split("=")) for a in sys.argv[1:]]
    if not pairs:
        print("usage: deploy_scene.py <generated.jpg>=<out.webp> ...")
        sys.exit(1)
    for s, o in pairs:
        deploy(s, o)

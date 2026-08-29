"""Straighten + downscale source photos so they can be uploaded as Flux references."""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path(r"C:\Ronak\Latios\Images")
OUT = Path(__file__).parent / "uploads"
OUT.mkdir(exist_ok=True)

# (source, rotation, upload name)
ITEMS = [
    ("20260827_122620.jpg.jpeg", -90, "sff-front-34.jpg"),
    ("20260827_123602.jpg.jpeg", -90, "sff-front-top.jpg"),
    ("20260827_123739.jpg.jpeg", -90, "sff-side.jpg"),
    ("20260827_124231.jpg.jpeg", -90, "mt-mesh-side.jpg"),
    ("20260827_124248.jpg.jpeg", -90, "mt-solid-side.jpg"),
    ("20260827_163650.jpg.jpeg", 0, "archer-34.jpg"),
    ("20260827_163701.jpg.jpeg", 0, "archer-topdown.jpg"),
    ("20260827_163639.jpg.jpeg", 0, "archer-front.jpg"),
    ("20260827_163721.jpg.jpeg", 0, "archer-rear.jpg"),
    ("20260827_163604.jpg.jpeg", 0, "archer-closed.jpg"),
]

for src, rot, out in ITEMS:
    im = ImageOps.exif_transpose(Image.open(SRC / src))
    if rot:
        im = im.rotate(rot, expand=True)
    im = im.convert("RGB")
    im.thumbnail((2048, 2048), Image.LANCZOS)
    p = OUT / out
    im.save(p, "JPEG", quality=92)
    print(f"{p}  {im.size}  {p.stat().st_size // 1024}KB")

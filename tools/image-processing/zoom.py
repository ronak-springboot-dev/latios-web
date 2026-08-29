import sys
from pathlib import Path
from PIL import Image

# zoom.py <file> <x0> <y0> <x1> <y1>  (fractions of width/height)
f = sys.argv[1]
x0, y0, x1, y1 = (float(v) for v in sys.argv[2:6])
im = Image.open(Path(__file__).parent / "generated" / f)
w, h = im.size
crop = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
out = Path(__file__).parent / "preview" / f"zoom-{Path(f).stem}.jpg"
out.parent.mkdir(exist_ok=True)
crop.save(out, "JPEG", quality=92)
print(out)

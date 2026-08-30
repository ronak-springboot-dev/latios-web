"""
Crop the REAL component photography already in the repo into per-model art.

The previous pass tried to *generate* branded silicon and produced garbled
wordmarks ("Lotios", "Lobos"). The rule now is: anything carrying an Intel, AMD,
NVIDIA or Latios mark comes from a photograph, cropped — never rendered. Only
unbranded subjects may be generated, because they contain no lettering to garble.

Several of these source frames also carry *competitor* marks (an ASUS silkscreen
beside the Ryzen die, a GeForce retail box behind the cooler). The crop boxes
below are chosen to put those outside the frame while keeping the genuine
Intel/AMD/NVIDIA part in shot.
"""
from pathlib import Path
from PIL import Image, ImageEnhance

# The two CPU frames carry competitor board branding just outside the crop, so
# they were moved out of public/ (where they would still be fetchable by URL)
# into this tools directory. The rest are brand-free and stay in the banner pool.
SRC_DIRS = [
    Path(__file__).parent / "sources",
    Path(r"C:\Ronak\latios-web\frontend\public\images\banner"),
]


def _find(name):
    for d in SRC_DIRS:
        if (d / name).exists():
            return d / name
    raise FileNotFoundError(f"{name} not found in {[str(d) for d in SRC_DIRS]}")
DEST = Path(r"C:\Ronak\latios-web\frontend\public\images\components")
MAX_W = 1600

# name -> (source, (l, t, r, b) as fractions, note)
CROPS = {
    "cpu-amd": (
        "banner-amd-2.jpg", (0.355, 0.28, 0.90, 0.72),
        "Ryzen die; drops the 'TUF B450M-PLUS' / ASUS silkscreen left of the socket",
    ),
    "cpu-intel": (
        "banner-intel-1.jpg", (0.30, 0.04, 0.97, 0.62),
        "Core i5 in socket; drops the board logo at lower-left",
    ),
    "gpu-pro": (
        "banner-nvidia-3.jpg", (0.06, 0.50, 0.88, 0.97),
        "fan shroud only; drops the GeForce retail box behind it",
    ),
    "cpu-amd-am4": (
        "banner-amd-1.jpg", (0.08, 0.0, 1.0, 0.90),
        "Ryzen 7 in a real Socket AM4 with DDR4 silkscreen - exact match for mt-amd-am4",
    ),
    "gpu-pro-2": (
        "banner-nvidia-2.jpg", (0.02, 0.02, 0.52, 0.72),
        "left card only; drops the 'RTX 2080' model number (wrong class for PROMAX)",
    ),
    "board-neutral": (
        "banner-board-1.jpg", (0.0, 0.0, 1.0, 1.0),
        "already brand-free; resize only",
    ),
    "pcb-macro": (
        "banner-board-2.jpg", (0.0, 0.0, 1.0, 1.0),
        "already brand-free; abstract engineering texture",
    ),
}


def run():
    DEST.mkdir(parents=True, exist_ok=True)
    for name, (src, box, note) in CROPS.items():
        im = Image.open(_find(src)).convert("RGB")
        l, t, r, b = box
        im = im.crop((int(im.width * l), int(im.height * t),
                      int(im.width * r), int(im.height * b)))
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        # These sit behind white text as full-bleed heroes, so pull them down a
        # little and add bite — the same treatment the site's other heroes get.
        im = ImageEnhance.Contrast(im).enhance(1.08)
        im = ImageEnhance.Brightness(im).enhance(0.94)
        out = DEST / f"{name}.webp"
        im.save(out, "WEBP", quality=88, method=6)
        print(f"  {name:14s} {im.width}x{im.height}  {out.stat().st_size//1024:>4}KB   {note}")


if __name__ == "__main__":
    run()

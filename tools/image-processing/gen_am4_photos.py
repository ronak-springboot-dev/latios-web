"""The AM4 page's photographic sections, graded from the Latios tower shoot.

    python gen_am4_photos.py            # build everything
    python gen_am4_photos.py fascia     # one of them

These are PHOTOGRAPHS, not renders. Nothing here asks a model for anything: the
shoot is of the real chassis, and the only operations are the ones a darkroom
does -- crop, exposure, white balance, local contrast, a vignette. The Latios
wordmark, the ribbing and the panel gaps are the camera's pixels throughout,
which is the whole reason to use them instead of the generated component art.

What the shoot contains that is deliberately NOT used here:

  the rear panel     it is the Intel unit's board. Two HDMI, eight USB and a
                     port count that does not match this model's Rear I/O row.
  the front panel    one Type-C where the spec row says two, and two audio jacks
                     where it says one Mic-in. A reader who counts finds a
                     contradiction, so the page keeps the row and drops the photo.
  the socket         LGA -- flat gold lands under a lever, not AM4's pin holes.
                     An Intel board cannot illustrate a Ryzen page.
  the cooler         it carries Intel's own mark.

Those four are still in the buy-box gallery from an earlier pass; they are worth
revisiting, but that is a data change, not an image one.
"""
import sys
from pathlib import Path

import numpy as np
import pillow_heif
from PIL import Image, ImageDraw, ImageFilter

pillow_heif.register_heif_opener()

SHOOT = Path(r"C:\Ronak\Latios\Images\Latios tower")
DEST = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "am4"
WORK = Path(__file__).parent / "generated" / "am4"
ACCENT = (217, 131, 36)


def shot(name):
    """One frame of the shoot, by its capture time."""
    return Image.open(SHOOT / f"20260908_{name}.heic").convert("RGB")


def crop(im, box):
    w, h = im.size
    x0, y0, x1, y1 = box
    return im.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))


def grade(im, gamma=1.0, black=0.0, white=1.0, warm=0.0, contrast=1.0,
          clarity=0.0, vignette=0.0, desat=0.0):
    """A darkroom pass: levels, white balance, local contrast, vignette.

    `clarity` is unsharp at a large radius, which is what makes the fascia's
    ribbing read at page size without sharpening the noise with it. `warm` tilts
    the balance towards the page's amber, so a photograph shot under a factory's
    daylight tubes sits beside renders lit with that accent.
    """
    arr = np.asarray(im).astype(np.float32) / 255
    arr = np.clip((arr - black) / max(1e-6, white - black), 0, 1)
    if gamma != 1.0:
        arr = arr ** gamma
    if contrast != 1.0:
        arr = np.clip((arr - 0.5) * contrast + 0.5, 0, 1)
    if warm:
        tilt = (np.array(ACCENT, np.float32) / 255 - 0.5) * warm
        arr = np.clip(arr * (1 + tilt), 0, 1)
    if desat:
        lum = arr @ np.array([0.299, 0.587, 0.114], np.float32)
        arr = arr * (1 - desat) + lum[..., None] * desat
    out = Image.fromarray((arr * 255).astype("uint8"))
    if clarity:
        out = out.filter(ImageFilter.UnsharpMask(
            radius=max(4, out.width // 160), percent=int(clarity), threshold=2))
    if vignette:
        w, h = out.size
        yy, xx = np.mgrid[0:h, 0:w]
        r = np.sqrt(((xx / w - 0.5) / 0.62) ** 2 + ((yy / h - 0.5) / 0.62) ** 2)
        v = np.clip(1 - vignette * np.clip(r - 0.55, 0, None) ** 1.5 * 3.2, 0, 1)
        out = Image.fromarray((np.asarray(out) * v[..., None]).clip(0, 255).astype("uint8"))
    return out


def install(im, name, width=1600):
    DEST.mkdir(parents=True, exist_ok=True)
    if im.width != width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    out = DEST / f"{name}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:18s} {im.size}  {out.stat().st_size // 1024:>4}KB")


# --- the fascia ------------------------------------------------------------
# A macro of the extruded front, with the wordmark where the light catches it.
# Cropped off the top-left corner, which holds a sliver of the factory's wall,
# and off the bottom, where the PRO badge is cut in half by the frame.

def fascia():
    im = crop(shot("124708"), (0.055, 0.030, 1.0, 0.840))
    im = grade(im, black=0.012, white=0.86, gamma=1.06, contrast=1.14,
               warm=0.22, clarity=85, vignette=0.60)
    install(im, "fascia")


# --- the desk ---------------------------------------------------------------
# The tower where it actually stands, next to a monitor. The shoot's frame is a
# factory bench under daylight tubes, so the grade does what a photographer's
# lights would have: pulls the room down, keeps the product up, warms the desk.
#
# The display is filled with the Latios wallpaper rather than left as the dark,
# dusty off-state the shoot caught. That is the same treatment every screen on
# the site gets, and the alternative -- a black rectangle where the monitor is --
# says nothing about a machine that drives two 4K displays.

DESK_CROP = (0.060, 0.170, 1.000, 0.950)
# Screen corners (TL, TR, BR, BL) as fractions OF THE CROP, measured off a
# gridded proof. Slightly inside the bezel: the panel's own edge is a soft
# gradient, and landing on it left a bright sliver along the top.
DESK_SCREEN = [(0.4455, 0.1485), (0.9505, 0.1470), (0.9505, 0.5665), (0.4455, 0.5700)]


def _grid(im, out, quad=None):
    g = im.copy()
    g.thumbnail((1500, 1500))
    d = ImageDraw.Draw(g)
    W, H = g.size
    for i in range(1, 40):
        x, y = int(W * i / 40), int(H * i / 40)
        d.line([(x, 0), (x, H)], fill=(255, 60, 60))
        d.line([(0, y), (W, y)], fill=(60, 170, 255))
        if i % 4 == 0:
            d.text((x + 2, 2), f"{i/40:.3f}", fill=(255, 90, 90))
            d.text((2, y + 2), f"{i/40:.3f}", fill=(90, 190, 255))
    if quad:
        d.polygon([(x * W, y * H) for x, y in quad], outline=(255, 220, 0))
    g.save(out)
    print("  proof ->", out)


def spotlight(im, at=(0.52, 0.60), radius=(0.80, 0.92), lift=0.48, tint_amt=0.26):
    """A warm pool of light over the desk, falling off to the room.

    A vignette alone could not do this. The shoot is lit by the ceiling tubes
    above a white bench, so the brightest thing in frame is the WALL; darkening
    the edges left the middle still flat and the product still the darkest object
    in its own photograph. This puts a light where a photographer would have
    stood one, and the global exposure below takes the room down to meet it.
    """
    w, h = im.size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx / w - at[0]) / radius[0]) ** 2 + ((yy / h - at[1]) / radius[1]) ** 2)
    g = np.clip(1 - r, 0, 1) ** 1.7
    arr = np.asarray(im).astype(np.float32)
    arr *= (1 + lift * g)[..., None]
    arr += np.array(ACCENT, np.float32) * tint_amt * g[..., None]
    return Image.fromarray(arr.clip(0, 255).astype("uint8"))


def desk(check=False):
    import laptop_refs as refs
    im = crop(shot("125535"), DESK_CROP)
    if check:
        _grid(im, WORK / "check-desk.png", DESK_SCREEN)
    # Room down first, light back in second, screen last: branded before the
    # grade the wallpaper went down with everything else and the monitor read as
    # off again, which is the one thing this frame exists to fix.
    im = grade(im, black=0.022, gamma=1.72, contrast=1.05, warm=0.10,
               desat=0.18, clarity=50)
    im = spotlight(im)
    im = grade(im, vignette=0.55)
    w, h = im.size
    quad = [(x * w, y * h) for x, y in DESK_SCREEN]
    im = refs.brand_screen(im, quad, refs.wallpaper("#d98324")).convert("RGB")
    install(im, "desk-photo")


JOBS = {"fascia": fascia, "desk": desk}

if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    check = "--check" in sys.argv
    for name, fn in JOBS.items():
        if not only or name in only:
            fn(check=check) if name == "desk" else fn()

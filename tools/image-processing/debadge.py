"""
Remove the MSI 'PRO' cube badge from the real Latios product photographs.

The physical sample units Latios photographed still carry MSI's PRO-series badge
(an isometric cube over the word PRO) silkscreened on the chassis — visible in
dp180-1, dp180-3 and dp80-3. Latios sells these as its own hardware, so the
competitor mark does not belong on its storefront.

The badge sits on a large area of uniform matte-black panel, so it is patched by
cloning clean panel from directly beside it through a feathered mask. Nothing is
generated and no other pixel is touched.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw, ImageChops
import numpy as np

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")


def find_badge(im, search, thresh=95, min_px=40):
    """Locate the light silkscreen blob inside `search` (fractional l,t,r,b)."""
    w, h = im.size
    l, t, r, b = (int(w*search[0]), int(h*search[1]), int(w*search[2]), int(h*search[3]))
    region = np.asarray(im.convert("L").crop((l, t, r, b))).astype(np.int16)
    mask = region > thresh
    if mask.sum() < min_px:
        return None
    ys, xs = np.nonzero(mask)
    return (l + int(xs.min()), t + int(ys.min()), l + int(xs.max()) + 1, t + int(ys.max()) + 1)


def clone_patch(im, box, dx, dy, feather=12, pad=30):
    """Cover `box` with panel cloned from (dx,dy) away, blended through a soft mask."""
    x0, y0, x1, y1 = (box[0]-pad, box[1]-pad, box[2]+pad, box[3]+pad)
    src = im.crop((x0+dx, y0+dy, x1+dx, y1+dy))
    mask = Image.new("L", (x1-x0, y1-y0), 0)
    ImageDraw.Draw(mask).rectangle((feather, feather, x1-x0-feather, y1-y0-feather), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    out = im.copy()
    out.paste(src, (x0, y0), mask)
    return out


# Explicit boxes: the badge sits on a narrow bezel band, so the automatic
# luminance search also grabbed the chassis edge highlight above it. Clone
# sideways along that same band — vertically there is an edge within ~40px.
def interp_fill(im, box, sample=14, feather=8, pad=6):
    """
    Inpaint `box` by interpolating each row between clean panel either side.

    Used where the badge sits close to a panel edge, so cloning a block from
    elsewhere drags that edge into frame. On a flat matte band a per-row ramp
    between the two neighbours reproduces the panel's own tone gradient exactly.
    Panel grain is restored afterwards from the local noise level.
    """
    x0, y0, x1, y1 = (box[0]-pad, box[1]-pad, box[2]+pad, box[3]+pad)
    a = np.asarray(im).astype(np.float32)
    left = a[y0:y1, x0-sample:x0].mean(axis=1)          # (rows, 3)
    right = a[y0:y1, x1:x1+sample].mean(axis=1)
    w = x1 - x0
    ramp = np.linspace(0.0, 1.0, w)[None, :, None]
    fill = left[:, None, :] * (1 - ramp) + right[:, None, :] * ramp
    # Monochrome grain only: independent per-channel noise reads as rainbow
    # speckle on the bright brushed panels, which is more obvious than the badge.
    grain = float(a[y0:y1, x1:x1+sample].std())
    mono = np.random.default_rng(7).normal(0, min(3.0, max(0.8, grain * 0.25)),
                                           (fill.shape[0], fill.shape[1], 1))
    fill = fill + mono
    patch = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8))
    mask = Image.new("L", (w, y1-y0), 0)
    ImageDraw.Draw(mask).rectangle((feather, feather, w-feather, y1-y0-feather), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    out = im.copy(); out.paste(patch, (x0, y0), mask)
    return out


def interp_fill_v(im, box, sample=14, feather=5, padx=8, pady=18):
    """
    Vertical twin of interp_fill: interpolate each COLUMN between clean panel
    above and below.

    The MSI wordmark on the mini-PC front sits rotated on a narrow vertical band.
    Interpolating horizontally would drag the neighbouring textured vent and the
    power-button column into it, so the ramp has to run along the band instead.
    """
    # padx stays small: widening sideways would drag the neighbouring vent
    # texture and power-button column into the fill. pady can be generous
    # because the band is uniform along its length. feather < pad so the
    # mask is fully opaque across the whole mark rather than inset inside it.
    x0, y0, x1, y1 = (box[0]-padx, box[1]-pady, box[2]+padx, box[3]+pady)
    a = np.asarray(im).astype(np.float32)
    top = a[y0-sample:y0, x0:x1].mean(axis=0)        # (cols, 3)
    bot = a[y1:y1+sample, x0:x1].mean(axis=0)
    h = y1 - y0
    ramp = np.linspace(0.0, 1.0, h)[:, None, None]
    fill = top[None, :, :] * (1 - ramp) + bot[None, :, :] * ramp
    grain = float(a[y1:y1+sample, x0:x1].std())
    mono = np.random.default_rng(11).normal(0, min(3.0, max(0.8, grain * 0.25)),
                                            (fill.shape[0], fill.shape[1], 1))
    patch = Image.fromarray(np.clip(fill + mono, 0, 255).astype(np.uint8))
    mask = Image.new("L", (x1-x0, h), 0)
    ImageDraw.Draw(mask).rectangle((feather, feather, x1-x0-feather, h-feather), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    out = im.copy(); out.paste(patch, (x0, y0), mask)
    return out


JOBS = [
    # file,          badge box (x0,y0,x1,y1),   clone offset (dx, dy)
    # Already applied and deployed — kept here as the record of what was patched.
    # ("dp180-1.webp", (183, 1070, 272, 1118), (150, 0),  30, 12),
    # ("dp180-3.webp", (280, 1070, 372, 1118), (150, 0),  30, 12),
    ("dp80-1.webp",  (156,  594, 248,  652), None,      0,   0),
    ("dp80-2.webp",  (176,  516, 258,  552), None,      0,   0),
    # dp80-3's badge sits on a band that slopes down to the right, and the mesh
    # panel edge is only ~30px above it — so this clone follows the slope and
    # uses a tighter pad to avoid dragging that edge into frame.
    # ("dp80-3.webp",  (138,  936, 262,  992), None,      0,   0),
]

if __name__ == "__main__":
    for name, box, offset, pad, feather in JOBS:
        p = IMAGES / name
        im = Image.open(p)
        alpha = im.getchannel("A") if im.mode == "RGBA" else None
        rgb = im.convert("RGB")
        print(f"  {name}: patching {box}  ({box[2]-box[0]}x{box[3]-box[1]}px)")
        if offset is None:
            fixed = interp_fill(rgb, box)
        else:
            fixed = clone_patch(rgb, box, *offset, feather=feather, pad=pad)
        if alpha is not None:
            fixed = fixed.convert("RGBA"); fixed.putalpha(alpha)
        fixed.save(Path("generated") / f"debadge-{name}", "WEBP", quality=92, method=6)
        print(f"     -> generated/debadge-{name}")

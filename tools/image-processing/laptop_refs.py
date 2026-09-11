"""Reference renders for the laptop pages, and the Latios branding put on them.

The references are the factory's CAD renders: a grey 14" aluminium laptop (the
PRO 14, 13 views) and a slim dark notebook (the Notebook 14, 7 open-lid views).
Their lids are blank, the PRO 14's screens carry a stock ribbon wallpaper of
unknown licence, and the notebook's screens are blank white.

Branding is composited here, never generated: the image model garbles lettering
at every denoise that changes anything, and a wordmark is the one thing that
must come out exact. Everything below is geometry on the real wordmark file.

  screen_quad   the display's four corners, found from its own pixels -- the
                ribbon wallpaper is strongly saturated, a blank screen is white,
                and the bezel and chassis around both are neither.
  wallpaper     a Latios screen: dark ground, the page's accent as a glow, the
                wordmark centred. Replaces the ribbon everywhere it appears.
  brand_screen  the wallpaper warped onto the screen quad, with a faint sheen.
  brand_lid     the wordmark placed on the lid plane by perspective warp, as an
                etched mark: darker on a light lid, lighter on a dark one.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

from am4_studio import _coeffs

IMAGES = Path(r"C:/Ronak/Latios/Images")
PRO14 = IMAGES / "latios notebook" / "gray+copilot"          # the folder names are swapped:
NOTEBOOK = IMAGES / "latios-business laptop"                 # this one holds the notebook
WORDMARK = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "latios-wordmark-reversed.png"

# Display corners (TL, TR, BR, BL) as frame fractions, read off 4x corner grids.
# screen_quad() cannot be trusted on the ribbon: its lower right is pale and
# unsaturated, and the mask lost that corner (it put BR at y 0.38, not 0.53).
SCREENS = {
    "IDL_Open_45.png": [(0.5131, 0.1058), (0.8024, 0.0535), (0.7955, 0.5320), (0.5092, 0.4994)],
    # Near-frontal: read off a 0.01 grid, which is enough for a rectangle.
    "IDL_open_front.png": [(0.2931, 0.3045), (0.7038, 0.3045), (0.7038, 0.6013), (0.2931, 0.6013)],
    # Provisional, from a coarse grid: confirm with a corner proof before use.
    "IDL_Open_180.png": [(0.2569, 0.0660), (0.5368, 0.1250), (0.6254, 0.4340), (0.3405, 0.4167)],
}

# Lid corners (TL, TR, BR, BL -- hinge along BR-BL), frame fractions, read off
# gridded proofs. The wordmark is centred on the lid and reads upright with the
# hinge down, as a lid logo reads from behind an open laptop.
LIDS = {
    "IDL_Top.png": [(0.2404, 0.161), (0.7257, 0.161), (0.7257, 0.837), (0.2404, 0.837)],
    "IDL_BACK (1).png": [(0.2683, 0.140), (0.8407, 0.140), (0.8539, 0.868), (0.2550, 0.868)],
    # Closed, from the rear three-quarter: the hinge edge is the near one, where
    # the rear ports are, so the mark still reads upright from this camera.
    "IDL_Close_30.png": [(0.3935, 0.3601), (0.8205, 0.4303), (0.6925, 0.7828), (0.2000, 0.7863)],
}


def frac_quad(quad, size, grow=1.0):
    """Frame-fraction corners to pixels, grown about their centre by `grow`.

    A grow of ~1.004 carries a screen's new image a pixel or two under the
    bezel's inner edge, so no sliver of the old wallpaper can show at a corner.
    """
    w, h = size
    cx = sum(x for x, _ in quad) / 4
    cy = sum(y for _, y in quad) / 4
    return [((cx + (x - cx) * grow) * w, (cy + (y - cy) * grow) * h) for x, y in quad]


def cutout(path, width=2000):
    """A clean RGBA cut of a render whose own matte is unusable.

    Some renders ship on white (the lay-flat view) or with a hazy backdrop baked
    into the alpha (the closed and front views). The RGB is re-segmented with the
    rembg recipe that fixed the SFF shoot -- u2net with alpha matting, foreground
    250, background 15, erode 12 -- at 2000px, since no page image exceeds 1600.
    """
    import io
    from rembg import new_session, remove
    global _session
    try:
        _session
    except NameError:
        _session = new_session("u2net")
    rgb = Image.open(path).convert("RGB")
    rgb.thumbnail((width, width), Image.LANCZOS)
    buf = io.BytesIO()
    rgb.save(buf, "PNG")
    return Image.open(io.BytesIO(remove(
        buf.getvalue(), session=_session, alpha_matting=True,
        alpha_matting_foreground_threshold=250, alpha_matting_background_threshold=15,
        alpha_matting_erode_size=12))).convert("RGBA")


def wordmark_mask():
    """The wordmark as a white-on-black L mask, cropped, without the (R) mark.

    The (R) sits top-right, clear of the letters; a lid carries the word alone.
    """
    a = Image.open(WORDMARK).getchannel("A")
    w, h = a.size
    a = a.copy()
    ImageDraw.Draw(a).rectangle([int(w * 0.915), 0, w, int(h * 0.32)], fill=0)
    return a.crop(a.point(lambda v: 255 if v > 16 else 0).getbbox())


def screen_quad(im, kind="ribbon"):
    """Corners TL, TR, BR, BL of the display, in pixels.

    kind="ribbon": the stock wallpaper -- saturated pixels. kind="white": a blank
    screen -- pixels bright in all three channels. The extreme points of the
    eroded mask along the diagonals are the corners of a convex quad.
    """
    rgba = im.convert("RGBA")
    arr = np.asarray(rgba).astype(int)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    if kind == "white":
        m = (mn > 215) & (a > 200)
    else:
        sat = (mx - mn) / np.maximum(mx, 1)
        m = (sat > 0.28) & (mx > 64) & (a > 200)
    mask = Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.MinFilter(5))
    ys, xs = np.nonzero(np.asarray(mask))
    s, d = xs + ys, xs - ys
    pick = lambda i: (float(xs[i]), float(ys[i]))
    return [pick(np.argmin(s)), pick(np.argmax(d)), pick(np.argmax(s)), pick(np.argmin(d))]


def wallpaper(accent, size=(1600, 1000)):
    """A Latios screen in the page's accent: dark ground, a glow, the wordmark."""
    W, H = size
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    base = np.array([6, 9, 16]) * (1 - yy[..., None] / H) + np.array([10, 14, 24]) * (yy[..., None] / H)
    acc = np.array([int(accent[i:i + 2], 16) for i in (1, 3, 5)], float)
    glow = np.exp(-(((xx - 0.30 * W) / (0.55 * W)) ** 2 + ((yy - 1.05 * H) / (0.55 * H)) ** 2))
    glow2 = np.exp(-(((xx - 0.85 * W) / (0.40 * W)) ** 2 + ((yy + 0.10 * H) / (0.45 * H)) ** 2))
    img = base + acc * (0.55 * glow + 0.18 * glow2)[..., None]
    out = Image.fromarray(img.clip(0, 255).astype("uint8"))
    mark = wordmark_mask()
    mw = int(W * 0.30)
    mark = mark.resize((mw, round(mark.height * mw / mark.width)), Image.LANCZOS)
    out.paste(Image.new("RGB", mark.size, (245, 247, 250)),
              ((W - mw) // 2, (H - mark.height) // 2), mark)
    return out


def _warp_into(src, size, quad):
    """src (RGB or L) warped so its corners land on quad, on a canvas of size."""
    w, h = src.size
    return src.transform(size, Image.PERSPECTIVE,
                         _coeffs(quad, [(0, 0), (w, 0), (w, h), (0, h)]), Image.BICUBIC)


def brand_screen(im, quad, wall):
    """Replace the display with `wall`, plus a faint diagonal sheen."""
    rgba = im.convert("RGBA")
    size = rgba.size
    warped = _warp_into(wall, size, quad)
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).polygon(quad, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(0.8))
    # A soft band of reflected light across the glass, strongest top-right and
    # gone by the middle. Computed, not a rotated gradient image: rotating left
    # black corners that showed as a hard diagonal step on the screen.
    ww, wh = wall.size
    yy, xx = np.mgrid[0:wh, 0:ww].astype(float)
    band = np.clip((0.55 * xx / ww + 0.45 * (1 - yy / wh) - 0.55) / 0.45, 0, 1) ** 2
    sheen = _warp_into(Image.fromarray((band * 26).astype("uint8")), size, quad)
    lit = ImageChops.add(warped, Image.merge("RGB", (sheen, sheen, sheen)))
    out = Image.composite(lit.convert("RGBA"), rgba, m)
    out.putalpha(rgba.getchannel("A"))
    return out


def _lerp_quad(quad, u, v):
    """The point at (u, v) in the bilinear parameterisation of a quad."""
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = quad
    top = (x0 + (x1 - x0) * u, y0 + (y1 - y0) * u)
    bot = (x3 + (x2 - x3) * u, y3 + (y2 - y3) * u)
    return (top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v)


def brand_lid(im, lid, width=0.22, centre=(0.5, 0.5), tone="dark"):
    """Etch the wordmark onto the lid quad (TL, TR, BR, BL -- hinge along BR-BL).

    width is the mark's width as a fraction of the lid's; centre is where it sits
    in the lid's own (u, v). tone="dark" for a light lid: the mark is a darker
    graphite with a hairline highlight along its upper edges, as a polished
    etch reads on sandblasted aluminium. tone="light" for a dark lid.
    """
    rgba = im.convert("RGBA")
    size = rgba.size
    mark = wordmark_mask()
    lid_w = (np.hypot(lid[1][0] - lid[0][0], lid[1][1] - lid[0][1]) +
             np.hypot(lid[2][0] - lid[3][0], lid[2][1] - lid[3][1])) / 2
    lid_h = (np.hypot(lid[3][0] - lid[0][0], lid[3][1] - lid[0][1]) +
             np.hypot(lid[2][0] - lid[1][0], lid[2][1] - lid[1][1])) / 2
    mw = width
    mh = width * lid_w / lid_h * mark.height / mark.width          # keep the mark's proportions
    u0, v0 = centre[0] - mw / 2, centre[1] - mh / 2
    q = [_lerp_quad(lid, u0, v0), _lerp_quad(lid, u0 + mw, v0),
         _lerp_quad(lid, u0 + mw, v0 + mh), _lerp_quad(lid, u0, v0 + mh)]
    big = mark.resize((mark.width * 4, mark.height * 4), Image.LANCZOS)   # warp from a finer source
    m = _warp_into(big, size, q)
    lift = ImageChops.subtract(m, m.transform(size, Image.AFFINE, (1, 0, 0, 0, 1, 1)))  # upper edges
    arr = np.asarray(rgba).astype(float)
    k = np.asarray(m).astype(float)[..., None] / 255
    e = np.asarray(lift).astype(float)[..., None] / 255
    if tone == "dark":
        arr[..., :3] = arr[..., :3] * (1 - 0.42 * k) + 255 * 0.35 * e
    else:
        arr[..., :3] = arr[..., :3] * (1 - 0.55 * k) + 205 * 0.55 * k + 255 * 0.25 * e
    return Image.fromarray(arr.clip(0, 255).astype("uint8"), "RGBA")

"""One clean cutout of the real MT chassis, shared by every image on the AM4 page.

Two images need the chassis off its studio background -- the hero render's
staging and the bento card with dimension callouts -- and both went wrong the
same way with a luminance threshold: at <150 it caught the grey contact shadow
and left a ragged fringe along the bottom; eroded at <110 it turned that fringe
into black speckle along the top and right. A black box against a white sweep
with a grey shadow is exactly where a threshold is weakest.

So this uses the recipe that already fixed the same problem on the SFF shoot:
rembg's u2net session with alpha matting, at the thresholds shoot_fronts.py
settled on (foreground 250, background 15, erode 12).

Before cutting, the mesh window is redrawn as perforated steel with nothing
behind it. This unit is the Intel Q670, and at card size its board shows through
the mesh as bright blobs -- on an AM4 page that is the wrong board.

    python am4_chassis.py      # writes the cutout, the bento image, and prints
                               # the callout geometry for the page data
"""
import io
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from rembg import new_session, remove

HIRES = Path(r"C:/Ronak/Latios/Images/pipeline/hires")
WORK = Path(__file__).parent / "generated" / "am4"
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "am4"

# The mesh window on pipeline/render-cut/mt-flank.png, measured off a gridded
# proof of THAT file. Its framing differs from the hires photograph -- the
# right edge sits at 0.482, not 0.494 -- so the photo's box cannot be reused.
MESH = (0.146, 0.158, 0.482, 0.710)

# Below the chassis, the render-cut carries the white sweep's contact shadow as
# FOREGROUND -- a grey band under the lip, mostly opaque, and a pale wedge left
# of the front foot (L~145, brighter than the foot itself). On the dark hero
# ground it read as a light halo, which no real shadow is. Everything under the
# lip's lower edge becomes black at its existing alpha: a dark contact shadow
# that is right on the dark hero and on the light-theme bento card alike.
# Measured off a gridded proof of chassis-cut.png, as fractions of that file.
LIP = ((0.060, 0.948), (0.855, 0.985))     # lower edge of the lip, a straight line
BEZEL_X = 0.858                            # front bezel: its own curved foot
FEET = [(0.100, 0.945, 0.133, 0.969), (0.773, 0.976, 0.832, 0.995)]

_session = None


def _redraw_mesh(im):
    w, h = im.size
    x0, y0, x1, y1 = int(w * MESH[0]), int(h * MESH[1]), int(w * MESH[2]), int(h * MESH[3])
    d = ImageDraw.Draw(im)
    d.rectangle([x0, y0, x1, y1], fill=(24, 24, 26))
    pitch = max(6, int(w * 0.0105))
    r, row, y = pitch * 0.36, 0, y0 + pitch
    while y < y1 - pitch * 0.5:
        x = x0 + pitch + (pitch / 2 if row % 2 else 0)
        while x < x1 - pitch * 0.5:
            d.regular_polygon((x, y, r), 6, fill=(5, 5, 6))
            x += pitch
        y += pitch * 0.866
        row += 1
    return im


def _shadow_below_lip(rgba):
    """Recolour the baked-in sweep shadow to black; keep its alpha and the feet."""
    arr = np.array(rgba)
    h, w = arr.shape[:2]
    top = int(h * 0.90)                    # nothing above this row is touched
    band = arr[top:]
    ys, xs = np.mgrid[top:h, 0:w]
    xf, yf = xs / w, ys / h
    (x0, y0), (x1, y1) = LIP
    lip = y0 + (xf - x0) * (y1 - y0) / (x1 - x0)
    zone = (yf > lip + 0.001) & (xf <= BEZEL_X)
    zone |= (xf > BEZEL_X) & (band[..., 3] < 200)     # the bezel's soft underside
    lum = band[..., :3].astype(int) @ np.array([299, 587, 114]) // 1000
    for fx0, fy0, fx1, fy1 in FEET:
        foot = (xf >= fx0) & (xf <= fx1) & (yf >= fy0) & (yf <= fy1) & (lum > 80)
        zone &= ~foot
    band[zone, :3] = (6, 6, 7)
    return Image.fromarray(arr, "RGBA")


def _background_mask(src):
    """Background = light pixels connected to the frame edge.

    Two general tools failed on this photograph, for reasons specific to it:

      * a global luminance threshold caught the grey contact shadow (fringe)
        and, eroded, the dust and glints on the panel (speckle);
      * rembg/u2net returned almost no alpha at all -- the chassis fills about
        90% of the frame, and a salient-object model takes a subject that big
        for background. Even after the mesh fix it kept only the one region
        forced solid.

    What this photo actually offers is simpler: a light sweep touching the
    border, and a dark box whose edge is a hard boundary. Flood-filling inward
    from the border through light-ish pixels finds exactly the sweep and its
    shadow. Specks inside the panel are not connected to the border, so they
    cannot leak -- which is precisely what the global threshold got wrong.
    """
    L = src.convert("L")
    light = L.point(lambda v: 255 if v > 78 else 0)
    w, h = light.size
    framed = Image.new("L", (w + 2, h + 2), 255)      # a light rim joins every border region
    framed.paste(light, (1, 1))
    ImageDraw.floodfill(framed, (0, 0), 128)
    bg = framed.crop((1, 1, w + 1, h + 1)).point(lambda v: 255 if v == 128 else 0)
    return bg


def cutout():
    """RGBA chassis, mesh redrawn, cropped to its own alpha.

    Source: pipeline/render-cut/mt-flank.png -- the shoot pipeline's own cutout
    of its re-render of this photograph (shoot_final.py). The pipeline's review
    sheet shows that re-render is geometry-faithful to the photo: same chassis,
    same mesh window, same bezel and feet. It was rendered on a clean white
    sweep, which is why rembg could segment it; on the raw photograph every
    general method failed, because the side sweep measures L~38 against a panel
    at L~36 -- no threshold separates them, and a chassis filling 90% of the
    frame reads to u2net as background. See _background_mask for that history.
    """
    cached = WORK / "chassis-cut.png"
    if cached.exists():
        return Image.open(cached).convert("RGBA")
    src = Image.open(Path(r"C:/Ronak/Latios/Images/pipeline/render-cut/mt-flank.png")).convert("RGBA")
    alpha = src.getchannel("A")
    rgb = _redraw_mesh(src.convert("RGB"))
    rgb.putalpha(alpha)
    rgba = _shadow_below_lip(rgb.crop(alpha.point(lambda v: 255 if v > 8 else 0).getbbox()))
    WORK.mkdir(parents=True, exist_ok=True)
    rgba.save(cached)
    return rgba


def bento_image():
    """The compact-design card: cutout with margins the callouts live in."""
    cut = cutout()
    cw, ch = cut.size
    L, R, T, B = int(cw * 0.14), int(cw * 0.03), int(ch * 0.03), int(ch * 0.12)
    W, H = cw + L + R, ch + T + B
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(cut, (L, T), cut)
    out = out.resize((1400, int(H * 1400 / W)), Image.LANCZOS)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    out.save(PUBLIC / "chassis-side.webp", "WEBP", quality=90, method=6)
    geo = {
        "aspect": f"{out.size[0]} / {out.size[1]}",
        "h": {"x": round(L * 0.55 / W * 100, 1), "y1": round(T / H * 100, 1),
              "y2": round((T + ch) / H * 100, 1)},
        "d": {"x1": round(L / W * 100, 1), "x2": round((L + cw) / W * 100, 1),
              "y": round((T + ch + B * 0.5) / H * 100, 1)},
    }
    return out, geo


if __name__ == "__main__":
    img, geo = bento_image()
    print("chassis-side.webp", img.size)
    print("geometry", geo)

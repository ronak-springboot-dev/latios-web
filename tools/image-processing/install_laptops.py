"""Install the PRO 14 renders into public/images/laptops/pro14/.

Three kinds of asset, all from the factory's CAD views of this chassis:

  renders   the studio-lit compositions from gen_laptops (hero, back, top,
            front, layflat), resized to 1600 wide -- about 2x the widest place
            any of them is drawn.
  crops     the keyboard, the Copilot key and the camera, cut straight out of
            the source render at full resolution. No model pass and no rim
            light: these are all lettering and legends, and a crop's edges are
            not a silhouette, so light() would rim the crop box itself.
  gallery   the same views branded but not staged, kept transparent, for the
            buy box's light stage (#f2f2f0).

    python install_laptops.py           # everything present
    python install_laptops.py hero      # one asset
"""
import sys
from pathlib import Path

from PIL import Image, ImageFilter

import gen_laptops as G
import laptop_refs as L

DEST = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "laptops" / "pro14"
WIDTH = 1600
CROP_WIDTH = 1200
GROUND = (7, 10, 14, 255)          # the PRO 14 page surface (theme.js)
GALLERY_WIDTH = 1600

RENDERS = ["hero", "back", "top", "front", "layflat"]

# The Archer's own two renders (gen_archer.py), installed beside the PRO 14's.
ARCHER_DEST = DEST.parent / "archer"
ARCHER = ["hero", "angle"]

# The Notebook 14's renders, crop and gallery (gen_notebook.py).
NB_DEST = DEST.parent / "notebook14"
NB = ["hero", "angle", "lid"]
NB_CROPS = {"keyboard": ("open-02.png", (0.235, 0.330, 0.745, 0.700))}
NB_GALLERY = {"g-hero": "open-01.png", "g-angle": "open-04.png", "g-lid": "open-03.png"}

# Crop boxes as frame fractions of the source render, measured off gridded proofs.
CROPS = {
    "keyboard": ("IDL_Open_90.png", (0.280, 0.235, 0.720, 0.585)),
    "copilot": ("IDL_Open_90.png", (0.521, 0.419, 0.681, 0.657)),
    "camera": ("IDL_open_front.png", (0.415, 0.2420, 0.595, 0.3600)),
}

# Gallery: view -> whether its own matte needs re-cutting (white ground) or
# hardening (a backdrop haze baked into the alpha).
GALLERY = {
    "g-open45": ("IDL_Open_45.png", {}),
    "g-back": ("IDL_BACK (1).png", {"hard": True}),
    "g-close30": ("IDL_Close_30.png", {"cut": True}),
    "g-top": ("IDL_Top.png", {}),
    "g-left": ("IDL_Left.png", {}),
    "g-right": ("IDL_Right.png", {}),
}


def save(im, name, width, dest=None):
    dest = dest or DEST
    dest.mkdir(parents=True, exist_ok=True)
    if im.width != width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    out = dest / f"{name}.webp"
    im.save(out, "WEBP", quality=88, method=6)
    print(f"  {out.name:16s} {im.mode:4s} {im.size}  {out.stat().st_size // 1024:>4}KB")


def crop_of(view, box, width=4000):
    """A crop of one view at full resolution, with the Latios screen on it."""
    im = Image.open(L.PRO14 / view).convert("RGBA")
    if im.width > width:
        im.thumbnail((width, width), Image.LANCZOS)
    if view in L.SCREENS:
        im = L.brand_screen(im, L.frac_quad(L.SCREENS[view], im.size, 1.004), L.wallpaper(G.ACCENT))
    w, h = im.size
    x0, y0, x1, y1 = box
    cut = im.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
    # On the page's own dark ground, not white: a crop that reaches past the
    # laptop (the camera's, above the lid) is transparent there, and .convert
    # ("RGB") would flatten that to white -- a white band on a dark page.
    ground = Image.new("RGBA", cut.size, GROUND)
    ground.alpha_composite(cut)
    return ground.convert("RGB").filter(ImageFilter.UnsharpMask(radius=3, percent=35, threshold=2))


if __name__ == "__main__":
    only = sys.argv[1:]
    for name in RENDERS:
        if only and name not in only:
            continue
        src = G.WORK / f"pro14-{name}.png"
        if not src.exists():
            print(f"  skip {name:12s} (not rendered yet)")
            continue
        save(Image.open(src).convert("RGB"), name, WIDTH)
    for name in ARCHER:
        if only and f"archer-{name}" not in only:
            continue
        src = G.WORK / f"archer-{name}.png"
        if not src.exists():
            print(f"  skip archer-{name:6s} (not rendered yet)")
            continue
        save(Image.open(src).convert("RGB"), name, WIDTH, dest=ARCHER_DEST)
    import gen_notebook as N
    for name in NB:
        if only and f"nb-{name}" not in only:
            continue
        src = G.WORK / f"nb-{name}.png"
        if not src.exists():
            print(f"  skip nb-{name:8s} (not rendered yet)")
            continue
        save(Image.open(src).convert("RGB"), name, WIDTH, dest=NB_DEST)
    for name, (view, box) in NB_CROPS.items():
        if only and f"nb-{name}" not in only:
            continue
        im = Image.open(N.REFS / view).convert("RGBA")
        w, h = im.size
        x0, y0, x1, y1 = box
        cut = im.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
        ground = Image.new("RGBA", cut.size, (5, 12, 11, 255))
        ground.alpha_composite(cut)
        save(ground.convert("RGB").filter(ImageFilter.UnsharpMask(radius=3, percent=35, threshold=2)),
             name, CROP_WIDTH, dest=NB_DEST)
    for name, view in NB_GALLERY.items():
        if only and name not in only:
            continue
        prod, screen = N.prepared(view, N.LID_03 if view == "open-03.png" else None)
        if screen:
            prod = L.brand_screen(prod, screen, L.wallpaper(N.ACCENT))
        save(prod, name, GALLERY_WIDTH, dest=NB_DEST)
    for name, (view, box) in CROPS.items():
        if only and name not in only:
            continue
        save(crop_of(view, box), name, CROP_WIDTH)
    for name, (view, kw) in GALLERY.items():
        if only and name not in only:
            continue
        prod, _, screen = G.branded(view, width=GALLERY_WIDTH, **kw)
        if screen:
            prod = L.brand_screen(prod, screen, L.wallpaper(G.ACCENT))
        save(prod, name, GALLERY_WIDTH)

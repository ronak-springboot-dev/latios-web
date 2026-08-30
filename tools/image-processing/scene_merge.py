"""
Keep only what the edit model got right, and restore the rest from the original.

Qwen-Image-Edit places the product correctly — right perspective, right scale,
a real contact shadow and a reflection in the desk — but it re-renders the whole
frame, which (a) shifts the entire room's colour and (b) redraws the Latios
wordmark as garbled lettering.

So the edit is not used wholesale:

  * The room comes from the ORIGINAL scene, pixel for pixel. Only the region the
    model actually changed (product + its shadow + its reflection) is taken from
    the edit, through a feathered difference mask.
  * That region is colour-matched back to the original's palette, measured on the
    untouched background, so the composited area cannot carry the blue cast.
  * The wordmark is then replaced with the genuine latios-wordmark.png, warped to
    the panel's perspective. This is not the old flat-paste failure: there the
    whole chassis was invented and the logo sat at the wrong scale on a fake box.
    Here the chassis is a faithful re-render of the real photograph and only the
    ~90px of lettering is substituted, so the mark is pixel-exact by construction.
"""
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")
G = Path(__file__).parent / "generated"
WORDMARK = IMAGES / "latios-wordmark.png"


def change_mask(orig, edit, thresh=14, blur=6, grow=3):
    """Where did the model actually change something?"""
    a = np.asarray(orig.convert("RGB")).astype(np.int16)
    b = np.asarray(edit.convert("RGB")).astype(np.int16)
    d = np.abs(a - b).max(axis=2)
    m = Image.fromarray(((d > thresh) * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MaxFilter(2 * grow + 1))     # close pinholes / grow
    return m.filter(ImageFilter.GaussianBlur(blur))


def match_palette(edit, orig, mask):
    """
    Re-grade the edit to the original's colour, measured where nothing changed.

    The background is the honest reference: if the model shifted the room blue,
    that shift shows up there, and undoing it there undoes it on the product too.
    """
    e = np.asarray(edit.convert("RGB")).astype(np.float32)
    o = np.asarray(orig.convert("RGB")).astype(np.float32)
    bg = np.asarray(mask).astype(np.float32) / 255.0 < 0.1
    if bg.sum() < 1000:
        return edit
    out = np.empty_like(e)
    for c in range(3):
        es, os_ = e[..., c][bg], o[..., c][bg]
        sd = es.std() or 1.0
        out[..., c] = (e[..., c] - es.mean()) * (os_.std() / sd) + os_.mean()
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def merge(orig_path, edit_path, out_path, thresh=14):
    orig = Image.open(orig_path).convert("RGB")
    edit = Image.open(edit_path).convert("RGB").resize(orig.size, Image.LANCZOS)

    # Chicken-and-egg: the mask needs a colour-matched edit (otherwise the global
    # cast makes every pixel "changed"), and the match needs a mask to know which
    # pixels are background. Start from an all-background assumption — the frame
    # is mostly unchanged room, so that first estimate is already close — then
    # alternate. Two passes converge.
    empty = Image.new("L", orig.size, 0)
    graded = match_palette(edit, orig, empty)
    for _ in range(2):
        mask = change_mask(orig, graded, thresh=thresh)
        graded = match_palette(edit, orig, mask)
    mask = change_mask(orig, graded, thresh=thresh)
    merged = Image.composite(graded, orig, mask)
    merged.save(out_path)
    cover = np.asarray(mask).mean() / 255.0
    print(f"  merged -> {Path(out_path).name}  (edit region {cover*100:.1f}% of frame)")
    return merged


def place_wordmark(img, box, tone=None, opacity=0.9):
    """
    Draw the genuine wordmark into `box` = (x0, y0, x1, y1).

    No perspective warp: at the size these marks occupy in a room shot (tens of
    pixels) foreshortening is well under a pixel, and an earlier attempt to warp
    via Image.QUAD remapped the whole layer instead of the mark. A straight
    resize is both correct and safer.

    `tone` recolours the mark to the panel's own highlight instead of pure white,
    so it sits in the scene's light rather than glowing out of it.
    """
    x0, y0, x1, y1 = box
    wm = Image.open(WORDMARK).convert("RGBA")
    wm = wm.resize((max(2, x1 - x0), max(2, y1 - y0)), Image.LANCZOS)
    if tone:
        solid = Image.new("RGBA", wm.size, tuple(tone) + (255,))
        solid.putalpha(wm.getchannel("A"))
        wm = solid
    wm.putalpha(wm.getchannel("A").point(lambda v: int(v * opacity)))
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    layer.paste(wm, (x0, y0), wm)
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def erase(img, box, sample=10, feather=4, pad=4, side="left"):
    """
    Wipe the model's garbled lettering before the real mark goes down.

    Fills from ONE side only. Interpolating between both sides looked obvious
    here: the mark sits near the chassis edge, so the right-hand sample fell on
    the bright window behind it and the fill ramped to white.
    """
    x0, y0, x1, y1 = (box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad)
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    if side == "left":
        ref = a[y0:y1, max(0, x0 - sample):x0].mean(axis=1)
    else:
        ref = a[y0:y1, x1:x1 + sample].mean(axis=1)
    fill = np.repeat(ref[:, None, :], x1 - x0, axis=1)
    fill += np.random.default_rng(3).normal(0, 1.2, (fill.shape[0], fill.shape[1], 1))
    patch = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8))
    m = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(m).rectangle((feather, feather, x1 - x0 - feather, y1 - y0 - feather), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(feather))
    out = img.copy()
    out.paste(patch, (x0, y0), m)
    return out


if __name__ == "__main__":
    import sys
    merge(sys.argv[1], sys.argv[2], sys.argv[3])

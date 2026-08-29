"""
Composite REAL Latios assets into generated scenes.

The image model cannot render the wordmark reliably — it produced "Lotios" twice
on the cloud model and duplicated/garbled it locally. So we never ask it to.
Instead the scene is generated brand-free, and the genuine assets are composited
in afterwards:

  * frontend/public/images/latios-wordmark.png  — the official wordmark
  * the transparent product cutouts made from the real photographs

That makes the branding pixel-exact and the product genuine, with only the
environment generated.
"""
import sys
from pathlib import Path
from PIL import Image, ImageEnhance

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")
GEN = Path(__file__).parent / "generated"
OUT = Path(__file__).parent / "generated"

WORDMARK = IMAGES / "latios-wordmark.png"


def _tint(rgba, rgb):
    """Recolour a transparent logo (keeps its alpha)."""
    solid = Image.new("RGBA", rgba.size, rgb + (255,))
    solid.putalpha(rgba.getchannel("A"))
    return solid


def ground_shadow(scene, ov, x, y, w, h, strength=0.42, spread=0.16):
    """Soft contact shadow so a composited product sits on the surface."""
    from PIL import ImageFilter
    sil = ov.getchannel("A")
    sh_h = max(4, int(h * spread))
    strip = sil.crop((0, int(h * 0.78), w, h)).resize((int(w * 1.06), sh_h), Image.LANCZOS)
    layer = Image.new("L", scene.size, 0)
    layer.paste(strip, (x - int(w * 0.03), y + h - sh_h // 2))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=max(4, w // 22)))
    layer = layer.point(lambda v: int(v * strength))
    sh = Image.new("RGBA", scene.size, (0, 0, 0, 0))
    sh.putalpha(layer)
    return Image.alpha_composite(scene.convert("RGBA"), sh)


def place(scene, overlay, cx, cy, width_frac, opacity=1.0, tint=None, shadow=False,
          dim=None, cool=None):
    """
    Paste `overlay` onto `scene`.
      cx, cy      centre position as fractions of the scene (0-1)
      width_frac  overlay width as a fraction of scene width
      tint        optional (r,g,b) to recolour a logo for the surface it sits on
    """
    ov = overlay.convert("RGBA")
    if dim or cool:
        # Match a composited product to the scene's ambient light, otherwise a
        # studio-lit cutout dropped into a dim room reads as pasted-on.
        a = ov.getchannel("A")
        rgb = ov.convert("RGB")
        if dim:
            rgb = ImageEnhance.Brightness(rgb).enhance(dim)
        if cool:
            r, g, b = rgb.split()
            r = r.point(lambda v: int(v * (1 - cool)))
            b = b.point(lambda v: min(255, int(v * (1 + cool))))
            rgb = Image.merge("RGB", (r, g, b))
        ov = rgb.convert("RGBA"); ov.putalpha(a)
    if tint:
        ov = _tint(ov, tint)
    w = max(1, int(scene.width * width_frac))
    h = max(1, round(ov.height * w / ov.width))
    ov = ov.resize((w, h), Image.LANCZOS)

    if opacity < 1.0:
        a = ov.getchannel("A").point(lambda v: int(v * opacity))
        ov.putalpha(a)

    x = int(scene.width * cx) - w // 2
    y = int(scene.height * cy) - h // 2
    if shadow:
        scene = ground_shadow(scene, ov, x, y, w, h)
    layer = Image.new("RGBA", scene.size, (0, 0, 0, 0))
    layer.paste(ov, (x, y), ov)
    return Image.alpha_composite(scene.convert("RGBA"), layer)


def load_scene(name):
    return Image.open(GEN / name).convert("RGBA")


def save(scene, name, quality=88):
    p = OUT / name
    scene.convert("RGB").save(p, "WEBP", quality=quality, method=6)
    print(f"  saved {p.name} ({scene.width}x{scene.height}, {p.stat().st_size//1024}KB)")


def wordmark(tint=None):
    return _tint(Image.open(WORDMARK).convert("RGBA"), tint) if tint else Image.open(WORDMARK).convert("RGBA")


def product(name):
    """A real transparent product cutout already deployed to the site."""
    return Image.open(IMAGES / name).convert("RGBA")


if __name__ == "__main__":
    print(__doc__)

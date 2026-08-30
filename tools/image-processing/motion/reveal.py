"""
The scroll-driven "open the case" sequence.

Rendered as a FRAME SEQUENCE rather than a video, because it is scrubbed by
scroll position rather than played. Browsers cannot seek a compressed video
accurately or cheaply enough to scrub smoothly — every seek lands on a keyframe
and stutters. A sequence of stills indexed by scroll progress is exact, and each
frame stays at full resolution, which is the point.

The composition is deterministic compositing over two layers:

    internals   the generated cutaway (the "open" state)
    panel       the REAL mesh side panel photograph, perspective-warped onto the
                case aperture, sliding out and fading as the sequence advances

The aperture quad was measured off the cutaway render itself, so the panel sits
exactly where the missing side panel belongs.
"""
from pathlib import Path

import numpy as np
import skia
from PIL import Image, ImageFilter

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")

# The case's open side, as fractions of the cutaway render. Measured from the
# render with a coordinate grid rather than guessed: the top edge rises to the
# right, so this is a genuine quad, not a rectangle.
APERTURE = [(0.118, 0.222), (0.700, 0.112), (0.700, 0.795), (0.118, 0.858)]


def _homography(src, dst):
    """3x3 mapping src quad -> dst quad, as the 9 values Skia's Matrix wants."""
    a = []
    b = []
    for (sx, sy), (dx, dy) in zip(src, dst):
        a.append([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx])
        a.append([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy])
        b += [dx, dy]
    h = np.linalg.solve(np.asarray(a, dtype=np.float64), np.asarray(b, dtype=np.float64))
    return list(h) + [1.0]


def _skia_image(pil):
    return skia.Image.fromarray(
        np.asarray(pil.convert("RGBA"), dtype=np.uint8),
        colorType=skia.kRGBA_8888_ColorType)


def load(internals_path, panel_path, width):
    """Prepare both layers once; the per-frame work is only transforms."""
    base = Image.open(internals_path).convert("RGB")
    base = base.resize((width, round(base.height * width / base.width)), Image.LANCZOS)

    panel = Image.open(panel_path).convert("RGBA")
    bbox = panel.getchannel("A").getbbox()
    if bbox:
        panel = panel.crop(bbox)
    # Square-ish crop of the panel face, so the warp is not stretching a
    # letterboxed source across the aperture.
    w, h = panel.size
    panel = panel.crop((int(w * 0.06), int(h * 0.06), int(w * 0.94), int(h * 0.94)))

    return _skia_image(base), _skia_image(panel), base.size


def frame(t, base, panel, size, push=0.05, slide=0.62):
    """
    One frame at sequence position t in [0, 1].

    t=0 is closed (panel seated over the aperture), t=1 is fully open. The base
    pushes in slightly as it opens so the reveal feels like moving closer rather
    than a layer simply vanishing.
    """
    w, h = size
    surface = skia.Surface(w, h)
    c = surface.getCanvas()
    c.clear(skia.ColorBLACK)

    # Base, with a gentle push-in.
    scale = 1.0 + push * t
    c.save()
    c.translate(w / 2, h / 2)
    c.scale(scale, scale)
    c.translate(-w / 2, -h / 2)
    c.drawImage(base, 0, 0, skia.SamplingOptions(skia.FilterMode.kLinear))
    c.restore()

    if t >= 0.999:
        return surface.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)

    # Aperture in pixels, following the same push-in so the panel stays registered.
    def pt(fx, fy):
        x, y = fx * w, fy * h
        return (w / 2 + (x - w / 2) * scale, h / 2 + (y - h / 2) * scale)

    quad = [pt(*p) for p in APERTURE]

    # Ease-out: the panel breaks away quickly, then drifts.
    e = 1 - (1 - t) ** 2
    dx = -w * slide * e
    dy = -h * 0.06 * e
    # It also tips slightly as it comes away, so it reads as a panel lifting off
    # rather than a sticker sliding sideways.
    tip = w * 0.035 * e
    moved = [(x + dx + (tip if i in (1, 2) else 0), y + dy) for i, (x, y) in enumerate(quad)]

    src = [(0, 0), (panel.width(), 0), (panel.width(), panel.height()), (0, panel.height())]
    m = skia.Matrix()
    m.setAll(*_homography(src, moved))

    c.save()
    c.concat(m)
    paint = skia.Paint(AntiAlias=True, Alpha=int(255 * min(1.0, 1.25 * (1 - e))))
    c.drawImage(panel, 0, 0, skia.SamplingOptions(skia.FilterMode.kLinear), paint)
    c.restore()

    # A soft shadow cast back into the bay while the panel is still close, so the
    # interior does not read as fully lit the instant the panel starts to move.
    if e < 0.6:
        shade = skia.Path()
        shade.moveTo(*quad[0])
        for p in quad[1:]:
            shade.lineTo(*p)
        shade.close()
        c.drawPath(shade, skia.Paint(
            AntiAlias=True,
            Color=skia.Color(0, 0, 0, int(140 * (1 - e / 0.6))),
            MaskFilter=skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, w * 0.02)))

    return surface.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)

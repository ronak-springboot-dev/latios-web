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

# The case's open side, as fractions of the render. Measured with a coordinate
# grid rather than guessed. The straight-on interiors give a near-rectangle;
# a three-quarter render would give a genuine quad, which is why this is passed
# per job rather than fixed.
APERTURE = [(0.120, 0.135), (0.865, 0.135), (0.865, 0.870), (0.120, 0.870)]


def tint(pil, accent):
    """
    Recolour the render's rim light to a model's accent.

    The interior geometry is shared between models that genuinely have the same
    interior, so the rim is what makes each page's sequence look like its own.
    Doing it here costs nothing; re-rendering nine interiors per accent would
    cost hours of GPU time to say the same thing.

    Only strongly-saturated, blue-dominant pixels are moved — the chassis, board
    and cables are near-neutral and must not shift.
    """
    if not accent:
        return pil
    a = np.asarray(pil.convert("RGB"), dtype=np.float32)
    mx = a.max(axis=2)
    mn = a.min(axis=2)
    sat = np.where(mx > 1, (mx - mn) / np.maximum(mx, 1), 0)
    blue_led = (a[..., 2] >= mx - 1) & (sat > 0.35)
    target = np.asarray([int(accent[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)
    lum = (mx / 255.0)[..., None]
    a[blue_led] = (target * lum)[blue_led]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


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


def load(internals_path, panel_path, width, accent=None):
    """Prepare both layers once; the per-frame work is only transforms."""
    base = Image.open(internals_path).convert("RGB")
    base = base.resize((width, round(base.height * width / base.width)), Image.LANCZOS)
    base = tint(base, accent)

    panel = Image.open(panel_path).convert("RGBA")
    bbox = panel.getchannel("A").getbbox()
    if bbox:
        panel = panel.crop(bbox)
    # Square-ish crop of the panel face, so the warp is not stretching a
    # letterboxed source across the aperture.
    w, h = panel.size
    panel = panel.crop((int(w * 0.06), int(h * 0.06), int(w * 0.94), int(h * 0.94)))

    return _skia_image(base), _skia_image(panel), base.size


def frame_wipe(t, closed, base, size, push=0.06):
    """
    Geometry-independent reveal: the real closed chassis wipes away to the
    interior, with a push-in.

    Preferred over warping a panel onto a measured aperture because the nine
    interiors did not come back at one camera angle — five are three-quarter
    views, so a single straight-on aperture would mis-register the panel on
    most of them, and measuring nine separately is fragile against re-rolls.

    This also has better provenance: frame zero is a REAL photograph of the
    actual product, dissolving to the illustrative interior, rather than a
    photograph warped into a shape it was not taken in.

    The wipe is a soft-edged diagonal travelling across the frame, so it reads
    as a panel being drawn off rather than a plain cross-fade.
    """
    w, h = size
    surface = skia.Surface(w, h)
    c = surface.getCanvas()
    c.clear(skia.ColorBLACK)

    scale = 1.0 + push * t
    c.save()
    c.translate(w / 2, h / 2)
    c.scale(scale, scale)
    c.translate(-w / 2, -h / 2)
    c.drawImage(base, 0, 0, skia.SamplingOptions(skia.FilterMode.kLinear))
    c.restore()

    if t >= 0.999:
        return surface.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)

    # Closed chassis on top, revealed away by a soft diagonal gradient mask.
    edge = 0.22                      # width of the soft edge, as a fraction
    lead = -edge + t * (1.0 + 2 * edge)
    shader = skia.GradientShader.MakeLinear(
        points=[(-w * 0.15, 0), (w * 1.15, h)],
        colors=[skia.Color(255, 255, 255, 0), skia.Color(255, 255, 255, 255)],
        positions=[max(0.0, min(1.0, lead)), max(0.0, min(1.0, lead + edge))])

    c.saveLayer(None, None)
    c.drawImage(closed, 0, 0, skia.SamplingOptions(skia.FilterMode.kLinear))
    c.drawRect(skia.Rect.MakeWH(w, h),
               skia.Paint(Shader=shader, BlendMode=skia.BlendMode.kDstIn))
    c.restore()

    return surface.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)


def closed_plate(src, size, accent=None):
    """The real chassis photograph, sized and centred to match the interior."""
    w, h = size
    im = Image.open(src).convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    if bbox:
        im = im.crop(bbox)
    fit = min(w * 0.78 / im.width, h * 0.78 / im.height)
    im = im.resize((max(1, int(im.width * fit)), max(1, int(im.height * fit))), Image.LANCZOS)
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.paste(im, ((w - im.width) // 2, (h - im.height) // 2), im)
    return _skia_image(canvas)


def frame(t, base, panel, size, push=0.05, slide=0.62, aperture=None):
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

    quad = [pt(*p) for p in (aperture or APERTURE)]

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

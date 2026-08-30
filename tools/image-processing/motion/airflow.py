"""
The thermal / airflow loop: a ghosted chassis with intake and exhaust streaming
through it.

Rendered as VECTOR motion graphics, not generated video. That is the whole
reason it looks smooth: every frame is an anti-aliased Skia render, so the
ribbons have no inter-frame shimmer and no diffusion softness. The reference
asset is made the same way — it is a motion-graphics piece, not a video model's
output.

Layers, back to front:
    black ground
    internals plate                (behind the shell, so it reads as see-through)
    intake ribbons                 (cool, entering)
    ghosted chassis                (the REAL photograph, alpha-reduced + edge-lit)
    exhaust ribbons + fan rings    (in front, so the flow appears to exit toward us)
    vignette

Glow is done by drawing each element twice — a wide blurred pass then a narrow
bright pass — rather than by a separate bloom stage. It is cheaper and it keeps
the core of every ribbon genuinely sharp instead of smearing the whole frame.
"""
import math
from pathlib import Path

import numpy as np
import skia
from PIL import Image, ImageFilter

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")

COOL = (0x3A, 0xC8, 0xFF)     # intake
WARM = (0xFF, 0x6A, 0x1E)     # exhaust
SHELL_ALPHA = 0.42            # how much of the chassis survives; lower = more x-ray


# --------------------------------------------------------------------- assets --

def _to_skia(pil):
    """PIL RGBA -> skia.Image."""
    arr = np.asarray(pil.convert("RGBA"), dtype=np.uint8)
    return skia.Image.fromarray(arr, colorType=skia.kRGBA_8888_ColorType)


def ghosted_shell(src, height, alpha=SHELL_ALPHA, edge=0.85):
    """
    The real chassis photograph turned into a glass shell.

    Two things happen: the body is knocked back so the internals read through it,
    and the silhouette/panel edges are lifted back up so the object still has a
    readable form. Without the edge pass a low-alpha product just looks faded
    rather than transparent.
    """
    im = Image.open(src).convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())
    w = max(1, round(im.width * height / im.height))
    im = im.resize((w, height), Image.LANCZOS)

    a = np.asarray(im.getchannel("A"), dtype=np.float32) / 255.0
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32)

    # Structural edges only.
    #
    # Running FIND_EDGES on the raw luminance lights up every hole in the hex
    # mesh, and the panel turns into one solid glowing rectangle. Blurring hard
    # first suppresses that texture so only panel-scale features — the outline,
    # the panel seams, the vent block's boundary — survive.
    lum = Image.fromarray(rgb.mean(axis=2).astype(np.uint8))
    structural = np.asarray(
        lum.filter(ImageFilter.GaussianBlur(5.0))
           .filter(ImageFilter.FIND_EDGES)
           .filter(ImageFilter.GaussianBlur(1.0)), dtype=np.float32) / 255.0
    structural = np.clip(structural * 6.0, 0, 1) * a

    # The silhouette itself, from the alpha, so the object always has an outline
    # even where the photograph has no internal contrast.
    outline = np.asarray(
        Image.fromarray((a * 255).astype(np.uint8))
             .filter(ImageFilter.FIND_EDGES)
             .filter(ImageFilter.GaussianBlur(1.6)), dtype=np.float32) / 255.0
    outline = np.clip(outline * 4.0, 0, 1)

    edges = np.clip(structural * 0.55 + outline, 0, 1)

    body = rgb * alpha
    out = np.clip(body + edges[..., None] * np.array(COOL, dtype=np.float32) * edge, 0, 255)
    out_a = np.clip(a * alpha + edges * 0.9, 0, 1) * 255

    merged = np.dstack([out, out_a]).astype(np.uint8)
    return skia.Image.fromarray(merged, colorType=skia.kRGBA_8888_ColorType)


def plate(src, height, crop=None, lift=1.25):
    """
    Internals plate, sized to sit behind the shell.

    `crop` selects the interior out of the generated cutaway — that render is a
    whole open chassis on a grey studio background, and only the bay showing the
    board is wanted here. Given as (l, t, r, b) fractions.

    The plate is composited additively (see compose), so its black background
    contributes nothing and only the lit components show through the shell.
    That is what produces the x-ray read rather than a picture pasted behind
    glass. `lift` compensates for the interior being in shadow in the render.
    """
    if not Path(src).exists():
        return None
    im = Image.open(src).convert("RGB")
    if crop:
        l, t, r, b = crop
        im = im.crop((int(im.width * l), int(im.height * t),
                      int(im.width * r), int(im.height * b)))
    w = max(1, round(im.width * height / im.height))
    im = im.resize((w, height), Image.LANCZOS)

    a = np.asarray(im, dtype=np.float32) * lift
    # Roll off the edges so the plate does not end in a hard rectangle inside
    # the shell.
    # Generous inset and a wide blur: a tighter falloff still left the plate's
    # rectangle readable as a tonal step inside the shell, which broke the
    # illusion immediately.
    fade = Image.new("L", im.size, 0)
    from PIL import ImageDraw as _D
    _D.Draw(fade).rounded_rectangle(
        (im.width * 0.10, im.height * 0.10, im.width * 0.90, im.height * 0.90),
        radius=int(min(im.size) * 0.18), fill=255)
    fade = np.asarray(fade.filter(ImageFilter.GaussianBlur(min(im.size) * 0.10)),
                      dtype=np.float32) / 255.0

    rgba = np.dstack([np.clip(a, 0, 255), fade * 255]).astype(np.uint8)
    return skia.Image.fromarray(rgba, colorType=skia.kRGBA_8888_ColorType)


# -------------------------------------------------------------------- ribbons --

def _ribbon_path(pts):
    p = skia.Path()
    p.moveTo(*pts[0])
    for i in range(1, len(pts) - 2, 3):
        p.cubicTo(*pts[i], *pts[i + 1], *pts[i + 2])
    return p


# One dash period shared by every stream.
#
# Seamlessness depends on this: each ribbon advances by a whole number of
# periods across the loop, so the last frame lands exactly on the first. That
# also forces speed multipliers to be integers — a 1.25x stream would not close.
SEG, GAP = 540.0, 400.0
PERIOD = SEG + GAP


def _stream(canvas, pts, colour, phase, width, seg=SEG, gap=GAP, glow=True):
    """
    One streaming ribbon.

    The motion is a dash phase walking along the path, so the segments genuinely
    travel rather than fading in place — and because the phase advances by
    exactly one (seg+gap) over the loop, the animation closes on itself.
    """
    path = _ribbon_path(pts)
    dash = skia.DashPathEffect.Make([seg, gap], phase)

    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    shader = skia.GradientShader.MakeLinear(
        points=[(xs[0], ys[0]), (xs[-1], ys[-1])],
        colors=[skia.Color(*colour, 0), skia.Color(*colour, 255),
                skia.Color(*colour, 255), skia.Color(*colour, 0)],
        positions=[0.0, 0.18, 0.72, 1.0])

    if glow:
        wide = skia.Paint(
            AntiAlias=True, Style=skia.Paint.kStroke_Style, StrokeWidth=width * 3.6,
            StrokeCap=skia.Paint.kRound_Cap, Shader=shader, PathEffect=dash,
            BlendMode=skia.BlendMode.kPlus, Alpha=70,
            MaskFilter=skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, width * 1.5))
        canvas.drawPath(path, wide)

    core = skia.Paint(
        AntiAlias=True, Style=skia.Paint.kStroke_Style, StrokeWidth=width,
        StrokeCap=skia.Paint.kRound_Cap, Shader=shader, PathEffect=dash,
        BlendMode=skia.BlendMode.kPlus)
    canvas.drawPath(path, core)


def _fan_ring(canvas, cx, cy, r, colour, spin, arcs=2):
    """Counter-rotating arc pairs at a fan position."""
    for k in range(arcs):
        start = spin * 360 * (1 if k % 2 == 0 else -1) + k * 180
        rect = skia.Rect.MakeLTRB(cx - r, cy - r, cx + r, cy + r)
        for width, alpha, blur in ((r * 0.16, 60, r * 0.22), (r * 0.055, 255, 0)):
            paint = skia.Paint(
                AntiAlias=True, Style=skia.Paint.kStroke_Style, StrokeWidth=width,
                StrokeCap=skia.Paint.kRound_Cap, Color=skia.Color(*colour, alpha),
                BlendMode=skia.BlendMode.kPlus)
            if blur:
                paint.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
            canvas.drawArc(rect, start, 250, False, paint)


def _vignette(canvas, w, h):
    shader = skia.GradientShader.MakeRadial(
        center=(w / 2, h / 2), radius=max(w, h) * 0.72,
        colors=[skia.Color(0, 0, 0, 0), skia.Color(0, 0, 0, 210)],
        positions=[0.55, 1.0])
    canvas.drawRect(skia.Rect.MakeWH(w, h),
                    skia.Paint(Shader=shader, AntiAlias=True))


# ----------------------------------------------------------------------- frame --

def compose(w, h, t, shell, internals, fans):
    """
    One frame at loop position t in [0, 1).

    Phase advances by exactly one dash period across the loop, so the last frame
    lines up with the first and the clip can autoplay indefinitely.
    """
    surface = skia.Surface(w, h)
    c = surface.getCanvas()
    c.clear(skia.ColorBLACK)

    cx, cy = w * 0.5, h * 0.52
    phase = -t * PERIOD

    sw = shell.width()
    sx, sy = cx - sw / 2, cy - shell.height() / 2

    if internals:
        # Additive: the plate's black background adds nothing, so only the lit
        # components register through the shell. Compositing it normally would
        # paste a visible rectangle behind the glass instead.
        c.drawImage(internals, cx - internals.width() / 2,
                    cy - internals.height() / 2,
                    skia.SamplingOptions(skia.FilterMode.kLinear),
                    skia.Paint(BlendMode=skia.BlendMode.kPlus, Alpha=190))

    def sweep(y0, y1, bow):
        """A long S-curve across the frame — the ribbons should arc, not run flat."""
        return [(-w * 0.22, y0),
                (w * 0.10, y0 - h * bow), (w * 0.32, y0 + h * bow * 0.4), (cx, (y0 + y1) / 2),
                (w * 0.70, (y0 + y1) / 2 - h * bow * 0.5), (w * 0.92, y1 + h * bow * 0.3),
                (w * 1.24, y1)]

    # Intake — cool, behind the shell so it reads as entering.
    for i, (off, bow) in enumerate(((-0.20, 0.05), (-0.06, -0.035), (0.10, 0.045))):
        y = cy + h * off
        _stream(c, sweep(y, y + h * 0.03, bow), COOL,
                phase + i * PERIOD / 3, width=h * (0.016 - i * 0.003))

    # The plume rising off the top vent. Double speed — an integer multiple, so
    # it still closes with everything else.
    _stream(c, [(cx - w * 0.06, cy + h * 0.05),
                (cx - w * 0.05, cy - h * 0.28), (cx + w * 0.03, cy - h * 0.50),
                (cx + w * 0.02, -h * 0.20)],
            COOL, phase * 2, width=h * 0.017)

    c.drawImage(shell, sx, sy)

    # Exhaust — warm, in front, so the flow appears to leave toward the viewer.
    for i, (off, bow) in enumerate(((-0.03, -0.04), (0.08, 0.05), (0.17, -0.03))):
        y = cy + h * off
        _stream(c, sweep(y - h * 0.02, y + h * 0.02, bow), WARM,
                phase + (i + 0.5) * PERIOD / 3, width=h * (0.017 - i * 0.003))

    for (fx, fy, fr) in fans:
        _fan_ring(c, sx + sw * fx, sy + shell.height() * fy,
                  shell.height() * fr, COOL, t)

    _vignette(c, w, h)
    return surface.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)

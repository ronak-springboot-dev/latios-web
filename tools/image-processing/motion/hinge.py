"""
The side panel swings open on its hinge, holds, then lifts away.

Replaces the cross-fade this section used to do. That version drew a chassis
photograph scaled to a flat 78% of frame over a separately generated interior
and dissolved between them, which is why the lid never fitted and never moved.

Here both layers come from one registered pair (see register_pairs.py), so the
panel starts exactly where it sits in the photograph and the first frame IS the
photograph. The panel is then warped in perspective about its hinge edge, which
is what makes it read as opening rather than disappearing.

Three phases across t in [0, 1]:

    0.00 - 0.45   swings out to about 60 degrees, easing at both ends
    0.45 - 0.55   holds, so the reader registers the panel is off
    0.55 - 1.00   translates out of frame and fades, interior pushes in

The perspective is a swing, not a rotation in the image plane: the free edge
moves toward the camera, so it both narrows horizontally (cos) and grows
vertically (it is nearer). Doing only the first reads as a squash.
"""
import math
from pathlib import Path

import numpy as np
import skia
from PIL import Image

from .reveal import _homography, _skia_image


def accent_light(pil, accent, side=0.0, strength=0.30):
    """
    Wash the interior with a soft rim light in the product's accent.

    Nine of the fifteen towers share three interiors, because they genuinely are
    the same box with a different processor in it - and inventing a visual
    difference between identical machines would be a lie on a storefront. What
    can honestly differ is how the shot is LIT, so that is what varies here.

    This replaces reveal.tint(), which recoloured saturated blue pixels to the
    accent. That worked on the old generated interiors, which had blue LEDs; the
    photo-derived ones are near-neutral, so it moved 0.01% of pixels and left
    models sharing an interior looking identical.

    `side` slides the light source across the frame, so the three models on one
    interior are lit from three different angles as well as in three colours.

    ADDITIVE, not a blend toward the accent. The first version interpolated
    toward the target weighted by pixel luminance, which is nearly a no-op on
    these interiors: they are near-black, so there was almost nothing for the
    wash to act on and raising the strength from 0.16 to 0.30 moved the mean
    delta between two variants by 0.5 of 255. A real lamp ADDS light to dark
    surfaces, so this does too, and the three variants become visibly distinct.

    `lift` raises the interior's exposure first. The photo-derived interiors come
    back very dark, and the whole point of the section is that the reader can see
    the components.
    """
    if not accent:
        return pil
    a = np.asarray(pil.convert("RGB"), dtype=np.float32)
    h, w = a.shape[:2]
    target = np.asarray([int(accent[i:i + 2], 16) for i in (1, 3, 5)],
                        dtype=np.float32) / 255.0

    # Exposure lift, gentle in the shadows and flat in the highlights. Safe on
    # the backdrop: a gamma curve leaves true black at black.
    a = 255.0 * np.power(np.clip(a / 255.0, 0, 1), 0.88)

    x = np.linspace(0.0, 1.0, w, dtype=np.float32)
    centre = 0.28 + 0.44 * (side + 1) / 2
    fall = np.exp(-((x - centre) ** 2) / (2 * 0.30 ** 2))[None, :, None]

    # Gated on the pixel's own luminance with NO floor. An earlier version added
    # a constant 0.30 of the lamp everywhere, which lit the backdrop as well as
    # the hardware: the MT frames came back blue-cast and the SFF olive, because
    # the body layer only covers the chassis and the lit backdrop showed around
    # it. The 0.6 power keeps mid-dark surfaces responsive while leaving true
    # black exactly black.
    lum = (a.max(axis=2) / 255.0)[..., None]
    a = a + target[None, None, :] * 255.0 * fall * strength * np.power(lum, 0.6)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

# How far the panel opens before it is taken away. Past roughly 70 degrees the
# panel is nearly edge-on and reads as a sliver rather than a door.
MAX_ANGLE = math.radians(62)

# How much nearer the free edge gets, as a fraction of panel height, at full
# swing. Kept small: at 0.30 the panel's top corner rose clear of the
# chassis roof, which reads as the lid growing rather than tilting.
NEAR_GAIN = 0.13

# Push-in on the interior across the whole sequence. Small on purpose - this is
# scrubbed by scroll, and anything larger fights the reader's own scrolling.
PUSH = 0.055


def _ease(x):
    """easeInOutCubic - slow to break the seal, slow to settle at the hold."""
    return 4 * x ** 3 if x < 0.5 else 1 - ((-2 * x + 2) ** 3) / 2


def _phases(t, swing_end=0.45, hold_end=0.55):
    """
    (swing 0..1, lift 0..1) for a normalised scroll position.

    The split is per-model. Two towers sharing a chassis that also scrubbed on
    the same timing read as one animation in two colours, which is the thing the
    per-product work exists to avoid.
    """
    if t <= swing_end:
        return _ease(t / swing_end), 0.0
    if t <= hold_end:
        return 1.0, 0.0
    return 1.0, _ease((t - hold_end) / max(1e-6, 1.0 - hold_end))


# Which way the hinge edge lies, as a direction to score edge midpoints by.
# The rear edge of a side door is the leftmost or rightmost edge; the rear edge
# of a top lid is the one highest up the frame.
HINGE_DIRS = {
    "left":   (-1.0,  0.0),
    "right":  ( 1.0,  0.0),
    "top":    ( 0.0, -1.0),   # a lid tilting back
    "bottom": ( 0.0,  1.0),   # a lid tilting forward
}


def hinge_edge(q, side):
    """
    (hinge_a, hinge_b, free_a, free_b) as indices into the quad.

    Chosen from the geometry - the edge whose midpoint sits furthest toward
    `side` - rather than from fixed corner indices. The quad used to be assumed
    to be [TL, TR, BR, BL] so that a "top" hinge was always corners 0 and 1, but
    a strongly sheared plate has no honest top-left corner: on the SFF's lid the
    far-left vertex is both the topmost-left and the bottommost-left, so the
    fixed indices selected the plate's slanted SIDE edge as the hinge and swung
    the lid about the wrong axis entirely.

    Free corners are paired with the hinge corner each is actually joined to, so
    the panel stays connected however the quad happens to be wound.
    """
    q = [np.asarray(p, dtype=np.float64) for p in q]
    d = np.asarray(HINGE_DIRS.get(side, HINGE_DIRS["left"]), dtype=np.float64)
    i = max(range(4), key=lambda k: float(np.dot((q[k] + q[(k + 1) % 4]) / 2.0, d)))
    ha, hb = i, (i + 1) % 4
    # walking on round the quad from hb gives hb's neighbour, then ha's
    fb, fa = (i + 2) % 4, (i + 3) % 4
    return ha, hb, fa, fb


def _swing(q, hinge, swing, lift, frame_w, throw=1.35):
    """
    Where the panel's four corners are at this point in the animation.

    Generalised to any of the four edges. A tower's side panel swings on a
    vertical edge, but a slim SFF is serviced from the TOP and its plate tilts
    back on a horizontal one - opening it sideways was both wrong about the
    machine and identical to every other page.

    The outward direction is perpendicular to the hinge edge, pointing away from
    the panel's centre, so it follows the real geometry rather than assuming the
    hinge is vertical.

    Each free corner pivots about its OWN foot on the hinge line, at its OWN
    perpendicular distance from that line - not about the hinge corner it
    happens to be paired with in the quad, using the distance to THAT corner.
    Those give the same answer only when the hinge and free edges are roughly
    parallel and equal length, which is true for the MT/PROMAX/MFF panels
    (photographed close to square-on) but not the SFF's: its top plate is shot
    at a steep three-quarter angle, so the quad is a skewed trapezoid where the
    two corner-pairs measure 33px and 420px apart. Reusing one corner's
    distance for both didn't swing that panel, it sheared it apart - a dark
    diagonal shard that never resolved into a lid lifting away.
    """
    pts = [np.array(p, dtype=np.float64) for p in q]
    ha, hb, fa, fb = hinge_edge(pts, hinge)
    h_a, h_b, f_a, f_b = pts[ha], pts[hb], pts[fa], pts[fb]

    s, c = math.sin(MAX_ANGLE * swing), math.cos(MAX_ANGLE * swing)

    # Perpendicular to the hinge edge, pointing away from the panel.
    edge = h_b - h_a
    edge_len = np.linalg.norm(edge) or 1.0
    edge_hat = edge / edge_len
    n = np.array([-edge[1], edge[0]], dtype=np.float64)
    ln = np.linalg.norm(n) or 1.0
    n /= ln
    centre = sum(pts) / 4.0
    if np.dot(centre - h_a, n) < 0:
        n = -n

    def foot_and_reach(free):
        # This corner's own foot on the hinge LINE, and its own true
        # perpendicular distance to it - not the distance to whichever hinge
        # corner it happens to be paired with in the quad. For a rectangular
        # panel (free corner already perpendicular to the hinge edge) the foot
        # is exactly that paired corner and reach is exactly the old distance -
        # a no-op there.
        along = np.dot(free - h_a, edge_hat)
        foot = h_a + edge_hat * along
        return foot, float(np.linalg.norm(free - foot)) or 1.0

    def moved(free, sign):
        foot, reach = foot_and_reach(free)
        # cos draws the free edge back toward its foot; the n term carries it
        # out toward the camera; sign opens it about the panel's own axis as it
        # comes nearer.
        p = foot + (free - foot) * c + n * (s * reach * 0.30)
        return p + edge_hat * (sign * s * reach * NEAR_GAIN * 0.5)

    n_a = moved(f_a, -1)
    n_b = moved(f_b, +1)

    if lift > 0:
        # Withdrawn back OVER the hinge, not forward across the machine.
        #
        # n points from the hinge edge toward the panel's own centre - the
        # direction the panel covers when closed - so translating along +n
        # carried the panel across the body and back over the aperture it had
        # just opened. On the SFF that dragged the lid straight down over the
        # port row and the wordmark, which is what read as broken; on a side
        # door it wiped back across the interior. -n retreats past the hinge and
        # off that edge of frame, uncovering the interior as it goes, which is
        # also how a real panel is taken off: away from the box, not over it.
        #
        # The edge_hat term keeps a little lateral drift so it is not a pure
        # axis slide. Reach is averaged over both corners, since a skewed quad
        # (the SFF) has no single panel "depth" the way a rectangle does.
        _, reach_a = foot_and_reach(f_a)
        _, reach_b = foot_and_reach(f_b)
        reach = 0.5 * (reach_a + reach_b)
        d = -n * (lift * frame_w * throw) - edge_hat * (lift * reach * 0.18)
        h_a, h_b, n_a, n_b = h_a + d, h_b + d, n_a + d, n_b + d

    out = [None] * 4
    out[ha], out[hb], out[fa], out[fb] = h_a.tolist(), h_b.tolist(), n_a.tolist(), n_b.tolist()
    return out


def load(interior_path, panel_path, body_path, meta, width, accent=None,
         light=0.0, aperture_path=None):
    """
    Prepare all three layers once; per-frame work is transforms only.

    The body is the real photograph's chassis with the panel aperture cut out of
    it, and it never moves. Drawing it over the interior is what keeps the
    machine's outline exactly right: the interior render came back 23% small on
    the first MT edit, and correcting that by scaling would have been visible on
    the silhouette if the silhouette were coming from the render.
    """
    fw, fh = meta["frame"]
    scale = width / fw
    size = (width, round(fh * scale))

    interior = Image.open(interior_path).convert("RGB").resize(size, Image.LANCZOS)
    interior = accent_light(interior, accent, side=light).convert("RGBA")
    if aperture_path and Path(aperture_path).exists():
        # Clipped so the interior contributes ONLY what is behind the panel. It
        # is a separate render of a separate machine; letting its own chassis and
        # backdrop show around the photographed body made the SFF turn from black
        # to cream as it opened.
        interior.putalpha(Image.open(aperture_path).convert("L").resize(size, Image.LANCZOS))
    body = Image.open(body_path).convert("RGBA").resize(size, Image.LANCZOS)
    panel = Image.open(panel_path).convert("RGBA")

    q = [[x * scale, y * scale] for x, y in meta["quad"]]
    # The panel PNG is NOT resized, so its source quad stays in its own pixels.
    sq = meta.get("src_quad")
    return (_skia_image(interior), _skia_image(panel), _skia_image(body), q, size,
            [[float(x), float(y)] for x, y in sq] if sq else None)


# Per-model motion. `open` picks the hinge edge, `phases` the swing/hold split,
# `camera` how the interior moves under the static body.
DEFAULT_MOTION = {"open": None, "phases": (0.45, 0.55), "camera": ("push", 1.0),
                  "throw": 1.35}


def frame(t, interior, panel, body, quad, size, meta, bias=0.0, src_quad=None,
          motion=None):
    """Render one frame. Returns an HxWx4 uint8 array."""
    mo = {**DEFAULT_MOTION, **(motion or {})}
    w, h = size
    surface = skia.Surface(w, h)
    canvas = surface.getCanvas()
    canvas.clear(skia.ColorSetARGB(255, 10, 10, 10))

    t = min(1.0, max(0.0, t))
    swing, lift = _phases(t, *mo["phases"])
    linear = skia.SamplingOptions(skia.FilterMode.kLinear)
    e = _ease(t)

    # --- interior, moving under the static body ----------------------------
    # Only the contents move. The body over them stays put, so the chassis keeps
    # its true proportions while the interior drifts. The move itself varies per
    # model: fifteen identical push-ins is what made every page feel the same.
    kind, amt = mo["camera"]
    canvas.save()
    canvas.translate(w / 2, h / 2)
    if kind == "drift":
        # A slow lateral pass across the components, with only a hint of zoom.
        canvas.scale(1.0 + (PUSH * 0.35 + bias) * e, 1.0 + (PUSH * 0.35 + bias) * e)
        canvas.translate(-w * 0.045 * amt * e, 0.0)
    elif kind == "rise":
        # Descends into the machine: the interior lifts as it comes closer.
        z = 1.0 + (PUSH * 1.25 + bias) * e
        canvas.scale(z, z)
        canvas.translate(0.0, h * 0.035 * amt * e)
    else:                                   # "push"
        z = 1.0 + (PUSH * amt + bias) * e
        canvas.scale(z, z)
    canvas.translate(-w / 2, -h / 2)
    canvas.drawImageRect(interior, skia.Rect.MakeWH(w, h), linear)
    canvas.restore()

    # --- the chassis itself, straight from the photograph, never moving -----
    canvas.drawImageRect(body, skia.Rect.MakeWH(w, h), linear)

    if lift >= 1.0:
        # The surface is BGRA; toarray() returns native order unless told
        # otherwise, which silently swapped red and blue on every frame.
        # Invisible on near-neutral interiors, obvious on the PROMAX, whose
        # cool blue-grey chassis rendered bronze.
        return surface.makeImageSnapshot().toarray(
            colorType=skia.kRGBA_8888_ColorType)

    dst = _swing(quad, mo["open"] or meta["hinge"], swing, lift, w, mo["throw"])
    # Warp the panel's OWN quad, not the rectangle it was cropped inside. On a
    # chassis photographed at three-quarters the plate is a rhombus sitting in a
    # larger crop; mapping the crop rectangle sheared it the instant it moved.
    src = src_quad or [[0, 0], [panel.width(), 0],
                       [panel.width(), panel.height()], [0, panel.height()]]
    m = skia.Matrix()
    m.setAll(*_homography(src, dst))

    # --- contact shadow ----------------------------------------------------
    # Only while the panel is still over the body; it is what sells the lift.
    if swing > 0.02 and lift < 0.9:
        canvas.save()
        canvas.concat(m)
        p = skia.Paint(Color=skia.ColorSetARGB(int(150 * (1 - lift)), 0, 0, 0),
                       ImageFilter=skia.ImageFilters.Blur(18, 18))
        canvas.translate(-14 * swing, 10 * swing)
        canvas.drawImageRect(panel, skia.Rect.MakeWH(panel.width(), panel.height()),
                             linear, p)
        canvas.restore()

    # --- the panel ---------------------------------------------------------
    canvas.save()
    canvas.concat(m)
    alpha = 255 if lift < 0.82 else int(255 * (1 - (lift - 0.82) / 0.18))
    paint = skia.Paint(Alphaf=max(0.0, alpha) / 255.0)
    canvas.drawImageRect(panel, skia.Rect.MakeWH(panel.width(), panel.height()),
                         linear, paint)
    canvas.restore()

    return surface.makeImageSnapshot().toarray(
        colorType=skia.kRGBA_8888_ColorType)

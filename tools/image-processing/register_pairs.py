"""
Register each (closed, open) pair and cut the side panel out of it.

The reveal draws three layers, and this produces all of them:

    interior-<name>.png   what is behind the panel   (the aligned open frame)
    body-<name>.png       the chassis, RGBA          (cut from the CLOSED photo)
    panel-<name>.png      the panel, RGBA            (cut from the CLOSED photo)
    panel-<name>.json     its quad and hinge edge

Both cut-outs come from the CLOSED frame, and the body layer never moves. That
is what makes the animation honest: the chassis on screen is always the real
photograph at its real proportions, so the form factor cannot drift no matter
what the interior render did. Only the panel is transformed, and at t=0 it sits
back exactly where it was cut from, so the first frame IS the photograph.

Finding the panel
-----------------
Two earlier attempts failed and are worth recording so they are not retried:

  * Differencing the pair. Both frames are near-black, so the panel and the
    interior differ by less than the noise floor over most of their area - it
    selected either the whole chassis or 10% of it depending on threshold.
  * Segmenting on local texture. The closed panel carries a large hex-mesh vent
    whose frequency is HIGHER than the components behind it, so this selected
    the vent. The same mesh broke edge detection earlier in the project.

What does work is the chassis's own construction. A side panel is bounded by
seams, and a seam is the strongest straight gradient in its neighbourhood, so
the panel is found by locating those two seams in the photograph itself. That
is measurement, but it is measurement of one real edge rather than an estimate,
and it is verified per chassis by assertions below.

    python register_pairs.py            # every pair present
    python register_pairs.py mt-ddr4    # one
    python register_pairs.py --report   # measure, change nothing
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from scipy.spatial import ConvexHull

import scene_merge

HERE = Path(__file__).parent
PAIRS = HERE / "generated" / "pairs"

# Ground level. open_chassis composites onto (10,10,10); anything meaningfully
# above that is chassis rather than backdrop.
GROUND_L = 18

# Where to hunt for each seam, as a fraction across / down the chassis. Wide
# enough to cover all three bodies, narrow enough to exclude the outer edge -
# the silhouette boundary is a stronger gradient than any seam and would win.
SEAM_X = (0.62, 0.96)
# The front edge can sit anywhere from a bit under halfway down (a slim box seen
# from above, where the top plate is most of what you see) to near the base (an
# upright tower, where the seam is the skirt). Starting at 0.70 was tuned on the
# MT alone and put the SFF's real edge outside the search window entirely, so the
# fit landed below the wordmark and the panel carried it away.
SEAM_Y = (0.35, 0.96)

# Pairs built by CLOSING an interior rather than opening a photograph. Those two
# frames come out of one render at one resolution, so they need no fitting.
try:
    from open_chassis import CLOSE_FROM as _CLOSE_FROM
    NO_ALIGN = set(_CLOSE_FROM)
except Exception:
    NO_ALIGN = {"promax-4dimm", "promax-8dimm"}

# Per-chassis overrides, if a seam is ever found in the wrong place.
SEAMS = {}
HINGE = {}


def neutralise(img, keep=0.30):
    """
    Pull a colour-cast render back toward neutral, keeping its luminance.

    Only the two PROMAX pairs need this. They are the only chassis in the range
    with no photograph, so they are generated - and the generator lights them
    with a strong blue rim that reads gaming-PC beside the black MT, SFF and MFF
    machines. Grading them to neutral makes the range consistent; the per-model
    accent lamp in motion/hinge.py then does the differentiating, exactly as it
    does for the photographed chassis.

    `keep` is how much of the original cast survives.
    """
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    grey = a.mean(axis=2, keepdims=True)
    return Image.fromarray(
        np.clip(grey + (a - grey) * keep, 0, 255).astype(np.uint8))


def silhouette(img):
    """Boolean mask of the chassis: bright enough, largest blob, holes filled."""
    lum = np.asarray(img.convert("L"))
    m = lum > GROUND_L
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = lab == (int(np.argmax(sizes)) + 1)
    return ndimage.binary_fill_holes(m)


def _bbox(mask):
    ys, xs = np.nonzero(mask)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def align(open_img, closed_img):
    """
    Fit the open frame onto the closed one by their chassis silhouettes.

    Uniform scale plus translation, from the two bounding boxes. Uniform rather
    than per-axis because a non-uniform stretch would distort the very components
    the reveal exists to show. The model does not reliably honour "same size" -
    on the first MT edit it came back 23% smaller - so this correction is real
    work, not a formality.
    """
    so, sc = silhouette(open_img), silhouette(closed_img)
    ox0, oy0, ox1, oy1 = _bbox(so)
    cx0, cy0, cx1, cy1 = _bbox(sc)
    ow, oh, cw, ch = ox1 - ox0, oy1 - oy0, cx1 - cx0, cy1 - cy0
    if ow < 8 or oh < 8:
        return open_img, 1.0, (0, 0)

    s = ((cw / ow) + (ch / oh)) / 2
    scaled = open_img.resize((max(1, round(open_img.width * s)),
                              max(1, round(open_img.height * s))), Image.LANCZOS)
    dx = round((cx0 + cx1) / 2 - ((ox0 + ox1) / 2) * s)
    dy = round((cy0 + cy1) / 2 - ((oy0 + oy1) / 2) * s)
    out = Image.new("RGB", closed_img.size, (10, 10, 10))
    out.paste(scaled, (dx, dy))
    return out, s, (dx, dy)


def _seam(energy, lo, hi):
    """Strongest straight gradient in [lo, hi) - the panel's edge."""
    band = energy[lo:hi]
    if not len(band) or band.max() <= 0:
        return None
    return int(np.argmax(band)) + lo


def _seam_line(gy, sil, x0, x1, lo, hi, slopes=np.linspace(-0.55, 0.55, 45)):
    """
    Fit the panel's front edge as a straight LINE, not a horizontal row.

    A chassis photographed square-on has a horizontal seam and a single row is
    enough. One photographed at three-quarters does not: the SFF's top plate
    runs from about 0.68 down at its left corner to 0.55 at its right, and the
    best single row sat at 0.636 - below the real edge on the right, so the
    panel region swallowed the front face. The "Latios" wordmark and the port
    row then left the frame with the panel when it slid away.

    Scores every (slope, intercept) by the gradient energy along the line,
    normalised by how much of the line is actually on the chassis so a short
    line through a bright corner cannot win. Returns (slope, intercept) in
    y = slope * x + intercept.
    """
    xs = np.arange(x0, x1)
    best = (0.0, (lo + hi) // 2, -1.0)
    for m in slopes:
        # y along the line, relative to the intercept at x0
        rel = np.rint(m * (xs - x0)).astype(int)
        for c in range(lo, hi):
            ys = c + rel
            good = (ys >= 0) & (ys < gy.shape[0])
            if good.sum() < len(xs) * 0.5:
                continue
            yy, xx = ys[good], xs[good]
            on = sil[yy, xx]
            n = int(on.sum())
            if n < len(xs) * 0.3:
                continue
            score = float(gy[yy, xx][on].sum()) / n
            if score > best[2]:
                best = (float(m), int(c), score)
    return best[0], best[1]


def panel_box(closed, name=""):
    """
    The panel's rectangle in the closed photograph, from its two seams.

    Returns (left, top, right, bottom) plus the fractions, so the report mode can
    show where the seams landed and a wrong one can be pinned in SEAMS.
    """
    if name in SEAMS:
        return SEAMS[name]
    sil = silhouette(closed)
    x0, y0, x1, y1 = _bbox(sil)
    g = np.asarray(closed.convert("L")).astype(np.float32)
    g = ndimage.gaussian_filter(g, 2)

    # Score gradients on the chassis INTERIOR only. The silhouette boundary is a
    # far stronger edge than any seam, so with it included the line search simply
    # found the bottom of the machine: the SFF came back claiming a panel over
    # 96% of the chassis. Eroding first removes that competitor and leaves the
    # real seams, and it changes nothing on the MT, whose seam is nowhere near
    # the outline.
    inner = ndimage.binary_erosion(sil, np.ones((21, 21)))
    gx = np.abs(ndimage.sobel(g, axis=1)); gx[~inner] = 0
    gy = np.abs(ndimage.sobel(g, axis=0)); gy[~inner] = 0

    right = _seam(gx[y0:y1, :].sum(axis=0),
                  x0 + int((x1 - x0) * SEAM_X[0]), x0 + int((x1 - x0) * SEAM_X[1]))
    rx = right or x1
    slope, inter = _seam_line(gy, inner, x0, rx,
                              y0 + int((y1 - y0) * SEAM_Y[0]),
                              y0 + int((y1 - y0) * SEAM_Y[1]))
    return (x0, y0, rx, slope, inter)


def panel_mask(closed, name=""):
    """
    The panel region: chassis, left of the vertical seam, above the front edge.

    Returns the boolean mask and the (slope, intercept) of that edge, so the
    report can show how slanted the chassis is.
    """
    sil = silhouette(closed)
    px0, py0, rx, slope, inter = panel_box(closed, name)
    h, w = sil.shape
    xs = np.arange(w)[None, :]
    ys = np.arange(h)[:, None]
    below = ys <= (slope * (xs - px0) + inter)      # above the slanted seam
    left = xs < rx                                   # before the vertical seam
    return (sil & below & left), (px0, py0, rx, slope, inter)


def _intersect(p1, d1, p2, d2):
    A = np.array([d1, -d2]).T
    if abs(np.linalg.det(A)) < 1e-9:
        return None
    t = np.linalg.solve(A, p2 - p1)
    return p1 + d1 * t[0]


def quad_of(mask):
    """
    The four corners of the panel region: the smallest quadrilateral that still
    contains the whole mask.

    Built by taking the convex hull and dropping one edge at a time - always the
    edge whose removal (extending its two neighbours to their intersection) adds
    the least area - until four remain.

    This replaces picking corner extremes by x+y and x-y. That is exact only
    when each of the four extremes lands on a different corner, and on the SFF's
    top plate it does not: the plate's far-left vertex is simultaneously the
    smallest x+y AND the smallest x-y, so two of the four "corners" collapsed
    onto nearly the same point. The result covered 69% of the panel's real area
    (the MT, photographed square-on, got 99%), and warping that degenerate wedge
    through the swing is what tore the SFF's lid into a slashing triangle across
    the front of the machine.

    Returned in a consistent screen-clockwise winding. Which edge is the hinge
    is decided from the geometry in motion/hinge.py, NOT from these indices -
    on a strongly sheared quad like the SFF's there is no honest way to call one
    corner "top-left".
    """
    ys, xs = np.nonzero(mask)
    pts = np.stack([xs, ys], 1).astype(np.float64)
    hull = ConvexHull(pts)
    v = [np.array(q, dtype=np.float64) for q in pts[hull.vertices]]
    while len(v) > 4:
        best, best_add, best_p = None, None, None
        n = len(v)
        for i in range(n):
            a, b = v[(i - 1) % n], v[i]
            c, d = v[(i + 1) % n], v[(i + 2) % n]
            q = _intersect(a, b - a, d, c - d)
            if q is None:
                continue
            # 2-D cross product written out: np.cross on 2-vectors is
            # deprecated in NumPy 2.0 and slated for removal. NOT named `v` -
            # that is the vertex list this loop is walking, and shadowing it
            # with a 2-element point made the next iteration index into the
            # point instead of the list.
            u, w = b - q, c - q
            add = 0.5 * abs(u[0] * w[1] - u[1] * w[0])
            if best_add is None or add < best_add:
                best, best_add, best_p = i, add, q
        if best is None:
            break
        n = len(v)
        keep = [v[k] for k in range(n) if k != best and k != (best + 1) % n]
        keep.insert(best if best + 1 < n else 0, best_p)
        v = keep

    q = np.array(v)
    centre = q.mean(axis=0)
    ang = np.arctan2(q[:, 1] - centre[1], q[:, 0] - centre[0])
    q = q[np.argsort(ang)]
    return q.tolist()


def build(name, report=False):
    closed_p, open_p = PAIRS / f"closed-{name}.png", PAIRS / f"open-{name}.png"
    if not (closed_p.exists() and open_p.exists()):
        print(f"  {name:14s} pair incomplete - run open_chassis.py first")
        return
    closed = Image.open(closed_p).convert("RGB")
    opened = Image.open(open_p).convert("RGB")
    if opened.size != closed.size:
        opened = opened.resize(closed.size, Image.LANCZOS)
    if name in NO_ALIGN:
        # Graded identically so the pair stays registered, then used as-is:
        # already registered by construction, since the closed frame is an edit
        # OF the open frame at one resolution. Fitting could only add error, and
        # it did - promax-8dimm's interior is so dark (median luminance 4) with a
        # bright floor glow that the silhouette latched onto the glow and asked
        # for a 3.87x correction.
        closed, opened = neutralise(closed), neutralise(opened)
        fitted, s, (dx, dy) = opened, 1.0, (0, 0)
    else:
        fitted, s, (dx, dy) = align(opened, closed)
    sil = silhouette(closed)
    sx0, sy0, sx1, sy1 = _bbox(sil)
    pmask, (px0, py0, px1, slope, inter) = panel_mask(closed, name)
    if not pmask.any():
        print(f"  {name:14s} FAIL empty panel region")
        return
    qx0, qy0, qx1, qy1 = _bbox(pmask)

    fx = (px1 - sx0) / (sx1 - sx0)
    fy = (qy1 - sy0) / (sy1 - sy0)
    cover = pmask.sum() / sil.sum()
    ok = 0.55 <= fx <= 0.99 and 0.35 <= cover <= 0.92
    print(f"  {name:14s} fit x{s:.3f} @({dx:+d},{dy:+d})  seam {fx*100:.1f}% across, "
          f"front edge slope {slope:+.2f}  panel {cover*100:.0f}% of chassis  "
          f"{'ok' if ok else 'OUT OF RANGE - pin it in SEAMS'}")
    if report or not ok:
        return

    # The body: everything else of the real photograph. Static, so the chassis
    # outline on screen is always the photograph's own.
    #
    # The body keeps a margin OVER the panel edge rather than butting up to it,
    # so a pixel of registration slop cannot show the interior through a seam.
    # The panel draws on top of the body, so the overlap costs nothing while it
    # is closed.
    margin = max(3, int(closed.width * 0.015))
    bmask = sil & ~ndimage.binary_erosion(pmask, np.ones((margin, margin)))

    def cut(mask, feather):
        a = Image.fromarray((mask * 255).astype(np.uint8))
        if feather:
            a = a.filter(ImageFilter.GaussianBlur(feather))
        out = closed.copy().convert("RGBA")
        out.putalpha(a)
        return out

    cut(pmask, 1.2).crop((qx0, qy0, qx1, qy1)).save(PAIRS / f"panel-{name}.png")
    cut(bmask, 0.8).save(PAIRS / f"body-{name}.png")

    # The aperture the interior is seen through. Without it the interior render's
    # OWN chassis and backdrop show around the photo cut-out, and since the two
    # rarely match, the machine changed colour as it opened - the SFF went from
    # black to cream mid-animation. Clipping to the aperture means the only
    # pixels the interior ever contributes are the ones behind the panel.
    Image.fromarray((pmask * 255).astype(np.uint8)) \
        .filter(ImageFilter.GaussianBlur(2.0)).save(PAIRS / f"aperture-{name}.png")

    graded = scene_merge.match_palette(
        fitted, closed, Image.fromarray((pmask * 255).astype(np.uint8)))
    graded.save(PAIRS / f"interior-{name}.png")

    hinge = HINGE.get(name)
    if hinge is None:
        # A side panel swings on its rear edge. The seam side is the FRONT of
        # the machine (it is where the bezel begins), so the hinge is opposite.
        hinge = "left" if px1 > (sx0 + sx1) / 2 else "right"

    # Two quads: where the panel sits in the frame, and where its own pixels sit
    # inside the cropped PNG. motion/hinge.py warps src_quad -> the swung frame
    # quad, so a rhombus stays a rhombus. Warping the crop RECTANGLE instead
    # sheared the SFF's plate the moment it started to move.
    q = quad_of(pmask)
    (PAIRS / f"panel-{name}.json").write_text(json.dumps({
        "quad": [[round(x, 1), round(y, 1)] for x, y in q],
        "src_quad": [[round(x - qx0, 1), round(y - qy0, 1)] for x, y in q],
        "bbox": [qx0, qy0, qx1, qy1], "hinge": hinge,
        "front_edge": [round(float(slope), 4), int(inter)],
        "frame": list(closed.size), "coverage": round(float(cover), 4),
        "fit_scale": round(float(s), 4),
    }, indent=2), encoding="utf-8")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    names = args or sorted({p.stem[7:] for p in PAIRS.glob("closed-*.png")})
    for n in names:
        build(n, report="--report" in sys.argv)

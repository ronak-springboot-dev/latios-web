"""Studio light for the AM4 page's two chassis images: the front and the side.

Both were the photographed chassis on a dark ground, relit at a denoise low
enough to keep the Latios wordmark -- which also meant the relight added almost
nothing. On the page they read as dark slabs: the box the same near-black as the
ground, lit flat, and leaning, because the shoot's camera sat above the box and
every vertical converges (the front is ~11% narrower at the foot than the top).

So the light is built here, in the chassis's own alpha, before the model sees
it; the model's pass only has to make it photographic.

  rectify    keystone correction. The silhouette's left, right and top edges
             are fitted from the alpha and the base is found where the body
             ends, and the quad they make is mapped to an upright rectangle.
             Nothing is drawn: the photograph is re-projected, as a shift lens
             would have shot it.
  despeckle  dust off a flat panel -- only inside a given interior box, because
             a median filter also eats thin highlights and lettering.
  light      form (brighter at the top), local contrast so ribs and grain read,
             a warm key rim on the right edge, a cool fill rim on the left, a
             catch light on the top edge, one soft vertical sheen.
  compose    near-black ground with a neutral halo behind the upper body -- the
             separation a black box needs from a black ground -- the page's amber
             on the floor, a contact shadow and a fading reflection.
"""
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


def _edges(a, rows=(0.12, 0.85), cols=(0.2, 0.8)):
    """Least-squares lines: x = L(y) and x = R(y) for the sides, y = T(x) for the top."""
    h, w = a.shape
    ys = np.arange(int(h * rows[0]), int(h * rows[1]))
    left = np.array([np.argmax(a[y]) for y in ys])
    right = np.array([w - 1 - np.argmax(a[y][::-1]) for y in ys])
    xs = np.arange(int(w * cols[0]), int(w * cols[1]))
    top = np.array([np.argmax(a[:, x]) for x in xs])
    return np.polyfit(ys, left, 1), np.polyfit(ys, right, 1), np.polyfit(xs, top, 1)


def _base_row(a, side, fit, start, inset):
    """First row below `start` where the silhouette pulls in from its fitted edge."""
    h, w = a.shape
    for y in range(start, h):
        row = a[y]
        if not row.any():
            return y
        x = np.argmax(row) if side == "left" else w - 1 - np.argmax(row[::-1])
        edge = fit[0] * y + fit[1]
        if (x - edge if side == "left" else edge - x) > inset:
            return y
    return h - 1


def quad(alpha, base=None):
    """Body corners TL, TR, BR, BL in pixels.

    base: the body's lower edge as ((x0, y0), (x1, y1)) in fractions, when it has
    been measured; otherwise it is found on each side, as the row where the
    silhouette steps in from the fitted edge (the front's plinth is inset).
    """
    a = np.asarray(alpha) > 128
    h, w = a.shape
    L, R, T = _edges(a)

    def meet_top(S):                       # x = S0*y + S1  with  y = T0*x + T1
        y = (T[0] * S[1] + T[1]) / (1 - T[0] * S[0])
        return (S[0] * y + S[1], y)

    if base:
        (bx0, by0), (bx1, by1) = base
        B0 = (by1 - by0) / (bx1 - bx0) * h / w
        B1 = (by0 - bx0 * (by1 - by0) / (bx1 - bx0)) * h

        def meet_base(S):                  # x = S0*y + S1  with  y = B0*x + B1
            y = (B0 * S[1] + B1) / (1 - B0 * S[0])
            return (S[0] * y + S[1], y)
        return [meet_top(L), meet_top(R), meet_base(R), meet_base(L)]

    inset = 0.015 * w
    yl = _base_row(a, "left", L, int(h * 0.85), inset)
    yr = _base_row(a, "right", R, int(h * 0.85), inset)
    return [meet_top(L), meet_top(R), (R[0] * yr + R[1], yr), (L[0] * yl + L[1], yl)]


def _coeffs(dst, src):
    """PIL PERSPECTIVE data mapping output points dst onto input points src."""
    rows, rhs = [], []
    for (x, y), (u, v) in zip(dst, src):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); rhs.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y]); rhs.append(v)
    return np.linalg.solve(np.array(rows, float), np.array(rhs, float)).tolist()


def rectify(rgba, corners):
    """Re-project so the corner quad becomes an upright rectangle.

    Returns (image cropped to its alpha, body rectangle (x0, y0, x1, y1) in that
    image's pixels). The rectangle keeps the quad's own mean proportions.
    """
    TL, TR, BR, BL = corners
    d = lambda p, q: float(np.hypot(p[0] - q[0], p[1] - q[1]))
    wq = (d(TL, TR) + d(BL, BR)) / 2
    hq = (d(TL, BL) + d(TR, BR)) / 2
    W, H = int(wq * 1.4), int(hq * 1.3)
    x0, y0 = (W - wq) / 2, hq * 0.1
    dst = [(x0, y0), (x0 + wq, y0), (x0 + wq, y0 + hq), (x0, y0 + hq)]
    out = rgba.transform((W, H), Image.PERSPECTIVE, _coeffs(dst, corners), Image.BICUBIC)
    bbox = out.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox()
    out = out.crop(bbox)
    return out, (x0 - bbox[0], y0 - bbox[1], x0 + wq - bbox[0], y0 + hq - bbox[1])


def dark_box(rgba, interior, threshold=28, density=0.08):
    """Bounding box, in pixels, of the dark window inside `interior` (fractions).

    The side view's mesh window is redrawn empty in the photograph's own frame,
    as a rectangle -- but the photograph leans, so after rectify() that rectangle
    comes out a trapezoid. It is found again here, as the rows and columns where
    enough of the box-blurred luminance is dark, so it can be redrawn upright.

    The density is low on purpose: the box has to swallow the whole trapezoid.
    At 0.3 it found the window's inner extent, and the old slanted edge showed
    as a sliver beside the new one. The window spans ~36% of the panel; stray
    dark marks on it stay far under 8%, so the box cannot wander.
    """
    w, h = rgba.size
    x0, y0, x1, y1 = int(w * interior[0]), int(h * interior[1]), int(w * interior[2]), int(h * interior[3])
    dark = np.asarray(rgba.convert("L").filter(ImageFilter.BoxBlur(9)))[y0:y1, x0:x1] < threshold

    def run(profile):                      # the longest stretch above the density
        best, start = (0, 0), None
        for i, v in enumerate(list(profile > density) + [False]):
            if v and start is None:
                start = i
            elif not v and start is not None:
                best = max(best, (start, i - 1), key=lambda r: r[1] - r[0])
                start = None
        return best

    c0, c1 = run(dark.mean(0))
    r0, r1 = run(dark.mean(1))
    return (x0 + c0, y0 + r0, x0 + c1, y0 + r1)


def redraw_mesh(rgba, box, pitch):
    """Perforated steel in `box` (pixels), hex holes on a `pitch` grid.

    Drawn at 3x and reduced, so holes a few pixels across stay round.
    """
    x0, y0, x1, y1 = [int(v) for v in box]
    k = 3
    pw, ph = (x1 - x0) * k, (y1 - y0) * k
    patch = Image.new("RGB", (pw, ph), (24, 24, 26))
    d = ImageDraw.Draw(patch)
    p = pitch * k
    r, row, y = p * 0.36, 0, p * 0.8
    while y < ph - p * 0.5:
        x = p * 0.8 + (p / 2 if row % 2 else 0)
        while x < pw - p * 0.5:
            d.regular_polygon((x, y, r), 6, fill=(5, 5, 6))
            x += p
        y += p * 0.866
        row += 1
    out = rgba.copy()
    out.paste(patch.resize((x1 - x0, y1 - y0), Image.LANCZOS), (x0, y0))
    out.putalpha(rgba.getchannel("A"))
    return out


def despeckle(rgba, interior, threshold=22):
    """Pixels brighter than their 7px median by `threshold`, inside `interior`
    (x0, y0, x1, y1 as fractions), take the median's value."""
    w, h = rgba.size
    rgb = rgba.convert("RGB")
    med = rgb.filter(ImageFilter.MedianFilter(7))
    speck = ImageChops.subtract(rgb.convert("L"), med.convert("L"))
    speck = speck.point(lambda v: 255 if v > threshold else 0).filter(ImageFilter.MaxFilter(3))
    zone = Image.new("L", rgba.size, 0)
    x0, y0, x1, y1 = interior
    ImageDraw.Draw(zone).rectangle([w * x0, h * y0, w * x1, h * y1], fill=255)
    out = Image.composite(med, rgb, ImageChops.multiply(speck, zone))
    out.putalpha(rgba.getchannel("A"))
    return out


def light(rgba, sheen_at=0.3, key=(255, 226, 190), fill=(150, 176, 214),
          lift=0.22, fall=0.36, sharpen=70):
    """Form, local contrast, rims and a sheen, all inside the product's alpha.

    The defaults are the black MT's: a 22% lift at the top is what made a black
    box read. Bright anodised aluminium clips to white under the same lift, so a
    laptop passes lift=0 and a gentler fall and sharpen.
    """
    w, h = rgba.size
    alpha = rgba.getchannel("A")
    rgb = rgba.convert("RGB").filter(
        ImageFilter.UnsharpMask(radius=max(3, w // 90), percent=sharpen, threshold=1))
    arr = np.asarray(rgb).astype(float)
    yy, xx = np.mgrid[0:h, 0:w]
    t, u = yy / h, xx / w
    arr *= ((1 + lift) - fall * t)[..., None]                    # light falls from above
    arr += (np.exp(-((u - sheen_at) / 0.10) ** 2) * 20)[..., None]  # one soft sheen
    edge = alpha.filter(ImageFilter.MinFilter(9))
    edge = np.asarray(ImageChops.subtract(alpha, edge).filter(ImageFilter.GaussianBlur(2))).astype(float) / 255
    k = np.clip((u - 0.55) / 0.45, 0, 1)                          # key: right edge
    f = np.clip((0.45 - u) / 0.45, 0, 1)                          # fill: left edge
    top = np.clip(1 - yy / (0.06 * h), 0, 1)                      # catch light: top edge
    arr += edge[..., None] * (np.array(key) * (0.55 * k + 0.35 * top)[..., None]
                              + np.array(fill) * (0.30 * f)[..., None])
    out = Image.fromarray(arr.clip(0, 255).astype("uint8"))
    out.putalpha(alpha)
    return out


#: Default ground: the page's own near-black, barely graded. A product plate
#: sits on the page, so its floor has to BE the page or the plate reads as a
#: rectangle pasted on.
DARK_GROUND = ((7, 7, 10), (3, 3, 5))

#: The hero card's backdrop: deep indigo overhead falling through violet to a
#: warm horizon at the floor, which is the reference page's one lit card and the
#: reason its grid does not read as eight black squares. Stops are (position,
#: colour) so the violet can sit above the midpoint, where the eye reads the
#: turn from cold to warm.
#: The hero card's backdrop, sampled off the reference's own artwork rather than
#: guessed: deep navy overhead falling through indigo and mauve to a near-white
#: warm floor at about 86% of the card, then easing back down at the very bottom
#: edge. Those last two stops are the whole trick -- the product stands ON light,
#: and its contact shadow and reflection are what read, while the top of it is
#: still against navy where its own edges catch.
#:
#: An earlier pass pitched this much darker out of a worry that a black chassis
#: would go flat on a bright floor. It does -- but only the SIDE view does, which
#: is one unbroken black panel. The front is ribbed and carries the wordmark, so
#: it holds its form against the light, which is why the card shows the front.
LIT_GROUND = ((0.00, (24, 26, 40)), (0.06, (17, 23, 73)), (0.20, (41, 48, 116)),
              (0.36, (66, 70, 133)), (0.50, (102, 98, 148)), (0.62, (144, 131, 161)),
              (0.74, (191, 175, 186)), (0.86, (234, 223, 217)), (1.00, (150, 132, 130)))


def _ground(W, H, stops):
    """A vertical gradient. Stops are (position, colour) pairs, or two colours."""
    if len(stops[0]) == 3:
        stops = ((0.0, stops[0]), (1.0, stops[1]))
    pos = np.array([p for p, _ in stops])
    cols = np.array([c for _, c in stops], dtype=float)
    t = np.linspace(0, 1, H)
    ramp = np.stack([np.interp(t, pos, cols[:, k]) for k in range(3)], axis=1)
    return Image.fromarray(
        np.broadcast_to(ramp[:, None, :], (H, W, 3)).astype("uint8"))


def streaks(img, at=0.52, count=7, spread=0.22, strength=0.55, tint=(196, 214, 255)):
    """Horizontal light streaks across the backdrop, behind the subject.

    The reference's component sections all carry these -- long, soft, unevenly
    spaced bands of light drawn through the gradient at about the subject's
    waist. They are what stops a lit backdrop reading as a flat sheet of colour,
    and they are cheap: drawn here rather than asked of the model, which cannot
    place them behind a subject it is drawing at the same time.

    Deterministic spacing from a fixed table, not random: a re-run has to give
    back the same picture, and a seeded RNG is one import away from not doing so.
    """
    W, H = img.size
    offsets = (-1.00, -0.62, -0.30, -0.08, 0.16, 0.44, 0.82, 1.00, -0.46, 0.64)
    widths = (0.010, 0.004, 0.007, 0.003, 0.005, 0.0035, 0.008, 0.005, 0.003, 0.006)
    alphas = (0.55, 0.30, 0.80, 0.22, 0.45, 0.28, 0.65, 0.35, 0.20, 0.40)
    yy = np.arange(H)[:, None].astype(np.float32)
    band = np.zeros((H, W), np.float32)
    for i in range(min(count, len(offsets))):
        y0 = (at + offsets[i] * spread) * H
        band += alphas[i] * np.exp(-0.5 * ((yy - y0) / max(1.0, widths[i] * H)) ** 2)
    # Fade the ends so no streak stops dead at the frame edge.
    xx = np.linspace(0, 1, W, dtype=np.float32)[None, :]
    band = band * np.clip(np.sin(np.pi * xx) ** 0.6, 0, 1)
    arr = np.asarray(img).astype(np.float32)
    arr += np.array(tint, np.float32) * (strength * np.clip(band, 0, 1))[..., None]
    return Image.fromarray(arr.clip(0, 255).astype("uint8"))


def compose(product, W, H, height, floor, cx=0.5, halo=(44, 46, 54), glow=(125, 66, 18),
            reflect=True, shadow=True, ground=DARK_GROUND, halo_at=0.30, glow_at=120,
            after_ground=None):
    """Stage a lit product. height and floor are fractions of H.

    Returns (canvas RGB, (x, y, scale)): where the product's top-left landed and
    how much it was scaled, so callers can place callouts on it. reflect and
    shadow are for a product standing on the floor; a view from directly above
    has neither.
    """
    img = _ground(W, H, ground)
    if after_ground:                      # streaks go on the backdrop, under the bloom
        img = after_ground(img)

    halo_m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(halo_m).ellipse([W * (cx - halo_at), H * 0.04, W * (cx + halo_at), H * (floor - 0.08)], fill=255)
    img = Image.composite(Image.new("RGB", (W, H), halo), img, halo_m.filter(ImageFilter.GaussianBlur(W / 8)))
    glow_m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow_m).ellipse([W * 0.10, H * (floor - 0.16), W * 0.90, H * (floor + 0.40)], fill=glow_at)
    img = Image.composite(Image.new("RGB", (W, H), glow), img, glow_m.filter(ImageFilter.GaussianBlur(W / 10)))

    ph = int(H * height)
    scale = ph / product.height
    p = product.resize((round(product.width * scale), ph), Image.LANCZOS)
    fy = int(H * floor)
    x, y = int(W * cx - p.width / 2), fy - ph

    if reflect:
        refl = p.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, p.width, ph // 3))
        fade = ImageOps.invert(Image.linear_gradient("L").resize(refl.size)).point(lambda v: int(v * 0.20))
        refl.putalpha(ImageChops.multiply(refl.getchannel("A"), fade))
        img.paste(refl, (x, fy), refl)

    if shadow:
        sm = Image.new("L", (W, H), 0)
        ImageDraw.Draw(sm).ellipse([x - p.width * 0.06, fy - H * 0.010, x + p.width * 1.06, fy + H * 0.014], fill=220)
        img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img, sm.filter(ImageFilter.GaussianBlur(6)))
    img.paste(p, (x, y), p)
    return img, (x, y, scale)

"""Set type beside the desk scenes, so they read as posters rather than snapshots.

The scenes came out of stage_desk_scenes.py as bare photographs. Beside the
reference storefront's marketing imagery they looked empty: that page's promo
work carries its headline, its kicker and its numbers INSIDE the picture, and a
photograph with the words moved out to HTML beside it is a different thing.

So this is make_bands.py applied to a photograph instead of to generated
component art, and the rule it exists to enforce is unchanged:

    "THE TYPE IS SET, NEVER GENERATED. The diffusion model cannot spell - it has
     produced 'Lohxs', 'Lobos', 'DDR2V' and 'DDR5 ECC' in this project alone."

Every character here is drawn by PIL from the vendored Outfit and Manrope
faces. The photograph underneath already went through its own gate: the machine
is a real cut-out composited in, so its wordmark is pixel-exact.

WHY THE TYPE IS NO LONGER ON THE PHOTOGRAPH
-------------------------------------------
It was, for two passes. First over a one-sided scrim, then over a local panel
whose opacity was solved per scene from the luminance underneath. Both were
attempts to make a headline legible on top of a busy room, and both were
treating a symptom.

The measurement that ended it: slide an 860x520 block -- the size of the type --
across every position in all six rooms and take the local standard deviation at
each. The QUIETEST position in any of them scores 27-67. Real negative space
scores under 15. There is nowhere in these photographs to put a headline. In
mt-office the calmest region is the desk foreground and the entire left half is
monitor, which is exactly where the type had been sitting.

That is a composition problem, not a placement one. gen_desk_scenes.py prompts
for "an uncluttered stretch of bare desktop" to seat the MACHINE; nothing ever
reserved a field for TYPE. No x/y nudge fixes it and no stronger scrim fixes it
-- a scrim strong enough to carry a headline is just a panel with the room
faintly showing through.

So the type gets a field of its own beside the photograph. The photograph is
never covered, and collision is impossible by construction rather than by
tuning. The alternative -- re-rendering all six rooms with an empty third
designed in -- remains the route to true type-over-photograph and is a separate
job: it costs the renders plus a re-tune of every stage_desk_scenes JOBS
coordinate.

TWO THINGS THE SPLIT DECIDES FOR YOU
------------------------------------
  * The headline AUTO-WRAPS to the field. It used to be hand-broken, which meant
    a line could be wider than anything containing it -- mt-control's "deployed
    everywhere." was 980px against a 920px column and ran off the end of its own
    panel. Wrapping to the measured column cannot do that, and the only
    remaining constraint is the longest single word ("specifications.", 688px at
    a 100px face), which FIELD is sized against.
  * The crop is anchored on the MACHINE, not on the frame. The photo area is
    narrower than the source, so about a quarter of the room's width goes; which
    quarter is decided by putting the product at a fixed fraction of the cropped
    frame, taking its position from stage_desk_scenes.JOBS rather than guessing.
    mt-control is the case that needs it: its type is on the right and its
    machine already sits at 0.68, so a naive right-hand crop would cut into it.

A SECOND, PORTRAIT ASSET
------------------------
Baked type has three ways to break, and PdpBand.jsx names all of them: cropped,
stretched, or too small to read. The wide poster hits the third on a phone --
a 116px headline on a 2560px canvas arrives at 15px when the band is 327px
wide. So every scene also emits a portrait file with the field stacked ABOVE the
photograph and the type sized for that width, and PdpBand picks between them
with a <picture> media query.

    python make_scene_bands.py            # all
    python make_scene_bands.py mt-office
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from make_bands import font, text, wrap
from stage_desk_scenes import JOBS          # the machine's position, measured

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
SRC = PUBLIC / "scenes"
OUT = PUBLIC / "scenes"

INK = (247, 247, 249)
BODY = (216, 218, 224)
MUTED = (152, 155, 162)

#: The field's ground. This is PdpBand's own figure background (`bg-[#0a0a0c]`),
#: so the poster reads as a photograph with type beside it rather than as a slab
#: pasted onto the page. The accent appears only in the rule and the figures.
GROUND = (10, 10, 12)

#: Wide: what the page shows from 768px up, rendered at max-w-[1240px].
#: FIELD is 0.40 of the width because that is what carries a 60px-on-page
#: headline -- both scale with the canvas, so the FRACTION is the real setting
#: and the pixel width is a consequence of the canvas size.
WIDE = (2560, 1120)
FIELD = 0.40
#: Portrait: what a phone gets, field above photograph.
TALL = (1200, 1500)
TALL_FIELD = 0.44
#: The photograph does not end on a hard line; it fades into the field over this
#: fraction of the canvas.
SEAM = 0.035

#: scene -> which side the type sits on, the page accent, and the words.
#: The headline is ONE string now. It wraps to the field; the hand-break it used
#: to carry is what let a line outgrow its own panel.
BANDS = {
    "mt-office": dict(
        side="left", accent=(226, 87, 31), kicker="Cores where the budget goes",
        head="Eighteen litres, beside the screen.",
        body="DDR4 on the cheaper bus, so the money buys an i9 and a professional "
             "card instead of a faster memory controller.",
        figs=[("24", "cores"), ("64", "GB"), ("18", "L")]),
    "mt-studio": dict(
        side="left", accent=(143, 163, 184), kicker="The Pro build",
        head="One box, four specifications.",
        body="Core i7-14700 down to i3-14100 on the same board, so a studio buys "
             "one shape, one panel and one spare part.",
        figs=[("i7", "14700"), ("64", "GB"), ("4", "SKUs")]),
    "mt-control": dict(
        side="right", accent=(61, 110, 168), kicker="Specified for managed fleets",
        head="Specified once, deployed everywhere.",
        body="Q670 adds the manageability and lane count that large estates are "
             "specified around. One image, one service procedure.",
        figs=[("5600", "MT/s"), ("24", "cores"), ("A4000", "ready")]),
    "sff-desk": dict(
        side="left", accent=(24, 182, 196), kicker="Eight litres",
        head="Eight litres, under the monitor.",
        body="Ninety-five millimetres thick, so it stands beside a display on a "
             "shallow desk or lies flat beneath one.",
        figs=[("8", "L"), ("4.74", "kg"), ("i7", "14700")]),
    "sff-reception": dict(
        side="right", accent=(124, 92, 240), kicker="An NPU in eight litres",
        head="Small enough for the front desk.",
        body="Ryzen AI on the die, for the inference work a counter, a kiosk or a "
             "consulting room is starting to do locally.",
        figs=[("8", "cores"), ("5200", "MT/s"), ("8", "L")]),
    "sff-lab": dict(
        side="left", accent=(42, 161, 152), kicker="Volume rollout",
        head="One bench, one specification.",
        body="Two 2.5-gigabit ports on every seat and an NPU on every package, in "
             "eight litres that leaves the bench to the work.",
        figs=[("2", "× 2.5G"), ("64", "GB"), ("8", "L")]),
}


def crop_to(img, aspect, cx, anchor):
    """Crop to `aspect`, keeping the machine at `anchor` of the result.

    The photo area is narrower than the source, so something goes. Centring the
    crop is the wrong default: the product is not in the middle of any of these
    rooms -- it runs from 0.345 (sff-reception) to 0.815 (mt-office) -- and a
    centre crop would walk off the edge of it. `cx` is stage_desk_scenes.JOBS's
    own number for where the product was composited, so this cannot drift from
    where the machine actually is.

    Returns the crop and where the machine ended up in it, which the caller
    prints: that number IS the gate on "did the crop cut the product".
    """
    w, h = img.size
    cw = min(w, round(h * aspect))
    left = max(0, min(w - cw, round(cx * w - anchor * cw)))
    return img.crop((left, 0, left + cw, h)), (cx * w - left) / cw


def balance(d, s, f, colw):
    """Wrap so the lines come out even, instead of greedily filling each one.

    make_bands.wrap is greedy: it packs a line until the next word will not fit.
    In a column this narrow that leaves orphans -- "Eighteen litres, / beside the
    / screen." puts one short word on a line of its own and the headline stops
    looking set. This is the standard fix: a DP over break points minimising the
    sum of squared slack, last line included, which is what makes the lines even
    rather than merely legal.

    Falls back to nothing clever if a single word cannot fit; measure() asserts
    on that case before this is ever called.
    """
    words = s.split()
    n = len(words)
    w = [[d.textlength(" ".join(words[i:j]), font=f) for j in range(n + 1)]
         for i in range(n)]
    INF = float("inf")
    cost = [0.0] + [INF] * n
    prev = [0] * (n + 1)
    for j in range(1, n + 1):
        for i in range(j):
            if w[i][j] > colw or cost[i] == INF:
                continue
            c = cost[i] + (colw - w[i][j]) ** 2
            if c < cost[j]:
                cost[j], prev[j] = c, i
    if cost[n] == INF:
        return wrap(d, s, f, colw)
    lines, j = [], n
    while j:
        lines.append(" ".join(words[prev[j]:j]))
        j = prev[j]
    return lines[::-1]


def measure(d, cfg, colw, u):
    """Wrap every line and total the block's height, before anything is drawn."""
    f_head = font("Outfit", round(116 * u), 800)
    f_body = font("Manrope", round(34 * u), 400)
    f_fig = font("Outfit", round(62 * u), 700)

    # The one thing wrapping cannot rescue is a single word wider than the
    # column, so assert rather than let it run into the photograph.
    widest = max(d.textlength(w, font=f_head) for w in cfg["head"].split())
    if widest > colw:
        raise SystemExit(f"  headline word is {widest:.0f}px against a {colw}px "
                         f"field - shorten it or widen FIELD")

    head = balance(d, cfg["head"], f_head, colw)
    body = wrap(d, cfg["body"], f_body, colw)
    lh_head, lh_body = round(126 * u), round(50 * u)
    h = (round(40 * u) + round(70 * u) + len(head) * lh_head
         + round(24 * u) + len(body) * lh_body + round(44 * u) + round(100 * u))
    return dict(f_head=f_head, f_body=f_body, f_fig=f_fig, head=head, body=body,
                lh_head=lh_head, lh_body=lh_body, h=h)


def draw_block(d, m, cfg, x, y, u):
    """Rule, kicker, headline, supporting line, figures -- the house band order."""
    d.rectangle([x, y, x + round(52 * u), y + round(6 * u)], fill=cfg["accent"])
    y += round(40 * u)
    text(d, (x, y), cfg["kicker"].upper(), font("Manrope", round(30 * u), 600),
         MUTED, tracking=round(9 * u))
    y += round(70 * u)

    for line in m["head"]:
        text(d, (x, y), line, m["f_head"], INK, tracking=round(-2 * u))
        y += m["lh_head"]
    y += round(24 * u)

    for line in m["body"]:
        text(d, (x, y), line, m["f_body"], BODY)
        y += m["lh_body"]
    y += round(44 * u)

    # The column advances on whichever of the two lines is wider. Advancing on
    # the VALUE put "CORES" hard against "MT/S" on sff-reception, where the
    # value is a single "8" and the label under it is five characters.
    f_unit = font("Manrope", round(23 * u), 600)
    fx = x
    for val, unit in cfg["figs"]:
        w = text(d, (fx, y), val, m["f_fig"], cfg["accent"])
        lw = text(d, (fx, y + round(72 * u)), unit.upper(), f_unit, MUTED,
                  tracking=round(5 * u))
        fx += max(w, lw, 44 * u) + round(58 * u)


def fade(img, box, axis, at_start, px):
    """Fade the photograph into the field, so the join is not a cut line."""
    x0, y0, x1, y1 = box
    n = max(2, px)
    g = Image.new("L", (n, 1))
    p = g.load()
    for i in range(n):
        t = i / (n - 1)
        p[i, 0] = int(((1 - t) if at_start else t) ** 1.6 * 255)
    if axis == "x":
        gx = x0 if at_start else x1 - n
        strip, size = (gx, y0, gx + n, y1), (n, y1 - y0)
        mask = g.resize(size)
    else:
        gy = y0 if at_start else y1 - n
        strip, size = (x0, gy, x1, gy + n), (x1 - x0, n)
        mask = g.rotate(-90, expand=True).resize(size)
    img.paste(Image.new("RGB", size, GROUND), strip, mask)


def band(name, cfg):
    src = SRC / f"{name}.webp"
    if not src.exists():
        print(f"  skip {name:16s} (no scene)")
        return
    photo0 = Image.open(src).convert("RGB")
    cx = JOBS[name]["cx"]
    left = cfg["side"] == "left"
    out = []

    # --- wide: field beside the photograph -------------------------------
    W, H = WIDE
    fw = round(W * FIELD)
    pw = W - fw
    # The machine sits AWAY from the field, so the poster's two halves do not
    # fight: type on the left puts the product at 0.62 of the photo, and the
    # mirror of that when the type is on the right.
    photo, at = crop_to(photo0, pw / H, cx, 0.62 if left else 0.38)
    img = Image.new("RGB", (W, H), GROUND)
    px = fw if left else 0
    img.paste(photo.resize((pw, H), Image.LANCZOS), (px, 0))
    fade(img, (px, 0, px + pw, H), "x", left, round(W * SEAM))

    u = W / 2560.0
    pad = round(W * 0.035)
    d = ImageDraw.Draw(img)
    m = measure(d, cfg, fw - 2 * pad, u)
    draw_block(d, m, cfg, pad if left else pw + pad, (H - m["h"]) // 2, u)
    out.append((OUT / f"{name}-band.webp", img, f"machine at {at:.2f} of the photo"))

    # --- portrait: field above the photograph ----------------------------
    W, H = TALL
    fh = round(H * TALL_FIELD)
    ph = H - fh
    photo, at2 = crop_to(photo0, W / ph, cx, 0.5)
    img = Image.new("RGB", (W, H), GROUND)
    img.paste(photo.resize((W, ph), Image.LANCZOS), (0, fh))
    fade(img, (0, fh, W, H), "y", True, round(H * SEAM))

    u = W / 1200.0 * 0.83
    pad = round(W * 0.055)
    d = ImageDraw.Draw(img)
    m = measure(d, cfg, W - 2 * pad, u)
    if m["h"] > fh - 2 * pad:
        raise SystemExit(f"  portrait block is {m['h']}px in a {fh}px field - "
                         f"raise TALL_FIELD or shorten the copy")
    draw_block(d, m, cfg, pad, (fh - m["h"]) // 2, u)
    out.append((OUT / f"{name}-band-sm.webp", img, f"machine at {at2:.2f}"))

    for path, im, note in out:
        im.save(path, "WEBP", quality=90, method=6)
        print(f"  {path.name:26s} {str(im.size):12s} {path.stat().st_size // 1024:>4}KB"
              f"  {note}")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in BANDS.items():
        if only and name not in only:
            continue
        band(name, cfg)

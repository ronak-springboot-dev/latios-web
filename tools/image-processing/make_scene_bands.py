"""Set type onto the desk scenes, so they read as posters rather than snapshots.

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

Layout follows the house band -- accent rule, tracked kicker, headline, a
supporting line, and a row of figures -- because that pattern is already on
this site in /bands and a second dialect would just look like two designers.

Two things the photograph forces that generated art does not:

  * The scrim is on ONE side, chosen per scene, not across the bottom. These
    rooms have their subject in the middle and their light on one edge; a
    bottom ramp either buries the machine or leaves the type on a lit window.
  * The type column is measured against the scrim, so a long headline wraps
    inside the darkened area rather than running out onto the desk.

    python make_scene_bands.py            # all
    python make_scene_bands.py mt-office
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

from make_bands import font, text, wrap

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
SRC = PUBLIC / "scenes"
OUT = PUBLIC / "scenes"

def side_scrim(img, side, strength=236, power=2.6):
    """A one-sided wash that decays FAST, so only the type side darkens.

    make_bands.scrim ramps as t**1.5 and therefore only reaches zero at the
    opposite edge; two passes of it to get a readable type column left the whole
    photograph muddy and buried the machine. A steeper power puts the same
    density under the words and lets the far side of the room keep its light,
    which is what the reference posters do.
    """
    w, h = img.size
    g = Image.new("L", (w, 1))
    px = g.load()
    for i in range(w):
        t = i / max(1, w - 1)
        v = (t if side == "right" else 1 - t) ** power
        px[i, 0] = int(v * strength)
    dark = Image.new("RGB", (w, h), (6, 7, 9))
    return Image.composite(dark, img, g.resize((w, h)))


INK = (247, 247, 249)
BODY = (216, 218, 224)
MUTED = (152, 155, 162)

#: scene -> which side the type sits on, the page accent, and the words.
#: `side` is where the scrim ramps FROM, so "left" darkens the left edge.
BANDS = {
    "mt-office": dict(
        side="left", accent=(226, 87, 31), kicker="Cores where the budget goes",
        head="Eighteen litres,\nbeside the screen.",
        body="DDR4 on the cheaper bus, so the money buys an i9 and a professional "
             "card instead of a faster memory controller.",
        figs=[("24", "cores"), ("64", "GB"), ("18", "L")]),
    "mt-studio": dict(
        side="left", accent=(143, 163, 184), kicker="The Pro build",
        head="One box,\nfour specifications.",
        body="Core i7-14700 down to i3-14100 on the same board, so a studio buys "
             "one shape, one panel and one spare part.",
        figs=[("i7", "14700"), ("64", "GB"), ("4", "SKUs")]),
    "mt-control": dict(
        side="right", accent=(61, 110, 168), kicker="Specified for managed fleets",
        head="Specified once,\ndeployed everywhere.",
        body="Q670 adds the manageability and lane count that large estates are "
             "specified around. One image, one service procedure.",
        figs=[("5600", "MT/s"), ("24", "cores"), ("A4000", "ready")]),
    "sff-desk": dict(
        side="left", accent=(24, 182, 196), kicker="Eight litres",
        head="Eight litres,\nunder the monitor.",
        body="Ninety-five millimetres thick, so it stands beside a display on a "
             "shallow desk or lies flat beneath one.",
        figs=[("8", "L"), ("4.74", "kg"), ("i7", "14700")]),
    "sff-reception": dict(
        side="right", accent=(124, 92, 240), kicker="An NPU in eight litres",
        head="Small enough\nfor the front desk.",
        body="Ryzen AI on the die, for the inference work a counter, a kiosk or a "
             "consulting room is starting to do locally.",
        figs=[("8", "cores"), ("5200", "MT/s"), ("8", "L")]),
    "sff-lab": dict(
        side="left", accent=(42, 161, 152), kicker="Volume rollout",
        head="One bench,\none specification.",
        body="Two 2.5-gigabit ports on every seat and an NPU on every package, in "
             "eight litres that leaves the bench to the work.",
        figs=[("2", "× 2.5G"), ("64", "GB"), ("8", "L")]),
}


def band(name, side, accent, kicker, head, body, figs):
    src = SRC / f"{name}.webp"
    if not src.exists():
        print(f"  skip {name:16s} (no scene)")
        return
    img = Image.open(src).convert("RGB")
    W, H = img.size

    img = side_scrim(img, side, strength=210, power=3.0)
    d = ImageDraw.Draw(img)

    col = round(W * 0.40)                      # the type column
    pad = round(W * 0.055)
    x = pad if side == "left" else W - col - pad
    y0 = round(H * 0.20)

    f_head = font("Outfit", 60, 800)
    f_body = font("Manrope", 23, 400)
    head_lines = head.splitlines()
    body_lines = wrap(d, body, f_body, col)

    # Measure the block, then lay a soft panel under it BEFORE drawing a single
    # character. The side ramp alone was not enough: three of these rooms have a
    # bright wall or a window exactly where the type sits, and the supporting
    # line disappeared into it. A ramp strong enough to fix that darkened the
    # whole photograph, which was the complaint in the first place. A local
    # panel fixes legibility where it is needed and leaves the room alone.
    block_h = 26 + 46 + len(head_lines) * 66 + 14 + len(body_lines) * 34 + 26 + 62
    m = round(W * 0.022)
    panel = Image.new("L", img.size, 0)
    ImageDraw.Draw(panel).rounded_rectangle(
        [x - m, y0 - m, x + col + m, y0 + block_h + m],
        radius=round(W * 0.012), fill=150)
    panel = panel.filter(ImageFilter.GaussianBlur(round(W * 0.016)))
    img = Image.composite(Image.new("RGB", img.size, (8, 9, 12)), img, panel)
    d = ImageDraw.Draw(img)

    y = y0
    d.rectangle([x, y, x + round(W * 0.035), y + 4], fill=accent)
    y += 26
    text(d, (x, y), kicker.upper(), font("Manrope", 21, 600), MUTED, tracking=6)
    y += 46

    for line in head_lines:
        text(d, (x, y), line, f_head, INK, tracking=-1)
        y += 66
    y += 14

    for line in body_lines:
        text(d, (x, y), line, f_body, BODY)
        y += 34
    y += 26

    # The figures, in a row. Value in the accent, unit under it -- the same
    # reading order the stat rows on the page itself use.
    fx = x
    for val, unit in figs:
        w = text(d, (fx, y), val, font("Outfit", 40, 700), accent)
        text(d, (fx, y + 46), unit.upper(), font("Manrope", 16, 600), MUTED, tracking=3)
        fx += max(w, 40) + round(W * 0.035)

    out = OUT / f"{name}-band.webp"
    img.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:24s} {img.size}  {out.stat().st_size // 1024:>4}KB")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in BANDS.items():
        if only and name not in only:
            continue
        band(name, **cfg)

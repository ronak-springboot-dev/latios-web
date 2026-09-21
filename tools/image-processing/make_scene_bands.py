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

    # Sizes are FRACTIONS of the canvas, so the type holds its proportion
    # whatever the scene is rendered at. The first pass used fixed points
    # and a 60px headline on a 2000px canvas came out at 27px on the page:
    # readable, but not something that commands the frame the way the
    # reference posters do.
    u = W / 2000.0
    col = round(W * 0.46)                      # the type column
    pad = round(W * 0.055)
    x = pad if side == "left" else W - col - pad
    y0 = round(H * 0.155)

    f_head = font("Outfit", round(94 * u), 800)
    f_body = font("Manrope", round(29 * u), 400)
    f_fig = font("Outfit", round(56 * u), 700)
    head_lines = head.splitlines()
    body_lines = wrap(d, body, f_body, col)

    # Measure the block, then lay a soft panel under it BEFORE drawing a single
    # character. The side ramp alone was not enough: three of these rooms have a
    # bright wall or a window exactly where the type sits, and the supporting
    # line disappeared into it. A ramp strong enough to fix that darkened the
    # whole photograph, which was the complaint in the first place. A local
    # panel fixes legibility where it is needed and leaves the room alone.
    lh_head, lh_body = round(102 * u), round(42 * u)
    block_h = (round(34 * u) + round(58 * u) + len(head_lines) * lh_head
               + round(18 * u) + len(body_lines) * lh_body + round(34 * u)
               + round(86 * u))
    # The panel is sized to the CONTENT, not to the column. `col` is the wrap
    # measure for the body; the headline is hand-broken and obeys no such
    # limit, and mt-control's "deployed everywhere." is 980px against a 920px
    # column -- so its last word sat off the end of the panel, on bare glass,
    # and ran past the page margin as well. Measure every line that will be
    # drawn and let the block be as wide as it needs to be.
    fig_w = sum(max(d.textlength(v, font=f_fig), 40 * u) + round(W * 0.038)
                for v, _ in figs) - round(W * 0.038)
    content_w = max([d.textlength(l, font=f_head) for l in head_lines]
                    + [d.textlength(l, font=f_body) for l in body_lines]
                    + [fig_w, col * 0.72])
    content_w = min(content_w, W - 2 * pad)
    # Re-anchor a right-hand block so a wide headline grows into the frame
    # rather than off the edge of it.
    if side == "right":
        x = W - pad - round(content_w)

    m = round(W * 0.022)

    # And the panel's opacity is MEASURED, not fixed. A single value cannot
    # serve six rooms: under the type block these scenes run from a mean
    # luminance of 86 (mt-office, a dim corner) to 157 (sff-desk, a white wall
    # beside a window). A fill tuned for the dark end let the supporting line on
    # the two bright rooms sit at barely any contrast; one tuned for the bright
    # end would print a black slab across the dark ones.
    #
    # So measure what the type will actually land on -- after the side ramp,
    # which itself decays fast and leaves the far end of the column almost
    # untouched -- and solve for the fill that brings it down to TARGET:
    #
    #     out = L*(1-a) + 9*a   =>   a = (L - TARGET) / (L - 9)
    #
    # against p85 rather than the mean, so a bright streak through the block
    # (a lamp arm, a window reveal) is covered rather than averaged away.
    TARGET = 58
    reg = img.crop((max(0, x - m), max(0, y0 - m),
                    min(W, x + round(content_w) + m),
                    min(H, y0 + block_h + m))).convert("L")
    lum = sorted(reg.getdata())[int(len(reg.getdata()) * 0.85)]
    a = 0.0 if lum <= TARGET else (lum - TARGET) / max(1.0, lum - 9.0)
    fill = int(round(min(0.80, max(0.42, a)) * 255))

    panel = Image.new("L", img.size, 0)
    ImageDraw.Draw(panel).rounded_rectangle(
        [x - m, y0 - m, x + round(content_w) + m, y0 + block_h + m],
        radius=round(W * 0.012), fill=fill)
    panel = panel.filter(ImageFilter.GaussianBlur(round(W * 0.016)))
    img = Image.composite(Image.new("RGB", img.size, (8, 9, 12)), img, panel)
    d = ImageDraw.Draw(img)

    y = y0
    d.rectangle([x, y, x + round(W * 0.042), y + round(5 * u)], fill=accent)
    y += round(34 * u)
    text(d, (x, y), kicker.upper(), font("Manrope", round(26 * u), 600), MUTED,
         tracking=round(8 * u))
    y += round(58 * u)

    for line in head_lines:
        text(d, (x, y), line, f_head, INK, tracking=round(-2 * u))
        y += lh_head
    y += round(18 * u)

    for line in body_lines:
        text(d, (x, y), line, f_body, BODY)
        y += lh_body
    y += round(34 * u)

    # The figures, in a row. Value in the accent, unit under it -- the same
    # reading order the stat rows on the page itself use.
    fx = x
    for val, unit in figs:
        w = text(d, (fx, y), val, f_fig, accent)
        text(d, (fx, y + round(64 * u)), unit.upper(),
             font("Manrope", round(20 * u), 600), MUTED, tracking=round(4 * u))
        fx += max(w, 40 * u) + round(W * 0.038)

    out = OUT / f"{name}-band.webp"
    img.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:24s} {img.size}  {out.stat().st_size // 1024:>4}KB"
          f"  p85 {lum:>3} -> panel {fill}")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in BANDS.items():
        if only and name not in only:
            continue
        band(name, **cfg)

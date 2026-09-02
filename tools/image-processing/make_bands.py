"""
Composed marketing bands: rendered artwork with the typography baked in.

Modelled on the image-plus-typography bands on minisforum.com/products/ms-02-ultra,
which are 1200px-wide near-square and portrait PNGs with the headline, the hero
number and the supporting copy composited into the picture itself.

The one rule that matters here: THE TYPE IS SET, NEVER GENERATED. The diffusion
model cannot spell - it has produced "Lohxs", "Lobos", "DDR2V" and "DDR5 ECC" in
this project alone. So the model renders artwork only, under a no-text negative
prompt, and every character you can read is drawn afterwards by PIL from the
vendored Outfit and Manrope variable fonts. "Baked" means composited
deterministically, not left to a sampler.

Every string comes from band_data.json, exported straight out of models.js by
tools/export_band_data.mjs, so a band cannot drift away from the spec table
below it on the page. The three hero numbers are the model's own three stats.

    node tools/export_band_data.mjs      # refresh the data first
    python make_bands.py                 # every tower
    python make_bands.py mt-amd-am4      # one
    python make_bands.py --compose-only  # re-typeset, skip the GPU
"""
import json
import sys
import textwrap
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).parent
GEN = HERE / "generated"
ART = GEN / "bands-art"
OUT = GEN / "bands"
FONTS = HERE / "fonts"
DATA = GEN / "band_data.json"

# Matching the reference: near-square and portrait, both 1200 wide.
SQUARE = (1200, 1163)
PORTRAIT = (1200, 1523)

# The 15 towers. The other 13 products have no photography beyond catalogue
# thumbnails and no interior renders, so band art for them would be invention
# rather than depiction; they keep their walkthrough treatment instead.
TOWERS = [
    "mt-amd-am4", "mt-h610-ddr4", "mt-h610-ddr5", "mt-pro-h610-ddr5",
    "mt-q670-ddr5", "mt-am5-pro-ai", "sff-h610-ddr5", "sff-am5-pro-ai",
    "sff-b860-pro-ai", "sff-h810-pro-ai", "mff-dp10", "promax-q870",
    "promax-t2-w880", "promax-t2-w680", "promax-t4-plus",
]

NO_TEXT = "no text, no lettering, no logos, no brand marks, no watermark. "
BACKDROP = ("Studio product photograph on a seamless near-black background, "
            "dramatic raking light from the upper left, shallow depth of field, "
            "crisp macro detail, no background clutter. ")

# What a band is ABOUT, so the artwork illustrates the words beside it. Keyed on
# the FEATURE's kicker, which models.js already sets to exactly this vocabulary
# ("Processor", "Memory", "Thermal", "Serviceability", ...). Keying on the stat
# label instead was unreliable - the labels are terse fragments that collide.
SUBJECTS = [
    ("power",   ("power", "psu"), "a modular ATX power supply unit, braided black cables fanned out"),
    ("memory",  ("memory",), "a pair of memory modules standing upright in their slots, gold contacts catching the light"),
    ("chassis", ("design", "size", "build", "chassis"), "a black computer chassis shell at a steep three-quarter angle, brushed metal surface and machined edges"),
    # The NPU and the chipset used to share the processor's subject, which put
    # two near-identical gold packages on the same page for three models. They
    # are different pieces of silicon and get different pictures.
    ("npu",     ("ai", "npu"), "a processor die close-up with its heat spreader removed, showing the tiled compute blocks on the silicon"),
    ("io",      ("networking", "connectivity", "ports", "i/o"), "a row of network and USB ports on a dark rear panel, precisely machined cutouts"),
    ("gpu",     ("graphics",), "a long professional graphics card with a matte black shroud and twin fans"),
    ("chipset", ("chipset",), "a low flat chipset heatsink screwed to a dark motherboard, fine parallel fins, macro detail"),
    ("cpu",     ("processor", "cpu"), "a bare CPU package resting on a dark circuit board, gold contact grid catching the light"),
    ("cooling", ("thermal", "cooling"), "a tower heatsink with dense aluminium fins and copper heatpipes, macro detail"),
    ("storage", ("storage", "drive"), "four M.2 NVMe drives with slim black heatsinks fanned out in a row"),
    # "lifted away by hand" put a hand in the frame, overriding the shared
    # negative that excludes people. The panel alone says the same thing.
    ("service", ("serviceability", "service"), "a black chassis side panel standing on edge, captive thumbscrews along one side"),
    ("security", ("security",), "a small dark security module on a circuit board, surrounded by fine traces"),
    ("io",      ("display", "monitor"), "three video output connectors on a dark rear panel, macro detail"),
]
DEFAULT = ("board", "a dark motherboard surface in raking light, heatsink fins and "
                    "capacitors in macro detail")


def subject(band):
    """
    (category, description) for a band.

    Matched on the KICKER first. Matching the heading too let "Radeon graphics
    on the die" — a Processor feature on a machine that ships no discrete card —
    select the graphics-card subject, which would have put a GPU on the page of
    a product that does not have one. The kicker is the curated category, so it
    is the reliable signal; the heading is only a fallback.
    """
    kick = band["kicker"].lower()
    for cat, words, desc in SUBJECTS:
        if any(w in kick for w in words):
            return cat, desc
    head = band["heading"].lower()
    for cat, words, desc in SUBJECTS:
        if any(w in head for w in words):
            return cat, desc
    return DEFAULT


# Physical differences the model can actually depict, and the subject category
# each one is allowed to modify. Deliberately not brand names: a diffusion model
# renders a wordmark as garbage at these sizes, and putting a real vendor's logo
# on generated hardware would be a lie anyway. These describe form only —
# module height, bank count, connector count.
SPECIFICS = [
    ("memory",  "so-dimm", "they are small laptop SO-DIMMs lying flat"),
    ("memory",  "ecc", "they are full-height server modules with extra chips per rank"),
    ("memory",  "ddr4", "they are low-profile with plain flat heatspreaders"),
    ("memory",  "ddr5", "they are tall with sculpted angular heatspreaders"),
    ("memory",  "8x dimm", "there are eight of them in two banks of four"),
    ("memory",  "4x ddr", "there are four of them in a row"),
    ("cooling", "liquid", "it is a closed-loop block with two braided tubes"),
    ("power",   "redundant", "there are two identical supply modules side by side"),
    ("io",      "thunderbolt", "two USB-C ports sit beside the larger network jacks"),
    ("io",      "2.5g", "two identical network jacks sit side by side"),
    ("cpu",     "xeon", "the package is unusually large and rectangular"),
    ("cpu",     "ryzen", "the package is square with a dense pin grid"),
    ("npu",     "ryzen", "the die is a single square block of compute tiles"),
    ("npu",     "intel", "the die is split into separate tiles of different sizes"),
]


def specifics(d, band, cat):
    """
    What makes THIS product's version of the subject look different.

    Without this, fifteen towers would get fifteen renders of the same generic
    DIMM pair — the repetition this whole exercise exists to remove. Drawn from
    the model's own copy so it tracks the spec, and scoped to the subject's
    category so a memory detail cannot end up describing a chassis panel.
    """
    hay = f"{band['heading']} {band['body']} {' '.join(d.get('highlights', []))}".lower()
    hits = [desc for c, token, desc in SPECIFICS if c == cat and token in hay]
    return (" " + "; ".join(hits[:2]) + ".") if hits else ""


# Subjects that are wrong for a small chassis. A tower cooler physically cannot
# fit an 8-litre SFF or a 1.1-litre mini PC, so showing one beside that product's
# thermal copy would misrepresent the machine.
SMALL_CHASSIS = {
    "cooling": "a low-profile cooler only a few centimetres tall, a flat copper "
               "base with a wide shallow fin stack and a slim fan",
}


def art_prompt(d, band):
    cat, desc = subject(band)
    name = d.get("name", "")
    if cat in SMALL_CHASSIS and (" SFF" in name or " MFF" in name):
        desc = SMALL_CHASSIS[cat]
    return f"{BACKDROP}The subject is {desc}.{specifics(d, band, cat)} {NO_TEXT}"


# --- typography ------------------------------------------------------------

def font(name, size, weight):
    f = ImageFont.truetype(str(FONTS / f"{name}.ttf"), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass          # static fallback; the face still renders at its default
    return f


SHADOW = (7, 8, 10)


def text(draw, xy, s, f, fill, tracking=0, shadow=3):
    """
    Draw a line, optionally letter-spaced. PIL has no tracking of its own.

    Everything is drawn twice, dark copy first. The scrim alone could not carry
    legibility over bright artwork - the DDR4 band's supporting line sat on a lit
    memory module - and the reader cannot restyle type that is baked into a
    picture. On dark artwork the shadow is invisible, so it costs nothing.
    """
    def _draw(fill_, dx=0, dy=0):
        if not tracking:
            draw.text((xy[0] + dx, xy[1] + dy), s, font=f, fill=fill_)
            return
        x = xy[0] + dx
        for ch in s:
            draw.text((x, xy[1] + dy), ch, font=f, fill=fill_)
            x += draw.textlength(ch, font=f) + tracking

    if shadow:
        _draw(SHADOW, shadow, shadow)
    _draw(fill)
    if not tracking:
        return draw.textlength(s, font=f)
    return sum(draw.textlength(c, font=f) + tracking for c in s)


def wrap(draw, s, f, width):
    """Greedy wrap to a pixel width."""
    words, lines, cur = s.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= width or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def scrim(img, side, strength=235):
    """A gradient wash so set type stays readable over photography."""
    w, h = img.size
    g = Image.new("L", (1, h) if side in ("bottom", "top") else (w, 1))
    px = g.load()
    n = h if side in ("bottom", "top") else w
    for i in range(n):
        t = i / max(1, n - 1)
        if side == "bottom":
            v = t ** 1.7
        elif side == "top":
            v = (1 - t) ** 1.7
        elif side == "right":
            v = t ** 1.5
        else:
            v = (1 - t) ** 1.5
        if side in ("bottom", "top"):
            px[0, i] = int(v * strength)
        else:
            px[i, 0] = int(v * strength)
    g = g.resize((w, h))
    dark = Image.new("RGB", (w, h), (6, 7, 9))
    return Image.composite(dark, img, g)


STOP = {"the", "and", "for", "with", "up", "to", "of", "a", "an", "max", "in", "on"}


def _words(s):
    return {w.strip("·,()×\"'").lower() for w in s.split()} - STOP


def _sentence(s, limit=150):
    """First sentence of a paragraph, so the band carries a thought not an essay."""
    for i, ch in enumerate(s):
        if ch == "." and i > 40:
            return s[:i + 1]
    return s if len(s) <= limit else s[:limit].rsplit(" ", 1)[0] + "..."


def _stem(w):
    """Crude singularise, so 'displays' matches 'display' and 'cores' 'core'."""
    return w[:-1] if len(w) > 4 and w.endswith("s") and not w.endswith("ss") else w


def _tokens(s):
    return {_stem(w) for w in _words(s) if len(w) > 2}


def bands(d, n=3):
    """
    Build the band content: one band per FEATURE, with a stat attached only
    where it genuinely belongs.

    The first attempt at this ran the other way - one band per stat, headline
    chosen by word overlap - and it read badly. stats are terse fragments
    ("18 L", "80+ Bronze PSU") that share incidental words with the wrong
    feature, so a band about chassis volume ended up headlined "Room for an
    RTX A4000". Features are curated prose with their own kicker, heading and
    paragraph, so driving from them gives every band something true to say.

    A hero number is shown only when a stat's LABEL shares a real word with the
    feature - matching on the value would let "500W" chase any stray "w". When
    nothing matches, the band simply carries no number, which is how a good half
    of the reference's own bands are laid out anyway.
    """
    feats = [f for f in (d.get("features") or []) if f.get("heading")]
    if not feats:
        feats = [{"kicker": d["kicker"], "heading": h, "body": d["tag"]}
                 for h in d["highlights"]]

    used, out = set(), []
    for f in feats[:n]:
        ftok = _tokens(f"{f['kicker']} {f['heading']}")
        best, best_hit = None, 0
        for i, (value, label) in enumerate(d["stats"]):
            if i in used:
                continue
            hit = len(ftok & _tokens(label))
            if hit > best_hit:
                best, best_hit = i, hit
        if best is not None:
            used.add(best)
        value, label = d["stats"][best] if best is not None else ("", "")
        out.append({"kicker": f["kicker"] or d["kicker"],
                    "heading": f["heading"],
                    "body": _sentence(f["body"]),
                    "value": value, "label": label})
    return out


def _needs(img, col, top, anchor, W, H):
    """Mean luminance where the type will sit, 0-255."""
    y0 = top if anchor == "top" else max(0, top - 520)
    y1 = min(H, y0 + 520)
    a = np.asarray(img.convert("L"), dtype=np.float32)[y0:y1, col:W]
    return float(a.mean()) if a.size else 0.0


def compose(art, d, b, layout, size):
    """Lay one band out. Three layouts so a model's three bands differ."""
    W, H = size
    value, label, kicker, head, body = (b["value"], b["label"], b["kicker"],
                                        b["heading"], b["body"])
    accent = d["accent"]

    # Place the artwork so the type gets its own clear space, rather than
    # cover-cropping and then fighting the result with a darker scrim.
    #
    # Cover-cropping a square render into these formats leaves ~37px of slack,
    # so the subject filled the frame and the 26px supporting line ended up on
    # lit metal however hard the scrim was pushed. Scaling the subject to about
    # two-thirds of the height and anchoring it away from the copy is what the
    # reference bands actually do, and the renders are already on a near-black
    # ground so they sit on the band's ground seamlessly.
    a = art.convert("RGB")
    top_anchored = layout != "corner"
    frac = 0.68 if size == PORTRAIT else 0.74
    s = min(W / a.width, (H * frac) / a.height)
    a = a.resize((max(1, round(a.width * s)), max(1, round(a.height * s))), Image.LANCZOS)

    # Ground taken from the render's own corners, and the join feathered. A fixed
    # (6,7,9) ground left a visible rectangle where the plate met it, because the
    # renders' backdrops are close to but not exactly that black.
    corners = np.asarray(a.convert("RGB"), dtype=np.float32)
    edge = np.concatenate([corners[:24, :24].reshape(-1, 3),
                           corners[:24, -24:].reshape(-1, 3),
                           corners[-24:, :24].reshape(-1, 3),
                           corners[-24:, -24:].reshape(-1, 3)])
    ground = tuple(int(v) for v in np.median(edge, axis=0))

    plate = Image.new("RGB", (W, H), ground)
    x = (W - a.width) // 2
    y = (H - a.height) if top_anchored else 0
    feather = max(8, int(min(a.width, a.height) * 0.05))
    mask = Image.new("L", a.size, 0)
    ImageDraw.Draw(mask).rectangle(
        (feather, feather, a.width - feather, a.height - feather), fill=255)
    plate.paste(a, (x, y), mask.filter(ImageFilter.GaussianBlur(feather * 0.6)))
    a = plate

    pad = 84
    side, col, top, anchor = (("bottom", pad, H - pad, "bottom") if layout == "corner"
                              else ("top", pad, pad, "top") if layout == "topline"
                              else ("right", W // 2 + 20, pad, "top"))

    # The scrim adapts to what is actually behind the type. A fixed strength was
    # fine over dark artwork and failed over bright: the DDR4 band's supporting
    # line sat on a lit memory module and could barely be read. Baked type cannot
    # be re-styled by the reader, so legibility has to be settled here.
    lum = _needs(a, col, top, anchor, W, H)
    strength = int(min(253, 220 + max(0.0, lum - 30) * 1.35))
    img = scrim(a, side, strength)

    dr = ImageDraw.Draw(img)
    tw = W - col - pad

    f_kick = font("Manrope", 21, 600)
    f_head = font("Outfit", 52, 630)          # the reference's restrained scale
    f_num = font("Outfit", 128, 800)
    f_lab = font("Manrope", 25, 500)
    f_body = font("Manrope", 26, 400)

    head_lines = wrap(dr, head, f_head, tw) if head else []
    body_lines = wrap(dr, body, f_body, tw)[:2]

    RULE, KICK, NUM, LAB, HEAD, BODY = 26, 46, 152, 54, 64, 38
    # A band with no matching stat carries no number, so it must not reserve the
    # space for one - otherwise the block floats with a hole in it.
    num_h = (NUM + LAB) if value else 0
    block = RULE + KICK + num_h + len(head_lines) * HEAD + 12 + len(body_lines) * BODY
    y = top if anchor == "top" else top - block

    # hairline rule in the accent - the reference's one piece of ornament. Sits
    # above the kicker with its own band of space; drawn at the same y it used to
    # be struck straight through the first word.
    dr.rectangle([col, y, col + 54, y + 3], fill=accent)
    y += RULE

    text(dr, (col, y), kicker.upper(), f_kick, accent, tracking=2.6)
    y += KICK
    if value:
        text(dr, (col, y), value, f_num, accent)
        y += NUM
        text(dr, (col, y), label.upper(), f_lab, "#a7aeb6", tracking=1.8)
        y += LAB
    for ln in head_lines:
        text(dr, (col, y), ln, f_head, "#f2f4f6")
        y += HEAD
    y += 12
    for ln in body_lines:
        text(dr, (col, y), ln, f_body, "#d6dbe0")
        y += BODY
    return img


LAYOUTS = ["corner", "topline", "side"]


def build(slug, data, compose_only=False):
    d = data.get(slug)
    if not d:
        print(f"  {slug}: no band data - run tools/export_band_data.mjs")
        return []
    ART.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    made = []
    for i, b in enumerate(bands(d)):
        art_p = ART / f"{slug}-{i}.png"
        if not art_p.exists():
            if compose_only:
                print(f"  {slug}-{i}: no artwork yet, skipped")
                continue
            import gen_components
            print(f"  {slug}-{i}: rendering artwork ({b['kicker']}) ...", flush=True)
            # no 4x upscale: bands composite at 1200px, so it would be thrown away
            got = gen_components.render(f"band-{slug}-{i}", art_prompt(d, b),
                                       upscale=False)
            Image.open(got).convert("RGB").save(art_p)
        size = PORTRAIT if i == 1 else SQUARE
        img = compose(Image.open(art_p), d, b, LAYOUTS[i % 3], size)
        p = OUT / f"{slug}-{i}.webp"
        img.save(p, "WEBP", quality=88, method=5)
        alt = f"{d['name']} - {b['heading']}"
        made.append({"src": f"/bands/{slug}-{i}.webp",
                     "w": size[0], "h": size[1], "alt": alt})
        print(f"  {slug}-{i}  {size[0]}x{size[1]}  {p.stat().st_size // 1024} KB  "
              f"[{LAYOUTS[i % 3]:8s}] {b['kicker']:15s} {b['value'] or '-'}")
    return made


if __name__ == "__main__":
    data = json.loads(DATA.read_text(encoding="utf-8"))
    names = [a for a in sys.argv[1:] if not a.startswith("--")] or TOWERS
    manifest = {}
    for n in names:
        m = build(n, data, "--compose-only" in sys.argv)
        if m:
            manifest[n] = m
    if manifest:
        (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

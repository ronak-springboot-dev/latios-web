"""Turn the platform art into a looping band, with the vendor name SET on it.

gen_platform.py produces particle fields and light ribbons and nothing else --
no mark, no product, no letterform. This is the half that makes it a banner:

  * the vendor name set from the vendored Outfit face, the way make_bands.py
    sets every readable character in this project, because
    brand_composite.py's rule applies harder to somebody else's trademark than
    to our own -- "the image model cannot render the wordmark reliably... so we
    never ask it to";
  * motion, so it sits beside the eleven product loops rather than beside the
    stills. A slow parallax push on the particle field with a light sweep
    travelling across it, BOUNCED -- played forward then in reverse -- so the
    last frame is the first and the loop has no cut. build_h3_videos.py uses
    the same trick and says why.

Encoded through motion/encode.py:writer at HERO and the house bitrate, so
ProductVideo cannot tell this apart from a product loop: same container, same
profile, same 6 Mbps.

THE TYPE IS COMPOSITED ONCE, onto the still, and then the whole frame moves
together. Drawing it per frame would let it swim against the parallax by a
pixel or two, which on a wordmark reads as a wobble.

    python make_platform_band.py            # both
    python make_platform_band.py amd
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from make_bands import font, text
from motion.encode import HERO, FPS, writer, probe

HERE = Path(__file__).parent
SRC = HERE / "generated" / "platform"
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public"

SECONDS = 4.0                 # forward; bounced to 8s of playback
PUSH = 0.06                   # how far the parallax travels, as a fraction
INK = (247, 247, 249)
MUTED = (168, 172, 180)

def side_ramp(img, strength=200, power=2.2):
    """A one-sided wash that decays fast, so only the type side darkens.

    This lived in make_scene_bands.py until the split-poster layout gave the
    type a field of its own and made it unnecessary there. It is needed here for
    the reason it was written: the type is ON the picture, and make_bands.scrim
    ramps as t**1.5, which only reaches zero at the opposite edge and leaves the
    whole frame muddy. A steeper power puts the density under the words and lets
    the art keep its light.
    """
    w, h = img.size
    g = Image.new("L", (w, 1))
    px = g.load()
    for i in range(w):
        px[i, 0] = int(((1 - i / max(1, w - 1)) ** power) * strength)
    dark = Image.new("RGB", (w, h), (4, 5, 7))
    return Image.composite(dark, img, g.resize((w, h)))


#: vendor -> the words, and the accent the figures take. The names are SET, and
#: the (R) and (TM) are part of the mark, not decoration.
BANDS = {
    "amd": dict(
        kicker="The platform",
        head="AMD Ryzen™",
        body="Ryzen processors with Radeon™ graphics on the die.",
        accent=(232, 176, 84)),
    "intel": dict(
        kicker="The platform",
        head="Intel® Core™",
        body="Twelfth to fourteenth generation Core, and Core Ultra.",
        accent=(122, 178, 240)),
}


def plate(name, cfg):
    """The still: art cropped to 16:9 with the type set into its left third."""
    src = SRC / f"{name}.png"
    if not src.exists():
        raise SystemExit(f"no art at {src} - run gen_platform.py first")
    img = Image.open(src).convert("RGB")

    # Crop to 16:9 first, then oversize by PUSH so the parallax has somewhere to
    # travel without ever exposing an edge.
    W, H = HERO
    cw = min(img.width, round(img.height * W / H))
    img = img.crop(((img.width - cw) // 2, 0, (img.width - cw) // 2 + cw, img.height))
    big = (round(W * (1 + PUSH)), round(H * (1 + PUSH)))
    img = img.resize(big, Image.LANCZOS)

    # The type sits on the left, and the art sweeps a bright cyan ribbon and a
    # gold particle stream straight through it -- the supporting line was
    # sitting on the ribbon at almost no contrast. Same fix as the scene bands:
    # a one-sided ramp that decays fast, so the type side darkens and the far
    # side keeps the light that makes the picture worth having.
    img = side_ramp(img)

    d = ImageDraw.Draw(img)
    u = big[0] / 1920.0
    x, y = round(big[0] * 0.075), round(big[1] * 0.36)
    d.rectangle([x, y, x + round(56 * u), y + round(5 * u)], fill=cfg["accent"])
    y += round(38 * u)
    text(d, (x, y), cfg["kicker"].upper(), font("Manrope", round(24 * u), 600),
         MUTED, tracking=round(8 * u))
    y += round(56 * u)
    text(d, (x, y), cfg["head"], font("Outfit", round(96 * u), 800), INK,
         tracking=round(-2 * u))
    y += round(118 * u)
    text(d, (x, y), cfg["body"], font("Manrope", round(28 * u), 400), MUTED)
    return img


def band(name, cfg):
    still = plate(name, cfg)
    W, H = HERO
    big = still.size
    span_x, span_y = big[0] - W, big[1] - H
    frames = int(SECONDS * FPS)

    out_mp4 = PUBLIC / "videos" / f"platform-{name}.mp4"
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    enc = writer(out_mp4, HERO)

    made = []
    for f in range(frames):
        # Ease in and out so the drift never starts or stops abruptly; the
        # bounce then joins two eased ends, which is what makes the seam
        # invisible rather than merely continuous.
        t = f / max(1, frames - 1)
        e = t * t * (3 - 2 * t)
        ox, oy = round(span_x * e), round(span_y * e * 0.5)
        fr = still.crop((ox, oy, ox + W, oy + H))

        # A soft light sweep travelling with the drift, masked to nothing at the
        # frame edges so it reads as light moving through the field rather than
        # as a band crossing the picture.
        xx = np.linspace(0, 1, W, dtype=np.float32)[None, :]
        centre = -0.25 + 1.5 * e
        # clip before the root: sin(pi) lands at -1e-16 in floating point, and
        # a negative to the power 0.5 is NaN, which survives the add and then
        # casts to garbage in the edge columns of every frame.
        edge = np.clip(np.sin(np.pi * xx), 0.0, 1.0) ** 0.5
        glow = np.exp(-0.5 * ((xx - centre) / 0.16) ** 2) * edge
        a = np.asarray(fr, np.float32)
        a += np.array(cfg["accent"], np.float32) * (0.16 * glow)[..., None]
        made.append(np.clip(a, 0, 255).astype(np.uint8))

    # Forward, then its own reverse minus the shared end frames: a true bounce,
    # so frame 0 follows the last frame with no jump.
    for fr in made + made[-2:0:-1]:
        enc.stdin.write(fr.tobytes())
    enc.stdin.close()
    enc.wait()

    poster = PUBLIC / "images" / "posters" / f"platform-{name}.webp"
    poster.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(made[0]).save(poster, "WEBP", quality=88, method=6)

    info = probe(out_mp4)
    print(f"  {out_mp4.name:24s} {info['resolution']}  {info['seconds']:.1f}s  "
          f"{info['mbps']} Mbps  {info['kb']}KB")
    print(f"  {poster.name:24s} {Image.open(poster).size}  "
          f"{poster.stat().st_size // 1024}KB")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in BANDS.items():
        if only and name not in only:
            continue
        band(name, cfg)

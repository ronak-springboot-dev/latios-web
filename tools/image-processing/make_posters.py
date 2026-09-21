"""Partner and range posters, built the way make_bands.py builds bands.

THE TYPE IS SET, NEVER GENERATED, and neither is a logo. make_bands.py already
records why for the type -- "it has produced 'Lohxs', 'Lobos', 'DDR2V' and
'DDR5 ECC' in this project alone" -- and brand_composite.py records it for the
marks: "The image model cannot render the wordmark reliably... So we never ask
it to." A garbled AMD arrow or a wrong NVIDIA eye on a partner poster is worse
than no mark at all, so every readable character here is drawn by PIL from the
vendored Outfit and Manrope faces, and every logo is a real file composited in.

What that allows, and what it does not:

  Latios wordmark   images/latios-wordmark-reversed.png -- a real asset, both
                    polarities available. Composited.
  Intel + AMD       images/Group-29.png, the supplied "Powered by" lockup. It
                    is 764x68, so it CANNOT be scaled into a poster headline.
                    It sits in the footer strip at close to native size, which
                    is what a lockup that small is for.
  NVIDIA            no asset exists anywhere in this repo, and the site has
                    never claimed an NVIDIA partnership. Set type only, which
                    is exactly what Header.jsx already decided: "Word marks
                    rather than the AMD and Intel logos: reproducing a
                    partner's artwork is governed by their brand guidelines and
                    needs files from their partner kit."

The subject artwork is not generated either. The silicon posters reuse the
existing banner photographs, whose vendor marks are PHOTOGRAPHED ones that
survived a 0.22-denoise relight -- the provenance commit 4dac95f records that
at 0.45 "Intel came back as gibberish". The range poster reuses the staged
chassis cards, which are real photographs on a drawn ground.

Copy says "Technology Partners", the wording AboutPage.jsx uses. Nothing here
claims to be an official or authorised partner, because nothing in the
codebase does.

    python make_posters.py            # all
    python make_posters.py intel
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

import brand_composite as bc
from make_bands import font, text, wrap, scrim

HERE = Path(__file__).parent
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
OUT = PUBLIC / "posters"

SIZE = (1600, 2000)          # portrait, 4:5
INK = (245, 245, 247)
MUTED = (150, 152, 158)

#: Each poster: the artwork it stands on, how it is cropped, the accent, and
#: the words. `mark` is a set-type word mark -- never artwork.
POSTERS = {
    "poster-latios-range": dict(
        art="banner/banner-latios-tower.webp", accent=(111, 147, 242),
        kicker="The range", mark="Latios",
        head="Twenty-eight machines,\none service procedure.",
        body="Desktops, workstations, laptops, audio-visual and display — "
             "designed, assembled and supported in Ahmedabad.",
        foot="latios.in/machines", wordmark=True),
    "poster-intel": dict(
        art="banner/banner-intel-cpu.webp", accent=(0, 120, 212),
        kicker="Technology partner", mark="Intel® Core™",
        head="Twelfth through\nfourteenth generation.",
        body="Core i9 to Core i3 on one socket, and Core Ultra with an NPU on "
             "the package. Specified across the range.",
        foot="Intel® and Intel® Core™ are trademarks of Intel Corporation.",
        lockup=True),
    "poster-amd": dict(
        art="banner/banner-amd-cpu.webp", accent=(43, 153, 105),
        kicker="Technology partner", mark="AMD Ryzen™",
        head="Eight cores, and the\ngraphics on the same die.",
        body="Ryzen 5000G and 8000G with Radeon graphics built in, and Ryzen AI "
             "on the AM5 platform.",
        foot="AMD, Ryzen™ and Radeon™ are trademarks of Advanced Micro Devices, Inc.",
        lockup=True),
    "poster-nvidia": dict(
        art="banner/banner-nvidia-gpu.webp", accent=(118, 185, 0),
        kicker="Professional graphics", mark="NVIDIA® RTX™",
        head="Certified drivers,\nwhere the desk needs them.",
        body="RTX A-series professional cards across the tower and workstation "
             "range, full height or low profile.",
        foot="NVIDIA® and RTX™ are trademarks of NVIDIA Corporation."),
}


def _art(name, size):
    """Cover-crop the source artwork to the poster, top-weighted."""
    im = Image.open(PUBLIC / name).convert("RGB")
    W, H = size
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = (im.width - W) // 2
    # Top-weighted rather than centred: these subjects sit in the middle of a
    # 16:9 frame and a centred crop into 4:5 puts them behind the headline.
    y = min(max(0, (im.height - H) // 3), im.height - H)
    return im.crop((x, y, x + W, y + H))


def poster(name, art, accent, kicker, mark, head, body, foot,
           wordmark=False, lockup=False):
    W, H = SIZE
    img = _art(art, SIZE)

    # The type block sits on the lower half, so the lower half gets the scrim.
    # Twice: a single pass at full strength still left the supporting line
    # fighting a lit heat spreader on the Intel and AMD artwork, which is the
    # same failure make_bands records for the DDR4 band. Two passes deepen the
    # foot without flattening the subject at the top, because the ramp is
    # t**1.7 and squaring it only bites near the bottom.
    img = scrim(img, "bottom", strength=248)
    img = scrim(img, "bottom", strength=224)
    d = ImageDraw.Draw(img)

    pad = round(W * 0.085)
    y = round(H * 0.515)

    text(d, (pad, y), kicker.upper(), font("Manrope", 26, 600), MUTED, tracking=9)
    y += 58

    # The word mark, in type. Coloured to the partner's own accent so it reads
    # as a named platform rather than as a heading, and set in the site's face
    # rather than an imitation of the vendor's.
    text(d, (pad, y), mark, font("Outfit", 64, 700), accent, tracking=1)
    y += 104

    for line in head.split("\n"):
        text(d, (pad, y), line, font("Outfit", 92, 800), INK, tracking=-2)
        y += 104
    y += 22

    f_body = font("Manrope", 34, 400)
    for line in wrap(d, body, f_body, W - pad * 2):
        text(d, (pad, y), line, f_body, (198, 200, 206))
        y += 50

    text(d, (pad, round(H * 0.955)), foot, font("Manrope", 20, 400), (118, 120, 126))

    # The real assets last, because place() returns a NEW image rather than
    # mutating, so anything drawn after a composite would be drawn on a stale
    # canvas. Both use the REVERSED artwork: this ground is near-black, and the
    # supplied lockup's "Powered by", AMD wordmark and Make in India lion are
    # black ink. PartnerStrip.jsx records the same reasoning for the web page.
    if wordmark:
        mark_img = Image.open(PUBLIC / "latios-wordmark-reversed.png").convert("RGBA")
        img = bc.place(img, mark_img, cx=0.085 + 0.075, cy=0.900,
                       width_frac=0.15, opacity=0.98)
    if lockup:
        # 764x68 native. At 0.40 of a 1600px poster it lands at 640px wide --
        # under its native width, so it is never upscaled into mush.
        lock = Image.open(PUBLIC / "Group-29-reversed.png").convert("RGBA")
        img = bc.place(img, lock, cx=0.085 + 0.20, cy=0.900,
                       width_frac=0.40, opacity=0.95)
    img = img.convert("RGB")

    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{name}.webp"
    img.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:26s} {img.size}  {out.stat().st_size // 1024:>4}KB")


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for name, cfg in POSTERS.items():
        if only and not any(o in name for o in only):
            continue
        poster(name, **cfg)

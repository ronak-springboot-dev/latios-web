"""Stage the internals macros for the page, and gate them on the way.

Deliberately thin. The reference's composites bake a headline, a paragraph and
the component labels into the picture; this stages the PHOTOGRAPH ONLY and
leaves every word to HTML, because PdpBand.jsx already carries the scar tissue
for the alternative:

    "baked type is never cropped OR stretched, and 'too small to read' is the
     third way to break it"

The look the reference is admired for is in the lighting and the distance --
bright chassis interior, cool blue rake, shot close -- not in the fact that its
type is flattened into a JPEG. Keeping the type live means these plates crop to
any aspect the page wants, reflow on a phone, and stay searchable.

    python stage_internals.py
    python stage_internals.py --proof <dir>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance

HERE = Path(__file__).parent
SRC = HERE / "generated" / "internals"
OUT = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "internals"

#: 4:3, which is what a media column and a bento card both crop from without
#: losing the subject. The renders arrive square and 4x upscaled.
SIZE = (1600, 1200)

PLATES = ["memory", "storage", "cooling", "io"]


def stage(name):
    src = SRC / f"{name}.png"
    if not src.exists():
        print(f"  skip {name:10s} (not rendered)")
        return None
    im = Image.open(src).convert("RGB")

    # Centre-crop to 4:3 off the square render, then down to SIZE. The subject
    # is centred in every one of these by the prompt, so a centre crop is safe
    # -- unlike the desk scenes, where it emphatically was not.
    w, h = im.size
    ch = round(w * SIZE[1] / SIZE[0])
    im = im.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch)).resize(SIZE, Image.LANCZOS)

    # A touch of contrast and saturation: the reference's interiors read cooler
    # and more clinical than a raw diffusion render, which comes back slightly
    # flat. Small numbers on purpose -- this is a grade, not a look.
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.04)

    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"{name}.webp"
    im.save(dest, "WEBP", quality=88, method=6)
    print(f"  {dest.name:16s} {im.size}  {dest.stat().st_size // 1024:>4}KB")
    return im


if __name__ == "__main__":
    args = sys.argv[1:]
    proof = None
    if "--proof" in args:
        i = args.index("--proof")
        proof = Path(args[i + 1])
        del args[i:i + 2]

    made = [(n, stage(n)) for n in PLATES]
    made = [(n, im) for n, im in made if im]

    if proof and made:
        # At the size a bento card actually shows them, which is where a macro
        # shot either reads or turns to mush.
        W = 520
        tiles = [(n, im.resize((W, round(W * im.height / im.width)), Image.LANCZOS))
                 for n, im in made]
        th = tiles[0][1].height
        sheet = Image.new("RGB", (W * 2 + 8, (th + 22) * 2), (18, 18, 20))
        d = ImageDraw.Draw(sheet)
        for i, (n, im) in enumerate(tiles):
            x, y = (i % 2) * (W + 8), (i // 2) * (th + 22)
            sheet.paste(im, (x, y))
            d.text((x + 4, y + th + 5), n, fill=(255, 220, 0))
        sheet.save(proof / "internals-proof.png")
        print(f"  proof -> {proof / 'internals-proof.png'}")

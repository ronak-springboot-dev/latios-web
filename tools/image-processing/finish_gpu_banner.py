"""Gate and finish the professional-graphics banner.

The render came back clean on every surface the prompt named -- shroud, fan,
fin stack, backplate all unmarked -- and then put INVENTED LETTERING in two
places the prompt never mentioned: four lines of garbled silkscreen along the
PCB edge, a barcode-like strip beside the mounting screw, and a column of
invented glyphs on the display bracket. Read at 100% they are the same failure
this project already has a file of examples for:

    make_banners.py: "the lid reads LAITOS, and the palmrest carries two
    fabricated stickers aping an NVIDIA GeForce badge and an AMD Ryzen badge"

None of it is legible and none of it is a brand, so this is the mild form -- but
the gate does not have a mild form. A product page does not ship hardware with
made-up writing on it.

Re-rolling would not fix it reliably: a photorealistic PCB is a surface the
model believes has printing on it, and 'no text' is already in the negative. The
marks sit on large uniform surfaces, which is the case debadge.py was written
for, so they are patched with its own functions rather than a second render:

    interp_fill   - the PCB lines and the barcode strip, which have clean board
                    either side at the same height
    clone_patch   - the bracket column, cloned from bare bracket to its right

Nothing is generated and nothing else in the frame is touched, which is the
same contract debadge.py states for the MSI badge on the real photographs.

    python finish_gpu_banner.py
    python finish_gpu_banner.py --proof     # also write a before/after crop
"""
import sys
from pathlib import Path

from PIL import Image

from debadge import clone_patch, interp_fill

HERE = Path(__file__).parent
SRC = HERE / "generated" / "banners" / "pro-gpu.png"
OUT = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images" / "banner"
SIZE = (3200, 1800)

#: Boxes in the 6656x3712 render, read off a marked-up crop rather than guessed.
#: Each one is the tight bounds of the invented lettering, and the fill
#: functions add their own pad.
PCB_LINES = (2140, 2795, 2530, 3000)      # four lines of garbled silkscreen
PCB_STRIP = (2830, 2825, 3100, 2880)      # the barcode-like block
BRACKET = (1255, 2745, 1425, 3075)        # invented glyph column on the bracket


def finish(proof=False):
    if not SRC.exists():
        raise SystemExit(f"no render at {SRC} - run gen_gpu_banner.py first")
    im = Image.open(SRC).convert("RGB")
    before = im.crop((1100, 2650, 3450, 3150)) if proof else None

    im = interp_fill(im, PCB_LINES, sample=18, feather=10, pad=8)
    im = interp_fill(im, PCB_STRIP, sample=16, feather=8, pad=6)
    im = clone_patch(im, BRACKET, dx=200, dy=0, feather=14, pad=24)

    # 16:9 for the hero, centred. The render is 1.793 and the banner is 1.778,
    # so this takes a sliver off the sides and nothing off the card.
    w, h = im.size
    cw = round(h * SIZE[0] / SIZE[1])
    im = im.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h)).resize(SIZE, Image.LANCZOS)

    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / "banner-pro-gpu.webp"
    im.save(dest, "WEBP", quality=88, method=6)
    print(f"  {dest.name:26s} {im.size}  {dest.stat().st_size // 1024:>4}KB")

    if proof:
        after = Image.open(SRC).convert("RGB")
        after = interp_fill(after, PCB_LINES, sample=18, feather=10, pad=8)
        after = interp_fill(after, PCB_STRIP, sample=16, feather=8, pad=6)
        after = clone_patch(after, BRACKET, dx=200, dy=0, feather=14, pad=24)
        after = after.crop((1100, 2650, 3450, 3150))
        sheet = Image.new("RGB", (before.width, before.height * 2 + 8), (18, 18, 20))
        sheet.paste(before, (0, 0))
        sheet.paste(after, (0, before.height + 8))
        p = Path(sys.argv[sys.argv.index("--proof") + 1]) if len(sys.argv) > sys.argv.index("--proof") + 1 else HERE
        sheet.save(Path(p) / "gpu-debadge-proof.png")
        print(f"  proof -> {Path(p) / 'gpu-debadge-proof.png'}")


if __name__ == "__main__":
    finish(proof="--proof" in sys.argv)

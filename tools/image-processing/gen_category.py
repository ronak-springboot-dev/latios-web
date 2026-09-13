"""The Desktops category hero for the homepage accordion.

    python gen_category.py --stage     # write the staging only, to look at it
    python gen_category.py             # stage, edit, install

What it replaces: a 540x1472 phone snapshot of the tower on a factory bench,
with a cardboard box in the bottom of frame. It was also the only PORTRAIT image
among the five category heroes -- the others run 1.5 to 2.6 -- so on the mobile
cards, which crop to 16/9, it showed a thin horizontal band of chassis.

Brief, taken from its four siblings rather than from the AM4 page: they are
BRIGHT studio group shots on a pale cyclorama, not dark ones. The homepage lays
a black 30-55% scrim over each panel, so a dark hero goes to mud there. This one
is lit the same way they are.

It has to survive two very different crops from one file:

  collapsed panel   about 1:4, a narrow vertical slice of the middle
  mobile card       16/9, a wide slice of the middle

so the tower stands dead centre with air on both sides, and nothing that matters
sits near an edge.

The model's pass is a relight, not a redraw: the chassis is cut, lit and placed
here, and at denoise 0.28 the pass only makes that light photographic. The
wordmark and the port column are pasted back from the staging afterwards, so
they are the photographed pixels whatever the model did.
"""
import os
import sys
from pathlib import Path

os.environ["LATIOS_UNET"] = "2511"
sys.path.insert(0, str(Path(__file__).parent))
import am4_studio as studio  # noqa: E402
import comfy_client as cc  # noqa: E402

from PIL import Image, ImageFilter  # noqa: E402

WORK = Path(__file__).parent / "generated" / "am4"
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"

W, H = 1472, 944               # 1.559, the aspect its siblings sit at; 944 = 59x16

#: A pale cyclorama: cool grey overhead, warm paper at the floor. The tower is
#: black, so on this it reads the way the rugged laptop does in the laptops hero
#: -- a graphic dark shape with its ribbing and its edge highlights holding the
#: form. The AM4 page's dark stage would be wrong here, and would be buried by
#: the homepage's own black scrim besides.
PAPER = ((0.00, (198, 201, 208)), (0.30, (223, 224, 228)), (0.62, (240, 238, 236)),
         (1.00, (246, 241, 233)))

NEG = ("misspelt text, garbled lettering, mirrored text, distorted logo, invented "
       "branding, extra text, watermark, second device, changed chassis, visible "
       "motherboard, hands, room, furniture, cartoon, illustration, oversaturated, "
       "blue cast, blurry, dark background")

PROMPT = ("a black desktop tower computer standing centred on a seamless pale studio "
          "backdrop, soft daylight from a large softbox above, bright strip highlights "
          "down its vertical edges, a soft contact shadow and a faint reflection on the "
          "pale floor, keep the computer exactly as it is, keep the latios logo and "
          "every port exactly as they are, clean catalogue product photography, "
          "sharp focus, high key")


def stage():
    """The tower lit for a bright set, centred, with air around it."""
    from am4_chassis import front_cutout
    from gen_am4_edits import _lit_product
    # Gentler than the dark stage: a 22% top lift is what makes a black box read
    # against black, and on paper it just flattens the fascia's ribbing.
    product, _ = _lit_product(front_cutout(), None, int(H * 0.74), sheen_at=0.46)
    product = studio.light(product, sheen_at=0.46, lift=0.06, fall=0.20, sharpen=55)
    canvas, _ = studio.compose(
        product, W, H, height=0.74, floor=0.90, cx=0.5,
        ground=PAPER, halo=(236, 237, 240), halo_at=0.40,
        glow=(232, 222, 208), glow_at=70)
    return canvas


def _placed():
    """The staged product and where compose() put it -> (product, x, y)."""
    from am4_chassis import front_cutout
    from gen_am4_edits import _lit_product
    ph = int(H * 0.74)
    product, _ = _lit_product(front_cutout(), None, ph, sheen_at=0.46)
    product = studio.light(product, sheen_at=0.46, lift=0.06, fall=0.20, sharpen=55)
    return product, int(W * 0.5 - product.width / 2), int(H * 0.90) - ph


def install():
    """Model's backdrop, staged product -- pasted back inside its own alpha.

    The keep mask is the product's silhouette, eroded and feathered, so the
    model's work survives exactly where it was wanted (the paper, the shadow, the
    reflection) and nowhere it was not. Every rib, the wordmark and all nine port
    icons are therefore the photographed chassis, not a redraw of it.
    """
    product, x, y = _placed()
    ref = Image.open(WORK / "cat-desktops-ref.png").convert("RGB")
    out = Image.open(WORK / "cat-desktops.png").convert("RGB")
    if out.size != (W, H):
        out = out.resize((W, H), Image.LANCZOS)
    keep = Image.new("L", (W, H), 0)
    keep.paste(product.getchannel("A"), (x, y))
    keep = keep.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2))
    merged = Image.composite(ref, out, keep)
    merged = merged.resize((1600, round(H * 1600 / W)), Image.LANCZOS)
    dest = PUBLIC / "latios-mt.webp"
    merged.save(dest, "WEBP", quality=90, method=6)
    print(f"  {dest.name}  {merged.size}  {dest.stat().st_size // 1024}KB", flush=True)


if __name__ == "__main__":
    if "--install" in sys.argv:
        install()
        sys.exit()
    ref = WORK / "cat-desktops-ref.png"
    stage().save(ref)
    print("staged ->", ref, flush=True)
    if "--stage" in sys.argv:
        sys.exit()
    out = cc.edit(str(ref), None, PROMPT, "cat-desktops.png",
                  seed=5700, neg_extra=NEG, denoise=0.28)
    Image.open(out).save(WORK / "cat-desktops.png")
    print("edited ->", WORK / "cat-desktops.png", flush=True)
    install()

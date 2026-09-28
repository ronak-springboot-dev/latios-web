"""Platform art for the AMD and Intel bands -- energy, never a trademark.

THE BRIEF was a banner from the reference storefront: the AMD logo rendered as
a cloud of glowing particles, gold and cyan, over black. It is a good-looking
piece of art and half of it is a registered trademark.

So this generates the OTHER half. Particle fields, light ribbons and drifting
motes in each platform's colour language, with nothing in frame that could be
mistaken for a mark, a product or a word. make_platform_band.py then sets
"AMD Ryzen" or "Intel Core" onto it from the vendored Outfit face and animates
it into a loop.

The rule is the one this repo has paid for twice:

    brand_composite.py: "The image model cannot render the wordmark reliably...
    So we never ask it to."

    make_banners.py, on the deleted laptop banner: "the lid reads LAITOS, and
    the palmrest carries two fabricated stickers aping an NVIDIA GeForce badge
    and an AMD Ryzen badge."

Somebody else's mark deserves more care than our own, not less. The vendor
names are in the NEGATIVE prompt here, not the positive one.

WHAT THE PROMPT ASKS FOR is light and particles and nothing else -- no
geometry that could read as a letterform, no chip, no board, no machine. A
model given an angular shape to draw in particles will happily drift it toward
the logo it has seen ten thousand times, so it is not given one.

    python gen_platform.py              # both
    python gen_platform.py amd
    python gen_platform.py --force
"""
import os
import sys
import uuid
from pathlib import Path

import gen_components as gc

os.environ.setdefault("LATIOS_UNET", "2511")

OUT = Path(__file__).parent / "generated" / "platform"
WIDE = (1664, 928)

#: Shot as lighting, not as a subject. Every noun here is a light phenomenon --
#: field, ribbon, mote, bloom -- because those are the things that cannot
#: accidentally become a logo.
STYLE = (
    "abstract energy photograph on a pure black background, dense field of fine "
    "glowing particles suspended in space, long smooth ribbons of light sweeping "
    "through them from left to right, soft volumetric bloom, deep focus falloff "
    "into darkness at the edges, high dynamic range, cinematic, extremely fine "
    "grain, no objects of any kind, no shapes, no symbols, pure light and "
    "particles"
)

PLATFORMS = {
    # AMD's own palette: warm gold through amber, cut with a cold cyan.
    "amd": "warm gold and amber particles threaded with cold cyan and teal light "
           "ribbons, the gold dominant and the cyan cutting across it, " + STYLE,
    # Intel's: the cold blue range, lifted to near-white at the core.
    "intel": "deep blue and electric azure particles rising into near-white at "
             "the brightest cores, cool silver light ribbons drawn through them, "
             + STYLE,
}

#: The vendors by name, plus everything that has a shape. The positive prompt
#: never mentions a brand; this makes sure the model does not reach for one on
#: its own, and keeps letterforms, chips and machines out of an image whose
#: whole job is to be a background for type that is set afterwards.
NEG = gc.NEG + (
    ", amd, ryzen, radeon, intel, core, xeon, nvidia, geforce, arrow, chevron, "
    "logo, emblem, symbol, icon, letter, letterform, text, typography, numeral, "
    "circuit board, processor, chip, cpu, computer, machine, product, device, "
    "person, hands, face, "
    "flat vector, illustration, cartoon, low resolution, banding, posterisation"
)


def t2i(name, prompt):
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    g = gc.graph(prompt, seed, upscale=True, neg=NEG)
    g["6"]["inputs"]["width"], g["6"]["inputs"]["height"] = WIDE
    pid = gc._post("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"{name}: queued {pid} {WIDE[0]}x{WIDE[1]} (seed {seed})", flush=True)
    files, secs = gc.wait(pid)
    f = files[0]
    src = gc.COMFY / "output" / (f.get("subfolder") or "") / f["filename"]
    dest = OUT / f"{name}.png"
    dest.write_bytes(src.read_bytes())
    print(f"  saved {dest.name} ({dest.stat().st_size // 1024} KB) in {secs/60:.1f} min",
          flush=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    force = "--force" in args
    only = [a for a in args if not a.startswith("--")]
    for name, prompt in PLATFORMS.items():
        if only and name not in only:
            continue
        if not force and (OUT / f"{name}.png").exists():
            print(f"{name}: have it (--force to re-roll)", flush=True)
            continue
        try:
            t2i(name, prompt)
        except Exception as exc:
            print(f"  FAILED {name}: {type(exc).__name__}: {exc}", flush=True)
    print("done", flush=True)

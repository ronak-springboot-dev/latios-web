"""Render the component art for the mt-amd-am4 page.

Four text-to-image plates and two identity-preserving edits. Everything here is
checked against the product's own spec sheet (models.js, slug mt-amd-am4):

    CPU options  Ryzen 7 5700G / 5 5600G / 3 5305G      -> Ryzen chip (edit)
    Memory       2x DDR4-3200 U-DIMM, up to 64GB          -> a PAIR of DIMMs
    Storage      1x M.2 · 1x 2.5" · 1x 3.5"               -> one of each bay
    Graphics     up to 16GB Radeon RX                     -> a full-height card
    Cooling      fan cooler                               -> a round fan cooler

The plates are rendered on black and NOTHING else -- no floor, no horizon. The
page's backdrop goes behind them afterwards, in stage_am4_parts.py. The desk
scene that used to live here is gone: that card is a photograph of the real
machine now (gen_am4_photos.py).

Rules that come from earlier failures in this project, not from taste:

  * Text-to-image plates carry no lettering at all. gen_components.NEG already
    suppresses text, logos and numbers; a generated brand mark is a wrong one.
  * Dark ground, not gen_components.STYLE. STYLE says "light grey background",
    and appending it to dark prompts is recorded as having turned every plate
    into a pasted grey rectangle.
  * No Latios hardware is ever generated from scratch. The chassis is an EDIT of
    the real photograph, and anything showing the machine itself is a photograph.
  * Describe a part by its GEOMETRY, never by its name, and never name a surface
    the part should not show. "a bare dark green circuit board covering its
    underside" was meant to say the drive has a PCB underneath; the model read it
    as an instruction and returned an open case with its board on display.
  * The Ryzen chip is an edit at low denoise from a photograph, because it has
    lettering. That source is a Ryzen 7 3700X, so the model number is defocused
    afterwards -- the page sells a 5700G.

    python gen_am4.py                 # everything
    python gen_am4.py gpu-radeon      # one job
"""
import os
import sys
import uuid
from pathlib import Path

import gen_components as gc

os.environ.setdefault("LATIOS_UNET", "2511")
import comfy_client as cc  # noqa: E402  (reads LATIOS_UNET at import)

OUT = Path(__file__).parent / "generated" / "am4"
HIRES = Path(r"C:/Ronak/Latios/Images/pipeline/hires")
PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"

# The part ONLY -- no backdrop, no floor, no horizon.
#
# These plates used to be asked for their own stage ("subtle reflective floor",
# "warm amber horizon glow"), and every one came back on a different one. On the
# page they then sat next to the chassis card, which stands on a gradient
# sampled off the reference, and read as five pictures borrowed from five places.
#
# The stage is now built in stage_am4_parts.py with the same compose() and
# LIT_GROUND that made the chassis card, so all of them share one backdrop to the
# pixel. The model is asked for the object on black and nothing else, which is
# also the thing it does most reliably.
AM4_PART = (
    "ultra-detailed studio product render, one object alone on a pure black "
    "seamless background, low-key lighting, soft key light from the upper left, "
    "cool rim light along the far edge, no floor, no horizon, no backdrop, no "
    "background objects, photorealistic, sharp micro detail on machined metal "
    "and PCB surfaces, 8k"
)

T2I = {
    # (width, height) from Qwen-Image's native aspect set
    "gpu-radeon": ((1472, 1140),
        "a single full-height desktop graphics card seen from a low three-quarter "
        "angle with the bracket end nearest the camera and the card receding away "
        "to the upper right, "
        "matte black shroud with two large axial fans, brushed metal backplate "
        "edge, full-height metal PCIe bracket, gold PCIe edge connector along the "
        "bottom, plain unmarked shroud with no text and no logo. " + AM4_PART),
    "ddr4-pair": ((1472, 1140),
        "exactly two desktop memory modules standing upright, one a little behind "
        "and to the right of the other, both seen from a low three-quarter angle so "
        "they recede away from the camera, matte black aluminium heatspreaders with "
        "a shallow angular relief, a row of fine gold contact pins along the bottom "
        "edge of each, blank heatspreaders with no labels, no stickers, no text. "
        + AM4_PART),
    # Described by shape, never by name. The first render was asked for an "M.2
    # NVMe SSD" and a "2.5 inch" drive and printed those words back onto the
    # parts as garbled lettering ("M.NWC SSD", "2.5 k!/") -- Qwen-Image renders
    # text well enough that a product name in the prompt reads as a label to
    # draw. It also came back with four drives, one with its platter exposed.
    "storage-set": ((1472, 1140),
        "exactly three objects and nothing else, standing upright in a row and "
        "staggered in depth, seen from a low three-quarter angle so the row recedes "
        "to the right: on the left a long thin bare green circuit board stick with "
        "two blank black chips and one single row of fine gold contacts along its "
        "BOTTOM edge only, its top end bare green board with no contacts; in the middle a slim flat sealed metal case about the size of a "
        "playing card and a finger thick, with a flat brushed top face, square "
        "corners, a chamfered edge and two small recessed screw dimples in its side; "
        "on the right a plain solid rectangular block of brushed aluminium, twice as "
        "thick as the middle one, machined from one piece, every face smooth and "
        "unbroken, with four small recessed screw heads on its front face and a thin "
        "seam around its edge. Nothing inside any of them is visible. Every surface "
        "blank -- no markings, no stickers, no labels, no printed characters. "
        + AM4_PART),
    # The first render read "circular footprint" as a prop: it stood a square
    # tower cooler with heat pipes in front of a giant disc patterned like a
    # circuit board. Described now as the object itself, seen from above, with
    # the tower parts named in JOB_NEG instead of negated inside the prompt.
    "cooler": ((1328, 1328),
        "a compact low-profile desktop processor air cooler seen from above at a "
        "slight angle: a round black fan with seven curved black blades and a "
        "plain round black hub, sitting flat on a short round stack of thin "
        "aluminium fins that radiate outward from the centre like the spokes of "
        "a wheel, a flat metal base plate underneath. A single squat round object, "
        "plain unmarked surfaces. " + AM4_PART),
}

# The stage is built afterwards (stage_am4_parts), so anything the model draws
# under or behind the part has to be fought for here. Saying "no floor" in the
# prompt was not enough: both re-renders came back standing on a reflective plane
# with a glowing bar behind them, and a luminance cut takes whatever is lit.
T2I_NEG = gc.NEG + (", computer tower, desktop pc case, second monitor pair, "
                    "brand logo, rgb lighting, rainbow, blue cast, "
                    "floor, ground plane, table top, desk surface, reflective "
                    "surface, reflection, cast shadow, horizon line, backdrop, "
                    "light streak, light bar, glowing stripe, lens flare")

# Per-job negatives, for failure modes one render showed.
JOB_NEG = {
    "cooler": ", square fan frame, tower cooler, heat pipes, copper pipes, "
              "vertical heatsink, disc, ring, circular backdrop, circuit board, "
              "printed circuit pattern",
    "storage-set": ", open hard drive, exposed platter, read arm, fourth drive, "
                   "open enclosure, exposed circuit board, visible pcb inside a "
                   "case, missing lid, open lid, lid lifted off, green board showing "
                   "through a case, gold contacts at both ends, only two objects",
}


def t2i(name, size, prompt, neg=T2I_NEG):
    """gen_components.graph() with the latent resized -- graph() is square-only."""
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    g = gc.graph(prompt, seed, upscale=True, neg=neg)
    g["6"]["inputs"]["width"], g["6"]["inputs"]["height"] = size
    pid = gc._post("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"{name}: queued {pid} {size[0]}x{size[1]} (seed {seed})", flush=True)
    files, secs = gc.wait(pid)
    f = files[0]
    src = gc.COMFY / "output" / (f.get("subfolder") or "") / f["filename"]
    dest = OUT / f"{name}.png"
    dest.write_bytes(src.read_bytes())
    print(f"  saved {dest.name} ({dest.stat().st_size // 1024} KB) in {secs/60:.1f} min", flush=True)
    return dest


if __name__ == "__main__":
    only = sys.argv[1:]
    for name, (size, prompt) in T2I.items():
        if only and name not in only:
            continue
        try:
            t2i(name, size, prompt, neg=T2I_NEG + JOB_NEG.get(name, ""))
        except Exception as e:
            print(f"  FAILED {name}: {type(e).__name__}: {e}", flush=True)
    print("done", flush=True)

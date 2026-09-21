"""Render the shared component library used across the MT and SFF pages.

The AM4 page proved the recipe; this generalises it. Components are not Latios
hardware -- they are the DIMMs, drives, cards and coolers a machine is built
from -- so unlike a chassis they may be generated. That is what makes one
library possible: `am4_studio.PLATE_GROUND` is deliberately a NEUTRAL graphite
ramp rather than any page's accent, so a plate staged once looks right on the
amber AM4 page, the blue Q670 page and every other accent in theme.js.

Which matters because a render costs 7-10 minutes on this box. Rendering a
memory plate for each of ten pages is most of a day. Rendering it once is eight
minutes, and the pages differ by which plate they point at, not by having their
own.

The plates are keyed to the spec rows in models.js, not to pages:

    ddr4-pair        2x DDR4 U-DIMM          mt-amd-am4, mt-h610-ddr4
    ddr5-pair        2x DDR5 U-DIMM          the six DDR5 MT/SFF SKUs
    ddr5-quad        4x DDR5 U-DIMM          sff-b860-pro-ai (4 slots, 128GB)
    ddr5-sodimm      2x DDR5 SO-DIMM         mff-dp10 (not in this tranche)
    gpu-workstation  single-blower pro card  anything speccing "up to RTX A4000"
    m2-2280          one M.2 NVMe SSD        every page with an M.2 row
    cooler           tower/downdraft cooler  all MT/SFF

gpu-workstation is a SEPARATE plate from the AM4 page's gpu-radeon on purpose.
A Radeon RX is a dual-fan consumer card and an RTX A4000 is a single-slot
blower; putting the consumer card on a page that sells the professional one is
the same class of error as showing an LGA socket on a Ryzen page.

Every rule here was paid for on the AM4 page; gen_am4.py's docstring carries the
full history. The two that shape these prompts:

  * NAME the part, and take the lettering off afterwards. Describing geometry
    instead was meant to avoid garbled labels, and it returned objects nobody
    could identify -- a 2.5" drive with hinge tabs, a 3.5" that was a latched
    equipment case. Naming returns a correct part plus invented silkscreen, and
    install_am4's softening boxes remove that deterministically.
  * BRIGHT, and explicitly deep focus. "low-key lighting" was the single biggest
    quality defect this pipeline has had, and shallow depth of field was the
    second -- it reads to a viewer as low resolution, not as photography.

    python gen_parts.py                  # everything not yet rendered
    python gen_parts.py ddr5-pair        # one job
    python gen_parts.py --force ddr5-pair   # re-roll one that exists
"""
import os
import sys
import uuid
from pathlib import Path

import gen_components as gc

os.environ.setdefault("LATIOS_UNET", "2511")

OUT = Path(__file__).parent / "generated" / "components-lib"

#: Identical to gen_am4.AM4_PART. Imported rather than copied would be better,
#: but gen_am4 is a page module and this is a library module; duplicating ten
#: lines beats making the library depend on one page's file.
PART = (
    "professional studio product photograph, one object alone on a pure black "
    "seamless background, the object BRIGHTLY and EVENLY lit from above and in "
    "front, clean specular highlights along every machined edge, no face of the "
    "object falling into shadow, crisp sharp focus across the whole object, fine "
    "surface texture on brushed metal and circuit board, deep depth of field with "
    "the near edge and the far edge equally sharp, every part of the object in "
    "focus, the object fills most of the frame, nothing else in the picture, no "
    "lamp, no light source visible, no floor, no horizon, no backdrop, no "
    "background objects"
)

#: Qwen-Image's native aspect set. 1328x1328 is the square latent; the other two
#: are the wide and landscape shapes the featureSplit frames want.
WIDE, LAND, SQUARE = (1664, 928), (1472, 1140), (1328, 1328)

T2I = {
    "ddr5-pair": (LAND,
        "exactly two DDR5 desktop memory modules, standard full-height U-DIMM "
        "sticks, standing upright side by side with one a little behind and to "
        "the right of the other, both seen from a low three-quarter angle so they "
        "recede away from the camera. Each carries a matte black anodised "
        "aluminium heat spreader with a shallow angular crease pressed into it, "
        "its top edge folded over, the dark green circuit board showing as a thin "
        "line below it, and a single row of fine gold contact pins along the "
        "bottom edge broken by one off-centre notch. Blank heat spreaders with no "
        "labels, no stickers, no text. " + PART),

    "ddr5-quad": (LAND,
        "exactly four DDR5 desktop memory modules, standard full-height U-DIMM "
        "sticks, standing upright in a row and staggered in depth so the row "
        "recedes away to the right, seen from a low three-quarter angle. Each "
        "carries a matte black anodised aluminium heat spreader with a shallow "
        "angular crease, the dark green circuit board showing as a thin line "
        "below it, and a single row of fine gold contact pins along the bottom "
        "edge broken by one off-centre notch. Four modules, evenly spaced. Blank "
        "heat spreaders with no labels, no stickers, no text. " + PART),

    "gpu-workstation": (LAND,
        "a single full-height professional workstation graphics card, a "
        "single-slot blower-style PCI Express video card, seen from a low "
        "three-quarter angle with the bracket end nearest the camera and the card "
        "receding away to the upper right. One matte black shroud running the "
        "full length of the card with a single round blower fan set into it near "
        "the far end and a long row of exhaust slots cut into the bracket, a dark "
        "anodised aluminium backplate, a full-height metal PCIe bracket cut with "
        "display output openings, and the gold PCIe edge connector running along "
        "the bottom. Plain unmarked shroud with no text and no logo. " + PART),

    "m2-2280": (WIDE,
        "a single M.2 2280 NVMe solid state drive, the small bare circuit board "
        "type that screws flat onto a motherboard, lying flat and seen at a "
        "three-quarter angle from slightly above. A long narrow dark green "
        "printed circuit board, four times as long as it is wide, carrying two "
        "black memory packages and one smaller controller package on its upper "
        "face, a single row of fine gold edge contacts across ONE SHORT END only, "
        "split by one notch, and a small semicircular mounting cut-out at the "
        "opposite short end. The long edges are bare board with no contacts on "
        "them at all. Blank packages with no writing and no marking. " + PART),
}

#: Per-job negatives, for failure modes a render actually showed.
JOB_NEG = {
    "ddr5-pair": ", three modules, four modules, one module, laptop memory, "
                 "small memory module, printed label, sticker, lettering",
    "ddr5-quad": ", two modules, three modules, five modules, laptop memory, "
                 "printed label, sticker, lettering",
    "gpu-workstation": ", two fans, three fans, dual fan, axial fans, open "
                       "shroud, transparent shroud, rgb lighting, printed label, "
                       "brand logo, lettering",
    # The M.2 has failed four times, always the same way: the model has a strong
    # prior that a long thin green board with an edge connector is a DIMM, and a
    # DIMM is the one thing it must not resemble -- it sits under a memory
    # section showing real DIMMs. These negatives name that failure directly.
    "m2-2280": ", memory module, dimm, ram stick, heat spreader, contacts along "
               "a long side, pads down the length of the board, gold contacts at "
               "both ends, metal case, enclosure, lid, two objects, square board, "
               "dimension text, measurements printed on the board, silkscreen "
               "numbers, mm, millimetre markings, printed label, lettering",
}

NEG = gc.NEG + (", computer tower, desktop pc case, brand logo, rgb lighting, "
                "rainbow, blue cast, floor, ground plane, table top, desk "
                "surface, reflective surface, reflection, cast shadow, horizon "
                "line, backdrop, light streak, lens flare, shallow depth of "
                "field, bokeh, defocused, out of focus, blurred edges, soft "
                "focus, motion blur, tilt shift")


def t2i(name, size, prompt, neg):
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
    print(f"  saved {dest.name} ({dest.stat().st_size // 1024} KB) in {secs/60:.1f} min",
          flush=True)
    return dest


if __name__ == "__main__":
    args = sys.argv[1:]
    force = "--force" in args
    only = [a for a in args if not a.startswith("--")]
    for name, (size, prompt) in T2I.items():
        if only and name not in only:
            continue
        if not force and (OUT / f"{name}.png").exists():
            print(f"{name}: have it (--force to re-roll)", flush=True)
            continue
        try:
            t2i(name, size, prompt, NEG + JOB_NEG.get(name, ""))
        except Exception as exc:                       # one bad job must not kill the batch
            print(f"  FAILED {name}: {type(exc).__name__}: {exc}", flush=True)
    print("done", flush=True)

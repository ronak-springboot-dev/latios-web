"""Macro shots of the internals, lit the way the reference lights them.

WHAT THE REFERENCE ACTUALLY DOES, read off its own assets rather than guessed.
store.minisforum.com's feature images are square typographic composites on
WHITE: a gradient-coloured headline phrase, a grey paragraph, and underneath,
rounded-corner MACRO PHOTOGRAPHS OF THE INSIDE of the machine -- memory seated
in its slots, three M.2 drives stacked under their heatsinks -- shot close, lit
with a cool blue accent along every edge, against the bright silver of the
chassis interior.

That is the gap. images/parts/ holds isolated components on a near-black
sweep: correct, and the opposite lighting and the opposite distance. Nothing on
this site shows the inside of a machine close up.

So these are generated as INTERNALS, not as parts: components in place on a
board, inside a bright chassis, with the reference's cool rim light.

NOT LATIOS HARDWARE. These are generic PC internals in the same category as
everything gen_parts.py already generates -- a DDR5 module, an M.2 drive, a
cooler. No Latios chassis, no wordmark, nothing that claims to be a photograph
of a Latios machine; those are always real photographs, and make_banners.py
records what happens when that rule slips.

AND NO LETTERING. The reference's modules carry "DDR5 5600 MHz" and
"M.2 PCIE 4.0" on them. Those are SET afterwards by stage_internals.py from the
vendored faces, never asked of the model -- it produced 'DDR2V' and 'DDR5 ECC'
in this project the last time it was asked for a memory label.

    python gen_internals.py              # all four
    python gen_internals.py memory
    python gen_internals.py --force
"""
import os
import sys
import uuid
from pathlib import Path

import gen_components as gc

os.environ.setdefault("LATIOS_UNET", "2511")

OUT = Path(__file__).parent / "generated" / "internals"
SQUARE = (1024, 1024)

#: The lighting brief, and it is the whole point: bright interior, cool blue
#: accent, shot close. Every plate shares it so the four read as one shoot.
LIGHT = (
    "macro product photograph taken inside a computer chassis, bright silver "
    "and white anodised interior surfaces filling the background, cool blue "
    "accent light raking along every edge and reflecting off the metal, soft "
    "even key light, shallow depth of field with the far end falling out of "
    "focus, extremely fine detail on the solder and the surface texture, clean "
    "and clinical, premium product photography, three-quarter angle from "
    "slightly above"
)

PLATES = {
    # v2. The first roll came back with the modules lying FLAT at a shallow
    # angle -- SODIMMs, or M.2 cards. Every Latios desktop specs full-height
    # U-DIMM ("2x DDR4-3200 U-DIMM"), so a flat module is the wrong form factor
    # on the page, and a spec sheet contradicted by its own photograph is worse
    # than no photograph. "Upright" alone did not carry it; the orientation has
    # to be said three ways.
    "memory": "two tall full-height desktop DIMM memory modules standing "
              "VERTICALLY upright at ninety degrees to a dark green "
              "motherboard, each module perpendicular to the board and seen "
              "edge-on from the side, white plastic retaining latches closed "
              "against both ends of each module, plain unmarked black heat "
              "spreaders, " + LIGHT,
    "storage": "three M.2 solid state drives lying flat in a row on a dark "
               "circuit board, each under a plain unmarked black aluminium "
               "heatsink held by a single screw, " + LIGHT,
    "cooling": "a low-profile processor cooler with a copper fin stack and two "
               "copper heatpipes over a dark circuit board, a black fan above "
               "it, " + LIGHT,
    # REJECTED, and left here as the record rather than deleted.
    #
    # The roll came back with "Ufttho" and "U8i0|l" stamped on the bracket under
    # the ports -- the model trying to write USB and failing, which is the exact
    # thing the negative prompt already forbids and the exact thing this project
    # has a file of examples of. It is patchable; it was not worth patching,
    # because the composition was wrong too: three RJ45 jacks and two USB ports
    # on a shallow bracket reads as a network switch, and the display outputs
    # that were asked for never appeared.
    #
    # A port cluster is also the LEAST valuable of the four here. Two pages
    # already carry an ioMap section built from their own spec rows, and every
    # page lists its I/O in the spec table. Three good plates beat four with one
    # that needs an apology.
    "io": "a row of rear panel connectors on a metal bracket seen close up, "
          "stacked USB ports, an ethernet jack and display outputs, plain "
          "unmarked metal shielding, " + LIGHT,
}

#: The parts of a real photograph that would give this away as invented -- and
#: every brand the model reaches for when it draws a component.
NEG = gc.NEG + (
    ", text, lettering, words, numbers, part numbers, silkscreen text, "
    "barcode, label, sticker, logo, brand name, trademark, "
    "intel, amd, nvidia, samsung, corsair, kingston, crucial, asus, msi, "
    "latios, "
    "rgb lighting, rainbow, gamer aesthetic, neon, "
    "person, hands, dust, fingerprints, blurry, low detail"
)


def t2i(name, prompt):
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    g = gc.graph(prompt, seed, upscale=True, neg=NEG)
    g["6"]["inputs"]["width"], g["6"]["inputs"]["height"] = SQUARE
    pid = gc._post("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"{name}: queued {pid} {SQUARE[0]}x{SQUARE[1]} (seed {seed})", flush=True)
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
    for name, prompt in PLATES.items():
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

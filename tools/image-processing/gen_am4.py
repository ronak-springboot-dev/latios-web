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

  * Text-to-image plates ship with no lettering at all. gen_components.NEG
    suppresses text, logos and numbers, but not reliably once the prompt names a
    part that normally carries a label -- see the NAME rule below, and the
    softening boxes that finish the job.
  * Dark ground, not gen_components.STYLE. STYLE says "light grey background",
    and appending it to dark prompts is recorded as having turned every plate
    into a pasted grey rectangle.
  * BRIGHT lighting, though. The style string asked for "low-key lighting" for a
    long time -- inherited from the page's dark ground -- and low-key means
    murky. Every part came back soft and dim, which read as an AI render beside
    a photograph. That one phrase was the single biggest quality problem here.
  * Name the RESULT, never the equipment. Asking for light "from a large softbox
    above and in front" drew the softbox: a white quadrilateral filling the top
    left of the memory plate. Same failure as the similes and the millimetres --
    anything nameable in the prompt is something the model may render. Say the
    object is brightly and evenly lit; do not say what is lighting it.
  * No Latios hardware is ever generated from scratch. The chassis is an EDIT of
    the real photograph, and anything showing the machine itself is a photograph.
  * NO SIMILES. Every figure of speech in a prompt gets drawn literally. "as
    thin as a stack of three coins" returned a stack of coin-shaped plates;
    "about three times the thickness of a phone" invites a phone into frame.
  * NO NUMERALS either, on a part small enough to carry a label. "80 mm long and
    22 mm wide" came back silkscreened onto the board as "80mm x 22mm". The
    global negative suppresses text, but not text the prompt itself supplies.
    Millimetres are safe on a big plain case and not on a circuit board; ratios
    in words ("four times as long as it is wide") are safe on both.
  * Describe the part's DETAIL by geometry even when the name is given, and
    never name a surface the part should not show. "a bare dark green circuit board covering its
    underside" was meant to say the drive has a PCB underneath; the model read it
    as an instruction and returned an open case with its board on display.
  * NAME the part, and take the lettering off afterwards. This reverses the rule
    that stood here for most of this page's life, so the reasoning matters.
    Naming a part was banned because "M.2 NVMe SSD" came back with the words
    printed on it, garbled. So every prompt described geometry instead -- and
    geometry alone cannot carry a connector. Asked for "two adjacent slot
    openings set into the side wall, each a narrow dark recess with a small
    stepped notch at one end", the model returned a 2.5" with three protruding
    hinge tabs and a 3.5" that was a latched aluminium equipment case; it reads
    a recess-with-a-notch as something that sticks out. Without a connector the
    drives were featureless bricks, which is what the page shipped and what was
    rightly rejected.

    The ban solved the wrong half of the problem. This pipeline ALREADY removes
    generated lettering deterministically, and does it on three images on this
    very page: install_am4.py defocuses the Ryzen's model number, DDR4_LABELS
    blanks the pseudo-text on the memory heatspreaders, GPU_SOFTEN kills the
    invented mark on the fan hub. So name the part, let the model put a correct
    SATA tongue and a correct DIMM notch where they belong, and measure a
    softening box over whatever text it invents. Model priors are the reason to
    name it; the retouch stage is the reason naming is now safe.

    What does NOT change: the plate ships with no legible lettering on it, ever.
    Check every render at 100% and measure the boxes against that render -- the
    constants do not survive a re-roll.
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

T2I = {
    # (width, height) from Qwen-Image's native aspect set
    "gpu-radeon": ((1472, 1140),
        "a single full-height dual-fan desktop graphics card, a modern PCI Express "
        "video card, seen from a low three-quarter angle with the bracket end "
        "nearest the camera and the card receding away to the upper right. Deep "
        "matte black plastic shroud moulded in angular facets around two large "
        "eleven-blade axial fans, a dark anodised aluminium backplate, a "
        "full-height metal PCIe bracket cut with display output openings, a row of "
        "heatsink fins visible along the top edge, and the gold PCIe edge connector "
        "running along the bottom. Plain unmarked shroud with no text and no "
        "logo. " + AM4_PART),
    "ddr4-pair": ((1472, 1140),
        "exactly two DDR4 desktop memory modules, standard full-height U-DIMM "
        "sticks, standing upright side by side with one a little behind and to the "
        "right of the other, both seen from a low three-quarter angle so they "
        "recede away from the camera. Each carries a matte black anodised aluminium "
        "heat spreader with a shallow angular crease pressed into it, its top edge "
        "folded over, the dark green circuit board showing as a thin line below it, "
        "and a single row of fine gold contact pins along the bottom edge broken by "
        "one off-centre notch. Blank heat spreaders with no labels, no stickers, no "
        "text. " + AM4_PART),
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
    # Storage, one object per render.
    #
    # Five attempts at all three in one frame failed on the same thing every
    # time: the third drive came back open, or with its lid sliding off, or as a
    # window onto a PCB, or as a lollipop. Single objects, meanwhile, have never
    # failed here -- the cooler and the graphics card were both right first time.
    # So they are rendered apart and composited in stage_am4_parts, where the
    # relative sizes are arithmetic rather than something the model has to infer.
    #
    # Thickness is the other thing it gets wrong, so each says its proportions
    # twice: once in millimetres and once in plain shape words.
    # A WIDE canvas, unlike the two drives. The style string asks for the object
    # to fill most of the frame, and in a square frame that fights a 4:1 strip:
    # the board came back square, with its contacts correctly on one edge but its
    # proportions lost. Given a frame the right shape it can be both.
    "part-m2": ((1664, 928),
        "a single thin bare green printed circuit board module, a narrow strip about "
        "four times as long as it is wide, lying flat and seen at a three-quarter "
        "angle from slightly above, two "
        "blank black square chips on its upper face, a row of fine gold contact pads "
        "running ACROSS ONE SHORT END of the strip -- spanning the full width of that "
        "narrow end, like the edge connector of a memory stick -- with a small notch "
        "interrupting that row, and a semicircular screw cut-out at the far short "
        "end. The two LONG sides of the board carry no contacts at all. One flat "
        "thin board, plain unmarked surfaces, no text. "
        + AM4_PART),
    "part-ssd": ((1328, 1328),
        "a single 2.5 inch SATA solid state drive, the standard slim rectangular "
        "computer drive, lying flat and seen at a three-quarter angle from slightly "
        "above with its connector edge turned towards the camera. Brushed aluminium "
        "top lid, square corners, a fine seam running round its edge, and at the "
        "connector edge the flat SATA data and power tongues set into a recess in "
        "the drive's own edge. Blank lid with no label, no sticker and no text. "
        + AM4_PART),
    "part-hdd": ((1328, 1328),
        "a single 3.5 inch SATA desktop hard disk drive, the standard sealed "
        "rectangular computer drive, lying flat and seen at a three-quarter angle "
        "from slightly above with its connector edge turned towards the camera. A "
        "flat brushed aluminium lid held down by recessed screws near its corners, "
        "a plain machined side wall with a fine seam and a row of small mounting "
        "holes, and at the connector edge the flat SATA data and power tongues set "
        "into the drive's own edge. Blank lid with no label, no sticker and no "
        "text. " + AM4_PART),
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
                    "light streak, light bar, glowing stripe, lens flare, "
                    "shallow depth of field, bokeh, defocused, out of focus, "
                    "blurred edges, soft focus, motion blur, tilt shift")

# Per-job negatives, for failure modes one render showed.
JOB_NEG = {
    "cooler": ", square fan frame, tower cooler, heat pipes, copper pipes, "
              "vertical heatsink, disc, ring, circular backdrop, circuit board, "
              "printed circuit pattern",
    "part-m2": ", contacts running along a long side, pads down the length of "
               "the board, metal case, enclosure, lid, two objects, "
               "gold contacts at both "
               "ends, dimension text, measurements printed on the board, silkscreen "
               "numbers, mm, millimetre markings",
    "part-ssd": ", open case, exposed circuit board, visible pcb, missing lid, "
               "thick block, cube, tall box, two objects",
    "part-hdd": ", open case, exposed circuit board, visible pcb, missing lid, "
               "open lid, lid lifted off, tall upright box, cube, two objects",
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

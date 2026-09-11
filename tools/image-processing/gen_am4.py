"""Render the component art for the mt-amd-am4 page.

Five text-to-image plates and two identity-preserving edits. Everything here is
checked against the product's own spec sheet (models.js, slug mt-amd-am4):

    CPU options  Ryzen 7 5700G / 5 5600G / 3 5305G      -> Ryzen chip (edit)
    Memory       2x DDR4-3200 U-DIMM, up to 64GB          -> a PAIR of DIMMs
    Storage      1x M.2 · 1x 2.5" · 1x 3.5"               -> one of each bay
    Graphics     up to 16GB Radeon RX                     -> a full-height card
    Cooling      fan cooler                               -> a round fan cooler
    Rear I/O     HDMI 2.1 · DP 1.4 · VGA (opt)            -> two monitors

Rules that come from earlier failures in this project, not from taste:

  * Text-to-image plates carry no lettering at all. gen_components.NEG already
    suppresses text, logos and numbers; a generated brand mark is a wrong one.
  * Dark ground, not gen_components.STYLE. STYLE says "light grey background",
    and appending it to dark prompts is recorded as having turned every plate
    into a pasted grey rectangle.
  * No Latios hardware is ever generated from scratch. The desk scene has no PC
    in it for that reason, and the chassis is an EDIT of the real photograph.
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

# The page's own look: dark ground, WARM rim. gen_components.DARK_STYLE uses a
# cool blue rim; this page's accent is amber, and the reference's stat numerals
# and horizon glow are warm, so the renders are lit to match.
AM4_STYLE = (
    "ultra-detailed studio product render on a pure black seamless background, "
    "low-key lighting, warm amber rim light raking from behind, soft key light "
    "from the upper left, subtle reflective floor, photorealistic, sharp micro "
    "detail on machined metal and PCB surfaces, no background objects, 8k"
)

T2I = {
    # (width, height) from Qwen-Image's native aspect set
    "gpu-radeon": ((1472, 1140),
        "a single full-height desktop graphics card seen at a three-quarter angle, "
        "matte black shroud with two large axial fans, brushed metal backplate "
        "edge, full-height metal PCIe bracket, gold PCIe edge connector along the "
        "bottom, plain unmarked shroud with no text and no logo. " + AM4_STYLE),
    "ddr4-pair": ((1472, 1140),
        "exactly two desktop DDR4 memory modules standing upright side by side, "
        "matte black aluminium heatspreaders, gold contact pins along the bottom "
        "edge, resting on a glossy reflective surface with a warm amber horizon "
        "glow behind them, no labels, no stickers, no text. " + AM4_STYLE),
    # Described by shape, never by name. The first render was asked for an "M.2
    # NVMe SSD" and a "2.5 inch" drive and printed those words back onto the
    # parts as garbled lettering ("M.NWC SSD", "2.5 k!/") -- Qwen-Image renders
    # text well enough that a product name in the prompt reads as a label to
    # draw. It also came back with four drives, one with its platter exposed.
    "storage-set": ((1472, 1140),
        "exactly three computer storage drives and nothing else, side by side on "
        "a glossy black floor: on the left a long thin bare green circuit board "
        "stick with two blank black chips and a row of gold contacts at one end; "
        "in the middle a slim flat sealed rectangular metal drive the size of a "
        "phone; on the right a larger thick sealed rectangular brushed metal hard "
        "drive with a closed lid. Blank chips and blank lids with no markings, no "
        "stickers, no labels, no printed characters. " + AM4_STYLE),
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
        "plain unmarked surfaces. " + AM4_STYLE),
    "desk-dual": ((1664, 928),
        "a clean modern office desk in a dark room at night, exactly two identical "
        "unbranded monitors side by side on thin stands showing abstract data "
        "dashboards, a keyboard and mouse, warm amber desk lamp glow, no computer "
        "tower on or under the desk, no PC case, no people, cinematic, "
        "photorealistic, 8k"),
}

T2I_NEG = gc.NEG + (", computer tower, desktop pc case, second monitor pair, "
                    "brand logo, rgb lighting, rainbow, blue cast")

# Per-job negatives, for failure modes one render showed.
JOB_NEG = {
    "cooler": ", square fan frame, tower cooler, heat pipes, copper pipes, "
              "vertical heatsink, disc, ring, circular backdrop, circuit board, "
              "printed circuit pattern",
    "storage-set": ", open hard drive, exposed platter, read arm, fourth drive",
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

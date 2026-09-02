"""
Build a registered (closed, open) pair for every interior.

Why this exists
---------------
The shipped reveal cross-faded two unrelated pictures: a chassis photograph
scaled to a flat 78% of frame, and a separately generated interior. Nothing tied
them together, so the lid never matched the body and nothing ever moved.

The fix is to stop treating "closed" and "open" as two independent images. Here
they are the SAME chassis in the SAME framing, one with its side panel and one
without. Form factor matches by construction rather than by anyone estimating a
scale factor, and register_pairs.py then cuts the panel and the body out of the
photograph itself so the machine on screen is always the real one.

Direction depends on what was actually photographed:

  MT, SFF, MFF   real photograph -> edit the panel OFF   (7 interiors)
  PROMAX         no photograph exists -> generate the closed chassis, then
                 edit the panel off it                   (2 interiors)

PROMAX previously borrowed the MT photograph, which is a workstation sold behind
a picture of a micro-tower. That is exactly the mismatch reported.

    python open_chassis.py                 # every interior that needs one
    python open_chassis.py mt-ddr4         # one
    LATIOS_UNET=q6 python open_chassis.py  # larger model, better geometry
"""
import sys
from pathlib import Path

from PIL import Image

import comfy_client

HERE = Path(__file__).parent
IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")
PAIRS = HERE / "generated" / "pairs"

# The ground the chassis is composited onto. Matches the reveal's backdrop so a
# frame lifted from the sequence sits on the same black as the page section.
GROUND = (10, 10, 10)

# The model prints on flat surfaces when left unconstrained - the same failure
# that produced "Lohxs", "Lobos", "DDR2V" and "DDR5 ECC" earlier in the project.
# Text is suppressed here, and anything that slips through is erased downstream.
NO_TEXT = "no text, no lettering, no logos, no brand marks, no watermark. "

# What each configuration actually contains. Kept deliberately parallel to the
# interior prompts in gen_components.py so an opened chassis shows the same
# hardware as the interior render it replaces.
CONTENTS = {
    "mt-ddr4":      "a dark ATX motherboard, a black tower air cooler over the socket, "
                    "two vertical DDR4 memory modules, empty expansion slots with no "
                    "graphics card, a matte black power supply at the lower right",
    "mt-ddr4-gpu":  "a dark ATX motherboard, a black tower air cooler over the socket, "
                    "two vertical DDR4 memory modules, one long black professional "
                    "graphics card in the top slot, a matte black power supply at the lower right",
    "mt-ddr5-gpu":  "a dark ATX motherboard, a black tower air cooler with copper heatpipes, "
                    "two vertical DDR5 memory modules, one long black professional "
                    "graphics card in the top slot, a matte black power supply at the lower right",
    # The AM5 build's spec reads "Radeon 700M integrated - up to 16GB Radeon RX",
    # so a discrete card is a real option here and the render showing one is
    # accurate. Stated explicitly rather than left as "no graphics card", which
    # the description used to say while the picture showed one.
    "mt-ddr5-amd":  "a dark ATX motherboard, a compact black air cooler with a circular fan, "
                    "two vertical DDR5 memory modules, an optional discrete graphics card "
                    "in the top slot, a matte black power supply at the lower right",
    "sff-ddr5":     "a compact motherboard across the base, a low-profile copper-finned "
                    "cooler, two vertical DDR5 memory modules, an M.2 drive under a slim "
                    "heatsink, no graphics card, a small TFX power supply at one end",
    "sff-4dimm":    "a compact motherboard across the base, a low-profile copper-finned "
                    "cooler, four vertical DDR5 memory modules in a row, an M.2 drive under "
                    "a slim heatsink, a small TFX power supply at one end",
    "mff":          "a tiny motherboard filling the base, a low-profile blower fan and "
                    "heatsink, two horizontal SO-DIMM laptop memory modules, a single M.2 "
                    "drive, no graphics card and no internal power supply",
    "promax-4dimm": "a wide workstation motherboard, a tall twin-fan tower air cooler, four "
                    "vertical DDR5 ECC memory modules in a row, one very long professional "
                    "graphics card with a full-length shroud, a large shrouded power supply",
    "promax-8dimm": "a wide server-class motherboard, a closed-loop liquid cooling block "
                    "with two braided tubes running to a radiator, eight vertical ECC "
                    "registered memory modules in two banks of four, two very long "
                    "professional graphics cards, two redundant power supply modules at the base",
}

# interior -> the real closed photograph, or None when none was ever taken.
#
# Source choice matters more than it looks. The first pass used dp80-4 for the
# SFF and dp10-1 for the MFF, and both failed outright:
#
#   dp80-4 is the slim box seen edge-on, almost a flat slab. With no side face
#          to work on the model produced a conventional vertical tower interior.
#   dp10-1 is TWO mini PCs side by side, rear view. There was no single chassis
#          to open, and the edit returned an unrelated white tower.
#
# dp80-1 and dp10-2 each show one machine at three-quarters with its side panel
# square to the camera, which is what the edit actually needs.
SOURCE = {
    "mt-ddr4":      "dp180-1.webp",
    "mt-ddr4-gpu":  "dp180-1.webp",
    "mt-ddr5-gpu":  "dp180-1.webp",
    "mt-ddr5-amd":  "dp180-1.webp",
    "sff-ddr5":     "dp80-1.webp",
    "sff-4dimm":    "dp80-1.webp",
    "mff":          "dp10-2.webp",
    "promax-4dimm": None,
    "promax-8dimm": None,
}

# The shape the model must not change. Stated explicitly because the SFF edit
# quietly turned a slim machine into a mid-tower - the prompt described what was
# inside without ever saying what the outside was.
FORM = {
    "mt-ddr4":      "a compact micro-tower, upright and roughly square in profile",
    "mt-ddr4-gpu":  "a compact micro-tower, upright and roughly square in profile",
    "mt-ddr5-gpu":  "a compact micro-tower, upright and roughly square in profile",
    "mt-ddr5-amd":  "a compact micro-tower, upright and roughly square in profile",
    "sff-ddr5":     "a slim small-form-factor machine, narrow and flat, far thinner than a tower",
    "sff-4dimm":    "a slim small-form-factor machine, narrow and flat, far thinner than a tower",
    "mff":          "a very small mini PC, about the size of a hardback book",
    "promax-4dimm": "a large full-height workstation tower",
    "promax-8dimm": "a very large full-height workstation tower",
}

# Interiors whose open edit is MASKED to the panel region.
#
# The SFFs need this and the towers do not. Asked to open sideways at full
# denoise the model re-staged the SFF shot from overhead and returned a smaller,
# squarer tray, so the two frames were never the same machine in the same
# framing. Lowering denoise to hold the framing was tried and fails the other
# way: at 0.86 the lid simply did not come off.
#
# A latent noise mask settles both. The sampler runs at full denoise, so the
# interior is genuinely generated, but it may only repaint the top plate -
# silhouette, front bezel, ports, wordmark and camera angle come back as the
# photograph's own pixels. Registration stops being something align() has to
# recover and becomes true by construction.
#
# The mask is aperture-*.png, which register_pairs derives from the CLOSED
# photograph alone, so it is valid before any open frame exists.
MASKED_OPEN = {"sff-ddr5", "sff-4dimm"}
#
# This also retired fit_interiors.py, which existed only to crop the
# unmasked SFF render down to the part that actually held hardware. With
# the mask the interior arrives already registered to the photograph, so
# cropping and rescaling it could only make it worse.
MASK_GROW = 10        # a little past the seam, so the lid's own edge can go
MASK_FEATHER = 24     # soft enough that the new interior meets the rim cleanly

# WHICH FACE COMES OFF, and what the camera is looking at once it does.
#
# open_prompt used to say "side panel" for every interior. On the two SFFs that
# is simply the wrong face - a slim desktop is serviced from the TOP - and the
# result was not a mis-labelled panel but a mis-framed picture: asked to open a
# machine sideways, the model re-staged the shot from almost directly overhead
# and returned a smaller, squarer tray. The closed photograph is a wide flat box
# seen from about desk height, so the two frames were not the same machine in the
# same framing at all, and register_pairs.align() can only rescale - it cannot
# undo a change of camera elevation. That is why the board's perspective never
# sat inside the photographed chassis.
#
# `face` names the panel, `view` restates the camera so the edit keeps it.
OPENING = {
    "mt-ddr4":      ("flat side panel", "from the side, at the same eye level"),
    "mt-ddr4-gpu":  ("flat side panel", "from the side, at the same eye level"),
    "mt-ddr5-gpu":  ("flat side panel", "from the side, at the same eye level"),
    "mt-ddr5-amd":  ("flat side panel", "from the side, at the same eye level"),
    "sff-ddr5":     ("flat top lid",
                     "down into the shallow interior from the same low three-quarter "
                     "angle as the original, NOT from overhead"),
    "sff-4dimm":    ("flat top lid",
                     "down into the shallow interior from the same low three-quarter "
                     "angle as the original, NOT from overhead"),
    "mff":          ("flat side panel", "from the side, at the same eye level"),
    "promax-4dimm": ("flat side panel", "from the side, at the same eye level"),
    "promax-8dimm": ("flat side panel", "from the side, at the same eye level"),
}

# Closed-chassis prompts for the two PROMAX, which have no photograph. Described
# as two genuinely different bodies because the range is sold that way - the
# T4 Plus is a larger machine with dual supplies, not a trim of the other.
PROMAX_CLOSED = {
    # "a subtle ventilated front bezel" produced a flange jutting off the top
    # corner, so frame 0 did not read as a closed machine. The replacement states
    # the silhouette plainly: a rectangular box with a flat top and square edges.
    "promax-4dimm": "Product photograph of a large matte black workstation tower computer, "
                    "closed. A plain rectangular box with a completely flat top, square "
                    "edges and an unbroken brushed side panel facing the camera. Standing "
                    "upright on the floor, three-quarter view lit from the upper left, on a "
                    "seamless near-black background. No protrusions, handles, feet flares "
                    "or panels sticking out. " + NO_TEXT,
    "promax-8dimm": "Product photograph of a very large black dual-supply workstation tower "
                    "computer, closed, standing upright, plain brushed dark side panel "
                    "facing the camera, a tall ventilated front bezel with two power supply "
                    "bays visible at the base, three-quarter view lit from the upper left, "
                    "on a seamless near-black background. " + NO_TEXT,
}


# Megapixels to hand the sampler. The photographs are 2.05MP, which puts the
# 13GB model well past an 8GB card and into constant offloading - the first MT
# edit took 11 minutes and a later one over 45. Only the INTERIOR layer comes
# from the edit; the panel and the body are cut from the full-resolution
# photograph, and the reveal renders 1400px wide. So this costs nothing visible.
EDIT_MP = 1.15


def flatten(src, ground=GROUND):
    """Composite an RGBA cutout onto solid ground; Qwen-Image-Edit wants RGB."""
    im = Image.open(src).convert("RGBA")
    bg = Image.new("RGB", im.size, ground)
    bg.paste(im, (0, 0), im)
    return bg


def for_sampler(img, mp=EDIT_MP):
    """Downscale to `mp` megapixels, on an 8-pixel grid the VAE is happy with."""
    cur = (img.width * img.height) / 1e6
    if cur <= mp:
        return img
    s = (mp / cur) ** 0.5
    return img.resize((max(8, int(img.width * s) // 8 * 8),
                       max(8, int(img.height * s) // 8 * 8)), Image.LANCZOS)


# PROMAX runs the OTHER WAY: the existing interior render is the open frame, and
# the closed frame is made by fitting a panel onto it.
#
# Generating a closed workstation first was tried twice and failed both times -
# once producing a chassis with a flange off the top corner, once a featureless
# black slab standing on a literal floor. The interiors in generated/components
# are good: recognisable towers with correct proportions, board, cooler, DIMMs
# and supplies. Closing a good render is a far smaller ask of the model than
# inventing a whole machine, and it guarantees registration the same way the
# photographs do.
CLOSE_FROM = {
    "promax-4dimm": "internals-promax-4dimm",
    "promax-8dimm": "internals-promax-8dimm",
}


def close_prompt(interior):
    """Instruction to fit the side panel back on, keeping everything else put."""
    return (
        f"This is {FORM[interior]} with its side panel removed. Fit the flat side "
        "panel back on so the machine is completely closed. The panel is plain "
        "brushed dark metal covering the whole side, hiding every internal "
        "component from view. "
        "Keep the chassis in exactly the same position, at the same size, in the "
        "same proportions and at the same camera angle as the original. Do not "
        "move, rotate or rescale the computer, and do not change its shape. Keep "
        "the front bezel, the feet and the outer frame unchanged. " + NO_TEXT
    )


def open_prompt(interior):
    """Instruction to take the removable panel off, keeping everything else put."""
    face, view = OPENING[interior]
    # Masked edits only ever repaint the opening, so what lands INSIDE it is the
    # whole picture. Left to itself the model staged an honest but useless shot:
    # a slim box seen from a low angle is mostly its own inner rear wall, with
    # the board squeezed into a strip along the bottom. Asking for the hardware
    # to fill the opening is the difference between "a dark empty box" and a
    # serviceability shot.
    fill = ("The motherboard and its components fill the whole opening from edge "
            "to edge and are large in frame. Do not show large areas of empty "
            "case floor, bare inner walls or empty shadow. Bright, even light "
            "inside so every component reads clearly. ") if interior in MASKED_OPEN else ""
    return (
        f"This is {FORM[interior]}. Remove its {face} to reveal the "
        f"interior, showing {CONTENTS[interior]}. "
        f"The camera looks {view}. " + fill +
        "Keep the chassis in exactly the same position, at the same size, in the "
        "same proportions and at the same camera angle as the original. Do not "
        "move, rotate or rescale the computer, and do not change its shape, and "
        "do not change how wide or how tall it is in the frame. Keep "
        "the front bezel, the feet and the outer frame unchanged. "
        "The interior is lit so the components are clearly readable. " + NO_TEXT
    )


def open_negative(interior):
    """
    Configuration-specific things that must NOT appear.

    The positive prompt saying "no graphics card" is not enough - the first MT
    edit fitted one anyway, and mt-ddr4 is precisely the build that ships
    without. What a machine does not have is part of its spec on a storefront,
    so it is stated as a negative as well.
    """
    c = CONTENTS[interior]
    extra = []
    if "no graphics card" in c:
        extra.append("graphics card, GPU, expansion card, video card, "
                     "card shroud, PCIe card")
    if "no internal power supply" in c:
        extra.append("power supply unit, PSU enclosure")
    if "two vertical" in c or "two horizontal" in c:
        extra.append("four memory modules, eight memory modules")
    # The PROMAX edits came back as blue-lit gaming cases. This is enterprise
    # hardware on a storefront, not a showcase build.
    extra.append("RGB lighting, blue LED glow, glass window, gaming PC")
    return (", " + ", ".join(extra)) if extra else ""


def build(interior):
    if interior not in CONTENTS:
        print(f"  {interior}: not a configured interior")
        return
    PAIRS.mkdir(parents=True, exist_ok=True)
    closed_path = PAIRS / f"closed-{interior}.png"
    open_path = PAIRS / f"open-{interior}.png"

    # --- PROMAX: interior -> edit CLOSED -------------------------------------
    if interior in CLOSE_FROM:
        src = HERE / "generated" / "components" / f"{CLOSE_FROM[interior]}.png"
        if not src.exists():
            print(f"  {interior:14s} needs {src.name}, not rendered")
            return
        if not open_path.exists():
            for_sampler(Image.open(src).convert("RGB")).save(open_path)
            print(f"  {interior:14s} open  <- {src.name} (existing interior render)")
        if closed_path.exists():
            print(f"  {interior:14s} closed: already built")
            return
        print(f"  {interior:14s} closed: fitting the panel on ...", flush=True)
        got = comfy_client.edit(str(open_path), None, close_prompt(interior),
                                f"closed-{interior}.png",
                                neg_extra=", open chassis, visible components, "
                                          "RGB lighting, glass window, gaming PC")
        im = Image.open(got).convert("RGB")
        ref = Image.open(open_path)
        if im.size != ref.size:
            im = im.resize(ref.size, Image.LANCZOS)
        im.save(closed_path)
        print(f"  {interior:14s} closed: saved {closed_path.name} {im.size}")
        return

    # 1. the closed frame - a photograph where one exists
    if not closed_path.exists():
        src = SOURCE[interior]
        flatten(IMAGES / src).save(closed_path)
        print(f"  {interior:14s} closed <- {src} (real photograph)")

    # 2. the open frame - the same chassis with its panel taken off
    if open_path.exists():
        print(f"  {interior:14s} open: already built")
        return
    small = PAIRS / f"_edit-in-{interior}.png"
    for_sampler(Image.open(closed_path).convert("RGB")).save(small)
    print(f"  {interior:14s} open: editing panel off "
          f"({Image.open(small).size[0]}x{Image.open(small).size[1]}) ...", flush=True)
    mask_path = None
    if interior in MASKED_OPEN:
        ap = PAIRS / f"aperture-{interior}.png"
        if ap.exists():
            mask_path = PAIRS / f"_edit-mask-{interior}.png"
            Image.open(ap).convert("L").resize(
                Image.open(small).size, Image.LANCZOS).save(mask_path)
        else:
            print(f"  {interior:14s} no aperture mask yet - editing unmasked")
    got = comfy_client.edit(str(small), None, open_prompt(interior),
                            f"open-{interior}.png",
                            neg_extra=open_negative(interior),
                            mask=str(mask_path) if mask_path else None,
                            mask_grow=MASK_GROW if mask_path else 0,
                            mask_feather=MASK_FEATHER if mask_path else 0)
    if mask_path:
        mask_path.unlink(missing_ok=True)
    small.unlink(missing_ok=True)
    im = Image.open(got).convert("RGB")
    ref = Image.open(closed_path)
    if im.size != ref.size:
        # Qwen renders on its own latent grid, so the edit returns at a different
        # resolution. This only restores the frame; fine registration is done by
        # silhouette fit in register_pairs.py.
        im = im.resize(ref.size, Image.LANCZOS)
    im.save(open_path)
    print(f"  {interior:14s} open: saved {open_path.name} {im.size[0]}x{im.size[1]}")


if __name__ == "__main__":
    for name in (sys.argv[1:] or list(CONTENTS)):
        build(name)

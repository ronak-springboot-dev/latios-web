"""
Generate proper studio product images from the shoot, on the local Qwen model.

This replaces the relight in shoot_studio.py, which was the wrong tool for the
job: it merged the model's lighting back under the photograph's own detail, so
the output was arithmetically almost the original frame -- a tidier version of a
desk snapshot, not a product image.

Here the photograph is a REFERENCE, not the canvas. Qwen-Image-Edit-2509 takes
it as conditioning and renders the shot again at full denoise: proper seamless
studio ground, soft key and fill, a real gradient falloff on the panel, a clean
contact shadow. That is what the model is built for and what an img2img pass at
low denoise cannot do, because at low denoise the office lighting is already
baked into the latent it starts from.

The risk that comes with full denoise is the one this project has hit before:
the wordmark coming back as lettering that merely resembles "latios". Checked at
1:1 on the first render, it does not -- Qwen-Image-Edit-2509 holds the mark, its
letterforms, its position and its orientation, and it holds the front port row
port for port. Every frame is checked the same way before it ships, and the
prompt names the wordmark, the ports and the badges explicitly so the sampler is
never guessing at them.

What it does NOT hold is the small gold PRO badge on the bezel. That is about
forty pixels in the source photograph, so it comes back as a gold blob with
lettering that only resembles "PRO". Compositing the real one back was tried and
made it worse: upscaling a 37px badge four times is blur plus a seam, and the
badge is not legible in the original at web size either. It stays as the model
draws it, which reads as a badge without claiming to spell anything.

Resolution comes from RealESRGAN x4 on the same GPU, so a 1024px render becomes
a 4096px master before it is fitted to the shipped canvas.

    python tools/image-processing/shoot_render.py --test front-mt
    python tools/image-processing/shoot_render.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

import comfy_client

HIRES = Path(r"C:\Ronak\Latios\Images\pipeline\hires")
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\render")

PLATE = (242, 242, 240)
WORK_LONG = 1024          # Qwen-Image-Edit's comfortable size on an 8GB card
DENOISE = 1.0             # a render, not a retouch

# Per-frame exceptions, decided by rendering the same frame at 0.65, 0.80 and
# 1.0 and looking at all four against the photograph.
#
# 1.0 is right for the tower views: the model knows that shape, and it came back
# with correct proportions, a legible wordmark and the front port column intact.
# It is wrong for anything slim or unusual. It rendered the SFF -- a slab whose
# depth is a fifth of its face -- as a small tower, grew a rear I/O panel onto a
# plain side panel, and closed an open chassis. Naming the form factor in the
# prompt helped the proportions but cost the wordmark, which is not a trade
# worth making on a site whose whole point is legible branding.
#
# 0.80 holds the machine: proportions, wordmark, port row, even the HDMI sticker,
# while still lifting the office lighting off it. Its background stays flat and
# unstudio-like, which costs nothing -- the finisher cuts the machine out and
# re-plates it on the site's own ground, so the backdrop the model invents is
# thrown away either way.
DENOISE_BY = {
    "front-sff": 0.80,
    "mt-angle": 0.80,
    "mt-flank": 0.80,
    "sff-top": 0.80,
}

# One prompt per kind of frame. Both name the machine as "this exact" and list
# what must not move, because the failure mode is not a bad picture -- it is a
# convincing picture of a computer Latios does not sell.
PROMPTS = {
    "front": (
        "Professional catalogue product photograph of this exact black desktop "
        "computer tower, centred on a seamless light grey studio background. "
        "Large soft key light from the upper left with a soft fill on the right, "
        "gentle specular highlight running along the top edge, soft contact "
        "shadow under the machine. Matte black textured panels, clean and free of "
        "dust and fingerprints. Identical chassis: same proportions, same panel "
        "seams, same vent pattern, same front port cluster, same badges, same "
        "Latios wordmark in the same place. Crisp focus, high detail, "
        "high-end commercial product photography."
    ),
    "detail": (
        "Professional catalogue product photograph of this exact black desktop "
        "computer chassis on a seamless light grey studio background, showing the "
        "same face and the same angle as the reference. Even soft studio lighting, "
        "soft contact shadow, clean matte surfaces. Every port, connector, screw, "
        "vent and printed label identical to the reference and legible. Crisp "
        "focus, high detail, commercial product photography."
    ),
    "closeup": (
        "Professional macro product photograph of this exact computer hardware, "
        "lit with even diffuse studio light and no harsh shadow. Every component, "
        "connector, socket, cable and printed marking identical to the reference "
        "and sharply legible. Clean surfaces, neutral white balance, high detail, "
        "commercial product photography."
    ),
}

# Per-frame prompt additions, where the shape itself is what the model gets
# wrong. At full denoise it read the SFF's reference as "a desktop tower seen at
# an angle" and rendered a tower: the silhouette it invented was a plausible
# computer, just not a small form factor one. Naming the proportions is cheaper
# and more reliable than turning the denoise down, which preserves the shape by
# preserving the office lighting with it.
FORM = {
    "front-sff": (" The machine is a slim small-form-factor desktop lying on its "
                  "side: a wide flat slab, depth roughly one fifth of its face, "
                  "NOT a tower and NOT a cube."),
    "sff-front": (" The machine is a slim small-form-factor desktop standing "
                  "upright on its narrow edge: tall, wide, and only a few "
                  "centimetres deep. NOT a tower."),
    "sff-angle": (" The machine is a slim small-form-factor desktop lying flat: a "
                  "wide shallow slab, NOT a tower."),
    "sff-top": (" The machine is a slim small-form-factor desktop standing on its "
                "narrow edge, seen from above its vented top panel."),
    "mt-flank": (" This is the plain vented SIDE panel of the tower. There is no "
                 "port cluster and no connector on this face."),
    # The tower's front column keeps getting smoothed into vague slots. Naming
    # its contents, in order, is what stops the sampler treating it as texture.
    "mt-angle": (" The front port column, top to bottom: a square power button, "
                 "a headphone jack, a microphone jack, two blue USB-A ports side "
                 "by side, one USB-C port, then a small gold badge. Render each "
                 "one as a distinct, recessed connector."),
    "mt-front": (" The front port column, top to bottom: a square power button, "
                 "a headphone jack, a microphone jack, two blue USB-A ports side "
                 "by side, one USB-C port, then a small gold badge. Render each "
                 "one as a distinct, recessed connector."),
    "sff-open": (" The chassis is OPEN with its side panel removed: the "
                 "motherboard, the CPU cooler, the drive cage and the power "
                 "supply are visible inside. Keep it open."),
}

NEG_EXTRA = (", different computer, different chassis, invented ports, extra buttons, "
             "misspelt wordmark, wrong logo, added branding, text artefacts, "
             "room background, desk, wall, floor, hands, cables outside the machine, "
             "reflections of a room, warm orange cast, glossy plastic, plastic toy")


def plate(rgba: Image.Image, long_edge: int) -> Image.Image:
    """Reference frame for the model: the cut-out, on the studio ground."""
    scale = long_edge / max(rgba.size)
    small = rgba.resize((max(1, round(rgba.width * scale)), max(1, round(rgba.height * scale))),
                        Image.LANCZOS)
    pad = round(long_edge * 0.08)
    canvas = Image.new("RGB", (small.width + 2 * pad, small.height + 2 * pad), PLATE)
    canvas.paste(small, (pad, pad), small)
    return canvas


def kind_of(name: str) -> str:
    if name.startswith("closeup-"):
        return "closeup"
    return "front" if name.startswith("front-") else "detail"


def render(name: str, seed: int = 11, denoise: float | None = None) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    dst = OUT / f"{name}.png"
    if dst.exists():
        print(f"  {name}: already rendered")
        return dst

    denoise = DENOISE_BY.get(name, DENOISE) if denoise is None else denoise
    rgba = Image.open(HIRES / f"{name}.png").convert("RGBA")
    kind = kind_of(name)
    ref = (plate(rgba, WORK_LONG) if kind != "closeup"
           else rgba.convert("RGB").resize(
               (round(rgba.width * WORK_LONG / max(rgba.size)),
                round(rgba.height * WORK_LONG / max(rgba.size))), Image.LANCZOS))
    ref_path = OUT / f"_ref-{name}.png"
    ref.save(ref_path)

    prompt = PROMPTS[kind] + FORM.get(name, "")
    lit = comfy_client.edit(str(ref_path), None, prompt, f"render-{name}.png",
                            seed=seed, neg_extra=NEG_EXTRA, denoise=denoise)
    big = comfy_client.upscale(str(lit), f"render-{name}-x4.png")
    Image.open(big).convert("RGB").save(dst)
    print(f"  {name}: {ref.size[0]}x{ref.size[1]} -> {Image.open(dst).size}")
    return dst


def sweep(name: str, values) -> None:
    """
    Render one frame at several denoise levels, side by side.

    Needed because 1.0 is not uniformly safe. It gave a clean catalogue shot of
    the MT and an honest rear I/O panel, but it also thickened the slim SFF into
    a small tower, grew a rear port cluster onto a side view that does not show
    one, and closed the open-chassis frame completely. The question is how much
    freedom the sampler can have before it stops rendering the machine that was
    photographed and starts designing one.
    """
    for d in values:
        tag = f"{name}--d{int(d * 100)}"
        target = OUT / f"{tag}.png"
        if target.exists():
            print(f"  {tag}: already rendered")
            continue
        rgba = Image.open(HIRES / f"{name}.png").convert("RGBA")
        ref = plate(rgba, WORK_LONG)
        ref_path = OUT / f"_ref-{tag}.png"
        ref.save(ref_path)
        lit = comfy_client.edit(str(ref_path), None,
                                PROMPTS[kind_of(name)] + FORM.get(name, ""),
                                f"render-{tag}.png", seed=11, neg_extra=NEG_EXTRA, denoise=d)
        big = comfy_client.upscale(str(lit), f"render-{tag}-x4.png")
        Image.open(big).convert("RGB").save(target)
        print(f"  {tag}: done")


def main() -> int:
    if "--sweep" in sys.argv:
        i = sys.argv.index("--sweep")
        sweep(sys.argv[i + 1], [float(v) for v in sys.argv[i + 2].split(",")])
        return 0

    # Whole-machine views only. The close-ups stay photographic on purpose: a
    # full-denoise render of a rear I/O cluster or a CPU socket is free to
    # invent a port, and on a spec sheet-driven B2B catalogue an invented port
    # is a false claim. They are also the frames that gain least -- straight off
    # the camera they are 50 megapixels of real hardware.
    names = sorted(p.stem for p in HIRES.glob("*.png") if not p.stem.startswith("closeup-"))
    if "--test" in sys.argv:
        names = [sys.argv[sys.argv.index("--test") + 1]]
    for n in names:
        render(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())

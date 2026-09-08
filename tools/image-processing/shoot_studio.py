"""
Studio pass over the real product photographs, on the local Qwen-Image-Edit.

The photographs are honest but they were shot on a desk under office light:
uneven falloff across the panel, a warm cast down one side, dust and finger
marks on a matte black chassis that show every one of them. This relights them
into catalogue product shots without letting the model reinvent the hardware.

Two rules make that safe, and both matter:

  Low denoise. The sampler starts from the encoded photograph rather than from
  noise, so the silhouette, the port row and the wordmark are already there and
  only the lighting moves. At 1.0 the model re-stages the shot and the Latios
  wordmark comes back misspelt, which is the failure this project has hit every
  previous time it reached for a GPU.

  Frequency separation on the way out. Only the LOW frequencies of the model's
  output are kept -- the lighting, the falloff, the tonality. Every edge, every
  letter, every port label comes back from the real photograph at full camera
  resolution. So the branding is not "preserved carefully", it is arithmetically
  the original: the model never gets a vote on what the text says.

That also solves resolution. The model works at about a megapixel; the detail
layer is 2400 to 8000px straight off the camera, and the recombination happens
at that size, so the shipped asset is sharper than the model could draw.

    python tools/image-processing/shoot_studio.py --test mt
    python tools/image-processing/shoot_studio.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

import comfy_client

HIRES = Path(r"C:\Ronak\Latios\Images\pipeline\hires")
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\studio")

# The plate the model relights against, and the one the site uses.
PLATE = (242, 242, 240)

# Qwen-Image-Edit wants roughly a megapixel. Larger is slower and, on an 8GB
# card, starts offloading per step; it also buys nothing here, since only the
# LOW frequencies of this output survive the recombination. The split radius
# scales with the image, so a 960px render blurred and upscaled carries exactly
# the same illumination a 1280px one would -- at about half the GPU time, which
# over twenty frames is the difference between one hour and three.
WORK_LONG = 960

# 0.25, chosen by test render, not by taste. It is enough for the model to
# rebuild the illumination across a panel and lift the office cast, and low
# enough that the geometry does not drift -- which matters more than usual here,
# because the detail layer is registered to the ORIGINAL frame, so any drift in
# the lit layer would show up as a soft double edge after recombination.
DENOISE = 0.25

# Radius of the split, in pixels of the WORKING image, scaled up with it. Large
# enough that only illumination crosses over; anything that reads as an edge,
# a letter or a port stays on the detail side.
SPLIT_RADIUS = 14

PROMPT = (
    "Professional studio product photograph of this exact black desktop computer "
    "chassis on a seamless light grey background. Keep the machine identical: same "
    "shape, same proportions, same panel lines, same ports, same badges, same "
    "Latios wordmark. Only improve the lighting: soft even studio light, gentle "
    "highlight along the top edge, clean matte black surface with no dust, no "
    "fingerprints and no smudges, neutral white balance, sharp focus."
)
NEG_EXTRA = (", different computer, altered logo, changed ports, added text, "
             "reflections of a room, colored lighting, glossy plastic")

# The close-ups are not a machine on a stage, they are a surface: a port cluster,
# an open chassis, a socket. Asking for "a product on a seamless background"
# there makes the model want to cut the subject out of its own housing, so they
# get a lighting instruction instead of a staging one.
CLOSEUP_PROMPT = (
    "Professional close-up product photograph of computer hardware. Keep every "
    "component, connector, label and printed marking exactly as it is. Only "
    "improve the lighting: even diffuse studio light with no harsh shadow and no "
    "blown highlight, neutral white balance, clean surfaces without dust, "
    "sharp focus across the frame."
)
CLOSEUP_NEG = (", different hardware, altered labels, added text, missing ports, "
               "cartoon, illustration, oversaturated")


def fit(img: Image.Image, long_edge: int) -> Image.Image:
    """Scale to the model's working size, no plate, no margin."""
    scale = long_edge / max(img.size)
    return img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))),
                      Image.LANCZOS)


def plate(rgba: Image.Image, long_edge: int) -> Image.Image:
    """Put the cut-out on the studio ground at working size, with a margin."""
    scale = long_edge / max(rgba.size)
    small = rgba.resize((max(1, round(rgba.width * scale)), max(1, round(rgba.height * scale))),
                        Image.LANCZOS)
    pad = round(long_edge * 0.06)
    canvas = Image.new("RGB", (small.width + 2 * pad, small.height + 2 * pad), PLATE)
    canvas.paste(small, (pad, pad), small)
    return canvas


def recombine(lit: Image.Image, detail: Image.Image, radius: float) -> Image.Image:
    """
    Low frequencies from `lit`, high frequencies from `detail`.

    detail - blur(detail) is the high-pass; adding it to blur(lit) puts the
    photograph's edges and lettering back on top of the model's illumination.
    Both are blurred with the same radius so the split is symmetric and the sum
    reconstructs the original exactly when lit == detail.
    """
    lo = np.asarray(lit.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
    d = np.asarray(detail, dtype=np.float32)
    d_lo = np.asarray(detail.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
    return Image.fromarray(np.clip(lo + (d - d_lo), 0, 255).astype(np.uint8))


def studio(name: str, denoise: float = DENOISE, seed: int = 7, plated: bool = True) -> Path:
    """
    Relight one frame and put the camera's detail back at full resolution.

    `plated` frames are a whole machine that was cut out of the room, so they go
    to the model already standing on the studio ground. A close-up keeps its
    full frame: cutting a CPU socket out of the motherboard it is bolted to
    would be meaningless, and its background is the product anyway.
    """
    OUT.mkdir(parents=True, exist_ok=True)
    dst = OUT / f"{name}.png"
    if dst.exists():                      # each render is minutes; make the batch resumable
        print(f"  {name}: already done")
        return dst
    rgba = Image.open(HIRES / f"{name}.png").convert("RGBA")

    work = plate(rgba, WORK_LONG) if plated else fit(rgba.convert("RGB"), WORK_LONG)
    work_path = OUT / f"_work-{name}.png"
    work.save(work_path)

    lit_path = comfy_client.edit(str(work_path), None,
                                 PROMPT if plated else CLOSEUP_PROMPT,
                                 f"studio-{name}.png", seed=seed,
                                 neg_extra=NEG_EXTRA if plated else CLOSEUP_NEG,
                                 denoise=denoise)

    # Back to the photograph's own size, on the same ground, and recombine there.
    full = plate(rgba, max(rgba.size)) if plated else rgba.convert("RGB")
    lit = Image.open(lit_path).convert("RGB").resize(full.size, Image.LANCZOS)
    radius = SPLIT_RADIUS * max(full.size) / max(work.size)
    merged = recombine(lit, full, radius)

    if plated:
        # The plate is flat by construction; keep the model's version of it well
        # away from the output, or its texture shows as banding behind the
        # product. Only the pixels inside the cut-out are taken.
        alpha = Image.new("L", full.size, 0)
        alpha.paste(rgba.getchannel("A"), ((full.width - rgba.width) // 2,
                                           (full.height - rgba.height) // 2))
        out = Image.new("RGB", full.size, PLATE)
        out.paste(merged, (0, 0), alpha)
    else:
        out = merged

    out.save(dst)
    print(f"  {name}: {work.size[0]}x{work.size[1]} model -> {out.size[0]}x{out.size[1]} shipped")
    return dst


def main() -> int:
    names = sorted(p.stem for p in HIRES.glob("*.png"))
    if "--test" in sys.argv:
        which = sys.argv[sys.argv.index("--test") + 1]
        for d in (0.25, 0.32, 0.45):
            studio(which, denoise=d, seed=7)
            Path(OUT / f"{which}.png").rename(OUT / f"test-{which}-d{int(d*100)}.png")
        return 0
    for n in names:
        studio(n, plated=not n.startswith("closeup-"))
    return 0


if __name__ == "__main__":
    sys.exit(main())

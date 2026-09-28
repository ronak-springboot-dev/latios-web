"""The professional-graphics hero banner, regenerated at enterprise grade.

What it replaces. banner-nvidia-gpu.webp is a dark, low-contrast render of a
vague consumer-looking card: a fan ring floating in a grey field with no board,
no bracket and no shroud detail. On the homepage hero it reads as a smudge, and
it is the frame the "Clarity at Any Scale" slide happened to draw.

What it is now. A full-height professional workstation card of the kind the
PROMAX range actually takes -- blower-cooled, single slot, matte dark shroud,
display brackets and PCIe contacts visible -- lit like a product photograph
rather than a wallpaper.

AND IT CARRIES NO BRAND MARK, which is the whole reason this is generated
brand-free rather than "generate an Ada card". brand_composite.py states the
rule this project runs on:

    "The image model cannot render the wordmark reliably... So we never ask it
     to. Instead the scene is generated brand-free, and the genuine assets are
     composited in afterwards."

That applies with more force to somebody else's trademark than to our own.
There is no NVIDIA artwork on disk, none may be drawn, and a model asked for
one returns a garbled near-miss -- the deleted laptop banner carried a
fabricated GeForce badge and a fabricated Ryzen badge, which is exactly the
failure. So the prompt describes a CLASS of hardware, never a brand, and the
negative names the marks the model reaches for anyway.

The file is named for what it is. `banner-nvidia-gpu` promised a vendor whose
mark is not in the picture and cannot be; `banner-pro-gpu` is what this is.

    python gen_gpu_banner.py
    python gen_gpu_banner.py --force
"""
import os
import sys
import uuid
from pathlib import Path

import gen_components as gc

os.environ.setdefault("LATIOS_UNET", "2511")

OUT = Path(__file__).parent / "generated" / "banners"
WIDE = (1664, 928)

#: Described as hardware, not as a product line. Every term here is a physical
#: feature someone could point at on the card -- shroud, blower, fin stack,
#: bracket, contacts -- because those are the things the model renders well.
#: Anything nameable as a BRAND is something it will try to letter, and it
#: cannot letter.
PROMPT = (
    "a professional workstation graphics card photographed on a dark studio "
    "background, three-quarter view from slightly above: a full-height single "
    "slot card with a matte charcoal anodised aluminium shroud in clean angular "
    "facets, one centred radial blower fan with a machined metal ring, a dense "
    "stack of thin copper heatsink fins visible along the top edge, a black "
    "anodised display bracket with four ports at one end, gold PCIe edge "
    "contacts along the bottom, a plain unmarked backplate, crisp specular "
    "highlights along the machined edges, cool white key light from the upper "
    "left with a soft blue rim light from behind, deep shadow falling away to "
    "the right, sharp focus across the card, high detail product photography, "
    "no markings of any kind on the shroud or the backplate"
)

#: The brands by name. The model has produced 'Lohxs', 'DDR2V' and a fabricated
#: GeForce badge in this project; the way to not get a garbled trademark is to
#: ask for no trademark.
NEG = gc.NEG + (
    ", nvidia, geforce, rtx, quadro, amd, radeon, intel, asus, msi, gigabyte, "
    "brand logo, manufacturer logo, product name, model number, serial number, "
    "green pcb, rgb lighting, gamer aesthetic, neon, dragon, flames, "
    "person, hands, blurry, out of focus, low detail"
)


def t2i(name, size, prompt):
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    g = gc.graph(prompt, seed, upscale=True, neg=NEG)
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


if __name__ == "__main__":
    force = "--force" in sys.argv
    name = "pro-gpu"
    if not force and (OUT / f"{name}.png").exists():
        print(f"{name}: have it (--force to re-roll)", flush=True)
    else:
        t2i(name, WIDE, PROMPT)
    print("done", flush=True)

"""
Render the component set for the PDP breakdown sections.

These depict STANDARD PARTS the systems contain — a DDR5 module, an M.2 drive,
a cooler, a PSU. They are not a diagram of a Latios interior: there is exactly
one photograph of real Latios internals and it covers a single viewpoint, so an
exploded chassis would have to invent board position, port counts and bay
layout. The site captions them as components for the same reason.

Generating these is safe under the rule that broke the earlier pass: a DIMM or a
cooler carries no wordmark, so there is no lettering for the model to garble.
Anything bearing an Intel, AMD or NVIDIA mark still comes from a cropped
photograph, never from here.

Stack: Qwen-Image base Q6_K (Apache-2.0) + RealESRGAN x4plus. Rendering at the
model's native resolution and upscaling afterwards gives markedly more clarity
than asking the model for a large canvas, and the upscale contributes more than
the quant does. RealESRGAN rather than UltraSharpV2, which is sharper but
CC-BY-NC-SA and this is a storefront.

    python gen_components.py            # all
    python gen_components.py ddr5 m2    # a subset
"""
import json
import sys
import time
import urllib.request
import uuid
from pathlib import Path

API = "http://127.0.0.1:8188"
COMFY = Path(r"C:\Ronak\ComfyUI")
OUT = Path(__file__).parent / "generated" / "components"

UNET = "qwen-image-Q6_K.gguf"
CLIP = "qwen_2.5_vl_7b_fp8_scaled.safetensors"
VAE = "qwen_image_vae.safetensors"
UPSCALER = "RealESRGAN_x4plus.pth"

SIZE = 1328          # Qwen-Image's native training resolution
STEPS = 20
CFG = 3.0

# A shared look, so the set reads as one family rather than seven stock images.
STYLE = ("Ultra-detailed studio product render, single object centred on a plain "
         "seamless light grey background, soft large-softbox key light from the "
         "upper left, gentle rim light, subtle contact shadow, shallow depth of "
         "field, industrial product photography, photorealistic, sharp micro "
         "detail on surfaces, neutral colour, 8k")

# Interiors need their own style. Appending STYLE to them was a real bug: STYLE
# says "plain seamless light grey background", which overrode the "pure black
# background" in the interior prompts, so every plate came back on light grey
# and read as a rectangle pasted onto the page.
DARK_STYLE = ("Ultra-detailed technical product render on a pure black seamless "
              "background, dramatic low-key studio lighting, cool blue rim light "
              "raking from the left, deep shadows, photorealistic, sharp micro "
              "detail on machined surfaces, no background objects, 8k")

NEG = ("text, lettering, words, logo, brand name, badge, sticker, watermark, "
       "label, numbers, packaging, box, hands, person, cluttered background, "
       "multiple objects, blurry, low detail, cartoon, illustration")

JOBS = {
    "ddr5": "A single black DDR5 desktop memory module standing upright at a slight "
            "three-quarter angle, matte black aluminium heatspreader with a fine "
            "brushed finish, gold contact pins along the bottom edge catching the "
            "light. " + STYLE,
    "m2": "A single M.2 NVMe solid state drive lying flat at a three-quarter angle, "
          "bare green-black PCB with a slim matte black aluminium heatsink over the "
          "flash packages, gold edge connector. " + STYLE,
    "cooler": "A tower CPU air cooler, dense stack of thin aluminium fins with four "
              "copper heatpipes rising through them, a single matte black fan mounted "
              "on the front, standing upright at a three-quarter angle. " + STYLE,
    "psu": "A modular ATX desktop power supply unit, matte black steel casing with a "
           "large fan grille on the top face and a row of modular cable sockets on the "
           "front panel, three-quarter angle. " + STYLE,
    "fan": "A single 120mm case fan, matte black frame with nine translucent smoke "
           "grey blades and a plain black hub, viewed at a slight three-quarter angle. "
           + STYLE,
    "heatsink": "A low-profile aluminium chipset heatsink, machined fins in parallel "
                "rows with a dark anodised finish, viewed at a three-quarter angle. "
                + STYLE,
    # --- interiors for the scroll reveals -------------------------------------
    # Freely generated, but the ARRANGEMENT comes from the one real interior
    # photograph (generated/internals-ref2.jpg), which is shot through the hex
    # mesh and establishes a standard ATX layout and little else. Hardware is
    # accurate to each configuration: a graphics card only where one ships,
    # four DIMM slots only where four exist, eight and liquid cooling only on
    # the T4 Plus. Captioned as illustrative on the site.
    "internals-mt-ddr4": "Cutaway interior of a black micro-tower desktop computer viewed straight on with the side panel removed, a dark ATX motherboard filling the left and centre, a black tower air cooler over the socket, two vertical DDR4 memory modules, empty full-height expansion slots below with no graphics card fitted, a matte black power supply enclosure at the lower right with a drive cage above it, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-mt-ddr4-gpu": "Cutaway interior of a black micro-tower desktop computer viewed straight on with the side panel removed, a dark ATX motherboard filling the left and centre, a black tower air cooler over the socket, two vertical DDR4 memory modules, one long black professional graphics card fitted horizontally in the top expansion slot, a matte black power supply enclosure at the lower right with a drive cage above it, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-mt-ddr5-gpu": "Cutaway interior of a black micro-tower desktop computer viewed straight on with the side panel removed, a dark ATX motherboard filling the left and centre, a black tower air cooler with copper heatpipes, two vertical DDR5 memory modules, one long black professional graphics card fitted horizontally in the top expansion slot, a matte black power supply enclosure at the lower right with a drive cage above it, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-mt-ddr5-amd": "Cutaway interior of a black micro-tower desktop computer viewed straight on with the side panel removed, a dark ATX motherboard filling the left and centre, a compact black air cooler with a circular fan, two vertical DDR5 memory modules, empty expansion slots below with no graphics card fitted, a matte black power supply enclosure at the lower right, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-sff-ddr5": "Cutaway interior of a slim black small-form-factor desktop computer viewed straight on with the side panel removed, a compact motherboard across the base, a low-profile copper-finned cooler, two vertical DDR5 memory modules, an M.2 drive under a slim heatsink and no graphics card, a small TFX power supply enclosure at one end and a blower fan at the other, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-sff-4dimm": "Cutaway interior of a slim black small-form-factor desktop computer viewed straight on with the side panel removed, a compact motherboard across the base, a low-profile copper-finned cooler, four vertical DDR5 memory modules in a row, an M.2 drive under a slim heatsink, a small TFX power supply enclosure at one end and a blower fan at the other, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-promax-4dimm": "Cutaway interior of a large black workstation tower desktop computer viewed straight on with the side panel removed, a wide workstation motherboard, a tall twin-fan tower air cooler, four vertical DDR5 ECC memory modules in a row, one very long professional graphics card with a full-length shroud, a large matte black power supply enclosure with a shroud, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-promax-8dimm": "Cutaway interior of a large black workstation tower desktop computer viewed straight on with the side panel removed, a wide server-class motherboard, a closed-loop liquid cooling block with two braided tubes running to a radiator, eight vertical ECC registered memory modules in two banks of four, two very long professional graphics cards stacked in the expansion slots, two redundant power supply modules side by side at the base, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "internals-mff": "Cutaway interior of a very small black mini PC desktop computer viewed straight on with the side panel removed, a tiny motherboard filling the base, a low-profile blower fan and heatsink, two horizontal SO-DIMM laptop memory modules, a single M.2 drive, no graphics card, an external power input, no internal power supply, neat black cable runs curving between them, faint circuit-board trace detail. no text, no lettering. " + DARK_STYLE,
    "nvme-stack": "Four M.2 NVMe solid state drives fanned out in a neat overlapping "
                  "row, each with a slim matte black aluminium heatsink and gold edge "
                  "connectors. " + STYLE,
}


def _post(path, payload=None, timeout=3600):
    req = (urllib.request.Request(API + path, data=json.dumps(payload).encode(),
                                  headers={"Content-Type": "application/json"})
           if payload is not None else urllib.request.Request(API + path))
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def graph(prompt, seed, upscale=True, neg=None):
    """
    The render graph. `upscale` runs the 4x RealESRGAN pass to 5312px.

    Worth it for the component cutouts, which are matted and reused at several
    sizes. Not worth it for the marketing bands, which are composited at 1200px
    and would throw away 95% of those pixels - so those skip it and save the
    upscale time on every one of forty-five renders.
    """
    g = {
        "1": {"class_type": "UnetLoaderGGUF", "inputs": {"unet_name": UNET}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": CLIP, "type": "qwen_image"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": prompt}},
        "5": {"class_type": "CLIPTextEncode",
              "inputs": {"clip": ["2", 0], "text": neg or NEG}},
        "6": {"class_type": "EmptySD3LatentImage",
              "inputs": {"width": SIZE, "height": SIZE, "batch_size": 1}},
        "7": {"class_type": "KSampler",
              "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0],
                         "latent_image": ["6", 0], "seed": seed, "steps": STEPS,
                         "cfg": CFG, "sampler_name": "euler", "scheduler": "simple",
                         "denoise": 1.0}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["7", 0], "vae": ["3", 0]}},
    }
    if upscale:
        g["9"] = {"class_type": "UpscaleModelLoader", "inputs": {"model_name": UPSCALER}}
        g["10"] = {"class_type": "ImageUpscaleWithModel",
                   "inputs": {"upscale_model": ["9", 0], "image": ["8", 0]}}
    g["11"] = {"class_type": "SaveImage",
               "inputs": {"images": ["10" if upscale else "8", 0],
                          "filename_prefix": "component"}}
    return g


def wait(pid, limit=5400):
    t0 = time.time()
    while time.time() - t0 < limit:
        h = _post(f"/history/{pid}")
        if pid in h:
            e = h[pid]
            if e.get("status", {}).get("status_str") == "error":
                raise RuntimeError(json.dumps(e["status"])[:600])
            files = [i for o in e.get("outputs", {}).values() for i in o.get("images", [])]
            if files:
                return files, time.time() - t0
        time.sleep(5)
    raise TimeoutError(f"no result after {limit}s")


def render(name, prompt, upscale=True, neg=None):
    """
    Render one arbitrary prompt through the same graph as the catalogue jobs.

    Split out of run() so callers with prompts of their own — open_chassis.py
    needs closed PROMAX bodies that were never photographed — get the identical
    sampler, upscaler and output handling rather than a second near-copy of it.
    """
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    pid = _post("/prompt", {"prompt": graph(prompt, seed, upscale, neg),
                            "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"{name}: queued {pid} (seed {seed})", flush=True)
    files, secs = wait(pid)
    f = files[0]
    src = COMFY / "output" / (f.get("subfolder") or "") / f["filename"]
    dest = OUT / f"{name}.png"
    dest.write_bytes(src.read_bytes())
    print(f"  {name:12s} -> {dest.name}  {dest.stat().st_size // 1024} KB  in {secs/60:.1f} min", flush=True)
    return dest


def run(name):
    return render(name, JOBS[name])


if __name__ == "__main__":
    for n in (sys.argv[1:] or list(JOBS)):
        try:
            run(n)
        except Exception as e:
            print(f"  FAILED {n}: {type(e).__name__}: {e}", flush=True)

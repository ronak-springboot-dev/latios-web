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
    # --- internals plates for the airflow composite ---------------------------
    # Freely generated, but the arrangement is taken from the one real interior
    # photograph (generated/internals-ref2.jpg). That shot is through the hex
    # mesh so it is heavily occluded; what it reliably establishes is a standard
    # ATX micro-tower layout — rear expansion brackets across the top, a cable
    # run curving in from the upper left, one long horizontal component across
    # the middle, a PSU/drive block to one side. Component placement below is
    # therefore illustrative, and captioned as such on the site.
    "internals-mt": "Cutaway interior of a black micro-tower desktop computer viewed "
                    "straight on, standard ATX layout: a dark motherboard filling the "
                    "left and centre with a black tower CPU cooler, two vertical memory "
                    "modules beside it, a row of rear expansion slot brackets along the "
                    "top edge, a matte black power supply enclosure at the lower right, "
                    "a drive cage above it, neat black cable runs curving between them, "
                    "faint blue circuit-board detail. Dark technical product cutaway, "
                    "pure black background, cool rim lighting from the left, "
                    "photorealistic, sharp detail, no text. " + STYLE,
    "internals-sff": "Cutaway interior of a slim black small-form-factor desktop "
                     "computer viewed straight on, compact layout: a dark motherboard "
                     "across the base with a low-profile copper-finned cooler, one "
                     "vertical memory module, an M.2 drive under a slim heatsink, a "
                     "small TFX power supply enclosure at one end, a blower fan at the "
                     "other, short tidy cable runs. Dark technical product cutaway, "
                     "pure black background, cool rim lighting, photorealistic, sharp "
                     "detail, no text. " + STYLE,
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


def graph(prompt, seed):
    return {
        "1": {"class_type": "UnetLoaderGGUF", "inputs": {"unet_name": UNET}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": CLIP, "type": "qwen_image"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": prompt}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": NEG}},
        "6": {"class_type": "EmptySD3LatentImage",
              "inputs": {"width": SIZE, "height": SIZE, "batch_size": 1}},
        "7": {"class_type": "KSampler",
              "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0],
                         "latent_image": ["6", 0], "seed": seed, "steps": STEPS,
                         "cfg": CFG, "sampler_name": "euler", "scheduler": "simple",
                         "denoise": 1.0}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["7", 0], "vae": ["3", 0]}},
        "9": {"class_type": "UpscaleModelLoader", "inputs": {"model_name": UPSCALER}},
        "10": {"class_type": "ImageUpscaleWithModel",
               "inputs": {"upscale_model": ["9", 0], "image": ["8", 0]}},
        "11": {"class_type": "SaveImage",
               "inputs": {"images": ["10", 0], "filename_prefix": "component"}},
    }


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


def run(name):
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    pid = _post("/prompt", {"prompt": graph(JOBS[name], seed),
                            "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"{name}: queued {pid} (seed {seed})", flush=True)
    files, secs = wait(pid)
    f = files[0]
    src = COMFY / "output" / (f.get("subfolder") or "") / f["filename"]
    dest = OUT / f"{name}.png"
    dest.write_bytes(src.read_bytes())
    print(f"  {name:12s} -> {dest.name}  {dest.stat().st_size // 1024} KB  in {secs/60:.1f} min", flush=True)


if __name__ == "__main__":
    for n in (sys.argv[1:] or list(JOBS)):
        try:
            run(n)
        except Exception as e:
            print(f"  FAILED {n}: {type(e).__name__}: {e}", flush=True)

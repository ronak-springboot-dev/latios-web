"""
Drive the local Forge (Stable Diffusion WebUI Forge) API with FLUX.1-schnell GGUF.

Forge needs three things wired up for FLUX:
  1. the GGUF as the checkpoint          (models/Stable-diffusion)
  2. the VAE + both text encoders as     (models/VAE, models/text_encoder)
     `forge_additional_modules`
  3. Distilled CFG ~1.0 and low steps    (schnell is a 4-step distilled model)

Usage:
    python forge_client.py setup                 # point Forge at the FLUX stack
    python forge_client.py t2i "<prompt>" out.png [W H]
    python forge_client.py i2i ref.jpg "<prompt>" out.png [denoise]
"""
import base64
import io
import json
import sys
import time
import urllib.request

API = "http://127.0.0.1:7860"
OUT_DIR = "generated"

UNET = "flux1-schnell-Q4_K_S.gguf"
MODULES = [
    "ae.safetensors",
    "clip_l.safetensors",
    "t5xxl_fp8_e4m3fn.safetensors",
]

# schnell is distilled: 4 steps, CFG 1. Higher values just burn time / wash it out.
STEPS = 6
CFG = 1.0
DISTILLED_CFG = 3.5


def _post(path, payload, timeout=1800):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def _get(path, timeout=120):
    with urllib.request.urlopen(API + path, timeout=timeout) as r:
        return json.loads(r.read().decode())


def setup():
    """Select the FLUX checkpoint and attach VAE + text encoders."""
    models = [m["model_name"] for m in _get("/sdapi/v1/sd-models")]
    match = next((m for m in models if UNET.split(".")[0] in m), None)
    if not match:
        print("FLUX GGUF not found. Forge sees:", models)
        print("(if the download just finished, POST /sdapi/v1/refresh-checkpoints first)")
        sys.exit(1)

    _post("/sdapi/v1/options", {
        "sd_model_checkpoint": match,
        "forge_additional_modules": MODULES,
        "forge_inference_memory": 1024,  # leave headroom on an 8GB card
    }, timeout=900)
    opts = _get("/sdapi/v1/options")
    print("checkpoint :", opts.get("sd_model_checkpoint"))
    print("modules    :", opts.get("forge_additional_modules"))


def _save(resp, out):
    img = base64.b64decode(resp["images"][0])
    path = f"{OUT_DIR}/{out}"
    with open(path, "wb") as f:
        f.write(img)
    print(f"saved {path} ({len(img)//1024}KB)")


def t2i(prompt, out, w=1600, h=1000):
    t = time.time()
    r = _post("/sdapi/v1/txt2img", {
        "prompt": prompt,
        "negative_prompt": "text, watermark, logo, brand name, lettering, signature",
        "steps": STEPS, "cfg_scale": CFG, "distilled_cfg_scale": DISTILLED_CFG,
        "width": w, "height": h, "sampler_name": "Euler", "scheduler": "Simple",
    })
    _save(r, out)
    print(f"  {time.time()-t:.0f}s")


def i2i(ref, prompt, out, denoise=0.65):
    with open(ref, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    t = time.time()
    r = _post("/sdapi/v1/img2img", {
        "init_images": [b64],
        "prompt": prompt,
        "negative_prompt": "text, watermark, logo, brand name, lettering, signature",
        "denoising_strength": denoise,
        "steps": STEPS, "cfg_scale": CFG, "distilled_cfg_scale": DISTILLED_CFG,
        "sampler_name": "Euler", "scheduler": "Simple",
    })
    _save(r, out)
    print(f"  {time.time()-t:.0f}s")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "setup"
    if cmd == "setup":
        setup()
    elif cmd == "t2i":
        t2i(sys.argv[2], sys.argv[3],
            int(sys.argv[4]) if len(sys.argv) > 4 else 1600,
            int(sys.argv[5]) if len(sys.argv) > 5 else 1000)
    elif cmd == "i2i":
        i2i(sys.argv[2], sys.argv[3], sys.argv[4],
            float(sys.argv[5]) if len(sys.argv) > 5 else 0.65)
    else:
        print(__doc__)

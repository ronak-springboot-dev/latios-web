"""
Drive the local ComfyUI with Qwen-Image-Edit-2509 (GGUF, Apache-2.0).

Why this exists
---------------
The previous attempt at "Latios product in a room" pasted a flat cutout onto a
generated scene: no perspective, no light match, no contact shadow, and — worse
— the pasted product was itself AI-generated, wearing a misspelt wordmark. This
model does the job properly: it takes the REAL photograph of the real chassis
and re-renders it into the scene, preserving identity and lettering, which is
precisely what Qwen-Image-Edit is built for and what plain img2img cannot do.

Deliberately separate from the Forge/FLUX stack at
C:\\Ronak\\webui_forge_cu121_torch231 — that install is not touched.

Usage:
    python comfy_client.py check
    python comfy_client.py edit <scene.png> <product.webp> "<instruction>" out.png
"""
import json
import sys
import time
import urllib.request
import urllib.error
import uuid
from pathlib import Path

API = "http://127.0.0.1:8188"
COMFY = Path(r"C:\Ronak\ComfyUI")
IN_DIR = COMFY / "input"
OUT_DIR = COMFY / "output"
LOCAL_OUT = Path(__file__).parent / "generated"

UNET = "Qwen-Image-Edit-2509-Q4_K_M.gguf"
CLIP = "qwen_2.5_vl_7b_fp8_scaled.safetensors"
VAE = "qwen_image_vae.safetensors"

# Qwen-Image-Edit is not a distilled model: it wants real steps and real CFG,
# unlike FLUX schnell which is tuned for 4 steps at CFG 1.
STEPS = 20
CFG = 2.5

NEG = ("blurry, low quality, distorted text, misspelled lettering, duplicated logo, "
       "extra logos, watermark, deformed hardware, floating object, harsh cutout edge")


def _req(path, payload=None, timeout=1800):
    url = API + path
    if payload is None:
        req = urllib.request.Request(url)
    else:
        req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                     headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def check():
    """Confirm the server is up and every weight + node this workflow needs exists."""
    try:
        info = _req("/object_info")
    except Exception as e:
        print(f"ComfyUI not reachable at {API}: {e}")
        return False

    ok = True
    for node in ("UnetLoaderGGUF", "CLIPLoader", "VAELoader", "KSampler", "VAEDecode"):
        present = node in info
        print(f"  node {node:32s} {'ok' if present else 'MISSING'}")
        ok &= present

    encoder = next((n for n in ("TextEncodeQwenImageEditPlus", "TextEncodeQwenImageEdit")
                    if n in info), None)
    print(f"  node {'<qwen edit encoder>':32s} {encoder or 'MISSING'}")
    ok &= encoder is not None

    def opts(node, field):
        try:
            return info[node]["input"]["required"][field][0]
        except Exception:
            return []

    for label, node, field, want in (
        ("unet", "UnetLoaderGGUF", "unet_name", UNET),
        ("clip", "CLIPLoader", "clip_name", CLIP),
        ("vae", "VAELoader", "vae_name", VAE),
    ):
        avail = opts(node, field)
        present = want in avail
        print(f"  {label:4s} {want:44s} {'ok' if present else 'MISSING'}")
        if not present and avail:
            print(f"       (available: {avail})")
        ok &= present
    return ok


def _graph(scene_name, product_name, prompt, seed):
    """Qwen-Image-Edit graph in ComfyUI API format."""
    info = _req("/object_info")
    enc = "TextEncodeQwenImageEditPlus" if "TextEncodeQwenImageEditPlus" in info \
          else "TextEncodeQwenImageEdit"
    two_images = "image2" in info[enc]["input"].get("optional", {})

    pos_inputs = {"clip": ["2", 0], "prompt": prompt, "vae": ["3", 0], "image1": ["4", 0]}
    neg_inputs = {"clip": ["2", 0], "prompt": NEG, "vae": ["3", 0], "image1": ["4", 0]}
    if two_images and product_name:
        pos_inputs["image2"] = ["5", 0]
        neg_inputs["image2"] = ["5", 0]

    g = {
        "1": {"class_type": "UnetLoaderGGUF", "inputs": {"unet_name": UNET}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": CLIP, "type": "qwen_image"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "LoadImage", "inputs": {"image": scene_name}},
        "6": {"class_type": enc, "inputs": pos_inputs},
        "7": {"class_type": enc, "inputs": neg_inputs},
        "8": {"class_type": "VAEEncode", "inputs": {"pixels": ["4", 0], "vae": ["3", 0]}},
        "9": {"class_type": "KSampler",
              "inputs": {"model": ["1", 0], "positive": ["6", 0], "negative": ["7", 0],
                         "latent_image": ["8", 0], "seed": seed, "steps": STEPS,
                         "cfg": CFG, "sampler_name": "euler", "scheduler": "simple",
                         "denoise": 1.0}},
        "10": {"class_type": "VAEDecode", "inputs": {"samples": ["9", 0], "vae": ["3", 0]}},
        "11": {"class_type": "SaveImage",
               "inputs": {"images": ["10", 0], "filename_prefix": "latios"}},
    }
    if two_images and product_name:
        g["5"] = {"class_type": "LoadImage", "inputs": {"image": product_name}}
    return g


def _wait(prompt_id, poll=3, limit=3600):
    t0 = time.time()
    while time.time() - t0 < limit:
        h = _req(f"/history/{prompt_id}")
        if prompt_id in h:
            entry = h[prompt_id]
            status = entry.get("status", {})
            if status.get("status_str") == "error":
                raise RuntimeError(json.dumps(status)[:800])
            files = [i for o in entry.get("outputs", {}).values()
                     for i in o.get("images", [])]
            if files:
                return files, time.time() - t0
        time.sleep(poll)
    raise TimeoutError(f"no result after {limit}s")


def edit(scene, product, prompt, out_name, seed=None):
    IN_DIR.mkdir(parents=True, exist_ok=True)
    scene_name = Path(scene).name
    (IN_DIR / scene_name).write_bytes(Path(scene).read_bytes())
    product_name = None
    if product:
        product_name = Path(product).name
        (IN_DIR / product_name).write_bytes(Path(product).read_bytes())

    seed = seed if seed is not None else uuid.uuid4().int % (2 ** 31)
    g = _graph(scene_name, product_name, prompt, seed)
    pid = _req("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"  queued {pid} (seed {seed}) ...")
    files, secs = _wait(pid)

    src = OUT_DIR / files[0]["subfolder"] / files[0]["filename"] \
        if files[0].get("subfolder") else OUT_DIR / files[0]["filename"]
    LOCAL_OUT.mkdir(exist_ok=True)
    dest = LOCAL_OUT / out_name
    dest.write_bytes(src.read_bytes())
    print(f"  saved {dest.name} ({dest.stat().st_size // 1024}KB) in {secs:.0f}s")
    return dest


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "check":
        sys.exit(0 if check() else 1)
    elif cmd == "edit":
        edit(sys.argv[2], sys.argv[3] or None, sys.argv[4], sys.argv[5])
    else:
        print(__doc__)

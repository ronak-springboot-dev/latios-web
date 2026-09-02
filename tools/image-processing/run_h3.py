"""
Run the MiniMax H3 image-to-video workflow on Latios products.

    python run_h3.py                    # every product with a front photo
    python run_h3.py sff-h610-ddr5      # one, or a few, by slug
    python run_h3.py --check            # report readiness only, run nothing

The first frame is a REAL product photograph (generated/fronts/{slug}.webp) -
feeding H3 a photograph rather than a bare prompt is the only way it holds the
right machine at all; a bare prompt reinvents the product every time. Nothing
here writes into frontend/public - build_h3_videos.py stages, ship_h3_videos.py
publishes, and only clips a human has watched get published.

WHAT ACTUALLY WORKS, measured over 11 runs on this hardware
-----------------------------------------------------------
Whether H3 keeps the product or reinvents it tracks almost entirely with how
much real geometry the source photograph carries - NOT with prompt wording,
which is only a secondary control (see CAMERA_STYLE).

    product            first-frame plate   result
    mff-dp10           768x736             PASS
    sff-h610-ddr5      768x416             PASS
    sff-b860-pro-ai    768x544             fail - invents side-face vents
    sff-am5-pro-ai     768x320             fail - blue USB drained, invented bezel
    sff-h810-pro-ai    768x320             fail - not the same machine
    mt-* (six)         768x608             fail - RGB gaming case, "Lalios"

The two passes are the two tallest plates. The 320px slivers are near edge-on
and carry almost no depth, so any camera move forces the model to invent the
faces it was never shown. The MT set fails for the same reason plus a worse
one: every MT photograph (dp180-1/2/3) is a flat side or back view with NO
wordmark and NO front bezel anywhere in it, so the model invents a front and
brands it - "Lalios", "Latos".

The fix for those is photographic, not computational: a three-quarter shot
showing the branded front, the way dp80-1 already does for sff-h610-ddr5.
Re-rolling seeds does not fix it - b860 and am5 were each re-rolled with the
corrected lateral camera and both still failed.

Everything that fails keeps its make_product_video.py clip, which is the real
photograph and the registered interior moved by a transform and so cannot drift.
"""
import json
import sys
import time
import urllib.request
import uuid
from pathlib import Path

from PIL import Image

HERE = Path(__file__).parent
COMFY = Path(r"C:\Ronak\ComfyUI")
API = "http://127.0.0.1:8188"
WF = HERE / "workflows" / "video_minimax_h3_i2v.json"
OUT = HERE / "generated" / "h3"

DEFAULT = "sff-h610-ddr5"

# Per-model camera personality, reusing the same read on each product that
# already drives make_reveal.MOTION / make_product_video.VIDEO_MOTION - so the
# H3 clip is directed consistently with the rest of that model's page rather
# than inventing a fourth, unrelated set of adjectives.
CAMERA_STYLE = {
    # DELIBERATELY GENTLE. How far the camera is asked to travel is the single
    # control on whether H3 keeps the product or reinvents it, and the window is
    # narrow. Measured on this machine, on mt-amd-am4:
    #
    #   "pushes in and holds close"            -> product correct, barely moved
    #   "drifts gently to the left and         -> product correct, real motion
    #    slightly downward around the machine"    (the proof-run wording)
    #   "orbits in a wide arc, sweeping from   -> RGB gaming case, AIO loop,
    #    one side toward the other"               invented ports, "Lalios"
    #
    # The third one is not a prompt-tuning failure, it is the model doing what a
    # diffusion video model does: asked for a viewpoint the photograph never
    # showed, it invents the unseen sides. So every variant here stays inside
    # roughly the proof-run amplitude and varies DIRECTION rather than distance.
    # Widening any of these is how the gaming case comes back.
    # NOT "forward". A forward push flattens a three-quarter view toward
    # dead-on, and the flatter the view gets the less geometry the model has to
    # hold: sff-am5-pro-ai came back silver, with the blue USB ports drained to
    # grey and an invented honeycomb panel on the bezel - while sff-h610-ddr5,
    # the SAME physical chassis moved sideways instead, held perfectly. Every
    # variant here travels across the subject, never into it.
    "push":  "the camera drifts gently to the right and slightly downward around "
             "the machine, holding it centred",
    "drift": "the camera drifts gently to the left and slightly downward around "
             "the machine, holding it centred",
    "rise":  "the camera drifts gently upward and slightly to the left around "
             "the machine, holding it centred",
}
CHASSIS_WORD = {"mt": "micro tower", "sff": "slim small-form-factor",
                "mff": "ultra-compact mini", "promax": "workstation tower"}


def build_prompt(slug):
    """
    A per-model prompt, directed the same way that model's reveal/video motion
    already is (make_reveal.MOTION), not invented separately - and explicit
    about the one thing H3 must not be creative with: the machine itself.
    """
    import make_reveal
    mo = make_reveal.MOTION.get(slug, {})
    kind, _ = mo.get("camera", ("push", 1.0))
    cam = CAMERA_STYLE.get(kind, CAMERA_STYLE["push"])
    chassis = CHASSIS_WORD.get(slug.split("-")[0], "desktop")
    return (
        f"A slow, steady studio product shot of this exact black Latios {chassis} "
        f"computer. {cam[0].upper()}{cam[1:]}. The computer itself does not move, "
        "deform, rotate on its own, or change shape, colour or proportions - "
        # Deliberately NOT naming the wordmark. On mt-amd-am4, whose photograph
        # is a bare side panel with no branding on it at all, asking for "the
        # Latios wordmark exactly as shown" made the model invent a front bezel
        # to put one on, reading "Latos". Only what IS shown is protected.
        "every port, vent and marking already visible stays exactly as shown, in "
        "the same place and the same count, for the whole shot. Even soft studio "
        "lighting, deep black background, no people, no added text, no logos "
        "other than the one already on the machine."
    )

# H3 canvas. Kept small on purpose: the DiT is 21GB against an 8GB card, so
# every extra latent token is paid for in offloading. 768 short edge is the
# model's base; the aspect follows the photograph so the first frame is not
# stretched (the node anchors it with a plain resize, no crop).
SHORT_EDGE = 768

# The weights this needs, with EXACT byte sizes as published. Rounded gigabytes
# were not good enough: 605,254,808 bytes displayed as "0.61 GB" and then failed
# a 0.61 GB threshold, reporting a complete file as still downloading.
NEEDED = {
    "diffusion_models/minimax_h3_fl2va_pruned_fp8_scaled.safetensors": 20960000000,
    "text_encoders/qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors": 15690000000,
    "vae/minimax_h3_video_vae_fp16.safetensors": 5207808496,
    "vae/minimax_h3_audio_vae_fp32.safetensors": 605254808,
    "loras/minimax_h3_fl2v_turbo_4step_v1.0_768p_comfyui_bf16.safetensors": 1960000000,
}


def readable(p):
    """
    Is this a complete safetensors file?

    Size alone cannot say - a truncated download is a valid prefix. The header
    declares the byte length of the tensor block, so a file is complete exactly
    when it is at least header + that length.
    """
    try:
        with open(p, "rb") as f:
            n = int.from_bytes(f.read(8), "little")
            if not (0 < n < 200_000_000):
                return False
            import json as _j
            hdr = _j.loads(f.read(n))
        end = max((v["data_offsets"][1] for v in hdr.values()
                   if isinstance(v, dict) and "data_offsets" in v), default=0)
        return p.stat().st_size >= 8 + n + end
    except Exception:
        return False


def _post(path, payload=None, timeout=60):
    req = (urllib.request.Request(API + path, data=json.dumps(payload).encode(),
                                  headers={"Content-Type": "application/json"})
           if payload is not None else urllib.request.Request(API + path))
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def check():
    ok = True
    print("  weights:")
    for rel, size in NEEDED.items():
        p = COMFY / "models" / rel
        have = p.stat().st_size if p.exists() else 0
        done = have >= size * 0.98 and readable(p)
        ok &= done
        print(f"    {'ok  ' if done else 'WAIT'} {have/1e9:6.2f} / {size/1e9:5.2f} GB  {rel}")
    try:
        info = _post("/object_info")
        for n in ("MiniMaxH3ImageToVideo", "MiniMaxH3SigmaShift"):
            present = n in info
            ok &= present
            print(f"  node {n}: {'registered' if present else 'MISSING'}")
    except Exception as e:
        print(f"  ComfyUI not reachable: {e}")
        ok = False
    return ok


def prepare_frame(slug):
    """The real photograph, on black, at the H3 canvas aspect."""
    src = HERE / "generated" / "fronts" / f"{slug}.webp"
    if not src.exists():
        raise SystemExit(f"  no thumbnail for {slug} - run make_fronts.py first")
    im = Image.open(src).convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    if bbox:
        im = im.crop(bbox)
    # canvas on the 32-pixel grid the model wants, following the subject's aspect
    w = SHORT_EDGE if im.width >= im.height else max(320, round(SHORT_EDGE * im.width / im.height))
    h = SHORT_EDGE if im.height > im.width else max(320, round(SHORT_EDGE * im.height / im.width))
    w, h = (w // 32) * 32, (h // 32) * 32
    plate = Image.new("RGB", (w, h), (8, 8, 10))
    s = min(w * 0.88 / im.width, h * 0.88 / im.height)
    r = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    plate.paste(r, ((w - r.width) // 2, (h - r.height) // 2), r)

    dest = COMFY / "input" / "latios-h3-input.png"
    dest.parent.mkdir(parents=True, exist_ok=True)
    plate.save(dest)
    print(f"  first frame: {slug} -> {w}x{h}")
    return w, h


def run(slug):
    w, h = prepare_frame(slug)
    wf = json.loads(WF.read_text(encoding="utf-8"))
    g = {k: v for k, v in wf.items() if not k.startswith("_")}
    g["7"]["inputs"]["width"] = w
    g["7"]["inputs"]["height"] = h
    g["7"]["inputs"]["prompt"] = build_prompt(slug)
    g["8"]["inputs"]["seed"] = uuid.uuid4().int % (2 ** 31)

    pid = _post("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"  queued {pid} ... (4 steps; the 21GB DiT will offload heavily)", flush=True)

    t0 = time.time()
    while time.time() - t0 < 7200:
        hist = _post(f"/history/{pid}")
        if pid in hist:
            e = hist[pid]
            if e.get("status", {}).get("status_str") == "error":
                print("  FAILED:")
                print("   ", json.dumps(e["status"])[:1200])
                return None
            files = [i for o in e.get("outputs", {}).values()
                     for i in (o.get("images", []) + o.get("videos", []) + o.get("gifs", []))]
            if files:
                OUT.mkdir(parents=True, exist_ok=True)
                got = []
                for fmeta in files:
                    src = COMFY / fmeta.get("type", "output") / (fmeta.get("subfolder") or "") / fmeta["filename"]
                    if src.exists():
                        dest = OUT / f"{slug}-{src.name}"
                        dest.write_bytes(src.read_bytes())
                        got.append(dest)
                mins = (time.time() - t0) / 60
                for d in got:
                    print(f"  saved {d.name}  {d.stat().st_size / 1e6:.1f} MB  in {mins:.1f} min")
                return got
        time.sleep(5)
    print("  timed out after 2h")
    return None


def ready_slugs():
    """Every tower with a real front photo to anchor H3 on (make_fronts.py)."""
    manifest = HERE / "generated" / "fronts" / "manifest.json"
    if not manifest.exists():
        return [DEFAULT]
    return sorted(json.loads(manifest.read_text(encoding="utf-8")))


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ready = check()
    if "--check" in sys.argv:
        sys.exit(0 if ready else 1)
    if not ready:
        print("\n  not ready - see above")
        sys.exit(1)
    slugs = args or ready_slugs()
    print(f"\n  running {len(slugs)} product(s): {', '.join(slugs)}\n")
    ok, failed = [], []
    for slug in slugs:
        print(f"[{slug}]")
        got = run(slug)
        (ok if got else failed).append(slug)
    print(f"\n  {len(ok)} succeeded, {len(failed)} failed"
          + (f"  ({', '.join(failed)})" if failed else ""))

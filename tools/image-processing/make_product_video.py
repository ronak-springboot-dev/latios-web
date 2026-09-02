"""
A 1080p product loop per tower, built from that product's own layers.

    python make_product_video.py                # every tower
    python make_product_video.py mt-amd-am4     # one

Why these are composited rather than generated
----------------------------------------------
The brief was that the motion must relate to the actual Latios product, its form
factor and everything, without compromise. A diffusion video model re-imagines
the subject on every frame: it cannot be held to a port count, a slot count or a
chassis depth. These clips move the REAL photograph and the registered interior
instead, through the same transforms as the scroll reveal, so the machine on
screen is the machine being sold. That is the only route that actually delivers
"strictly match that product".

Each clip deliberately uses a DIFFERENT move from the same product's scroll
reveal, so a page does not play the same animation twice.

The loop is a cosine ping-pong: t runs 0 -> 1 -> 0 across the clip, so the last
frame equals the first and it repeats seamlessly in a <video loop> without a
visible cut.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from motion import encode, hinge
import make_reveal

HERE = Path(__file__).parent
PAIRS = HERE / "generated" / "pairs"
OUT = HERE / "generated" / "videos"

SECONDS = 6.0
GROUND = (10, 10, 10)
MBPS = 6.0          # matches the reference set measured at 4.8-7.2 Mbps at 1080p

# A second move per product, chosen to differ from that model's reveal in
# make_reveal.MOTION: where the reveal pushes in, the clip drifts; where the
# reveal opens on the left, the clip opens on the other edge where the machine
# allows it. Same rule as the reveal - the hinge follows the real chassis.
VIDEO_MOTION = {
    "mt-amd-am4":       {"open": "left",  "phases": (0.55, 0.70), "camera": ("rise", 1.2)},
    "mt-h610-ddr4":     {"open": "left",  "phases": (0.60, 0.72), "camera": ("push", 1.4)},
    "mt-h610-ddr5":     {"open": "left",  "phases": (0.50, 0.68), "camera": ("drift", 1.2)},
    "mt-pro-h610-ddr5": {"open": "left",  "phases": (0.58, 0.74), "camera": ("rise", 1.5)},
    "mt-q670-ddr5":     {"open": "left",  "phases": (0.52, 0.66), "camera": ("push", 1.2)},
    "mt-am5-pro-ai":    {"open": "left",  "phases": (0.62, 0.76), "camera": ("drift", -1.2)},

    "sff-h610-ddr5":    {"open": "top",   "phases": (0.56, 0.70), "camera": ("push", 1.3)},
    "sff-am5-pro-ai":   {"open": "top",   "phases": (0.60, 0.74), "camera": ("drift", 1.1)},
    "sff-b860-pro-ai":  {"open": "top",   "phases": (0.52, 0.68), "camera": ("rise", 1.3)},
    "sff-h810-pro-ai":  {"open": "top",   "phases": (0.64, 0.78), "camera": ("push", 1.5)},

    "mff-dp10":         {"open": "right", "phases": (0.58, 0.72), "camera": ("drift", 1.0),
                         "throw": 1.0},

    "promax-q870":      {"open": "left",  "phases": (0.54, 0.70), "camera": ("push", 1.3)},
    "promax-t2-w880":   {"open": "left",  "phases": (0.62, 0.76), "camera": ("rise", 1.4)},
    "promax-t2-w680":   {"open": "left",  "phases": (0.50, 0.66), "camera": ("drift", 1.2)},
    "promax-t4-plus":   {"open": "left",  "phases": (0.58, 0.74), "camera": ("rise", 1.6),
                         "throw": 1.3},
}


def build(slug, seconds=SECONDS):
    if slug not in make_reveal.MODELS:
        print(f"  {slug}: not a configured model")
        return None
    interior_name, accent, bias, light = make_reveal.MODELS[slug]
    need = [PAIRS / f"interior-{interior_name}.png",
            PAIRS / f"panel-{interior_name}.png",
            PAIRS / f"body-{interior_name}.png",
            PAIRS / f"panel-{interior_name}.json",
            PAIRS / f"aperture-{interior_name}.png"]
    if any(not p.exists() for p in need):
        print(f"  {slug:19s} pair for {interior_name} not built")
        return None

    import json
    meta = json.loads(need[3].read_text(encoding="utf-8"))
    W, H = encode.HERO

    # Render at the layers' own aspect, tall enough to fill the 1080 frame, then
    # centre it. Scaling the layers to 16:9 would stretch the machine.
    fw, fh = meta["frame"]
    width = min(W, max(320, round(H * fw / fh)))
    interior, panel, body, quad, size, src_quad = hinge.load(
        need[0], need[1], need[2], meta, width,
        accent=accent, light=light, aperture_path=need[4])

    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{slug}-loop.mp4"
    n = int(round(seconds * encode.FPS))
    proc = encode.writer(out, (W, H), mbps=MBPS)
    plate = Image.new("RGB", (W, H), GROUND)
    ox, oy = (W - size[0]) // 2, (H - size[1]) // 2

    try:
        for i in range(n):
            # 0 -> 1 -> 0, so the clip loops without a cut.
            t = 0.5 - 0.5 * math.cos(2 * math.pi * i / n)
            arr = hinge.frame(t, interior, panel, body, quad, size, meta,
                              bias=bias, src_quad=src_quad,
                              motion=VIDEO_MOTION.get(slug))
            f = Image.fromarray(np.ascontiguousarray(arr[:, :, :3]))
            plate.paste(f, (ox, oy))
            proc.stdin.write(plate.tobytes())
    finally:
        proc.stdin.close()
        proc.wait()

    info = encode.probe(out)
    mo = VIDEO_MOTION.get(slug, {})
    print(f"  {slug:19s} {W}x{H} {seconds:.0f}s  {out.stat().st_size // 1024 / 1024:.1f} MB  "
          f"opens {mo.get('open'):5s} {mo.get('camera', ('push',))[0]}")
    return {"src": f"/videos/{slug}-loop.mp4", "poster": f"/images/posters/{slug}-loop.webp"}


def poster(slug):
    """A still for the <video> poster, from the clip's own opening frame."""
    interior_name, accent, bias, light = make_reveal.MODELS[slug]
    src = HERE / "generated" / "reveal" / slug / "000.webp"
    if not src.exists():
        return
    d = HERE / "generated" / "posters"
    d.mkdir(parents=True, exist_ok=True)
    W, H = encode.HERO
    im = Image.open(src).convert("RGB")
    s = min(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    plate = Image.new("RGB", (W, H), GROUND)
    plate.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
    plate.save(d / f"{slug}-loop.webp", "WEBP", quality=82, method=5)


if __name__ == "__main__":
    import json
    names = [a for a in sys.argv[1:] if not a.startswith("--")] or list(make_reveal.MODELS)
    made = {}
    for slug in names:
        r = build(slug)
        if r:
            poster(slug)
            made[slug] = r
    if made:
        (OUT / "manifest.json").write_text(json.dumps(made, indent=2), encoding="utf-8")
        print(f"\n  {len(made)} clip(s) built")

"""
Render the scroll-scrubbed "open the case" frame sequences, one per model.

    python make_reveal.py                    # every model whose pair is built
    python make_reveal.py mt-amd-am4         # one

Frames rather than a video because this is scrubbed by scroll, not played -
browsers cannot seek compressed video accurately enough to scrub it.

The three layers come from register_pairs.py: the interior behind, the chassis
body from the real photograph (static), and the panel (hinged). The panel swings
open, holds, then lifts away - see motion/hinge.py. The previous version of this
file cross-faded a chassis photograph scaled to a flat 78% of frame over an
unrelated interior render, which is why the lid neither fitted nor moved.

Fifteen tower models share three physical chassis and NINE genuinely distinct
interiors. The hardware shown is accurate to the model: a card only where a card
ships, four DIMM slots only where four exist, eight only on the T4 Plus. Where
two models are physically the same box they share the interior and are told apart
by accent lighting, camera bias and copy - inventing a visual difference between
identical machines would be a lie on a storefront.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from motion import hinge

HERE = Path(__file__).parent
OUT = HERE / "generated" / "reveal"
PAIRS = HERE / "generated" / "pairs"

# PdpReveal scrubs by nearest frame - Math.round(p * (total - 1)), no blending -
# so how smooth the open feels is decided here and nowhere else. At 40 frames a
# 260vh section steps roughly every 36px of scroll on a laptop viewport, which
# reads as a flipbook. 64 brings that to ~22px, below the point where the steps
# separate. Only one sequence ever loads on a page, and PdpReveal fetches every
# eighth frame first so the section is scrubbable long before the set completes.
FRAMES = 64
WIDTH = 1400
QUALITY = 76

# model -> (interior, accent from theme.js, push-in bias, light position).
#
# Three interiors are shared by three models each, because those really are the
# same box with a different processor in it. They are told apart by how the shot
# is LIT rather than by faking hardware: `light` slides the accent lamp across
# the frame, and every group of three gets one lit from the left, one centred
# and one from the right, in three different accents. `bias` varies the push-in
# on top of that.
MODELS = {
    "mt-amd-am4":       ("mt-ddr4",      "#d98324",  0.00,  0.0),
    "mt-h610-ddr4":     ("mt-ddr4-gpu",  "#e2571f",  0.00,  0.0),
    "mt-h610-ddr5":     ("mt-ddr5-gpu",  "#2f7bff",  0.00, -0.8),
    "mt-pro-h610-ddr5": ("mt-ddr5-gpu",  "#8fa3b8",  0.02,  0.0),
    "mt-q670-ddr5":     ("mt-ddr5-gpu",  "#3d6ea8", -0.02,  0.8),
    "mt-am5-pro-ai":    ("mt-ddr5-amd",  "#8b5cf6",  0.00,  0.0),
    "sff-h610-ddr5":    ("sff-ddr5",     "#18b6c4",  0.00, -0.8),
    "sff-am5-pro-ai":   ("sff-ddr5",     "#7c5cf0",  0.02,  0.0),
    "sff-b860-pro-ai":  ("sff-4dimm",    "#12a5b8",  0.00,  0.0),
    "sff-h810-pro-ai":  ("sff-ddr5",     "#2aa198", -0.02,  0.8),
    "mff-dp10":         ("mff",          "#9aa0a6",  0.00,  0.0),
    "promax-q870":      ("promax-4dimm", "#ff7a18",  0.00, -0.8),
    "promax-t2-w880":   ("promax-4dimm", "#ff5f3d",  0.02,  0.0),
    "promax-t2-w680":   ("promax-4dimm", "#ffa62b", -0.02,  0.8),
    "promax-t4-plus":   ("promax-8dimm", "#ff4d16",  0.00,  0.0),
}

# How each machine opens, and how the camera moves while it does.
#
# `open` is the hinge edge. It follows the real machine: a tower's side panel
# swings on a vertical rear edge, a slim SFF is serviced from the TOP so its
# plate tilts back, and the MFF's panel comes off toward the viewer. Opening all
# fifteen the same way was both wrong about the SFF and the reason every page
# felt like the same animation.
#
# `phases` is the swing/hold split and `camera` the move under the static body.
# Both vary per model so two towers sharing a chassis do not scrub identically.
MOTION = {
    "mt-amd-am4":       {"open": "left",   "phases": (0.44, 0.56), "camera": ("push", 1.0)},
    "mt-h610-ddr4":     {"open": "left",   "phases": (0.40, 0.52), "camera": ("drift", 1.0)},
    "mt-h610-ddr5":     {"open": "left",   "phases": (0.48, 0.60), "camera": ("rise", 1.0)},
    "mt-pro-h610-ddr5": {"open": "left",   "phases": (0.38, 0.50), "camera": ("push", 1.4)},
    "mt-q670-ddr5":     {"open": "left",   "phases": (0.52, 0.62), "camera": ("drift", -1.0)},
    "mt-am5-pro-ai":    {"open": "left",   "phases": (0.42, 0.58), "camera": ("rise", 1.3)},

    # Slim boxes: the lid comes off the top, not the side.
    "sff-h610-ddr5":    {"open": "top",    "phases": (0.46, 0.58), "camera": ("rise", 1.0)},
    "sff-am5-pro-ai":   {"open": "top",    "phases": (0.40, 0.50), "camera": ("push", 1.2)},
    "sff-b860-pro-ai":  {"open": "top",    "phases": (0.50, 0.60), "camera": ("drift", 1.0)},
    "sff-h810-pro-ai":  {"open": "top",    "phases": (0.44, 0.54), "camera": ("rise", 1.4)},

    "mff-dp10":         {"open": "right",  "phases": (0.42, 0.54), "camera": ("push", 1.3),
                         "throw": 1.1},

    "promax-q870":      {"open": "left",   "phases": (0.46, 0.58), "camera": ("rise", 1.2)},
    "promax-t2-w880":   {"open": "left",   "phases": (0.38, 0.52), "camera": ("drift", 1.0)},
    "promax-t2-w680":   {"open": "left",   "phases": (0.54, 0.64), "camera": ("push", 1.1)},
    "promax-t4-plus":   {"open": "left",   "phases": (0.42, 0.60), "camera": ("rise", 1.5),
                         "throw": 1.5},
}


def build(slug, frames=FRAMES, width=WIDTH):
    if slug not in MODELS:
        print(f"  {slug}: not a configured model")
        return
    interior_name, accent, bias, light = MODELS[slug]
    need = [PAIRS / f"interior-{interior_name}.png",
            PAIRS / f"panel-{interior_name}.png",
            PAIRS / f"body-{interior_name}.png",
            PAIRS / f"panel-{interior_name}.json",
            PAIRS / f"aperture-{interior_name}.png"]
    missing = [p.name for p in need if not p.exists()]
    if missing:
        print(f"  {slug:19s} waiting on {interior_name}: {', '.join(missing)}")
        return

    meta = json.loads(need[3].read_text(encoding="utf-8"))
    layers = hinge.load(need[0], need[1], need[2], meta, width,
                        accent=accent, light=light, aperture_path=need[4])
    interior, panel, body, quad, size, src_quad = layers

    out = OUT / slug
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*.webp"):
        f.unlink()

    total = 0
    for i in range(frames):
        arr = hinge.frame(i / (frames - 1), interior, panel, body, quad, size,
                          meta, bias=bias, src_quad=src_quad,
                          motion=MOTION.get(slug))
        img = Image.fromarray(np.ascontiguousarray(arr[:, :, :3]))
        p = out / f"{i:03d}.webp"
        img.save(p, "WEBP", quality=QUALITY, method=4)
        total += p.stat().st_size

    mo = MOTION.get(slug, {})
    print(f"  {slug:19s} {interior_name:14s} {frames}f {size[0]}x{size[1]}  "
          f"{total // 1024 / 1024:.1f} MB  opens {mo.get('open') or meta['hinge']:6s} "
          f"{mo.get('camera', ('push', 1))[0]:6s} phases {mo.get('phases', (0.45, 0.55))}")
    return {"frames": frames, "width": size[0], "height": size[1],
            "pattern": f"/reveal/{slug}/{{i}}.webp"}


if __name__ == "__main__":
    manifests = {}
    for n in (sys.argv[1:] or list(MODELS)):
        m = build(n)
        if m:
            manifests[n] = m
    if manifests:
        OUT.mkdir(parents=True, exist_ok=True)
        # Merge, do not replace. Rebuilding a subset used to leave the file
        # describing only that subset, which reads as "eleven sequences are
        # missing" to anything that trusts it.
        f = OUT / "manifests.json"
        prev = json.loads(f.read_text(encoding="utf-8")) if f.exists() else {}
        prev.update(manifests)
        f.write_text(json.dumps(prev, indent=2), encoding="utf-8")
        print(f"\n  {len(manifests)}/{len(MODELS)} sequences built")

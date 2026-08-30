"""
Render the scroll-scrubbed "open the case" frame sequences, one per model.

    python make_reveal.py                    # every model that has its interior
    python make_reveal.py mt-amd-am4         # one

Frames rather than a video because this is scrubbed by scroll, not played — see
motion/reveal.

Fifteen tower models share three physical chassis and NINE genuinely distinct
interiors. The hardware shown is accurate to the model: an A4000 only where an
A4000 ships, four DIMM slots only where four exist, eight only on the T4 Plus.
Where two models are physically the same box they share the interior render and
are told apart by accent tint, camera bias and copy — inventing a visual
difference between identical machines would be a lie on a storefront.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from motion import reveal

OUT = Path(__file__).parent / "generated" / "reveal"
IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")
GEN = Path(__file__).parent / "generated" / "components"

# 40 frames over a 260vh scroll is roughly one frame per 6vh — smooth to scrub,
# and about 3.2MB per model. Only one sequence ever loads on a page.
FRAMES = 40
WIDTH = 1400
QUALITY = 76

# The nine interiors, and which chassis panel photograph seals each one.
INTERIORS = {
    "mt-ddr4":        {"panel": "dp180-1.webp"},
    "mt-ddr4-gpu":    {"panel": "dp180-1.webp"},
    "mt-ddr5-gpu":    {"panel": "dp180-1.webp"},
    "mt-ddr5-amd":    {"panel": "dp180-1.webp"},
    "sff-ddr5":       {"panel": "dp80-4.webp"},
    "sff-4dimm":      {"panel": "dp80-4.webp"},
    "promax-4dimm":   {"panel": "dp180-1.webp"},
    "promax-8dimm":   {"panel": "dp180-1.webp"},
    "mff":            {"panel": "dp10-1.webp"},
}

# model -> interior + its accent from components/pdp/theme.js. `bias` nudges the
# camera so models sharing an interior still open on a different framing.
MODELS = {
    "mt-amd-am4":       ("mt-ddr4",      "#d98324", 0.00),
    "mt-h610-ddr4":     ("mt-ddr4-gpu",  "#e2571f", 0.00),
    "mt-h610-ddr5":     ("mt-ddr5-gpu",  "#2f7bff", 0.00),
    "mt-pro-h610-ddr5": ("mt-ddr5-gpu",  "#8fa3b8", 0.04),
    "mt-q670-ddr5":     ("mt-ddr5-gpu",  "#3d6ea8", -0.04),
    "mt-am5-pro-ai":    ("mt-ddr5-amd",  "#8b5cf6", 0.00),
    "sff-h610-ddr5":    ("sff-ddr5",     "#18b6c4", 0.00),
    "sff-am5-pro-ai":   ("sff-ddr5",     "#7c5cf0", 0.04),
    "sff-b860-pro-ai":  ("sff-4dimm",    "#12a5b8", 0.00),
    "sff-h810-pro-ai":  ("sff-ddr5",     "#2aa198", -0.04),
    "mff-dp10":         ("mff",          "#9aa0a6", 0.00),
    "promax-q870":      ("promax-4dimm", "#ff7a18", 0.00),
    "promax-t2-w880":   ("promax-4dimm", "#ff5f3d", 0.04),
    "promax-t2-w680":   ("promax-4dimm", "#ffa62b", -0.04),
    "promax-t4-plus":   ("promax-8dimm", "#ff4d16", 0.00),
}


def build(slug, frames=FRAMES, width=WIDTH):
    if slug not in MODELS:
        print(f"  {slug}: not a configured model")
        return
    interior, accent, bias = MODELS[slug]
    src = GEN / f"internals-{interior}.png"
    if not src.exists():
        print(f"  {slug}: interior '{interior}' not rendered yet")
        return

    panel = IMAGES / INTERIORS[interior]["panel"]
    base, panel_img, size = reveal.load(src, panel, width, accent=accent)

    out = OUT / slug
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*.webp"):
        f.unlink()

    total = 0
    for i in range(frames):
        t = i / (frames - 1)
        arr = reveal.frame(t, base, panel_img, size, push=0.05 + bias)
        img = Image.fromarray(np.ascontiguousarray(arr[:, :, :3]))
        p = out / f"{i:03d}.webp"
        img.save(p, "WEBP", quality=QUALITY, method=4)
        total += p.stat().st_size

    print(f"  {slug:19s} {interior:14s} {frames}f {size[0]}x{size[1]}  "
          f"{total // 1024 / 1024:.1f} MB")
    return {"frames": frames, "width": size[0], "height": size[1],
            "pattern": f"/reveal/{slug}/{{i}}.webp"}


if __name__ == "__main__":
    names = sys.argv[1:] or list(MODELS)
    manifests = {}
    for n in names:
        m = build(n)
        if m:
            manifests[n] = m
    (OUT / "manifests.json").write_text(json.dumps(manifests, indent=2), encoding="utf-8")

"""
Render the scroll-scrubbed "open the case" frame sequence.

    python make_reveal.py mt

Emits frames/<name>/NNN.webp plus a manifest the front end reads. Frames rather
than a video because this is scrubbed by scroll, not played — see motion/reveal.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from motion import reveal

OUT = Path(__file__).parent / "generated" / "reveal"
IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")
GEN = Path(__file__).parent / "generated"

# 48 frames over a 260vh scroll is roughly one frame per 5vh. Below this the
# scrub visibly steps; above it the payload grows for motion the eye does not
# resolve while scrolling — 64 frames cost 8.5MB against 5.5MB for no
# perceptible gain.
FRAMES = 48
WIDTH = 1600
QUALITY = 78

JOBS = {
    "mt": {
        "internals": GEN / "components" / "internals-mt.png",
        "panel": IMAGES / "dp180-1.webp",
    },
    "sff": {
        "internals": GEN / "components" / "internals-sff.png",
        "panel": IMAGES / "dp80-4.webp",
    },
}


def build(name, frames=FRAMES, width=WIDTH):
    job = JOBS[name]
    if not job["internals"].exists():
        print(f"  {name}: no internals render yet")
        return
    base, panel, size = reveal.load(job["internals"], job["panel"], width)

    out = OUT / name
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*.webp"):
        f.unlink()

    total = 0
    for i in range(frames):
        t = i / (frames - 1)
        arr = reveal.frame(t, base, panel, size)
        img = Image.fromarray(np.ascontiguousarray(arr[:, :, :3]))
        p = out / f"{i:03d}.webp"
        img.save(p, "WEBP", quality=QUALITY, method=4)
        total += p.stat().st_size

    manifest = {"name": name, "frames": frames,
                "width": size[0], "height": size[1],
                "pattern": f"/reveal/{name}/{{i}}.webp"}
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"  {name}: {frames} frames  {size[0]}x{size[1]}  "
          f"{total // 1024} KB total ({total // frames // 1024} KB/frame)")


if __name__ == "__main__":
    for n in (sys.argv[1:] or list(JOBS)):
        build(n)

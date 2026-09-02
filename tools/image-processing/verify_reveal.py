"""
Check every reveal sequence for the faults this project has actually hit.

    python verify_reveal.py

Each check exists because something went wrong in exactly that way:

  frame 0 is the photograph   the first version cross-faded a chassis photo
                              scaled to a flat 78% of frame, so the opening
                              frame was never the real machine
  the body survives           the SFF's panel region was an axis-aligned
                              rectangle over a plate that is a rhombus on
                              screen, so sliding the panel away took the front
                              face, its ports and the "Latios" wordmark with it
  the backdrop stays black    an accent lamp with a luminance floor lit the
                              backdrop as well as the hardware
  it opens, not fades         the original transition was a gradient dissolve
  the motions differ          fifteen identical push-ins made every page read
                              as the same animation in a different colour
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).parent
REVEAL = HERE / "generated" / "reveal"
PAIRS = HERE / "generated" / "pairs"

sys.path.insert(0, str(HERE))
import make_reveal                                     # noqa: E402
import register_pairs                                  # noqa: E402

fails = []


def _arr(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(np.int16)


def check(slug):
    interior, _accent, _bias, _light = make_reveal.MODELS[slug]
    d = REVEAL / slug
    frames = sorted(d.glob("*.webp"))
    if len(frames) != make_reveal.FRAMES:
        fails.append(f"{slug}: {len(frames)} frames, expected {make_reveal.FRAMES}")
        return
    f0, fN = _arr(frames[0]), _arr(frames[-1])

    # 1. frame 0 is the closed source frame.
    #
    # Compared against what the pipeline actually uses, not the raw file: the two
    # PROMAX pairs are graded toward neutral during the build (they are the only
    # generated chassis, and the generator gives them a strong blue rim). Testing
    # against the ungraded file reported a 17-of-255 "failure" that was the
    # deliberate grade, which is a fault in the check rather than the frames.
    closed = Image.open(PAIRS / f"closed-{interior}.png").convert("RGB")
    if interior in register_pairs.NO_ALIGN:
        closed = register_pairs.neutralise(closed)
    ref = np.asarray(closed.resize((f0.shape[1], f0.shape[0]), Image.LANCZOS)).astype(np.int16)
    lit = ref.max(axis=2) > 30
    d0 = float(np.abs(ref - f0)[lit].mean())

    # 2. the body survives: the chassis OUTSIDE the panel aperture must look the
    #    same at the end as at the start. That is the whole point of the body
    #    being a static layer.
    body = np.asarray(Image.open(PAIRS / f"body-{interior}.png")
                      .resize((f0.shape[1], f0.shape[0]), Image.LANCZOS)
                      .getchannel("A")) > 200
    ap = np.asarray(Image.open(PAIRS / f"aperture-{interior}.png")
                    .resize((f0.shape[1], f0.shape[0]), Image.LANCZOS)
                    .convert("L")) > 40
    keep = body & ~ap
    dbody = float(np.abs(f0 - fN)[keep].mean()) if keep.sum() > 500 else 0.0

    # 3. the backdrop is the clean ground, not lit by the accent lamp
    corner = np.concatenate([f0[:30, :30].reshape(-1, 3),
                             fN[-30:, -30:].reshape(-1, 3)]).mean(axis=0)

    # 4. it opens rather than fades
    delta = float(np.abs(f0 - fN).mean())

    ok = d0 < 12 and dbody < 10 and corner.max() < 24 and delta > 12
    print(f"  {slug:19s} f0-vs-photo {d0:5.2f}  body drift {dbody:5.2f}  "
          f"corner {corner.max():4.0f}  open {delta:5.1f}  {'ok' if ok else 'FAIL'}")
    if d0 >= 12:
        fails.append(f"{slug}: frame 0 differs from the photograph by {d0:.1f}")
    if dbody >= 10:
        fails.append(f"{slug}: the body moved ({dbody:.1f}) — the panel is taking "
                     f"chassis with it")
    if corner.max() >= 24:
        fails.append(f"{slug}: backdrop is lit ({corner.round(0)})")
    if delta <= 12:
        fails.append(f"{slug}: frame 0 and the last frame barely differ — a fade")


def motions_differ():
    """No two models may scrub on the same profile."""
    seen = {}
    for slug, mo in make_reveal.MOTION.items():
        key = (mo.get("open"), tuple(mo.get("phases", ())), tuple(mo.get("camera", ())))
        if key in seen:
            fails.append(f"{slug} has the same motion profile as {seen[key]}")
        seen[key] = slug
    print(f"  motion profiles    {len(seen)}/{len(make_reveal.MOTION)} distinct")


if __name__ == "__main__":
    for slug in make_reveal.MODELS:
        if (REVEAL / slug).is_dir():
            check(slug)
    motions_differ()
    print(f"\n  {len(fails)} failure(s)" if fails else "\n  all reveal checks passed")
    for f in fails:
        print(f"    {f}")
    sys.exit(1 if fails else 0)

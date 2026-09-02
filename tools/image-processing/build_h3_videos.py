"""
Turn a raw MiniMax H3 clip (run_h3.py) into a shippable 1080p product loop.

    python build_h3_videos.py                # every clip found in generated/h3
    python build_h3_videos.py mt-amd-am4     # one

Three things the raw H3 output is NOT yet:

  - It loops. H3 was not asked to return to its start frame, so the raw clip
    would cut. Bounced instead (play forward, then its own reverse), the same
    trick make_product_video.py already uses on the composited clips.
  - It is 1080p at the site's bitrate spec. H3 renders at its native ~768px
    short edge; frames are Lanczos-upscaled onto the same 1920x1080 GROUND
    canvas make_product_video.py uses, then re-encoded through
    motion/encode.py:writer() so the two families of clip are bit-for-bit the
    same container/profile/bitrate - ProductVideo does not know which one it
    is playing.
  - It is staged, not shipped. This writes into generated/h3/videos/ and a
    manifest there, NOT into frontend/public. Swapping a page's video.src is a
    separate, deliberate step per clip, gated on watching it: H3 re-imagines
    the subject every frame and cannot be trusted the way the compositing
    path can be trusted by construction.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from motion import encode

HERE = Path(__file__).parent
H3 = HERE / "generated" / "h3"
OUT = H3 / "videos"
GROUND = (10, 10, 10)


def _probe_res(path):
    out = subprocess.run([encode.FFMPEG, "-i", str(path), "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    for line in out.splitlines():
        if "Video:" in line:
            for tok in line.split(","):
                tok = tok.strip()
                if "x" in tok and tok.split("x")[0].strip().isdigit():
                    w, h = tok.split(" ")[0].split("x")
                    return int(w), int(h)
    raise SystemExit(f"  could not read resolution from {path}")


def _decode(path, w, h):
    """All frames as one (n, h, w, 3) uint8 array."""
    proc = subprocess.run(
        [encode.FFMPEG, "-i", str(path), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True)
    raw = proc.stdout
    frame_bytes = w * h * 3
    n = len(raw) // frame_bytes
    if n == 0:
        raise SystemExit(f"  decoded 0 frames from {path} ({len(raw)} bytes)")
    return np.frombuffer(raw[:n * frame_bytes], dtype=np.uint8).reshape(n, h, w, 3)


def latest_clip(slug):
    hits = sorted(H3.glob(f"{slug}-*.webm"), key=lambda p: p.stat().st_mtime)
    return hits[-1] if hits else None


def build(slug, seconds_hint=None):
    src = latest_clip(slug)
    if not src:
        print(f"  {slug}: no H3 clip in {H3}")
        return None
    w, h = _probe_res(src)
    frames = _decode(src, w, h)
    n = len(frames)
    # Bounce: forward, then reverse without repeating either end frame, so the
    # loop returns to frame 0 and repeats without a visible cut or a held pause.
    order = list(range(n)) + list(range(n - 2, 0, -1))

    W, H = encode.HERO
    out = OUT / f"{slug}-loop.mp4"
    OUT.mkdir(parents=True, exist_ok=True)
    proc = encode.writer(out, (W, H))
    plate = Image.new("RGB", (W, H), GROUND)
    s = min(W * 0.94 / w, H * 0.94 / h)
    rw, rh = max(1, round(w * s)), max(1, round(h * s))
    ox, oy = (W - rw) // 2, (H - rh) // 2

    poster_saved = False
    try:
        for i in order:
            f = Image.fromarray(frames[i]).resize((rw, rh), Image.LANCZOS)
            frame_plate = plate.copy()
            frame_plate.paste(f, (ox, oy))
            if not poster_saved:
                d = HERE / "generated" / "posters"
                d.mkdir(parents=True, exist_ok=True)
                frame_plate.save(d / f"{slug}-loop.webp", "WEBP", quality=82, method=5)
                poster_saved = True
            proc.stdin.write(frame_plate.tobytes())
    finally:
        proc.stdin.close()
        proc.wait()

    info = encode.probe(out)
    print(f"  {slug:19s} {n} src frames -> {len(order)} looped  "
          f"{info['resolution']}  {info['mbps']} Mbps  {info['kb']/1024:.1f} MB  "
          f"{info['seconds']:.1f}s")
    return {"src": f"/videos/{slug}-loop.mp4", "poster": f"/images/posters/{slug}-loop.webp",
            "staged": str(out)}


if __name__ == "__main__":
    import json
    slugs = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not slugs:
        slugs = sorted({p.name.split("-latios-h3")[0] for p in H3.glob("*-*.webm")})
    made = {}
    for slug in slugs:
        r = build(slug)
        if r:
            made[slug] = r
    if made:
        (OUT / "manifest.json").write_text(json.dumps(made, indent=2), encoding="utf-8")
        print(f"\n  {len(made)} clip(s) staged in {OUT} - review before swapping into pages")

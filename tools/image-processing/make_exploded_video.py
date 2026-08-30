"""
Animate the component layers apart and back together.

Not a video model. Each frame is one of the crisp component stills being moved,
so the clip holds the clarity the renders were made for — a diffusion video
model on this GPU would be slower, markedly softer, and would invent the parts
frame by frame. Same argument, and the same ffmpeg/easing scaffolding, as the
product loops in make_video.py.

The move is a genuine exploded-assembly: layers begin overlapped near the
centre, separate to their own positions, hold, and return. The loop closes on
itself so it can autoplay indefinitely.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

import imageio_ffmpeg
from make_video import backdrop, _lit, _shadow, _ease, W, H, FPS
from motion.encode import writer, probe

LAYERS = Path(__file__).parent / "generated" / "components" / "layers"
OUT = Path(__file__).parent / "generated"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

SECONDS = 10
HOLD = 0.18          # fraction of the loop spent fully apart, and fully together
SCALE = 0.44         # each part's height as a fraction of the frame


def _positions(n):
    """Target centres, spread across the frame in one row."""
    if n == 1:
        return [(0.5, 0.5)]
    span = 0.72
    left = 0.5 - span / 2
    return [(left + span * i / (n - 1), 0.5) for i in range(n)]


def _phase(t):
    """
    0 = stacked, 1 = fully apart.

    apart -> hold -> together -> hold, eased at both ends so nothing snaps.
    """
    a = HOLD
    if t < 0.5 - a:
        return _ease(t / (0.5 - a))
    if t < 0.5 + a:
        return 1.0
    if t < 1.0 - a:
        return 1.0 - _ease((t - (0.5 + a)) / (0.5 - 2 * a))
    return 0.0


def build_frame(layers, targets, bg, spread, sweep):
    """One composed frame: parts placed, lit, shadowed, painted."""
    frame = bg.convert("RGBA")
    scaled = []
    for layer, (tx, ty) in zip(layers, targets):
        h = int(H * SCALE)
        w = max(1, round(layer.width * h / layer.height))
        s = _lit(layer.resize((w, h), Image.LANCZOS), sweep, strength=0.26)
        cx = 0.5 + (tx - 0.5) * spread
        cy = 0.5 + (ty - 0.5) * spread
        scaled.append((s, (int(W * cx) - w // 2, int(H * cy) - h // 2)))
    for s, pos in scaled:
        frame = Image.alpha_composite(frame, _shadow(s, pos, 0, strength=0.34))
    # Painted after every shadow so no part is shadowed onto its neighbour.
    for s, pos in scaled:
        frame.paste(s, pos, s)
    return frame


def build(names, out_name="components-loop.mp4", seconds=SECONDS):
    layers = []
    for n in names:
        p = LAYERS / f"{n}.png"
        if p.exists():
            layers.append(Image.open(p).convert("RGBA"))
    if not layers:
        print("  no layers rendered yet — nothing to animate")
        return

    targets = _positions(len(layers))
    bg = backdrop()
    total = seconds * FPS

    proc = writer(OUT / out_name, (W, H), mbps=5.0)

    for f in range(total):
        t = f / total
        frame = build_frame(layers, targets, bg, _phase(t), t)
        proc.stdin.write(frame.convert("RGB").tobytes())

    proc.stdin.close()
    proc.wait()
    p = OUT / out_name
    info = probe(p)
    print(f"  {out_name:24s} {info['resolution']}  {info['seconds']}s  "
          f"{info['mbps']} Mbps  {info['kb']} KB")

    # Poster is the fully-apart frame, not the bare backdrop: the <video> shows
    # it until the clip decodes, and an empty plate reads as a broken section.
    poster_frame = build_frame(layers, targets, bg, spread=1.0, sweep=0.35)
    pn = out_name.replace(".mp4", "-poster.webp")
    poster_frame.convert("RGB").save(OUT / pn, "WEBP", quality=84, method=6)
    print(f"  {pn:26s} {(OUT / pn).stat().st_size // 1024:>5} KB")
    return p


if __name__ == "__main__":
    names = sys.argv[1:] or ["ddr5", "m2", "cooler", "psu"]
    build(names)

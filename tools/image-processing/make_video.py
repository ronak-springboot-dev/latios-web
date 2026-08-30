"""
Build looping product videos out of the REAL product photographs.

The brief was Minisforum-style motion on every product page. The obvious route —
a video diffusion model — is the wrong one here: it would invent hardware frame
by frame, which is exactly what the "stick to Latios only" rule forbids, and the
still-image pass already showed how badly a model mangles the wordmark.

So nothing is generated. Each clip is assembled from the transparent cutouts of
the real photographs, and the motion is real camera-rig motion applied to them:

  * a slow push-in on each angle, easing in and out so it never jerks,
  * a cross-dissolve from one true angle to the next, and back to the first, so
    the loop is seamless,
  * a specular sweep — a soft highlight travelling across the chassis, masked to
    the product's own alpha — which is what sells it as a lit object rather than
    a photo being panned,
  * a contact shadow that slides opposite the light, so the product stays
    planted while the light moves.

Every pixel of hardware is photographic. Output is H.264, muted, loop-safe.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageDraw

import imageio_ffmpeg

IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")
OUT = Path(__file__).parent / "generated"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

W, H = 1280, 720
FPS = 24
SECONDS = 8
ZOOM = 0.07          # push-in depth over one angle's segment
MARGIN = 0.14


def backdrop():
    """Dark studio sweep, matching the stills' feature bands."""
    base = Image.new("RGB", (W, H), (10, 10, 12))
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse(
        (int(W * 0.12), int(H * -0.05), int(W * 0.88), int(H * 1.10)), fill=125)
    glow = glow.filter(ImageFilter.GaussianBlur(W // 7))
    return Image.composite(Image.new("RGB", (W, H), (33, 34, 39)), base, glow)


def _fit(cut, scale):
    """Scale a trimmed cutout to the frame with margin, at `scale` zoom."""
    box = cut.getchannel("A").getbbox()
    c = cut.crop(box)
    avail_w, avail_h = W * (1 - 2 * MARGIN), H * (1 - 2 * MARGIN)
    s = min(avail_w / c.width, avail_h / c.height) * scale
    return c.resize((max(1, int(c.width * s)), max(1, int(c.height * s))), Image.LANCZOS)


def _specular(size, phase):
    """A soft diagonal highlight band travelling left to right, wrapping."""
    w, h = size
    x = np.linspace(0, 1, w)[None, :]
    y = np.linspace(0, 1, h)[:, None]
    d = (x * 0.85 + y * 0.15 - phase) % 1.0          # wraps, so the loop closes
    band = np.exp(-((d - 0.5) ** 2) / (2 * 0.055 ** 2))
    return Image.fromarray((band * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(max(2, w // 90)))


def _lit(subject, phase, strength=0.30):
    """Add the moving highlight to the product only (masked by its own alpha)."""
    a = subject.getchannel("A")
    rgb = np.asarray(subject.convert("RGB")).astype(np.float32)
    spec = np.asarray(_specular(subject.size, phase)).astype(np.float32) / 255.0
    # Scale by existing luminance so the sweep rolls across surfaces that already
    # catch light, instead of flatly brightening the matte black.
    lum = rgb.mean(axis=2, keepdims=True) / 255.0
    rgb = np.clip(rgb + spec[..., None] * lum * 255.0 * strength, 0, 255)
    out = Image.fromarray(rgb.astype(np.uint8)).convert("RGBA")
    out.putalpha(a)
    return out


def _shadow(subject, pos, drift, strength=0.62):
    """Soft contact shadow, sliding opposite the light so the product stays put."""
    w, h = subject.size
    strip = subject.getchannel("A").crop((0, int(h * 0.80), w, h))
    strip = strip.resize((int(w * 1.12), max(6, int(h * 0.14))), Image.LANCZOS)
    layer = Image.new("L", (W, H), 0)
    layer.paste(strip, (pos[0] - int(w * 0.06) + drift, pos[1] + h - strip.height // 2))
    layer = layer.filter(ImageFilter.GaussianBlur(max(12, w // 14)))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh.putalpha(layer.point(lambda v: int(v * strength)))
    return sh


def _ease(t):
    """Smoothstep — no visible start/stop at segment boundaries."""
    return t * t * (3 - 2 * t)


def _compose(cut, zoom_t, phase, bg):
    subject = _fit(cut, 1.0 + ZOOM * zoom_t)
    subject = _lit(subject, phase)
    pos = ((W - subject.width) // 2, (H - subject.height) // 2)
    drift = int((phase - 0.5) * subject.width * 0.06)
    frame = Image.alpha_composite(bg.convert("RGBA"), _shadow(subject, pos, drift))
    frame.paste(subject, pos, subject)
    return frame.convert("RGB")


def build(sources, out_name, seconds=SECONDS):
    cuts = [Image.open(IMAGES / s).convert("RGBA") for s in sources]
    n = len(cuts)
    total = seconds * FPS
    bg = backdrop()
    seg = total / n                      # frames per angle, including its dissolve
    fade = int(seg * 0.34)               # dissolve length

    proc = subprocess.Popen(
        [FFMPEG, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
         "-r", str(FPS), "-i", "-",
         "-an",                                   # no audio: the player is muted
         "-c:v", "libx264", "-preset", "slow", "-crf", "27",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-g", str(FPS * 2),
         str(OUT / out_name)],
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for f in range(total):
        phase = (f / total) % 1.0
        i = int(f / seg) % n
        local = (f - i * seg) / seg                # 0..1 within this angle
        a = _compose(cuts[i], _ease(local), phase, bg)
        k = (f - i * seg)
        if k >= seg - fade:                        # dissolve into the next angle
            nxt = (i + 1) % n
            t = (k - (seg - fade)) / fade
            b = _compose(cuts[nxt], _ease(t * (fade / seg)), phase, bg)
            a = Image.blend(a, b, _ease(t))
        proc.stdin.write(a.tobytes())

    proc.stdin.close()
    proc.wait()
    p = OUT / out_name
    print(f"  {out_name:26s} {total} frames  {p.stat().st_size // 1024:>5} KB")

    # Poster: first frame, so the <video> shows the product before the clip loads.
    poster = _compose(cuts[0], 0.0, 0.0, bg)
    pname = out_name.replace(".mp4", "-poster.webp")
    poster.save(OUT / pname, "WEBP", quality=82, method=6)
    print(f"  {pname:26s} {(OUT / pname).stat().st_size // 1024:>5} KB")


JOBS = {
    "sff": (["dp80-1.webp", "dp80-2.webp", "dp80-3.webp", "dp80-4.webp"], "sff-loop.mp4"),
    "mt": (["dp180-1.webp", "dp180-2.webp", "dp180-3.webp"], "mt-loop.mp4"),
    "archer": (["laptop-archer-1.webp", "laptop-archer-2.webp",
                "laptop-archer-3.webp", "laptop-archer-4.webp"], "archer-loop.mp4"),
}

if __name__ == "__main__":
    for name in (sys.argv[1:] or list(JOBS)):
        srcs, out = JOBS[name]
        print(f"{name}:")
        build(srcs, out)

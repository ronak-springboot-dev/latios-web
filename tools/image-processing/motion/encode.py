"""
One encode profile for every shipped clip, matched to the reference.

Measured off minisforum.com/products/ms-02-ultra: their loops are 1080p at
4.8-7.2 Mbps. The clips shipped before this were 720p at roughly 0.3-0.9 Mbps —
a 6-20x bitrate gap on top of the resolution gap, and the main reason they did
not hold up beside the reference.

Bitrate is targeted explicitly rather than left to CRF. CRF gives a consistent
*quality*, which on a mostly-black frame with a few bright gradients collapses
to a very low bitrate and bands the glow badly. These clips are exactly the
pathological case for it.
"""
import subprocess
from pathlib import Path

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Reference aspects: 16:9 for hero/turntable, ~1.28 for the cooling band.
HERO = (1920, 1080)
BAND = (1382, 1080)

FPS = 30            # the reference runs smooth short loops; 24 judders on fast ribbons


def writer(path, size, fps=FPS, mbps=6.0):
    """
    Raw RGB frames in, H.264 out at a targeted bitrate.

    -bf 2 and a 2s GOP keep it seekable and scrub-friendly in a <video> loop;
    +faststart puts the moov atom first so playback starts before the whole file
    lands, which matters when these are 4-5 MB each.
    """
    w, h = size
    rate = f"{mbps:.1f}M"
    return subprocess.Popen(
        [FFMPEG, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
         "-an",
         "-c:v", "libx264", "-profile:v", "high", "-preset", "slower",
         "-b:v", rate, "-maxrate", f"{float(rate[:-1]) * 1.35:.1f}M",
         "-bufsize", f"{float(rate[:-1]) * 2:.1f}M",
         "-pix_fmt", "yuv420p", "-g", str(fps * 2), "-bf", "2",
         "-movflags", "+faststart",
         str(path)],
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def probe(path):
    """Report what actually shipped, so the spec can be asserted rather than assumed."""
    p = Path(path)
    if not p.exists():
        return None
    out = subprocess.run(
        [FFMPEG, "-i", str(p), "-f", "null", "-"],
        capture_output=True, text=True).stderr
    size = p.stat().st_size
    dur = None
    for line in out.splitlines():
        if "Duration:" in line:
            hh, mm, ss = line.split("Duration:")[1].split(",")[0].strip().split(":")
            dur = int(hh) * 3600 + int(mm) * 60 + float(ss)
    res = None
    for line in out.splitlines():
        if "Video:" in line:
            for tok in line.split(","):
                tok = tok.strip()
                if "x" in tok and tok.split("x")[0].strip().isdigit():
                    res = tok.split(" ")[0]
                    break
    mbps = (size * 8 / dur / 1e6) if dur else None
    return {"file": p.name, "kb": size // 1024, "seconds": dur,
            "resolution": res, "mbps": round(mbps, 2) if mbps else None}

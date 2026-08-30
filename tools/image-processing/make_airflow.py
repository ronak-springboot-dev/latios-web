"""
Render the thermal / airflow loop for a chassis.

    python make_airflow.py mt          # one
    python make_airflow.py             # all configured

Output lands in generated/ as <name>-airflow.mp4 plus a poster, at the reference
spec: 1382x1080, ~3.5s, targeted bitrate. deploy step copies to the site.
"""
import sys
from pathlib import Path

import numpy as np

from motion import airflow
from motion.encode import writer, probe, BAND, FPS

OUT = Path(__file__).parent / "generated"
IMAGES = Path(r"C:\Ronak\latios-web\frontend\public\images")

SECONDS = 3.5          # the reference cooling loops run 3.0-3.6s

# chassis -> (shell photo, internals plate, fan positions as fractions of the
# shell box, given as (x, y, radius))
JOBS = {
    "mt": {
        "shell": IMAGES / "dp180-2.webp",
        "plate": OUT / "components" / "internals-mt.png",
        # interior bay only, out of the full open-chassis render
        "crop": (0.15, 0.17, 0.73, 0.87),
        "fans": [(0.34, 0.44, 0.15), (0.68, 0.50, 0.12)],
    },
    "sff": {
        "shell": IMAGES / "dp80-4.webp",
        "plate": OUT / "components" / "internals-sff.png",
        "crop": (0.15, 0.20, 0.75, 0.85),
        "fans": [(0.30, 0.50, 0.17), (0.66, 0.50, 0.13)],
    },
}


def build(name, seconds=SECONDS, size=BAND, mbps=6.5):
    job = JOBS[name]
    w, h = size
    shell = airflow.ghosted_shell(job["shell"], height=int(h * 0.74))
    plate = airflow.plate(job["plate"], height=int(h * 0.52), crop=job.get("crop"))
    if plate is None:
        print(f"  {name}: no internals plate yet — rendering shell only")

    total = int(seconds * FPS)
    out = OUT / f"{name}-airflow.mp4"
    proc = writer(out, size, mbps=mbps)

    first = None
    for f in range(total):
        frame = airflow.compose(w, h, f / total, shell, plate, job["fans"])
        rgb = np.ascontiguousarray(frame[:, :, :3])
        if f == 0:
            first = rgb.copy()
        proc.stdin.write(rgb.tobytes())
    proc.stdin.close()
    proc.wait()

    from PIL import Image
    Image.fromarray(first).save(OUT / f"{name}-airflow-poster.webp",
                                "WEBP", quality=86, method=6)

    info = probe(out)
    print(f"  {name}-airflow.mp4  {info['resolution']}  {info['seconds']}s  "
          f"{info['mbps']} Mbps  {info['kb']} KB")
    return out


if __name__ == "__main__":
    for n in (sys.argv[1:] or list(JOBS)):
        build(n)

"""Point the app at the new Latios-shot replacements for the MSI-branded files."""
import io
from pathlib import Path

SRC = Path(r"C:\Ronak\latios-web\frontend\src")

# old path -> new path
SWAPS = {
    "/images/perf.png": "/images/perf.webp",
    "/images/io-right.png": "/images/io-right.webp",
    "/images/easy.png": "/images/easy.webp",
    "/images/chassis.png": "/images/chassis.webp",
    "/images/office.png": "/images/office.webp",
    "/images/versatile.png": "/images/versatile.webp",
    "/images/speaker.png": "/images/speaker.webp",
    "/images/dp80kv.jpg": "/images/dp80kv.webp",
}

FILES = [
    SRC / "data" / "models.js",
    SRC / "data" / "showcase.js",
    SRC / "data" / "products.js",
]

total = 0
for f in FILES:
    if not f.exists():
        continue
    text = io.open(f, "r", encoding="utf-8").read()
    orig = text
    n = 0
    for old, new in SWAPS.items():
        c = text.count(old)
        if c:
            text = text.replace(old, new)
            n += c
    if text != orig:
        io.open(f, "w", encoding="utf-8").write(text)
        print(f"  {f.name}: {n} reference(s) updated")
        total += n

print(f"total: {total}")

# nothing should still point at the old MSI files
leftovers = []
for f in FILES:
    if not f.exists():
        continue
    t = io.open(f, "r", encoding="utf-8").read()
    for old in SWAPS:
        if old in t:
            leftovers.append(f"{f.name} -> {old}")
print("leftover old refs:", leftovers or "none")

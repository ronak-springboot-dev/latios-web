"""Remap models.js references to the MT images that actually have Latios photography."""
import io
import re
from pathlib import Path

P = Path(r"C:\Ronak\latios-web\frontend\src\data\models.js")
src = io.open(P, "r", encoding="utf-8").read()

before_3 = src.count("/images/dp180-3.webp")
before_4 = src.count("/images/dp180-4.webp")

# dp180-3 / dp180-4 were the MSI-branded stock shots and have been removed.
# Point everything at the two real restaged Latios MT views.
src = src.replace("/images/dp180-3.webp", "/images/dp180-1.webp")
src = src.replace("/images/dp180-4.webp", "/images/dp180-2.webp")

# MT_GALLERY now holds exactly the two views we have real photography for.
src = re.sub(
    r"const MT_GALLERY = \[[^\]]*\];",
    'const MT_GALLERY = [\n  "/images/dp180-1.webp",\n  "/images/dp180-2.webp",\n];',
    src,
    count=1,
)

io.open(P, "w", encoding="utf-8").write(src)
print(f"replaced dp180-3 x{before_3}, dp180-4 x{before_4}")
print("remaining dp180-3:", src.count("dp180-3"), "| dp180-4:", src.count("dp180-4"))

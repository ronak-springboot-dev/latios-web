"""
Put the shoot on the site.

Copies what shoot_fronts.py built into frontend/public/images and repoints the
model data at it:

  * the six MT configurations share one photograph of the MT chassis and one
    gallery, and the four SFF configurations share theirs. They differ in board,
    CPU and memory, not in the box, and inventing a different-looking chassis
    per SKU would misrepresent the hardware -- which is the rule this file
    already followed for the shared interiors.

  * PROMAX gets a gallery constant of its own, holding exactly the renders it
    shows today. It was pointing at MT_GALLERY, which was harmless while that
    held generic art and becomes a false claim the moment it holds real
    photographs of a micro tower: nothing in this shoot is a workstation.

    python tools/image-processing/shoot_deploy.py
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

READY = Path(r"C:\Ronak\Latios\Images\pipeline\ready")
WEB = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
MODELS = Path(__file__).resolve().parents[2] / "frontend" / "src" / "data" / "models.js"

MT_MODELS = ["mt-amd-am4", "mt-h610-ddr4", "mt-h610-ddr5",
             "mt-pro-h610-ddr5", "mt-q670-ddr5", "mt-am5-pro-ai"]
SFF_MODELS = ["sff-h610-ddr5", "sff-am5-pro-ai", "sff-b860-pro-ai", "sff-h810-pro-ai"]
PROMAX_MODELS = ["promax-q870", "promax-t2-w880", "promax-t2-w680", "promax-t4-plus"]

# Gallery order: establish the machine, then walk round it, then open it up.
MT_ORDER = ["angle", "front", "flank", "ports", "rear", "rear-close",
            "logo", "interior", "socket"]
SFF_ORDER = ["angle", "front", "top", "rear", "rear-close", "open",
             "interior", "cooling", "storage"]


def copy_assets() -> int:
    n = 0
    for form in ("mt", "sff"):
        src = READY / "fronts" / f"{form}.webp"
        dst = WEB / "fronts" / f"{form}.webp"
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        print(f"  front  {dst.relative_to(WEB.parent)}")
        n += 1
    for src in sorted((READY / "details").glob("*.webp")):
        dst = WEB / "details" / src.name
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        n += 1
    print(f"  details {n - 2} files -> {WEB / 'details'}")
    return n


def js_array(name: str, paths: list[str], note: str) -> str:
    body = "\n".join(f'  "{p}",' for p in paths)
    return f"{note}const {name} = [\n{body}\n];"


def rewrite_models() -> None:
    s = MODELS.read_text(encoding="utf-8")

    mt = [f"/images/details/mt-{k}.webp" for k in MT_ORDER]
    sff = [f"/images/details/sff-{k}.webp" for k in SFF_ORDER]
    for p in mt + sff:
        assert (WEB.parent / p.lstrip("/")).exists(), f"missing {p}"

    # The comment above each array is part of what gets replaced. Matching only
    # the `const ...[];` left the old note in place and prepended a new one, so a
    # second run stacked duplicate comment lines above the array.
    def block(name):
        return re.search(rf"(?:^//[^\n]*\n)*const {name} = \[[^\]]*\];", s, re.M).group(0)

    old_mt, old_sff = block("MT_GALLERY"), block("SFF_GALLERY")
    promax_note = (
        "// PROMAX has no photography yet. It used to borrow MT_GALLERY, which was\n"
        "// harmless while that held generic art and would become a false claim now\n"
        "// that MT_GALLERY holds real photographs of a micro tower -- a T4 Plus is a\n"
        "// 2700W redundant-PSU workstation, not this box. So it keeps the renders it\n"
        "// was already showing, in a constant of its own, until there is a shoot.\n"
    )
    promax_paths = re.findall(r'"([^"]+)"', old_mt)

    # Idempotent on re-run: the galleries are rebuilt every time the imagery
    # changes, and without this guard a second run appends a second
    # PROMAX_GALLERY and the module stops parsing.
    blocks = [js_array(
        "MT_GALLERY", mt,
        "// Real photography of the MT chassis, shared by all six MT configurations.\n")]
    if "const PROMAX_GALLERY" not in s:
        blocks += ["", js_array("PROMAX_GALLERY", promax_paths, promax_note)]
    s = s.replace(old_mt, "\n".join(blocks), 1)
    s = s.replace(old_sff, js_array(
        "SFF_GALLERY", sff,
        "// Real photography of the SFF chassis, shared by all four SFF configurations.\n"), 1)

    # Per-model card image, and PROMAX off MT_GALLERY.
    def set_field(src: str, slug: str, pattern: str, value: str) -> str:
        a = src.index(f'slug: "{slug}"')
        b = src.find('slug: "', a + 10)
        b = len(src) if b < 0 else b
        chunk = src[a:b]
        new_chunk, n = re.subn(pattern, value, chunk, count=1)
        assert n == 1, f"{slug}: no match for {pattern}"
        return src[:a] + new_chunk + src[b:]

    for slug in MT_MODELS:
        s = set_field(s, slug, r'image: "[^"]+"', 'image: "/images/fronts/mt.webp"')
    for slug in SFF_MODELS:
        s = set_field(s, slug, r'image: "[^"]+"', 'image: "/images/fronts/sff.webp"')
    for slug in PROMAX_MODELS:
        if "gallery: MT_GALLERY," in s[s.index(f'slug: "{slug}"'):][:6000]:
            s = set_field(s, slug, r'gallery: MT_GALLERY,', 'gallery: PROMAX_GALLERY,')

    MODELS.write_text(s, encoding="utf-8")
    print(f"  models.js: {len(MT_MODELS)} MT + {len(SFF_MODELS)} SFF fronts, "
          f"2 galleries rebuilt, {len(PROMAX_MODELS)} PROMAX moved off MT_GALLERY")


def main() -> int:
    print("copying assets")
    copy_assets()
    print("rewriting model data")
    rewrite_models()
    return 0


if __name__ == "__main__":
    sys.exit(main())

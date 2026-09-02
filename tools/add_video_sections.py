"""
Insert the per-product `video` section into each tower's page data.

    python tools/add_video_sections.py --dry
    python tools/add_video_sections.py

Reuses the brace-matching insert from add_band_sections rather than repeating
it. That matters: an earlier pass here used a regex to sync the reveal manifests
and it stopped at the closing brace inside `{i}`, corrupting thirteen page files
while every route still answered HTTP 200, because CRA serves the SPA shell
whether or not the bundle compiles.

Each clip gets its own heading drawn from that model's copy, so the section does
not read as the same sentence fifteen times.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_band_sections import (PDP, find_section_start, indent_of)   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "tools/image-processing/generated/videos/manifest.json"
BAND_DATA = ROOT / "tools/image-processing/generated/band_data.json"

# Where the clip sits, by family. It goes AFTER the scroll reveal wherever there
# is one, so the page shows the machine opening under the reader's own scroll
# first and only then plays it back on its own.
ANCHORS = {
    "mt-":     ["ioMap", "featureGrid", "compare", "specTeaser"],
    "sff-":    ["statWall", "bleed", "featureGrid", "specTeaser"],
    "mff-":    ["statWall", "featureGrid", "specTeaser"],
    "promax-": ["compare", "featureGrid", "exploded", "specTeaser"],
}


def anchors_for(slug):
    for prefix, order in ANCHORS.items():
        if slug.startswith(prefix):
            return order
    return ["specTeaser"]


def block(entry, name, heading, subline, indent):
    lines = ["{",
             indent + '  "type": "video",',
             indent + f'  "src": {json.dumps(entry["src"])},',
             indent + f'  "poster": {json.dumps(entry["poster"])},',
             indent + f'  "modelName": {json.dumps(name)},',
             indent + f'  "heading": {json.dumps(heading)},',
             indent + f'  "subline": {json.dumps(subline)},',
             indent + "},",
             ""]
    return "\n".join(lines)


def main(dry=False):
    if not MANIFEST.exists():
        print("  no video manifest — run make_product_video.py first")
        return 1
    clips = json.loads(MANIFEST.read_text(encoding="utf-8"))
    data = json.loads(BAND_DATA.read_text(encoding="utf-8")) if BAND_DATA.exists() else {}

    changed = 0
    for slug, entry in clips.items():
        p = PDP / f"{slug}.js"
        if not p.exists():
            print(f"  {slug:19s} no page file")
            continue
        src = p.read_text(encoding="utf-8")
        if '"type": "video"' in src or 'type: "video"' in src:
            print(f"  {slug:19s} already has a video section")
            continue

        at = name = None
        for a in anchors_for(slug):
            at = find_section_start(src, a)
            if at is not None:
                name = a
                break
        if at is None:
            print(f"  {slug:19s} no anchor section found")
            continue

        d = data.get(slug, {})
        model_name = d.get("name", slug)
        # Per-model copy: the machine's own kicker and its first highlight, so
        # fifteen clips do not all sit under one sentence.
        heading = f"{d.get('kicker', 'See it in motion')}."
        hl = (d.get("highlights") or [""])[0]
        subline = (f"{hl}. Engineered, assembled and finished in Ahmedabad."
                   if hl else "Engineered, assembled and finished in Ahmedabad.")

        ind = indent_of(src, at)
        out = src[:at] + block(entry, model_name, heading, subline, ind) + ind + src[at:]
        print(f"  {slug:19s} clip before `{name}`  \"{heading}\"")
        if not dry:
            p.write_text(out, encoding="utf-8")
        changed += 1

    print(f"\n  {changed} page(s) {'would change' if dry else 'updated'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(dry="--dry" in sys.argv))

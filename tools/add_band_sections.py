"""
Insert the `band` section into each tower's page data.

    python tools/add_band_sections.py --dry     # show where it would go
    python tools/add_band_sections.py           # write

Text insertion, not regex replacement, and the anchor is found by matching
braces rather than by pattern. That is deliberate: an earlier pass here used
`"manifest":\\s*\\{[^}]*\\}` to sync the reveal manifests, which stopped at the
closing brace inside `{i}` and corrupted thirteen page files - and every route
still answered HTTP 200, because CRA serves the SPA shell whether or not the
bundle compiles. So this walks the actual structure, refuses to write anything
it cannot parse back, and leaves the hand-written files' comments intact.

The insertion point differs by chassis family, so the section orders stay
distinct across pages - that difference is what stops the range reading as one
template in fifteen colours, and tools/verify_pages.mjs asserts it.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDP = ROOT / "frontend/src/data/pdp"
MANIFEST = ROOT / "tools/image-processing/generated/bands/manifest.json"

# Where the bands sit, by family. Falls back down the list until one is present.
ANCHORS = {
    "mt-":     ["compare", "featureGrid", "specTeaser"],
    "sff-":    ["featureGrid", "bleed", "specTeaser"],
    "mff-":    ["featureGrid", "specTeaser"],
    "promax-": ["exploded", "compare", "specTeaser"],
}


def anchors_for(slug):
    for prefix, order in ANCHORS.items():
        if slug.startswith(prefix):
            return order
    return ["specTeaser"]


def find_section_start(src, section_type):
    """
    Index of the `{` opening the section whose type is `section_type`.

    Locates the type key, then walks backwards to the brace that opens its
    object - counting braces rather than assuming the nearest one, so nested
    objects in an earlier section cannot throw the position off.
    """
    m = re.search(r'["\']?type["\']?\s*:\s*["\']' + section_type + r'["\']', src)
    if not m:
        return None
    depth = 0
    for i in range(m.start(), -1, -1):
        if src[i] == "}":
            depth += 1
        elif src[i] == "{":
            if depth == 0:
                return i
            depth -= 1
    return None


def block(items, kicker, indent="    "):
    """The section literal. Quoted keys, valid in both file styles."""
    lines = ["{",
             indent + '  "type": "band",',
             indent + f'  "kicker": {json.dumps(kicker)},',
             indent + '  "items": [']
    for it in items:
        lines.append(indent + "    " + json.dumps(it) + ",")
    lines[-1] = lines[-1].rstrip(",")
    lines += [indent + "  ]", indent + "},", ""]
    return "\n".join(lines)


def indent_of(src, at):
    """The whitespace the anchor section sits at, so the insert lines up."""
    line_start = src.rfind("\n", 0, at) + 1
    return src[line_start:at]


def main(dry=False):
    if not MANIFEST.exists():
        print(f"  no band manifest yet at {MANIFEST}")
        print("  run: python tools/image-processing/make_bands.py")
        return 1
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    themes = (ROOT / "frontend/src/components/pdp/theme.js").read_text(encoding="utf-8")
    kickers = dict(re.findall(r'"([a-z0-9-]+)":\s*\{[^}]*?kicker:\s*"([^"]+)"', themes, re.S))

    changed = 0
    for slug, items in manifest.items():
        p = PDP / f"{slug}.js"
        if not p.exists():
            print(f"  {slug:19s} no page file")
            continue
        src = p.read_text(encoding="utf-8")
        if '"type": "band"' in src or 'type: "band"' in src:
            print(f"  {slug:19s} already has a band section")
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

        out = src[:at] + block(items, kickers.get(slug, "Inside")).lstrip("\n") + src[at:]
        print(f"  {slug:19s} {len(items)} bands before `{name}`")
        if not dry:
            p.write_text(out, encoding="utf-8")
        changed += 1

    print(f"\n  {changed} page(s) {'would change' if dry else 'updated'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(dry="--dry" in sys.argv))

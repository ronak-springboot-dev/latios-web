"""Split the supplied partner lockup into the silicon row and the origin mark.

THE PROBLEM, measured rather than described. Group-29.png is one 764x68 image
holding five marks: "Powered by", Intel, AMD, Windows, and the Make in India
lion. The lion occupies x 614..764 -- 150px, a fifth of the lockup -- and it is
the only PICTORIAL mark in a row of logotypes, built from dense cogwheel line
art with "MAKE IN INDIA" knocked out of it in reverse.

PartnerStrip renders the whole 764px strip at h-6/h-7, which is 24-28px tall.
That scales the lion to about 62x28. Its knocked-out type is then roughly four
pixels of cap height, the cogwork collapses into grey noise, and on the light
theme white letters inside a mid-grey animal have almost no contrast left. It
reads as a smudge at the end of an otherwise crisp row -- which is exactly the
note the artwork came back with.

Scaling the whole strip up does not fix it: the other four marks do not need it
and the row would then dominate the paragraph it sits under. Sharpening does
not fix it either, because the detail is not there -- the master is 150px wide
and the mark needs about 90 on screen before its type resolves.

So the lockup is SPLIT, which is also the more correct arrangement. Make in
India is an origin mark, not a silicon partner; it was sitting inside a lockup
that says "Powered by" and does not belong to that sentence. Separated, it can
be set at the size it needs -- still a DOWNSCALE from its own master, never an
upscale -- with a rule between the two groups.

Nothing is redrawn. Both pieces are exact crops of the supplied artwork, and
the light copy and the derived reversed copy are cut at the same column so the
two themes stay identical in everything but ink.

    python split_partner_lockup.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

PUBLIC = Path(__file__).resolve().parents[2] / "frontend" / "public" / "images"
OUT = PUBLIC / "partners"

#: The gap between the Windows wordmark (ends x 598) and the lion (starts
#: x 614). Cutting in the middle of it keeps both pieces whole.
CUT = 606

SOURCES = {"": "Group-29.png", "-reversed": "Group-29-reversed.png"}


def tight(img):
    """Crop to the ink, so each piece can be sized on its own content."""
    bb = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    return img.crop(bb), bb


def split():
    OUT.mkdir(parents=True, exist_ok=True)
    for suffix, src in SOURCES.items():
        im = Image.open(PUBLIC / src).convert("RGBA")
        silicon, sb = tight(im.crop((0, 0, CUT, im.height)))
        origin, ob = tight(im.crop((CUT, 0, im.width, im.height)))
        silicon.save(OUT / f"powered-by{suffix}.png")
        origin.save(OUT / f"make-in-india{suffix}.png")
        print(f"  {src}")
        print(f"      powered-by{suffix}.png  {silicon.size}  ink rows {sb[1]}..{sb[3]}")
        print(f"      make-in-india{suffix}.png  {origin.size}  ink rows {ob[1]}..{ob[3]}")

        a = np.asarray(origin.getchannel("A"))
        rows = np.flatnonzero(a.max(1) > 8)
        print(f"      lion ink height {rows[-1] - rows[0] + 1}px of {origin.height}px")


if __name__ == "__main__":
    split()

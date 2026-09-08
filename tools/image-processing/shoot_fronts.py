"""
Turn the real product shoot into site-ready fronts and detail shots.

Deliberately photographic, not generative. Every previous attempt to improve
these images ran them through a diffusion pass, and the result was always the
same complaint: it no longer looks like the actual product, and the Latios
wordmark comes back mangled. A real photograph of the real chassis needs
cutting out and grading, not re-imagining, so nothing here goes near the GPU.

Two kinds of output:

  fronts/   RGBA WebP on a transparent 1600x1280 canvas with a contact shadow,
            matching what finalize.py already produces, because the product
            cards plate them on #f2f2f0 and the dark theme shows through.
  details/  opaque 16:10 WebP for the PDP galleries -- rear I/O, ports, the
            open chassis. These keep their real background: an interior shot
            cut out of its own chassis would be nonsense.

    python tools/image-processing/shoot_fronts.py [--only tower|sff]
"""
from __future__ import annotations

import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
from rembg import new_session, remove

SHOOT = Path(r"C:\Ronak\Latios\Images\pipeline\shoot")
OUT = Path(r"C:\Ronak\Latios\Images\pipeline\ready")

CANVAS_W, CANVAS_H = 1600, 1280
MARGIN = 0.09
DETAIL_W, DETAIL_H = 1600, 1000

_session = new_session("u2net")

# ---------------------------------------------------------------------------
# The cull. Frame numbers are the contact-sheet indices from shoot_decode.py.
#
# One front per form factor, per the brief: the six MT configurations and the
# four SFF configurations differ in what is inside them, not in the chassis, so
# they share a photograph rather than each getting a faked variant.
# ---------------------------------------------------------------------------
FRONTS = {
    "mt": ("tower", 3),        # front three-quarter, whole chassis, logo readable
    # Flat three-quarter, not the standing front: standing, the SFF is a sliver
    # in a 16:9 card. This angle fills the frame, keeps the wordmark and the
    # whole front port row readable, and reads as a different machine from the
    # MT at thumbnail size, which the two straight-on fronts do not.
    "sff": ("sff", 2),
}

# Gallery frames, in the order they should appear on the product page.
#
# Two kinds, because one treatment does not fit both. A whole-chassis view has
# to be cut out and plated: the shoot is portrait, the gallery tile is 16:10,
# and centre-cropping a standing tower to that ratio leaves a sliver of chassis
# and a lot of office -- a power strip, a doorway, someone's desk. A close-up is
# already filling its frame, and its background is the product itself, so it
# keeps what the camera saw.
PLATED, CLOSEUP = "plated", "closeup"

DETAILS = {
    "mt": [
        (PLATED,  "front", "tower", 2, "Front"),
        (PLATED,  "angle", "tower", 13, "Three-quarter"),
        # "flank", not "side": details/mt-side.webp is already ART.mtSide, a
        # dark-ground asset two feature sections illustrate themselves with.
        (PLATED,  "flank", "tower", 10, "Side intake"),
        (PLATED,  "rear", "tower", 7, "Rear I/O"),
        (CLOSEUP, "rear-close", "tower", 25, "Rear I/O detail"),
        (CLOSEUP, "ports", "tower", 29, "Front ports"),
        (CLOSEUP, "logo", "tower", 26, "Brand detail"),
        (CLOSEUP, "interior", "tower", 21, "Inside"),
        (CLOSEUP, "socket", "tower", 23, "CPU socket"),
    ],
    "sff": [
        (PLATED,  "front", "sff", 1, "Front"),
        (PLATED,  "angle", "sff", 2, "Three-quarter"),
        (PLATED,  "top", "sff", 3, "Top intake"),
        (PLATED,  "rear", "sff", 4, "Rear I/O"),
        (PLATED,  "open", "sff", 12, "Tool-free access"),
        (CLOSEUP, "rear-close", "sff", 6, "Rear I/O detail"),
        (CLOSEUP, "interior", "sff", 16, "Inside"),
        (CLOSEUP, "cooling", "sff", 8, "Cooling"),
        (CLOSEUP, "storage", "sff", 11, "M.2 storage"),
    ],
}


def frame(shoot_set: str, index: int) -> Path:
    """Resolve a contact-sheet index to its decoded file."""
    hits = sorted((SHOOT / shoot_set).glob(f"{index:02d}-*.jpg"))
    if not hits:
        raise FileNotFoundError(f"{shoot_set} frame {index:02d} not decoded")
    return hits[0]


def grade(img: Image.Image) -> Image.Image:
    """
    Bring a phone photo up to catalogue standard without touching the product.

    Autocontrast is applied to luminance only and with a cut, so a black chassis
    against a bright wall does not get crushed to silhouette, and the colour
    channels are left alone -- a grey-world balance on a mostly-black subject
    drags the whole frame blue.
    """
    lab = img.convert("RGB")
    lum = ImageOps.autocontrast(lab.convert("L"), cutoff=(0.4, 0.6))
    graded = Image.merge("RGB", [
        Image.blend(ch, lum, 0.35) for ch in lab.split()
    ])
    graded = ImageEnhance.Color(graded).enhance(1.06)
    graded = ImageEnhance.Contrast(graded).enhance(1.04)
    return graded.filter(ImageFilter.UnsharpMask(radius=2.0, percent=62, threshold=3))


def cutout(img: Image.Image) -> Image.Image:
    """
    Cut the chassis out of the room.

    Alpha matting rather than the plain mask: u2net alone leaves a pale wedge of
    wall attached to the SFF's right edge where a black panel meets a bright
    background, and it is attached to the subject, so no connected-component
    filter removes it. Matting resolves that boundary and costs a few seconds.
    """
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="PNG")
    cut = remove(
        buf.getvalue(),
        session=_session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=250,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=12,
    )
    return Image.open(io.BytesIO(cut)).convert("RGBA")


def contact_shadow(subject: Image.Image, canvas: tuple[int, int], pos: tuple[int, int]):
    """Same shadow finalize.py draws, so the new fronts sit like the old ones."""
    cw, ch = canvas
    sw, sh = subject.size
    shadow_h = max(8, int(sh * 0.09))
    strip = subject.getchannel("A").crop((0, int(sh * 0.82), sw, sh)).resize((sw, shadow_h), Image.LANCZOS)
    layer = Image.new("L", (cw, ch), 0)
    layer.paste(strip, (pos[0], min(ch - shadow_h, pos[1] + sh - int(shadow_h * 0.4))))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=max(6, sw // 50)))
    layer = layer.point(lambda v: int(v * 0.34))
    out = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    out.putalpha(layer)
    return out


def build_front(name: str, shoot_set: str, index: int) -> Path:
    src = Image.open(frame(shoot_set, index))
    rgba = cutout(grade(src))
    bbox = rgba.getchannel("A").getbbox()
    if bbox:
        rgba = rgba.crop(bbox)

    scale = min(CANVAS_W * (1 - 2 * MARGIN) / rgba.width,
                CANVAS_H * (1 - 2 * MARGIN) / rgba.height)
    rgba = rgba.resize((max(1, int(rgba.width * scale)), max(1, int(rgba.height * scale))), Image.LANCZOS)

    pos = ((CANVAS_W - rgba.width) // 2, (CANVAS_H - rgba.height) // 2)
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    canvas = Image.alpha_composite(canvas, contact_shadow(rgba, (CANVAS_W, CANVAS_H), pos))
    canvas.alpha_composite(rgba, pos)

    dst = OUT / "fronts" / f"{name}.webp"
    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dst, "WEBP", quality=92, method=6)
    return dst


def build_detail(kind: str, name: str, shoot_set: str, index: int) -> Path:
    img = grade(Image.open(frame(shoot_set, index)))
    if kind == PLATED:
        rgba = cutout(img)
        bbox = rgba.getchannel("A").getbbox()
        if bbox:
            rgba = rgba.crop(bbox)
        scale = min(DETAIL_W * (1 - 2 * MARGIN) / rgba.width,
                    DETAIL_H * (1 - 2 * MARGIN) / rgba.height)
        rgba = rgba.resize((max(1, int(rgba.width * scale)), max(1, int(rgba.height * scale))),
                           Image.LANCZOS)
        pos = ((DETAIL_W - rgba.width) // 2, (DETAIL_H - rgba.height) // 2)
        # Opaque on the same #f2f2f0 the turntable plates on, so the tile reads
        # the same whether or not the viewer's theme shows through.
        canvas = Image.new("RGBA", (DETAIL_W, DETAIL_H), (242, 242, 240, 255))
        canvas = Image.alpha_composite(canvas, contact_shadow(rgba, (DETAIL_W, DETAIL_H), pos))
        canvas.alpha_composite(rgba, pos)
        img = canvas.convert("RGB")
    else:
        img = ImageOps.fit(img, (DETAIL_W, DETAIL_H), Image.LANCZOS, centering=(0.5, 0.5))

    dst = OUT / "details" / f"{name}.webp"
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, "WEBP", quality=90, method=6)
    return dst


def sheet(paths: list[tuple[str, Path]], out: Path, plate=(242, 242, 240)) -> Path:
    """Contact-sheet the output. Every frame, always -- sampling has burned this project."""
    cols, cell = 3, 520
    rows = (len(paths) + cols - 1) // cols
    cell_h = int(cell * 0.66)
    pad, label = 10, 20
    img = Image.new("RGB", (cols * (cell + pad) + pad, rows * (cell_h + pad + label) + pad), (24, 24, 24))
    draw = ImageDraw.Draw(img)
    for i, (name, path) in enumerate(paths):
        with Image.open(path) as f:
            f = f.convert("RGBA")
            bg = Image.new("RGBA", f.size, (*plate, 255))
            bg.alpha_composite(f)
            f = bg.convert("RGB")
            f.thumbnail((cell, cell_h), Image.LANCZOS)
        x = pad + (i % cols) * (cell + pad)
        y = pad + (i // cols) * (cell_h + pad + label)
        img.paste(f, (x + (cell - f.width) // 2, y + (cell_h - f.height) // 2))
        draw.text((x + 4, y + cell_h + 4), name, fill=(200, 200, 200))
    img.save(out, "JPEG", quality=88)
    return out


def main() -> int:
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]

    made = []
    for form, (shoot_set, index) in FRONTS.items():
        if only and only != shoot_set:
            continue
        p = build_front(form, shoot_set, index)
        made.append((f"front {form}", p))
        print(f"front  {form:4s} <- {shoot_set} {index:02d}  {p}")

    details = []
    for form, items in DETAILS.items():
        for kind, name, shoot_set, index, caption in items:
            if only and only != shoot_set:
                continue
            p = build_detail(kind, f"{form}-{name}", shoot_set, index)
            details.append((f"{form}-{name} ({caption})", p))
            print(f"detail {kind:7s} {form}-{name:16s} <- {shoot_set} {index:02d}")

    if made:
        print("fronts sheet ->", sheet(made, OUT / "contact-fronts.jpg"))
    if details:
        print("details sheet ->", sheet(details, OUT / "contact-details.jpg", plate=(24, 24, 24)))
    return 0


if __name__ == "__main__":
    sys.exit(main())

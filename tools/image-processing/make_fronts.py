"""
A front view per tower, derived from the REAL Latios photographs.

    python make_fronts.py                  # every tower that has none
    python make_fronts.py mt-amd-am4       # one
    python make_fronts.py --compose-only   # re-plate, skip the GPU
    python make_fronts.py --workflow       # write the ComfyUI graph, render nothing

Why this exists
---------------
Catalogue thumbnails were shared: six MT models used dp180-1.webp and eight used
dp180-2.webp. Worse, four PROMAX workstations used MT micro-tower photographs -
a workstation sold behind a picture of a different machine.

Why these are real photographs
------------------------------
Three attempts to invent a front view all produced something that is not a
Latios, and each is recorded in the code below so it is not retried:

  1. text-to-image "front elevation"  -> a glossy rounded bezel with a honeycomb
     front panel and a green USB port, standing on a lit floor
  2. the same with a much harder prompt and negatives -> the same invented
     product, still on a floor
  3. image-edit "rotate the real photo to its front" -> the mesh window was read
     as a screen and the machine came back looking like a CRT television

The real hardware is matte and brushed, large flat inset panels, almost no
detailing, a small white wordmark, blue ports on a dark strip. A model cannot be
talked into an industrial design it has never seen.

So every thumbnail is a real photograph. The only thing that varies per model is
the framing, and nothing about the machine is altered.

What exists, and what does not:

    SFF   four genuine front three-quarters, one per model, already carrying the
          real white wordmark.
    MFF   one real three-quarter.
    MT    two closed photographs for six models - and both are side or rear
          views. There is NO front view of an MT in existence, and no
          photographed MT face carries any branding at all: just a thumbscrew
          and the mesh window.
    PROMAX never photographed. Left waiting rather than dressed up as an MT.

Output is RGBA with a transparent background, like the catalogue photographs it
replaces. The card behind it is `bg-[#f2f2f0]`, a light warm grey; an earlier
version plated these on near-black and every card became a black postage stamp
in a light frame.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).parent
GEN = HERE / "generated"
ART = GEN / "fronts-art"
OUT = GEN / "fronts"
PUBLIC = Path(r"C:\Ronak\latios-web\frontend\public\images")
WORDMARK = PUBLIC / "latios-wordmark.png"
WORKFLOWS = Path(r"C:\Ronak\ComfyUI\user\default\workflows")

# Matches the existing catalogue photographs (dp180-1 and friends are 1600x1280).
SIZE = (1600, 1280)
GROUND = (10, 10, 10)

NO_TEXT = "no text, no lettering, no logos, no brand marks, no watermark. "

# The first attempt asked for a "studio product photograph ... subtle contact
# shadow" and got exactly that: a lit floor, a softbox visible in frame and a
# three-quarter view. All three were wrong for a catalogue thumbnail - the floor
# defeated the chassis detection that places the wordmark, and the angle is not
# the front view that was asked for. This describes a flat elevation on black.
BACKDROP = ("Straight-on front elevation of the product, photographed dead "
            "centre with no perspective and no tilt, filling most of the frame. "
            "Pure black seamless background with no floor, no surface, no "
            "shadow and no visible lights. Even soft illumination across the "
            "front face, photorealistic, sharp micro detail on machined "
            "surfaces. ")

# Everything the first render put in that a catalogue thumbnail must not have.
NEG = ("floor, ground, table, desk, surface, reflection, cast shadow, lamp, "
       "softbox, light fixture, visible light source, three-quarter view, "
       "angled view, perspective, rotated, side view, room, "
       "text, lettering, words, logo, brand name, badge, sticker, watermark, "
       "label, numbers, packaging, box, hands, person, cluttered background, "
       "multiple objects, blurry, low detail, cartoon, illustration")

# slug -> (real source photograph, edit or None).
#
# `None` means the photograph already IS the thumbnail: a real front three-
# quarter with the real branding on it. Those are used untouched, because
# nothing a model produces will beat the actual product.
SOURCES = {
    # Four SFF photographs for four SFF models - genuine front three-quarters,
    # already carrying the real white wordmark.
    "sff-h610-ddr5":    ("dp80-1.webp", (1.00,  0.00)),
    "sff-am5-pro-ai":   ("dp80-2.webp", (1.00,  0.00)),
    "sff-b860-pro-ai":  ("dp80-3.webp", (1.00,  0.00)),
    "sff-h810-pro-ai":  ("dp80-4.webp", (1.00,  0.00)),

    "mff-dp10":         ("dp10-2.webp", (1.00,  0.00)),

    # Six MT models, two photographs, because there are two closed MT
    # photographs in existence and the six machines ARE the same chassis.
    # Framing varies (zoom, horizontal bias) so the catalogue does not show one
    # file six times; the machine itself is never altered.
    "mt-amd-am4":       ("dp180-1.webp", (1.00,  0.00)),
    "mt-h610-ddr4":     ("dp180-2.webp", (1.00,  0.00)),
    "mt-h610-ddr5":     ("dp180-1.webp", (1.14, -0.06)),
    "mt-pro-h610-ddr5": ("dp180-2.webp", (1.14,  0.06)),
    "mt-q670-ddr5":     ("dp180-1.webp", (0.90,  0.05)),
    "mt-am5-pro-ai":    ("dp180-2.webp", (0.90, -0.05)),

    # PROMAX: waiting on a photograph. Drop any shot of a PROMAX into
    # DROP (tools/image-processing/incoming/promax.*) and re-run - it goes
    # through the identical pipeline as the other eleven: matte out the
    # background, plate it, vary the framing per model. Until then these four
    # are skipped and keep whatever they have, rather than being dressed up as
    # an MT micro-tower, which is the mismatch this work started from.
    "promax-q870":      (None, (1.00,  0.00)),
    "promax-t2-w880":   (None, (1.12, -0.05)),
    "promax-t2-w680":   (None, (0.92,  0.05)),
    "promax-t4-plus":   (None, (1.06,  0.00)),
}

# Where to put the PROMAX photograph when there is one. Any common image format;
# a phone shot on a desk is fine, the background is matted out anyway.
DROP = HERE / "incoming"


def promax_photo():
    if not DROP.is_dir():
        return None
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.JPG", "*.JPEG"):
        for f in sorted(DROP.glob(f"promax{ext[1:]}")) or sorted(DROP.glob(ext)):
            return f
    return None

# Nothing is edited any more. Three attempts at inventing an MT front view all
# produced something that is not a Latios:
#
#   1. text-to-image "front elevation"  -> a glossy rounded bezel with a
#      honeycomb front panel and a green USB port, on a lit floor
#   2. the same with a harder prompt    -> same product, still a lit floor
#   3. image-edit "rotate to the front" -> the mesh window was reinterpreted as
#      a screen and the machine came back looking like a CRT television
#
# The real hardware is matte, flat-panelled and almost featureless, and a model
# cannot be talked into an industrial design it has never seen. So every
# thumbnail is now a real photograph, and the only thing that varies per model is
# the framing.
EDITS = {}
NEEDS_MARK = set()

# --- studio pass ------------------------------------------------------------
#
# The catalogue photographs are phone shots: flat light, dust, fingerprints and
# an uneven falloff. `--studio` runs each one through Qwen-Image-Edit asking ONLY
# for lighting and cleanliness, never for geometry.
#
# That distinction is the whole point. Asking this model to ROTATE the machine
# made it reinterpret the mesh window as a screen and hand back a CRT television.
# Asking it to relight the same view is a far smaller ask, and the shape, panels,
# ports and proportions all stay in the pixels it was given.
STUDIO = (
    "Studio product photograph of this exact computer. Keep the identical shape, "
    "the identical panel layout, the identical ports and the identical camera "
    "angle - do not redesign anything and do not rotate it. Clean the dust, "
    "smudges and fingerprints off its surfaces. Light it evenly with a large "
    "even light across the whole machine with no strong falloff and no bright "
    "hotspot. It stays a DEEP MATTE BLACK product, not grey and not silver. "
    "Deep clean black background, no floor, no reflection, no shadow. Crisp, "
    "sharp, high-resolution commercial product photography. "
    "no text, no lettering, no added logos, no watermark. ")

STUDIO_NEG = (", different shape, redesigned, rotated, different angle, "
              "glossy plastic, honeycomb panel, coloured ports, gaming PC, "
              "RGB lighting, floor, ground, reflection, lamp, softbox, "
              "grey body, silver body, washed out, strong gradient, hotspot, "
              "text, lettering, logo, watermark, screen, monitor, television")

# Retained only for --workflow, which needs a representative prompt.
FRONTS = {
    "mt-amd-am4":       "a compact black micro-tower desktop computer seen straight on from the front, upright, taller than it is wide, a matte black bezel with a fine ventilation mesh down one side, a small round power button near the top and a row of USB ports beside it",
    "mt-h610-ddr4":     "a compact black micro-tower desktop computer seen straight on from the front, upright, a matte black bezel with a brushed panel and a vertical ventilation strip, a power button and four USB ports at the top, a slim optical bay line across the upper third",
    "mt-h610-ddr5":     "a compact black micro-tower desktop computer seen straight on from the front, upright, a matte black bezel with a wide ventilation mesh panel, a power button and a row of USB ports including one USB-C at the top",
    "mt-pro-h610-ddr5": "a compact black micro-tower desktop computer seen straight on from the front, upright, a brushed dark bezel with a recessed handle groove, a power button, four USB ports and an audio jack in a neat row",
    "mt-q670-ddr5":     "a compact black micro-tower desktop computer seen straight on from the front, upright, a plain matte business bezel with a small ventilation grille, a power button, USB ports and a physical lock point at the lower edge",
    "mt-am5-pro-ai":    "a compact black micro-tower desktop computer seen straight on from the front, upright, a matte black bezel with a diagonal ventilation pattern, a power button and a row of USB ports including USB-C",

    "sff-h610-ddr5":    "a slim black small-form-factor desktop computer seen straight on from the front, wide and low, lying flat, a narrow front face with a row of USB ports, an audio jack and a small power button along it, a fine ventilation grille across the lower half",
    "sff-am5-pro-ai":   "a slim black small-form-factor desktop computer seen straight on from the front, wide and low, lying flat, a narrow front face with USB-A and USB-C ports and a small power button, a ribbed ventilation band across the lower half",
    "sff-b860-pro-ai":  "a slim black small-form-factor desktop computer seen straight on from the front, wide and low, lying flat, a narrow front face with two USB-C ports beside three USB-A ports and a power button, a fine mesh grille below",
    "sff-h810-pro-ai":  "a slim black small-form-factor desktop computer seen straight on from the front, wide and low, lying flat, a plain narrow front face with a small cluster of USB ports and a power button at one end",

    "mff-dp10":         "a very small black mini PC seen straight on from the front, about the size of a hardback book standing upright on a slim foot, a compact face with a power button, two USB ports and an audio jack, a fine ventilation mesh panel",

    "promax-q870":      "a large black workstation tower computer seen straight on from the front, tall and upright, a full-height brushed bezel with a broad ventilation mesh, a power button, four USB ports and two drive bays across the upper section",
    "promax-t2-w880":   "a large black workstation tower computer seen straight on from the front, tall and upright, a full-height bezel with a deep honeycomb ventilation panel, a power button, a row of USB ports and two drive bays",
    "promax-t2-w680":   "a large black workstation tower computer seen straight on from the front, tall and upright, a full-height brushed bezel with a vertical vent channel down the centre, a power button, USB ports and two drive bays",
    "promax-t4-plus":   "a very large black dual-supply workstation tower computer seen straight on from the front, very tall and upright, a full-height honeycomb ventilation bezel, a power button and a row of USB ports at the top, two drive bays, and two power supply bays visible at the base",
}

# Where the wordmark sits on the bezel, as a fraction of the chassis box, and how
# wide it is relative to the chassis. Slim machines wear it to one side on the
# front face; upright ones wear it low and centred, as the photographs show.
# The renders come back at three-quarters however firmly the prompt asks for a
# flat elevation - and that is fine, the real catalogue photographs are three
# quarters too. It does mean the front bezel sits in the LEFT third of the
# subject box, not the middle, so a centred mark straddles the bezel/mesh seam.
PLACEMENT = {
    "wide":    {"cx": 0.62, "cy": 0.55, "w": 0.20},   # SFF: on the narrow front face
    "upright": {"cx": 0.34, "cy": 0.86, "w": 0.20},   # towers: low on the bezel
    "mini":    {"cx": 0.38, "cy": 0.84, "w": 0.30},   # MFF: small box, bigger share
}


def placement_for(slug):
    if slug.startswith("sff-"):
        return PLACEMENT["wide"]
    if slug.startswith("mff-"):
        return PLACEMENT["mini"]
    return PLACEMENT["upright"]


def prompt_for(slug):
    return f"{BACKDROP}The subject is {FRONTS[slug]}. {NO_TEXT}"


def silhouette_box(img, thresh=26):
    """
    The CHASSIS's bounding box, so the wordmark lands on the machine.

    Largest connected blob, not a bare threshold. A raw threshold took in the
    lit floor and the softbox from the first render, so the box was nearly the
    whole frame and the wordmark ended up on the floor below the machine.
    """
    from scipy import ndimage
    lum = np.asarray(img.convert("L"))
    m = lum > thresh
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = lab == (int(np.argmax(sizes)) + 1)
    m = ndimage.binary_fill_holes(m)
    ys, xs = np.nonzero(m)
    if not len(xs):
        w, h = img.size
        return (0, 0, w, h)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def wordmark(width, tone=(228, 232, 236), opacity=0.92):
    """
    The real wordmark, masked by its own alpha and re-toned.

    The asset is brand blue on transparency; on the photographed hardware the
    mark reads light against the black bezel, so it is filled rather than used
    as-is. Only the alpha is taken from the file, so the letterforms are exactly
    the real ones.
    """
    src = Image.open(WORDMARK).convert("RGBA")
    src = src.crop(src.getchannel("A").getbbox())
    h = max(1, round(src.height * width / src.width))
    src = src.resize((width, h), Image.LANCZOS)
    a = np.asarray(src.getchannel("A")).astype(np.float32) * opacity
    out = Image.new("RGBA", src.size, tone + (0,))
    out.putalpha(Image.fromarray(a.clip(0, 255).astype(np.uint8)))
    return out


def compose(art, slug, framing=(1.0, 0.0)):
    """
    Cut the machine out and frame it on TRANSPARENCY.

    Transparent, not plated. The catalogue card is `bg-[#f2f2f0]`, a light warm
    grey, and the existing photographs are RGBA cut-outs (dp180-1 is 28.3%
    transparent) so the product floats on whatever the card is. Plating these on
    near-black instead turned every card into a black postage stamp in a light
    frame - the machine was right and the mount was wrong.

    Sources that already carry alpha keep it: the catalogue webps were matted
    once, carefully, and re-running rembg over them can only lose edge quality.
    Only a fresh photograph gets a new matte.
    """
    if art.mode == "RGBA" and np.asarray(art.getchannel("A")).min() < 250:
        rgba = art
    else:
        from process import cutout, trim_to_subject
        rgba = trim_to_subject(cutout(art.convert("RGB")))

    bbox = rgba.getchannel("A").getbbox()
    if bbox:
        rgba = rgba.crop(bbox)

    W, H = SIZE
    zoom, bias = framing
    s = min(W * 0.86 / rgba.width, H * 0.86 / rgba.height) * zoom
    rgba = rgba.resize((max(1, round(rgba.width * s)), max(1, round(rgba.height * s))),
                       Image.LANCZOS)

    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(rgba,
              ((W - rgba.width) // 2 + round(W * bias), (H - rgba.height) // 2),
              rgba)
    return out


def save_workflow():
    """
    Write the front-view graph as JSON beside the hand-saved Qwen workflow.

    API format - the same payload this toolchain POSTs to /prompt - so the graph
    is reproducible outside these scripts.
    """
    import gen_components
    WORKFLOWS.mkdir(parents=True, exist_ok=True)
    g = gen_components.graph(prompt_for("mt-amd-am4"), 1, upscale=False, neg=NEG)
    p = WORKFLOWS / "latios front view (api).json"
    p.write_text(json.dumps(g, indent=2), encoding="utf-8")
    print(f"  wrote {p}")


def flatten(src):
    """The catalogue images are RGBA cut-outs; the sampler wants RGB."""
    im = Image.open(src).convert("RGBA")
    bg = Image.new("RGB", im.size, GROUND)
    bg.paste(im, (0, 0), im)
    return bg


def build(slug, compose_only=False, studio=False):
    if slug not in SOURCES:
        print(f"  {slug}: not a configured tower")
        return None
    photo, framing = SOURCES[slug]
    OUT.mkdir(parents=True, exist_ok=True)
    if photo is None:
        src = promax_photo()
        if src is None:
            print(f"  {slug:19s} waiting on a PROMAX photograph "
                  f"-> drop one in {DROP.name}/")
            return None
    else:
        src = PUBLIC / photo
    if not src.exists():
        print(f"  {slug:19s} missing {photo}")
        return None

    art = Image.open(src).convert("RGBA")
    if studio:
        studio_p = ART / f"studio-{slug}.png"
        if not studio_p.exists():
            import comfy_client
            ART.mkdir(parents=True, exist_ok=True)
            # The sampler wants RGB, and it must see the machine on the same
            # black the output sits on, or it relights toward whatever ground
            # it imagines instead.
            flat = Image.new("RGB", art.size, (8, 8, 10))
            flat.paste(art, (0, 0), art)
            tmp = ART / f"_in-{slug}.png"
            flat.save(tmp)
            print(f"  {slug:19s} studio pass on {src.name} ...", flush=True)
            got = comfy_client.edit(str(tmp), None, STUDIO, f"studio-{slug}.png",
                                    neg_extra=STUDIO_NEG, denoise=0.72)
            Image.open(got).convert("RGB").save(studio_p)
            tmp.unlink(missing_ok=True)
        art = Image.open(studio_p).convert("RGB")

    img = compose(art, slug, framing)
    out = OUT / f"{slug}.webp"
    img.save(out, "WEBP", quality=90, method=5, exact=True)
    zoom, bias = framing
    print(f"  {slug:19s} <- {src.name:14s} zoom {zoom:.2f} bias {bias:+.2f}  "
          f"{out.stat().st_size // 1024} KB")
    return f"/images/fronts/{slug}.webp"


if __name__ == "__main__":
    if "--workflow" in sys.argv:
        save_workflow()
        sys.exit(0)
    names = [a for a in sys.argv[1:] if not a.startswith("--")] or list(SOURCES)
    made = {}
    for n in names:
        r = build(n, "--compose-only" in sys.argv, "--studio" in sys.argv)
        if r:
            made[n] = r
    if made:
        (OUT / "manifest.json").write_text(json.dumps(made, indent=2), encoding="utf-8")

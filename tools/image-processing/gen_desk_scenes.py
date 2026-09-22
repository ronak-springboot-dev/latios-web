"""In-situ scenes for the desktop pages: a real machine on a generated desk.

The desktop product pages have no imagery of a machine in use. They run on
studio component plates and chassis cards, which say what is inside the box and
nothing about the box being on a desk. The reference storefront's feature bands
are all in-situ, and that is the gap.

The method is the one this repo already settled and proved. brand_composite.py:

    "The image model cannot render the wordmark reliably -- it produced
     'Lotios' twice on the cloud model and duplicated/garbled it locally. So we
     never ask it to. Instead the scene is generated brand-free, and the genuine
     assets are composited in afterwards."

So the room is generated under a no-text, no-computer negative, and the REAL
photographed chassis is composited into it with a contact shadow. images/
office.webp is an existing output of that path and its wordmark reads correctly.

NO PEOPLE. Not squeamishness -- faces and hands are the weakest thing these
models do, and a mangled hand on a product page is worse than an empty chair.
The scenes read as in-use the way a photographer does it without a model: lit
screens, a chair pushed back, a cup, work in progress. gen_scenes.py already
takes the same line on peripherals, describing them as unbranded.

THE GATE, and it is not optional: every output is read at full size before it
ships. If the wordmark on the composited chassis is not exactly "Latios", or
the model has grown a second machine, the scene is discarded. qwen_scenes.py
records the same rule, and banner-latios-tower.webp is what happens when it is
skipped.

    python gen_desk_scenes.py            # every scene not yet rendered
    python gen_desk_scenes.py mt-office
"""
import os
import sys
import uuid
from pathlib import Path

import gen_components as gc

os.environ.setdefault("LATIOS_UNET", "2511")

OUT = Path(__file__).parent / "generated" / "desk-scenes"
WIDE = (1664, 928)

#: Shot on the room, not on the product. Every one of these is a photograph
#: brief: what the light is doing, what is on the desk, where the empty space
#: for the machine is. The machine itself is composited afterwards, so the
#: prompt must NOT produce one -- hence the desk-tower terms in the negative.
#:
#: AND THE SPACE IS DESCRIBED IN LOWER CASE, in plain words. The first pass
#: asked for "CLEAR EMPTY COUNTER SPACE" and the reception scene came back with
#: CLEAR EMPTY COUNTERE spelled out in raised signage letters on the front of
#: the desk. Capitals read as a sign to render rather than as an instruction --
#: the same failure gen_am4.py records for similes and millimetres: anything
#: nameable in a prompt is something the model may draw.
STYLE = (
    "professional interior photograph of a real working desk, natural daylight "
    "from a window to one side, shallow warm shadows, clean modern workspace, "
    "realistic materials, fine surface texture on wood and fabric, sharp focus "
    "across the desk, photographed at desk height from a low three-quarter "
    "angle, nobody in the picture"
)

SCENES = {
    #: v2. The first version asked for "an uncluttered stretch of bare desktop to
    #: the right of the monitors" and the model put a coffee cup in it and ended
    #: the desk two-thirds across the frame. Measuring the composite showed the
    #: tower standing where there was NO DESK AT ALL -- more than half of it
    #: past the desk's right end, in front of the window. Two changes: the desk
    #: is told to run off the edge of the frame, so the empty area has depth
    #: behind it, and every prop that kept landing in that area is named in the
    #: negative. The camera also comes up off the desk a little: at eye level
    #: with the surface there is no visible plane for a product to stand on, and
    #: "floating" is what that looks like.
    "mt-office": (WIDE,
        "a tidy corporate office desk seen from a three-quarter angle slightly "
        "above the desk surface: a light oak desktop that runs off the right "
        "edge of the frame, two slim black monitors on a stand at the left of "
        "the desk, both switched on showing plain abstract dark charts, a black "
        "keyboard and mouse in front of them, a closed notebook and a pen at the "
        "far left, and the whole right half of the desk is bare empty wood with "
        "nothing standing on it. A mesh office chair is pushed back, empty. "
        "Morning light from a window on the left. " + STYLE),

    #: v2, for the same reason: the potted plant and the graphics tablet took
    #: the right of the desk and left no run of surface a tower could stand on.
    "mt-studio": (WIDE,
        "a design studio desk seen from a three-quarter angle slightly above the "
        "desk surface: a pale birch desktop against a white brick wall, running "
        "off the right edge of the frame, one wide monitor at the left switched "
        "on showing a plain dark abstract layout, a mechanical keyboard and a "
        "stack of colour swatches in front of it, and the whole right half of "
        "the desk is bare empty wood with nothing standing on it. Warm "
        "afternoon light. " + STYLE),

    #: v2. "a bare stretch of desktop at the right end" came back with the
    #: headset in it and the desk's front edge rising away, so a tower placed
    #: there overhung the front of the desk however high it was put.
    "mt-control": (WIDE,
        "a control room desk seen from a three-quarter angle slightly above the "
        "desk surface: a long dark grey desktop that runs off the right edge of "
        "the frame, three monitors in a row at the left, all switched on showing "
        "plain abstract dark dashboards, a black keyboard in front of them, and "
        "the whole right half of the desk is bare empty surface with nothing "
        "standing on it. Cool even ceiling light, dim room. " + STYLE),

    #: v2. The desk ended just past the lamp, so the only clear surface was the
    #: last few percent of the frame and the machine perched on the end of it.
    "sff-desk": (WIDE,
        "a compact home-office desk seen from a three-quarter angle slightly "
        "above the desk surface: a deep walnut desktop against a plain painted "
        "wall, running off the right edge of the frame, one monitor at the left "
        "switched on showing a plain dark abstract image, a low-profile keyboard "
        "and mouse in front of it, and the whole right half of the desk is bare "
        "empty wood with nothing standing on it. Soft daylight. " + STYLE),

    "sff-reception": (WIDE,
        "a reception counter seen from a low three-quarter angle: a pale stone "
        "counter top, one monitor switched on showing a plain dark abstract "
        "screen, a keyboard, a card reader, a small tray, and a bare stretch of counter top to the left. Bright even daylight, "
        "clean minimal lobby behind, out of focus. " + STYLE),

    #: v2, same correction: the bench's far edge sat exactly where the machine
    #: went, which put the background benches directly behind it at the same
    #: height and made it read as floating in the room.
    "sff-lab": (WIDE,
        "a university computer lab bench seen from a three-quarter angle "
        "slightly above the bench surface: a deep light laminate bench that runs "
        "off the right edge of the frame, one monitor at the left switched on "
        "showing a plain dark abstract screen, a keyboard and mouse and a "
        "notebook in front of it, and the whole right half of the bench is bare "
        "empty laminate with nothing standing on it. Even fluorescent daylight, "
        "rows of identical benches out of focus behind. " + STYLE),
}

#: The room must arrive EMPTY of computers. Anything the model puts on the desk
#: in the machine's place has to be cut out again, and an invented tower wearing
#: an invented wordmark is exactly what this pipeline exists to avoid.
#: The props are in here by name because they are what filled the space the
#: prompt reserved. "an uncluttered stretch of bare desktop" reads to the model
#: as a description of a desk, not as a constraint; naming the objects it keeps
#: reaching for is what actually clears the area.
NEG = gc.NEG + (
    ", desktop computer, computer tower, pc case, server, mini pc, laptop, "
    "person, people, man, woman, hands, face, figure, "
    "text, lettering, words, logos, brand names, badges, stickers, watermark, "
    "coffee cup, mug, potted plant, table lamp, graphics tablet, headphones, "
    "clutter, mess, cables everywhere, blurry, out of focus"
)


def t2i(name, size, prompt):
    OUT.mkdir(parents=True, exist_ok=True)
    seed = uuid.uuid4().int % (2 ** 31)
    g = gc.graph(prompt, seed, upscale=True, neg=NEG)
    g["6"]["inputs"]["width"], g["6"]["inputs"]["height"] = size
    pid = gc._post("/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
    print(f"{name}: queued {pid} {size[0]}x{size[1]} (seed {seed})", flush=True)
    files, secs = gc.wait(pid)
    f = files[0]
    src = gc.COMFY / "output" / (f.get("subfolder") or "") / f["filename"]
    dest = OUT / f"{name}.png"
    dest.write_bytes(src.read_bytes())
    print(f"  saved {dest.name} ({dest.stat().st_size // 1024} KB) in {secs/60:.1f} min",
          flush=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    force = "--force" in args
    only = [a for a in args if not a.startswith("--")]
    for name, (size, prompt) in SCENES.items():
        if only and name not in only:
            continue
        if not force and (OUT / f"{name}.png").exists():
            print(f"{name}: have it (--force to re-roll)", flush=True)
            continue
        try:
            t2i(name, size, prompt)
        except Exception as exc:
            print(f"  FAILED {name}: {type(exc).__name__}: {exc}", flush=True)
    print("done", flush=True)

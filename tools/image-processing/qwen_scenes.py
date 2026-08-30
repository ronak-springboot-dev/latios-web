"""
Place the REAL photographed Latios hardware into the clean generated rooms.

The scenes in generated/scene-*.png are good editorial photographs with no
hardware and no lettering in them — that part was never the problem. The problem
was the previous compositing step, which pasted an AI-invented product wearing a
misspelt wordmark onto them with no perspective or shadow.

Here the product comes from ref-*.png, which are the actual product photographs
(transparent cutouts flattened onto white), and Qwen-Image-Edit re-renders them
into the room. It is an identity-preserving edit model, so the chassis shape,
the port layout and the Latios lettering survive the transform — the thing plain
img2img cannot do without destroying them.

Every output must still be checked before it ships: if the wordmark is not
exactly "Latios", the output is discarded and the product-free scene stays.

    python qwen_scenes.py            # run all jobs
    python qwen_scenes.py ops        # run one
"""
import sys
from pathlib import Path

from comfy_client import edit

G = Path(__file__).parent / "generated"

KEEP = ("Keep the computer's exact shape, proportions, front port layout and the "
        "'Latios' logo on it completely unchanged and clearly legible. "
        "Do not add any other logo, badge, text or lettering anywhere in the image. "
        "Photorealistic, matching the first image's camera angle, lens and depth of field.")

JOBS = {
    "ops": (
        "scene-ops.png", "ref-sff.png",
        "Place the black slim desktop computer from the second image on the white desk "
        "in the first image, lying flat on the left of the desk in front of the monitors, "
        "at a natural three-quarter angle. Light it with the same cool daylight coming "
        "from the window and ground it with a soft contact shadow on the desk. " + KEEP,
    ),
    "home-setup": (
        "scene-home-setup.png", "ref-sff.png",
        "Place the black slim desktop computer from the second image on the light oak desk "
        "in the first image, standing to the right of the monitor beside the small plant. "
        "Light it with the same warm morning sunlight from the side window and ground it "
        "with a soft contact shadow on the wood. " + KEEP,
    ),
    "office": (
        "../../../frontend/public/images/office.webp", "ref-sff.png",
        "Place the black slim desktop computer from the second image on the desk in the "
        "first image, standing upright beside the monitor. Match the room's lighting and "
        "add a soft contact shadow. " + KEEP,
    ),
    "display": (
        "scene-display.png", "ref-mt.png",
        "Place the black desktop tower computer from the second image on the floor under "
        "the desk in the first image, to the right, partly in shadow. Match the dim cool "
        "studio lighting of the room and ground it with a soft shadow on the floor. " + KEEP,
    ),
}


def run(name):
    scene, ref, prompt = JOBS[name]
    src = G / scene
    if not src.exists():
        print(f"  SKIP {name}: {scene} not present")
        return
    print(f"{name}:")
    edit(str(src), str(G / ref), prompt, f"qwen-{name}.png")


if __name__ == "__main__":
    names = sys.argv[1:] or list(JOBS)
    for n in names:
        try:
            run(n)
        except Exception as e:
            print(f"  FAILED {n}: {type(e).__name__}: {e}")

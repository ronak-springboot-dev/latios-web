"""
Regenerate the remaining MSI *scene* images with the local FLUX stack.

These slots are context/marketing art, not product shots, so nothing here needs
to depict a specific Latios machine — the brief is simply: no third-party logos,
no invented "Latios" hardware. Peripherals are described as unbranded and text is
suppressed, since FLUX garbles lettering.
"""
import sys, time
from forge_client import t2i

NEG_EXTRA = "no text, no lettering, no words, no logos, no brand names, no badges, no stickers"

JOBS = [
    ("ops", 1216, 768,
     "Editorial photograph of a calm modern enterprise IT operations room, a row of "
     "unbranded flat monitors on a clean desk showing abstract blue dashboard graphs, "
     "soft daylight from a window, muted grey and blue palette, shallow depth of field, "
     "corporate and orderly, nobody in frame, " + NEG_EXTRA),

    ("home-setup", 1216, 912,
     "Editorial photograph of a tidy modern home office desk, a single unbranded black "
     "monitor, a low-profile black keyboard and mouse on light oak, a small plant and a "
     "notebook, warm morning daylight from a side window, clean minimal Scandinavian "
     "interior, shallow depth of field, nobody in frame, " + NEG_EXTRA),

    ("display", 1216, 768,
     "Editorial photograph of a professional multi-display workstation, three unbranded "
     "slim bezel monitors side by side on a dark desk showing abstract colour-grading and "
     "CAD wireframe visuals, dim studio lighting with cool blue ambience, deep shadows, "
     "premium creative workspace, nobody in frame, " + NEG_EXTRA),

    ("ddr5", 1216, 768,
     "Extreme macro photograph of two black DDR5 memory modules seated in a motherboard's "
     "memory slots, gold contact pins catching the light, dense PCB traces and capacitors "
     "behind, cool blue rim lighting, very shallow depth of field, dark premium technical "
     "mood, ultra sharp detail, " + NEG_EXTRA),

    ("triple", 1216, 768,
     "Editorial photograph of a compact workspace driving three unbranded monitors from one "
     "small black computer, monitors show abstract spreadsheet and chart shapes, clean white "
     "desk, bright even office daylight, tidy cable management, nobody in frame, " + NEG_EXTRA),

    ("cable", 1216, 768,
     "Close-up photograph of neatly routed black cables plugging into the rear connectivity "
     "panel of a matte black computer chassis, HDMI DisplayPort USB and ethernet connectors, "
     "warm practical desk lighting, shallow depth of field, tidy and premium, " + NEG_EXTRA),
]

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for name, w, h, prompt in JOBS:
        if only and only != name:
            continue
        print(f"--- {name} ({w}x{h})")
        t0 = time.time()
        try:
            t2i(prompt, f"scene-{name}.png", w, h)
        except Exception as e:
            print(f"    FAILED: {e}")
        print(f"    {time.time()-t0:.0f}s total")

import os
from PIL import Image

ORIG = r"C:\Users\Admin\AppData\Local\Temp\claude\C--Ronak-latios-web\e8447592-5cdc-4797-9fb6-990e570177e8\scratchpad\orig"

for f in sorted(os.listdir(ORIG)):
    p = os.path.join(ORIG, f)
    im = Image.open(p)
    has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
    print(f"{f} | mode={im.mode} size={im.size} has_alpha={has_alpha}")
    rgb = im.convert("RGB")
    w, h = rgb.size
    corners = [
        rgb.getpixel((2, 2)),
        rgb.getpixel((w - 3, 2)),
        rgb.getpixel((2, h - 3)),
        rgb.getpixel((w - 3, h - 3)),
    ]
    print(f"   corners: {corners}")
    if im.mode == "RGBA":
        a = im.getchannel("A")
        print(f"   alpha range: {a.getextrema()}")

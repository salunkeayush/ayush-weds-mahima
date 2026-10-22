"""Build the per-panel control masks used by js/live.js.
R = wind amplitude (hair, cloth, leaves, mist), G = glow (bright lights, auto from luminance), B = depth (near=1).
Hand-placed soft ellipses in panel pixels; run after prepare_assets.py:  python scripts/make_masks.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / "assets" / "img"

# (cx, cy, rx, ry, amplitude)
WIND = {
    "met": [(100, 50, 42, 26, .5), (392, 165, 58, 92, 1.0), (60, 15, 95, 28, .55), (470, 55, 62, 62, .5)],
    "grew": [(215, 140, 78, 82, 1.0), (385, 72, 40, 24, .5), (440, 150, 70, 55, .25)],
    "apart": [(55, 125, 58, 68, 1.0), (430, 68, 32, 20, .5), (80, 75, 72, 26, .4), (250, 110, 72, 95, .4)],
    "distance": [(402, 142, 58, 88, 1.0), (305, 60, 40, 28, .4), (150, 40, 210, 42, .25)],
    "hands": [(60, 60, 62, 62, .3), (400, 110, 125, 100, .3)],
    "venue": [(30, 110, 55, 70, .55), (480, 115, 55, 70, .55), (255, 118, 215, 26, .6), (255, 30, 250, 36, .25), (130, 140, 40, 40, .4), (385, 140, 40, 40, .4)],
}
DEPTH = {
    "met": [(90, 200, 105, 125, 1.0), (400, 200, 95, 112, .9)],
    "grew": [(310, 150, 165, 92, .9)],
    "apart": [(55, 140, 70, 80, .9), (430, 150, 80, 70, .9)],
    "distance": [(345, 150, 105, 105, 1.0)],
    "hands": [(180, 120, 85, 95, 1.0)],
    "venue": [(255, 265, 265, 50, .9), (255, 150, 150, 70, .45), (40, 120, 60, 80, .6), (480, 120, 60, 80, .6)],
}
GLOW_THRESHOLD = {"met": 0.84, "grew": 0.8, "apart": 2.0, "distance": 0.88, "hands": 0.72, "venue": 0.86}  # 2.0 = no glow
GLOW_REGION = {"hands": (110, 0, 260, 110)}  # sparkle on bangles + henna


def blob(h, w, ellipses):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    out = np.zeros((h, w), np.float32)
    for cx, cy, rx, ry, a in ellipses:
        d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
        s = np.clip(1.15 - d, 0, 1)
        out = np.maximum(out, (s * s * (3 - 2 * s)) * a)
    return out


for name in WIND:
    im = Image.open(IMG / f"panel-{name}.webp").convert("RGB")
    w, h = im.size
    lum = np.asarray(im.convert("L"), np.float32) / 255
    th = GLOW_THRESHOLD[name]
    glow = np.clip((lum - th) / 0.14, 0, 1)
    if name in GLOW_REGION:
        x0, y0, x1, y1 = GLOW_REGION[name]
        keep = np.zeros_like(glow); keep[y0:y1, x0:x1] = 1
        glow = np.maximum(glow * 0.6, glow * keep)
    mask = np.dstack([blob(h, w, WIND[name]), glow, np.maximum(blob(h, w, DEPTH[name]), 0.15)])
    Image.fromarray((mask * 255).astype(np.uint8), "RGB").save(IMG / f"mask-{name}.png", optimize=True)
    print(name, (w, h))

"""Inpaint the baked-in captions out of the inspiration-panel crops (run after prepare_assets.py)."""
from pathlib import Path
import cv2, numpy as np
OUT = Path(__file__).resolve().parent.parent / "assets" / "img"
BOXES = {  # panel -> [(x0,y0,x1,y1)] caption regions in panel pixels
    "panel-met": [(225, 45, 370, 105)],
    "panel-grew": [(10, 25, 215, 95)],
    "panel-apart": [(150, 80, 335, 175)],
    "panel-distance": [(15, 28, 205, 125)],
    "panel-hands": [(280, 30, 505, 210)],
}
BRIGHT = {"panel-hands": 190}  # text is near-white on a dark bokeh background
_unused = {
}
for name, boxes in BOXES.items():
    p = OUT / f"{name}.webp"
    img = cv2.imread(str(p))
    mask = np.zeros(img.shape[:2], np.uint8)
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hp = cv2.absdiff(g, cv2.medianBlur(g, 9))
    for x0, y0, x1, y1 in boxes:
        m = (hp[y0:y1, x0:x1] > 14).astype(np.uint8) * 255
        if name in BRIGHT:
            m = ((g[y0:y1, x0:x1] > BRIGHT[name]) | (m > 0)).astype(np.uint8) * 255
        mask[y0:y1, x0:x1] = m
    mask = cv2.dilate(mask, np.ones((5, 5), np.uint8), iterations=1)
    out = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
    cv2.imwrite(str(p), out, [cv2.IMWRITE_WEBP_QUALITY, 85])
    print(name, int(mask.sum() / 255), "px inpainted")

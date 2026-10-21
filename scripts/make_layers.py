"""Cut the painted panels into separate layers (people / windows) + a clean background plate each.
Needs: pillow numpy opencv-python-headless onnxruntime and the isnet-anime.onnx model (only for 'grew').
    python scripts/make_layers.py <path-to-isnet-anime.onnx>
Outputs assets/img/layer-<scene>-<name>.webp (RGBA, full panel size) and assets/img/plate-<scene>.webp.
"""
import sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / "assets" / "img"
SC = 3  # work at 3x for smooth edges

RECTS = {  # GrabCut starting rectangles (x0, y0, x1, y1) in panel px
    "met": {"boy": (0, 12, 160, 278), "girl": (278, 92, 462, 278)},
    "distance": {"couple": (190, 28, 452, 226)},
}
KEEP_POLY = {  # restrict a GrabCut result to a rough outline (panel px)
    ("met", "girl"): [(352, 118), (380, 92), (432, 98), (472, 160), (486, 278), (276, 278), (288, 215), (330, 188), (346, 150)],
}


FORCE_POLY = {  # parts GrabCut misses (pale face, light shirt) forced into the layer (panel px)
    ("met", "girl"): [
        [(328, 135), (342, 123), (353, 130), (355, 180), (348, 202), (335, 183), (327, 157)],  # face + neck
        [(290, 278), (320, 240), (348, 208), (370, 220), (370, 278)],  # shirt + shoulder
    ],
}


def rounded_rect(h, w, x0, y0, x1, y1, r, corners):
    m = np.zeros((h, w), np.uint8)
    cv2.rectangle(m, (int(x0 * SC), int(y0 * SC)), (int(x1 * SC), int(y1 * SC)), 255, -1)
    for cx, cy in corners:  # carve round corners
        sx = 1 if cx == "r" else -1
        px = int((x1 if cx == "r" else x0) * SC); py = int((y0 if cy == "t" else y1) * SC)
        rr = int(r * SC)
        hole = np.zeros_like(m)
        cv2.rectangle(hole, (px - (rr if sx > 0 else 0), py - (rr if cy == "t" else 0) * 0 - (0 if cy == "t" else rr)), (px + (0 if sx > 0 else rr), py + (rr if cy == "t" else 0)), 255, -1)
        circ = np.zeros_like(m)
        cv2.circle(circ, (px - sx * rr, py + (rr if cy == "t" else -rr)), rr, 255, -1)
        m = np.where((hole > 0) & (circ == 0), 0, m)
    return m


def grabcut(im, rect):
    x0, y0, x1, y1 = rect
    mask = np.zeros(im.shape[:2], np.uint8)
    cv2.grabCut(im, mask, (x0 * SC, y0 * SC, (x1 - x0) * SC, (y1 - y0) * SC), np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_RECT)
    m = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))


def model_matte(path, panel):
    import onnxruntime as ort
    sess = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
    w, h = panel.size
    k = 1024 / w; nh = round(h * k)
    big = panel.convert("RGB").resize((1024, nh), Image.LANCZOS)
    pad = Image.new("RGB", (1024, 1024), tuple(int(v) for v in np.asarray(big).reshape(-1, 3).mean(0)))
    off = (1024 - nh) // 2; pad.paste(big, (0, off))
    x = np.asarray(pad, np.float32); x = x / max(x.max(), 1e-6) - np.array([0.485, 0.456, 0.406], np.float32)
    y = sess.run(None, {sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None]})[0][0, 0]
    y = (y - y.min()) / (y.max() - y.min() + 1e-8); y = y[off:off + nh]
    y = np.clip((y - 0.2) / 0.55, 0, 1); y = y * y * (3 - 2 * y)
    return np.asarray(Image.fromarray((y * 255).astype(np.uint8)).resize((w * SC, h * SC), Image.LANCZOS))


def save_layer(scene, name, big_bgr, mask):
    h, w = big_bgr.shape[:2]
    soft = cv2.GaussianBlur(mask, (0, 0), 1.6)
    rgba = cv2.cvtColor(big_bgr, cv2.COLOR_BGR2RGBA); rgba[..., 3] = soft
    out = Image.fromarray(rgba).resize((w // SC, h // SC), Image.LANCZOS)
    out.save(IMG / f"layer-{scene}-{name}.webp", "WEBP", quality=88, method=6)
    ys, xs = np.where(soft > 20)
    print(f"{scene}/{name}: bbox x {xs.min() / SC / (w / SC):.2f}-{xs.max() / SC / (w / SC):.2f}  y {ys.min() / SC / (h / SC):.2f}-{ys.max() / SC / (h / SC):.2f}")


def save_plate(scene, big_bgr, union):
    """Fill the removed people with a smooth blur of their surroundings (bokeh-like, no streaks)."""
    cover = cv2.dilate(union, np.ones((33, 33), np.uint8))
    valid = (cover == 0).astype(np.float32)
    img = big_bgr.astype(np.float32)
    fill = np.tile(img[valid > 0].mean(0), img.shape[:2] + (1,)).astype(np.float32)  # last resort: mean colour
    for sigma in (300, 120, 40):  # wide fill first, then ever tighter fills painted over it
        num = cv2.GaussianBlur(img * valid[..., None], (0, 0), sigma)
        den = cv2.GaussianBlur(valid, (0, 0), sigma)[..., None]
        w = np.clip(den * 3, 0, 1)
        fill = fill * (1 - w) + (num / np.maximum(den, 1e-4)) * w
    a = (cv2.GaussianBlur((cover > 0).astype(np.float32), (0, 0), 8))[..., None]
    plate = np.clip(img * (1 - a) + fill * a, 0, 255).astype(np.uint8)
    h, w = plate.shape[:2]
    Image.fromarray(cv2.cvtColor(plate, cv2.COLOR_BGR2RGB)).resize((w // SC, h // SC), Image.LANCZOS).save(IMG / f"plate-{scene}.webp", "WEBP", quality=85, method=6)


def main(model_path):
    for scene in ("met", "grew", "apart", "distance"):
        pil = Image.open(IMG / f"panel-{scene}.webp").convert("RGB")
        big = cv2.resize(cv2.cvtColor(np.asarray(pil), cv2.COLOR_RGB2BGR), None, fx=SC, fy=SC, interpolation=cv2.INTER_LANCZOS4)
        h, w = big.shape[:2]
        masks = {}
        if scene in RECTS:
            for name, rect in RECTS[scene].items():
                m = grabcut(big, rect)
                if (scene, name) in KEEP_POLY:
                    poly = np.zeros_like(m)
                    cv2.fillPoly(poly, [(np.array(KEEP_POLY[(scene, name)]) * SC).astype(np.int32)], 255)
                    m = cv2.bitwise_and(m, cv2.dilate(poly, np.ones((13, 13), np.uint8)))
                for poly in FORCE_POLY.get((scene, name), []):
                    cv2.fillPoly(m, [(np.array(poly) * SC).astype(np.int32)], 255)
                m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
                masks[name] = m
        elif scene == "grew":
            masks["couple"] = (model_matte(model_path, pil) > 110).astype(np.uint8) * 255
        elif scene == "apart":
            masks["left"] = rounded_rect(h, w, -6, 8, 146, 218, 40, [("r", "t"), ("r", "b")])
            masks["right"] = rounded_rect(h, w, 326, 8, 516, 218, 40, [("l", "t"), ("l", "b")])
        for name, m in masks.items():
            save_layer(scene, name, big, m)
        save_plate(scene, big, np.maximum.reduce(list(masks.values())))


if __name__ == "__main__":
    main(sys.argv[1])

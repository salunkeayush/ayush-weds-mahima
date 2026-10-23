"""Build the round envelope seal (assets/img/seal.webp) from the couple's M&A logo PDF.
The logo is red-on-white; it is recoloured cream-gold and set on the deep-red wax disc.
    python scripts/make_seal.py "<path to MA Bag Logo.pdf>"
"""
import sys
from pathlib import Path
import numpy as np
import pymupdf
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "seal.webp"
WAX = (122, 31, 43)      # #7a1f2b, the original seal colour
WAX_LIGHT = (146, 44, 58)  # soft highlight, upper-left
INK = (246, 225, 184)    # cream-gold for the logo strokes
SIZE = 640


def main(pdf):
    page = pymupdf.open(pdf)[0]
    pix = page.get_pixmap(dpi=200)
    rgb = np.asarray(Image.frombytes("RGB", (pix.width, pix.height), pix.samples)).astype(np.float32)
    # stroke strength: white -> 0, the logo's red -> 1
    alpha = np.clip((255 - rgb.min(axis=2)) / (255 - 36), 0, 1)
    alpha = np.clip((alpha - 0.16) / 0.5, 0, 1)  # drop the faint specks the artwork has around the A
    ys, xs = np.where(alpha > 0.35)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    radius = np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2).max() + 26
    box = (int(cx - radius), int(cy - radius), int(cx + radius), int(cy + radius))
    a = Image.fromarray((alpha * 255).astype(np.uint8)).crop(box).resize((SIZE, SIZE), Image.LANCZOS)

    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    t = np.clip(1 - np.hypot(xx - SIZE * 0.35, yy - SIZE * 0.3) / (SIZE * 0.9), 0, 1)[..., None]
    disc = np.array(WAX, np.float32) * (1 - t) + np.array(WAX_LIGHT, np.float32) * t
    k = (np.asarray(a, np.float32) / 255)[..., None]
    out = disc * (1 - k) + np.array(INK, np.float32) * k

    mask = Image.new("L", (SIZE * 4, SIZE * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, SIZE * 4 - 1, SIZE * 4 - 1), fill=255)
    img = Image.fromarray(out.astype(np.uint8), "RGB").convert("RGBA")
    img.putalpha(mask.resize((SIZE, SIZE), Image.LANCZOS))
    img.save(OUT, "WEBP", quality=92, method=6)
    print(OUT, OUT.stat().st_size // 1024, "KB; logo circle radius", int(radius))


if __name__ == "__main__":
    main(sys.argv[1])

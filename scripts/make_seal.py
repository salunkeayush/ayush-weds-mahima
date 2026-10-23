"""Cut the couple's M&A wreath logo (PDF) into the round envelope seal: assets/img/seal.webp.
    python scripts/make_seal.py "<path to MA Final logo without square .pdf>"
"""
import sys
from pathlib import Path
import pymupdf
from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "seal.webp"
CENTER, RADIUS, SIZE = (874, 840), 650, 640  # px at 150 dpi: wreath centre and crop radius


def main(pdf):
    page = pymupdf.open(pdf)[0]
    pix = page.get_pixmap(dpi=150)
    im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    cx, cy = CENTER
    crop = im.crop((cx - RADIUS, cy - RADIUS, cx + RADIUS, cy + RADIUS)).resize((SIZE, SIZE), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (SIZE * 4, SIZE * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, SIZE * 4 - 1, SIZE * 4 - 1), fill=255)
    crop.putalpha(mask.resize((SIZE, SIZE), Image.LANCZOS))
    crop.save(OUT, "WEBP", quality=90, method=6)
    print(OUT, OUT.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])

"""Resize photos, crop inspiration panels, render wardrobe pages -> optimized WebP.
Run with a venv that has pillow + pymupdf:  python scripts/prepare_assets.py
"""
import io
from pathlib import Path
import pymupdf
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"
WARD = ROOT / "assets" / "wardrobe"

PHOTOS = {  # beat name -> source (relative to photos/)
    "proposal-he-sunset": "he proposed/6421029D-307B-4CFA-A473-75A4423D7AE7_4_5005_c.jpeg",
    "proposal-he": "he proposed/798F24FF-E8A2-43FD-A475-8D5850E5CE71_1_102_o.jpeg",
    "proposal-she-swing": "she proposed/9FFE28AB-8DE8-4150-A65C-1B86E7972FED_4_5005_c.jpeg",
    "proposal-she": "she proposed/F457783C-8BE2-4E0A-B6A7-40836153BE28_1_102_a.jpeg",
    "jerseys": "normal photos/53193483-E06B-419F-927D-50A528DB468C_1_105_c.jpeg",
    "coffee": "normal photos/5D088DD6-EBF6-4691-9B30-8D87331E72EE_1_102_a.jpeg",
    "lake": "normal photos/76854150-00C3-4BD6-8340-92480EBF1B28_1_102_o.jpeg",
    "mountain": "normal photos/9AB18284-0B24-487D-A6E1-5FCD7F37A2D4_4_5005_c.jpeg",
    "sand-selfie": "normal photos/9ED24B52-52C5-4B62-878F-5D0CA3774A52_1_102_o.jpeg",
    "coastal": "normal photos/C08F869B-396D-44DF-A4E6-CA23287F70ED_1_105_c.jpeg",
    "snow": "normal photos/D7CAF37E-4164-4661-ABE1-F7BC68043C87_1_105_c.jpeg",
}
PANELS = {  # name -> (left, top, right, bottom) in the 1024x1490 inspiration image
    "panel-met": (514, 0, 1024, 278),
    "panel-grew": (0, 282, 512, 508),
    "panel-apart": (514, 282, 1024, 508),
    "panel-distance": (0, 510, 512, 737),
    "panel-hands": (514, 510, 1024, 737),
    "panel-venue": (514, 740, 1024, 1038),
    "panel-title": (0, 0, 512, 278),
}
MAX_EDGE = 1600
INSPO = ROOT / "Wedding Invitation Inspiration & Details.jpeg"


def save(img, path, quality=78):
    img = ImageOps.exif_transpose(img).convert("RGB")
    img.thumbnail((MAX_EDGE, MAX_EDGE))
    img.save(path, "WEBP", quality=quality, method=6)
    print(f"{path.name}: {img.size} {path.stat().st_size // 1024} KB")


def main():
    for name, rel in PHOTOS.items():
        save(Image.open(ROOT / "photos" / rel), OUT / f"{name}.webp")
    inspo = Image.open(INSPO)
    for name, box in PANELS.items():
        save(inspo.crop(box), OUT / f"{name}.webp", 85)
    doc = pymupdf.open(ROOT / "Malani wadrobe planner.pdf")
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(dpi=110)
        save(Image.open(io.BytesIO(pix.tobytes("png"))), WARD / f"p{i}.webp", 80)


if __name__ == "__main__":
    main()

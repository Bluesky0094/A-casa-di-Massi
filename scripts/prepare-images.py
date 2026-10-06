"""Generate responsive WebP derivatives without altering the source photographs.

Requires Pillow. Run from the project root with `npm run images`.
This derivative step applies no additional colour grading, retouching or generative changes.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json
import argparse

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "sources/Casa di Massi/Foto casa"
OUTPUT = ROOT / "public/images"
OUTPUT.mkdir(parents=True, exist_ok=True)

SELECTION = {
    "casa": "DSC07944.jpg",
    # User-approved imagegen edit; the original JPEG and CR3 remain untouched.
    "apertura": "../../../output/imagegen/hero-colour-ai-draft.png",
    "cucina": "DSC07885.jpg",
    "cucina-ampia": "DSC07882-HDR.jpg",
    "limoni": "DSC07890.jpg",
    "erbe": "DSC07891.jpg",
    "tavola": "DSC07930.jpg",
    "giardino": "DSC07957.jpg",
    "esterno": "DSC07968.jpg",
    "camera": "DSC07910.jpg",
    "cortile": "DSC07932.jpg",
    "dettagli": "DSC07937.jpg",
    "forno": "WhatsApp Image 2025-04-18 at 17.09.38.jpg",
    "impasto": "WhatsApp Image 2025-04-18 at 17.09.40.jpg",
    "lievitazione": "WhatsApp Image 2025-04-18 at 17.09.41.jpg",
    "pane": "../Foto evento/_DSC7907.jpg",
    "amaca": "DSC07950.jpg",
    "orto": "DSC07997.jpg",
    "bici": "DSC07964.jpg",
    "campagna": "DSC07955.jpg",
    "pietra": "DSC07973.jpg",
    "bagno": "DSC07913-HDR.jpg",
    "soppalco": "DSC07904.jpg",
}

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--only", nargs="+", choices=SELECTION, help="Generate only the selected images")
args = parser.parse_args()
manifest_path = ROOT / "src/images.json"
manifest = json.loads(manifest_path.read_text()) if args.only else {}
for name, source in SELECTION.items():
    if args.only and name not in args.only:
        continue
    with Image.open(SOURCE / source) as original:
        photo = ImageOps.exif_transpose(original).convert("RGB")
        variants = []
        for width in [480, 800, 1200, 1800]:
            height = round(photo.height * width / photo.width)
            path = OUTPUT / f"{name}-{width}.webp"
            photo.resize((width, height), Image.Resampling.LANCZOS).save(
                path, "WEBP", quality=81, method=6
            )
            variants.append({"width": width, "height": height, "bytes": path.stat().st_size})
        manifest[name] = {"source": str((SOURCE / source).resolve().relative_to(ROOT)), "variants": variants}
        print(f"{name}: {sum(v['bytes'] for v in variants) // 1024} KiB")
(ROOT / "src/images.json").write_text(json.dumps(manifest, indent=2) + "\n")

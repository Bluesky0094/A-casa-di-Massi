"""Generate responsive WebP derivatives without altering the source photographs.

Requires Pillow. Run from the project root with `npm run images`.
No colour grading, retouching, compositing or generative changes are applied.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "sources/Casa di Massi/Foto casa"
OUTPUT = ROOT / "public/images"
OUTPUT.mkdir(parents=True, exist_ok=True)

SELECTION = {
    "casa": "DSC07944.jpg",
    "cucina": "DSC07885.jpg",
    "camera": "DSC07910.jpg",
    "cortile": "DSC07932.jpg",
    "dettagli": "DSC07890.jpg",
    "pane": "../Foto evento/_DSC7907.jpg",
    "amaca": "DSC07950.jpg",
    "orto": "DSC07997.jpg",
    "bici": "DSC07964.jpg",
    "campagna": "DSC07955.jpg",
    "pietra": "DSC07973.jpg",
    "bagno": "DSC07913-HDR.jpg",
    "soppalco": "DSC07904.jpg",
}

manifest = {}
for name, source in SELECTION.items():
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

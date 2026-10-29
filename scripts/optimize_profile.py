"""Prepare the homepage portrait. Requires Pillow; never changes the source file."""
import argparse
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps

# Repository asset destination and maximum file size in bytes.
ROOT = Path(__file__).resolve().parents[1]
LIMIT = 500_000


# Try progressively smaller quality settings until the encoded image fits the limit.
def encode(image, format):
    for quality in (82, 76, 70, 64, 58):
        output = BytesIO()
        options = {"quality": quality}
        if format == "WEBP":
            options["method"] = 6
        else:
            options.update(optimize=True, progressive=True)
        image.save(output, format=format, **options)
        if output.tell() < LIMIT:
            return output.getvalue()
    raise ValueError("Could not compress image below 500 KB")


# Read the source path and optional output folder from the command line.
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Replacement portrait (cropped centrally to 4:5)")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "assets")
    args = parser.parse_args()
    # Protect the original from being overwritten by generated filenames.
    names = ("profile.jpg", "profile-300.webp", "profile-400.webp", "profile-600.webp")
    if args.source.resolve() in [(args.output_dir / name).resolve() for name in names]:
        parser.error("Use a separate original file so the source is not overwritten.")
    # Open the image and correct camera orientation before cropping.
    with Image.open(args.source) as source:
        source = ImageOps.exif_transpose(source)
        # Flatten transparent images against the portfolio's off-white background.
        rgba = source.convert("RGBA")
        background = Image.new("RGBA", rgba.size, "#fffcf7")
        background.alpha_composite(rgba)
        portrait = ImageOps.fit(background.convert("RGB"), (600, 750), method=Image.Resampling.LANCZOS)
    # Create responsive WebP sizes and a full-size JPEG fallback in memory.
    outputs = {
        "profile.jpg": encode(portrait, "JPEG"),
        "profile-300.webp": encode(portrait.resize((300, 375), Image.Resampling.LANCZOS), "WEBP"),
        "profile-400.webp": encode(portrait.resize((400, 500), Image.Resampling.LANCZOS), "WEBP"),
        "profile-600.webp": encode(portrait, "WEBP"),
    }
    # Write only the generated files and report their compressed sizes.
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, data in outputs.items():
        destination = args.output_dir / name
        destination.write_bytes(data)
        print(f"{destination}: {len(data):,} bytes")
    print("Images updated. Review the crop and update the img alt text in index.html for a new photo.")


# Run the command-line tool only when this file is executed directly.
if __name__ == "__main__":
    main()

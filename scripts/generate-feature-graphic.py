"""Generate a Google Play Console feature graphic (1024 x 500 px).

The feature graphic is the banner shown at the top of the Play Store
listing and in promotional surfaces (Editor's Choice, Play on TV,
search carousels). Google rejects submissions without one.

Spec (per Google Play developer docs):
  - Exactly 1024 x 500 pixels
  - PNG or JPEG, RGB, no transparency, no rounded corners
  - Max 1 MB
  - Safe zone is the central ~924 x 400 px (different surfaces crop
    the edges differently, so no text in the corners)
  - No device frames, no screenshots, no CTAs ("Free", "Download")

Run from the repo root:
    python scripts/generate-feature-graphic.py

Output: marketing/play-feature-graphic.png
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# --- Tunables ------------------------------------------------------
# Change these and re-run the script to iterate on the design.

CANVAS_W, CANVAS_H = 1024, 500
BG_COLOR = (210, 22, 15)        # #D2160F, CPS brand red
TAGLINE_COLOR = (255, 255, 255) # white
TAGLINE_TEXT = "DIGITAL REFEREE FOR YOUR BOARD GAME"
TAGLINE_FONT_SIZE = 42

# Centred-stack layout: logo on top half, tagline beneath it.
LOGO_HEIGHT = 300                # 3000x2000 source -> 450x300 on canvas
LOGO_TAGLINE_GAP = 26            # px between logo bottom and tagline top
STACK_TOP_PAD = 50               # how much air above the logo

# Repo paths.
REPO_ROOT = Path(__file__).resolve().parent.parent
LOGO_PATH = REPO_ROOT / "assets" / "images" / "cps-logo.png"
OUTPUT_DIR = REPO_ROOT / "marketing"
OUTPUT_PATH = OUTPUT_DIR / "play-feature-graphic.png"


def load_font(size: int) -> ImageFont.FreeTypeFont:
    """Try a few common bold fonts; fall back to PIL default."""
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf",   # Segoe UI Bold (Windows)
        "C:/Windows/Fonts/arialbd.ttf",    # Arial Bold (Windows)
        "C:/Windows/Fonts/impact.ttf",     # Impact (Windows)
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Solid red canvas. RGB (no alpha) is what Google wants.
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_COLOR)

    # --- Logo ------------------------------------------------------
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo_ratio = logo.width / logo.height
    logo_w = int(LOGO_HEIGHT * logo_ratio)
    logo = logo.resize((logo_w, LOGO_HEIGHT), Image.LANCZOS)

    # --- Measure tagline so we can vertically center the stack ----
    draw = ImageDraw.Draw(canvas)
    font = load_font(TAGLINE_FONT_SIZE)
    bbox = draw.textbbox((0, 0), TAGLINE_TEXT, font=font)
    tagline_w = bbox[2] - bbox[0]
    tagline_h = bbox[3] - bbox[1]

    # Vertically center the (logo + gap + tagline) stack on the canvas.
    stack_h = LOGO_HEIGHT + LOGO_TAGLINE_GAP + tagline_h
    stack_top = (CANVAS_H - stack_h) // 2

    # Logo centred horizontally on top of the stack.
    logo_x = (CANVAS_W - logo_w) // 2
    logo_y = stack_top
    canvas.paste(logo, (logo_x, logo_y), logo)

    # Tagline centred horizontally below the logo.
    text_x = (CANVAS_W - tagline_w) // 2
    text_y = stack_top + LOGO_HEIGHT + LOGO_TAGLINE_GAP
    # textbbox can have a non-zero y origin; offset so the text lines up at text_y.
    draw.text((text_x - bbox[0], text_y - bbox[1]), TAGLINE_TEXT,
              fill=TAGLINE_COLOR, font=font)

    # --- Save ------------------------------------------------------
    canvas.save(OUTPUT_PATH, "PNG", optimize=True)
    print(f"Wrote {OUTPUT_PATH} ({canvas.size[0]}x{canvas.size[1]})")
    print(f"File size: {OUTPUT_PATH.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()

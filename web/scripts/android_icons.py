"""Іконка й заставка Android: золотий шаховий король на темному тлі.

Використання (з теки web/):  python scripts/android_icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RES = Path(__file__).resolve().parent.parent / "android" / "app" / "src" / "main" / "res"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BG = (14, 13, 11)
GOLD_HI = (240, 200, 120)
GOLD = (214, 162, 74)
KING = "♚"  # ♚

DENSITIES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}


def king(size: int, scale: float) -> Image.Image:
    """Прозорий квадрат із золотим королем (вертикальний градієнт)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    font = ImageFont.truetype(FONT, int(size * scale))
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    l, t, r, b = d.textbbox((0, 0), KING, font=font)
    d.text(((size - (r - l)) / 2 - l, (size - (b - t)) / 2 - t), KING, font=font, fill=255)
    grad = Image.new("RGBA", (size, size))
    gd = ImageDraw.Draw(grad)
    for y in range(size):
        k = y / max(size - 1, 1)
        gd.line([(0, y), (size, y)], fill=tuple(int(GOLD_HI[i] * (1 - k) + GOLD[i] * k) for i in range(3)) + (255,))
    img.paste(grad, (0, 0), mask)
    return img


def on_bg(fg: Image.Image, round_: bool) -> Image.Image:
    size = fg.size[0]
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = Image.new("L", (size, size), 0)
    if round_:
        ImageDraw.Draw(m).ellipse([0, 0, size - 1, size - 1], fill=255)
    else:
        ImageDraw.Draw(m).rounded_rectangle([0, 0, size - 1, size - 1], radius=size // 6, fill=255)
    base.paste(Image.new("RGBA", (size, size), BG + (255,)), (0, 0), m)
    base.alpha_composite(fg)
    return base


for name, k in DENSITIES.items():
    d = RES / f"mipmap-{name}"
    # adaptive foreground: 108dp, король у «безпечній зоні» (центральні ~66dp)
    king(int(108 * k), 0.5).save(d / "ic_launcher_foreground.png")
    legacy = king(int(48 * k), 0.72)
    on_bg(legacy, False).save(d / "ic_launcher.png")
    on_bg(legacy, True).save(d / "ic_launcher_round.png")

(RES / "values" / "ic_launcher_background.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0E0D0B</color>\n</resources>\n',
    encoding="utf-8")

# заставки: замінюємо всі splash.png тим самим розміром
for splash in RES.glob("drawable*/splash.png"):
    w, h = Image.open(splash).size
    img = Image.new("RGB", (w, h), BG)
    s = int(min(w, h) * 0.42)
    k = king(s, 0.85)
    img.paste(k, ((w - s) // 2, (h - s) // 2), k)
    img.save(splash)
print("icons and splashes written")

# Іконка для Google Play: 512×512, повний квадрат без прозорості (кути Play округлює сам)
store = Path(__file__).resolve().parent.parent.parent / "store"
store.mkdir(exist_ok=True)
play = Image.new("RGB", (512, 512), BG)
k = king(512, 0.62)
play.paste(k, (0, 0), k)
play.save(store / "icon-512.png")
print("store/icon-512.png written")

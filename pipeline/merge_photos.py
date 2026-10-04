"""Переносить фото (photo, photoLarge, credit, source) з проміжного файлу players.py --out у web/public/data/players.json.

Використання:
    python pipeline/merge_photos.py <проміжний players.json>
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIELDS = ("photo", "photoLarge", "credit", "source", "wikidata")

src = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
dst_path = ROOT / "web" / "public" / "data" / "players.json"
dst = json.loads(dst_path.read_text(encoding="utf-8"))
n = 0
for key, entry in src.items():
    if key in dst and entry.get("photo"):
        for f in FIELDS:
            if f in entry:
                dst[key][f] = entry[f]
        n += 1
dst_path.write_text(json.dumps(dst, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{n} гравців з фото")

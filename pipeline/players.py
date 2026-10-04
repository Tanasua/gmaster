"""Фото гравців з Wikimedia Commons (через Wikidata P18) → web/public/data/players.json.

Беруться лише вільні ліцензії (CC / Public domain); автор і ліцензія зберігаються для підпису.
Фото вбудовуються як data: URI (працює і в Claude Artifact, і в Android-обгортці).
Запити повільні, з паузами та повторами — Wikimedia обмежує частоту.

Використання:
    python pipeline/players.py
"""
import base64
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "gmaster/0.1 (chess guessing game prototype; contact via repository)"
THUMB_WIDTH = 160
PAUSE_S = 3
FREE_LICENSE = re.compile(r"^(CC|Public domain|PD)", re.I)


def get_json(url, params):
    full = url + "?" + urllib.parse.urlencode({**params, "format": "json"})
    return json.loads(fetch(full))


def fetch(url):
    delay = 30
    for _ in range(8):
        time.sleep(PAUSE_S)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            print(f"  429, чекаю {delay} с")
            time.sleep(delay)
            delay = min(delay * 2, 300)
    raise RuntimeError(f"rate limited: {url}")


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def find_photo(search):
    hits = get_json("https://www.wikidata.org/w/api.php", {
        "action": "wbsearchentities", "search": search, "language": "en", "limit": 5})["search"]
    hit = next((h for h in hits if "chess" in h.get("description", "").lower()), None)
    if not hit:
        return None
    claims = get_json("https://www.wikidata.org/w/api.php", {
        "action": "wbgetclaims", "entity": hit["id"], "property": "P18"})["claims"].get("P18")
    if not claims:
        return None
    filename = claims[0]["mainsnak"]["datavalue"]["value"]
    pages = get_json("https://commons.wikimedia.org/w/api.php", {
        "action": "query", "titles": f"File:{filename}", "prop": "imageinfo",
        "iiprop": "url|extmetadata", "iiurlwidth": THUMB_WIDTH,
        "iiextmetadatafilter": "LicenseShortName|Artist"})["query"]["pages"]
    info = next(iter(pages.values()))["imageinfo"][0]
    meta = info["extmetadata"]
    license_name = meta.get("LicenseShortName", {}).get("value", "")
    if not FREE_LICENSE.match(license_name):
        print(f"  пропускаю {filename}: ліцензія {license_name!r}")
        return None
    img = fetch(info["thumburl"])
    mime = "image/png" if info["thumburl"].lower().endswith(".png") else "image/jpeg"
    return {
        "photo": f"data:{mime};base64," + base64.b64encode(img).decode(),
        "credit": f"{strip_html(meta.get('Artist', {}).get('value')) or 'невідомий автор'}, {license_name}, Wikimedia Commons",
        "source": info["descriptionurl"],
        "wikidata": hit["id"],
    }


def main():
    players = json.loads((ROOT / "data" / "players.json").read_text(encoding="utf-8"))
    out_path = ROOT / "web" / "public" / "data" / "players.json"
    out = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {}
    for key, p in players.items():
        if out.get(key, {}).get("photo"):
            continue
        print(key)
        entry = {"name": p["name"]}
        try:
            entry.update(find_photo(p["search"]) or {})
        except Exception as e:  # noqa: BLE001 — один гравець не має зупиняти решту
            print(f"  помилка: {e}")
        out[key] = entry
        out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("готово:", sum(1 for v in out.values() if v.get("photo")), "з", len(out), "з фото")


if __name__ == "__main__":
    main()

"""Фото гравців з Wikimedia Commons (через Wikidata P18) → web/public/data/players.json.

Беруться лише вільні ліцензії (CC / Public domain); автор і ліцензія зберігаються для підпису.
Фото вбудовуються як data: URI (працює і в Claude Artifact, і в Android-обгортці).
Запити повільні, з паузами та повторами — Wikimedia обмежує частоту.
Для гросмейстерів ("gm": true у data/players.json) додатково береться більше фото
(photoLarge, LARGE_WIDTH px) напряму з upload.wikimedia.org — без API.

Використання:
    python pipeline/players.py [--out шлях]   # за замовчуванням web/public/data/players.json
"""
import argparse
import base64
import hashlib
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "gmaster/0.1 (chess guessing game prototype; contact via repository)"
THUMB_WIDTH = 160
LARGE_WIDTH = 330  # має бути стандартним розміром мініатюр Wikimedia
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


def large_photo(source_url):
    """Мініатюра LARGE_WIDTH px за адресою сторінки файлу на Commons (шлях — за md5 імені файлу)."""
    name = urllib.parse.unquote(source_url.split("File:")[1]).replace(" ", "_")
    h = hashlib.md5(name.encode()).hexdigest()
    q = urllib.parse.quote(name)
    url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{LARGE_WIDTH}px-{q}"
    mime = "image/png" if name.lower().endswith(".png") else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(fetch(url)).decode()


def main():
    players = json.loads((ROOT / "data" / "players.json").read_text(encoding="utf-8"))
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=ROOT / "web" / "public" / "data" / "players.json")
    ap.add_argument("--names-only", action="store_true", help="лише оновити імена, без завантаження фото")
    args = ap.parse_args()
    out_path = args.out
    out = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {}
    for key, p in players.items():
        if "alias" in p:
            out[key] = {"alias": p["alias"]}
            continue
        prev = out.get(key, {})
        # імена завжди оновлюються з data/players.json; фото — лише якщо ще немає
        entry = {**prev, "name": p["name"], **({"nameEn": p["nameEn"]} if p.get("nameEn") else {})}
        if prev.get("photo") or not p.get("search") or args.names_only:
            out[key] = entry
            continue
        print(key)
        try:
            entry.update(find_photo(p["search"]) or {})
        except Exception as e:  # noqa: BLE001 — один гравець не має зупиняти решту
            print(f"  помилка: {e}")
        out[key] = entry
        out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    for key, p in players.items():
        entry = out.get(key, {})
        if p.get("gm") and entry.get("source") and not entry.get("photoLarge") and not args.names_only:
            print(key, "(велике фото)")
            try:
                entry["photoLarge"] = large_photo(entry["source"])
            except Exception as e:  # noqa: BLE001
                print(f"  помилка: {e}")
            out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    # Ручні підписи з data/players.json мають пріоритет над автоматичними
    for key, p in players.items():
        if p.get("credit") and out.get(key, {}).get("photo"):
            out[key]["credit"] = p["credit"]
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("готово:", sum(1 for v in out.values() if v.get("photo")), "з", len(out), "з фото")


if __name__ == "__main__":
    main()

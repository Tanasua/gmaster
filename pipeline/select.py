"""Добір партій для кожного гросмейстера з архівів pgnmentor → data/games/*.pgn + data/games.json.

Спершу беруться відомі партії з data/roster.json ("curated": [[індекс в архіві, id]]),
далі — перемоги гросмейстера з найвагоміших подій (матчі за корону, претенденти,
олімпіади, чемпіонати країн, супертурніри), по одній на суперника, 20–60 ходів.
Бліц, рапід, сеанси й показові партії не беруться.

Використання:
    python pipeline/select.py <тека з архівами> [--per-gm 6]
"""
import argparse
import json
import math
import re
from pathlib import Path

import chess.pgn

ROOT = Path(__file__).resolve().parent.parent

EVENT_WEIGHT = [
    (r"world ch|wch|wcc|world championship|braingames", 100),
    (r"candidat|\bct\b|interzonal|izt", 80),
    (r"olympiad|\bolm\b", 60),
    (r"avro|hastings|nottingham|st\.? ?petersburg|zurich|linares|wijk|corus|hoogovens|tata|dortmund|sofia|tilburg|moscow|london|new york|san sebastian|carlsbad|baden", 50),
    (r"-ch\b|-ch\d|ch-|championship", 40),
]
EXCLUDE = re.compile(r"blitz|rapid|simul|\bsim\b|blind|exhib|960|armageddon|online|internet|bullet|tb\b|tiebreak|odds|consult|corr"
                     r"|\bu\d\d|junior|cadet|youth|senior|wcht|team|g/\d|k\.?o\.?|\bm\b|\bmt\b|casual", re.I)
MIN_MOVES, MAX_MOVES = 20, 60


def weight(event: str) -> int:
    e = event.lower()
    return max((w for pat, w in EVENT_WEIGHT if re.search(pat, e)), default=10)


def opponent_counts(path, pattern):
    """Скільки партій гросмейстер зіграв з кожним суперником (сильні суперники трапляються частіше)."""
    counts = {}
    with open(path, encoding="latin-1") as fh:
        while (h := chess.pgn.read_headers(fh)) is not None:
            w, b = h.get("White", ""), h.get("Black", "")
            opp = b if pattern.search(w) else w if pattern.search(b) else None
            if opp:
                counts[opp] = counts.get(opp, 0) + 1
    return counts


def slug(s: str) -> str:
    s = s.split(",")[0].strip().lower()
    return re.sub(r"[^a-z]+", "-", s).strip("-")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pgn_dir", type=Path)
    ap.add_argument("--per-gm", type=int, default=6)
    args = ap.parse_args()

    roster = {k: v for k, v in json.loads((ROOT / "data" / "roster.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
    games_meta = json.loads((ROOT / "data" / "games.json").read_text(encoding="utf-8"))
    have = {g["id"] for g in games_meta}

    for gm_id, r in roster.items():
        pattern = re.compile(r["match"], re.I)
        existing = sum(1 for g in games_meta if g.get("gm") == gm_id or g["heroName"] == r["heroName"])
        need = args.per_gm - existing
        if need <= 0:
            continue
        curated = {idx: gid for idx, gid in r["curated"]}
        picks, opponents, candidates = [], set(), []
        with open(args.pgn_dir / r["archive"], encoding="latin-1") as fh:
            i = 0
            while (game := chess.pgn.read_game(fh)) is not None:
                h = game.headers
                hero = "white" if pattern.search(h.get("White", "")) else "black" if pattern.search(h.get("Black", "")) else None
                if hero:
                    won = h.get("Result") == ("1-0" if hero == "white" else "0-1")
                    opp = h.get("Black" if hero == "white" else "White", "")
                    moves = (game.end().ply() + 1) // 2
                    if i in curated:
                        picks.append((curated[i], hero, game))
                        opponents.add(opp)
                    elif (won and MIN_MOVES <= moves <= MAX_MOVES and not EXCLUDE.search(h.get("Event", ""))
                          and game.errors == [] and "?" not in h.get("Black", "?")[:1]):
                        candidates.append((weight(h.get("Event", "")), h.get("Date", ""), opp, hero, game))
                i += 1
        # Сила суперника ≈ скільки партій з ним в архіві; плюс вага події.
        # Один суперник — одна партія.
        freq = {}
        for c in candidates:
            freq[c[2]] = freq.get(c[2], 0) + 1
        all_opp = opponent_counts(args.pgn_dir / r["archive"], pattern)
        candidates = [c for c in candidates if not re.search(r"\bNN\b|^N\.?N\.?$|\?", c[2]) and all_opp.get(c[2], 0) >= 5]
        candidates.sort(key=lambda c: -(c[0] + 12 * math.log2(all_opp.get(c[2], 1))))
        for w, date, opp, hero, game in candidates:
            if len(picks) >= need:
                break
            if opp in opponents:
                continue
            h = game.headers
            gid = f"{slug(h['White'])}-{slug(h['Black'])}-{h.get('Date', '????')[:4]}"
            if gid in have or any(p[0] == gid for p in picks):
                gid += f"-{len(picks)}"
            picks.append((gid, hero, game))
            opponents.add(opp)

        for gid, hero, game in picks[:need]:
            (ROOT / "data" / "games" / f"{gid}.pgn").write_text(str(game) + "\n", encoding="utf-8")
            h = game.headers
            games_meta.append({"id": gid, "hero": hero, "heroName": r["heroName"], "gm": gm_id,
                               "title": f"{h.get('Event', '')} {h.get('Date', '')[:4]}".strip()})
            have.add(gid)
            print(f"{gm_id:10} {gid:40} {h.get('Event')} | {h.get('White')} — {h.get('Black')} {h.get('Result')}")

    (ROOT / "data" / "games.json").write_text(json.dumps(games_meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()

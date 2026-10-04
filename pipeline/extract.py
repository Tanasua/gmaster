"""Витягує окремі партії з великих PGN-архівів (pgnmentor.com/players/*.zip) у data/games/.

Використання:
    python pipeline/extract.py <archive.pgn> <index> <out_name>

<index> — порядковий номер партії в архіві (0-based), його можна знайти через --find:
    python pipeline/extract.py <archive.pgn> --find <white> <black> <year>
"""
import sys
from pathlib import Path

import chess.pgn

ROOT = Path(__file__).resolve().parent.parent


def iter_games(path):
    with open(path, encoding="latin-1") as fh:
        while True:
            game = chess.pgn.read_game(fh)
            if game is None:
                return
            yield game


def find(path, white, black, year):
    with open(path, encoding="latin-1") as fh:
        i = 0
        while (h := chess.pgn.read_headers(fh)) is not None:
            if (white.lower() in h.get("White", "").lower()
                    and black.lower() in h.get("Black", "").lower()
                    and h.get("Date", "").startswith(year)):
                print(i, h.get("Event"), h.get("Date"), h.get("Round"),
                      h.get("White"), h.get("Black"), h.get("Result"))
            i += 1


def extract(path, index, out_name):
    for i, game in enumerate(iter_games(path)):
        if i == index:
            out = ROOT / "data" / "games" / f"{out_name}.pgn"
            out.write_text(str(game) + "\n", encoding="utf-8")
            print(f"{out.relative_to(ROOT)}: {game.headers['White']} - {game.headers['Black']}, "
                  f"{game.end().ply()} plies")
            return
    sys.exit(f"index {index} not found")


if __name__ == "__main__":
    if len(sys.argv) == 6 and sys.argv[2] == "--find":
        find(sys.argv[1], *sys.argv[3:6])
    elif len(sys.argv) == 4:
        extract(sys.argv[1], int(sys.argv[2]), sys.argv[3])
    else:
        sys.exit(__doc__)

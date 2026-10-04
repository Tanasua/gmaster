"""Офлайн-конвеєр: PGN → відбір цікавих позицій → оцінки Stockfish → web/public/data/puzzles.json.

Для кожного ходу «героя» партії (від першого ходу) рушій оцінює ВСІ легальні ходи,
тож фронтенд може оцінити будь-який хід користувача без рушія в браузері.
Найцікавіші позиції позначаються key=true — з них обирається «Хід дня».

Використання:
    python pipeline/build.py [--depth 16] [--per-game 10] [--engine /usr/games/stockfish]
"""
import argparse
import json
from pathlib import Path

import chess
import chess.engine
import chess.pgn

ROOT = Path(__file__).resolve().parent.parent
MATE_CP = 10_000

# Пороги відбору (у сантипішаках, з погляду того, хто ходить)
SKIP_OPENING_MOVES = 10   # перші N ходів не бувають ключовими — дебютна теорія
DECIDED_CP = 700          # позиція вже вирішена — не цікаво
GOOD_MOVE_CP = 30         # «рівноцінна альтернатива» (дублюється у фронтенді)
SHALLOW_DEPTH = 6         # для оцінки «неочевидності» ходу


def score_cp(score: chess.engine.PovScore, turn: chess.Color) -> int:
    return score.pov(turn).score(mate_score=MATE_CP)


def analyse(engine, board, depth, multipv=None):
    """Повертає [(move, cp, pv)] від найкращого до найгіршого (за замовчуванням — усі легальні ходи)."""
    n = multipv or board.legal_moves.count()
    infos = engine.analyse(board, chess.engine.Limit(depth=depth), multipv=n)
    out = []
    for info in infos:
        pv = info.get("pv")
        if not pv:
            continue
        out.append((pv[0], score_cp(info["score"], board.turn), pv))
    return out


def shallow_rank(engine, board, move):
    infos = engine.analyse(board, chess.engine.Limit(depth=SHALLOW_DEPTH), multipv=board.legal_moves.count())
    ranked = [i["pv"][0] for i in infos if i.get("pv")]
    return ranked.index(move) if move in ranked else len(ranked)


def is_recapture(board, move, prev_move):
    return (prev_move is not None and board.is_capture(move)
            and move.to_square == prev_move.to_square)


def pv_san(board, pv, limit=6):
    b = board.copy()
    out = []
    for m in pv[:limit]:
        out.append(b.san(m))
        b.push(m)
    return out


def process_game(engine, meta, depth, per_game):
    pgn_path = ROOT / "data" / "games" / f"{meta['id']}.pgn"
    with open(pgn_path, encoding="utf-8") as fh:
        game = chess.pgn.read_game(fh)
    hero = chess.WHITE if meta["hero"] == "white" else chess.BLACK
    h = game.headers

    positions = []
    moves = []
    board = game.board()
    prev_move = None
    for node in game.mainline():
        move = node.move
        moves.append(move.uci())
        # Єдиний легальний хід не загадуємо — фронтенд зіграє його сам
        if board.turn == hero and board.legal_moves.count() > 1:
            evals = analyse(engine, board, depth)
            best_move, best_cp, _ = evals[0]
            gm_cp, gm_pv = next(((cp, pv) for m, cp, pv in evals if m == move))
            gm_loss = best_cp - gm_cp
            good = [m for m, cp, _ in evals if best_cp - cp <= GOOD_MOVE_CP]
            srank = shallow_rank(engine, board, move)
            difficulty = 3 if srank >= 3 else 2 if srank >= 1 else 1

            # «Ключова» позиція (для «Ходу дня»): поза дебютом, не вимушена розміна,
            # не вирішена; гросмейстер зіграв сильно, сильних ходів мало, хід неочевидний.
            interest = None
            if (board.fullmove_number > SKIP_OPENING_MOVES
                    and not is_recapture(board, move, prev_move)
                    and abs(best_cp) < DECIDED_CP):
                interest = 2 / len(good) + (2 if gm_loss <= GOOD_MOVE_CP else 0)
                interest += 2 if srank >= 3 else 1 if srank >= 1 else 0
                if gm_loss > 150:
                    interest -= 3  # явна помилка гросмейстера — погана загадка

            positions.append({
                "fen": board.fen(),
                "ply": board.ply(),
                "moveNumber": board.fullmove_number,
                "lastMove": prev_move.uci() if prev_move else None,
                "gmMove": move.uci(),
                "gmSan": board.san(move),
                "gmLine": pv_san(board, gm_pv),
                "bestMove": best_move.uci(),
                "bestSan": board.san(best_move),
                "bestCp": best_cp,
                "evals": {m.uci(): cp for m, cp, _ in evals},
                "difficulty": difficulty,
                "key": False,
                "_interest": interest,
            })
        board.push(move)
        prev_move = move

    ranked = sorted((p for p in positions if p["_interest"] is not None), key=lambda p: -p["_interest"])
    for p in ranked[:per_game]:
        p["key"] = True
    for p in positions:
        del p["_interest"]

    return {
        "id": meta["id"],
        "title": meta["title"],
        "hero": meta["hero"],
        "heroName": meta["heroName"],
        "white": h.get("White"),
        "black": h.get("Black"),
        "event": h.get("Event"),
        "site": h.get("Site"),
        "year": h.get("Date", "????")[:4],
        "result": h.get("Result"),
        "moves": moves,
        "positions": positions,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--depth", type=int, default=14)
    ap.add_argument("--per-game", type=int, default=10)
    ap.add_argument("--engine", default="/usr/games/stockfish")
    ap.add_argument("--threads", type=int, default=4)
    ap.add_argument("--only", help="обробити лише партію з цим id")
    args = ap.parse_args()

    metas = json.loads((ROOT / "data" / "games.json").read_text(encoding="utf-8"))
    out_path = ROOT / "web" / "public" / "data" / "puzzles.json"
    existing = {}
    if args.only and out_path.exists():
        existing = {g["id"]: g for g in json.loads(out_path.read_text(encoding="utf-8"))["games"]}

    engine = chess.engine.SimpleEngine.popen_uci(args.engine)
    engine.configure({"Threads": args.threads, "Hash": 256})
    try:
        games = []
        for meta in metas:
            if args.only and meta["id"] != args.only:
                if meta["id"] in existing:
                    games.append(existing[meta["id"]])
                continue
            g = process_game(engine, meta, args.depth, args.per_game)
            print(f"{meta['id']}: {len(g['positions'])} positions")
            games.append(g)
    finally:
        engine.quit()

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps({"version": 2, "goodMoveCp": GOOD_MOVE_CP, "games": games},
                                   ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

import { useEffect, useMemo, useState } from 'react'
import { Chess, type Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import type { Attempt, Side } from '../types'

interface Props {
  fen: string
  lastMove: string | null
  gmMove: string
  orientation: Side
  attempt: Attempt | null
  /** false — дошка лише показує позицію (хід суперника, автоходи) */
  interactive?: boolean
  onMove: (uci: string, san: string) => void
}

const RED = 'rgba(205, 80, 70, 0.55)'
const GREEN = 'rgba(70, 160, 110, 0.5)'
const GOLD = 'rgba(214, 168, 72, 0.6)'
/** Скільки тримати на дошці неправильний хід (червоний), перш ніж повернути фігуру */
const WRONG_MOVE_MS = 700
/** Пауза після повернення фігури, перш ніж зіграти хід гросмейстера (зелений) */
const RETURN_MS = 450
/** Повна тривалість показу неправильного ходу */
export const REVEAL_MS = WRONG_MOVE_MS + RETURN_MS

type Phase = 'user' | 'back' | 'gm'

export function GuessBoard({ fen, lastMove, gmMove, orientation, attempt, interactive = true, onMove }: Props) {
  // Вибір прив'язаний до позиції, тож скидається сам, коли позиція змінюється
  const [selection, setSelection] = useState<{ fen: string; square: Square } | null>(null)
  const selected = selection?.fen === fen ? selection.square : null
  const setSelected = (square: Square | null) => setSelection(square ? { fen, square } : null)
  const locked = !!attempt || !interactive

  // Неправильний хід — по черзі, без стрілок: червоні поля → фігура повертається → зелений хід гросмейстера
  const wrong = !!attempt && !!attempt.userMove && attempt.userMove !== gmMove
  const [stage, setStage] = useState<{ attempt: Attempt; phase: Phase } | null>(null)
  useEffect(() => {
    if (!wrong || !attempt) return
    const t1 = setTimeout(() => setStage({ attempt, phase: 'back' }), WRONG_MOVE_MS)
    const t2 = setTimeout(() => setStage({ attempt, phase: 'gm' }), REVEAL_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [wrong, attempt])
  const phase: Phase | null = !attempt ? null : !wrong ? 'gm' : stage?.attempt === attempt ? stage.phase : 'user'

  const shownFen = useMemo(() => {
    if (!attempt || phase === 'back') return fen
    const c = new Chess(fen)
    c.move(uciToMove(phase === 'user' ? attempt.userMove : gmMove))
    return c.fen()
  }, [fen, gmMove, attempt, phase])

  function tryMove(from: Square, to: Square): boolean {
    if (locked) return false
    const c = new Chess(fen)
    try {
      // Перетворення — завжди у ферзя (MVP)
      const m = c.move({ from, to, promotion: 'q' })
      const uci = m.from + m.to + (m.promotion ?? '')
      onMove(uci, m.san)
      setSelected(null)
      return true
    } catch {
      return false
    }
  }

  function onSquareClick(square: Square, hasOwnPiece: boolean) {
    if (locked) return
    if (selected && selected !== square && tryMove(selected, square)) return
    setSelected(hasOwnPiece ? square : null)
  }

  const turn = new Chess(fen).turn()
  const squareStyles: Record<string, React.CSSProperties> = {}
  const [highlight, color] =
    phase === 'user' ? [attempt!.userMove, RED]
      : phase === 'gm' ? [gmMove, GREEN]
        : phase === 'back' ? [null, '']
          : [lastMove, GOLD]
  if (highlight) {
    squareStyles[highlight.slice(0, 2)] = { background: color }
    squareStyles[highlight.slice(2, 4)] = { background: color }
  }
  if (selected) {
    squareStyles[selected] = { background: 'rgba(232, 190, 96, 0.7)' }
    for (const m of new Chess(fen).moves({ square: selected, verbose: true })) {
      squareStyles[m.to] = {
        background: 'radial-gradient(circle, rgba(20,16,10,0.4) 20%, transparent 22%)',
      }
    }
  }

  return (
    <div className="board">
      <Chessboard
        options={{
          position: shownFen,
          boardOrientation: orientation,
          allowDragging: !locked,
          allowDrawingArrows: false,
          squareStyles,
          darkSquareStyle: { backgroundColor: 'var(--sq-dark)' },
          lightSquareStyle: { backgroundColor: 'var(--sq-light)' },
          canDragPiece: ({ piece }) => !locked && piece.pieceType[0] === turn,
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            !!targetSquare && tryMove(sourceSquare as Square, targetSquare as Square),
          onSquareClick: ({ piece, square }) =>
            onSquareClick(square as Square, !!piece && piece.pieceType[0] === turn),
        }}
      />
    </div>
  )
}

function uciToMove(uci: string) {
  return { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }
}

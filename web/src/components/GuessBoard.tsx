import { useMemo, useState } from 'react'
import { Chess, type Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import type { Attempt, Side } from '../types'

interface Props {
  fen: string
  lastMove: string | null
  gmMove: string
  orientation: Side
  attempt: Attempt | null
  onMove: (uci: string, san: string) => void
}

const ARROW_GM = 'rgba(34, 160, 90, 0.9)'
const ARROW_USER = 'rgba(220, 70, 60, 0.85)'

export function GuessBoard({ fen, lastMove, gmMove, orientation, attempt, onMove }: Props) {
  const [selected, setSelected] = useState<Square | null>(null)

  // Після спроби на дошці завжди стоїть реальний хід гросмейстера
  const shownFen = useMemo(() => {
    if (!attempt) return fen
    const c = new Chess(fen)
    c.move(uciToMove(gmMove))
    return c.fen()
  }, [fen, gmMove, attempt])

  function tryMove(from: Square, to: Square): boolean {
    if (attempt) return false
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
    if (attempt) return
    if (selected && selected !== square && tryMove(selected, square)) return
    setSelected(hasOwnPiece ? square : null)
  }

  const turn = new Chess(fen).turn()
  const squareStyles: Record<string, React.CSSProperties> = {}
  const highlight = attempt ? gmMove : lastMove
  if (highlight) {
    const color = attempt ? 'rgba(34, 160, 90, 0.35)' : 'rgba(255, 210, 60, 0.4)'
    squareStyles[highlight.slice(0, 2)] = { background: color }
    squareStyles[highlight.slice(2, 4)] = { background: color }
  }
  if (selected) {
    squareStyles[selected] = { background: 'rgba(80, 140, 255, 0.45)' }
    for (const m of new Chess(fen).moves({ square: selected, verbose: true })) {
      squareStyles[m.to] = {
        background: 'radial-gradient(circle, rgba(40,40,40,0.35) 22%, transparent 24%)',
      }
    }
  }

  const arrows = attempt
    ? [
        { startSquare: gmMove.slice(0, 2), endSquare: gmMove.slice(2, 4), color: ARROW_GM },
        ...(attempt.userMove !== gmMove
          ? [{ startSquare: attempt.userMove.slice(0, 2), endSquare: attempt.userMove.slice(2, 4), color: ARROW_USER }]
          : []),
      ]
    : []

  return (
    <div className="board">
      <Chessboard
        options={{
          position: shownFen,
          boardOrientation: orientation,
          allowDragging: !attempt,
          allowDrawingArrows: false,
          arrows,
          squareStyles,
          darkSquareStyle: { backgroundColor: 'var(--sq-dark)' },
          lightSquareStyle: { backgroundColor: 'var(--sq-light)' },
          canDragPiece: ({ piece }) => !attempt && piece.pieceType[0] === turn,
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

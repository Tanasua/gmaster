import type { Attempt, Game, Position } from '../types'
import { formatCp } from '../scoring'
import { GuessBoard } from './GuessBoard'
import { Seats } from './PlayerBar'

interface Props {
  game: Game
  position: Position
  attempt: Attempt | null
  onMove: (uci: string, san: string) => void
  onSkip?: () => void
  progress: React.ReactNode
  question: React.ReactNode
  /** Ховати, хто грав, до відповіді */
  hidePlayers?: boolean
  footer?: React.ReactNode
}

export function PositionCard({ game, position, attempt, onMove, onSkip, progress, question, hidePlayers, footer }: Props) {
  return (
    <div className="card">
      <div className="prompt">
        <div className="progress">{progress}</div>
        <div className="prompt-row">
          <div className="question">{question}</div>
        </div>
      </div>
      <Seats game={game} whiteToMove={(game.hero === 'white') !== !!attempt} hidden={hidePlayers}>
        <GuessBoard
          key={position.fen}
          fen={position.fen}
          lastMove={position.lastMove}
          gmMove={position.gmMove}
          orientation={game.hero}
          attempt={attempt}
          onMove={onMove}
        />
      </Seats>
      {onSkip && <SkipButton disabled={!!attempt} onClick={onSkip} />}
      <div className="panel">
        {attempt
          ? <Feedback game={game} position={position} attempt={attempt} />
          : <p className="hint">Перетягни фігуру або натисни на неї, а потім на поле.</p>}
      </div>
      {footer}
    </div>
  )
}

export function Feedback({ game, position, attempt }: { game: Game; position: Position; attempt: Attempt }) {
  const engineDisagrees = position.bestMove !== position.gmMove
  return (
    <div className={`feedback ${attempt.verdict}`}>
      {attempt.verdict === 'exact' && (
        <p className="verdict">✅ Вгадав! {game.heroName} зіграв <b>{position.gmSan}</b>. +{attempt.points}</p>
      )}
      {attempt.verdict === 'good' && (
        <p className="verdict">
          🟨 Сильний хід <b>{attempt.userSan}</b>, але {game.heroName} зіграв <b>{position.gmSan}</b>. +{attempt.points}
        </p>
      )}
      {attempt.verdict === 'skip' && (
        <p className="verdict">⏭ Пропущено. {game.heroName} зіграв <b>{position.gmSan}</b>.</p>
      )}
      {attempt.verdict === 'miss' && (
        <p className="verdict">❌ Ти зіграв <b>{attempt.userSan}</b>. {game.heroName} зіграв <b>{position.gmSan}</b>.</p>
      )}
      <p className="engine">
        Рушій: найкращий хід <b>{position.bestSan}</b> ({formatCp(position.bestCp)})
        {attempt.verdict !== 'exact' && Number.isFinite(attempt.cpLoss) && <>, твій хід — {formatCp(position.bestCp - attempt.cpLoss)}</>}
        {engineDisagrees && attempt.userMove === position.bestMove && <> — рушій на твоєму боці.</>}
      </p>
      <p className="line">Далі за рушієм: {formatLine(position.gmLine, position.moveNumber, game.hero)}</p>
      <p className="difficulty">Складність: {'★'.repeat(position.difficulty)}{'☆'.repeat(3 - position.difficulty)}</p>
    </div>
  )
}

function formatLine(sans: string[], moveNumber: number, side: 'white' | 'black'): string {
  let n = moveNumber
  let white = side === 'white'
  const parts: string[] = []
  sans.forEach((san, i) => {
    if (white) parts.push(`${n}. ${san}`)
    else parts.push(i === 0 ? `${n}... ${san}` : san)
    if (!white) n++
    white = !white
  })
  return parts.join(' ')
}

export function SkipButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button className="ghost skip" disabled={disabled} onClick={onClick} title="Не знаю — показати хід">
      Пропустити — не знаю
    </button>
  )
}

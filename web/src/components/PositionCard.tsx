import type { Attempt, Game, Position } from '../types'
import { formatCp } from '../scoring'
import { useLang, useT } from '../i18n'
import { Rich } from './Rich'
import { useSettings } from '../settings'
import { heroNames } from '../content/names'
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
  const t = useT()
  return (
    <div className="card">
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
      <div className="prompt">
        <div className="progress">{progress}</div>
        <div className="prompt-row">
          <div className="question">{question}</div>
        </div>
      </div>
      {onSkip && <SkipButton disabled={!!attempt} onClick={onSkip} />}
      <div className="panel">
        {attempt
          ? <Feedback game={game} position={position} attempt={attempt} />
          : <p className="hint">{t('hint')}</p>}
      </div>
      {footer}
    </div>
  )
}

export function Feedback({ game, position, attempt }: { game: Game; position: Position; attempt: Attempt }) {
  const t = useT()
  const lang = useLang()
  const { showEngine } = useSettings()
  const { short, female } = heroNames(game, lang)
  const vars = { name: short, san: <b>{position.gmSan}</b>, user: <b>{attempt.userSan}</b> }
  const engineDisagrees = position.bestMove !== position.gmMove
  const icon = { exact: '✅', good: '🟨', skip: '⏭', miss: '❌' }[attempt.verdict]
  const key = ({ exact: 'fbExact', good: 'fbGood', skip: 'fbSkip', miss: 'fbMiss' } as const)[attempt.verdict]
  const pts = attempt.points ? ` +${attempt.points}` : ''
  return (
    <div className={`feedback ${attempt.verdict}`}>
      <p className="verdict">{icon} <Rich text={t.g(key, female)} vars={vars} />{pts}</p>
      {showEngine && (
        <>
          <p className="engine">
            <Rich text={t('engineBest')} vars={{ san: <b>{position.bestSan}</b>, eval: formatCp(position.bestCp, lang) }} />
            {attempt.verdict !== 'exact' && Number.isFinite(attempt.cpLoss) && t('engineYour', { eval: formatCp(position.bestCp - attempt.cpLoss, lang) })}
            {engineDisagrees && attempt.userMove === position.bestMove && t('engineAgrees')}
          </p>
          <p className="line">{t('engineLine', { line: formatLine(position.gmLine, position.moveNumber, game.hero) })}</p>
          <p className="difficulty">{t('difficulty', { stars: '★'.repeat(position.difficulty) + '☆'.repeat(3 - position.difficulty) })}</p>
        </>
      )}
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
  const t = useT()
  return (
    <button className="ghost skip" disabled={disabled} onClick={onClick}>
      {t('skip')}
    </button>
  )
}

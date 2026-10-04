import type { Attempt, Game, Position } from '../types'
import { formatCp } from '../scoring'
import { useLang, useT } from '../i18n'
import { useSettings } from '../settings'
import { heroShort } from '../content/names'
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
  const hero = heroShort(game, lang)
  const engineDisagrees = position.bestMove !== position.gmMove
  return (
    <div className={`feedback ${attempt.verdict}`}>
      {attempt.verdict === 'exact' && (
        <p className="verdict">✅ {t('exact')} {hero} {t('played')} <b>{position.gmSan}</b>. +{attempt.points}</p>
      )}
      {attempt.verdict === 'good' && (
        <p className="verdict">
          🟨 {t('strongMove')} <b>{attempt.userSan}</b>, {t('but')} {hero} {t('played')} <b>{position.gmSan}</b>. +{attempt.points}
        </p>
      )}
      {attempt.verdict === 'skip' && (
        <p className="verdict">⏭ {t('skipped')} {hero} {t('played')} <b>{position.gmSan}</b>.</p>
      )}
      {attempt.verdict === 'miss' && (
        <p className="verdict">❌ {t('youPlayed')} <b>{attempt.userSan}</b>. {hero} {t('played')} <b>{position.gmSan}</b>.</p>
      )}
      {showEngine && (
        <>
          <p className="engine">
            {t('engineBest')} <b>{position.bestSan}</b> ({formatCp(position.bestCp, lang)})
            {attempt.verdict !== 'exact' && Number.isFinite(attempt.cpLoss) && <>, {t('yourMove')} — {formatCp(position.bestCp - attempt.cpLoss, lang)}</>}
            {engineDisagrees && attempt.userMove === position.bestMove && <> — {t('engineAgrees')}</>}
          </p>
          <p className="line">{t('engineLine')}: {formatLine(position.gmLine, position.moveNumber, game.hero)}</p>
          <p className="difficulty">{t('difficulty')}: {'★'.repeat(position.difficulty)}{'☆'.repeat(3 - position.difficulty)}</p>
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

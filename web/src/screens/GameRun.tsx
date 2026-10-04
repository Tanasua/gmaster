import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Attempt, Game } from '../types'
import { judge, SKIP_ATTEMPT, VERDICT_EMOJI } from '../scoring'
import { recordAttempt, type Stats } from '../storage'
import { Feedback, SkipButton } from '../components/PositionCard'
import { GuessBoard, REVEAL_MS } from '../components/GuessBoard'
import { Seats } from '../components/PlayerBar'
import { ShareButton } from '../components/ShareButton'
import { useLang, useT } from '../i18n'
import { OPENING_MOVE_MS, SKIP_OPENING_PLIES, SPEED_FACTOR, useSettings } from '../settings'
import { playSound } from '../sound'
import { gameTitle, heroShort } from '../content/names'
import { chunk, pct } from '../util'

const AUTO_MOVE_MS = 600
const AUTO_NEXT_AFTER_EXACT_MS = 900
/** Після неправильного ходу: пауза на зеленому ході гросмейстера перед ходом суперника */
const AUTO_NEXT_AFTER_MISS_MS = 1500

export function GameRun({ game, goodMoveCp, stats, setStats, onExit }: {
  game: Game; goodMoveCp: number; stats: Stats; setStats: (s: Stats) => void; onExit: () => void
}) {
  const t = useT()
  const lang = useLang()
  const settings = useSettings()
  const k = SPEED_FACTOR[settings.speed]
  // Дебют при «Пропускати дебют» програється на дошці сам, по пів секунди на хід
  const openingEnd = settings.skipOpening ? Math.min(SKIP_OPENING_PLIES, game.moves.length - 1) : 0

  // ply — скільки ходів партії вже зіграно на дошці
  const [ply, setPly] = useState(0)
  const [attempts, setAttempts] = useState<Record<number, Attempt>>({})
  const timeline = useMemo(() => buildTimeline(game.moves), [game.moves])
  const byPly = useMemo(() => new Map(game.positions.map((p) => [p.ply, p])), [game.positions])
  const hero = heroShort(game, lang)

  const done = ply >= game.moves.length
  const inOpening = ply < openingEnd
  const pos = inOpening ? undefined : byPly.get(ply)
  const attempt = attempts[ply] ?? null
  const waiting = !done && !!pos && !attempt

  // Ходи суперника і вимушені ходи героя граються самі
  useEffect(() => {
    if (done || pos) return
    const timer = setTimeout(() => setPly((p) => p + 1), inOpening ? OPENING_MOVE_MS : AUTO_MOVE_MS * k)
    return () => clearTimeout(timer)
  }, [ply, done, pos, k, inOpening])

  // Після будь-якої спроби партія продовжується сама, без кнопок
  useEffect(() => {
    if (!attempt) return
    const delay = attempt.verdict === 'exact' ? AUTO_NEXT_AFTER_EXACT_MS * k : REVEAL_MS + AUTO_NEXT_AFTER_MISS_MS * k
    const timer = setTimeout(() => setPly((p) => p + 1), delay)
    return () => clearTimeout(timer)
  }, [attempt, k])

  // Звук ходу суперника / вимушеного ходу (ходи героя озвучуються під час спроби)
  useEffect(() => {
    if (!settings.sound || ply === 0 || attempts[ply - 1]) return
    playSound(timeline[ply].san?.includes('x') ? 'capture' : 'move')
  }, [ply]) // eslint-disable-line react-hooks/exhaustive-deps

  // Пояснення до останнього ходу лишається видимим, поки суперник ходить і до наступної спроби
  const lastPly = Math.max(-1, ...Object.keys(attempts).map(Number).filter((p) => p <= ply))
  const lastAttempt = attempts[lastPly] ?? null
  const lastPos = byPly.get(lastPly)

  const playable = game.positions.filter((p) => p.ply >= openingEnd)
  const list = playable.map((p) => attempts[p.ply]).filter((a): a is Attempt => !!a)

  if (done) return <Summary game={game} attempts={list} onExit={onExit} onRestart={() => { setPly(0); setAttempts({}) }} />

  function record(a: Attempt) {
    setAttempts({ ...attempts, [ply]: a })
    setStats(recordAttempt(stats, game.heroName, a.verdict, a.points))
    if (settings.sound) playSound(a.verdict === 'exact' || a.verdict === 'good' ? 'good' : 'bad')
  }

  function onMove(uci: string, san: string) {
    if (pos) record({ userMove: uci, userSan: san, ...judge(pos, uci, goodMoveCp) })
  }

  const exact = list.filter((a) => a.verdict === 'exact').length
  const moveNumber = Math.floor(ply / 2) + 1
  const heroToMove = (ply % 2 === 0) === (game.hero === 'white')

  return (
    <div className="card">
      <Seats game={game} whiteToMove={ply % 2 === 0}>
        <GuessBoard
          fen={timeline[ply].fen}
          lastMove={timeline[ply].lastMove}
          gmMove={pos?.gmMove ?? ''}
          orientation={game.hero}
          attempt={attempt}
          interactive={waiting}
          onMove={onMove}
        />
      </Seats>
      <div className="prompt">
        <div className="progress">
          {gameTitle(game, lang)} · {t('guessed')} {exact} {t('of')} {list.length} ({t('total')} {playable.length})
        </div>
        <div className="prompt-row">
          <div className="question">
            {waiting
              ? <>{t('move')} {moveNumber}{game.hero === 'black' ? '…' : '.'} {t('whatPlayed')} <b>{hero}</b>{t('whatPlayedEnd')}</>
              : inOpening
                ? t('opening')
                : heroToMove && !pos
                  ? t('onlyMove')
                : !heroToMove
                  ? t('opponentMoves')
                  : <>&nbsp;</>}
          </div>
        </div>
      </div>
      {/* Кнопка завжди на місці (лише вимикається), щоб дошка не стрибала */}
      <SkipButton disabled={!waiting} onClick={() => record(SKIP_ATTEMPT)} />
      <div className="panel">
        {lastAttempt && lastPos && lastAttempt.verdict !== 'exact' && <Feedback game={game} position={lastPos} attempt={lastAttempt} />}
        {lastAttempt && lastPos && lastAttempt.verdict === 'exact' && (
          <p className="feedback exact verdict">✅ {lastPos.gmSan} — {hero} {t('exactShort')}. +{lastAttempt.points}</p>
        )}
        {!lastAttempt && <p className="hint">{t('hint')}</p>}
      </div>
      <MoveList timeline={timeline} ply={ply} attempts={attempts} />
    </div>
  )
}

interface TimelineEntry { fen: string; lastMove: string | null; san: string | null }

/** fen перед кожним ходом партії (і фінальна позиція) */
function buildTimeline(moves: string[]): TimelineEntry[] {
  const c = new Chess()
  const out: TimelineEntry[] = [{ fen: c.fen(), lastMove: null, san: null }]
  for (const uci of moves) {
    const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })
    out.push({ fen: c.fen(), lastMove: uci, san: m.san })
  }
  return out
}

function MoveList({ timeline, ply, attempts }: { timeline: TimelineEntry[]; ply: number; attempts: Record<number, Attempt> }) {
  const t = useT()
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight })
  }, [ply])
  // Хід героя з'являється в записі лише після спроби
  const shown = attempts[ply] ? ply + 1 : ply
  const rows: React.ReactNode[] = []
  for (let i = 0; i < shown; i += 2) {
    rows.push(
      <li key={i} className="mv-row">
        <span className="mv-no">{i / 2 + 1}.</span>
        {[i, i + 1].map((k) => k < shown && (
          <span key={k} className={`mv ${attempts[k]?.verdict ?? ''}`}>{timeline[k + 1].san}</span>
        ))}
      </li>,
    )
  }
  return (
    <ol ref={ref} className="moves">
      {rows.length ? rows : <li className="small">{t('gameStarts')}</li>}
    </ol>
  )
}

function Summary({ game, attempts, onExit, onRestart }: { game: Game; attempts: Attempt[]; onExit: () => void; onRestart: () => void }) {
  const t = useT()
  const lang = useLang()
  const hero = heroShort(game, lang)
  const exact = attempts.filter((a) => a.verdict === 'exact').length
  const good = attempts.filter((a) => a.verdict === 'good').length
  const skipped = attempts.filter((a) => a.verdict === 'skip').length
  const points = attempts.reduce((s, a) => s + a.points, 0)
  const grid = chunk(attempts.map((a) => VERDICT_EMOJI[a.verdict]), 10).map((r) => r.join('')).join('\n')
  const p = pct(exact, attempts.length)
  const headline = `${t('youPlayedLike')} ${hero} ${t('on')} ${p}%`
  const shareText = `♟ ${t('appTitle')}\n${gameTitle(game, lang)} (${game.year})\n${headline}\n${grid}`
  return (
    <div className="card summary">
      <h2>{headline}</h2>
      <p className="grid">{grid}</p>
      <p>
        {t('guessedOf')} {exact} {t('of')} {attempts.length} {t('movesWord')} · {good} {t('strongAlt')}
        {skipped ? ` · ${t('skippedN')} ${skipped}` : ''} · {points} {t('points')}
      </p>
      <p className="small">{game.white} — {game.black}, {game.event}, {game.year}, {game.result}</p>
      <div className="row">
        <ShareButton text={shareText} />
        <button onClick={onRestart}>{t('again')}</button>
        <button onClick={onExit}>{t('toMenu')}</button>
      </div>
    </div>
  )
}

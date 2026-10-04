import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Attempt, Game, PuzzleData } from './types'
import { judge, VERDICT_EMOJI } from './scoring'
import { loadStats, recordAttempt, recordDaily, type Stats } from './storage'
import { dailyPick, todayKey } from './daily'
import { Feedback, PositionCard } from './components/PositionCard'
import { GuessBoard } from './components/GuessBoard'

type Screen = { kind: 'home' } | { kind: 'game'; gameId: string } | { kind: 'daily' }

export default function App() {
  const [data, setData] = useState<PuzzleData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [screen, setScreen] = useState<Screen>({ kind: 'home' })

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/puzzles.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e) => setError(String(e)))
  }, [])

  if (error) return <main className="app"><p>Не вдалося завантажити позиції: {error}</p></main>
  if (!data) return <main className="app"><p>Завантаження…</p></main>

  const home = () => setScreen({ kind: 'home' })

  return (
    <main className="app">
      <header className="top">
        <button className="logo" onClick={home}>♟ Вгадай хід гросмейстера</button>
        <span className="score">{stats.points} очок · серія {stats.streak}🔥</span>
      </header>
      {screen.kind === 'home' && <Home data={data} stats={stats} setScreen={setScreen} />}
      {screen.kind === 'game' && (
        <GameRun
          key={screen.gameId}
          game={data.games.find((g) => g.id === screen.gameId)!}
          goodMoveCp={data.goodMoveCp}
          stats={stats}
          setStats={setStats}
          onExit={home}
        />
      )}
      {screen.kind === 'daily' && (
        <Daily data={data} stats={stats} setStats={setStats} onExit={home} />
      )}
    </main>
  )
}

function Home({ data, stats, setScreen }: { data: PuzzleData; stats: Stats; setScreen: (s: Screen) => void }) {
  const today = todayKey()
  const dailyDone = stats.daily[today]
  const heroes = Object.entries(stats.heroes).sort((a, b) => b[1].attempts - a[1].attempts)
  return (
    <>
      <section className="hero-block">
        <h1>Чи зможеш ти думати як гросмейстер?</h1>
        <p>Позиції з реальних партій. Вгадай хід, який зробив чемпіон, — а не той, що радить рушій.</p>
        <button className="primary" onClick={() => setScreen({ kind: 'daily' })}>
          {dailyDone ? `Хід дня ${VERDICT_EMOJI[dailyDone]} — переглянути` : '♟ Хід дня'}
        </button>
      </section>

      <h2>Партії</h2>
      <ul className="games">
        {data.games.map((g) => (
          <li key={g.id}>
            <button onClick={() => setScreen({ kind: 'game', gameId: g.id })}>
              <span className="game-title">{g.title}</span>
              <span className="game-meta">
                Грай за: <b>{g.heroName}</b> · {g.white} — {g.black}, {g.year} · {Math.ceil(g.moves.length / 2)} ходів
              </span>
            </button>
          </li>
        ))}
      </ul>

      {heroes.length > 0 && (
        <>
          <h2>GM-індекс</h2>
          <table className="gm-index">
            <thead><tr><th>Гросмейстер</th><th>Вгадано</th><th>Сильних ходів</th></tr></thead>
            <tbody>
              {heroes.map(([name, h]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{pct(h.exact, h.attempts)}%</td>
                  <td>{pct(h.exact + h.good, h.attempts)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small">Найдовша серія вгаданих ходів: {stats.bestStreak}</p>
        </>
      )}
    </>
  )
}

const AUTO_MOVE_MS = 600
const AUTO_NEXT_AFTER_EXACT_MS = 900

function GameRun({ game, goodMoveCp, stats, setStats, onExit }: {
  game: Game; goodMoveCp: number; stats: Stats; setStats: (s: Stats) => void; onExit: () => void
}) {
  // ply — скільки ходів партії вже зіграно на дошці
  const [ply, setPly] = useState(0)
  const [attempts, setAttempts] = useState<Record<number, Attempt>>({})
  const timeline = useMemo(() => buildTimeline(game.moves), [game.moves])
  const byPly = useMemo(() => new Map(game.positions.map((p) => [p.ply, p])), [game.positions])

  const done = ply >= game.moves.length
  const pos = byPly.get(ply)
  const attempt = attempts[ply] ?? null
  const waiting = !done && !!pos && !attempt

  // Ходи суперника і вимушені ходи героя граються самі
  useEffect(() => {
    if (done || pos) return
    const t = setTimeout(() => setPly((p) => p + 1), AUTO_MOVE_MS)
    return () => clearTimeout(t)
  }, [ply, done, pos])

  // Після вгаданого ходу партія продовжується без натискання «Далі»
  useEffect(() => {
    if (attempt?.verdict !== 'exact') return
    const t = setTimeout(() => setPly((p) => p + 1), AUTO_NEXT_AFTER_EXACT_MS)
    return () => clearTimeout(t)
  }, [attempt])

  const list = game.positions.map((p) => attempts[p.ply]).filter((a): a is Attempt => !!a)

  if (done) return <Summary game={game} attempts={list} onExit={onExit} onRestart={() => { setPly(0); setAttempts({}) }} />

  function onMove(uci: string, san: string) {
    if (!pos) return
    const r = judge(pos, uci, goodMoveCp)
    setAttempts({ ...attempts, [ply]: { userMove: uci, userSan: san, ...r } })
    setStats(recordAttempt(stats, game.heroName, r.verdict, r.points))
  }

  const exact = list.filter((a) => a.verdict === 'exact').length
  const moveNumber = Math.floor(ply / 2) + 1
  const heroToMove = (ply % 2 === 0) === (game.hero === 'white')

  return (
    <div className="card">
      <div className="prompt">
        <div className="progress">
          {game.title} · вгадано {exact} з {list.length} · {game.positions.length} ходів {game.heroName} у партії
        </div>
        <div>
          {waiting
            ? <>Хід {moveNumber}{game.hero === 'black' ? '…' : '.'} Що зіграв <b>{game.heroName}</b>?</>
            : heroToMove && !pos
              ? <>Єдиний можливий хід…</>
              : !heroToMove
                ? <>Ходить суперник…</>
                : <>&nbsp;</>}
        </div>
      </div>
      <GuessBoard
        fen={timeline[ply].fen}
        lastMove={timeline[ply].lastMove}
        gmMove={pos?.gmMove ?? ''}
        orientation={game.hero}
        attempt={attempt}
        interactive={waiting}
        onMove={onMove}
      />
      {attempt && pos && attempt.verdict !== 'exact' && <Feedback game={game} position={pos} attempt={attempt} />}
      {attempt && attempt.verdict === 'exact' && (
        <p className="feedback exact verdict">✅ {pos?.gmSan} — так і зіграв {game.heroName}. +{attempt.points}</p>
      )}
      {attempt && attempt.verdict !== 'exact' && (
        <button className="primary" onClick={() => setPly(ply + 1)}>Далі →</button>
      )}
      <MoveList game={game} timeline={timeline} ply={ply} attempts={attempts} />
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

function MoveList({ game, timeline, ply, attempts }: {
  game: Game; timeline: TimelineEntry[]; ply: number; attempts: Record<number, Attempt>
}) {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight })
  }, [ply])
  // Хід героя з'являється в записі лише після спроби
  const shown = attempts[ply] ? ply + 1 : ply
  const rows: React.ReactNode[] = []
  for (let i = 0; i < shown; i += 2) {
    rows.push(
      <li key={i}>
        <span className="mv-no">{i / 2 + 1}.</span>
        {[i, i + 1].map((k) => k < shown && (
          <span key={k} className={`mv ${attempts[k]?.verdict ?? ''}`}>{timeline[k + 1].san}</span>
        ))}
      </li>,
    )
  }
  return (
    <ol ref={ref} className="moves" aria-label={`Запис партії ${game.white} — ${game.black}`}>
      {rows.length ? rows : <li className="small">Партія починається з початкової позиції.</li>}
    </ol>
  )
}

function Summary({ game, attempts, onExit, onRestart }: { game: Game; attempts: Attempt[]; onExit: () => void; onRestart: () => void }) {
  const exact = attempts.filter((a) => a.verdict === 'exact').length
  const good = attempts.filter((a) => a.verdict === 'good').length
  const points = attempts.reduce((s, a) => s + a.points, 0)
  const grid = chunk(attempts.map((a) => VERDICT_EMOJI[a.verdict]), 10).map((r) => r.join('')).join('\n')
  const shareText = `♟ Вгадай хід гросмейстера\n${game.title} (${game.year})\nЯ зіграв як ${game.heroName} на ${pct(exact, attempts.length)}%\n${grid}`
  return (
    <div className="card summary">
      <h2>Ти зіграв як {game.heroName} на {pct(exact, attempts.length)}%</h2>
      <p className="grid">{grid}</p>
      <p>Вгадано {exact} з {attempts.length} ходів · ще {good} сильних альтернатив · {points} очок</p>
      <p className="small">{game.white} — {game.black}, {game.event}, {game.year}, {game.result}</p>
      <div className="row">
        <ShareButton text={shareText} />
        <button onClick={onRestart}>Ще раз</button>
        <button onClick={onExit}>До партій</button>
      </div>
    </div>
  )
}

function Daily({ data, stats, setStats, onExit }: { data: PuzzleData; stats: Stats; setStats: (s: Stats) => void; onExit: () => void }) {
  const today = todayKey()
  const { game, position, index } = dailyPick(data.games, today)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const prev = stats.daily[today]

  function onMove(uci: string, san: string) {
    const r = judge(position, uci, data.goodMoveCp)
    setAttempt({ userMove: uci, userSan: san, ...r })
    if (!prev) setStats(recordDaily(recordAttempt(stats, game.heroName, r.verdict, r.points), today, r.verdict))
  }

  const verdict = attempt?.verdict ?? prev
  const shareText = verdict && `♟ Хід дня #${index} ${VERDICT_EMOJI[verdict]}\nВгадай хід гросмейстера`

  return (
    <PositionCard
      game={game}
      position={position}
      attempt={attempt}
      onMove={onMove}
      header={
        <>
          <div className="progress">Хід дня #{index}{prev && !attempt ? ` · сьогодні вже зіграно ${VERDICT_EMOJI[prev]} (без очок)` : ''}</div>
          {/* Хто грав — показуємо лише після відповіді */}
          <div>
            Хід {position.moveNumber}{game.hero === 'black' ? '…' : '.'} {game.hero === 'white' ? 'Білі' : 'Чорні'}. Який хід зробив гросмейстер?
          </div>
          {attempt && <div className="reveal">Це був <b>{game.heroName}</b>: {game.white} — {game.black}, {game.year}</div>}
        </>
      }
      footer={attempt && (
        <div className="row">
          {shareText && <ShareButton text={shareText} />}
          <button onClick={onExit}>До партій</button>
        </div>
      )}
    />
  )
}

function ShareButton({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return // користувач скасував
    }
    // Web Share недоступний або заборонений — копіюємо в буфер, інакше показуємо текст
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('manual')
    }
  }
  return (
    <>
      <button className="primary" onClick={share}>{state === 'copied' ? 'Скопійовано ✓' : 'Поділитися'}</button>
      {state === 'manual' && <textarea id="share-text" className="share-text" readOnly value={text} onFocus={(e) => e.currentTarget.select()} />}
    </>
  )
}

function pct(a: number, b: number): number {
  return b === 0 ? 0 : Math.round((a / b) * 100)
}

function chunk<T>(xs: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n))
  return out
}

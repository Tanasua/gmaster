import { useEffect, useState } from 'react'
import type { Attempt, Game, PuzzleData } from './types'
import { judge, VERDICT_EMOJI } from './scoring'
import { loadStats, recordAttempt, recordDaily, type Stats } from './storage'
import { dailyPick, todayKey } from './daily'
import { PositionCard } from './components/PositionCard'

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
                Грай за: <b>{g.heroName}</b> · {g.white} — {g.black}, {g.year} · {g.positions.length} позицій
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

function GameRun({ game, goodMoveCp, stats, setStats, onExit }: {
  game: Game; goodMoveCp: number; stats: Stats; setStats: (s: Stats) => void; onExit: () => void
}) {
  const [i, setI] = useState(0)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const done = i >= game.positions.length

  if (done) return <Summary game={game} attempts={attempts} onExit={onExit} onRestart={() => { setI(0); setAttempts([]) }} />

  const pos = game.positions[i]
  const attempt = attempts[i] ?? null

  function onMove(uci: string, san: string) {
    const r = judge(pos, uci, goodMoveCp)
    setAttempts([...attempts, { userMove: uci, userSan: san, ...r }])
    setStats(recordAttempt(stats, game.heroName, r.verdict, r.points))
  }

  return (
    <PositionCard
      game={game}
      position={pos}
      attempt={attempt}
      onMove={onMove}
      header={
        <>
          <div className="progress">{game.title} · позиція {i + 1}/{game.positions.length} · {attempts.map((a) => VERDICT_EMOJI[a.verdict]).join('')}</div>
          <div>Хід {pos.moveNumber}{game.hero === 'black' ? '…' : '.'} Що зіграв <b>{game.heroName}</b>?</div>
        </>
      }
      footer={attempt && (
        <button className="primary" onClick={() => setI(i + 1)}>
          {i + 1 < game.positions.length ? 'Наступна позиція →' : 'Підсумок'}
        </button>
      )}
    />
  )
}

function Summary({ game, attempts, onExit, onRestart }: { game: Game; attempts: Attempt[]; onExit: () => void; onRestart: () => void }) {
  const exact = attempts.filter((a) => a.verdict === 'exact').length
  const good = attempts.filter((a) => a.verdict === 'good').length
  const points = attempts.reduce((s, a) => s + a.points, 0)
  const grid = attempts.map((a) => VERDICT_EMOJI[a.verdict]).join('')
  const shareText = `♟ Вгадай хід гросмейстера\n${game.title} (${game.year})\nЯ зіграв як ${game.heroName} на ${pct(exact, attempts.length)}%\n${grid}`
  return (
    <div className="card summary">
      <h2>Ти зіграв як {game.heroName} на {pct(exact, attempts.length)}%</h2>
      <p className="grid">{grid}</p>
      <p>Вгадано {exact} з {attempts.length} · ще {good} сильних альтернатив · {points} очок</p>
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
  const [copied, setCopied] = useState(false)
  async function share() {
    try {
      if (navigator.share) await navigator.share({ text })
      else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      }
    } catch {
      /* користувач скасував */
    }
  }
  return <button className="primary" onClick={share}>{copied ? 'Скопійовано ✓' : 'Поділитися'}</button>
}

function pct(a: number, b: number): number {
  return b === 0 ? 0 : Math.round((a / b) * 100)
}

import { useEffect, useState } from 'react'
import type { PuzzleData } from './types'
import { loadStats, resetStats, type Stats } from './storage'
import { PlayersContext, type Players } from './players'
import { LangContext, useT } from './i18n'
import { BOARDS, loadSettings, saveSettings, SettingsContext, useSettings, type Settings } from './settings'
import { gmById } from './content/gms'
import { gamesOfGm, gmOfGame, heroShort } from './content/names'
import { BackIcon, FlameIcon, Ornament, UserIcon } from './components/Icons'
import { Menu, type MenuAction } from './screens/Menu'
import { GmList, GmPage } from './screens/Gms'
import { GameList, GamePreview } from './screens/Games'
import { GameRun } from './screens/GameRun'
import { Daily } from './screens/Daily'
import { SettingsScreen } from './screens/SettingsScreen'

type Screen =
  | { kind: 'menu' }
  | { kind: 'gms' }
  | { kind: 'gm'; id: string }
  | { kind: 'games' }
  | { kind: 'preview'; gameId: string }
  | { kind: 'game'; gameId: string; run: number }
  | { kind: 'daily' }
  | { kind: 'settings' }

export default function App() {
  const [data, setData] = useState<PuzzleData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [players, setPlayers] = useState<Players>({})
  const [settings, setSettingsState] = useState<Settings>(loadSettings)
  // Стек екранів: «Назад» повертає на попередній
  const [stack, setStack] = useState<Screen[]>([{ kind: 'menu' }])
  const screen = stack[stack.length - 1]

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/puzzles.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e) => setError(String(e)))
    // Фото гравців — необов'язкові: без них показуються ініціали
    fetch(`${import.meta.env.BASE_URL}data/players.json`)
      .then((r) => (r.ok ? r.json() : {}))
      .then(setPlayers)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.palette = settings.theme
    root.lang = settings.lang
    const [light, dark] = BOARDS[settings.board] ?? BOARDS.wood
    root.style.setProperty('--sq-light', light)
    root.style.setProperty('--sq-dark', dark)
  }, [settings.theme, settings.lang, settings.board])

  // Кожен новий екран відкривається з верху сторінки
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [stack.length])

  const setSettings = (s: Settings) => {
    setSettingsState(s)
    saveSettings(s)
  }
  const push = (s: Screen) => setStack([...stack, s])
  const back = () => setStack(stack.length > 1 ? stack.slice(0, -1) : stack)
  const toMenu = () => setStack([{ kind: 'menu' }])

  return (
    <SettingsContext.Provider value={settings}>
      <LangContext.Provider value={settings.lang}>
        <PlayersContext.Provider value={players}>
          <main className="app">
            {error && <ErrorBox error={error} />}
            {!error && !data && <Loading />}
            {data && (
              <>
                <Header screen={screen} data={data} stats={stats} onBack={back} />
                {screen.kind === 'menu' && (
                  <Menu data={data} stats={stats} onAction={(a) => onMenu(a, data)} />
                )}
                {screen.kind === 'gms' && <GmList games={data.games} onOpen={(id) => push({ kind: 'gm', id })} />}
                {screen.kind === 'gm' && gmById(screen.id) && (
                  <GmPage
                    gm={gmById(screen.id)!}
                    games={data.games}
                    onSelect={(id) => { setSettings({ ...settings, gmId: id }); if (id) toMenu() }}
                    onOpenGame={(gameId) => push({ kind: 'preview', gameId })}
                  />
                )}
                {screen.kind === 'games' && <GameList games={data.games} onOpen={(gameId) => push({ kind: 'preview', gameId })} />}
                {screen.kind === 'preview' && (
                  <GamePreview
                    game={data.games.find((g) => g.id === screen.gameId)!}
                    onStart={() => push({ kind: 'game', gameId: screen.gameId, run: Date.now() })}
                  />
                )}
                {screen.kind === 'game' && (
                  <GameRun
                    key={screen.run}
                    game={data.games.find((g) => g.id === screen.gameId)!}
                    goodMoveCp={data.goodMoveCp}
                    stats={stats}
                    setStats={setStats}
                    onExit={toMenu}
                  />
                )}
                {screen.kind === 'daily' && <Daily data={data} stats={stats} setStats={setStats} onExit={toMenu} />}
                {screen.kind === 'settings' && (
                  <SettingsScreen settings={settings} onChange={setSettings} onResetStats={() => setStats(resetStats())} />
                )}
                <footer className="bottom"><Ornament /></footer>
              </>
            )}
          </main>
        </PlayersContext.Provider>
      </LangContext.Provider>
    </SettingsContext.Provider>
  )

  function onMenu(a: MenuAction, d: PuzzleData) {
    if (a === 'gms') push({ kind: 'gms' })
    else if (a === 'games') push({ kind: 'games' })
    else if (a === 'daily') push({ kind: 'daily' })
    else if (a === 'settings') push({ kind: 'settings' })
    else {
      // Випадкова партія: серед партій обраного гросмейстера, якщо він обраний
      const gm = gmById(settings.gmId)
      const pool = gm && gamesOfGm(gm, d.games).length ? gamesOfGm(gm, d.games) : d.games
      const game = pool[Math.floor(Math.random() * pool.length)]
      push({ kind: 'preview', gameId: game.id })
    }
  }
}

function Header({ screen, data, stats, onBack }: { screen: Screen; data: PuzzleData; stats: Stats; onBack: () => void }) {
  const t = useT()
  const { lang, gmId } = useSettings()
  const game = 'gameId' in screen ? data.games.find((g) => g.id === screen.gameId) : undefined
  const gm = game ? gmOfGame(game) : gmById(gmId)
  const subtitle = game
    ? `${t('youPlayFor')}: ${heroShort(game, lang)}`
    : screen.kind === 'daily' ? t('daily')
      : gm ? `${t('youPlayAs')}: ${gm.short[lang]}` : t('chooseGmHint')
  return (
    <header className="top">
      <div className="top-bar">
        {screen.kind !== 'menu'
          ? <button className="icon-btn" aria-label={t('back')} onClick={onBack}><BackIcon /></button>
          : <span className="icon-spacer" />}
        <Ornament />
        <span className="icon-spacer" />
      </div>
      <h1 className="app-title">{t('appTitle')}</h1>
      <div className="top-meta">
        <span className="chip"><UserIcon /> {subtitle}</span>
        <span className="pill"><FlameIcon /> {stats.points} {t('points')} · {t('streak')} <b>{stats.streak}</b></span>
      </div>
    </header>
  )
}

function Loading() {
  const t = useT()
  return <p>{t('loading')}</p>
}

function ErrorBox({ error }: { error: string }) {
  const t = useT()
  return <p>{t('loadError')}: {error}</p>
}

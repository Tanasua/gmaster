import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as NativeApp } from '@capacitor/app'
import type { GameMeta, IndexData } from './types'
import { useGame } from './gameStore'
import { loadStats, resetStats, type Stats } from './storage'
import { PlayersContext, type Players } from './players'
import { detectLang, LangContext, useLang, useT } from './i18n'
import { Rich } from './components/Rich'
import { BOARDS, loadFlags, loadSettings, saveFlags, saveSettings, SettingsContext, useSettings, type Settings } from './settings'
import { Onboarding } from './components/Onboarding'
import { gmById } from './content/gms'
import { gamesOfGm, gmOfGame, heroNames } from './content/names'
import { gmText } from './i18n'
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
  const [data, setData] = useState<IndexData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [players, setPlayers] = useState<Players>({})
  const [settings, setSettingsState] = useState<Settings>(loadSettings)
  // Стек екранів: «Назад» повертає на попередній
  const [stack, setStack] = useState<Screen[]>([{ kind: 'menu' }])
  // Навчання показується при першому запуску; з налаштувань — ще раз на вимогу
  const [showOnboarding, setShowOnboarding] = useState(() => !loadFlags().onboarded)
  const finishOnboarding = () => {
    saveFlags({ ...loadFlags(), onboarded: true })
    setShowOnboarding(false)
  }
  const screen = stack[stack.length - 1]
  const lang = settings.lang === 'auto' ? detectLang() : settings.lang

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/index.json`)
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
    root.lang = lang
    const [light, dark] = BOARDS[settings.board] ?? BOARDS.wood
    root.style.setProperty('--sq-light', light)
    root.style.setProperty('--sq-dark', dark)
  }, [settings.theme, lang, settings.board])

  // Android: системна кнопка «назад» повертає на попередній екран, з меню — закриває застосунок
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const sub = NativeApp.addListener('backButton', () => {
      if (stack.length > 1) setStack(stack.slice(0, -1))
      else void NativeApp.exitApp()
    })
    return () => { void sub.then((h) => h.remove()) }
  }, [stack])

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
      <LangContext.Provider value={lang}>
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
                  <GameLoader
                    key={screen.run}
                    meta={data.games.find((g) => g.id === screen.gameId)!}
                    goodMoveCp={data.goodMoveCp}
                    stats={stats}
                    setStats={setStats}
                    onExit={toMenu}
                  />
                )}
                {screen.kind === 'daily' && <Daily data={data} stats={stats} setStats={setStats} onExit={toMenu} />}
                {screen.kind === 'settings' && (
                  <SettingsScreen
                    settings={settings}
                    onChange={setSettings}
                    onResetStats={() => setStats(resetStats())}
                    onImported={(s, st) => { setSettings(s); setStats(st) }}
                    onShowHelp={() => setShowOnboarding(true)}
                  />
                )}
                <footer className="bottom"><Ornament /></footer>
                {showOnboarding && <Onboarding onDone={finishOnboarding} />}
              </>
            )}
          </main>
        </PlayersContext.Provider>
      </LangContext.Provider>
    </SettingsContext.Provider>
  )

  function onMenu(a: MenuAction, d: IndexData) {
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

function Header({ screen, data, stats, onBack }: { screen: Screen; data: IndexData; stats: Stats; onBack: () => void }) {
  const t = useT()
  const { gmId } = useSettings()
  const lang = useLang()
  const game = 'gameId' in screen ? data.games.find((g) => g.id === screen.gameId) : undefined
  const gm = game ? gmOfGame(game) : gmById(gmId)
  const subtitle = game
    ? t('youPlayFor', { name: heroNames(game, lang).short })
    : screen.kind === 'daily' ? t('daily')
      : gm ? t('youPlayFor', { name: gmText(lang, gm.id)!.short }) : t('chooseGmHint')
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
        <span className="pill"><FlameIcon /> {t('points', { n: stats.points })} · <Rich text={t('streak')} vars={{ n: <b>{stats.streak}</b> }} /></span>
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

/** Довантажує партію і запускає гру */
function GameLoader({ meta, ...rest }: { meta: GameMeta; goodMoveCp: number; stats: Stats; setStats: (s: Stats) => void; onExit: () => void }) {
  const t = useT()
  const { game, error } = useGame(meta)
  if (error) return <p>{t('loadError')}: {error}</p>
  if (!game) return <p className="hint">{t('loading')}</p>
  return <GameRun game={game} {...rest} />
}

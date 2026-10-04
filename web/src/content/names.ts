import type { Lang } from '../i18n'
import type { Players } from '../players'
import type { Game } from '../types'
import { GAME_INFO, GAME_ORDER } from './games'
import { gmForPgnName, type GmProfile } from './gms'

// Англійські імена (українські — у data/players.json)
const EN_NAMES: Record<string, string> = {
  'Byrne, Donald': 'Donald Byrne',
  'Fischer, Robert James': 'Bobby Fischer',
  'Kasparov, Gary': 'Garry Kasparov',
  'Topalov, Veselin': 'Veselin Topalov',
  'Karpov, Anatoly': 'Anatoly Karpov',
  'Spassky, Boris V': 'Boris Spassky',
  'Short, Nigel D': 'Nigel Short',
  'Timman, Jan H': 'Jan Timman',
  'Carlsen,M': 'Magnus Carlsen',
  'Karjakin,Sergey': 'Sergey Karjakin',
  'Anand,V': 'Viswanathan Anand',
  'Aronian,L': 'Levon Aronian',
  'Tal, Mihail': 'Mikhail Tal',
  'Larsen, Bent': 'Bent Larsen',
}

export function playerName(pgnName: string, lang: Lang, players: Players): string {
  return lang === 'en' ? EN_NAMES[pgnName] ?? pgnName : players[pgnName]?.name ?? pgnName
}

/** Прізвище для коротких підписів: «Бірн — Фішер» */
export function surname(pgnName: string, lang: Lang, players: Players): string {
  const full = playerName(pgnName, lang, players)
  return full.split(' ').slice(-1)[0]
}

export const heroPgn = (g: Game) => (g.hero === 'white' ? g.white : g.black)
export const gmOfGame = (g: Game) => gmForPgnName(heroPgn(g))

/** Коротке ім'я героя в реченнях: «Що зіграв Каспаров?» */
export function heroShort(g: Game, lang: Lang): string {
  return gmOfGame(g)?.short[lang] ?? g.heroName
}

export function gameTitle(g: Game, lang: Lang): string {
  return GAME_INFO[g.id]?.title[lang] ?? g.title
}

/** «Бірн — Фішер, 1956» */
export function gameLabel(g: Game, lang: Lang, players: Players): string {
  return `${surname(g.white, lang, players)} — ${surname(g.black, lang, players)}, ${g.year}`
}

export const gamesOfGm = (gm: GmProfile, games: Game[]) => games.filter((g) => gm.pgnNames.includes(heroPgn(g)))

/** Партії від найвизначніших; партії обраного гросмейстера — першими */
export function sortGames(games: Game[], gmId: string | null): Game[] {
  const rank = (g: Game) => {
    const i = GAME_ORDER.indexOf(g.id)
    return (i < 0 ? 999 : i) - (gmId && gmOfGame(g)?.id === gmId ? 1000 : 0)
  }
  return [...games].sort((a, b) => rank(a) - rank(b))
}


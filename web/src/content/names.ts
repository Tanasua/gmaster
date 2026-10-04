import type { Lang } from '../i18n'
import { playerInfo, type Players } from '../players'
import type { GameMeta } from '../types'
import { GAME_INFO, GAME_ORDER } from './games'
import { gmById, gmForPgnName, type GmProfile } from './gms'

/** Ім'я з PGN («Kasparov, Gary») → «Garry Kasparov», якщо перекладу немає */
function fromPgn(pgnName: string): string {
  const [last, first] = pgnName.split(',').map((x) => x.trim())
  return first && first.length > 2 ? `${first} ${last}` : last ?? pgnName
}

export function playerName(pgnName: string, lang: Lang, players: Players): string {
  const p = playerInfo(players, pgnName)
  return (lang === 'en' ? p?.nameEn : p?.name) ?? fromPgn(pgnName)
}

/** Прізвище для коротких підписів: «Бірн — Фішер» */
export function surname(pgnName: string, lang: Lang, players: Players): string {
  const full = playerName(pgnName, lang, players)
  return full.split(' ').slice(-1)[0]
}

export const heroPgn = (g: GameMeta) => (g.hero === 'white' ? g.white : g.black)
export const gmOfGame = (g: GameMeta) => gmById(g.gm ?? null) ?? gmForPgnName(heroPgn(g))

/** Коротке ім'я героя в реченнях: «Що зіграв Каспаров?» */
export function heroShort(g: GameMeta, lang: Lang): string {
  return gmOfGame(g)?.short[lang] ?? g.heroName
}

export function gameTitle(g: GameMeta, lang: Lang): string {
  return GAME_INFO[g.id]?.title[lang] ?? autoTitle(g, lang)
}

// Назва з заголовка PGN для партій без ручного опису
const EVENT_KINDS: [RegExp, Record<Lang, string>][] = [
  [/candidat/i, { uk: 'Претенденти', en: 'Candidates' }],
  [/interzonal/i, { uk: 'Міжзональний турнір', en: 'Interzonal' }],
  [/fide.*k\.?o|wch.*k\.?o|fide-wch|wch-fide/i, { uk: 'Чемпіонат світу ФІДЕ', en: 'FIDE World Championship' }],
  [/world ch|\bwch\b|\bwcc\b|braingames|pca-world/i, { uk: 'Чемпіонат світу', en: 'World Championship' }],
  [/olympiad|\bolm\b/i, { uk: 'Шахова олімпіада', en: 'Chess Olympiad' }],
  [/urs-ch/i, { uk: 'Чемпіонат СРСР', en: 'USSR Championship' }],
  [/avro/i, { uk: 'Турнір AVRO', en: 'AVRO tournament' }],
]

function autoTitle(g: GameMeta, lang: Lang): string {
  const kind = EVENT_KINDS.find(([re]) => re.test(g.event))?.[1][lang]
  const place = g.site && g.site !== '?' ? g.site : g.event
  return kind ? `${kind}, ${g.year}` : `${place}, ${g.year}`
}

/** «Бірн — Фішер, 1956» */
export function gameLabel(g: GameMeta, lang: Lang, players: Players): string {
  return `${surname(g.white, lang, players)} — ${surname(g.black, lang, players)}, ${g.year}`
}

export const gamesOfGm = (gm: GmProfile, games: GameMeta[]) => games.filter((g) => gmOfGame(g)?.id === gm.id)

/** Партії від найвизначніших; партії обраного гросмейстера — першими */
export function sortGames(games: GameMeta[], gmId: string | null): GameMeta[] {
  const rank = (g: GameMeta) => {
    const i = GAME_ORDER.indexOf(g.id)
    return (i < 0 ? 999 : i) - (gmId && gmOfGame(g)?.id === gmId ? 1000 : 0)
  }
  return [...games].sort((a, b) => rank(a) - rank(b))
}


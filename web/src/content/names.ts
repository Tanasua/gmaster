import { eventText, gameText, gmText, type Lang } from '../i18n'
import { playerInfo, type Players } from '../players'
import type { GameMeta } from '../types'
import { GAME_ORDER } from './games'
import { gmById, gmForPgnName, type GmProfile } from './gms'

/** Ім'я з PGN («Kasparov, Gary») → «Gary Kasparov», якщо перекладу немає */
function fromPgn(pgnName: string): string {
  const [last, first] = pgnName.split(',').map((x) => x.trim())
  return first && first.length > 2 ? `${first} ${last}` : last ?? pgnName
}

/** Ім'я гравця: для гросмейстерів — з перекладу, для решти — українське або англійське з players.json */
export function playerName(pgnName: string, lang: Lang, players: Players): string {
  const gm = gmForPgnName(pgnName) ?? gmForPgnName(players[pgnName]?.alias ?? '')
  if (gm) return gmText(lang, gm.id)!.name
  const p = playerInfo(players, pgnName)
  return (lang === 'uk' ? p?.name : p?.nameEn) ?? fromPgn(pgnName)
}

/** Прізвище для коротких підписів: «Бірн — Фішер» */
export function surname(pgnName: string, lang: Lang, players: Players): string {
  const gm = gmForPgnName(pgnName) ?? gmForPgnName(players[pgnName]?.alias ?? '')
  if (gm) return gmText(lang, gm.id)!.short
  return playerName(pgnName, lang, players).split(' ').slice(-1)[0]
}

export const heroPgn = (g: GameMeta) => (g.hero === 'white' ? g.white : g.black)
export const gmOfGame = (g: GameMeta) => gmById(g.gm ?? null) ?? gmForPgnName(heroPgn(g))

/** Форми імені героя партії мовою інтерфейсу: short — у реченнях, acc — «грати за …», gen — «партії …» */
export function heroNames(g: GameMeta, lang: Lang): { short: string; acc: string; gen: string; female: boolean } {
  const gm = gmOfGame(g)
  const t = gm && gmText(lang, gm.id)
  return t ? { short: t.short, acc: t.acc, gen: t.gen, female: !!gm.female } : { short: g.heroName, acc: g.heroName, gen: g.heroName, female: false }
}

export function gameTitle(g: GameMeta, lang: Lang): string {
  return gameText(lang, g.id)?.title ?? autoTitle(g, lang)
}

// Назва з заголовка PGN для партій без ручного опису
const EVENT_KINDS: [RegExp, string][] = [
  [/candidat/i, 'candidates'],
  [/interzonal/i, 'interzonal'],
  [/fide.*k\.?o|wch.*k\.?o|fide-wch|wch-fide/i, 'fideWch'],
  [/world ch|\bwch\b|\bwcc\b|braingames|pca-world/i, 'wch'],
  [/olympiad|\bolm\b/i, 'olympiad'],
  [/urs-ch/i, 'ussr'],
  [/avro/i, 'avro'],
]

function autoTitle(g: GameMeta, lang: Lang): string {
  const kind = EVENT_KINDS.find(([re]) => re.test(g.event))?.[1]
  const place = g.site && g.site !== '?' ? g.site : g.event
  return kind ? `${eventText(lang, kind)}, ${g.year}` : `${place}, ${g.year}`
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

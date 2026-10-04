import type { Game, Position } from './types'

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Номер дня від фіксованої дати — однаковий для всіх гравців у той самий календарний день */
export function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(2026, 0, 1)) / 86_400_000)
}

/** Детермінований вибір позиції дня; перемішування кроком, взаємно простим із кількістю позицій */
export function dailyPick(games: Game[], key: string): { game: Game; position: Position; index: number } {
  const all = games.flatMap((game) => game.positions.filter((p) => p.key).map((position) => ({ game, position })))
  const n = all.length
  let step = 7919 % n || 1
  while (gcd(step, n) !== 1) step++
  const index = (((dayNumber(key) * step) % n) + n) % n
  return { ...all[index], index: dayNumber(key) }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

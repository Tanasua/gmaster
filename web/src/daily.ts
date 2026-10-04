import type { GameMeta } from './types'

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

/** Детермінований вибір позиції дня серед ключових позицій усіх партій; крок взаємно простий із їх кількістю */
export function dailyPick(games: GameMeta[], key: string): { meta: GameMeta; ply: number; index: number } {
  const all = games.flatMap((meta) => meta.keys.map((ply) => ({ meta, ply })))
  const n = all.length
  let step = 7919 % n || 1
  while (gcd(step, n) !== 1) step++
  const i = (((dayNumber(key) * step) % n) + n) % n
  return { ...all[i], index: dayNumber(key) }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

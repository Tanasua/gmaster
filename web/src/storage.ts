import type { Verdict } from './types'

// localStorage може бути недоступний (приватний режим, заблоковані дані) — гра працює і без нього.
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export interface HeroStats {
  attempts: number
  exact: number
  good: number
}

export interface Stats {
  points: number
  streak: number
  bestStreak: number
  heroes: Record<string, HeroStats>
  /** дата (YYYY-MM-DD) → результат «Ходу дня» */
  daily: Record<string, Verdict>
}

const STATS_KEY = 'gmaster.stats.v1'
const EMPTY: Stats = { points: 0, streak: 0, bestStreak: 0, heroes: {}, daily: {} }

export function loadStats(): Stats {
  return { ...EMPTY, ...read<Partial<Stats>>(STATS_KEY, {}) }
}

export function recordAttempt(stats: Stats, heroName: string, verdict: Verdict, points: number): Stats {
  const hero = stats.heroes[heroName] ?? { attempts: 0, exact: 0, good: 0 }
  const streak = verdict === 'exact' ? stats.streak + 1 : 0
  const next: Stats = {
    ...stats,
    points: stats.points + points,
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
    heroes: {
      ...stats.heroes,
      [heroName]: {
        attempts: hero.attempts + 1,
        exact: hero.exact + (verdict === 'exact' ? 1 : 0),
        good: hero.good + (verdict === 'good' ? 1 : 0),
      },
    },
  }
  write(STATS_KEY, next)
  return next
}

export function recordDaily(stats: Stats, date: string, verdict: Verdict): Stats {
  const next = { ...stats, daily: { ...stats.daily, [date]: verdict } }
  write(STATS_KEY, next)
  return next
}

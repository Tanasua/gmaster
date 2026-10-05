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

export function resetStats(): Stats {
  write(STATS_KEY, EMPTY)
  return EMPTY
}

export function saveStats(stats: Stats): Stats {
  write(STATS_KEY, stats)
  return stats
}

// Код прогресу: base64 від JSON (UTF-8), щоб перенести прогрес на інший пристрій чи після перевстановлення
export function encodeProgress(data: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify({ v: 1, ...(data as object) }))
  return btoa(String.fromCharCode(...bytes))
}

export function decodeProgress(code: string): { stats: Stats; settings?: unknown } | null {
  try {
    const bin = atob(code.trim().replace(/\s+/g, ''))
    const parsed = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))))
    if (parsed?.v !== 1 || typeof parsed.stats?.points !== 'number') return null
    return { stats: { ...EMPTY, ...parsed.stats }, settings: parsed.settings }
  } catch {
    return null
  }
}

import type { Attempt, Position, Verdict } from './types'

export const BASE_POINTS = 100

export function judge(pos: Position, userMove: string, goodMoveCp: number): { verdict: Verdict; points: number; cpLoss: number } {
  const userCp = pos.evals[userMove]
  // Хід, якого немає в оцінках (не мав би траплятися — рушій оцінює всі легальні), вважаємо промахом
  const cpLoss = userCp === undefined ? Infinity : pos.bestCp - userCp
  if (userMove === pos.gmMove) {
    return { verdict: 'exact', points: BASE_POINTS * pos.difficulty, cpLoss }
  }
  if (cpLoss <= goodMoveCp) {
    return { verdict: 'good', points: (BASE_POINTS / 2) * pos.difficulty, cpLoss }
  }
  return { verdict: 'miss', points: 0, cpLoss }
}

export function formatCp(cp: number): string {
  if (Math.abs(cp) >= 9000) return cp > 0 ? 'мат' : 'отримує мат'
  const p = cp / 100
  return (p > 0 ? '+' : '') + p.toFixed(1)
}

export const VERDICT_EMOJI: Record<Verdict, string> = { exact: '🟩', good: '🟨', miss: '🟥', skip: '⬜' }

/** Користувач не знає, як ходити: показуємо хід без очок */
export const SKIP_ATTEMPT: Attempt = { userMove: '', userSan: '', verdict: 'skip', points: 0, cpLoss: Infinity }

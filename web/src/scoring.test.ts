import { describe, expect, it } from 'vitest'
import { judge } from './scoring'
import { dailyPick } from './daily'
import type { GameMeta, Position } from './types'

const pos: Position = {
  fen: '', ply: 30, moveNumber: 15, lastMove: null,
  gmMove: 'e2e4', gmSan: 'e4', gmLine: [], bestMove: 'd2d4', bestSan: 'd4',
  bestCp: 50, evals: { d2d4: 50, e2e4: 40, g1f3: 25, a2a4: -100 }, difficulty: 2, key: true,
}

describe('judge', () => {
  it('exact GM move scores full points × difficulty', () => {
    expect(judge(pos, 'e2e4', 30)).toMatchObject({ verdict: 'exact', points: 200 })
  })
  it('engine-equivalent move is a good alternative', () => {
    expect(judge(pos, 'd2d4', 30)).toMatchObject({ verdict: 'good', points: 100, cpLoss: 0 })
    expect(judge(pos, 'g1f3', 30)).toMatchObject({ verdict: 'good', cpLoss: 25 })
  })
  it('weak or unknown move is a miss', () => {
    expect(judge(pos, 'a2a4', 30)).toMatchObject({ verdict: 'miss', points: 0, cpLoss: 150 })
    expect(judge(pos, 'h2h4', 30).verdict).toBe('miss')
  })
})

describe('dailyPick', () => {
  const meta = (id: string, keys: number[]) => ({ id, keys }) as unknown as GameMeta

  it('picks only key positions', () => {
    expect(dailyPick([meta('m', [2])], '2026-10-04')).toMatchObject({ ply: 2 })
  })

  it('is deterministic per date and cycles through all positions', () => {
    const games = [meta('g0', [0, 1, 2]), meta('g1', [0, 1, 2, 3, 4])]
    expect(dailyPick(games, '2026-10-04')).toEqual(dailyPick(games, '2026-10-04'))
    const seen = new Set<string>()
    for (let d = 1; d <= 8; d++) {
      const { meta: m, ply } = dailyPick(games, `2026-01-0${d}`)
      seen.add(m.id + ply)
    }
    expect(seen.size).toBe(8)
  })
})

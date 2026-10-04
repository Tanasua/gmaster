import { useEffect, useState } from 'react'
import type { Game, GameMeta } from './types'

// Партії довантажуються по одній і кешуються на час сесії
const cache = new Map<string, Promise<Game>>()

export function loadGame(meta: GameMeta): Promise<Game> {
  let p = cache.get(meta.id)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/games/${meta.id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((g) => ({ ...meta, ...g, gm: meta.gm }) as Game)
    p.catch(() => cache.delete(meta.id))
    cache.set(meta.id, p)
  }
  return p
}

export function useGame(meta: GameMeta | undefined): { game: Game | null; error: string | null } {
  const [state, setState] = useState<{ id: string; game: Game | null; error: string | null } | null>(null)
  useEffect(() => {
    if (!meta) return
    let alive = true
    loadGame(meta)
      .then((game) => alive && setState({ id: meta.id, game, error: null }))
      .catch((e) => alive && setState({ id: meta.id, game: null, error: String(e) }))
    return () => { alive = false }
  }, [meta])
  if (!meta || state?.id !== meta.id) return { game: null, error: null }
  return { game: state.game, error: state.error }
}

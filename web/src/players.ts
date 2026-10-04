import { createContext } from 'react'

export interface PlayerInfo {
  name: string
  nameEn?: string
  /** Інший запис того самого гравця в PGN — дані беруться з нього */
  alias?: string
  photo?: string
  /** Більше фото для сторінки гросмейстера */
  photoLarge?: string
  credit?: string
  source?: string
}

/** Ключ — ім'я гравця з PGN */
export type Players = Record<string, PlayerInfo>

export const PlayersContext = createContext<Players>({})

export function playerInfo(players: Players, pgnName: string): PlayerInfo | undefined {
  const p = players[pgnName]
  return p?.alias ? players[p.alias] : p
}

import { createContext } from 'react'

export interface PlayerInfo {
  name: string
  photo?: string
  /** Більше фото для сторінки гросмейстера */
  photoLarge?: string
  credit?: string
  source?: string
}

/** Ключ — ім'я гравця з PGN */
export type Players = Record<string, PlayerInfo>

export const PlayersContext = createContext<Players>({})

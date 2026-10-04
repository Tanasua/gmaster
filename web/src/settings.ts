import { createContext, useContext } from 'react'
import type { Lang } from './i18n'

export type Theme = 'gold' | 'ivory' | 'emerald' | 'midnight' | 'graphite'
export type Board = 'wood' | 'classic' | 'green' | 'blue' | 'ice' | 'purple' | 'grey' | 'coral' | 'olive' | 'night'
export type Speed = 'slow' | 'normal' | 'fast'

export interface Settings {
  theme: Theme
  board: Board
  lang: Lang
  sound: boolean
  speed: Speed
  showEngine: boolean
  skipOpening: boolean
  /** Обраний гросмейстер (id з content/gms) */
  gmId: string | null
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'gold', board: 'wood', lang: 'uk', sound: true, speed: 'normal', showEngine: true, skipOpening: false, gmId: null,
}

const KEY = 'gmaster.settings.v1'

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

/** Множник пауз автопродовження */
export const SPEED_FACTOR: Record<Speed, number> = { slow: 1.6, normal: 1, fast: 0.55 }

/** Скільки ходів партії (з обох боків) програється автоматично при «Пропускати дебют» */
export const SKIP_OPENING_PLIES = 16
/** Темп автопрогравання дебюту */
export const OPENING_MOVE_MS = 500

/** Кольори дошки: [світле поле, темне поле]. Схожі на популярні теми Lichess / Chess.com */
export const BOARDS: Record<Board, [string, string]> = {
  wood: ['#e2d2b0', '#8a6b4b'],
  classic: ['#f0d9b5', '#b58863'],
  green: ['#eeeed2', '#769656'],
  blue: ['#dee3e6', '#8ca2ad'],
  ice: ['#e5eef3', '#7d9db1'],
  purple: ['#e8e2f0', '#8e77a8'],
  grey: ['#e0e0e0', '#9a9a9a'],
  coral: ['#f2e3d6', '#c27a6b'],
  olive: ['#f2f0d9', '#9a9a5e'],
  night: ['#a8b0bd', '#4b5566'],
}

export const SettingsContext = createContext<Settings>(DEFAULT_SETTINGS)
export const useSettings = () => useContext(SettingsContext)

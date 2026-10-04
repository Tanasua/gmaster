import { createContext, useContext } from 'react'
import type { Lang } from './i18n'

export type Theme = 'gold' | 'ivory' | 'emerald'
export type Speed = 'slow' | 'normal' | 'fast'

export interface Settings {
  theme: Theme
  lang: Lang
  sound: boolean
  speed: Speed
  showEngine: boolean
  skipOpening: boolean
  /** Обраний гросмейстер (id з content/gms) */
  gmId: string | null
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'gold', lang: 'uk', sound: true, speed: 'normal', showEngine: true, skipOpening: false, gmId: null,
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

export const SettingsContext = createContext<Settings>(DEFAULT_SETTINGS)
export const useSettings = () => useContext(SettingsContext)

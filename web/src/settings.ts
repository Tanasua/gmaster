import { createContext, useContext } from 'react'
import type { Lang } from './i18n'

/** 'auto' — мова телефона */
export type LangSetting = Lang | 'auto'

export type Theme = 'gold' | 'ivory' | 'emerald' | 'midnight' | 'graphite'
export type Board = 'wood' | 'classic' | 'green' | 'blue' | 'ice' | 'purple' | 'grey' | 'coral' | 'olive' | 'night'
export type Speed = 'slow' | 'normal' | 'fast'

export interface Settings {
  theme: Theme
  board: Board
  lang: LangSetting
  sound: boolean
  vibration: boolean
  speed: Speed
  showEngine: boolean
  skipOpening: boolean
  /** Обраний гросмейстер (id з content/gms) */
  gmId: string | null
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'gold', board: 'wood', lang: 'auto', sound: true, vibration: true, speed: 'normal', showEngine: true, skipOpening: false, gmId: null,
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
export const SKIP_OPENING_PLIES = 4
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

/** Адреса політики конфіденційності (GitHub Pages репозиторію) */
export const PRIVACY_URL = 'https://tanasua.github.io/gmaster/privacy/'
/** Сторінка застосунку в Google Play */
export const STORE_URL = 'https://play.google.com/store/apps/details?id=com.gmaster.guessthemove'

// Прапорці «один раз»: навчання показано, прохання оцінити — закрито
const FLAGS_KEY = 'gmaster.flags.v1'
export interface Flags { onboarded: boolean; gamesFinished: number; rateDismissed: boolean }
export function loadFlags(): Flags {
  try {
    return { onboarded: false, gamesFinished: 0, rateDismissed: false, ...JSON.parse(localStorage.getItem(FLAGS_KEY) ?? '{}') }
  } catch {
    return { onboarded: false, gamesFinished: 0, rateDismissed: false }
  }
}
export function saveFlags(f: Flags) {
  try {
    localStorage.setItem(FLAGS_KEY, JSON.stringify(f))
  } catch {
    /* ignore */
  }
}

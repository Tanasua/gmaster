import { createContext, useContext } from 'react'
import en from './locales/en.json'

/** Код мови інтерфейсу: 'uk', 'en', 'de', … (файли src/locales/<код>.json) */
export type Lang = string

interface GmText { name: string; short: string; acc: string; gen: string; title: string; bio: string; style: string; strengths: string[] }
interface Locale {
  meta: { name: string }
  ui: Record<string, string>
  events: Record<string, string>
  gms: Record<string, GmText>
  games: Record<string, { title: string; why: string }>
  store: { title: string; short: string; full: string }
}

const files = import.meta.glob<{ default: Locale }>('./locales/*.json', { eager: true })
const LOCALES: Record<string, Locale> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.match(/([\w-]+)\.json$/)![1], mod.default]),
)
const FALLBACK = en as Locale

/** Мови для перемикача: код і власна назва мови */
export const LANGUAGES: { code: Lang; name: string }[] = Object.entries(LOCALES)
  .map(([code, l]) => ({ code, name: l.meta.name }))
  .sort((a, b) => (a.code === 'uk' ? -1 : b.code === 'uk' ? 1 : a.code === 'en' ? -1 : b.code === 'en' ? 1 : a.name.localeCompare(b.name)))

/** Мова телефона/браузера, якщо вона підтримується; інакше англійська */
export function detectLang(): Lang {
  const prefs = typeof navigator !== 'undefined' ? [...(navigator.languages ?? []), navigator.language] : []
  for (const p of prefs) {
    if (!p) continue
    const full = p.toLowerCase()
    const base = full.split('-')[0]
    if (LOCALES[full]) return full
    if (LOCALES[base]) return base
  }
  return 'en'
}

export type StringKey = keyof typeof en.ui
type Vars = Record<string, string | number>

function fill(template: string, vars?: Vars): string {
  return vars ? template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : template
}

export function translate(lang: Lang, key: StringKey, vars?: Vars): string {
  return fill(LOCALES[lang]?.ui[key] ?? FALLBACK.ui[key] ?? key, vars)
}

export const LangContext = createContext<Lang>('en')

export function useLang(): Lang {
  return useContext(LangContext)
}

/** t('key', {name}) → рядок; t.plural('games', n) → «5 партій» за правилами множини мови */
export function useT() {
  const lang = useLang()
  return Object.assign((key: StringKey, vars?: Vars) => translate(lang, key, vars), {
    plural: (base: 'games' | 'moves', n: number) => {
      const cat = new Intl.PluralRules(lang).select(n)
      const ui = LOCALES[lang]?.ui ?? FALLBACK.ui
      const tpl = ui[`${base}_${cat}`] ?? ui[`${base}_other`] ?? FALLBACK.ui[`${base}_other`]
      return fill(tpl, { n })
    },
    /** Жіноча форма ключа (…F), якщо вона є */
    g: (key: StringKey, female: boolean, vars?: Vars) =>
      translate(lang, (female && `${key}F` in FALLBACK.ui ? `${key}F` : key) as StringKey, vars),
  })
}
export type TFn = ReturnType<typeof useT>

/** Текст профілю гросмейстера мовою інтерфейсу (з запасною англійською) */
export function gmText(lang: Lang, id: string): GmText | undefined {
  return LOCALES[lang]?.gms[id] ?? FALLBACK.gms[id]
}

export function gameText(lang: Lang, id: string): { title: string; why: string } | undefined {
  return LOCALES[lang]?.games[id] ?? FALLBACK.games[id]
}

export function eventText(lang: Lang, kind: string): string {
  return LOCALES[lang]?.events[kind] ?? FALLBACK.events[kind] ?? kind
}

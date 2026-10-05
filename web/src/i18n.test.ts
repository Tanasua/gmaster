import { describe, expect, it } from 'vitest'
import en from './locales/en.json'

const files = import.meta.glob<{ default: typeof en }>('./locales/*.json', { eager: true })
const strip = (k: string) => k.replace(/_(zero|one|two|few|many|other)$/, '')
const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',')

describe.each(Object.entries(files))('locale %s', (_path, mod) => {
  const d = mod.default

  it('has every UI key with the same placeholders as English', () => {
    for (const sec of ['ui', 'events', 'store'] as const) {
      for (const [k, v] of Object.entries(en[sec] as Record<string, string>)) {
        const variants = Object.keys(d[sec]).filter((x) => strip(x) === strip(k))
        expect(variants, `${sec}.${k}`).not.toHaveLength(0)
        for (const x of variants) expect(ph((d[sec] as Record<string, string>)[x]), `${sec}.${x}`).toBe(ph(v))
      }
    }
  })

  it('has every grandmaster and game text', () => {
    for (const [id, g] of Object.entries(en.gms)) for (const k of Object.keys(g)) expect(d.gms[id as keyof typeof en.gms], `gms.${id}`).toHaveProperty(k)
    for (const id of Object.keys(en.games)) expect(d.games, 'games').toHaveProperty(id)
  })

  it('has plural forms for all categories of its language', () => {
    const code = _path.match(/([\w-]+)\.json$/)![1]
    for (const cat of new Intl.PluralRules(code).resolvedOptions().pluralCategories) {
      for (const base of ['games', 'moves']) {
        const ui = d.ui as Record<string, string>
        expect(ui[`${base}_${cat}`] ?? ui[`${base}_other`], `${base}_${cat}`).toBeTruthy()
      }
    }
  })

  it('fits Google Play limits', () => {
    expect(d.store.title.length).toBeLessThanOrEqual(30)
    expect(d.store.short.length).toBeLessThanOrEqual(80)
    expect(d.store.full.length).toBeLessThanOrEqual(4000)
  })
})

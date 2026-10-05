// Тексти сторінки в Google Play з src/locales/<мова>.json → store/listings/<мова>.md
// (вставляються в Play Console → Store listing → Manage translations)
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Коди мов Play Console
const PLAY_CODE = { uk: 'uk', en: 'en-US', es: 'es-ES', pt: 'pt-BR', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', pl: 'pl-PL', tr: 'tr-TR',
  nl: 'nl-NL', cs: 'cs-CZ', ro: 'ro', id: 'id', hi: 'hi-IN', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR' }
const out = '../store/listings'
mkdirSync(out, { recursive: true })
const rows = []
for (const f of readdirSync('src/locales').filter((x) => x.endsWith('.json')).sort()) {
  const code = f.replace('.json', '')
  const { meta, store } = JSON.parse(readFileSync(join('src/locales', f), 'utf8'))
  writeFileSync(join(out, `${code}.md`),
    `# ${meta.name} (${PLAY_CODE[code] ?? code})\n\n## Назва (${store.title.length}/30)\n\n${store.title}\n\n## Короткий опис (${store.short.length}/80)\n\n${store.short}\n\n## Повний опис (${store.full.length}/4000)\n\n${store.full}\n`)
  rows.push(`| ${meta.name} | \`${PLAY_CODE[code] ?? code}\` | ${store.title} |`)
}
writeFileSync(join(out, 'README.md'), `# Тексти для Google Play\n\nЗгенеровано з \`web/src/locales/*.json\` скриптом \`web/scripts/store_listings.mjs\`.\n\n| Мова | Код Play Console | Назва |\n|---|---|---|\n${rows.join('\n')}\n`)
console.log(`${rows.length} listings written`)

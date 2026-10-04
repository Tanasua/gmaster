// Збирає dist/ в один HTML-фрагмент для публікації як Claude Artifact:
// CSS і JS вбудовуються інлайн; дані (index.json, players.json, games/*.json) копіюються поруч.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const out = 'dist-artifact'
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const css = readFileSync(join(dist, html.match(/href="\.\/(assets\/[^"]+\.css)"/)[1]), 'utf8')
const js = readFileSync(join(dist, html.match(/src="\.\/(assets\/[^"]+\.js)"/)[1]), 'utf8')
  .replace(/<\/script/gi, '<\\/script')
const title = html.match(/<title>(.*?)<\/title>/)[1]

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'index.html'),
  `<title>${title}</title>\n<style>${css}</style>\n<div id="root"></div>\n<script type="module">${js}</script>\n`)
cpSync(join(dist, 'data'), join(out, 'data'), { recursive: true })
console.log(`${out}/index.html: ${(css.length + js.length) >> 10} KB`)

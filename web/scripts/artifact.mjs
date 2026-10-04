// Збирає dist/ в один HTML-фрагмент для публікації як Claude Artifact:
// CSS і JS вбудовуються інлайн, дані лишаються окремим файлом data/puzzles.json.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const out = 'dist-artifact'
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const css = readFileSync(join(dist, html.match(/href="\.\/(assets\/[^"]+\.css)"/)[1]), 'utf8')
const js = readFileSync(join(dist, html.match(/src="\.\/(assets\/[^"]+\.js)"/)[1]), 'utf8')
  .replace(/<\/script/gi, '<\\/script')
const title = html.match(/<title>(.*?)<\/title>/)[1]

mkdirSync(join(out, 'data'), { recursive: true })
writeFileSync(join(out, 'index.html'),
  `<title>${title}</title>\n<style>${css}</style>\n<div id="root"></div>\n<script type="module">${js}</script>\n`)
copyFileSync(join(dist, 'data', 'puzzles.json'), join(out, 'data', 'puzzles.json'))
console.log(`${out}/index.html: ${(css.length + js.length) >> 10} KB`)

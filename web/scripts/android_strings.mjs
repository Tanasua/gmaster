// Назва застосунку під іконкою мовою телефона: src/locales/<мова>.json → ui.appName
// → android/app/src/main/res/values-<мова>/strings.xml
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const res = 'android/app/src/main/res'
// Коди Android-ресурсів, що відрізняються від BCP 47 (індонезійська історично — «in»)
const ANDROID_CODE = { id: 'in', he: 'iw' }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, "\\'").replace(/"/g, '\\"')

for (const f of readdirSync('src/locales').filter((x) => x.endsWith('.json'))) {
  const code = f.replace('.json', '')
  const { ui } = JSON.parse(readFileSync(join('src/locales', f), 'utf8'))
  const dir = code === 'en' ? 'values' : `values-${ANDROID_CODE[code] ?? code}`
  mkdirSync(join(res, dir), { recursive: true })
  const name = esc(ui.appName)
  const extra = code === 'en' ? '\n    <string name="package_name">com.gmaster.guessthemove</string>\n    <string name="custom_url_scheme">com.gmaster.guessthemove</string>' : ''
  writeFileSync(join(res, dir, 'strings.xml'),
    `<?xml version='1.0' encoding='utf-8'?>\n<resources>\n    <string name="app_name">${name}</string>\n    <string name="title_activity_main">${name}</string>${extra}\n</resources>\n`)
}
console.log('android strings written')

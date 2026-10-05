// Матеріали для Google Play: скриншоти телефона кожною мовою (1080×2160, JPEG, співвідношення 1:2),
// банер 1024×500 кожною мовою та іконка 512×512 → ../store/
// Потрібні: зібраний dist-artifact (npm run artifact) і Playwright з Chromium.
//   PW=$(npm root -g)/playwright node scripts/store_assets.mjs [uk en …]
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { readFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const { chromium } = createRequire(import.meta.url)(process.env.PW ?? 'playwright')
const root = 'dist-artifact'
const out = '../store'
const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2' }
const page0 = readFileSync(join(root, 'index.html'), 'utf8')
const wrapped = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${page0}</body></html>`
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  if (path === '/' || path === '/index.html') return res.end(wrapped)
  const file = join(root, path)
  if (!existsSync(file) || !statSync(file).isFile()) { res.statusCode = 404; return res.end() }
  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('content-type', MIME[extname(file)] ?? 'application/octet-stream')
  res.end(readFileSync(file))
}).listen(0)
const base = `http://localhost:${server.address().port}/`

const all = readdirSync('src/locales').filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
const langs = process.argv.slice(2).length ? process.argv.slice(2) : all
const browser = await chromium.launch()

// Демо-стан: навчання пройдено, обрано Каспарова, трохи статистики
const demo = (lang) => `
  localStorage.setItem('gmaster.flags.v1', JSON.stringify({ onboarded: true, gamesFinished: 1, rateDismissed: true }))
  localStorage.setItem('gmaster.settings.v1', JSON.stringify({ lang: '${lang}', gmId: 'kasparov', sound: false, vibration: false }))
  localStorage.setItem('gmaster.stats.v1', JSON.stringify({ points: 2400, streak: 4, bestStreak: 9, daily: {},
    heroes: { 'Каспаров': { attempts: 40, exact: 23, good: 9 }, 'Фішер': { attempts: 30, exact: 14, good: 8 }, 'Таль': { attempts: 22, exact: 9, good: 5 } } }))`

for (const lang of langs) {
  const dir = join(out, 'screenshots', lang)
  mkdirSync(dir, { recursive: true })
  const ctx = await browser.newContext({ viewport: { width: 360, height: 720 }, deviceScaleFactor: 3, locale: lang })
  await ctx.addInitScript(demo(lang))
  const page = await ctx.newPage()
  const shot = async (n) => { await page.waitForTimeout(500); await page.screenshot({ path: join(dir, `${n}.jpg`), type: 'jpeg', quality: 88 }) }

  await page.goto(base); await page.waitForSelector('.menu-gm')
  await shot('1-menu')
  await page.locator('.menu-gm').click(); await page.waitForSelector('.gm-list')
  await page.locator('.gm-row.selected').click(); await page.waitForSelector('.gm-page')
  await page.locator('.fold').first().locator('summary').click()
  await shot('2-grandmaster')
  await page.locator('.gm-page .games button').first().click(); await page.waitForSelector('.preview')
  await shot('3-preview')
  await page.locator('.preview button.primary').click()
  // кілька ходів: перші два — ходи гросмейстера, третій — пропуск, щоб показати пояснення
  const game = JSON.parse(readFileSync(join(root, 'data', 'games', 'kasparov-topalov-1999.json'), 'utf8'))
  const sq = (s) => page.locator(`[data-square="${s}"]`).first()
  for (let k = 0; k < 6; k++) {
    await page.waitForSelector('.question b', { timeout: 15000 })
    const p = game.positions[k]
    if (k === 5) { await page.locator('button.skip').click(); break }
    await sq(p.gmMove.slice(0, 2)).click(); await sq(p.gmMove.slice(2, 4)).click()
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(1300)
  // для знімка гри — від картки з дошкою, щоб влізли дошка й пояснення ходу
  await page.evaluate(() => window.scrollTo(0, (document.querySelector('.seats .board')?.getBoundingClientRect().top ?? 0) + window.scrollY - 8))
  await shot('4-game')
  await ctx.close()

  // Банер 1024×500
  const fg = await browser.newPage({ viewport: { width: 1024, height: 500 } })
  const loc = JSON.parse(readFileSync(`src/locales/${lang}.json`, 'utf8'))
  const icon = readFileSync('android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png').toString('base64')
  await fg.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'PT Serif'; src: url('${base}assets/${readdirSync(join(root, 'assets')).find((f) => /pt-serif-cyrillic-700/.test(f))}') format('woff2'); unicode-range: U+0400-04FF; font-weight: 700 }
    @font-face { font-family: 'PT Serif'; src: url('${base}assets/${readdirSync(join(root, 'assets')).find((f) => /pt-serif-latin-700/.test(f))}') format('woff2'); font-weight: 700 }
    body { margin: 0; width: 1024px; height: 500px; display: flex; align-items: center; gap: 36px; padding: 0 64px; box-sizing: border-box;
      background: radial-gradient(120% 120% at 15% 20%, #2a2418 0%, #0e0d0b 60%); color: #efe7d8; font-family: 'PT Serif', Georgia, serif; overflow: hidden }
    img { width: 260px; height: 260px; flex: none; filter: drop-shadow(0 18px 40px rgba(0,0,0,.6)) }
    h1 { font-size: 56px; line-height: 1.08; margin: 0 0 18px; text-wrap: balance }
    p { font: 500 24px/1.35 system-ui, sans-serif; color: #c9b98f; margin: 0 }
    .rule { width: 120px; height: 3px; background: linear-gradient(90deg, #f0c878, #d6a24a); margin-bottom: 22px; border-radius: 2px }
  </style></head><body><img src="data:image/png;base64,${icon}"><div><div class="rule"></div><h1>${loc.ui.appTitle}</h1><p>${loc.store.short}</p></div></body></html>`)
  await fg.waitForTimeout(400)
  mkdirSync(join(out, 'feature-graphic'), { recursive: true })
  await fg.screenshot({ path: join(out, 'feature-graphic', `${lang}.jpg`), type: 'jpeg', quality: 92 })
  await fg.close()
  console.log(lang, 'ok')
}

await browser.close()
server.close()

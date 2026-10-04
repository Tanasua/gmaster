import { useState } from 'react'
import { useT, type Lang } from '../i18n'
import { BOARDS, type Board, type Settings, type Speed, type Theme } from '../settings'
import type { StringKey } from '../i18n'

export function SettingsScreen({ settings, onChange, onResetStats }: {
  settings: Settings; onChange: (s: Settings) => void; onResetStats: () => void
}) {
  const t = useT()
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => onChange({ ...settings, [k]: v })

  return (
    <div className="settings">
      <h2 className="screen-title">{t('settings')}</h2>

      <Group label={t('theme')}>
        <div className="swatches">
          {THEMES.map(([id, key, colors]) => (
            <button key={id} className={`swatch ${settings.theme === id ? 'on' : ''}`} aria-pressed={settings.theme === id} onClick={() => set('theme', id)}>
              <span className="swatch-chip theme-chip" style={{ background: colors[0], borderColor: colors[1] }}>
                <i style={{ background: colors[1] }} />
              </span>
              {t(key)}
            </button>
          ))}
        </div>
      </Group>
      <Group label={t('boardColors')}>
        <div className="swatches boards">
          {(Object.keys(BOARDS) as Board[]).map((id) => (
            <button key={id} className={`swatch ${settings.board === id ? 'on' : ''}`} aria-pressed={settings.board === id} onClick={() => set('board', id)}>
              <span className="swatch-chip board-chip" style={{ '--l': BOARDS[id][0], '--d': BOARDS[id][1] } as React.CSSProperties} />
              {t(BOARD_LABEL[id])}
            </button>
          ))}
        </div>
      </Group>
      <Group label={t('language')}>
        <Segment<Lang> value={settings.lang} onChange={(v) => set('lang', v)} options={[['uk', 'Українська'], ['en', 'English']]} />
      </Group>
      <Group label={t('speed')}>
        <Segment<Speed> value={settings.speed} onChange={(v) => set('speed', v)}
          options={[['slow', t('speedSlow')], ['normal', t('speedNormal')], ['fast', t('speedFast')]]} />
      </Group>

      <Toggle id="set-sound" label={t('sound')} value={settings.sound} onChange={(v) => set('sound', v)} />
      <Toggle id="set-engine" label={t('showEngine')} value={settings.showEngine} onChange={(v) => set('showEngine', v)} />
      <Toggle id="set-opening" label={t('skipOpening')} value={settings.skipOpening} onChange={(v) => set('skipOpening', v)} />

      <div className="danger">
        {!confirm && !done && <button className="ghost" onClick={() => setConfirm(true)}>{t('resetStats')}</button>}
        {confirm && (
          <div className="confirm">
            <p>{t('resetConfirm')}</p>
            <div className="row">
              <button className="danger-btn" onClick={() => { onResetStats(); setConfirm(false); setDone(true) }}>{t('yesReset')}</button>
              <button onClick={() => setConfirm(false)}>{t('cancel')}</button>
            </div>
          </div>
        )}
        {done && <p className="small" role="status">{t('statsReset')} ✓</p>}
      </div>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="set-group">
      <span className="set-label">{label}</span>
      {children}
    </div>
  )
}

function Segment<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="segment" role="radiogroup">
      {options.map(([v, label]) => (
        <button key={v} role="radio" aria-checked={v === value} className={v === value ? 'on' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ id, label, value, onChange }: { id: string; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="checkbox" role="switch" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch" aria-hidden />
    </label>
  )
}

/** [тема, назва, [фон, акцент]] — для превʼю */
const THEMES: [Theme, StringKey, [string, string]][] = [
  ['gold', 'themeGold', ['#16140f', '#d6a24a']],
  ['ivory', 'themeIvory', ['#f3eee4', '#a87422']],
  ['emerald', 'themeEmerald', ['#0e1914', '#d3b46a']],
  ['midnight', 'themeMidnight', ['#0f1522', '#7fb2ff']],
  ['graphite', 'themeGraphite', ['#1b1c1e', '#e0e0e0']],
]

const BOARD_LABEL: Record<Board, StringKey> = {
  wood: 'boardWood', classic: 'boardClassic', green: 'boardGreen', blue: 'boardBlue', ice: 'boardIce',
  purple: 'boardPurple', grey: 'boardGrey', coral: 'boardCoral', olive: 'boardOlive', night: 'boardNight',
}

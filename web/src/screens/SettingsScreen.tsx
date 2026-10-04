import { useState } from 'react'
import { useT, type Lang } from '../i18n'
import type { Settings, Speed, Theme } from '../settings'

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
        <Segment<Theme> value={settings.theme} onChange={(v) => set('theme', v)}
          options={[['gold', t('themeGold')], ['ivory', t('themeIvory')], ['emerald', t('themeEmerald')]]} />
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

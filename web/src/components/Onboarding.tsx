import { useState } from 'react'
import { useT, type StringKey } from '../i18n'

const STEPS: [string, StringKey, StringKey][] = [
  ['♚', 'onbTitle1', 'onbText1'],
  ['♞', 'onbTitle2', 'onbText2'],
  ['★', 'onbTitle3', 'onbText3'],
]

/** Коротке навчання при першому запуску (і з налаштувань — «Як грати») */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const t = useT()
  const [i, setI] = useState(0)
  const [icon, title, text] = STEPS[i]
  const last = i === STEPS.length - 1
  return (
    <div className="onb" role="dialog" aria-modal="true" aria-labelledby="onb-title">
      <div className="onb-card">
        <span className="onb-icon" aria-hidden>{icon}</span>
        <h2 id="onb-title" className="onb-title">{t(title)}</h2>
        <p className="onb-text">{t(text)}</p>
        <div className="onb-dots" aria-hidden>
          {STEPS.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}
        </div>
        <div className="onb-actions">
          {!last && <button className="ghost" onClick={onDone}>{t('onbSkip')}</button>}
          <button className="primary" onClick={() => (last ? onDone() : setI(i + 1))}>
            {last ? t('onbStart') : t('onbNext')}
          </button>
        </div>
      </div>
    </div>
  )
}

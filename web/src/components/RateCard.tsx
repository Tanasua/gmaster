import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { useT } from '../i18n'
import { loadFlags, saveFlags, STORE_URL } from '../settings'

/** Після кількох завершених партій — ненав'язливе прохання оцінити гру (лише в Android-застосунку) */
export function RateCard() {
  const t = useT()
  const [show, setShow] = useState(() => {
    const f = loadFlags()
    const next = { ...f, gamesFinished: f.gamesFinished + 1 }
    saveFlags(next)
    return Capacitor.isNativePlatform() && !next.rateDismissed && next.gamesFinished >= 3
  })
  if (!show) return null
  const dismiss = () => {
    saveFlags({ ...loadFlags(), rateDismissed: true })
    setShow(false)
  }
  return (
    <div className="rate-card">
      <p className="rate-title">{t('rateTitle')}</p>
      <p className="small">{t('rateText')}</p>
      <div className="row">
        <a className="button primary" href={STORE_URL} target="_blank" rel="noreferrer" onClick={dismiss}>{t('rateBtn')}</a>
        <button className="ghost" onClick={dismiss}>{t('rateLater')}</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useT } from '../i18n'

export function ShareButton({ text }: { text: string }) {
  const t = useT()
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return // користувач скасував
    }
    // Web Share недоступний або заборонений — копіюємо в буфер, інакше показуємо текст
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('manual')
    }
  }
  return (
    <>
      <button className="primary" onClick={share}>{state === 'copied' ? t('copied') : t('share')}</button>
      {state === 'manual' && <textarea id="share-text" className="share-text" readOnly value={text} onFocus={(e) => e.currentTarget.select()} />}
    </>
  )
}

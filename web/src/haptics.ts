import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

/** Легка вібрація: вгаданий хід — «успіх», інше — короткий дотик */
export function vibrate(kind: 'good' | 'bad' | 'tap') {
  try {
    if (Capacitor.isNativePlatform()) {
      if (kind === 'good') void Haptics.notification({ type: NotificationType.Success })
      else void Haptics.impact({ style: kind === 'bad' ? ImpactStyle.Medium : ImpactStyle.Light })
    } else {
      navigator.vibrate?.(kind === 'good' ? [20, 40, 20] : 15)
    }
  } catch {
    /* вібрація недоступна */
  }
}

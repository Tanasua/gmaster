// Звуки ходів синтезуються Web Audio — без аудіофайлів
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function knock(freq: number, duration: number, gain: number) {
  const a = audio()
  if (!a) return
  const t = a.currentTime
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, t)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + duration)
}

export type SoundKind = 'move' | 'capture' | 'good' | 'bad'

export function playSound(kind: SoundKind) {
  if (kind === 'move') knock(320, 0.09, 0.25)
  else if (kind === 'capture') { knock(220, 0.12, 0.35); knock(440, 0.06, 0.12) }
  else if (kind === 'good') { knock(660, 0.12, 0.18); setTimeout(() => knock(880, 0.16, 0.18), 90) }
  else knock(180, 0.22, 0.22)
}

// Іконки інтерфейсу (inline SVG, кольори через currentColor)
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

export const BackIcon = () => <svg {...base}><path d="M15 5l-7 7 7 7" /></svg>

export const UserIcon = () => (
  <svg {...base} width={18} height={18} fill="currentColor" stroke="none">
    <circle cx="12" cy="8" r="4.2" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
  </svg>
)

export const FlameIcon = () => (
  <svg {...base} width={18} height={18} fill="currentColor" stroke="none">
    <path d="M12 2c1 3.5 5.5 6 5.5 11.2A5.6 5.6 0 0 1 12 19a5.6 5.6 0 0 1-5.5-5.8c0-2.6 1.4-4.3 2.6-5.6.1 1.7.8 2.9 2 3.6C11.4 8.6 11 5.4 12 2zm0 10.5c-1.3 1.3-2 2.3-2 3.4a2 2 0 0 0 4 0c0-1.1-.7-2.1-2-3.4z" />
  </svg>
)

const Crown = () => (
  <svg width="26" height="20" viewBox="0 0 26 20" fill="currentColor" aria-hidden>
    <path d="M2 6l5 4 6-8 6 8 5-4-2 11H4z" /><rect x="4" y="17.5" width="18" height="2" rx="1" />
  </svg>
)

/** Декоративний розділювач: лінія — корона — лінія */
export const Ornament = () => (
  <div className="ornament" aria-hidden><span /><Crown /><span /></div>
)

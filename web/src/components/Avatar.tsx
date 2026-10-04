import { useContext } from 'react'
import { PlayersContext } from '../players'

/** Кругле фото гравця; без фото — ініціали, для прихованого — «?» */
export function Avatar({ pgnName, name, size = 48, large }: { pgnName: string | null; name: string; size?: number; large?: boolean }) {
  const players = useContext(PlayersContext)
  const info = pgnName ? players[pgnName] : undefined
  const src = large ? info?.photoLarge ?? info?.photo : info?.photo
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }} title={info?.credit}>
      {src ? <img src={src} alt={name} /> : <span>{pgnName ? initials(name) : '?'}</span>}
    </div>
  )
}

function initials(name: string): string {
  return name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

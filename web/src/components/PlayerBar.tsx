import { useContext } from 'react'
import type { Game, Side } from '../types'
import { PlayersContext, type PlayerInfo } from '../players'

interface Props {
  info: PlayerInfo | null
  /** Ім'я з PGN, якщо немає перекладу */
  fallbackName: string
  side: Side
  toMove: boolean
  isHero: boolean
  /** Приховати особу («Хід дня» до відповіді) */
  hidden?: boolean
}

export function PlayerBar({ info, fallbackName, side, toMove, isHero, hidden }: Props) {
  const name = hidden ? 'Гросмейстер' : info?.name ?? fallbackName
  return (
    <div className={`player ${toMove ? 'to-move' : ''}`}>
      <div className="avatar" title={hidden ? undefined : info?.credit}>
        {!hidden && info?.photo
          ? <img src={info.photo} alt={name} />
          : <span>{hidden ? '?' : initials(name)}</span>}
      </div>
      <div className="player-text">
        <span className="player-name">{name}</span>
        <span className="player-sub">
          <i className={`side-dot ${side}`} aria-hidden /> {side === 'white' ? 'Білі' : 'Чорні'}
          {isHero && <> · <b>твої фігури</b></>}
        </span>
      </div>
      {toMove && <span className="to-move-tag">хід</span>}
    </div>
  )
}

function initials(name: string): string {
  return name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

/** Дошка між гравцями: суперник зверху, герой знизу */
export function Seats({ game, whiteToMove, hidden, children }: {
  game: Game; whiteToMove: boolean; hidden?: boolean; children: React.ReactNode
}) {
  const players = useContext(PlayersContext)
  const opp: Side = game.hero === 'white' ? 'black' : 'white'
  const seat = (side: Side) => (
    <PlayerBar
      info={players[side === 'white' ? game.white : game.black] ?? null}
      fallbackName={side === 'white' ? game.white : game.black}
      side={side}
      toMove={whiteToMove === (side === 'white')}
      isHero={side === game.hero}
      hidden={hidden}
    />
  )
  return (
    <div className="seats">
      {seat(opp)}
      {children}
      {seat(game.hero)}
    </div>
  )
}

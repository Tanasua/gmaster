import { useContext } from 'react'
import type { Game, Side } from '../types'
import { PlayersContext } from '../players'
import { useLang, useT } from '../i18n'
import { playerName } from '../content/names'
import { Avatar } from './Avatar'

interface Props {
  pgnName: string
  side: Side
  toMove: boolean
  isHero: boolean
  /** Приховати особу («Хід дня» до відповіді) */
  hidden?: boolean
}

export function PlayerBar({ pgnName, side, toMove, isHero, hidden }: Props) {
  const t = useT()
  const lang = useLang()
  const players = useContext(PlayersContext)
  const name = hidden ? t('grandmaster') : playerName(pgnName, lang, players)
  return (
    <div className={`player ${toMove ? 'to-move' : ''}`}>
      <Avatar pgnName={hidden ? null : pgnName} name={name} />
      <div className="player-text">
        <span className="player-name">{name}</span>
        <span className="player-sub">
          <i className={`side-dot ${side}`} aria-hidden /> {side === 'white' ? t('white') : t('black')}
          {isHero && <> · <b>{t('yourPieces')}</b></>}
        </span>
      </div>
      {toMove && <span className="to-move-tag">{t('toMove')}</span>}
    </div>
  )
}

/** Дошка між гравцями: суперник зверху, герой знизу */
export function Seats({ game, whiteToMove, hidden, children }: {
  game: Game; whiteToMove: boolean; hidden?: boolean; children: React.ReactNode
}) {
  const opp: Side = game.hero === 'white' ? 'black' : 'white'
  const seat = (side: Side) => (
    <PlayerBar
      pgnName={side === 'white' ? game.white : game.black}
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

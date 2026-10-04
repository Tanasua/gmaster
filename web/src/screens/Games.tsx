import { useContext } from 'react'
import type { Game } from '../types'
import { useLang, useT } from '../i18n'
import { useSettings } from '../settings'
import { PlayersContext } from '../players'
import { GAME_INFO } from '../content/games'
import { gameLabel, gameTitle, heroPgn, heroShort, playerName, sortGames } from '../content/names'
import { Avatar } from '../components/Avatar'

export function GameList({ games, onOpen }: { games: Game[]; onOpen: (id: string) => void }) {
  const t = useT()
  const lang = useLang()
  const players = useContext(PlayersContext)
  const { gmId } = useSettings()
  return (
    <div className="list-screen">
      <h2 className="screen-title">{t('gamesTitle')}</h2>
      <ul className="games">
        {sortGames(games, gmId).map((g) => (
          <li key={g.id}>
            <button className="game-row" onClick={() => onOpen(g.id)}>
              <span className="game-title">{gameLabel(g, lang, players)}</span>
              <span className="game-meta">{gameTitle(g, lang)}</span>
              <span className="game-meta">{t('youPlayFor')}: <b>{heroShort(g, lang)}</b> · {Math.ceil(g.moves.length / 2)} {t('moves')}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function GamePreview({ game, onStart }: { game: Game; onStart: () => void }) {
  const t = useT()
  const lang = useLang()
  const players = useContext(PlayersContext)
  const info = GAME_INFO[game.id]
  const side = (pgn: string) => (
    <div className="preview-player">
      <Avatar pgnName={pgn} name={playerName(pgn, lang, players)} size={72} />
      <span className="preview-name">{playerName(pgn, lang, players)}</span>
      {pgn === heroPgn(game) && <span className="to-move-tag">{t('yourPieces')}</span>}
    </div>
  )
  return (
    <div className="card preview">
      <div className="preview-vs">
        {side(game.white)}
        <span className="vs">vs</span>
        {side(game.black)}
      </div>
      <h2 className="preview-title">{gameTitle(game, lang)}</h2>
      <p className="gm-meta">{gameLabel(game, lang, players)} · {game.site} · {game.result}</p>
      {info && (
        <>
          <h3 className="sub-title">{t('whyMatters')}</h3>
          <p className="gm-bio">{info.why[lang]}</p>
        </>
      )}
      <p className="small">
        {t('playedBy')} <b>{heroShort(game, lang)}</b> ({game.hero === 'white' ? t('whiteSide') : t('blackSide')}) · {Math.ceil(game.moves.length / 2)} {t('moves')}
      </p>
      <button className="primary wide" onClick={onStart}>{t('startGame')}</button>
    </div>
  )
}

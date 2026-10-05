import { useContext } from 'react'
import type { GameMeta } from '../types'
import { useSettings } from '../settings'
import { PlayersContext } from '../players'
import { gameLabel, gameTitle, heroNames, heroPgn, playerName, sortGames } from '../content/names'
import { gameText, useLang, useT, type Lang, type TFn } from '../i18n'
import { Avatar } from '../components/Avatar'

export function GameList({ games, onOpen }: { games: GameMeta[]; onOpen: (id: string) => void }) {
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
              <span className="game-meta">{t('youPlayFor', { name: heroNames(g, lang).short })} · {t.plural('moves', Math.ceil(g.plies / 2))}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function GamePreview({ game, onStart }: { game: GameMeta; onStart: () => void }) {
  const t = useT()
  const lang = useLang()
  const players = useContext(PlayersContext)
  const info = gameText(lang, game.id)
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
      <h3 className="sub-title">{info ? t('whyMatters') : t('aboutGame')}</h3>
      <p className="gm-bio">{info ? info.why : autoAbout(game, lang, t)}</p>
      <p className="small">
        {t('playedBy', { name: heroNames(game, lang).acc, side: game.hero === 'white' ? t('whiteSide') : t('blackSide'), moves: t.plural('moves', Math.ceil(game.plies / 2)) })}
      </p>
      <button className="primary wide" onClick={onStart}>{t('startGame')}</button>
    </div>
  )
}

/** Опис для партій без ручного тексту — з заголовків PGN */
function autoAbout(g: GameMeta, lang: Lang, t: TFn): string {
  const won = g.result === (g.hero === 'white' ? '1-0' : '0-1')
  const where = [gameTitle(g, lang), g.site && g.site !== '?' ? g.site : null].filter(Boolean).join(' · ')
  return won ? `${t('pathToWin', { name: heroNames(g, lang).gen })} ${where}.` : `${where}.`
}

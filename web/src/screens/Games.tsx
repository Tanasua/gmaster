import { useContext } from 'react'
import type { GameMeta } from '../types'
import { useSettings } from '../settings'
import { PlayersContext } from '../players'
import { GAME_INFO } from '../content/games'
import { gameLabel, gameTitle, gmOfGame, heroPgn, heroShort, playerName, sortGames } from '../content/names'
import { movesWord, useLang, useT, type Lang, type StringKey } from '../i18n'
import type { Players } from '../players'
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
              <span className="game-meta">{t('youPlayFor')}: <b>{heroShort(g, lang)}</b> · {Math.ceil(g.plies / 2)} {movesWord(Math.ceil(g.plies / 2), t)}</span>
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
      <h3 className="sub-title">{info ? t('whyMatters') : t('aboutGame')}</h3>
      <p className="gm-bio">{info ? info.why[lang] : autoAbout(game, lang, players, t)}</p>
      <p className="small">
        {t('playedBy')} <b>{lang === 'uk' ? gmOfGame(game)?.acc.uk ?? heroShort(game, lang) : heroShort(game, lang)}</b> ({game.hero === 'white' ? t('whiteSide') : t('blackSide')}) · {Math.ceil(game.plies / 2)} {movesWord(Math.ceil(game.plies / 2), t)}
      </p>
      <button className="primary wide" onClick={onStart}>{t('startGame')}</button>
    </div>
  )
}

/** Опис для партій без ручного тексту — з заголовків PGN */
function autoAbout(g: GameMeta, lang: Lang, players: Players, t: (k: StringKey) => string): string {
  const gm = gmOfGame(g)
  const who = gm ? (lang === 'uk' ? gm.acc.uk : `${gm.short.en}'s`) : playerName(heroPgn(g), lang, players)
  const won = g.result === (g.hero === 'white' ? '1-0' : '0-1')
  const where = [gameTitle(g, lang), g.site && g.site !== '?' ? g.site : null].filter(Boolean).join(' · ')
  return won ? `${t('pathToWin')} ${who} ${t('pathToWinEnd')}. ${where}.` : `${where}.`
}

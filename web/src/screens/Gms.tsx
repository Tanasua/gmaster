import { useContext } from 'react'
import type { GameMeta } from '../types'
import { gmText, useLang, useT } from '../i18n'
import { useSettings } from '../settings'
import { PlayersContext } from '../players'
import { GMS, type GmProfile } from '../content/gms'
import { gameLabel, gameTitle, gamesOfGm } from '../content/names'
import { Avatar } from '../components/Avatar'

export function GmList({ games, onOpen }: { games: GameMeta[]; onOpen: (id: string) => void }) {
  const t = useT()
  const lang = useLang()
  const { gmId } = useSettings()
  return (
    <div className="list-screen">
      <h2 className="screen-title">{t('gmsTitle')}</h2>
      <ul className="gm-list">
        {GMS.map((gm) => (
          <li key={gm.id}>
            <button className={`gm-row ${gm.id === gmId ? 'selected' : ''}`} onClick={() => onOpen(gm.id)}>
              <Avatar pgnName={gm.pgnNames[0]} name={gmText(lang, gm.id)!.name} size={56} />
              <span className="gm-row-text">
                <span className="gm-row-name">{gmText(lang, gm.id)!.name}</span>
                <span className="gm-row-sub">{gmText(lang, gm.id)!.title} · {t.plural('games', gamesOfGm(gm, games).length)}</span>
              </span>
              {gm.id === gmId ? <span className="to-move-tag">{t('selected')}</span> : <span className="menu-chevron" aria-hidden>›</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function GmPage({ gm, games, onSelect, onOpenGame }: {
  gm: GmProfile; games: GameMeta[]; onSelect: (id: string | null) => void; onOpenGame: (id: string) => void
}) {
  const t = useT()
  const lang = useLang()
  const players = useContext(PlayersContext)
  const { gmId } = useSettings()
  const selected = gmId === gm.id
  const own = gamesOfGm(gm, games)
  const txt = gmText(lang, gm.id)!
  return (
    <div className="gm-page">
      <div className="gm-portrait">
        <Avatar pgnName={gm.pgnNames[0]} name={txt.name} size={168} large />
      </div>
      <h2 className="gm-name">{txt.name}</h2>
      <p className="gm-meta">{txt.title} · {gm.years}</p>
      <p className="gm-bio">{txt.bio}</p>

      {selected ? (
        <div className="row">
          <span className="selected-badge">✓ {t('selected')}</span>
          <button className="ghost" onClick={() => onSelect(null)}>{t('unselect')}</button>
        </div>
      ) : (
        <button className="primary wide" onClick={() => onSelect(gm.id)}>
          {t('playAsBtn', { name: txt.acc })}
        </button>
      )}

      <details className="fold">
        <summary>{t.g('howPlayed', !!gm.female)}</summary>
        <p>{txt.style}</p>
      </details>
      <details className="fold">
        <summary>{t('strengths')}</summary>
        <ul className="strengths">{txt.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
      </details>

      {own.length > 0 && (
        <>
          <h3 className="sub-title">{t('hisGames')}</h3>
          <ul className="games">
            {own.map((g) => (
              <li key={g.id}>
                <button onClick={() => onOpenGame(g.id)}>
                  <span className="game-title">{gameLabel(g, lang, players)}</span>
                  <span className="game-meta">{gameTitle(g, lang)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

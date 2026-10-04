import { useContext } from 'react'
import type { Game } from '../types'
import { useLang, useT } from '../i18n'
import { useSettings } from '../settings'
import { PlayersContext } from '../players'
import { GMS, type GmProfile } from '../content/gms'
import { gameLabel, gameTitle, gamesOfGm } from '../content/names'
import { Avatar } from '../components/Avatar'

export function GmList({ games, onOpen }: { games: Game[]; onOpen: (id: string) => void }) {
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
              <Avatar pgnName={gm.pgnNames[0]} name={gm.name[lang]} size={56} />
              <span className="gm-row-text">
                <span className="gm-row-name">{gm.name[lang]}</span>
                <span className="gm-row-sub">{gm.title[lang]} · {gamesOfGm(gm, games).length} {t('gamesCount')}</span>
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
  gm: GmProfile; games: Game[]; onSelect: (id: string | null) => void; onOpenGame: (id: string) => void
}) {
  const t = useT()
  const lang = useLang()
  const players = useContext(PlayersContext)
  const { gmId } = useSettings()
  const selected = gmId === gm.id
  const own = gamesOfGm(gm, games)
  return (
    <div className="gm-page">
      <div className="gm-portrait">
        <Avatar pgnName={gm.pgnNames[0]} name={gm.name[lang]} size={168} large />
      </div>
      <h2 className="gm-name">{gm.name[lang]}</h2>
      <p className="gm-meta">{gm.title[lang]} · {gm.years}</p>
      <p className="gm-bio">{gm.bio[lang]}</p>

      {selected ? (
        <div className="row">
          <span className="selected-badge">✓ {t('selected')}</span>
          <button className="ghost" onClick={() => onSelect(null)}>{t('unselect')}</button>
        </div>
      ) : (
        <button className="primary wide" onClick={() => onSelect(gm.id)}>
          {t('playAsBtn')} {lang === 'uk' ? gm.acc.uk : gm.short.en}
        </button>
      )}

      <details className="fold">
        <summary>{t('howPlayed')}</summary>
        <p>{gm.style[lang]}</p>
      </details>
      <details className="fold">
        <summary>{t('strengths')}</summary>
        <ul className="strengths">{gm.strengths[lang].map((s) => <li key={s}>{s}</li>)}</ul>
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

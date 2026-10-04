import { useContext } from 'react'
import type { PuzzleData } from '../types'
import type { Stats } from '../storage'
import { VERDICT_EMOJI } from '../scoring'
import { todayKey } from '../daily'
import { useLang, useT } from '../i18n'
import { useSettings } from '../settings'
import { PlayersContext } from '../players'
import { GMS, gmById } from '../content/gms'
import { Avatar } from '../components/Avatar'
import { pct } from '../util'

export type MenuAction = 'gms' | 'random' | 'games' | 'daily' | 'settings'

export function Menu({ data, stats, onAction }: { data: PuzzleData; stats: Stats; onAction: (a: MenuAction) => void }) {
  const t = useT()
  const lang = useLang()
  const { gmId } = useSettings()
  const gm = gmById(gmId)
  const dailyDone = stats.daily[todayKey()]
  const heroes = Object.entries(stats.heroes).sort((a, b) => b[1].attempts - a[1].attempts)

  return (
    <div className="menu">
      <section className="hero-block">
        <h2 className="lead">{t('menuLead')}</h2>
        <p>{t('menuSub')}</p>
      </section>

      {gm ? (
        <button className="menu-gm" onClick={() => onAction('gms')}>
          <Avatar pgnName={gm.pgnNames[0]} name={gm.name[lang]} size={84} large />
          <span className="menu-gm-text">
            <span className="menu-gm-label">{t('youPlayAs')}</span>
            <span className="menu-gm-name">{lang === 'uk' ? gm.acc.uk : gm.name.en}</span>
            <span className="menu-gm-hint">{gm.title[lang]} · {t('tapToChange')}</span>
          </span>
        </button>
      ) : (
        <MenuItem icon="♚" title={t('chooseGm')} hint={t('chooseGmHint')} onClick={() => onAction('gms')} accent />
      )}
      <MenuItem
        icon="⚄"
        title={t('randomGame')}
        hint={gm ? `${t('randomOf')} ${lang === 'uk' ? gm.acc.uk : gm.short.en}` : t('randomAny')}
        onClick={() => onAction('random')}
      />
      <MenuItem icon="♞" title={t('chooseGame')} hint={`${t('chooseGameHint')} · ${data.games.length}`} onClick={() => onAction('games')} />
      <MenuItem icon="☀" title={t('daily')} hint={dailyDone ? `${t('dailyDone')} ${VERDICT_EMOJI[dailyDone]}` : t('dailyHint')} onClick={() => onAction('daily')} />
      <MenuItem icon="⚙" title={t('settings')} hint={t('settingsHint')} onClick={() => onAction('settings')} />

      {heroes.length > 0 && (
        <section className="stats-block">
          <h2>{t('gmIndex')}</h2>
          <table className="gm-index">
            <thead><tr><th>{t('gmCol')}</th><th>{t('guessedCol')}</th><th>{t('strongCol')}</th></tr></thead>
            <tbody>
              {heroes.map(([name, h]) => (
                <tr key={name}>
                  <td>{GMS.find((g) => g.short.uk === name)?.short[lang] ?? name}</td>
                  <td>{pct(h.exact, h.attempts)}%</td>
                  <td>{pct(h.exact + h.good, h.attempts)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small">{t('bestStreak')}: {stats.bestStreak}</p>
        </section>
      )}
      <Credits />
    </div>
  )
}

function MenuItem({ icon, title, hint, onClick, accent }: { icon: string; title: string; hint: string; onClick: () => void; accent?: boolean }) {
  return (
    <button className={`menu-item ${accent ? 'accent' : ''}`} onClick={onClick}>
      <span className="menu-icon" aria-hidden>{icon}</span>
      <span className="menu-text">
        <span className="menu-title">{title}</span>
        <span className="menu-hint">{hint}</span>
      </span>
      <span className="menu-chevron" aria-hidden>›</span>
    </button>
  )
}

/** Підписи до фото (вимога ліцензій CC) */
function Credits() {
  const t = useT()
  const players = useContext(PlayersContext)
  const withPhoto = Object.values(players).filter((p) => p.photo && p.credit)
  if (!withPhoto.length) return null
  return (
    <details className="credits">
      <summary>{t('photoCredits')}</summary>
      {withPhoto.map((p) => (
        <span key={p.name}>{p.name}: <a href={p.source} target="_blank" rel="noreferrer">{p.credit}</a></span>
      ))}
    </details>
  )
}

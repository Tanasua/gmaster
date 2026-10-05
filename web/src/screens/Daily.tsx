import { useContext, useMemo, useState } from 'react'
import { useGame } from '../gameStore'
import type { Attempt, IndexData } from '../types'
import { judge, SKIP_ATTEMPT, VERDICT_EMOJI } from '../scoring'
import { recordAttempt, recordDaily, type Stats } from '../storage'
import { dailyPick, todayKey } from '../daily'
import { PositionCard } from '../components/PositionCard'
import { ShareButton } from '../components/ShareButton'
import { useLang, useT } from '../i18n'
import { Rich } from '../components/Rich'
import { useSettings } from '../settings'
import { playSound } from '../sound'
import { vibrate } from '../haptics'
import { PlayersContext } from '../players'
import { gameLabel, heroNames } from '../content/names'

export function Daily({ data, stats, setStats, onExit }: { data: IndexData; stats: Stats; setStats: (s: Stats) => void; onExit: () => void }) {
  const t = useT()
  const lang = useLang()
  const settings = useSettings()
  const players = useContext(PlayersContext)
  const today = todayKey()
  const { meta, ply, index } = useMemo(() => dailyPick(data.games, today), [data.games, today])
  const { game, error } = useGame(meta)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const prev = stats.daily[today]
  const position = game?.positions.find((p) => p.ply === ply)
  if (error) return <p>{t('loadError')}: {error}</p>
  if (!game || !position) return <p className="hint">{t('loading')}</p>

  function record(a: Attempt) {
    setAttempt(a)
    if (settings.sound) playSound(a.verdict === 'exact' || a.verdict === 'good' ? 'good' : 'bad')
    if (settings.vibration) vibrate(a.verdict === 'exact' ? 'good' : 'bad')
    if (!prev) setStats(recordDaily(recordAttempt(stats, meta.heroName, a.verdict, a.points), today, a.verdict))
  }

  const verdict = attempt?.verdict ?? prev
  const shareText = verdict && `♟ ${t('daily')} #${index} ${VERDICT_EMOJI[verdict]}\n${t('appTitle')}`

  return (
    <PositionCard
      game={game}
      position={position}
      attempt={attempt}
      onMove={(uci, san) => record({ userMove: uci, userSan: san, ...judge(position, uci, data.goodMoveCp) })}
      onSkip={() => record(SKIP_ATTEMPT)}
      hidePlayers={!attempt}
      progress={`${t('dailyProgress', { n: index })}${prev && !attempt ? ` · ${t('dailyDone', { v: VERDICT_EMOJI[prev] })}` : ''}`}
      question={t('whichMove', { move: t(game.hero === 'black' ? 'moveBlack' : 'moveWhite', { n: position.moveNumber }), side: game.hero === 'white' ? t('white') : t('black') })}
      footer={attempt && (
        <div className="row">
          {/* Хто грав — показуємо лише після відповіді */}
          <p className="reveal"><Rich text={t.g('itWas', heroNames(game, lang).female)} vars={{ name: <b>{heroNames(game, lang).short}</b>, label: gameLabel(game, lang, players) }} /></p>
          {shareText && <ShareButton text={shareText} />}
          <button onClick={onExit}>{t('toMenu')}</button>
        </div>
      )}
    />
  )
}

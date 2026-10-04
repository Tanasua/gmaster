import { useContext, useState } from 'react'
import type { Attempt, PuzzleData } from '../types'
import { judge, SKIP_ATTEMPT, VERDICT_EMOJI } from '../scoring'
import { recordAttempt, recordDaily, type Stats } from '../storage'
import { dailyPick, todayKey } from '../daily'
import { PositionCard } from '../components/PositionCard'
import { ShareButton } from '../components/ShareButton'
import { useLang, useT } from '../i18n'
import { useSettings } from '../settings'
import { playSound } from '../sound'
import { PlayersContext } from '../players'
import { gameLabel, heroShort } from '../content/names'

export function Daily({ data, stats, setStats, onExit }: { data: PuzzleData; stats: Stats; setStats: (s: Stats) => void; onExit: () => void }) {
  const t = useT()
  const lang = useLang()
  const settings = useSettings()
  const players = useContext(PlayersContext)
  const today = todayKey()
  const { game, position, index } = dailyPick(data.games, today)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const prev = stats.daily[today]

  function record(a: Attempt) {
    setAttempt(a)
    if (settings.sound) playSound(a.verdict === 'exact' || a.verdict === 'good' ? 'good' : 'bad')
    if (!prev) setStats(recordDaily(recordAttempt(stats, game.heroName, a.verdict, a.points), today, a.verdict))
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
      progress={`${t('daily')} #${index}${prev && !attempt ? ` · ${t('dailyDone')} ${VERDICT_EMOJI[prev]} (${t('noPoints')})` : ''}`}
      question={<>{t('move')} {position.moveNumber}{game.hero === 'black' ? '…' : '.'} {game.hero === 'white' ? t('white') : t('black')}. {t('whichMove')}</>}
      footer={attempt && (
        <div className="row">
          {/* Хто грав — показуємо лише після відповіді */}
          <p className="reveal">{t('itWas')} <b>{heroShort(game, lang)}</b>: {gameLabel(game, lang, players)}</p>
          {shareText && <ShareButton text={shareText} />}
          <button onClick={onExit}>{t('toMenu')}</button>
        </div>
      )}
    />
  )
}

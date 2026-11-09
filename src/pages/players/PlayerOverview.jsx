import { useOutletContext } from 'react-router'
import { Activity, Layers, Swords } from 'lucide-react'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import LeaderAvatar from '../../components/LeaderAvatar.jsx'
import { Bar, Card, Empty, Ring, Skeleton } from '../../components/ui.jsx'

export default function PlayerOverview() {
  const { t } = useI18n()
  const { summary } = useOutletContext()
  const { leaderByKey } = useReferenceData()
  const data = summary.data

  if (summary.loading && !data) {
    return (
      <Card>
        <Skeleton width="40%" /><Skeleton /><Skeleton width="70%" />
      </Card>
    )
  }
  if (!data) return null

  const o = data.overall
  if (o.matches === 0) {
    return <Empty center title={t('players.overview.emptyTitle')}>{t('players.overview.emptyBody')}</Empty>
  }

  return (
    <>
      <div className="grid grid--main">
        <Card eyebrow={t('players.overview.matchmaking')} title={t('players.overview.record')} icon={Activity}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <Ring value={o.winRate} caption={t('common.winRate')} size={132} />
            <div className="grid grid--kpi" style={{ flex: 1, minWidth: 240 }}>
              {[
                ['games', o.matches, ''],
                ['wins', o.wins, 'kpi__value--accent'],
                ['losses', o.losses, ''],
              ].map(([key, value, cls]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="eyebrow">{t(`common.${key}`)}</span>
                  <span className={`kpi__value ${cls}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card eyebrow={t('players.overview.formEyebrow', { n: data.recentForm.length })} title={t('players.overview.form')}>
          {data.recentForm.length === 0 ? (
            <Empty>{t('common.noData')}</Empty>
          ) : (
            <div className="chips" style={{ gap: 6 }}>
              {data.recentForm.map((r, i) => (
                <span key={i} className={`result result--${r}`} title={t(`result.${r}`)}>{r}</span>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid--main">
        <Card eyebrow={t('players.overview.leadersEyebrow')} title={t('players.overview.leaders')} icon={Swords}>
          <div className="rows">
            {data.byLeader.map((line) => {
              const leader = leaderByKey(line.key) ?? { alias: line.name, faction: line.faction }
              return (
                <div key={line.leaderId} className="row" style={{ gridTemplateColumns: '40px minmax(0,1fr) minmax(90px,1.2fr) 56px' }}>
                  <LeaderAvatar leader={leader} size={38} />
                  <div style={{ minWidth: 0 }}>
                    <div className="row__name">{line.alias ?? line.name}</div>
                    <div className="faint" style={{ fontSize: 13 }}>
                      {t('players.overview.gamesLine', { games: line.matches, wins: line.wins, losses: line.losses })}
                    </div>
                  </div>
                  <Bar value={line.winRate} />
                  <span className="row__value">{line.winRate}%</span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card eyebrow={t('players.overview.modesEyebrow')} title={t('players.overview.modes')} icon={Layers}>
          <div className="rows">
            {data.byGameMode.map((m) => (
              <div key={m.gameMode} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                <div>
                  <div className="row__name">{t(`mode.${m.gameMode}`)}</div>
                  <div className="faint" style={{ fontSize: 13 }}>
                    {t('players.overview.gamesLine', { games: m.matches, wins: m.wins, losses: m.losses })}
                  </div>
                </div>
                <span className="row__value">{m.winRate}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

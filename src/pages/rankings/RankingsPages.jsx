import { Outlet } from 'react-router'
import { BarChart3, Crown, Medal, Trophy } from 'lucide-react'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import NeonTabs from '../../components/NeonTabs.jsx'
import { Bar, Card, Empty, Soon } from '../../components/ui.jsx'

export default function RankingsLayout() {
  const { t } = useI18n()
  const tabs = [
    { to: '/rankings/top', label: t('rankings.tab.top'), icon: Crown },
    { to: '/rankings/distribution', label: t('rankings.tab.distribution'), icon: BarChart3 },
    { to: '/rankings/records', label: t('rankings.tab.records'), icon: Medal },
  ]
  return (
    <>
      <NeonTabs items={tabs} label={t('rankings.tabsLabel')} />
      <Outlet />
    </>
  )
}

export function RankingsTop() {
  const { t } = useI18n()
  return (
    <Card eyebrow={t('rankings.top.eyebrow')} title={t('rankings.top.title')} action={<Soon />}>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {['rank', 'player', 'csr', 'winRate', 'games', 'leader'].map((c) => <th key={c}>{t(`rankings.col.${c}`)}</th>)}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((n) => (
              <tr key={n}>
                <td className="faint">{n}</td>
                {Array.from({ length: 5 }, (_, i) => <td key={i} className="faint">—</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="faint" style={{ margin: 0, fontSize: 13 }}>{t('rankings.top.hint')}</p>
    </Card>
  )
}

export function RankingsDistribution() {
  const { t } = useI18n()
  const { csrDesignations } = useReferenceData()
  return (
    <Card eyebrow={t('rankings.distribution.eyebrow')} title={t('rankings.distribution.title')} icon={BarChart3}>
      {csrDesignations.length === 0 ? (
        <Empty title={t('common.noData')}>{t('rankings.distribution.empty')}</Empty>
      ) : (
        <div className="rows">
          {csrDesignations.map((d) => (
            <div key={d.id} className="row" style={{ gridTemplateColumns: 'minmax(90px, 160px) 1fr 60px' }}>
              <span className="row__name">{d.name}</span>
              <Bar value={null} />
              <span className="row__value faint">—</span>
            </div>
          ))}
        </div>
      )}
      <Soon />
    </Card>
  )
}

export function RankingsRecords() {
  const { t } = useI18n()
  const records = ['winStreak', 'mostGames', 'fastestWin', 'longestMatch', 'bestWinRate', 'mostLeaders']
  return (
    <div className="grid grid--3">
      {records.map((key) => (
        <Card key={key} eyebrow={t('rankings.records.eyebrow')} title={t(`rankings.records.${key}`)} icon={Trophy}>
          <span className="kpi__value">—</span>
          <span className="kpi__foot">{t('common.noData')}</span>
        </Card>
      ))}
    </div>
  )
}

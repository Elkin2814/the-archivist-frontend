import { useState } from 'react'
import { useOutletContext } from 'react-router'
import { TrendingDown, TrendingUp, Target } from 'lucide-react'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import LeaderAvatar from '../../components/LeaderAvatar.jsx'
import { Bar, Card, Empty, Soon } from '../../components/ui.jsx'

const MODES = ['all', '1v1', '2v2', '3v3']

/** Rendimiento del líder contra cada rival, filtrable por tamaño de equipo. */
export default function LeaderMatchups() {
  const { t } = useI18n()
  const { leader } = useOutletContext()
  const { leaders } = useReferenceData()
  const [mode, setMode] = useState('all')
  const rivals = leaders.filter((l) => l.key !== leader.key)

  return (
    <>
      <div className="chips" role="group" aria-label={t('common.teamSize')}>
        {MODES.map((m) => (
          <button key={m} type="button" className="chip" aria-pressed={mode === m} onClick={() => setMode(m)}>
            {m === 'all' ? t('common.allModes') : m}
          </button>
        ))}
      </div>

      <div className="grid grid--3">
        <Card eyebrow={t('matchups.strongEyebrow')} title={t('matchups.strong')} icon={TrendingUp}>
          <Empty title={t('common.noData')}>{t('matchups.emptyHint')}</Empty>
        </Card>
        <Card eyebrow={t('matchups.weakEyebrow')} title={t('matchups.weak')} icon={TrendingDown}>
          <Empty title={t('common.noData')}>{t('matchups.emptyHint')}</Empty>
        </Card>
        <Card eyebrow={t('matchups.countersEyebrow')} title={t('matchups.counters')} icon={Target}>
          <div className="rows">
            <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
              <span className="muted">{t('matchups.bestCounter')}</span><span className="faint">—</span>
            </div>
            <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
              <span className="muted">{t('matchups.worstMatchup')}</span><span className="faint">—</span>
            </div>
          </div>
        </Card>
      </div>

      <Card
        eyebrow={mode === 'all' ? t('common.allModes') : mode}
        title={t('matchups.vsEach')}
        action={<Soon />}
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('matchups.col.rival')}</th>
                <th>{t('matchups.col.games')}</th>
                <th style={{ width: '40%' }}>{t('common.winRate')}</th>
              </tr>
            </thead>
            <tbody>
              {rivals.map((rival) => (
                <tr key={rival.key}>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <LeaderAvatar leader={rival} size={32} />
                      <span className="row__name">{rival.alias}</span>
                    </span>
                  </td>
                  <td className="faint">—</td>
                  <td>
                    <span style={{ display: 'grid', gridTemplateColumns: '1fr 52px', gap: 12, alignItems: 'center' }}>
                      <Bar value={null} /><span className="faint" style={{ textAlign: 'right' }}>—</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

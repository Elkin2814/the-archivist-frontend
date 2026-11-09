import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useLeaderLink } from './leaderLink.js'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import LeaderAvatar from '../../components/LeaderAvatar.jsx'
import { ApiErrorAlert, Card, Skeleton } from '../../components/ui.jsx'

const FILTERS = ['ALL', 'UNSC', 'BANISHED']

/** Selector completo de los 16 líderes, filtrable por facción. */
export default function LeaderPicker({ onPick, action }) {
  const { t } = useI18n()
  const { leaders, leadersLoading, leadersError } = useReferenceData()
  const { leaderKey } = useParams()
  const navigate = useNavigate()
  const linkFor = useLeaderLink()
  const [filter, setFilter] = useState('ALL')

  const visible = leaders.filter((l) => filter === 'ALL' || l.faction === filter)

  return (
    <Card
      eyebrow={t('leaders.pickerEyebrow')}
      title={t('leaders.pickerTitle')}
      action={
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="chips" role="group" aria-label={t('leaders.faction')}>
            {FILTERS.map((f) => (
              <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {t(`faction.${f}`)}
              </button>
            ))}
          </div>
          {action}
        </div>
      }
    >
      {leadersError ? (
        <ApiErrorAlert error={leadersError} />
      ) : leadersLoading ? (
        <div className="picker">
          {Array.from({ length: 10 }, (_, i) => <Skeleton key={i} width="64px" />)}
        </div>
      ) : (
        <div className="picker" role="list">
          {visible.map((leader) => {
            const selected = leaderKey?.toUpperCase() === leader.key
            return (
              <button
                key={leader.key}
                type="button"
                role="listitem"
                className="picker__item"
                aria-current={selected}
                onClick={() => {
                  navigate(linkFor(leader))
                  onPick?.()
                }}
              >
                <LeaderAvatar leader={leader} size={62} selected={selected} />
                {leader.alias}
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
}

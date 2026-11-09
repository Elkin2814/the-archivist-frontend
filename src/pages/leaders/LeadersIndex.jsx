import { Link } from 'react-router'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import LeaderAvatar from '../../components/LeaderAvatar.jsx'
import { Card, MoreLabel } from '../../components/ui.jsx'

/** Vista inicial de Líderes: las dos facciones lado a lado. */
export default function LeadersIndex() {
  const { t } = useI18n()
  const { leaders } = useReferenceData()

  return (
    <div className="grid grid--2">
      {['UNSC', 'BANISHED'].map((faction) => (
        <Card key={faction} eyebrow={t('leaders.faction')} title={t(`faction.${faction}`)}>
          <div className="rows">
            {leaders.filter((l) => l.faction === faction).map((leader) => (
              <Link
                key={leader.key}
                to={`/leaders/${leader.key.toLowerCase()}/overview`}
                className="row"
                style={{ gridTemplateColumns: '44px 1fr auto' }}
              >
                <LeaderAvatar leader={leader} size={40} />
                <span>
                  <span className="row__name">{leader.alias}</span>
                  <span className="faint" style={{ display: 'block', fontSize: 13 }}>{leader.name}</span>
                </span>
                <MoreLabel>{t('leaders.viewStats')}</MoreLabel>
              </Link>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

import { useOutletContext } from 'react-router'
import { Crosshair, Gauge, Map as MapIcon, Plane, Shield, Truck, TrendingUp, Users, Zap } from 'lucide-react'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import { Bar, Card, Empty, Ring, Soon } from '../../components/ui.jsx'

/**
 * Vista principal del líder. La estructura está lista; los números llegarán cuando
 * la tabla match_participants tenga suficientes partidas.
 */
export default function LeaderOverview() {
  const { t } = useI18n()
  const { leader } = useOutletContext()
  const { maps } = useReferenceData()

  const kpis = [
    { key: 'pickRate', icon: Users },
    { key: 'difficulty', icon: Gauge },
    { key: 'bestVs', icon: TrendingUp },
    { key: 'worstVs', icon: Shield },
  ]
  const units = [
    { key: 'antiInfantry', icon: Crosshair },
    { key: 'antiVehicle', icon: Truck },
    { key: 'antiAir', icon: Plane },
  ]

  return (
    <>
      <div className="grid grid--main">
        <Card eyebrow={leader.alias} title={t('leaders.overview.performance')} icon={TrendingUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <Ring value={null} caption={t('common.winRate')} size={132} />
            <div className="grid grid--kpi" style={{ flex: 1, minWidth: 260 }}>
              {kpis.map(({ key, icon: Icon }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="eyebrow" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Icon size={14} strokeWidth={1.5} aria-hidden="true" />{t(`leaders.kpi.${key}`)}
                  </span>
                  <span className="kpi__value">—</span>
                </div>
              ))}
            </div>
          </div>
          <Soon />
        </Card>

        <Card eyebrow={t('leaders.overview.unitsEyebrow')} title={t('leaders.overview.units')} icon={Zap}>
          <div className="rows">
            {units.map(({ key, icon: Icon }) => (
              <div key={key} className="row" style={{ gridTemplateColumns: '20px 1fr 52px' }}>
                <Icon size={17} strokeWidth={1.5} className="muted" aria-hidden="true" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="row__name">{t(`units.${key}`)}</span>
                  <Bar value={null} />
                </div>
                <span className="row__value faint">—</span>
              </div>
            ))}
          </div>
          <p className="faint" style={{ margin: 0, fontSize: 13 }}>{t('leaders.overview.unitsHint')}</p>
        </Card>
      </div>

      <div className="grid grid--2">
        <Card eyebrow={t('leaders.overview.mapsEyebrow')} title={t('leaders.overview.maps')} icon={MapIcon}>
          {maps.length === 0 ? (
            <Empty title={t('common.noData')}>{t('leaders.overview.mapsEmpty')}</Empty>
          ) : (
            <div className="rows">
              {maps.slice(0, 8).map((map) => (
                <div key={map.id} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) 120px 52px' }}>
                  <span className="row__name">{map.name}</span>
                  <Bar value={null} />
                  <span className="row__value faint">—</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card eyebrow={t('leaders.overview.powersEyebrow')} title={t('leaders.overview.powers')} icon={Zap}>
          <ol className="rows" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {[1, 2, 3, 4].map((step) => (
              <li key={step} className="row" style={{ gridTemplateColumns: '32px 1fr auto' }}>
                <span className="result result--?">{step}</span>
                <span className="faint">{t('leaders.overview.powerSlot')}</span>
                <span className="faint" style={{ fontSize: 13 }}>{t('leaders.overview.powerLevel')} —</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  )
}

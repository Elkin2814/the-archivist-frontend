import { Outlet } from 'react-router'
import { Crosshair, Layers, Map as MapIcon, Shield } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext.jsx'
import NeonTabs from '../../components/NeonTabs.jsx'
import { Card, Empty } from '../../components/ui.jsx'

export default function StatsLayout() {
  const { t } = useI18n()
  const tabs = [
    { to: '/stats/leaders', label: t('stats.tab.leaders'), icon: Shield },
    { to: '/stats/maps', label: t('stats.tab.maps'), icon: MapIcon },
    { to: '/stats/units', label: t('stats.tab.units'), icon: Crosshair },
    { to: '/stats/modes', label: t('stats.tab.modes'), icon: Layers },
  ]
  return (
    <>
      <NeonTabs items={tabs} label={t('stats.tabsLabel')} />
      <Outlet />
    </>
  )
}

/** Plantilla común: cada subsección declara sus tarjetas previstas. */
function Planned({ section, cards }) {
  const { t } = useI18n()
  return (
    <div className="grid grid--2">
      {cards.map((key) => (
        <Card key={key} eyebrow={t(`stats.${section}.eyebrow`)} title={t(`stats.${section}.${key}`)}>
          <Empty title={t('common.noData')}>{t(`stats.${section}.${key}Hint`)}</Empty>
        </Card>
      ))}
    </div>
  )
}

export const StatsLeaders = () => <Planned section="leaders" cards={['tierList', 'pickRate', 'byRank', 'trend']} />
export const StatsMaps = () => <Planned section="maps" cards={['pool', 'factionBalance', 'duration', 'bestLeaders']} />
export const StatsUnits = () => <Planned section="units" cards={['mostBuilt', 'composition', 'counters', 'efficiency']} />
export const StatsModes = () => <Planned section="modes" cards={['popularity', 'duration', 'teamSize', 'leaders']} />

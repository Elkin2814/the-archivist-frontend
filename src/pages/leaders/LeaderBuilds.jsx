import { Layers, ListOrdered, Spade } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext.jsx'
import { Card, Empty } from '../../components/ui.jsx'

export default function LeaderBuilds() {
  const { t } = useI18n()
  return (
    <div className="grid grid--3">
      <Card eyebrow={t('builds.powersEyebrow')} title={t('builds.powers')} icon={ListOrdered}>
        <Empty title={t('common.noData')}>{t('builds.powersHint')}</Empty>
      </Card>
      <Card eyebrow={t('builds.openingsEyebrow')} title={t('builds.openings')} icon={Layers}>
        <Empty title={t('common.noData')}>{t('builds.openingsHint')}</Empty>
      </Card>
      <Card eyebrow={t('builds.cardsEyebrow')} title={t('builds.cards')} icon={Spade}>
        <Empty title={t('common.noData')}>{t('builds.cardsHint')}</Empty>
      </Card>
    </div>
  )
}

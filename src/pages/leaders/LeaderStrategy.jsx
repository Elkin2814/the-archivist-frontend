import { BookOpen, Map as MapIcon, Swords } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext.jsx'
import { Card, Empty } from '../../components/ui.jsx'

export default function LeaderStrategy() {
  const { t } = useI18n()
  return (
    <div className="grid grid--3">
      <Card eyebrow={t('strategy.gameplanEyebrow')} title={t('strategy.gameplan')} icon={BookOpen}>
        <Empty title={t('common.comingSoon')}>{t('strategy.gameplanHint')}</Empty>
      </Card>
      <Card eyebrow={t('strategy.vsEyebrow')} title={t('strategy.vs')} icon={Swords}>
        <Empty title={t('common.comingSoon')}>{t('strategy.vsHint')}</Empty>
      </Card>
      <Card eyebrow={t('strategy.mapsEyebrow')} title={t('strategy.maps')} icon={MapIcon}>
        <Empty title={t('common.comingSoon')}>{t('strategy.mapsHint')}</Empty>
      </Card>
    </div>
  )
}

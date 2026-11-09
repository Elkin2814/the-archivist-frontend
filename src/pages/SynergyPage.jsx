import { Link2, Users, Map as MapIcon } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Card, Empty, Soon } from '../components/ui.jsx'

export default function SynergyPage() {
  const { t } = useI18n()
  return (
    <>
      <div className="chips"><Soon>{t('synergy.status')}</Soon></div>
      <div className="grid grid--3">
        <Card eyebrow="2v2" title={t('synergy.duos')} icon={Users}>
          <Empty title={t('common.noData')}>{t('synergy.duosHint')}</Empty>
        </Card>
        <Card eyebrow="3v3" title={t('synergy.trios')} icon={Link2}>
          <Empty title={t('common.noData')}>{t('synergy.triosHint')}</Empty>
        </Card>
        <Card eyebrow={t('synergy.mapsEyebrow')} title={t('synergy.maps')} icon={MapIcon}>
          <Empty title={t('common.noData')}>{t('synergy.mapsHint')}</Empty>
        </Card>
      </div>
    </>
  )
}

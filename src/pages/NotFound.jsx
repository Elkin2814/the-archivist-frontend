import { Link } from 'react-router'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Empty } from '../components/ui.jsx'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <Empty center title={t('notFound.title')}>
      <Link to="/" className="btn" style={{ marginTop: 8 }}>{t('notFound.back')}</Link>
    </Empty>
  )
}

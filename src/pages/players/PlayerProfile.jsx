import { Outlet, useParams } from 'react-router'
import { History, LayoutDashboard, Medal, RefreshCw } from 'lucide-react'
import { api } from '../../api/client.js'
import { useApi } from '../../api/useApi.js'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import NeonTabs from '../../components/NeonTabs.jsx'
import { ApiErrorAlert, Card, Skeleton } from '../../components/ui.jsx'
import { formatAgo, formatCsr } from './format.js'

/** Perfil de un jugador: encabezado + pestañas Resumen / Historial. */
export default function PlayerProfile() {
  const { t, lang } = useI18n()
  const { gamertag } = useParams()
  const { csrName } = useReferenceData()
  const summary = useApi((opts) => api.playerSummary(gamertag, lang, opts), [gamertag, lang])

  const base = `/players/${encodeURIComponent(gamertag)}`
  const tabs = [
    { to: `${base}/overview`, label: t('players.tab.overview'), icon: LayoutDashboard },
    { to: `${base}/history`, label: t('players.tab.history'), icon: History },
  ]

  const data = summary.data
  const csr = data ? formatCsr(data.currentCsr, csrName) : null

  return (
    <>
      <NeonTabs items={tabs} label={t('players.tabsLabel')} />

      <Card className="card--flat" style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <span className="avatar" style={{ width: 64, height: 64, fontSize: 22, borderColor: 'var(--lime)' }} aria-hidden="true">
          {gamertag.slice(0, 2).toUpperCase()}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 220px' }}>
          <span className="eyebrow">{t('players.profile.eyebrow')}</span>
          <h2 style={{ fontSize: 30, fontWeight: 600 }}>{data?.gamerTag ?? gamertag}</h2>
          <span className="faint" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} strokeWidth={1.5} aria-hidden="true" />
            {summary.loading ? t('players.profile.syncing') : `${t('players.profile.lastSync')} ${formatAgo(data?.lastSync, lang)}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: '1px solid var(--line)', borderRadius: 12 }}>
          <Medal size={22} strokeWidth={1.5} className="muted" aria-hidden="true" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow">{t('players.profile.csr')}</span>
            <span style={{ font: '600 18px var(--font-head)', letterSpacing: '.05em' }}>
              {summary.loading ? <Skeleton width="80px" /> : csr ?? t('players.profile.unranked')}
            </span>
          </div>
        </div>
      </Card>

      {summary.error ? <ApiErrorAlert error={summary.error} /> : <Outlet context={{ summary, gamertag }} />}
    </>
  )
}

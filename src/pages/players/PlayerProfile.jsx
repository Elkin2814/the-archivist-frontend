import { useMemo } from 'react'
import { Outlet, useParams, useSearchParams } from 'react-router'
import { History, LayoutDashboard, Medal, RefreshCw } from 'lucide-react'
import { api } from '../../api/client.js'
import { useApi } from '../../api/useApi.js'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import NeonTabs from '../../components/NeonTabs.jsx'
import ModeSelect from '../../components/ModeSelect.jsx'
import { ApiErrorAlert, Card, Skeleton } from '../../components/ui.jsx'
import PlayerFinder from './PlayerFinder.jsx'
import { formatAgo, formatCsr } from './format.js'
import { buildQueues, queueTotals } from './queues.js'

/** Perfil de un jugador: encabezado, filtro de modo, buscador y pestañas Resumen / Historial. */
export default function PlayerProfile() {
  const { t, lang } = useI18n()
  const { gamertag } = useParams()
  const { csrName, playlists } = useReferenceData()
  const [searchParams, setSearchParams] = useSearchParams()

  // Colas del juego (lista de juego) que existen en la metadata; cada una agrupa todas sus versiones (UUID).
  const queues = useMemo(() => buildQueues(playlists, lang), [playlists, lang])

  // El modo elegido vive en la URL (?mode=RANKED_3V3_WAR): las dos pestañas lo comparten y el enlace se puede compartir.
  const modeKey = searchParams.get('mode')
  const queue = queues.find((q) => q.key === modeKey) ?? null
  // Los UUID de la cola viajan juntos ("a,b,c"); el backend los recibe como una lista.
  const playlistId = queue ? queue.ids.join(',') : null

  const summary = useApi((opts) => api.playerSummary(gamertag, lang, playlistId, opts), [gamertag, lang, playlistId])

  // Al cambiar de modo se sigue mostrando lo anterior (atenuado) en vez de vaciar la pantalla.
  const previous = summary.previous
  const samePlayer = previous?.gamerTag?.toLowerCase() === gamertag.toLowerCase()
  const data = summary.data ?? (samePlayer ? previous : null)
  const refreshing = summary.loading && data !== null

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const base = `/players/${encodeURIComponent(gamertag)}`
  const tabs = [
    { to: `${base}/overview${suffix}`, label: t('players.tab.overview'), icon: LayoutDashboard },
    { to: `${base}/history${suffix}`, label: t('players.tab.history'), icon: History },
  ]

  const csr = data ? formatCsr(data.currentCsr, csrName) : null

  // Opciones en el orden de la lista del juego; las que el jugador no ha jugado salen atenuadas.
  const options = useMemo(
    () =>
      queues.map((q) => {
        const { matches } = queueTotals(q, data?.byPlaylist)
        return {
          id: q.key,
          name: q.name,
          hint: matches > 0 ? t('players.mode.count', { n: matches }) : t('players.mode.none'),
          dim: matches === 0,
        }
      }),
    [queues, data, t],
  )

  const setMode = (key) => {
    const next = new URLSearchParams(searchParams)
    if (key) next.set('mode', key)
    else next.delete('mode')
    setSearchParams(next, { replace: true })
  }

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
            {!data && summary.loading ? t('players.profile.syncing') : `${t('players.profile.lastSync')} ${formatAgo(data?.lastSync, lang)}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: '1px solid var(--line)', borderRadius: 12 }}>
          <Medal size={22} strokeWidth={1.5} className="muted" aria-hidden="true" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow">{t('players.profile.csr')}</span>
            <span style={{ font: '600 18px var(--font-head)', letterSpacing: '.05em' }}>
              {!data && summary.loading ? <Skeleton width="80px" /> : csr ?? t('players.profile.unranked')}
            </span>
          </div>
        </div>
      </Card>

      <div className="toolbar">
        <ModeSelect
          label={t('players.mode.label')}
          allLabel={t('players.mode.all')}
          options={options}
          value={queue?.key ?? null}
          onChange={setMode}
          disabled={!data}
        />
        <PlayerFinder />
      </div>

      {summary.error ? (
        <ApiErrorAlert error={summary.error} />
      ) : (
        <Outlet context={{ summary: { ...summary, data }, refreshing, gamertag, playlistId }} />
      )}
    </>
  )
}

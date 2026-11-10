import { useState } from 'react'
import { useOutletContext } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../../api/client.js'
import { useApi } from '../../api/useApi.js'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import LeaderAvatar from '../../components/LeaderAvatar.jsx'
import { ApiErrorAlert, Card, Empty, Skeleton } from '../../components/ui.jsx'
import { formatCsr, formatDate, formatDuration, resultLetter } from './format.js'

const PAGE_SIZE = 20

export default function PlayerHistory() {
  const { t, lang } = useI18n()
  const { gamertag, playlistId } = useOutletContext()
  const { leaderByApiId, mapName, csrName } = useReferenceData()
  // La página vale solo para el jugador y el modo con los que se eligió; al cambiarlos se vuelve a la primera.
  const scope = `${gamertag.toLowerCase()}|${playlistId ?? ''}`
  const [pageState, setPageState] = useState({ scope, page: 0 })
  const page = pageState.scope === scope ? pageState.page : 0
  const setPage = (update) => setPageState({ scope, page: typeof update === 'function' ? update(page) : update })
  const history = useApi((opts) => api.playerHistory(gamertag, page, PAGE_SIZE, playlistId, opts), [gamertag, page, playlistId])

  if (history.error) return <ApiErrorAlert error={history.error} />

  // Mientras carga otra página se mantiene la anterior (atenuada) para que la tabla no salte.
  const data = history.data ?? history.previous
  const pagination = data?.pagination

  return (
    <Card
      eyebrow={data ? t('history.total', { n: data.pagination.totalElements }) : t('history.eyebrow')}
      title={t('history.title')}
      action={
        pagination && pagination.totalPages > 1 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" className="btn" style={{ width: 40, padding: 0 }} aria-label={t('history.prev')}
              disabled={page === 0 || history.loading} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <span className="muted" style={{ fontSize: 13 }}>
              {t('history.page', { page: page + 1, total: pagination.totalPages })}
            </span>
            <button type="button" className="btn" style={{ width: 40, padding: 0 }} aria-label={t('history.next')}
              disabled={page + 1 >= pagination.totalPages || history.loading} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        )
      }
    >
      {!data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)}
        </div>
      ) : data.matches.length === 0 ? (
        <Empty center title={t('history.emptyTitle')}>{t('history.emptyBody')}</Empty>
      ) : (
        <div className="table-wrap" style={{ opacity: history.loading ? 0.5 : 1, transition: 'opacity .2s' }}>
          <table className="table">
            <thead>
              <tr>
                <th>{t('history.col.result')}</th>
                <th>{t('history.col.leader')}</th>
                <th>{t('history.col.map')}</th>
                <th>{t('history.col.mode')}</th>
                <th>{t('history.col.type')}</th>
                <th>{t('history.col.duration')}</th>
                <th>{t('history.col.csr')}</th>
                <th>{t('history.col.date')}</th>
              </tr>
            </thead>
            <tbody>
              {data.matches.map((m) => {
                const letter = resultLetter(m.result)
                const leader = leaderByApiId(m.leaderId)
                const csr = formatCsr(m.csrAfter, csrName)
                return (
                  <tr key={m.matchId}>
                    <td><span className={`result result--${letter}`} title={t(`result.${letter}`)}>{letter}</span></td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <LeaderAvatar leader={leader ?? { alias: `#${m.leaderId}` }} size={30} />
                        <span className="row__name">{leader?.alias ?? t('history.unknownLeader', { id: m.leaderId })}</span>
                      </span>
                    </td>
                    <td className="muted">{mapName(m.map) ?? t('history.unknownMap')}</td>
                    <td>{t(`mode.${m.gameMode}`)}</td>
                    <td className="muted">{t(`matchType.${m.matchType}`)}</td>
                    <td className="muted">{formatDuration(m.durationSeconds)}</td>
                    <td>{csr ?? <span className="faint">—</span>}</td>
                    <td className="muted">{formatDate(m.date, lang)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

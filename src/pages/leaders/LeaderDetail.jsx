import { useState } from 'react'
import { Link, Outlet, useParams } from 'react-router'
import { BookOpen, ChevronDown, LayoutDashboard, Layers, Swords } from 'lucide-react'
import { useReferenceData } from '../../api/ReferenceDataContext.jsx'
import { useI18n } from '../../i18n/I18nContext.jsx'
import LeaderAvatar, { LeaderPortrait } from '../../components/LeaderAvatar.jsx'
import NeonTabs from '../../components/NeonTabs.jsx'
import { Empty } from '../../components/ui.jsx'
import LeaderPicker from './LeaderPicker.jsx'
import { useLeaderLink } from './leaderLink.js'

/**
 * Página del líder, de arriba abajo:
 * 1. Pestañas Overview / Matchups / Builds / Strategy (a todo el ancho).
 * 2. Encabezado del líder con su retrato y el selector encogido ("fantasma").
 * 3. Selector completo, solo si se pide "Cambiar líder".
 * 4. Tablero de la pestaña.
 */
export default function LeaderDetail() {
  const { t } = useI18n()
  const { leaderKey } = useParams()
  const { leaders, leaderByKey, leadersLoading } = useReferenceData()
  const linkFor = useLeaderLink()
  const [pickerOpen, setPickerOpen] = useState(false)
  const leader = leaderByKey(leaderKey?.toUpperCase())

  if (!leader) {
    return leadersLoading ? null : <Empty center title={t('leaders.notFound')} />
  }

  const base = `/leaders/${leaderKey}`
  const tabs = [
    { to: `${base}/overview`, label: t('leaders.tab.overview'), icon: LayoutDashboard },
    { to: `${base}/matchups`, label: t('leaders.tab.matchups'), icon: Swords },
    { to: `${base}/builds`, label: t('leaders.tab.builds'), icon: Layers },
    { to: `${base}/strategy`, label: t('leaders.tab.strategy'), icon: BookOpen },
  ]

  return (
    <>
      <NeonTabs items={tabs} label={t('leaders.tabsLabel')} />

      <section className={`card leader-banner leader-banner--${leader.faction}`}>
        <div className="leader-banner__body">
          <div className="leader-banner__id">
            <LeaderAvatar leader={leader} size={88} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <span className="eyebrow">{t(`faction.${leader.faction}`)}</span>
              <h2 className="leader-banner__name">{leader.name}</h2>
              <div className="chips">
                <span className="chip">{t('leaders.alias')}: {leader.alias}</span>
                {leader.apiId == null && <span className="soon">{t('leaders.idPending')}</span>}
              </div>
            </div>
          </div>

          <div className="leader-strip">
            <div className="leader-strip__ghosts" role="list" aria-label={t('leaders.pickerTitle')}>
              {leaders.map((l) => (
                <Link
                  key={l.key}
                  to={linkFor(l)}
                  role="listitem"
                  className="leader-strip__item"
                  aria-current={l.key === leader.key}
                  title={l.alias}
                >
                  <LeaderAvatar leader={l} size={34} />
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="btn leader-strip__more"
              aria-expanded={pickerOpen}
              onClick={() => setPickerOpen((open) => !open)}
            >
              {t(pickerOpen ? 'leaders.hidePicker' : 'leaders.change')}
              <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
        <LeaderPortrait leader={leader} />
      </section>

      <div className={`reveal ${pickerOpen ? 'reveal--open' : ''}`} inert={!pickerOpen}>
        <div>
          <LeaderPicker onPick={() => setPickerOpen(false)} />
        </div>
      </div>

      <Outlet context={{ leader }} />
    </>
  )
}

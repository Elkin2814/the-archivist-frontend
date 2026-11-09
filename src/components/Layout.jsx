import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'
import { SECTIONS, hasTabs, sectionFor } from './nav.js'
import { FrameTabsContext } from './frameContext.js'
import { BRAND_LOGO, BRAND_NAME } from './brand.js'

const STORAGE_KEY = 'archivist.sidebar.collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function LanguageToggle({ compact }) {
  const { lang, setLang, t } = useI18n()
  if (compact) {
    const next = lang === 'es' ? 'en' : 'es'
    return (
      <button type="button" className="lang-mini" onClick={() => setLang(next)} aria-label={t('common.language')} title={next.toUpperCase()}>
        {lang.toUpperCase()}
      </button>
    )
  }
  return (
    <div className="lang-toggle" role="group" aria-label={t('common.language')}>
      {['es', 'en'].map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

/**
 * Menú lateral "Glassy": panel de vidrio flotante que se puede retraer.
 * Expandido: ícono + texto, con una píldora gelatinosa que sigue al cursor.
 * Retraído: solo íconos que crecen al pasar el cursor y muestran su nombre a la derecha.
 */
function Sidebar({ collapsed, onToggle }) {
  const { t } = useI18n()
  const [hover, setHover] = useState(null)

  const groups = [
    { key: 'main', items: SECTIONS.filter((s) => s.group === 'main') },
    { key: 'analysis', items: SECTIONS.filter((s) => s.group === 'analysis') },
  ]

  const follow = (event) => {
    const el = event.currentTarget
    // Alterna la clase para que la animación gelatinosa se repita en cada ítem.
    setHover((prev) => ({ top: el.offsetTop, height: el.offsetHeight, beat: prev?.beat ? 0 : 1 }))
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="brand-row">
        <NavLink to="/" className="brand" aria-label={BRAND_NAME}>
          <img className="brand__logo" src={BRAND_LOGO} alt="" width="66" height="66" />
          <span className="brand__text">
            <span className="brand__name">{BRAND_NAME}</span>
            <span className="brand__sub">Halo Wars 2</span>
          </span>
        </NavLink>
        <button
          type="button"
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={t(collapsed ? 'nav.expand' : 'nav.collapse')}
          aria-expanded={!collapsed}
        >
          <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <nav className="nav-groups" aria-label={t('nav.label')} onMouseLeave={() => setHover(null)}>
        <span
          className={`nav-hover ${hover ? `nav-hover--on nav-hover--b${hover.beat}` : ''}`}
          style={hover ? { top: hover.top, height: hover.height } : undefined}
          aria-hidden="true"
        />
        {groups.map((group) => (
          <div key={group.key} className="nav-group">
            <span className="nav-group__title">{t(`nav.group.${group.key}`)}</span>
            {group.items.map(({ key, path, icon: Icon, end, badge }) => (
              <NavLink
                key={key}
                to={path}
                end={end}
                className="nav-link"
                onMouseEnter={follow}
                onFocus={follow}
                aria-label={collapsed ? t(`nav.${key}`) : undefined}
              >
                <span className="nav-link__icon">
                  <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                  {badge && <span className="nav-link__dot" aria-hidden="true" />}
                </span>
                <span className="nav-link__label">{t(`nav.${key}`)}</span>
                {badge && <span className="nav-link__badge">{badge}</span>}
                <span className="nav-tip" aria-hidden="true">{t(`nav.${key}`)}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <LanguageToggle compact={collapsed} />
        <p className="legal">{t('legal.notice')}</p>
      </div>
    </aside>
  )
}

export default function Layout() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const current = sectionFor(pathname)
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [tabsSlot, setTabsSlot] = useState(null)
  const framed = hasTabs(pathname)

  const toggle = () => {
    setCollapsed((value) => {
      try {
        localStorage.setItem(STORAGE_KEY, value ? '0' : '1')
      } catch {
        /* sin almacenamiento: solo dura la sesión */
      }
      return !value
    })
  }

  const titles = (
    <div className="titles">
      <h1>{t(`nav.${current.key}`)}</h1>
      <p>{t(`section.${current.key}.subtitle`)}</p>
    </div>
  )

  return (
    <div className={`shell ${collapsed ? 'shell--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <div className="main">
        {framed ? (
          // Secciones con pestañas: un marco que lo envuelve todo. Arriba van las pestañas y,
          // a la derecha, el espacio para botones globales (ajustes, perfil...); debajo, el título.
          <main className="content">
            <section className="frame">
              <header className="frame__head">
                <div className="frame__tabs" ref={setTabsSlot} />
                <div className="frame__actions" id="frame-actions" />
              </header>
              {titles}
              <FrameTabsContext.Provider value={tabsSlot}>
                <div className="frame__body">
                  <Outlet />
                </div>
              </FrameTabsContext.Provider>
            </section>
          </main>
        ) : (
          <>
            <header className="topbar">{titles}</header>
            <main className="content">
              <Outlet />
            </main>
          </>
        )}
      </div>
    </div>
  )
}

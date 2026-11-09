import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Activity, Crown, Flame, Link2, Map as MapIcon, Medal, Search, Swords, TrendingUp } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Card, Empty, MoreLink, Soon } from '../components/ui.jsx'
import { pushRecent } from './players/recent.js'

/** Inicio: búsqueda rápida y el panorama general del meta (por ahora con estados vacíos). */
export default function HomePage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  const sections = [
    { key: 'mostPlayed', icon: Flame, to: '/stats/leaders' },
    { key: 'topWinRate', icon: TrendingUp, to: '/stats/leaders' },
    { key: 'compositions', icon: Link2, to: '/synergy' },
    { key: 'maps', icon: MapIcon, to: '/stats/maps' },
    { key: 'topPlayers', icon: Crown, to: '/rankings/top' },
    { key: 'activity', icon: Activity, to: '/players' },
  ]

  return (
    <>
      <section className="hero">
        <span className="eyebrow">{t('home.eyebrow')}</span>
        <h2>{t('home.title')}</h2>
        <p>{t('home.body')}</p>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const clean = value.trim()
            if (!clean) return
            pushRecent(clean)
            navigate(`/players/${encodeURIComponent(clean)}/overview`)
          }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 640 }}
        >
          <label htmlFor="home-search" className="sr-only">{t('players.search.label')}</label>
          <div className="search" style={{ flex: '1 1 280px' }}>
            <Search size={17} strokeWidth={1.5} aria-hidden="true" />
            <input id="home-search" value={value} maxLength={16} placeholder={t('players.search.placeholder')}
              onChange={(e) => setValue(e.target.value)} />
          </div>
          <button type="submit" className="btn btn--primary">{t('players.search.submit')}</button>
        </form>
      </section>

      <div className="grid grid--kpi">
        {['matches', 'players', 'leaders', 'updated'].map((key) => (
          <Card key={key} className="card--flat" eyebrow={t(`home.kpi.${key}`)}>
            <span className="kpi__value">{key === 'leaders' ? 16 : '—'}</span>
            <span className="kpi__foot">{t(`home.kpi.${key}Foot`)}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid--3">
        {sections.map(({ key, icon, to }) => (
          <Card key={key} eyebrow={t(`home.${key}.eyebrow`)} title={t(`home.${key}.title`)} icon={icon}>
            <Empty>{t(`home.${key}.hint`)}</Empty>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Soon />
              <MoreLink to={to}>{t('common.seeMore')}</MoreLink>
            </div>
          </Card>
        ))}
      </div>

      <Card className="card--flat" eyebrow={t('home.news.eyebrow')} title={t('home.news.title')} icon={Medal}>
        <Empty>{t('home.news.hint')}</Empty>
      </Card>

      <Card className="card--flat" eyebrow={t('home.leaders.eyebrow')} title={t('home.leaders.title')} icon={Swords}>
        <p className="muted" style={{ margin: 0 }}>{t('home.leaders.body')}</p>
        <Link to="/leaders" className="btn" style={{ alignSelf: 'flex-start' }}>{t('home.leaders.cta')}</Link>
      </Card>
    </>
  )
}

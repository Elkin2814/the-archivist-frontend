import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Clock, Search, Trophy, History, Swords } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext.jsx'
import { Card } from '../../components/ui.jsx'
import { GAMERTAG_RE as GAMERTAG, pushRecent, readRecent } from './recent.js'

export default function PlayersSearch() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [recent] = useState(readRecent)

  const go = (gamertag) => {
    const clean = gamertag.trim().replace(/\s+/g, ' ')
    if (!GAMERTAG.test(clean)) {
      setInvalid(true)
      return
    }
    pushRecent(clean)
    navigate(`/players/${encodeURIComponent(clean)}/overview`)
  }

  return (
    <>
      <section className="hero">
        <span className="eyebrow">{t('players.search.eyebrow')}</span>
        <h2>{t('players.search.title')}</h2>
        <p>{t('players.search.body')}</p>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            go(value)
          }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 720 }}
        >
          <label htmlFor="gamertag" className="sr-only">{t('players.search.label')}</label>
          <div className="search search--lg" style={{ flex: '1 1 320px' }}>
            <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            <input
              id="gamertag"
              value={value}
              maxLength={16}
              autoComplete="off"
              placeholder={t('players.search.placeholder')}
              aria-invalid={invalid}
              aria-describedby={invalid ? 'gamertag-error' : undefined}
              onChange={(e) => {
                setValue(e.target.value)
                setInvalid(false)
              }}
            />
          </div>
          <button type="submit" className="btn btn--primary" style={{ height: 56, padding: '0 28px' }}>
            {t('players.search.submit')}
          </button>
        </form>
        {invalid && <p id="gamertag-error" className="loss" style={{ margin: 0, fontSize: 14 }}>{t('players.search.invalid')}</p>}
        {recent.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="eyebrow" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Clock size={13} strokeWidth={1.5} aria-hidden="true" />{t('players.search.recent')}
            </span>
            <div className="chips">
              {recent.map((g) => (
                <button key={g} type="button" className="chip" onClick={() => go(g)}>{g}</button>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="grid grid--3">
        <Card eyebrow={t('players.feature.eyebrow')} title={t('players.feature.summary')} icon={Trophy}>
          <p className="muted" style={{ margin: 0 }}>{t('players.feature.summaryBody')}</p>
        </Card>
        <Card eyebrow={t('players.feature.eyebrow')} title={t('players.feature.history')} icon={History}>
          <p className="muted" style={{ margin: 0 }}>{t('players.feature.historyBody')}</p>
        </Card>
        <Card eyebrow={t('players.feature.eyebrow')} title={t('players.feature.leaders')} icon={Swords}>
          <p className="muted" style={{ margin: 0 }}>{t('players.feature.leadersBody')}</p>
        </Card>
      </div>
    </>
  )
}

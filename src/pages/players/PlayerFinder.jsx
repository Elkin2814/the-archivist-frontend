import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext.jsx'
import { GAMERTAG_RE, pushRecent } from './recent.js'

/**
 * Buscador compacto dentro del perfil: permite saltar a otro jugador sin volver al menú.
 * Conserva la pestaña actual (Resumen o Historial); el filtro de modo se reinicia.
 */
export default function PlayerFinder() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [value, setValue] = useState('')
  const [invalid, setInvalid] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    const clean = value.trim().replace(/\s+/g, ' ')
    if (!clean) return
    if (!GAMERTAG_RE.test(clean)) {
      setInvalid(true)
      return
    }
    pushRecent(clean)
    const tab = pathname.endsWith('/history') ? 'history' : 'overview'
    navigate(`/players/${encodeURIComponent(clean)}/${tab}`)
    setValue('')
  }

  return (
    <form className="finder" role="search" onSubmit={submit}>
      <label htmlFor="finder-gamertag" className="sr-only">{t('players.finder.label')}</label>
      <input
        id="finder-gamertag"
        className="finder__input"
        value={value}
        maxLength={16}
        autoComplete="off"
        placeholder={t('players.finder.placeholder')}
        aria-invalid={invalid}
        aria-describedby={invalid ? 'finder-error' : undefined}
        onChange={(event) => {
          setValue(event.target.value)
          setInvalid(false)
        }}
      />
      <button type="submit" className="finder__btn" aria-label={t('players.finder.submit')} title={t('players.finder.submit')}>
        <Search size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {invalid && <span id="finder-error" className="finder__error">{t('players.search.invalid')}</span>}
    </form>
  )
}

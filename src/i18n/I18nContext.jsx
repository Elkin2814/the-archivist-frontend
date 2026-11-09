import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { messages } from './messages.js'

const STORAGE_KEY = 'archivist.lang'
const I18nContext = createContext(null)

function readStoredLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    // El almacenamiento puede no estar disponible (modo privado, vista previa).
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sin almacenamiento: el idioma vale solo para esta visita.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  /** t('nav.players') o t('history.page', { page: 2 }) */
  const t = useCallback(
    (key, vars) => {
      let text = messages[lang]?.[key] ?? messages.es[key] ?? key
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value))
        }
      }
      return text
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>')
  return ctx
}

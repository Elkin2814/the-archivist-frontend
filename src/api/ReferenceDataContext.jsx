import { createContext, useContext, useMemo } from 'react'
import { api } from './client.js'
import { useApi } from './useApi.js'
import { useI18n } from '../i18n/I18nContext.jsx'

/**
 * Datos de referencia que usan muchas pantallas: líderes, mapas y rangos CSR.
 * Se piden una vez (los líderes otra vez si cambia el idioma).
 */
const ReferenceDataContext = createContext(null)

export function ReferenceDataProvider({ children }) {
  const { lang } = useI18n()
  const leaders = useApi((opts) => api.leaders(lang, opts), [lang])
  const maps = useApi((opts) => api.maps(opts), [])
  const csr = useApi((opts) => api.csrDesignations(opts), [])

  const value = useMemo(() => {
    const leaderList = leaders.data ?? []
    const byApiId = new Map(leaderList.filter((l) => l.apiId != null).map((l) => [l.apiId, l]))
    const byKey = new Map(leaderList.map((l) => [l.key, l]))
    const mapsById = new Map((maps.data ?? []).map((m) => [m.id, m]))
    const csrById = new Map((csr.data ?? []).map((d) => [d.id, d]))
    return {
      leaders: leaderList,
      leadersLoading: leaders.loading,
      leadersError: leaders.error,
      leaderByApiId: (id) => byApiId.get(id),
      leaderByKey: (key) => byKey.get(key),
      maps: maps.data ?? [],
      mapName: (id) => mapsById.get(id)?.name,
      csrDesignations: csr.data ?? [],
      csrName: (id) => csrById.get(id)?.name,
    }
  }, [leaders, maps, csr])

  return <ReferenceDataContext.Provider value={value}>{children}</ReferenceDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReferenceData() {
  const ctx = useContext(ReferenceDataContext)
  if (!ctx) throw new Error('useReferenceData debe usarse dentro de <ReferenceDataProvider>')
  return ctx
}

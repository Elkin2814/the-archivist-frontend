import { useEffect, useState } from 'react'

/**
 * Ejecuta una llamada al backend cuando cambian sus dependencias.
 * Devuelve { data, error, loading, previous }:
 *  - data/error corresponden SOLO a las dependencias actuales (nulos mientras carga);
 *  - previous es el último dato recibido, útil para no vaciar una tabla al paginar.
 * Cancela la llamada anterior si las dependencias cambian.
 */
export function useApi(fetcher, deps) {
  const key = JSON.stringify(deps)
  const [state, setState] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetcher({ signal: controller.signal })
      .then((data) => setState({ key, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setState({ key, data: null, error })
      })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const current = state.key === key
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: !current,
    previous: state.data,
  }
}

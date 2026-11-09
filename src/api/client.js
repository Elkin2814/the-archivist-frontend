/**
 * Cliente del backend de The Archivist.
 * En desarrollo, Vite reenvía /api al backend (ver vite.config.js).
 * En producción se puede cambiar con VITE_API_URL.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  /** kind: 'notFound' | 'badRequest' | 'unavailable' | 'network' | 'unknown' */
  constructor(kind, status, detail) {
    super(detail || kind)
    this.kind = kind
    this.status = status
  }
}

async function request(path, { signal } = {}) {
  let response
  try {
    response = await fetch(BASE_URL + path, { headers: { Accept: 'application/json' }, signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('network', 0)
  }

  if (response.ok) return response.json()

  // El backend responde errores como ProblemDetail ({ title, detail, status }).
  let detail
  try {
    detail = (await response.json())?.detail
  } catch {
    detail = undefined
  }
  const kind =
    response.status === 404 ? 'notFound'
      : response.status === 400 ? 'badRequest'
        : response.status === 503 ? 'unavailable'
          : 'unknown'
  throw new ApiError(kind, response.status, detail)
}

const tag = (gamertag) => encodeURIComponent(gamertag.trim())

export const api = {
  leaders: (lang, opts) => request(`/leaders?lang=${lang}`, opts),
  maps: (opts) => request('/metadata/maps', opts),
  playlists: (opts) => request('/metadata/playlists', opts),
  seasons: (opts) => request('/metadata/seasons', opts),
  csrDesignations: (opts) => request('/metadata/csr-designations', opts),
  playerSummary: (gamertag, lang, opts) =>
    request(`/players/${tag(gamertag)}/summary?lang=${lang}`, opts),
  playerHistory: (gamertag, page, size, opts) =>
    request(`/players/${tag(gamertag)}/history?page=${page}&size=${size}`, opts),
}

const KEY = 'archivist.recentPlayers'

/** Mismas reglas que el backend: letras, números y espacios, 1 a 16 caracteres. */
export const GAMERTAG_RE = /^[\p{L}\p{N} ]{1,16}$/u

/** Últimos gamertags buscados en este navegador (solo comodidad; puede no estar disponible). */
export function readRecent() {
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string').slice(0, 8) : []
  } catch {
    return []
  }
}

export function pushRecent(gamertag) {
  try {
    const next = [gamertag, ...readRecent().filter((g) => g.toLowerCase() !== gamertag.toLowerCase())].slice(0, 8)
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Sin almacenamiento: no pasa nada.
  }
}

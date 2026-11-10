/**
 * Lista de juego de Halo Wars 2 tal como la muestra el juego (en este orden).
 *
 * La Metadata trae 60+ playlists porque cada cambio de reglas crea un UUID nuevo con el mismo nombre
 * (p. ej. 6 versiones de "RANKED SOLO WAR"), y las partidas guardan el UUID de la versión en que se jugaron.
 * Cada cola lógica de aquí agrupa todas esas versiones por nombre, así el filtro cubre el historial completo.
 * Las versiones "X" (reglas actuales) se unen con las anteriores de la misma cola.
 *
 * `names`: nombres de la Metadata (en mayúsculas) que pertenecen a la cola.
 * Lo que no está aquí (Terminus Firefight, Standard, variantes OPEN...) no tiene entrada propia en el combo
 * y solo cuenta dentro de "Todos los modos".
 */
const CATALOG = [
  { key: 'VERSUS_AI', names: ['VERSUS AI'], es: 'Contra la IA', en: 'Versus AI' },
  { key: 'RUMBLE', names: ['RUMBLE'], es: 'Bronca', en: 'Rumble' },
  { key: 'TEAM_WAR', names: ['TEAM WAR'], es: 'Guerra por equipos', en: 'Team War' },
  {
    key: 'RANKED_2V2_OBJECTIVE',
    names: ['RANKED 2V2 OBJECTIVE', 'RANKED 2V2 X OBJECTIVE'],
    es: 'Objetivo X 2c2 con rango',
    en: 'Ranked 2v2 Objective X',
  },
  {
    key: 'RANKED_SOLO_WAR',
    names: ['RANKED SOLO WAR', 'RANKED SOLO X WAR'],
    es: 'Guerra X 1c1 con rango',
    en: 'Ranked 1v1 War X',
  },
  {
    key: 'RANKED_2V2_WAR',
    names: ['RANKED 2V2 WAR', 'RANKED 2V2 X WAR'],
    es: 'Guerra X 2c2 con rango',
    en: 'Ranked 2v2 War X',
  },
  {
    key: 'RANKED_3V3_WAR',
    names: ['RANKED 3V3 WAR', 'RANKED 3V3 X WAR'],
    es: 'Guerra X igualada 3c3',
    en: 'Ranked 3v3 War X',
  },
  {
    key: 'RANKED_1V1_BLITZ',
    names: ['RANKED 1V1 BLITZ'],
    es: 'Combate Blitz X 1c1 con rango',
    en: 'Ranked 1v1 Blitz X',
  },
  {
    key: 'RANKED_2V2_BLITZ',
    names: ['RANKED 2V2 BLITZ'],
    es: 'Combate Blitz X 2c2 con rango',
    en: 'Ranked 2v2 Blitz X',
  },
  { key: 'BLITZ_3V3', names: ['3V3 BLITZ', '3V3 BLITZ X'], es: '3v3 Blitz X', en: '3v3 Blitz X' },
]

const normalize = (name) => String(name ?? '').trim().toUpperCase()

/**
 * Cruza el catálogo con las playlists de la Metadata.
 * Devuelve las colas que existen, cada una con `ids` (todos los UUID que la forman) y su nombre en `lang`.
 */
export function buildQueues(playlists, lang) {
  const idsByName = new Map()
  for (const playlist of playlists ?? []) {
    const name = normalize(playlist.name)
    if (!idsByName.has(name)) idsByName.set(name, [])
    idsByName.get(name).push(playlist.id)
  }

  return CATALOG.map((queue) => ({
    key: queue.key,
    name: lang === 'en' ? queue.en : queue.es,
    ids: queue.names.flatMap((name) => idsByName.get(name) ?? []),
  })).filter((queue) => queue.ids.length > 0)
}

/** Partidas, victorias y derrotas de una cola, sumando las versiones que el jugador haya jugado. */
export function queueTotals(queue, byPlaylist) {
  const ids = new Set(queue.ids)
  let matches = 0
  for (const line of byPlaylist ?? []) {
    if (ids.has(line.playlistId)) matches += line.matches
  }
  return { matches }
}

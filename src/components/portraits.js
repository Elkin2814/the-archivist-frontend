/**
 * Retratos de los líderes (CDN oficial de Halo Wars 2) y su encuadre dentro del círculo.
 * Las imágenes se identifican por el nombre del archivo; así no dependen del ID de la API.
 */
const BASE = 'https://content.halocdn.com/media/Default/games/halo-wars-2/leaders/'

export const PORTRAIT_URL = {
  CUTTER: `${BASE}cutter-4847987df416401a83970ed9dbd9d036.png`,
  ISABEL: `${BASE}isabel-dd34772cbd6d4db6bef49d3e1d5c6d43.png`,
  ANDERS: `${BASE}anders-0d9b72aa7a9a4831a06ee2f1f4fa5ece.png`,
  DECIMUS: `${BASE}decimus-f0858672e88a4750b817164402a03d0d.png`,
  ATRIOX: `${BASE}atriox-bf79c35d8b7b41579806c2fa3ea6706e.png`,
  SHIPMASTER: `${BASE}shipmaster-342c9c4fe0fb439bb6a3dbc89ed8a842.png`,
  FORGE: `${BASE}forge-acba0f49983841789a72dd6d53d5a09c.png`,
  KINSANO: `${BASE}kisano-92cdaa76c8304ce5955352f9af5a5ece.png`,
  JOHNSON: `${BASE}hw2-leader-crop-johnson-2978545f84b54ece8efef7af4d6600e1.png`,
  JEROME: `${BASE}jerome-cropped-8d3953455fba403fa0b323debfbe55f6.png`,
  SERINA: `${BASE}serena-crop-b424289b35fd4903a63432e55be81109.png`,
  COLONY: `${BASE}colony-cutout-3-5414bcf8c05b4c2e86e046b95c9e8734.png`,
  ARBITER: `${BASE}arbiter-ripa-moramee-cropped-ed512f910d0b4f9d9563c94bda2f9b70.png`,
  YAPYAP: `${BASE}yapyap-f986fa8a011a4eb494ba030a9cbbd215.png`,
  VORIDUS: `${BASE}leader-image-voridus-66b7848eac754c739f1825174ac27539.png`,
  PAVIUM: `${BASE}leader-image-pavium-94fe439dc91844f3b9c6a58f0b56042d.png`,
}

/**
 * Encuadre para imágenes de cuerpo entero (se amplía hasta el rostro):
 *   x:    punto horizontal de la imagen (en %) que queda en el centro del círculo.
 *   y:    punto vertical de la imagen (en %) que queda en el borde superior del círculo.
 *   zoom: ancho de la imagen respecto al círculo (220 = 2,2 veces el círculo).
 * Si a un líder la cara le queda corrida, ajusta solo su línea en PORTRAIT_FOCUS.
 */
export const DEFAULT_FOCUS = { x: 50, y: 8, zoom: 220 }

/** Para imágenes ya recortadas solo se ajustan al círculo. */
export const CROPPED_FOCUS = { x: 50, y: 0, zoom: 125 }

/** Focus y tamaño personalizado. */
export const PORTRAIT_FOCUS = {
  CUTTER: { x: 44, y: 9, zoom: 220 },
  ISABEL: { x: 44, y: 9, zoom: 220 },
  ANDERS: { x: 44, y: 9, zoom: 220 },
  FORGE: { x: 44, y: 9, zoom: 220 },
  KINSANO: { x: 44, y: 9, zoom: 220 },
  JOHNSON: { x: 44, y: 7, zoom: 200 },
  SERINA: { x: 48, y: 9, zoom: 220 },
  JEROME: { x: 44, y: 9, zoom: 200 },

  COLONY: { x: 44, y: 1, zoom: 150 },
  DECIMUS: { x: 44, y: 9, zoom: 220 },
  SHIPMASTER: { x: 44, y: 4, zoom: 180 },
  ARBITER: { x: 50, y: 4, zoom: 180 },
  YAPYAP: { x: 44, y: 4, zoom: 180 },
  VORIDUS: { x: 44, y: 4, zoom: 180 },
  PAVIUM: { x: 44, y: 4, zoom: 180 },
}

/**
 * Ajustes finos por líder, medidos respecto al círculo y válidos para cualquier encuadre:
 *   right: mueve al personaje a la derecha (% del ancho del círculo; negativo = izquierda).
 *   scale: multiplica el tamaño (0.9 = 10 % más pequeño).
 */
export const PORTRAIT_TWEAK = {
  JOHNSON: { right: 10 },
  SERINA: { right: 10 },
  PAVIUM: { right: 8 },
  COLONY: { scale: 0.88 },
  ARBITER: { right: 12, scale: 0.88 },
}

/** Una imagen de proporción casi cuadrada (alto/ancho < 1,15) se considera ya recortada. */
export function focusFor(leaderKey, ratio) {
  const cropped = ratio != null && ratio < 1.15
  const base = cropped ? CROPPED_FOCUS : { ...DEFAULT_FOCUS, ...(PORTRAIT_FOCUS[leaderKey] ?? {}) }
  const { right = 0, scale = 1 } = PORTRAIT_TWEAK[leaderKey] ?? {}
  const zoom = base.zoom * scale
  return { ...base, zoom, x: base.x - (right * 100) / zoom }
}

export function portraitFor(leader) {
  return leader?.imageUrl ?? PORTRAIT_URL[leader?.key] ?? null
}

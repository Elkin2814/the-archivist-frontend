import { ChartColumn, Home, Link2, Shield, Sparkles, Trophy, Users } from 'lucide-react'

/** Secciones principales: las usan el menú lateral y la barra superior. */
export const SECTIONS = [
  { key: 'home', path: '/', icon: Home, group: 'main', end: true },
  { key: 'leaders', path: '/leaders', icon: Shield, group: 'main' },
  { key: 'players', path: '/players', icon: Users, group: 'main' },
  { key: 'rankings', path: '/rankings', icon: Trophy, group: 'main' },
  { key: 'stats', path: '/stats', icon: ChartColumn, group: 'analysis' },
  { key: 'synergy', path: '/synergy', icon: Link2, group: 'analysis' },
  { key: 'guides', path: '/guides', icon: Sparkles, group: 'analysis', badge: 'AI' },
]

export function sectionFor(pathname) {
  const first = '/' + (pathname.split('/')[1] ?? '')
  return SECTIONS.find((s) => (s.path === '/' ? first === '/' : first === s.path)) ?? SECTIONS[0]
}

/**
 * Rutas con pestañas propias (subrutas): se muestran dentro de un marco cuyo encabezado
 * lleva las pestañas, y el título de la sección va debajo.
 */
export function hasTabs(pathname) {
  const [section, second] = pathname.split('/').filter(Boolean)
  if (section === 'rankings' || section === 'stats') return true
  if (section === 'leaders' || section === 'players') return Boolean(second)
  return false
}

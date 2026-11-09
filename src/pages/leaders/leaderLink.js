import { useLocation } from 'react-router'

/** Enlace a un líder conservando la pestaña abierta (overview, matchups...). */
export function useLeaderLink() {
  const { pathname } = useLocation()
  const tab = pathname.split('/')[3] ?? 'overview'
  return (leader) => `/leaders/${leader.key.toLowerCase()}/${tab}`
}

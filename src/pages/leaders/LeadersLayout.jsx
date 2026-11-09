import { Outlet, useParams } from 'react-router'
import LeaderPicker from './LeaderPicker.jsx'

/**
 * Sin líder elegido: selector completo arriba.
 * Con líder elegido: el selector se encoge dentro del encabezado del líder (LeaderDetail).
 */
export default function LeadersLayout() {
  const { leaderKey } = useParams()
  if (leaderKey) return <Outlet />
  return (
    <>
      <LeaderPicker />
      <Outlet />
    </>
  )
}

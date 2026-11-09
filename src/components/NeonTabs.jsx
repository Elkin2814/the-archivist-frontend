import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, matchPath, useLocation } from 'react-router'
import { FrameTabsContext } from './frameContext.js'

/**
 * Pestañas de la sección: píldoras compactas con ícono y texto. Una píldora de vidrio
 * lima se desliza hasta la pestaña activa. Cada pestaña es un enlace (subruta).
 * Se dibujan en el encabezado del marco de la página (ver Layout).
 * items: [{ to, label, icon }]
 */
export default function NeonTabs({ items, label }) {
  const slot = useContext(FrameTabsContext)
  const { pathname } = useLocation()
  const trackRef = useRef(null)
  const tabRefs = useRef([])
  const [pill, setPill] = useState(null)

  const active = items.findIndex((item) => matchPath({ path: item.to, end: false }, pathname))

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active]
      if (!el) return setPill(null)
      setPill({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    const track = trackRef.current
    if (!track) return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [active, items.length, slot])

  if (!slot) return null

  return createPortal(
    <nav className="tabs" aria-label={label}>
      <div className="tabs__track" ref={trackRef}>
        {pill && <span className="tabs__pill" style={{ left: pill.left, width: pill.width }} aria-hidden="true" />}
        {items.map(({ to, label: text, icon: Icon }, index) => (
          <NavLink key={to} to={to} ref={(el) => (tabRefs.current[index] = el)} className="tabs__tab">
            {Icon && <Icon size={16} strokeWidth={1.6} aria-hidden="true" />}
            <span>{text}</span>
          </NavLink>
        ))}
      </div>
    </nav>,
    slot,
  )
}

import { Link } from 'react-router'
import { ArrowRight, CircleAlert } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'

/** Tarjeta de vidrio con encabezado opcional (subtítulo pequeño, título e icono). */
export function Card({ eyebrow, title, icon: Icon, action, children, className = '', style }) {
  return (
    <section className={`card ${className}`} style={style}>
      {(eyebrow || title || Icon || action) && (
        <header className="card__head">
          <div className="card__titles">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h3 className="card__title">{title}</h3>}
          </div>
          {action}
          {Icon && !action && (
            <span className="card__icon"><Icon size={17} strokeWidth={1.5} aria-hidden="true" /></span>
          )}
        </header>
      )}
      {children}
    </section>
  )
}

/** Recuadro punteado para secciones que todavía no tienen datos. */
export function Empty({ title, children, center = false }) {
  return (
    <div className={`empty ${center ? 'empty--center' : ''}`}>
      {title && <strong>{title}</strong>}
      {children}
    </div>
  )
}

export function Soon({ children }) {
  const { t } = useI18n()
  return <span className="soon">{children ?? t('common.noData')}</span>
}

/** Anillo de progreso fino (estilo Service Record). value: 0–100 o null si no hay dato. */
export function Ring({ value, caption, size = 120, color = 'var(--lime)' }) {
  const stroke = 2
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value))
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {value != null && <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          style={{ filter: 'drop-shadow(0 0 4px rgba(181,242,61,.55))', transition: 'stroke-dasharray .6s' }}
        />}
      </svg>
      <div className="ring__label">
        <span className="ring__value">{value == null ? '—' : `${value}%`}</span>
        {caption && <span className="ring__caption">{caption}</span>}
      </div>
    </div>
  )
}

/** Barra fina de porcentaje. value: 0–100 o null. */
export function Bar({ value, color }) {
  return (
    <div className="bar" role="presentation">
      {value != null && <span style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />}
    </div>
  )
}

/** Mensaje de error de la API en lenguaje de usuario. */
export function ApiErrorAlert({ error }) {
  const { t } = useI18n()
  const kind = error?.kind ?? 'unknown'
  return (
    <div className="alert" role="alert">
      <CircleAlert size={20} strokeWidth={1.5} className="loss" aria-hidden="true" />
      <div>
        <strong>{t(`error.${kind}.title`)}</strong>
        <p>{t(`error.${kind}.body`)}</p>
      </div>
    </div>
  )
}

export function Skeleton({ width = '100%' }) {
  return <div className="skeleton" style={{ width }} />
}

/** Texto verde con un botón-ícono redondo (flecha de la librería). Para usar dentro de otro enlace. */
export function MoreLabel({ children }) {
  return (
    <span className="more">
      {children}
      <span className="more__icon"><ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" /></span>
    </span>
  )
}

/** Enlace "Ver más": texto verde con botón-ícono redondo. */
export function MoreLink({ to, children }) {
  return (
    <Link to={to} className="more">
      {children}
      <span className="more__icon"><ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" /></span>
    </Link>
  )
}

import { useState } from 'react'
import { focusFor, portraitFor } from './portraits.js'

/** Iniciales para cuando no hay imagen: "CPT. Cutter" → "CU", "Atriox" → "AT". */
function initials(leader) {
  const base = (leader?.alias ?? leader?.name ?? '?').replace(/^[A-Z]+\.\s*/, '')
  const words = base.split(/\s+/).filter(Boolean)
  if (words.length > 1 && words[1].length > 2) return (words[0][0] + words[1][0]).toUpperCase()
  return base.slice(0, 2).toUpperCase()
}

/**
 * Retrato circular del líder: la imagen oficial (CDN) ampliada al rostro, del pecho a la cabeza.
 * Si no hay imagen o no carga, muestra las iniciales con el aro de su facción.
 */
export default function LeaderAvatar({ leader, size = 44, selected = false }) {
  const [broken, setBroken] = useState(null)
  const [ratio, setRatio] = useState(null)
  const faction = leader?.faction ?? 'UNKNOWN'
  const url = portraitFor(leader)
  const showImage = url && broken !== url
  const focus = focusFor(leader?.key, ratio)
  return (
    <span
      className={`avatar avatar--${faction} ${showImage ? 'avatar--photo' : ''} ${selected ? 'avatar--selected' : ''}`}
      style={{ width: size, height: size, fontSize: Math.round(size / 3) }}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          className="avatar__face"
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ width: `${focus.zoom}%`, transform: `translate(-${focus.x}%, -${focus.y}%)` }}
          onLoad={(e) => setRatio(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth)}
          onError={() => setBroken(url)}
        />
      ) : (
        initials(leader)
      )}
    </span>
  )
}

/** Retrato grande (cabeza a cintura) para el encabezado del líder. Sin imagen no muestra nada. */
export function LeaderPortrait({ leader }) {
  const [broken, setBroken] = useState(null)
  const url = portraitFor(leader)
  if (!url || broken === url) return null
  const focus = focusFor(leader.key)
  return (
    <div className={`portrait portrait--${leader.faction}`} aria-hidden="true">
      <img
        src={url}
        alt=""
        style={{ left: `${50 - (focus.x - 50) * 0.6}%` }}
        onError={() => setBroken(url)}
      />
    </div>
  )
}

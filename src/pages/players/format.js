/** Utilidades de formato compartidas por el perfil y el historial. */
export function formatDate(iso, lang) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

export function formatAgo(iso, lang) {
  if (!iso) return '—'
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  const rtf = new Intl.RelativeTimeFormat(lang === 'en' ? 'en' : 'es', { numeric: 'auto' })
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 48) return rtf.format(-hours, 'hour')
  return rtf.format(-Math.round(hours / 24), 'day')
}

export function formatDuration(seconds) {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, '0')
  return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}:${s}`
}

/** "Gold 3" a partir del id de designación y el tier; nulo si no hay rango. */
export function formatCsr(csr, csrName) {
  if (!csr || (csr.designation == null && csr.tier == null)) return null
  const name = csrName(csr.designation) ?? `#${csr.designation}`
  return csr.tier != null ? `${name} ${csr.tier}` : name
}

/** "W" / "L" / "D" / "?" a partir del resultado del backend (VICTORY, DEFEAT...). */
export function resultLetter(result) {
  return { VICTORY: 'W', DEFEAT: 'L', DRAW: 'D', W: 'W', L: 'L', D: 'D' }[result] ?? '?'
}

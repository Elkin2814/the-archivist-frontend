import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/**
 * Selector desplegable de modo de juego: caja rectangular translúcida (estilo menú de Halo).
 * `options`: [{ id, name, hint?, dim? }]. `value` es el id elegido o null para "todos".
 */
export default function ModeSelect({ label, allLabel, options, value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])
  const listId = useId()

  const items = [{ id: null, name: allLabel }, ...options]
  const selected = items.find((item) => item.id === value) ?? items[0]

  // Cierra al hacer clic fuera.
  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  // Al abrir, el foco va a la opción elegida para poder navegar con el teclado.
  useEffect(() => {
    if (!open) return
    const index = Math.max(0, items.findIndex((item) => item.id === value))
    itemRefs.current[index]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = (refocus) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  const choose = (id) => {
    onChange(id)
    close(true)
  }

  const onMenuKey = (event, index) => {
    const move = (to) => {
      event.preventDefault()
      itemRefs.current[(to + items.length) % items.length]?.focus()
    }
    if (event.key === 'ArrowDown') move(index + 1)
    else if (event.key === 'ArrowUp') move(index - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(items.length - 1)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'Tab') setOpen(false)
  }

  return (
    <div className="select" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span className="select__text">
          <span className="select__label">{label}</span>
          <span className="select__value">{selected.name}</span>
        </span>
        <ChevronDown size={18} strokeWidth={1.75} className="select__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul className="select__menu" id={listId} role="listbox" aria-label={label}>
          {items.map((item, index) => {
            const active = item.id === value
            return (
              <li
                key={item.id ?? 'all'}
                ref={(el) => { itemRefs.current[index] = el }}
                role="option"
                tabIndex={-1}
                aria-selected={active}
                className={`select__option ${item.dim ? 'select__option--dim' : ''}`}
                onClick={() => choose(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    choose(item.id)
                  } else {
                    onMenuKey(event, index)
                  }
                }}
              >
                <span className="select__option-name">{item.name}</span>
                <span className="select__option-hint">
                  {item.hint}
                  {active && <Check size={15} strokeWidth={2} aria-hidden="true" />}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

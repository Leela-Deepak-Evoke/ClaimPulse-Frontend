import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { XIcon } from './icons.tsx'
import { IconButton } from './ui/index.ts'

interface SidePanelProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'

export default function SidePanel({ title, subtitle, onClose, children }: SidePanelProps) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previous = document.activeElement
    panelRef.current?.querySelector<HTMLElement>('input, select, textarea')?.focus()
    return () => {
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = items?.[0]
    const last = items?.[items.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <div className="side-panel__backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        className="side-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-panel-title"
        onKeyDown={handleKeyDown}
      >
        <header className="side-panel__head">
          <div>
            <h2 id="side-panel-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <IconButton label="Close panel" onClick={onClose}>
            <XIcon />
          </IconButton>
        </header>
        <div className="side-panel__body">{children}</div>
      </aside>
    </>
  )
}

import { useState, type ReactNode } from 'react'
import Logo from './Logo.tsx'
import Navbar from './Navbar.tsx'
import { MenuIcon } from './icons.tsx'
import { IconButton } from './ui/index.ts'

export default function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <div className="shell" data-menu-open={menuOpen}>
      <header className="topbar">
        <Logo />
        <IconButton
          tone="onDark"
          size="lg"
          label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
        >
          <MenuIcon />
        </IconButton>
      </header>

      <aside id="sidebar" className="sidebar">
        <Logo />
        <Navbar onNavigate={close} />
      </aside>
      <button
        type="button"
        className="shell__backdrop"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
      />

      <main className="shell__main">{children}</main>
    </div>
  )
}

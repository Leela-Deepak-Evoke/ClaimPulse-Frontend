import type { ReactNode } from 'react'
import { useRouter } from '../app/router.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import Link from './Link.tsx'
import { IconButton } from './ui/index.ts'
import {
  ClaimsIcon,
  DashboardIcon,
  NewClaimIcon,
  PatientsIcon,
  PayersIcon,
  SignOutIcon,
} from './icons.tsx'

const NAV_ITEMS: { to: string; label: string; icon: ReactNode; adminOnly?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/claims', label: 'Claims', icon: <ClaimsIcon /> },
  { to: '/claims/new', label: 'New claim', icon: <NewClaimIcon /> },
  { to: '/patients', label: 'Patients', icon: <PatientsIcon /> },
  { to: '/payers', label: 'Payers', icon: <PayersIcon />, adminOnly: true },
]

function isActive(path: string, to: string): boolean {
  if (path === to) return true
  if (to === '/claims') return path.startsWith('/claims/') && path !== '/claims/new'
  return (to === '/patients' || to === '/payers') && path === `${to}/new`
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export default function Navbar({ onNavigate }: { onNavigate: () => void }) {
  const { path } = useRouter()
  const { session, signOut } = useAuth()

  return (
    <nav className="sidebar__inner" aria-label="Main">
      <ul className="sidebar__nav">
        {NAV_ITEMS.filter((item) => !item.adminOnly || session?.role === 'Admin').map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              aria-current={isActive(path, item.to) ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {session && (
        <div className="sidebar__user">
          <span className="avatar" aria-hidden="true">
            {initials(session.name)}
          </span>
          <span className="sidebar__who">
            <strong>{session.name}</strong>
            <small>{session.role}</small>
          </span>
          <IconButton tone="onDark" label="Sign out" onClick={signOut}>
            <SignOutIcon />
          </IconButton>
        </div>
      )}
    </nav>
  )
}

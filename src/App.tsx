import { MantineProvider } from '@mantine/core'
import { useEffect, useMemo, type ReactNode } from 'react'
import { mantineTheme } from './app/mantineTheme.ts'
import { RouterContext } from './app/router.ts'
import { usePath } from './app/usePath.ts'
import { AuthProvider, useAuth } from './auth/AuthContext.tsx'
import type { Session } from './auth/session.ts'
import AppShell from './components/AppShell.tsx'
import AccessDenied from './pages/AccessDenied.tsx'
import ClaimDetails from './pages/ClaimDetails.tsx'
import ClaimForm from './pages/ClaimForm.tsx'
import Claims from './pages/Claims.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Login from './pages/Login.tsx'
import PatientForm from './pages/PatientForm.tsx'
import Patients from './pages/Patients.tsx'
import PayerForm from './pages/PayerForm.tsx'
import Payers from './pages/Payers.tsx'

const PAGES: Record<string, ReactNode> = {
  '/': <Dashboard />,
  '/claims': <Claims />,
  '/claims/new': <ClaimForm />,
  '/patients': <Patients />,
  '/patients/new': <PatientForm />,
  '/payers': <Payers />,
  '/payers/new': <PayerForm />,
}

const ADMIN_ONLY_PAGES: Record<string, string> = {
  '/payers': 'Managing payers',
  '/payers/new': 'Managing payers',
}
const CLAIM_PATH = /^\/claims\/([^/]+)$/

function resolvePage(path: string, role: Session['role']): ReactNode | null {
  const adminAction = ADMIN_ONLY_PAGES[path]
  if (adminAction && role !== 'Admin') return <AccessDenied action={adminAction} />
  const claimId = CLAIM_PATH.exec(path)?.[1]
  if (claimId && !(path in PAGES))
    return <ClaimDetails key={claimId} id={decodeURIComponent(claimId)} />
  return PAGES[path] ?? null
}

function Routes() {
  const { session } = useAuth()
  const [path, navigate] = usePath()
  const page = session ? resolvePage(path, session.role) : null
  const target = session ? (page ? path : '/') : '/login'

  useEffect(() => {
    if (target !== path) navigate(target, true)
  }, [target, path, navigate])

  const router = useMemo(
    () => ({ path: target, navigate: (to: string) => navigate(to) }),
    [target, navigate],
  )

  return (
    <RouterContext.Provider value={router}>
      {session ? <AppShell>{resolvePage(target, session.role)}</AppShell> : <Login />}
    </RouterContext.Provider>
  )
}

export default function App() {
  return (
    <MantineProvider theme={mantineTheme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </MantineProvider>
  )
}

import { useEffect } from 'react'
import { usePath } from './app/usePath.ts'
import { AuthProvider, useAuth } from './auth/AuthContext.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Login from './pages/Login.tsx'

function Routes() {
  const { session } = useAuth()
  const [path, navigate] = usePath()
  const target = session ? (path === '/login' ? '/' : path) : '/login'

  useEffect(() => {
    if (target !== path) navigate(target, true)
  }, [target, path, navigate])

  return target === '/login' ? <Login /> : <Dashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

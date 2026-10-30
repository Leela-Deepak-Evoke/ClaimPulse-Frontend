import { useAuth } from '../auth/AuthContext.tsx'

export default function Dashboard() {
  const { session, signOut } = useAuth()
  return (
    <main className="home">
      <h1>ClaimPulse</h1>
      <p>
        Signed in as {session?.name} ({session?.role})
      </p>
      <button type="button" className="btn-primary home__signout" onClick={signOut}>
        Sign out
      </button>
    </main>
  )
}

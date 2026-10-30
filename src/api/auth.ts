import type { Session } from '../auth/session.ts'

interface DemoAccount extends Session {
  password: string
  active: boolean
}

// Demo-only credentials until the backend auth endpoint exists; replace with a real API call.
export const DEMO_PASSWORD = 'Demo@123'

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Ananya Reddy',
    email: 'ananya.reddy@claimpulse.example.com',
    role: 'Admin',
    password: DEMO_PASSWORD,
    active: true,
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@claimpulse.example.com',
    role: 'Biller',
    password: DEMO_PASSWORD,
    active: true,
  },
  {
    name: 'Saiteja Goud',
    email: 'saiteja.goud@claimpulse.example.com',
    role: 'Biller',
    password: DEMO_PASSWORD,
    active: false,
  },
]

export class AuthError extends Error {}

export async function login(email: string, password: string): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  )
  if (!account) throw new AuthError('Incorrect email or password.')
  if (!account.active) throw new AuthError('This account is inactive. Contact your administrator.')
  return { name: account.name, email: account.email, role: account.role }
}

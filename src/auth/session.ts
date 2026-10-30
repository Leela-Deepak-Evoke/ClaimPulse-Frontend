import { z } from 'zod'

const STORAGE_KEY = 'claimpulse.session'

const sessionSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(['Admin', 'Biller']),
})

export type Session = z.infer<typeof sessionSchema>

function readFrom(storage: Storage): Session | null {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = sessionSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function loadSession(): Session | null {
  return readFrom(window.localStorage) ?? readFrom(window.sessionStorage)
}

export function saveSession(session: Session, remember: boolean): void {
  clearSession()
  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  window.localStorage.removeItem(STORAGE_KEY)
  window.sessionStorage.removeItem(STORAGE_KEY)
}

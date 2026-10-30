import { createContext, useContext } from 'react'

export interface Router {
  path: string
  navigate: (to: string) => void
}

export const RouterContext = createContext<Router | null>(null)

export function useRouter(): Router {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterContext.Provider')
  return ctx
}

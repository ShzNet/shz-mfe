import { createContext, useContext } from 'react'
import type { AppDefinition } from '../types'

export const permissionCache = new Set<string>()

export type AppNavContextValue = {
  navigateToApp: (app: AppDefinition) => void
}

export const AppNavContext = createContext<AppNavContextValue | null>(null)

export function useAppNav(): AppNavContextValue {
  const ctx = useContext(AppNavContext)
  if (!ctx) throw new Error('useAppNav must be used inside AppRoutesContent')
  return ctx
}

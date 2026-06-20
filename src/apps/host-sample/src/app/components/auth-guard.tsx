import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { AuthState } from '../types'

type AuthGuardProps = {
  auth: AuthState | null
  children: ReactNode
}

export function AuthGuard({ auth, children }: AuthGuardProps) {
  const location = useLocation()

  if (!auth) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/sign-in?redirect=${redirect}`} replace />
  }

  return <>{children}</>
}

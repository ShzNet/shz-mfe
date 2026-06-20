import type { AuthState } from '../types'

const AUTH_KEY = 'host-main-auth'

export function readAuthState(): AuthState | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthState
  } catch {
    return null
  }
}

export function writeAuthState(auth: AuthState | null) {
  if (typeof window === 'undefined') return

  if (!auth) {
    window.localStorage.removeItem(AUTH_KEY)
    return
  }

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

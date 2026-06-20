import { useState } from 'react'
import { readAuthState, writeAuthState } from '../lib/auth-storage'
import type { AuthState } from '../types'

export function useAuthState() {
  const [auth, setAuth] = useState<AuthState | null>(() => readAuthState())

  function signIn(nextAuth: AuthState) {
    writeAuthState(nextAuth)
    setAuth(nextAuth)
  }

  function signOut() {
    writeAuthState(null)
    setAuth(null)
  }

  return { auth, signIn, signOut }
}

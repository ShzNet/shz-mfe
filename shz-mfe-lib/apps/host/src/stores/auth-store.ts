import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN_KEY = 'shz_access_token'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (token: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN_KEY)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  return {
    auth: {
      user: null,
      setUser: (user) => set((s) => ({ ...s, auth: { ...s.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((s) => {
          setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken))
          return { ...s, auth: { ...s.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((s) => {
          removeCookie(ACCESS_TOKEN_KEY)
          return { ...s, auth: { ...s.auth, accessToken: '' } }
        }),
      reset: () =>
        set((s) => {
          removeCookie(ACCESS_TOKEN_KEY)
          return { ...s, auth: { ...s.auth, user: null, accessToken: '' } }
        }),
    },
  }
})

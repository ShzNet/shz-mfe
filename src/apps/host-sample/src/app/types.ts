import type { HostRemoteApp } from '../remotes'

export type AuthState = {
  email: string
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type AppDefinition = HostRemoteApp

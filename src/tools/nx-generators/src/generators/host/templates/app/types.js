function buildTypesTs() {
  return `import type { HostRemoteApp } from '../remotes'

export type AuthState = {
  email: string
  token: string
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type AppDefinition = HostRemoteApp
`
}

module.exports = { buildTypesTs }

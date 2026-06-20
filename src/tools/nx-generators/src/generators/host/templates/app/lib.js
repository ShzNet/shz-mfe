function buildAuthStorageTs(options) {
  const key = `${options.name}-auth`
  return `import type { AuthState } from '../types'

const AUTH_KEY = '${key}'

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
`
}

function buildRemoteLoaderTs(options) {
  return `import { loadFederatedModule } from '${options.corePackage}'

export async function loadRemoteModule<TModule = unknown>(remoteName: string, exposedModule: string, entry: string): Promise<TModule> {
  return loadFederatedModule<TModule>(remoteName, exposedModule, entry)
}
`
}

function buildThemeTs(options) {
  const key = `${options.name}-theme`
  return `import type { ThemeMode } from '../types'

const THEME_KEY = '${key}'

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  return (window.localStorage.getItem(THEME_KEY) as ThemeMode) ?? 'system'
}

export function writeThemeMode(theme: ThemeMode) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_KEY, theme)
}

export function applyResolvedTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}
`
}

module.exports = { buildAuthStorageTs, buildRemoteLoaderTs, buildThemeTs }

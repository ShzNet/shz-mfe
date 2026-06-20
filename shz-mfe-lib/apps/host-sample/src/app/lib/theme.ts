import type { ThemeMode } from '../types'

const THEME_KEY = 'host-sample-theme'

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

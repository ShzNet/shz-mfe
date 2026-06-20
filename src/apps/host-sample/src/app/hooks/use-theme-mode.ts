import { useEffect, useState } from 'react'
import { applyResolvedTheme, getSystemTheme, readThemeMode, writeThemeMode } from '../lib/theme'
import type { ThemeMode } from '../types'

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => readThemeMode())
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyResolvedTheme(getSystemTheme())

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  function updateTheme(nextTheme: ThemeMode) {
    writeThemeMode(nextTheme)
    setTheme(nextTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
  }
}

import { useEffect } from 'react'
import { getUserPreferences, useValue } from 'tldraw'
import { resolveTheme } from '../utils/theme'

export function useThemeSync() {
  const theme = useValue('theme', () => getUserPreferences().colorScheme ?? 'system', [])

  useEffect(() => {
    const root = window.document.documentElement
    const resolvedTheme = resolveTheme(theme)

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [theme])
}

export function useTheme(): 'light' | 'dark' {
  const theme = useValue('theme', () => getUserPreferences().colorScheme ?? 'system', [])
  return resolveTheme(theme)
}

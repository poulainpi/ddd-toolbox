import { useEffect } from 'react'
import { getUserPreferences, useValue } from 'tldraw'
import { resolveTheme } from '../utils/theme'

export function useTheme() {
  const theme = useValue('theme', () => getUserPreferences().colorScheme ?? 'system', [])

  useEffect(() => {
    const root = window.document.documentElement
    const resolvedTheme = resolveTheme(theme)

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [theme])
}

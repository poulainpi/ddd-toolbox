import { useEffect, useState } from 'react'
import { Button, resolveTheme, useThemeSync } from '@ddd-toolbox/ui'
import { Moon, Sun } from 'lucide-react'
import { getUserPreferences, setUserPreferences } from 'tldraw'

export function ThemeToggle() {
  useThemeSync()

  const [mounted, setMounted] = useState(false)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
    const resolved = resolveTheme()
    setEffectiveTheme(resolved)
  }, [])

  const toggleTheme = () => {
    const current = resolveTheme()
    const newTheme = current === 'light' ? 'dark' : 'light'

    setUserPreferences({
      ...getUserPreferences(),
      colorScheme: newTheme,
    })

    setEffectiveTheme(newTheme)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {mounted && effectiveTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

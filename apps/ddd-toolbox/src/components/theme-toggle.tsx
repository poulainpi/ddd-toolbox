import { Button, useTheme } from '@ddd-toolbox/ui'
import { Moon, Sun } from 'lucide-react'
import { getUserPreferences, setUserPreferences } from 'tldraw'

function getSystemTheme(): 'light' | 'dark' {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  useTheme()

  const toggleTheme = () => {
    const currentTheme = getUserPreferences().colorScheme ?? 'system'
    const effectiveTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light'

    setUserPreferences({
      ...getUserPreferences(),
      colorScheme: newTheme,
    })
  }

  const currentTheme = getUserPreferences().colorScheme ?? 'system'
  const effectiveTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {effectiveTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

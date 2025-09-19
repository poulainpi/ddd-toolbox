import { getUserPreferences } from 'tldraw'

export function resolveTheme(savedTheme?: string): 'light' | 'dark' {
  const userTheme = savedTheme ?? getUserTheme()
  return userTheme === 'system' ? getSystemTheme() : (userTheme as 'light' | 'dark')
}

function getSystemTheme(): 'light' | 'dark' {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getUserTheme(): string {
  if (typeof window === 'undefined') return 'system'
  return getUserPreferences().colorScheme ?? 'system'
}

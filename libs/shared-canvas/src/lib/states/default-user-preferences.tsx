import { getUserPreferences, setUserPreferences } from 'tldraw'

export function setDefaultUserPreferencesWhenNotExisting() {
  const userPreferences = getUserPreferences()
  if (userPreferences?.colorScheme == null) {
    setUserPreferences({
      ...userPreferences,
      colorScheme: 'system',
      isSnapMode: true,
    })
  }
}

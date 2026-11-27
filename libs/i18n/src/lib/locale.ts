import { useCallback, useSyncExternalStore } from 'react'
import type { MessageKey } from './messages/en'
import { en } from './messages/en'
import { zhCN } from './messages/zh-cn'

export const LOCALES = ['en', 'zh-CN'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'ddd-toolbox.locale'

const catalogs: Record<Locale, Record<MessageKey, string>> = { en, 'zh-CN': zhCN }

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage can be unavailable (private mode, blocked storage)
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return languages.some((language) => /^zh\b/i.test(language)) ? 'zh-CN' : 'en'
}

let currentLocale: Locale | null = null
const listeners = new Set<() => void>()

function applyDocumentLanguage(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
  }
}

export function getLocale(): Locale {
  if (currentLocale === null) {
    currentLocale = detectLocale()
    applyDocumentLanguage(currentLocale)
  }
  return currentLocale
}

export function getServerLocale(): Locale {
  return DEFAULT_LOCALE
}

export function setLocale(locale: Locale) {
  if (!isLocale(locale)) return
  currentLocale = locale
  applyDocumentLanguage(locale)
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // ignore storage failures
  }
  listeners.forEach((listener) => listener())
}

export function subscribeToLocale(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === LOCALE_STORAGE_KEY && isLocale(event.newValue)) {
      currentLocale = event.newValue
      applyDocumentLanguage(event.newValue)
      listeners.forEach((listener) => listener())
    }
  })
}

export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const template = catalogs[locale][key] ?? en[key]
  if (!vars) return template

  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] === undefined ? `{${name}}` : String(vars[name]),
  )
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribeToLocale, getLocale, getServerLocale)
}

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string

export function useT(): Translate {
  const locale = useLocale()

  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  )
}

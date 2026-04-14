import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

declare global {
  interface Window {
    umami?: {
      track(event_name: string, data?: Record<string, unknown>): void
    }
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function track(eventName: string, data?: Record<string, unknown>) {
  window.umami?.track(eventName, data)
}

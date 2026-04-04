import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function track(eventName: string, data?: Record<string, unknown>) {
  window.umami?.track(eventName, data)
}

interface Window {
  umami?: {
    track(event_name: string, data?: Record<string, unknown>): void
  }
}

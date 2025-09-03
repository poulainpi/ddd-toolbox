import { useTheme } from '@ddd-toolbox/ui'

export function EventStorming() {
  useTheme()

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Event Storming</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Coming Soon</p>
        </div>
      </div>
    </div>
  )
}

export default EventStorming

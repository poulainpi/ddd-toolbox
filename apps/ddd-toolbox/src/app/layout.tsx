import { Outlet } from 'react-router-dom'
import { Toaster } from '@ddd-toolbox/ui'

export function Layout() {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  )
}

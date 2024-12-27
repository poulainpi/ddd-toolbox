import { Outlet } from 'react-router-dom'
import { Toaster } from '@ddd-toolbox/ui/lib/ui/toaster'

export function Layout() {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  )
}

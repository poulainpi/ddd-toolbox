import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import * as ReactDOM from 'react-dom/client'
import { router } from './app/router'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

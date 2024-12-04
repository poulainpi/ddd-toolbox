import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Layout } from './layout'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route
        path="domain-storytelling"
        lazy={async () => {
          const { DomainStorytelling } = await import('@ddd-toolbox/domain-storytelling')
          return { Component: DomainStorytelling }
        }}
      />
    </Route>
  )
)

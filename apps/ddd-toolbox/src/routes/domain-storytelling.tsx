import { createFileRoute } from '@tanstack/react-router'
import { DomainStorytelling } from '@ddd-toolbox/domain-storytelling'

export const Route = createFileRoute('/domain-storytelling')({
  component: DomainStorytelling,
})

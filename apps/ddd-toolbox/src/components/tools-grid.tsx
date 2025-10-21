import { ToolCard } from './tool-card'
import { ArrowUpDown, BarChart3, FileText, MessageSquare, Network, Zap } from 'lucide-react'
import { DOMAIN_STORYTELLING_EXAMPLE_URL } from '@ddd-toolbox/domain-storytelling-constants'
import { EVENT_STORMING_EXAMPLE_URL } from '@ddd-toolbox/event-storming-constants'

const tools = [
  {
    id: 'domain-storytelling',
    title: 'Domain Storytelling',
    description:
      'Visualize and communicate domain knowledge through collaborative storytelling. Create pictorial domain models that bridge the gap between domain experts and development teams.',
    status: 'available' as const,
    href: '/domain-storytelling',
    exampleHref: DOMAIN_STORYTELLING_EXAMPLE_URL,
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    id: 'event-storming',
    title: 'Event Storming',
    description:
      'Rapidly discover business processes and identify domain boundaries through collaborative workshop techniques. Map out the flow of domain events across your system.',
    status: 'available' as const,
    href: '/event-storming',
    exampleHref: EVENT_STORMING_EXAMPLE_URL,
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 'bounded-context-canvas',
    title: 'Bounded Context Canvas',
    description:
      'Document and design your bounded contexts using a structured canvas approach. Capture business model, ubiquitous language, and integration patterns.',
    status: 'coming-soon' as const,
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: 'context-mapping',
    title: 'Context Mapping',
    description:
      'Define and visualize relationships between bounded contexts. Understand integration patterns and team interactions across different parts of your domain.',
    status: 'coming-later' as const,
    icon: <Network className="h-6 w-6" />,
  },
  {
    id: 'aggregate-design-canvas',
    title: 'Aggregate Design Canvas',
    description:
      'Design and document your aggregates using a structured canvas approach. Define aggregate boundaries, invariants, and behavioral patterns.',
    status: 'coming-later' as const,
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    id: 'domain-message-flow',
    title: 'Domain Message Flow',
    description:
      'Model the flow of messages and events between different parts of your system. Visualize how information moves across bounded contexts.',
    status: 'coming-later' as const,
    icon: <ArrowUpDown className="h-6 w-6" />,
  },
]

export function ToolsGrid() {
  return (
    <section id="tools-section" className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Strategic Design Tools</h2>
          <p className="text-muted-foreground mt-4 text-lg leading-8">
            Explore our collection of Domain-Driven Design tools to help you model, understand, and improve your
            business domain.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              status={tool.status}
              href={tool.href}
              exampleHref={tool.exampleHref}
              icon={tool.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

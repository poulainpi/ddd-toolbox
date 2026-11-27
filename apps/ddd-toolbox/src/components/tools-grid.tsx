import { ToolCard } from './tool-card'
import { ArrowUpDown, BarChart3, FileText, MessageSquare, Network, Zap } from 'lucide-react'
import { DOMAIN_STORYTELLING_EXAMPLE_URL } from '@ddd-toolbox/domain-storytelling-constants'
import { EVENT_STORMING_EXAMPLE_URL } from '@ddd-toolbox/event-storming-constants'
import { BOUNDED_CONTEXT_CANVAS_EXAMPLE_URL } from '@ddd-toolbox/bounded-context-canvas-constants'
import { useT } from '@ddd-toolbox/i18n'

const tools = [
  {
    id: 'domain-storytelling',
    titleKey: 'app.tool.domainStorytelling.title' as const,
    descriptionKey: 'app.tool.domainStorytelling.description' as const,
    status: 'available' as const,
    href: '/domain-storytelling',
    exampleHref: DOMAIN_STORYTELLING_EXAMPLE_URL,
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    id: 'event-storming',
    titleKey: 'app.tool.eventStorming.title' as const,
    descriptionKey: 'app.tool.eventStorming.description' as const,
    status: 'available' as const,
    href: '/event-storming',
    exampleHref: EVENT_STORMING_EXAMPLE_URL,
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 'bounded-context-canvas',
    titleKey: 'app.tool.boundedContextCanvas.title' as const,
    descriptionKey: 'app.tool.boundedContextCanvas.description' as const,
    status: 'new-available' as const,
    href: '/bounded-context-canvas',
    exampleHref: BOUNDED_CONTEXT_CANVAS_EXAMPLE_URL,
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: 'context-mapping',
    titleKey: 'app.tool.contextMapping.title' as const,
    descriptionKey: 'app.tool.contextMapping.description' as const,
    status: 'coming-later' as const,
    icon: <Network className="h-6 w-6" />,
  },
  {
    id: 'aggregate-design-canvas',
    titleKey: 'app.tool.aggregateDesignCanvas.title' as const,
    descriptionKey: 'app.tool.aggregateDesignCanvas.description' as const,
    status: 'coming-later' as const,
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    id: 'domain-message-flow',
    titleKey: 'app.tool.domainMessageFlow.title' as const,
    descriptionKey: 'app.tool.domainMessageFlow.description' as const,
    status: 'coming-later' as const,
    icon: <ArrowUpDown className="h-6 w-6" />,
  },
]

export function ToolsGrid() {
  const t = useT()

  return (
    <section id="tools-section" className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{t('app.toolsTitle')}</h2>
          <p className="text-muted-foreground mt-4 text-lg leading-8">{t('app.toolsDescription')}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={t(tool.titleKey)}
              description={t(tool.descriptionKey)}
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

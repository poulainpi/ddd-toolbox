import { Badge, Button } from '@ddd-toolbox/ui'
import { ArrowRight } from 'lucide-react'

interface ToolCardProps {
  title: string
  description: string
  status: 'available' | 'coming-soon'
  href?: string
  icon: React.ReactNode
}

export function ToolCard({ title, description, status, href, icon }: ToolCardProps) {
  const isAvailable = status === 'available'

  const cardContent = (
    <div
      className={`group bg-card relative rounded-lg border p-6 shadow-sm transition-all duration-200 ${
        isAvailable ? 'cursor-pointer hover:border-blue-200 hover:shadow-md' : 'cursor-not-allowed opacity-75'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-shrink-0">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${
              isAvailable ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            {icon}
          </div>
        </div>
        <Badge variant={isAvailable ? 'default' : 'secondary'} className="ml-4">
          {isAvailable ? 'Available' : 'Coming Soon'}
        </Badge>
      </div>

      <div className="mt-4">
        <h3
          className={`text-lg font-semibold ${
            isAvailable ? 'text-foreground group-hover:text-blue-600' : 'text-muted-foreground'
          } transition-colors`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
      </div>

      {isAvailable && (
        <div className="mt-6">
          <Button size="sm" className="w-full" asChild>
            <span>
              Open Tool
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Button>
        </div>
      )}

      {!isAvailable && (
        <div className="mt-6">
          <Button size="sm" variant="secondary" disabled className="w-full">
            Coming Soon
          </Button>
        </div>
      )}
    </div>
  )

  if (isAvailable && href) {
    return (
      <a href={href} className="block">
        {cardContent}
      </a>
    )
  }

  return cardContent
}

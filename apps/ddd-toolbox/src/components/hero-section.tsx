import { Button } from '@ddd-toolbox/ui'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="from-muted/50 to-background relative overflow-hidden bg-gradient-to-b py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl">
            Domain Driven Design
            <span className="text-blue-600"> Toolbox</span>
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            A comprehensive collection of Domain-Driven Design tools to help you model complex business domains,
            facilitate collaborative workshops, and create shared understanding across your organization.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => {
                document.getElementById('tools-section')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
              className="gap-2"
            >
              Start exploring our strategic design tools
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

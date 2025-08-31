import { Button } from '@ddd-toolbox/ui'
import { ThemeToggle } from './theme-toggle'
import { Github } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="DDD Toolbox" className="h-8 w-8" />
          <h2 className="text-foreground text-lg font-semibold">DDD Toolbox</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/poulainpi/ddd-toolbox"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

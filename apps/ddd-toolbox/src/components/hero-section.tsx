import { Button } from '@ddd-toolbox/ui'
import { ChevronDown } from 'lucide-react'
import { useT } from '@ddd-toolbox/i18n'

export function HeroSection() {
  const t = useT()

  return (
    <section className="from-muted/50 to-background relative overflow-hidden bg-gradient-to-b py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl">
            {t('app.heroTitleBefore')}
            <span className="text-blue-600"> {t('app.heroTitleAccent')}</span>
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-8">{t('app.heroDescription')}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => {
                document.getElementById('tools-section')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
              className="gap-2"
            >
              {t('app.heroCta')}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from '@ddd-toolbox/ui'
import { UseFormReturn } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'

type Granularity = 'coarse' | 'fine' | null
type PointInTime = 'asis' | 'tobe' | null
type DomainPurity = 'pure' | 'digitalized' | null

interface StoryNameScopeHelperProps {
  form: UseFormReturn<{ name: string }>
}

export function StoryNameScopeHelper({ form }: StoryNameScopeHelperProps) {
  const [granularity, setGranularity] = useState<Granularity>(null)
  const [pointInTime, setPointInTime] = useState<PointInTime>(null)
  const [domainPurity, setDomainPurity] = useState<DomainPurity>(null)

  const name = form.watch('name')

  useEffect(() => {
    const parts = name.toLowerCase().split('-')
    const lastThreeParts = parts.slice(-3).join('-')

    if (lastThreeParts.includes('coarse')) {
      setGranularity('coarse')
    } else if (lastThreeParts.includes('fine')) {
      setGranularity('fine')
    } else {
      setGranularity(null)
    }

    if (lastThreeParts.includes('asis')) {
      setPointInTime('asis')
    } else if (lastThreeParts.includes('tobe')) {
      setPointInTime('tobe')
    } else {
      setPointInTime(null)
    }

    if (lastThreeParts.includes('pure')) {
      setDomainPurity('pure')
    } else if (lastThreeParts.includes('digitalized')) {
      setDomainPurity('digitalized')
    } else {
      setDomainPurity(null)
    }
  }, [name])

  const updateName = (newGranularity: Granularity, newPointInTime: PointInTime, newDomainPurity: DomainPurity) => {
    const currentName = form.getValues('name')
    const parts = currentName.split('-')

    const scopeKeywords = ['coarse', 'fine', 'pure', 'digitalized', 'asis', 'tobe']

    const titleParts = [...parts]

    for (let i = parts.length - 1; i >= 0 && i >= parts.length - 3; i--) {
      if (scopeKeywords.includes(parts[i].toLowerCase())) {
        titleParts.splice(i, 1)
      }
    }

    const result: string[] = []
    if (titleParts.length > 0) result.push(titleParts.join('-'))
    if (newGranularity) result.push(newGranularity)
    if (newDomainPurity) result.push(newDomainPurity)
    if (newPointInTime) result.push(newPointInTime)

    const newName = result.join('-')
    form.setValue('name', newName)
  }

  const handleGranularityToggle = (value: Granularity) => {
    const newValue = granularity === value ? null : value
    setGranularity(newValue)
    updateName(newValue, pointInTime, domainPurity)
  }

  const handlePointInTimeToggle = (value: PointInTime) => {
    const newValue = pointInTime === value ? null : value
    setPointInTime(newValue)
    updateName(granularity, newValue, domainPurity)
  }

  const handleDomainPurityToggle = (value: DomainPurity) => {
    const newValue = domainPurity === value ? null : value
    setDomainPurity(newValue)
    updateName(granularity, pointInTime, newValue)
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium">Granularity</label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-muted-foreground h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                <strong>Coarse-grained:</strong> High-level overview
                <br />
                <strong>Fine-grained:</strong> Detailed, step-by-step
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Toggle
            pressed={granularity === 'coarse'}
            onPressedChange={() => handleGranularityToggle('coarse')}
            variant="outline"
          >
            Coarse-grained
          </Toggle>
          <Toggle
            pressed={granularity === 'fine'}
            onPressedChange={() => handleGranularityToggle('fine')}
            variant="outline"
          >
            Fine-grained
          </Toggle>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium">Domain Purity</label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-muted-foreground h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                <strong>Pure:</strong> No software systems involved
                <br />
                <strong>Digitalized:</strong> Includes software systems
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Toggle
            pressed={domainPurity === 'pure'}
            onPressedChange={() => handleDomainPurityToggle('pure')}
            variant="outline"
          >
            Pure
          </Toggle>
          <Toggle
            pressed={domainPurity === 'digitalized'}
            onPressedChange={() => handleDomainPurityToggle('digitalized')}
            variant="outline"
          >
            Digitalized
          </Toggle>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium">Point in Time</label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-muted-foreground h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                <strong>As-is:</strong> Current state of the process
                <br />
                <strong>To-be:</strong> Future/desired state
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Toggle
            pressed={pointInTime === 'asis'}
            onPressedChange={() => handlePointInTimeToggle('asis')}
            variant="outline"
          >
            As is
          </Toggle>
          <Toggle
            pressed={pointInTime === 'tobe'}
            onPressedChange={() => handlePointInTimeToggle('tobe')}
            variant="outline"
          >
            To be
          </Toggle>
        </div>
      </div>
    </div>
  )
}

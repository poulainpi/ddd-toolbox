import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Toggle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@ddd-toolbox/ui'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { useState } from 'react'
import { ClassificationCategory, ClassificationValues } from '../shapes/abstract-classification-section-shape-util'

export interface ClassificationDialogProps {
  title: string
  description: string
  categories: ClassificationCategory[]
  disclosure: UseDisclosureReturn
  initialValues: ClassificationValues
  onSave: (values: ClassificationValues) => void
}

export function ClassificationDialog({
  title,
  description,
  categories,
  disclosure,
  initialValues,
  onSave,
}: ClassificationDialogProps) {
  const [values, setValues] = useState<ClassificationValues>(initialValues)

  const handleToggle = (categoryKey: string, option: string, multiSelect: boolean) => {
    if (multiSelect) {
      const currentValues = (values[categoryKey] as string[]) || []
      const newValues = currentValues.includes(option)
        ? currentValues.filter((v) => v !== option)
        : [...currentValues, option]
      setValues({
        ...values,
        [categoryKey]: newValues.length > 0 ? newValues : undefined,
      })
    } else {
      const isPressed = values[categoryKey] === option
      setValues({
        ...values,
        [categoryKey]: isPressed ? undefined : option,
      })
    }
  }

  const isPressed = (categoryKey: string, option: string, multiSelect: boolean): boolean => {
    if (multiSelect) {
      const currentValues = (values[categoryKey] as string[]) || []
      return currentValues.includes(option)
    }
    return values[categoryKey] === option
  }

  const handleSave = () => {
    const savedValues: ClassificationValues = {}

    categories.forEach((category) => {
      const value = values[category.key]
      savedValues[category.key] = value

      if (category.multiSelect) {
        const selectedValues = (value as string[]) || []
        if (selectedValues.includes('other')) {
          savedValues[category.customKey] = values[category.customKey]
        } else {
          savedValues[category.customKey] = undefined
        }
      } else {
        if (value === 'other') {
          savedValues[category.customKey] = values[category.customKey]
        } else {
          savedValues[category.customKey] = undefined
        }
      }
    })

    onSave(savedValues)
    disclosure.close()
  }

  return (
    <Dialog open={disclosure.isOpen} onOpenChange={disclosure.setIsOpen}>
      <DialogContent className="max-w-xl">
        <div tabIndex={0} className="h-0 w-0 overflow-hidden outline-none" />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <TooltipProvider delayDuration={0}>
          <div className="space-y-6 py-4">
            {categories.map((category) => {
              const value = values[category.key]
              const hasOther = category.multiSelect ? ((value as string[]) || []).includes('other') : value === 'other'

              return (
                <div key={category.key} className="space-y-3">
                  <Label className="text-base font-semibold">{category.label}</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {category.options.map((option) => (
                      <Tooltip key={option}>
                        <TooltipTrigger asChild>
                          <div>
                            <Toggle
                              variant="outline"
                              pressed={isPressed(category.key, option, category.multiSelect)}
                              onPressedChange={() => handleToggle(category.key, option, category.multiSelect)}
                            >
                              {category.labels[option]}
                            </Toggle>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{category.descriptions[option]}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  {hasOther && (
                    <Input
                      placeholder={`Enter custom ${category.label.toLowerCase()}`}
                      value={(values[category.customKey] as string) || ''}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [category.customKey]: e.target.value,
                        })
                      }
                      className="mt-2"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </TooltipProvider>

        <DialogFooter>
          <Button variant="outline" onClick={() => disclosure.setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

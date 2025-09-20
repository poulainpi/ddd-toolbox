import { Editor, StateNode, useEditor, useValue } from 'tldraw'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ddd-toolbox/ui'
import { LoadableIcon } from '@ddd-toolbox/ui-loadable-icon'
import { cn } from '@ddd-toolbox/util'
import { IconName } from 'lucide-react/dynamic'
import { ReactNode } from 'react'

export interface Shape {
  icon: string
  color?: string
  tooltip?: string
  setCurrentTool: (editor: Editor) => void
}

export interface ShapeGroup {
  id: string
  shapes: Shape[]
}

export interface ShapesPanelProps {
  shapeGroups: ShapeGroup[]
  isVisible?: boolean
  bottomComponent?: ReactNode
  isToolSelected: (shape: Shape, currentSelectedTool: StateNode) => boolean
}

export function ShapesPanel({ shapeGroups, isVisible = true, bottomComponent, isToolSelected }: ShapesPanelProps) {
  const editor = useEditor()
  const currentSelectedTool = useValue('current tool', () => editor.getCurrentTool(), [editor])

  if (!isVisible) return null

  return (
    <TooltipProvider>
      <div className="bg-background absolute top-16 left-4 z-[300] rounded-md shadow-md">
        <div className={cn('bg-muted/50 p-2', bottomComponent && 'pb-11')}>
          <div className="flex h-full flex-col divide-y">
            {shapeGroups.map((group) => (
              <div key={group.id} className="grid grid-cols-2 content-start justify-items-center gap-1 py-1">
                {group.shapes.map((shape) => (
                  <ShapeButton
                    key={shape.icon + shape.color}
                    shape={shape}
                    currentSelectedTool={currentSelectedTool}
                    isToolSelected={isToolSelected}
                  />
                ))}
              </div>
            ))}

            {bottomComponent}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function ShapeButton({
  shape,
  currentSelectedTool,
  isToolSelected,
}: {
  shape: Shape
  currentSelectedTool?: StateNode
  isToolSelected: (shape: Shape, currentSelectedTool: StateNode) => boolean
}) {
  const editor = useEditor()

  const selected = currentSelectedTool != null && isToolSelected(shape, currentSelectedTool)
  const textColorClass = shape.color || ''

  const button = (
    <Button
      variant={selected ? undefined : 'ghost'}
      size="icon"
      className={cn('[&_svg]:size-6', ...(selected ? [] : ['text-foreground']))}
      onClick={() => {
        editor.setCurrentTool('select') // just to make change domain object tool to another domain object tool working
        shape.setCurrentTool(editor)
      }}
    >
      <LoadableIcon name={shape.icon as IconName} className={textColorClass} />
    </Button>
  )

  if (shape.tooltip) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{shape.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

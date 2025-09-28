import { Editor, StateNode, useEditor, useReadonly, useValue } from 'tldraw'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ddd-toolbox/ui'
import { cn } from '@ddd-toolbox/util'
import { ReactNode } from 'react'

export interface Shape {
  component: ReactNode
  tooltip?: string
  setCurrentTool: (editor: Editor) => void
}

export interface ShapeGroup {
  id: string
  shapes: Shape[]
}

export interface ShapesPanelProps {
  shapeGroups: ShapeGroup[]
  bottomComponent?: ReactNode
  isToolSelected: (shape: Shape, currentSelectedTool: StateNode) => boolean
}

export function ShapesPanel({ shapeGroups, bottomComponent, isToolSelected }: ShapesPanelProps) {
  const editor = useEditor()
  const currentSelectedTool = useValue('current tool', () => editor.getCurrentTool(), [editor])
  const isReadOnlyMode = useReadonly()

  if (isReadOnlyMode) return null

  return (
    <TooltipProvider>
      <div className="bg-background absolute top-16 left-4 z-[300]">
        <div className={cn('bg-muted/50 rounded-md p-2 shadow-md', bottomComponent && 'pb-11')}>
          <div className="flex h-full flex-col divide-y">
            {shapeGroups.map((group) => (
              <div key={group.id} className="grid grid-cols-2 content-start justify-items-center gap-1 py-1">
                {group.shapes.map((shape, index) => (
                  <ShapeButton
                    key={`${group.id}-${index}`}
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
      {shape.component}
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

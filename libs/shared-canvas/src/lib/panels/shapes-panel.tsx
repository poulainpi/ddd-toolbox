import { StateNode, useEditor, useValue } from 'tldraw'
import { Button } from '@ddd-toolbox/ui'
import { LoadableIcon } from '@ddd-toolbox/ui-loadable-icon'
import { cn } from '@ddd-toolbox/util'
import { IconName } from 'lucide-react/dynamic'
import { ReactNode } from 'react'

export interface Shape {
  icon: string
  toolType: string
  color?: string
}

export interface ShapeGroup {
  id: string
  shapes: Shape[]
}

export interface ShapesPanelProps {
  shapeGroups: ShapeGroup[]
  isVisible?: boolean
  customization?: ReactNode
  isToolSelected: (shape: Shape, currentSelectedTool: StateNode) => boolean
}

export function ShapesPanel({ shapeGroups, isVisible = true, customization, isToolSelected }: ShapesPanelProps) {
  const editor = useEditor()
  const currentSelectedTool = useValue('current tool', () => editor.getCurrentTool(), [editor])

  if (!isVisible) return null

  return (
    <div className="bg-background absolute top-16 left-4 z-[300] min-h-56 rounded-md shadow-md">
      <div className="bg-muted/50 p-2 pb-11">
        <div className="flex h-full flex-col divide-y">
          {shapeGroups.map((group) => (
            <div key={group.id} className="grid grid-cols-2 content-start justify-items-center gap-1 py-1">
              {group.shapes.map((shape) => (
                <ShapeButton
                  key={shape.icon}
                  shape={shape}
                  currentSelectedTool={currentSelectedTool}
                  isToolSelected={isToolSelected}
                />
              ))}
            </div>
          ))}

          {customization}
        </div>
      </div>
    </div>
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
  const iconStyle = shape.color ? { color: shape.color } : {}

  return (
    <Button
      variant={selected ? undefined : 'ghost'}
      size="icon"
      className={cn('[&_svg]:size-6', ...(selected ? [] : ['text-foreground']))}
      onClick={() => {
        editor.setCurrentTool('select') // just to make change domain object tool to another domain object tool working
        editor.setCurrentTool(shape.toolType, { icon: shape.icon, color: shape.color })
      }}
    >
      <LoadableIcon name={shape.icon as IconName} style={iconStyle} />
    </Button>
  )
}

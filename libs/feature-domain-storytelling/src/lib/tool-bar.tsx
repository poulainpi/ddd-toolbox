import { track, useEditor, useReadonly } from 'tldraw'
import { cn } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui/lib/ui/button'
import { EraserIcon, HandIcon, MousePointerClickIcon, MousePointerIcon, PenIcon, TypeIcon } from 'lucide-react'

const tools = [
  { id: 'select', icon: <MousePointerIcon />, usableInReadOnly: true },
  { id: 'hand', icon: <HandIcon />, usableInReadOnly: true },
  { id: 'draw', icon: <PenIcon />, usableInReadOnly: false },
  { id: 'eraser', icon: <EraserIcon />, usableInReadOnly: false },
  { id: 'text', icon: <TypeIcon />, usableInReadOnly: false },
  { id: 'laser', icon: <MousePointerClickIcon />, usableInReadOnly: true },
]

export const ToolBar = track(function ToolBar() {
  const editor = useEditor()
  const currentTool = editor.getCurrentTool()
  const isReadonlyMode = useReadonly()

  return (
    <div className="absolute bg-background rounded-md shadow-md bottom-2 left-1/2 -translate-x-1/2 p-2 z-[300] flex gap-1">
      {tools
        .filter((tool) => !isReadonlyMode || tool.usableInReadOnly)
        .map((tool, index) => {
          const isToolSelected = currentTool.id === tool.id

          return (
            <Button
              key={index}
              variant={isToolSelected ? undefined : 'ghost'}
              size="icon"
              className={cn('[&_svg]:size-6', ...(isToolSelected ? [] : ['text-foreground']))}
              onClick={() => editor.setCurrentTool(tool.id)}
            >
              {tool.icon}
            </Button>
          )
        })}
    </div>
  )
})

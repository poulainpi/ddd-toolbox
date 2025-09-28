import { track, useEditor, useReadonly } from 'tldraw'
import { cn } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui'
import {
  EraserIcon,
  HandIcon,
  MousePointerClickIcon,
  MousePointerIcon,
  MoveUpRightIcon,
  PenIcon,
  TypeIcon,
} from 'lucide-react'
import { ReactNode } from 'react'

const tools = [
  { id: 'select', icon: <MousePointerIcon />, usableInReadOnly: true },
  { id: 'hand', icon: <HandIcon />, usableInReadOnly: true },
  { id: 'arrow', icon: <MoveUpRightIcon />, usableInReadOnly: false },
  { id: 'draw', icon: <PenIcon />, usableInReadOnly: false },
  { id: 'eraser', icon: <EraserIcon />, usableInReadOnly: false },
  { id: 'text', icon: <TypeIcon />, usableInReadOnly: false },
  { id: 'laser', icon: <MousePointerClickIcon />, usableInReadOnly: true },
]

export interface ToolBarProps {
  additionalTools?: ReactNode[]
  hiddenTools?: string[]
}

export const ToolBar = track(function ToolBar({ additionalTools = [], hiddenTools = [] }: ToolBarProps) {
  const editor = useEditor()
  const currentTool = editor.getCurrentTool()
  const isReadonlyMode = useReadonly()

  return (
    <div className="bg-background absolute bottom-2 left-1/2 z-[300] -translate-x-1/2">
      <div className="bg-muted/50 flex divide-x rounded-md p-2 shadow-md">
        <div className={cn('flex gap-1', additionalTools.length > 0 && 'pr-2')}>
          {tools
            .filter((tool) => (!isReadonlyMode || tool.usableInReadOnly) && !hiddenTools.includes(tool.id))
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

        {additionalTools.map((toolSection, index) => (
          <div key={index} className="flex items-center gap-1 pl-2">
            {toolSection}
          </div>
        ))}
      </div>
    </div>
  )
})

import { track, useEditor, useReadonly } from 'tldraw'
import { cn } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui'
import {
  EraserIcon,
  HandIcon,
  MousePointerClickIcon,
  MousePointerIcon,
  PenIcon,
  PlayIcon,
  SquareIcon,
  StepBackIcon,
  StepForwardIcon,
  TypeIcon,
} from 'lucide-react'
import { useStoryPlay } from './states/use-story-play'
import { ReactElement } from 'react'

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
  const { isPlaying, currentStep, stepsCount, stepBackward, stepForward, play, stop } = useStoryPlay()

  return (
    <div className="absolute bg-background rounded-md shadow-md bottom-2 left-1/2 -translate-x-1/2 z-[300]">
      <div className="bg-muted/50 flex divide-x p-2">
        <div className="flex gap-1 pr-2">
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

        <div className="flex items-center gap-1 pl-2">
          {isPlaying ? (
            <>
              <StoryButton Icon={<StepBackIcon />} onClick={stepBackward} />
              <StoryButton Icon={<StepForwardIcon />} onClick={stepForward} />
              <StoryButton Icon={<SquareIcon />} onClick={stop} />
              <div className="text-foreground text-lg w-16 text-center">
                {currentStep} / {stepsCount}
              </div>
            </>
          ) : (
            <StoryButton Icon={<PlayIcon />} onClick={play} />
          )}
        </div>
      </div>
    </div>
  )
})

function StoryButton({ Icon, onClick }: { Icon: ReactElement; onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="[&_svg]:size-6 text-foreground" onClick={onClick}>
      {Icon}
    </Button>
  )
}

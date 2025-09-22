import { ToolBar as SharedToolBar } from '@ddd-toolbox/shared-canvas'
import { Button } from '@ddd-toolbox/ui'
import { PlayIcon, SquareIcon, StepBackIcon, StepForwardIcon } from 'lucide-react'
import { useStoryPlay } from './states/use-story-play'
import { ReactElement } from 'react'

function StoryPlaybackTools() {
  const { isPlaying, currentStep, stepsCount, stepBackward, stepForward, play, stop } = useStoryPlay()

  if (isPlaying) {
    return (
      <>
        <StoryButton Icon={<StepBackIcon />} onClick={stepBackward} />
        <StoryButton Icon={<StepForwardIcon />} onClick={stepForward} />
        <StoryButton Icon={<SquareIcon />} onClick={stop} />
        <div className="text-foreground w-16 text-center text-lg">
          {currentStep} / {stepsCount}
        </div>
      </>
    )
  }

  return <StoryButton Icon={<PlayIcon />} onClick={play} />
}

function StoryButton({ Icon, onClick }: { Icon: ReactElement; onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="text-foreground [&_svg]:size-6" onClick={onClick}>
      {Icon}
    </Button>
  )
}

export function ToolBar() {
  return <SharedToolBar additionalTools={[<StoryPlaybackTools />]} hiddenTools={['arrow']} />
}

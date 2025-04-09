import { track } from 'tldraw'
import { PlayIcon, SquareIcon, StepBackIcon, StepForwardIcon } from 'lucide-react'
import { Button } from '@ddd-toolbox/ui'
import { ReactElement } from 'react'
import { useStoryPlay } from './states/use-story-play'

export const PlayStoryZone = track(function PlayStoryZone() {
  const { isPlaying, currentStep, stepsCount, stepBackward, stepForward, play, stop } = useStoryPlay()

  return (
    <div className="absolute w-52 bg-muted/50 rounded-md shadow-md top-4 right-48 p-2 z-[300] flex items-center">
      {isPlaying ? (
        <>
          <StoryButton Icon={<StepBackIcon />} onClick={stepBackward} />
          <StoryButton Icon={<StepForwardIcon />} onClick={stepForward} />
          <StoryButton Icon={<SquareIcon />} onClick={stop} />
          <div className="text-foreground text-lg ml-2">
            {currentStep} / {stepsCount}
          </div>
        </>
      ) : (
        <StoryButton Icon={<PlayIcon />} onClick={play} />
      )}
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

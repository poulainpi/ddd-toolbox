import { track, useEditor } from 'tldraw'
import { PlayIcon, SquareIcon, StepBackIcon, StepForwardIcon } from 'lucide-react'
import { Button } from '@ddd-toolbox/ui/lib/ui/button'
import { PlayStoryToolUtil } from './tools/play-story-tool-util'
import { ReactElement } from 'react'

export const PlayStoryZone = track(function PlayStroryZone() {
  const editor = useEditor()
  const currentTool = editor.getCurrentTool()
  const isStoryPlaying = currentTool instanceof PlayStoryToolUtil

  return (
    <div className="absolute w-36 bg-background rounded-md shadow-md top-4 right-48 p-2 z-[300]">
      {isStoryPlaying && (
        <>
          <StoryButton Icon={<StepBackIcon />} onClick={() => (currentTool as PlayStoryToolUtil).stepBackward()} />
          <StoryButton Icon={<StepForwardIcon />} onClick={() => (currentTool as PlayStoryToolUtil).stepForward()} />
        </>
      )}

      <StoryButton
        Icon={isStoryPlaying ? <SquareIcon /> : <PlayIcon />}
        onClick={() => {
          editor.setCurrentTool(isStoryPlaying ? 'select' : PlayStoryToolUtil.id)
        }}
      />
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

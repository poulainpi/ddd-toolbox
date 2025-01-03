import { Atom, track, useEditor } from 'tldraw'
import { PlayIcon, SquareIcon, StepBackIcon, StepForwardIcon } from 'lucide-react'
import { Button } from '@ddd-toolbox/ui/lib/ui/button'
import { PlayStoryToolUtil } from './tools/play-story-tool-util'
import { ReactElement } from 'react'

export const PlayStoryZone = track(function PlayStoryZone({
  storyChangedUpdater,
}: {
  storyChangedUpdater: Atom<number, unknown>
}) {
  const editor = useEditor()
  const currentTool = editor.getCurrentTool()
  const isStoryPlaying = currentTool instanceof PlayStoryToolUtil
  storyChangedUpdater.get()

  return (
    <div className="absolute w-52 bg-muted/50 rounded-md shadow-md top-4 right-48 p-2 z-[300] flex items-center">
      {isStoryPlaying ? (
        <>
          <StoryButton Icon={<StepBackIcon />} onClick={() => (currentTool as PlayStoryToolUtil).stepBackward()} />
          <StoryButton Icon={<StepForwardIcon />} onClick={() => (currentTool as PlayStoryToolUtil).stepForward()} />
          <StoryButton
            Icon={<SquareIcon />}
            onClick={() => {
              editor.setCurrentTool('select')
            }}
          />
          <div className="text-foreground text-lg ml-2">
            {currentTool.getCurrentStep()} / {currentTool.getStepsCount()}
          </div>
        </>
      ) : (
        <StoryButton
          Icon={<PlayIcon />}
          onClick={() => {
            editor.setCurrentTool(PlayStoryToolUtil.id)
          }}
        />
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

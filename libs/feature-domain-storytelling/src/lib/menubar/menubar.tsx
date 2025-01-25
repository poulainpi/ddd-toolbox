import { track, useEditor } from 'tldraw'
import { AppMenu } from './app-menu'
import { ChangeStoryNameDialog } from './change-story-name-dialog'
import { useDisclosure } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui'
import { useStoryName } from '../states/use-story-name'
import { useStoryPersistance } from '../states/use-story-persistance'
import { SaveIcon } from 'lucide-react'

export const Menubar = track(function Menubar() {
  const editor = useEditor()
  const { storyName } = useStoryName()
  const nameStoryDisclosure = useDisclosure()
  const renameStoryDisclosure = useDisclosure()
  const { latestChangesSaved, save } = useStoryPersistance()

  function newStory() {
    editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
    nameStoryDisclosure.open()
  }

  return (
    <div className="absolute top-0 left-0 bg-muted/50 p-1 flex items-center gap-1">
      <AppMenu newStory={newStory} />
      <Button variant="ghost" size="sm" onClick={renameStoryDisclosure.open}>
        {storyName}
      </Button>

      <ChangeStoryNameDialog disclosure={nameStoryDisclosure} isNewStory={true} />
      <ChangeStoryNameDialog disclosure={renameStoryDisclosure} isNewStory={false} />

      <Button variant="ghost" size="icon" onClick={save} disabled={latestChangesSaved}>
        <SaveIcon />
      </Button>
    </div>
  )
})

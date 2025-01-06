import { track, useEditor } from 'tldraw'
import { AppMenu } from './app-menu'
import { ChangeStoryNameDialog } from './change-story-name-dialog'
import { useDisclosure } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui'
import { useStoryName } from '../states/use-story-name'

export const Menubar = track(function Menubar() {
  const editor = useEditor()
  const { storyName } = useStoryName()
  const nameStoryDisclosure = useDisclosure()
  const renameStoryDisclosure = useDisclosure()

  function newStory() {
    editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
    nameStoryDisclosure.open()
  }

  return (
    <div className="absolute top-0 left-0 bg-muted/50 p-1 pr-3 flex items-center gap-1">
      <AppMenu newStory={newStory} />
      <Button variant="ghost" size="sm" onClick={renameStoryDisclosure.open}>
        {storyName}
      </Button>
      <ChangeStoryNameDialog disclosure={nameStoryDisclosure} isNewStory={true} />
      <ChangeStoryNameDialog disclosure={renameStoryDisclosure} isNewStory={false} />
    </div>
  )
})

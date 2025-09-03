import { track, useEditor } from 'tldraw'
import { AppMenu } from './app-menu'
import { ChangeStoryNameDialog } from './change-story-name-dialog'
import { useDisclosure } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui'
import { useDocumentName } from '@ddd-toolbox/shared-canvas'
import { useDocumentPersistence } from '@ddd-toolbox/shared-canvas'
import { SaveIcon } from 'lucide-react'
import { DiscardChangesAlertDialog } from '@ddd-toolbox/shared-canvas'

export const Menubar = track(function Menubar() {
  const editor = useEditor()
  const { documentName } = useDocumentName()
  const nameStoryDisclosure = useDisclosure()
  const renameStoryDisclosure = useDisclosure()
  const confirmDiscardChangesDisclosure = useDisclosure()
  const { latestChangesSaved, save, clear: clearPersistence } = useDocumentPersistence()

  function newStory() {
    if (latestChangesSaved || editor.getCurrentPageShapes().length === 0) {
      discardAllAndCreateNewStory()
    } else {
      askToDiscardChanges()
    }
  }

  function askToDiscardChanges() {
    confirmDiscardChangesDisclosure.open()
  }

  function discardAllAndCreateNewStory() {
    editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
    clearPersistence()
    nameStoryDisclosure.open()
  }

  return (
    <div className="bg-background absolute top-0 left-0">
      <div className="bg-muted/50 flex items-center gap-1 p-1">
        <AppMenu newStory={newStory} />
        <Button variant="ghost" size="sm" onClick={renameStoryDisclosure.open}>
          {documentName}
        </Button>

        <ChangeStoryNameDialog disclosure={nameStoryDisclosure} isNewStory={true} />
        <ChangeStoryNameDialog disclosure={renameStoryDisclosure} isNewStory={false} />

        <Button variant="ghost" size="icon" onClick={save} disabled={latestChangesSaved}>
          <SaveIcon />
        </Button>

        <DiscardChangesAlertDialog
          disclosure={confirmDiscardChangesDisclosure}
          onConfirm={discardAllAndCreateNewStory}
        />
      </div>
    </div>
  )
})

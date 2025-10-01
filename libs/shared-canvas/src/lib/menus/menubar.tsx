import { track, useEditor } from 'tldraw'
import { useDisclosure, UseDisclosureReturn } from '@ddd-toolbox/util'
import { Button } from '@ddd-toolbox/ui'
import { useDocumentName } from '../hooks/use-document-name'
import { useDocumentPersistence } from '../hooks/use-document-persistence'
import { SaveIcon } from 'lucide-react'
import { DiscardChangesAlertDialog } from '../dialogs/discard-changes-alert-dialog'
import { events, NEW_DOCUMENT_CREATED } from '../states/events'
import { PagesMenu } from './pages-menu'

export interface MenubarProps {
  AppMenuComponent: React.ComponentType<{ newDocument: () => void }>
  ChangeDocumentNameDialogComponent: React.ComponentType<{
    disclosure: UseDisclosureReturn
    isNew: boolean
  }>
  ChangePageNameDialogComponent: React.ComponentType<{
    disclosure: UseDisclosureReturn
    isNew: boolean
  }>
  pagesMenuLabel?: string
}

export const Menubar = track(function Menubar({
  AppMenuComponent,
  ChangeDocumentNameDialogComponent,
  ChangePageNameDialogComponent,
  pagesMenuLabel,
}: MenubarProps) {
  const editor = useEditor()
  const { documentName } = useDocumentName()
  const nameDocumentDisclosure = useDisclosure()
  const renameDocumentDisclosure = useDisclosure()
  const confirmDiscardChangesDisclosure = useDisclosure()
  const { latestChangesSaved, save, clear: clearPersistence } = useDocumentPersistence()

  function newDocument() {
    if (latestChangesSaved || editor.getCurrentPageShapes().length === 0) {
      discardAllAndCreateNewDocument()
    } else {
      askToDiscardChanges()
    }
  }

  function askToDiscardChanges() {
    confirmDiscardChangesDisclosure.open()
  }

  function discardAllAndCreateNewDocument() {
    editor.loadSnapshot({ schema: editor.store.schema.serialize(), store: {} })
    editor.clearHistory()
    void events.emit(NEW_DOCUMENT_CREATED)
    clearPersistence()
    nameDocumentDisclosure.open()
  }

  return (
    <div className="bg-background absolute top-0 left-0">
      <div className="bg-muted/50 flex items-center gap-1 p-1">
        <AppMenuComponent newDocument={newDocument} />
        <Button variant="ghost" size="sm" onClick={renameDocumentDisclosure.open}>
          {documentName}
        </Button>
        <span className="text-muted-foreground">/</span>
        <PagesMenu ChangePageNameDialogComponent={ChangePageNameDialogComponent} label={pagesMenuLabel} />

        <ChangeDocumentNameDialogComponent disclosure={nameDocumentDisclosure} isNew={true} />
        <ChangeDocumentNameDialogComponent disclosure={renameDocumentDisclosure} isNew={false} />

        <Button variant="ghost" size="icon" onClick={save} disabled={latestChangesSaved}>
          <SaveIcon />
        </Button>

        <DiscardChangesAlertDialog
          disclosure={confirmDiscardChangesDisclosure}
          onConfirm={discardAllAndCreateNewDocument}
        />
      </div>
    </div>
  )
})

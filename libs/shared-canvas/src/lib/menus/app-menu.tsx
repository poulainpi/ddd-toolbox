import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@ddd-toolbox/ui'
import {
  getUserPreferences,
  setUserPreferences,
  TLUserPreferences,
  useEditor,
  useValue,
  getSnapshot,
  useReadonly,
} from 'tldraw'
import { compressToEncodedURIComponent } from 'lz-string'
import {
  ArrowLeftIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileDownIcon,
  FilePlusIcon,
  FolderIcon,
  GithubIcon,
  ImageDownIcon,
  LightbulbIcon,
  LinkIcon,
  MenuIcon,
  MonitorSpeakerIcon,
  SettingsIcon,
  SunMoonIcon,
} from 'lucide-react'
import { useDocumentPersistence } from '../hooks/use-document-persistence'
import { useDisclosure } from '@ddd-toolbox/util'
import { DiscardChangesAlertDialog } from '../dialogs/discard-changes-alert-dialog'
import { useDocumentName } from '../hooks/use-document-name'
import { toast } from 'sonner'

export interface AppMenuProps {
  newDocument: () => void
  newDocumentLabel?: string
  exampleHref?: string
}

export function AppMenu({ newDocument, newDocumentLabel = 'New document', exampleHref }: AppMenuProps) {
  const editor = useEditor()
  const gridModeActivated = useValue('grid mode activated', () => editor.getInstanceState().isGridMode, [])
  const isReadonlyMode = useReadonly()
  const userPreferences = useValue('user preferences', getUserPreferences, [])
  const theme = userPreferences.colorScheme ?? 'system'
  const { latestChangesSaved, open, saveAs } = useDocumentPersistence()
  const confirmDiscardChangesDisclosure = useDisclosure()
  const { documentName } = useDocumentName()

  function changeUserPreferences(newPreferences: Partial<TLUserPreferences>) {
    setUserPreferences({
      ...getUserPreferences(),
      ...newPreferences,
    })
  }

  function togglePresentationMode() {
    editor.updateInstanceState({ isReadonly: !isReadonlyMode })
  }

  function checkUnsavedChangesAndOpen() {
    if (latestChangesSaved || editor.getCurrentPageShapes().length === 0) {
      open()
    } else {
      confirmDiscardChangesDisclosure.open()
    }
  }

  function validateCanvasForExport() {
    const shapeIds = editor.getCurrentPageShapeIds()
    if (shapeIds.size === 0) {
      showEmptyCanvasToast()
      return null
    }
    return [...shapeIds]
  }

  function showEmptyCanvasToast() {
    toast.error('Cannot export empty canvas', {
      description: 'Please add some shapes to the canvas before exporting.',
    })
  }

  function downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  async function exportAsSvg() {
    try {
      const shapeIds = validateCanvasForExport()
      if (!shapeIds) return

      const result = await editor.getSvgString(shapeIds, {
        background: true,
        padding: 10,
        scale: 1,
      })

      if (!result) {
        throw new Error('Failed to generate SVG')
      }

      const blob = new Blob([result.svg], { type: 'image/svg+xml' })
      downloadFile(blob, `${documentName}-${Date.now()}.svg`)
    } catch (error) {
      console.error('Failed to export SVG:', error)
      toast.error('Export failed', {
        description: 'Failed to export SVG. Please try again.',
      })
    }
  }

  async function exportAsPng() {
    try {
      const shapeIds = validateCanvasForExport()
      if (!shapeIds) return

      const result = await editor.toImage(shapeIds, {
        format: 'png',
        background: true,
        padding: 10,
        scale: 1,
        quality: 1,
      })

      if (!result) {
        throw new Error('Failed to generate PNG')
      }

      downloadFile(result.blob, `${documentName}-${Date.now()}.png`)
    } catch (error) {
      console.error('Failed to export PNG:', error)
      toast.error('Export failed', {
        description: 'Failed to export PNG. Please try again.',
      })
    }
  }

  async function exportAsLink() {
    try {
      const snapshot = getSnapshot(editor.store)
      const documentData = JSON.stringify(snapshot.document)
      const compressedData = compressToEncodedURIComponent(documentData)

      const currentUrl = new URL(window.location.href)
      currentUrl.hash = `initialDocument=${compressedData}`

      await navigator.clipboard.writeText(currentUrl.toString())

      toast.success('Link copied to clipboard', {
        description: 'Share this link to let others view your document.',
      })
    } catch (error) {
      console.error('Failed to export as link:', error)
      toast.error('Export failed', {
        description: 'Failed to create shareable link. Please try again.',
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href="/">
                <ArrowLeftIcon />
                Back to toolbox
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={checkUnsavedChangesAndOpen}>
              <FolderIcon />
              <span>Open</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={saveAs}>
              <FileDownIcon />
              <span>Save to...</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DownloadIcon />
                <span>Export</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={exportAsSvg}>
                    <ImageDownIcon />
                    <span>SVG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsPng}>
                    <ImageDownIcon />
                    <span>PNG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsLink}>
                    <LinkIcon />
                    <span>Link to share</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={newDocument}>
              <FilePlusIcon />
              <span>{newDocumentLabel}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon />
              <span>Settings</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={userPreferences.isSnapMode || false}
                  onCheckedChange={() => changeUserPreferences({ isSnapMode: !userPreferences.isSnapMode })}
                  closeOnSelect={false}
                >
                  Always snap
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={gridModeActivated}
                  onCheckedChange={() => editor.updateInstanceState({ isGridMode: !gridModeActivated })}
                  closeOnSelect={false}
                >
                  Show grid
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunMoonIcon />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(newTheme) =>
                      changeUserPreferences({
                        colorScheme: newTheme as TLUserPreferences['colorScheme'],
                      })
                    }
                  >
                    <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={togglePresentationMode}>
              <MonitorSpeakerIcon />
              <span>{isReadonlyMode ? 'Exit' : 'Enter'} Presentation Mode</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {exampleHref && (
              <DropdownMenuItem asChild>
                <a href={exampleHref} target="_blank" rel="noreferrer">
                  <LightbulbIcon />
                  View Example
                  <ExternalLinkIcon className="ml-auto" />
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <a href="https://github.com/poulainpi/ddd-toolbox" target="_blank" rel="noopener noreferrer">
                <GithubIcon />
                GitHub
                <ExternalLinkIcon className="ml-auto" />
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DiscardChangesAlertDialog disclosure={confirmDiscardChangesDisclosure} onConfirm={open} />
    </>
  )
}

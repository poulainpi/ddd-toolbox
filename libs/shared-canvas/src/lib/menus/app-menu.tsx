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
import { getUserPreferences, setUserPreferences, TLUserPreferences, useEditor, useValue } from 'tldraw'
import {
  ArrowLeftIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FilePlusIcon,
  FolderIcon,
  GithubIcon,
  ImageDownIcon,
  MenuIcon,
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
}

export function AppMenu({ newDocument, newDocumentLabel = 'New document' }: AppMenuProps) {
  const editor = useEditor()
  const gridModeActivated = useValue('grid mode activated', () => editor.getInstanceState().isGridMode, [])
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
            <DropdownMenuItem>
              <ArrowLeftIcon />
              <a href="/">Back to toolbox</a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={checkUnsavedChangesAndOpen}>
              <FolderIcon />
              <span>Open</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={saveAs}>
              <DownloadIcon />
              <span>Save to...</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ImageDownIcon />
                <span>Export image</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={exportAsSvg}>
                    <span>SVG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsPng}>
                    <span>PNG</span>
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
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <GithubIcon />
              <a href="https://github.com/poulainpi/ddd-toolbox" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <ExternalLinkIcon className="ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DiscardChangesAlertDialog disclosure={confirmDiscardChangesDisclosure} onConfirm={open} />
    </>
  )
}

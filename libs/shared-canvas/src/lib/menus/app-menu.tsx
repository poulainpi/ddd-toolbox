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
import { getUserPreferences, setUserPreferences, TLUserPreferences, useEditor, useValue, getSnapshot } from 'tldraw'
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

  async function exportAsLink() {
    try {
      const shapeIds = validateCanvasForExport()
      if (!shapeIds) return

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
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LightbulbIcon />
              <a
                href="/domain-storytelling#initialDocument=N4KAkARALgngDgUwgLgAQQQDwMYEMA2AlgCYDOuBdUAzVEANgIYDC+kAH1QFa5kQ3DLAEM8YEQAMjAJoBOFQF06TAEzoQ3aAE1B%2BgK4YWEGNgBW%2BGAEEMy5YrHTIXGOkwtlCLYgBKeABauEEQeAMxQJL4KShBqmtr6AO5EXgDWTt6%2BSP5B1nY6jpp5IIlIqBAATEVlAL6M6VU4bgEhpCDRRABmpQC%2BnOaFTRAERAHhBdAYECCo5sNlrKiIrOjsIkQA7kMhxJ4ixLOLBD6Mf%2F4A4usYm6izO8sEI2Mz8zR7fktPT2%2BOdPf4MK3uLH2w2Iq3qUJhu3qfQBJBAR1%2BQxGr3Rh1OIJaTFWOBauwAzKsrCtGshNFt0Bsth0qeCCUZjHt6kNRhT0TslnVsYkxvIZrjacDmeDNjSKS1EQFxotrPCtmNKUK2QcTic7tyQQ1Hg8Yo1nm9Pt95rtFoDBRCBSqhRKNsrGg7dVzGdreWdlaDNe1tYbEQD3Y7dWKPV73Z6PdMfX6-QGg34Q-7I9HYwmG2Gm%2B6O1G03bM4XBVXK2LS-Xqz1m8XJaGOy2u7H%2B6nBmNekRxjl%2FpNc0MLlMrHZ7M5f1ZK8uV9P51W68Oy%2B4E5ul6O03vN4vt8fLTe7w%2Bty-3p-dz97pPF2-f%2BjB8Gh0O1yOR0eF2eHwdvq%2B%2F0B1-9d2-N7e-7%2B3%2Bg59vmeZbkeNPgLb6M%2B9C%2Bqev4vkGQEnmuF4TnBAELsuJ5TlOe6vtOWFzrB8HoUhOH3nhBHYV%2B5Fru%2BN74ehv4Af%2BoEQfOsGMahKEnoRlFrmhRHzkR9EYXhTF0bu5H0SujHyYxk5iUJgkUYum5eF4V79sDfaZP2pSDrZenDhS9mOY5p4XlWHn1tuz6VjWGntq5o6bsOBnflCPJOUF9kBbJ%2B6Ba%2BPmhfC3kxZFQWec59kJSlTmpflMEpZlCUuSWpVJelSWZRlZYlR1sKVYl8U1f5nX%2BTl4UNXFTV1TF5WOVVxIJU1dUdR1WW9U5-VZQ1SUtZ1PUNQN42jaN40TUNJWzW1i3hStGVrZF21pbtu35RdPUXSVl1HdNoN9QdV1g-9zVXVNr3TaTd2nYTpOQ%2BT5OOVToNs6z73Y19IP01T13a9jOPsz95Nc8r6NQ6jzPCyTXOKzz8Pc2bYsm2bJsJQNptWzrTt6w7Jtu7rFvY7rlt207VsOybCNu8bds%2B0rGtu3Lhu%2B0bBs%2By7ftu5rrt2%2Brrvu%2BbNOezrbs%2B-r3te0bru6yrcf6wbXtR3bOteybNsu3LHsxy7jvW%2Bbvse1bdNu9b3vhwbOtB2HBsh37OtZ8HOvm0nhtB7bqcOzT1tx%2BbfuW7Hdvp0Hutp2Lftx3bqdO3rGd25HOc5%2B7ntezrhfZ5Xee%2B57hvF%2BXqMl-X3vO8HreQ7Hxdl83jd13Xhe16Hhdt8n1f%2B3X8c9-XTcNznUeJwXPfJynWfJ8LWcl9XIc1-nLcD8XxdV7P3dVwvbdNz3fcDyXT%2BDxPE8L9PW%2Bz1Pm-z4v5-71f6%2BTzf2%2B7%2Bfy8b5PKfX4vl-nw%2Fh837fL9P89z0vu8jwfX%2F738fx%2BT-vO9j%2Bv58H%2BfW9L6fi9z8XD9r7v5-L-Ps-T1P29nwfm%2B71f5%2BXyfE9H5ve8%2B9-vu9783tfz3Ps%2Bz6%2B-9D-HQ9Z%2BL0fv-V8fo%2Bb9Hnff%2Bb0fa83yvx9%2F6%2B49n7v6%2BD6Pge9wnq%2BF7-2%2Bj9nw%2BP-rn%2BY9-5%2B89%2B5-Pf%2BPxP58f4v3%2Br5Hp-Px%2Br9Pu%2Br9%2Bo%2Bf5f9-V5fx-Fz-I9X7%2B9%2Bj9v2%2B38fx%2Br9P2%2BP6fh-%2Bf3-99%2Bl8H2%2Bj5ff%2B%2B59v9-B-P5%2Bl%2Bz7fd-P7v-9H7fvpzr7%2Bv7f1-38fP-T9Ps%2BL-vFfj9vt%2BH9%2Bfd%2BH3-P%2BH0-Z%2B%2By%2Bz4%2Bp9%2B9%2B79%2Bg%2B79H%2B%2Bfzfq-P7fv-P3-59%2B7%2Bv6%2BB%2Bby-T-vt%2Br%2Bfj%2Bf0-Z9%2B--z5%2Bg%2B78v%2B%2Bp%2BL2f59vwfH9f2-H%2B%2BT-P9%2Bi-H6%2Bn8P8-m%2B319D5Pz-n-vz-9%2BP7%2BR%2BT6%2BN5%2B79%2BP5-p%2BL%2B%2BH-v5fN%2BP%2B%2B39%2Br6f29P5-z-fh-v8%2BP%2BPwfP%2BXxvj-v8%2BP-v5-P9f0-P8%2Bp%2Bf8%2Br%2Bf8%2BP%2BP0-P%2B%2BL9%2Br9%2BP9fk-X%2B%2Bu%2B%2BL-%2Br%2Bfw-L9%2BP%2BH8%2B%2B%2BP5fv%2Bf0-f%2B%2Bx-v%2BP%2BP5fr%2Bf-%2Bv%2BP9%2BP5fj-3%2B%2B%2B%2Bfw%2BP-fh%2Bf9%2Bz%2BP9f5-P5f6%2BP9fs%2BH%2B%2Br9P-%2BP-P5f5%2BP6%2BH%2B%2BP-fv%2Bv%2BP9%2BP%2Bfr%2BP%2BP-fj%2BP%2BP-H%2B%2BP-fh%2Bv9fr%2BP%2BP-vr%2BP%2BP9ft%2BP5%2Bf%2BP%2BP-fj%2BP4%2BP9%2BP%2BP-fh%2BP9%2BPnfX2pNqSFPSfIXIkfwdKfA%3D"
                target="_blank"
                rel="noreferrer"
              >
                View Example
              </a>
              <ExternalLinkIcon className="ml-auto" />
            </DropdownMenuItem>
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

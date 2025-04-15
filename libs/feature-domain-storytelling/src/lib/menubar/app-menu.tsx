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
import { useStoryPersistance } from '../states/use-story-persistance'
import { useDisclosure } from '@ddd-toolbox/util'
import { DiscardChangesAlertDialog } from './discard-changes-alert-dialog'

export interface AppMenuProps {
  newStory: () => void
}

export function AppMenu({ newStory }: AppMenuProps) {
  const editor = useEditor()
  const gridModeActivated = useValue('grid mode activated', () => editor.getInstanceState().isGridMode, [])
  const userPreferences = useValue('user preferences', getUserPreferences, [])
  const theme = userPreferences.colorScheme ?? 'system'
  const { latestChangesSaved, open, saveAs } = useStoryPersistance()
  const confirmDiscardChangesDisclosure = useDisclosure()

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
                  <DropdownMenuItem>
                    <span>SVG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>PNG</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={newStory}>
              <FilePlusIcon />
              <span>New story</span>
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

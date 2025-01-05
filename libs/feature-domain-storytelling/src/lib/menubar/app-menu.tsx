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
import { getUserPreferences, setUserPreferences, TLUserPreferences, track, useEditor } from 'tldraw'
import {
  DownloadIcon,
  ExternalLinkIcon,
  FolderIcon,
  GithubIcon,
  ImageDownIcon,
  MenuIcon,
  SettingsIcon,
  SunMoonIcon,
} from 'lucide-react'

export const AppMenu = track(function AppMenu() {
  const editor = useEditor()
  const instanceState = editor.getInstanceState()
  const userPreferences = getUserPreferences()
  const theme = userPreferences.colorScheme ?? 'system'

  const changeUserPreferences = (newPreferences: Partial<TLUserPreferences>) => {
    setUserPreferences({
      ...getUserPreferences(),
      ...newPreferences,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <FolderIcon />
            <span>Open</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
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
                checked={instanceState.isGridMode}
                onCheckedChange={() => editor.updateInstanceState({ isGridMode: !instanceState.isGridMode })}
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
  )
})

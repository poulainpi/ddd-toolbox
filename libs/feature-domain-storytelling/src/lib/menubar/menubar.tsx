import { track } from 'tldraw'
import { AppMenu } from './app-menu'
import { StoryName } from './story-name'

export const Menubar = track(function Menubar() {
  return (
    <div className="absolute top-0 left-0 bg-muted/50 p-1 pr-3 flex items-center gap-1">
      <AppMenu />
      <StoryName />
    </div>
  )
})

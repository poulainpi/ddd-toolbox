import { AppMenu as SharedAppMenu } from '@ddd-toolbox/shared-canvas'

export interface AppMenuProps {
  newStory: () => void
}

export function AppMenu({ newStory }: AppMenuProps) {
  return <SharedAppMenu newDocument={newStory} newDocumentLabel="New story" />
}

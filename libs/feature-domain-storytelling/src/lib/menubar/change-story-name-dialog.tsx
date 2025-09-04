import { ChangeDocumentNameDialog } from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

export interface StoryNameProps {
  disclosure: UseDisclosureReturn
  isNewStory: boolean
}

export function ChangeStoryNameDialog({ disclosure, isNewStory }: StoryNameProps) {
  return <ChangeDocumentNameDialog disclosure={disclosure} isNew={isNewStory} documentType="story" />
}

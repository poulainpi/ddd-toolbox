import {
  AppMenu as SharedAppMenu,
  ChangeDocumentNameDialog,
  Menubar as SharedMenubar,
} from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { DOMAIN_STORYTELLING_EXAMPLE_URL } from '../constants'

const StoryAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu newDocument={newDocument} newDocumentLabel="New story" exampleHref={DOMAIN_STORYTELLING_EXAMPLE_URL} />
)

const StoryNameDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeDocumentNameDialog disclosure={disclosure} isNew={isNew} documentType="story" />
)

export function Menubar() {
  return <SharedMenubar AppMenuComponent={StoryAppMenu} ChangeDocumentNameDialogComponent={StoryNameDialog} />
}

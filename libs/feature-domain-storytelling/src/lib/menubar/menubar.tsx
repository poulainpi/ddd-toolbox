import {
  Menubar as SharedMenubar,
  AppMenu as SharedAppMenu,
  ChangeDocumentNameDialog,
} from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

const StoryAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu newDocument={newDocument} newDocumentLabel="New story" />
)

const StoryNameDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeDocumentNameDialog disclosure={disclosure} isNew={isNew} documentType="story" />
)

export function Menubar() {
  return <SharedMenubar AppMenuComponent={StoryAppMenu} ChangeDocumentNameDialogComponent={StoryNameDialog} />
}

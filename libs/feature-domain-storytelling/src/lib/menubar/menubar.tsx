import { AppMenu as SharedAppMenu, ChangeNameDialog, Menubar as SharedMenubar } from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { DOMAIN_STORYTELLING_EXAMPLE_URL } from '../constants'
import { StoryNameScopeHelper } from '../story-name-scope-helper'

const StoryAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu newDocument={newDocument} newDocumentLabel="New Story" exampleHref={DOMAIN_STORYTELLING_EXAMPLE_URL} />
)

const StoryGroupDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeNameDialog mode="document" disclosure={disclosure} isNew={isNew} type="Story Group" />
)

const StoryDialog = ({
  disclosure,
  isNew,
  onConfirm,
}: {
  disclosure: UseDisclosureReturn
  isNew: boolean
  onConfirm?: (name: string) => void
}) => (
  <ChangeNameDialog
    mode="page"
    disclosure={disclosure}
    isNew={isNew}
    type="Story"
    helperComponent={StoryNameScopeHelper}
    onConfirm={onConfirm}
  />
)

export function Menubar() {
  return (
    <SharedMenubar
      AppMenuComponent={StoryAppMenu}
      ChangeDocumentNameDialogComponent={StoryGroupDialog}
      ChangePageNameDialogComponent={StoryDialog}
      pagesMenuLabel="Stories"
    />
  )
}

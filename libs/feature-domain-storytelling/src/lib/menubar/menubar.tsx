import { AppMenu as SharedAppMenu, ChangeNameDialog, Menubar as SharedMenubar } from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { DOMAIN_STORYTELLING_EXAMPLE_URL } from '../constants'
import { StoryNameScopeHelper } from '../story-name-scope-helper'
import { useT } from '@ddd-toolbox/i18n'

const StoryAppMenu = ({ newDocument }: { newDocument: () => void }) => {
  const t = useT()
  return (
    <SharedAppMenu
      newDocument={newDocument}
      newDocumentLabel={t('canvas.newStory')}
      exampleHref={DOMAIN_STORYTELLING_EXAMPLE_URL}
    />
  )
}

const StoryGroupDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => {
  const t = useT()
  return (
    <ChangeNameDialog mode="document" disclosure={disclosure} isNew={isNew} type={t('canvas.type.storyCollection')} />
  )
}

const StoryDialog = ({
  disclosure,
  isNew,
  onConfirm,
}: {
  disclosure: UseDisclosureReturn
  isNew: boolean
  onConfirm?: (name: string) => void
}) => {
  const t = useT()
  return (
    <ChangeNameDialog
      mode="page"
      disclosure={disclosure}
      isNew={isNew}
      type={t('canvas.type.story')}
      helperComponent={StoryNameScopeHelper}
      onConfirm={onConfirm}
    />
  )
}

export function Menubar() {
  const t = useT()

  return (
    <SharedMenubar
      AppMenuComponent={StoryAppMenu}
      ChangeDocumentNameDialogComponent={StoryGroupDialog}
      ChangePageNameDialogComponent={StoryDialog}
      pagesMenuLabel={t('canvas.pagesStories')}
    />
  )
}

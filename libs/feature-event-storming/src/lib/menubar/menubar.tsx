import { Menubar as SharedMenubar, AppMenu as SharedAppMenu, ChangeNameDialog } from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { EVENT_STORMING_EXAMPLE_URL } from '../constants'
import { useT } from '@ddd-toolbox/i18n'

const EventAppMenu = ({ newDocument }: { newDocument: () => void }) => {
  const t = useT()
  return (
    <SharedAppMenu
      newDocument={newDocument}
      newDocumentLabel={t('canvas.newEventStorming')}
      exampleHref={EVENT_STORMING_EXAMPLE_URL}
    />
  )
}

const EventStormingDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => {
  const t = useT()
  return (
    <ChangeNameDialog
      mode="document"
      disclosure={disclosure}
      isNew={isNew}
      type={t('canvas.type.eventStormingCollection')}
    />
  )
}

const PageDialog = ({
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
      type={t('canvas.type.page')}
      disclosure={disclosure}
      isNew={isNew}
      onConfirm={onConfirm}
    />
  )
}

export function Menubar() {
  return (
    <SharedMenubar
      AppMenuComponent={EventAppMenu}
      ChangeDocumentNameDialogComponent={EventStormingDialog}
      ChangePageNameDialogComponent={PageDialog}
    />
  )
}

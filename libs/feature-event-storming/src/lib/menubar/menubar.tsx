import { Menubar as SharedMenubar, AppMenu as SharedAppMenu, ChangeNameDialog } from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { EVENT_STORMING_EXAMPLE_URL } from '../constants'

const EventAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu
    newDocument={newDocument}
    newDocumentLabel="New Event Storming"
    exampleHref={EVENT_STORMING_EXAMPLE_URL}
  />
)

const EventStormingDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeNameDialog mode="document" disclosure={disclosure} isNew={isNew} type="Event Storming" />
)

const PageDialog = ({
  disclosure,
  isNew,
  onConfirm,
}: {
  disclosure: UseDisclosureReturn
  isNew: boolean
  onConfirm?: (name: string) => void
}) => <ChangeNameDialog mode="page" type="Page" disclosure={disclosure} isNew={isNew} onConfirm={onConfirm} />

export function Menubar() {
  return (
    <SharedMenubar
      AppMenuComponent={EventAppMenu}
      ChangeDocumentNameDialogComponent={EventStormingDialog}
      ChangePageNameDialogComponent={PageDialog}
    />
  )
}

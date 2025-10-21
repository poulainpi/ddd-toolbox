import { Menubar as SharedMenubar, AppMenu as SharedAppMenu, ChangeNameDialog } from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { BOUNDED_CONTEXT_CANVAS_EXAMPLE_URL } from '../../constants-index'

const BoundedContextAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu
    newDocument={newDocument}
    newDocumentLabel="New Bounded Context Canvas"
    exampleHref={BOUNDED_CONTEXT_CANVAS_EXAMPLE_URL}
  />
)

const BoundedContextDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeNameDialog mode="document" disclosure={disclosure} isNew={isNew} type="Bounded Context Canvas" />
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
      AppMenuComponent={BoundedContextAppMenu}
      ChangeDocumentNameDialogComponent={BoundedContextDialog}
      ChangePageNameDialogComponent={PageDialog}
    />
  )
}

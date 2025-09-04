import {
  Menubar as SharedMenubar,
  AppMenu as SharedAppMenu,
  ChangeDocumentNameDialog,
} from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'

const EventAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu newDocument={newDocument} newDocumentLabel="New event storming" />
)

const EventNameDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeDocumentNameDialog disclosure={disclosure} isNew={isNew} documentType="event storming" />
)

export function Menubar() {
  return <SharedMenubar AppMenuComponent={EventAppMenu} ChangeDocumentNameDialogComponent={EventNameDialog} />
}

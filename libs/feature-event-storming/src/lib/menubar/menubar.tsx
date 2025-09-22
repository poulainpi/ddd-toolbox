import {
  Menubar as SharedMenubar,
  AppMenu as SharedAppMenu,
  ChangeDocumentNameDialog,
} from '@ddd-toolbox/shared-canvas'
import { UseDisclosureReturn } from '@ddd-toolbox/util'
import { EVENT_STORMING_EXAMPLE_URL } from '../constants'

const EventAppMenu = ({ newDocument }: { newDocument: () => void }) => (
  <SharedAppMenu
    newDocument={newDocument}
    newDocumentLabel="New Event Storming"
    exampleHref={EVENT_STORMING_EXAMPLE_URL}
  />
)

const EventNameDialog = ({ disclosure, isNew }: { disclosure: UseDisclosureReturn; isNew: boolean }) => (
  <ChangeDocumentNameDialog disclosure={disclosure} isNew={isNew} documentType="Event Storming" />
)

export function Menubar() {
  return <SharedMenubar AppMenuComponent={EventAppMenu} ChangeDocumentNameDialogComponent={EventNameDialog} />
}

import { Editor, TLShape } from 'tldraw'
import { ShapeMenu as SharedShapeMenu, MenuActionGroup } from '@ddd-toolbox/shared-canvas'
import { StickyNoteShapeUtil } from './shapes/sticky-note-shape-util'
import { StickyNoteToolUtil } from './tools/sticky-note-tool-util'
import { StickyNoteType } from './types/sticky-note-types'
import { STICKY_NOTE_LABELS, STICKY_NOTE_TEXT_COLORS } from './shapes/sticky-note-constants'

export function ShapeMenu() {
  const actionGroups: MenuActionGroup[] = [
    {
      id: 'sticky-notes',
      actions: Object.values(StickyNoteType).map((type) => ({
        icon: 'sticky-note',
        color: STICKY_NOTE_TEXT_COLORS[type],
        tooltip: STICKY_NOTE_LABELS[type],
        onClick: (editor: Editor, _selectedShape: TLShape) => {
          editor.selectNone()
          editor.setCurrentTool(StickyNoteToolUtil.id, { stickyNoteType: type })
        },
      })),
    },
  ]

  return <SharedShapeMenu actionGroups={actionGroups} showOnShapeTypes={[StickyNoteShapeUtil.type]} />
}

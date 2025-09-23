import { Editor, GroupShapeUtil, TLShape } from 'tldraw'
import { MenuActionGroup, pushShapesInDirection, ShapeMenu as SharedShapeMenu } from '@ddd-toolbox/shared-canvas'
import { StickyNoteShapeUtil } from './shapes/sticky-note-shape-util'
import { StickyNoteToolUtil } from './tools/sticky-note-tool-util'
import { StickyNoteType } from './types/sticky-note-types'
import { STICKY_NOTE_LABELS, STICKY_NOTE_SIZE, STICKY_NOTE_TEXT_COLORS } from './shapes/sticky-note-constants'

export function ShapeMenu() {
  const actionGroups: MenuActionGroup[] = [
    {
      id: 'sticky-notes',
      actions: Object.values(StickyNoteType).map((type) => ({
        icon: 'sticky-note',
        color: STICKY_NOTE_TEXT_COLORS[type],
        tooltip: STICKY_NOTE_LABELS[type],
        onClick: (editor: Editor, selectedShape: TLShape) => {
          editor.selectNone()
          editor.setCurrentTool(StickyNoteToolUtil.id, {
            stickyNoteType: type,
            groupWithShapeId: selectedShape.id,
          })
        },
      })),
    },
    {
      id: 'push-shapes',
      actions: [
        {
          icon: 'arrow-left-to-line',
          tooltip: 'Push all shapes left',
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'left', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
        {
          icon: 'arrow-right-to-line',
          tooltip: 'Push all shapes right',
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'right', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
        {
          icon: 'arrow-up-to-line',
          tooltip: 'Push all shapes up',
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'top', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
        {
          icon: 'arrow-down-to-line',
          tooltip: 'Push all shapes down',
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'bottom', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
      ],
    },
  ]

  return (
    <SharedShapeMenu actionGroups={actionGroups} showOnShapeTypes={[StickyNoteShapeUtil.type, GroupShapeUtil.type]} />
  )
}

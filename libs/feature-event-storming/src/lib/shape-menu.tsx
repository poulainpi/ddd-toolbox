import { Editor, GroupShapeUtil, TLShape } from 'tldraw'
import { MenuActionGroup, pushShapesInDirection, ShapeMenu as SharedShapeMenu } from '@ddd-toolbox/shared-canvas'
import { StickyNoteShapeUtil } from './shapes/sticky-note-shape-util'
import { StickyNoteToolUtil } from './tools/sticky-note-tool-util'
import { StickyNoteType } from './types/sticky-note-types'
import { STICKY_NOTE_LABEL_KEYS, STICKY_NOTE_SIZE, STICKY_NOTE_TEXT_COLORS } from './shapes/sticky-note-constants'
import { useT } from '@ddd-toolbox/i18n'

export function ShapeMenu() {
  const t = useT()
  const actionGroups: MenuActionGroup[] = [
    {
      id: 'sticky-notes',
      actions: Object.values(StickyNoteType).map((type) => ({
        icon: 'sticky-note',
        color: STICKY_NOTE_TEXT_COLORS[type],
        tooltip: t(STICKY_NOTE_LABEL_KEYS[type]),
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
          tooltip: t('es.pushLeft'),
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'left', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
        {
          icon: 'arrow-right-to-line',
          tooltip: t('es.pushRight'),
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'right', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
        {
          icon: 'arrow-up-to-line',
          tooltip: t('es.pushUp'),
          onClick: (editor: Editor) => {
            pushShapesInDirection(editor, 'top', { pushSize: STICKY_NOTE_SIZE })
            editor.selectNone()
          },
        },
        {
          icon: 'arrow-down-to-line',
          tooltip: t('es.pushDown'),
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

import { Editor, StateNode, track } from 'tldraw'
import { Shape, ShapesPanel } from '@ddd-toolbox/shared-canvas'
import { StickyNoteType } from '../types/sticky-note-types'
import { STICKY_NOTE_LABELS, STICKY_NOTE_BG_COLORS } from '../shapes/sticky-note-constants'
import { StickyNoteToolUtil } from '../tools/sticky-note-tool-util'
import { StickyNoteHelpDialog } from './sticky-note-help-dialog'
import { cn } from '@ddd-toolbox/util'

interface StickyNoteShape extends Shape {
  stickyNoteType: StickyNoteType
}

export const StickyNotePanel = track(function StickyNotePanel() {
  const shapeGroups = [
    {
      id: 'sticky-notes',
      shapes: Object.values(StickyNoteType).map(
        (type): StickyNoteShape => ({
          component: <div className={cn('h-6 w-6 rounded-sm shadow-sm', STICKY_NOTE_BG_COLORS[type])} />,
          tooltip: STICKY_NOTE_LABELS[type],
          stickyNoteType: type,
          setCurrentTool: (editor: Editor) => {
            editor.setCurrentTool(StickyNoteToolUtil.id, { stickyNoteType: type })
          },
        }),
      ),
    },
  ]

  const isToolSelected = (shape: Shape, currentSelectedTool: StateNode) => {
    const stickyNoteShape = shape as StickyNoteShape
    return (
      currentSelectedTool instanceof StickyNoteToolUtil &&
      currentSelectedTool.stickyNoteType === stickyNoteShape.stickyNoteType
    )
  }

  return (
    <ShapesPanel
      shapeGroups={shapeGroups}
      isVisible={true}
      isToolSelected={isToolSelected}
      bottomComponent={<StickyNoteHelpDialog />}
    />
  )
})

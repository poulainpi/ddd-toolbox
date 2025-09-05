import { Editor, StateNode, track } from 'tldraw'
import { Shape, ShapesPanel } from '@ddd-toolbox/shared-canvas'
import { StickyNoteType, STICKY_NOTE_COLORS } from '../types/sticky-note-types'
import { StickyNoteToolUtil } from '../tools/sticky-note-tool-util'

// Extend Shape interface to include stickyNoteType for tool selection logic
interface StickyNoteShape extends Shape {
  stickyNoteType: StickyNoteType
}

export const StickyNotePanel = track(function StickyNotePanel() {
  // Create shapes for each sticky note type
  const shapeGroups = [
    {
      id: 'sticky-notes',
      shapes: Object.values(StickyNoteType).map(
        (type): StickyNoteShape => ({
          icon: 'sticky-note',
          color: STICKY_NOTE_COLORS[type],
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

  return <ShapesPanel shapeGroups={shapeGroups} isVisible={true} isToolSelected={isToolSelected} />
})

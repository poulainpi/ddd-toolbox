import { createShapeId, StateNode } from 'tldraw'
import { StickyNoteType } from '../types/sticky-note-types'
import { STICKY_NOTE_SIZE } from '../shapes/sticky-note-constants'
import { StickyNoteShapeUtil } from '../shapes/sticky-note-shape-util'

export class StickyNoteToolUtil extends StateNode {
  static override id = 'sticky-note'

  public stickyNoteType: StickyNoteType = StickyNoteType.EVENT

  override onEnter({ stickyNoteType }: { stickyNoteType: StickyNoteType }) {
    this.stickyNoteType = stickyNoteType
    this.editor.setCursor({ type: 'cross' })
  }

  override onCancel() {
    this.editor.setCurrentTool('select')
  }

  override onPointerUp() {
    const { currentPagePoint } = this.editor.inputs
    const id = createShapeId()

    this.editor.createShape({
      id,
      type: StickyNoteShapeUtil.type,
      x: currentPagePoint.x - STICKY_NOTE_SIZE / 2,
      y: currentPagePoint.y - STICKY_NOTE_SIZE / 2,
      props: {
        text: '',
        stickyNoteType: this.stickyNoteType,
      },
    })

    this.editor.select(id)
    this.editor.setEditingShape(id)
  }
}

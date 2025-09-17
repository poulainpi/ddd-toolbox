import { createShapeId, StateNode, TLShapeId } from 'tldraw'
import { StickyNoteType } from '../types/sticky-note-types'
import { STICKY_NOTE_SIZE } from '../shapes/sticky-note-constants'
import { StickyNoteShapeUtil, TLStickyNoteShape } from '../shapes/sticky-note-shape-util'
import { groupStickyNoteWithANewOne } from '../utils/grouping-logic'

export class StickyNoteToolUtil extends StateNode {
  static override id = 'sticky-note'

  public stickyNoteType: StickyNoteType = StickyNoteType.EVENT
  public groupWithShapeId?: TLShapeId

  override onEnter({
    stickyNoteType,
    groupWithShapeId,
  }: {
    stickyNoteType: StickyNoteType
    groupWithShapeId?: TLShapeId
  }) {
    this.stickyNoteType = stickyNoteType
    this.groupWithShapeId = groupWithShapeId
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

    if (this.groupWithShapeId) {
      const selectedShape = this.editor.getShape(this.groupWithShapeId) as TLStickyNoteShape
      if (selectedShape) {
        // Use timeout to ensure shape creation is fully committed before grouping
        setTimeout(() => {
          groupStickyNoteWithANewOne(this.editor, selectedShape, id)
        })
      }
    }

    this.editor.select(id)
    this.editor.setEditingShape(id)
  }
}

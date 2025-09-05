import { createShapeId, StateNode, TLShapeId } from 'tldraw'
import { StickyNoteType } from '../types/sticky-note-types'

export class StickyNoteToolUtil extends StateNode {
  static override id = 'sticky-note'

  public stickyNoteType: StickyNoteType = StickyNoteType.EVENT
  private initialShapeId: TLShapeId | undefined

  override onEnter({
    stickyNoteType,
    initiatorShapeId,
  }: {
    stickyNoteType: StickyNoteType
    initiatorShapeId?: TLShapeId
  }) {
    this.stickyNoteType = stickyNoteType
    this.initialShapeId = initiatorShapeId
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
      type: 'note',
      x: currentPagePoint.x - 100, // Default note width is ~200, so center it
      y: currentPagePoint.y - 100, // Default note height is ~200, so center it
      meta: {
        stickyNoteType: this.stickyNoteType,
      },
    })

    this.editor.select(id)
    this.editor.setEditingShape(id)
  }
}

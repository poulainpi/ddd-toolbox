import { createShapeId, StateNode, TLShapeId } from 'tldraw'
import { createArrowBetweenShapes } from '@ddd-toolbox/shared-canvas'

export abstract class DomainObjectToolUtil extends StateNode {
  public icon = ''
  private initialShapeId: TLShapeId | undefined

  override onEnter({ icon, initiatorShapeId }: { icon: string; initiatorShapeId: TLShapeId | undefined }) {
    this.icon = icon
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
      type: this.getShapeType(),
      x: currentPagePoint.x - this.getSize() / 2,
      y: currentPagePoint.y - this.getSize() / 2,
      props: { icon: this.icon },
    })

    if (this.initialShapeId != null) {
      const arrowId = createArrowBetweenShapes(this.editor, this.initialShapeId, id, { arrowProps: { size: 's' } })
      if (arrowId != null) {
        this.editor.select(arrowId)
        this.editor.setEditingShape(arrowId)
      }
    } else {
      this.editor.select(id)
      this.editor.setEditingShape(id)
    }
  }

  abstract getShapeType(): string

  abstract getSize(): number
}

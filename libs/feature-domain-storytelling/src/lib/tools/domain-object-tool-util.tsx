import { createShapeId, StateNode } from 'tldraw'

export abstract class DomainObjectToolUtil extends StateNode {
  public icon = ''

  override onEnter({ icon }: { icon: string }) {
    this.icon = icon
    this.editor.setCursor({ type: 'cross' })
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

    this.editor.select(id)
    this.editor.setEditingShape(id)
  }

  abstract getShapeType(): string

  abstract getSize(): number
}

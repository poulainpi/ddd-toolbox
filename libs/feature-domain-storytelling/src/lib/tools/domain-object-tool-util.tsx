import { StateNode } from 'tldraw'

export abstract class DomainObjectToolUtil extends StateNode {
  public icon = ''

  override onEnter({ icon }: { icon: string }) {
    this.icon = icon
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown() {
    const { currentPagePoint } = this.editor.inputs
    this.editor.createShape({
      type: this.getShapeType(),
      x: currentPagePoint.x - this.getSize() / 2,
      y: currentPagePoint.y - this.getSize() / 2,
      props: { icon: this.icon },
    })
    this.editor.setCurrentTool('select')
  }

  abstract getShapeType(): string

  abstract getSize(): number
}

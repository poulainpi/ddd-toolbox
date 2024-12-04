import { StateNode } from 'tldraw'

export class ActorToolUtil extends StateNode {
  static override id = 'actor'
  public icon = ''

  override onEnter({ icon }: { icon: string }) {
    this.icon = icon
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown() {
    const { currentPagePoint } = this.editor.inputs
    this.editor.createShape({
      type: 'actor-shape',
      x: currentPagePoint.x,
      y: currentPagePoint.y,
      props: { icon: this.icon },
    })
    this.editor.setCurrentTool('select')
  }
}

import { StateNode } from 'tldraw'
import { SHAPE_SIZE } from '../shapes/shapes-constants'
import { ActorShapeUtil } from '../shapes/actor-shape-util'

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
      type: ActorShapeUtil.type,
      x: currentPagePoint.x - SHAPE_SIZE / 2,
      y: currentPagePoint.y - SHAPE_SIZE / 2,
      props: { icon: this.icon },
    })
    this.editor.setCurrentTool('select')
  }
}

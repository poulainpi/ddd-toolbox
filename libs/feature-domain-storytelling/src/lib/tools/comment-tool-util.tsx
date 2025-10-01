import { createShapeId, StateNode, TLShapeId } from 'tldraw'
import { createArrowBetweenShapes } from '@ddd-toolbox/shared-canvas'
import { COMMENT_MIN_HEIGHT, COMMENT_WIDTH } from '../shapes/comment-shape-util'

export class CommentToolUtil extends StateNode {
  static override id = 'comment'

  private initialShapeId: TLShapeId | undefined

  override onEnter({ initiatorShapeId }: { initiatorShapeId: TLShapeId | undefined }) {
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
      type: 'comment',
      x: currentPagePoint.x - COMMENT_WIDTH / 2,
      y: currentPagePoint.y - COMMENT_MIN_HEIGHT / 2,
      props: { text: '', growY: 0 },
    })

    if (this.initialShapeId != null) {
      const arrowId = createArrowBetweenShapes(this.editor, this.initialShapeId, id, {
        arrowProps: {
          dash: 'dashed',
          arrowheadStart: 'none',
          arrowheadEnd: 'none',
          size: 's',
        },
      })
      if (arrowId != null) {
        this.editor.select(id)
        this.editor.setEditingShape(id)
      }
    } else {
      this.editor.select(id)
      this.editor.setEditingShape(id)
    }

    this.editor.setCurrentTool('select')
  }
}

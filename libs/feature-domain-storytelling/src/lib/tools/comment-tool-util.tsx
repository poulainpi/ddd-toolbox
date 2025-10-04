import { TLShapeId } from 'tldraw'
import { PreviewPlacementOnCreateToolUtil, createArrowBetweenShapes } from '@ddd-toolbox/shared-canvas'
import { CommentShapeUtil, COMMENT_MIN_HEIGHT, COMMENT_WIDTH } from '../shapes/comment-shape-util'

export class CommentToolUtil extends PreviewPlacementOnCreateToolUtil {
  static override id = 'comment'

  private initialShapeId: TLShapeId | undefined

  protected override handleEnter(info: Record<string, unknown>): void {
    const { initiatorShapeId } = info as { initiatorShapeId: TLShapeId | undefined }
    this.initialShapeId = initiatorShapeId
  }

  protected override getShapeType(): string {
    return CommentShapeUtil.type
  }

  protected override getShapeSize(): { width: number; height: number } {
    return { width: COMMENT_WIDTH, height: COMMENT_MIN_HEIGHT }
  }

  protected override getShapeProps(_info: Record<string, unknown>): Record<string, unknown> {
    return { text: '', growY: 0 }
  }

  protected override onShapePlaced(shapeId: TLShapeId): void {
    if (this.initialShapeId != null) {
      createArrowBetweenShapes(this.editor, this.initialShapeId, shapeId, {
        arrowProps: {
          dash: 'dashed',
          arrowheadStart: 'none',
          arrowheadEnd: 'none',
          size: 's',
        },
      })
    }

    setTimeout(() => {
      this.editor.select(shapeId)
      this.editor.setEditingShape(shapeId)
    })
  }
}

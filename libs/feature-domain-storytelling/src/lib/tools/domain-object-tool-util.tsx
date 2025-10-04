import { TLShapeId } from 'tldraw'
import { PreviewPlacementOnCreateToolUtil, createArrowBetweenShapes } from '@ddd-toolbox/shared-canvas'

export abstract class DomainObjectToolUtil extends PreviewPlacementOnCreateToolUtil {
  public icon = ''
  private initialShapeId: TLShapeId | undefined

  protected override handleEnter(info: Record<string, unknown>): void {
    const { icon, initiatorShapeId } = info as { icon: string; initiatorShapeId: TLShapeId | undefined }
    this.icon = icon
    this.initialShapeId = initiatorShapeId
  }

  protected override getShapeSize(): { width: number; height: number } {
    const size = this.getSize()
    return { width: size, height: size }
  }

  protected override getShapeProps(_info: Record<string, unknown>): Record<string, unknown> {
    return { icon: this.icon }
  }

  protected override onShapePlaced(shapeId: TLShapeId): void {
    if (this.initialShapeId != null) {
      const arrowId = createArrowBetweenShapes(this.editor, this.initialShapeId, shapeId, {
        arrowProps: { size: 's' },
      })
      if (arrowId != null) {
        setTimeout(() => {
          this.editor.select(arrowId)
          this.editor.setEditingShape(arrowId)
        })
        return
      }
    }

    setTimeout(() => {
      this.editor.select(shapeId)
      this.editor.setEditingShape(shapeId)
    })
  }

  protected abstract getSize(): number
}

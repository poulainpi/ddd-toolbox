import { TLShapeId } from 'tldraw'
import { PreviewPlacementOnCreateToolUtil } from '@ddd-toolbox/shared-canvas'
import { StickyNoteType } from '../types/sticky-note-types'
import { getStickyNoteSize } from '../shapes/sticky-note-constants'
import { StickyNoteShapeUtil, TLStickyNoteShape } from '../shapes/sticky-note-shape-util'
import { groupStickyNoteWithANewOne } from '../utils/grouping-logic'

export class StickyNoteToolUtil extends PreviewPlacementOnCreateToolUtil {
  static override id = 'sticky-note'

  public stickyNoteType: StickyNoteType = StickyNoteType.EVENT
  private groupWithShapeId?: TLShapeId

  protected override handleEnter(info: Record<string, unknown>): void {
    const { stickyNoteType, groupWithShapeId } = info as {
      stickyNoteType: StickyNoteType
      groupWithShapeId?: TLShapeId
    }
    this.stickyNoteType = stickyNoteType
    this.groupWithShapeId = groupWithShapeId
  }

  protected override getShapeType(): string {
    return StickyNoteShapeUtil.type
  }

  protected override getShapeSize(): { width: number; height: number } {
    const size = getStickyNoteSize(this.stickyNoteType)
    return { width: size, height: size }
  }

  protected override getShapeProps(_info: Record<string, unknown>): Record<string, unknown> {
    return {
      text: '',
      stickyNoteType: this.stickyNoteType,
    }
  }

  protected override onShapePlaced(shapeId: TLShapeId): void {
    if (this.groupWithShapeId) {
      const selectedShape = this.editor.getShape(this.groupWithShapeId) as TLStickyNoteShape
      if (selectedShape) {
        // Use timeout to ensure shape creation is fully committed before grouping
        setTimeout(() => {
          groupStickyNoteWithANewOne(this.editor, selectedShape, shapeId)
        })
      }
    }

    setTimeout(() => {
      this.editor.select(shapeId)
      this.editor.setEditingShape(shapeId)
    })
  }
}

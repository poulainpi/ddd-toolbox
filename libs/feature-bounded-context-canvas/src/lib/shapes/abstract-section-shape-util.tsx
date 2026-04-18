import {
  Geometry2d,
  IndexKey,
  RecordProps,
  Rectangle2d,
  ShapeUtil,
  TLBaseShape,
  TLHandle,
  TLHandleDragInfo,
  TLShapePartial,
} from 'tldraw'

export type TLSectionBaseProps = {
  height: number
}

export abstract class AbstractSectionShapeUtil<Type extends string, Props extends TLSectionBaseProps> extends ShapeUtil<
  TLBaseShape<Type, Props>
> {
  static override props: RecordProps<TLBaseShape<string, object>>

  abstract getWidth(): number
  abstract getDefaultHeight(): number
  abstract getBorderClasses(): string
  abstract getRoundedClasses(): string
  abstract getIndicatorRadius(): number
  abstract getRowIndex(): number

  override getGeometry(shape: TLBaseShape<Type, Props>): Geometry2d {
    return new Rectangle2d({
      width: this.getWidth(),
      height: shape.props.height,
      isFilled: true,
      isLabel: false,
    })
  }

  override hideSelectionBoundsFg(_shape: TLBaseShape<Type, Props>): boolean {
    return true
  }

  override hideRotateHandle(_shape: TLBaseShape<Type, Props>): boolean {
    return true
  }

  override indicator(shape: TLBaseShape<Type, Props>) {
    const indicatorRadius = this.getIndicatorRadius()
    return <rect width={this.getWidth()} height={shape.props.height} rx={indicatorRadius} />
  }

  override canResize(_shape: TLBaseShape<Type, Props>): boolean {
    return false
  }

  override canEdit(_shape: TLBaseShape<Type, Props>): boolean {
    return true
  }

  override onTranslateStart(shape: TLBaseShape<Type, Props>) {
    // Prevent user from dragging the shape
    return shape
  }

  override onTranslate(shape: TLBaseShape<Type, Props>) {
    // Also block during translate to ensure no movement
    return shape
  }

  override getHandles(shape: TLBaseShape<Type, Props>): TLHandle[] {
    return [
      {
        id: 'bottom-resize',
        type: 'vertex',
        index: 'a1' as IndexKey,
        x: this.getWidth() / 2,
        y: shape.props.height,
        canSnap: false,
      },
    ]
  }

  override onHandleDrag(
    shape: TLBaseShape<Type, Props>,
    info: TLHandleDragInfo<TLBaseShape<Type, Props>>,
  ): TLShapePartial<TLBaseShape<Type, Props>> | void {
    if (info.handle.id !== 'bottom-resize') return

    const minHeight = 80
    const newHeight = Math.max(minHeight, info.handle.y)
    const delta = newHeight - shape.props.height

    if (delta === 0) return

    const rowIndex = this.getRowIndex()
    const shapeUpdates: TLShapePartial[] = []

    for (const pageShape of this.editor.getCurrentPageShapes()) {
      const shapeUtil = this.editor.getShapeUtil(pageShape)
      if (!(shapeUtil instanceof AbstractSectionShapeUtil)) continue
      const pageShapeRowIndex = (shapeUtil as AbstractSectionShapeUtil<string, TLSectionBaseProps>).getRowIndex()

      if (pageShapeRowIndex === rowIndex && pageShape.id !== shape.id) {
        shapeUpdates.push({ id: pageShape.id, type: pageShape.type, props: { height: newHeight } })
      } else if (pageShapeRowIndex > rowIndex) {
        shapeUpdates.push({ id: pageShape.id, type: pageShape.type, y: pageShape.y + delta })
      }
    }

    if (shapeUpdates.length > 0) {
      this.editor.updateShapes(shapeUpdates)
    }

    return {
      id: shape.id,
      type: shape.type,
      props: { ...shape.props, height: newHeight },
    }
  }
}

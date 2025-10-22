import { Geometry2d, RecordProps, Rectangle2d, ShapeUtil, TLBaseShape } from 'tldraw'

export abstract class AbstractSectionShapeUtil<Type extends string, Props extends object> extends ShapeUtil<
  TLBaseShape<Type, Props>
> {
  static override props: RecordProps<TLBaseShape<string, object>>

  abstract getWidth(): number
  abstract getHeight(): number
  abstract getBorderClasses(): string
  abstract getRoundedClasses(): string
  abstract getIndicatorRadius(): number

  override getGeometry(_shape: TLBaseShape<Type, Props>): Geometry2d {
    return new Rectangle2d({
      width: this.getWidth(),
      height: this.getHeight(),
      isFilled: true,
      isLabel: false,
    })
  }

  override hideSelectionBoundsFg(_shape: TLBaseShape<Type, Props>): boolean {
    return true
  }

  override indicator(_shape: TLBaseShape<Type, Props>) {
    const rx = this.getIndicatorRadius()
    return <rect width={this.getWidth()} height={this.getHeight()} rx={rx} />
  }

  override canResize(_shape: TLBaseShape<Type, Props>): boolean {
    return false
  }

  override canEdit(_shape: TLBaseShape<Type, Props>): boolean {
    return true
  }

  override onBeforeUpdate(prev: TLBaseShape<Type, Props>, next: TLBaseShape<Type, Props>) {
    if (prev.x !== next.x || prev.y !== next.y) {
      return {
        ...next,
        x: prev.x,
        y: prev.y,
      }
    }
    return next
  }
}

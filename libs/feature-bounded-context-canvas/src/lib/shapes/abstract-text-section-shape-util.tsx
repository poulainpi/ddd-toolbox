import { Geometry2d, HTMLContainer, PlainTextLabel, RecordProps, Rectangle2d, ShapeUtil, T, TLBaseShape } from 'tldraw'

export type TLTextSectionShape<Type extends string> = TLBaseShape<
  Type,
  {
    text: string
  }
>

export abstract class AbstractTextSectionShapeUtil<Type extends string> extends ShapeUtil<TLTextSectionShape<Type>> {
  static override props: RecordProps<TLTextSectionShape<string>> = {
    text: T.string,
  }

  abstract getLabel(): string
  abstract getWidth(): number
  abstract getHeight(): number
  abstract getFontSize(): number
  abstract getBorderClasses(): string
  abstract getRoundedClasses(): string
  abstract getIndicatorRadius(): number

  override getDefaultProps(): TLTextSectionShape<Type>['props'] {
    return {
      text: '',
    }
  }

  override getGeometry(_shape: TLTextSectionShape<Type>): Geometry2d {
    return new Rectangle2d({
      width: this.getWidth(),
      height: this.getHeight(),
      isFilled: true,
      isLabel: false,
    })
  }

  override hideSelectionBoundsFg(_shape: TLTextSectionShape<Type>): boolean {
    return true
  }

  override component(shape: TLTextSectionShape<Type>) {
    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id
    const isDarkMode = this.editor.user.getIsDarkMode()
    const labelColor = isDarkMode ? 'white' : 'black'
    const width = this.getWidth()
    const height = this.getHeight()
    const fontSize = this.getFontSize()
    const borderClasses = this.getBorderClasses()
    const roundedClasses = this.getRoundedClasses()

    return (
      <HTMLContainer
        className="bg-background [&_*]:!caret-foreground [&_*]:!cursor-[inherit]"
        style={{
          pointerEvents: 'all',
          width,
          height,
        }}
      >
        <div className={`border-foreground flex h-full flex-col p-4 ${borderClasses} ${roundedClasses}`}>
          <div className="text-muted-foreground font-draw mb-2 text-base font-semibold">{this.getLabel()}</div>
          <div className="flex flex-1 items-center justify-center">
            <PlainTextLabel
              shapeId={shape.id}
              text={shape.props.text}
              type={shape.type}
              align="middle"
              verticalAlign="middle"
              font="draw"
              fontSize={fontSize}
              lineHeight={1.5}
              labelColor={labelColor}
              isSelected={isSelected}
              textWidth={width - 32}
            />
          </div>
        </div>
      </HTMLContainer>
    )
  }

  override getText(shape: TLTextSectionShape<Type>) {
    return shape.props.text
  }

  override indicator(_shape: TLTextSectionShape<Type>) {
    const rx = this.getIndicatorRadius()
    return <rect width={this.getWidth()} height={this.getHeight()} rx={rx} />
  }

  override canResize(_shape: TLTextSectionShape<Type>): boolean {
    return false
  }

  override canEdit(_shape: TLTextSectionShape<Type>): boolean {
    return true
  }

  override onBeforeUpdate(prev: TLTextSectionShape<Type>, next: TLTextSectionShape<Type>) {
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

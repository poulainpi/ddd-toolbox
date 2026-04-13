import { HTMLContainer, PlainTextLabel, RecordProps, T, TLBaseShape } from 'tldraw'
import { AbstractSectionShapeUtil } from './abstract-section-shape-util'

export type TLTextSectionShape<Type extends string> = TLBaseShape<
  Type,
  {
    text: string
    height: number
  }
>

export abstract class AbstractTextSectionShapeUtil<Type extends string> extends AbstractSectionShapeUtil<
  Type,
  { text: string; height: number }
> {
  static override props: RecordProps<TLTextSectionShape<string>> = {
    text: T.string,
    height: T.number,
  }

  abstract getLabel(): string
  abstract getFontSize(): number

  isInline(): boolean {
    return false
  }

  override getDefaultProps(): TLTextSectionShape<Type>['props'] {
    return {
      text: '',
      height: this.getDefaultHeight(),
    }
  }

  override component(shape: TLTextSectionShape<Type>) {
    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id
    const width = this.getWidth()
    const height = shape.props.height
    const fontSize = this.getFontSize()
    const borderClasses = this.getBorderClasses()
    const roundedClasses = this.getRoundedClasses()
    const label = (
      <PlainTextLabel
        shapeId={shape.id}
        text={shape.props.text}
        type={shape.type}
        align={this.isInline() ? 'start' : 'middle'}
        verticalAlign="middle"
        font="draw"
        fontSize={fontSize}
        lineHeight={1.5}
        labelColor=""
        isSelected={isSelected}
        textWidth={width - 32}
      />
    )

    return (
      <HTMLContainer
        className="bg-background [&_*]:!caret-foreground [&_*]:!cursor-[inherit]"
        style={{
          pointerEvents: 'all',
          width,
          height,
        }}
      >
        {this.isInline() ? (
          <div className={`border-foreground flex h-full items-center gap-2 px-4 ${borderClasses} ${roundedClasses}`}>
            <span className="text-muted-foreground font-draw shrink-0 text-base font-semibold">
              {this.getLabel()}:{' '}
            </span>
            <div className="relative flex-1 [&_.tl-text-content\_\_wrapper]:!justify-start" style={{ height }}>
              {label}
            </div>
          </div>
        ) : (
          <div className={`border-foreground flex h-full flex-col p-4 ${borderClasses} ${roundedClasses}`}>
            <div className="text-muted-foreground font-draw mb-2 text-base font-semibold">{this.getLabel()}</div>
            <div className="relative flex-1">{label}</div>
          </div>
        )}
      </HTMLContainer>
    )
  }

  override getText(shape: TLTextSectionShape<Type>) {
    return shape.props.text
  }
}

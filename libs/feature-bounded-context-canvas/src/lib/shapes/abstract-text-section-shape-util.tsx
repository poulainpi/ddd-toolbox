import { HTMLContainer, PlainTextLabel, RecordProps, T, TLBaseShape } from 'tldraw'
import { AbstractSectionShapeUtil } from './abstract-section-shape-util'

export type TLTextSectionShape<Type extends string> = TLBaseShape<
  Type,
  {
    text: string
  }
>

export abstract class AbstractTextSectionShapeUtil<Type extends string> extends AbstractSectionShapeUtil<
  Type,
  { text: string }
> {
  static override props: RecordProps<TLTextSectionShape<string>> = {
    text: T.string,
  }

  abstract getLabel(): string
  abstract getFontSize(): number

  override getDefaultProps(): TLTextSectionShape<Type>['props'] {
    return {
      text: '',
    }
  }

  override component(shape: TLTextSectionShape<Type>) {
    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id
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
              labelColor=""
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
}

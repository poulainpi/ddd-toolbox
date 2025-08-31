import {
  Geometry2d,
  HTMLContainer,
  PlainTextLabel,
  Rectangle2d,
  ShapeUtil,
  TLBaseShape,
  TLDefaultColorStyle,
  useDefaultColorTheme,
} from 'tldraw'
import { LoadableIcon } from '@ddd-toolbox/ui-loadable-icon'
import { IconName } from 'lucide-react/dynamic'

export type TLDomainObjectShape<Type extends string> = TLBaseShape<
  Type,
  { text: string; color: TLDefaultColorStyle; icon: string }
>

export abstract class DomainObjectShapeUtil<Type extends string> extends ShapeUtil<TLDomainObjectShape<Type>> {
  override getGeometry(): Geometry2d {
    return new Rectangle2d({
      width: this.getSize(),
      height: this.getSize(),
      isFilled: true,
      isLabel: false,
    })
  }

  override hideSelectionBoundsFg(_shape: TLDomainObjectShape<any>): boolean {
    return true
  }

  override component(shape: TLDomainObjectShape<any>) {
    const theme = useDefaultColorTheme()

    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id

    return (
      <HTMLContainer className="relative flex flex-col items-center" style={{ pointerEvents: 'all' }}>
        <LoadableIcon
          name={shape.props.icon as IconName}
          size={this.getSize() - 30}
          className="mt-1"
          color={theme[shape.props.color].fill}
        />
        <PlainTextLabel
          shapeId={shape.id}
          text={shape.props.text}
          type={shape.type}
          align="middle"
          verticalAlign="start"
          font="draw"
          fontSize={18}
          labelColor={theme[shape.props.color].fill}
          lineHeight={1}
          isSelected={isSelected}
          textWidth={140}
          style={{ position: 'absolute', top: this.getLabelYPosition() + 'px' }}
        />
      </HTMLContainer>
    )
  }

  override getText(shape: TLDomainObjectShape<any>) {
    return shape.props.text
  }

  override indicator(_shape: TLDomainObjectShape<any>) {
    return <rect width={this.getSize()} height={this.getSize()} />
  }

  override canResize(_shape: TLDomainObjectShape<any>): boolean {
    return false
  }

  override canEdit(_shape: TLDomainObjectShape<any>): boolean {
    return true
  }

  abstract getSize(): number

  abstract getLabelYPosition(): number
}

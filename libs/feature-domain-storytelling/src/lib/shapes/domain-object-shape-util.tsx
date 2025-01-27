import {
  Geometry2d,
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TextLabel,
  TLBaseShape,
  TLDefaultColorStyle,
  useDefaultColorTheme,
} from 'tldraw'
import { LoadableIcon } from '@ddd-toolbox/ui'
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
      <HTMLContainer className="flex flex-col items-center relative" style={{ pointerEvents: 'all' }}>
        <LoadableIcon
          name={shape.props.icon as IconName}
          size={this.getSize() - 30}
          className="mt-1"
          color={theme[shape.props.color].fill}
        />
        <TextLabel
          shapeId={shape.id}
          text={shape.props.text}
          type={shape.type}
          align="middle"
          verticalAlign="end"
          font="draw"
          fontSize={20}
          labelColor={theme[shape.props.color].fill}
          lineHeight={1}
          isSelected={isSelected}
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
}

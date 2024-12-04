import {
  Geometry2d,
  HTMLContainer,
  RecordProps,
  Rectangle2d,
  ShapeUtil,
  T,
  TextLabel,
  TLBaseShape,
  useDefaultColorTheme,
} from 'tldraw'
import { SHAPE_SIZE } from './shapes-constants'
import { LoadableIcon } from '@ddd-toolbox/ui'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

type ActorShapeProps = TLBaseShape<
  'my-custom-shape',
  {
    text: string
    icon: string
  }
>

export class ActorShape extends ShapeUtil<ActorShapeProps> {
  static override type = 'actor-shape' as const
  static override props: RecordProps<ActorShapeProps> = {
    text: T.string,
    icon: T.string,
  }

  getDefaultProps(): ActorShapeProps['props'] {
    return { text: '', icon: 'user' }
  }

  getGeometry(): Geometry2d {
    return new Rectangle2d({
      width: SHAPE_SIZE,
      height: SHAPE_SIZE,
      isFilled: true,
      isLabel: false,
    })
  }

  hideSelectionBoundsFg(_shape: ActorShapeProps): boolean {
    return true
  }

  component(shape: ActorShapeProps) {
    const theme = useDefaultColorTheme()

    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id

    return (
      <HTMLContainer className="flex flex-col items-center relative" style={{ pointerEvents: 'all' }}>
        <LoadableIcon name={shape.props.icon as keyof typeof dynamicIconImports} size={70} className="mt-1" />
        <TextLabel
          shapeId={shape.id}
          text={shape.props.text}
          type={shape.type}
          align="middle"
          verticalAlign="end"
          font="draw"
          fontSize={20}
          labelColor={theme['black'].fill}
          lineHeight={1}
          isSelected={isSelected}
        />
      </HTMLContainer>
    )
  }

  override getText(shape: ActorShapeProps) {
    return shape.props.text
  }

  indicator(_shape: ActorShapeProps) {
    return <rect width={SHAPE_SIZE} height={SHAPE_SIZE} />
  }

  canResize(_shape: ActorShapeProps): boolean {
    return false
  }

  canEdit(_shape: ActorShapeProps): boolean {
    return true
  }
}

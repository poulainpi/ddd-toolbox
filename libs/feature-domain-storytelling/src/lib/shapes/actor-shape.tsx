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
} from 'tldraw';
import { SHAPE_SIZE } from './shapes-constants';

type ActorShapeProps = TLBaseShape<
  'my-custom-shape',
  {
    text: string;
    icon: string;
  }
>;

export class ActorShape extends ShapeUtil<ActorShapeProps> {
  static override type = 'actor-shape' as const;
  static override props: RecordProps<ActorShapeProps> = {
    text: T.string,
    icon: T.string,
  };

  getDefaultProps(): ActorShapeProps['props'] {
    return { text: '', icon: 'person' };
  }

  getGeometry(): Geometry2d {
    return new Rectangle2d({
      width: SHAPE_SIZE,
      height: SHAPE_SIZE,
      isFilled: true,
    });
  }

  component(shape: ActorShapeProps) {
    const theme = useDefaultColorTheme();

    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id;

    return (
      <HTMLContainer style={{ backgroundColor: '#efefef' }}>
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
    );
  }

  override getText(shape: ActorShapeProps) {
    return shape.props.text;
  }

  indicator(shape: ActorShapeProps) {
    return <rect width={SHAPE_SIZE} height={SHAPE_SIZE} />;
  }

  canResize(_shape: ActorShapeProps): boolean {
    return false;
  }

  canEdit(_shape: ActorShapeProps): boolean {
    return true;
  }
}

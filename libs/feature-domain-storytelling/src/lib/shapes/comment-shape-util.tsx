import {
  Geometry2d,
  HTMLContainer,
  PlainTextLabel,
  Rectangle2d,
  ShapeUtil,
  TLBaseShape,
  TLDefaultColorStyle,
  DefaultColorStyle,
  RecordProps,
  T,
  getDefaultColorTheme,
} from 'tldraw'

export type TLCommentShape = TLBaseShape<'comment', { text: string; color: TLDefaultColorStyle; growY: number }>

export const COMMENT_WIDTH = 160
const COMMENT_PADDING = 8
const COMMENT_FONT_SIZE = 16
const COMMENT_LINE_HEIGHT = 1.3
export const COMMENT_MIN_HEIGHT = Math.ceil(COMMENT_FONT_SIZE * COMMENT_LINE_HEIGHT) + COMMENT_PADDING * 2

export class CommentShapeUtil extends ShapeUtil<TLCommentShape> {
  static override type = 'comment' as const

  static override props: RecordProps<TLCommentShape> = {
    text: T.string,
    color: DefaultColorStyle,
    growY: T.number,
  }

  override getDefaultProps(): TLCommentShape['props'] {
    return { text: '', color: 'black', growY: 0 }
  }

  override getGeometry(shape: TLCommentShape): Geometry2d {
    return new Rectangle2d({
      width: COMMENT_WIDTH,
      height: COMMENT_MIN_HEIGHT + shape.props.growY,
      isFilled: true,
      isLabel: true,
    })
  }

  override component(shape: TLCommentShape) {
    const theme = getDefaultColorTheme({ isDarkMode: this.editor.user.getIsDarkMode() })
    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id
    const height = COMMENT_MIN_HEIGHT + shape.props.growY
    const color = theme[shape.props.color].solid
    const bracketWidth = 20

    return (
      <HTMLContainer className="relative [&_*]:!cursor-[inherit]" style={{ pointerEvents: 'all' }}>
        <div
          className="relative"
          style={{
            width: COMMENT_WIDTH,
            height: height,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1,
              height: height,
              backgroundColor: color,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: bracketWidth,
              height: 1,
              backgroundColor: color,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: bracketWidth,
              height: 1,
              backgroundColor: color,
            }}
          />
          <div
            className="[&_.tl-text-content\_\_wrapper]:!justify-start"
            style={{
              position: 'absolute',
              left: `${COMMENT_PADDING}px`,
              top: `${COMMENT_PADDING}px`,
            }}
          >
            <PlainTextLabel
              shapeId={shape.id}
              text={shape.props.text}
              type={shape.type}
              align="start"
              verticalAlign="start"
              font="draw"
              fontSize={COMMENT_FONT_SIZE}
              labelColor={color}
              lineHeight={COMMENT_LINE_HEIGHT}
              isSelected={isSelected}
              textWidth={COMMENT_WIDTH - COMMENT_PADDING * 2}
            />
          </div>
        </div>
      </HTMLContainer>
    )
  }

  override getText(shape: TLCommentShape) {
    return shape.props.text
  }

  override indicator(shape: TLCommentShape) {
    return <rect width={COMMENT_WIDTH} height={COMMENT_MIN_HEIGHT + shape.props.growY} />
  }

  override canResize(_shape: TLCommentShape): boolean {
    return false
  }

  override canEdit(_shape: TLCommentShape): boolean {
    return true
  }

  override hideSelectionBoundsFg(_shape: TLCommentShape): boolean {
    return true
  }

  override onBeforeUpdate(prev: TLCommentShape, next: TLCommentShape) {
    // No change to text, no need to update
    if (prev.props.text === next.props.text) {
      return
    }

    // If text is deleted, reset growY
    if (next.props.text.trim() === '') {
      return {
        ...next,
        props: {
          ...next.props,
          growY: 0,
        },
      }
    }

    // Measure the text size
    const textSize = this.editor.textMeasure.measureText(next.props.text, {
      fontFamily: 'var(--tl-font-draw)',
      fontSize: COMMENT_FONT_SIZE,
      fontStyle: 'normal',
      fontWeight: 'normal',
      lineHeight: COMMENT_LINE_HEIGHT,
      maxWidth: COMMENT_WIDTH - COMMENT_PADDING * 2,
      padding: '0px',
    })

    const requiredHeight = Math.ceil(textSize.h) + COMMENT_PADDING * 2

    // Calculate growY
    let growY = 0
    if (requiredHeight > COMMENT_MIN_HEIGHT) {
      growY = requiredHeight - COMMENT_MIN_HEIGHT
    }

    // Only update if growY changed
    if (growY !== next.props.growY) {
      return {
        ...next,
        props: {
          ...next.props,
          growY,
        },
      }
    }
  }
}

import { Geometry2d, HTMLContainer, PlainTextLabel, RecordProps, Rectangle2d, ShapeUtil, T, TLBaseShape } from 'tldraw'
import { StickyNoteType } from '../types/sticky-note-types'
import { getStickyNoteSize, STICKY_NOTE_BG_COLORS } from './sticky-note-constants'

const MIN_FONT_SIZE = 10
const MAX_FONT_SIZE = 16
const LINE_HEIGHT = 1.2

export type TLStickyNoteShape = TLBaseShape<
  'sticky-note',
  {
    text: string
    stickyNoteType: StickyNoteType
  }
>

export class StickyNoteShapeUtil extends ShapeUtil<TLStickyNoteShape> {
  static override type = 'sticky-note' as const

  static override props: RecordProps<TLStickyNoteShape> = {
    text: T.string,
    stickyNoteType: T.literalEnum(...Object.values(StickyNoteType)),
  }

  override getDefaultProps(): TLStickyNoteShape['props'] {
    return {
      text: '',
      stickyNoteType: StickyNoteType.EVENT,
    }
  }

  override getGeometry(shape: TLStickyNoteShape): Geometry2d {
    const size = getStickyNoteSize(shape.props.stickyNoteType)
    return new Rectangle2d({
      width: size,
      height: size,
      isFilled: true,
      isLabel: false,
    })
  }

  override hideSelectionBoundsFg(_shape: TLStickyNoteShape): boolean {
    return true
  }

  override component(shape: TLStickyNoteShape) {
    const isSelected = this.editor.getOnlySelectedShapeId() === shape.id
    const bgColorClass = STICKY_NOTE_BG_COLORS[shape.props.stickyNoteType]
    const size = getStickyNoteSize(shape.props.stickyNoteType)

    const paddingX = 8
    const paddingY = 16
    const availableWidth = size - paddingX * 2
    const availableHeight = size - paddingY * 2
    const dynamicFontSize = calculateFontSize(shape.props.text, availableWidth, availableHeight)

    return (
      <HTMLContainer
        className={`relative flex items-center justify-center rounded-lg p-4 shadow-md ${bgColorClass} [&_*]:!cursor-[inherit] [&_*]:!caret-black`}
        style={{
          pointerEvents: 'all',
          width: size,
          height: size,
        }}
      >
        <PlainTextLabel
          shapeId={shape.id}
          text={shape.props.text}
          type={shape.type}
          align="middle"
          verticalAlign="middle"
          font="draw"
          fontSize={dynamicFontSize}
          lineHeight={LINE_HEIGHT}
          labelColor="black"
          isSelected={isSelected}
          textWidth={availableWidth}
        />
      </HTMLContainer>
    )
  }

  override getText(shape: TLStickyNoteShape) {
    return shape.props.text
  }

  override indicator(shape: TLStickyNoteShape) {
    const size = getStickyNoteSize(shape.props.stickyNoteType)
    return <rect width={size} height={size} rx={8} />
  }

  override canResize(_shape: TLStickyNoteShape): boolean {
    return false
  }

  override canEdit(_shape: TLStickyNoteShape): boolean {
    return true
  }
}

/**
 * Calculate optimal font size based on text length and available space
 * Returns a font size between MIN_FONT_SIZE and MAX_FONT_SIZE that fits the text
 */
function calculateFontSize(text: string, availableWidth: number, availableHeight: number): number {
  if (!text || text.length === 0) {
    return MAX_FONT_SIZE
  }

  // Estimate average character width as 0.5 * fontSize for the 'draw' font
  const CHAR_WIDTH_RATIO = 0.5

  // Try each font size from max to min
  for (let fontSize = MAX_FONT_SIZE; fontSize >= MIN_FONT_SIZE; fontSize--) {
    const charWidth = fontSize * CHAR_WIDTH_RATIO
    const charsPerLine = Math.floor(availableWidth / charWidth)

    if (charsPerLine <= 0) continue

    const estimatedLines = Math.ceil(text.length / charsPerLine)
    const lineHeightPx = fontSize * LINE_HEIGHT
    const totalHeight = estimatedLines * lineHeightPx

    if (totalHeight <= availableHeight) {
      return fontSize
    }
  }

  return MIN_FONT_SIZE
}

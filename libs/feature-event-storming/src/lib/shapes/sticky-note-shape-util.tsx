import { Geometry2d, HTMLContainer, PlainTextLabel, RecordProps, Rectangle2d, ShapeUtil, T, TLBaseShape } from 'tldraw'
import { StickyNoteType } from '../types/sticky-note-types'
import { getStickyNoteSize, STICKY_NOTE_BG_COLORS } from './sticky-note-constants'

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
          fontSize={16}
          lineHeight={1.2}
          labelColor="black"
          isSelected={isSelected}
          textWidth={size - 16}
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

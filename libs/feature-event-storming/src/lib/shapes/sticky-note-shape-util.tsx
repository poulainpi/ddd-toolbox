import { Geometry2d, HTMLContainer, PlainTextLabel, Rectangle2d, RecordProps, ShapeUtil, T, TLBaseShape } from 'tldraw'
import { StickyNoteType } from '../types/sticky-note-types'
import { STICKY_NOTE_SIZE, STICKY_NOTE_BG_COLORS } from './sticky-note-constants'

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

  override getGeometry(): Geometry2d {
    return new Rectangle2d({
      width: STICKY_NOTE_SIZE,
      height: STICKY_NOTE_SIZE,
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

    return (
      <HTMLContainer
        className={`relative flex items-center justify-center rounded-lg p-4 shadow-md ${bgColorClass}`}
        style={{
          pointerEvents: 'all',
          width: STICKY_NOTE_SIZE,
          height: STICKY_NOTE_SIZE,
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
          textWidth={STICKY_NOTE_SIZE - 16}
        />
      </HTMLContainer>
    )
  }

  override getText(shape: TLStickyNoteShape) {
    return shape.props.text
  }

  override indicator(_shape: TLStickyNoteShape) {
    return <rect width={STICKY_NOTE_SIZE} height={STICKY_NOTE_SIZE} rx={8} />
  }

  override canResize(_shape: TLStickyNoteShape): boolean {
    return false
  }

  override canEdit(_shape: TLStickyNoteShape): boolean {
    return true
  }
}

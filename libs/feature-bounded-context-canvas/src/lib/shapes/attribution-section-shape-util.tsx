import { HTMLContainer, RecordProps, T, TLBaseShape } from 'tldraw'
import { AbstractSectionShapeUtil, TLSectionBaseProps } from './abstract-section-shape-util'
import { ATTRIBUTION_WIDTH, FIRST_ROW_HEIGHT } from '../constants'

export type TLAttributionSectionShape = TLBaseShape<'attribution-section', TLSectionBaseProps>

export class AttributionSectionShapeUtil extends AbstractSectionShapeUtil<'attribution-section', TLSectionBaseProps> {
  static override type = 'attribution-section' as const
  static readonly WIDTH = ATTRIBUTION_WIDTH

  static override props: RecordProps<TLAttributionSectionShape> = {
    height: T.number,
  }

  override getDefaultProps(): TLAttributionSectionShape['props'] {
    return { height: FIRST_ROW_HEIGHT }
  }

  override getWidth(): number {
    return AttributionSectionShapeUtil.WIDTH
  }

  override getDefaultHeight(): number {
    return FIRST_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 0
  }

  override getBorderClasses(): string {
    return 'border-t-2 border-b-2 border-r-2'
  }

  override getRoundedClasses(): string {
    return 'rounded-tr-lg'
  }

  override getIndicatorRadius(): number {
    return 8
  }

  override canEdit(): boolean {
    return false
  }

  override getHandles(): never[] {
    return []
  }

  override component(shape: TLAttributionSectionShape) {
    const width = this.getWidth()
    const height = shape.props.height
    const borderClasses = this.getBorderClasses()
    const roundedClasses = this.getRoundedClasses()

    return (
      <HTMLContainer className="bg-background" style={{ pointerEvents: 'all', width, height }}>
        <a
          href="https://github.com/ddd-crew/bounded-context-canvas"
          target="_blank"
          rel="noopener noreferrer"
          className={`border-foreground relative flex h-full items-center justify-center gap-4 px-3 no-underline ${borderClasses} ${roundedClasses}`}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span className="font-draw text-muted-foreground absolute top-1 left-3 text-xs font-semibold">V5</span>
          <span className="font-draw text-muted-foreground text-xs">github.com/ddd-crew/bounded-context-canvas</span>
          <img
            src="/cc-by.png"
            alt="Creative Commons Attribution license"
            style={{ height: 36, width: 'auto', flexShrink: 0 }}
          />
        </a>
      </HTMLContainer>
    )
  }

  override getText(): string {
    return ''
  }
}

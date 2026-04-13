import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { ASSUMPTIONS_WIDTH, BOTTOM_ROW_HEIGHT } from '../constants'

export type TLAssumptionsSectionShape = TLTextSectionShape<'assumptions-section'>

export class AssumptionsSectionShapeUtil extends AbstractTextSectionShapeUtil<'assumptions-section'> {
  static override type = 'assumptions-section' as const
  static readonly WIDTH = ASSUMPTIONS_WIDTH
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Assumptions'
  }

  override getPlaceholder(): string {
    return 'Describe which currently unverified assumptions went into this bounded context design. Make those assumptions explicit by documenting them here'
  }

  override getWidth(): number {
    return AssumptionsSectionShapeUtil.WIDTH
  }

  override getDefaultHeight(): number {
    return BOTTOM_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 3
  }

  override getFontSize(): number {
    return AssumptionsSectionShapeUtil.FONT_SIZE
  }

  override getBorderClasses(): string {
    return 'border-l-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return 'rounded-bl-lg'
  }

  override getIndicatorRadius(): number {
    return 8
  }
}

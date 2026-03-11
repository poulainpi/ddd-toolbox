import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { ASSUMPTIONS_WIDTH } from '../constants'

export type TLAssumptionsSectionShape = TLTextSectionShape<'assumptions-section'>

export class AssumptionsSectionShapeUtil extends AbstractTextSectionShapeUtil<'assumptions-section'> {
  static override type = 'assumptions-section' as const
  static readonly WIDTH = ASSUMPTIONS_WIDTH
  static readonly HEIGHT = 120
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Assumptions'
  }

  override getWidth(): number {
    return AssumptionsSectionShapeUtil.WIDTH
  }

  override getHeight(): number {
    return AssumptionsSectionShapeUtil.HEIGHT
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

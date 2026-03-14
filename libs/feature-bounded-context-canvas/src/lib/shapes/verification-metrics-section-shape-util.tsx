import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { VERIFICATION_METRICS_WIDTH, BOTTOM_ROW_HEIGHT } from '../constants'

export type TLVerificationMetricsSectionShape = TLTextSectionShape<'verification-metrics-section'>

export class VerificationMetricsSectionShapeUtil extends AbstractTextSectionShapeUtil<'verification-metrics-section'> {
  static override type = 'verification-metrics-section' as const
  static readonly WIDTH = VERIFICATION_METRICS_WIDTH
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Verification Metrics'
  }

  override getWidth(): number {
    return VerificationMetricsSectionShapeUtil.WIDTH
  }

  override getDefaultHeight(): number {
    return BOTTOM_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 3
  }

  override getFontSize(): number {
    return VerificationMetricsSectionShapeUtil.FONT_SIZE
  }

  override getBorderClasses(): string {
    return 'border-b-2 border-x-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }
}

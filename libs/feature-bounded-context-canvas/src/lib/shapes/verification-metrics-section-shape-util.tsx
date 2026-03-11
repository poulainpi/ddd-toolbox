import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { VERIFICATION_METRICS_WIDTH } from '../constants'

export type TLVerificationMetricsSectionShape = TLTextSectionShape<'verification-metrics-section'>

export class VerificationMetricsSectionShapeUtil extends AbstractTextSectionShapeUtil<'verification-metrics-section'> {
  static override type = 'verification-metrics-section' as const
  static readonly WIDTH = VERIFICATION_METRICS_WIDTH
  static readonly HEIGHT = 120
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Verification Metrics'
  }

  override getWidth(): number {
    return VerificationMetricsSectionShapeUtil.WIDTH
  }

  override getHeight(): number {
    return VerificationMetricsSectionShapeUtil.HEIGHT
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

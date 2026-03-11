import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { OPEN_QUESTIONS_WIDTH } from '../constants'

export type TLOpenQuestionsSectionShape = TLTextSectionShape<'open-questions-section'>

export class OpenQuestionsSectionShapeUtil extends AbstractTextSectionShapeUtil<'open-questions-section'> {
  static override type = 'open-questions-section' as const
  static readonly WIDTH = OPEN_QUESTIONS_WIDTH
  static readonly HEIGHT = 120
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Open Questions'
  }

  override getWidth(): number {
    return OpenQuestionsSectionShapeUtil.WIDTH
  }

  override getHeight(): number {
    return OpenQuestionsSectionShapeUtil.HEIGHT
  }

  override getFontSize(): number {
    return OpenQuestionsSectionShapeUtil.FONT_SIZE
  }

  override getBorderClasses(): string {
    return 'border-r-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return 'rounded-br-lg'
  }

  override getIndicatorRadius(): number {
    return 8
  }
}

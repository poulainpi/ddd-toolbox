import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { PURPOSE_WIDTH, SECOND_ROW_HEIGHT } from '../constants'

export type TLPurposeSectionShape = TLTextSectionShape<'purpose-section'>

export class PurposeSectionShapeUtil extends AbstractTextSectionShapeUtil<'purpose-section'> {
  static override type = 'purpose-section' as const
  static readonly WIDTH = PURPOSE_WIDTH
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Purpose'
  }

  override getPlaceholder(): string {
    return 'What benefits does this context provide, and how does it provide them? Describe the purpose from a business perspective'
  }

  override getWidth(): number {
    return PurposeSectionShapeUtil.WIDTH
  }

  override getDefaultHeight(): number {
    return SECOND_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 1
  }

  override getFontSize(): number {
    return PurposeSectionShapeUtil.FONT_SIZE
  }

  override getBorderClasses(): string {
    return 'border-l-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }
}

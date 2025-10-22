import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'

export type TLPurposeSectionShape = TLTextSectionShape<'purpose-section'>

export class PurposeSectionShapeUtil extends AbstractTextSectionShapeUtil<'purpose-section'> {
  static override type = 'purpose-section' as const
  static readonly WIDTH = 600
  static readonly HEIGHT = 180
  static readonly FONT_SIZE = 16

  override getLabel(): string {
    return 'Purpose'
  }

  override getWidth(): number {
    return PurposeSectionShapeUtil.WIDTH
  }

  override getHeight(): number {
    return PurposeSectionShapeUtil.HEIGHT
  }

  override getFontSize(): number {
    return PurposeSectionShapeUtil.FONT_SIZE
  }

  override getBorderClasses(): string {
    return 'border-x-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getIndicatorRadius(): number {
    return 0
  }
}

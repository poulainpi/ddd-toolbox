import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'

export type TLNameSectionShape = TLTextSectionShape<'name-section'>

export class NameSectionShapeUtil extends AbstractTextSectionShapeUtil<'name-section'> {
  static override type = 'name-section' as const
  static readonly WIDTH = 600
  static readonly HEIGHT = 120
  static readonly FONT_SIZE = 20

  override getLabel(): string {
    return 'Name'
  }

  override getWidth(): number {
    return NameSectionShapeUtil.WIDTH
  }

  override getHeight(): number {
    return NameSectionShapeUtil.HEIGHT
  }

  override getFontSize(): number {
    return NameSectionShapeUtil.FONT_SIZE
  }

  override getBorderClasses(): string {
    return 'border-2'
  }

  override getRoundedClasses(): string {
    return 'rounded-t-lg'
  }

  override getIndicatorRadius(): number {
    return 8
  }
}

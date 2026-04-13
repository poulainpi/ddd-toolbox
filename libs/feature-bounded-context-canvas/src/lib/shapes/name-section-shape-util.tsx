import { AbstractTextSectionShapeUtil, TLTextSectionShape } from './abstract-text-section-shape-util'
import { CANVAS_WIDTH, NAME_HEIGHT } from '../constants'

export type TLNameSectionShape = TLTextSectionShape<'name-section'>

export class NameSectionShapeUtil extends AbstractTextSectionShapeUtil<'name-section'> {
  static override type = 'name-section' as const
  static readonly WIDTH = CANVAS_WIDTH
  static readonly FONT_SIZE = 20

  override getLabel(): string {
    return 'Name'
  }

  override getWidth(): number {
    return NameSectionShapeUtil.WIDTH
  }

  override getDefaultHeight(): number {
    return NAME_HEIGHT
  }

  override getRowIndex(): number {
    return 0
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

  override isInline(): boolean {
    return true
  }
}

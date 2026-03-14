import { COMMUNICATION_ROW_HEIGHT, OUTBOUND_COMMUNICATION_WIDTH } from '../constants'
import {
  AbstractCommunicationSectionShapeUtil,
  TLCommunicationSectionShape,
} from './abstract-communication-section-shape-util'

export type TLOutboundCommunicationShape = TLCommunicationSectionShape<'outbound-communication-section'>

export class OutboundCommunicationShapeUtil extends AbstractCommunicationSectionShapeUtil<'outbound-communication-section'> {
  static override type = 'outbound-communication-section' as const
  static readonly WIDTH = OUTBOUND_COMMUNICATION_WIDTH

  override getWidth(): number {
    return OUTBOUND_COMMUNICATION_WIDTH
  }

  override getDefaultHeight(): number {
    return COMMUNICATION_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 2
  }

  override getBorderClasses(): string {
    return 'border-r-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getDirection(): 'outbound' {
    return 'outbound'
  }
}

import { COMMUNICATION_ROW_HEIGHT, INBOUND_COMMUNICATION_WIDTH } from '../../constants'
import {
  AbstractCommunicationSectionShapeUtil,
  TLCommunicationSectionShape,
} from './abstract-communication-section-shape-util'

export type TLInboundCommunicationShape = TLCommunicationSectionShape<'inbound-communication-section'>

export class InboundCommunicationShapeUtil extends AbstractCommunicationSectionShapeUtil<'inbound-communication-section'> {
  static override type = 'inbound-communication-section' as const
  static readonly WIDTH = INBOUND_COMMUNICATION_WIDTH

  override getWidth(): number {
    return INBOUND_COMMUNICATION_WIDTH
  }

  override getDefaultHeight(): number {
    return COMMUNICATION_ROW_HEIGHT
  }

  override getRowIndex(): number {
    return 2
  }

  override getBorderClasses(): string {
    return 'border-l-2 border-b-2'
  }

  override getRoundedClasses(): string {
    return ''
  }

  override getDirection(): 'inbound' {
    return 'inbound'
  }
}

import { DefaultColorStyle, RecordProps, T } from 'tldraw'
import { WORK_OBJECT_SHAPE_SIZE } from './shapes-constants'
import { DomainObjectShapeUtil, TLDomainObjectShape } from './domain-object-shape-util'

type TLWorkObjectShape = TLDomainObjectShape<'work-object'>

export class WorkObjectShapeUtil extends DomainObjectShapeUtil<'work-object'> {
  static override type = 'work-object' as const

  static override props: RecordProps<TLWorkObjectShape> = {
    text: T.string,
    color: DefaultColorStyle,
    icon: T.string,
  }

  override getDefaultProps(): TLWorkObjectShape['props'] {
    return { text: '', color: 'black', icon: 'message-circle' }
  }

  override getSize(): number {
    return WORK_OBJECT_SHAPE_SIZE
  }

  override getLabelYPosition(): number {
    return 56
  }
}

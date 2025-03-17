import { DefaultColorStyle, RecordProps, T } from 'tldraw'
import { ACTOR_SHAPE_SIZE } from './shapes-constants'
import { DomainObjectShapeUtil, TLDomainObjectShape } from './domain-object-shape-util'

type TLActorShape = TLDomainObjectShape<'actor'>

export class ActorShapeUtil extends DomainObjectShapeUtil<'actor'> {
  static override type = 'actor' as const

  static override props: RecordProps<TLActorShape> = {
    text: T.string,
    color: DefaultColorStyle,
    icon: T.string,
  }

  override getDefaultProps(): TLActorShape['props'] {
    return { text: '', color: 'black', icon: 'user' }
  }

  override getSize(): number {
    return ACTOR_SHAPE_SIZE
  }

  override getLabelYPosition(): number {
    return 74
  }
}

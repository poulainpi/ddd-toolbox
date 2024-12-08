import { RecordProps, T } from 'tldraw'
import { ACTOR_SHAPE_SIZE } from './shapes-constants'
import { DomainObjectShapeUtil, TLDomainObjectShape } from './domain-object-shape-util'

type TLActorShape = TLDomainObjectShape<'actor'>

export class ActorShapeUtil extends DomainObjectShapeUtil<'actor'> {
  static override type = 'actor' as const

  static override props: RecordProps<TLActorShape> = {
    text: T.string,
    icon: T.string,
  }

  getDefaultProps(): TLActorShape['props'] {
    return { text: '', icon: 'user' }
  }

  getSize(): number {
    return ACTOR_SHAPE_SIZE
  }
}

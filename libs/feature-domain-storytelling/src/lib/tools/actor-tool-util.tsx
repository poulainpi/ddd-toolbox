import { DomainObjectToolUtil } from './domain-object-tool-util'
import { ACTOR_SHAPE_SIZE } from '../shapes/shapes-constants'
import { ActorShapeUtil } from '../shapes/actor-shape-util'

export class ActorToolUtil extends DomainObjectToolUtil {
  static override id = 'actor'

  override getShapeType(): string {
    return ActorShapeUtil.type
  }

  override getSize(): number {
    return ACTOR_SHAPE_SIZE
  }
}

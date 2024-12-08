import { DomainObjectToolUtil } from './domain-object-tool-util'
import { WorkObjectShapeUtil } from '../shapes/work-object-shape-util'
import { WORK_OBJECT_SHAPE_SIZE } from '../shapes/shapes-constants'

export class WorkObjectToolUtil extends DomainObjectToolUtil {
  static override id = 'work-object'

  override getShapeType(): string {
    return WorkObjectShapeUtil.type
  }

  override getSize(): number {
    return WORK_OBJECT_SHAPE_SIZE
  }
}

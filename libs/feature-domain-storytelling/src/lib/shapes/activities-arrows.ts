import { ActorShapeUtil } from './actor-shape-util'
import { Editor, TLArrowShape } from 'tldraw'
import { ArrowShapeUtil } from './arrow-shape-util'

export function getActivitiesArrows(editor: Editor): TLArrowShape[] {
  const bindingsOnActors = editor
    .getCurrentPageShapes()
    .filter((shape) => shape.type === ActorShapeUtil.type)
    .map((shape) => editor.getBindingsInvolvingShape(shape, 'arrow'))
    .flat()

  return bindingsOnActors
    .map((binding) => editor.getShape(binding.fromId))
    .filter((shape) => shape?.type === ArrowShapeUtil.type) as TLArrowShape[]
}

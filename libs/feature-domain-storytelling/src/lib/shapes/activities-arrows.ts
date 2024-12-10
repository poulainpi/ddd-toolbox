import { ActorShapeUtil } from './actor-shape-util'
import { Editor, TLArrowBindingProps, TLArrowShape } from 'tldraw'

export function getActivitiesArrows(editor: Editor): TLArrowShape[] {
  return editor
    .getCurrentPageShapes()
    .filter((shape) => shape.type === ActorShapeUtil.type)
    .map((shape) =>
      editor
        .getBindingsToShape(shape, 'arrow')
        .filter((binding) => (binding.props as TLArrowBindingProps).terminal === 'start')
    )
    .flat()
    .map((binding) => editor.getShape(binding.fromId)) as TLArrowShape[]
}

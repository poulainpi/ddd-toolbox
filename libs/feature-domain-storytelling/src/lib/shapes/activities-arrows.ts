import { ActorShapeUtil } from './actor-shape-util'
import { WorkObjectShapeUtil } from './work-object-shape-util'
import { Editor, TLArrowBindingProps, TLArrowShape } from 'tldraw'

export function getActivitiesArrows(editor: Editor): TLArrowShape[] {
  return editor
    .getCurrentPageShapes()
    .filter((shape) => shape.type === ActorShapeUtil.type)
    .map((shape) =>
      editor
        .getBindingsToShape(shape, 'arrow')
        .filter((binding) => (binding.props as TLArrowBindingProps).terminal === 'start'),
    )
    .flat()
    .map((binding) => editor.getShape(binding.fromId))
    .filter((arrow) => {
      const bindings = editor.getBindingsFromShape(arrow as TLArrowShape, 'arrow')
      const endBinding = bindings.find((b) => (b.props as TLArrowBindingProps).terminal === 'end')
      return endBinding && editor.getShape(endBinding.toId)?.type === WorkObjectShapeUtil.type
    }) as TLArrowShape[]
}

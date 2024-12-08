import { Editor, TLShape, Vec } from 'tldraw'
import { SHAPE_SIZE } from './shapes-constants'
import { ActorShapeUtil } from './actor-shape-util'

export function registerSideEffects(editor: Editor) {
  disablePreciseBindings(editor)
  fixArrowPositioning(editor)
  deleteArrowsWithoutStartAndEndBindings(editor)
}

function disablePreciseBindings(editor: Editor) {
  editor.sideEffects.registerBeforeCreateHandler('binding', (binding) => {
    return {
      ...binding,
      props: { ...binding.props, isPrecise: false },
    }
  })

  editor.sideEffects.registerBeforeChangeHandler('binding', (binding) => {
    return {
      ...binding,
      props: { ...binding.props, isPrecise: false },
    }
  })
}

function fixArrowPositioning(editor: Editor) {
  editor.sideEffects.registerBeforeCreateHandler('shape', (shape, source) => {
    if (shape.type === 'arrow') {
      const hintingShape = editor.getHintingShape()[0]
      if (hintingShape?.type === ActorShapeUtil.type) {
        const { x, y } = getReplacedArrowRelativePoint(hintingShape, editor.inputs.currentPagePoint)
        return {
          ...shape,
          x: hintingShape.x + x,
          y: hintingShape.y + y,
        }
      }
    }
    return shape
  })
}

function deleteArrowsWithoutStartAndEndBindings(editor: Editor) {
  editor.sideEffects.registerAfterChangeHandler('instance', (prev, next) => {
    if (['cross', 'grabbing'].includes(prev.cursor.type) && next.cursor.type === 'default') {
      const selectedShape = editor.getSelectedShapes()[0]
      if (selectedShape?.type === 'arrow' && !editor.inputs.isDragging) {
        const hasStartAndEndBindings = editor.getBindingsFromShape(selectedShape, 'arrow').length >= 2
        if (!hasStartAndEndBindings) {
          editor.deleteShape(selectedShape)
        }
      }
    }
    return next
  })
}

function getReplacedArrowRelativePoint(hintingShape: TLShape, initialArrowPoint: Vec): { x: number; y: number } {
  const centerX = hintingShape.x + SHAPE_SIZE / 2
  const centerY = hintingShape.y + SHAPE_SIZE / 2

  const offsetX = initialArrowPoint.x - centerX
  const offsetY = initialArrowPoint.y - centerY

  const mouseX = initialArrowPoint.x - hintingShape.x
  const mouseY = initialArrowPoint.y - hintingShape.y

  if (Math.abs(offsetX) > Math.abs(offsetY)) {
    if (offsetX > 0) {
      return { x: SHAPE_SIZE, y: mouseY }
    } else {
      return { x: 0, y: mouseY }
    }
  } else {
    if (offsetY > 0) {
      return { x: mouseX, y: SHAPE_SIZE }
    } else {
      return { x: mouseX, y: 0 }
    }
  }
}

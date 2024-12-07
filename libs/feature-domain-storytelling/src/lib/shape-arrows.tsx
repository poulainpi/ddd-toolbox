import { useEditor, useValue } from 'tldraw'
import { ActorShapeUtil } from './shapes/actor-shape-util'

export function ShapeArrows() {
  const editor = useEditor()

  const selectedShapeBounds = useValue(
    'selection bounds',
    () => {
      const screenBounds = editor.getViewportScreenBounds()
      const rotation = editor.getSelectionRotation()
      const rotatedPageBounds = editor.getSelectionRotatedPageBounds()
      const selectedShape = editor.getSelectedShapes()[0]
      if (!rotatedPageBounds) return

      return {
        x: rotatedPageBounds.x - screenBounds.x,
        y: rotatedPageBounds.y - screenBounds.y,
        width: rotatedPageBounds.width,
        height: rotatedPageBounds.height,
        rotation: rotation,
        selectedShape,
      }
    },
    [editor]
  )

  const startArrowCreation = () => {
    editor.setCurrentTool('arrow')
    editor.setHintingShapes([editor.getSelectedShapes()[0].id])
    editor.getCurrentTool().transition('pointing', {})
  }

  if (!selectedShapeBounds || selectedShapeBounds.selectedShape.type != ActorShapeUtil.type) {
    return
  }

  return (
    <div
      className="absolute invisible"
      style={{
        top: 0,
        left: 0,
        transform: `translate(${selectedShapeBounds.x}px, ${selectedShapeBounds.y}px) rotate(${selectedShapeBounds.rotation}rad)`,
        width: selectedShapeBounds.width,
        height: selectedShapeBounds.height,
      }}
    >
      <div
        className="absolute visible -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-[12px] border-transparent border-b-background border-t-0 z-[10]"
        onPointerDown={startArrowCreation}
      ></div>
      <div
        className="absolute visible -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-[12px] border-transparent border-t-background border-b-0 z-[10]"
        onPointerDown={startArrowCreation}
      ></div>
      <div
        className="absolute visible -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-[12px] border-transparent border-r-background border-l-0 z-[10]"
        onPointerDown={startArrowCreation}
      ></div>
      <div
        className="absolute visible -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-[12px] border-transparent border-l-background border-r-0 z-[10]"
        onPointerDown={startArrowCreation}
      ></div>
    </div>
  )
}

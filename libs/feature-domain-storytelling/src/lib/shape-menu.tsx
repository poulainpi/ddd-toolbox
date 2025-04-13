import { useEditor, useValue } from 'tldraw'
import { useEffect, useState } from 'react'
import { MoveUpRightIcon, Trash2Icon } from 'lucide-react'
import { Button, LoadableIcon, Popover, PopoverAnchor, PopoverContent } from '@ddd-toolbox/ui'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { useActors } from './states/use-actors'
import { useWorkObjects } from './states/use-work-objects'
import { IconName } from 'lucide-react/dynamic'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { ActorToolUtil } from './tools/actor-tool-util'

export function ShapeMenu() {
  const editor = useEditor()
  const isDragging = editor.inputs.isDragging
  const isEditingShape = editor.getEditingShapeId() !== null

  useMouseDown() // trick because isDragging is not observable

  const { actors } = useActors()
  const { workObjects } = useWorkObjects()

  const selectedShapeBounds = useValue(
    'selection bounds',
    () => {
      const screenBounds = editor.getViewportScreenBounds()
      const rotation = editor.getSelectionRotation()
      const rotatedScreenBounds = editor.getSelectionRotatedScreenBounds()
      const selectedShapes = editor.getSelectedShapes()
      if (!rotatedScreenBounds || selectedShapes.length != 1) return

      return {
        x: rotatedScreenBounds.x - screenBounds.x,
        y: rotatedScreenBounds.y - screenBounds.y,
        width: rotatedScreenBounds.width,
        height: rotatedScreenBounds.height,
        rotation: rotation,
        selectedShape: selectedShapes[0],
      }
    },
    [editor],
  )

  if (
    !selectedShapeBounds ||
    !([ActorShapeUtil.type, WorkObjectShapeUtil.type] as string[]).includes(selectedShapeBounds.selectedShape.type)
  ) {
    return
  }

  const selectedShape = selectedShapeBounds.selectedShape

  function giveFocusToEditor() {
    // Trick to give back focus to the editor to allow escape key to work
    editor.blur()
    editor.focus()
  }

  return (
    <Popover open={!isDragging && !isEditingShape}>
      <PopoverAnchor asChild={true}>
        <div
          className="absolute invisible"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${selectedShapeBounds.x}px, ${selectedShapeBounds.y}px) rotate(${selectedShapeBounds.rotation}rad)`,
            width: selectedShapeBounds.width,
            height: selectedShapeBounds.height,
          }}
        ></div>
      </PopoverAnchor>

      <PopoverContent
        side="right"
        align="start"
        hasOpenAnimation={false}
        hasOutAnimation={false}
        onOpenAutoFocus={(event) => {
          event.preventDefault() // prevent focus to let the shape input focused
        }}
        className="w-fit max-w-[170px] p-1 divide-y flex flex-col gap-1"
      >
        <div className="flex pb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              editor.selectNone()
              editor.setHintingShapes([selectedShape])
              editor.setCurrentTool('clicked-arrow')
              giveFocusToEditor()
            }}
          >
            <MoveUpRightIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              editor.deleteShape(selectedShape)
            }}
          >
            <Trash2Icon />
          </Button>
        </div>

        {selectedShape.type === WorkObjectShapeUtil.type && (
          <div className="flex flex-wrap">
            {actors.map((actor) => (
              <Button
                key={actor}
                variant="ghost"
                size="icon"
                onClick={() => {
                  editor.selectNone()
                  editor.setCurrentTool(ActorToolUtil.id, { icon: actor, initiatorShapeId: selectedShape.id })
                  giveFocusToEditor()
                }}
              >
                <LoadableIcon name={actor as IconName} />
              </Button>
            ))}
          </div>
        )}

        {(selectedShape.type === ActorShapeUtil.type || selectedShape.type === WorkObjectShapeUtil.type) && (
          <div className="flex flex-wrap">
            {workObjects.map((workObject) => (
              <Button
                key={workObject}
                variant="ghost"
                size="icon"
                onClick={() => {
                  editor.selectNone()
                  editor.setCurrentTool(WorkObjectToolUtil.id, {
                    icon: workObject,
                    initiatorShapeId: selectedShape.id,
                  })
                  giveFocusToEditor()
                }}
              >
                <LoadableIcon name={workObject as IconName} />
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

const useMouseDown = () => {
  const [isMouseDown, setIsMouseDown] = useState(false)

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true)
    const handleMouseUp = () => setIsMouseDown(false)

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return isMouseDown
}

import { track, useEditor } from 'tldraw'
import { useEffect, useState } from 'react'
import { MoveUpRightIcon } from 'lucide-react'
import { Button, Popover, PopoverAnchor, PopoverContent } from '@ddd-toolbox/ui'
import { ACTOR_SHAPE_SIZE } from './shapes/shapes-constants'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'

export const ShapeMenu = track(function ShapeMenu() {
  const editor = useEditor()
  const selectedShape = editor.getOnlySelectedShape()
  const isDragging = editor.inputs.isDragging

  useMouseDown() // trick because isDragging is not observable

  if (
    selectedShape == null ||
    (selectedShape.type !== ActorShapeUtil.type && selectedShape.type !== WorkObjectShapeUtil.type)
  ) {
    return null
  }

  const selectedShapeScreenPoint = editor.pageToScreen({
    x: selectedShape.x,
    y: selectedShape.y,
  })

  return (
    <Popover open={!isDragging}>
      <PopoverAnchor asChild={true}>
        <div
          className="absolute invisible"
          style={{
            left: selectedShapeScreenPoint.x,
            top: selectedShapeScreenPoint.y,
            width: ACTOR_SHAPE_SIZE,
            height: ACTOR_SHAPE_SIZE,
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
        className="w-24"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            editor.setCurrentTool('clicked-arrow')
            editor.setHintingShapes([selectedShape])
          }}
        >
          <MoveUpRightIcon />
        </Button>
      </PopoverContent>
    </Popover>
  )
})

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

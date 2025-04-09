import { track, useEditor } from 'tldraw'
import { useEffect, useState } from 'react'
import { MoveUpRightIcon } from 'lucide-react'
import { Button, LoadableIcon, Popover, PopoverAnchor, PopoverContent } from '@ddd-toolbox/ui'
import { ACTOR_SHAPE_SIZE } from './shapes/shapes-constants'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { useActors } from './states/use-actors'
import { useWorkObjects } from './states/use-work-objects'
import { IconName } from 'lucide-react/dynamic'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { ActorToolUtil } from './tools/actor-tool-util'

export const ShapeMenu = track(function ShapeMenu() {
  const editor = useEditor()
  const selectedShape = editor.getOnlySelectedShape()
  const isDragging = editor.inputs.isDragging

  useMouseDown() // trick because isDragging is not observable

  const { actors } = useActors()
  const { workObjects } = useWorkObjects()

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
        className="w-fit max-w-[170px] p-1 divide-y flex flex-col gap-1"
      >
        <div className="flex pb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              editor.setHintingShapes([selectedShape])
              editor.setCurrentTool('clicked-arrow')
            }}
          >
            <MoveUpRightIcon />
          </Button>
        </div>

        <div className="flex flex-wrap">
          {selectedShape.type === ActorShapeUtil.type &&
            workObjects.map((workObject) => (
              <Button
                key={workObject}
                variant="ghost"
                size="icon"
                onClick={() => {
                  editor.selectNone()
                  editor.setCurrentTool(WorkObjectToolUtil.id, { icon: workObject, initiatorShapeId: selectedShape.id })
                }}
              >
                <LoadableIcon name={workObject as IconName} />
              </Button>
            ))}
          {selectedShape.type === WorkObjectShapeUtil.type &&
            actors.map((actor) => (
              <Button
                key={actor}
                variant="ghost"
                size="icon"
                onClick={() => {
                  editor.selectNone()
                  editor.setCurrentTool(ActorToolUtil.id, { icon: actor, initiatorShapeId: selectedShape.id })
                }}
              >
                <LoadableIcon name={actor as IconName} />
              </Button>
            ))}
        </div>
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

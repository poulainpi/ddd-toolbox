import { Editor, TLShape, useEditor, useValue, useReadonly } from 'tldraw'
import { useEffect, useState } from 'react'
import { MoveUpRightIcon, Trash2Icon } from 'lucide-react'
import {
  Button,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ddd-toolbox/ui'
import { LoadableIcon } from '@ddd-toolbox/ui-loadable-icon'
import { IconName } from 'lucide-react/dynamic'

export interface MenuActionGroup {
  id: string
  actions: MenuAction[]
}

export interface MenuAction {
  icon: string
  color?: string
  tooltip?: string
  onClick: (editor: Editor, selectedShape: TLShape) => void
}

export interface ShapeMenuProps {
  onArrowClick?: (editor: Editor, selectedShape: TLShape) => void
  actionGroups: MenuActionGroup[]
  showOnShapeTypes?: string[]
}

export function ShapeMenu({ onArrowClick, actionGroups, showOnShapeTypes }: ShapeMenuProps) {
  const editor = useEditor()
  const isDragging = editor.inputs.isDragging
  const isEditingShape = editor.getEditingShapeId() !== null
  const isReadonlyMode = useReadonly()

  // Ensure that the menu updates when the selected shape changes
  useValue('only selected shape', () => editor.getOnlySelectedShape(), [editor])

  useMouseDown() // trick because isDragging is not observable

  const selectedShapeBounds = useValue(
    'selection bounds',
    () => {
      const screenBounds = editor.getViewportScreenBounds()
      const rotation = editor.getSelectionRotation()
      const rotatedScreenBounds = editor.getSelectionRotatedScreenBounds()
      const selectedShapes = editor.getSelectedShapes()
      if (!rotatedScreenBounds || selectedShapes.length !== 1) return

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
    isReadonlyMode ||
    (showOnShapeTypes && !showOnShapeTypes.includes(selectedShapeBounds.selectedShape.type))
  ) {
    return null
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
          className="invisible absolute"
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
        className="flex w-fit max-w-[170px] flex-col gap-1 divide-y p-1 [&>*:not(:last-child)]:pb-1"
      >
        <div className="flex">
          {onArrowClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onArrowClick(editor, selectedShape)
                giveFocusToEditor()
              }}
            >
              <MoveUpRightIcon />
            </Button>
          )}
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

        {actionGroups.map(
          (group) =>
            group.actions.length > 0 && (
              <div key={group.id} className="flex flex-wrap">
                {group.actions.map((action, actionIndex) => {
                  const button = (
                    <Button
                      key={`${action.icon}-${actionIndex}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        action.onClick(editor, selectedShape)
                        giveFocusToEditor()
                      }}
                    >
                      <LoadableIcon name={action.icon as IconName} className={action.color} />
                    </Button>
                  )

                  if (action.tooltip) {
                    return (
                      <Tooltip key={`${action.icon}-${actionIndex}`} delayDuration={300}>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent>
                          <p>{action.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return button
                })}
              </div>
            ),
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

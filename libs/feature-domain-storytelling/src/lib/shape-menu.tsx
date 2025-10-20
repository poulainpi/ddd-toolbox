import { useState } from 'react'
import { Editor, TLShape, useEditor, useValue } from 'tldraw'
import { ShapeMenu as SharedShapeMenu, MenuActionGroup } from '@ddd-toolbox/shared-canvas'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { useActors } from './states/use-actors'
import { useWorkObjects } from './states/use-work-objects'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { ActorToolUtil } from './tools/actor-tool-util'
import { CommentToolUtil } from './tools/comment-tool-util'
import { ChangeIconDialog } from './shape-menu/change-icon-dialog'

export function ShapeMenu() {
  const editor = useEditor()
  const { actors } = useActors()
  const { workObjects } = useWorkObjects()
  const [changeIconDialogOpen, setChangeIconDialogOpen] = useState(false)
  const [selectedShapeForIconChange, setSelectedShapeForIconChange] = useState<TLShape | null>(null)

  const handleArrowClick = (editor: Editor, selectedShape: TLShape) => {
    editor.selectNone()
    editor.setHintingShapes([selectedShape])
    editor.setCurrentTool('clicked-arrow')
  }

  const handleChangeIconClick = (_editor: Editor, selectedShape: TLShape) => {
    setSelectedShapeForIconChange(selectedShape)
    setChangeIconDialogOpen(true)
  }

  const handleIconSelect = (icon: string) => {
    if (selectedShapeForIconChange) {
      editor.updateShape({
        id: selectedShapeForIconChange.id,
        type: selectedShapeForIconChange.type,
        props: { icon },
      })
      setChangeIconDialogOpen(false)
      setSelectedShapeForIconChange(null)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setChangeIconDialogOpen(open)
    if (!open) {
      setSelectedShapeForIconChange(null)
    }
  }

  const onlySelectedShape = useValue('only selected shape', () => editor.getOnlySelectedShape(), [editor])
  const isActorSelected = onlySelectedShape?.type === ActorShapeUtil.type
  const isWorkObjectSelected = onlySelectedShape?.type === WorkObjectShapeUtil.type

  const availableIcons = isActorSelected ? actors : workObjects
  const shapeTypeName = isActorSelected ? 'Actor' : 'Work Object'

  const firstLineActions = [
    {
      icon: 'message-square',
      tooltip: 'Add comment',
      onClick: (editor: Editor, selectedShape: TLShape) => {
        editor.selectNone()
        editor.setCurrentTool(CommentToolUtil.id, { initiatorShapeId: selectedShape.id })
      },
    },
    {
      icon: 'arrow-right-left',
      tooltip: 'Change icon',
      onClick: handleChangeIconClick,
    },
  ]

  const actionGroups: MenuActionGroup[] = [
    {
      id: 'actors',
      actions: isWorkObjectSelected
        ? actors.map((actor) => ({
            icon: actor,
            onClick: (editor: Editor, selectedShape: TLShape) => {
              editor.selectNone()
              editor.setCurrentTool(ActorToolUtil.id, { icon: actor, initiatorShapeId: selectedShape.id })
            },
          }))
        : [],
    },
    {
      id: 'work-objects',
      actions: workObjects.map((workObject) => ({
        icon: workObject,
        onClick: (editor: Editor, selectedShape: TLShape) => {
          editor.selectNone()
          editor.setCurrentTool(WorkObjectToolUtil.id, {
            icon: workObject,
            initiatorShapeId: selectedShape.id,
          })
        },
      })),
    },
  ]

  return (
    <>
      <SharedShapeMenu
        onArrowClick={handleArrowClick}
        firstLineActions={firstLineActions}
        actionGroups={actionGroups}
        showOnShapeTypes={[ActorShapeUtil.type, WorkObjectShapeUtil.type]}
      />
      {selectedShapeForIconChange && (
        <ChangeIconDialog
          open={changeIconDialogOpen}
          onOpenChange={handleDialogOpenChange}
          icons={availableIcons}
          shapeTypeName={shapeTypeName}
          onIconSelect={handleIconSelect}
        />
      )}
    </>
  )
}

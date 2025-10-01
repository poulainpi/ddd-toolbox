import { Editor, TLShape, useEditor, useValue } from 'tldraw'
import { ShapeMenu as SharedShapeMenu, MenuActionGroup } from '@ddd-toolbox/shared-canvas'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { useActors } from './states/use-actors'
import { useWorkObjects } from './states/use-work-objects'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { ActorToolUtil } from './tools/actor-tool-util'
import { CommentToolUtil } from './tools/comment-tool-util'

export function ShapeMenu() {
  const editor = useEditor()
  const { actors } = useActors()
  const { workObjects } = useWorkObjects()

  const handleArrowClick = (editor: Editor, selectedShape: TLShape) => {
    editor.selectNone()
    editor.setHintingShapes([selectedShape])
    editor.setCurrentTool('clicked-arrow')
  }

  const onlySelectedShape = useValue('only selected shape', () => editor.getOnlySelectedShape(), [editor])
  const isWorkObjectSelected = onlySelectedShape?.type === WorkObjectShapeUtil.type

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
    {
      id: 'comments',
      actions: [
        {
          icon: 'message-square',
          tooltip: 'Add comment',
          onClick: (editor: Editor, selectedShape: TLShape) => {
            editor.selectNone()
            editor.setCurrentTool(CommentToolUtil.id, { initiatorShapeId: selectedShape.id })
          },
        },
      ],
    },
  ]

  return (
    <SharedShapeMenu
      onArrowClick={handleArrowClick}
      actionGroups={actionGroups}
      showOnShapeTypes={[ActorShapeUtil.type, WorkObjectShapeUtil.type]}
    />
  )
}

import { Editor, StateNode, track } from 'tldraw'
import { Shape, ShapesPanel } from '@ddd-toolbox/shared-canvas'
import { useWorkObjects } from '../states/use-work-objects'
import { CustomizeDomainObjectsDialog } from './customize-domain-objects-dialog'
import { useActors } from '../states/use-actors'
import { useStoryPlay } from '../states/use-story-play'
import { ActorToolUtil } from '../tools/actor-tool-util'
import { WorkObjectToolUtil } from '../tools/work-object-tool-util'
import { DomainObjectToolUtil } from '../tools/domain-object-tool-util'

interface DomainObjectShape extends Shape {
  toolId: string
}

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const { isPlaying: isStoryPlaying } = useStoryPlay()
  const actorsState = useActors()
  const workObjectsState = useWorkObjects()

  const shapeGroups = [
    {
      id: 'actors',
      shapes: actorsState.actors.map(
        (actor): DomainObjectShape => ({
          icon: actor,
          toolId: ActorToolUtil.id,
          setCurrentTool: (editor: Editor) => {
            editor.setCurrentTool(ActorToolUtil.id, { icon: actor })
          },
        }),
      ),
    },
    {
      id: 'work-objects',
      shapes: workObjectsState.workObjects.map(
        (workObject): DomainObjectShape => ({
          icon: workObject,
          toolId: WorkObjectToolUtil.id,
          setCurrentTool: (editor: Editor) => {
            editor.setCurrentTool(WorkObjectToolUtil.id, { icon: workObject })
          },
        }),
      ),
    },
  ]

  const isToolSelected = (shape: Shape, currentSelectedTool: StateNode) => {
    const domainObjectShape = shape as DomainObjectShape
    return (
      currentSelectedTool instanceof DomainObjectToolUtil &&
      currentSelectedTool.icon === domainObjectShape.icon &&
      currentSelectedTool.id === domainObjectShape.toolId
    )
  }

  return (
    <ShapesPanel
      shapeGroups={shapeGroups}
      isVisible={!isStoryPlaying}
      isToolSelected={isToolSelected}
      bottomComponent={<CustomizeDomainObjectsDialog actorsState={actorsState} workObjectsState={workObjectsState} />}
    />
  )
})

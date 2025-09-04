import { StateNode, track } from 'tldraw'
import { Shape, ShapesPanel } from '@ddd-toolbox/shared-canvas'
import { useWorkObjects } from '../states/use-work-objects'
import { CustomizeDomainObjectsDialog } from './customize-domain-objects-dialog'
import { useActors } from '../states/use-actors'
import { useStoryPlay } from '../states/use-story-play'
import { ActorToolUtil } from '../tools/actor-tool-util'
import { WorkObjectToolUtil } from '../tools/work-object-tool-util'
import { DomainObjectToolUtil } from '../tools/domain-object-tool-util'

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const { isPlaying: isStoryPlaying } = useStoryPlay()
  const actorsState = useActors()
  const workObjectsState = useWorkObjects()

  const shapeGroups = [
    {
      id: 'actors',
      shapes: actorsState.actors.map((actor) => ({ icon: actor, toolType: ActorToolUtil.id })),
    },
    {
      id: 'work-objects',
      shapes: workObjectsState.workObjects.map((workObject) => ({ icon: workObject, toolType: WorkObjectToolUtil.id })),
    },
  ]

  const isToolSelected = (shape: Shape, currentSelectedTool: StateNode) => {
    return (
      currentSelectedTool instanceof DomainObjectToolUtil &&
      currentSelectedTool.icon === shape.icon &&
      currentSelectedTool.id === shape.toolType
    )
  }

  return (
    <ShapesPanel
      shapeGroups={shapeGroups}
      isVisible={!isStoryPlaying}
      isToolSelected={isToolSelected}
      customization={<CustomizeDomainObjectsDialog actorsState={actorsState} workObjectsState={workObjectsState} />}
    />
  )
})

import { StateNode, track, useEditor, useValue } from 'tldraw'
import { Button, LoadableIcon } from '@ddd-toolbox/ui'
import { cn } from '@ddd-toolbox/util'
import { DomainObjectToolUtil } from '../tools/domain-object-tool-util'
import { useWorkObjects } from '../states/use-work-objects'
import { CustomizeDomainObjectsDialog } from './customize-domain-objects-dialog'
import { useActors } from '../states/use-actors'
import { IconName } from 'lucide-react/dynamic'
import { useStoryPlay } from '../states/use-story-play'

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const { isPlaying: isStoryPlaying } = useStoryPlay()
  const actorsState = useActors()
  const workObjectsState = useWorkObjects()
  const editor = useEditor()
  const currentSelectedTool = useValue('current tool', () => editor.getCurrentTool(), [editor])

  if (isStoryPlaying) return null

  return (
    <div className="absolute min-h-56 bg-background rounded-md shadow-md top-16 left-4 z-[300]">
      <div className="bg-muted/50 p-2 pb-11">
        <div className="divide-y flex flex-col h-full">
          <div className="grid grid-cols-2 content-start justify-items-center gap-1 pb-1">
            {actorsState.actors.map((actor) => (
              <DomainObjectButton key={actor} type="actor" icon={actor} currentSelectedTool={currentSelectedTool} />
            ))}
          </div>

          <div className="grid grid-cols-2 content-start justify-items-center gap-1 pt-1">
            {workObjectsState.workObjects.map((workObject) => (
              <DomainObjectButton
                key={workObject}
                type="work-object"
                icon={workObject}
                currentSelectedTool={currentSelectedTool}
              />
            ))}
          </div>

          <CustomizeDomainObjectsDialog actorsState={actorsState} workObjectsState={workObjectsState} />
        </div>
      </div>
    </div>
  )
})

function DomainObjectButton({
  type,
  icon,
  currentSelectedTool,
}: {
  type: 'actor' | 'work-object'
  icon: string
  currentSelectedTool?: StateNode
}) {
  const editor = useEditor()
  const isToolSelected =
    currentSelectedTool instanceof DomainObjectToolUtil &&
    currentSelectedTool.icon === icon &&
    currentSelectedTool.id === type

  return (
    <Button
      variant={isToolSelected ? undefined : 'ghost'}
      size="icon"
      className={cn('[&_svg]:size-6', ...(isToolSelected ? [] : ['text-foreground']))}
      onClick={() => {
        editor.setCurrentTool('select') // just to make change domain object tool to another domain object tool working
        editor.setCurrentTool(type, { icon })
      }}
    >
      <LoadableIcon name={icon as IconName} />
    </Button>
  )
}

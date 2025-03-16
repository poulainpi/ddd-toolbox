import { track, useEditor } from 'tldraw'
import { Button, LoadableIcon } from '@ddd-toolbox/ui'
import { cn } from '@ddd-toolbox/util'
import { DomainObjectToolUtil } from '../tools/domain-object-tool-util'
import { PlayStoryToolUtil } from '../tools/play-story-tool-util'
import { useWorkObjects } from '../states/use-work-objects'
import { CustomizeDomainObjectsDialog } from './customize-domain-objects-dialog'
import { useActors } from '../states/use-actors'
import { IconName } from 'lucide-react/dynamic'

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const editor = useEditor()
  const isStoryPlaying = editor.getCurrentTool() instanceof PlayStoryToolUtil
  const actorsState = useActors()
  const workObjectsState = useWorkObjects()

  if (isStoryPlaying) return null

  return (
    <div className="absolute min-h-56 bg-muted/50 rounded-md shadow-md top-16 left-6 p-2 pb-11 z-[300]">
      <div className="divide-y flex flex-col h-full">
        <div className="grid grid-cols-2 content-start justify-items-center gap-1 pb-1">
          {actorsState.actors.map((actor) => (
            <DomainObjectButton key={actor} type="actor" icon={actor} />
          ))}
        </div>

        <div className="grid grid-cols-2 content-start justify-items-center gap-1 pt-1">
          {workObjectsState.workObjects.map((workObject) => (
            <DomainObjectButton key={workObject} type="work-object" icon={workObject} />
          ))}
        </div>

        <CustomizeDomainObjectsDialog actorsState={actorsState} workObjectsState={workObjectsState} />
      </div>
    </div>
  )
})

function DomainObjectButton({ type, icon }: { type: 'actor' | 'work-object'; icon: string }) {
  const editor = useEditor()
  const tool = editor.getCurrentTool()
  const isToolSelected = tool instanceof DomainObjectToolUtil && tool.icon === icon && tool.id === type

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

import { track, useEditor } from 'tldraw'
import { Button } from '@ddd-toolbox/ui/lib/ui/button'
import { LoadableIcon } from '@ddd-toolbox/ui'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cn } from '@ddd-toolbox/util'
import { DomainObjectToolUtil } from '../tools/domain-object-tool-util'
import { PlayStoryToolUtil } from '../tools/play-story-tool-util'
import { useActors, useWorkObjects } from '../states/use-domain-objects'
import { CustomizeDomainObjectsDialog } from './customize-domain-objects-dialog'

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const editor = useEditor()
  const isStoryPlaying = editor.getCurrentTool() instanceof PlayStoryToolUtil
  const actors = useActors()
  const workObjects = useWorkObjects()

  if (isStoryPlaying) return null

  return (
    <div className="absolute min-h-96 bg-muted/50 rounded-md shadow-md top-16 left-6 p-2 pb-11 z-[300]">
      <div className="divide-y flex flex-col h-full">
        <div className="grid grid-cols-2 content-start justify-items-center gap-1 pb-1">
          {actors.map((actor) => (
            <DomainObjectButton key={actor} type="actor" icon={actor} />
          ))}
        </div>

        <div className="grid grid-cols-2 content-start justify-items-center gap-1 pt-1">
          {workObjects.map((workObject) => (
            <DomainObjectButton key={workObject} type="work-object" icon={workObject} />
          ))}
        </div>

        <CustomizeDomainObjectsDialog actors={actors} workObjects={workObjects} />
      </div>
    </div>
  )
})

function DomainObjectButton({ type, icon }: { type: 'actor' | 'work-object'; icon: string }) {
  const editor = useEditor()
  const tool = editor.getCurrentTool()
  const isToolSelected = tool instanceof DomainObjectToolUtil && tool.icon === icon

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
      <LoadableIcon name={icon as keyof typeof dynamicIconImports} />
    </Button>
  )
}

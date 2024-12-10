import { track, useEditor } from 'tldraw'
import { Button } from '@ddd-toolbox/ui/lib/ui/button'
import { LoadableIcon } from '@ddd-toolbox/ui'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cn } from '@ddd-toolbox/util'
import { DomainObjectToolUtil } from './tools/domain-object-tool-util'
import { PlayStoryToolUtil } from './tools/play-story-tool-util'

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const editor = useEditor()
  const isStoryPlaying = editor.getCurrentTool() instanceof PlayStoryToolUtil

  if (isStoryPlaying) return null

  return (
    <div className="absolute min-h-96 bg-background rounded-md shadow-md top-16 left-6 p-2 z-[300] divide-y">
      <div className="grid grid-cols-2 content-start justify-items-center gap-1 pb-1">
        <DomainObjectButton type="actor" icon="user" />
        <DomainObjectButton type="actor" icon="users" />
        <DomainObjectButton type="actor" icon="server" />
      </div>

      <div className="grid grid-cols-2 content-start justify-items-center gap-1 pt-1">
        <DomainObjectButton type="work-object" icon="message-circle" />
        <DomainObjectButton type="work-object" icon="phone" />
        <DomainObjectButton type="work-object" icon="file" />
        <DomainObjectButton type="work-object" icon="at-sign" />
        <DomainObjectButton type="work-object" icon="dollar-sign" />
        <DomainObjectButton type="work-object" icon="calendar" />
        <DomainObjectButton type="work-object" icon="thumbs-up" />
        <DomainObjectButton type="work-object" icon="thumbs-down" />
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

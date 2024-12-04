import { track, useEditor } from 'tldraw';
import { Button } from '@ddd-toolbox/ui/lib/ui/button';
import { LoadableIcon } from '@ddd-toolbox/ui';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { ActorToolUtil } from './tools/actor-tool-util';
import { cn } from '@ddd-toolbox/util';

export const DomainObjectsPanel = track(function DomainObjectsPanel() {
  const editor = useEditor();
  editor.getCurrentTool(); // only used to refresh child on tool change

  return (
    <div className="absolute min-h-96 bg-background rounded-md shadow-md top-16 left-6 p-2 z-[300] grid grid-cols-2 content-start justify-items-center gap-1">
      <ActorButton icon="user" />
      <ActorButton icon="server" />
    </div>
  );
});

function ActorButton({ icon }: { icon: string }) {
  const editor = useEditor();
  const tool = editor.getCurrentTool();
  const isToolSelected = tool instanceof ActorToolUtil && tool.icon === icon;

  return (
    <Button
      variant={isToolSelected ? undefined : 'ghost'}
      size="icon"
      className={cn(
        '[&_svg]:size-6',
        ...(isToolSelected ? [] : ['text-foreground'])
      )}
      onClick={() => {
        editor.setCurrentTool('select'); // just to make change actor tool to another actor tool working
        editor.setCurrentTool('actor', { icon });
      }}
    >
      <LoadableIcon name={icon as keyof typeof dynamicIconImports} />
    </Button>
  );
}

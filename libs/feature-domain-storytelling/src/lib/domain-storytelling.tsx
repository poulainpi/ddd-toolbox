import { TLComponents, Tldraw, useAtom } from 'tldraw'
import 'tldraw/tldraw.css'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { DomainObjectsPanel } from './panel/domain-objects-panel'
import { ActorToolUtil } from './tools/actor-tool-util'
import { ShapeArrows } from './shape-arrows'
import { registerSideEffects } from './shapes/side-effects'
import { ArrowShapeUtil } from './shapes/arrow-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { PlayStoryToolUtil } from './tools/play-story-tool-util'
import { PlayStoryZone } from './play-story-zone'
import { useTheme } from '@ddd-toolbox/ui/lib/ui/hooks/use-theme'

const components: TLComponents = {
  OnTheCanvas: ShapeArrows,
}

export function DomainStorytelling() {
  const storyChangedUpdater = useAtom('storyChangedUpdater', 0)
  useTheme()

  return (
    <div>
      <h1>Welcome to DomainStorytelling!</h1>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw
          shapeUtils={[ActorShapeUtil, WorkObjectShapeUtil]}
          components={components}
          tools={[ActorToolUtil, WorkObjectToolUtil, PlayStoryToolUtil]}
          onMount={(editor) => {
            // @ts-expect-error it's the only way to override the arrow shape util at the moment
            editor.shapeUtils.arrow = new ArrowShapeUtil(editor)

            registerSideEffects(editor)
          }}
          isShapeHidden={(shape, editor) => {
            return (
              editor.getCurrentToolId() === PlayStoryToolUtil.id &&
              (editor.getCurrentTool() as PlayStoryToolUtil).isHidden(shape, storyChangedUpdater)
            )
          }}
        >
          <DomainObjectsPanel />
          <PlayStoryZone storyChangedUpdater={storyChangedUpdater} />
        </Tldraw>
      </div>
    </div>
  )
}

export default DomainStorytelling

import { DefaultSizeStyle, TLComponents, Tldraw, useAtom } from 'tldraw'
import 'tldraw/tldraw.css'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { DomainObjectsPanel } from './domain-objects-panel/domain-objects-panel'
import { ActorToolUtil } from './tools/actor-tool-util'
import { registerSideEffects } from './shapes/side-effects'
import { ArrowShapeUtil } from './shapes/arrow-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { PlayStoryToolUtil } from './tools/play-story-tool-util'
import { PlayStoryZone } from './play-story-zone'
import { useTheme } from '@ddd-toolbox/ui'
import { ToolBar } from './tool-bar'
import { Menubar } from './menubar/menubar'
import { changeHappened } from './states/use-story-persistance'
import { BrowserListener } from './browser-listener'
import { ZoomPanel } from './zoom-panel'
import { ShapeMenu } from './shape-menu'
import { ClickedArrowToolUtil } from './tools/clicked-arrow-tool-util'

const components: TLComponents = {
  Toolbar: null,
  MenuPanel: null,
  NavigationPanel: null,
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
          tools={[ActorToolUtil, WorkObjectToolUtil, PlayStoryToolUtil, ClickedArrowToolUtil]}
          onMount={(editor) => {
            // @ts-expect-error it's the only way to override the arrow shape util at the moment
            editor.shapeUtils.arrow = new ArrowShapeUtil(editor)

            registerSideEffects(editor)

            editor.store.listen(() => changeHappened(), { scope: 'document' })

            editor.setStyleForNextShapes(DefaultSizeStyle, 's')
          }}
          isShapeHidden={(shape, editor) => {
            return (
              editor.getCurrentToolId() === PlayStoryToolUtil.id &&
              (editor.getCurrentTool() as PlayStoryToolUtil).isHidden(shape, storyChangedUpdater)
            )
          }}
          persistenceKey={process.env.NODE_ENV === 'development' ? 'domain-storytelling' : undefined}
        >
          <BrowserListener />
          <Menubar />
          <DomainObjectsPanel />
          <ToolBar />
          <PlayStoryZone storyChangedUpdater={storyChangedUpdater} />
          <ZoomPanel />
          <ShapeMenu />
        </Tldraw>
      </div>
    </div>
  )
}

export default DomainStorytelling

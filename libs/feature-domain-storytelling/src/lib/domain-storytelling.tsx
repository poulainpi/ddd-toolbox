import { DefaultSizeStyle, TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { DomainObjectsPanel } from './domain-objects-panel/domain-objects-panel'
import { ActorToolUtil } from './tools/actor-tool-util'
import { registerSideEffects } from './shapes/side-effects'
import { ArrowShapeUtil } from './shapes/arrow-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { useTheme } from '@ddd-toolbox/ui'
import { ToolBar } from './tool-bar'
import { Menubar } from './menubar/menubar'
import { changeHappened } from './states/use-story-persistance'
import { BrowserListener } from './browser-listener'
import { ZoomPanel } from './zoom-panel'
import { ShapeMenu } from './shape-menu'
import { ClickedArrowToolUtil } from './tools/clicked-arrow-tool-util'
import { $hiddenShapesState } from './states/use-story-play'

const components: TLComponents = {
  Toolbar: null,
  MenuPanel: null,
  NavigationPanel: null,
  StylePanel: null,
}

export function DomainStorytelling() {
  useTheme()

  return (
    <div>
      <h1>Welcome to DomainStorytelling!</h1>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw
          shapeUtils={[ActorShapeUtil, WorkObjectShapeUtil]}
          components={components}
          tools={[ActorToolUtil, WorkObjectToolUtil, ClickedArrowToolUtil]}
          onMount={(editor) => {
            // @ts-expect-error it's the only way to override the arrow shape util at the moment
            editor.shapeUtils.arrow = new ArrowShapeUtil(editor)

            registerSideEffects(editor)

            editor.store.listen(() => changeHappened(), { scope: 'document' })

            editor.setStyleForNextShapes(DefaultSizeStyle, 's')
          }}
          isShapeHidden={(shape, _editor) => {
            return $hiddenShapesState.get().has(shape.id)
          }}
          persistenceKey={process.env.NODE_ENV === 'development' ? 'domain-storytelling' : undefined}
        >
          <BrowserListener />
          <Menubar />
          <DomainObjectsPanel />
          <ToolBar />
          <ZoomPanel />
          <ShapeMenu />
        </Tldraw>
      </div>
    </div>
  )
}

export default DomainStorytelling

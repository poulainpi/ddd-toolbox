import { DefaultSizeStyle, TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { DomainObjectsPanel } from './domain-objects-panel/domain-objects-panel'
import { ActorToolUtil } from './tools/actor-tool-util'
import { registerSideEffects } from './shapes/side-effects'
import { ArrowShapeUtil } from './shapes/arrow-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'
import { useThemeSync } from '@ddd-toolbox/ui'
import { ToolBar } from './tool-bar'
import { Menubar } from './menubar/menubar'
import {
  BrowserListener,
  changeHappened,
  setDefaultUserPreferencesWhenNotExisting,
  ZoomPanel,
  loadFromUrlIfNeeded,
} from '@ddd-toolbox/shared-canvas'
import { ShapeMenu } from './shape-menu'
import { ClickedArrowToolUtil } from './tools/clicked-arrow-tool-util'
import { $hiddenShapesState } from './states/use-story-play'

const components: TLComponents = {
  InFrontOfTheCanvas: ShapeMenu,
  Toolbar: null,
  MenuPanel: null,
  NavigationPanel: null,
  StylePanel: null,
  ContextMenu: null,
}

export function DomainStorytelling() {
  useThemeSync()

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        shapeUtils={[ActorShapeUtil, WorkObjectShapeUtil]}
        components={components}
        tools={[ActorToolUtil, WorkObjectToolUtil, ClickedArrowToolUtil]}
        onMount={(editor) => {
          setDefaultUserPreferencesWhenNotExisting()

          // @ts-expect-error it's the only way to override the arrow shape util at the moment
          editor.shapeUtils.arrow = new ArrowShapeUtil(editor)

          registerSideEffects(editor)

          editor.store.listen(() => changeHappened(), { scope: 'document' })

          editor.setStyleForNextShapes(DefaultSizeStyle, 's')

          loadFromUrlIfNeeded(editor)
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
      </Tldraw>
    </div>
  )
}

export default DomainStorytelling

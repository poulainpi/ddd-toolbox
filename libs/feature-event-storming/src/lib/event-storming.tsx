import { DefaultSizeStyle, TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useThemeSync } from '@ddd-toolbox/ui'
import { ToolBar } from '@ddd-toolbox/shared-canvas'
import { Menubar } from './menubar/menubar'
import { changeHappened } from '@ddd-toolbox/shared-canvas'
import { BrowserListener } from '@ddd-toolbox/shared-canvas'
import { ZoomPanel } from '@ddd-toolbox/shared-canvas'
import { setDefaultUserPreferencesWhenNotExisting } from '@ddd-toolbox/shared-canvas'
import { StickyNotePanel } from './sticky-note-panel/sticky-note-panel'
import { StickyNoteToolUtil } from './tools/sticky-note-tool-util'
import { StickyNoteShapeUtil } from './shapes/sticky-note-shape-util'
import { ShapeMenu } from './shape-menu'

const components: TLComponents = {
  Toolbar: null,
  MenuPanel: null,
  NavigationPanel: null,
  StylePanel: null,
  ContextMenu: null,
  InFrontOfTheCanvas: ShapeMenu,
}

export function EventStorming() {
  useThemeSync()

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        shapeUtils={[StickyNoteShapeUtil]}
        components={components}
        tools={[StickyNoteToolUtil]}
        onMount={(editor) => {
          setDefaultUserPreferencesWhenNotExisting()

          editor.store.listen(() => changeHappened(), { scope: 'document' })

          editor.setStyleForNextShapes(DefaultSizeStyle, 's')
        }}
        persistenceKey={process.env.NODE_ENV === 'development' ? 'event-storming' : undefined}
      >
        <BrowserListener />
        <Menubar />
        <StickyNotePanel />
        <ToolBar />
        <ZoomPanel />
      </Tldraw>
    </div>
  )
}

export default EventStorming

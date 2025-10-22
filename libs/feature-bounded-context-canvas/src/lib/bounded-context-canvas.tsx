import { Editor, TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import './index.css'
import { useThemeSync } from '@ddd-toolbox/ui'
import {
  BrowserListener,
  OnMountListener,
  setDefaultUserPreferencesWhenNotExisting,
  ToolBar,
  ZoomPanel,
} from '@ddd-toolbox/shared-canvas'
import { Menubar } from './menubar/menubar'
import { NameSectionShapeUtil } from './shapes/name-section-shape-util'
import { PurposeSectionShapeUtil } from './shapes/purpose-section-shape-util'

const components: TLComponents = {
  Toolbar: null,
  MenuPanel: null,
  NavigationPanel: null,
  StylePanel: null,
  ContextMenu: null,
}

interface BoundedContextCanvasProps {
  licenseKey?: string
  children?: React.ReactNode
}

function preventSectionDeletion(editor: Editor) {
  editor.sideEffects.registerBeforeDeleteHandler('shape', (shape) => {
    if (shape.type === NameSectionShapeUtil.type || shape.type === PurposeSectionShapeUtil.type) {
      return false
    }
  })
}

function initializeTemplate(editor: Editor) {
  const existingShapes = editor.getCurrentPageShapes()
  const hasNameSection = existingShapes.some((shape) => shape.type === NameSectionShapeUtil.type)

  if (hasNameSection) {
    return
  }

  const startX = 100
  const startY = 100
  const spacing = 0

  editor.createShape({
    type: NameSectionShapeUtil.type,
    x: startX,
    y: startY,
    props: {
      text: '',
    },
  })

  editor.createShape({
    type: PurposeSectionShapeUtil.type,
    x: startX,
    y: startY + NameSectionShapeUtil.HEIGHT + spacing,
    props: {
      text: '',
    },
  })
}

export function BoundedContextCanvas({ licenseKey }: BoundedContextCanvasProps) {
  useThemeSync()

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        licenseKey={licenseKey}
        components={components}
        shapeUtils={[NameSectionShapeUtil, PurposeSectionShapeUtil]}
        onMount={(editor) => {
          setDefaultUserPreferencesWhenNotExisting()
          preventSectionDeletion(editor)
          initializeTemplate(editor)
        }}
        persistenceKey={process.env.NODE_ENV === 'development' ? 'bounded-context-canvas' : undefined}
      >
        <OnMountListener />
        <BrowserListener />
        <Menubar />
        <ToolBar />
        <ZoomPanel />
      </Tldraw>
    </div>
  )
}

export default BoundedContextCanvas

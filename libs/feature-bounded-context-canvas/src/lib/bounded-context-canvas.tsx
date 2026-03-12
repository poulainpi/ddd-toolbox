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
import { StrategicClassificationShapeUtil } from './shapes/strategic-classification-section-shape-util'
import { DomainRolesShapeUtil } from './shapes/domain-roles-section-shape-util'
import { AssumptionsSectionShapeUtil } from './shapes/assumptions-section-shape-util'
import { VerificationMetricsSectionShapeUtil } from './shapes/verification-metrics-section-shape-util'
import { OpenQuestionsSectionShapeUtil } from './shapes/open-questions-section-shape-util'
import { NAME_HEIGHT, SECOND_ROW_HEIGHT, BOTTOM_ROW_HEIGHT } from './constants'

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
    if (
      shape.type === NameSectionShapeUtil.type ||
      shape.type === PurposeSectionShapeUtil.type ||
      shape.type === StrategicClassificationShapeUtil.type ||
      shape.type === DomainRolesShapeUtil.type ||
      shape.type === AssumptionsSectionShapeUtil.type ||
      shape.type === VerificationMetricsSectionShapeUtil.type ||
      shape.type === OpenQuestionsSectionShapeUtil.type
    ) {
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

  editor.createShape({
    type: NameSectionShapeUtil.type,
    x: startX,
    y: startY,
    props: {
      text: '',
      height: NAME_HEIGHT,
    },
  })

  const secondRowY = startY + NAME_HEIGHT

  editor.createShape({
    type: PurposeSectionShapeUtil.type,
    x: startX,
    y: secondRowY,
    props: {
      text: '',
      height: SECOND_ROW_HEIGHT,
    },
  })

  editor.createShape({
    type: StrategicClassificationShapeUtil.type,
    x: startX + PurposeSectionShapeUtil.WIDTH,
    y: secondRowY,
    props: { height: SECOND_ROW_HEIGHT, values: {} },
  })

  editor.createShape({
    type: DomainRolesShapeUtil.type,
    x: startX + PurposeSectionShapeUtil.WIDTH + StrategicClassificationShapeUtil.WIDTH,
    y: secondRowY,
    props: { height: SECOND_ROW_HEIGHT, values: {} },
  })

  const bottomRowY = secondRowY + SECOND_ROW_HEIGHT

  editor.createShape({
    type: AssumptionsSectionShapeUtil.type,
    x: startX,
    y: bottomRowY,
    props: {
      text: '',
      height: BOTTOM_ROW_HEIGHT,
    },
  })

  editor.createShape({
    type: VerificationMetricsSectionShapeUtil.type,
    x: startX + AssumptionsSectionShapeUtil.WIDTH,
    y: bottomRowY,
    props: {
      text: '',
      height: BOTTOM_ROW_HEIGHT,
    },
  })

  editor.createShape({
    type: OpenQuestionsSectionShapeUtil.type,
    x: startX + AssumptionsSectionShapeUtil.WIDTH + VerificationMetricsSectionShapeUtil.WIDTH,
    y: bottomRowY,
    props: {
      text: '',
      height: BOTTOM_ROW_HEIGHT,
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
        shapeUtils={[
          NameSectionShapeUtil,
          PurposeSectionShapeUtil,
          StrategicClassificationShapeUtil,
          DomainRolesShapeUtil,
          AssumptionsSectionShapeUtil,
          VerificationMetricsSectionShapeUtil,
          OpenQuestionsSectionShapeUtil,
        ]}
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

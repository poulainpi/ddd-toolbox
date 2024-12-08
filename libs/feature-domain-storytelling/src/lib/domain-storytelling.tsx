import { TLComponents, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { ActorShapeUtil } from './shapes/actor-shape-util'
import { DomainObjectsPanel } from './domain-objects-panel'
import { ActorToolUtil } from './tools/actor-tool-util'
import { ShapeArrows } from './shape-arrows'
import { registerSideEffects } from './shapes/side-effects'
import { ArrowShapeUtil } from './shapes/arrow-shape-util'
import { WorkObjectShapeUtil } from './shapes/work-object-shape-util'
import { WorkObjectToolUtil } from './tools/work-object-tool-util'

const components: TLComponents = {
  OnTheCanvas: ShapeArrows,
}

export function DomainStorytelling() {
  return (
    <div>
      <h1>Welcome to DomainStorytelling!</h1>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw
          shapeUtils={[ActorShapeUtil, WorkObjectShapeUtil]}
          components={components}
          tools={[ActorToolUtil, WorkObjectToolUtil]}
          onMount={(editor) => {
            // @ts-expect-error it's the only way to override the arrow shape util at the moment
            editor.shapeUtils.arrow = new ArrowShapeUtil(editor)

            registerSideEffects(editor)
          }}
        >
          <DomainObjectsPanel />
        </Tldraw>
      </div>
    </div>
  )
}

export default DomainStorytelling

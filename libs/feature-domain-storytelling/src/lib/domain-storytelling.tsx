import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { ActorShape } from './shapes/actor-shape';
import { ShapeMenu } from './shape-menu';

export function DomainStorytelling() {
  return (
    <div>
      <h1>Welcome to DomainStorytelling!</h1>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw
          shapeUtils={[ActorShape]}
          onMount={(editor) => {
            editor.createShape({ type: 'actor-shape' });
          }}
        >
          <ShapeMenu />
        </Tldraw>
      </div>
    </div>
  );
}

export default DomainStorytelling;

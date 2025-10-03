import { createShapeId, StateNode, TLArrowShape, TLPointerEventInfo } from 'tldraw'

export class ClickedArrowToolUtil extends StateNode {
  static override id = 'clicked-arrow'

  private arrow: TLArrowShape | null = null

  override onEnter() {
    const startShape = this.editor.getHintingShape()[0]

    const arrowId = createShapeId()
    this.editor.createShape<TLArrowShape>({
      id: arrowId,
      type: 'arrow',
      x: startShape.x,
      y: startShape.y,
      props: {
        size: 's',
      },
    })

    this.arrow = this.editor.getShape(arrowId) as TLArrowShape

    const handles = this.editor.getShapeHandles(this.arrow)
    if (!handles) throw Error(`expected handles for arrow`)
    const startHandle = handles.find((h) => h.id === 'start')!
    const util = this.editor.getShapeUtil<TLArrowShape>('arrow')
    const change = util.onHandleDrag?.(this.arrow, {
      handle: { ...startHandle, x: 0, y: 0 },
      isPrecise: false,
      initial: this.arrow,
      isCreatingShape: true,
    })

    if (change) {
      this.editor.updateShapes([change])
    }
  }

  override onPointerMove() {
    if (!this.arrow) return

    this.editor.snaps.clearIndicators()
    this.editor.setHintingShapes([])

    const handles = this.editor.getShapeHandles(this.arrow)!
    const util = this.editor.getShapeUtil<TLArrowShape>('arrow')
    const point = this.editor.getPointInShapeSpace(this.arrow, this.editor.inputs.currentPagePoint)
    const endHandle = handles.find((h) => h.id === 'end')!
    const change = util.onHandleDrag?.(this.editor.getShape(this.arrow)!, {
      handle: { ...endHandle, x: point.x, y: point.y },
      isPrecise: false,
      initial: this.arrow,
      isCreatingShape: true,
    })

    if (change) {
      this.editor.updateShapes([change])
    }
  }

  override onPointerDown(_info: TLPointerEventInfo) {
    this.editor.snaps.clearIndicators()
    this.editor.setHintingShapes([])

    this.editor.setCurrentTool('select.dragging_handle', {
      shape: this.arrow,
      handle: { id: 'end', type: 'vertex', index: 'a3', x: 0, y: 0 },
      isCreating: true,
      onInteractionEnd: 'arrow',
    })

    const point = this.editor.inputs.currentPagePoint
    this.editor.dispatch({
      type: 'pointer',
      name: 'pointer_up',
      target: 'canvas',
      point: point,
    } as TLPointerEventInfo)
  }

  override onCancel() {
    if (!this.arrow) return

    const bindings = this.editor.getBindingsFromShape(this.arrow.id, 'arrow')
    const hasStartAndEndBindings = bindings.length >= 2 && bindings[0].toId != bindings[1].toId
    if (!hasStartAndEndBindings) {
      this.editor.deleteShape(this.arrow)
    }

    this.editor.setCurrentTool('select')
  }
}

import { createShapeId, StateNode, TLArrowBinding, TLArrowShape, TLPointerEventInfo, TLShapeId, Vec } from 'tldraw'

export class ClickedArrowToolUtil extends StateNode {
  static override id = 'clicked-arrow'

  override onEnter() {
    this.editor.setCursor({ type: 'cross' })
  }

  override onPointerUp(_info: TLPointerEventInfo) {
    const clickedShape = this.editor.getShapeAtPoint(this.editor.inputs.currentPagePoint)
    if (clickedShape != null) {
      const startShape = this.editor.getHintingShape()[0]

      const arrowId = this.createArrowBetweenShapes(startShape.id, clickedShape.id)
      if (arrowId != null) {
        this.editor.select(arrowId)
        this.editor.setEditingShape(arrowId)
      }
    }
    this.editor.setCurrentTool('select')
  }

  private createArrowBetweenShapes(
    startShapeId: TLShapeId,
    endShapeId: TLShapeId,
    options = {} as {
      parentId?: TLShapeId
      start?: Partial<Omit<TLArrowBinding['props'], 'terminal'>>
      end?: Partial<Omit<TLArrowBinding['props'], 'terminal'>>
    },
  ): TLShapeId | null {
    const { start = {}, end = {}, parentId } = options

    const {
      normalizedAnchor: startNormalizedAnchor = { x: 0.5, y: 0.5 },
      isExact: startIsExact = false,
      isPrecise: startIsPrecise = false,
    } = start
    const {
      normalizedAnchor: endNormalizedAnchor = { x: 0.5, y: 0.5 },
      isExact: endIsExact = false,
      isPrecise: endIsPrecise = false,
    } = end

    const startTerminalNormalizedPosition = Vec.From(startNormalizedAnchor)
    const endTerminalNormalizedPosition = Vec.From(endNormalizedAnchor)

    const parent = parentId ? this.editor.getShape(parentId) : undefined
    if (parentId && !parent) throw Error(`Parent shape with id ${parentId} not found`)

    const startShapePageBounds = this.editor.getShapePageBounds(startShapeId)
    const endShapePageBounds = this.editor.getShapePageBounds(endShapeId)

    const startShapePageRotation = this.editor.getShapePageTransform(startShapeId).rotation()
    const endShapePageRotation = this.editor.getShapePageTransform(endShapeId).rotation()

    if (!startShapePageBounds || !endShapePageBounds) return null

    const startTerminalPagePosition = Vec.Add(
      startShapePageBounds.point,
      Vec.MulV(startShapePageBounds.size, Vec.Rot(startTerminalNormalizedPosition, startShapePageRotation)),
    )
    const endTerminalPagePosition = Vec.Add(
      endShapePageBounds.point,
      Vec.MulV(startShapePageBounds.size, Vec.Rot(endTerminalNormalizedPosition, endShapePageRotation)),
    )

    const arrowPointInParentSpace = Vec.Min(startTerminalPagePosition, endTerminalPagePosition)
    if (parent) {
      arrowPointInParentSpace.setTo(this.editor.getShapePageTransform(parent.id)!.applyToPoint(arrowPointInParentSpace))
    }

    const arrowId = createShapeId()
    this.editor.run(() => {
      this.editor.markHistoryStoppingPoint('creating_arrow')
      this.editor.createShape<TLArrowShape>({
        id: arrowId,
        type: 'arrow',
        x: arrowPointInParentSpace.x,
        y: arrowPointInParentSpace.y,
        props: {
          start: {
            x: arrowPointInParentSpace.x - startTerminalPagePosition.x,
            y: arrowPointInParentSpace.x - startTerminalPagePosition.x,
          },
          end: {
            x: arrowPointInParentSpace.x - endTerminalPagePosition.x,
            y: arrowPointInParentSpace.x - endTerminalPagePosition.x,
          },
        },
      })

      this.editor.createBindings([
        {
          fromId: arrowId,
          toId: startShapeId,
          type: 'arrow',
          props: {
            terminal: 'start',
            normalizedAnchor: startNormalizedAnchor,
            isExact: startIsExact,
            isPrecise: startIsPrecise,
          },
        },
        {
          fromId: arrowId,
          toId: endShapeId,
          type: 'arrow',
          props: {
            terminal: 'end',
            normalizedAnchor: endNormalizedAnchor,
            isExact: endIsExact,
            isPrecise: endIsPrecise,
          },
        },
      ])
    })

    return arrowId
  }
}

import { createShapeId, Editor, TLArrowBinding, TLArrowShape, TLShapeId, Vec } from 'tldraw'

export interface CreateArrowOptions {
  parentId?: TLShapeId
  start?: Partial<Omit<TLArrowBinding['props'], 'terminal'>>
  end?: Partial<Omit<TLArrowBinding['props'], 'terminal'>>
  arrowProps?: Partial<TLArrowShape['props']>
}

export function createArrowBetweenShapes(
  editor: Editor,
  startShapeId: TLShapeId,
  endShapeId: TLShapeId,
  options: CreateArrowOptions = {},
): TLShapeId | null {
  const { start = {}, end = {}, parentId, arrowProps = {} } = options

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

  const parent = parentId ? editor.getShape(parentId) : undefined
  if (parentId && !parent) throw Error(`Parent shape with id ${parentId} not found`)

  const startShapePageBounds = editor.getShapePageBounds(startShapeId)
  const endShapePageBounds = editor.getShapePageBounds(endShapeId)

  const startShapePageRotation = editor.getShapePageTransform(startShapeId).rotation()
  const endShapePageRotation = editor.getShapePageTransform(endShapeId).rotation()

  if (!startShapePageBounds || !endShapePageBounds) return null

  const startTerminalPagePosition = Vec.Add(
    startShapePageBounds.point,
    Vec.MulV(startShapePageBounds.size, Vec.Rot(startTerminalNormalizedPosition, startShapePageRotation)),
  )
  const endTerminalPagePosition = Vec.Add(
    endShapePageBounds.point,
    Vec.MulV(endShapePageBounds.size, Vec.Rot(endTerminalNormalizedPosition, endShapePageRotation)),
  )

  const arrowPointInParentSpace = Vec.Min(startTerminalPagePosition, endTerminalPagePosition)
  if (parent) {
    arrowPointInParentSpace.setTo(editor.getShapePageTransform(parent.id)!.applyToPoint(arrowPointInParentSpace))
  }

  const arrowId = createShapeId()
  editor.run(() => {
    editor.markHistoryStoppingPoint('creating_arrow')
    editor.createShape<TLArrowShape>({
      id: arrowId,
      type: 'arrow',
      x: arrowPointInParentSpace.x,
      y: arrowPointInParentSpace.y,
      props: {
        start: {
          x: startTerminalPagePosition.x - arrowPointInParentSpace.x,
          y: startTerminalPagePosition.y - arrowPointInParentSpace.y,
        },
        end: {
          x: endTerminalPagePosition.x - arrowPointInParentSpace.x,
          y: endTerminalPagePosition.y - arrowPointInParentSpace.y,
        },
        ...arrowProps,
      },
    })

    editor.createBindings([
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

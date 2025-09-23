import { Editor } from 'tldraw'

export type PushDirection = 'left' | 'right' | 'top' | 'bottom'

export function pushShapesInDirection(
  editor: Editor,
  direction: PushDirection,
  options?: { padding?: number; pushSize?: number },
) {
  const selectedShapes = editor.getSelectedShapes()
  if (selectedShapes.length === 0) return

  const selectionBounds = editor.getSelectionRotatedPageBounds()
  if (!selectionBounds) return

  const selectedIds = new Set(selectedShapes.map((s) => s.id))
  const padding = options?.padding ?? 0
  const customPushSize = options?.pushSize

  const shapesToPush = editor.getCurrentPageShapes().filter((shape) => {
    if (selectedIds.has(shape.id) || shape.type === 'group') return false
    const shapeBounds = editor.getShapePageBounds(shape)
    if (!shapeBounds) return false

    switch (direction) {
      case 'left':
        return shapeBounds.x + shapeBounds.width <= selectionBounds.x
      case 'right':
        return shapeBounds.x >= selectionBounds.x + selectionBounds.width
      case 'top':
        return shapeBounds.y + shapeBounds.height <= selectionBounds.y
      case 'bottom':
        return shapeBounds.y >= selectionBounds.y + selectionBounds.height
    }
  })

  const updates = shapesToPush.map((shape) => {
    switch (direction) {
      case 'left':
        return { id: shape.id, type: shape.type, x: shape.x - (customPushSize ?? selectionBounds.width + padding) }
      case 'right':
        return { id: shape.id, type: shape.type, x: shape.x + (customPushSize ?? selectionBounds.width + padding) }
      case 'top':
        return { id: shape.id, type: shape.type, y: shape.y - (customPushSize ?? selectionBounds.height + padding) }
      case 'bottom':
        return { id: shape.id, type: shape.type, y: shape.y + (customPushSize ?? selectionBounds.height + padding) }
    }
  })

  editor.updateShapes(updates)
}

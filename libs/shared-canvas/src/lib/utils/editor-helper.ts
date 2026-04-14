import { Editor } from 'tldraw'

export function goToContent(editor: Editor) {
  const bounds = editor.getSelectionPageBounds() ?? editor.getCurrentPageBounds()
  if (!bounds) return
  editor.zoomToBounds(bounds, {
    targetZoom: Math.min(1, editor.getZoomLevel()),
  })
}
